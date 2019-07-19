<template>
  <div class="detect-main">
    <el-tabs v-model="activeName">
      <el-tab-pane label="人脸检测" name="first">
        <face-detect></face-detect>
      </el-tab-pane>
      <el-tab-pane label="人脸比对" name="second">
        <face-compare></face-compare>
      </el-tab-pane>
      <el-tab-pane label="人脸匹配" name="third">
        <face-search></face-search>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import faceDetect from "./faceDetect";
import faceSearch from "./faceSearch";
import faceCompare from "./faceCompare";
export default {
  name: "detect",
  components: {
    faceDetect,
    faceSearch,
    faceCompare
  },
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.detect-main {
  padding: 10px 30px;
}
</style>
