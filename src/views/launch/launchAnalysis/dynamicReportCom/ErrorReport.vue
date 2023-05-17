<template>
  <div >

    <!-- {{data}}
    <br/>
    tableData: {{tableData}} -->
    <!-- {{ allTableData }} -->
    <div id="ul111">
      <div class="icon-open-close" @click="changeView">
        <i v-if="showNav" class="el-icon-d-arrow-right"></i>
        <i v-else class="el-icon-d-arrow-left"></i>
      </div>

      <div class="list-wrap" :class="{aaa: !showNav}">
        <div><a href="javascript:void(0)" to="a1" @click="goAnchor('#a1')" title="各业务命中设备量">各业务命中设备量</a></div>
        <div><a href="javascript:void(0)" to="a2" @click="goAnchor('#a2')" title="流转指标中间表">流转指标中间表</a></div>
        <div><a href="javascript:void(0)" to="a3" @click="goAnchor('#a3')" title="各分组命中设备数及占比">各分组命中设备数及占比</a></div>
        <div><a href="javascript:void(0)" to="a4" @click="goAnchor('#a4')" title="各流转链路设备数">各流转链路设备数</a></div>
        <div><a href="javascript:void(0)" to="a5" @click="goAnchor('#a5')" title="分组、基础人群对">分组、基础人群对</a></div>
        <div><a href="javascript:void(0)" to="a6" @click="goAnchor('#a6')" title="子人群产品包对齐">子人群产品包对齐</a></div>
      </div>

    </div>

    <div>
      <!-- <div class="title">crowdId: 12461 【亲子】亲子全量-同步01 - 流转异常监控</div> -->
      <div class="title"> {{ crowdName }} - 流转异常监控</div>
      <div class="export-button">
        <div class="date-picker">
          <el-date-picker
            v-model="time0"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <el-button type="info" @click="handleBackToCrowdList" style="margin-right: 10px;">返回人群列表</el-button>
      </div>

      <div id='a1' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各业务命中设备量 （t2）
            <span>目的：主要看各分组各人群在各业务平台是否命中。查看人群各平台当天是否应该被命中，是否有命中。</span>
          </div>
        </div>
        <c-table
          :props="allTableData.t2.props"
          :header="allTableData.t2.header"
          :data="allTableData.t2.data"
        ></c-table>
      </div>

      <div id='a2' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            流转指标中间表（t5）
            <span>
              <span>目的：查看各人群每天产品包页面曝光及优惠券曝光数据，看看是否有某天数据量级异常</span>
            </span>
          </div>

        </div>
        <!-- {{ rowObj }}
        {{ allChartData }} -->
        <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj" :key="index">
          <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
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

              <div class="unit-content" v-if="chart.title">
                  <!-- {{ allChartData[key] && allChartData[key].series }} -->
                <div v-if="allChartData[key] && ((allChartData[key].series && allChartData[key].series.length > 0) || allChartData[key].data)" :ref="key" :id="key" class="chart-div"></div>
                <div v-else class="chart-div">
                  <el-empty description="暂无数据"></el-empty>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <c-table
          :props="allTableData.t5.props"
          :header="allTableData.t5.header"
          :data="allTableData.t5.data"
        ></c-table>
      </div>

      <div id='a3' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各分组命中设备数及占比（t4）

            <span>
              <span>目的：查看子人群在分组中的占比情况是否正常</span>
            </span>

          </div>

        </div>
        <div style="display: grid; grid-template-columns: 70% minmax(0, 1fr); grid-gap: 20px;">
          <c-table
            :props="allTableData.t4.props"
            :header="allTableData.t4.header"
            :data="allTableData.t4.data"
            @row-click="(row,column,e) => handleRowClicked(row, allTableData.t4.data)"
          ></c-table>

          <template v-if="(allTableData.t4.data && allTableData.t4.data.length > 0)">
            <div class="unit-row" v-for="(row, index) in rowObj2" :key="index">
              <div v-for="(chart, key) in row" :key="key" class="unit-box">
                <div v-if="pieText" class="unit-header clearfix">
                  <span>
                    {{ pieText }} (命中饼图)
                  </span>
                </div>

                <div v-if="chart.title">
                    <!-- {{ allChartData[key] && allChartData[key].series }} -->
                  <div v-if="allChartData2[key] && ((allChartData2[key].series && allChartData2[key].series.length > 0) || allChartData2[key].data)" :ref="key" :id="key" style="height: 300px"></div>
                  <div v-else >
                    <el-empty description="点击左侧表格列，展示所属分组命中饼图"></el-empty>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div id='a4' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各流转链路设备数（t3）
            <span>
              <span>目的：监控各种流转路径是否正常</span>
            </span>

          </div>

        </div>
        <c-table
          :props="allTableData.t3.props"
          :header="allTableData.t3.header"
          :data="allTableData.t3.data"
        ></c-table>

      </div>
      <div id='a5' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            分组、基础人群对齐（t1）
            <span>
              <span>目的：验证各分组人群是否交叉</span>
            </span>

          </div>

        </div>
        <c-table
          :props="allTableData.t1.props"
          :header="allTableData.t1.header"
          :data="allTableData.t1.data"
        ></c-table>
      </div>
      <div id='a6' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            子人群产品包对齐（t6）
            <span>
              <span>目的：验证用户购买的方案价格是否为预想的方案价格</span>
            </span>

          </div>

        </div>
        <c-table
          :props="allTableData.t6.props"
          :header="allTableData.t6.header"
          :data="allTableData.t6.data"

        ></c-table>
      </div>

    </div>
  </div>

