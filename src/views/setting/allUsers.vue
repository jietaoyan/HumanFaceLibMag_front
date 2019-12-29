<template>
  <div class="users-container">
    <div class="users-title">
      <el-row :gutter="10">
        <el-col :span="18">
          <span>用户列表&nbsp;&nbsp;</span>
          <el-button
            type="primary"
            icon="el-icon-user-solid"
            @click="dialogVisible=true"
            class="title-button"
          >添加管理员</el-button>
          <el-button
            type="primary"
            icon="el-icon-document-copy"
            @click="exportVisible=true"
            class="title-button"
          >导出数据</el-button>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="uploadVisible=true"
            class="title-button"
          >导入数据</el-button>
      </el-col>
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
        element-loading-text="加载中……"
        :height="tableHeight"
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">{{ scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="姓名" width="140" prop="name" align="center"></el-table-column>
        <el-table-column label="编号" width="200" prop="userId" align="center"></el-table-column>
        <el-table-column label="是否管理员" width="150" prop="isAdmin" align="center">
          <template slot-scope="scope">
            <span>{{(/^true$/i).test(scope.row.isAdmin) ? '管理员':'普通用户'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调整" width="170" align="center">
          <template slot-scope="scope">
            <div v-if="(/^true$/i).test(scope.row.isAdmin)">
              <el-button type="text" @click="setUser2User(scope.row)">取消管理员</el-button>
            </div>
            <div v-else>
              <el-button type="text" @click="setUser2Admin(scope.row)">设置为管理员</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="密码重置" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteUser(scope.row)">删除用户</el-button>
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
      <admin-form :dialogVisible="dialogVisible" @getVisible="toggleDetailShow(arguments)"></admin-form>
      <export-excel :dialogVisible="exportVisible" @getVisible="toggleExportShow()"></export-excel>
      <upload-excel :dialogVisible="uploadVisible" @getVisible="toggleuploadShow(arguments)"></upload-excel>
    </div>
  </div>
</template>
<script>
import { getUsersFromAdmin, setUserAdmin, resetPwdByAdmin,getProjectNameByUserid
  ,deleteUserByUseridAndPrjid,setUser2NormalUser } from "@/api/user";
import { showMessage } from "@/utils/index";
import adminForm from "./adminForm";
import exportExcel from './exportExcel';
import uploadExcel from './uploadExcel';

export default {
  name: "allUsers",
  components: {
    adminForm,
    exportExcel,
    uploadExcel
  },
  created() {
    this.text = '';
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
      tableHeight: window.innerHeight - 150,
      dialogVisible: false,
      exportVisible:false,
      uploadVisible:false,
      text:''
    };
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let param =
        "text=" +
        this.text +
        "&pageIndex=" +
        this.pageInfo.pageIndex +
        "&pageSize=" +
        this.pageInfo.pageSize;
      getUsersFromAdmin(param).then(response => {
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
    //将用户提升至管理员
    setUser2Admin(row) {
      if (/^true$/i.test(row.isAdmin)) {
        showMessage(this, "用户“" + row.name + "已经是管理员”", "warning");
        return;
      }
      let that = this;
      that
        .$confirm("是否将用户“" + row.name + "”调整为管理员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          // debugger
          that.listLoading = true;
          let param = "id=" + row.id;
          setUserAdmin(param).then(resp => {
            showMessage(that, "调整为管理员成功");
            // that.fetchData();
            row.isAdmin = true;
            that.listLoading = false;
          });
        })
        .catch(() => {
          showMessage(that, "服务器繁忙，请稍后再试?", "error");
          that.listLoading = false;
        });
    },
    setUser2User(row){
      let that = this;
      that
        .$confirm("是否将用户“" + row.name + "”取消管理员权限?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          // debugger
          that.listLoading = true;
          let param = "id=" + row.id;
          setUser2NormalUser(param).then(resp => {
            showMessage(that, "取消管理员权限成功");
            // that.fetchData();
            row.isAdmin = false;
            that.listLoading = false;
          });
        })
        .catch(() => {
          showMessage(that, "服务器繁忙，请稍后再试?", "error");
          that.listLoading = false;
        });
      
    },
    //重置密码
    resetPassword(row) {
      let that = this;
      that
        .$confirm("是否将用户“" + row.name + "”的密码重置为“000000”?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
        .then(() => {
          // debugger
          that.listLoading = true;
          let param = "id=" + row.id;
          resetPwdByAdmin(param).then(resp => {
            showMessage(that, "重置密码成功");
            that.listLoading = false;
          });
        })
        .catch(() => {
          showMessage(that, "服务器繁忙，请稍后再试", "error");
          that.listLoading = false;
        });
    },
    deleteUser(row){
      let that = this;
      that.listLoading = true;

      getProjectNameByUserid(row.userId).then(resp=>{
        that.listLoading = false;
        let projectList = resp.data;
        
        if(projectList.length){
          let len = projectList.length;
          let prjNames = '';
          let projectIds = '';
          projectList.forEach(function(item){
            prjNames += item.name + ',';
            projectIds += item.projectId + ',';
          })
          prjNames = prjNames.substring(0,prjNames.length - 1);
          projectIds = projectIds.substring(0,projectIds.length - 1);
          that.$confirm('删除操作将同时删除项目“'+prjNames+'”中的人脸信息，请确认是否删除该用户？'
          ,'提示',{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          }).then(()=>{
            that.listLoading = true;
            deleteUserByUseridAndPrjid(projectIds,row.userId).then(resp =>{
              that.listLoading = false;
              showMessage(that, "删除用户“"+row.name+"”成功");
              this.fetchData();
            }).catch(e=>{
              showMessage(that, "删除出错，请稍后再试", "error");
              console.log(e)
              that.listLoading = false;
            })
          })
        }else{
          that.$confirm('请确认是否删除用户“'+row.name+'”？'
          ,'提示',{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          }).then(()=>{
            that.listLoading = true;
            deleteUserByUseridAndPrjid('',row.userId).then(resp =>{
              that.listLoading = false;
              showMessage(that, "删除用户“"+row.name+"”成功");
              this.fetchData();
            }).catch(e=>{
              showMessage(that, "删除出错，请稍后再试", "error");
              console.log(e)
              that.listLoading = false;
            })
          })
        }
      })
    },
    deleteUserDetail(){

    },
    toggleDetailShow(data) {
      this.dialogVisible = data[0];
      if (data[1]) {
        this.fetchData();
      }
    },
    toggleExportShow(data){
      this.exportVisible = data;
    },
    toggleuploadShow(data){
      this.uploadVisible = data[0];
      if (data[1]) {
        this.fetchData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.users {
  &-container {
    margin: 10px 30px;
    width: 1070px;
  }
  &-title {
    font-size: 24px;
    line-height: 46px;
  }
  &-table {
    .el-table {
      width: 1050px;
    }
  }
}
.title-button {
  margin-bottom: 3px;
}
</style>
