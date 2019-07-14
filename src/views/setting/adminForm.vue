<template>
  <div>
    <el-dialog title="添加管理员" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <el-form :model="admin" ref="adminFormRef" :rules="loginRules" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userId" :label-width="formLabelWidth">
          <el-input
            v-model="admin.userId"
            ref="userId"
            type="text"
            tabindex="1"
            placeholder="由字母\数字\下划线组成"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input
            v-model="admin.password"
            ref="password"
            type="password"
            tabindex="2"
            placeholder="请输入密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
          <el-input
            v-model="admin.checkPass"
            type="password"
            ref="checkPass"
            tabindex="3"
            placeholder="请再次输入密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="admin.name"
            ref="name"
            type="text"
            tabindex="4"
            placeholder="可输入中文名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
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
import { addAdmin } from "@/api/user";
import { showMessage } from "@/utils/index";
import { isAccount } from "@/utils/validate";

export default {
  name: "adminForm",
  props: {
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
    const passwordValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6 || value.length > 50) {
        callback(new Error("密码需要6~50位字符"));
      } else if (!/^(\w){6,50}$/.test(value)) {
        callback(new Error("密码需由字母数字下划线等组成"));
      } else {
        if (this.admin.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    const checkPassValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.admin.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const nameValid = (rule, value, callback) => {};
    return {
      admin: {
        userId: "",
        password: "",
        name: "",
        checkPass: ""
      },
      visibled: false,
      formLabelWidth: "120px",
      loading: false,
      loginRules: {
        userId: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: userIdValid, trigger: "blur" }
        ],
        password: [
          { required: true, trigger: "blur", validator: passwordValid }
        ],
        checkPass: [
          { required: true, trigger: "blur", validator: checkPassValid }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 20, message: "姓名最多20位字符" },
          {
            pattern: /^[a-zA-Z]*[\u4E00-\u9FA5]*$/,
            message: "姓名请输入中文或英文"
          }
        ]
      }
    };
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    },
    //提交表单
    adminUpload(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            let adminer = {}
            adminer.userId = this.admin.userId
            adminer.password = this.admin.password
            adminer.name = this.admin.name
            this.loading = true
            addAdmin(adminer).then(resp=>{

                this.loading = false
                showMessage(this,"创建成功")
                this.visible = false
            })
        } else {
          return false;
        }
      });
    },
    //重置表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
</style>
