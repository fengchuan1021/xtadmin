<template>
  <el-dialog v-model="showdetailflag">
    <VariantSitedetail ref="variantdetail"></VariantSitedetail>
  </el-dialog>
  <el-dialog v-model="showtranslateflag">
    <Translate ref="translatedetail"></Translate>
  </el-dialog>
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
<!--      <el-table-column type="expand">-->
<!--        <template #default="scope">-->
<!--          <el-table :data="scope.row.detaildata">-->
<!--            <el-table-column prop="name_en" label="name_en"></el-table-column>-->
<!--            <el-table-column prop="ensite" label="ensite"></el-table-column>-->

<!--          </el-table>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="product_id" label="product_id"  />
      <el-table-column prop="name_en" label="name_en"  />
      <el-table-column prop="brand" label="brand"  />
      <el-table-column prop="brand" label=""  >
        <template #default="scope">
          <el-button @click="detail(scope.row.product_id)">detail</el-button>
          <el-button @click="translate(scope.row.product_id)">translate</el-button>
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
import {onMounted, reactive,ref,nextTick} from 'vue'
import VariantSitedetail from './variantsitepricedetail.vue'
import Translate from './varianttranslate.vue'
const variantdetail=ref()
const showdetailflag=ref(false)
const showtranslateflag=ref(false)
const translatedetail=ref()
let state=reactive({pagenum:1,pagesize:2,filter:{},total:0})
let data=ref([])
const onSearch=()=>{
  getdata()
}

const translate=async (product_id)=>{
  showtranslateflag.value=true
  await nextTick()
  translatedetail.value.show(product_id)
}

const detail=async (product_id)=>{
  showdetailflag.value=true
  await nextTick()
  variantdetail.value.show(product_id)
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
