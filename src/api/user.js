import request from '@/utils/request'

export function login(data) {
    return request({
        url: 'http://127.0.0.1:8080/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: 'http://127.0.0.1:8080/user/info',
        method: 'get'
    })
}

export function logout() {
    // removeToken()
    return 'OK'
        // 登出需要进行token失效处理
        // request({
        //     url: '/user/logout',
        //     method: 'post'
        // })
}
