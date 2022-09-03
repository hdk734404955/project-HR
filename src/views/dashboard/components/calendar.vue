<template>
  <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <el-select
        v-model="nowYear"
        size="small"
        style="width: 120px"
        @change="dateChange"
      >
        <!-- 年 -->
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        v-model="nowMonth"
        size="small"
        style="width: 120px; margin-left: 10px"
        @change="dateChange"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        ></el-option
      ></el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="nowDate" class="calendar">
      <!-- data当前单元格日期 -->
      <template v-slot:dateCell="{ date, data }" class="content"
        ><div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  filters: {
    getDay(value) {
      const day = value.split("-")[2];
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
  data() {
    return {
      yearList: [], //要遍历的年的数组
      nowYear: null, //当前年份
      nowMonth: null, //当前月份
      nowDate: null, //当前时间
      nowDay: null,
    };
  },
  created() {
    //获取当前年份
    this.nowYear = this.startDate.getFullYear(); //得到当前年份
    this.nowMonth = this.startDate.getMonth() + 1;
    this.nowDay = this.startDate.getDate();
    // console.log(this.nowDay, "666");
    //生成数组
    this.yearList = Array.from(Array(11), (v, i) => this.nowYear + i - 5);
    this.dateChange(); //主动调用方法
  },
  methods: {
    dateChange() {
      //生成新的日期
      this.nowDate = new Date(
        `${this.nowYear}-${this.nowMonth}-${this.nowDay}`
      );
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
};
</script>

<style  scoped>
div/deep/ .el-calendar-day {
  height: auto;
}
div/deep/ .el-calendar-table__row td,
div/deep/ .el-calendar-table tr td:first-child,
div/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
div/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
div/deep/.el-calendar__header {
  display: none;
}
/* .calendar {
  height: 300px;
}
.calendar.el-calendar__header {
  display: none;
} */
</style>