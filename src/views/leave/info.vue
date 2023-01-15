<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        ><el-button type="primary" @click="btn" size="small">返回</el-button>
        <div class="box">
          <div class="left">
            <el-steps direction="vertical" :active="active" space="150px">
              <el-step
                title="提交申请"
                :description="leaveInfo.firsttime"
              ></el-step>
              <el-step title="待审核"></el-step>
              <el-step
                :title="leaveInfo.state | textTwo"
                :status="leaveInfo.state | colorTwo"
                :description="leaveInfo.secondtime"
              ></el-step>
            </el-steps>
          </div>
          <div class="right">
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item label="工号">{{
                leaveInfo.u_id
              }}</el-descriptions-item>
              <el-descriptions-item label="姓名">{{
                leaveInfo.name
              }}</el-descriptions-item>
              <el-descriptions-item label="类型" :span="2">{{
                leaveInfo.type | typeFilter
              }}</el-descriptions-item>
              <el-descriptions-item
                label="开始时间"
                :span="2"
                v-if="
                  leaveInfo.type === 1 ||
                  leaveInfo.type === 2 ||
                  leaveInfo.type === 3 ||
                  leaveInfo.type === 4
                "
                >{{ leaveInfo.starttime | getTime }}</el-descriptions-item
              ><el-descriptions-item
                label="结束时间"
                :span="2"
                v-if="
                  leaveInfo.type === 1 ||
                  leaveInfo.type === 2 ||
                  leaveInfo.type === 3 ||
                  leaveInfo.type === 4
                "
                >{{ leaveInfo.endtime | getTime }}</el-descriptions-item
              >
              <el-descriptions-item
                label="出差地址"
                :span="2"
                v-if="leaveInfo.type === 4"
                >{{ leaveInfo.addtions }}</el-descriptions-item
              ><el-descriptions-item
                label="详细地址"
                :span="2"
                v-if="leaveInfo.type === 4"
                >{{ leaveInfo.address }}</el-descriptions-item
              >
              <el-descriptions-item
                label="期望部门"
                :span="4"
                v-if="leaveInfo.type === 5"
                >{{ leaveInfo.department }}</el-descriptions-item
              >
              <el-descriptions-item
                label="申请资金"
                :span="4"
                v-if="leaveInfo.type === 7"
                >{{ leaveInfo.expenditure }}</el-descriptions-item
              >
              <el-descriptions-item label="理由" :span="4">{{
                leaveInfo.content
              }}</el-descriptions-item>
              <el-descriptions-item label="审批人" :span="2">
                {{ leaveInfo.approval }}
              </el-descriptions-item>
              <el-descriptions-item label="状态" :span="2">
                <el-tag :type="leaveInfo.state | colorType">{{
                  leaveInfo.state | screen
                }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        <div class="bottom" v-if="showBtn">
          <el-button type="danger" size="medium" @click="refuse"
            >拒绝</el-button
          >
          <el-button type="success" size="medium" @click="agree"
            >同意</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Approval, refuseApproval, getApproval } from "@/api/approval";
import typeList from "./type";
import format from "@/api/constant/staff"; //引入格式化
import { getLeaveId } from "@/api/leave";
export default {
  beforeRouteEnter(to, from, next) {
    if (from.path === "/approval") {
      next((vm) => {
        vm.showBtn = true;
      });
    } else {
      next();
    }
  },
  data() {
    return {
      id: null,
      leaveInfo: {},
      active: 2,
      showBtn: false,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getLeaveId();
  },
  methods: {
    btn() {
      this.$router.go(-1);
    },
    async getLeaveId() {
      const result = await getLeaveId(this.id);
      if (result.state !== 0) {
        this.active = 3;
      }
      this.leaveInfo = result;
    },
    async agree() {
      const { state } = await getApproval(this.id);
      if (state == 0) {
        try {
          await this.$confirm("确认同意请假吗?");
          await Approval({
            id: this.id,
            name: this.$store.getters.name,
          });
          this.$message.success("操作成功");
          this.getLeaveId();
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
    async refuse() {
      const { state } = await getApproval(this.id);
      if (state == 0) {
        try {
          await this.$confirm("确认拒绝请假吗?");
          await refuseApproval({
            id: this.id,
            name: this.$store.getters.name,
          });
          this.$message.success("操作成功");
          this.getLeaveId();
        } catch (error) {}
      } else if (state == 1) {
        this.$message.warning("已同意无需操作");
      } else if (state == 2) {
        this.$message.warning("已拒绝无需操作");
      } else {
        this.$message.warning("员工撤销请假无法操作");
      }
    },
  },
  filters: {
    textTwo(val) {
      const obj = format.stepTwo.find((item) => item.id === val);
      return obj ? obj.text : "结束";
    },
    colorTwo(val) {
      const obj = format.stepTwo.find((item) => item.id === val);
      return obj ? obj.value : "wait";
    },
    screen(val) {
      const obj = format.leaveType.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
    colorType(val) {
      const obj = format.colorType.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
    typeFilter(val) {
      const obj = typeList.typeList.find((item) => item.value === val);
      return obj ? obj.label : "未知";
    },
  },
};
</script>

<style scoped>
.title {
  text-align: center;
}
.box {
  margin-top: 20px;
  display: flex;
  /* display: flex;
  justify-content: right; */
}
.left {
  width: 10%;
}
.right {
  flex: 1;
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>