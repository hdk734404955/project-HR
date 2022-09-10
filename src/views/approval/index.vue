<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 公共组件 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ this.page.total }}条记录</span>
        <template slot="after">
          <el-checkbox v-model="checked" @change="Checked">待审批</el-checkbox>
          <el-checkbox v-model="checked1" @change="Checked1"
            >已同意</el-checkbox
          >
          <el-checkbox v-model="checked2" @change="Checked2"
            >已拒绝</el-checkbox
          >
          <el-checkbox v-model="checked3" @change="Checked3">撤销</el-checkbox>
        </template>
      </page-tools>
      <!-- 放置内容 -->
      <el-card>
        <el-table
          :data="approvalList"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column label="序号" align="center" type="index" width="100">
          </el-table-column>
          <el-table-column prop="u_id" label="工号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="name" label="请假人" align="center">
          </el-table-column>
          <el-table-column prop="approval" label="审批人" align="center">
          </el-table-column>
          <el-table-column prop="starttime" label="请假时间" align="center">
            <template v-slot="{ row }">
              {{ row.starttime | formatDate }}</template
            >
          </el-table-column>
          <el-table-column prop="state" label="状态" align="center">
            <template v-slot="{ row }">
              <el-tag :type="row.state | colorType">{{
                row.state | screen
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="agree(row.l_id)"
                >同意</el-button
              >
              <el-button type="text" size="small" @click="refuse(row.l_id)"
                >拒绝</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
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
  </div>
</template>
<script>
import { getLeave } from "@/api/leave";
import format from "@/api/constant/staff";
import {
  getApproval,
  Approval,
  refuseApproval,
  approvalWait,
  approvalAgree,
  approvalRefuse,
  approvalRepeal,
} from "@/api/approval";
import { getInfo } from "@/api/user";
export default {
  data() {
    return {
      approvalList: [], //接收审批列表
      //分页
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
      loading: false,
      checked: false,
      checked1: false,
      checked2: false,
      checked3: false,
      approvalInfo: {},
    };
  },
  //过滤器
  filters: {
    screen(val) {
      const obj = format.leaveType.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
    colorType(val) {
      const obj = format.colorType.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
  },
  created() {
    this.getInfo();
    this.getLeave();
  },
  methods: {
    //换页
    changePage(newPage) {
      this.page.page = newPage;
      this.getLeave();
    },
    //获取请假列表
    async getLeave() {
      this.loading = true;
      const { rows, total } = await getLeave(this.page);
      this.approvalList = rows;
      this.page.total = total;
      this.loading = false;
    },
    //获取审批人信息
    async getInfo() {
      this.approvalInfo = await getInfo();
    }, //同意请假
    async agree(id) {
      const { state } = await getApproval(id);
      if (state == 0) {
        try {
          await this.$confirm("确认同意请假吗?");
          await Approval({ id, name: this.approvalInfo.name });
          this.$message.success("操作成功");
          this.getLeave();
        } catch (error) {}
      } else if (state == 1) {
        this.$message.warning("已同意无需操作");
      } else if (state == 2) {
        this.$message.warning("已拒绝无需操作");
      } else {
        this.$message.warning("员工撤销请假无法操作");
      }
    },
    //拒绝请假
    async refuse(id) {
      const { state } = await getApproval(id);
      if (state == 0) {
        try {
          await this.$confirm("确认拒绝请假吗?");
          await refuseApproval({ id, name: this.approvalInfo.name });
          this.$message.success("操作成功");
          this.getLeave();
        } catch (error) {}
      } else if (state == 1) {
        this.$message.warning("已同意无需操作");
      } else if (state == 2) {
        this.$message.warning("已拒绝无需操作");
      } else {
        this.$message.warning("员工撤销请假无法操作");
      }
    },
    //待审批多选框
    async Checked() {
      if (this.checked) {
        const { rows, total } = await approvalWait(this.page);
        this.page.total = total;
        this.approvalList = rows;
      } else {
        this.getLeave();
      }
    },
    //已同意多选框
    async Checked1() {
      if (this.checked1) {
        const { rows, total } = await approvalAgree(this.page);
        this.page.total = total;
        this.approvalList = rows;
      } else {
        this.getLeave();
      }
    },
    //已拒绝多选框
    async Checked2() {
      if (this.checked2) {
        const { rows, total } = await approvalRefuse(this.page);
        this.page.total = total;
        this.approvalList = rows;
      } else {
        this.getLeave();
      }
    },
    //撤销多选框
    async Checked3() {
      if (this.checked3) {
        const { rows, total } = await approvalRepeal(this.page);
        this.page.total = total;
        this.approvalList = rows;
      } else {
        this.getLeave();
      }
    },
  },
};
</script>
<style scoped>
</style>