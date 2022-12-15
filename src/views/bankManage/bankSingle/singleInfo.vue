<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.question_content" placeholder="搜索题目内容" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.course_id" placeholder="搜索科目下的问题" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.compose_flag" placeholder="搜索是否被组成试卷" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in composeFlagOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加题目
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'id', order: 'ascending'}"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="">
              <span>{{ scope.row.question_content }}</span>
            </el-form-item>
            <el-form-item label="">
              <viewer v-if="scope.row.pictureSrc">
                <img :src="scope.row.pictureSrc">
              </viewer>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_A" label="">
              <span>{{ scope.row.choice_A }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_B" label="">
              <span>{{ scope.row.choice_B }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_C" label="">
              <span>{{ scope.row.choice_C }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_D" label="">
              <span>{{ scope.row.choice_D }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_E" label="">
              <span>{{ scope.row.choice_E }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_F" label="">
              <span>{{ scope.row.choice_F }}</span>
            </el-form-item>
            <el-form-item v-if="scope.row.choice_G" label="">
              <span>{{ scope.row.choice_G }}</span>
            </el-form-item>
            <el-form-item label="题目答案：">
              <span>{{ scope.row.question_answer }}</span>
            </el-form-item>
            <el-form-item label="答案解析：">
              <span>{{ scope.row.answer_explain || '暂无解析' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="id" sortable align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.question_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.question_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目配图" align="center">
        <template slot-scope="scope">
          <viewer v-if="scope.row.pictureSrc">
            <img :src="scope.row.pictureSrc" style="width: 120px;height: 60px">
          </viewer>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="compose_flag" sortable label="是否被组成试卷" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.compose_flag === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="course_id" sortable label="所属科目" align="center">
        <template v-if="scope.row.course" slot-scope="scope">
          <viewer>
            <img :src="scope.row.course.course_cover" style="width: 40px;height: 40px;border-radius: 20px;">
          </viewer>
          <div>{{ scope.row.course.course_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="240">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑题目
          </el-button>
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteQue(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="题目内容" prop="question_content">
          <el-input v-model="temp.question_content" :rows="5" type="textarea" />
        </el-form-item>
        <el-form-item label="题目配图">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="/api/admin/uploadPicture">
            <img v-if="temp.pictureSrc" :src="temp.pictureSrc" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          <el-button v-waves :disabled="!temp.pictureSrc" type="danger" icon="el-icon-delete" size="mini" @click="deletePictureSrc">
            删除
          </el-button>
        </el-form-item>
        <el-form-item label="选项A" prop="choice_A">
          <el-input v-model="temp.choice_A" placeholder="内容必须以字符A加:开头" />
        </el-form-item>
        <el-form-item label="选项B" prop="choice_B">
          <el-input v-model="temp.choice_B" placeholder="内容必须以字符B加:开头" />
        </el-form-item>
        <el-form-item label="选项C" prop="choice_C">
          <el-input v-model="temp.choice_C" placeholder="内容必须以字符C加:开头" />
        </el-form-item>
        <el-form-item label="选项D" prop="choice_D">
          <el-input v-model="temp.choice_D" placeholder="内容必须以字符D加:开头" />
        </el-form-item>
        <el-form-item label="选项E">
          <el-input v-model="temp.choice_E" placeholder="内容必须以字符E加:开头" />
        </el-form-item>
        <el-form-item label="选项F">
          <el-input v-model="temp.choice_F" placeholder="内容必须以字符F加:开头" />
        </el-form-item>
        <el-form-item label="选项G">
          <el-input v-model="temp.choice_G" placeholder="内容必须以字符G加:开头" />
        </el-form-item>
        <el-form-item label="题目答案" prop="question_answer">
          <el-radio v-model="temp.question_answer" label="A">A</el-radio>
          <el-radio v-model="temp.question_answer" label="B">B</el-radio>
          <el-radio v-model="temp.question_answer" label="C">C</el-radio>
          <el-radio v-model="temp.question_answer" label="D">D</el-radio>
          <el-radio v-if="temp.choice_E" v-model="temp.question_answer" label="E" >E</el-radio>
          <el-radio v-if="temp.choice_F" v-model="temp.question_answer" label="F" >F</el-radio>
          <el-radio v-if="temp.choice_G" v-model="temp.question_answer" label="G" >G</el-radio>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-input v-model="temp.answer_explain" :rows="5" type="textarea" />
        </el-form-item>
        <el-form-item label="所属科目" prop="course_id">
          <el-select v-model="temp.course_id" placeholder="请选择科目" clearable style="width: 200px;margin-right: 15px;" class="filter-item" >
            <el-option v-for="item in langOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='添加题目'?createData():updateData()">
          {{ dialogStatus==='添加题目'?'确认添加':'确认编辑' }}
        </el-button>
      </div>
    </el-dialog>

    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
/* eslint-disable */

import { getVueCourses } from '@/api/common'
import { getQuestionBanks, reqSearchSingleList, reqDeleteSingle, reqInsertSingleInfo, reqUpdateSingleInfo } from '@/api/bankManage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

export default {
  name: 'SingleInfo',
  components: { Pagination, BackToTop },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        question_content: '',
        course_id: undefined,
        compose_flag: undefined
      },
      composeFlagOptions: [{ label: '是', key: '1' }, { label: '否', key: '0' }],
      langOptions: [],
      temp: {
        question_content: '',
        pictureSrc: '',
        choice_A: '',
        choice_B: '',
        choice_C: '',
        choice_D: '',
        choice_E: '',
        choice_F: '',
        choice_G: '',
        question_options: {
        },
        question_answer: '',
        answer_explain: '',
        course_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        question_content: [{ required: true, message: '题目内容为必填项', trigger: 'change' }],
        choice_A: [{ required: true, message: '选项A为必填项', trigger: 'change' }],
        choice_B: [{ required: true, message: '选项B为必填项', trigger: 'change' }],
        choice_C: [{ required: true, message: '选项C为必填项', trigger: 'change' }],
        choice_D: [{ required: true, message: '选项D为必填项', trigger: 'change' }],
        question_answer: [{ required: true, message: '题目答案为必填项', trigger: 'change' }],
        course_id: [{ required: true, message: '所属科目为必填项', trigger: 'change' }]
      },
      downloadLoading: false,
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  created() {
      this.vueCourses();
    this.getList()
  },
  methods: {
      async vueCourses(){
        let result = await getVueCourses();
        this.langOptions = result.data;
      },
    async getList() {
      this.listLoading = true
      const result = await getQuestionBanks(this.listQuery);
      if (result.http_status === 200) {
        const lists = result.data;
        this.total = lists.total
        this.list = lists.data;
      }
      this.listLoading = false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象
      this.dialogStatus = '编辑题目'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.handleUpdateSingle()
        }
      })
    },
    async handleUpdateSingle() {
      const result = await reqUpdateSingleInfo(this.temp)
      if (result.statu === 0) {
        this.dialogFormVisible = false
        this.$message({
          message: result.msg,
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
        course_id = 0
      }
      let compose_flag = this.listQuery.compose_flag
      if (this.listQuery.compose_flag === null || this.listQuery.compose_flag === undefined) {
        compose_flag = undefined
      }
      const result = await reqSearchSingleList(this.listQuery.question_content, course_id, compose_flag)
      if (result.statu === 0) {
        this.total = result.data.length
        this.list = result.data.filter((item, index) => index < this.listQuery.limit * this.listQuery.page && index >= this.listQuery.limit * (this.listQuery.page - 1))
      }
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        question_content: '',
        pictureSrc: '',
        choice_A: '',
        choice_B: '',
        choice_C: '',
        choice_D: '',
        choice_E: '',
        choice_F: '',
        choice_G: '',
        question_options: {
        },
        question_answer: '',
        answer_explain: '',
        course_id: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加题目'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.insertSingleInfo()
        }
      })
    },
    async insertSingleInfo() {
      this.temp.question_options = {
        'choice_A': this.temp.choice_A,
        'choice_B': this.temp.choice_B,
        'choice_C': this.temp.choice_C,
        'choice_D': this.temp.choice_D,
        'choice_E': this.temp.choice_E,
        'choice_F': this.temp.choice_F,
        'choice_G': this.temp.choice_G,
      };
      // 单选类型
      this.temp.question_type = 0;
      const result = await reqInsertSingleInfo(this.temp)
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
    confirmDeleteQue(row) {
      this.$confirm('确定删除该题目吗?若题目已被组成试卷则无法删除', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.compose_flag === '1') {
          this.$message({
            message: '该题目已被组成试卷，无法删除',
            type: 'error'
          })
        } else {
          this.handleDeleteQue(row)
        }
      }).catch(() => {
      })
    },
    async handleDeleteQue(row) {
      const singleId = row.singleId
      const result = await reqDeleteSingle(singleId)
      if (result.statu === 0) {
        this.$message({
          message: result.msg,
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
    handleAvatarSuccess(res, file) {
      // this.temp.pictureSrc = URL.createObjectURL(file.raw)
      this.temp.pictureSrc = res.data
    },
    beforeAvatarUpload(file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isType) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isType && isLt4M
    },
    deletePictureSrc() {
      this.temp.pictureSrc = ''
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" type="text/scss" scoped>
  .demo-table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 280px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 280px;
    height: 80px;
    display: block;
  }
</style>
