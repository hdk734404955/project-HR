<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <div class="head">
          <span class="info">员工信息表</span>
          <el-button
            size="small"
            type="primary"
            @click="returnStaff"
            style="width: 56px; height: 32px"
            >返回</el-button
          >
        </div>
        <table cellpadding="0" cellspacing="0" align="center">
          <tbody>
            <tr>
              <th>姓名</th>
              <td>{{ userInfo.name }}</td>
              <th>性别</th>
              <td>{{ userInfo.sex }}</td>
              <td rowspan="5">
                <img :src="userInfo.photo" alt="员工照片" />
              </td>
            </tr>
            <tr>
              <th>工号</th>
              <td>{{ userInfo.id }}</td>
              <th>部门</th>
              <td>{{ userInfo.department }}</td>
            </tr>
            <tr>
              <th>薪资</th>
              <td>{{ userInfo.wages }}元</td>
              <th>学历</th>
              <td>{{ userInfo.education }}</td>
            </tr>
            <tr>
              <th>专业</th>
              <td>{{ userInfo.major }}</td>
              <th>邮编</th>
              <td>{{ userInfo.postcode }}</td>
            </tr>
            <tr>
              <th>入职时间</th>
              <td>{{ userInfo.time | formatDate }}</td>
              <th>毕业院校</th>
              <td>{{ userInfo.school }}</td>
            </tr>
            <tr>
              <th>联系电话</th>
              <td>{{ userInfo.phone }}</td>
              <th>Email</th>
              <td colspan="2">{{ userInfo.email }}</td>
            </tr>
            <tr>
              <th>地址</th>
              <td colspan="4">{{ userInfo.site }}</td>
            </tr>
            <tr>
              <th>英语水平</th>
              <td colspan="4"></td>
            </tr>
            <tr>
              <th>计算机水平</th>
              <td colspan="4"></td>
            </tr>
            <tr class="my">
              <th>自我评价</th>
              <td colspan="4"></td>
            </tr>
            <tr class="my">
              <th>专业介绍</th>
              <td colspan="4"></td>
            </tr>
            <tr class="my">
              <th>获奖情况</th>
              <td colspan="4"></td>
            </tr>
            <tr class="my">
              <th>社会实践</th>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUser } from "@/api/user";
export default {
  data() {
    return {
      id: 0,
      userInfo: {},
    };
  },
  created() {
    const str = this.$route.path; //获取用户ID
    this.id = str.slice(-4);
    this.getUser();
  },
  methods: {
    returnStaff() {
      this.$router.push("/staff");
    },
    //获取用户详细信息
    async getUser() {
      this.userInfo = await getUser(this.id);
    },
  },
};
</script>
<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e4e7ed;
}
.info {
  line-height: 42px;
  font-weight: bold;
  font-size: 18px;
}
table {
  width: 798px;
  /* border: 1px solid black; */
  /* border-collapse: separate; */
  margin-top: 20px;
}

th {
  width: 100px;
  height: 50px;
}

td {
  width: 150px;
  text-align: center;
  height: 50px;
}

img {
  width: 100%;
  height: 260px;
  vertical-align: bottom;
}

.my {
  height: 100px;
}
table,
th,
td {
  border: 1px solid #e4e7ed;
  border-collapse: collapse;
}
</style>