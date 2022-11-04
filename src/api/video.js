import request from "@/utils/request";
//根据用户ID获取视频列表
export function getVideoId() {
  return request({
    url: "/video/getID",
  });
}
//根据用户ID修改视频状态
export function editVideo(id) {
  return request({
    url: `/video/edit?id=${id}`,
    method: "put",
  });
}
//提交成绩表单
export function putGrade(data) {
  return request({
    url: `/video/grade`,
    method: "post",
    data,
  });
}
//根据ID获取成绩列表
export function getGrade() {
  return request({
    url: `/video/grade`,
  });
}
// export function getRole(params) {
//   return request({
//     url: "/get/role",
//     params,
//   });
// }
