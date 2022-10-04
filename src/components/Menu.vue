<template>
<div>
  <div @click="menuclick(menudata)">{{menudata.meta.title}}</div>

    <div v-for="(menu,key) in menudata.children" :key="key">
      <Menu v-if="!menu.meta.hidden && showsubmenu" :menudata="menu"></Menu>

  </div>
</div>
</template>
<script setup>
import {useRouter} from 'vue-router'
import { defineProps, reactive,onMounted,ref } from 'vue'
const showsubmenu=ref(1);
const props=defineProps({
   menudata: Object,
   showchildren:{type:Boolean,required:false,default:true},
})
const router=useRouter()
const menuclick=(menu)=>{
  if(menu.children){
    showsubmenu.value=showsubmenu.value^1
  }else{
    router.push({path:menu.path})
  }
}
onMounted(()=>{
  showsubmenu.value=props.showchildren
})
</script>
