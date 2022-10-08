<template>
  <el-dialog v-model="rolepermissionflg">
    <div style="display:flex;">
    <div>
      <div>chose a role:</div>
      <el-select v-model="form.role_id">
        <el-option v-for="(role,key) in roles" :key="key" :value="role.id" :label="role.role_name">{{role.role_name}}</el-option>
      </el-select>
    </div>
    <el-divider direction="vertical" border-style="solid" style="display:block;min-height:100px;margin-left:30px;" />
    <div style="margin-left:30px">
      <div>chose api the role can access:</div>
      <el-tree ref="apitree" show-checkbox :data="apilist" node-key="key" />
    </div>
    </div>
    <div style="margin-left:180px;margin-top:40px;">
      <el-button @click="setrolepermission">set role permisssion</el-button>
    </div>
  </el-dialog>
  <el-card class="container">

    <template #header>
  <!--        顶部搜索和按钮-->
  <el-form inline ref="filterform">

  <el-form-item label="role_name:">
    <el-select v-model="state.filter.role_id">
      <el-option v-for="(role,index) in roles" :label="role.role_name" :value="role.id"></el-option>
    </el-select>
  </el-form-item>

    <el-form-item label="api_name:">
      <el-input v-model="state.filter.api_name"></el-input>
    </el-form-item>
<el-form-item>
  <el-button @click="onSearch">search</el-button>
</el-form-item>
    <el-form-item style="display:block;float:right">
      <el-button @click="showaddrolepermission">add role's permission</el-button>
    </el-form-item>
  </el-form>

  <!--        结束搜索和按钮-->
  </template>


  <el-table :data="data" style="width: 100%">

    <el-table-column prop="role_id" label="role_id"  />
    <el-table-column prop="role_name" label="role_name"  />
    <el-table-column prop="api_name" label="api_name" />
  </el-table>

    <!--       分页-->
    <el-pagination
        background
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pagesize"
        :current-page="state.pagenum"
        @current-change="(newpagenum)=>{state.pagenum=newpagenum;getdata()}"
    />
    <!--       结束分页-->
  </el-card>
</template>
<script setup>
import axios from '@/utils/axios'
import {onMounted, reactive,ref} from 'vue'

const rolepermissionflg=ref(false)

let state=reactive({pagenum:1,pagesize:2,filter:{role_id:null,api_name:''},total:0})
let data=ref([])
const roles=ref([])
const apilist=ref([])
const apitree=ref()
let form=reactive({role_id:1})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const onSearch=()=>{
  getdata()
}
const showaddrolepermission=()=>{
  rolepermissionflg.value=true
}
const setrolepermission=()=>{
  //let paths=apitree.value.getCheckedNodes(true).map(item=>item.label)
  let paths=apitree.value.getCheckedKeys(true)
  axios.post('/backend/permission/setrolepermission',{role_id:form.role_id,apis:paths}).then(ret=>{
    if(ret.status =='success'){
      ElMessage.success("set role permission successfully")
    }
  })

}
const getdata=()=>{
  axios.post("/backend/permission/permissionlist",state).then(ret=>{
    if (ret.status=='success'){
      data.value=ret.data
      state.total=ret.total
    }else{

    }
  })
}
const getroles=()=>{
  axios.get("/backend/permission/role/").then(ret=>{
    if (ret.status=='success'){
      roles.value=ret.roles;
    }else{

    }
  })
}
const getapilist=()=>{
  axios.get('/backend/permission/route/').then(ret=>{

     apilist.value=[ret]
    console.log('apilist:',apilist)


  })
}
onMounted(()=>{
  getdata()
  getroles()
  getapilist()
})

</script>
