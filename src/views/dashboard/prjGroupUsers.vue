<template>
  <div>
    <el-dialog
      title="分组用户列表"
      :visible.sync="visibled"
      width="900px"
      max-height="800px"
      @close="returnVisible"
    >
      <hr />
      <el-row>
        <el-col :span="24">
          <span>{{groupName}}</span>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="userList"
        element-loading-text="加载中……"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="姓名" width="110" prop="username" align="center"></el-table-column>
        <el-table-column label="编号" width="150" prop="userId" align="center"></el-table-column>
        <el-table-column label="年龄" width="90" prop="age" align="center"></el-table-column>
        <el-table-column label="性别" width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gender | genderFilter}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="头像" prop="imageUrl" width="130" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showUserPhoto(scope.row)">查看头像</el-button>
          </template>
        </el-table-column>-->
        <el-table-column label="备注" prop="userData" align="left" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { getGroupUsers, deleteUserInGroup } from "@/api/groups";
import { genderJudge, showMessage } from "@/utils/index";

export default {
  name: "prjGroupUsers",
  props: {
    projectId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: true
    },
    groupName: {
      type: String,
      required: true
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  filters: {
    genderFilter(value) {
      return genderJudge(value);
    }
  },
  data() {
    return {
      userList: [],
      visibled: false,
      listLoading: true,
      groupUserIds:[]
    };
  },
  methods: {
    fetchData() {
      let param = "projectId=" + this.projectId + "&groupId=" + this.groupId;
      this.listLoading = true;
      getGroupUsers(param).then(resp => {
        this.userList = resp.data;
        this.listLoading = false;
        for(user in this.userList){
          this.groupUserIds.push(user.userId);
        }
      });
    },
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    },
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
          data.userIds.push(row.userId)
          deleteUserInGroup(data).then(resp => {
            showMessage(that, "删除分组用户“" + row.username + "”成功");
            that.fetchData();
          });
        })
        .catch(() => {
          showMessage(that, errorMsg, "error");
        });
    }
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      if (this.visibled) {
        this.fetchData();
      }
      return this.dialogVisible;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
