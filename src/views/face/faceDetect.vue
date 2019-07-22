<template>
  <div class="detect-container">
    <div class="detect-title">人脸数据特征检测</div>
    <div class="detect-table">
      <div>
        <el-upload
          :action="ftpUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          accept="image/png, image/jpeg"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div v-show="message" class="messagt-area">
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
import defaultSettings from "@/settings";

export default {
  name: "faceDetect",
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
      // console.log(file);
      this.message = file.response.message;
      if (this.message == "执行成功") {
        this.info.age = file.response.data.age;
        this.info.gender = file.response.data.gender;
        this.info.featsize = file.response.data.featsize;
        this.info.feats = file.response.data.feats;
      }
    },
    beforeAvatarUpload(file) {
      URL.revokeObjectURL(this.imageUrl);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 512 / 512 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 300k!");
      }
      this.imageUrl = URL.createObjectURL(file);
      return isJPG && isLt2M;
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
    .messagt-area {
      margin-top: 10px;
    }
  }
}
</style>
