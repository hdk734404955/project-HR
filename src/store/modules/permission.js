// 权限路由模块
import {
  constantRoutes,
  asyncRoutes
} from '@/router'
const state = {
  // 一开始肯定拥有静态路由
  routers: constantRoutes // 路由表表示当前用户所拥有的所有路由数组
}
const mutations = {
  // 定义修改路由方法
  setRouers(state, newRouters) {
    state.routers = [...constantRoutes, ...newRouters]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  filterRouters(context, mens) {
    // console.log(mens, 'mens');
    const routers = []
    mens.forEach(key => {
      routers.push(...asyncRoutes.filter(item =>
        // console.log(item.children[0].name, 'item');
        item.children[0].name === key
      ))
    })
    // console.log(routers, 'router');
    context.commit('setRouers', routers) // 将动态路由提交给mutations
    return routers
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
