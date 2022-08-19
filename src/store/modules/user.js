import {
  getToken,
  setToken,
  removeToken,
  setTimeStamp
} from '@/utils/auth'
import {
  login,
  getInfo
} from '@/api/user'
const state = {
  token: getToken(), //设置token为共享状态,初始vuex的时候从缓存中读取
  userInfo: {} //定义一个空对象
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
      ...result
    }
  },
  removeUserInfo(state) {
    state.userInfo = {}


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
  //登出操作
  logout(context) {
    context.commit('removeToken'), //删除token
      context.commit('removeUserInfo')

  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
