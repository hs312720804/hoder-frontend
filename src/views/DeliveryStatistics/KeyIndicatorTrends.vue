<template>
  <div class="launch-statistics">
    <div id="ul111">
      <div class="icon-open-close" @click="changeView">
        <i v-if="showNav" class="el-icon-d-arrow-right"></i>
        <i v-else class="el-icon-d-arrow-left"></i>
      </div>

      <div class="list-wrap" :class="{aaa: !showNav}">
        <div v-for="item in chartList" :key="item.hookId">
          <a href="javascript:void(0)" :to="item.hookId" @click="goAnchor('#'+ item.hookId)" :title="item.title">{{ item.title }}</a>
        </div>

      </div>

    </div>

    <KeyIndicatorTrendsTotal :totalOverview="totalOverview" ></KeyIndicatorTrendsTotal>

    <div class="statistics-header">
      <div class="date-picker">
          <!-- <el-date-picker
            v-model="time0"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker> -->
          最近：<el-select v-model="rangeType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
    </div>

    <div>
      <el-row :gutter="20" class="unit-row" v-for="item in chartList" :key="item.hookId" :id='item.hookId'>
        <el-col :span="24">
          <div class="unit-box">
            <div class="unit-header clearfix">{{ item.title }}</div>
            <div class="unit-content">
                <div :ref="item.chartRef" :id="item.chartRef" class="chart-div"></div>
              <!-- <div v-if="allChartData[key] && ((allChartData[key].series && allChartData[key].series.length > 0) || allChartData[key].data)" :ref="item.chartRef" :id="item.chartRef" class="chart-div"></div>
              <div v-else class="chart-div">
                <el-empty description="暂无数据"></el-empty>
              </div> -->
            </div>
          </div>
        </el-col>
      </el-row>

    </div>

  </div>
</template>

<script>
import KeyIndicatorTrendsTotal from './KeyIndicatorTrendsTotal.vue'
import AutoHighLightAnchor from '@/views/launch/launchAnalysis/dynamicTable/autoHighLightAnchor.js'

