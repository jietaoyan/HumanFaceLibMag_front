<template>
  <div>
    <el-dialog title="上传用户数据" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <div>
        <el-radio v-model="type" label="admin">上传管理人员</el-radio>
        <el-radio v-model="type" label="user">上传普通用户</el-radio>
      </div>
      <p></p>
      <div>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="#"
          :before-upload="fileBeforUpload"
          :on-change="fileChange"
          :file-list="fileList"
          :auto-upload="false"
          :multiple="false"
          :limit="1"
        >
          <el-button slot="trigger" type="primary">选取文件</el-button>
          <el-button
          class="upload-button"
          type="primary"
          @click="uploadExcel"
          :loading="buttonLoading"
          :disabled="buttonDisabled"
        >上传数据</el-button>
          <div slot="tip" class="el-upload__tip">上传一个用户数据文件</div>
        </el-upload>
      </div>
      
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { uploadUsersExcel } from "@/api/user";
import { showMessage } from "@/utils/index";

export default {
  name: "userExcelupload",
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      formData: new FormData(),
      type: "",
      fileList: [],
      buttonLoading: false,
      visibled: false,
      uploadFlag:false
    };
  },
  
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled, this.uploadFlag);
    },
    uploadExcel() {
      this.$confirm("数据处理需要一段时间，请耐心等待。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.buttonLoading = true;
        this.$refs.upload.submit();
        uploadUsersExcel(this.type,this.formData).then(resp => {
          this.buttonLoading = false;
          this.type = '';
          this.formData = new FormData();
          this.fileList = [];
          // console.log(resp);
          if (resp.data == 'success') {
            showMessage(this, "导入数据处理完成", "warning");
            this.uploadFlag = true;
            this.visibled = false;
          } else {
            showMessage(this, "数据导入出错，请稍后再试", "warning");
          }
        }).catch((e)=>{
          this.buttonLoading = false;
          // console.log(e);
          showMessage(this, "数据导入出错，请稍后再试", "warning");
        });
      });
    },
    fileBeforUpload(file){
      this.formData.append('file',file);
      return false;
    },
    fileChange(file,file_list){
      this.fileList = file_list;
    }
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      return this.dialogVisible;
    },
    buttonDisabled() {
      // return !(this.type );
      return !(this.type && (this.fileList && this.fileList.length));
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-button {
  margin-left: 10px;
}
</style>
