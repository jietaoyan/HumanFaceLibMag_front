<template>
  <div>
    <el-dialog title="导出用户数据" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <div>
        <p>
          <span>管理人员总数：{{adminCount}}；普通用户总数：{{nomalCount}}</span>
        </p>
      </div>
      <div>
        <el-radio v-model="type" label="admin">管理人员清单</el-radio>
        <el-radio v-model="type" label="user">普通用户清单</el-radio>
      </div>
      <p></p>
      <div>
        <el-select v-model="selectValue" placeholder="选择导出数据区间">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <p></p>
      <div class="button-center">
        <el-button
          type="primary"
          @click="exportExcel"
          :loading="buttonLoading"
          :disabled="buttonDisabled"
        >导出数据</el-button>
      </div>
      <p style="color:grey;">（导出{{baseNum*bandWidth}}条用户人脸数据约需30秒时间）</p>
    </el-dialog>
  </div>
</template>
<script>
import { exportUsersExcel, adminUsersCount, normalUserCount } from "@/api/user";
import { showMessage, downloadFile } from "@/utils/index";
import { getBandKey } from "@/utils/tokenCookie";

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
      selectValue: "",
      start: 0,
      end: 0,
      bandWidth: 1,
      baseNum: 50000,
      adminCount: 0,
      nomalCount: 0,
      buttonLoading: false,
      visibled: false
    };
  },
  created() {
    this.bandWidth = getBandKey();
    adminUsersCount().then(resp => {
      this.adminCount = resp.data;
    });
    normalUserCount().then(resp => {
      this.nomalCount = resp.data;
    });
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    },
    exportExcel() {
      this.$confirm("导出数据若较多，需要较长时间，请耐心等待。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.buttonLoading = true;
        let range = this.baseNum * this.bandWidth;
        this.start = range * this.selectValue;
        this.end = range * (this.selectValue + 1) - 1;
        exportUsersExcel(this.type, this.start, this.end).then(resp => {
          this.buttonLoading = false;
          if (resp) {
            let fileName = "";
            if (this.type == "admin") {
              fileName = "管理人员清单";
            } else {
              fileName = "普通用户清单";
            }

            downloadFile(resp, fileName);
          } else {
            showMessage(this, "没有数据供导出", "warning");
          }
        });
      });
    }
  },
  computed: {
    options() {
      this.visibled = this.dialogVisible;
      let options = [];
      if (this.type) {
        let range = this.baseNum * this.bandWidth;
        let total = 0;
        if (this.type == "admin") {
          total = this.adminCount;
        } else {
          total = this.nomalCount;
        }
        var downCount = parseInt(total / range) + 1;
        for (let i = 0; i < downCount; i++) {
          let temp = {};
          temp.value = i;
          if (i == downCount - 1) {
            temp.label = range * i + 1 + " ~ " + total;
          } else {
            temp.label = range * i + 1 + " ~ " + range * (i + 1);
          }
          options.push(temp);
        }
      } else {
        var temp = {
          value: 0,
          label: "无"
        };
        options.push(temp);
      }
      return options;
    },
    buttonDisabled() {
      if (this.selectValue === "") return true;
      return !(
        (this.type == "admin" || this.type == "user") &&
        this.selectValue > -1
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.button-center {
  text-align: center;
}
</style>
