<template>
  <ImageGally ref="imagegally" :OnOkclick="ImageGallyCallback" :product_id="product_id"></ImageGally>
<el-form>
  <el-form-item label="translate to:">
  <el-select v-model="targetlang">
    <el-option v-for="lang in alllang" :label="lang" :value="lang"></el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="title">
    <el-input v-model="data['name_en']"></el-input>
  </el-form-item>
  <el-form-item :label="'title'+targetlang">
    <el-input v-model="data[`name_${targetlang}`]"></el-input>
  </el-form-item>

  <el-form-item label="brand">
    <el-input v-model="data[`brand_en`]"></el-input>
  </el-form-item>
  <el-form-item :label="'brand'+targetlang">
    <el-input v-model="data[`brand_${targetlang}`]"></el-input>
  </el-form-item>

  <el-form-item label="description:">
    <Editor ref="myeditor1" @showImageGally="showImageGally" :initvalue='editorvalue1' @setImageGallyCallback="setImageGallyCallback" :product_id="product_id"></Editor>

  </el-form-item>
  <el-form-item :label="'description'+targetlang">
    <Editor ref="myeditor2" @showImageGally="showImageGally" :initvalue='editorvalue2' @setImageGallyCallback="setImageGallyCallback" :product_id="product_id"></Editor>
  </el-form-item>
<el-form-item>
  <el-button @click="save">save</el-button>
</el-form-item>
</el-form>
</template>
<script setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import axios from '@/utils/axios'
import Editor from './myeditor.vue'
import ImageGally from './imagegally.vue'
const product_id=ref()
const myeditor1=ref()
const myeditor2=ref()
const data=ref({})
const targetlang=ref('cn')
const alllang=ref([])
const editorvalue1=ref('')
const editorvalue2=ref('')
const imagegally=ref()

const showImageGally=(flag)=>{
  console.log("whay?",flag)
  imagegally.value.show()
}
const ImageGallyCallback=ref(null)
const test=()=>{}
ImageGallyCallback.value=test;
const setImageGallyCallback=(fn)=>{
  console.log('setcallback')
  ImageGallyCallback.value=fn;
}
const getproductlangdetail=(product_id)=>{
  axios.get(`/backend/product/getproductlangall/${product_id}`).then(ret=>{
    if(ret.status=='success'){
      data.value=ret.data
      editorvalue1.value=data.value.description_en
      console.log('editor',editorvalue1.value)
      editorvalue2.value=data.value[`description_${targetlang.value}`]
      console.log('editor2',editorvalue2.value)
      //myeditor1.value.setContent(data.value.description_en)
      //myeditor2.value.setContent(data.value[`description_${targetlang.value}`])
    }
  })
}
const save=()=>{
  let keys=Object.keys(data.value).filter(item=>item.endsWith('_'+targetlang.value) || item.endsWith('_en'))
  let dic={}
  keys.forEach(key=>dic[key]=data.value[key])
  dic['description_en']=myeditor1.value.getContent()
  dic[`description_${targetlang.value}`]=myeditor2.value.getContent()
  axios.post(`/backend/product/updateproducttranslate/${product_id.value}`,dic).then(ret=>{
    if(ret.status=='success'){
      ElMessage.success("translate success")
    }else{
      ElMessage.error("translate failed")
    }
  })
}
onMounted(()=>{
  axios.get('/backend/site/getsupportlang').then(ret=>{
    if(ret.status=='success'){
      alllang.value=ret.data.filter(item=>item!='en')
    }
  })
})
const show=(inproduct_id)=>{

  product_id.value=inproduct_id
  data.value={}
  getproductlangdetail(inproduct_id)
}
defineExpose({
      show,
    }
)
</script>
