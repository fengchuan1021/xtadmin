<template>
  <el-card class="container">


  <div style="display:flex">
    <div>
      <div>chose a role:</div>
      <el-select v-model="form.role_id" @change="showrolemenu">
        <el-option v-for="(role,key) in rolelist" :key="key" :value="role.id" :label="role.role_name">{{role.role_name}}</el-option>
      </el-select>
    </div>
    <el-divider direction="vertical" border-style="solid" style="display:block;min-height:100px;margin-left:30px;" />
    <div style="margin-left:30px">
      <div>chose menu to display:</div>
    <el-tree ref="menutree" show-checkbox :data="data" :props="defaultProps" node-key="path" :default-expand-all="true"/>
    </div>
  </div>
    <div style="margin-left:180px;margin-top:40px;">
      <el-button @click="setvisiablemenus">set visiable menus</el-button>
    </div>

  </el-card>
</template>
<script setup>
import {routes} from "../../router/index.js"
import {onMounted,reactive,ref} from "vue";
import axios from "@/utils/axios"
const data=routes[0].children
let form=reactive({role_id:null})
let rolelist=ref([])
const menutree=ref()
const searchpath=(node,path)=>{
  if (node.path==path){
    return node
  }
  if(node.children?.length){
    for(let i =0;i<node.children.length;i++){
      let tmp=searchpath(node.children[i],path)
      if (tmp) return tmp
    }
  }
  return null
}
const defaultProps = {
  children: 'children',
  label: (nodedata,node)=>{ console.log(nodedata);return nodedata.meta.title},
}
const showrolemenu=()=>{
  axios.get(`/backend/permission/admingetroledisplayedmenu?role_id=${form.role_id}`).then(ret=>{

    menutree.value.setCheckedKeys(ret.menus.filter(menu=>searchpath(routes[0],menu)?.children ? false : true))
  })
}
const handleNodeClick = (data) => {
  console.log(data)
}
const setvisiablemenus=()=>{
  console.log(form.role_id)
  let paths=menutree.value.getCheckedNodes().map(item=>item.path)
  if (paths.length==0){
    ElMessage.warning("please choose the menu to display")
  }
  else if(form.role_id==null){
    ElMessage.warning("please choose the role to set the menu displayed")
  }else{
    axios.post('/backend/permission/setdisplayedmenu',{role_id:form.role_id,menus:paths}).then(ret=>{
      if(ret.status=='success'){
        ElMessage.success("set role displayed menu success")
      }
    })
  }

}
onMounted(()=>{
  axios.get('/backend/permission/role/').then(ret=>{
    if(ret.status=='success'){
      rolelist.value=ret.roles;
    }
  })
})
</script>
