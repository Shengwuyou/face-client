import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    headPic: '',
    uId: '',
    avatar: ''
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_USER_INFO: (state, userInfo) => {
        state.uId = userInfo.uId
        state.name = userInfo.nickName
        state.headPic = userInfo.headPic
    }
}

const actions = {
    // user login 注册平台 系统/配置/环境 （IOS/Android/PC）
    login({ commit }, userInfo) {
        const loginData = { loginName: userInfo.username.trim(), password: userInfo.password, fromWay: 0, platform: 'pc' };

        return new Promise((resolve, reject) => {
            login(loginData).then(response => {
                commit('SET_USER_INFO', response.data)
                setToken(response.data.token)
                resolve(response.code)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.uId).then(response => {
                const { data } = response
                if (!data) {
                    reject('Verification failed, please Login again.')
                }
                commit('SET_USER_INFO', response.data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            removeToken()
            resetRouter()
            resolve()
                // logout(state.token).then(() => {
                //     commit('SET_TOKEN', '')
                //     removeToken()
                //     resetRouter()
                //     resolve()
                // }).catch(error => {
                //     reject(error)
                // })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
