<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.paper_name" placeholder="搜索试卷名称" clearable style="width: 200px;margin-right: 15px;"
        class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.course_id" placeholder="搜索科目" clearable style="width: 200px;margin-right: 15px;"
        class="filter-item" @change="handleFilter">
        <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.paper_mechanism" placeholder="搜索试卷类型" clearable
        style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in paperTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search"
        @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary"
        icon="el-icon-edit-outline" @click="handleFixedCreate">
        固定组卷
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary"
        icon="el-icon-edit" @click="handleCreate">
        随机组卷
      </el-button>
      <div><span style="color: #FF0000"><i class="el-icon-warning" style="margin-right: 10px" />鼠标右键单击选中行可查看试卷详情</span>
      </div>
    </div>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" :default-sort="{prop: 'id', order: 'ascending'}"
      border fit highlight-current-row style="width: 100%;" @row-contextmenu="seePaperDetail">
      <el-table-column label="序号" prop="paper_id" sortable align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.paper_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.paper_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="course_id" sortable label="所属科目" align="center">
        <template v-if="scope.row.course" slot-scope="scope">
          <viewer v-if="scope.row.course.course_cover">
            <img :src="scope.row.course.course_cover" style="width: 40px;height: 40px;border-radius: 20px;">
          </viewer>
          <div>{{ scope.row.course.course_name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="paper_duration" sortable label="考试时长" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.paper_duration/60 }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column prop="paper_difficulty" sortable label="难度系数" align="center" width="142">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.paper_difficulty" disabled text-color="#ff9900" score-template="{value}" />
        </template>
      </el-table-column>
      <el-table-column label="考试注意事项" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.paper_attention }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paper_mechanism_text" sortable label="试卷类型" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.paper_mechanism_text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total_score" sortable label="试卷总分" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.total_score }}分</span>
        </template>
      </el-table-column>
      <el-table-column prop="student_count" sortable label="已参加人数" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.student_count }}人</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" sortable label="试卷创建时间" align="center" width="155">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="122">
        <template slot-scope="{row}">
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeletePaper(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <!--查看试卷详情弹出框-->
    <el-dialog :visible.sync="paperDetailDialogFormVisible" :title="clickPaperTitle" style="margin-bottom: 20px">
      <div style="height: 50px;line-height: 50px;margin-top: -35px;color: #ff9e8c">{{ subPaperTitle }}</div>
      <div style="height: 50px;line-height: 50px;margin-top: -20px;color: #00d2c9">{{ minSubPaperTitle }}</div>
      <el-input v-model="filterText" placeholder="查找试卷问题关键字" style="margin-bottom:30px;" />
      <el-tree ref="paperDataTree" :data="paperData" :props="defaultProps" :filter-node-method="filterNode"
        class="filter-tree" />
    </el-dialog>

    <!--固定组卷弹出框-->
    <el-dialog :visible.sync="fixedDialogFormVisible" title="固定组卷" style="margin-bottom: 20px">
      <el-form ref="fixedDataForm" :rules="fixRules" :model="temp" label-position="left" label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="所属科目" prop="course_id">
          <el-select v-model="temp.course_id" placeholder="选择科目" clearable style="width: 200px;margin-right: 15px;"
            class="filter-item" @change="fixedLangIdChange">
            <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷名称" prop="paper_name">
          <el-input v-model="temp.paper_name" />
        </el-form-item>
        <el-form-item label="考试时长" prop="paper_duration">
          <el-time-select v-model="temp.paper_duration" :picker-options="{
              start: '00:10',
              step: '00:10',
              end: '05:00'
            }" placeholder="选择时间(时:分)" />
        </el-form-item>
        <el-form-item label="难度系数" prop="paper_difficulty">
          <el-rate v-model="temp.paper_difficulty" style="margin-top: 10px" />
        </el-form-item>
        <el-form-item label="注意事项" prop="paper_attention">
          <el-input v-model="temp.paper_attention" type="textarea" />
        </el-form-item>
        <el-form-item label="单选题分值" prop="singleScore">
          <el-input-number v-model="temp.singleScore" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="多选题分值" prop="multipleScore">
          <el-input-number v-model="temp.multipleScore" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="判断题分值" prop="judgeScore">
          <el-input-number v-model="temp.judgeScore" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="填空题分值" prop="fillScore">
          <el-input-number v-model="temp.fillScore" :min="1" :max="99" />
        </el-form-item>
        <div style="width: 600px">
          <el-input v-model="fixedFilterText" placeholder="查找试卷问题关键字" style="margin-bottom:30px;" />
          <el-tree ref="fixedPaperDataTree" :data="fixedPaperData" :props="defaultProps"
            :filter-node-method="filterNode" show-checkbox class="filter-tree" />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fixedDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="fixedCreateData">
          确认发布
        </el-button>
      </div>
    </el-dialog>

    <!--随机组卷弹出框-->
    <el-dialog :visible.sync="dialogFormVisible" title="随机组卷" style="margin-bottom: 20px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="所属科目" prop="course_id">
          <el-select v-model="temp.course_id" placeholder="选择科目" clearable style="width: 200px;margin-right: 15px;"
            class="filter-item">
            <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷名称" prop="paper_name">
          <el-input v-model="temp.paper_name" />
        </el-form-item>
        <el-form-item label="考试时长" prop="paper_duration">
          <el-time-select v-model="temp.paper_duration" :picker-options="{
              start: '00:10',
              step: '00:10',
              end: '05:00'
            }" placeholder="选择时间(时:分)" />
        </el-form-item>
        <el-form-item label="难度系数" prop="paper_difficulty">
          <el-rate v-model="temp.paper_difficulty" style="margin-top: 10px" />
        </el-form-item>
        <el-form-item label="注意事项" prop="paper_attention">
          <el-input v-model="temp.paper_attention" type="textarea" />
        </el-form-item>
        <el-form-item label="单选题分值" prop="singleScore">
          <el-input-number v-model="temp.singleScore" :min="0" :max="99" />
        </el-form-item>
        <el-form-item label="单选题数目" prop="singleNum">
          <el-input-number v-model="temp.singleNum" :min="0" :max="30" />
        </el-form-item>
        <el-form-item label="多选题分值" prop="multipleScore">
          <el-input-number v-model="temp.multipleScore" :min="0" :max="99" />
        </el-form-item>
        <el-form-item label="多选题数目" prop="multipleNum">
          <el-input-number v-model="temp.multipleNum" :min="0" :max="10" />
        </el-form-item>
        <el-form-item label="判断题分值" prop="judgeScore">
          <el-input-number v-model="temp.judgeScore" :min="0" :max="99" />
        </el-form-item>
        <el-form-item label="判断题数目" prop="judgeNum">
          <el-input-number v-model="temp.judgeNum" :min="0" :max="20" />
        </el-form-item>
        <el-form-item label="填空题分值" prop="fillScore">
          <el-input-number v-model="temp.fillScore" :min="0" :max="99" />
        </el-form-item>
        <el-form-item label="填空题数目" prop="fillNum">
          <el-input-number v-model="temp.fillNum" :min="0" :max="30" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          确认发布
        </el-button>
      </div>
    </el-dialog>

    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50"
        transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
  /* eslint-disable */
  import {
    getPapers,
    reqDeletePaper,
    reqPaperQueDetailByPaperId,
    reqRandomInsertPaperInfo,
    reqFixedInsertPaperInfo,
    reqPaperQueDetailByLangId
  } from '@/api/paper'
  import {
    getVueCourses
  } from '@/api/common'



  import waves from '@/directive/waves' // Waves directive
  import {
    parseTime
  } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import BackToTop from '@/components/BackToTop'

  export default {
    name: 'PaperInfo',
    components: {
      Pagination,
      BackToTop
    },
    directives: {
      waves,
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          paper_name: undefined,
          course_id: undefined,
          paper_mechanism: undefined
        },
        langOptions: [],
        paperTypeOptions: [{
          label: '随机组卷',
          key: '0'
        }, {
          label: '固定组卷',
          key: '1'
        }],
        temp: {
          paper_name: '',
          paper_duration: '',
          paper_difficulty: undefined,
          paper_attention: '',
          singleScore: undefined,
          singleNum: undefined,
          multipleScore: undefined,
          multipleNum: undefined,
          judgeScore: undefined,
          judgeNum: undefined,
          fillScore: undefined,
          fillNum: undefined,
          course_id: undefined,
          paper_config: {}
        },
        fixedDialogFormVisible: false,
        dialogFormVisible: false,
        paperDetailDialogFormVisible: false,
        clickPaperTitle: '',
        subPaperTitle: '',
        minSubPaperTitle: '',
        filterText: '',
        fixedFilterText: '',
        paperData: [],
        fixedPaperData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        fixRules: {
          course_id: [{
            required: true,
            message: '试卷名称为必填项',
            trigger: 'change'
          }],
          paper_name: [{
            required: true,
            message: '试卷名称为必填项',
            trigger: 'change'
          }],
          paper_duration: [{
            required: true,
            message: '考试时长为必填项',
            trigger: 'change'
          }],
          paper_difficulty: [{
            required: true,
            message: '难度系数为必填项',
            trigger: 'change'
          }],
          singleScore: [{
            required: true,
            message: '单选题分数为必填项',
            trigger: 'change'
          }],
          multipleScore: [{
            required: true,
            message: '多选题分数为必填项',
            trigger: 'change'
          }],
          judgeScore: [{
            required: true,
            message: '判断题分数为必填项',
            trigger: 'change'
          }],
          fillScore: [{
            required: true,
            message: '填空题分数为必填项',
            trigger: 'change'
          }],
        },
        rules: {
          course_id: [{
            required: true,
            message: '试卷名称为必填项',
            trigger: 'change'
          }],
          paper_name: [{
            required: true,
            message: '试卷名称为必填项',
            trigger: 'change'
          }],
          paper_duration: [{
            required: true,
            message: '考试时长为必填项',
            trigger: 'change'
          }],
          paper_difficulty: [{
            required: true,
            message: '难度系数为必填项',
            trigger: 'change'
          }],
          singleScore: [{
            required: true,
            message: '单选题分数为必填项',
            trigger: 'change'
          }],
          singleNum: [{
            required: true,
            message: '单选题数目为必填项',
            trigger: 'change'
          }],
          multipleScore: [{
            required: true,
            message: '多选题分数为必填项',
            trigger: 'change'
          }],
          multipleNum: [{
            required: true,
            message: '多选题数目为必填项',
            trigger: 'change'
          }],
          judgeScore: [{
            required: true,
            message: '判断题分数为必填项',
            trigger: 'change'
          }],
          judgeNum: [{
            required: true,
            message: '判断题数目为必填项',
            trigger: 'change'
          }],
          fillScore: [{
            required: true,
            message: '填空题分数为必填项',
            trigger: 'change'
          }],
          fillNum: [{
            required: true,
            message: '填空题数目为必填项',
            trigger: 'change'
          }],
        },
        downloadLoading: false,
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.paperDataTree.filter(val)
      },
      fixedFilterText(val) {
        this.$refs.fixedPaperDataTree.filter(val)
      }
    },
    created() {
      this.vueCourses();
      this.getList()
    },
    methods: {
      parseTime,
      async vueCourses() {
        let result = await getVueCourses();
        this.langOptions = result.data;
      },
      async getList() {
        this.listLoading = true
        let result = await getPapers()
        if (result.http_status === 200) {
          const lists = result.data;
          this.total = lists.total
          this.list = lists.data;
        }
        // 延迟0.5秒等待请求数据
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      async seePaperDetail(row, column, event) {
        // 阻止鼠标右键默认事件
        event.preventDefault()
        let result = await reqPaperQueDetailByPaperId(row.paper_id)
        console.log(result);
        let singleData = result.data.singleData
        let multipleData = result.data.multipleData
        let judgeData = result.data.judgeData
        let fillData = result.data.fillData
        //初始化数据
        this.filterText = ''
        this.clickPaperTitle = `试卷详情：${row.paper_name}`
        this.subPaperTitle = `试卷总分：${row.total_score}分，试卷总题数：${row.total_num}道。`

        this.minSubPaperTitle = '';
        if(row.paper_config.single.num){
          this.minSubPaperTitle += `单选题${row.paper_config.single.num}道（每道${row.paper_config.single.score}分）`;
        }
        if(row.paper_config.multiple.num){
          if(this.minSubPaperTitle) this.minSubPaperTitle += '，';
          this.minSubPaperTitle += `多选题${row.paper_config.multiple.num}道（每道${row.paper_config.multiple.score}分）`;
        }
        if(row.paper_config.judge.num){
          if(this.minSubPaperTitle) this.minSubPaperTitle += '，';
          this.minSubPaperTitle += `判断题${row.paper_config.judge.num}道（每道${row.paper_config.judge.score}分）`;
        }
        if(row.paper_config.fill.num){
          if(this.minSubPaperTitle) this.minSubPaperTitle += '，';
          this.minSubPaperTitle += `填空题${row.paper_config.fill.num}道（每道${row.paper_config.fill.score}分）`;
        }
        
        this.paperData = [{
          id: 1,
          label: '单选题列表',
          children: singleData
        }, {
          id: 2,
          label: '多选题列表',
          children: multipleData
        }, {
          id: 3,
          label: '判断题列表',
          children: judgeData
        }, {
          id: 4,
          label: '填空题列表',
          children: fillData
        }]
        // 显示弹出对话框
        this.paperDetailDialogFormVisible = true
      },
      confirmDeletePaper(row) {
        this.$confirm('若试卷已有学生考试则无法删除，确定删除该试卷吗?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletePaper(row)
        }).catch(() => {})
      },
      async deletePaper(row) {
        let result = await reqDeletePaper(row.paperId)
        if (result.statu === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: result.msg,
            type: 'error'
          })
        }
      },
      async handleFilter() {
        this.listQuery.page = 1
        this.listLoading = true
        let course_id = this.listQuery.course_id
        if (this.listQuery.course_id === null || this.listQuery.course_id === undefined) {
          course_id = -1
        }
        let paper_mechanism = this.listQuery.paper_mechanism
        if (this.listQuery.paper_mechanism === null || this.listQuery.paper_mechanism === undefined) {
          paper_mechanism = -1
        }
        let result = await getPapers({
          'paper_name': this.listQuery.paper_name,
          course_id,
          paper_mechanism
        })
        if (result.http_status === 200) {
          const lists = result.data;
          this.total = lists.total
          this.list = lists.data;
        }
        // 延迟一秒等待请求数据
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      resetTemp() {
        this.temp = {
          paper_name: '',
          paper_duration: '',
          paper_difficulty: undefined,
          paper_attention: '',
          singleScore: undefined,
          singleNum: undefined,
          multipleScore: undefined,
          multipleNum: undefined,
          judgeScore: undefined,
          judgeNum: undefined,
          fillScore: undefined,
          fillNum: undefined,
          course_id: undefined
        }
      },
      handleFixedCreate() {
        this.fixedFilterText = ''
        this.fixedPaperData = []
        this.resetTemp()
        this.fixedDialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['fixedDataForm'].clearValidate()
        })
      },
      async fixedLangIdChange() {
        this.fixedPaperData = []
        if (this.temp.course_id !== null) {
          let result = await reqPaperQueDetailByLangId(this.temp.course_id)
          let singleData = result.data.singleData
          let multipleData = result.data.multipleData
          let judgeData = result.data.judgeData
          let fillData = result.data.fillData
          //初始化数据
          this.fixedFilterText = ''
          this.fixedPaperData = [{
            id: 1,
            label: '单选题列表',
            children: singleData
          }, {
            id: 2,
            label: '多选题列表',
            children: multipleData
          }, {
            id: 3,
            label: '判断题列表',
            children: judgeData
          }, {
            id: 4,
            label: '填空题列表',
            children: fillData
          }]
        }
      },
      fixedCreateData() {
        this.$refs['fixedDataForm'].validate((valid) => {
          if (valid) {
            let checkedData = this.$refs.fixedPaperDataTree.getCheckedNodes()
            // 过滤掉单选题列表多选题列表判断题列表填空题列表四个id值
            let filtercheckedData = checkedData.filter(item => {
              return item.id > 4
            })
            if (filtercheckedData.length > 0) {
              let singleNum = []
              let multipleNum = []
              let judgeNum = []
              let fillNum = []
              filtercheckedData.forEach((item, index) => {
                let firstStr = (String)(item.id).substring(0, 1)
                let restStr = (String)(item.id).substring(1)
                if (firstStr === '1') {
                  singleNum.push((Number)(restStr))
                }
                if (firstStr === '2') {
                  multipleNum.push((Number)(restStr))
                }
                if (firstStr === '3') {
                  judgeNum.push((Number)(restStr))
                }
                if (firstStr === '4') {
                  fillNum.push((Number)(restStr))
                }
              })
              if (!singleNum.length) {
                this.$message({
                  message: '请选择至少一道单选题',
                  type: 'error'
                })
              } else if (!multipleNum.length) {
                this.$message({
                  message: '请选择至少一道多选题',
                  type: 'error'
                })
              } else if (!judgeNum.length) {
                this.$message({
                  message: '请选择至少一道判断题',
                  type: 'error'
                })
              } else if (!fillNum.length) {
                this.$message({
                  message: '请选择至少一道填空题',
                  type: 'error'
                })
              } else {
                this.temp.singleNum = singleNum
                this.temp.multipleNum = multipleNum
                this.temp.judgeNum = judgeNum
                this.temp.fillNum = fillNum
                this.fixedInsertPaperInfo()
              }
            } else {
              this.$message({
                message: '请勾选题目，如果该科目题目紧缺请选择其他科目组卷',
                type: 'error'
              })
            }
          }
        })
      },
      async fixedInsertPaperInfo() {
        let paper_duration = this.temp.paper_duration;
        let arr = paper_duration.split(":") || paper_duration;
        this.temp.paper_duration = parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60
        this.temp.paper_mechanism = 1;
        console.log(this.temp);
        return;
        let result = await reqFixedInsertPaperInfo(this.temp)
        if (result.http_status === 200) {
          this.fixedDialogFormVisible = false
          this.$notify({
            message: result.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            message: result.msg,
            type: 'error',
            duration: 2000
          })
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.randomInsertPaperInfo()
          }
        })
      },
      async randomInsertPaperInfo() {
        let paper_duration = this.temp.paper_duration;
        if (!(!isNaN(parseFloat(paper_duration)) && isFinite(paper_duration))) {
          let arr = paper_duration.split(":");
          this.temp.paper_duration = parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60;
        }
        // 随机组卷
        this.temp.paper_mechanism = 0;
        // 考试题目对应分数的配置
        this.temp.paper_config = {
          // 单选
          'single': {
            'num': this.temp.singleNum,
            'score': this.temp.singleScore,
          },
          // 多选
          'multiple': {
            'num': this.temp.multipleNum,
            'score': this.temp.multipleScore,
          },
          // 判断题
          'judge': {
            'num': this.temp.judgeNum,
            'score': this.temp.judgeScore,
          },
          // 填空
          'fill': {
            'num': this.temp.fillNum,
            'score': this.temp.fillScore,
          },
        };
        // delete this.temp.singleNum;
        // delete this.temp.singleScore;
        // delete this.temp.multipleNum;
        // delete this.temp.multipleScore;
        // delete this.temp.judgeNum;
        // delete this.temp.judgeScore;
        // delete this.temp.fillNum;
        // delete this.temp.fillScore;
        let result = await reqRandomInsertPaperInfo(this.temp)
        if (result.http_status === 200) {
          this.dialogFormVisible = false
          this.$notify({
            message: result.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            message: result.msg,
            type: 'error',
            duration: 2000
          })
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      }
    }
  }
</script>
