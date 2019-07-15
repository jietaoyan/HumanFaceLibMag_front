<template>
  <div>
    <el-dialog
      title="分组用户列表"
      :visible.sync="visibled"
      width="850px"
      max-height="800px"
      @close="returnVisible"
    >
      <hr />
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
        <el-table-column label="姓名" width="100" prop="username" align="center"></el-table-column>
        <el-table-column label="编号" width="140" prop="userId" align="center"></el-table-column>
        <el-table-column label="年龄" width="90" prop="age" align="center"></el-table-column>
        <el-table-column label="性别" width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gender | genderFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" prop="imageUrl" width="130" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showUserPhoto(scope.row)">查看头像</el-button>
          </template>
        </el-table-column>
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
import { getGroupUsers } from "@/api/groups";

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
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      userList: [],
      visibled: false,
      listLoading: true
    };
  },
  methods: {
    fetchData() {
      let param = "projectId=" + this.projectId + "&groupId=" + this.groupId;
      this.listLoading = true;
      getGroupUsers(param).then(resp => {
        this.userList = resp.data;
        this.listLoading = false;
      });
    },
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    },
    showUserPhoto(row) {},
    deleteUser(row) {}
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      if(this.visibled){
        this.fetchData();
      }
      return this.dialogVisible;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
