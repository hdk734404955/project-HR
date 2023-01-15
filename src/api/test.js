import request from "@/utils/request";
//随机获取10条考试题
export const getTestApi = () => {
  return request({
    url: "/test",
  });
};
//获取全部考试数据
export const getTestAllApi = (params) => {
  return request({
    url: "/testall",
    params,
  });
};
//新增试题
export const addTestApi = (data) => {
  return request({
    url: "test",
    method: "post",
    data,
  });
};
//根据id获取试题
export const getTestIdApi = (id) => {
  return request({
    url: `/testid?id=${id}`,
  });
};
//编辑试题
export const editTestApi = (data) => {
  return request({
    url: `/test`,
    method: "put",
    data,
  });
};
//删除试题
export const delTestApi = (id) => {
  return request({
    url: `/test?id=${id}`,
    method: "delete",
  });
};
