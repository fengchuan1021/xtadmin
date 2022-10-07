<template>
  <el-dialog v-model="isshow">
    <el-form>
      <el-form-item label="warehouse name:">
        <el-input v-model="warehouse_data.warehouse_name"></el-input>
      </el-form-item>
      <el-form-item label="warehouse mark:">
        <el-input v-model="warehouse_data.warehouse_mark"></el-input>
      </el-form-item>
      <el-button @click="doaddupdatewarehouse">{{warehouse_data.warehouse_id ? 'edit warehouse' : 'add warehouse'}}</el-button>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {defineProps,toRefs,toRef} from "vue";
import axios from '@/utils/axios'
const isshow=ref(false)
const emit = defineEmits(['AddedorUpdated'])
let warehouse_data=reactive({
  warehouse_id:'',
  warehouse_name:'',
  warehouse_mark:''}
)
const show=()=>{
  isshow.value=true

}
const hidden=()=>{
  isshow.value=false
}
const add=()=>{
  Object.assign(warehouse_data,{
    warehouse_id:'',
    warehouse_name:'',
    warehouse_mark:''})
  show();

}
const edit=(row)=>{
  Object.assign(warehouse_data,row)
  console.log('row:',warehouse_data)
  isshow.value=true

}
const doaddupdatewarehouse=()=>{
  let url=warehouse_data.warehouse_id ? '/backend/shop/editwarehouse' : '/backend/shop/addwarehouse'
  axios.post(url,warehouse_data).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success('add warehouse success')
      hidden()
      emit('AddedorUpdated')
    }
  })
}

const props=defineProps({
})


defineExpose({
  show,
  add,
  edit
    }
)

</script>
