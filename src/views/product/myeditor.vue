<template>
  <editor
      api-key="2fzcnkyqpa5090lsor2cj42dxcok7cr7rtpv90kjrcp34n8v"
      :init="config"
      :initial-value="initvalue"
  />
</template>

<script setup>
import {onMounted,watch,toRef,defineProps} from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { defineEmits } from 'vue'
const emit = defineEmits()
const editorref=ref()

const prop=defineProps({
  initvalue:{type:String,required:false,default:''},

})
const initvalue=toRef(prop,'initvalue')
//const initvalue=toRefs(prop.initvalue)
//console.log('initvalue:',initvalue)
watch(initvalue,()=>{
  if(editorref.value){
    editorref.value.setContent(initvalue.value);
  }else{
    console.log('niew:',initvalue.value)
  }

})
const onimgselected=(imgurls)=>{
  console.log('imge selected!!!')
  if(imgurls.length > 0){
    for(let i=0;i<imgurls.length;i++){
      editorref.value.insertContent('<img alt="" height="42" width="42" src="' + imgurls[i] + '"/>');
      console.log('insert to tiny mce')
    }
  }
}

let config={
  menubar: false,
  plugins: "link image code",
  toolbar: 'code myCustomToolbarButton',
  setup:function(editor){
    editorref.value=editor
    editor.on('init', function (e) {
      if(initvalue.value){
        console.log('setconent:',initvalue.value)
        editor.setContent(initvalue.value)
      }
    });

    editor.ui.registry.addButton('myCustomToolbarButton', {
      icon: 'image',

      onAction: function () {
        emit("showImageGally",true)
        emit("setImageGallyCallback",onimgselected)
      }
    });
  }
}
const getContent=()=>{
  return editorref.value.getContent();
}
const setContent=(v)=>{
  editorref.value.setContent(v);
}

defineExpose({
  getContent,
  setContent
    }
)
</script>
