//混入对象
import store from '@/store'
export default {
  methods: {
    //检查权限
    checkPermission(key) {
      const perInfo = store.state.user.perInfo
      if (perInfo) {
        return perInfo.some(item => item === key)
      }
      return fasle
    }
  }
}
