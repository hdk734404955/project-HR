import request from '@/utils/request'
//查询企业部门列表
export function getDepartment() {
  return request({
    url: '/info/department',
  })
}
//删除部门接口
export function delDepartment(id) {
  return request({
    url: `/info/department?id=${id}`,
    method: 'delete'

  })
}
//新增部门接口
export function addDepartment(data) {
  return request({
    url: `/info/department`,
    method: 'post',
    data
  })
}
//根据id获取部门详情
export function getDeptInfo(id) {
  return request({
    url: `/get/department?id=${id}`
  })
}
//根据ID编辑部门详情
export function updateDepartment(data) {
  return request({
    url: `/info/department?${data.id}`,
    method: 'put',
    data
  })
}
