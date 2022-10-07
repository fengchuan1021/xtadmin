<template>
  <AddWwarehouse ref="warehousedlg" @AddedorUpdated="getdata()"></AddWwarehouse>
  <el-card class="container">

    <template #header>
      <!--        顶部搜索和按钮-->
      <el-form inline ref="filterform">


        <el-form-item>
          <el-button @click="warehousedlg.add()">add warehouse</el-button>
        </el-form-item>

      </el-form>

      <!--        结束搜索和按钮-->
    </template>


    <el-table :data="data" style="width: 100%">

      <el-table-column prop="warehouse_id" label="warehouse_id"  />
      <el-table-column prop="warehouse_name" label="warehouse_name" />
      <el-table-column prop="action">
        <template #default="scope">

          <el-button @click="onedit(scope.row)">edit</el-button>
          <el-popconfirm

              title="sure to delete？"
              @confirm="onDelWarehouse(scope.row.warehouse_id,scope.$index)"
          >
            <template #reference>
              <el-button style="cursor: pointer;">delete</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <!--       分页-->
    <!--    <el-pagination-->
    <!--        background-->
    <!--        layout="prev, pager, next"-->
    <!--        :total="state.total"-->
    <!--        :page-size="state.pagesize"-->
    <!--        :current-page="state.pagenum"-->
    <!--        @current-change="(newpagenum)=>{state.pagenum=newpagenum;getdata()}"-->
    <!--    />-->
    <!--       结束分页-->
  </el-card>
</template>
<script setup>
import axios from '@/utils/axios'
import {onMounted, reactive,ref} from 'vue'
import AddWwarehouse from './warehouseform.vue'
const warehousedlg=ref()
let state=reactive({pagenum:1,pagesize:2,filter:{},total:0})
let data=ref([])
const onSearch=()=>{
  getdata()
}
const onDelWarehouse=(warehouse_id,rowindex)=>{
  axios.post('/backend/shop/delwarehouse',{warehouse_id}).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success("delete warehouse successfully")
      data.value.splice(rowindex,1)
    }
  })
}
const onedit=(row)=>{
  warehousedlg.value.edit(row)
}
const getdata=()=>{
  axios.post("/backend/shop/warehouselist",state).then(ret=>{
    if (ret.status=='success'){
      data.value=ret.data
      state.total=0
    }else{

    }
  })
}
onMounted(()=>{
  getdata()
})

</script>
