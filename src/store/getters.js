const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, //建立token快捷访问
  name: state => state.user.userInfo.username,
  headImg: state => state.user.userInfo.head_img, //头像快速访问
  userId: state => state.user.userInfo.id,
}
export default getters
