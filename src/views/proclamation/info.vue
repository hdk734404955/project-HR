<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <i class="el-icon-back" @click="btn" style="font-size: 25px"></i>
        <h2 class="title">{{ content.title }}</h2>
        <div>各位全体员工:</div>
        <div class="content">{{ content.content }}</div>
        <div class="foot">
          <p>发布人: {{ content.name }}</p>
          <p>部门: {{ content.department }}</p>
          <p>发布时间: {{ content.time }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getIdAffiche } from "@/api/affiche";
export default {
  data() {
    return {
      id: null,
      content: {},
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getIdAffiche();
  },
  methods: {
    async getIdAffiche() {
      this.content = await getIdAffiche(this.id);
    },
    //返回
    btn() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.title {
  text-align: center;
}
.content {
  text-indent: 2em;
  margin-top: 5px;
}
.foot {
  margin-top: 5px;
  text-align: right;
}
</style>