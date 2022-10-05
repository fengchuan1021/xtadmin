<template>
  <div style="display:flex;">
    <div style="flex:1">
      <el-menu
          default-active="2"
          :router="true"
      >
      <div v-for="(menu,key) in routes[0].children" :key="key" >
        <Menu v-if="!menu.meta.hidden && has_menupermission(menu.path)" :menudata="menu"></Menu>
      </div>
      </el-menu>
    </div>
    <div style="width: 80%"><router-view></router-view></div>
  </div>

</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {routes} from "../../router/index.js";
import Menu from "../../components/Menu.vue"
import {useStore} from "vuex";
import {localGet,has_menupermission} from "../../utils/index.js";
import jwt_decode from "jwt-decode";
import axios from '@/utils/axios'
const store=useStore()

onMounted(()=>{
  let token=localGet('token')
  store.commit('setNewObj',jwt_decode(token))

  axios.get('/backend/permission/getroledisplayedmenu').then(ret=>{
    if(ret.status=='success'){
      store.commit('setAllowMenus',ret.menus)
      console.log(store.state.allowmenus)
    }
  })
})
</script>
<style></style>
