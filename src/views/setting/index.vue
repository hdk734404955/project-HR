<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                class="addbtn"
                @click="showDialog = true"
                :disabled="!checkPermission('add-role')"
                >新增角色</el-button
              >
            </el-row>
            <el-table border="" :data="list">
              <!-- 表格内容 type="index" 把ID变为序号-->
              <el-table-column
                type="index"
                label="序号"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="240"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="描述"
                align="center"
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button
                    type="success"
                    size="small"
                    @click="addPermission(row.id)"
                    :disabled="!checkPermission('distribution-per')"
                    >分配权限</el-button
                  ><el-button
                    type="primary"
                    size="small"
                    @click="editRole(row.id)"
                    :disabled="!checkPermission('edit-role')"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    @click="delbtn(row.id)"
                    :disabled="!checkPermission('del-role')"
                    >删除</el-button
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
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
                layout="prev,pager,next"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="warning"
              show-icon
              :closable="false"
              class="alert"
            >
              <!-- 提示消息组件 -->
            </el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyList.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyList.address"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyList.phone"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyList.mail"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  disabled
                  style="width: 400px"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  v-model="companyList.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹层组件 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        label-width="120px"
        :model="roleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row></el-dialog
    >
    <!-- 分配角色弹层 -->
    <el-dialog title="分配权限" :visible="showPer" @close="cancel">
      <!-- 树形结构 check-strictly="true"父子不相关 default-expand-all="true"默认展开树-->
      <el-tree
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
        ref="permTree"
      ></el-tree>
      <!-- 按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="5">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="addPer"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRole,
  getCompany,
  delRole,
  getRoleone,
  updateRole,
  addRole,
  addPermission,
  rolePermission,
} from "@/api/setting";
import { getPermission } from "@/api/permission";
import { toTree } from "@/utils/index";
export default {
  computed: {
    showTitle() {
      return this.roleForm.id ? "编辑部门" : "新增部门";
    },
  },
  data() {
    return {
      list: [], //保存表格数据
      companyList: {}, //保存公司数据
      page: {
        //分页数据
        page: 1,
        pagesize: 6,
        total: 0,
      },
      selectCheck: [], //用来记录当前权限点表示
      roleId: null, //用来记录当前ID
      permData: [], //接收权限数据
      defaultProps: {
        label: "name",
      }, //定义显示字段名称
      showPer: false, //分配权限弹层
      showDialog: false, //控制弹层显示
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRole(); //获取角色列表
    this.getCompany(); //获取公司信息
  },
  methods: {
    //获取角色列表
    async getRole() {
      const { total, rows } = await getRole(this.page);
      this.page.total = total;
      this.list = rows;
    },
    //获取公司信息
    async getCompany() {
      const data = await getCompany();
      this.companyList = data;
    },
    changePage(newPage) {
      //newPage是当前点击的页码
      this.page.page = newPage;
      this.getRole();
    },
    //删除功能
    async delbtn(id) {
      try {
        await this.$confirm("确定删除该角色吗");
        await delRole(id); //调用删除接口
        this.getRole();
        this.$message.success("删除角色成功");
      } catch (error) {}
    },
    //编辑功能
    async editRole(id) {
      this.roleForm = await getRoleone(id); //实现数据回写
      this.showDialog = true; //显示弹层
    },
    //取消按钮
    btnCancel() {
      //清空数据
      this.roleForm = {
        name: "",
        description: "",
      };
      //移除校验规则
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
    //确定按钮
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        //校验通过
        if (this.roleForm.id) {
          //有ID是编辑功能
          await updateRole(this.roleForm);
          this.$message.success("编辑成功");
        } else {
          //新增
          await addRole(this.roleForm);
          this.$message.success("新增成功");
        }

        this.getRole();

        this.showDialog = false;
      } catch (error) {}
    },
    //分配角色
    async addPermission(id) {
      this.permData = toTree(await getPermission(), null); //获取所有权限点并且转化为树形结构
      this.roleId = id;
      const { permission } = await rolePermission(id); //根据ID获取权限点
      this.selectCheck = permission.split(",");
      // this.selectCheck = result.map((item) => item.per_id);
      this.showPer = true;
    },
    //树形弹层取消按钮
    cancel() {
      this.selectCheck = [];
      this.showPer = false;
    },
    //树形弹层确定按钮
    async addPer() {
      //调用树组件方法
      await addPermission({
        id: this.roleId,
        perID: this.$refs.permTree.getCheckedKeys(),
      });
      this.$message.success("分配权限成功");
      this.showPer = false;
    },
  },
};
</script>
<style scoped>
.alert {
  margin-top: 15px;
  margin-bottom: -20px;
}
.addbtn {
  margin-top: 7px;
}
.row {
  margin-top: 22px;
}
</style>