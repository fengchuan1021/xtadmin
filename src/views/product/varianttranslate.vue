<template>
<el-form>
  <el-form-item label="title:">

  </el-form-item>
</el-form>
</template>
<script setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import axios from '@/utils/axios'
const product_id=ref()
const data=ref()
const alllang=ref([])
const getproductlangdetail=(product_id)=>{
  axios.get(`/backend/product/getproductlangall/${product_id}`).then(ret=>{
    if(ret.status=='success'){
      data.value=ret.data
    }
  })
}
onMounted(()=>{
  axios.post('/backend/site/sitelist',{'pagenum':1,'pagesize':1000}).then(ret=>{
    if(ret.status=='success'){
      alllang.value=[...new Set(ret.data.map(item=>item.lang))]
    }
  })
})
const show=(inproduct_id)=>{
  product_id.value=inproduct_id
  data.value={}
  getproductlangdetail(inproduct_id)
}
defineExpose({
      show,
    }
)
</script>
