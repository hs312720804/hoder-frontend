<template>
  <div>
    <div class="title">查询指定Mac的流转轨迹</div>
    <el-form :model="form" ref="form" :rules="rules" :inline="true">
      <el-form-item label="策略ID：" prop="policyId">
        <el-input v-model="form.policyId" clearable></el-input>
      </el-form-item>
      <el-form-item label="MAC地址" prop="mac">
        <el-input v-model="form.mac" clearable></el-input>
      </el-form-item>
      <el-form-item label="SourceSign" prop="sourceSign">
        <el-input v-model="form.sourceSign" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期：" prop="date">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div>

      <div v-if="list.length > 0">
        <div>
          命中情况：
        </div>
        <div class="result">
          <div v-for="(item, index) in list" :key="index" class="result-item">
            <div>
              <span style="display: inline-block; width: 150px;">{{ item.mac }}</span>
              <span>命中时间：{{ item.hitDate }}</span>
            </div>
          </div>
        </div>

      </div>
      <div v-else>{{ noneText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'crowdCirculationTrackAA',
  data () {
    return {
      form: {
        policyId: '',
        mac: '',
        sourceSign: '',
        beginTime: '',
        endTime: ''
      },
      dateRange: [],
      dateList: [],
      rules: {
        policyId: { required: true, message: '请输入策略id', trigger: 'blur' },
        mac: { required: true, message: '请输入mac', trigger: 'blur' },
        sourceSign: { required: true, message: '请输入sourceSign', trigger: 'blur' }
      },
      pickerOptions: {
        disabledDate: (time) => {
          const day1 = 30 * 24 * 3600 * 1000
          // let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          let maxTime = Date.now()
          let minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },
      list: [],
      noneText: ''
    }
  },
  methods: {
    getFilter () {
      const filter = {
        policyId: this.form.policyId,
        mac: this.form.mac,
        sourceSign: this.form.sourceSign,
        beginTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }
      return filter
    },
    handleSearch () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const filter = this.getFilter()
          // this.$service.launchHelpCrowdIndex(filter).then(data => {
          this.$service.dynamicCrowdHitLink(filter).then(data => {
            console.log('data=====>', data)
            // 链路数据
            this.list = data

            // this.list = data.pageInfo.list || '暂无数据'
            // if (this.list === undefined || this.list.length === 0) {
            //   this.noneText = '该人群不存在'
            // }
          })
        }
      })
    }

    // formatDate (d) {
    //   const time = new Date(d)
    //   let y = time.getFullYear() // 年份
    //   let m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
    //   let r = time.getDate().toString().padStart(2, '0') // 日子
    //   return `${y}-${m}-${r}`
    // },
    // setDateData () {
    //   const a = []
    //   for (let i = 0; i < 5; i++) {
    //     a.push(this.formatDate((new Date()).setTime((new Date()).getTime() - 3600 * 1000 * 24 * i)))
    //   }
    //   this.dateList = a
    //   this.form.date = a[1]
    // }
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
</style>
