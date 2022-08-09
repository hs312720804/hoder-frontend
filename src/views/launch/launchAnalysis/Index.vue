<template>
 <div class='' id='' style="background: #f3f4fa; margin: -20px; padding: 20px;">
  <!-- {{ formInline }} -->
  <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline" ref="ruleForm">
    <el-form-item label="人群ID:" prop="crowdId">
      <el-input v-model="formInline.crowdId" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item v-if="crowdName" label="人群名:" style="margin: 0 50px 0 20px">
      {{ crowdName }}
    </el-form-item>

    <el-form-item label="分析周期:" prop="timeRange">
      <el-date-picker
          v-model="formInline.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
      </el-date-picker>
          <!-- :picker-options="pickerOptions" -->
    </el-form-item>
    <br/>
    <el-form-item label="业务范围:" prop="sourceNameList" style="max-width: 70%; white-space: nowrap;">
      <!-- <el-checkbox-group v-model="formInline.sourceNameList">
        <el-checkbox :label="0" name="type">全选</el-checkbox>
        <el-checkbox :label="影视VIP" name="type">影视VIP</el-checkbox>
        <el-checkbox :label="奇异果VIP" name="type">奇异果VIP</el-checkbox>
      </el-checkbox-group> -->

      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <!-- <div style="margin: 15px 0;"></div> -->
      <el-checkbox-group v-model="formInline.sourceNameList" @change="handleCheckedCitiesChange" style="white-space: break-spaces;">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item style="margin-left: 136px">
      <el-button type="primary" @click="onSubmit" :loading="loading">{{ loading ? '分析中' : '分析'}}</el-button>
    </el-form-item>
  </el-form>

  <!-- 总览 -->
  <div v-if="!!allChartData.overview">
    <div >
      <div class="big-title">总览</div>
      <div class="wrap-div">
        <div class="overview-table">
          <el-row :gutter="20">

            <el-col :span="8"><div class="ibox">
              <div class="title-one">主页活跃人数</div>
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
            </div></el-col>

            <el-col :span="8"><div class="ibox">
              <div class="title-one">起播活跃率</div>
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
            </div></el-col>

            <el-col :span="8"><div class="ibox">
              <div class="title-one">产品包曝光率</div>
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
            </div></el-col>

          </el-row>

          <el-row :gutter="20">

            <el-col :span="8"><div class="ibox">
              <div class="title-one">下单率</div>
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
            </div></el-col>

            <el-col :span="8"><div class="ibox">
              <div class="title-one">付费率</div>
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
            </div></el-col>

            <el-col :span="8"><div class="ibox">
              <div class="title-one">付费金额</div>
              <div class="text-two" style="height: 70px">
                {{ cc_format_number(overview.totalPrice) }}
              </div>

            </div></el-col>

          </el-row>

        </div>

        <!-- 漏斗图 -->
        <div class="chart-wrap">
          <div ref="chart1" class="chart-1" >chart1</div>
        </div>
      </div>
    </div>

    <!-- tabs -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="内容型" name="one">
        <!-- 柱状图、折线图 -->
        <div class="launch-statistics">
            <!-- <template v-if="show"> -->
            <template>
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

                    <div class="unit-content" v-if="show && chart.title">
                        <!-- {{ allChartData[key] && allChartData[key].series }} -->
                      <div v-if="allChartData[key] && (allChartData[key].series || allChartData[key].data)" :ref="key" :id="key" class="chart-div"></div>
                      <div v-else class="chart-div">
                        <el-empty description="暂无数据"></el-empty>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </template>
        </div>

      </el-tab-pane>

      <el-tab-pane label="付费型" name="two">

        <!-- 柱状图、折线图 -->
        <div class="launch-statistics">
            <template>
              <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj" :key="index">
                <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
                  <div class="unit-box" >

                    <!-- <div class="unit-header clearfix"><span v-if="chart.title">{{ chart.title }}</span></div> -->
                    <div class="unit-header clearfix">
                      <span v-if="(allChartData && allChartData[key] && allChartData[key].title)">
                        {{ allChartData[key].title }}
                      </span>
                      <span v-else>
                        {{ chart.title }}
                      </span>

                    </div>

                    <div class="unit-content" v-if="show && chart.title" >
                      <!-- {{ allChartData[key] && allChartData[key].series }} -->
                      <div v-if="allChartData[key] && allChartData[key].series && allChartData[key].series.length > 0" :ref="key" :id="key" class="chart-div"></div>
                      <div v-else class="chart-div">
                        <el-empty description="暂无数据"></el-empty>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </template>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 初始页面 或者 查询为空 时 -->
  <div v-else style="height: calc(100vh - 321px);">
    <el-empty v-if="emptyTxt" :description="emptyTxt" ></el-empty>
  </div>

 </div>
