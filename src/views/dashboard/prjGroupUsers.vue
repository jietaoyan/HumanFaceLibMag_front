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
      <el-button type="primary" @click="exportExcel" :loading="buttonLoading">导出Excel</el-button>
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
    <user-add
      :projectId="projectId"
      :groupId="groupId"
      :projectName="projectName"
      :groupUserIds="groupUserIds"
      :dialogVisible="groupUserAddShow"
      @getVisible="toggleUserAddShow(arguments)"
    ></user-add>
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
import { genderJudge, showMessage } from "@/utils/index";
import userAdd from "./prjGroupUserSelect";

export default {
  name: "prjGroupUsers",
  components: {
    userAdd
  },
  created() {
    this.projectId = this.$route.query.projectId;
    this.projectName = this.$route.query.projectName;
    this.groupId = Number( this.$route.query.groupId);
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
      buttonLoading: false,
      groupUserAddShow: false
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
    exportExcel() {
      this.$confirm("导出数据较多，需要较长时间，请耐心等待？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.buttonLoading = true;
        exportGroupFaceExcel(this.groupId)
          .then(resp => {
            this.buttonLoading = false;
            if (resp) {
              let fileName = this.groupName + "-用户人脸信息.xlsx";

              downloadFile(resp, fileName);
            } else {
              showMessage(this, "没有数据供导出", "warning");
            }
          })
          .catch(() => {
            showMessage(this, "导出项目用户信息出错，请稍后再试", "error");
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
      this.fetchData();
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
