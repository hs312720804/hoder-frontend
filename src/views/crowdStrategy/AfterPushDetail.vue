<template>
  <!-- 投后效果分析弹窗 -->
<div class='' id=''>
  <div class="export-button">
    <a :href="launchedExportUrl" download ref="launchedDownLoad"></a>
    <el-button type="success" @click="handleLaunchedExport">导出数据</el-button>
  </div>
  <el-row :gutter="20" class="unit-row">
    <el-col :span="12">
      <div class="unit-box">
          <div class="unit-header clearfix">
            {{hitLinesTitle}}
          </div>
          <div class="click-date-picker">
            <el-date-picker
              :value="time0"
              @input="handleInputTime(0, $event, 'drawCrowdLine')"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="unit-content">
              <div class="main" ref="hitLine" v-if="showStatistics === true"></div>
          </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="unit-box">
          <div class="unit-header clearfix">
            {{ hitLinesTitle }}
          </div>
          <div class="click-date-picker">
            <el-date-picker
              :value="time1"
              @input="handleInputTime(1, $event, 'drawCrowdPie')"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="unit-content">
            <div class="main" ref="hitPie" v-if=" showStatistics === true"></div>
          </div>
      </div>
    </el-col>
  </el-row>
  <!-- <div class="crowd-statistic">
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
          :value="time0"
          @input="handleInputTime(0, $event, 'drawCrowdLine')"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{hitLinesTitle}}</div>
      <div class="main" ref="hitPie" v-if=" showStatistics === true"></div>
    </div>
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time1"
                @input="handleInputTime(1, $event, 'drawCrowdPie')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{ hitPieTitle }}</div>
      <div class="main" ref="hitPie" v-if=" showStatistics === true"></div>
    </div>
  </div> -->
  <!-- <div class="crowd-statistic">
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time2"
                @input="handleInputTime(2, $event, 'drawExposeLine')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{exposeLinesTitle}}</div>
      <div class="main" ref="exposeLine" v-if=" showStatistics === true"></div>
    </div>
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time3"
                @input="handleInputTime(3, $event, 'drawExposePie')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{exposePieTitle}}</div>
      <div class="main" ref="exposePie" v-if=" showStatistics === true"></div>
    </div>
  </div>
  <div class="crowd-statistic">
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time4"
                @input="handleInputTime(4, $event, 'drawClickLine')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{clickLinesTitle}}</div>
      <div class="main" ref="clickLine" v-if=" showStatistics === true"></div>
    </div>
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time5"
                @input="handleInputTime(5, $event, 'drawClickPie')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{clickPieTitle}}</div>
      <div class="main" ref="clickPie" v-if=" showStatistics === true"></div>
    </div>
  </div>
  <div class="crowd-statistic">
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time6"
                @input="handleInputTime(6, $event, 'crowdLaunchDetail')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{crowdLaunchTitle}}</div>
      <div class="funnel-tips">人群投放过程中的数据（单位：条）</div>
      <div class="main" ref="crowdLaunch" v-if=" showStatistics === true"></div>
    </div>
    <div class="echarts-container">
      <div class="click-date-picker">
        <el-date-picker
                :value="time7"
                @input="handleInputTime(7, $event, 'setProvinceData')"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div class="lines-title">{{exposeProvinceTitle}}</div>
      <div class="main" ref="exposeProvince" v-if=" showStatistics === true"></div>
    </div>
  </div> -->
</div>
</template>

