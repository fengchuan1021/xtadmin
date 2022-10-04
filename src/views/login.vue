<template>
  <div id="loginform">
    <el-form ref="loginForm" :model="formdata" :rules="formrules">
      <el-form-item label="username" prop="username">
        <el-input v-model.trim="formdata.username"></el-input>
      </el-form-item>

      <el-form-item label="password" prop="password">
        <el-input type="password" v-model.trim="formdata.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onLogin">login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import {reactive,ref} from 'vue'
import axios from '@/utils/axios'
import {localSet} from '@/utils/index'
import {useRouter} from 'vue-router'
const router=useRouter()
const formrules={
  username: [
    { required: 'true', message: 'username must not be empty', trigger: 'blur' }
  ],
      password: [
    { required: 'true', message: 'password must not be empty', trigger: 'blur' }
  ]
}
const formdata=reactive({'username':'','password':''})
const loginForm = ref(null)

const onLogin=()=>{
  loginForm.value.validate((valid) => {
    if (valid) {
      console.log(import.meta.env)
      axios.post('/frontend/user/login', {
        username: formdata.username || '',
        password: formdata.password
      }).then(ret => {
        if (ret.token){

          localSet('token', ret.token)
          if (ret.refreshtoken){

            localSet('refreshtoken', ret.refreshtoken)

          }
          router.push({'path':'/'})
        }

      },onerror=>{
        console.log('errrohappend!!')
      })
    } else {
      console.log('error submit!!')
      return false;
    }
  })
}
</script>
<style scoped>
#loginform{
  width:500px;
  height:500px;
  margin: 0 auto;
}
</style>
