<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        ><el-tabs v-model="activeName">
          <el-tab-pane label="公告管理" name="first"
            ><affiche></affiche>
          </el-tab-pane>
          <el-tab-pane
            label="个人信箱"
            name="second"
            v-if="checkPermission('email')"
            ><email></email>
          </el-tab-pane> </el-tabs
      ></el-card>
    </div>
  </div>
</template>

<script>
import affiche from "./components/affiche.vue";
import Email from "./components/email.vue";
export default {
  components: { affiche, Email },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style>
</style>