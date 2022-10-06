<template>

  <div><h4>添加产品</h4></div>
  <el-form>
    <el-form-item label="prodduct name:">
      <el-input v-model="product.productname_en"></el-input>
    </el-form-item>

    <el-form-item label="add Specification:">
      <div class="specificationdiv">
        <div v-for="(specification,index) in product.specifications" :key="index">
          <div>specification name:
            <el-autocomplete class="specificationname"
                             v-model="specification.name"
                             clearable
                             placeholder="colour,volume,size,etc."
                             :fetch-suggestions="querySearch"
                             @select="handleSelect"
            >

              <!--        <template #suffix>-->
              <!--        <el-icon class="el-input__icon"><Close @click="removeSpecification(index)"/></el-icon>-->
              <!--      </template>-->
            </el-autocomplete>
            specification value:<el-input class="specificationvalue" v-for="(v,index2) in specification.value" :key='index2' v-model="specification.value[index2]"
            >
              <template #suffix>
                <el-icon class="el-input__icon"><Close @click="removeSpecificationValue(index,index2)"/></el-icon>
              </template>
            </el-input>
            <el-icon :size="20" color="#409EFC">
              <Plus @click="addSpecificationValue(specification)"/>
            </el-icon>
          </div>
        </div>
        <div>
          <el-button @click="addSpecification">add Specification</el-button>
        </div>
      </div>
    </el-form-item>

    <el-form-item>
      <div class="subproductdiv">
        <div v-for="(subproduct,index) in product.subproduct" :key="index" style="display:flex;">
          title:<el-input v-model="subproduct.productname_en"></el-input>
          price:<el-input v-model="subproduct.price"></el-input>
          stock:<el-input v-model="subproduct.stock"></el-input>
        </div>
      </div>
    </el-form-item>

    <el-form-item label="add variant:">
      <div style="display:flex;flex-direction:column">
        <div>
          <div v-for="(attribute,index) of product.attributes" :key="index" style="display:flex;">
            <el-input v-model="attribute.name"></el-input>: <el-input v-model="attribute.value"></el-input> <el-icon><Close @click="deleteattribute(index)"></Close></el-icon>
          </div>
        </div>
        <div>
          <el-button @click="addattribute">addattribute</el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="prodduct description:">
      <el-input v-model="product.productDescription_en"></el-input>
    </el-form-item>

    <el-button @click="saveproduct">save</el-button>
  </el-form>



</template>

<script setup>

import {onMounted, reactive, watch} from 'vue'
// eslint-disable-next-line
import axios from '@/utils/axios'
const product=reactive({"specifications":[],'name_en':'','description_en':'','brand_en':'','sku':'',stock:0,'subproduct':[],price:0,'attributes':[]})
let allspecifications=reactive([])

const calcDescartes=(array)=>{
  if (array.length < 2) return array[0] || [];

  return array.reduce((total, currentValue) => {
    let res = [];

    total.forEach(t => {
      currentValue.forEach(cv => {
        if (t instanceof Array)
          res.push([...t, cv]);
        else
          res.push([t, cv]);
      })
    })
    return res;
  })
}

watch(product.specifications,()=>{
  let arr=product.specifications.map(specification=>specification.value)
  let tmp=calcDescartes(arr)
  product.subproduct=[]
  tmp.forEach(item=>{
    let subproduct={"productname_en":product.productname_en+'-'+item,price:0,stock:0}
    product.subproduct.push(subproduct)

  })
});
const addSpecification=()=>{
  product.specifications.push({'name':"",'value':[]})
}
const deleteattribute=(index)=>{
  product.attributes.splice(index,1)
}
const getallspecifications=()=>{
  axios.get("/backend/specification").then(ret=>{
    allspecifications=ret.data
  })
}
onMounted(()=>{
  getallspecifications()
})
const querySpecification=(queryString, cb) => {

  // call callback function to return suggestions
  cb(results)
}
// eslint-disable-next-line
const removeSpecification=(index)=>{
  product.specifications.splice(index,1)
}
const addSpecificationValue=(specification)=>{
  console.log(specification)
  specification.value.push("")
  console.log(specification)
}
const removeSpecificationValue=(index,valueindex)=>{
  product.specifications[index].value.splice(valueindex,1)
}
const addattribute=()=>{
  product.attributes.push({'name':'','value':''})
}



const saveproduct=()=>{
  axios.post('/backend/product/addproduct',{product}).then(ret=>{
    console.log('product',ret)
  })
}
</script>

<style>
.specificationdiv{
  display:flex;

  flex-direction: column;
}
.specificationname{
  width:75px !important;
  display:inline-block !important;
}
.specificationvalue{
  width:75px !important;
  display:inline-block !important;
}
.subproductdiv{
  display:flex;
  flex-direction: column
}
</style>
