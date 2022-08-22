<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      label-width="120px"
      ref="deptForm"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          type="text"
          style="width: 80%"
          placeholder="1-10个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          type="text"
          style="width: 80%"
          placeholder="1-10个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- <el-select style="width: 80%" placeholder="请选择" /> -->
        <el-input
          type="text"
          style="width: 80%"
          placeholder="1-10个字符"
          v-model="formData.manager"
        />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import {
  getDepartment,
  addDepartment,
  getDeptInfo,
  updateDepartment,
} from "@/api/department";
export default {
  //计算属性
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  data() {
    //检查部门名称是否重复
    const checkName = async (rule, value, callback) => {
      //value是部门名称,检查同级部门中有无相同的名称
      const result = await getDepartment();
      //   console.log(result);
      //根据id判断是编辑模式还是新增模式,有ID编辑
      let isRepate = false;
      if (this.formData.id) {
        //首先找到同级部门
        isRepate = result
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name === value);
      } else {
        //找同级部门下有没有和value相同的数据
        isRepate = result
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }
      //isRepet为true表示找到相同名字
      isRepate ? callback(new Error(`同级部门下存在${value}部门`)) : callback();
    };
    //检查编码是否重复
    const checkCode = async (rule, value, callback) => {
      const result = await getDepartment();
      let isRepate = false;
      if (this.formData.id) {
        //编辑模式
        isRepate = result
          .filter((item) => item.id !== this.treeNode.id)
          .some((item) => item.code === value && value);
      } else {
        isRepate = result.some((item) => item.code === value && value);
      }

      isRepate ? callback(new Error(`存在${value}编码`)) : callback();
    };
    return {
      //定义表单数据
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      //校验规则
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "部门名称长度为1-10个",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkName,
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "部门编码长度为1-10个",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCode,
          },
        ],
        manager: [
          { required: false, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "部门负责人长度为1-10个",
            trigger: "blur",
          },
        ],
        introduce: [
          { required: false, trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门负责人长度为1-300个",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    btnOK() {
      //手动校验表单
      this.$refs.deptForm.validate(async (isOK) => {
        //表单校验通过
        if (isOK) {
          if (this.formData.id) {
            //编辑接口
            await updateDepartment(this.formData);
            this.$message.success("修改部门成功");
          } else {
            //将pid设置为父级部门的ID
            await addDepartment({ ...this.formData, pid: this.treeNode.id });
            this.$message.success("添加部门成功");
          }

          //告诉父组件
          this.$emit("addDepts"); //触发自定义事件
          this.$emit("update:showDialog", false);
        }
      });
    },
    //获取部门详情方法
    async getDeptInfo(id) {
      this.formData = await getDeptInfo(id);
    },
    btnCancel() {
      //重置数据,resetFields只能重置表单数据，非表单的id不能重置
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      //关闭弹层
      this.$emit("update:showDialog", false);
      //清除校验数据
      this.$refs.deptForm.resetFields();
    },
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
};
</script>