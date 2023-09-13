<template>
 <div class='show-data' :class="{'single-show-panel': isSingShowPanel}">
  <!-- isSingShowPanel--{{ isSingShowPanel }} -->
  <!-- 总览 -->
  <div v-if="pageStatus === 1">
    <!-- tabs -->
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick"> -->
      <!-- <el-tab-pane label="内容型" name="one"> -->
        <!-- 柱状图、折线图 -->
        <div class="launch-statistics" v-show="activeName === 'one' && showChart">
            <!-- <template v-if="show"> -->
          <!-- <div class="unit-row" v-for="(row, index) in rowObj2" :key="index"> -->
            <div v-for="(chart, key) in rowObj2" :key="key" class="unit-wrap">
              <div class="unit-box">
                <!-- {{allChartData[key]}} -->
                <!-- <div class="unit-header clearfix"><span v-if="(allChartData && allChartData[key] && allChartData[key].title) || chart.title">{{ allChartData[key].title || chart.title }}</span></div> -->
                <div class="unit-header clearfix">
                  <span v-if="(allChartData && allChartData[key] && allChartData[key].title)">
                    {{ allChartData[key].title }}
                  </span>
                  <span v-else>
                    {{chart.title}}
                  </span>

                </div>

                <div class="unit-content" v-if="show && chart.title">
                    <!-- {{ allChartData[key] && allChartData[key].series }} -->
                  <div
                    v-if="allChartData[key] && ((allChartData[key].series && allChartData[key].series.length > 0) || allChartData[key].data)"
                    :ref="crowdId + '_' + key"
                    :id="crowdId + '_' + key"
                    class="chart-div">
                  </div>
                  <div v-else class="chart-div">
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </div>
              </div>
            </div>
          <!-- </div> -->
        </div>

      <!-- </el-tab-pane> -->

      <!-- <el-tab-pane label="付费型" name="two">
      </el-tab-pane> -->
        <!-- 柱状图、折线图 -->
        <div class="launch-statistics launch-statistics2" v-show="activeName === 'two' && showChart">
          <!-- <div class="unit-row" v-for="(row, index) in rowObj" :key="index"> -->
            <div v-for="(chart, key) in rowObj" :key="key" class="unit-wrap">
              <div class="unit-box" >

                <!-- <div class="unit-header clearfix"><span v-if="chart.title">{{ chart.title }}</span></div> -->
                <div class="unit-header clearfix">
                  <span v-if="(allChartData && allChartData[key] && allChartData[key].title)">
                    {{ allChartData[key].title }}
                  </span>
                  <span v-else>
                    {{ chart.title }}
                  </span>

                  <!-- {{ key }} -->
                  <!-- 各卡种下单趋势 -->
                  <el-radio-group v-model="radioType"
                    v-if="key === 'orderPopulationTrendOfEachCard' || key === 'orderNumTrendOfEachCard'"
                    class="radio-type"
                  >
                    <el-radio :label="0">下单人数</el-radio>
                    <el-radio :label="1">下单次数</el-radio>
                  </el-radio-group>

                  <!-- 各卡种付费趋势 -->
                  <el-radio-group v-model="radioType2"
                    v-if="key === 'payPopulationTrendOfEachCard' || key === 'payAmountTrendOfEachCard'"
                    class="radio-type">
                    <el-radio :label="0">付费人数</el-radio>
                    <el-radio :label="1">付费金额</el-radio>
                  </el-radio-group>

                </div>

                <div class="unit-content" v-if="show && chart.title">
                  <!-- {{ allChartData[key] && allChartData[key].series }} -->
                  <div
                    v-if="allChartData[key]
                      && allChartData[key].series
                      && allChartData[key].series.length > 0"
                    :ref="crowdId + '_' + key"
                    :id="crowdId + '_' + key"
                    class="chart-div">
                  </div>
                  <div v-else class="chart-div">
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </div>
              </div>
            </div>
          <!-- </div> -->

        </div>

    <!-- </el-tabs> -->
  </div>

</div>
</template>

