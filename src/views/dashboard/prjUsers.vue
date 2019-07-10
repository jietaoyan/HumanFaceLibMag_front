<template>
  <div></div>
</template>
<script>
export default {
  name: "prjUsers",
  created() {
    this.projectId = this.$route.query.projectId;
  },
  data() {
    return {
      projectId: ""
    };
  },
  methods: {
      fetchData(){
          
      }
  }
};
</script>
<style lang="scss" scoped>
</style>
