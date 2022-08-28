<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <p>员工详情</p>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: 0,
    };
  },
  created() {
    this.id = this.$route.query.id; //获取用户ID
    console.log(this.id);
  },
};
</script>