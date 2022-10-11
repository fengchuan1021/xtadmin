<template>
  <div>
    <h1>Vue Example</h1>
    <div id="editor-container"></div>

    <div>
      <h4>Preview image from BLOB URL:</h4>
      <img v-if="blobUrl" :src="blobUrl" alt="preview blob" />
    </div>

    <hr />

    <div>
      <h4>Get file infomation from File Object:</h4>
      <div v-if="image.file">
        <b>name:</b> <span>{{image.file.name}}</span> <br />
        <b>size:</b> <span>{{image.file.size}}</span> <br />
        <b>type:</b> <span>{{image.file.type}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import Quill from 'quill'
import axios from '@/utils/axios'
import QuillImageDropAndPaste, { ImageData } from 'quill-image-drop-and-paste'
const Delta = Quill.import('delta')
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)
export default defineComponent({
  name: 'Editor',
  setup: (props,context) => {
    const quill = ref(null)
    const blobUrl = ref(null)
   //const imghost=ref('')
    const image = reactive({
      type: '', // image's mimeType
      dataUrl: null, // image's base64 string
      blob: null, // image's BLOB object
      file: null, // image's File object
    })
    const isUrl = (str) => {
      try {
        return Boolean(new URL(str))
      } catch (e) {
        return false
      }
    }
    const imageHandler = (dataUrl, type, imageData) => {
      //const blob = imageData.toBlob()
      const file = imageData.toFile()
      const formData = new FormData()
      formData.append('file', file)
      axios.post('/uploadimg',formData).then(ret=>{
        if(ret.status=='success'){
          let index = (quill.value.getSelection() || {}).index;
          if (index === undefined || index < 0) index = quill.value.getLength();
          quill.value.insertEmbed(index, 'image', ret.fileurl, 'user')
        }
      })
    }
    const textPasteHander = (text) => {
      return isUrl(text)
          ? new Delta().insert(text, { link: text })
          : new Delta().insert(text)
    }
    onMounted(() => {


        //imghost.value=import.meta.env.VITE_IMGHOST

      quill.value = new Quill('#editor-container', {
        modules: {
          toolbar: [['bold', 'italic'], ['link', 'image']],
          imageDropAndPaste: {
            handler: imageHandler
          },
          clipboard: {
            matchers: [
              // your custom paste handler
              [Node.TEXT_NODE, (node, delta) => textPasteHander(node.data, delta)],
            ]
          }
        },
        placeholder: 'Copy & paste, or drag an image here...',
        readOnly: false,
        theme: 'snow'
      })
      quill.value
          .getModule('toolbar')
          .addHandler('image', function (clicked) {
            if (clicked) {

              console.log('props:',props)
              context.emit("showImageGally",true)
              console.log('clicked')
            }
          });
    })
    return {
      quill,
      image,
      blobUrl,
    }
  },
})
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style>
@import '../../../node_modules/quill/dist/quill.snow.css';
#editor-container {
  height: 320px;
}
</style>
