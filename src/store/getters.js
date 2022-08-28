const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, //建立token快捷访问
  name: state => state.user.userInfo.name,
  headImg: state => state.user.userInfo.head_img, //头像快速访问
  userId: state => state.user.userInfo.id,
  routes: state => state.permission.routers, //建立权限模块下的快捷访问
  dept: state => state.user.userInfo.department //部门快捷访问
}
export default getters
