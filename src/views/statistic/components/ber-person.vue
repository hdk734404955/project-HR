<template>
  <div class="dashboard-container">
    <div class="ber" ref="berperson"></div>
    <!-- <div class="app-container">  
    </div> -->
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getDepartmentPerson } from "@/api/statistic";
export default {
  data() {
    return {};
  },
  //操作是异步并且返回primise,必须用异步操作依次执行才能渲染
  methods: {
    async getDepartmentPerson() {
      var myChart = echarts.init(this.$refs.berperson);
      const data = await getDepartmentPerson();
      myChart.setOption({
        title: {
          text: "各部门人数统计",
          left: "center",
        },
        xAxis: {
          type: "category",
          data: ["总裁办", "行政部", "人事部", "财务部", "技术部", "后勤部"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: data,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      });
    },
  },
  mounted() {
    this.getDepartmentPerson(); //调用方法
  },
};
</script>

<style scope>
.ber {
  width: 400px;
  height: 400px;
  /* background-color: aqua; */
}
</style>