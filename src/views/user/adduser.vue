<template>
<el-card>
  <el-form ref="addformref" :model="form" :rules="rules">
     <el-form-item label="username:" prop="username">
       <el-input v-model="form.username"></el-input>
     </el-form-item>
    <el-form-item label="password:" prop="password">
       <el-input v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item label="phone:" prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item label="email:" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>

    <el-form-item label="role:" prop="role">
      <el-checkbox-group v-model="tmprole">
        <el-checkbox  v-for="(role,index) in rolelist" :key="role.id" :label="role.id" >{{role.role_name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <div id="adduserdiv">
      <el-button @click="onadduser">add user</el-button>
    </div>

  </el-form>
</el-card>
</template>
<script setup>
import {onMounted,ref,reactive,watch} from "vue";
import axios from '@/utils/axios'
const addformref=ref()
const form=reactive({userrole:0})
const rules={username:[{required:true,message:'must not empty'}],
  password:[{required:true,message:'must not empty'}],
}
const rolelist=ref([])
const tmprole=ref([])
watch(tmprole,()=>{

  form.userrole=tmprole.value.reduce((a,b)=> a+b,0)


})
const onadduser=()=>{
  addformref.value.validate((valid) => {
    if(valid){
      axios.post('/backend/user/createuser',form).then(ret=>{
        if(ret.status=='success'){
          ElMessage.success('add user success')
        }else{
          ElMessage.error(ret.msg)
        }
      })
    }else{

    }
  })
}
onMounted(()=>{
  axios.get('/backend/permission/role/').then(ret=>{
    if(ret.status=='success'){
      rolelist.value=ret.roles;
    }
  })
})
</script>
<style scoped>

</style>
