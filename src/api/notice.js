/* eslint-disable */


import ajax from '@/config/ajax'
import request from '@/utils/request'
const BASE_URL = process.env.BASE_API

// 获取全部公告信息
export const reqGetNoticesList = (params) => request({
    url: `/notice`,
    method: 'get',
    params,
})
// 请求添加公告信息
export const reqInsertNoticeInfo = (data) => request({
    url: `/notice/create`,
    method: 'post',
    data,
})
// 请求更新公告内容
export const reqUpdateNoticeInfo = (data) => request({
    url: `/notice/update`,
    method: 'put',
    data,
})
// 请求删除公告
export const reqDeleteNotice = (data) => request({
    url: `/notice/delete`,
    method: 'delete',
    data,
})