</template>

<script>
// import DynamicTable from './dynamicTable/Index.vue'
import AutoHighLightAnchor from '../dynamicTable/autoHighLightAnchor.js'
import { errData } from './errData.js'

export default {
  components: {
    // DynamicTable
  },
  created () {
    console.log('val ---> created', this.$route.query.crowdId)

    // this.initData()
  },
  watch: {
    $route: {
      handler () {
        this.crowdId = this.$route.query.crowdId || ''
        // this.crowdId = 12461
        this.crowdName = this.$route.query.crowdName || ''
        if (this.crowdId !== '') {
          // 初始化数据
          this.initData()
          console.log('2222222222222->>', this.allTableData)
          this.$nextTick(() => {
            console.log('val--->', document.querySelector('.el-main'))
            document.querySelector('.el-main').scrollTop = 0
          })
        }
      },
      immediate: true
    },
    time0 (val) {
      // 初始化数据
      this.initData()
    }
  },
  mounted () {
    this.high()

    // chart5
    // 图表自适应
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })
  },
  methods: {
    handleRowClicked (row, data) {
      console.log(row)
      console.log(data)
      const arr = data.filter(item => item.dt === row.dt && item.dynamicRuleName === row.dynamicRuleName)
      this.pieText = `${row.dt}  ${row.dynamicRuleName}`
      const arrMap = arr.map(item => {
        return {
          name: item.crowdName,
          count: item.dynamicRuleRate
        }
      })
      const data11 = [].concat(arrMap)

      this.allChartData2 = {
        t4: {
          data: data11
        }
      }
      // 图表
      this.$nextTick(() => {
        this.drawChart2()
      })
      console.log('arr===>', this.allChartData2)
    },
    handleBackToCrowdList () {
      // 根据GlobalStrategySource判断是从哪里跳来的
      const source = this.$appState.$get('GlobalStrategySource')
      if (source) {
        this.$router.push({ name: 'myPolicy' })
      } else {
        this.$router.push({ name: 'strategyList' })
      }
    },
    //  导出估算画像数据
    handleDownload () {
      this.downloadUrl = '/api/chart/dynamicCrowdReportDownload?crowdId=' + this.crowdId
      this.$nextTick(() => {
        this.$refs.download_Url.click()
      })
    },
    changeView () {
      this.showNav = !this.showNav
    },

    toPercent (point) {
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },
    goAnchor (selector) {
      // const anchor = this.$el.querySelector(selector)
      // document.documentElement.scrollTop = anchor.offsetTop
      document.querySelector(selector).scrollIntoView({
        behavior: 'smooth'
      })
    },
    high () {
      const high = new AutoHighLightAnchor(document.querySelector('#ul111'), document.querySelector('.el-main'), 'type3')
    },
    initData () {
      // const parmas = {
      //   crowdId: 11223,
      //   startDate: '2022-11-26',
      //   endDate: '2022-11-28'
      // }
      const parmas = {
        crowdId: this.crowdId,
        startDate: this.time0[0],
        endDate: this.time0[1]
      }
      this.$service.dynamicCrowdMonitoring(parmas).then(dataObj => {
      // 假数据
      // const dataObj = errData
      // 处理 dataObj 中的空对象
        const res = {}
        for (const key in dataObj) {
          res[key] = dataObj[key] || []
        }
        // 格式化一些数据： 千分位、百分比
        const getAllData = this.formatData(res)

        // 构建表格所需数据格式 => 构建 allTableData
        this.setTableData(getAllData)

        // 折线图数据
        const vipPlay = this.getChartData(res[5], 'pkgShowUv')
        const vipPlayTrend = this.getChartData(res[5], 'couponShowUv')

        this.allChartData = {
          vipPlay,
          vipPlayTrend
        }
        // 图表
        this.$nextTick(() => {
          this.drawChart()
        })

        // 各分组命中设备数及占比（t4）
        if ((this.allTableData.t4.data && this.allTableData.t4.data.length > 0)) {
          const list0 = this.allTableData.t4.data[0]
          this.handleRowClicked(list0, this.allTableData.t4.data) // 默认选择第一条数据
        }

        // console.log('res.reportDayDetail.data------->', getAllData.reportDayDetail.data)
        // console.log('aaa---->', vipPlay)
      })

      // this.$service.getDynamicCrowdReportB({ crowdId: this.crowdId }).then(res => {
      //   this.setTableData(res)
      // })
    },
    formatData (res) {
      // 1: 分组、基础人群对齐
      // 2: 各业务命中设备量
      // 3: 各流转链路设备数
      // 4: 各分组命中设备数及占比
      // 5: 流转指标中间表
      // 6: 子人群产品包对齐

      const result = JSON.parse(JSON.stringify(res))
      const t1 = res[1] // 每日收益明细
      const t2 = res[2] // 每日收益明细
      const t3 = res[3] // 每日收益明细
      const t4 = res[4] // 每日收益明细
      const t5 = res[5] // 每日收益明细
      const t6 = res[6] // 每日收益明细

      const t1Data = t1.map(item => {
        return {
          ...item
        }
      })

      const t2Data = t2.map(item => {
        return {
          ...item
        }
      })

      const t3Data = t3.map(item => {
        return {
          ...item
        }
      })

      const t4Data = t4.map(item => {
        return {
          ...item
        }
      })
      const t5Data = t5.map(item => {
        return {
          ...item
        }
      })
      const t6Data = t6.map(item => {
        return {
          ...item
        }
      })

      result.t1 = {
        data: t1Data
      }
      result.t2 = {
        data: t2Data
      }
      result.t3 = {
        data: t3Data
      }
      result.t4 = {
        data: t4Data
      }
      result.t5 = {
        data: t5Data
      }
      result.t6 = {
        data: t6Data
      }
      return result
    },

    getChartData (chartData = [], key) {
      const reObj = {
        xaxis: [],
        yunit: '',
        series: [],
        title: '',
        xunit: ''
      }
      const crowdNameList = []
      if (chartData.length > 0) {
        chartData.forEach(item => {
          // 找到所有的日期，没有的就新增，有的就不管
          const flag = reObj.xaxis.find(i => i === item.dt)
          if (!flag) {
            reObj.xaxis.push(item.dt)
          }
          // 找到所有的人群，没有的就新增，有的就不管
          const flag2 = crowdNameList.find(i => i === item.crowdName)
          if (!flag2) {
            crowdNameList.push(item.crowdName)
          }
        })
      }

      console.log('crowdName--->', crowdNameList)
      crowdNameList.forEach(name => {
        const xArr = reObj.xaxis
        const value = []
        xArr.forEach((xValue, index) => {
          const obj = chartData.find(itemObj => itemObj.dt === xValue && itemObj.crowdName === name)
          value[index] = obj[key]
        })

        reObj.series.push({
          name,
          value
        })
      })
      console.log('reObj--->', reObj)
      // const aa = reObj.xaxis.reduce((result, current, index) => {
      //   // 一个日期的 多个人群 的数组
      //   const arr = chartData.filter(obj => obj.dt === current)
      //   // const re = {}
      //   arr.forEach(arrObj => {
      //     const old = result[current] && result[current][arrObj.crowdId] ? result[current][arrObj.crowdId] : {}
      //     const ob = {
      //       [current]: {
      //         [arrObj.crowdId]: {
      //           ...old,
      //           [index]: arrObj[key]
      //         }
      //       }
      //     }
      //     console.log('ob->', ob)
      //     result = Object.assign(result, ob)
      //   })
      //   return result
      // }, {})
      // console.log('reObj-->', aa)
      // reObj.series = chartData.reduce((result, current, index) => {
      //   const oneDateData = current.data

      //   oneDateData.forEach(dayObj => {
      //     const valueNum = dayObj[key]
      //     const flag = result.find(i => i.name === dayObj.crowdId)
      //     if (flag) {
      //       flag.value.push(valueNum)
      //     } else {
      //       result.push({
      //         name: dayObj.crowdId,
      //         value: [valueNum]
      //       })
      //     }
      //   })

      //   return result
      // }, [])

      return reObj
    },
    // echart 图表渲染
    drawChart () {
      const rowObj = this.rowObj
      rowObj.forEach(item => {
        // key 是代表 ref 值
        for (const key in item) {
          if (item[key].type === 'line') {
            this.showLine(this.allChartData[key], key)
          }
        }
      })
    },
    // echart 饼图
    drawChart2 () {
      const rowObj2 = this.rowObj2

      rowObj2.forEach(item => {
        // key 是代表 ref 值
        for (const key in item) {
          if (item[key].type === 'pie') { // 饼图
            this.showPie(this.allChartData2[key], key)
          }
        }
      })
    },
    //  环形图
    showPie (data, chartID) {
      console.log('showBar======111>>>', data)
      if (data && data.data) {
        const d = data.data.map((v, index) => {
          return {
            ...v,
            value: v.count || v.value
            // name: '123'
          }
        })
        // console.log('d==------------------------>', d)
        // console.log('d==------------------------>', chartID)
        this.setPie(chartID, d, data.title)
      }
    },
    // 环形图
    setPie (element, data, title = '') {
      const chartElement = document.getElementById(element)
      if (!chartElement) return
      const _this = this
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        title: {
          text: title
          // subtext: 'Fake Data',
          // left: '5%'
        },
        // legend: {
        //   top: '5%',
        //   left: 'right',
        //   orient: 'vertical'
        // },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        color: _this.colorList,

        series: [
          {
            // name: 'Access From',
            type: 'pie',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            center: ['50%', '40%'],
            radius: '50%',
            data
          }
        ]
      }
      const echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      const myChart = echarts.init(chartElement)

      myChart.setOption(option)
      this.allCharts[element] = myChart
    },
    //  折线图
    showLine (data, chartID) {
      const hasY2 = false
      // console.log('showLine======111>>>', ...arguments)
      if (data && data.xaxis && data.xaxis.length > 0) {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          if (data.yunit === '%') {
            const arr = key.value.map(v => Number(v * 100).toFixed(2))
            return { name: key.name, data: arr, type: 'line' }
          } else {
            return { name: key.name, data: key.value, type: 'line' }
          }
        })

        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit, hasY2)
      }
    },
    setTableData (res) {
      const allData = res

      for (const key in allData) {
        const data = allData[key].data // 单个表格的数据

        if (this.allTableData[key]) {
          this.allTableData[key].data = data
        }
      }
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '', hasY2 = false, yAxisObjName1 = '', yAxisObjName2 = '') {
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
          // trigger: 'item',
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: function (parmas) {
            // let str = parmas[0].marker + parmas[0].name + '<br/>'
            let str = parmas[0].name + '<br/>'
            for (const item of parmas) {
              str = str + item.marker + item.seriesName + ': ' + _this.cc_format_number(item.value) + '<br/>'
            }
            // return _this.cc_format_number(a.data)
            return str
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
      const myChart = echarts.init(document.getElementById(element))
      myChart.setOption(option, true)
      this.allCharts[element] = myChart
    },
    // 重构数据
    restoreData (key, data, mainkey, allData) {
      // const titleArr = allData.title.split(',')
      // console.log('d-------->', titleArr)

      let tableData = []
      let tableConfig = []
      tableData = data.map((item, index) => {
        const reObj = {
          [mainkey]: item[mainkey] // 日期
        }

        const d = item.data // 数据

        for (const itemKey in d) { // itemKey: 0、1、2
          const crowdObj = d[itemKey]
          if (typeof crowdObj === 'object') { // 动态人群
            for (const itemKey2 in crowdObj) { // itemKey2: name、 show、payRate、price
              reObj[`${crowdObj.planName}${itemKey2}`] = crowdObj[itemKey2] // 根据名称(planName) 和 属性名确定唯一值

              // if (index === 0) { // 通过第一条数据，构建header
              console.log('this.allTableData[key]--->', key)
              console.log('this.allTableData[key]--->', this.allTableData[key])
              tableConfig = this.allTableData[key].tableConfig.map(header => {
                if (header.prop === itemKey2) {
                  // console.log('itemKey2-------->', itemKey2)
                  // console.log('header.children-------->', header.children)
                  const propName = `${crowdObj.planName}${itemKey2}`

                  const a = header.children.filter(y => y.prop === propName) || []
                  if (a && a.length === 0) {
                    header.children.push({
                      label: crowdObj.planName,
                      prop: propName
                    })
                  }
                }
                return header
              })
              // }
            }
          }
        }
        return reObj
      })

      return {
        tableData,
        tableConfig
      }
    }
  },
  data () {
    return {
      pieText: '',
      time0: [],
      downloadUrl: undefined,
      options: [{
        value: 6,
        label: '故事线'
      }, {
        value: 0,
        label: '顺序'
      }, {
        value: 1,
        label: '循环'
      }, {
        value: 2,
        label: '随机'
      }, {
        value: 3,
        label: '自定义'
      }, {
        value: 4,
        label: '不流转'
      }, {
        value: 5,
        label: '智能'
      }],
      allTableData: {
        t2: {
          header: [{
            label: '日期',
            prop: 'dt'
          }, {
            label: '子人群',
            prop: 'crowdName'
          }, {
            label: '分组',
            prop: 'dynamicRuleName'
          }, {
            label: '业务平台',
            prop: 'bidName'
          }, {
            label: '命中设备量',
            prop: 'uv',
            render: (h, { row }) => {
              return this.cc_format_number(row.uv)
            }
          }],
          data: []
        },

        t4: { // 各分组命中设备数及占比
          header: [{
            label: '日期',
            prop: 'dt'
          }, {
            label: '子人群',
            prop: 'crowdName'
          }, {
            label: '分组',
            prop: 'dynamicRuleName'
          }, {
            label: '命中设备量',
            prop: 'uv',
            render: (h, { row }) => {
              return this.cc_format_number(row.uv)
            }
          }, {
            label: '分组总命中设备量',
            prop: 'totalUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.totalUv)
            }
          }, {
            label: '占比',
            prop: 'dynamicRuleRate',
            render: (h, { row }) => {
              return this.toPercent(row.dynamicRuleRate)
            }
          }],
          data: []
        },
        t5: { // 流转指标中间表
          header: [{
            label: '日期',
            prop: 'dt'
          }, {
            label: '子人群',
            prop: 'crowdName'
          }, {
            label: '产品包曝光',
            prop: 'pkgShowUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.pkgShowUv)
            }
          }, {
            label: '优惠券曝光',
            prop: 'couponShowUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.couponShowUv)
            }
          }],
          data: []
        },
        t3: { // 各流转链路设备数
          header: [{
            label: '开始日期',
            prop: 'startDate'
          }, {
            label: '结束日期',
            prop: 'endDate'
          }, {
            label: '分组',
            prop: 'dynamicRuleName'
          }, {
            label: '流转路径',
            prop: 'pkgShowPath'
          }, {
            label: '产品包曝光设备量',
            prop: 'totalUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.pkgShowUv)
            }
          }],
          data: []
        },
        t1: { // 分组、基础人群对齐
          header: [{
            label: '开始日期',
            prop: 'startDate'
          }, {
            label: '结束日期',
            prop: 'endDate'
          }, {
            label: '分组',
            prop: 'dynamicRuleName'
          }, {
            label: '命中设备量',
            prop: 'showMac',
            render: (h, { row }) => {
              return this.cc_format_number(row.dynamicRuleHitUv)
            }
          }, {
            label: '各组命中设备总量',
            prop: 'totalHitUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.totalHitUv)
            }
          }, {
            label: '基础人群命中设备量',
            prop: 'distinctTotalHitUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.distinctTotalHitUv)
            }
          }, {
            label: '是否正确',
            prop: 'flag'
          }],
          data: []
        },
        t6: { // 子人群产品包对齐
          props: {
            'max-height': '570px'
          },
          header: [{
            label: '开始日期',
            prop: 'dt'
          }, {
            label: '子人群',
            prop: 'crowdName'
          }, {
            label: '权益名称',
            prop: 'sourceName'
          }, {
            label: '价格',
            prop: 'price',
            render: (h, { row }) => {
              return this.cc_format_number(row.price)
            }
          }, {
            label: '产品包类型',
            prop: 'productType'
          }, {
            label: '成交单量',
            prop: 'payNum',
            render: (h, { row }) => {
              return this.cc_format_number(row.payNum)
            }
          }, {
            label: '成交设备量',
            prop: 'payUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.payUv)
            }
          }],
          data: []
        }

      },

      getAllData: [],
      allChartData: {}, // allChartData 和 rowObj 中的 key 值需要一一对应
      rowObj: [
        {
          vipPlay: { type: 'line', title: '产品包曝光折线图', span: 12 },
          vipPlayTrend: { type: 'line', title: '优惠券曝光折线图', span: 12 }
        }
      ],
      rowObj2: [{
        t4: { type: 'pie', title: '饼图', span: 12 }
      }],
      allChartData2: {},
      allCharts: {},
      colorList: ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],
      showNav: true,
      crowdName: '',
      crowdId: ''
    }
  }
}
</script>

