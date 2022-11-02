//考勤打卡接口
import request from "@/utils/request";
//打卡接口
export function clockCard(data) {
  return request({
    url: `/attendance`,
    method: "post",
    data,
  });
}
//根据ID获取打卡信息
export function getCheckInfo(params) {
  return request({
    url: "/attendance/info",
    params,
  });
}
