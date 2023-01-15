import axios from "axios";
import { Message } from "element-ui";
import { getTimeStamp } from "@/utils/auth";
import store from "@/store";
import router from "@/router";
const TimeOut = 3600; //定义超时时间3600秒
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000, // 设置响应时间
});
// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    // 请求配置信息
    // 注入token
    // `${JSON.parse(store.getters.token).token}`
    // console.log(JSON.parse(store.getters.token).token, 'token')
    if (store.getters.token) {
      //判断token是否存在
      if (CheckTimeOut()) {
        //如果为true表示过期
        store.dispatch("user/logout"); //调用登出
        router.push("/login"); //跳到登录页
        return Promise.reject(new Error("token已过期请重新登录!"));
      }
      config.headers["Authorization"] = `${store.getters.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, status, message } = response.data;
    // console.log(data, "响应拦截器返回信息");
    // console.log(status, message);
    if (status == 0) {
      return data;
    } else {
      Message.error(message); //提示错误消息
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    //token被动处理
    if (
      error.response &&
      error.response.data &&
      error.response.data.status === 401
    ) {
      //等于1时token超时
      store.dispatch("user/logout"); // 登出action 删除token
      router.push("/login");
    } else {
      Message.error(error.message); //提示错误信息
    }
    return Promise.reject(error); //返回执行错误,让当前的执行链跳出成功,直接进入catch
  }
);
//是否超时
function CheckTimeOut() {
  let nowTime = Date.now(); //当前时间戳
  let timeStamp = getTimeStamp(); //缓存时间戳
  return (nowTime - timeStamp) / 1000 > TimeOut;
}
export default service;
