import request from "@/utils/request";
//登录接口
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}
//注册接口
export function register(data) {
  return request({
    url: "/user/register",
    method: "post",
    data,
  });
}
//验证账号是否存在接口
export function isOK(data) {
  return request({
    url: "/user/isOK",
    method: "post",
    data,
  });
}
//获取用户信息接口
export function getInfo() {
  return request({
    url: "/info/getinfo",
    method: "get",
  });
}
//获取用户权限
export function getMens() {
  return request({
    url: "/user/per",
    method: "get",
  });
}
//获取用户详细信息
export function getUser(id) {
  return request({
    url: `/user/info?user_id=${id}`,
  });
}
//更换用户头像
export function userImg(data) {
  return request({
    url: `/user/headimg?id=${data.id}`,
    method: "post",
    data,
  });
}
//修改个人信息
export function upUserInfo(data) {
  return request({
    url: `/user/info?user_id=${data.id}`,
    method: "put",
    data,
  });
}
//修改密码
export function delPass(data) {
  return request({
    url: `/user/password`,
    method: "post",
    data,
  });
}
