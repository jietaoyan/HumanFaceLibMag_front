<template>
  <div class="groupusers-container">
    <div class="groupusers-title">
      <span>分组用户列表</span>
      <span class="title-small">{{'(' + groupName + ')'}}&nbsp;&nbsp;</span>
      <el-button
        type="primary"
        icon="el-icon-s-custom"
        @click="groupUserAddShow=true"
        class="title-button"
      >添加用户</el-button>
      <el-button
        type="primary"
        icon="el-icon-document-copy"
        @click="exportVisible=true"
      >导出数据</el-button>
      <el-button
        type="primary"
        icon="el-icon-upload"
        @click="uploadVisible=true"
        class="title-button"
      >导入数据</el-button>
    </div>
    <div class="groupusers-table">
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
      :groupId="groupId"
      :projectName="projectName"
      :groupUserIds="groupUserIds"
      :dialogVisible="groupUserAddShow"
      @getVisible="toggleUserAddShow(arguments)"
    ></user-add>
    <user-down
      :groupid="groupId"
      :groupName="groupName"
      :total="totalUsers"
      :dialogVisible="exportVisible"
      @getVisible="toggleExportShow()"
    ></user-down>
    <face-upload
      :projectid="projectId"
      :groupid="groupId"
      :uploadType="1"
      :dialogVisible="uploadVisible"
      @getVisible="toggleUploadShow(arguments)">
    </face-upload>
  </div>
</template>
<script>
import {
  getGroupUsers,
  getGroupUsersPage,
  deleteUserInGroup,
  getGroupUserId,
  exportGroupFaceExcel
} from "@/api/groups";
import { genderJudge, showMessage,downloadFile } from "@/utils/index";
import userAdd from "./prjGroupUserSelect";
import userDown from "./prjGroupUserDown";
import faceUpload from './faceUpload';

export default {
  name: "prjGroupUsers",
  components: {
    userAdd,
    userDown,
    faceUpload
  },
  created() {
    this.projectId = this.$route.query.projectId;
    this.projectName = this.$route.query.projectName;
    this.groupId = Number(this.$route.query.groupId);
    this.groupName = this.$route.query.groupName;
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
      groupId: 1,
      groupName: "",
      userList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalUsers: 0,
      groupUserIds: [-1], //当前分组组的所有用户id，用于对用户列表筛选
      tableHeight: window.innerHeight - 150,
      listLoading: true,
      groupUserAddShow: false,
      exportVisible:false,
      uploadVisible:false
    };
  },
  methods: {
    fetchData() {
      let param =
        "projectId=" +
        this.projectId +
        "&groupId=" +
        this.groupId +
        "&pageIndex=" +
        this.pageInfo.pageIndex +
        "&pageSize=" +
        this.pageInfo.pageSize;
      this.listLoading = true;
      getGroupUsersPage(param).then(resp => {
        this.userList = resp.data.data;
        this.totalUsers = resp.data.totalCount;
        this.listLoading = false;

        //Todo,waiting groupusers id list
        getGroupUserId(this.groupId).then(resp => {
          this.groupUserIds = resp.data;
        });
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
    //用户添加页面
    toggleUserAddShow(data) {
      this.groupUserAddShow = data[0];
      if(data[1]){
        this.fetchData();
      }
    },
    //导出页面切换
    toggleExportShow(data){
      this.exportVisible = data;
    },
    toggleUploadShow(data){
      this.uploadVisible = data[0];
      if (data[1]) {
        this.fetchData();
      }
    },
    //删除用户
    deleteUser(row) {
      let that = this;
      that
        .$confirm("确认从分组中删除“" + row.username + "”用户？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          let data = {};
          data.groupId = this.groupId;
          data.projectId = this.projectId;
          data.userIds = [];
          data.userIds.push(row.userId);
          deleteUserInGroup(data).then(resp => {
            showMessage(that, "删除分组用户“" + row.username + "”成功");
            that.fetchData();
          });
        })
        .catch(() => {
          showMessage(that, "删除分组用户出错，请稍后再试", "error");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.groupusers {
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