<style scoped lang="stylus">
  .title{
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    color: #1f2d3d;
    margin-bottom: 16px;
    text-align: center;
  }
  .per-index-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2d3d;
    line-height: 28px;
    margin: 0;
    display: flex;
    align-items: baseline;
  }
  .table-wrap {
    padding: 10px 0;
    // border: 1px dashed #ebe9e9;
    margin-bottom: 10px;
  }
  .title-layout {
    margin: 24px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin-left: 8px;
      font-size: 12px;
      font-weight: 400;
      color: #778ca2;
      line-height: 17px;
    }
  }
  #ul111 {
    // width: 220px;
    padding: 10px
    display: flex;
    align-items: center
    // flex-direction: column;
    // list-style: none;
    position: fixed;
    top: 55%;
    right: 0;
    z-index: 99;
    // background: #ffffffa3;
    color #000
    div {
      margin-bottom 5px
    }
    a {
      text-decoration: none;
      color: #646a73
      font-size: 14px;
      white-space nowrap
    }
    .highLight {
      color: #3370ff;
    }
  }
  .icon-open-close{
    left: -27px;
    border-right: 0;
    border-radius: 8px 0 0 8px;
    // position: absolute;
    // top: 50%;
    padding: 30px 3px;
    z-index: 10;
    border: 1px solid #ddd;
    border-right: 0px
    background: #ffffffa3;
    cursor: pointer;
    border-right: 1px solid #fff;
  }
  .list-wrap {
    background: #ffffffa3;
    transition: all 0.5s
    box-sizing: border-box;
    overflow: hidden;
    width 165px
    padding-left 5px
    border-left: 1px solid #e4e7ed;
  }
  .chart-div {
    height: 436px
  }
  .aaa {
    width: 20px;
    // height: 201px;
  }
  .export-button
    display flex
    justify-content space-between
</style>
