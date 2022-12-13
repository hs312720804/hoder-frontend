<template>
  <div >

    <!-- {{data}}
    <br/>
    tableData: {{tableData}} -->

    <div>
      <!-- <div class="title">crowdId: 12461 【亲子】亲子全量-同步01 - 流转异常监控</div> -->
      <div class="title"> {{ crowdName }} - 流转异常监控</div>

      <div class="export-button">
        <el-button type="info" @click="handleBackToCrowdList" style="margin-right: 10px;">返回人群列表</el-button>
      </div>

      <div id='a2' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各业务命中设备量
            <span>目的：主要看各分组各人群在各业务平台是否命中。查看人群各平台当天是否应该被命中，是否有命中。</span>
          </div>
        </div>
        <c-table
          :props="allTableData.reportTotal.props"
          :header="allTableData.reportTotal.header"
          :data="allTableData.reportTotal.data"
        ></c-table>
      </div>

      <div id='a3' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            流转指标中间表
            <span>
              <span>目的：查看各人群每天产品包页面曝光及优惠券曝光数据，看看是否有某天数据量级异常</span>
            </span>
          </div>

        </div>
        <!-- {{ rowObj2 }}
        {{ allChartData }} -->
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

      </div>

      <div id='a7' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各分组命中设备数及占比

            <span>
              <span>目的：查看子人群在分组中的占比情况是否正常</span>
            </span>

          </div>

        </div>
        <c-table
          :props="allTableData.reportTotal.props"
          :header="allTableData.reportTotal.header"
          :data="allTableData.reportTotal.data"
        ></c-table>
      </div>

      <div id='a8' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各流转链路设备数
            <span>
              <span>目的：监控各种流转路径是否正常</span>
            </span>

          </div>

        </div>
        <c-table
          :props="allTableData.reportTotal.props"
          :header="allTableData.reportTotal.header"
          :data="allTableData.reportTotal.data"
        ></c-table>
      </div>

    </div>
  </div>

</template>

