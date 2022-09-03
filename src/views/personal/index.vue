<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户信息" name="first">
            <el-form :model="userInfo" :rules="rules" ref="userInfo">
              <el-form-item label="账号" style="margin-left: 9px">
                <el-input
                  style="width: 150px"
                  v-model="userInfo.username"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input
                  style="width: 150px"
                  v-model="userInfo.name"
                ></el-input>
              </el-form-item>
              <!-- 用户头像 -->

              <el-form-item label="头像" style="margin-left: 9px">
                <ImageUpload ref="userimg"></ImageUpload>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :round="true"
                  style="width: 148px; margin-left: 48px"
                  @click="upUserHead"
                  >确定</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人信息" name="second">
            <el-form :model="staffInfo" :label-position="labelPosition">
              <el-row type="flex" justify="center">
                <el-col :span="5">
                  <el-form-item label="照片">
                    <ImageUpload ref="staffimg"></ImageUpload> </el-form-item
                ></el-col>
              </el-row>

              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="姓名">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.name"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="性别">
                    <el-select v-model="staffInfo.sex" style="width: 300px">
                      <el-option label="男" value="男"></el-option>
                      <el-option label="女" value="女"></el-option>
                    </el-select> </el-form-item
                ></el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="工号">
                    <el-input
                      disabled
                      style="width: 300px"
                      v-model="staffInfo.id"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="部门">
                    <el-input
                      disabled
                      style="width: 300px"
                      v-model="staffInfo.department"
                    ></el-input> </el-form-item
                ></el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="薪资">
                    <el-input
                      disabled
                      style="width: 300px"
                      v-model="staffInfo.wages"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="学历">
                    <el-select
                      v-model="staffInfo.education"
                      style="width: 300px"
                    >
                      <el-option label="专科" value="专科"></el-option>
                      <el-option label="本科" value="本科"></el-option>
                      <el-option label="硕士" value="硕士"></el-option>
                      <el-option label="博士" value="博士"></el-option>
                    </el-select> </el-form-item
                ></el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="专业">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.major"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="邮编">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.postcode"
                    ></el-input> </el-form-item
                ></el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="地址">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.site"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="Email">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.email"
                    ></el-input> </el-form-item
                ></el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="入职时间">
                    <el-input
                      disabled
                      style="width: 300px"
                      v-model="staffInfo.time"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="毕业院校">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.school"
                    ></el-input> </el-form-item
                ></el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="7">
                  <el-form-item label="联系电话">
                    <el-input
                      style="width: 300px"
                      v-model="staffInfo.phone"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"
                  ><el-form-item label="英语水平">
                    <el-input style="width: 300px"></el-input> </el-form-item
                ></el-col>
              </el-row>

              <el-row type="flex" justify="center">
                <el-col :span="3">
                  <el-button type="primary" @click="saveInfo"
                    >保存信息</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="three">
            <el-form
              :model="userPassWord"
              status-icon
              :rules="rulesOther"
              ref="userPassWord"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="旧密码" prop="oldPass">
                <el-input
                  type="password"
                  v-model="userPassWord.oldPass"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="pass">
                <el-input
                  type="password"
                  v-model="userPassWord.pass"
                  autocomplete="off"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input
                  type="password"
                  v-model="userPassWord.checkPass"
                  autocomplete="off"
                  style="width: 250px"
                ></el-input>
              </el-form-item>

              <el-form-item style="margin-left: 40px">
                <el-button type="primary" @click="submitForm('userPassWord')"
                  >提交</el-button
                >
                <el-button @click="resetForm('userPassWord')">重置</el-button>
              </el-form-item>
            </el-form></el-tab-pane
          >
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getInfo, userImg, getUser, upUserInfo, delPass } from "@/api/user";
import ImageUpload from "@/components/ImageUpload/index.vue";
export default {
  data() {
    //密码校验规则
    var checkpass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userPassWord.checkPass !== "") {
          this.$refs.userPassWord.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userPassWord.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeName: "first",
      labelPosition: "top",
      right: "right",
      userInfo: {
        //用户资料
        id: "",
        name: "",
      },
      //密码
      userPassWord: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      staffInfo: {
        //个人信息资料
      },
      rules: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
      },
      //密码规则
      rulesOther: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPass: [{ validator: checkpass, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getInfo();
    this.getUser();
  },
  methods: {
    //调用接口把头像传给子组件
    async getInfo() {
      this.userInfo = await getInfo();
      if (this.userInfo.head_img) {
        this.$refs.userimg.fileList = [
          {
            url: this.userInfo.head_img,
            upload: true,
          },
        ];
      }
    },

    //获取个人资料
    async getUser() {
      const { id } = await getInfo();
      this.staffInfo = await getUser(id);
      if (this.staffInfo.photo) {
        this.$refs.staffimg.fileList = [
          {
            url: this.staffInfo.photo,
            upload: true,
          },
        ];
      }
    },
    //更换头像确定按钮
    async upUserHead() {
      await this.$refs.userInfo.validate();
      const fileList = this.$refs.userimg.fileList;
      if (fileList.some((item) => !item.upload)) {
        this.$message.warning("图片尚未上传完成");
        return;
      }
      await userImg({
        ...this.userInfo,
        userimg: fileList && fileList.length ? fileList[0].url : "",
      });
      this.$message.success("修改信息成功");
    },
    //保存信息
    async saveInfo() {
      const fileList = this.$refs.staffimg.fileList;
      if (fileList.some((item) => !item.upload)) {
        this.$message.warning("图片尚未上传完成");
        return;
      }
      await upUserInfo({
        ...this.staffInfo,
        userimg: fileList && fileList.length ? fileList[0].url : "",
      });
      this.$message.success("保存信息成功");
    },
    //密码提交
    async submitForm(formName) {
      //表单校验通过
      try {
        await this.$refs[formName].validate();
        await delPass(this.userPassWord);
        this.$message.success("修改密码成功");
        this.$store.dispatch("user/logout");
        this.$router.push("/login");
      } catch (error) {}
    },
    //密码重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },

  components: { ImageUpload },
};
</script>
<style scoped>
</style>