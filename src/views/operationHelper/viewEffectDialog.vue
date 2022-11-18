<template>
  <div class="launch-statistics">
    <!-- {{row}} -->
    <div class="statistics-header">
      <div class="date-picker">
        <el-date-picker v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="initChart">
        </el-date-picker>

        <!-- <div class="export-button">
          <a :href="launchedExportUrl" download ref="launchedDownLoad"></a>
          <el-button type="success" @click="handleLaunchedExport">导出数据</el-button>
        </div> -->
      </div>
    </div>
    <!-- {{ rowObj }} -->
    <!-- {{allChartData}} -->
    <div v-if="show">
      <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj" :key="index">
        <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
          <div class="unit-box">
            <div class="unit-header clearfix">{{ chart.title }}</div>
            <div class="unit-content">
              <div v-if="allChartData[key] && allChartData[key].series" :ref="key" :id="key" class="chart-div"></div>
              <div v-else class="chart-div">
                <el-empty description='暂无数据'></el-empty>
              </div>
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
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      colorList: ['#6395f9', '#35c493', '#FD9E06', '#ed49b4', '#834ec2', '#79efc9', '#f9c956', '#75bedc'],
      show: true,
      allCharts: {},
      timeRange: [],
      allChartData: {},
      // pickerOptions: {
      //   disabledDate (time) {
      //     return time.getTime() > Date.now() - 8.64e6
      //   }
      // },
      rowObj: [{ // 图表信息，需要和后端约定好名称
        request: { type: 'line', title: '请求次数趋势', span: 12 },
        requestPvTotal: { type: 'liquidFill', title: '请求统计（PV）', span: 6 },
        requestUvTotal: { type: 'liquidFill', title: '请求统计（UV）', span: 6 }
      }, {
        hit: { type: 'line', title: '命中次数趋势', span: 12 },
        hitPvTotal: { type: 'pie', title: '命中统计（PV）', span: 6 },
        hitUvTotal: { type: 'pie', title: '命中统计（UV）', span: 6 }
      }],
      launchedExportUrl: undefined
    }
  },
  watch: {
    'row.id': {
      handler (val) {
        this.show = false
        this.initRange()
        this.initChart()
        this.$nextTick(() => {
          this.show = true
        })
      },
      immediate: true
    }
  },
  mounted () {
    // 图表自适应
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })
  },
  methods: {
    // 取最小值
    getMin (arr) {
      arr.sort((a, b) => { return a - b })
      return arr[0]
    },
    initRange () {
      // 默认展示实际投放时间范围的 30天，不足 30天 的展示实际天数
      const putTime = this.row.start
      const putTimeEnd = this.row.end || this.$moment().format('YYYY-MM-dd')

      // 时间戳
      const start = +new Date(putTime)
      const range30 = +new Date(putTime) + 3600 * 1000 * 24 * 30
      const now = +new Date()
      const putEnd = +new Date(putTimeEnd)
      let end = 0

      // 取 [30天、投放终止时间]中的最小值
      end = this.getMin([range30, putEnd])
      console.log('111--->', end)

      const startDate = this.formatDate(start)
      const endDate = this.formatDate(end)

      this.timeRange = [startDate, endDate]
    },
    formatDate (d) {
      const time = new Date(d)
      const y = time.getFullYear() // 年份
      const m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
      const r = time.getDate().toString().padStart(2, '0') // 日子
      return `${y}-${m}-${r}`
    },
    initChart () {
      this.allChartData = {}

      const params = {
        taskId: this.row.id,
        start: this.timeRange[0],
        end: this.timeRange[1]
      }
      // const params = {
      //   taskId: 10,
      //   start: '2022-11-15',
      //   end: '2022-11-17'
      // }

      // 获取所有图表数据
      this.$service.getEffect(params).then(res => {
        console.log('res--->', res)

        this.allChartData = {}

        for (const key in res) {
          if (key === 'request') {
            this.allChartData[key] = res[key].data
          } else if (key === 'hitPvTotal' || key === 'hitUvTotal') {
            this.allChartData[key] = {
              series: res[key]
            }
          } else if (key === 'requestPvTotal' || key === 'requestUvTotal') {
            this.allChartData[key] = {
              series: res[key],
              unit: key === 'requestUvTotal' ? '设备量' : '次'
            }
          } else {
            this.allChartData[key] = res[key]
          }
        }
        this.$nextTick(() => {
          const rowObj = this.rowObj
          rowObj.forEach(item => {
            for (const key in item) {
              if (item[key].type === 'line') {
                this.showLine(this.allChartData[key], key)
              } else if (item[key].type === 'pie') {
                this.showPie(this.allChartData[key], key)
              } else {
                this.showLiquidFill(this.allChartData[key], key)
              }
            }
          })
        })
      })
    },

    //  折线图
    showLine (data, chartID) {
      // console.log('showLine======111>>>', ...arguments)
      if (data && data.xaxis) {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          if (data.yunit === '%') {
            const arr = key.value.map(v => v * 100)
            return { name: key.name, data: arr, type: 'line' }
          } else {
            return { name: key.name, data: key.value, type: 'line' }
          }
        })
        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
      }
    },

    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '') {
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      const echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      const myChart = echarts.init(document.getElementById(element))
      const _this = this
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
            // rotate: -45,
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
        color: _this.colorList,
        series: yData
      }, true)
      // console.log('chart===>', myChart)

      this.allCharts[element] = myChart
    },

    //  环形图
    showPie (data, chartID) {
      console.log('showBar======111>>>', data)
      if (data && data.series) {
        const d = data.series.map((v, index) => {
          return {
            ...v,
            value: v.count
          }
        })
        console.log('d==------------------------>', d)
        console.log('d==------------------------>', chartID)

        this.setPie(chartID, d)
      }
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
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center'
          // data: ['CityA', 'CityB', 'CityD', 'CityC', 'CityE']
        },

        color: _this.colorList,
        series: [
          {
            type: 'pie',
            radius: '45%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data,
            // label: {
            //   position: 'inner',
            //   fontSize: 14
            // },
            // label: {
            //   formatter: '{c}',
            //   position: 'inner'
            // },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      const echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      const myChart = echarts.init(chartElement)

      myChart.setOption(option)
      this.allCharts[element] = myChart
    },

    //   水球图
    showLiquidFill (data, chartID) {
      console.log('showBar======111>>>', data)
      // if (data && data.data) {
      //   const d = data.data.map((v, index) => {
      //     return {
      //       ...v,
      //       value: v.count
      //       // name: '123'
      //     }
      //   })
      //   console.log('d==------------------------>', d)
      //   console.log('d==------------------------>', chartID)

      this.setLiquidFill(chartID, data.series, data.unit)
    },
    setLiquidFill (element, data, unit) {
      const chartElement = document.getElementById(element)
      if (!chartElement) return
      const _this = this
      const option = {
        color: _this.colorList,
        series: [{
          type: 'liquidFill',
          radius: '45%',
          itemStyle: {
            normal: {
              color: _this.colorList[0],
              opacity: 0.8,
              shadowColor: _this.colorList[0],
              shadowBlur: 20
            }
          },
          backgroundStyle: {
            shadowColor: 'rgba(255, 255, 255, 0.5)',
            shadowBlur: 20
          },
          data: [{
            value: 0.8,
            waveLength: 100,
            totalData: data
          }],
          // label: {
          //   fontSize: 18,
          //   color: _this.colorList[0],
          //   insideColor: '#ffffff'
          // },
          label: { // 设置百分比展示
            color: '#02CDF6',
            normal: {
              textStyle: {
                fontSize: 16
              },
              formatter: function (param) {
                console.log('param--->', param)
                let str = '累计请求' + '\n\n'
                str = str + _this.cc_format_number(param.data.totalData) + '  ' + unit
                return str
              }
            }
          },

          outline: {
            show: false
          }
        }]
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

<style lang="stylus" scoped>
.launch-statistics
  position: relative;
  height: 100%;
  box-sizing: border-box;
.statistics-header
  position: sticky;
  top: 0;
  z-index: 1
  background: #fff
  padding-bottom 20px
.chart-div
  height: 336px
.export-button
  float: right
.unit-content
  padding 10px 0 0 0
</style>
