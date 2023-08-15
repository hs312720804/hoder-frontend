<template>
  <div >

    <!-- {{data}}
    <br/>
    tableData: {{tableData}} -->

    <div id="ul111">
      <div class="icon-open-close" @click="changeView">
        <i v-if="showNav" class="el-icon-d-arrow-right"></i>
        <i v-else class="el-icon-d-arrow-left"></i>
      </div>

      <div class="list-wrap" :class="{aaa: !showNav}">
        <div><a href="javascript:void(0)" to="a1" @click="goAnchor('#a1')" title="实验分组概览">实验分组概览</a></div>
        <div><a href="javascript:void(0)" to="a2" @click="goAnchor('#a2')" title="实验效果汇总">实验效果汇总</a></div>
        <div><a href="javascript:void(0)" to="a3" @click="goAnchor('#a3')" title="每日收益趋势">每日收益趋势</a></div>
        <div><a href="javascript:void(0)" to="a4" @click="goAnchor('#a4')" title="每日收益明细">每日收益明细</a></div>
        <div><a href="javascript:void(0)" to="a5" @click="goAnchor('#a5')" title="累计收益明细">累计收益明细</a></div>
        <div><a href="javascript:void(0)" to="a6" @click="goAnchor('#a6')" title="分组内各子人群收益明细">分组内各子人群收益明细</a></div>
        <div><a href="javascript:void(0)" to="a7" @click="goAnchor('#a7')" title="分组内各流转链路收益">分组内各流转链路收益</a></div>
        <div><a href="javascript:void(0)" to="a8" @click="goAnchor('#a8')" title="各权益收益情况">各权益收益情况</a></div>
      </div>
      <!-- <li><a href="#a1">a1</a></li>
      <li><a href="#a2">a2</a></li>
      <li><a href="#a3">a3</a></li>
      <li><a href="#a4">a4</a></li>
      <li><a href="#a5">a5</a></li> -->

    </div>
    <div>
      <!-- <div class="title">crowdId: 12461 【亲子】亲子全量-同步01 - 动态实验报告</div> -->
      <div class="title"> {{ crowdName }} - 动态实验报告</div>

      <div class="export-button">
        <span>
          <!-- 已投放 且 投放时间距今超过60天，才显示 -->
          <template v-if="isShow">
            Tips: 当前投放周期较长，仅展示最近60天的数据
          </template>
        </span>

        <span>
          <el-radio-group v-model="pageRadio" @change="handleRadioChange" style="margin-right: 80px; margin-top: 10px;">
            <el-radio :label="0">产品包</el-radio>
            <el-radio :label="1">
              内容运营
              <el-popover
                placement="top"
                width="400"
                trigger="hover"
               >
                投后报告解释：<br/><br/>
                内容运营：根据动态人群或故事运营配置的条件（动态流转标签，非行为标签和大数据标签）中的板块id或资源位id进行统计。<br/><br/>
                产品包：根据动态人群或故事运营配置的条件（动态流转标签，非行为标签和大数据标签）中的产品包权益进行统计或根据人群在影视订单平台中绑定的产品包权益进行统计。<br/>
                <span slot="reference" class="priority-tip">?</span>
              </el-popover>
            </el-radio>
          </el-radio-group>
          <el-button type="info" @click="handleBackToCrowdList" style="margin-right: 10px;">返回人群列表</el-button>
          <a :href="downloadUrl" download ref="download_Url"></a>
          <el-button type="success" @click="handleDownload">导出数据</el-button>
        </span>
      </div>

      <div id='a1' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            实验分组概览 （reportPlans）
            <!-- <span>共 0 个</span> -->
          </div>
        </div>
        <c-table
          :props="allTableData.reportPlans.props"
          :header="allTableData.reportPlans.header"
          :data="allTableData.reportPlans.data"
        ></c-table>
      </div>

      <div id='a2' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            实验效果汇总（reportTotal）
            <span>目的：①了解各组动态人群整体汇总情况</span>
            <span>②通过总营收、付费率、客单价等目标指标差异对比，概括性分析本次实验效果情况</span>
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
            每日收益趋势
            <span>
              <span>目的：①针对每日的数据情况，如发现数据差异性较大，可后续分析下钻查看是否某日营销策略变更或其他因素导致指标差异原因</span>
              <br/>
              <span>②动态人群方案实施期，跟踪每日数据情况，及时调整流转指标、变更方案策略等 </span>
            </span>
          </div>

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

      </div>

      <div id='a4' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            每日收益明细（reportDayDetail）
            <!-- <span>共 0 个</span> -->
          </div>
        </div>
        <!-- {{ allTableData.reportDayDetail }} -->
        <dynamic-table
          :table-data="allTableData.reportDayDetail.data"
          :table-header="allTableData.reportDayDetail.tableConfig"
        ></dynamic-table>
      </div>

      <div id='a5' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            累计收益明细（reportSum）
            <span>目的：针对累计数据情况，查看各组动态人群转化效果 </span>
          </div>
        </div>
        <dynamic-table
          :table-data="allTableData.reportSum.data"
          :table-header="allTableData.reportSum.tableConfig"
        ></dynamic-table>
      </div>

      <div id='a6' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            分组内各子人群收益明细（reportGroupSum）
          </div>
        </div>
        <dynamic-table
          :table-data="allTableData.reportGroupSum.data"
          :table-header="allTableData.reportGroupSum.tableConfig"
        ></dynamic-table>
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

      <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj3" :key="index">
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
            分组内各流转链路收益（reportGroupPath）
            <span>
              <span>目的：①以各动态人群链路情况分析，了解各组动态人群链路方案情况，拆分下钻各组动态人群效果差异原因。</span>
              <br/>
              <span>②确定各组动态人群链路信息，寻找该人群下最优链路，以应用在该人群后续的动态流转链路中。</span>
            </span>

          </div>

        </div>
        <c-table
          :header="allTableData.reportGroupPath.header"
          :data="allTableData.reportGroupPath.data"
        ></c-table>
      </div>

      <div id='a8' class="table-wrap">
        <div class="title-layout">
          <div class="per-index-title">
            各权益收益情况（reportRights）
          </div>
        </div>
        <dynamic-table
          :table-data="allTableData.reportRights.data"
          :table-header="allTableData.reportRights.tableConfig"
        ></dynamic-table>
      </div>
    </div>
  </div>

