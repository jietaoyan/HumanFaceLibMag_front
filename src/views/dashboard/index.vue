<template>
  <div class="dashboard-container">
    <div class="dashboard-title">项目列表</div>
    <div class="dashboard-table">
      <el-table
        v-loading="listLoading"
        :data="prjList"
        element-loading-text="加载中……"
        :height="tableHeight"
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
        <el-table-column label="用户数量" width="80" prop="count" align="center"></el-table-column>
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
        <el-table-column align="left" label="简介" prop="introduction" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageIndex + 1"
        :page-sizes="[20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPrjs"
      ></el-pagination>
    </div>
    <prj-detail :projectDetail="project" :dialogVisible="detailShow" @getVisible="toggleDetailShow"></prj-detail>
  </div>
</template>

<script>
import prjDetail from "./prjDetail";
import { getList,getListPage } from "@/api/projects";

export default {
  name: "Dashboard",
  components: {
    prjDetail
  },
  data() {
    return {
      prjList: [],
      project: {},
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalPrjs: 0,
      detailShow: false,
      tableHeight: window.innerHeight - 150,
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let params =
        "&pageIndex=" +
        this.pageInfo.pageIndex +
        "&pageSize=" +
        this.pageInfo.pageSize;
      getListPage().then(response => {
        this.prjList = response.data.data;
        this.totalPrjs = response.data.totalCount;
        this.listLoading = false;
      });
    },
    //分页方法
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pageInfo.pageIndex = val - 1;
      this.fetchData();
    },
    //打开项目明细
    showPrjDetail(row) {
      this.project = row;
      this.detailShow = true;
    },
    //打开项目用户列表
    openUsers(row) {
      this.$router.push({
        path: "/prjUsers",
        query: {
          projectId: row.projectId,
          projectName: row.projectName
        }
      });
    },
    //打开分组
    openGroups(row) {
      this.$router.push({
        path: "/prjGroups",
        query: {
          projectId: row.projectId,
          projectName: row.projectName
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
    margin: 10px 30px;
  }
  &-title {
    font-size: 24px;
    line-height: 46px;
  }
  &-table {
    width: 100%;
  }
}

</style>