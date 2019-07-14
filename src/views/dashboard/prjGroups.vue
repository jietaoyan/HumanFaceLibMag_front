<template>
  <div class="groups-container">
    <div class="groups-title">
      <span>项目分组列表</span>
      <span class="title-small">{{'(' + projectName + ')'}}</span>
      <el-button type="primary" icon="el-icon-s-order" @click="dialogVisible=true">添加分组</el-button>
    </div>
    <div class="groups-table">
      <el-table
        v-loading="listLoading"
        :data="groupList"
        element-loading-text="加载中……"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="分组名称" width="250" prop="name" align="center"></el-table-column>
        <el-table-column label="分组用户" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showGroupUsers(scope.row)">用户列表</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteGroup(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <group-users
      :projectId="projectId"
      :groupId="groupIdSelect"
      :dialogVisible="groupUserShow"
      @getVisible="toggleUserDetailShow"
    ></group-users>
  </div>
</template>
<script>
import { getGroupsList, deleteGroup } from "@/api/groups";
import groupUsers from "./prjGroupUsers";
import groupForm from './prjGroupForm'

export default {
  name: "prjUsers",
  components: {
    groupUsers,
    groupForm
  },
  created() {
    this.projectId = this.$route.query.projectId;
    this.projectName = this.$route.query.projectName;
    this.fetchData();
  },
  data() {
    return {
      projectId: "",
      projectName:'',
      groupList: [],
      groupIdSelect: "",
      listLoading: true,
      groupUserShow: false,
      groupFormShow:false
    };
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let params = "projectId=" + this.projectId;
      getGroupsList(params).then(response => {
        this.groupList = response.data.data;
        this.listLoading = false;
      });
    },

    //打开分组用户列表
    showGroupUsers(row) {
      this.groupIdSelect = row.this.photoShow = true;
    },
    //删除分组
    deleteGroup(row) {
      let param = "projectId=" + this.projectId + "&groupId=" + row.id;
      deleteGroup(param).then(reap => {});
    },
    //弹出框隐藏
    toggleUserDetailShow(visiable) {
      this.groupUserShow = visiable;
    },
    toggleFormDetailShow(visiable) {
      this.groupFormShow = visiable;
    },
  }
};
</script>
<style lang="scss" scoped>
.groups {
  &-container {
    margin: 30px;
    position: relative;
    height: calc(100% - 120px);
  }
  &-title {
    font-size: 30px;
    line-height: 46px;
    title-small{
      font-size: 16px;
    }
  }
  &-table {
    position: relative;
    height: calc(100% - 120px);
  }
}
</style>
