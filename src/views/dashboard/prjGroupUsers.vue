<template>
  <div>
    <el-dialog title="分组用户列表" :visible.sync="visibled" width="700px" height="800px" @close="returnVisible">
        <hr />
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
export default {
  name: "prjGroupUsers",
  props: {
    projectId: {
      type: String,
      required: true
    },
    groupId:{
        type:String,
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
      visibled: false
    };
  },
  methods: {
    returnVisible() {
      this.$emit("getVisible", this.visibled);
    }
  },
  computed: {
    getVisible() {
      this.visibled = this.dialogVisible;
      return this.dialogVisible;
    }
  }
};
</script>
