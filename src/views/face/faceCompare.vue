<template>
  <div class="detect-container">
    <div class="detect-title">比对两张人脸特征值</div>
    <div class="detect-table">
      <div>
        <el-row style="height:180px;">
          <el-col :span="5">
            <el-upload
              :action="ftpUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
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
              :action="ftpUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              class="avatar-uploader"
              accept="image/png, image/jpeg"
              :auto-upload="false"
            >
              <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <div v-show="message">
        <div v-if="message=='执行成功'">
          <p>
            <span>年龄&nbsp;&nbsp;</span>
            <span>{{info.age}}</span>
          </p>
          <p>
            <span>性别&nbsp;&nbsp;</span>
            <span>{{info.gender|genderFilter}}</span>
          </p>
          <p>
            <span>特征值大小&nbsp;&nbsp;</span>
            <span>{{info.featsize}}</span>
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
import { showMessage, genderJudge } from "@/utils/index";
import defaultSettings from '@/settings';

export default {
  name: "faceCompare",
  data() {
    return {
      ftpUrl: defaultSettings.fileUrl + "face/detect",
      imageUrl: "",
      info: {
        age: 0,
        featsize: 0,
        gender: 0,
        feats: []
      },
      message: ""
    };
  },
  filters: {
    genderFilter(value) {
      return genderJudge(value);
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(file);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.message = file.response.message;
      this.info.age = file.response.data.age;
      this.info.gender = file.response.data.gender;
      this.info.featsize = file.response.data.featsize;
      this.info.feats = file.response.data.feats;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 512 / 512 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 300k!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style lang="scss" scoped>
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
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
