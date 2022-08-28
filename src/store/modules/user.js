import {
  getToken,
  setToken,
  removeToken,
  setTimeStamp
} from '@/utils/auth'
import {
  login,
  getInfo,
  getMens
} from '@/api/user'
import {
  resetRouter
} from '@/router'
const state = {
  token: getToken(), //设置token为共享状态,初始vuex的时候从缓存中读取
  userInfo: {}, //定义一个空对象
  perInfo: []
}
const mutations = {
  setToken(state, token) {
    state.token = token //将数据设置给vuex
    //同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null //将vuex的数据置空
    removeToken()
  },
  setUserInfo(state, result) {
    state.userInfo = {
      ...result,
    }
  },
  setPerInfo(state, mens) {
    state.perInfo = [...mens]

  },
  removeUserInfo(state) { //清空用户信息
    state.userInfo = {}
  },
  removePer(state) { //清空权限信息
    state.perInfo = []
  }
}
const actions = {
  //登录
  async login(context, data) {
    const result = await login(data) //拿到token
    context.commit('setToken', result) //设置token
    setTimeStamp() //设置当前时间戳
  },
  async getInfo(context) { //获取用户信息
    const result = await getInfo()
    context.commit('setUserInfo', result) //提交到mutations
    return result
  },
  //获取权限
  async getMens(context) {
    const mens = await getMens()
    let arr = []
    for (let i in mens) {
      arr.push(mens[i].code)
    }
    console.log(arr)
    // const rows = mens.map(item => item.code)
    // console.log(rows, 'getMens');
    context.commit('setPerInfo', arr)
    return arr
  },
  //登出操作
  logout(context) {
    context.commit('removeToken'), //删除token
      context.commit('removeUserInfo') //删除用户信息
    context.commit('removePer') //删除权限路由
    //重置路由
    resetRouter()
    //{root:true}调用根级的mutation或actions
    context.commit('permission/setRouers', [], {
      root: true
    })



  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
