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
          <span>{{projectName}}</span>
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
        <el-table-column label="姓名" width="120" prop="username" align="center"></el-table-column>
        <el-table-column label="编号" width="160" prop="userId" align="center"></el-table-column>
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
            <el-button type="text" @click="insertIntoGroup(scope.row)">添加</el-button>
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
        :total="totalUsers"
      ></el-pagination>
    </el-dialog>
  </div>
</template>
<script>
import { getUsersByProjectId, deleteUserFromProject } from "@/api/projects";
import { showMessage } from "@/utils/index";

export default {
  name: "prjGroupUserSelect",

  filters: {
    genderFilter: value => {
      if (value == 0) {
        return "男";
      } else if (value == 1) {
        return "女";
      } else {
        return "暂无";
      }
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
      photoUrl: "",
      photoShow: false,
      photeName: "",
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

    //添加用户导分组
    insertIntoGroup(row) {
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
    },
    toggleDetailShow(visiable) {
      this.photoShow = visiable;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
