<template>
  <div>
    <el-dialog title="上传人脸数据" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
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
          <div slot="tip" class="el-upload__tip">上传一个人脸数据文件。</div>
        </el-upload>
      </div>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { uploadUsersFaces2Project } from "@/api/projects";
import { uploadUsersFaces2Group } from "@/api/groups";
import { showMessage } from "@/utils/index";

export default {
  name: "faceExcelupload",
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    //上传类型，默认0为上传到项目，1为上传到组
    uploadType: {
      type: Number,
      required: true,
      default: 0
    },
    projectid: {
      type: String,
      required: true
    },
    groupid: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      formData: new FormData(),
      fileList: [],
      buttonLoading: false,
      visibled: false,
      uploadFlag: false
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

        if (this.uploadType == 0) {
          uploadUsersFaces2Project(this.projectid, this.formData).then(resp => {
            this.commonUploadResult(resp);
          }).catch((e)=>{
            this.buttonLoading = false;
            console.log(e);
            showMessage(this, "数据导入出错，请稍后再试", "warning");
        });
        } else if (this.uploadType == 1) {
          uploadUsersFaces2Group(
            this.projectid,
            this.groupid,
            this.formData
          ).then(resp => {
              this.commonUploadResult(resp);
          }).catch((e)=>{
            this.buttonLoading = false;
            console.log(e);
            showMessage(this, "数据导入出错，请稍后再试", "warning");
        });
        }
      });
    },
    commonUploadResult(resp) {
      this.buttonLoading = false;
      // console.log(resp);
      if (resp.data == "success") {
        showMessage(this, "导入数据处理完成", "warning");
        this.uploadFlag = true;
        this.visibled = false;
      } else {
        showMessage(this, "数据导入出错，请稍后再试", "warning");
      }
    },
    fileBeforUpload(file) {
      this.formData.append("file", file);
      return false;
    },
    fileChange(file, file_list) {
      this.fileList = file_list;
    }
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      return this.dialogVisible;
    },
    buttonDisabled() {
      return !(this.fileList && this.fileList.length);
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-button {
  margin-left: 10px;
}
</style>
