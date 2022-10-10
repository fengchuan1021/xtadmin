import axios from 'axios'


import { localGet,localRemove } from './index'
import store from '@/store'
import router from '@/router'


axios.defaults.baseURL =import.meta.env.VITE_BASE_URL

// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(res => {
    //console.log('111:',res)
    return res.data

},ret=>{
    if(ret.name && ret.name=='CanceledError'){
        return Promise.resolve({'status':'failed','msg':"token expired"})
    }
   ElMessage(ret.response.data.msg ? ret.response.data.msg : ret.response.data.status)
   return Promise.reject(ret.response.data)

})
axios.interceptors.request.use(
    config => {
        if(store.getters.exp<Date.now() && router.currentRoute.value.path!='/login'){
            localRemove('token')
            config.headers['token']=''
            store.commit("setToken",'')
            const controller = new AbortController();
            const cfg = {
                ...config,
                signal: controller.signal,
            };
            controller.abort('We gotta cancel this');
            router.push('/login')
            return cfg
        }else{
            return config
        }

    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)
export default axios
