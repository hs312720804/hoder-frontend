<template>
    <div class="launch-statistics">
        <div class="statistics-header">
            <div class="date-picker">
                <el-date-picker
                  v-model="timeRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  @change="initChart">
                </el-date-picker>
            </div>
        </div>
        <div>
          <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj" :key="index">
            <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
              <div class="unit-box">
                <div class="unit-header clearfix">{{ chart.title }}</div>
                <div class="unit-content">
                  <!-- {{ chart }}
                  ---{{allChartData[key]}}-- -->
                  <div v-if="allChartData[key] && allChartData[key].series" :ref="key" :id="key" class="chart-div"></div>
                  <div v-else class="chart-div"> {{allChartData[key] || '暂无数据'}}</div>
                </div>
              </div>
            </el-col>

          </el-row>

        </div>

    </div>
</template>

<script>
export default {
  name: 'viewEffectDialog',
  props: {
    policyId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      allCharts: {},
      timeRange: [],
      allChartData: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      rowObj: [{ // 图表信息，需要和后端约定好名称
        'sequence_hit_l_1': { type: 'line', title: '人群命中对比', span: 15 },
        'sequence_hit_h_1': { type: 'bar', title: '人群命中量汇总对比', span: 9 }
      }, {
        'sequence_l_2': { type: 'line', title: '产品包曝光量对比', span: 15 },
        'sequence_h_2': { type: 'bar', title: '产品包曝光量汇总对比', span: 9 }
      }, {
        'sequence_l_3': { type: 'line', title: '付费设备量对比', span: 15 },
        'sequence_h3': { type: 'bar', title: '付费设备量汇总对比', span: 9 }
      }, {
        'sequence_l_4': { type: 'line', title: '付费率对比（%）', span: 15 },
        'sequence_h_4': { type: 'bar', title: '平均付费率对比', span: 9 }
      }, {
        'sequence_l_5': { type: 'line', title: '客单价对比（元）', span: 15 },
        'sequence_h_5': { type: 'bar', title: '平均客单价汇总对比', span: 9 }
      }, {
        'sequence_l_6': { type: 'line', title: '总营收对比（元）', span: 15 },
        'sequence_h_6': { type: 'bar', title: '总营收汇总对比', span: 9 }
      }, {
        'sequence_l_8': { type: 'line', title: '付费单量对比', span: 15 },
        'sequence_h_8': { type: 'bar', title: '付费单量汇总对比', span: 9 }
      }, {
        'sequence_hit_h_7': { type: 'bar', title: '各子人群命中量对比', span: 24 }
      }
      ]
    }
  },
  watch: {
    // timeRange: {
    //   handler (val) {
    //     this.initChart()
    //   }
    // },
    policyId: {
      handler (val) {
        this.initRange()
        this.initChart()
      },
      immediate: true
    }
  },
  mounted () {
    // chart5
    // 图表自适应
    window.addEventListener('resize', () => {
      for (var key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })
  },
  methods: {
    initRange () {
      // 设置默认时间为今天的前一周
      const start = new Date()
      const end = new Date()
      const startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 30))
      const endDate = this.formatDate(end.setTime(end.getTime()))
      this.timeRange = [startDate, endDate]
    },
    formatDate (d) {
      const time = new Date(d)
      let y = time.getFullYear() // 年份
      let m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
      let r = time.getDate().toString().padStart(2, '0') // 日子
      return `${y}-${m}-${r}`
    },
    initChart () {
      // chart1
      // this.getBusinessUseTendency(this.rangeType)
      // 172.20.148.31:8011/chart/policySixIndexStats?policyId=1890&startDate=2021-11-01&endDate=2021-11-22
      // const params = {
      //   policyId: this.policyId,
      //   startDate: this.timeRange[0],
      //   endDate: this.timeRange[1]
      // }
      // const params = {
      //   policyId: 1890,
      //   startDate: '2021-11-01',
      //   endDate: '2021-11-22'
      // }
      // beta-mgr-hoder.skysrt.com:8011/chart/policySixIndexStats?policyId=2906&startDate=2022-03-18&endDate=2022-04-19
      const params = {
        policyId: 2906,
        startDate: '2022-03-18',
        endDate: '2022-04-19'
      }
      // 获取所有图表数据
      this.$service.getPolicySixIndexStats(params).then(res => {
        this.allChartData = res

        this.$nextTick(() => {
          const rowObj = this.rowObj
          rowObj.forEach(item => {
            for (let key in item) {
              if (item[key].type === 'line') {
                this.showLine(this.allChartData[key], key)
              } else {
                this.showBar(this.allChartData[key], key)
              }
            }
          })
        })
      })
    },
    aaa (name) {
      let arr = name.split('_')

      let result = ''

      arr.forEach(ele => {
        for (let i = 0; i < ele.length; i++) {
          let item = ele[i]

          if (i === 0) {
            item = ele[i].toUpperCase()
          }

          console.log(item)

          result = result + item
        }
      })

      console.log(result)
    },
    //  折线图
    showLine (data, chartID) {
      // console.log('showLine======111>>>', ...arguments)

      if (data && data.xaxis) {
      // this.$service.getStatisticStrategyReqAndHit({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })
        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
      // })
      }
    },

    //  柱状图
    showBar (data, chartID) {
      // console.log('showBar======111>>>', ...chartID)
      if (data && data.xaxis) {
        this.setBarEchart(chartID, '', data.xaxis, data.series, data.xunit, data.yunit)
      }
      // this.$service.getStatisticCrowdLife({ rangeType }).then((data) => {
      // })
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '') {
      console.log('setBarEchart======111>>>', this.$refs)
      console.log('setBarEchart======111>>>', element)
      console.log('setBarEchart======111>>>', this.$refs[element])
      // const _this = this
      let echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      let myChart = echarts.init(document.getElementById(element))
      myChart.setOption({
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
          barWidth: 10
        }]
      }, true)
      this.allCharts[element] = myChart
    },

    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '') {
      console.log('setBarEchart======111>>>', this.$refs)
      console.log('setBarEchart======111>>>', element)
      console.log('setBarEchart======111>>>', this.$refs[element])
      let echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      let myChart = echarts.init(document.getElementById(element))
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },

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
        },
        series: yData
      }, true)
      // console.log('chart===>', myChart)

      this.allCharts[element] = myChart
    }
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
.statistics-header
  position: sticky;
  top: 0;
  z-index: 1
  background: #fff
  padding-bottom 20px
.chart-div
  height: 436px
</style>
