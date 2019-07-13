<template>
  <div class="prjme-container">
    <div class="prjme-title">所属项目信息</div>
    <div class="prjme-table">
      <el-row>
        <el-col :span="3">
          <span class="row-title">项目编号</span>
        </el-col>
        <el-col :span="15">
          <div>{{project.projectId}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span class="row-title">项目名称</span>
        </el-col>
        <el-col :span="15">
          <div>{{project.projectName}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span class="row-title">数量</span>
        </el-col>
        <el-col :span="15">
          <div>{{project.count}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span class="row-title">简介</span>
        </el-col>
        <el-col :span="15">
          <div>{{project.introduction}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { prjOfMe } from "@/api/projects";

export default {
  name: "prjme",
  created() {
    this.fetchData();
  },
  data() {
    return {
      project: {}
    };
  },
  methods: {
    fetchData() {
      prjOfMe().then(response => {
        this.project = response.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.prjme {
  &-container {
    margin: 30px;
  }
  &-title {
    font-size: 30px;
    line-height: 46px;
  }
  &-table {
    .el-row {
      padding: 10px 10px;
      font-size: 18px;
    }
    .row-title {
      font-weight: bold;
    }
  }
}
</style>
