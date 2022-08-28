// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/404', '/login']

//前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() //开启进度条
  if (store.getters.token) {
    //如果存在token
    if (to.path === '/login') {

      next('/')

    } else {
      //如果当前vuex中用户有id就不用获取了
      if (!store.getters.userId) {
        await store.dispatch('user/getInfo')
        const arr = await store.dispatch('user/getMens')
        //筛选用户可用路由
        const routers = await store.dispatch('permission/filterRouters', arr)
        // console.log(routers, '66666');
        //routers就是筛选得到的动态路由
        router.addRoutes([...routers, {
          path: '*',
          redirect: '/404',
          hidden: true
        }]) //添加动态路由到路由表
        next(to.path)
      } else {
        next()
      }

    }
  } else {
    //没有token
    if (whiteList.indexOf(to.path) > -1) {
      //表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() //关闭进度条
})
//后置守卫
router.afterEach(() => {
  NProgress.done() //关闭进度条
})
