<template>
  <div>
    <el-button type="primary" size="small" @click="showDig">我要留言</el-button>
    <!-- 表格  -->
    <el-table :data="messageList" border style="width: 100%; margin-top: 15px">
      <el-table-column label="序号" align="center" type="index" width="100">
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="120">
      </el-table-column>
      <el-table-column prop="department" label="所属部门" align="center">
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center">
      </el-table-column>
      <el-table-column prop="time" label="留言时间" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="{ row }">
          <el-button type="text" size="small" @click="repeal(row.id)"
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
    <!-- 弹层 -->
    <el-dialog title="留言" :visible.sync="showDialog" @close="cancel">
      <el-form
        :model="messageForm"
        label-position="right"
        label-width="80px"
        class="table"
        ref="messageForm"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input style="width: 220px" v-model="messageForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            style="width: 220px"
            v-model="messageForm.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="收信人" prop="select">
          <el-select
            v-model="messageForm.select"
            placeholder="请选择"
            style="left: -7px"
          >
            <el-option label="董事长" :value="1"></el-option>
            <el-option label="总经理" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-checkbox v-model="messageForm.checked">是否匿名</el-checkbox>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sumbit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMessage, getUserMessage, delUserMessage } from "@/api/affiche";
export default {
  name: "MydesignLeaveMessage",

  data() {
    return {
      showDialog: false,
      messageList: [],
      messageForm: {
        title: "",
        content: "",
        select: 1,
        checked: false,
      },
      //分页
      page: {
        page: 1,
        pagesize: 6,
        total: 0,
      },
      rules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getUserMessage();
  },

  methods: {
    //获取用户留言
    async getUserMessage() {
      const { rows } = await getUserMessage(this.page);
      this.messageList = rows;
    },
    showDig() {
      this.showDialog = true;
    },
    //关闭弹层
    cancel() {
      this.$refs.messageForm.resetFields();
      this.messageForm = {
        title: "",
        content: "",
        select: 1,
        checked: false,
      };
      this.showDialog = false;
    },
    //提交
    async sumbit() {
      try {
        await this.$refs.messageForm.validate(); //等待表单校验通过
        await addMessage(this.messageForm);
        this.$message.success("操作成功");
        this.getUserMessage();
        this.showDialog = false;
      } catch (error) {}
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getUserMessage();
    },
    //删除留言
    async repeal(id) {
      try {
        await this.$confirm("确定删除吗");
        await delUserMessage(id);
        this.$message.success("删除成功");
        this.getUserMessage();
      } catch (error) {}
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
</style>