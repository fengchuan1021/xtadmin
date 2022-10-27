<template>
  <el-dialog v-model="showtranslateflag">
    <Translate ref="translatedetail" @closedlg="showtranslateflag=false"></Translate>
  </el-dialog>
  <el-dialog v-model="showdlg">
    <el-form>
      <el-form-item label="name:">
        <el-input v-model="form.name_en"></el-input>
      </el-form-item>

      <el-form-item label="value:">
        <el-input v-model="form.value_en"></el-input>
      </el-form-item>

      <el-form-item label="type:">
        <el-select v-model="form.type">
          <el-option value='specification'>specification</el-option>
          <el-option value='attribute'>attribute</el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="singleselect:">
        <el-select v-model="form.singlefield">
          <el-option value='1' label="yes">yes</el-option>
          <el-option value='0' label="no">no</el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-button @click="submitform">create</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-card class="container">

    <template #header>
      <!--        顶部搜索和按钮-->
      <el-form inline ref="filterform">

        <el-form-item label="name:">
          <el-input v-model="state.filter.name_en__contains" clearable @clear="() => { state.filter.name_en=null } "></el-input>
        </el-form-item>
        <el-form-item label="type:">
          <el-select v-model="state.filter.type"  clearable @clear="() => { state.filter.type=null }" >
            <el-option value="specification"></el-option>
            <el-option value="attribute"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearch">search</el-button>
        </el-form-item>
        <el-form-item style="display:block;float:right">
          <el-button @click="add()">add predefine attr/spec</el-button>
        </el-form-item>
      </el-form>

      <!--        结束搜索和按钮-->
    </template>


    <el-table :data="data" style="width: 100%">

      <el-table-column prop="name_en" label="name_en"  />
      <el-table-column prop="name_cn" label="name_cn"  />
      <el-table-column prop="value_en" label="value_en" />
      <el-table-column prop="value_cn" label="value_cn" />
      <el-table-column prop="type" label="type" />
      <el-table-column prop="singlefield" label="singleselect" />

      <el-table-column label="action">
        <template #default="scope">
          <el-button @click="edit(scope.row)">edit</el-button>
          <el-button @click="translate(scope.row.preattrspecific_id)">translate</el-button>
          <el-button @click="delteattrspec(scope.row.preattrspecific_id)">delete</el-button>

        </template>

      </el-table-column>
    </el-table>

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
import {nextTick, onMounted, reactive, ref} from 'vue'
import Translate from './attrspecifictranslate.vue'
const translatedetail=ref()
const showdlg=ref(false)
const showtranslateflag=ref(false)
let state=reactive({pagenum:1,pagesize:20,filter:{},total:0})
let data=ref([])

let form=ref({})
// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }
const submitform=()=>{
  axios.post('/backend/product/addpreattrspecific',form.value).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success('create predefine attr/specification successfully')
      showdlg.value=false
      getdata()
    }
  })
}
const translate=async (id)=>{
  showtranslateflag.value=true
  await nextTick()
  translatedetail.value.show(id)
}
const onSearch=()=>{
  getdata()
}
const edit=(row)=>{
  form.value=row
  showdlg.value=true
}
const add=()=>{
  form.value={}

  showdlg.value=true
}
const delteattrspec=(id)=>{
  axios.post(`/backend/product/delpreattrspecific/${id}`).then(ret=>{
    if(ret.status == 'success'){

      ElMessage.success('delete successfully')
      getdata()
    }
  })
}

// const showaddrolepermission=()=>{
//   rolepermissionflg.value=true
//
// }


const getdata=()=>{
  axios.post("/backend/product/preattrspecific",state).then(ret=>{
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