export default {
  name: 'keyIndicatorTrendsAA',
  components: {
    KeyIndicatorTrendsTotal
  },
  data () {
    return {
      chartList: [{
        title: '业务处理量',
        chartRef: 'chart1',
        hookId: 'a1'
      }, {
        title: '人群增长趋势',
        chartRef: 'chart2',
        hookId: 'a2'
      }, {
        title: '策略使用',
        chartRef: 'chart3',
        hookId: 'a3'
      }, {
        title: '投放统计',
        chartRef: 'chart14',
        hookId: 'a4'
      }, {
        title: '标签使用',
        chartRef: 'chart4',
        hookId: 'a5'
      }, {
        title: '人群寿命',
        chartRef: 'chart5',
        hookId: 'a6'
      }, {
        title: '行为人群寿命',
        chartRef: 'chart6',
        hookId: 'a7'
      }, {
        title: '策略寿命',
        chartRef: 'chart7',
        hookId: 'a8'
      }, {
        title: '大数据标签热度',
        chartRef: 'chart8',
        hookId: 'a9'
      }, {
        title: '账号标签热度',
        chartRef: 'chart9',
        hookId: 'a10'
      }, {
        title: '临时标签热度',
        chartRef: 'chart10',
        hookId: 'a11'
      }, {
        title: '使用占比',
        chartRef: 'chart11',
        hookId: 'a12'
      }, {
        title: '存储监控',
        chartRef: 'chart12',
        hookId: 'a13'
      }, {
        title: '性能监控',
        chartRef: 'chart13',
        hookId: 'a14'
      }],
      showNav: true,
      allCharts: {},
      rangeType: 'OM',
      options: [{
        value: 'OM',
        label: '1个月'
      }, {
        value: 'OQ',
        label: '1个季度'
      }, {
        value: 'OY',
        label: '1年'
      }, {
        value: 'TN',
        label: '上线至今'
      }],
      totalOverview: {
        totalHit: 0,
        totalReq: 0,
        totaStrategys: 0,
        useStrategys: 0,
        totalCrowd: 0,
        usedCrowd: 0,
        estimateCrowd: 0,
        abCrowd: 0
      }
    }
  },
  watch: {
    rangeType: {
      handler (val) {
        this.initChart()
      },
      immediate: true
    }
  },
  methods: {
    goAnchor (selector) {
      document.querySelector(selector).scrollIntoView({
        behavior: 'smooth'
      })
    },
    high () {
      const high = new AutoHighLightAnchor(document.querySelector('#ul111'), document.querySelector('.el-main'), 'type3')
    },
    changeView () {
      this.showNav = !this.showNav
    },
    initChart () {
      // chart1
      this.getBusinessUseTendency(this.rangeType)

      // chart2
      this.getStatisticCrowdGrowth(this.rangeType)

      // chart3
      this.getStatisticStrategyUse(this.rangeType)

      // chart14
      this.getStatisticCrowdLaunch(this.rangeType)

      // chart4
      this.getStatisticTagsGrowth(this.rangeType)

      // chart11
      this.getCountGetCrowdRatio(this.rangeType)

      // chart12
      this.getCountGetStore(this.rangeType)

      // chart13
      this.getStatisticCrowdCalcDuration(this.rangeType)
    },
    //  1
    getBusinessUseTendency (rangeType) {
      this.$service.getStatisticStrategyReqAndHit({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })

        // 统计数据
        this.totalOverview.totalHit = 0
        this.totalOverview.totalReq = 0
        if (series.length > 0) {
          this.totalOverview.totalHit = series[0].value[series[0].value.length - 1]
          this.totalOverview.totalReq = series[1].value[series[1].value.length - 1]
        }

        this.$nextTick(() => {
          this.setLinesEchart('chart1', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    //  2
    getStatisticCrowdGrowth (rangeType) {
      this.$service.getStatisticCrowdGrowth({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })

        // 统计数据
        this.totalOverview.totalCrowd = 0
        this.totalOverview.usedCrowd = 0
        this.totalOverview.estimateCrowd = 0
        this.totalOverview.abCrowd = 0

        if (series.length > 0) {
          const totalCrowd = series.find(item => item.name.indexOf('人群总数') !== -1) || {}
          this.totalOverview.totalCrowd = totalCrowd.value[totalCrowd.value.length - 1]

          const usedCrowd = series.find(item => item.name.indexOf('使用中') !== -1) || {}
          this.totalOverview.usedCrowd = usedCrowd.value[usedCrowd.value.length - 1]

          const estimateCrowd = series.find(item => item.name.indexOf('估算') !== -1) || {}
          this.totalOverview.estimateCrowd = estimateCrowd.value[estimateCrowd.value.length - 1]

          const abCrowd = series.find(item => item.name.indexOf('ab') !== -1) || {}
          this.totalOverview.abCrowd = abCrowd.value[abCrowd.value.length - 1]
          // this.totalOverview.abCrowd = series[6].value[series[6].value.length - 1]
        }

        this.$nextTick(() => {
          this.setLinesEchart('chart2', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    //  3
    getStatisticStrategyUse (rangeType) {
      this.$service.getStatisticStrategyUse({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })

        // 统计数据
        this.totalOverview.totaStrategys = 0
        this.totalOverview.useStrategys = 0
        if (series.length > 0) {
          this.totalOverview.totaStrategys = series[0].value[series[0].value.length - 1]
          this.totalOverview.useStrategys = series[1].value[series[1].value.length - 1]
        }

        this.$nextTick(() => {
          this.setLinesEchart('chart3', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },
    //  4
    getStatisticTagsGrowth (rangeType) {
      this.$service.getStatisticTagsGrowth({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })
        this.$nextTick(() => {
          this.setLinesEchart('chart4', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    //  5
    getStatisticCrowdLife (rangeType) {
      this.$service.getStatisticCrowdLife({ rangeType }).then((data) => {
        this.$nextTick(() => {
          this.setBarEchart('chart5', '', data.xaxis, data.series, data.xunit, data.yunit)
        })
      })
    },

    //  6
    getStatisticBehaviorCrowdLife (rangeType) {
      this.$service.getStatisticBehaviorCrowdLife({ rangeType }).then((data) => {
        this.$nextTick(() => {
          this.setBarEchart('chart6', '', data.xaxis, data.series, data.xunit, data.yunit)
        })
      })
    },

    //  7
    getStatisticStrategyLife (rangeType) {
      this.$service.getStatisticStrategyLife({ rangeType }).then((data) => {
        this.$nextTick(() => {
          this.setBarEchart('chart7', '', data.xaxis, data.series, data.xunit, data.yunit)
        })
      })
    },

    //  8 9 10
    getCountGetTag (type, chartId) {
      this.$service.getCountGetTag({ type }).then((data) => {
        this.$nextTick(() => {
          this.setBarEchart(chartId, '', data.xaxis, data.series, data.xunit, data.yunit)
        })
      })
    },

    //  11
    getCountGetCrowdRatio (rangeType) {
      this.$service.getCountGetCrowdRatio({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          const valueMap = key.value.map((item) => Math.round(item * 100))
          return { name: key.name, data: valueMap, type: 'line' }
        })
        this.$nextTick(() => {
          this.setLinesEchart('chart11', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    //  12
    getCountGetStore (rangeType) {
      this.$service.getCountGetStore({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })
        this.$nextTick(() => {
          this.setLinesEchart('chart12', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    //  13
    getStatisticCrowdCalcDuration (rangeType) {
      this.$service.getStatisticCrowdCalcDuration({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        }) || []
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        }) || []
        this.$nextTick(() => {
          this.setLinesEchart('chart13', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    //  14
    getStatisticCrowdLaunch (rangeType) {
      this.$service.getStatisticCrowdLaunch({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })
        this.$nextTick(() => {
          this.setLinesEchart('chart14', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
        })
      })
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '') {
      const chartElement = document.getElementById(element)
      if (!chartElement) return

      const option = {
        title: {
          text: title
        },
        tooltip: {
          // trigger: 'item',
          trigger: 'axis'
          // formatter: function (parmas) {
          //   let str = parmas[0].name + '<br/>'
          //   for (let item of parmas) {
          //     str = str + item.marker + item.name + ': ' + item.value + yunit + '<br/>'
          //   }
          //   // return _this.cc_format_number(a.data)
          //   return str
          // }
        },

        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 'auto',
            rotate: -45,
            formatter: function (value) {
              return value + xunit
            }
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            margin: 2,
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
          barWidth: 10
        }]
      }

      // const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(chartElement)
      myChart.setOption(option)

      this.allCharts[element] = myChart
    },

    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '') {
      const chartElement = document.getElementById(element)
      if (!chartElement) return

      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
          // formatter: function (parmas) {
          //   let str = parmas[0].name + '<br/>'
          //   for (let item of parmas) {
          //     str = str + item.marker + item.seriesName + ' :  ' + item.value + yunit + '<br/>'
          //   }
          //   // return _this.cc_format_number(a.data)
          //   return str
          // }
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     formatter: function (params) {
          //       return '快照时间：' + params.value
          //     }
          //   }
          // }
          // formatter: function (params) {
          //   params = params[0]
          //   var date = new Date(params.name)
          //   return (
          //     date.getDate() +
          //     '/' +
          //     (date.getMonth() + 1) +
          //     '/' +
          //     date.getFullYear() +
          //     ' : ' +
          //     params.value[1]
          //   )
          // }
          // formatter: function (a) {
          //   return _this.cc_format_number(a.data)
          // }
          // formatter: '{b0}: {c0}<br />{b1}: {c1}'
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: function (a) {
        //     return _this.cc_format_number(a.data)
        //   }
        //   // formatter: "{a} <br/> {b}: {c} ({d}%)"
        // },
        legend: {
          data: legend
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 'auto',
            rotate: -45,
            formatter: function (value) {
              return value + xunit
            }
          }
        },
        yAxis: {
          type: 'value',
          // name: '温度',
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            margin: 30,
            formatter: function (value) {
              // if (value >= 10000 && value < 10000000) {
              //   value = value / 10000 + '万' + yunit
              // } else if (value >= 10000000) {
              //   value = value / 10000000 + '千万' + yunit
              // } else if (value >= 100000000) {
              //   value = value / 100000000 + '亿' + yunit
              // } else {
              //   value = value + yunit
              // }
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
        series: yData
      }

      const echarts = require('echarts')
      const myChart = echarts.init(chartElement)

      myChart.setOption(option)

      this.allCharts[element] = myChart
    }
  },
  mounted () {
    this.high() // 锚点侧边栏

    // chart5
    this.getStatisticCrowdLife()

    // chart6
    this.getStatisticBehaviorCrowdLife()

    // chart7
    this.getStatisticStrategyLife()

    // chart8 9 10
    this.getCountGetTag(0, 'chart8')
    this.getCountGetTag(1, 'chart9')
    this.getCountGetTag(2, 'chart10')

    // 图表自适应
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })
  },
  created () {

  }
}
</script>

<style lang="stylus" scoped>
@import url('~@/assets/overview.styl')
.launch-statistics
  position: relative;
  box-sizing: border-box;
.title
    font-size 20px
    margin-left 20px
.crowd-statistic
    padding 10px 0
    border-bottom 1px dashed #ccc
    &:before
    &:after
        display table
        content ""
    &:after
        clear: both
    .crowd-statistic-item
        width 25%
        float: left
        margin 20px 0
        text-align center
        .crowd-statistic-item--number
            color red
.crowd-all-item-container
    display flex
    align-items center
    justify-content center
    height 300px
.crowd-all-item
    width 20%
    text-align center
    margin 30px 0
    font-size 12px
    color #aaa
    &:first-child
        width 40%
        border-right 1px solid #eee
        .crowd-all-item--number
            font-size 30px
            margin-bottom 0
    .crowd-all-item--number
        color #000
        font-weight bold
        font-size 16px
        margin-bottom 10px
.home-page-recommend
    height 300px
.home-page-recommend-item
    width 50%
    text-align center
    margin-top 50px
    font-size 12px
    color #aaa
    float left
    .home-page-recommend-item--number
        color #000
        font-weight bold
        font-size 16px
        margin-bottom 10px
.tag-all-item-container
    display flex
    align-items center
    justify-content center
    height 150px
.tag-all-item
    width 25%
    text-align center
    margin 30px 0
    font-size 12px
    color #aaa
    &:first-child
        width 50%
        border-right 1px solid #eee
        .crowd-all-item--number
            margin-bottom 0
    .tag-all-item--number
        color #000
        font-weight bold
        font-size 16px
        margin-bottom 10px
.launch-all-item-container
    display flex
    align-items center
    justify-content center
    // height 150px
    margin 0 10px
.launch-all-item
    width 25%
    text-align center
    margin 15px 0
    font-size 12px
    color #aaa
    &:first-child
        width 50%
    .launch-all-item--number
        color #000
        font-weight bold
        font-size 16px
        margin-bottom 10px
.echarts-container
    position relative
    width 50%
    height auto
    float left
    &:before
    &:after
        display table
        content ""
    &:after
        clear: both
.main
    width 90%
    height 240px
    padding 30px
/*.date-picker*/
    /*text-align center*/
.circle-echarts
    float left
    width 33%
    height 200px
    margin-bottom 20px
.border-right
    border-right 1px dashed #000
.border-bottom
    border-bottom 1px dashed #000
.click-date-picker
    text-align center
    margin 20px 0
.left-map-container
    width 50%
    float left
    height 400px
.map-echarts
    width 100%
    height 300px
/*padding 30px*/
.table-title
    font-size 18px
    margin 0 0 20px 0
.table-over
    margin-left 40px
    width 40%
    float left
.table-overflow
    height 360px
    overflow auto
.city-active-proportion
    margin 20px 0 0 20px
.city-active-proportion--title
    font-size 18px
.city-active-proportion--name
    width 50%
    float left
    height 20px
    line-height 20px
.business-text
    text-decoration underline
    color #0077aa
    position absolute
    z-index 9
    top 80px
    right 80px
    cursor pointer
.two-mixed
    margin-top 10px
    display flex
    .mixed-item
        &:first-child
            width 34%
        width 66%
.business-use-text
    text-align center
    height 250px
.business-use-text .number
    padding-top 100px
.number
    color #000
    font-weight bold
    font-size 16px
    margin-bottom 10px
.name
    font-size 12px
    color #aaa
.member-select
    // display flex
    // align-items center
    // justify-content center
    float right
    .member-select--text
        margin-right 20px
.active-rate
    display flex
    align-items center
    margin-left 20px
.active-rate--title
    margin-right 20px
.statistics-header
  position: sticky;
  top: -20px;
  z-index: 1
  background: #fff
  margin-bottom 20px
  // display flex
  // justify-content space-between
.chart-div
  height: 436px
#ul111
  top: 28%;
  // .list-wrap
  //   width 120px
</style>
