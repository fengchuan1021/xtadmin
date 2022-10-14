<template>
  <el-dialog v-model="isshow">
    <el-form>
      <el-form-item label="brand name:">
        <el-input v-model="brand_data.brand_en"></el-input>
      </el-form-item>

      <el-button @click="doaddupdate">{{brand_data.brand_id ? 'edit brand' : 'add brand'}}</el-button>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {defineProps,toRefs,toRef} from "vue";
import axios from '@/utils/axios'
const isshow=ref(false)
const emit = defineEmits(['AddedorUpdated'])
let brand_data=reactive({
  brand_id:'',
  brand_en:''
}
)
const show=()=>{
  isshow.value=true

}
const hidden=()=>{
  isshow.value=false
}
const add=()=>{
  Object.assign(brand_data,{
    brand_id:'',
    brand_en:''
  })
  show();

}
const edit=(row)=>{
  Object.assign(brand_data,row)
  console.log('row:',brand_data)
  isshow.value=true

}
const doaddupdate=()=>{
  let url=brand_data.brand_id ? '/backend/product/updatebrand' : '/backend/product/addbrand'
  axios.post(url,brand_data).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success('add/edit brand success')
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
