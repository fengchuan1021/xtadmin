<template>
  <editor
      api-key="2fzcnkyqpa5090lsor2cj42dxcok7cr7rtpv90kjrcp34n8v"
      :init="config"
  />
</template>

<script setup>
import {onMounted} from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { defineEmits } from 'vue'
const emit = defineEmits()
const editorref=ref()
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
    editor.ui.registry.addButton('myCustomToolbarButton', {
      icon: 'image',

      onAction: function () {
        emit("showImageGally",true)
        emit("setImageGallyCallback",onimgselected)
      }
    });
  }
}
onMounted(()=>{
  // tinymce.init({
  //   selector: '#mytextarea'
  // });
})
</script>
