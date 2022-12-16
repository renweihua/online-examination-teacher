import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

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
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
        if (config.data) {
            // config.data = JSON.stringify(config.data)
        }
    }
    console.log(config.data);
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
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    console.log(res);
    if (res.http_status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      //
      if (res.http_status === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
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
            case 401: // 认证失败
                msg = error.response.data.msg;
                break;
            case 500: // 认证失败
                msg = error.response.statusText;
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
