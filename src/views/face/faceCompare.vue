<template>
  <div class="detect-container">
    <div class="detect-title">比对两张人脸特征值</div>
    <div class="detect-table">
      <div>
        <el-row style="height:180px;">
          <el-col :span="5">
            <el-upload
              ref="file1"
              :action="ftpUrl"
              :show-file-list="false"
              :on-change="file1Change"
              :before-upload="file1BeforUpload"
              class="avatar-uploader"
              accept="image/png, image/jpeg"
              :auto-upload="false"
            >
              <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-upload
              ref="file2"
              :action="ftpUrl"
              :show-file-list="false"
              :on-change="file2Change"
              :before-upload="file2BeforUpload"
              class="avatar-uploader"
              accept="image/png, image/jpeg"
              :auto-upload="false"
            >
              <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
        <el-row  class="messagt-area button-padding">
          <el-col :span="24">
            <el-button type="primary" @click="comparePic" :disabled="buttonDisabled">比对</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-show="message" class="messagt-area">
        <div v-if="message=='执行成功'">
          <p>
            <span>分数&nbsp;&nbsp;</span>
            <span>{{score}}</span>
          </p>
        </div>
        <div v-else>
          <span>{{message}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import { faceCopmare } from "@/api/face";
import defaultSettings from "@/settings";
import axios from 'axios'
//使用axios待后面确定是否人脸算法返回code=1问题

export default {
  name: "faceCompare",
  data() {
    return {
      formData: new FormData(),
      ftpUrl: "#",
      // ftpUrl: defaultSettings.fileUrl + "face/compare",
      imageUrl1: "",
      imageUrl2: "",
      score: 0,
      message: ""
    };
  },
  methods: {
    comparePic() {
      if (this.imageUrl1 && this.imageUrl2) {
        this.$refs.file1.submit();
        this.$refs.file2.submit();
        this.faceCopmare(this.formData).then(resp => {
          console.log(resp);
          this.message = resp.data.message;
          if(this.message == '执行成功'){
            this.score = resp.data.data.score;
          }
        });
        
      } else {
        this.$message.error("请上传两张对比图片");
      }
    },
    file1Change(file) {
      return this.commonChage(file, 1);
    },
    file2Change(file) {
      return this.commonChage(file, 2);
    },
    commonChage(file, type) {
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.size / 512 / 512 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 300k!");
      }
      if (type == 1) {
        this.imageUrl1 = URL.createObjectURL(file.raw);
      } else {
        this.imageUrl2 = URL.createObjectURL(file.raw);
      }
      return isJPG && isLt2M;
    },
    file1BeforUpload(file) {
      this.formData.append("file1", file);
      return false;
    },
    file2BeforUpload(file) {
      this.formData.append("file2", file);
      return false;
    },
    faceCopmare(data) {
      return axios({
        method: "post",
        url: defaultSettings.fileUrl + "face/compare",
        timeout: 20000,
        data,
      });
    }
  },
  computed:{
    buttonDisabled(){
      return !(this.imageUrl1 && this.imageUrl2);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../styles/common';
.detect {
  &-container {
    margin: 10px 30px;
  }
  &-title {
    font-size: 18px;
    line-height: 46px;
  }
  &-table {
    width: 100%;
    .button-padding{
      padding-left: 185px;
    }
    .messagt-area {
      margin-top: 10px;
    }
  }
}
</style>
