<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="数据日志" name="first"></el-tab-pane>
          <el-tab-pane label="图表统计" name="second"
            ><div class="box">
              <pie-wages></pie-wages> <ber-person></ber-person></div
          ></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import BerPerson from "./components/ber-person.vue";
import pieWages from "./components/pie-wages.vue";
export default {
  components: { pieWages, BerPerson },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>
<style scoped>
.box {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>