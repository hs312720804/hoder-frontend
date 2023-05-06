<template>
  <div >

    <!-- {{data}}
    <br/>
    tableData: {{tableData}} -->

    <!-- <div id="ul111">
      <div class="icon-open-close" @click="changeView">
        <i v-if="showNav" class="el-icon-d-arrow-right"></i>
        <i v-else class="el-icon-d-arrow-left"></i>
      </div>

      <div class="list-wrap" :class="{aaa: !showNav}">
        <div><a href="javascript:void(0)" to="a1" @click="goAnchor('#a1')" title="实验分组概览">实验分组概览</a></div>
        <div><a href="javascript:void(0)" to="a2" @click="goAnchor('#a2')" title="实验效果汇总">实验效果汇总</a></div>
        <div><a href="javascript:void(0)" to="a3" @click="goAnchor('#a3')" title="每日收益趋势">每日收益趋势</a></div>
        <div><a href="javascript:void(0)" to="a4" @click="goAnchor('#a4')" title="每日效果明细">每日效果明细</a></div>
        <div><a href="javascript:void(0)" to="a5" @click="goAnchor('#a5')" title="累计效果明细">累计效果明细</a></div>
        <div><a href="javascript:void(0)" to="a6" @click="goAnchor('#a6')" title="分组内各子人群收益明细">分组内各子人群收益明细</a></div>
        <div><a href="javascript:void(0)" to="a7" @click="goAnchor('#a7')" title="分组内各流转链路收益">分组内各流转链路收益</a></div>
        <div><a href="javascript:void(0)" to="a8" @click="goAnchor('#a8')" title="TOP10影片分析">各权益收益情况</a></div>
      </div>

    </div> -->
    <div>
      <!-- <div class="title">crowdId: 12461 【亲子】亲子全量-同步01 - 动态实验报告</div> -->
      <div class="title"> {{ crowdName }} - 动态实验报告</div>

      <div class="export-button">
        <el-radio-group v-model="pageRadio" @change="handleRadioChange" style="margin-right: 80px; margin-top: 10px;">
          <el-radio :label="0">产品包</el-radio>
          <el-radio :label="1">内容运营</el-radio>
        </el-radio-group>
        <el-button type="info" @click="handleBackTo" style="margin-right: 10px;">返回故事运营</el-button>
        <a :href="downloadUrl" download ref="download_Url"></a>
        <el-button type="success" @click="handleDownload">导出数据</el-button>
      </div>
      <div id='a1' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            实验分组概览 （reportTotal）
            <!-- <span>共 0 个</span> -->
          </div>
        </div>
        <c-table
          :props="allTableData.reportTotal.props"
          :header="allTableData.reportTotal.header"
          :data="allTableData.reportTotal.data"
        ></c-table>
      </div>

      <div id='a2' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            实验效果汇总（experimentSummary）
            <span>目的：①了解各组动态人群整体汇总情况</span>
            <span>②通过CTR、点击起播率、起播付费率等目标指标差异对比，概括性分析本次实验效果情况</span>
          </div>
        </div>
        <c-table
          :props="allTableData.experimentSummary.props"
          :header="allTableData.experimentSummary.header"
          :data="allTableData.experimentSummary.data"
        ></c-table>
      </div>

      <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj2" :key="index">
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

      <div id='a4' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            每日效果明细（everyDayDetail）
            <!-- <span>共 0 个</span> -->
          </div>
        </div>
        <!-- {{ allTableData.everyDayDetail }} -->
        <dynamic-table
          :table-data="allTableData.everyDayDetail.data"
          :table-header="allTableData.everyDayDetail.tableConfig"
        ></dynamic-table>
      </div>

      <div id='a5' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            累计效果明细（totalDetail）
            <span>目的：针对累计数据情况，查看各组动态人群转化效果 </span>
          </div>
        </div>
        <dynamic-table
          :table-data="allTableData.totalDetail.data"
          :table-header="allTableData.totalDetail.tableConfig"
        ></dynamic-table>
      </div>

      <div id='a6' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            分组内各子人群收益明细（crowdIncomeDetail）
            <span>
              <span>目的：以各动态人群子人群情况分析，了解各组动态人群子人群方案情况，拆分下钻各组动态人群效果差异原因。</span>
            </span>
          </div>
        </div>
        <c-table
          :data="allTableData.crowdIncomeDetail.data"
          :header="allTableData.crowdIncomeDetail.header"
        ></c-table>
      </div>

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

      <div id='a7' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            分组内各流转链路收益（linkIncomeDetail）

          </div>

        </div>
        <c-table
          :header="allTableData.linkIncomeDetail.header"
          :data="allTableData.linkIncomeDetail.data"
        ></c-table>
      </div>

      <div id='a8' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            TOP10影片分析（top10FilmAnalyze）
          </div>
        </div>
        <c-table
          :header="allTableData.top10FilmAnalyze.header"
          :data="allTableData.top10FilmAnalyze.data"
        ></c-table>
      </div>
    </div>
  </div>

