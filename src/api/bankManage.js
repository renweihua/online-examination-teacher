import ajax from '@/config/ajax'

// 获取题库列表
export const getQuestionBanks = (params) => ajax('/question_bank', params)








// 获取搜素单选题信息
export const reqSearchSingleList = (content, course_id, compose_flag) => ajax('/searchSingleList', { content, course_id, compose_flag })
// 删除单选题
export const reqDeleteSingle = (singleId) => ajax('/deleteSingle', { singleId }, 'POST')
// 添加单选题题目
export const reqInsertSingleInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 更新单选题题目
export const reqUpdateSingleInfo = (temp) => ajax('/updateSingleInfo', temp, 'POST')
// 添加导入单选题Excel文件
export const reqInsertSingleList = (singleList) => ajax('/insertSingleList', { singleList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 获取搜素多选题信息
export const reqSearchMultipleList = (content, course_id, compose_flag) => ajax('/searchMultipleList', { content, course_id, compose_flag })
// 删除多选题
export const reqDeleteMultiple = (multipleId) => ajax('/deleteMultiple', { multipleId }, 'POST')
// 添加多选题题目
export const reqInsertMultipleInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 更新多选题题目
export const reqUpdateMultipleInfo = (temp) => ajax('/updateMultipleInfo', temp, 'POST')
// 添加导入多选题Excel文件
export const reqInsertMultipleList = (multipleList) => ajax('/insertMultipleList', { multipleList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 获取全部判断题信息
export const reqGetJudgeList = () => ajax('/getJudgeList')
// 获取搜素判断题信息
export const reqSearchJudgeList = (content, course_id, compose_flag) => ajax('/searchJudgeList', { content, course_id, compose_flag })
// 删除判断题
export const reqDeleteJudge = (judgeId) => ajax('/deleteJudge', { judgeId }, 'POST')
// 添加判断题题目
export const reqInsertJudgeInfo = (temp) => ajax('/insertJudgeInfo', temp, 'POST')
// 更新判断题题目
export const reqUpdateJudgeInfo = (temp) => ajax('/updateJudgeInfo', temp, 'POST')
// 添加导入判断题Excel文件
export const reqInsertJudgeList = (judgeList) => ajax('/insertJudgeList', { judgeList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 获取全部填空题信息
export const reqGetFillList = () => ajax('/getFillList')
// 获取搜素填空题信息
export const reqSearchFillList = (content, course_id, compose_flag) => ajax('/searchFillList', { content, course_id, compose_flag })
// 删除填空题
export const reqDeleteFill = (fillId) => ajax('/deleteFill', { fillId }, 'POST')
// 添加填空题题目
export const reqInsertFillInfo = (temp) => ajax('/insertFillInfo', temp, 'POST')
// 更新填空题题目
export const reqUpdateFillInfo = (temp) => ajax('/updateFillInfo', temp, 'POST')
// 添加导入填空题Excel文件
export const reqInsertFillList = (fillList) => ajax('/inserFillList', { fillList }, 'POST')
