import ajax from '@/config/ajax'

// 获取全部公告信息
export const reqGetPapersList = () => ajax('/getTeacherPapersList')
// 获取搜素公告信息
export const reqSearchPapersList = (paper_name, course_id, paperType) => ajax('/searchPapersList', { paper_name, course_id, paperType })
// 请求删除试卷
export const reqDeletePaper = (paperId) => ajax('/deletePaper', { paperId }, 'POST')
// 请求获取选中试卷问题详情
export const reqPaperQueDetailByPaperId = (paperId, totalNum) => ajax('/getPaperQueDetailByPaperId', { paperId, totalNum })
// 请求随机组卷，插入试卷数据，即发布试卷
export const reqRandomInsertPaperInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 请求固定组卷，插入试卷数据，即发布试卷
export const reqFixedInsertPaperInfo = (temp) => ajax('/fixedInsertPaperInfo', temp, 'POST')
// 请求通过langId获取科目下的所有问题
export const reqPaperQueDetailByLangId = (course_id) => ajax('/getPaperQueDetailByLangId', { course_id })
