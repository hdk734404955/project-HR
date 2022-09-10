<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <div class="box"><pie-wages></pie-wages> <ber-person></ber-person></div>
      </el-card>
    </div>
  </div>
</template>
<script>
import BerPerson from "./components/ber-person.vue";
import pieWages from "./components/pie-wages.vue";
export default {
  components: { pieWages, BerPerson },
};
</script>
<style scoped>
.box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>