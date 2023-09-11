<template>
 <div class='' id='' style="background: #f3f4fa; margin: -20px; padding: 20px;">
  <!-- {{ formInline }} -->
  <!-- <div ref="aaaaa" style="height: 500px; border: 1px solid red; overflow: auto;">

    <div style="height: 900px; border: 1px solid blue;">

    </div>
  </div> -->
  <!-- {{crowdList}} -->
  <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline" ref="ruleForm">
    <el-form-item
      label="人群ID:"
      v-for="(item, index) in formInline.crowdIds"
      :key="index"
      :prop="'crowdIds.' + index + '.value'"
      :rules="{
        required: true, message: '域名不能为空', trigger: 'blur'
      }">
      <el-input
        v-model="item.value"
        @change="handleChange"
        placeholder="请输入"
        clearable
        style="width: 120px">
      </el-input>

      <el-button
        v-if="formInline.crowdIds.length > 1"
        type="text"
        icon="el-icon-delete"
        class="delete-crowd-id"
        @click="cutContrastCrowd(formInline.crowdIds, index)"
      >
      </el-button>
    </el-form-item>
    <el-button type="text" @click="addContrastCrowd(formInline.crowdIds)" style="margin-right: 50px">添加对比人群</el-button>
    <el-form-item v-if="crowdName" label="人群名:" style="margin: 0 50px 0 20px">
      {{ crowdName }}
    </el-form-item>

    <el-form-item label="分析周期:" prop="timeRange">
      <el-date-picker
          v-model="formInline.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="getPickerOptions"
        >
      </el-date-picker>
          <!-- :picker-options="pickerOptions" -->
    </el-form-item>
    <el-form-item style="margin-left: 15px;">
      <el-checkbox v-model="formInline.isDelCache" :true-label="1" :false-label="0">清除历史记录 </el-checkbox>
    </el-form-item>
    <el-form-item style="margin-left: 15px;">
      <el-button type="text" @click="resetForm('ruleForm')">重置查询</el-button>
    </el-form-item>
    <br/>
    <el-form-item label="业务范围:" prop="sourceNameList" style="max-width: 70%; white-space: nowrap;">

      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <!-- <div style="margin: 15px 0;"></div> -->
      <el-checkbox-group v-model="formInline.sourceNameList" style="white-space: break-spaces;">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>

      <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">广电直播</el-checkbox>
      <el-checkbox-group v-model="formInline.sourceNameList" style="white-space: break-spaces;">
        <el-checkbox v-for="city in cities2" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>

    </el-form-item>
    <el-form-item style="margin-left: 136px">
      <el-button type="primary" @click="onSubmit" :loading="loading">{{ loading ? '分析中' : '分析'}}</el-button>
      <el-button type="text" @click="drawer = true" style="margin-left: 16px;">
        历史记录
      </el-button>
    </el-form-item>
  </el-form>

  <!-- 总览 -->
  <!-- :style="{width: Object.keys(allCrowdData).length * 100 + '%'}" -->

  <!-- 显示内容主体 -->
  <ShowIndex
    v-if="pageStatus === 1"
    :allCrowdData="allCrowdData"
  >
  </ShowIndex>
  <!-- 初始页面 或者 查询为空 时 -->
  <div
    v-else
    v-loading="loading"
    element-loading-text="拼命加载中"
    style="height: calc(100vh - 321px);"
    element-loading-background="rgb(243, 244, 250)"
  >
    <el-empty v-if="emptyTxt" :description="emptyTxt" ></el-empty>
  </div>

  <el-drawer
    title="历史记录"
    :visible.sync="drawer"
    size="45%"
  >
    <div style="position: relative; height: 50px">
      <el-input
        placeholder="搜索历史记录"
        prefix-icon="el-icon-search"
        v-model="historysCondition"
        class="search-input"
        clearable
        @keyup.enter.native="handleGetRightsInterestsSearchRecord">
      </el-input>
    </div>
    <div class="history-content">
      <div
        v-for="(item) in historys"
        :key="item.id"
        class="search-text"
        @click="hitHistory(item)"
      >

      <i @click.stop="deleteHistory(item.id)" class="delete-icon el-icon-close"></i>
      <!-- <span><i class="el-icon-search" style="color: #1ab394; font-size: 16px"></i></span> -->
      <span>{{ item.crowdId }}</span>
        <span>{{ item.crowdName }}</span>
        <span>{{ item.startDate }} 至 {{ item.endDate }}</span>
        <br/>
        <span>{{ item.sourceNameStr }}</span>

        <!-- {{item.crowdId + '' + item.startDate + '-' + item.endDate + item.sourceNameStr"}} -->
        <span class="foot">
          <span :class="{'bold': item.status === 1}">
            {{ statusMap[item.status] }}
          </span>
          <span>{{ item.createTime }}</span>
        </span>
      </div>
    </div>
    <div class="bottom-delete-all">
      <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <p>确认清空历史记录吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click.stop="deleteHistory(-1)">确定</el-button>
        </div>
        <el-button slot="reference" type="text">清空历史记录</el-button>
      </el-popover>
    </div>
  </el-drawer>

 </div>
</template>

<script>
import ShowIndex from './indexComs/ShowIndex.vue'

const cityOptions = ['腾讯影视VIP', '爱奇艺影视VIP', '优酷影视VIP', '芒果TV大屏VIP', '芒果全屏VIP', '港剧VIP', '欢喜', '亲子VIP', '音乐K歌会员', '音乐VIP', '家庭影院VIP', '画报屏保', '4K花园', '戏曲VIP', '健身VIP', '炫舞广场', '电竞VIP', '1905', '酷喵VIP']
const cityOptions2 = ['湖南', '河北', '贵州', '四川', '重庆', '云南', '江西', '河南', '安徽', '山西', '湖北', '甘肃', '广西', '江苏', '新疆', '山东', '辽宁', '陕西', '海南', '福建']
export default {
  components: { ShowIndex },
  data () {
    return {
      crowdList: [],
      event: null,
      allCrowdData: {},
      startTime: '',
      endTime: '',
      radioType: 0,
      radioType2: 0,
      visible: false,
      statusMap: {
        0: '分析中',
        1: '已查出数据',
        2: '暂无数据'
      },
      setTimeOutVal: undefined,
      historys: [],
      historysCondition: '',
      drawer: false,
      checkAll: false,
      checkAll2: false,
      checkedCities: [],
      cities: cityOptions,
      cities2: cityOptions2,
      isIndeterminate: false,
      isIndeterminate2: false,
      // allData: {},
      overview: {},
      formInline: {
        crowdIds: [{ value: '' }],
        sourceNameList: [],
        // timeRange: ['2022-07-18', '2022-07-19']
        timeRange: [],
        isDelCache: 0
      },
      rules: {
        crowdId: [
          { required: true, message: '请输入人群ID', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        timeRange: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ],
        sourceNameList: [
          { type: 'array', required: true, message: '请至少选择一个业务范围', trigger: 'change' }
        ]

      },

      show: true,
      allCharts: {},
      timeRange: [],
      allChartData: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      crowdId: 11882,
      colorList: ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],
      loading: false,
      crowdName: '',
      pageStatus: 2, // 暂无数据
      emptyTxt: '投后效果，一键分析',
      downloadUrl: ''
      // colorList: ['#4962FC', '#4B7CF3', '#dd3ee5', '#12e78c', '#fe8104', '#01C2F9', '#FD9E06']
      // policyId: 4323
    }
  },
  destroyed () {
    this.event()
  },

  mounted () {
    // console.log('this.$refs.aaaaa------>', this.$refs.aaaaa)
    // this.$refs.aaaaa.addEventListener('scroll', this.scrollEvent)
    // const data = [
    //   { value: 1048, name: '电视剧' },
    //   { value: 735, name: '电影' },
    //   { value: 580, name: '综艺' },
    //   { value: 484, name: '纪录片' },
    //   { value: 300, name: '少儿' },
    //   { value: 300, name: '其他' }
    // ]
    // this.setPie('pie1', data)
    // this.setPie('pie2', data)

    // chart5
    // 图表自适应
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })

    // 设置初始化展示数据
    this.setDefaultData()

    // 历史搜索记录
    this.handleGetRightsInterestsSearchRecord()
  },
  computed: {
    getPickerOptions () {
      return {
        disabledDate: (time) => {
          const minTime = +new Date(this.startTime) - 24 * 3600 * 1000
          const maxTime = +new Date(this.endTime)
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      }
    }
    // 'formInline.crowdId' () {
    //   return this.formInline.crowdIds.map(item => item.value).join(',') || ''
    // }
  },
  watch: {
    'formInline.sourceNameList': {
      handler (val) {
        const checkedCount = val.length
        const allCount = cityOptions.concat(cityOptions2).length

        this.checkAll = checkedCount === allCount
        this.isIndeterminate = checkedCount > 0 && checkedCount < allCount

        this.checkAll2 = cityOptions2.every(item => val.indexOf(item) > -1)
        this.isIndeterminate2 = cityOptions2.some(item => val.indexOf(item) > -1) && !this.checkAll2
      }
    },
    // 各卡种下单趋势，切换radio
    radioType: {
      handler (val) {
        const key = val === 0 ? 'orderPopulationTrendOfEachCard' : 'orderNumTrendOfEachCard'
        this.showLine(this.allChartData[key], 'orderPopulationTrendOfEachCard')
        this.$nextTick(() => {
          const chart = this.allCharts[key]
          chart.resize()
        })
      }
    },
    // 各卡种付费趋势，切换radio
    radioType2: {
      handler (val) {
        const key = val === 0 ? 'payPopulationTrendOfEachCard' : 'payAmountTrendOfEachCard'
        this.showLine(this.allChartData[key], 'payPopulationTrendOfEachCard')
        this.$nextTick(() => {
          const chart = this.allCharts[key]
          chart.resize()
        })
      }
    }
  },
  beforeDestroy () {
    // 销毁定时器
    this.destoryTimeInterval()
  },
  activated () {
    console.log('activated - setTimeOutVal------->', this.setTimeOutVal)
    if (this.setTimeOutVal) {
      this.fetchAllData()
      // 搜索历史记录，更新数据
      this.handleGetRightsInterestsSearchRecord()
    }
  },
  deactivated () {
    console.log('deactivated - setTimeOutVal------->', this.setTimeOutVal)
  },
  methods: {
    // scrollEvent () {
    //   console.log('scroll', this.$refs.aaaaa.scrollTop)
    // },
    syncScroller () {
      console.log('arguments-->', arguments)
      // const nodes = Array.prototype.filter.call(arguments, item => item instanceof HTMLElement)
      // const max = nodes.length
      // if (!max || max === 1) return
      const nodes = [...arguments].map(item => item.$el)
      const max = nodes.length
      let sign = 0 // 用于标注

      function event () {
        if (!sign) { // 标注为 0 时 表示滚动起源
          sign = max - 1
          const top = this.scrollTop
          const left = this.scrollLeft
          for (const node of nodes) { // 同步所有除自己以外节点
            if (node === this) continue
            node.scrollTo(left, top)
          }
        } else { --sign } // 其他节点滚动时 标注减一
      }

      nodes.forEach((ele, index) => {
        console.log('ele--->', ele)
        ele.addEventListener('scroll', event)
      })

      return () => {
        nodes.forEach((ele, index) => {
          ele.removeEventListener('scroll', event)
        })
      }
    },

    // 添加对比人群
    addContrastCrowd (list) {
      list.push({
        value: ''
      })
    },
    // 删除对比人群
    cutContrastCrowd (list, index) {
      list.splice(index, 1)
    },
    resetForm (formName) {
      // 重置数据
      this.pageStatus = 0
      this.crowdName = ''
      this.checkAll = false
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    // 删除历史
    deleteHistory (id) {
      this.$service.delRightsInterestsSearchRecord({ id }, '删除成功').then(res => {
        // 刷新、
        // 历史搜索记录
        this.handleGetRightsInterestsSearchRecord()
      })
    },
    //  投后分析导出
    handleGxportRightsInterests () {
      const params = {
        crowdId: this.formInline.crowdId,
        sourceNameList: this.formInline.sourceNameList.join(','),
        startDate: this.formInline.timeRange[0],
        endDate: this.formInline.timeRange[1]
      }

      // const params = {
      //   crowdId: 11731,
      //   sourceNameList: '酷喵VIP',
      //   startDate: '2022-08-01',
      //   endDate: '2022-08-15'
      // }
      const urlParams = `crowdId=${params.crowdId}&startDate=${params.startDate}&endDate=${params.endDate}&sourceNameList=${params.sourceNameList}`
      this.downloadUrl = '/api/exportRightsInterests?' + urlParams
      this.$nextTick(() => {
        this.$refs.download_Url.click()
      })
    },

    // 历史记录查询
    handleGetRightsInterestsSearchRecord () {
      const params = {
        condition: this.historysCondition
      }
      this.$service.getRightsInterestsSearchRecord(params).then(res => {
        this.historys = res || []
      })
    },
    handleCheckAllChange (val) {
      this.formInline.sourceNameList = val ? cityOptions.concat(cityOptions2) : []
    },
    handleCheckAllChange2 (val) {
      this.formInline.sourceNameList = val ? this.formInline.sourceNameList.concat(cityOptions2) : this.formInline.sourceNameList.filter(item => cityOptions2.indexOf(item) === -1)
    },
    handleClick (tab, event) {
      this.$nextTick(() => {
        for (const key of Object.keys(this.allCharts)) {
          const chart = this.allCharts[key]
          chart.resize()
        }
      })
    },

    // initRange () {
    //   // 设置默认时间为今天的前一周
    //   const start = new Date()
    //   const end = new Date()
    //   const startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 30))
    //   const endDate = this.formatDate(end.setTime(end.getTime()))
    //   this.timeRange = [startDate, endDate]
    // },
    // formatDate (d) {
    //   const time = new Date(d)
    //   let y = time.getFullYear() // 年份
    //   let m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
    //   let r = time.getDate().toString().padStart(2, '0') // 日子
    //   return `${y}-${m}-${r}`
    // },
    toPercent (point) {
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },

    // 设置初始化展示数据
    setDefaultData () {
      // 默认展示的数据参数
      // this.formInline = {
      //   crowdId: '18321',
      //   sourceNameList: ['家庭影院VIP'],
      //   timeRange: ['2023-04-25', '2023-04-30'],
      //   isDelCache: 0
      // }

      this.formInline = {
        crowdIds: [{ value: '20101' }],
        // crowdId: ['20101'],
        sourceNameList: ['优酷影视VIP'],
        timeRange: ['2023-08-03', '2023-08-08'],
        isDelCache: 0
      }
      this.$nextTick(() => {
        this.onSubmit()
      })
    },
    handleChange () {
      if (this.formInline.crowdIds.length === 1) {
        this.formInline.timeRange = []
        this.getCrowdInfo('setTime')
      } else {
        this.getCrowdInfo()
      }
    },
    getCrowdInfo (type) {
      const originParams = this.formInline
      const isSetRange = originParams.crowdIds.length === 1 ? type : undefined

      const crowdIdArrFn = originParams.crowdIds.map(item => this.getInfo(item.value, isSetRange))
      // console.log(' crowdIdArrFn-->', crowdIdArrFn)
      // const crowdId = this.formInline.crowdId
      this.startTime = ''
      this.endTime = ''
      this.crowdName = ''
      return new Promise((resolve, reject) => {
        Promise.all(crowdIdArrFn).then((res) => {
          // console.log('originParams--->', originParams)
          // console.log('res--->', res)
          // 单个人群
          if (res.length === 1) {
            const crowdInfo = res[0].policyCrowds
            this.crowdName = crowdInfo.crowdName
            this.startTime = crowdInfo.createTime || '' // 创建日期 就是可选最小时间

            // 下架
            const isOffShelf = crowdInfo.putway === 0 // 【 1：上架， 0：下架】
            // 删除
            const isDelete = crowdInfo.delFlag === 2 //  【 1: 正常， 2：删除】

            if (isOffShelf || isDelete) {
              this.endTime = this.$moment(crowdInfo.updateTime).format('YYYY-MM-DD')
            } else {
              this.endTime = this.$moment().format('YYYY-MM-DD')
            }
            // console.log('type--->', type)
            // console.log('isSetRange--->', isSetRange)
            // 如果是 crowdID change 的时候调用的，就设置分析周期
            if (this.startTime && this.endTime && isSetRange) {
              this.formInline.timeRange = [this.startTime, this.endTime]
            }
          }
          // else {
          // 多个人群
          // }
          this.crowdList = res.map(item => {
            const crowdInfo = item.policyCrowds
            return {
              crowdName: crowdInfo.crowdName,
              crowdId: crowdInfo.crowdId,
              createTime: crowdInfo.createTime
            }
          })

          resolve(res)
        }).catch(err => {
          console.log('err--->', err)
          reject(err)
        })
      })
    },
    getInfo (crowdId, type) {
      // const originParams = this.formInline
      // const crowdIdArr = originParams.crowdIds.map(item => item.value)

      // const crowdId = this.formInline.crowdId

      return new Promise((resolve, reject) => {
        this.$service.crowdEdit({ crowdId }).then(res => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 点击分析 或者 点击柱状图 触发
    onSubmit (sourceName) {
      // console.log('submit!')
      // this.formInline.crowdId = 10013
      // this.formInline.sourceNameList = ['影视VIP', '奇异果VIP', '4K花园']
      // this.formInline.timeRange = ['2022-07-18', '2022-07-19']

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('valid--->', valid)
          this.loading = true
          this.show = false
          this.initChart(sourceName)
          this.$nextTick(() => {
            this.show = true
          })
        }
      })
    },
    // 历史记录查询数据
    hitHistory (item) {
      const crowdIds = [item.crowdId].map(item => {
        return {
          value: item
        }
      })
      this.formInline = {
        crowdIds,
        sourceNameList: item.sourceNameStr.split(','),
        timeRange: [item.startDate, item.endDate],
        isDelCache: 0
      }
      this.initChart()
    },

    // 手动点击分析调用 或者 点击历史记录分析调用
    async initChart (sourceName) {
      // this.allChartData = {}
      this.crowdName = ''
      // 销毁定时器
      this.destoryTimeInterval()
      // const params = {
      //   crowdId: 10013,
      //   sourceNameList: '影视VIP,奇异果VIP,4K花园',
      //   startDate: '2022-07-18',
      //   endDate: '2022-07-19',
      //   sourceName: sourceName || ''
      // }
      // const params = {
      //   crowdId: 11731,
      //   sourceNameList: '酷喵VIP',
      //   startDate: '2022-08-01',
      //   endDate: '2022-08-15',
      //   isDelCache: this.formInline.isDelCache,
      //   sourceName: sourceName || ''
      // }

      // 先查询人群是否存在，若存在，再去分
      try {
        await this.getCrowdInfo()
        this.fetchAllData(sourceName)
      } catch {
        this.loading = false
      }
    },

    // 查询图表数据
    fetchAllData (sourceName) {
      this.loading = true
      const originParams = this.formInline
      this.radioType = 0 // 重置
      this.radioType2 = 0 // 重置
      console.log('originParams-->', originParams)
      const crowdIds = originParams.crowdIds.map(item => item.value).join(',') || ''

      const params = {
        // crowdIds: '20101,20102',
        crowdIds,
        // crowdIds: originParams.crowdId,
        sourceNameList: originParams.sourceNameList.join(','),
        startDate: originParams.timeRange[0],
        endDate: originParams.timeRange[1],
        isDelCache: originParams.isDelCache,
        sourceName: sourceName || '' // 点击柱状图查询单个业务数据
      }
      // const params = {
      //   crowdId: 10013,
      //   sourceNameList: '优酷影视VIP,芒果全屏VIP,亲子VIP',
      //   startDate: '2023-06-20',
      //   endDate: '2023-06-25',
      //   isDelCache: originParams.isDelCache,
      //   sourceName: sourceName || '' // 点击柱状图查询单个业务数据
      // }
      // 获取所有图表数据
      this.$service.rightsInterestsOutcome(params).then(allRes => {
        // this.allData = res || {}
        this.loading = false

        const res = allRes || {}
        const arr = Object.values(res)

        console.log('this.crowdList--->', this.crowdList)

        for (const key in res) {
          const obj = this.crowdList.find(item => Number(item.crowdId) === Number(key))
          res[key].crowdName = obj.crowdName || ''
          res[key].crowdId = obj.crowdId || ''
        }

        const isLoad = arr.every(item => item.status === 0)
        const isNoData = arr.every(item => item.status !== 0 && item.status !== 1) // 无数据
        if (this.setTimeOutVal) {
          // 销毁定时器
          this.destoryTimeInterval()
        }
        if (isLoad) { // 全部状态都为【分析中】
          this.pageStatus = 0
          this.emptyTxt = '数据正在分析中，请稍后重试'
          this.allChartData = {}
          // 开启定时器
          this.openTimeInterval()
        } else if (isNoData) { // 全部状态都为【无数据】
          this.pageStatus = 2
          this.emptyTxt = '暂无数据'
          this.allChartData = {}
        } else {
          this.pageStatus = 1
          this.allCrowdData = res || {}
        }

        // 测试数据
        // for (let i = 0; i < 5; i++) {
        //   this.allCrowdData[`2010${i}`] = allRes[20101]
        // }

        // 重新搜索历史记录，更新数据
        this.handleGetRightsInterestsSearchRecord()
      }).catch(e => {
        this.loading = false
        // 销毁定时器
        this.destoryTimeInterval()
        // 重新搜索历史记录，更新数据
        this.handleGetRightsInterestsSearchRecord()
      })
    },
    // 开启定时器
    openTimeInterval () {
      console.log('我执行了定时器-----')
      this.setTimeOutVal = setInterval(() => {
        this.fetchAllData()
      }, 8000)
    },
    // 销毁定时器
    destoryTimeInterval () {
      console.log('=========我清除了定时器-----')
      clearInterval(this.setTimeOutVal)
    }

  }
}
</script>

<style lang='stylus' scoped>
@import url('~@/assets/overview.styl')

.search-text {
  font-size: 12px;
  border-radius: 10px;
  padding: 10px;
  // margin: 0 6px 35px 6px;
  display: inline-block;
  background-color: #f4f4f4;
  cursor pointer
  position: relative;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 35px;
  span {
    margin-right: 15px;
    display: inline-block;
    margin-bottom: 4px;
  }
}
.search-input {
  height: 36px;
  border-radius: 36px;
  // background: #f4f4f4;
  color: #999;
  position: absolute;
  margin-bottom: 39px;
  right: 20px;
  left: 20px;
  width: auto;
}
>>>.el-drawer__body {
  position: relative;
}
.foot {
  color: #5d5d76
  position: absolute;
  bottom: -27px;
  right: -23px;
}
.bold {
  color: #349344
}

.delete-icon {
  position: absolute;
  right: 6px;
  top: 5px;
  color: #999;
  padding: 2px;
  border-radius: 50%;
  display: inline-block;
  font-size: 16px;
}
.delete-icon:hover {
  background gray;
  color: #fff
}
.history-content {
  position: absolute;
  top: 50px;
  bottom: 40px;
  right: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 6px 6px 6px
}
.bottom-delete-all {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px
  border-top: 1px dashed #e7e7e7;
}
.remark {
  font-size: 12px;
  color: #C0C4CC;
  font-weight 400
}
.radio-type {
  float: right;
  margin-top: 22px;
}
.delete-crowd-id {
  color: #F56C6C;
  // font-size: 16px;
  margin-left: 6px;

}

</style>
