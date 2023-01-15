<template>
  <div>
    <el-table :data="messageList" border style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="100">
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center">
      </el-table-column>
      <el-table-column prop="time" label="留言时间" align="center">
      </el-table-column>
      <el-table-column prop="checked" label="是否匿名" align="center">
        <template v-slot="{ row }"> {{ row.checked | screen }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button type="text" size="small" @click="select(row.id)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row
      type="flex"
      justify="center"
      align="middle"
      style="height: 60px"
      class="row"
    >
      <el-pagination
        :current-page="page.page"
        :page-size="page.pagesize"
        :total="page.total"
        @current-change="changePage"
        layout="prev, pager, next"
      />
    </el-row>
    <!-- 抽屉 -->
    <el-drawer
      title="个人信箱"
      :visible.sync="drawer"
      :direction="direction"
      size="40%"
    >
      <div class="box">
        <p>{{ messageRole.name }}</p>
        <p>{{ messageRole.department }}</p>
        <p>{{ `标题: ${messageRole.title}` }}</p>
        <p>{{ `内容: ${messageRole.content}` }}</p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getRoleMessage, getIdMessage } from "@/api/affiche";
import format from "@/api/constant/staff";
export default {
  name: "MydesignEmail",

  data() {
    return {
      //分页
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
      messageList: [],
      drawer: false,
      direction: "ttb",
      messageRole: {},
      //开关
      show: null,
    };
  },

  created() {
    this.getRoleMessage();
  },
  //过滤器
  filters: {
    screen(val) {
      const obj = format.cryptonym.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getRoleMessage();
    },
    //获取数据
    async getRoleMessage() {
      const { rows } = await getRoleMessage(this.page);
      this.messageList = rows;
    },
    async select(id) {
      this.messageRole = null;
      this.drawer = true;
      const result = await getIdMessage(id);
      if (Boolean(result.checked)) {
        this.messageRole = {
          title: result.title,
          content: result.content,
          time: result.time,
        };
      } else {
        this.messageRole = result;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>