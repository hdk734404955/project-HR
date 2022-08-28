<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPer(1, null)"
            :disabled="!checkPermission('add-per')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- 添加按钮只在访问权层级显示 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPer(2, row.id)"
              :disabled="!checkPermission('add-per')"
              >添加</el-button
            >
            <el-button
              type="text"
              @click="updatePer(row.id)"
              :disabled="!checkPermission('edit-per')"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="delPer(row.id)"
              :disabled="!checkPermission('del-per')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹层组件 -->
    <el-dialog :visible="showDialog" :title="showTitle" @close="btnCancel">
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formData"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            style="width: 90%"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPermission,
  getPermissionOne,
  addPermission,
  delPermission,
  putPermission,
} from "@/api/permission";
import { toTree } from "@/utils/index";
export default {
  computed: {
    showTitle() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  data() {
    return {
      list: [],
      showDialog: false, //弹层显示
      formData: {
        name: "",
        code: "",
        type: "",
        pid: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getPermission(); //调用接口
  },
  methods: {
    async getPermission() {
      //将数据转化成树形结构
      this.list = toTree(await getPermission(), null);
    },
    //删除按钮
    delPer(id) {
      this.$confirm("确认删除改权限吗")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.$message.success("删除成功");
          this.getPermission();
        })
        .catch(() => {
          // console.log("取消操作");
        });
    },
    //添加按钮
    addPer(type, pid) {
      //type类型,pie父节点的id
      this.formData.type = type;
      this.formData.pid = pid;
      this.showDialog = true;
    },
    //编辑
    async updatePer(id) {
      this.formData = await getPermissionOne(id);
      this.showDialog = true;
    },
    //确定按钮
    btnOK() {
      //表单校验通过
      this.$refs.formData
        .validate()
        .then(() => {
          //校验成功
          if (this.formData.id) {
            //编辑
            return putPermission(this.formData);
          }
          return addPermission(this.formData); //新增接口
        })
        .then(() => {
          this.$message.success("操作成功");
          this.getPermission();
          this.showDialog = false;
        });
    },
    //取消按钮
    btnCancel() {
      //还原数据
      this.formData = {
        name: "",
        code: "",
        type: "",
        pid: "",
        description: "",
      };
      //移除校验
      this.$refs.formData.resetFields();
      this.showDialog = false;
    },
  },
};
</script>