</template>

<script>
const cityOptions = ['影视VIP', '奇异果VIP', '酷喵VIP', '芒果TV大屏VIP', '芒果全屏VIP', '埋堆堆VIP', '4K花园', '戏曲VIP', '健身VIP', '炫舞广场', '1905', '欢喜', '广电直播', '亲子VIP', '音乐K歌会员', '电竞VIP']
export default {
  components: {},
  data () {
    return {
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: false,
      // allData: {},
      overview: {},
      formInline: {
        // crowdId: '10013',
        crowdId: '',
        sourceNameList: [],
        // timeRange: ['2022-07-18', '2022-07-19']
        timeRange: []
      },
      rules: {
        crowdId: [
          { required: true, message: '请输入人群ID', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        timeRange: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ],
        sourceNameList: [
          { type: 'array', required: true, message: '请至少选择一个业务范围', trigger: 'change' }
        ]

      },

      show: true,
      allCharts: {},
      timeRange: [],
      allChartData: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      activeName: 'one',
      rowObj: [
        {
          'vipPkgShow': { type: 'bar', title: '各权益曝光人数及占比', span: 8 },
          'vipPkgXiadan': { type: 'bar', title: '各权益下单人数及占比', span: 8 },
          'vipPkgPay': { type: 'bar', title: '各权益付费人数及占比', span: 8 }
        }, {
          'vipPkgShowTrend': { type: 'line', title: '影视VIP曝光趋势', span: 8 },
          'vipPkgXiadanTrend': { type: 'line', title: '影视VIP下单趋势', span: 8 },
          'vipPkgPayTrend': { type: 'line', title: '影视VIP付费趋势', span: 8 }
        }, {
          'pathPkgShow': { type: 'bar', title: '影视VIP曝光路径人数及占比', span: 8 },
          'productTypePkgXiadan': { type: 'bar', title: '影视VIP下单产品包分类人数及占比', span: 8 },
          'pathPkgPay': { type: 'bar', title: '影视VIP付费路径人数及占比', span: 8 }
        },
        {
          'empty1': { span: 8 },
          'empty2': { span: 8 },
          'productTypePkgPay': { type: 'bar', title: '影视VIP付费产品包分类人数及占比', span: 8 }
        }
      ],
      rowObj2: [
        {
          'vipPlay': { type: 'bar', title: '各权益起播人数及占比', span: 12 },
          'vipPlayTrend': { type: 'line', title: '影视VIP起播趋势', span: 12 }
        }, {
          'viewingCategoryRank': { type: 'pie', title: '各权益观影分类TOP5及占比', span: 12 }
        }
      ],
      crowdId: 11882,
      colorList: ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],
      loading: false,
      crowdName: '',
      emptyTxt: ''
      // colorList: ['#4962FC', '#4B7CF3', '#dd3ee5', '#12e78c', '#fe8104', '#01C2F9', '#FD9E06']
      // policyId: 4323
    }
  },

  mounted () {
    // const data = [
    //   { value: 1048, name: '电视剧' },
    //   { value: 735, name: '电影' },
    //   { value: 580, name: '综艺' },
    //   { value: 484, name: '纪录片' },
    //   { value: 300, name: '少儿' },
    //   { value: 300, name: '其他' }
    // ]
    // this.setPie('pie1', data)
    // this.setPie('pie2', data)

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
    handleCheckAllChange (val) {
      this.formInline.sourceNameList = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    handleClick (tab, event) {
      this.$nextTick(() => {
        for (var key of Object.keys(this.allCharts)) {
          const chart = this.allCharts[key]
          chart.resize()
        }
      })
    },

    // 漏斗图
    showFunnel (element, data) {
      const chartData = [
        { value: data.homepageActiveUv, name: '主页活跃' },
        { value: data.totalPlayUv, name: '起播' },
        { value: data.totalPkgShowUv, name: '产品包曝光' },
        { value: data.totalPkgXiadanUv, name: '下单' },
        { value: data.totalPkgPayUv, name: '成交' }
      ]

      const _this = this
      const option = {
        title: {
          text: '漏斗图'
        },
        tooltip: {
          trigger: 'item'
          // formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
        },
        color: _this.colorList,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            // min: 0,
            // max: data.homepageActiveUv,
            minSize: '0%',
            maxSize: '100%',
            sort: 'none', // none-按照数据顺序展示 ; descending-倒序
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: chartData
            //  [
            //   { value: 60, name: 'Visit' },
            //   { value: 40, name: 'Inquiry' },
            //   { value: 20, name: 'Order' },
            //   { value: 80, name: 'Click' },
            //   { value: 100, name: 'Show' }
            // ]
          }
        ]
      }
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs['chart1'])

      myChart.setOption(option)
    },
    // initRange () {
    //   // 设置默认时间为今天的前一周
    //   const start = new Date()
    //   const end = new Date()
    //   const startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 30))
    //   const endDate = this.formatDate(end.setTime(end.getTime()))
    //   this.timeRange = [startDate, endDate]
    // },
    // formatDate (d) {
    //   const time = new Date(d)
    //   let y = time.getFullYear() // 年份
    //   let m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
    //   let r = time.getDate().toString().padStart(2, '0') // 日子
    //   return `${y}-${m}-${r}`
    // },
    toPercent (point) {
      var str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },
    // 分析
    onSubmit (sourceName) {
      // console.log('submit!')
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.show = false
          this.initChart(sourceName)
          this.$nextTick(() => {
            this.show = true
          })
        }
      })
    },
    initChart (sourceName) {
      // this.allChartData = {}
      this.crowdName = ''
      // const params = {
      //   crowdId: 10013,
      //   sourceNameList: '影视VIP,奇异果VIP,4K花园',
      //   startDate: '2022-07-18',
      //   endDate: '2022-07-19',
      //   sourceName: sourceName || ''
      // }

      const params = {
        crowdId: this.formInline.crowdId,
        sourceNameList: this.formInline.sourceNameList.join(','),
        startDate: this.formInline.timeRange[0],
        endDate: this.formInline.timeRange[1],
        sourceName: sourceName || ''
      }

      // const params = {
      //   crowdId: 3219,
      //   startDate: '2022-05-11',
      //   endDate: '2022-06-10'
      // }
      // 先查询人群是否存在，若存在，再去分析
      this.$service.crowdEdit({ crowdId: params.crowdId }).then(res => {
        this.crowdName = res.policyCrowds.crowdName

        // 获取所有图表数据
        this.$service.rightsInterestsOutcome(params).then(res => {
        // this.allData = res || {}
          this.loading = false
          if (!res.overview) {
            this.emptyTxt = '数据正在分析中，请稍后重试'
            this.allChartData = {}
            return
          }
          this.overview = res.overview.data || {}
          this.allChartData = res || {}
          // 概览 - 漏斗图
          this.show = true
          this.$nextTick(() => {
            this.showFunnel('chart1', this.overview)
            // 详情图表
            this.drawChart()
          })
        })
      }).catch(() => {
        // console.log('err--------------->', err)
        // this.allChartData = {}
        this.loading = false
      })
    },

    drawChart () {
      const rowObj = this.rowObj
      const rowObj2 = this.rowObj2
      rowObj.forEach(item => {
        // key 是代表 ref 值
        for (let key in item) {
          if (item[key].type === 'line') {
            this.showLine(this.allChartData[key], key)
          } else if (item[key].type === 'bar') {
            this.showBar(this.allChartData[key], key)
          } else if (item[key].type === 'pie') {
            this.showPie(this.allChartData[key], key)
          }
        }
      })
      rowObj2.forEach(item => {
        // key 是代表 ref 值
        for (let key in item) {
          if (item[key].type === 'line') {
            this.showLine(this.allChartData[key], key)
          } else if (item[key].type === 'bar') {
            this.showBar(this.allChartData[key], key)
          } else if (item[key].type === 'pie') {
            this.showPie(this.allChartData[key], key)
          }
        }
      })
    },
    //  折线图
    showLine (data, chartID) {
      let hasY2 = false
      // console.log('showLine======111>>>', ...arguments)
      if (data && data.xaxis && data.xaxis.length > 0) {
        const series = data.series || []
        let legendData = series.map((key) => {
          return key.name
        })
        let linesData = series.map((key) => {
          if (data.yunit === '%') {
            const arr = key.value.map(v => v * 100)
            return { name: key.name, data: arr, type: 'line' }
          } else {
            return { name: key.name, data: key.value, type: 'line' }
          }
        })
        if (data.series2) {
          hasY2 = true
          const series2 = data.series2 || []
          let legendData2 = series2.map((key) => {
            return key.name
          })
          let linesData2 = series2.map((key) => {
            if (data.yunit === '%') {
              const arr = key.value.map(v => v * 100)
              return { name: key.name, data: arr, type: 'line', yAxisIndex: 1 }
            } else {
              return { name: key.name, data: key.value, type: 'line', yAxisIndex: 1 }
            }
          })
          legendData = legendData.concat(legendData2)
          linesData = linesData.concat(linesData2)
          console.log('legendData===', legendData)
          console.log('linesData===', linesData)
        }
        let yAxisObjName1 = ''
        let yAxisObjName2 = ''
        if (chartID === 'vipPlayTrend') {
          yAxisObjName1 = '人数'
          yAxisObjName2 = '时长'
        }
        if (chartID === 'vipPkgPayTrend') {
          yAxisObjName1 = '人数'
          yAxisObjName2 = '金额'
        }

        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit, hasY2, yAxisObjName1, yAxisObjName2)
      }
    },

    //  柱状图
    showBar (data, chartID) {
      // console.log('showBar======111>>>', ...chartID)
      if (data && data.xaxis && data.xaxis.length > 0) {
        if (data.yunit === '%') {
          data.series = data.series.map(v => v * 100)
        }
        console.log('23333=========>', data)
        this.setBarEchart(chartID, '', data.xaxis, data.series, data.xunit, data.yunit, data.dataaxis)
      }
    },
    //  环形图
    showPie (data, chartID) {
      console.log('showBar======111>>>', data)
      if (data.data) {
        const d = data.data.map((v, index) => {
          return {
            ...v,
            value: v.count
            // name: '123'
          }
        })
        console.log('d==------------------------>', d)
        console.log('d==------------------------>', chartID)
        // showPie
        // console.log('')
        this.setPie(chartID, d)
      }
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '', dataaxis = []) {
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      const _this = this
      let echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      let myChart = echarts.init(document.getElementById(element))
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          // trigger: 'item',
          trigger: 'axis',
          formatter: function (parmas) {
            // console.log('parmas------------->', parmas)

            let str = parmas[0].marker + parmas[0].name + '<br/>'
            // let str = ''
            for (let item of parmas) {
              str = str + item.name + ': ' + _this.cc_format_number(item.value) + yunit + '<br/>' + '占比: ' + dataaxis[item.dataIndex]
            }
            // return _this.cc_format_number(a.data)
            return str
          }
        },
        color: _this.colorList,
        dataZoom: [
          {
            disabled: yData.length <= 10,
            type: 'inside'
          },
          {
            show: yData.length > 10,
            type: 'slider'
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          barWidth: yData.length > 10 ? '30%' : 20, // 10%
          label: {
            show: true,
            position: 'top',
            formatter: function (data) {
              // console.log('value----->', data.dataIndex)
              return `${dataaxis[data.dataIndex]}`
            },
            color: '#000'
          }
        }]
      }, true)

      if (element === 'vipPkgShow' || element === 'vipPkgXiadan' || element === 'vipPkgPay' || element === 'vipPlay') {
        myChart.getZr().off('click')
        myChart.getZr().on('click', params => {
          let pointInPixel = [params.offsetX, params.offsetY]
          if (myChart.containPixel('grid', pointInPixel)) {
            let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
            // console.log(xIndex)
            // console.log(xData)
            const sourceName = xData[xIndex]
            // alert(1)
            _this.onSubmit(sourceName)
            // console.log('current--------->', sourceName)
          }
        })
      }

      this.allCharts[element] = myChart
    },
    getAAA (sourceName) {
      const params = {
        crowdId: 10013,
        sourceNameList: '影视VIP,奇异果VIP,4K花园',
        startDate: '2022-07-18',
        endDate: '2022-07-19',
        sourceName
      }

      // })
      // const params = {
      //   crowdId: this.crowdId,
      //   startDate: this.timeRange[0],
      //   endDate: this.timeRange[1]
      // }

      // const params = {
      //   crowdId: 3219,
      //   startDate: '2022-05-11',
      //   endDate: '2022-06-10'
      // }

      // 获取所有图表数据
      this.$service.rightsInterestsOutcome(params).then(res => {

      })
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '', hasY2 = false, yAxisObjName1 = '', yAxisObjName2 = '') {
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      let echarts = require('echarts')
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
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
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
      let myChart = echarts.init(document.getElementById(element))
      myChart.setOption(option, true)
      this.allCharts[element] = myChart
    },

    // 环形图
    setPie (element, data) {
      // console.log('aaaaaaaaaaa--------------->', element)
      // console.log('aaaaaaaaaaa--------------->', data)
      // const name = '登录量'
      const _this = this
      const option = {
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   top: '5%',
        //   left: 'right',
        //   orient: 'vertical'
        // },
        legend: {
          // show: legend.show, // 展示图例
          x: 'right', // 水平居右
          y: 'center', // 垂直居中
          icon: 'circle', // 图例icon为方块
          backgroundColor: 'transparent',
          itemHeight: 10, // 图例icon高度
          itemWidth: 10, // 图例icon宽度
          orient: 'vertical', // 垂直排列
          type: 'scroll', // 可滚动翻页的图例
          pageIconSize: 8, // 翻页按钮大小
          pageIconColor: '#2C86FF', // 翻页箭头颜色
          pageIconInactiveColor: 'rgba(44,132,251,0.40)', // 翻页（即翻页到头时箭头的颜色
          pageTextStyle: {
            color: '#999' // 翻页数字颜色
          },
          align: 'left', // 图例icon在左侧
          formatter: function (name) {
            // console.log('p------->', name)
            // 文字太长时只取20个字符
            // const label = p.length > 20 ? p.substr(0, 20) : p
            // 文字宽度：后台设有宽度时使用后台传的值，若没有默认70
            // const width = 70
            // 渲染图例文字
            // return echarts.format.truncateText(label, width, '14px Microsoft Yahei', '…')
            // widthStyle 对应为legend.textStyle.rich中的key名，可设置label显示的样式
            // return `{widthStyle|${label}}`
            // return label
            let tarValue
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                tarValue = data[i].percent
              }
            }

            // return [`{name|${name}}`, `{num|${tarValue}}`].join(' |  ')
            return `{name|${name}}    |    {num|${tarValue}}`
          },
          // tooltip: {
          //   show: true, // 显示图例的tooltip
          //   textStyle: {
          //     width: 300, // 提示框宽度300
          //     overflow: 'breakAll' // 文字太长时换行
          //   },
          //   formatter: (val) => {
          //     // 图例最大宽度为600px, 超出部分隐藏
          //     return `<p style="max-width: 600px;overflow:hidden;white-space:pre-wrap;">${val.name}</p>`
          //   }
          // },

          textStyle: {
            color: '#464c54', // 图例文字颜色
            rich: {
              name: {
                fontSize: 14,
                height: 30,
                color: '#011'
                // padding: [0, 0, 20, 0]
              },
              num: {
                fontSize: 12,
                fontWeight: 100,
                // padding: [0, 0, 20, 0],
                color: '#000'
              }
            }
            // rich: {
            //   widthStyle: {
            //     width: legend.sideWidth ? (legend.sideWidth - 30) : 50,
            //     overflow: "hidden"
            //   }
            // }
          }
        },
        color: _this.colorList,

        series: [
          {
            // name: 'Access From',
            type: 'pie',
            // radius: ['40%', '70%'],
            // avoidLabelOverlap: true,

            center: ['25%', 'center'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: true,
            // itemStyle: {
            //   // borderRadius: 10,
            //   // borderColor: '#fff',
            //   // borderWidth: 2,
            //   normal: {
            //     color: function (colors) {
            //       var colorList = [
            //         '#fc8251',
            //         '#5470c6',
            //         '#91cd77',
            //         '#ef6567',
            //         '#f9c956',
            //         '#75bedc'
            //       ]
            //       return colorList[colors.dataIndex]
            //     }
            //   }
            // },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30'
                // fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ]
      }
      let echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      let myChart = echarts.init(document.getElementById(element))

      myChart.setOption(option)
      this.allCharts[element] = myChart
    }

  }
}
</script>