</template>

<script>
import DynamicTable from '../dynamicTable/Index.vue'
import { crowdData } from './crowdData2.js'
import { setBarEchart } from './chart/bar.js'
// import AutoHighLightAnchor from '../dynamicTable/autoHighLightAnchor.js'

export default {
  components: {
    DynamicTable
  },
  created () {
    console.log('val ---> created', this.$route.query.crowdId)
  },
  watch: {
    $route: {
      handler () {
        this.crowdId = this.$route.query.id || ''
        // this.crowdId = 12461
        this.crowdName = this.$route.query.sceneName || ''
        this.pageType = this.$route.query.type || ''
        if (this.crowdId !== '') {
          this.initData()
          this.$nextTick(() => {
            console.log('val--->', document.querySelector('.el-main'))
            document.querySelector('.el-main').scrollTop = 0
          })
        }
      },
      immediate: true
    }
  },
  mounted () {
    // this.high() // 锚点侧边栏

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
    handleRadioChange (val) {
      console.log('1=================>', val)
      const type = this.pageType
      // 人群
      if (val === 0) {
        const crowdId = this.crowdId
        const crowdName = this.crowdName
        this.$router.push({ path: '/dynamicReport', query: { crowdId, crowdName, type } })
      } else if (val === 1) {
        const componentName = 'storyReport'
        const id = this.crowdId
        const sceneName = this.crowdName
        this.$router.push({ path: '/dynamicReport', query: { id, sceneName, componentName, type } })
      }
    },
    handleBackTo () {
      // 根据GlobalStrategySource判断是从哪里跳来的
      // const source = this.$appState.$get('GlobalStrategySource')
      // console.log('source--->', source)
      // if (source) {
      //   this.$router.push({ name: 'myPolicy' })
      // } else {
      // }
      this.$router.push({ name: 'storyLine' })
    },
    //  导出
    handleDownload () {
      if (this.pageType === 'story') {
        this.downloadUrl = '/api/chart/downloadContentDynamicCrowdReport?sceneId=' + this.crowdId
      } else {
        this.downloadUrl = '/api/chart/downloadContentDynamicCrowdReport?crowdId=' + this.crowdId
      }
      this.$nextTick(() => {
        this.$refs.download_Url.click()
      })
    },
    changeView () {
      this.showNav = !this.showNav
    },
    // highLightAnchor (id) {
    //   this.anchors.forEach(element => {
    //     element.classList.remove('highLight')
    //     if (element.hash.slice(1) == id) {
    //       element.classList.add('highLight')
    //     }
    //   })
    // },
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
    // high () {
    //   const high = new AutoHighLightAnchor(document.querySelector('#ul111'), document.querySelector('.el-main'), 'type3')
    // },
    initData () {
      let params = {}
      if (this.pageType === 'story') {
        params = { sceneId: this.crowdId }
      } else {
        params = { crowdId: this.crowdId }
      }
      // this.$service.getContentDynamicCrowdReport(params).then(res => {
      const res = crowdData

      const getAllData = this.formatData(res) // 格式化一些数据： 千分位、百分比

      // 表格
      this.setTableData(getAllData)
      // 图表
      this.setChartData(res)
      // })
    },
    setChartData (res) {
      // 柱状图数据
      const ctr = this.getChartData2(res.crowdIncomeDetail.data, 'ctr')
      const clickPlayRate = this.getChartData2(res.crowdIncomeDetail.data, 'clickPlayRate')
      const payRate = this.getChartData2(res.crowdIncomeDetail.data, 'payRate')
      // 折线图数据
      const everyDayDetailCtr = this.getChartData(res.everyDayDetail.data, 'ctr')
      const everyDayDetailClickPlayRate = this.getChartData(res.everyDayDetail.data, 'clickPlayRate')

      // console.log('vipPlay---->', vipPlay)
      // console.log('vipPlayTrend---->', vipPlayTrend)
      // console.log('reportGroupSumArup---->', reportGroupSumArup)
      // console.log('reportGroupSumPriceTotal---->', reportGroupSumPriceTotal)

      this.allChartData = {
        ctr,
        clickPlayRate,
        payRate,
        everyDayDetailCtr,
        everyDayDetailClickPlayRate
      }

      this.$nextTick(() => {
        this.drawChart(this.rowObj)
        this.drawChart(this.rowObj2)
      })
    },
    formatData (res) {
      const result = JSON.parse(JSON.stringify(res))
      const everyDayDetail = res.everyDayDetail.data // 每日效果明细
      const totalDetail = res.totalDetail.data // 每日效果明细

      const reportDayDetailReData = everyDayDetail.map(item => {
        const obj = {
          date: item.date
        }
        obj.data = item.data.map(obj => {
          return {
            ...obj,
            showUv: this.cc_format_number(obj.showUv),
            ctr: this.toPercent(obj.ctr),
            clickPlayRate: this.toPercent(obj.clickPlayRate),
            playRate: this.toPercent(obj.playRate),
            payRate: this.toPercent(obj.payRate)
          }
        })
        return obj
      })
      const totalDetailReData = totalDetail.map(item => {
        const obj = {
          date: item.date
        }
        obj.data = item.data.map(obj => {
          return {
            ...obj,
            showUv: this.cc_format_number(obj.showUv),
            ctr: this.toPercent(obj.ctr),
            clickPlayRate: this.toPercent(obj.clickPlayRate),
            playRate: this.toPercent(obj.playRate),
            payRate: this.toPercent(obj.payRate)
          }
        })
        return obj
      })

      result.everyDayDetail = {
        name: res.everyDayDetail.name,
        data: reportDayDetailReData,
        title: res.everyDayDetail.title
      }

      result.totalDetail = {
        name: res.totalDetail.name,
        data: totalDetailReData,
        title: res.totalDetail.title
      }

      return result
    },
    getChartData (chartData, key) {
      const reObj = {
        xaxis: [],
        yunit: '',
        series: [],
        title: '',
        xunit: ''
      }
      const seriesNameKey = 'dynamicName'
      if (key === 'payRate' || key === 'ctr' || key === 'clickPlayRate') { // 支付率/ctr，数据转为百分比
        reObj.yunit = '%'
      }
      reObj.series = chartData.reduce((result, current, index) => {
        reObj.xaxis.push(current.date)
        const oneDateData = current.data
        oneDateData.forEach(dayObj => {
          const valueNum = dayObj[key]
          const flag = result.find(i => i.name === dayObj[seriesNameKey])
          if (flag) {
            flag.value.push(valueNum)
          } else {
            result.push({
              name: dayObj[seriesNameKey],
              value: [valueNum]
            })
          }
        })

        return result
      }, [])

      return reObj
    },
    getChartData2 (chartData, key) {
      const reObj = {
        xaxis: [],
        yunit: '',
        series: [],
        title: '',
        xunit: ''
      }
      if (key === 'payRate' || key === 'ctr') { // 支付率/ctr，数据转为百分比
        reObj.yunit = '%'
      }
      // const
      chartData.forEach((item, index) => {
        reObj.xaxis.push(`${item.dynamicName}-${item.crowdId}`)
        const valueNum = item[key]
        reObj.series.push(valueNum)
      })

      // return result
      // })

      return reObj
    },
    // echart 图表渲染
    drawChart (rowObj) {
      rowObj.forEach(item => {
        // key 是代表 ref 值
        for (const key in item) {
          if (item[key].type === 'line') {
            this.showLine(this.allChartData[key], key)
          } else if (item[key].type === 'bar') {
            this.showBar(this.allChartData[key], key)
          }
        }
      })
    },
    //  柱状图
    showBar (data, chartID) {
      if (data && data.xaxis && data.xaxis.length > 0) {
        if (data.yunit === '%') {
          data.series = data.series.map(v => Number(v * 100).toFixed(2))
        }
        const element = chartID
        // console.log('23333=========>', data)
        const chartElement = document.getElementById(element)
        if (!chartElement) return
        const options = setBarEchart('', data.xaxis, data.series, data.xunit, data.yunit, data.dataaxis)
        const echarts = require('echarts')
        const myChart = echarts.init(chartElement)
        myChart.setOption(options, true)
        this.allCharts[element] = myChart
      }
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
        // if (data.series2) {
        //   hasY2 = true
        //   const series2 = data.series2 || []
        //   const legendData2 = series2.map((key) => {
        //     return key.name
        //   })
        //   const linesData2 = series2.map((key) => {
        //     if (data.yunit === '%') {
        //       const arr = key.value.map(v => v * 100)
        //       return { name: key.name, data: arr, type: 'line', yAxisIndex: 1 }
        //     } else {
        //       return { name: key.name, data: key.value, type: 'line', yAxisIndex: 1 }
        //     }
        //   })
        //   legendData = legendData.concat(legendData2)
        //   linesData = linesData.concat(linesData2)
        //   console.log('legendData===', legendData)
        //   console.log('linesData===', linesData)
        // }

        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit, hasY2)
      }
    },
    setTableData (res) {
      // // 实验分组概览
      // this.table1.data = d.reportTotal.data
      // // 实验效果汇总
      // this.table2.data = d.reportTotal.data

      const d = res

      for (const key in d) {
        const allData = res[key]

        const data = d[key].data || [] // 单个表格的数据
        if (key === 'everyDayDetail' || key === 'totalDetail') {
          const mainkey = 'date'

          const reutrnData = this.restoreData(key, data, mainkey, allData)

          this.allTableData[key].data = reutrnData.tableData
          this.allTableData[key].tableConfig = reutrnData.tableConfig

          // console.log('this.allTableData.everyDayDetail-------->', this.allTableData.totalDetail)
        } else if (this.allTableData[key]) {
          this.allTableData[key].data = data
        }
      }

      console.log('allTableData-->', this.allTableData)
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '', hasY2 = false, yAxisObjName1 = '', yAxisObjName2 = '') {
      // console.log('yData--------->', yData)
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
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
              str = str + item.marker + item.seriesName + ': ' + _this.cc_format_number(item.value) + yunit + '<br/>'
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
      pageType: '',
      pageRadio: 1,
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
        reportTotal: {
          header: [{
            label: '流转ID',
            prop: 'dynamicRuleId'
          }, {
            label: '流转分组名',
            prop: 'dynamicName'
          },
          {
            label: '流转方式',
            prop: 'dynamicType'
          },
          {
            label: '命中流量占比',
            prop: 'dynamicHitRate',
            render: (h, { row }) => {
              return (row.dynamicHitRate) + '%'
            }
          },
          {
            label: '包含接待员-ID',
            prop: 'cname'
          }],
          data: []
        },
        experimentSummary: {
          header: [{
            label: '流转ID',
            prop: 'dynamicRuleId'
          }, {
            label: '流转分组名',
            prop: 'dynamicName'
          }, {
            label: '流转方式',
            prop: 'dynamicType'
          }, {
            label: '命中流量占比',
            // prop: 'dynamicHitRate',
            render: (h, { row }) => {
              return this.toPercent(row.dynamicHitRate)
            }
          }, {
            label: '命中设备量',
            prop: 'hitAmount',
            render: (h, { row }) => {
              return this.cc_format_number(row.hitAmount)
            }
          }, {
            label: '活跃用户（曝光）',
            prop: 'showUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.showUv)
            }
          }, {
            label: '点击用户',
            prop: 'clickUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.clickUv)
            }
          }, {
            label: 'CTR',
            prop: 'ctr',
            render: (h, { row }) => {
              return this.toPercent(row.ctr)
            }
          }, {
            label: '差异对比',
            prop: 'ctrDifference',
            render: (h, { row }) => {
              return this.toPercent(row.ctrDifference)
            }
          }, {
            // label: '总营收（按比例转化后）',
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '起播用户量',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 40,
                    content: '对应版块/版面/资源位的起播'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'playUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.playUv)
            }
          },

          {
            label: '点击起播率（起播用户数/板块点击用户）',
            prop: 'clickPlayRate',
            // width: 90,
            render: (h, { row }) => {
              return this.toPercent(row.clickPlayRate)
            }
          }, {
            label: '差异对比',
            prop: 'clickPlayRateDifference',
            render: (h, { row }) => {
              return this.toPercent(row.clickPlayRateDifference)
            }
          }, {
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '付费用户量',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 30,
                    content: '对应影片的付费'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'payUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.payUv)
            }
          }, {
            label: '起播付费率',
            prop: 'payRate',
            render: (h, { row }) => {
              return this.toPercent(row.payRate)
            }
          },
          {
            label: '差异对比',
            prop: 'payRateDifference',
            render: (h, { row }) => {
              return this.toPercent(row.payRateDifference)
            }
          }, {
            label: '上架天数',
            prop: 'onlineDay'
          }],
          data: []
        },
        everyDayDetail: { // 每日效果明细
          tableConfig: [ // 表头配置项
            {
              id: 1,
              label: '日期',
              prop: 'date'
            },
            {
              id: 2,
              label: '活跃用户',
              prop: 'showUv',
              children: []
            },
            {
              id: 3,
              label: 'CTR',
              prop: 'ctr',
              children: []
            },
            {
              id: 4,
              label: '点击起播率',
              prop: 'clickPlayRate',
              children: []
            },
            {
              id: 5,
              label: '起播率',
              prop: 'playRate',
              children: []
            },
            {
              id: 6,
              label: '起播付费率',
              prop: 'payRate',
              children: []
            }
          ],
          data: []
        },
        totalDetail: { // 累计效果明细
          tableConfig: [ // 表头配置项
            {
              id: 1,
              label: '日期',
              prop: 'date'
            },
            {
              id: 2,
              label: '活跃用户',
              prop: 'showUv',
              children: []
            },
            {
              id: 3,
              label: 'CTR',
              prop: 'ctr',
              children: []
            },
            {
              id: 4,
              label: '点击起播率',
              prop: 'clickPlayRate',
              children: []
            },
            {
              id: 5,
              label: '起播率',
              prop: 'playRate',
              children: []
            },
            {
              id: 6,
              label: '起播付费率',
              prop: 'payRate',
              children: []
            }
          ],
          data: []
        },
        crowdIncomeDetail: { // 分组内各子人群收益明细
          header: [{
            id: 1,
            label: '流转分组名',
            prop: 'dynamicName'
          }, {
            id: 2,
            label: '流转方式',
            prop: 'dynamicType'
          }, {
            id: 3,
            label: '人群ID',
            prop: 'crowdId'
          }, {
            label: '命中设备量',
            prop: 'hitAmount'
          }, {
            label: '板块活跃用户数',
            prop: 'showUv'
          }, {
            label: 'CTR',
            prop: 'ctr',
            render: (h, { row }) => {
              return this.toPercent(row.ctr)
            }
          }, {
            label: '起播用户数',
            prop: 'playUv'
          }, {
            label: '点击起播率',
            prop: 'clickPlayRate',
            render: (h, { row }) => {
              return this.toPercent(row.clickPlayRate)
            }
          }, {
            label: '影片付费用户数',
            prop: 'payUv'
          }, {
            label: '影片总营收(元)',
            prop: 'price'
          }, {
            label: '起播付费率',
            prop: 'payRate',
            render: (h, { row }) => {
              return this.toPercent(row.payRate)
            }
          }, {
            label: '影片吸金订单量',
            prop: 'videoOrderNum'

          }, {
            label: '影片订单转化率',
            prop: 'videoOrderRatio',
            render: (h, { row }) => {
              return this.toPercent(row.videoOrderRatio)
            }
          }, {
            label: '影片订单均价',
            prop: 'videoRerOrder'
          }, {
            label: '影片播放均价',
            prop: 'videoAvgPlayPrice'
          }],
          data: []
        },
        top10FilmAnalyze: { // 各权益收益情况
          header: [ // 表头配置项
            {
              label: '流转分组名',
              prop: 'dynamicName'
            }, {
              label: '影片名称',
              prop: 'blockName'
            }, {
              label: '点击人数',
              prop: 'clickUv'
            }, {
              label: 'CTR',
              prop: 'ctr',
              render: (h, { row }) => {
                return this.toPercent(row.ctr)
              }
            }, {
              label: '点击起播率',
              prop: 'clickPlayRate',
              render: (h, { row }) => {
                return this.toPercent(row.clickPlayRate)
              }
            }, {
              label: '起播付费率',
              prop: 'payRate',
              render: (h, { row }) => {
                return this.toPercent(row.payRate)
              }
            }, {
              label: '点击人数排名',
              prop: 'clickRank'
            }
          ],
          data: []
        },
        linkIncomeDetail: { // 分组内各流转链路收益
          header: [{
            label: '动态流转分组',
            prop: 'dynamicName'
          }, {
            label: '路径',
            prop: 'path'
          }, {
            label: '命中用户数',
            prop: 'hitUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.hitUv)
            }
          }, {
            label: '曝光用户数',
            prop: 'showUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.showUv)
            }
          }, {
            label: '点击用户数',
            prop: 'clickUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.clickUv)
            }
          }, {
            label: 'CTR',
            prop: 'ctr',
            render: (h, { row }) => {
              return this.toPercent(row.ctr)
            }
          }, {
            label: '起播用户数',
            prop: 'playUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.playUv)
            }
          }, {
            label: '点击起播率',
            prop: 'clickPlayRate',
            render: (h, { row }) => {
              return this.toPercent(row.clickPlayRate)
            }
          }, {
            label: '影片付费用户数',
            prop: 'payUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.payUv)
            }
          }, {
            label: '影片总营收',
            prop: 'price',
            render: (h, { row }) => {
              return this.cc_format_number(row.price)
            }
          }, {
            label: '起播付费率',
            prop: 'payRate',
            render: (h, { row }) => {
              return this.toPercent(row.payRate)
            }
          }],
          data: []
        }
      },

      getAllData: [],
      allChartData: {},
      rowObj: [
        {
          ctr: { type: 'bar', title: '分组内各子人群（接待员）CTR对比', span: 8 },
          clickPlayRate: { type: 'bar', title: '分组内各子人群（接待员）点击起播率对比', span: 8 },
          payRate: { type: 'bar', title: '分组内各子人群（接待员）起播付费率对比', span: 8 }
        }
      ],
      rowObj2: [
        {
          everyDayDetailCtr: { type: 'line', title: '各分组每日CTR趋势', span: 12 },
          everyDayDetailClickPlayRate: { type: 'line', title: '各分组每日点击起播率', span: 12 }
        }
      ],
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

  .chart-div{
    height: 436px
  }
  .export-button
    display flex
    justify-content flex-end
</style>
