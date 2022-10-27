<template>

<el-form>
  <el-form-item label="translate to:">
  <el-select v-model="targetlang">
    <el-option v-for="lang in alllang" :label="lang" :value="lang"></el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="title">
    <el-input v-model="data['name_en']"></el-input>
  </el-form-item>
  <el-form-item :label="'title'+targetlang">
    <el-input v-model="data[`name_${targetlang}`]"></el-input>
  </el-form-item>
<el-form-item>
  <el-input v-model="data['value_en']"></el-input>
</el-form-item>
  <el-form-item :label="'value'+targetlang">
    <el-input v-model="data[`value_${targetlang}`]"></el-input>
  </el-form-item>

<el-form-item>
  <el-button @click="save">save</el-button>
</el-form-item>
</el-form>
</template>
<script setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import axios from '@/utils/axios'
import Editor from './myeditor.vue'
import ImageGally from './imagegally.vue'
const id=ref()

const data=ref({})
const targetlang=ref('cn')
const alllang=ref([])
const emit=defineEmits(['closedlg'])
const getdetail=(id)=>{
  axios.get(`/backend/product/getpreattrspecific/${id}`).then(ret=>{
    if(ret.status=='success'){
      data.value=ret.data

    }
  })
}
const save=()=>{
  let keys=Object.keys(data.value).filter(item=>item.endsWith('_'+targetlang.value) || item.endsWith('_en'))
  let dic={}
  keys.forEach(key=>dic[key]=data.value[key])

  axios.post(`/backend/product/updatepreattrspecifictranslate/${id.value}`,dic).then(ret=>{
    if(ret.status=='success'){
      emit('closedlg')
      ElMessage.success("translate success")
    }else{
      ElMessage.error("translate failed")
    }
  })
}
onMounted(()=>{
  axios.get('/backend/site/getsupportlang').then(ret=>{
    if(ret.status=='success'){
      alllang.value=ret.data.filter(item=>item!='en')
    }
  })
})
const show=(inid)=>{

  id.value=inid
  data.value={}
  getdetail(inid)
}
defineExpose({
      show,
    }
)
</script>
