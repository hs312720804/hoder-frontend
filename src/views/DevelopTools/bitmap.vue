<template>
<div>
  <div class="title">bitmap 位文件分页查询</div>
  <el-form :model="form" ref="form" :rules="rules" :inline="true">
    <!-- crowdId: 12045 -->
      <el-form-item label="人群名称：" prop="crowdName">
          <el-input v-model="form.crowdName" clearable @keydown.enter.native="handleSearch"></el-input>
      </el-form-item>
          <!-- <el-form-item label="设备信息：" prop="mac"> -->
      <el-form-item label="MAC地址" prop="mac">
          <el-input v-model="form.mac" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>

  </el-form>

  <div v-if="list.length > 0">
    <div>
      命中情况：
      总条数： {{ this.pagination.total }}
    </div>
    <div class="result">
      <div v-for="(item,index) in list" :key="index" class="result-item">
        <div>
            <span style="display: inline-block; width: 150px;">{{ item.mac }}</span>
        </div>
        <!-- <div>{{item.reason}}</div> -->
      </div>
    </div>
    <el-pagination
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.pageNum"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
  <div v-else>{{ noneText }}</div>

  <!-- 导出命中数据为临时标签 -->
  <el-dialog :visible.sync="dialogVisible" title="导出命中数据为临时标签" width="550px">
    <el-form :model="exportForm" ref="formRef" label-width="80px" :rules="exportFormRules">
      <el-form-item label="标签名：" prop="tagName">
        <el-input v-model="exportForm.tagName" clearable maxlength="45" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="comfirmExport">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'CrowdValidateAA',
  data () {
    return {
      exportFormRules: {
        tagName: [
          { required: true, message: '不可为空', trigger: 'blur' }
        ]
      },
      form: {
        mac: '',
        crowdName: 'dmp_crowd_114453_2023060601'
      },
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },

      dateList: [],
      rules: {
        // mac: {required: true, message: '请输入mac', trigger: 'blur'},
        crowdName: { required: true, message: '请输入人群名称', trigger: 'blur' }
      },
      pickerOptions: {
        disabledDate: (time) => {
          const day1 = 30 * 24 * 3600 * 1000
          // let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          const maxTime = Date.now()
          const minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },
      list: [],
      noneText: '',
      dialogVisible: false,
      exportForm: {
        tagName: ''
      }
    }
  },
  methods: {
    exportToTempLabel () {
      this.dialogVisible = true
      this.$refs.formRef.resetFields()
    },
    comfirmExport () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const params = {
            ...this.exportForm,
            ...this.form
          }
          this.$service.pageQueryCrowdTag(params, '导出成功').then(res => {
            // 刷新列表
            this.dialogVisible = false
          })
        }
      })
    },
    handelGo (url) {
      window.open(url, '_blank')
    },
    getFilter () {
      const filter = {
        mac: this.form.mac,
        crowdName: this.form.crowdName,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum
      }
      return filter
    },
    handleSearch () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const filter = this.getFilter()
          // this.$service.launchHelpCrowdIndex(filter).then(data => {
          this.$service.pageQueryCrowdTag(filter).then(data => {
            this.pagination.total = data.pageInfo.total

            this.list = data.pageInfo.list || '暂无数据'
            if (this.list === undefined || this.list.length === 0) {
              this.noneText = '当前人群无命中记录'
            }
          })
        }
      })
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.handleSearch()
    },
    formatDate (d) {
      const time = new Date(d)
      const y = time.getFullYear() // 年份
      const m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
      const r = time.getDate().toString().padStart(2, '0') // 日子
      return `${y}-${m}-${r}`
    },
    setDateData () {
      const a = []
      for (let i = 0; i < 5; i++) {
        a.push(this.formatDate((new Date()).setTime((new Date()).getTime() - 3600 * 1000 * 24 * i)))
      }
      this.dateList = a
      this.form.date = a[1]
    }
  },
  created () {
    // this.setDateData()
  }
}
</script>

<style lang="stylus" scoped>
.result
  border 1px dashed #333
  padding 0 20px
  margin 20px
  overflow auto
  .result-item
      margin 20px 0
.red--text
  color red
.title
  margin-bottom 20px
.no-result
  margin 20px
.export-to-temp
  margin-left 10px
</style>
