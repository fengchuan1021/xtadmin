<template>
  <el-dialog v-model="showdlg">
    <div>
    <div style="display:flex">
      <div class="imgcontainer" v-for="(file,index) in fileList" :key="index">

        <el-image style="width: 100px; height: 100px" :src="file.url" fit="fill" />
      </div>
    </div>
    <div>
      <el-upload
          v-model:file-list="fileList"
          :action="imghost"

          :show-file-list="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="uploadsuccess"
      >
        <el-button style="width:50px;height:50px;"><IconPlusIcon style="width:50px;height:50px;"/></el-button>
      </el-upload>
    </div>
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
}
</style>
<script setup>

import IconPlusIcon from '~icons/akar-icons/plus';
import {onMounted, reactive, watch,ref} from 'vue'
const imghost=ref('')
onMounted(()=>{
  imghost.value=import.meta.env.VITE_IMGHOST
})
const showdlg=ref(true)
const show=()=>{
  showdlg.value=true
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

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
</script>

