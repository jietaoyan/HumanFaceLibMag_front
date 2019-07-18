<template>
  <div class="groups-container">
    <div class="groups-title">
      <span>项目分组列表</span>
      <span class="title-small">{{'(' + projectName + ')'}}&nbsp;&nbsp;</span>
      <el-button
        type="primary"
        icon="el-icon-s-order"
        @click="groupFormShow=true"
        class="title-button"
      >添加分组</el-button>
    </div>
    <div class="groups-table">
      <el-table
        v-loading="listLoading"
        :data="groupList"
        element-loading-text="加载中……"
        :height="tableHeight"
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="分组名称" prop="name" align="left"></el-table-column>
        <el-table-column label="分组用户" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showGroupUsers(scope.row)">用户列表</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteGroup(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageIndex + 1"
        :page-sizes="[20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalGroups"
      ></el-pagination>
    </div>
    <group-form
      :projectId="projectId"
      :dialogVisible="groupFormShow"
      @getVisible="toggleFormDetailShow(arguments)"
    ></group-form>
  </div>
</template>
<script>
import { getGroupsListPage, deleteGroup } from "@/api/groups";
import { showMessage } from "@/utils/index";
import groupForm from "./prjGroupForm";

export default {
  name: "prjUsers",
  components: {
    groupForm
  },
  created() {
    this.projectId = this.$route.query.projectId;
    this.projectName = this.$route.query.projectName;
    this.fetchData();
  },
  data() {
    return {
      projectId: "1",
      projectName: "1",
      groupList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalGroups: 0,
      tableHeight: window.innerHeight - 150,
      groupFormShow: false,
      listLoading: true
    };
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let params =
        "projectId=" +
        this.projectId +
        "&pageIndex=" +
        this.pageInfo.pageIndex +
        "&pageSize=" +
        this.pageInfo.pageSize;
      getGroupsListPage(params).then(response => {
        this.groupList = response.data.data;
        this.totalGroups = response.data.totalCount;
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
    //打开分组用户列表
    showGroupUsers(row) {
      this.$router.push({
        path: "/prjGroupUsers",
        query: {
          projectId: this.projectId,
          projectName: this.projectName,
          groupId: row.id,
          groupName: row.name
        }
      });
    },
    //删除分组
    deleteGroup(row) {
      let param = "projectId=" + this.projectId + "&groupId=" + row.id;
      let that = this;
      that
        .$confirm("确认删除分组“" + row.name + "”？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          deleteGroup(param).then(resp => {
            showMessage(that, "删除分组“" + row.name + "”成功");
            that.fetchData();
          });
        })
        .catch(() => {
          showMessage(that, errorMsg, "error");
        });
    },
    //添加成功了分组则刷新页面加载
    toggleFormDetailShow(data) {
      this.groupFormShow = data[0];
      if (data[1]) {
        this.fetchData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.groups {
  &-container {
    margin: 10px 30px;
  }

  &-title {
    font-size: 24px;
    line-height: 46px;
  }

  &-table {
    position: relative;

    .el-table {
      width: 600px;
    }
  }
}
</style>