</template>

<script>
import DynamicTable from '../dynamicTable/Index.vue'
import AutoHighLightAnchor from '../dynamicTable/autoHighLightAnchor.js'
import { crowdData } from './crowdData3.js'
import { setBarEchart } from './chart/bar.js'
import { drawTwoBarChart } from './chart/twoBar.js'

export default {
  components: {
    DynamicTable
  },
  created () {
    // 表格设置最大高度，超过则滚动
    for (const key in this.allTableData) {
      this.allTableData[key].props = {
        maxHeight: 400,
        stripe: true
      }
    }
    // this.initData()
  },
  watch: {
    $route: {
      handler () {
        this.crowdId = this.$route.query.crowdId || ''
        // this.crowdId = 12461
        this.crowdName = this.$route.query.crowdName || ''
        this.pageType = this.$route.query.type || ''
        const launchTime = this.$route.query.launchTime || ''

        // 获取当前时间
        const m1 = this.$moment()
        // 获取需要对比的时间
        const m2 = this.$moment(launchTime)
        // 计算相差多少天 day可以是second minute
        const day = m1.diff(m2, 'day')

        if (day > 60 && !!launchTime) {
          this.isShow = true
        } else {
          this.isShow = false
        }

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
    this.high() // 锚点侧边栏
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
      if (this.pageType === 'story') {
        this.downloadUrl = '/api/chart/dynamicCrowdReportDownload?sceneId=' + this.crowdId
      } else {
        this.downloadUrl = '/api/chart/dynamicCrowdReportDownload?crowdId=' + this.crowdId
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
    high () {
      // let highligthId// 需要高亮的id
      // const windowHeight = this.ScrollContrainer.offsetHeight // 容器高度
      // this.anchors.forEach(element => {
      //   const id = element.hash.slice(1)
      //   const target = document.getElementById(id)
      //   if (target) {
      //     const {
      //       top
      //     } = target.getBoundingClientRect()
      //     // 当元素头部可见时
      //     if (top < windowHeight) {
      //       highligthId = id
      //     }
      //   }
      // })
      // if (highligthId) {
      //   // 调用高亮方法
      //   this.highLightAnchor(highligthId)
      // }
      // console.log('document.querySelector(ul)-------->', document.querySelector('#ul111'))
      // console.log('document.querySelector(ul)-------->', document.querySelector('.el-main'))
      const high = new AutoHighLightAnchor(document.querySelector('#ul111'), document.querySelector('.el-main'), 'type3')
    },
    initData () {
      let params = {}
      if (this.pageType === 'story') {
        params = { sceneId: this.crowdId }
      } else {
        params = { crowdId: this.crowdId }
      }

      this.$service.getDynamicCrowdReportA(params).then(res => {
      // const res = crowdData
        const getAllData = this.formatData(res) // 格式化一些数据： 千分位、百分比

        // 表格
        this.setTableData(getAllData)

        // 图表
        this.setChartData(res)
      })

      let params2 = {}
      if (this.pageType === 'story') {
        params2 = { sceneId: this.crowdId }
      } else {
        params2 = { crowdId: this.crowdId }
      }
      this.$service.getDynamicCrowdReportB(params2).then(res => {
        // this.getAllData = res

        this.setTableData(res)
      })
      //

      // // 表头配置项

      // console.log('reObj====', this.tableData)
      // console.log('tableConfig====', this.tableConfig)
    },
    setChartData (res) {
      // 折线图数据
      const vipPlay = this.getChartData(res.reportDayDetail.data, 'payRate')
      const vipPlayTrend = this.getChartData(res.reportDayDetail.data, 'arup')

      // 柱状图数据
      const reportGroupSumArup = this.getChartData2(res.reportGroupSum.data, 'arup')
      const reportGroupSumPriceTotal = this.getChartData2(res.reportGroupSum.data, 'priceTotal')
      const reportGroupSumPayRate = this.getChartData2(res.reportGroupSum.data, 'payRate')

      // 双向柱状图
      const reportGroupSumTwoWay = this.getChartData3(res.reportGroupSum.data, { key1: 'payPrice', key2: 'payPriceRate', title1: '购买金额', title2: '各卡种购买金额占比' })
      const reportGroupSumTwoWay2 = this.getChartData3(res.reportGroupSum.data, { key1: 'payUser', key2: 'payMacRate', title1: '购买用户数', title2: '购买用户数占比' })
      const reportGroupSumTwoWay3 = this.getChartData3(res.reportGroupSum.data, { key1: 'payNum', key2: 'payNumRate', title1: '购买用户数', title2: '购买用户数占比' })

      // console.log('vipPlay---->', vipPlay)
      // console.log('vipPlayTrend---->', vipPlayTrend)
      // console.log('reportGroupSumArup---->', reportGroupSumArup)
      // console.log('reportGroupSumPriceTotal---->', reportGroupSumPriceTotal)
      // console.log('reportGroupSumTwoWay---->', reportGroupSumTwoWay)

      this.allChartData = {
        vipPlay,
        vipPlayTrend,
        reportGroupSumArup, // /客单价
        reportGroupSumPriceTotal, // 总营收
        reportGroupSumPayRate,
        reportGroupSumTwoWay,
        reportGroupSumTwoWay2,
        reportGroupSumTwoWay3
      }

      this.$nextTick(() => {
        this.drawChart(this.rowObj)
        this.drawChart(this.rowObj2)
        this.drawChart(this.rowObj3)
      })
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
    getChartData2 (chartData, key) {
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
    getChartData3 (chartData, { key1: barKey1, key2: barKey2, title1, title2 }) {
      const reObj = {
        xaxis: [],
        yunit: '',
        series: [],
        title: '',
        xunit: ''
      }

      const arr = [
        {
          label: '产品包购买金额占比',
          prop: 'payPriceRate',
          children: [{
            label: '连续包月',
            prop: 'liaoxubaoyuePayPriceRate'
          }, {
            label: '包月',
            prop: 'putongbaoyuePayPriceRate'
          }, {
            label: '连续包季',
            prop: 'liaoxubaojiPayPriceRate'
          }, {
            label: '包季',
            prop: 'baojiPayPriceRate'
          }, {
            label: '半年',
            prop: 'bannianPayPriceRate'
          }, {
            label: '包年',
            prop: 'baonianPayPriceRate'
          }]

        },
        {
          label: '购买单数占比',
          prop: 'payNumRate',
          children: [{
            label: '连续包月',
            prop: 'liaoxubaoyuePayNumRate'
          }, {
            label: '包月',
            prop: 'putongbaoyuePayNumRate'
          }, {
            label: '连续包季',
            prop: 'liaoxubaojiPayNumRate'
          }, {
            label: '包季',
            prop: 'baojiPayNumRate'
          }, {
            label: '半年',
            prop: 'bannianPayNumRate'
          }, {
            label: '包年',
            prop: 'baonianPayNumRate'
          }]

        }
      ]
      const tableData = this.allTableData.reportGroupSum.tableConfig
      // const seriesKey1 = ['liaoxubaoyuePayPrice', 'putongbaoyuePayPrice', 'liaoxubaojiPayPrice', 'baojiPayPrice', 'bannianPayPrice', 'baonianPayPrice']
      // const seriesKey2 = ['liaoxubaoyuePayMacRate', 'putongbaoyuePayMacRate', 'liaoxubaojiPayMacRate', 'baojiPayMacRate', 'bannianPayMacRate', 'baonianPayMacRate']
      const seriesKey1 = [...tableData, ...arr].find(item => item.prop === barKey1).children
      const seriesKey2 = [...tableData, ...arr].find(item => item.prop === barKey2).children

      // console.log('seriesKey1--->', seriesKey1)
      // console.log('seriesKey2--->', seriesKey2)
      // console.log('chartData--->', chartData)

      const seriesKey1Map = []
      const seriesKey2Map = []

      chartData.forEach((item, index) => {
        reObj.xaxis.push(`${item.dynamicName}-${item.crowdId}`)

        seriesKey1.forEach(propItem => {
          const key = propItem.prop
          const valueNum = item[key]
          const obj = {
            key,
            name: propItem.label,
            data: [valueNum],
            type: 'bar'

          }
          const filerItem = seriesKey1Map.find(m => m.key === key)
          if (filerItem) {
            filerItem.data.push(valueNum)
          } else {
            seriesKey1Map.push(obj)
          }
        })
        seriesKey2.forEach(propItem => {
          const key = propItem.prop
          const valueNum = item[key]
          const obj = {
            key,
            name: propItem.label,
            data: [valueNum],
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: 'bar',
            yunit: '%'

          }
          const filerItem = seriesKey2Map.find(m => m.key === key)
          if (filerItem) {
            filerItem.data.push(valueNum)
          } else {
            seriesKey2Map.push(obj)
          }
        })
      })

      // console.log('seriesKey1Map------->', seriesKey1Map)
      // console.log('seriesKey2Map------->', seriesKey2Map)

      reObj.series = [...seriesKey1Map, ...seriesKey2Map]
      reObj.title1 = title1
      reObj.title2 = title2
      // console.log('reObj------->', reObj)

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
          } else if (item[key].type === 'twoBar') {
            const title1 = this.allChartData[key].title1 || ''
            const title2 = this.allChartData[key].title2 || ''
            this.showTwoBar(this.allChartData[key], key, title1, title2) // 双向柱状图
          }
        }
      })
    },
    //  双向柱状图
    showTwoBar (data, chartID, title1, title2) {
      if (data && data.xaxis && data.xaxis.length > 0) {
        // if (data.yunit === '%') {
        //   data.series = data.series.map(v => Number(v * 100).toFixed(2))
        // }
        const element = chartID
        // console.log('23333=========>', data)
        const chartElement = document.getElementById(element)
        if (!chartElement) return

        const options = drawTwoBarChart({ title1, title2 }, data.xaxis, data.series, data.xunit, data.yunit)
        const echarts = require('echarts')
        const myChart = echarts.init(chartElement)
        myChart.setOption(options, true)
        this.allCharts[element] = myChart
      }
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
          let mainkey
          if (key === 'reportSum') {
            mainkey = 'day'
          } else {
            mainkey = 'date'
          }
          const reutrnData = this.restoreData(key, data, mainkey, allData)

          this.allTableData[key].data = reutrnData.tableData
          this.allTableData[key].tableConfig = reutrnData.tableConfig

          // console.log('this.allTableData.reportDayDetail-------->', this.allTableData.reportSum)
        } else {
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
      isShow: false,
      pageType: '',
      pageRadio: 0,
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
        reportPlans: {
          header: [{
            label: '流转ID',
            prop: 'id'
          }, {
            label: '流转分组名',
            prop: 'name'
          }, {
            label: '流转方式',
            prop: 'mainArithmetic',
            render: (h, { row }) => {
              const obj = this.options.find(item => item.value == row.mainArithmetic)
              return obj.label
            }
          }, {
            label: '命中流量占比',
            prop: 'flowNum',
            render: (h, { row }) => {
              return (row.flowNum) + '%'
            }
          },
          // {
          //   label: '命中设备量',
          //   prop: 'crowdNum',
          //   render: (h, { row }) => {
          //     return this.cc_format_number(row.crowdNum)
          //   }
          // },
          {
            label: '包含人群-ID',
            prop: 'cname'
          }],
          data: []
        },
        reportTotal: {
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
            label: '产品包页面曝光设备量',
            prop: 'showMac',
            render: (h, { row }) => {
              return this.cc_format_number(row.showMac)
            }
          }, {
            label: '付费设备量',
            prop: 'payMac',
            render: (h, { row }) => {
              return this.cc_format_number(row.payMac)
            }
          }, {
            label: '总营收(元)',
            prop: 'priceTotal',
            render: (h, { row }) => {
              return this.cc_format_number(row.priceTotal)
            }
          }, {
            // label: '总营收（按比例转化后）',
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '总营收（按比例转化后）',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 400,
                    content: '总营收（按比例转化后）= 总营收 / 命中流量占比'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'priceTotalHitRate',
            render: (h, { row }) => {
              return this.cc_format_number(row.priceTotalHitRate)
            }
          }, {
            // label: '差异对比',
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '差异对比',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 400,
                    content: '该处的差异对比公式为：动态人群_A的总营收差异对比=（动态人群_A-avg(动态人群_B+动态人群_C))/avg(动态人群_B+动态人群_C)'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'priceDifference',
            render: (h, { row }) => {
              return this.toPercent(row.priceDifference)
            }
          }, {
            label: '付费率',
            prop: 'payRate',
            render: (h, { row }) => {
              return this.toPercent(row.payRate)
            }
          },
          {
            width: 100,
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '差异对比',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 400,
                    content: '该处的差异对比公式为：动态人群_A的付费率差异对比=（动态人群_A-avg(动态人群_B+动态人群_C))/avg(动态人群_B+动态人群_C)'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'payRateDifference',
            render: (h, { row }) => {
              return this.toPercent(row.payRateDifference)
            }
          }, {
            label: '客单价(元)',
            prop: 'arup',
            render: (h, { row }) => {
              return this.cc_format_number(row.arup)
            }
          }, {
            // label: '差异对比',
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '差异对比',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 400,
                    content: '该处的差异对比公式为：动态人群_A的客单价差异对比=（动态人群_A-avg(动态人群_B+动态人群_C))/avg(动态人群_B+动态人群_C)'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'arupDifference',
            render: (h, { row }) => {
              return this.toPercent(row.arupDifference)
            }
          }, {
            label: '上架天数',
            prop: 'onlineDay'
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
        },
        reportSum: { // 累计收益明细
          tableConfig: [ // 表头配置项
            {
              id: 1,
              label: '上线天数',
              prop: 'day',
              sortable: true
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
        },
        reportGroupSum: { // 分组内各子人群收益明细

          tableConfig: [{
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
            label: '曝光设备量',
            prop: 'showMac'

          }, {
            label: '付费设备量',
            prop: 'payMac'

          }, {
            label: '付费率',
            prop: 'payRate'

          }, {
            label: '客单价(元)',
            prop: 'arup'

          }, {
            label: '总营收(元)',
            prop: 'priceTotal'

          }, {
            label: '产品包购买金额',
            prop: 'payPrice',
            children: [{
              label: '连续包月',
              prop: 'liaoxubaoyuePayPrice'

            }, {
              label: '包月',
              prop: 'putongbaoyuePayPrice'

            }, {
              label: '连续包季',
              prop: 'liaoxubaojiPayPrice'

            }, {
              label: '包季',
              prop: 'baojiPayPrice'

            }, {
              label: '半年',
              prop: 'bannianPayPrice'

            }, {
              label: '包年',
              prop: 'baonianPayPrice'

            }]
          }, {
            label: '产品包购买用户数占比（用户产品包购买偏好）',
            prop: 'payMacRate',
            children: [{
              label: '连续包月',
              prop: 'liaoxubaoyuePayMacRate'

            }, {
              label: '包月',
              prop: 'putongbaoyuePayMacRate'

            }, {
              label: '连续包季',
              prop: 'liaoxubaojiPayMacRate'

            }, {
              label: '包季',
              prop: 'baojiPayMacRate'

            }, {
              label: '半年',
              prop: 'bannianPayMacRate'

            }, {
              label: '包年',
              prop: 'baonianPayMacRate'

            }]

          }, {
            label: '产品包购买用户数（用户产品包购买偏好）',
            prop: 'payUser',
            children: [{
              label: '连续包月',
              prop: 'liaoxubaoyuePayMac'
            }, {
              label: '包月',
              prop: 'putongbaoyuePayMac'
            }, {
              label: '连续包季',
              prop: 'liaoxubaojiPayMac'
            }, {
              label: '包季',
              prop: 'baojiPayMac'
            }, {
              label: '半年',
              prop: 'bannianPayMac'
            }, {
              label: '包年',
              prop: 'baonianPayMac'
            }]
          }, {
            label: '产品包购买单数（用户产品包购买偏好）',
            prop: 'payNum',
            children: [{
              label: '连续包月',
              prop: 'liaoxubaoyuePayNum'
            }, {
              label: '包月',
              prop: 'putongbaoyuePayNum'
            }, {
              label: '连续包季',
              prop: 'liaoxubaojiPayNum'
            }, {
              label: '包季',
              prop: 'baojiPayNum'
            }, {
              label: '半年',
              prop: 'bannianPayNum'
            }, {
              label: '包年',
              prop: 'baonianPayNum'
            }]

          }],
          data: []
        },
        reportRights: { // 各权益收益情况
          tableConfig: [ // 表头配置项
            {
              id: 1,
              label: '用户类型',
              prop: 'dynamicName'
            },
            {
              id: 2,
              label: '付费用户量',
              children: [{
                label: '奇异果VIP',
                prop: 'aiqiyiMac'
              }, {
                label: '影视VIP',
                prop: 'yingshiMac'
              }, {
                label: '亲子VIP',
                prop: 'qinziMac'
              }, {
                label: '垂类VIP',
                prop: 'chuileiMac'
              }, {
                label: '其他类型（直播+多元）',
                prop: 'otherMac'
              }]
            },
            {
              id: 3,
              label: '付费用户占比',
              children: [{
                label: '奇异果VIP',
                prop: 'aiqiyiMacRate'
              }, {
                label: '影视VIP',
                prop: 'yingshiMacRate'
              }, {
                label: '亲子VIP',
                prop: 'qinziMacRate'
              }, {
                label: '垂类VIP',
                prop: 'chuileiMacRate'
              }, {
                label: '其他类型（直播+多元）',
                prop: 'otherMacRate'
              }]
            }

          ],
          data: []
        },
        reportGroupPath: { // 分组内各流转链路收益
          header: [{
            label: '动态流转分组',
            prop: 'planName'
          }, {
            // label: '路径',
            renderHeader: (h, params) => {
              return h('span', {
              },
              [
                '路径',
                h('el-popover', {
                  props: {
                    placement: 'top',
                    trigger: 'hover',
                    class: 'popover-button',
                    width: 400,
                    content: '流转路径为 0 代表该分组流入设备量的去重汇总'
                  }
                }, [h('span', { slot: 'reference', class: 'priority-tip' }, '!')])
              ])
            },
            prop: 'path'
          }, {
            label: '流入设备量（命中设备量）',
            prop: 'hitUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.hitUv)
            }
          }, {
            label: '曝光用户量',
            prop: 'showUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.showUv)
            }
          }, {
            label: '下单用户量',
            prop: 'xiadanUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.xiadanUv)
            }
          }, {
            label: '付费用户量',
            prop: 'payUv',
            render: (h, { row }) => {
              return this.cc_format_number(row.payUv)
            }
          }, {
            label: '付费总金额',
            prop: 'price',
            render: (h, { row }) => {
              return this.cc_format_number(row.price)
            }
          }, {
            label: '付费率',
            prop: 'payRate',
            render: (h, { row }) => {
              return this.toPercent(row.payRate)
            }
          }, {
            label: '客单价',
            prop: 'arup',
            render: (h, { row }) => {
              return this.cc_format_number(row.arup)
            }
          }],
          data: []
        },
        11: {
          props: {

          },
          header: [{
            label: '路径',
            prop: 'id'
          }, {
            label: '流入设备量（命中设备量）',
            prop: 'name'
          }, {
            label: '曝光用户量',
            prop: 'way'
          }, {
            label: '下单用户量',
            prop: 'id'
          }, {
            label: '付费用户量',
            prop: 'id'
          }, {
            label: '付费总金额',
            prop: 'id'
          }, {
            label: '付费率',
            prop: 'id'
          }, {
            label: '客单价',
            prop: 'id'
          }],
          data: [{
            id: 1,
            name: '实验组1',
            way: '顺序'
          }, {
            id: 1,
            name: '实验组1',
            way: '顺序'
          }]
        }
      },

      // tableConfig: [],
      // 表数据
      // tableData: [],
      // 模拟接口数据
      // data: [
      //   {
      //     date: '2021-09-06',
      //     dongA: {
      //       name: '动态人群A',
      //       show: 1, // 产品包曝光率 - 动态人群_A
      //       payRate: 2, // 支付率 - 动态人群_A
      //       price: 3 // 客单价 - 动态人群_A
      //     },
      //     dongB: {
      //       name: '动态人群B',
      //       show: 10, // 产品包曝光率 - 动态人群_B
      //       payRate: 11, // 支付率 - 动态人群_B
      //       price: 12 // 客单价 - 动态人群_B
      //     },
      //     dongC: {
      //       name: '动态人群C',
      //       show: 100, // 产品包曝光率 - 动态人群_C
      //       payRate: 101, // 支付率 - 动态人群_C
      //       price: 102 // 客单价 - 动态人群_C
      //     },
      //     dongD: {
      //       name: '动态人群D',
      //       show: 500, // 产品包曝光率 - 动态人群_C
      //       payRate: 501, // 支付率 - 动态人群_C
      //       price: 502 // 客单价 - 动态人群_C
      //     }
      //   },
      //   {
      //     date: '2021-09-07',
      //     dongA: {
      //       name: '动态人群A',
      //       show: 2, // 产品包曝光率 - 动态人群_A
      //       payRate: 2, // 支付率 - 动态人群_A
      //       price: 2 // 客单价 - 动态人群_A
      //     },
      //     dongB: {
      //       name: '动态人群B',
      //       show: 20, // 产品包曝光率 - 动态人群_B
      //       payRate: 21, // 支付率 - 动态人群_B
      //       price: 22 // 客单价 - 动态人群_B
      //     },
      //     dongC: {
      //       name: '动态人群C',
      //       show: 200, // 产品包曝光率 - 动态人群_C
      //       payRate: 201, // 支付率 - 动态人群_C
      //       price: 202 // 客单价 - 动态人群_C
      //     }
      //   }
      // ],
      getAllData: [],
      allChartData: {},
      rowObj: [
        {
          vipPlay: { type: 'line', title: '每组动态人群每日曝光支付率数据', span: 12 },
          vipPlayTrend: { type: 'line', title: '每组动态人群每日曝光客单价数据', span: 12 }
        }
      ],
      rowObj2: [
        {
          reportGroupSumArup: { type: 'bar', title: '分组内各子人群（接待员）客单价', span: 8 },
          reportGroupSumPriceTotal: { type: 'bar', title: '分组内各子人群（接待员）总营收', span: 8 },
          reportGroupSumPayRate: { type: 'bar', title: '分组内各子人群（接待员）付费率', span: 8 }
        }
      ],
      rowObj3: [
        { reportGroupSumTwoWay: { type: 'twoBar', title: '分组内各子人群（接待员）购买金额及占比', span: 24 } },
        { reportGroupSumTwoWay2: { type: 'twoBar', title: '分组内各子人群（接待员）购买用户数及占比', span: 24 } },
        { reportGroupSumTwoWay3: { type: 'twoBar', title: '分组内各子人群（接待员）购买单数及占比', span: 24 } }
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
    height: 530px
  }
  .export-button
    display flex
    justify-content space-between
</style>
