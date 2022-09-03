//全局自定义组件注册
import PageTools from '@/components/PageTools'
import ImageUpload from './ImageUpload'
export default {
  install(Vue) {
    //组件注册
    Vue.component('PageTools', PageTools),
      Vue.component('ImageUpload', ImageUpload)

  }
}
