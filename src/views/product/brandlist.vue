<template>
  <BrandEdit ref="branddlg" @AddedorUpdated="getdata()"></BrandEdit>
  <el-card class="container">

    <template #header>
      <!--        顶部搜索和按钮-->
            <el-form inline ref="filterform">

              <el-form-item label="brand:">
                <el-input v-model="state.filter.brand_en__contains"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button @click="onSearch">search</el-button>
              </el-form-item>

                <el-form-item style="display:block;float:right">
                  <el-button @click="branddlg.add()">add brand</el-button>
                </el-form-item>
            </el-form>


              <!--        结束搜索和按钮-->
    </template>



    <el-table :data="data" style="width: 100%">

      <el-table-column prop="brand_id" label="brand_id"  />
      <el-table-column prop="brand_en" label="brand_en"  />
      <el-table-column prop="action">
        <template #default="scope">
          <el-button @click="onedit(scope.row)">edit</el-button>
          <el-popconfirm

              title="sure to delete？"
              @confirm="onDel(scope.row.brand_id,scope.$index)"
          >
            <template #reference>
              <el-button style="cursor: pointer;">delete</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>

    </el-table>

<!--           分页-->
        <el-pagination
            background
            layout="prev, pager, next"
            :total="state.total"
            :page-size="state.pagesize"
            :current-page="state.pagenum"
            @current-change="(newpagenum)=>{state.pagenum=newpagenum;getdata()}"
        />
<!--           结束分页-->
  </el-card>
</template>
<script setup>
import axios from '@/utils/axios'
import {onMounted, reactive,ref} from 'vue'
import BrandEdit from './brandform.vue'
const branddlg=ref()

let state=reactive({pagenum:1,pagesize:30,filter:{},total:0})
let data=ref([])
const onSearch=()=>{
  getdata()
}
const onDel=(brand_id,rowindex)=>{
  axios.post(`/backend/product/delbrand/${brand_id}`).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success("delete brand successfully")
      data.value.splice(rowindex,1)
    }
  })
}
const onedit=(row)=>{
  branddlg.value.edit(row)
}
const getdata=()=>{
  axios.post("/backend/product/brandlist",state).then(ret=>{
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
