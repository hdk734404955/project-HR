<template>
  <div>
    <el-row style="height: 60px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        class="addbtn"
        @click="showDialog = true"
        :disabled="!checkPermission('add-test')"
        >新增试题</el-button
      >
    </el-row>
    <el-table border="" :data="testList">
      <!-- 表格内容 type="index" 把ID变为序号-->
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="题目"
        width="200"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="A"
        label="A"
        width=""
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="B"
        label="B"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="C"
        label="C"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="D"
        label="D"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="answer"
        label="正确答案"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="small"
            @click="editTest(row.id)"
            :disabled="!checkPermission('edit-test')"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delbtn(row.id)"
            :disabled="!checkPermission('del-test')"
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
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-row>
    <!-- 弹层组件 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="testForm"
        label-width="120px"
        :model="testForm"
        :rules="rules"
      >
        <el-form-item label="试题名称" prop="title">
          <el-input v-model="testForm.title"></el-input>
        </el-form-item>
        <el-form-item label="A" prop="A">
          <el-input v-model="testForm.A"></el-input>
        </el-form-item>
        <el-form-item label="B" prop="B">
          <el-input v-model="testForm.B"></el-input>
        </el-form-item>
        <el-form-item label="C" prop="C">
          <el-input v-model="testForm.C"></el-input>
        </el-form-item>
        <el-form-item label="D" prop="D">
          <el-input v-model="testForm.D"></el-input>
        </el-form-item>
        <el-form-item label="正确答案" prop="answer">
          <el-input v-model="testForm.answer"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-row></el-dialog
    >
  </div>
</template>

<script>
import {
  getTestAllApi,
  addTestApi,
  getTestIdApi,
  editTestApi,
  delTestApi,
} from "@/api/test";
export default {
  name: "MydesignTestManger",

  data() {
    return {
      testForm: {
        title: "",
        A: "",
        B: "",
        C: "",
        D: "",
        answer: "",
      },
      page: {
        //分页数据
        page: 1,
        pagesize: 6,
        total: 0,
      },
      testList: [],
      showDialog: false,
      rules: {
        title: { required: true, message: "试题名称不能为空", trigger: "blur" },
        A: { required: true, message: "A选项不能为空", trigger: "blur" },
        B: { required: true, message: "B选项不能为空", trigger: "blur" },
        C: { required: true, message: "C选项不能为空", trigger: "blur" },
        D: { required: true, message: "D选项不能为空", trigger: "blur" },
        answer: {
          required: true,
          message: "正确答案不能为空",
          trigger: "blur",
        },
      },
    };
  },
  computed: {
    showTitle() {
      return this.testForm.id ? "编辑试题" : "新增试题";
    },
  },
  created() {
    this.getTestAll();
  },

  methods: {
    changePage(newPage) {
      //newPage是当前点击的页码
      this.page.page = newPage;
      this.getTestAll();
    },
    //获取数据
    async getTestAll() {
      const data = await getTestAllApi(this.page);
      this.testList = data.data;
      this.page.total = data.total;
    },
    //取消按钮
    btnCancel() {
      //清空数据
      this.testForm = {
        title: "",
        A: "",
        B: "",
        C: "",
        D: "",
        answer: "",
      };
      //移除校验规则
      this.$refs.testForm.resetFields();
      this.showDialog = false;
    },
    //确定按钮
    async btnOK() {
      try {
        await this.$refs.testForm.validate();
        //校验通过
        if (this.testForm.id) {
          //有ID是编辑功能
          await editTestApi(this.testForm);
          this.$message.success("编辑成功");
        } else {
          //新增
          await addTestApi(this.testForm);
          this.$message.success("新增成功");
        }

        this.getTestAll();

        this.showDialog = false;
      } catch (error) {}
    },
    //编辑按钮
    async editTest(id) {
      this.testForm = await getTestIdApi(id);
      this.showDialog = true;
    },
    //删除功能
    async delbtn(id) {
      try {
        await this.$confirm("确定删除该试题吗");
        await delTestApi(id); //调用删除接口
        this.getTestAll();
        this.$message.success("删除成功");
      } catch (error) {}
    },
  },
};
</script>

<style  scoped>
.addbtn {
  margin-top: 7px;
}
</style>