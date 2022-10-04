<template>
  <div style="display:flex;">
    <div style="width:30%">
      <div v-for="(menu,key) in routes[0].children" :key="key" >
        <Menu v-if="!menu.meta.hidden" :menudata="menu"></Menu>
      </div>
    </div>
    <div><router-view></router-view></div>
  </div>

</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {routes} from "../../router/index.js";
import Menu from "../../components/Menu.vue"
</script>
<style></style>
