import request from "@/utils/request";
//发布公告
export function addAffiche(data) {
  return request({
    url: "/affiche",
    method: "post",
    data,
  });
}
//根据ID获取公告
export function getAfficheID(params) {
  return request({
    url: "/affiche",
    params,
  });
}
//根据ID获取公告详情
export function getIdAffiche(id) {
  return request({
    url: `/affiche/id?id=${id}`,
  });
}
//根据ID修改公告
export function editAffiche(data) {
  return request({
    url: "/affiche",
    method: "put",
    data,
  });
}
//删除公告
export function delAffiche(id) {
  return request({
    url: `/affiche?id=${id}`,
    method: "delete",
  });
}
//获取全部公告
export function getAllAffiche(params) {
  return request({
    url: `/affiche/all`,
    params,
  });
}
//发布留言
export function addMessage(data) {
  return request({
    url: `/affiche/message`,
    method: "post",
    data,
  });
}
//获取用户留言
export function getUserMessage(params) {
  return request({
    url: `/affiche/message`,
    params,
  });
}
//删除个人留言
export function delUserMessage(id) {
  return request({
    url: `/affiche/message?id=${id}`,
    method: "delete",
  });
}
//根据角色ID获取留言
export function getRoleMessage(params) {
  return request({
    url: `/affiche/role`,
    params,
  });
}
//根据ID获取留言信息
export function getIdMessage(id) {
  return request({
    url: `/affiche/role/id?id=${id}`,
  });
}