<script>
const cityOptions = ['腾讯影视VIP', '爱奇艺影视VIP', '优酷影视VIP', '芒果TV大屏VIP', '芒果全屏VIP', '港剧VIP', '欢喜', '亲子VIP', '音乐K歌会员', '音乐VIP', '家庭影院VIP', '画报屏保', '4K花园', '戏曲VIP', '健身VIP', '炫舞广场', '电竞VIP', '1905', '酷喵VIP']
const cityOptions2 = ['湖南', '河北', '贵州', '四川', '重庆', '云南', '江西', '河南', '安徽', '山西', '湖北', '甘肃', '广西', '江苏', '新疆', '山东', '辽宁', '陕西', '海南', '福建']
export default {
  components: {},
  props: {
    activeName: {
      type: String,
      default: ''
    },
    crowdId: {
      type: [Number, String],
      default: 0
    },
    pageStatus: {
      type: Number,
      default: 0
    },
    overview: {
      type: Object,
      default: () => {}
    },
    allChartData: {
      type: Object,
      default: () => {}
    },
    isSingShowPanel: {
      type: Boolean,
      default: true
    },
    formInline: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showChart: true,
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
      // formInline: {
      //   crowdId: '',
      //   crowdIds: [{ value: '' }],
      //   sourceNameList: [],
      //   // timeRange: ['2022-07-18', '2022-07-19']
      //   timeRange: [],
      //   isDelCache: 0
      // },
      show: true,
      allCharts: {},
      timeRange: [],
      // allChartData: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      rowObj: {
        vipPkgShow: { type: 'bar', title: '各权益曝光人数及占比', span: 8 },
        vipPkgXiadan: { type: 'bar', title: '各权益下单人数及占比', span: 8 },
        vipPkgPay: { type: 'bar', title: '各权益付费人数及占比', span: 8 },
        // }, {
        vipPkgShowTrend: { type: 'line', title: '影视VIP曝光趋势', span: 8 },
        vipPkgXiadanTrend: { type: 'line', title: '影视VIP下单趋势', span: 8 },
        vipPkgPayTrend: { type: 'line', title: '影视VIP付费趋势', span: 8 },
        // }, {
        pathPkgShow: { type: 'bar', title: '影视VIP曝光路径人数及占比', span: 8 },
        productTypePkgXiadan: { type: 'bar', title: '影视VIP下单产品包分类人数及占比', span: 8 },
        pathPkgPay: { type: 'bar', title: '影视VIP付费路径人数及占比', span: 8 },
        // },
        // {
        orderPopulationTrendOfEachCard: { type: 'line', title: '影视VIP各卡总下单趋势', span: 8 },
        payPopulationTrendOfEachCard: { type: 'line', title: '影视VIP各卡总付费趋势', span: 8 },
        // orderNumTrendOfEachCard: { type: 'line', title: '影视VIP各卡总下单趋势', span: 8 },
        // payAmountTrendOfEachCard: { type: 'line', title: '影视VIP各卡总付费趋势', span: 8 },
        productTypePkgPay: { type: 'bar', title: '影视VIP付费产品包分类人数及占比', span: 8 }
      },
      rowObj2: {
        // {
        vipPlay: { type: 'bar', title: '各权益起播人数及占比', span: 12 },
        vipPlayTrend: { type: 'line', title: '影视VIP起播趋势', span: 12 },
        // }, {
        viewingCategoryRank: { type: 'pie', title: '各权益观影分类TOP5及占比', span: 12 }
        // }
      },
      // crowdId: 11882,
      colorList: ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],
      loading: false,
      crowdName: '',
      // pageStatus: 2, // 暂无数据
      emptyTxt: '投后效果，一键分析',
      downloadUrl: ''
      // colorList: ['#4962FC', '#4B7CF3', '#dd3ee5', '#12e78c', '#fe8104', '#01C2F9', '#FD9E06']
      // policyId: 4323
    }
  },
  mounted () {
    // chart5
    // 图表自适应
    window.addEventListener('resize', () => {
      // this.activeName = this.activeName === 'one' ? 'two' : 'one'
      // this.showChart = false
      // console.log('resizeresizeresizeresize')
      this.$nextTick(() => {
        // this.showChart = true
        this.$nextTick(() => {
          for (const key of Object.keys(this.allCharts)) {
            const chart = this.allCharts[key]
            chart.resize()
          }
        })
      })
    })

    // // 设置初始化展示数据
    // this.setDefaultData()

    // // 历史搜索记录
    // this.handleGetRightsInterestsSearchRecord()

    this.init()
  },
  computed: {
    //
    'formInline.crowdId' () {
      return this.formInline.crowdIds.map(item => item.value).join(',') || ''
    }
  },
  watch: {
    activeName: {
      handler (val) {
        this.$nextTick(() => {
          for (const key of Object.keys(this.allCharts)) {
            const chart = this.allCharts[key]
            chart.resize()
          }
        })
      }
    },

    // 各卡种下单趋势，切换radio
    radioType: {
      handler (val) {
        const key = val === 0 ? 'orderPopulationTrendOfEachCard' : 'orderNumTrendOfEachCard'
        this.showLine(this.allChartData[key], `${this.crowdId}_orderPopulationTrendOfEachCard`)
        this.$nextTick(() => {
          const chart = this.allCharts[`${this.crowdId}_key`]
          chart.resize()
        })
      }
    },
    // 各卡种付费趋势，切换radio
    radioType2: {
      handler (val) {
        const key = val === 0 ? 'payPopulationTrendOfEachCard' : 'payAmountTrendOfEachCard'
        this.showLine(this.allChartData[key], `${this.crowdId}_payPopulationTrendOfEachCard`)
        this.$nextTick(() => {
          const chart = this.allCharts[`${this.crowdId}_key`]
          chart.resize()
        })
      }
    }
  },
  // beforeDestroy () {
  //   // 销毁定时器
  //   this.destoryTimeInterval()
  // },
  // activated () {
  //   console.log('activated - setTimeOutVal------->', this.setTimeOutVal)
  //   if (this.setTimeOutVal) {
  //     this.fetchAllData()
  //     // 搜索历史记录，更新数据
  //     this.handleGetRightsInterestsSearchRecord()
  //   }
  // },
  // deactivated () {
  //   console.log('deactivated - setTimeOutVal------->', this.setTimeOutVal)
  // }
  methods: {
    init () {
      if (this.pageStatus === 1) { // 有数据
        // 概览 - 漏斗图
        this.show = true
        this.$nextTick(() => {
          this.showFunnel(`${this.crowdId}_chart1`, this.overview)
          // 详情图表
          this.drawChart()
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
      // this.pageStatus = 0
      this.crowdName = ''
      this.checkAll = false
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },

    // handleCheckAllChange (val) {
    //   this.formInline.sourceNameList = val ? cityOptions.concat(cityOptions2) : []
    // },
    // handleCheckAllChange2 (val) {
    //   this.formInline.sourceNameList = val ? this.formInline.sourceNameList.concat(cityOptions2) : this.formInline.sourceNameList.filter(item => cityOptions2.indexOf(item) === -1)
    // },
    // handleClick (tab, event) {
    //   this.$nextTick(() => {
    //     for (const key of Object.keys(this.allCharts)) {
    //       const chart = this.allCharts[key]
    //       chart.resize()
    //     }
    //   })
    // },

    // 漏斗图
    showFunnel (element, data) {
      const chartElement = document.getElementById(element)
      if (!chartElement) return

      const chartData = [
        { value: data.homepageActiveUv, name: '主页活跃' },
        { value: data.totalPlayUv, name: '起播' },
        { value: data.totalPkgShowUv, name: '产品包曝光' },
        { value: data.totalPkgXiadanUv, name: '下单' },
        { value: data.totalPkgPayUv, name: '成交' }
      ]

      const _this = this
      const option = {
        title: {
          text: '漏斗图'
        },
        tooltip: {
          trigger: 'item'
          // formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
        },
        color: _this.colorList,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            // min: 0,
            // max: data.homepageActiveUv,
            minSize: '0%',
            maxSize: '100%',
            sort: 'none', // none-按照数据顺序展示 ; descending-倒序
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: chartData
            //  [
            //   { value: 60, name: 'Visit' },
            //   { value: 40, name: 'Inquiry' },
            //   { value: 20, name: 'Order' },
            //   { value: 80, name: 'Click' },
            //   { value: 100, name: 'Show' }
            // ]
          }
        ]

      }
      const echarts = require('echarts')
      const myChart = echarts.init(chartElement)
      // console.log('echarts--------->', echarts)
      // console.log('myChart--------->', myChart)

      myChart.setOption(option)
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
    // setDefaultData () {
    // 默认展示的数据参数
    // this.formInline = {
    //   crowdId: '18321',
    //   sourceNameList: ['家庭影院VIP'],
    //   timeRange: ['2023-04-25', '2023-04-30'],
    //   isDelCache: 0
    // }

    // this.formInline = {
    //   crowdIds: [{ value: '20101' }],
    //   crowdId: ['20101'],
    //   sourceNameList: ['优酷影视VIP'],
    //   timeRange: ['2023-08-03', '2023-08-08'],
    //   isDelCache: 0
    // }
    //   this.$nextTick(() => {
    //     this.onSubmit()
    //   })
    // },
    // handleChange () {
    //   this.formInline.timeRange = []
    //   this.getCrowdInfo('setTime')
    // },
    // getCrowdInfo (type) {
    //   const crowdId = this.formInline.crowdId
    //   this.startTime = ''
    //   this.endTime = ''
    //   this.crowdName = ''
    //   return new Promise((resolve, reject) => {
    //     this.$service.crowdEdit({ crowdId }).then(res => {
    //       const crowdInfo = res.policyCrowds
    //       this.crowdName = crowdInfo.crowdName
    //       this.startTime = crowdInfo.createTime || '' // 创建日期 就是可选最小时间

    //       // 下架
    //       const isOffShelf = crowdInfo.putway === 0 // 【 1：上架， 0：下架】
    //       // 删除
    //       const isDelete = crowdInfo.delFlag === 2 //  【 1: 正常， 2：删除】

    //       if (isOffShelf || isDelete) {
    //         this.endTime = this.$moment(crowdInfo.updateTime).format('YYYY-MM-DD')
    //       } else {
    //         this.endTime = this.$moment().format('YYYY-MM-DD')
    //       }
    //       // 如果是 crowdID change 的时候调用的，就设置分析周期
    //       if (this.startTime && this.endTime && type) {
    //         this.formInline.timeRange = [this.startTime, this.endTime]
    //       }
    //       resolve(res)
    //     }).catch((err) => {
    //       reject(err)
    //     })
    //   })
    // },
    // 点击分析 或者 点击柱状图 触发
    onSubmit (sourceName) {
      // console.log('submit!')
      // this.formInline.crowdId = 10013
      // this.formInline.sourceNameList = ['影视VIP', '奇异果VIP', '4K花园']
      // this.formInline.timeRange = ['2022-07-18', '2022-07-19']

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
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
    // hitHistory (item) {
    //   this.formInline = {
    //     crowdId: item.crowdId,
    //     sourceNameList: item.sourceNameStr.split(','),
    //     timeRange: [item.startDate, item.endDate],
    //     isDelCache: 0
    //   }
    //   this.initChart()
    // },

    // 手动点击分析调用 或者 点击历史记录分析调用
    // async initChart (sourceName) {
    //   // this.allChartData = {}
    //   this.crowdName = ''
    //   // 销毁定时器
    //   this.destoryTimeInterval()
    //   // const params = {
    //   //   crowdId: 10013,
    //   //   sourceNameList: '影视VIP,奇异果VIP,4K花园',
    //   //   startDate: '2022-07-18',
    //   //   endDate: '2022-07-19',
    //   //   sourceName: sourceName || ''
    //   // }
    //   // const params = {
    //   //   crowdId: 11731,
    //   //   sourceNameList: '酷喵VIP',
    //   //   startDate: '2022-08-01',
    //   //   endDate: '2022-08-15',
    //   //   isDelCache: this.formInline.isDelCache,
    //   //   sourceName: sourceName || ''
    //   // }

    //   // 先查询人群是否存在，若存在，再去分
    //   try {
    //     await this.getCrowdInfo()
    //     this.fetchAllData(sourceName)
    //   } catch {
    //     this.loading = false
    //   }
    // },

    // 查询图表数据
    // fetchAllData (sourceName) {
    //   this.loading = true
    //   const originParams = this.formInline
    //   this.radioType = 0 // 重置
    //   this.radioType2 = 0 // 重置
    //   const params = {
    //     crowdIds: '20101,20102',
    //     // crowdIds: originParams.crowdId,
    //     sourceNameList: originParams.sourceNameList.join(','),
    //     startDate: originParams.timeRange[0],
    //     endDate: originParams.timeRange[1],
    //     isDelCache: originParams.isDelCache,
    //     sourceName: sourceName || '' // 点击柱状图查询单个业务数据
    //   }
    //   // const params = {
    //   //   crowdId: 10013,
    //   //   sourceNameList: '优酷影视VIP,芒果全屏VIP,亲子VIP',
    //   //   startDate: '2023-06-20',
    //   //   endDate: '2023-06-25',
    //   //   isDelCache: originParams.isDelCache,
    //   //   sourceName: sourceName || '' // 点击柱状图查询单个业务数据
    //   // }
    //   // 获取所有图表数据
    //   this.$service.rightsInterestsOutcome(params).then(allRes => {
    //     // this.allData = res || {}
    //     this.loading = false
    //     for (const res in allRes) {
    //       // this.pageStatus = res.status
    //       console.log('this.setTimeOutVal===', this.setTimeOutVal)
    //       if (this.setTimeOutVal) {
    //         // 销毁定时器
    //         this.destoryTimeInterval()
    //       }
    //       if (this.pageStatus === 0) { // 分析中
    //         this.emptyTxt = '数据正在分析中，请稍后重试'
    //         // this.allChartData = {}

    //         // 开启定时器
    //         this.openTimeInterval()
    //       } else if (this.pageStatus === 1) { // 有数据
    //         // 真实数据
    //         const tableData = res.data || {}

    //         // this.overview = tableData.overview.data || {}
    //         // this.allChartData = tableData || {}
    //         // 概览 - 漏斗图
    //         this.show = true
    //         this.$nextTick(() => {
    //           this.showFunnel('chart1', this.overview)
    //           // 详情图表
    //           this.drawChart()
    //         })
    //       } else { // 无数据
    //         this.emptyTxt = '暂无数据'
    //         // this.allChartData = {}
    //       }
    //     }

    //     // 重新搜索历史记录，更新数据
    //     this.handleGetRightsInterestsSearchRecord()
    //   }).catch(e => {
    //     this.loading = false
    //     // 销毁定时器
    //     this.destoryTimeInterval()
    //     // 重新搜索历史记录，更新数据
    //     this.handleGetRightsInterestsSearchRecord()
    //   })
    // },
    // 开启定时器
    // openTimeInterval () {
    //   console.log('我执行了定时器-----')
    //   this.setTimeOutVal = setInterval(() => {
    //     this.fetchAllData()
    //   }, 8000)
    // },
    // // 销毁定时器
    // destoryTimeInterval () {
    //   console.log('=========我清除了定时器-----')
    //   clearInterval(this.setTimeOutVal)
    // },
    drawChart () {
      const rowObj = this.rowObj
      const rowObj2 = this.rowObj2
      // rowObj.forEach(item => {
      // key 是代表 ref 值
      for (const key in rowObj) {
        const chartID = this.crowdId + '_' + key
        if (rowObj[key].type === 'line') {
          this.showLine(this.allChartData[key], chartID)
        } else if (rowObj[key].type === 'bar') {
          this.showBar(this.allChartData[key], chartID)
        } else if (rowObj[key].type === 'pie') {
          this.showPie(this.allChartData[key], chartID)
        }
      }
      // })
      // rowObj2.forEach(item => {
      // key 是代表 ref 值
      for (const key in rowObj2) {
        const chartID = this.crowdId + '_' + key
        if (rowObj2[key].type === 'line') {
          this.showLine(this.allChartData[key], chartID)
        } else if (rowObj2[key].type === 'bar') {
          this.showBar(this.allChartData[key], chartID)
        } else if (rowObj2[key].type === 'pie') {
          this.showPie(this.allChartData[key], chartID)
        }
      }
      // })
    },
    //  折线图
    showLine (data, chartID) {
      let hasY2 = false
      // console.log('showLine======111>>>', ...arguments)
      if (data && data.xaxis && data.xaxis.length > 0) {
        const series = data.series || []
        let legendData = series.map((key) => {
          return key.name
        })
        let linesData = series.map((key) => {
          if (data.yunit === '%') {
            const arr = key.value.map(v => v * 100)
            return { name: key.name, data: arr, type: 'line' }
          } else {
            return { name: key.name, data: key.value, type: 'line' }
          }
        })
        if (data.series2) {
          hasY2 = true
          const series2 = data.series2 || []
          const legendData2 = series2.map((key) => {
            return key.name
          })
          const linesData2 = series2.map((key) => {
            if (data.yunit === '%') {
              const arr = key.value.map(v => v * 100)
              return { name: key.name, data: arr, type: 'line', yAxisIndex: 1 }
            } else {
              return { name: key.name, data: key.value, type: 'line', yAxisIndex: 1 }
            }
          })
          legendData = legendData.concat(legendData2)
          linesData = linesData.concat(linesData2)
          // console.log('legendData===', legendData)
          // console.log('linesData===', linesData)
        }
        let yAxisObjName1 = ''
        let yAxisObjName2 = ''
        if (chartID === 'vipPlayTrend') {
          yAxisObjName1 = '人数/次数'
          yAxisObjName2 = '时长'
        } else if (chartID === 'vipPkgPayTrend') {
          yAxisObjName1 = '人数'
          yAxisObjName2 = '金额'
        } else if (chartID === 'vipPkgShowTrend') {
          yAxisObjName1 = '人数/次数'
          yAxisObjName2 = '人均次数'
        }

        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit, hasY2, yAxisObjName1, yAxisObjName2)
      }
    },

    //  柱状图
    showBar (data, chartID) {
      // console.log('showBar======111>>>', ...chartID)
      if (data && data.xaxis && data.xaxis.length > 0) {
        if (data.yunit === '%') {
          data.series = data.series.map(v => v * 100)
        }
        // console.log('23333=========>', data)
        this.setBarEchart(chartID, '', data.xaxis, data.series, data.xunit, data.yunit, data.dataaxis)
      }
    },
    //  环形图
    showPie (data, chartID) {
      // console.log('showBar======111>>>', data)
      if (data && data.data) {
        const d = data.data.map((v, index) => {
          return {
            ...v,
            value: v.count
            // name: '123'
          }
        })
        // console.log('d==------------------------>', d)
        // console.log('d==------------------------>', chartID)
        // showPie
        // console.log('')
        this.setPie(chartID, d)
      }
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '', dataaxis = []) {
      // console.log('element-->', element)
      const chartElement = document.getElementById(element)
      if (!chartElement) return
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      // let myChart = echarts.init(this.$refs[element])
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(chartElement)
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          // trigger: 'item',
          trigger: 'axis',
          formatter: function (parmas) {
            let str = parmas[0].marker + parmas[0].name + '<br/>'
            // let str = ''
            for (const item of parmas) {
              str = str + item.name + ': ' + _this.cc_format_number(item.value) + yunit + '<br/>' + '占比: ' + dataaxis[item.dataIndex]
            }
            // return _this.cc_format_number(a.data)
            return str
          }
        },
        color: _this.colorList,
        dataZoom: [
          {
            disabled: yData.length <= 10,
            type: 'inside'
          },
          {
            show: yData.length > 10,
            type: 'slider'
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 'auto',
            rotate: yData.length > 10 ? -45 : 0,
            formatter: function (value) {
              return value + xunit
            }
          }
        },
        yAxis: {
          type: 'value',
          // axisTick: {
          //   inside: true
          // },
          width: '50px',
          triggerEvent: true,
          scale: true,
          axisLabel: {
            // margin: 2,
            interval: 'auto',
            formatter: function (value) {
              if (value >= 100000000) {
                value = value / 100000000 + '亿' + yunit
              } else if (value >= 10000000) {
                value = value / 10000000 + '千万' + yunit
              } else if (value >= 10000 && value < 10000000) {
                value = value / 10000 + '万' + yunit
              } else {
                value = value + yunit
              }
              return value
            }
          }
        },
        series: [{
          // data: yData.length === 0 ? this.fillEmptyData.data : yData,
          data: yData,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          barWidth: yData.length > 10 ? '30%' : 20, // 10%
          label: {
            show: true,
            position: 'top',
            formatter: function (data) {
              // console.log('value----->', data.dataIndex)
              return `${dataaxis[data.dataIndex]}`
            },
            color: '#000'
          }
        }]
      }, true)
      const key = element.split('_')[1]
      // 点击柱状， 获取对应业务的数据
      if (key === 'vipPkgShow' || key === 'vipPkgXiadan' || key === 'vipPkgPay' || key === 'vipPlay') {
        myChart.getZr().off('click')
        myChart.getZr().on('click', params => {
          const pointInPixel = [params.offsetX, params.offsetY]
          if (myChart.containPixel('grid', pointInPixel)) {
            const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
            // console.log(xIndex)
            // console.log(xData)
            const sourceName = xData[xIndex]
            _this.onSubmit(sourceName)
            // console.log('current--------->', sourceName)
          }
        })
      }

      this.allCharts[element] = myChart
    },

    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '', hasY2 = false, yAxisObjName1 = '', yAxisObjName2 = '') {
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      const chartElement = document.getElementById(element)
      if (!chartElement) return

      const echarts = require('echarts')
      const _this = this
      const yAxisObj = {
        type: 'value',
        name: yAxisObjName1,
        axisTick: {
          inside: true
        },
        // scale: true,
        axisLabel: {
          // margin: 30,
          formatter: function (value) {
            if (value >= 100000000) {
              value = value / 100000000 + '亿' + yunit
            } else if (value >= 10000000) {
              value = value / 10000000 + '千万' + yunit
            } else if (value >= 10000 && value < 10000000) {
              value = value / 10000 + '万' + yunit
            } else {
              value = value + yunit
            }
            return value
          }
        }
      }
      // let myChart = echarts.init(this.$refs[element])
      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        color: _this.colorList,
        legend: {
          data: legend
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 'auto',
            rotate: yData.length > 10 ? -45 : 0,
            formatter: function (value) {
              return value + xunit
            }
          }
        },
        yAxis: [yAxisObj],
        series: yData
      }
      // console.log('chart===>', myChart)
      if (hasY2) {
        option.yAxis.push({ ...yAxisObj, name: yAxisObjName2 })
      }
      const myChart = echarts.init(chartElement)
      myChart.setOption(option, true)
      this.allCharts[element] = myChart
    },

    // 环形图
    setPie (element, data) {
      const chartElement = document.getElementById(element)
      if (!chartElement) return
      // console.log('aaaaaaaaaaa--------------->', element)
      // console.log('aaaaaaaaaaa--------------->', data)
      // const name = '登录量'
      const _this = this
      const option = {
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   top: '5%',
        //   left: 'right',
        //   orient: 'vertical'
        // },
        legend: {
          // show: legend.show, // 展示图例
          x: 'right', // 水平居右
          y: 'center', // 垂直居中
          icon: 'circle', // 图例icon为方块
          backgroundColor: 'transparent',
          itemHeight: 10, // 图例icon高度
          itemWidth: 10, // 图例icon宽度
          orient: 'vertical', // 垂直排列
          type: 'scroll', // 可滚动翻页的图例
          pageIconSize: 8, // 翻页按钮大小
          pageIconColor: '#2C86FF', // 翻页箭头颜色
          pageIconInactiveColor: 'rgba(44,132,251,0.40)', // 翻页（即翻页到头时箭头的颜色
          pageTextStyle: {
            color: '#999' // 翻页数字颜色
          },
          align: 'left', // 图例icon在左侧
          formatter: function (name) {
            // console.log('p------->', name)
            // 文字太长时只取20个字符
            // const label = p.length > 20 ? p.substr(0, 20) : p
            // 文字宽度：后台设有宽度时使用后台传的值，若没有默认70
            // const width = 70
            // 渲染图例文字
            // return echarts.format.truncateText(label, width, '14px Microsoft Yahei', '…')
            // widthStyle 对应为legend.textStyle.rich中的key名，可设置label显示的样式
            // return `{widthStyle|${label}}`
            // return label
            let tarValue
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                tarValue = data[i].percent
              }
            }

            // return [`{name|${name}}`, `{num|${tarValue}}`].join(' |  ')
            return `{name|${name}}    |    {num|${tarValue}}`
          },
          // tooltip: {
          //   show: true, // 显示图例的tooltip
          //   textStyle: {
          //     width: 300, // 提示框宽度300
          //     overflow: 'breakAll' // 文字太长时换行
          //   },
          //   formatter: (val) => {
          //     // 图例最大宽度为600px, 超出部分隐藏
          //     return `<p style="max-width: 600px;overflow:hidden;white-space:pre-wrap;">${val.name}</p>`
          //   }
          // },

          textStyle: {
            color: '#464c54', // 图例文字颜色
            rich: {
              name: {
                fontSize: 14,
                height: 30,
                color: '#011'
                // padding: [0, 0, 20, 0]
              },
              num: {
                fontSize: 12,
                fontWeight: 100,
                // padding: [0, 0, 20, 0],
                color: '#000'
              }
            }
            // rich: {
            //   widthStyle: {
            //     width: legend.sideWidth ? (legend.sideWidth - 30) : 50,
            //     overflow: "hidden"
            //   }
            // }
          }
        },
        color: _this.colorList,

        series: [
          {
            // name: 'Access From',
            type: 'pie',
            // radius: ['40%', '70%'],
            // avoidLabelOverlap: true,

            center: ['25%', 'center'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: true,
            // itemStyle: {
            //   // borderRadius: 10,
            //   // borderColor: '#fff',
            //   // borderWidth: 2,
            //   normal: {
            //     color: function (colors) {
            //       var colorList = [
            //         '#fc8251',
            //         '#5470c6',
            //         '#91cd77',
            //         '#ef6567',
            //         '#f9c956',
            //         '#75bedc'
            //       ]
            //       return colorList[colors.dataIndex]
            //     }
            //   }
            // },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30'
                // fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ]
      }
      const echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      const myChart = echarts.init(chartElement)

      myChart.setOption(option)
      this.allCharts[element] = myChart
    }

  }
}
</script>

