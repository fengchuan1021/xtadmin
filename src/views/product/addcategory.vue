<template>
  <el-tree
      :data="data"
      :props="defaultProps"
      node-key="category_id"
      default-expand-all

      :render-content="renderContent"
  >
  <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button size="small" style="margin-left: 8px" @click="append(node,data)"> add child </el-button>
            <el-button size="small" style="margin-left: 8px" @click="remove(node, data)"> Delete </el-button>
          </span>
        </span>
  </template>
  </el-tree>
</template>
<script setup>
import axios from '@/utils/axios'
import {ref,reactive,onMounted} from 'vue'
const data=ref([{'id':0,label:'root',children:[]}])
const defaultProps = {
  children: 'children',
  label: 'category_name',
}
const emit=defineEmits(['close'])
const append=(node,data)=>{
    ElMessageBox.prompt('Please input category_name', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  })
      .then(({ value }) => {
        axios.post('/backend/product/addcategory',{'category_name':value,parent_id:data.category_id}).then(ret=>{
          if(ret.status=='success'){
            ElMessage.success("add category success!")
            getdata()
          }
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled',
        })
      })
}

const remove=(node,data)=>{
axios.post('/backend/product/delcategory',{category_id:data.category_id}).then(ret=>{
  if(ret.status=='success'){
    ElMessage.success("delete category success!")
    getdata()
  }
})
}
const getdata=()=>{
  axios.get('/backend/product/getcategorytree').then(ret=>{
    if (ret.status=='success'){
      data.value=ret.data
      console.log('data:',data.value)
    }
  })
}
onMounted(()=>{
  getdata()
})
</script>
