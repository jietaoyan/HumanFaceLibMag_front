<template>
  <div class="version-container">
    <div class="version-title">版本信息</div>
    <div class="version-table">
      <el-row>
        <el-col :span="4">
          <span class="row-title">人脸算法库版本</span>
        </el-col>
        <el-col :span="15">
          <div>{{faceVersion}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="row-title">SDK剩余试用天数</span>
        </el-col>
        <el-col :span="15">
          <div>{{avaDays}} 天</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="row-title">特征值数组大小</span>
        </el-col>
        <el-col :span="15">
          <div>{{featrueSize}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFaceVersion,getFaceAvaDays,getFeatureSize } from "@/api/face";

export default {
  name: "faceVersion",
  data() {
    return {
      faceVersion:'',
      avaDays:'',
      featrueSize:''
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getFaceVersion().then(response => {
          this.faceVersion = response.data.version
      });
      getFaceAvaDays().then(response => {
          this.avaDays = response.data.days
      });
      getFeatureSize().then(response => {
          this.featrueSize = response.data.featureSize
      });
    },
    
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.version {
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