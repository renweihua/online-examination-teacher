import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { getStore, removeStore } from '@/utils/mUtils'

let timeout = 20000;

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: timeout, // 请求超时时间
  headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      "Content-Type": "application/json;charset=utf-8",
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    let access_token = getStore('access_token')
    if (access_token) {
      config.headers['Authorization'] = access_token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
        if (config.data) {
            // config.data = JSON.stringify(config.data)
        }
    }
    // console.log(config.data);
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // 如果服务端返回新的Token，那么自动更新本地的access_token
    if (response.headers.new_authorization) {
        setStore('access_token', response.headers.new_authorization);
    }

    const res = response.data
    // console.log(res);
    if (res.http_status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    let msg = error.msg;
    if (error.response == undefined){
        msg = '超时 ' + timeout + ' ms，请刷新！';
    }else{
        switch (error.response.status) {
            case 404:
                msg = error.response.statusText;
                break;
            case 400:
                msg = error.response.data.msg || error.response.statusText;
                break;
            case 401: // 认证失败
                msg = error.response.data.msg || error.response.statusText;
                // 移除Token
                removeStore('teacherInfo')
                removeStore('access_token');

                MessageBox.confirm(
                  '登录状态已失效，可以取消继续留在该页面，或者重新登录',
                  '登录Token失效-401',
                  {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                ).then(() => {
                  store.dispatch('FedLogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                  })
                });
                break;
            case 500:
                msg = error.response.data.msg || error.response.statusText;
                break;
        }
    }
    Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
    });
    return Promise.reject(error)
  }
)

export default service
