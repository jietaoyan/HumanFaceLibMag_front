<template>
  <div>
    <el-dialog title="选择项目分组" :visible.sync="visibled" width="400px" @close="returnVisible">
      <hr />
      <el-row>
        <el-col :span="24">
          <span>{{username}}</span>
        </el-col>
      </el-row>
      <div class="groups-table">
        <el-table
          v-loading="listLoading"
          :data="groupList"
          element-loading-text="加载中……"
          :height="tableHeight"
          fit
          highlight-current-row
        >
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">{{ scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column label="分组名称" prop="name" align="left"></el-table-column>
        </el-table>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isAdd"></span>
            <el-button v-else type="text" @click="insertIntoGroup(scope.row)">加入</el-button>
          </template>
        </el-table-column>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageIndex + 1"
          :page-sizes="[20, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalGroups"
        ></el-pagination>
      </div>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
import {
  getGroupsListPage,
  getGroupidsByUserId,
  addUserInGroup
} from "@/api/groups";
import { showMessage } from "@/utils/index";

export default {
  name: "prjGroupsUsers",
  props: {
    projectId: {
      type: String,
      required: true
    },
    userid:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required:true
    },
    userGroupids:{
      type:Array,
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
      visibled: false,
      groupList: [],
      pageInfo: {
        pageSize: 20,
        pageIndex: 0
      },
      totalGroups: 0,
      tableHeight: 600,
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
      getGroupsListPage(params).then(response => {
        this.groupList = response.data.data;
        this.totalGroups = response.data.totalCount;
        this.groupList.forEach(group => {
          //增加一个属性判断是否已经添加到分组
          group.isAdd = false;
          if (
            this.userGroupids.length > 0 &&
            this.userGroupids.includes(group.id)
          ) {
            group.isAdd = true;
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
      data.groupId = row.id;
      data.projectId = this.projectId;
      data.userIds = [];
      data.userIds.push(this.userid);
      addUserInGroup(data)
        .then(resp => {})
        .catch(() => {
          showMessage(that, '添加用户出错，请稍后再试', "error");
          row.isAdd = false;
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