<style lang='stylus' scoped>
// .ibox {
//   border-radius: 4px;
//   min-height: 36px;
//   background red
// }
.wrap-div{
  display: flex;
  justify-content: space-between;
}
.ibox {
  margin-bottom: 25px;
  background-color: #fff;
  // border: 1px solid #e7eaec;
  border-radius: 4px;
  padding: 15px 20px 20px 20px;
  height: 139px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.big-title{
  color rgb(103, 106, 108)
  font-family "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif
  font-size 26px
  font-weight 100
  margin 10px 0
}
.overview-table{
  flex: 1 0 730px
  color rgb(103, 106, 108)
}
.title-one{
  // margin-top: 5px;
  // margin-bottom: 20px;
  font-size 12px
  font-weight 600
}
.text-two{
  font-size 24px
  // margin-bottom 15px
  // margin-top 5px
  color rgb(26, 179, 148)
  text-align: center;
}
.small-box {
  display flex
  justify-content: end
  flex-direction: column;
}
.small{
  display inline
  font-size 13.3333px
  display flex
  justify-content: space-between
  align-content: space-around
  margin-top: 15px
}
// .small:nth-child(1) {
//   margin-bottom 10px
// }
.chart-wrap {
  flex: 0.8 0 550px;
}
.chart-1{
  width: 550px;
  height: 360px;
  margin: 0 auto;
}

.launch-statistics{
  // overflow hidden
  // position: relative;
  // height: 100%;
  // overflow: auto;
  // box-sizing: border-box;
}
.statistics-header {
  position: sticky;
  top: 0;
  z-index: 1
  background: #fff
  padding-bottom 20px
}
.chart-div{
  height: 436px
}

.unit-box {
  // margin-bottom: 0;
  background-color: #fff;
  // border: 1px solid #ddd;
  border-radius: 4px;
  height: 100%;
  // -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
}
.unit-header {
  border-bottom: 1px solid #e7eaec
  line-height: 56px;
  padding: 0 15px;
  font-size: 14px;
}
</style>
