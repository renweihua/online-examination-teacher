<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.noticeContent" placeholder="搜索公告" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.teaName" placeholder="搜索发布人姓名" clearable style="width: 200px;margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 0;margin-right: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        添加公告
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'notice_id', order: 'descending'}"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="notice_id" sortable align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.notice_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notice_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notice_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人姓名" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.teacher.teacher_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tno" sortable label="发布教工号" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.teacher.teacher_no }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" sortable label="发布公告时间" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="220">
        <template slot-scope="{row}">
          <el-button v-waves type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑公告
          </el-button>
          <el-button v-waves type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteNotice(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="公告标题" prop="notice_title">
          <el-input v-model="temp.notice_title" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="公告内容" prop="notice_content">
          <el-input v-model="temp.notice_content" :rows="4" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='添加'?createData():updateData()">
          {{ dialogStatus==='添加'?'确认发布':'确认编辑' }}
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
import { reqGetNoticesList, reqInsertNoticeInfo, reqUpdateNoticeInfo, reqDeleteNotice } from '@/api/notice'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

export default {
  name: 'InfoTable',
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
        noticeContent: undefined,
        teaName: undefined
      },
      temp: {
        notice_title: '',
        notice_content: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        noticeContent: [{ required: true, message: '公告内容为必填项', trigger: 'blur' }],
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
    this.getList()
  },
  methods: {
    parseTime,
    async getList() {
      this.listLoading = true
      let result = await reqGetNoticesList()
      if (result.http_status === 200){
        let lists = result.data;
        this.total = lists.total;
        this.list = lists.data;
      }
      this.listLoading = false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象
      this.dialogStatus = '编辑'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.handleUpdateNotice()
        }
      })
    },
    async handleUpdateNotice() {
      let result = await reqUpdateNoticeInfo(this.temp)
      if (result.http_status === 200){
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
    async handleFilter(){
      this.listQuery.page = 1
      this.listLoading = true
      let result = await reqGetNoticesList({
        search: this.listQuery.noticeContent,
        teacher_name: this.listQuery.teaName
      })
      if (result.http_status === 200){
        let lists = result.data;
        this.total = lists.total;
        this.list = lists.data;
      }
      this.listLoading = false
    },
    resetTemp(){
      this.temp = {
        notice_title: '',
        notice_content: '',
      }
    },
    handleCreate(){
      this.resetTemp()
      this.dialogStatus = '添加'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.insertNoticeInfo()
        }
      })
    },
    async insertNoticeInfo(){
      let result = await reqInsertNoticeInfo(this.temp)
      if (result.http_status === 200){
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
    confirmDeleteNotice(row) {
      this.$confirm('确定删除该公告吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDeleteNotice(row)
      }).catch(() => {
      })
    },
    async handleDeleteNotice(row) {
      let notice_id = row.notice_id
      let result = await reqDeleteNotice({notice_id})
      if (result.http_status === 200){
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
    }
  }
}
</script>
