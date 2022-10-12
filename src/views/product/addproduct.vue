<template>
  <ImageGally ref="imagegally" :OnOkclick="ImageGallyCallback" :product_id="product.product_id"></ImageGally>
  <el-card>


  <el-form>

    <el-form-item label="prodduct name:">
      <el-input v-model="product.productname_en"></el-input>
    </el-form-item>

    <el-form-item label="add Specification:">
      <div class="specificationdiv">
        <div v-for="(specification,index) in product.specifications" :key="index">
          <div><IconDelete20Filled @click="removeSpecification(index)"></IconDelete20Filled>specification name:
            <el-autocomplete class="specificationname"
                             v-model="specification.name"
                             clearable
                             placeholder="colour,volume,size,etc."
                             :fetch-suggestions="(queryString, cb)=>querySpecification(queryString, cb,index,'specification')"
                             @select="(item)=>onspecificationselect(item,index)"
            >

            </el-autocomplete>
            specification value:
            <el-input class="specificationvalue" v-for="(v,index2) in specification.value" :key='index2' v-model="specification.value[index2]">
              <template #suffix>
                <IconDelete20Filled style='cursor:pointer' @click="removeSpecificationValue(index,index2)"/>
              </template>
            </el-input>
            <el-icon :size="20" color="#409EFC">
              <IconAddIcon @click="addSpecificationValue(specification)"/>
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
         <div style='width:30px;height:30px;'> <IconCardImage style='width:30px;height:30px;' @click="imagegally.show()"></IconCardImage></div>
        </div>
      </div>
    </el-form-item>

    <el-form-item label="add variant:">
      <div style="display:flex;flex-direction:column">
        <div>
          <div v-for="(attribute,index) of product.attributes" :key="index" style="display:flex;">

            <el-autocomplete class="attributenname"
                             v-model="attribute.name"

                             placeholder="attribute"
                             :fetch-suggestions="(queryString, cb)=>querySpecification(queryString, cb,index,'attribute')"
                             @select="(item)=>onattributeselect(item,index)"
            >

            </el-autocomplete>

            :
            <el-autocomplete
                v-model="attribute.value"
                :fetch-suggestions="(a,b)=>attributetip(a,b,index)"

                class="inline-input w-50"
                placeholder="Please Input"
            />
           <IconDelete20Filled @click="deleteattribute(index)"></IconDelete20Filled>
          </div>
        </div>
        <div>
          <el-button @click="addattribute">addattribute</el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="prodduct description:">
    </el-form-item>


  </el-form>
    <el-form>
      <Editor id="myeditor" @showImageGally="showImageGally" @setImageGallyCallback="setImageGallyCallback" :product_id="product.product_id"></Editor>
    </el-form>
    <el-form-item>
      <el-button @click="saveproduct">save</el-button>
    </el-form-item>
  </el-card>
</template>

<script setup>

import {onMounted, reactive, watch,ref} from 'vue'
import IconDelete20Filled from '~icons/fluent/delete-20-filled';
import IconAddIcon from '~icons/carbon/add';
import IconCardImage from '~icons/bi/card-image';
import ImageGally from './imagegally.vue'
import axios from '@/utils/axios'
import Editor from './myeditor.vue'
const imagegally=ref()
const product=reactive({'product_id':null,  "specifications":[],'name_en':'','description_en':'','brand_en':'','sku':'',stock:0,'subproduct':[],price:0,'attributes':[]})
const showImageGally=(flag)=>{
  console.log("whay?",flag)
  imagegally.value.show()
}
const ImageGallyCallback=ref(null)
const ttt=()=>{
  console.log("heeare")
}
ImageGallyCallback.value=ttt;
const setImageGallyCallback=(fn)=>{
  console.log('setcallback')
  ImageGallyCallback.value=fn;
}

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

onMounted(()=>{
  axios.get('/backend/product/prefetchproductid').then(ret=>{
    if(ret.status=='success'){
      product.product_id=ret.product_id
    }
  })
})

// eslint-disable-next-line
const removeSpecification=(index)=>{
  product.specifications.splice(index,1)
}
const attributetip=(queryString, cb,index)=>{
  let values=Object.values(product.attributes[index]['choseablevalue'])
  let tmpvalue=values.filter(item=>item.toLowerCase().indexOf(queryString.toLowerCase())!=-1).map(s=>{return {'value':s}})
  cb(tmpvalue)
}
const querySpecification=(queryString, cb,index,type)=>{
  axios.post(`/backend/product/preattrspecific`,{pagesize:200,filter:{name_en__contains:queryString,type:type}}).then(ret=>{
    if(ret.status=='success'){
      let values=ret.data.map(item=>{
        let tmp={}
        tmp['value']=item.name_en
        tmp['values']=item.value_en.split(',')
        return tmp
      })
      cb(values)
    }
  })
}

const onspecificationselect=(item,index)=>{
  product.specifications[index]['value']=item.values
}
const onattributeselect=(item,index)=>{
  product.attributes[index]['choseablevalue']=item.values
}
const addSpecificationValue=(specification)=>{
  specification.value.push("")
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
