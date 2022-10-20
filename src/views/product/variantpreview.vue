<template>
<div style="display:flex;flex-direction:column">
  <div style="display:flex;">
    <div class="imagebox" style="display:flex;flex-direction:column">
      <div style="width:350px;height:350px;">
        <el-image ref="bigimg" :src="variantdata.image">

        </el-image>
      </div>
      <div>
        <el-image class='littleimg' @mouseenter="mouseenter(img)" :src="img.image_url" v-for="(img,index) in variantdata.Images" :key="index"></el-image>
      </div>
    </div>
    <div class="infobox" style="display:flex;flex-direction:column">
      <div class="title"><h5>{{variantdata.name}}</h5></div>
      <div class="specificationdiv" style="display:flex;flex-direction:column">
        <div v-for="(spec,spindex) in productdata.specification" :key="spindex" style="display:flex;margin-top:10px;">
          <div>{{spec.name}}:</div>
          <div v-for="(v,indexv) in spec.value" :key="indexv" class="specvalue">
            <span><i>{{v}}</i></span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div></div>
</div>

</template>
<style scoped>
.littleimg{
  width:54px;
  height:54px;
}
.specvalue{
  margin-left:10px;
  maring-top:10px;
  width:120px;
  height:43px;
  border:1px solid blue;
}
</style>
<script setup>
import {onMounted, reactive,ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from '@/utils/axios'
const router=useRouter()
const varaint_id=ref()
const productdata=ref({})
const variantdata=ref({})
const bigimig=ref()
const mouseenter=(img)=>{
  console.log('imageenter')
  bigimig.value.src=img.image_url
}
const getdata=(siteid,invaraint_id)=>{
  axios.get(`/backend/product/previewproductbyvariantid/${siteid}/${invaraint_id}`).then(ret=>{

    productdata.value=ret.data
    variantdata.value=ret.data.Variants.filter(vdata=>vdata.variant_id==varaint_id.value)[0]
  })
}

const show=(siteid,invaraint_id)=>{
  varaint_id.value=invaraint_id
  productdata.value={}
  variantdata.value={}
  getdata(siteid,invaraint_id)
}
defineExpose({
      show,
    }
)
</script>
