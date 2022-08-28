<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span :style="mystyle">{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col :style="mystyle">{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="button">
            <span :style="mystyle"
              >{{ info.name }}<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-dept')"
                >添加子部门</el-dropdown-item
              >
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
                :disabled="!checkPermission('edit-dept')"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
                :disabled="!checkPermission('del-dept')"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from "@/api/department";
export default {
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    mystyle: {
      type: Object,
      default: function () {
        return {
          // fontWeight: "700",
        };
      },
    },
    info: {
      type: Object,
    },
  },
  methods: {
    button(type) {
      if (type === "add") {
        //添加部门操作
        this.$emit("addDepts", this.treeNode); //添加自定义事件传入当前点击部门的数据
      } else if (type === "edit") {
        //修改部门操作
        this.$emit("editDepts", this.treeNode);
      } else {
        //删除操作
        this.$confirm("您确定要删除该组织吗?")
          .then(() => {
            return delDepartment(this.treeNode.id);
          })
          .then(() => {
            //等到删除成功刷新页面
            this.$emit("delDepts"); //触发自定义事件
            this.$message.success("删除部门成功");
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style>
</style>