<template>
  <div>
    <el-dialog title="添加管理员" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <el-form :model="form">
        <el-form-item label="用户名*" :label-width="formLabelWidth">
          <el-input v-model="admin.userId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码*" :label-width="formLabelWidth">
          <el-input v-model="admin.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="中文名*" :label-width="formLabelWidth">
          <el-input v-model="admin.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adminUpload">确 定</el-button>
      </div>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { addAdmin } from "@/api/user";

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
    return {
      admin: {
        name: "",
        password: "",
        userId: ""
      },
      visible: false,
      formLabelWidth: "120px"
    };
  },
  methods: {
    methods: {
      returnVisible() {
        this.$emit("getVisible", this.visibled);
      }
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
