<template>
  <div>
    <el-button class="btn" type="primary" size="small" @click="showText"
      >开始测验</el-button
    >
    <el-table :data="gradeList" border style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="100">
      </el-table-column>
      <el-table-column prop="u_id" label="工号" align="center" width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="130">
      </el-table-column>
      <el-table-column
        prop="department"
        label="部门"
        align="center"
        width="130"
      >
      </el-table-column>
      <el-table-column prop="time" label="提交时间" align="center">
      </el-table-column>
      <el-table-column prop="score" label="分数" align="center">
      </el-table-column>
      <el-table-column prop="state" label="评定" align="center">
      </el-table-column>
    </el-table>
    <!-- 弹层组件 -->
    <el-dialog title="测验" :visible.sync="isShow" @close="cancel">
      <el-form
        ref="textForm"
        :model="textForm"
        label-width="80px"
        label-position="top"
      >
        <el-form-item
          v-for="(item, index) in textList"
          :key="item.id"
          :label="`${index + 1}、${item.title}（ ） .`"
          :prop="`answer.${index}`"
          :rules="rules"
        >
          <el-radio-group v-model="textForm.answer[index]">
            <el-radio label="A">A:{{ item.A }}</el-radio>
            <el-radio label="B">B:{{ item.B }}</el-radio>
            <el-radio label="C">C:{{ item.C }}</el-radio>
            <el-radio label="D">D:{{ item.D }}</el-radio>
          </el-radio-group>
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
import { getVideoId, putGrade, getGrade } from "@/api/video";
import { getTestApi } from "@/api/test";
export default {
  name: "MydesignText",

  data() {
    return {
      isShow: false,
      textState: null,
      textList: [],
      textForm: {
        answer: [],
      },
      //校验规则
      rules: { required: true, message: "答案不能为空" },
      gradeList: [],
    };
  },

  created() {
    this.getGrade();
    this.getVideoId();
  },

  methods: {
    //获取考试题
    async getTest() {
      const data = await getTestApi();
      this.textList = data;
    },
    //获取状态
    async getVideoId() {
      const data = await getVideoId();
      this.textState = data.every((item) => item.type === true);
    },

    showText() {
      if (!this.textState) {
        return this.$message.warning("请完成视频学习");
      }
      const state = this.gradeList.some((item) => item.score >= 60);
      if (state) {
        return this.$message.warning("您已通过考核,无需再次检测");
      }
      this.getTest();
      this.isShow = true;
    },
    //获取成绩列表
    async getGrade() {
      const result = await getGrade();
      this.gradeList = result;
    },
    //取消按钮
    cancel() {
      //移除校验规则
      this.$refs.textForm.resetFields();
      this.isShow = false;
    },
    //确定
    async sumbit() {
      try {
        await this.$refs.textForm.validate(); //等待表单校验通过
        // console.log(this.textForm);
        // console.log(Object.values(this.textForm));
        // this.textList = [...Object.values(this.textForm)];
        const score = this.getScores(
          JSON.parse(JSON.stringify(this.textForm.answer))
        );
        await putGrade({
          score,
        });
        this.$message.success("提交成功");
        this.isShow = false;
        this.getGrade();
      } catch (error) {}
    },
    //得到分数
    getScores(list) {
      let score = 0; //定义初始分数
      for (let i = 0; i < list.length; i++) {
        if (list[i] === this.textList[i].answer) {
          score = score + 10;
        }
      }
      return score;
    },
  },
};
</script>

<style lang="scss" scoped>
// .el-radio {
//   display: block;
//   margin-top: 8px;
// }
.btn {
  margin-bottom: 16px;
}
</style>