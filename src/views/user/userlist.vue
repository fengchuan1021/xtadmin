<template>
<el-card>
  <!--        顶部搜索和按钮-->
  <template #header>

  </template>
  <!--        结束顶部搜索和按钮-->

  <!--        表格-->
  <el-table :data="data" style="width: 100%">

    <el-table-column prop="username" label="username"  />
    <el-table-column prop="email" label="email"  />
    <el-table-column prop="balance" label="balance" />
    <el-table-column prop="phone" label="phone" />
  </el-table>
  <!--        结束表格-->

  <!--       分页-->
  <el-pagination
      background
      layout="prev, pager, next"
      :total="state.total"
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
 axios.post('/backend/user/userlist/',state).then(ret=>{
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
