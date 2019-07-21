<template>
  <div class="detect-container">
    <div class="detect-title">检索头像</div>
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
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <div v-if="info.targetImgUrl">
              <el-image :src="info.targetImgUrl" style="width: 175px; height: 175px" fit="contain"></el-image>
            </div>
            <div v-else>
              <span>目标图片</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="message" class="messagt-area">
        <div v-if="message=='执行成功'">
          <p>
            <span>分值&nbsp;&nbsp;</span>
            <span>{{info.score}}</span>
          </p>
          <p>
            <span>目标图片ID&nbsp;&nbsp;</span>
            <span>{{info.faceId}}</span>
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
import { showMessage } from "@/utils/index";
import defaultSettings from "@/settings";

export default {
  name: "faceSearch",
  data() {
    return {
      ftpUrl: defaultSettings.fileUrl + "face/search",
      imageUrl: "",
      info: {
        faceId: 0,
        id: 0,
        targetImgUrl: "",
        score: 0
      },
      message: ""
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // console.log(file);
      this.message = file.response.message;
      if (this.message == "执行成功") {
        this.info.faceId = file.response.data.faceId;
        this.info.id = file.response.data.id;
        this.info.targetImgUrl = file.response.data.imageUrl;
        this.info.score = file.response.data.score;
      }
    },
    beforeAvatarUpload(file) {
      URL.revokeObjectURL(this.imageUrl);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 512 / 512 < 1;
      if (!isJPG) {
        showMessage(this, "上传头像图片只能是 JPG 格式!", "warning");
      }
      if (!isLt2M) {
        showMessage(this, "上传头像图片大小不能超过 300k!", "warning");
      }
      this.imageUrl = URL.createObjectURL(file);
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

    .messagt-area {
      margin-top: 10px;
    }
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
