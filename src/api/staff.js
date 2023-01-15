import request from "@/utils/request";
//获取员工信息
export function getStaff(params) {
  return request({
    url: "/staff",
    params,
  });
}
//删除员工
export function delStaff(id) {
  return request({
    url: `/staff?id=${id}`,
    method: "delete",
  });
}
//根据id获取员工信息
export function getStaffone(id) {
  return request({
    url: `/get/staff?id=${id}`,
  });
}
//根据ID调岗
export function staffPost(data) {
  return request({
    url: `/staff?id=${data.id}`,
    method: "post",
    data,
  });
}
//转正
export function putstaff(id) {
  return request({
    url: `/staff?id=${id}`,
    method: "put",
  });
}
//给员工分配角色
export function addstaff(data) {
  return request({
    url: `/staff/addrole`,
    method: "put",
    data,
  });
}
//禁用账号
export function setAccount(data) {
  return request({
    url: "/staff/account",
    method: "put",
    data,
  });
}
