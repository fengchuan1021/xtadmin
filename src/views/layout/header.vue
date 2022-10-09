<template>

    <div style="display:flex;align-items: center;min-height:50px;">
      <div style="order:-1;margin-left:auto;margin-right:20px;display: flex;align-items: center;">
          <span>fengchuan </span> <el-tooltip

            effect="dark"
            content="logout"
            placement="bottom"
        ><IconLogout class="logout" @click="logout"/></el-tooltip></div>
    </div>

  <el-divider />
</template>
<script setup>
import IconLogout from '~icons/carbon/logout'

import {localRemove} from "../../utils/index.js";
import store from '@/store';
import {useRouter} from 'vue-router'


const router=useRouter()
const logout=()=>{
  localRemove('token')
  store.commit('setToken','')
  router.push('/')
}
</script>
<style scoped>
.logout{
  cursor:pointer;
}
</style>
