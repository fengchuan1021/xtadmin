<template>
  <div id="loginform">
    <el-card>
    <el-form ref="loginForm" :model="formdata" :rules="formrules">
      <el-form-item label="username" prop="username">
        <el-input v-model.trim="formdata.username"></el-input>
      </el-form-item>

      <el-form-item label="password" prop="password">
        <el-input type="password" v-model.trim="formdata.password"></el-input>
      </el-form-item>

      <div id="loginbtn">
        <el-button type="primary" @click="onLogin">login</el-button>
      </div>
    </el-form>
    </el-card>
  </div>
</template>
<script setup>
import {reactive,ref} from 'vue'
import { useStore } from 'vuex'
import axios from '@/utils/axios'
import {localSet} from '@/utils/index'
import {useRouter} from 'vue-router'
import jwt_decode from "jwt-decode";

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
const store=useStore()
const onLogin=()=>{
  loginForm.value.validate((valid) => {
    if (valid) {
      console.log(import.meta.env)
      axios.post('/frontend/user/login', {
        username: formdata.username || '',
        password: formdata.password
      }).then(ret => {
        console.log('ret:',ret)
        if (ret.token){
          axios.defaults.headers['token']=ret.token
          store.commit('setToken',ret.token)
          store.commit('setNewObj',jwt_decode(ret.token))
          console.log('decoe:',jwt_decode(ret.token))
          localSet('token', ret.token)
          if (ret.refreshtoken){

            localSet('refreshtoken', ret.refreshtoken)

          }
          router.push({'path':'/'})
        }else{
          ElMessage.warning("username or password not right")
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
  display:flex;
  justify-content: center;
  flex-direction:column;
  width:500px;
  height:600px;
  margin: 0 auto;
}
#loginbtn{
  display:flex;
  justify-content: center;
}

</style>
