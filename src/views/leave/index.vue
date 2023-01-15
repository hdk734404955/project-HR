<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ this.page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="primary" @click="addApply"
            >新增申请</el-button
          >
        </template>
      </page-tools>
      <el-card>
        <el-table :data="leaveList" border style="width: 100%">
          <el-table-column label="序号" align="center" type="index" width="100">
          </el-table-column>
          <el-table-column prop="u_id" label="工号" align="center" width="120">
          </el-table-column>
          <el-table-column prop="name" label="申请人" align="center">
          </el-table-column>
          <el-table-column prop="firsttime" label="申请时间" align="center">
          </el-table-column>
          <el-table-column prop="type" label="类型" align="center">
            <template v-slot="{ row }">
              {{ row.type | typeFilter }}
            </template>
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
              <el-button type="text" size="small" @click="select(row.l_id)"
                >查看</el-button
              >
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
    <el-dialog title="新增" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form
        :model="userForm"
        label-position="right"
        label-width="80px"
        class="table"
        :rules="rules"
        ref="userForm"
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="userForm.type" placeholder="请选择类型" clearable>
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请假类型" prop="apply" v-if="userForm.type === 1">
          <el-select
            v-model="userForm.apply"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="item in applyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="出差地址"
          v-if="userForm.type === 4"
          prop="addtions"
        >
          <el-cascader
            clearable
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" v-if="userForm.type === 4">
          <el-input
            type="textarea"
            v-model="userForm.address"
            style="width: 220px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="意向部门"
          prop="department"
          v-if="userForm.type === 5"
        >
          <el-input
            @focus="getDepartment"
            v-model="userForm.department"
            style="width: 220px"
          >
          </el-input>
          <!-- 树形组件 -->
          <el-tree
            v-if="showTree"
            v-loading="loading"
            :data="tree"
            :props="{ label: 'name' }"
            :default-expand-all="true"
            @node-click="selectNode"
          ></el-tree>
        </el-form-item>
        <el-form-item
          label="申请经费"
          prop="expenditure"
          v-if="userForm.type === 7"
        >
          <el-input v-model="userForm.expenditure" style="width: 220px">
          </el-input>
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="starttime"
          v-if="
            userForm.type === 1 ||
            userForm.type === 2 ||
            userForm.type === 3 ||
            userForm.type === 4
          "
        >
          <el-date-picker
            type="datetime"
            placeholder="选择开始时间"
            v-model="userForm.starttime"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="endtime"
          v-if="
            userForm.type === 1 ||
            userForm.type === 2 ||
            userForm.type === 3 ||
            userForm.type === 4
          "
        >
          <el-date-picker
            type="datetime"
            placeholder="选择结束时间"
            value-format="timestamp"
            v-model="userForm.endtime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="理由" prop="content">
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
import { getDepartment } from "@/api/department";
import { toTree } from "@/utils";
import { regionData, CodeToText } from "element-china-area-data";
import format from "@/api/constant/staff"; //引入格式化
import typeList from "./type";
import { addLeave, getLeaveInfo, repealLeave, getLeaveId } from "@/api/leave";
import { getApproval } from "@/api/approval";
export default {
  data() {
    return {
      userForm: {
        starttime: null,
        endtime: null,
        content: "",
        type: "",
        apply: null,
        addtions: "",
        address: "",
        department: "",
        expenditure: "",
        day: null,
      },
      showTree: false,
      loading: false,
      tree: [],
      options: regionData,
      selectedOptions: [],
      typeList: typeList.typeList,
      applyList: typeList.applyList,
      dialogFormVisible: false, //弹层显示
      //加班弹层控制
      //请假列表
      leaveList: [],
      //分页
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
      leaveInfo: {},
      //校验规则
      rules: {
        addtions: [
          { required: true, message: "地址不能为空", trigger: "blur" },
        ],
        apply: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        starttime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endtime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "理由不能为空", trigger: "blur" }],
        department: [
          { required: true, message: "部门不能为空", trigger: "change" }, //表单验证规则
        ],
        expenditure: [
          { required: true, message: "经费不能为空", trigger: "blur" }, //表单验证规则
        ],
      },
    };
  },
  created() {
    this.getLeaveInfo();
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
    typeFilter(val) {
      const obj = typeList.typeList.find((item) => item.value === val);
      return obj ? obj.label : "未知";
    },
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getLeaveInfo();
    },
    handleChange(value) {
      //我们选择地址后，selectedOptions 会保存对应的区域码，例如北京的区域码为'110000'
      //我们要取出区域码对应的汉字，就需要用CodeToText(区域码)进行输出
      var name = "";
      this.selectedOptions.map((item) => (name += CodeToText[item]));
      this.userForm.addtions = name;
    },
    //查看请假
    async select(id) {
      this.$router.push(`/leave/info/${id}`);
    },
    //获取部门
    async getDepartment() {
      this.showTree = true;
      this.loading = true;
      const result = await getDepartment();
      //转化为树形结结构
      this.tree = toTree(result, null);
      this.loading = false;
    },
    //树形结构结点赋值
    selectNode(node) {
      this.userForm.department = node.name;
      this.showTree = false;
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
        if (this.userForm.starttime && this.userForm.endtime) {
          const start = this.userForm.starttime;
          const end = this.userForm.endtime;
          const day = Math.floor((end - start) / (1000 * 3600 * 24));
          this.userForm.day = day;
        }
        await addLeave(this.userForm);
        this.dialogFormVisible = false;
        this.$message.success("提交成功");
        this.getLeaveInfo();
      } catch (error) {}
    },
    //新增请假菜单
    addApply() {
      this.dialogFormVisible = true;
    },
    //取消按钮
    cancel() {
      //移除校验规则
      (this.userForm = {
        starttime: null,
        endtime: null,
        content: "",
        type: "",
        apply: null,
        addtions: "",
        address: "",
        department: "",
        expenditure: "",
        day: null,
      }),
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
<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.center {
  div {
    margin-top: 10px;
  }
  // .content {
  //   width: 300px;
  //   // height: 200px;
  //   text-align: center;
  //   background-color: palegreen;
  // }
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>