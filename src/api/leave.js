import request from "@/utils/request";
//请假申请
export function addLeave(data) {
  return request({
    url: "/leave",
    data,
    method: "post",
  });
}
//根据ID获取自己得请假列表
export function getLeaveInfo(params) {
  return request({
    url: "/user/leave",
    params,
  });
}
//获取全部请假信息
export function getLeave(params) {
  return request({
    url: "/leave",
    params,
  });
}
//撤销请假
export function repealLeave(id) {
  return request({
    url: `/leave?id=${id}`,
    method: "put",
  });
}
//撤销请假
export function getLeaveId(id) {
  return request({
    url: `/leave/id?id=${id}`,
  });
}
