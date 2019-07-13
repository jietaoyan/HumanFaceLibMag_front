<template>
  <div>
    <el-dialog title="用户头像" :visible.sync="visibled" width="300px" @close="returnVisible">
        <hr />
        <img :src="imageUrl" :alt="photoName">
    </el-dialog>
    <div style="display:none">{{getVisible}}</div>
  </div>
</template>
<script>
export default {
  name: "userPhote",
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    photoName:{
        type:String,
        default:'无名'
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
