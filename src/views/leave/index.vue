<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ this.page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="primary" @click="addL"
            >新增请假</el-button
          >
        </template>
      </page-tools>
      <el-card>
        <el-table :data="leaveList" border style="width: 100%">
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
              <el-button type="text" size="small" @click="repeal(row.l_id)"
                >撤销</el-button
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
      </el-card>
    </div>
    <!-- 弹层组件 -->
    <el-dialog title="请假" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form
        :model="userForm"
        label-position="right"
        label-width="80px"
        class="table"
        :rules="rules"
        ref="userForm"
      >
        <el-form-item label="工号">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.id"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="starttime">
          <el-date-picker
            type="datetime"
            placeholder="选择开始时间"
            v-model="userForm.starttime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-date-picker
            type="datetime"
            placeholder="选择结束时间"
            v-model="userForm.endtime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假理由" prop="content">
          <el-input
            type="textarea"
            v-model="userForm.content"
            style="width: 220px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import format from "@/api/constant/staff"; //引入格式化
import { getInfo } from "@/api/user";
import { addLeave, getLeaveInfo, repealLeave } from "@/api/leave";
import { getApproval } from "@/api/approval";
export default {
  data() {
    return {
      userForm: {
        id: "",
        name: "",
        starttime: "",
        endtime: "",
        content: "",
      },
      dialogFormVisible: false, //弹层显示
      //请假列表
      leaveList: [],
      //分页
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
      //校验规则
      rules: {
        starttime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endtime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请假理由不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getLeaveInfo();
    this.getInfo();
  },
  //过滤器格式化审核状态
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
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getLeaveInfo();
    },
    async getInfo() {
      //数据回写
      this.userForm = await getInfo();
    },
    async getLeaveInfo() {
      const { total, rows } = await getLeaveInfo(this.page);
      this.leaveList = rows;
      this.page.total = total;
    },
    //提交信息
    async sumbit() {
      try {
        await this.$refs.userForm.validate(); //等待表单校验通过
        await addLeave(this.userForm);
        this.dialogFormVisible = false;
        this.$message.success("请假申请提交成功");
        this.getLeaveInfo();
      } catch (error) {}
    },
    //新增请假菜单
    addL() {
      this.dialogFormVisible = true;
    },
    //取消按钮
    cancel() {
      //移除校验规则
      this.$refs.userForm.resetFields();
      this.dialogFormVisible = false;
    },
    //撤销按钮
    async repeal(id) {
      const { state } = await getApproval(id);
      if (state == 0) {
        try {
          await this.$confirm("确定撤销吗");
          await repealLeave(id);
          this.$message.success("撤销成功");
          this.getLeaveInfo();
        } catch (error) {}
      } else {
        this.$message.warning("无法操作");
      }
    },
  },
};
</script>
<style  scoped>
.table {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>