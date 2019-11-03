const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    uId: state => state.user.uId,
    headPic: state => state.user.headPic,
    name: state => state.user.name
}
export default getters
