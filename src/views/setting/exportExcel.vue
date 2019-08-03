<template>
  <div>
    <el-dialog title="导出用户数据" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <div>
        <el-radio v-model="type" label="admin" border>管理人员清单</el-radio>
        <el-radio v-model="type" label="user" border>普通用户清单</el-radio>
      </div>
      <div>
        <p>备注：导出数据量过多的时候需要较长时间，请耐心等待</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="exportExcel"
          :loading="buttonLoading"
          :disabled="buttonDisabled"
        >导出Excel</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { exportUsersExcel } from "@/api/user";
import { showMessage, downloadFile } from "@/utils/index";

export default {
  name: "userExcelExport",
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      type: "",
      buttonLoading: false
    };
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    },
    exportExcel() {
      this.buttonLoading = true;
      exportUsersExcel(this.type).then(resp => {
        this.buttonLoading = false;
        if (resp) {
          let fileName = "";
          if (this.type == "admin") {
            fileName = "管理人员清单.xlxs";
          } else {
            fileName = "普通用户清单.xlxs";
          }

          downloadFile(resp, fileName);
        }else{
          showMessage(this,'没有数据供导出','warning');
        }
      });
    }
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      return this.dialogVisible;
    },
    buttonDisabled() {
      return this.type == "admin" || this.type == "user";
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
