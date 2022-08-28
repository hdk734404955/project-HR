<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 全局组件 --><page-tools :show-before="true" class="top">
        <span slot="before">共{{ this.page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">Excel导入</el-button>
          <el-button size="small" type="danger">Excel导出</el-button>
        </template>
      </page-tools>
      <!-- 表格和分页 -->
      <el-card>
        <el-table border v-loading="loading" :data="list">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="头像" align="center" prop="head_img">
            <template slot-scope="scope">
              <el-image
                class="img"
                :src="scope.row.head_img ? scope.row.head_img : defultImg"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="工号" align="center" prop="id" />
          <el-table-column label="部门" align="center" prop="department" />
          <el-table-column label="入职时间" align="center" prop="time">
            <!-- 利用过滤器格式化时间格式 -->
            <template v-slot="{ row }"> {{ row.time | formatDate }}</template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            prop="state"
            :formatter="format"
          />
          <el-table-column
            label="操作"
            fixed="right"
            width="280"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="selectInfo(row.id)"
                :disabled="!checkPermission('see-staff')"
                >查看</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="becomeWorker(row.id)"
                :disabled="!checkPermission('regular-staff')"
                >转正</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="changePost(row.id)"
                :disabled="!checkPermission('post-staff')"
                >调岗</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="changeWage(row.id)"
                :disabled="!checkPermission('money-staff')"
                >调薪</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="addRole(row.id)"
                :disabled="!checkPermission('role-staff')"
                >角色</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="delStaff(row.id)"
                :disabled="!checkPermission('expel-staff')"
                >开除</el-button
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
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="formData"
        label-width="258px"
        :model="formData"
        :rules="rules"
        label-position="right"
      >
        <el-form-item label="工号">
          <el-input
            v-model="formData.id"
            disabled
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="formData.name"
            disabled
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="工资" v-if="num" prop="wages">
          <el-input v-model="formData.wages" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department" v-else>
          <el-input
            @focus="getDepartment"
            v-model="formData.department"
            style="width: 200px"
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
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row></el-dialog
    >
    <!-- 放置增加角色弹层 -->
    <AddRole
      ref="addRole"
      :showRoleDialog.sync="showRole"
      :userId="userId"
    ></AddRole>
  </div>
</template>
<script>
import { getDepartment } from "@/api/department";
import { toTree } from "@/utils";
import {
  getStaff,
  delStaff,
  getStaffone,
  staffPost,
  putstaff,
} from "@/api/staff";
import format from "@/api/constant/staff";
import AddRole from "./components/add-role.vue";
export default {
  computed: {
    showTitle() {
      return this.num ? "调薪" : "调岗";
    },
  },
  data() {
    return {
      defultImg: require("@/assets/common/bigUserHeader.png"),
      list: [],
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
      tree: [],
      //表单数据
      formData: {
        id: "",
        name: "",
        department: "",
        wages: "",
      },
      showTree: false,
      loading: false,
      num: null,
      showDialog: false, //弹层
      showRole: false, //角色弹层
      userId: null,
      rules: {
        department: [
          { required: true, message: "部门不能为空", trigger: "blur" }, //表单验证规则
        ],
        wages: [{ required: true, message: "工资不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getStaff(); //获取角色列表
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getStaff();
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
    async getStaff() {
      //调用接口
      this.loading = true; //打开进度条
      const { total, rows } = await getStaff(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false; //关闭进度条
    },
    //格式化状态
    format(row, column, cellValue, index) {
      const obj = format.stateType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    //开除角色
    async delStaff(id) {
      try {
        await this.$confirm("确认开除吗");
        await delStaff(id);
        this.getStaff();
        this.$message.success("开除成功");
      } catch (error) {}
    },
    //调岗
    async changePost(id) {
      this.num = 0;
      this.formData = await getStaffone(id); //数据回写
      this.showDialog = true;
    },
    //树形结构结点赋值
    selectNode(node) {
      this.formData.department = node.name;
      this.showTree = false;
    },
    //调薪
    async changeWage(id) {
      this.num = 1;
      this.formData = await getStaffone(id); //数据回写
      this.showDialog = true;
    },
    //转正
    async becomeWorker(id) {
      const result = await getStaffone(id);
      if (result.state === 0) {
        try {
          await this.$confirm("是否转正");
          await putstaff(id);
          this.$message.success("转正成功");
          this.getStaff();
        } catch (error) {}
      } else {
        this.$message.warning("已是正式员工,无需转正");
      }
    },
    //查看员工详情
    selectInfo(id) {
      this.$router.push(`/staff/info/${id}`);
    },
    //分配角色
    async addRole(id) {
      this.userId = id;
      await this.$refs.addRole.getStaffone(id); //调用子组件方法
      this.showRole = true;
    },
    //取消按钮
    btnCancel() {
      //清空数据
      this.formData = {
        id: "",
        name: "",
        department: "",
        wages: "",
      };
      //移除校验规则
      this.$refs.formData.resetFields();
      this.num = null;
      this.showTree = false;
      this.loading = false;
      this.showDialog = false;
    },
    //确定按钮
    async btnOK() {
      try {
        await this.$refs.formData.validate(); //等待表单校验通过
        if (this.num) {
          //调薪
          await staffPost(this.formData);
          this.$message.success("操作成功");
        } else {
          //调岗
          await staffPost(this.formData);
          this.$message.success("操作成功");
        }
        this.getStaff();
        this.showDialog = false;
        this.num = null;
      } catch (error) {}
    },
  },
  components: { AddRole },
};
</script>
<style scoped>
.img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
/* .row {
  margin-top: 15px;
} */
.top {
  margin-top: 0px;
}
</style>