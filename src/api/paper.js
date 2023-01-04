import ajax from '@/config/ajax'
import request from '@/utils/request'


// 获取试卷列表
export const getPapers = (data) => request({
    url: `/paper`,
    method: 'get',
    params: data,
})
// 请求删除试卷
export const reqDeletePaper = (paperId) => ajax('/deletePaper', { paperId }, 'POST')
// 请求获取选中试卷问题详情
export const reqPaperQueDetailByPaperId = (paper_id) => request({
    url: `/paper/detail`,
    method: 'get',
    params: {
        paper_id
    },
})
// 请求随机组卷，插入试卷数据，即发布试卷
export const reqRandomInsertPaperInfo = (data) => request({
    url: `/paper/create`,
    method: 'post',
    data
})

// 请求固定组卷，插入试卷数据，即发布试卷
export const reqFixedInsertPaperInfo = (temp) => ajax('/paper/create', temp, 'POST')
// 请求通过langId获取科目下的所有问题
export const reqPaperQueDetailByLangId = (course_id) => ajax('/getPaperQueDetailByLangId', { course_id })
