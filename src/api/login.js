/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from '@/config/ajax'
const BASE_URL = process.env.BASE_API

// 获取胡老师账号密码
export const reqGetTeaHuPsw = (teacher_no) => ajax(BASE_URL + '/getTeaHuPsw', { teacher_no })
// 校验教师登录
export const reqLogin = (teacher_no, password) => ajax(BASE_URL + '/auth/login', { teacher_no, password }, 'POST')
// 请求退出登录
export const reqLogOut = () => ajax(BASE_URL + '/teacherLogOut')
