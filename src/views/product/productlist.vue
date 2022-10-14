<template>
  <el-card class="container">

    <template #header>
      <!--        顶部搜索和按钮-->
      <!--      <el-form inline ref="filterform">-->

      <!--        <el-form-item label="role_name:">-->
      <!--          <el-select v-model="state.filter.role_name"></el-select>-->
      <!--        </el-form-item>-->

      <!--        <el-form-item label="api_name:">-->
      <!--          <el-input v-model="state.filter.api_name"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item>-->
      <!--          <el-button @click="onSearch">search</el-button>-->
      <!--        </el-form-item>-->

      <!--      </el-form>-->

      <!--        结束搜索和按钮-->
    </template>


    <el-table :data="data" style="width: 100%">

      <el-table-column prop="product_id" label="product_id"  />
      <el-table-column prop="name_en" label="name_en"  />
      <el-table-column prop="brand" label="brand"  />

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


let state=reactive({pagenum:1,pagesize:2,filter:{},total:0})
let data=ref([])
const onSearch=()=>{
  getdata()
}
const getdata=()=>{
  axios.post("/backend/product/productlist",state).then(ret=>{
    if (ret.status=='success'){
      data.value=ret.data
      state.total=ret.total
    }else{

    }
  })
}
onMounted(()=>{
  getdata()
})

</script>
