import request from "@/utils/request";
//根据ID获取请假信息
export function getApproval(id) {
  return request({
    url: `/approval?id=${id}`,
  });
}
//同意请假
export function Approval(data) {
  return request({
    url: `/approval`,
    data,
    method: "put",
  });
}
//拒绝请假
export function refuseApproval(data) {
  return request({
    url: `/approval`,
    data,
    method: "post",
  });
}
//审核中请假列表
export function approvalWait(params) {
  return request({
    url: `/approval/wait`,
    params,
  });
}
//已同意请假列表
export function approvalAgree(params) {
  return request({
    url: `/approval/agree`,
    params,
  });
}
//已拒绝请假列表
export function approvalRefuse(params) {
  return request({
    url: `/approval/refuse`,
    params,
  });
}
//撤销请假列表
export function approvalRepeal(params) {
  return request({
    url: `/approval/repeal`,
    params,
  });
}
//筛选请假
export function selectApprovalApi(data) {
  return request({
    url: "/approval/select",
    method: "post",
    data,
  });
}
