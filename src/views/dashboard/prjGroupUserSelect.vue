<template>
  <div>
    <el-dialog
      title="项目用户列表"
      :visible.sync="visibled"
      width="900px"
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
        :height="tableHeight"
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
            <el-popover placement="right" width="265" trigger="hover">
              <el-image style="width: 240px;" :src="scope.row.imageUrl" fit="contain"></el-image>
              <el-button type="text" slot="reference">查看头像</el-button>
            </el-popover>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isAdd"></span>
            <el-button v-else type="text" @click="insertIntoGroup(scope.row)">选入</el-button>
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
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import { getUsersByProjectId } from "@/api/projects";
import { addUserInGroup } from "@/api/groups";
import { showMessage, genderJudge } from "@/utils/index";

export default {
  name: "prjGroupUserSelect",
  props: {
    projectId: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    groupUserIds: {
      type: Array,
      required: true
    },
    groupId: {
      type: Number,
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
      visibled: false,
      userList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalUsers: 0,
      tableHeight: window.innerHeight - 400,
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
        this.userList.forEach(user => {
          //增加一个属性判断是否已经添加到分组
          user.isAdd = false;
          if (
            this.groupUserIds.length > 0 &&
            this.groupUserIds.includes(user.id)
          ) {
            user.isAdd = true;
          }
        });
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

    //添加用户到分组
    insertIntoGroup(row) {
      row.isAdd = true;
      let data = {};
      data.groupId = this.groupId;
      data.projectId = this.projectId;
      data.userIds = [];
      data.userIds.push(row.userId);
      addUserInGroup(data)
        .then(resp => {})
        .catch(() => {
          showMessage(that, errorMsg, "添加到分组出错");
        });
    },
    returnVisible() {
      this.visibled = false;
      this.$emit("getVisible", this.visibled);
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