<script>
// import DynamicTable from './dynamicTable/Index.vue'
// import AutoHighLightAnchor from './dynamicTable/autoHighLightAnchor.js'

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
    // this.high()

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
    // high () {
    //   const high = new AutoHighLightAnchor(document.querySelector('#ul111'), document.querySelector('.el-main'), 'type3')
    // },
    initData () {
      this.$service.getDynamicCrowdReportA({ crowdId: this.crowdId }).then(res => {
        const getAllData = this.formatData(res) // 格式化一些数据： 千分位、百分比

        // 表格
        this.setTableData(getAllData)

        // 折线图数据
        const vipPlay = this.getChartData(res.reportDayDetail.data, 'payRate')
        const vipPlayTrend = this.getChartData(res.reportDayDetail.data, 'arup')

        console.log('res.reportDayDetail.data------->', getAllData.reportDayDetail.data)
        console.log('aaa---->', vipPlay)
        this.allChartData = {
          vipPlay,
          vipPlayTrend
        }

        this.$nextTick(() => {
          this.drawChart()
        })
      })

      // this.$service.getDynamicCrowdReportB({ crowdId: this.crowdId }).then(res => {
      //   this.setTableData(res)
      // })
    },
    formatData (res) {
      const result = JSON.parse(JSON.stringify(res))
      const reportDayDetail = res.reportDayDetail.data // 每日收益明细
      const reportSum = res.reportSum.data // 每日收益明细
      const reportGroupSum = res.reportGroupSum.data // 每日收益明细
      const reportRights = res.reportRights.data // 每日收益明细

      const reportDayDetailReData = reportDayDetail.map(item => {
        const obj = {
          date: item.date
        }
        obj.data = item.data.map(obj => {
          return {
            ...obj,
            arup: this.cc_format_number(obj.arup),
            priceTotalHitRate: this.cc_format_number(obj.priceTotalHitRate),
            payRate: this.toPercent(obj.payRate),
            priceTotal: this.cc_format_number(obj.priceTotal),
            showMac: this.cc_format_number(obj.showMac)
          }
        })
        return obj
      })

      const reportSumReData = reportSum.map(item => {
        const obj = {
          day: item.day
        }
        obj.data = item.data.map(obj => {
          return {
            ...obj,
            arup: this.cc_format_number(obj.arup),
            priceTotalHitRate: this.cc_format_number(obj.priceTotalHitRate),
            payRate: this.toPercent(obj.payRate),
            priceTotal: this.cc_format_number(obj.priceTotal),
            showMac: this.cc_format_number(obj.showMac)
          }
        })
        return obj
      })

      const reportGroupSumReData = reportGroupSum.map(obj => {
        return {
          ...obj,
          arup: this.cc_format_number(obj.arup),
          putongbaoyuePayPrice: this.cc_format_number(obj.putongbaoyuePayPrice),
          baonianPayMacRate: this.toPercent(obj.baonianPayMacRate),
          liaoxubaoyuePayMacRate: this.toPercent(obj.liaoxubaoyuePayMacRate),
          payRate: this.toPercent(obj.payRate),
          liaoxubaojiPayMacRate: this.toPercent(obj.liaoxubaojiPayMacRate),
          liaoxubaoyuePayPrice: this.cc_format_number(obj.liaoxubaoyuePayPrice),
          showMac: this.cc_format_number(obj.showMac),
          payMac: this.cc_format_number(obj.payMac),
          putongbaoyuePayMacRate: this.toPercent(obj.putongbaoyuePayMacRate),
          hitAmount: this.cc_format_number(obj.hitAmount),
          baojiPayMacRate: this.toPercent(obj.baojiPayMacRate),
          priceTotal: this.cc_format_number(obj.priceTotal),
          bannianPayPrice: this.cc_format_number(obj.bannianPayPrice),
          baojiPayPrice: this.cc_format_number(obj.baojiPayPrice),
          baonianPayPrice: this.cc_format_number(obj.baonianPayPrice),
          liaoxubaojiPayPrice: this.cc_format_number(obj.liaoxubaojiPayPrice),
          bannianPayMacRate: this.toPercent(obj.bannianPayMacRate)
        }
      })
      const reportRightsReData = reportRights.map(obj => {
        return {
          ...obj,
          yingshiMacRate: this.toPercent(obj.yingshiMacRate),
          yingshiMac: this.cc_format_number(obj.yingshiMac),
          aiqiyiMacRate: this.toPercent(obj.aiqiyiMacRate),
          qinziMacRate: this.toPercent(obj.qinziMacRate),
          qinziMac: this.cc_format_number(obj.qinziMac),
          chuileiMacRate: this.toPercent(obj.chuileiMacRate),
          otherMacRate: this.toPercent(obj.otherMacRate),
          otherMac: this.cc_format_number(obj.otherMac),
          aiqiyiMac: this.cc_format_number(obj.aiqiyiMac),
          chuileiMac: this.cc_format_number(obj.chuileiMac)
        }
      })

      result.reportDayDetail = {
        name: res.reportDayDetail.name,
        data: reportDayDetailReData,
        title: res.reportDayDetail.title
      }
      result.reportSum = {
        name: res.reportSum.name,
        data: reportSumReData,
        title: res.reportSum.title
      }
      result.reportGroupSum = {
        name: reportGroupSum.name,
        data: reportGroupSumReData
      }
      result.reportRights = {
        name: reportRights.name,
        data: reportRightsReData
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
      if (key === 'payRate') { // 支付率，数据转为百分比
        reObj.yunit = '%'
      }
      reObj.series = chartData.reduce((result, current, index) => {
        reObj.xaxis.push(current.date)
        const oneDateData = current.data
        oneDateData.forEach(dayObj => {
          const valueNum = dayObj[key]
          const flag = result.find(i => i.name === dayObj.planName)
          if (flag) {
            flag.value.push(valueNum)
          } else {
            result.push({
              name: dayObj.planName,
              value: [valueNum]
            })
          }
        })

        return result
      }, [])

      return reObj
    },
    // echart 图表渲染
    drawChart () {
      const rowObj2 = this.rowObj2
      rowObj2.forEach(item => {
        // key 是代表 ref 值
        for (const key in item) {
          if (item[key].type === 'line') {
            this.showLine(this.allChartData[key], key)
          }
        }
      })
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
      // // 实验分组概览
      // this.table1.data = d.reportPlans.data
      // // 实验效果汇总
      // this.table2.data = d.reportTotal.data

      const d = res

      for (const key in d) {
        const allData = res[key]

        const data = d[key].data // 单个表格的数据

        if (key === 'reportDayDetail' || key === 'reportSum') {
          // let mainkey
          // if (key === 'reportSum') {
          //   mainkey = 'day'
          // } else {
          //   mainkey = 'date'
          // }
          // const reutrnData = this.restoreData(key, data, mainkey, allData)

          // this.allTableData[key].data = reutrnData.tableData
          // this.allTableData[key].tableConfig = reutrnData.tableConfig

          // console.log('this.allTableData.reportDayDetail-------->', this.allTableData.reportSum)
        } else {
          if (this.allTableData[key]) {
            this.allTableData[key].data = data
          }
        }
      }
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
            label: '日期',
            prop: 'dynamicRuleId'
          }, {
            label: '子人群',
            prop: 'dynamicName'
          }, {
            label: '分组',
            prop: 'dynamicType'
          }, {
            label: '业务平台',
            prop: 'hitAmount',
            render: (h, { row }) => {
              return this.cc_format_number(row.hitAmount)
            }
          }, {
            label: '命中设备量',
            prop: 'showMac',
            render: (h, { row }) => {
              return this.cc_format_number(row.showMac)
            }
          }],
          data: []
        },
        reportDayDetail: { // 每日收益明细
          tableConfig: [ // 表头配置项
            {
              id: 1,
              label: '日期',
              prop: 'date'
            },
            {
              id: 2,
              label: '产品包曝光量',
              prop: 'showMac',
              children: [

              ]
            },
            {
              id: 3,
              label: '支付率',
              prop: 'payRate',
              children: [

              ]
            },
            {
              id: 4,
              label: '客单价',
              prop: 'arup',
              children: [
                // {
                //     id:303,
                //     label:"动态人群_A",
                //     prop:"priceDongA"
                // },
                // {
                //     id:304,
                //     label:"动态人群_B",
                //     prop:"priceDongB"
                // },
                // {
                //     id:305,
                //     label:"动态人群_C",
                //     prop:"priceDongC"
                // },
              ]
            },
            {
              id: 5,
              label: '总营收(元)',
              prop: 'priceTotal',
              children: [
              ]
            },
            {
              id: 6,
              label: '总营收(元)【按命中流量比例换算】',
              prop: 'priceTotalHitRate',
              children: [
              ]
            }
          ],
          data: []
        }

      },

      getAllData: [],
      allChartData: {},
      rowObj2: [
        {
          vipPlay: { type: 'line', title: '每组动态人群每日曝光支付率数据', span: 12 },
          vipPlayTrend: { type: 'line', title: '每组动态人群每日曝光客单价数据', span: 12 }
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
  .chart-div{
    height: 436px
  }
  .aaa {
    width: 20px;
    // height: 201px;
  }
  .export-button
    display flex
    justify-content flex-end
</style>
