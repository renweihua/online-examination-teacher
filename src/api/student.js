/* eslint-disable */

import ajax from '@/config/ajax'
import request from '@/utils/request'

const BASE_URL = process.env.BASE_API

// 获取全部学生信息
export const reqGetStudentsList = (params) => request({
    url: `/student`,
    method: 'get',
    params,
})
// 更改学生登录密码
export const updateStudentPassword = (data) => request({
    url: `/student/update-password`,
    method: 'patch',
    data,
})
// 更改学生账户状态
export const setStudentStatus = (data) => request({
    url: `/student/set-status`,
    method: 'patch',
    data,
})

// 请求添加学生信息
export const reqInsertStudentInfo = (temp) => ajax(BASE_URL + '/insertStudentInfo', temp, 'POST')

// 获取全部成绩信息
export const reqGetScoresList = (params) => request({
    url: `/paper-score`,
    method: 'get',
    params,
})

// 请求删除成绩
export const reqDeleteScore = (row) => ajax(BASE_URL + '/deleteScore', row, 'POST')
// 请求搜索成绩信息
export const reqSearchScoresList = (sno, paperId) => ajax(BASE_URL + '/searchScoresList', { sno, paperId })

// 获取全部已发布试卷信息
export const reqGetPapersList = () => ajax(BASE_URL + '/getPapersList')
// 请求获取成绩图标数据
export const reqGetChartData = (params) => request({
    url: `/paper-score/chart-statistics`,
    method: 'get',
    params,
})

// 插入上传学生信息数据
export const reqInsertStudentInfoList = (studentList) => ajax(BASE_URL + '/insertStudentInfoList', { studentList }, 'POST')
