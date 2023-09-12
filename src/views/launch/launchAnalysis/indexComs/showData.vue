<template>
<div class='show-data' :class="{'single-show-panel': isSingShowPanel}">
  <template v-if="pageStatus === 1">
    <!-- 总览 -->
    <div class="show-data-header" >
      <div class="big-title">总览</div>

      <div class="export-button">
        <a :href="downloadUrl" download ref="download_Url"></a>
        <el-button type="success" @click="handleGxportRightsInterests">导出数据</el-button>
      </div>
    </div>
    <!-- 多级多层的表单填写项 -->

    <div class="wrap-div">
      <div class="overview-table">
          <div class="ibox">
            <div class="title-one">
              主页活跃人数
              <span class="remark">（根据圈定量统计）</span>
            </div>
            <div class="text-two">
              {{ cc_format_number(overview.homepageActiveUv) }}
            </div>
            <div class="small-box">
              <div class="small">
                <span>圈定用户数</span>
                <span>
                  {{ cc_format_number(overview.quandingUv) }}
                </span>
              </div>
            </div>
          </div>

          <div class="ibox">
            <div class="title-one">起播活跃率
              <span class="remark">（根据圈定量统计）</span>
            </div>
            <div class="text-two">
              {{ toPercent(overview.totalPlayRate) }}
            </div>
            <div class="small-box">
              <div class="small">
                <span>起播人数</span>
                <span>
                  {{ cc_format_number(overview.totalPlayUv) }}
                </span>
              </div>
              <div class="small">
                <span>主页活跃人数</span>
                <span>
                  {{ cc_format_number(overview.homepageActiveUv) }}
                </span>
              </div>
            </div>
          </div>

          <div class="ibox">
            <div class="title-one">产品包曝光率
              <span class="remark">（根据命中量统计）</span>
            </div>
            <div class="text-two">
              {{ toPercent(overview.totalPkgShowRate) }}
            </div>
            <div class="small-box">
              <div class="small">
                <span>产品包曝光人数</span>
                <span>{{ cc_format_number(overview.totalPkgShowUv) }}</span>
              </div>
              <div class="small">
                <span>起播人数</span>
                <span>{{ cc_format_number(overview.totalPlayUv) }}</span>
              </div>
            </div>
          </div>

          <div class="ibox">
            <div class="title-one">下单率
              <span class="remark">（根据命中量统计）</span>
            </div>
            <div class="text-two">
              {{ toPercent(overview.totalPkgXiadanRate) }}
            </div>
            <div class="small-box">
              <div class="small">
                <span>下单人数</span>
                <span>{{ cc_format_number(overview.totalPkgXiadanUv) }}</span>
              </div>
              <div class="small">
                <span>曝光人数</span>
                <span>{{ cc_format_number(overview.totalPkgShowUv) }}</span>
              </div>
            </div>
          </div>

          <div class="ibox">
            <div class="title-one">付费率
              <span class="remark">（根据命中量统计）</span>
            </div>
            <div class="text-two">
              {{ toPercent(overview.totalPkgPayRate) }}
            </div>
            <div class="small-box">
              <div class="small">
                <span>付费人数</span>
                <span>{{ cc_format_number(overview.totalPkgPayUv) }}</span>
              </div>
              <div class="small">
                <span>曝光人数</span>
                <span>{{ cc_format_number(overview.totalPkgShowUv) }}</span>
              </div>
            </div>
          </div>

          <div class="ibox">
            <div class="title-one">付费金额
              <span class="remark">（根据命中量统计）</span>
            </div>
            <div class="text-two" style="height: 70px">
              {{ cc_format_number(overview.totalPrice) }}
            </div>

          </div>

      </div>

      <!-- 漏斗图 -->
      <div class="chart-wrap">
        <div :id="crowdId+'_chart1'" :ref="crowdId+'_chart1'" class="chart-1" >chart1</div>
      </div>
    </div>
  </template>

  <div
    v-else
    style="height: calc(100vh - 321px);"
  >
    <el-empty :description="pageStatus === 0 ? '数据正在分析中，请稍后重试': '暂无数据'" ></el-empty>
  </div>

</div>
</template>

<script>
export default {
  components: {},
  props: {
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
    }
  },
  data () {
    return {
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

      isIndeterminate: false,
      isIndeterminate2: false,
      formInline: {
        crowdId: '',
        crowdIds: [{ value: '' }],
        sourceNameList: [],
        // timeRange: ['2022-07-18', '2022-07-19']
        timeRange: [],
        isDelCache: 0
      },
      show: true,
      allCharts: {},
      timeRange: [],
      // allChartData: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },

      loading: false,
      crowdName: '',
      // pageStatus: 2, // 暂无数据
      emptyTxt: '投后效果，一键分析',
      downloadUrl: ''

    }
  },
  mounted () {
    // chart5
    // 图表自适应
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })

    // // 设置初始化展示数据
    // this.setDefaultData()

    // // 历史搜索记录
    // this.handleGetRightsInterestsSearchRecord()

    // this.init()
  },
  computed: {
    // getPickerOptions () {
    //   return {
    //     disabledDate: (time) => {
    //       const minTime = +new Date(this.startTime) - 24 * 3600 * 1000
    //       const maxTime = +new Date(this.endTime)
    //       return time.getTime() > maxTime || time.getTime() < minTime
    //     }
    //   }
    // },
    // 'formInline.crowdId' () {
    //   return this.formInline.crowdIds.map(item => item.value).join(',') || ''
    // }
  },
  watch: {
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
  deactivated () {
    // console.log('deactivated - setTimeOutVal------->', this.setTimeOutVal)
  },
  methods: {

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

    toPercent (point) {
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    }

  }
}
</script>

<style lang='stylus' scoped>
@import url('~@/assets/overview.styl')
.show-data {
  position: relative;
  bottom: 0
  // margin: 0 5px;
  // flex: 1
  // width: 100%;
  // overflow: auto;
  // border: 2px solid #3974f6;
}
// .ibox {
//   border-radius: 4px;
//   min-height: 36px;
//   background red
// }
// .d-color {
//   .ibox{
//     // background #83c7f724 !important
//     background #cbcbcb30
//   }
// }

// .s-color {
//   .ibox{

//     background #c9e1bd1c !important;
//   }
// }
.big-title{
  color rgb(103, 106, 108)
  font-family "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif
  font-size 26px
  font-weight 100
  margin 10px 0
}
.overview-table {
  // flex: 1 0 730px
  // flex: 1 0 auto
  color rgb(103, 106, 108)
}

// .small:nth-child(1) {
//   margin-bottom 10px
// }
.chart-wrap {
  flex: 0.8 0 100%;
}
.chart-1 {
  width: 100%;
  height: 360px;
  margin: 0 auto;
}

.remark {
  font-size: 12px;
  color: #C0C4CC;
  font-weight 400
}
>>> .el-col-8 {
  min-width: 300px
}

.wrap-div{
  display: block;
}
.show-data-header {
  display: flex;
  justify-content: space-between;
}

.single-show-panel {
  .wrap-div {
    display: flex;
    justify-content: space-between;
  }
  .overview-table{
    flex: 1 0 730px;
    color: #676a6c;
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-gap: 20px
  }
  .ibox {
    // display block
    background #fff
    margin-bottom 0
  }
  .chart-wrap {
    flex: 0.8 0 550px;
  }
  .chart-1 {
    width: 550px
  }
}

</style>
