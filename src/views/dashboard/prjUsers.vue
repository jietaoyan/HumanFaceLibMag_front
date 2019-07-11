<template>
  <div class="users-container">
    <div class="users-title">用户列表</div>
    <div class="users-table">
      <el-table
        v-loading="listLoading"
        :data="userList"
        element-loading-text="加载中……"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="姓名" width="100" prop="username" align="center"></el-table-column>
        <el-table-column label="编号" width="110" prop="userId" align="center"></el-table-column>
        <el-table-column label="年龄" width="90" prop="age" align="center"></el-table-column>
        <el-table-column label="性别" width="90" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gender == 0 ? '男':'女'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="feats" width="90" prop="feats" align="center"></el-table-column>
        <el-table-column label="featsize" width="90" prop="featsize" align="center"></el-table-column>
        <el-table-column label="imageUrl" prop="imageUrl" align="center"></el-table-column>
        <el-table-column label="userData" width="90" prop="userData" align="center"></el-table-column>
        <el-table-column label="所属项目" width="250" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="!scope.row.project">{{projectId}}</span>
            <el-button type="text" @click="showPrjDetail(scope.row)" v-else>{{ scope.row.project.projectName }}</el-button>
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
      :total="totalUsers">
    </el-pagination>
    </div>
  </div>
</template>
<script>
import { getUsersByProjectId } from "@/api/projects";
export default {
  name: "prjUsers",
  created() {
    this.projectId = this.$route.query.projectId;
    this.fetchData();
    console.log(this.projectId);
  },
  data() {
    return {
      projectId: "",
      userList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalUsers:0,
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
        console.log(response)
        this.userList = response.data.data;
        this.totalUsers = response.data.totalCount
        this.listLoading = false;
      });
    },
    //分页方法
    handleSizeChange(val){
      this.pageInfo.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val){
      this.pageInfo.pageIndex = val - 1
      this.fetchData()
    },
    showPrjDetail(prjid){

    }
  }
};
</script>
<style lang="scss" scoped>
.users {
  &-container {
    margin: 30px;
    position: relative;
    height: calc(100% - 120px);
  }
  &-title {
    font-size: 30px;
    line-height: 46px;
  }
  &-table {
    position: relative;
    height: calc(100% - 120px);
  }
}
</style>
