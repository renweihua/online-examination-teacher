/* eslint-disable */

/*
ajax 请求函数模块
*/
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

const BASE_URL = process.env.BASE_API

/**
 * 向外部暴漏一个函数 ajax
 * @param {*} url 请求路径，默认为空
 * @param {*} data 请求参数，默认为空对象
 * @param {*} type 请求方法，默认为GET
 */
// axios.defaults.withCredentials = true
export default function ajax(url = '', data = {}, type = 'GET') {
  url = BASE_URL + url;
  // 返回值 Promise对象 （异步返回的数据是response.data，而不是response）
  return new Promise(function(resolve, reject) {
    // （利用axios）异步执行ajax请求
    let promise // 这个内部的promise用来保存axios的返回值(promise对象)
    if (type === 'GET') {
      // 准备 url query 参数数据
      let dataStr = '' // 数据拼接字符串，将data连接到url
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送 get 请求
      promise = axios.get(url)
    } else if (type === 'PUT') {
      promise = axios.put(url, data)
    }  else if (type === 'DELETE') {
      promise = axios.delete(url, data)
    } else {
      // 发送 post 请求
      promise = axios.post(url, data)
    }
    promise.then(response => {
      // 成功回调resolve()
      resolve(response.data)
    })
      .catch(error => {
        // 失败回调reject()

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

        reject(error);
      })
  })
}