<style lang='stylus' scoped>
@import url('~@/assets/overview.styl')
// .ibox {
//   border-radius: 4px;
//   min-height: 36px;
//   background red
// }

.show-data {
  position: relative;
  bottom: 0
  // margin: 0 5px;
  // flex: 1
  // width: 50%;
  // min-width: 50%;
  // max-width: 50%;
  // border: 2px solid #3974f6;
}
.chart-div {
  height: 436px
}

.unit-box {
  margin-bottom: 10px;
  background-color: #fff;
}

.bold {
  color: #349344
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
>>> .el-col-8 {
  min-width: 300px
}

.wrap-div{
  display: block;
}

.unit-row {
  margin-bottom 10px
}
// .d-color {
//   .unit-box{
//     background #cbcbcb30
//   }
// }

// .s-color {
//   .unit-box{
//     background #c9e1bd1c !important;
//   }
// }
.single-show-panel {
  .launch-statistics {
    // display grid
    display flex
    // grid-template-columns: repeat(2, 1fr)
    // width 50%
    // gap: 20px;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
    .unit-wrap {
      width: 50%
      padding 10px
    }
    .unit-box {
      background: #fff;
      margin-bottom 0
    }
  }
  .launch-statistics2 {
    display flex
    // gap: 20px;
    flex-wrap: wrap;
    .unit-wrap {
      width 33.3%
      padding 10px
    }
    .unit-box {
      background: #fff;
      margin-bottom 0
    }
  }
}
</style>
