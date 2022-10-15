<template>
  <el-dialog
      ref="addcategory"
      v-model="showcategorydlg"
  >
    <el-tree
        ref="categorytree"
        show-checkbox
        :data="allcategory"
        :props="{
          children: 'children',
          label: 'category_name',
        }"
        node-key="category_id"
        default-expand-all

    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>

        </span>
      </template>
    </el-tree>
    <el-button @click="onAddcategory">ok</el-button>
  </el-dialog>
  <ImageGally ref="imagegally" :OnOkclick="ImageGallyCallback" :product_id="product.product_id"></ImageGally>
  <el-card>


    <el-form>

      <el-form-item label="prodduct name:">
        <el-input v-model="product.name_en"></el-input>
      </el-form-item>
      <el-form-item label="prodduct sku:">
        <el-input v-model="product.sku"></el-input>
      </el-form-item>

      <el-form-item label="brand:">
        <el-select v-model="product.brand_id" filterable placeholder="Select a brand">
          <el-option
              v-for="item in allbrands"
              :key="item.brand_id"
              :label="item.brand_en"
              :value="item.brand_id"
          />
        </el-select>

      </el-form-item>

      <el-form-item>
        <el-select v-model="product.status">
          <el-option value="ONLINE">ONLINE</el-option>
          <el-option value="OFFLINE">OFFLINE</el-option>
          <el-option value="EDITING">EDITING</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="category:">
        <el-tag type="success" v-for="(item,k) in chosedcategory" :key="k">{{item.category_name}}</el-tag>
        <el-button  size="small" @click="showcategorydlg=true">
          + edit
        </el-button>
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
          <div v-for="(subproduct,subindex) in product.subproduct" :key="subindex" style="display:flex;flex-direction:column">
            <div style="display:flex">
              title:<el-input v-model="subproduct.name_en"></el-input>
              price:<el-input v-model="subproduct.price"></el-input>
              stock:<el-input v-model="subproduct.stock"></el-input>
              <div style='width:30px;height:30px;'> <IconCardImage style='width:30px;height:30px;' @click="addvariantimg(subproduct,subindex)"></IconCardImage></div>
            </div>

            <div class="variantimg" style="display:flex">
              <div v-for="(img,imgindex) in subproduct.imgs" :key="imgindex">
                <el-image :src="img.image_url"></el-image>
              </div>
            </div>

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
      <el-form-item>
        <div v-if="product.specifications.length">
          <div><span >product main image:</span><IconCardImage @click="addproductimg"></IconCardImage></div>
          <div v-if="product.image[0]">
            <el-image :src="product.image[0].image_url"></el-image>
          </div>

        </div>

        <div v-else>
          <div><span >product images:</span><IconCardImage @click="addproductimg"></IconCardImage></div>
          <div>
            <el-image :src="img.image_url" v-for="img in product.image"></el-image>
          </div>

        </div>


      </el-form-item>

      <el-form-item>
        <div>product video:<IconCardImage @click="addproductvideo"></IconCardImage></div>
        <div>
          <el-image :src="product.video"></el-image>
        </div>
      </el-form-item>


      <el-form-item label="prodduct description:">
      </el-form-item>

      <Editor ref="myeditor" @showImageGally="showImageGally" @setImageGallyCallback="setImageGallyCallback" :product_id="product.product_id"></Editor>

      <el-form-item>
        <el-button @click="saveproduct">save</el-button>
      </el-form-item>
    </el-form>


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
const myeditor=ref()
const product=reactive({'product_id':null, 'image':[], 'video':'' ,'category':[], "specifications":[],'name_en':'','description_en':'','brand_en':'','sku':'',stock:0,'subproduct':[],price:0,'attributes':[]})
const allbrands=ref([])
const allcategory=ref([])
const showcategorydlg=ref(false)
const categorytree=ref()
const chosedcategory=ref([])
const showImageGally=(flag)=>{
  console.log("whay?",flag)
  imagegally.value.show()
}
const onAddcategory=()=>{
  let nodes=categorytree.value.getCheckedNodes(true)
  console.log('nodes:',nodes)
  chosedcategory.value=nodes.map((i)=>{return {'category_id':i.category_id,'category_name':i.category_name}})
  product.category=chosedcategory.value.map(item=>item.category_id)

}
const addvariantimg=(subproduct,subindex)=>{
  setImageGallyCallback((imglist)=>{
    console.log('imglist:',imglist)
    console.log(imglist.map(t=>{return {'image_url':t,'image_alt':''} }))
    subproduct.imgs=subproduct.imgs.concat(imglist.map(t=>{return {'image_url':t,'image_alt':''} }))}
  );

  imagegally.value.show();
}
const addproductimg=()=>{
  setImageGallyCallback((imglist)=>{
        if(product.specifications.length){
          product.image=[{image_url:imglist[0],'image_alt':''}]
        }else{
          product.image=product.image.concat(imglist.map(t=>{return {'image_url':t,'image_alt':''} }))
        }
      }
  );
  imagegally.value.show();
}
const addproductvideo=()=>{
  setImageGallyCallback((imglist)=>{
        product.video=imglist[0]
      }
  );
  imagegally.value.show();
}
const ImageGallyCallback=ref(null)
const test=()=>{}
ImageGallyCallback.value=test;
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
    let subproduct={"name_en":product.name_en+'-'+item,price:0,stock:0,'imgs':[]}
    product.subproduct.push(subproduct)

  })
});
watch(product.brand_id,()=>{
  product.brand_en=allbrands.value.filter(item=>item.brand_id=brand_id)[0].brand_en
})
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
  axios.post('/backend/product/brandlist',{pagenum:1,pagesize:10000}).then(ret=>{
    if(ret.status=='success'){
      allbrands.value=ret.data
    }
  })
  axios.get('/backend/product/getcategorytree',{pagenum:1,pagesize:10000}).then(ret=>{
    if(ret.status=='success'){
      allcategory.value=ret.data
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
  product.description_en=myeditor.value.getContent()
  axios.post('/backend/product/addproduct',product).then(ret=>{
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
