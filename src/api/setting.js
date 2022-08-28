import request from '@/utils/request'
//获取角色列表
export function getRole(params) {
  return request({
    url: '/get/role',
    params
  })
}
//获取公司信息
export function getCompany() {
  return request({
    url: '/get/company'
  })
}
//删除角色
export function delRole(id) {
  return request({
    url: `/get/role?id=${id}`,
    method: 'delete'
  })
}
//根据ID编辑角色
export function updateRole(data) {
  return request({
    url: `/get/role?id=${data.id}`,
    method: 'put',
    data
  })
}
//根据ID获取角色详情
export function getRoleone(id) {
  return request({
    url: `/get/roleone?id=${id}`

  })
}
//新增角色
export function addRole(data) {
  return request({
    url: `/get/role`,
    method: 'post',
    data
  })
}
//根据ID获取权限点
export function rolePermission(id) {
  return request({
    url: `/role/permission?id=${id}`,
  })
}
//给角色分配权限
export function addPermission(data) {
  return request({
    url: '/role/add',
    method: 'put',
    data,
  })
}
