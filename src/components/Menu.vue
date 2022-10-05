<template>
<div>


  <el-menu-item v-if="!menudata.children" :index="menudata.path">
    {{menudata.meta.title}}
  </el-menu-item>

  <el-sub-menu v-if="menudata.children" :index="menudata.path">
    <template #title>
      <span>{{menudata.meta.title}}</span>
    </template>
    <div v-for="(menu,key) in menudata.children" :key="key">
      <Menu v-if="showsubmenu && has_menupermission(menu.path)" :menudata="menu"></Menu>

    </div>
  </el-sub-menu>

</div>
</template>
<script setup>
import {useRouter} from 'vue-router'
import { defineProps, reactive,onMounted,ref } from 'vue'
import {useStore} from "vuex";
import {has_menupermission} from "@/utils/index.js";
const showsubmenu=ref(1);
const store=useStore()
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
