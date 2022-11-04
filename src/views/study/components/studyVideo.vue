<template>
  <div class="box">
    <div class="main" v-for="item in list" :key="item.id">
      <video
        ref="one"
        controls
        :src="item.url"
        @timeupdate="showVideo(item.v_id)"
      ></video>
      <el-alert
        title="已完成观看"
        type="success"
        :closable="false"
        v-if="item.type"
      >
      </el-alert>
    </div>
  </div>
</template>

<script>
import { getVideoId, editVideo } from "@/api/video";
export default {
  name: "MydesignStudyVideo",

  data() {
    return {
      list: [],
    };
  },

  created() {
    this.getVideoId();
  },
  mounted() {},

  methods: {
    async showVideo(id) {
      //   console.log(id);
      const myVideo = this.$refs.one;
      //   console.log(myVideo[id]);
      if (myVideo[id].currentTime >= myVideo[id].duration * 0.95) {
        await editVideo(id);
        this.getVideoId();
      }
      //   console.log(myVideo[id].duration * 0.95);
      //   console.log(myVideo[id].currentTime);
    },
    //根据用户ID获取视频列表
    async getVideoId() {
      const data = await getVideoId();
      this.list = data;
      //   console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
video {
  width: 500px;
  height: 300px;
  margin-top: 30px;
}
</style>