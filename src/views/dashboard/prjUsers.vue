<template>
  <div class="users-container">
    <div class="users-title">
      <el-row :gutter="10">
        <el-col :span="18"><div><span>项目用户列表</span>
            <span class="title-small">{{'(' + projectName + ')'}}&nbsp;&nbsp;</span>
            <el-button
              type="primary"
              icon="el-icon-s-custom"
              @click="dialogVisible=true"
              class="title-button"
            >添加用户</el-button>
            <el-button
              type="primary"
              icon="el-icon-document-copy"
              @click="exportVisible = true"
            >导出数据</el-button>
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="uploadVisible=true"
              class="title-button"
            >导入数据</el-button></div></el-col>
        <el-col :span="4">
          <el-input v-model="text" placeholder="按姓名搜索"></el-input>
          </el-col>
        <el-col :span="2">
          <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchUser"
              class="title-button"
            >搜索</el-button>
          </el-col>
      </el-row>
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
        <el-table-column label="用户ID" width="160" prop="userId" align="center"></el-table-column>
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
        <el-table-column label="添加到分组" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="addUser2Group(scope.row)">添加</el-button>
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
    <user-add
      :projectId="projectId"
      :dialogVisible="dialogVisible"
      @getVisible="toggleDetailShow(arguments)"
    ></user-add>
    <user-export
      :projectId="projectId"
      :projectName="projectName"
      :total="totalUsers"
      :dialogVisible="exportVisible"
      @getVisible="toggleExportShow()"
    ></user-export>
    <face-upload
      :projectid="projectId"
      :uploadType="0"
      :dialogVisible="uploadVisible"
      @getVisible="toggleUploadShow(arguments)">
    </face-upload>
    <group-select
      :projectId="projectId"
      :userid="userid"
      :username="username"
      :dialogVisible='groupVisible'
      @getVisible="toggleGroupSelect()">
    </group-select>
  </div>
</template>
<script>
import {
  getUsersByProjectId,
  deleteUserFromProject,
  exportPrjFaceExcel
} from "@/api/projects";
import { showMessage, genderJudge, downloadFile } from "@/utils/index";
import userAdd from "./prjUserAdd";
import userExport from "./prjUsersDown";
import faceUpload from './faceUpload';
import groupSelect from './prjGroupSelect';

export default {
  name: "prjUsers",
  components: {
    userAdd,
    userExport,
    faceUpload,
    groupSelect
  },
  created() {
    this.projectId = this.$route.query.projectId;
    this.projectName = this.$route.query.projectName;
    this.text = '';
    this.fetchData();
  },
  filters: {
    genderFilter(value) {
      return genderJudge(value);
    }
  },
  data() {
    return {
      projectId: "1",
      projectName: "1",
      userList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalUsers: 0,
      tableHeight: window.innerHeight - 150,
      listLoading: true,
      dialogVisible: false,
      exportVisible:false,
      uploadVisible:false,
      groupVisible:false,
      userid:'',
      username:'',
      text:''
    };
  },
  methods: {
    //加载数据
    fetchData() {
      this.listLoading = true;
      let params =
        "projectId=" +
        this.projectId +
        "&text=" +
        this.text +
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
    //搜索按钮
    searchUser(){
      this.pageInfo.pageIndex = 0;
      this.pageInfo.pageSize = 20;
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
          showMessage(that, "服务器繁忙，请稍后再试", "error");
        });
    },

//添加用户到分组
    addUser2Group(row){
      this.userid = row.userId;
      this.username = row.username;
      this.groupVisible = true;
    },
    //添加用户成功了分组则刷新页面加载
    toggleDetailShow(data) {
      this.dialogVisible = data[0];
      if (data[1]) {
        this.fetchData();
      }
    },
    toggleExportShow(data){
      this.exportVisible = data;
    },
    toggleUploadShow(data){
      this.uploadVisible = data[0];
      if (data[1]) {
        this.fetchData();
      }
    },
    toggleGroupSelect(data){
      this.groupVisible = data;
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
