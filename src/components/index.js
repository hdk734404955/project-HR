//全局自定义组件注册
import PageTools from '@/components/PageTools'
export default {
  install(Vue) {
    //组件注册
    Vue.component('PageTools', PageTools)

  }
}
