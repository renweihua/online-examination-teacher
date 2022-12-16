/* eslint-disable */


import ajax from '@/config/ajax'
import request from '@/utils/request'


// 获取题库列表
export const getQuestionBanks = (data) => request({
	url: `/question_bank`,
	method: 'get',
    data
})




// 删除单选题
export const reqDeleteSingle = (singleId) => ajax('/question_bank/delete', { singleId }, 'POST')
// 添加单选题题目
export const reqInsertSingleInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 更新单选题题目
export const reqUpdateSingleInfo = (temp) => ajax('/question_bank/update', temp, 'PUT')
// 添加导入单选题Excel文件
export const reqInsertSingleList = (singleList) => ajax('/insertSingleList', { singleList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 删除多选题
export const reqDeleteMultiple = (multipleId) => ajax('/question_bank/delete', { multipleId }, 'POST')
// 添加多选题题目
export const reqInsertMultipleInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 更新多选题题目
export const reqUpdateMultipleInfo = (temp) => ajax('/question_bank/update', temp, 'PUT')
// 添加导入多选题Excel文件
export const reqInsertMultipleList = (multipleList) => ajax('/insertMultipleList', { multipleList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 删除判断题
export const reqDeleteJudge = (judgeId) => ajax('/question_bank/delete', { judgeId }, 'POST')
// 添加判断题题目
export const reqInsertJudgeInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 更新判断题题目
export const reqUpdateJudgeInfo = (temp) => ajax('/question_bank/update', temp, 'PUT')
// 添加导入判断题Excel文件
export const reqInsertJudgeList = (judgeList) => ajax('/insertJudgeList', { judgeList }, 'POST')
// ---------------------------------------------------------------------------------------------------------------
// 删除填空题
export const reqDeleteFill = (fillId) => ajax('/question_bank/delete', { fillId }, 'POST')
// 添加填空题题目
export const reqInsertFillInfo = (temp) => ajax('/question_bank/create', temp, 'POST')
// 更新填空题题目
export const reqUpdateFillInfo = (temp) => ajax('/question_bank/update', temp, 'PUT')
// 添加导入填空题Excel文件
export const reqInsertFillList = (fillList) => ajax('/inserFillList', { fillList }, 'POST')
