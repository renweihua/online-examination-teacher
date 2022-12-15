/* eslint-disable */

import ajax from '@/config/ajax'

// Vue格式的课程列表
export const getVueCourses = () => ajax('/vue-courses')