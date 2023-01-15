<template>
  <div>
    <el-button
      class="btn"
      type="primary"
      size="small"
      @click="showDialog"
      :disabled="!checkPermission('add-affiche')"
      >发布公告</el-button
    >
    <!-- 表单 -->
    <el-table :data="afficheList" border style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="100">
      </el-table-column>
      <el-table-column prop="u_id" label="工号" align="center" width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="120">
      </el-table-column>
      <el-table-column
        prop="department"
        label="部门"
        align="center"
        width="120"
      >
      </el-table-column>

      <el-table-column prop="time" label="时间" align="center" width="130">
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center" width="220">
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="{ row }">
          <el-button
            type="text"
            size="small"
            @click="select(row.id)"
            :disabled="!checkPermission('watch-affiche')"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="edit(row.id)"
            :disabled="!checkPermission('edit-affiche')"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="del(row.id)"
            :disabled="!checkPermission('del-affiche')"
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
        :current-page="page.page"
        :page-size="page.pagesize"
        :total="page.total"
        @current-change="changePage"
        layout="prev, pager, next"
      />
    </el-row>
    <!-- 弹层组件 -->
    <el-dialog
      :title="showTitle"
      :visible.sync="dialogFormVisible"
      @close="cancel"
    >
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
            v-model="userForm.u_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.department"
          ></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            style="width: 220px"
            v-model="userForm.title"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="发布内容" prop="content">
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
import {
  addAffiche,
  getAfficheID,
  getIdAffiche,
  editAffiche,
  delAffiche,
} from "@/api/affiche";
export default {
  name: "MydesignAffiche",
  data() {
    return {
      dialogFormVisible: false,
      userForm: {
        u_id: this.$store.state.user.userInfo.id,
        name: this.$store.state.user.userInfo.name,
        department: this.$store.state.user.userInfo.department,
        title: "",
        content: "",
      },
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
      },
      afficheList: [],
      //分页
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
    };
  },
  computed: {
    showTitle() {
      return this.userForm.title ? "编辑公告" : "发布公告";
    },
  },
  created() {
    // console.log(Boolean(this.userForm.title));
    this.getAfficheID();
  },
  methods: {
    //换页
    changePage(newPage) {
      this.page.page = newPage;
      this.getAfficheID();
    },
    //关闭弹层
    cancel() {
      this.userForm = {
        ...this.userForm,
        title: "",
        content: "",
        type: null,
      };
      //移除校验规则
      this.$refs.userForm.resetFields();
      this.dialogFormVisible = false;
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    sumbit() {
      //等待表单校验通过
      this.$refs.userForm
        .validate()
        .then(() => {
          if (this.userForm.type) {
            return editAffiche(this.userForm);
          }
          return addAffiche(this.userForm);
        })
        .then(() => {
          this.$message.success("操作成功");
          this.getAfficheID();
          this.dialogFormVisible = false;
        });
    },
    //获取列表
    async getAfficheID() {
      const { rows, total } = await getAfficheID(this.page);
      this.afficheList = rows;
      this.page.total = total;
    },
    //查看
    select(id) {
      this.$router.push(`/proclamation/info?id=${id}`);
    },
    //编辑
    async edit(id) {
      this.userForm = await getIdAffiche(id);
      this.dialogFormVisible = true;
    },
    //删除
    del(id) {
      this.$confirm("确认删除吗")
        .then(() => {
          delAffiche(id).then(() => {
            this.getAfficheID();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
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

.btn {
  margin-bottom: 16px;
}
</style>