import request from '@/utils/request'
//登录接口
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data

  })
}
//获取用户信息接口
export function getInfo() {
  return request({
    url: '/info/getinfo',
    method: 'get',


  })
}
//获取用户权限
export function getMens() {
  return request({
    url: '/one',
    method: 'get',
  })
}
export function logout() {
  return request({

  })
}
