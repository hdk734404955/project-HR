<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容  头部 -->
      <el-card class="tree-card">
        <!-- 结构内容 -->
        <Tree
          :treeNode="company"
          class="row"
          :isRoot="true"
          :mystyle="styleone"
          :info="infoNameT"
          @addDepts="addDepts"
        />
        <!-- 树形结构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <Tree
            slot-scope="{ data }"
            :treeNode="data"
            class="bottom"
            :mystyle="styletwo"
            :info="infoName"
            @delDepts="getDepartment"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 弹层组件 -->
    <AddDept
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartment"
      ref="editDept"
    ></AddDept>
  </div>
</template>

<script>
import Tree from "./components/tree.vue";
import { getDepartment } from "@/api/department";
import { toTree } from "@/utils";
import AddDept from "./components/add-dept.vue";

export default {
  created() {
    this.getDepartment(); //调用自身方法
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment();
      this.departs = toTree(result, null);
    },
    //监听tree中触发的点击事件
    addDepts(node) {
      this.showDialog = true; //显示弹层
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      //调用获取部门详情方法
      this.$refs.editDept.getDeptInfo(node.id);
    },
  },
  data() {
    return {
      company: {
        name: "K集团",
        manager: "负责人",
        id: null,
      }, //头部数据结构
      defaultProps: {
        label: "name",
      },
      styleone: {
        fontWeight: "bold",
        fontSize: "16px",
      },
      styletwo: {
        fontWeight: "600",
      },
      departs: [],
      infoName: {
        name: "操作",
      },
      infoNameT: {
        name: "",
      },
      showDialog: false, //默认不显示
      node: null, //记录当前点击的node节点
    };
  },
  components: { Tree, AddDept },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
.row {
  border-bottom: 1px solid #3c3c3c;
}
.bottom {
  margin-top: 10px;
}
</style>