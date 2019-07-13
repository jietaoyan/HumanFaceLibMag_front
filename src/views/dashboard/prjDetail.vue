<template>
  <div>
    <el-dialog title="详细信息" :visible.sync="visibled" width="500px" @close="returnVisible">
      <hr />
      <el-row>
        <el-col :span="6">
          <span>项目编号</span>
        </el-col>
        <el-col :span="18">
          <div>{{projectDetail.projectId}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <span>项目名称</span>
        </el-col>
        <el-col :span="18">
          <div>{{projectDetail.projectName}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <span>数量</span>
        </el-col>
        <el-col :span="18">
          <div>{{projectDetail.count}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <span>简介</span>
        </el-col>
        <el-col :span="18">
          <div>{{projectDetail.introduction}}</div>
        </el-col>
      </el-row>
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
export default {
  name: "prjDetail",
  props: {
    projectDetail: {
      type: Object,
      requeir: true
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      visibled:false
    };
  },
  methods:{
    returnVisible(){
      this.$emit('getVisible',this.visibled)
    }
  },
  computed:{
    getVisible(){
      this.visibled = this.dialogVisible
      return this.dialogVisible
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
