<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 公共组件 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button type="primary" size="small" @click="clock">打卡</el-button>
        </template>
      </page-tools>

      <el-card>
        <el-table :data="list" border style="width: 100%">
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
          <el-table-column prop="time" label="打卡时间" align="center">
          </el-table-column>
          <el-table-column prop="place" label="打卡地点" align="center">
          </el-table-column>
          <el-table-column prop="type" label="状态" align="center">
            <template v-slot="{ row }">
              <el-tag :type="row.type | colorType">{{
                row.type | screen
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="描述" align="center">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
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
    <div class="box" v-show="isShow">
      <el-form
        :model="userForm"
        label-position="right"
        label-width="50px"
        class="table"
        ref="userForm"
        :rules="rules"
      >
        <el-form-item label="工号">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.id"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.department"
          ></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="place">
          <el-input
            style="width: 220px"
            disabled
            v-model="userForm.place"
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-loading="loading"><div id="map"></div></div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sumbit">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import format from "@/api/constant/staff"; //引入格式化
import { clockCard, getCheckInfo } from "@/api/attendance";
import { getInfo } from "@/api/user";
export default {
  name: "attendanceIndex",
  data() {
    return {
      loading: true,
      isShow: false,
      //分页
      page: {
        page: 1,
        pagesize: 4,
        total: 0,
      },
      list: [],
      userForm: {
        id: "",
        name: "",
        department: "",
        place: "",
      },
      rules: {
        place: [
          { required: true, message: "打卡地点不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCheckInfo();
    this.getUserInfo();
  },
  //过滤器样式
  filters: {
    screen(val) {
      const obj = format.checkType.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
    colorType(val) {
      const obj = format.checkColor.find((item) => item.id === val);
      return obj ? obj.value : "未知";
    },
  },
  // mounted() {
  //   this.showMap();
  // },
  methods: {
    clock() {
      this.isShow = true;
      this.showMap();
    },
    //换页
    changePage(newPage) {
      this.page.page = newPage;
      this.getCheckInfo();
    },
    cancel() {
      //移除校验规则
      this.$refs.userForm.resetFields();
      this.userForm.place = "";
      this.isShow = false;
    },
    //获取用户信息
    async getUserInfo() {
      const result = await getInfo();
      this.userForm = result;
    },
    //确定打卡
    async sumbit() {
      try {
        await this.$refs.userForm.validate(); //等待表单校验通过
        await clockCard(this.userForm);
        this.userForm.place = "";
        this.$message.success("操作成功");
        this.isShow = false;
        this.getCheckInfo();
      } catch (error) {
        console.log(error);
      }
    },
    //根据ID获取考勤信息
    async getCheckInfo() {
      const { rows, total } = await getCheckInfo(this.page);
      this.list = rows;
      this.page.total = total;
    },
    //地图接口
    showMap() {
      let that = this;
      let map = new BMapGL.Map("map");
      let myGeo = new BMapGL.Geocoder();
      // let point = new BMapGL.Point(116.404, 39.915);
      that.loading = true;
      // var cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
      // var nowLocation =new BMapGL.LocationControl()
      // map.centerAndZoom(point, 17);
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // map.addControl(cityCtrl);
      // map.addControl(nowLocation)
      var geolocation = new BMapGL.Geolocation();
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMapGL.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
          let point = new BMapGL.Point(r.point.lng, r.point.lat);
          map.centerAndZoom(point, 17);
          myGeo.getLocation(point, function (result) {
            if (result) {
              // console.log(result);
              // console.log(
              //   `${result.address}${result.surroundingPois[0].title}`
              // );
              const place = `${result.address}${result.surroundingPois[0].title}`;
              // console.log(place);
              const user = {
                ...that.userForm,
                place,
              };
              that.userForm = user;
              that.loading = false;
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box {
  position: absolute;
  width: 600px;
  height: 610px;
  top: 50px;
  left: 350px;
  background-color: #ffffff;
  box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.3);
  z-index: 1;
}
#map {
  /* background-color: pink; */
  width: 600px;
  height: 300px;
  margin: auto;
}
/* .map {
  width: 100%;
  height: 300px;
} */
.dialog-footer {
  margin-top: 8px;
}
</style>