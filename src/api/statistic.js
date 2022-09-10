import request from '@/utils/request'
//不同阶段工资人数
export function getWages() {
  return request({
    url: '/statistic',
  })
}
//获取各部门人数
export function getDepartmentPerson() {
  return request({
    url: '/department/person',
  })
}
