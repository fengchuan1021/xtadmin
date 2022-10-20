<template>
<el-dialog v-model="showpreviewflag">
  <Preview ref="previewdetail"></Preview>
</el-dialog>

<el-table
    :span-method="arraySpanMethod"
    :data="data">
  <el-table-column prop="image" label="image">
    <template #default="scope">
    <el-image :src="scope.row.image"></el-image>
    </template>
  </el-table-column>
<el-table-column prop="name_en" label="variant_name:"></el-table-column>

<el-table-column prop="site_name" label="site_name:" />

  <el-table-column prop="warehouse_id" label="warehouse:" >
    <template #default="scope">
      <el-select v-model="scope.row.warehouse_id" @change="(v)=>scope.row.warehouse_name=allwarehouse.filter(item=>item.warehouse_id==scope.row.warehouse_id)[0].warehouse_name">
        <el-option v-for="(warehouse,index) in allwarehouse" :key="index" :value="warehouse.warehouse_id" :label="warehouse.warehouse_name"></el-option>
      </el-select>
    </template>
  </el-table-column>

  <el-table-column prop="qty" label="stock qty:">
    <template #default="scope">
      <el-input-number v-model="scope.row.qty"  :step="1"  />

    </template>
  </el-table-column>
  <el-table-column prop="price" label="price:">
    <template #default="scope">
        <el-input-number v-model="scope.row.price" :precision="2" :step="1"  />

    </template>
  </el-table-column>
  <el-table-column prop="status" label="on sale:">
   <template #default="scope">
    <el-switch
        active-value="ONLINE"
        inactive-value="OFFLINE"
        v-model="scope.row.status"
        :loading="false"
        :before-change="()=>togglestatus(scope.row)"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
   </template>
  </el-table-column>

  <el-table-column>
    <template #default="scope">


      <el-button @click="()=>preview(scope.row.site_id,scope.row.variant_id)">preview</el-button>
    </template>
  </el-table-column>

</el-table>

</template>
<script setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import axios from '@/utils/axios'
import Preview from './variantpreview.vue'

const showpreviewflag=ref(false)

const previewdetail=ref()

const data=ref([])
const allwarehouse=ref([])
const product_id=ref()
const getvariantsitedetail=(product_id)=>{
  axios.get(`/backend/site/getproductsitestockdetail/${product_id}`).then(ret=>{
    if (ret.status=='success'){
      data.value=ret.data

    }else{

    }
  })
}
const preview=async (siteid,variant_id)=>{
  showpreviewflag.value=true
  await nextTick()
  previewdetail.value.show(siteid,variant_id)
}


const arraySpanMethod = ({
                           row,
                           column,
                           rowIndex,
                           columnIndex,
                         }) => {
  if(columnIndex===0 || columnIndex===1 ){


    if(data.value[rowIndex].variant_id!=data.value[rowIndex-1]?.variant_id){
      let i=1;
      while(data.value[rowIndex].variant_id==data.value[rowIndex+i]?.variant_id){
        i++
      }
      return [i,1]
    }else{
      return [0,0]
    }
    }
}
const togglestatus=(row)=>{
  row['is_loading']=true
  return new Promise((resolve,reject)=>{
    axios.post('/backend/site/setvariantsitestatus',Object.assign({},row,{"status":row.status=='OFFLINE' ? 'ONLINE' : "OFFLINE",product_id:product_id.value})).then(ret=>{
        row['is_loading']=false
        if(ret.status=='success'){
          ElMessage.success('success')
          return resolve(true)
        }else{
          ElMessage.error(ret.msg)
          return reject(new Error('Error'))
        }
    })
  }
  )

}

const show=(inproduct_id)=>{
  product_id.value=inproduct_id
  data.value=[]
  getvariantsitedetail(inproduct_id)
}
onMounted(()=>{
  axios.post('/backend/site/warehouselist').then(ret=>{
    if(ret.status=='success'){
      allwarehouse.value=ret.data
    }
  })

})
defineExpose({
      show,
    }
)
</script>
