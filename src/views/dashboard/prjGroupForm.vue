<template>
  <div>
    <el-dialog title="添加分组" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <el-form :model="group" ref="groupFormRef" :rules="loginRules" class="demo-ruleForm">
        <el-form-item label="分组名称" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="group.name"
            ref="name"
            type="text"
            tabindex="1"
            placeholder="输入分组名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-button">
          <el-button
            type="primary"
            @click.native.prevent="adminUpload('groupFormRef')"
            :loading="loading"
            tabindex="2"
          >创建</el-button>
          <el-button @click.native.prevent="resetForm('groupFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { addGroup } from "@/api/groups";
import { showMessage } from "@/utils/index";

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
    const nameValid = (rule, value, callback) => {};
    return {
      group: {
        name: ""
      },
      visibled: false,
      formLabelWidth: "120px",
      loading: false,
      addSuccess:false,
      loginRules: {
        name: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { max: 40, message: "姓名最多40位字符" },
          {
            pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]*$/,
            message: "分组名称由中文、英文或数字构成"
          }
        ]
      }
    };
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled,this.addSuccess);
    },
    //提交表单
    adminUpload(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param =
            "projectId=" + that.projectId + "&name=" + that.group.name;
          addGroup(param).then(resp => {
            that.loading = false;
            showMessage(that, "创建分组成功");
            that.addSuccess = true;
            that.visibled = false;
          });
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
.form-button{
    text-align: center;
}
</style>
