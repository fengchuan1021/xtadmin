<template>
  <el-dialog v-model="warehouseform.show">
    <el-form>
      <el-form-item label="warehouse name:">
        <el-input v-model="warehouseform.warehouse_name"></el-input>
      </el-form-item>
      <el-form-item label="warehouse mark:">
        <el-input v-model="warehouseform.warehouse_mark"></el-input>
      </el-form-item>
      <el-button @click="doaddwarehouse">add warehouse</el-button>
    </el-form>
  </el-dialog>
  <el-card>
    <el-form>
      <el-form-item label="shopname:">
        <el-input v-model="form.shop_name"></el-input>
      </el-form-item>
      <el-form-item label="binded warehouse:">
        <el-select v-model="form.warehouse_id">
          <el-option v-for="(warehouse,index) in warehouses" :key="index" :value="warehouse.warehouse_id" :label="warehouse.warehouse_name"></el-option>
        </el-select>
        <el-button @click="warehouseform.show=1">add new warehouse</el-button>
      </el-form-item>
      <el-button @click="onAddshop">add shop</el-button>
    </el-form>
  </el-card>
</template>
<script setup>
import axios from '@/utils/axios'
import {ref,reactive,onMounted,watch} from 'vue'
const warehouses=ref([])
let form=reactive({shop_name:'',warehouse_id:'',warehouse_name:''})

watch(()=>form.warehouse_id,()=>{
  for(let i=0;i<warehouses.value.length;i++){

    if (warehouses.value[i].warehouse_id==form.warehouse_id){
      form.warehouse_name=warehouses.value[i].warehouse_name
      break
    }
  }
})

let warehouseform=reactive({show:false,warehouse_name:'',warehouse_mark:''})
const onAddshop=()=>{
  axios.post('/backend/shop/addshop',form).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success('添加商店成功')
    }
  })
}
const doaddwarehouse=()=>{
  axios.post('/backend/shop/addwarehouse',warehouseform).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success('add warehouse success')
      warehouseform.show=false
      getwarehoseList()
    }
  })
}
const getwarehoseList=()=>{
  axios.post('/backend/shop/warehouselist').then(ret=>{
    warehouses.value=ret.data
  })
}
onMounted(()=>{
  getwarehoseList()
})
</script>