<script>
export default {
  components: {},
  props: {
    currentCid: {
      type: [Number, String],
      default: ''
    },
    showStatistics: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      launchedExportUrl: undefined,
      time0: [],
      time1: [],
      time2: [],
      time3: [],
      time4: [],
      time5: [],
      time6: [],
      time7: [],
      hitLinesTitle: '',
      hitPieTitle: '',
      exposeLinesTitle: '',
      exposePieTitle: '',
      clickLinesTitle: '',
      clickPieTitle: '',
      crowdLaunchTitle: '',
      exposeProvinceTitle: '',
      startDate: '',
      endDate: '',
      fillEmptyData: {
        data: [{ name: '总量', value: 0 }],
        name: { data: ['总量'] }
      },
      colorList: ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc']
    }
  },
  created () {
    const start = new Date()
    const end = new Date()
    this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
    this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
    this.showCrowdDetailDialog()
  },
  methods: {
    handleInputTime (index, val, method) {
      debugger
      const key = 'time' + index
      const oldVal = this[key]
      if (this.currentCid && oldVal.length !== 0) {
        if (this.setDataInMonth(val[0], val[1])) {
          this[key] = val
          this[method](this.currentCid, val[0], val[1])
        } else {
          this.$message.error('日期间隔最多只能是30天！请重新选择日期')
        }
      }
    },
    setDataInMonth (startDate, endDate) {
      const startTime = new Date(startDate).getTime()
      const endTime = new Date(endDate).getTime()
      const oneMonth = 3600 * 1000 * 24 * 30
      return endTime - startTime <= oneMonth
    },
    formatDate (d) {
      const time = new Date(d)
      const y = time.getFullYear() // 年份
      const m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
      const r = time.getDate().toString().padStart(2, '0') // 日子
      return `${y}-${m}-${r}`
    },
    initTime () {
      this.time0 = [this.startDate, this.endDate]
      this.time1 = [this.startDate, this.endDate]
      this.time2 = [this.startDate, this.endDate]
      this.time3 = [this.startDate, this.endDate]
      this.time4 = [this.startDate, this.endDate]
      this.time5 = [this.startDate, this.endDate]
      this.time6 = [this.startDate, this.endDate]
      this.time7 = [this.startDate, this.endDate]
    },
    //  导出投后效果数据
    handleLaunchedExport () {
      this.launchedExportUrl =
        '/api/crowdAndPolicyStatistics/export/' + this.currentCid +
        '?sHitLineTime=' + this.time0[0] + '&eHitLineTime=' + this.time0[1] +
        '&sHitPieTime=' + this.time1[0] + '&eHitPieTime=' + this.time1[1] +
        '&sExposeLineTime=' + this.time2[0] + '&eExposeLineTime=' + this.time2[1] +
        '&sExposePieTime=' + this.time3[0] + '&eExposePieTime=' + this.time3[1] +
        '&sClickLineTime=' + this.time4[0] + '&eClickLineTime=' + this.time4[1] +
        '&sClickPieTime=' + this.time5[0] + '&eClickPieTime=' + this.time5[1] +
        '&sFunnelTime=' + this.time6[0] + '&eFunnelTime=' + this.time6[1] +
        '&sProvinceTime=' + this.time7[0] + '&eProvinceTime=' + this.time7[1]
      this.$nextTick(() => {
        this.$refs.launchedDownLoad.click()
      })
    },
    // 显示投后效果弹窗
    showCrowdDetailDialog () {
      // this.showStatistics = true
      this.initTime()
      this.drawCrowdPie(this.currentCid, this.time1[0], this.time1[1])
      this.drawCrowdLine(this.currentCid, this.time0[0], this.time0[1])
      // this.drawExposePie(this.currentCid, this.time3[0], this.time3[1])
      // this.drawExposeLine(this.currentCid, this.time2[0], this.time2[1])
      // this.drawClickPie(this.currentCid, this.time5[0], this.time5[1])
      // this.drawClickLine(this.currentCid, this.time4[0], this.time4[1])
      // this.crowdLaunchDetail(this.currentCid, this.time6[0], this.time6[1])
      // this.setProvinceData(this.currentCid, this.time7[0], this.time7[1])
    },
    // 统计投后效果---开始
    drawCrowdPie (id, startTime, endTime) {
      this.$service.hitAndBiToTalPie({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        if (data.data.length === 0) { this.hitPieTitle = '累计命中次数按业务分布暂无数据' } else { this.hitPieTitle = '累计命中次数按业务分布' }
        this.setCircleEcharts('hitPie', '', data.name, data.data, true)
      })
    },
    drawCrowdLine (id, startTime, endTime) {
      this.$service.hitAndBiToTalLine({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        const legendData = data.series.map((key) => {
          return key.name
        })
        const linesData = data.series.map((key) => {
          return { name: key.name, data: key.data, type: 'line' }
        })
        this.hitLinesTitle = '该人群总命中量以及各业务的命中量'
        this.setLinesEchart('hitLine', '', data.date, linesData, legendData)
      })
    },
    drawExposePie (id, startTime, endTime) {
      this.$service.exposeCrowdTotalPie({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        if (data.data.length === 0) { this.exposePieTitle = '累计曝光数按业务分布暂无数据' } else { this.exposePieTitle = '累计曝光数按业务分布' }
        this.setCircleEcharts('exposePie', '', data.name, data.data, true)
      })
    },
    drawExposeLine (id, startTime, endTime) {
      this.$service.exposeCrowdTotalLine({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        const legendData = data.series.map((key) => {
          return key.name
        })
        const linesData = data.series.map((key) => {
          return { name: key.name, data: key.data, type: 'line' }
        })
        this.exposeLinesTitle = '该人群总曝光量以及各业务的曝光量'
        this.setLinesEchart('exposeLine', '', data.date, linesData, legendData)
      })
    },
    drawClickPie (id, startTime, endTime) {
      this.$service.clickCrowdTotalPie({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        if (data.data.length === 0) { this.clickPieTitle = '累计点击次数按业务分布暂无数据' } else { this.clickPieTitle = '累计点击次数按业务分布' }
        this.setCircleEcharts('clickPie', '', data.name, data.data, true)
      })
    },
    drawClickLine (id, startTime, endTime) {
      this.$service.clickCrowdTotalLine({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        const legendData = data.series.map((key) => {
          return key.name
        })
        const linesData = data.series.map((key) => {
          return { name: key.name, data: key.data, type: 'line' }
        })
        this.clickLinesTitle = '该人群总点击以及各业务的点击次数'
        this.setLinesEchart('clickLine', '', data.date, linesData, legendData)
      })
    },
    crowdLaunchDetail (id, startTime, endTime) {
      this.$service.crowdLanuchData({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        if (data.data.length === 0) { this.crowdLaunchTitle = '该人群投放数据漏斗基本详情暂无数据' } else { this.crowdLaunchTitle = '该人群投放数据漏斗基本详情' }
        this.setFunnelEcharts('crowdLaunch', '', data.names, data.data)
      })
    },
    setProvinceData (id, startTime, endTime) {
      this.$service.exposeProvinceScale({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
        const newData = data.map((item) => {
          return { name: item.name, value: parseFloat(item.value) }
        })
        this.exposeProvinceTitle = '曝光人群省份分布'
        this.setMapEcharts('exposeProvince', '', newData)
      })
    },
    // 圆饼图
    setCircleEcharts (element, title, legend, data, showDetail) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title,
          left: 'center'
        },
        // tooltip: {
        //     trigger: 'item',
        //     formatter: "{a} <br/>{b}: {c} ({d}%)"
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return a.data.name + ':' + _this.cc_format_number(a.data.value) + '(' + a.percent + ')%'
          }
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: legend
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            // center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: showDetail,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: showDetail }
              },
              emphasis: {
                label: {
                  show: showDetail,
                  formatter: '{b}\n{c} ({d}%)',
                  position: 'center',
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            data: (data.length === 0) ? this.fillEmptyData.data : data
          }
        ]
      })
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return _this.cc_format_number(a.data)
          }
          // formatter: function (a) {
          //   return _this.cc_format_number(a.data)
          // }
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
        series: yData
      })
    }
    // 统计投后效果---结束
  }
}
</script>

<style lang='stylus' scoped>
// .echarts-container
  // position relative
  // width 50%
  // height auto
  // float left
// .crowd-statistic
//   border-bottom 1px dashed #ccc
//   &:before
//   &:after
//     display table
//     content ""
//   &:after
//     clear: both
.export-button
  display flex
  justify-content flex-end
.main
  width 100%
  height 400px
  padding 30px
.click-date-picker
  text-align center
  margin 20px 0
// .lines-title
//   position absolute
//   font-size 18px
//   font-weight bold
//   color #000
//   margin-left 25px
// .funnel-tips
//   font-size 14px
//   color #333
//   margin 50px 0 0 25px
</style>
