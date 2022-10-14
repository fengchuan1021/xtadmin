<template>
  <el-dialog v-model="addform.showflag">
    <el-form :model="addform.data" :rules="addform.rules" ref="addformref">
      <el-form-item label="role name:"  prop="role_name">
        <el-input v-model="addform.data.role_name"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button @click="onAddrole">add role</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-card class="container">
    <template #header>
    <el-form inline>
      <el-form-item>
        <el-button @click="addform.showflag=1">add role</el-button>
      </el-form-item>
    </el-form>
    </template>

  <el-table :data="roles" style="width: 100%">
    <el-table-column prop="id" label="id" width="180" />
    <el-table-column prop="role_name" label="role_name" width="180" />
    <el-table-column
        label="action"
    >
      <template #default="scope">

        <el-popconfirm

            title="sure to delete？"
            @confirm="onDelRole(scope.row.id,scope.row.role_name,scope.$index)"
        >
          <template #reference>
            <el-button style="cursor: pointer;">delete</el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>
  </el-table>
  </el-card>
</template>
<script setup>
import axios from '@/utils/axios'
import {onMounted, reactive,ref} from 'vue'
const roles=ref([])
const addformref=ref()
const checknotnumber=(rule,value,callback)=>{
 //let value=addform.data.role_name
  if (! value) {
    callback(new Error('Please input the role_name again'))
  } else if (value[0].toLowerCase()<'a' || value[0].toLowerCase()>'z') {
    callback(new Error("role_name must start with string!"))
  } else {
    callback()
  }
}
let addform=reactive({showflag:false,data:{role_name:''},rules:{'role_name':[{validator:checknotnumber, trigger: 'blur'}]}})
const onAddrole=()=>{
   addformref.value.validate((valid)=>{
    if(valid){
      axios.post('/backend/permission/role/',addform.data).then(ret=>{
        if(ret.status=='success'){
          roles.value.splice(0,0,{'id':ret.role.id,role_name:addform.data.role_name})
          addform.showflag=false;
          ElMessage.success("add role success");
        }
      })
    }
  })

}
const onDelRole=(id,name,index)=>{
  axios.delete(`/backend/permission/role/${id}`).then(ret=>{
    if(ret.status=='success'){
      roles.value.splice(index,1)
      ElMessage.success("delete success")
    }
  })
}
onMounted(()=>{
  axios.get("/backend/permission/role/").then(ret=>{
    if (ret.status=='success'){
      roles.value=ret.roles;
    }else{

    }
  })
})

</script>
