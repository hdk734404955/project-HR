<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-radio-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-radio-group v-model="roleID">
      <!-- 选项 -->
      <el-radio v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}</el-radio
      >
    </el-radio-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRole } from "@/api/setting";
import { getStaffone, addstaff } from "@/api/staff";
export default {
  data() {
    return {
      list: [], //定义角色列表数组
      roleID: [], //负责存储当前用户所拥有的角色ID
    };
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
      require: true,
    },
  },
  created() {
    //获取所有角色
    this.getRole();
  },
  methods: {
    async getRole() {
      const { rows } = await getRole({ page: 1, pagesize: 10 });
      this.list = rows;
    },

    async getStaffone(id) {
      const { role_id } = await getStaffone(id); //将用户所拥有的角色赋值给当前对象
      this.roleID = role_id;
    },
    //确定接口
    async btnOK() {
      await addstaff({ id: this.userId, roleid: this.roleID });
      this.$message.success("分配成功");
      this.$emit("update:showRoleDialog", false); //关闭弹层
    },
    btnCancel() {
      this.roleID = [];
      this.$emit("update:showRoleDialog", false); //关闭弹层
    },
  },
};
</script>