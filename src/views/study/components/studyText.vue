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
        :rules="rules"
      >
        <el-form-item
          label="1.适合于流水作业岗位的任务分析方法是（ ）。"
          prop="A"
        >
          <el-radio-group v-model="textForm.A">
            <el-radio label="A">A:语句描述</el-radio>
            <el-radio label="B">B:任务清单</el-radio>
            <el-radio label="C">C:决策表</el-radio>
            <el-radio label="D">D:时间列形式</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="2.工作分析中方法分析常用的方法是（ ）。" prop="B">
          <el-radio-group v-model="textForm.B">
            <el-radio label="A">A:流程图</el-radio>
            <el-radio label="B">B:问题分析</el-radio>
            <el-radio label="C">C:职能工作分析</el-radio>
            <el-radio label="D">D:关键事件技术</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="3.管理人员定员的方法是（ ）。" prop="C">
          <el-radio-group v-model="textForm.C">
            <el-radio label="A">A:设备定员法</el-radio>
            <el-radio label="B">B:职责定员法</el-radio>
            <el-radio label="C">C:效率定员法</el-radio>
            <el-radio label="D">D:绩效定员法</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="4.依据个体的经验判断，把所有待评价的职务依序排列，由此确定每种工作的价值的方法是（ ）。"
          prop="D"
        >
          <el-radio-group v-model="textForm.D">
            <el-radio label="A">A:因素分解法</el-radio>
            <el-radio label="B">B:因素比较法</el-radio>
            <el-radio label="C">C:评分法</el-radio>
            <el-radio label="D">D:排序法</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="5.工作评价是指通过确定岗位的什么来划分岗位等级及相应工资的方法（ ）。"
          prop="E"
        >
          <el-radio-group v-model="textForm.E">
            <el-radio label="A">A:劳动责任</el-radio>
            <el-radio label="B">B:劳动价值</el-radio>
            <el-radio label="C">C:劳动条件</el-radio>
            <el-radio label="D">D:劳动差别</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="6.让秘书起草一份文件这是一种（ ）。" prop="F">
          <el-radio-group v-model="textForm.F">
            <el-radio label="A">A:职位</el-radio>
            <el-radio label="B">B:职务</el-radio>
            <el-radio label="C">C:任务</el-radio>
            <el-radio label="D">D:职业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="7.薪酬设计原则中，与外在公平性对应的原则是（ ）。"
          prop="G"
        >
          <el-radio-group v-model="textForm.G">
            <el-radio label="A">A:激励性</el-radio>
            <el-radio label="B">B:经济性</el-radio>
            <el-radio label="C">C:竞争性</el-radio>
            <el-radio label="D">D:合法性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="8.薪酬设计的纲领性文件是（ ）。" prop="H">
          <el-radio-group v-model="textForm.H">
            <el-radio label="A">A:工作说明</el-radio>
            <el-radio label="B">B:工作评价</el-radio>
            <el-radio label="C">C:薪酬策略</el-radio>
            <el-radio label="D">D:薪酬调查</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="9.绩效管理系统的起点是（ ）。" prop="I">
          <el-radio-group v-model="textForm.I">
            <el-radio label="A">A:绩效计划</el-radio>
            <el-radio label="B">B:绩效实施</el-radio>
            <el-radio label="C">C:绩效考核</el-radio>
            <el-radio label="D">D:绩效辅导</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="10.员工培训工作的起点是（ ）。" prop="J">
          <el-radio-group v-model="textForm.J">
            <el-radio label="A">A:培训需求分析</el-radio>
            <el-radio label="B">B:培训方案设计</el-radio>
            <el-radio label="C">C:培训计划实施</el-radio>
            <el-radio label="D">D:培训效果评估</el-radio>
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
export default {
  name: "MydesignText",

  data() {
    return {
      isShow: false,
      textState: null,
      textList: [],
      answer: ["C", "B", "B", "D", "B", "C", "A", "D", "C", "A"], //正确答案数组
      textForm: {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
        F: "",
        G: "",
        H: "",
        I: "",
        J: "",
      },
      //校验规则
      rules: {
        A: [{ required: true, message: "答案不能为空" }],
        B: [{ required: true, message: "答案不能为空" }],
        C: [{ required: true, message: "答案不能为空" }],
        D: [{ required: true, message: "答案不能为空" }],
        E: [{ required: true, message: "答案不能为空" }],
        F: [{ required: true, message: "答案不能为空" }],
        G: [{ required: true, message: "答案不能为空" }],
        H: [{ required: true, message: "答案不能为空" }],
        I: [{ required: true, message: "答案不能为空" }],
        J: [{ required: true, message: "答案不能为空" }],
      },
      gradeList: [],
    };
  },

  created() {
    this.getGrade();
    this.getVideoId();
  },

  methods: {
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
      // this.$refs.userForm.resetFields();
      this.isShow = false;
    },
    //确定
    async sumbit() {
      try {
        await this.$refs.textForm.validate(); //等待表单校验通过
        // console.log(this.textForm);
        // console.log(Object.values(this.textForm));
        // this.textList = [...Object.values(this.textForm)];
        this.textList = JSON.parse(
          JSON.stringify([...Object.values(this.textForm)])
        );
        const score = this.getScores(JSON.parse(JSON.stringify(this.textList)));
        await putGrade({
          score,
        });
        this.$message.success("提交成功");
        this.isShow = false;
        this.getGrade();
        // console.log(score);
        // console.log(JSON.parse(JSON.stringify(this.textList)));
      } catch (error) {}
    },
    //得到分数
    getScores(list) {
      let score = 0; //定义初始分数
      for (let i = 0; i < list.length; i++) {
        if (list[i] == this.answer[i]) {
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