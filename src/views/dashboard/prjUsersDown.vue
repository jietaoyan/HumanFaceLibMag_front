<template>
  <div>
    <el-dialog title="导出用户数据" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <div>
        <p>
          <span>用户人脸总数：{{total}}</span>
        </p>
      </div>
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
          @click.native.prevent="exportUser"
          :disabled="isSelect"
          :loading="loading"
        >导出选择数据</el-button>
        <el-button
          type="primary"
          @click.native.prevent="exportAllUser"
          :loading="allLoading"
        >导出所有数据</el-button>
      </div>
    <p style="color:grey;">（导出{{baseNum*bandWidth}}条用户人脸数据约需2分钟时间）</p>
    </el-dialog>
  </div>
</template>
<script>
import { exportPrjFaceExcel } from "@/api/projects";
import { showMessage, downloadFile } from "@/utils/index";
import { getBandKey } from "@/utils/tokenCookie";

export default {
  name: "prjUsersDown",
  props: {
    total: {
      type: Number,
      required: true,
      default: 0
    },
    projectId: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  created() {
    this.bandWidth = getBandKey();
  },
  data() {
    return {
      selectValue: "",
      start: 0,
      end: 0,
      bandWidth: 1,
      visibled: false,
      baseNum: 5000,
      loading: false,
      allLoading:false
    };
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    },
    exportUser() {
      this.$confirm("导出数据若较多，需要较长时间，请耐心等待。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.loading = true;
        let range = this.baseNum * this.bandWidth;
        this.start = range * this.selectValue;
        this.end = range * (this.selectValue + 1) - 1;
        exportPrjFaceExcel(this.projectId, this.start, this.end)
          .then(resp => {
            this.loading = false;
            if (resp) {
              let fileName = this.projectName + "-用户人脸信息";

              downloadFile(resp, fileName);
            } else {
              showMessage(this, "没有数据供导出", "warning");
            }
          })
          .catch(() => {
            this.loading = false;
            showMessage(this, "导出项目用户信息出错，请稍后再试", "error");
          });
      });
    },
    exportAllUser(){
      this.$confirm("导出数据若较多，需要较长时间，请耐心等待。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.allLoading = true;
        this.start = 0;
        exportPrjFaceExcel(this.projectId, this.start, this.total)
          .then(resp => {
            this.allLoading = false;
            if (resp) {
              let fileName = this.projectName + "-所有用户人脸信息";

              downloadFile(resp, fileName);
            } else {
              showMessage(this, "没有数据供导出", "warning");
            }
          })
          .catch(() => {
            this.allLoading = true;
            showMessage(this, "导出项目用户信息出错，请稍后再试", "error");
          });
      });
    }
  },
  computed: {
    options() {
      this.visibled = this.dialogVisible;
      let options = [];
      if (this.total) {
        let range = this.baseNum * this.bandWidth;
        var downCount = parseInt(this.total / range) + 1;
        for (let i = 0; i < downCount; i++) {
          let temp = {};
          temp.value = i;
          if (i == downCount - 1) {
            temp.label = range * i + 1 + " ~ " + this.total;
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
    isSelect() {
      if (this.selectValue === "") return true;
      return !(this.selectValue > -1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/common";
.button-center {
  text-align: center;
}
</style>
