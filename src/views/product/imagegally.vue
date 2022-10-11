<template>
  <el-dialog v-model="showdlg">
    <div>
      <div><span>click file to chose or upload:</span></div>
    <div style="display:flex">

      <div class="imgcontainer" v-for="(file,index) in fileList" :key="index">

        <el-image class='' @click="toggleselect($event)" style="width: 100px; height: 100px" :src="file.url" fit="fill" />
        <div style="position: absolute; bottom:0;right:0;">
        <IconMagnifierIcon @click="previeeimg(file,index)"></IconMagnifierIcon>
        <IconDelete20Filled @click="handleRemove(file,index)"></IconDelete20Filled>
        </div>
      </div>
    </div>
    <div>
      <el-upload
          v-model:file-list="fileList"
          :action="imghost"

          :show-file-list="false"

          :on-success="uploadsuccess"
      >
        <el-button style="width:50px;height:50px;"><IconPlusIcon style="width:50px;height:50px;"/></el-button>
      </el-upload>
    </div>
      <div><el-button>ok</el-button></div>
    </div>

  </el-dialog>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<style scoped>
.imgcontainer{
  margin-left:10px;
  margin-top:10px;
  position:relative;
}

</style>
<style>
.selectimage{
  border:1px solid red !important;
}
</style>
<script setup>

import IconPlusIcon from '~icons/akar-icons/plus';
import {onMounted, reactive, watch,ref} from 'vue'
import IconDelete20Filled from '~icons/fluent/delete-20-filled';
import IconMagnifierIcon from '~icons/simple-line-icons/magnifier';
const imghost=ref('')
const mutilselect=ref(true)
onMounted(()=>{
  imghost.value=import.meta.env.VITE_IMGHOST
})
const showdlg=ref(true)
const show=()=>{
  showdlg.value=true
}
// const setMutilselect=(flag)=>{
//   mutilselect.value=flag
//   if(!flag){
//
//   }
// }
const onClick=(f)=>{
  f()
}
defineExpose({
      show,
    }
)
const uploadsuccess=(response,uploadFile,uploadFiles)=>{
  uploadFile.url=response.fileurl
  //fileList.value.push({name:uploadFile.name,url:response.fileurl})
  //console.log(fileList.value)
}
const fileList = ref([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const toggleselect=(e)=>{
  e.currentTarget.classList.toggle("selectimage")
}
const handleRemove = (uploadFile, index) => {
  console.log(uploadFile, uploadFiles)
}

const previeeimg = (uploadFile,index) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
</script>

