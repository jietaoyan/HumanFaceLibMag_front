<template>
  <div class="users-container">
    <div class="users-title">
      <span>项目用户列表</span>
      <span class="title-small">{{'(' + projectName + ')'}}&nbsp;&nbsp;</span>
      <el-button
        type="primary"
        icon="el-icon-s-custom"
        @click="groupFormShow=true"
        class="title-button"
      >添加用户</el-button>
    </div>
    <div class="users-table">
      <el-table
        v-loading="listLoading"
        :data="userList"
        :height="tableHeight"
        element-loading-text="加载中……"
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="姓名" width="120" prop="username" align="center"></el-table-column>
        <el-table-column label="编号" width="160" prop="userId" align="center"></el-table-column>
        <el-table-column label="年龄" width="90" prop="age" align="center"></el-table-column>
        <el-table-column label="性别" width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gender | genderFilter}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="feats" width="90" prop="feats" align="center"></el-table-column>
        <el-table-column label="featsize" width="90" prop="featsize" align="center"></el-table-column>-->
        <el-table-column label="头像" prop="imageUrl" width="130" align="center">
          <template slot-scope="scope">
            <el-popover placement="right" width="265" trigger="hover">
              <el-image style="width: 240px;" :src="scope.row.imageUrl" fit="contain"></el-image>
              <el-button type="text" slot="reference">查看头像</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="userData" align="left" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageIndex + 1"
        :page-sizes="[20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUsers"
      ></el-pagination>
    </div>
    <!-- <use-add></use-add> -->
  </div>
</template>
<script>
import { getUsersByProjectId, deleteUserFromProject } from "@/api/projects";
import { showMessage, genderJudge } from "@/utils/index";
import userAdd from "./prjUserAdd";

export default {
  name: "prjUsers",
  components: {
    userAdd
  },
  created() {
    this.projectId = this.$route.query.projectId;
    this.projectName = this.$route.query.projectName;
    this.fetchData();
  },
  filters: {
    genderFilter(value) {
      return genderJudge(value);
    }
  },
  data() {
    return {
      projectId: "",
      projectName: "",
      userList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalUsers: 0,
      tableHeight: window.innerHeight - 150,
      listLoading: true
    };
  },
  methods: {
    //加载数据
    fetchData() {
      this.listLoading = true;
      let params =
        "projectId=" +
        this.projectId +
        "&pageIndex=" +
        this.pageInfo.pageIndex +
        "&pageSize=" +
        this.pageInfo.pageSize;
      getUsersByProjectId(params).then(response => {
        // console.log(response);
        this.userList = response.data.data;
        this.totalUsers = response.data.totalCount;
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

    //删除用户
    deleteUser(row) {
      let param = "projectId=" + this.projectId + "&userId=" + row.userId;
      let that = this;
      that
        .$confirm("确认删除用户“" + row.username + "”？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          deleteUserFromProject(param).then(resp => {
            showMessage(that, "删除用户“" + row.username + "”成功");
            that.fetchData();
          });
        })
        .catch(() => {
          showMessage(that, errorMsg, "error");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.users {
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
