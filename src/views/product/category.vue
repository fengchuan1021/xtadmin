<template>
  <el-card>
    <!--        顶部搜索和按钮-->
    <template #header>

    </template>
    <!--        结束顶部搜索和按钮-->

    <!--        表格-->
    <el-table :data="data" style="width: 100%">

      <el-table-column prop="category_id" label="category_id"  />
      <el-table-column prop="category_name" label="category_name"  />
      <el-table-column prop="parent_id" label="parent_id" />
      <el-table-column prop="parent_name" label="parent_name" />
    </el-table>
    <!--        结束表格-->

    <!--       分页-->
    <el-pagination
        background
        layout="prev, pager, next"

        :page-size="state.pagesize"
        :current-page="state.pagenum"
        @current-change="(newpagenum)=>{state.pagenum=newpagenum;getdata()}"
    />
    <!--       结束分页-->
  </el-card>
</template>
<script setup>
import axios from '@/utils/axios'
const data=ref([])
let state=reactive({pagenum:1,pagesize:20,total:0,filter:{}})
const getData=()=>{
  axios.post('/backend/product/getcategorylist',state).then(ret=>{
    if(ret.status=='success'){
      data.value=ret.data

      state.total=ret.total || state.total
    }
  })
}
onMounted(()=>{
  getData()
})
</script>
<style scoped>


</style>
