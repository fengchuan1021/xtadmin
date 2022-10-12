<template>
  <div id="standalone-container">
    <div id="toolbar-container">
    <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span>
      <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
      <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
      <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
      <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
      <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
      <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span>
      <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
    </span>
      <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>
    </div>
    <div id="editor-container"></div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted,toRef } from 'vue'
import Quill from 'quill'
import axios from '@/utils/axios'
import QuillImageDropAndPaste, { ImageData } from 'quill-image-drop-and-paste'
const Delta = Quill.import('delta')
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)
export default defineComponent({
  name: 'Editor',
  props: {
    product_id: String

  },
  setup: (props,context) => {
    const quill = ref(null)
    const blobUrl = ref(null)
    const product_id=toRef(props,'product_id')
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
    const onimgselected=(imgurls)=>{
      console.log('imge selected!!!')
      if(imgurls.length > 0){
        for(let i=0;i<imgurls.length;i++){
          let index = (quill.value.getSelection() || {}).index;

          if (index === undefined || index < 0) index = quill.value.getLength();
          console.log('index',index)
          console.log('length:',quill.value.getLength())
          quill.value.insertEmbed(index, 'image', imgurls[i], 'user')
        }
      }
    }
    const imageHandler = (dataUrl, type, imageData) => {
      //const blob = imageData.toBlob()
      const file = imageData.toFile()
      const formData = new FormData()
      formData.append('file', file)
      console.log('props:',props)
      console.log('product:',product_id)
      axios.post("/backend/product/addproductimg?product_id="+product_id.value,formData).then(ret=>{
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
          toolbar:'#toolbar-container',
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


              context.emit("showImageGally",true)
              context.emit("setImageGallyCallback",onimgselected)

              console.log('clicked')
            }
          });
    })
    return {
      quill,
      image,
      blobUrl,
      product_id,
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
