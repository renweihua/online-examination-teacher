/* eslint-disable */

import ajax from '@/config/ajax'
import request from '@/utils/request'

// Vue格式的课程列表
export const getVueCourses = () => ajax('/vue-courses')

// Vue格式的试卷列表
export const getVuePapers = (params) => request({
    url: `/vue-papers`,
    method: 'get',
    params,
})