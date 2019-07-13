<template>
  <div class="users-container">
    <div class="users-title">
      <span>用户列表</span>
      <el-button type="primary" icon="el-icon-user-solid" @click="dialogVisible=true">添加管理员</el-button>
    </div>
    <div class="users-table">
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
        <el-table-column label="姓名" width="100" prop="name" align="center"></el-table-column>
        <el-table-column label="编号" width="110" prop="userId" align="center"></el-table-column>
        <el-table-column label="是否管理员" width="120" prop="isAdmin" align="center">
          <template slot-scope="scope">
            <span>{{(/^true$/i).test(scope.row.isAdmin) ? '管理员':'普通用户'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整" width="90" align="center">
          <template slot-scope="scope">
            <div v-if="(/^true$/i).test(scope.row.isAdmin)"></div>
            <div v-else>
              <el-button type="text" @click="setUser2Admin(scope.row)">设置为管理员</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="密码重置" width="90" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
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
    </div>
    <div>
      <el-dialog title="添加管理员" :visible.sync="visibled" width="300px" @close="returnVisible">
        <hr />
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="admin.userId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="admin.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="中文名" :label-width="formLabelWidth">
            <el-input v-model="admin.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adminUpload">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getUsersFromAdmin,
  setUserAdmin,
  resetPwdByAdmin,
  addAdmin
} from "@/api/user";

export default {
  name: "allUsers",
  created() {
    this.fetchData();
  },
  data() {
    return {
      userList: [],
      listLoading: true,
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalUsers: 0,
      
      dialogVisible: false
    };
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getUsersFromAdmin().then(response => {
        console.log(response);
        this.userList = response.data;
        this.listLoading = false;
      });
    },
    //添加管理员
    adminUpload(){

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
    //将用户提升至管理员
    setUser2Admin(row) {
      if (/^true$/i.test(row.isAdmin)) {
        this.showMessage("用户“" + row.name + "已经是管理员”", "warning");
        return;
      }
      this.confirmMessage("是否将用户“" + row.name + "”调整为管理员?", () => {
        this.listLoading = true;
        let param = "userId="+row.id
        setUserAdmin(param).then(resp => {
          this.showMessage("调整为管理员成功");
          this.listLoading = false;
        });
      });
    },
    //重置密码
    resetPassword(row) {
      this.confirmMessage(
        "是否将用户“" + row.name + "”的密码重置为手机后六位?",
        () => {
          this.listLoading = true;
          let param = "userId="+row.id
          resetPwdByAdmin(param).then(resp => {
            this.showMessage("重置密码成功");
            this.listLoading = false;
          });
        }
      );
    },
    //顶端提示消息统一方法
    showMessage(msg, type = success) {
      this.$message({
        message: msg,
        type: type,
        center: true,
        showClose: true
      });
    },
    //确认信息统一方法
    confirmMessage(msg, done, errorMsg = "服务器繁忙，请稍后再试") {
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(done())
        .catch(() => {
          this.showMessage(errorMsg, "error");
        });
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
