<template>
    <div class="launch-statistics">
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
          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">业务处理量</div>
                <div class="unit-content">
                    <div ref="chart1" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">人群增长趋势</div>
                <div class="unit-content">
                    <div ref="chart2" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">策略使用</div>
                <div class="unit-content">
                    <div ref="chart3" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">标签使用</div>
                <div class="unit-content">
                    <div ref="chart4" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">人群寿命</div>
                <div class="unit-content">
                    <div ref="chart5" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">行为人群寿命</div>
                <div class="unit-content">
                    <div ref="chart6" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">策略寿命</div>
                <div class="unit-content">
                    <div ref="chart7" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">大数据标签热度</div>
                <div class="unit-content">
                    <div ref="chart8" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">账号标签热度</div>
                <div class="unit-content">
                    <div ref="chart9" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">临时标签热度</div>
                <div class="unit-content">
                    <div ref="chart10" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">使用占比</div>
                <div class="unit-content">
                    <div ref="chart11" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">存储监控</div>
                <div class="unit-content">
                    <div ref="chart12" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">性能监控</div>
                <div class="unit-content">
                    <div ref="chart13" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

    </div>
</template>

<script>
export default {
  name: 'keyIndicatorTrendsAA',
  components: {
  },
  data () {
    return {
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
      }]
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
    initChart () {
      // chart1
      this.getBusinessUseTendency(this.rangeType)

      // chart2
      this.getStatisticCrowdGrowth(this.rangeType)

      // chart3
      this.getStatisticStrategyUse(this.rangeType)

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
        this.setLinesEchart('chart1', '', data.xaxis, linesData, legendData)
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
        this.setLinesEchart('chart2', '', data.xaxis, linesData, legendData)
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
        this.setLinesEchart('chart3', '', data.xaxis, linesData, legendData)
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
        this.setLinesEchart('chart4', '', data.xaxis, linesData, legendData)
      })
    },

    //  5
    getStatisticCrowdLife (rangeType) {
      this.$service.getStatisticCrowdLife({ rangeType }).then((data) => {
        this.setBarEchart('chart5', '', data.xaxis, data.series)
      })
    },

    //  6
    getStatisticBehaviorCrowdLife (rangeType) {
      this.$service.getStatisticBehaviorCrowdLife({ rangeType }).then((data) => {
        this.setBarEchart('chart6', '', data.xaxis, data.series)
      })
    },

    //  7
    getStatisticStrategyLife (rangeType) {
      this.$service.getStatisticStrategyLife({ rangeType }).then((data) => {
        this.setBarEchart('chart7', '', data.xaxis, data.series)
      })
    },

    //  8 9 10
    getCountGetTag (type, chartId) {
      this.$service.getCountGetTag({ type }).then((data) => {
        this.setBarEchart(chartId, '', data.xaxis, data.series)
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
          return { name: key.name, data: key.value, type: 'line' }
        })
        this.setLinesEchart('chart11', '', data.xaxis, linesData, legendData)
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
        this.setLinesEchart('chart12', '', data.xaxis, linesData, legendData)
      })
    },

    //  13
    getStatisticCrowdCalcDuration (rangeType) {
      this.$service.getStatisticCrowdCalcDuration({ rangeType }).then((data) => {
        debugger
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        }) || []
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        }) || []
        this.setLinesEchart('chart13', '', data.xaxis, linesData, legendData)
      })
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData) {
      const _this = this
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          // trigger: 'item',
          trigger: 'axis'
          // formatter: function (a) {
          //   return _this.cc_format_number(a.data)
          // }
        },
        // tooltip: {
        //   trigger: 'axis'
        // },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 'auto',
            rotate: -45
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
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + '万'
              } else if (value >= 10000000) {
                value = value / 10000000 + '千万'
              } return value
            }
          }
        },
        series: [{
          // data: yData.length === 0 ? this.fillEmptyData.data : yData,
          data: yData,
          type: 'bar',
          barWidth: 10
        }]
      }, true)
      this.allCharts[element] = myChart
    },

    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend) {
      const _this = this
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
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
          //   debugger
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
            rotate: -45
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            margin: 30,
            formatter: function (value) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + '万'
              } else if (value >= 10000000) {
                value = value / 10000000 + '千万'
              } return value
            }
          }
        },
        series: yData
      }, true)
      // console.log('chart===>', myChart)

      this.allCharts[element] = myChart
    }
  },
  mounted () {
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
      for (var key of Object.keys(this.allCharts)) {
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
    .launch-statistics
      // overflow hidden
      position: relative;
      height: 100%;
      overflow: auto;
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
      top: 0;
      z-index: 1
      background: #fff
      padding-bottom 20px
      // display flex
      // justify-content space-between
.chart-div
  height: 436px
</style>
