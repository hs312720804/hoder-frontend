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
                  value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <div>
          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">人群命中量对比</div>
                <div class="unit-content">
                    <div ref="sequence_hit_l_1" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">人群命中量汇总对比</div>
                <div class="unit-content">
                    <div ref="sequence_hit_h_1" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">付费单量对比</div>
                <div class="unit-content">
                    <div ref="sequence_l_8" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">付费单量对比</div>
                <div class="unit-content">
                    <div ref="sequence_h_8" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">产品包曝光量对比</div>
                <div class="unit-content">
                    <div ref="sequence_l_2" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">产品包曝光量汇总对比</div>
                <div class="unit-content">
                    <div ref="sequence_h_2" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">付费设备量对比</div>
                <div class="unit-content">
                    <div ref="sequence_l_3" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">付费设备量汇总对比</div>
                <div class="unit-content">
                    <div ref="sequence_h3" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">付费率对比（%）</div>
                <div class="unit-content">
                    <div ref="sequence_l_4" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">平均付费率对比</div>
                <div class="unit-content">
                    <div ref="sequence_h_4" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">客单价对比（元）</div>
                <div class="unit-content">
                    <div ref="sequence_l_5" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">平均客单价汇总对比</div>
                <div class="unit-content">
                    <div ref="sequence_h_5" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="15">
              <div class="unit-box">
                <div class="unit-header clearfix">总营收对比（元）</div>
                <div class="unit-content">
                    <div ref="sequence_l_6" class="chart-div"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="unit-box">
                <div class="unit-header clearfix">总营收汇总对比</div>
                <div class="unit-content">
                    <div ref="sequence_h_6" class="chart-div"></div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="unit-row">
            <el-col :span="24">
              <div class="unit-box">
                <div class="unit-header clearfix">各子人群命中量对比</div>
                <div class="unit-content">
                    <div ref="sequence_hit_h_7" class="chart-div"></div>
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
      timeRange: []
    }
  },
  watch: {
    timeRange: {
      handler (val) {
        this.initChart()
      },
      immediate: true
    },
    policyId: {
      handler (val) {
        this.initChart()
      }
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
    initChart () {
      // chart1
      // this.getBusinessUseTendency(this.rangeType)
      // 172.20.148.31:8011/chart/policySixIndexStats?policyId=1890&startDate=2021-11-01&endDate=2021-11-22
      const params = {
        policyId: this.policyId,
        startDate: this.timeRange[0],
        endDate: this.timeRange[1]
      }
      // const params = {
      //   policyId: 1890,
      //   startDate: '2021-11-01',
      //   endDate: '2021-11-22'
      // }
      // beta-mgr-hoder.skysrt.com:8011/chart/policySixIndexStats?policyId=2906&startDate=2022-03-18&endDate=2022-04-19
      // const params = {
      //   policyId: 2906,
      //   startDate: '2022-03-18',
      //   endDate: '2022-04-19'
      // }
      // 获取所有图表数据
      this.$service.getPolicySixIndexStats(params).then(res => {
        const {
          sequence_hit_l_1,
          sequence_hit_h_1,
          sequence_hit_h_7,
          sequence_l_2,
          sequence_l_3,
          sequence_l_4,
          sequence_l_5,
          sequence_l_6,
          sequence_h_2,
          sequence_h3,
          sequence_h_4,
          sequence_h_5,
          sequence_h_6,
          sequence_l_8,
          sequence_h_8
        } = res
        this.showLine(sequence_hit_l_1, 'sequence_hit_l_1')
        this.showLine(sequence_hit_h_1, 'sequence_hit_h_1')
        this.showLine(sequence_l_2, 'sequence_l_2')
        this.showLine(sequence_l_3, 'sequence_l_3')
        this.showLine(sequence_l_4, 'sequence_l_4')
        this.showLine(sequence_l_5, 'sequence_l_5')
        this.showLine(sequence_l_6, 'sequence_l_5')
        this.showLine(sequence_l_8, 'sequence_l_8')
        this.showLine(sequence_h_8, 'sequence_h_8')
        this.showBar(sequence_hit_h_7, 'sequence_hit_h_7')
        this.showBar(sequence_h_2, 'sequence_h_2')
        this.showBar(sequence_h3, 'sequence_h3')
        this.showBar(sequence_h_4, 'sequence_h_4')
        this.showBar(sequence_h_5, 'sequence_h_5')
        this.showBar(sequence_h_6, 'sequence_h_6')
      })
    },
    aaa (name) {
      // let name = 'first_name'

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
    },

    //  柱状图
    showBar (data, chartID) {
      console.log('data======111>>>', data)
      if (data && data.xaxis) {
        this.setBarEchart(chartID, '', data.xaxis, data.series, data.xunit, data.yunit)
      }
      // this.$service.getStatisticCrowdLife({ rangeType }).then((data) => {
      // })
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '') {
      // const _this = this
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs[element])
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
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            // margin: 2,
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
      const _this = this
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs[element])
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
