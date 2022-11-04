<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="视频学习" name="first"
            ><study-video></study-video>
          </el-tab-pane>
          <el-tab-pane label="考试测验" name="second">
            <study-text></study-text>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import StudyText from "./components/studyText.vue";
import studyVideo from "./components/studyVideo.vue";

export default {
  components: { studyVideo, StudyText },
  name: "MydesignIndex",

  data() {
    return {
      activeName: "first",
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>