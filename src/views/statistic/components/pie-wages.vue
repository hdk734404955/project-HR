<template>
  <div class="dashboard-container">
    <div class="pie" ref="piewages"></div>
    <!-- <div class="app-container">  
    </div> -->
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getWages } from "@/api/statistic";
export default {
  data() {
    return {};
  },
  //操作是异步并且返回primise,必须用异步操作依次执行才能渲染
  methods: {
    async getWages() {
      var myChart = echarts.init(this.$refs.piewages);
      const data = await getWages();
      myChart.setOption({
        title: {
          text: "不同阶段工资人数统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "人数",
            type: "pie",
            radius: "50%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
  mounted() {
    this.getWages();
  },
};
</script>

<style scope>
.pie {
  width: 500px;
  height: 500px;
  /* background-color: aqua; */
}
</style>