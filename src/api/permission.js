import request from '@/utils/request'
//获取权限列表
export function getPermission() {
  return request({
    url: '/permission'
  })
}
//根据ID获取权限详情
export function getPermissionOne(id) {
  return request({
    url: `/permission/one?id=${id}`
  })
}
//根据ID修改权限
export function putPermission(data) {
  return request({
    url: `/permission?id=${data.id}`,
    data,
    method: 'put'
  })
}
//添加权限
export function addPermission(data) {
  return request({
    url: `/permission`,
    data,
    method: 'post'
  })
}
//删除权限
export function delPermission(id) {
  return request({
    url: `/permission?id=${id}`,
    method: 'delete'
  })
}
