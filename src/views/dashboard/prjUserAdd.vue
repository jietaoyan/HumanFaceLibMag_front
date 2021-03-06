<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <el-form :model="admin" ref="adminFormRef" :rules="loginRules" class="demo-ruleForm">
        <el-form-item label="用户ID" prop="formUserId" :label-width="formLabelWidth">
          <el-input
            v-model="admin.formUserId"
            ref="formUserId"
            type="text"
            tabindex="1"
            placeholder="由字母\数字\下划线组成"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户姓名" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="admin.name"
            ref="name"
            type="text"
            tabindex="2"
            placeholder="可输入中文名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="photo" :label-width="formLabelWidth">
          <el-upload
            ref="file"
            action="#"
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
        </el-form-item>
        <el-form-item label="备注" prop="userData" :label-width="formLabelWidth">
          <el-input
            v-model="admin.userData"
            type="textarea"
            ref="userData"
            :rows="2"
            placeholder="请输入备注"
            tabindex="4"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-button">
          <el-button
            type="primary"
            @click.native.prevent="adminUpload('adminFormRef')"
            :loading="loading"
            tabindex="5"
          >创建</el-button>
          <el-button @click.native.prevent="resetForm('adminFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { addUserFace } from "@/api/projects";
import { showMessage } from "@/utils/index";
import { isAccount } from "@/utils/validate";

export default {
  name: "adminForm",
  props: {
    projectId: {
      type: String,
      required: true
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    const userIdValid = (rule, value, callback) => {
      if (value.length > 40) {
        callback(new Error("用户名过长"));
      } else if (!isAccount(value)) {
        callback(new Error("账号请由字母、数组或下划线组成"));
      } else {
        callback();
      }
    };
    return {
      formData: new FormData(),
      admin: {
        formUserId: "",
        name: "",
        userData: ""
      },
      visibled: false,
      formLabelWidth: "110px",
      loading: false,
      addSuccess: false,
      imageUrl1: "",
      loginRules: {
        formUserId: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: userIdValid, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 20, message: "姓名最多20位字符" },
          {
            pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]*$/,
            message: "姓名请输入中文或英文"
          }
        ],
        userData:[
          {max:1000,message:"备注最多输入1000个字符"}
        ]
      }
    };
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled, this.addSuccess);
    },
    //提交表单
    adminUpload(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          if (that.imageUrl1) {
            that.loading = true;
            that.formData.set("projectId", that.projectId);
            that.formData.set("userId", that.admin.formUserId);
            that.formData.set("username", that.admin.name);
            that.formData.set("userData", that.admin.userData);

            that.$refs.file.submit();
            addUserFace(that.formData)
              .then(resp => {
                //全部置空
                that.formData = new FormData();
                that.admin.name = '';
                that.admin.userData = '';
                that.admin.formUserId = '';
                that.$refs.file.clearFiles();
                that.imageUrl1 = '';
                // showMessage(that, "添加成功");
                that.addSuccess = true;
                this.$confirm("添加成功，是否继续添加用户？", "提示", {
                  confirmButtonText: "关闭",
                  cancelButtonText: "继续",
                  type: "warning",
                  center: true
                }).then(() => {
                  that.visibled = false;
                })
                
              })
              .catch((e) => {
                showMessage(that, "添加失败",'error');
                that.loading = false;
              });
            that.loading = false;
          } else {
            showMessage(that, "请上传头像", "error");
            return false;
          }
        } else {
          showMessage(that, "请检查输入格式", "error");
          return false;
        }
      });
    },
    file1Change(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.size / 512 / 512 < 1;
      if (!isJPG) {
        showMessage(this, "上传头像图片只能是 JPG 格式!", "error");
        this.$refs.file.clearFiles();
        return false;
      }
      if (!isLt2M) {
        showMessage(this, "上传头像图片大小不能超过 300k!", "error");
        this.$refs.file.clearFiles();
        return false;
      }
      this.imageUrl1 = URL.createObjectURL(file.raw);
      this.formData.set("file", file);
      return isJPG && isLt2M;
    },
    file1BeforUpload(file) {
      this.formData.set("file", file);
      return false;
    },
    //重置表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.file.clearFiles();
      this.imageUrl1 = '';
    }
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      return this.dialogVisible;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/common";
.form-button {
  text-align: center;
}
</style>
