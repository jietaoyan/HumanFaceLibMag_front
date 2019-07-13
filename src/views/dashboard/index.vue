<template>
  <div class="dashboard-container">
    <div class="dashboard-title">项目列表</div>
    <div class="dashboard-table">
      <el-table
        v-loading="listLoading"
        :data="prjList"
        element-loading-text="加载中……"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="项目编号" width="150" prop="projectId" align="center"></el-table-column>
        <el-table-column label="项目名称" width="230" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="showPrjDetail(scope.row)">{{ scope.row.projectName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="80" prop="count" align="center"></el-table-column>
        <el-table-column align="left" label="简介" prop="introduction" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" label="用户" width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="openUsers(scope.row)">用户信息</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分组" width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="openGroups(scope.row)">分组信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <prj-detail :projectDetail="project" :dialogVisible="detailShow" @getVisible="toggleDetailShow"></prj-detail>
  </div>
</template>

<script>
import prjDetail from "./prjDetail";
import { getList } from "@/api/projects";

export default {
  name: "Dashboard",
  components: {
    "prj-detail": prjDetail
  },
  data() {
    return {
      prjList: [],
      project: {},
      detailShow: false,
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList().then(response => {
        this.prjList = response.data;
        this.listLoading = false;
      });
    },
    showPrjDetail(row) {
      this.project = row;
      this.detailShow = true;
    },
    openUsers(row) {
      this.$router.push({
        path: "/prjUsers",
        query: {
          projectId: row.projectId
        }
      });
    },
    openGroups(row) {
      this.$router.push({
        path: "/prjGroups",
        query: {
          projectId: row.projectId
        }
      });
    },
    toggleDetailShow(data) {
      this.detailShow = data;
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    position: relative;
    height: calc(100% - 120px);
  }
  &-title {
    font-size: 30px;
    line-height: 46px;
  }
  &-table {
    position: relative;
    height: calc(100% - 120px);
  }
}
</style>
