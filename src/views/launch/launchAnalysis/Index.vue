<template>
 <div class='' id='' style="background: #f3f4fa; margin: -20px; padding: 20px;">
  <!-- {{ formInline }} -->
  <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
    <el-form-item label="人群ID:" prop="userId">
      <el-input v-model="formInline.userId" placeholder="请输入"></el-input>
    </el-form-item>

    <el-form-item label="分析周期:" prop="timeRange">
       <el-date-picker
          v-model="formInline.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        >
      </el-date-picker>
    </el-form-item>
    <br/>
    <el-form-item label="业务范围:" prop="type">
      <el-checkbox-group v-model="formInline.type">
        <el-checkbox :label="0" name="type">全选</el-checkbox>
        <el-checkbox :label="1" name="type">影视VIP</el-checkbox>
        <el-checkbox :label="2" name="type">奇异果VIP</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">分析</el-button>
    </el-form-item>
  </el-form>

  <!-- 总览 -->
  <div >
    <div class="big-title">总览</div>
    <div class="wrap-div">
      <div class="overview-table">
        <el-row :gutter="20">

          <el-col :span="8"><div class="ibox">
            <div class="title-one">主页活跃人数</div>
            <div class="text-two">
              126,560
            </div>
            <div class="small-box">
              <div class="small">
                <span>圈定用户数</span>
                <span>666666666</span>
              </div>
            </div>
          </div></el-col>

          <el-col :span="8"><div class="ibox">
            <div class="title-one">起播活跃率</div>
            <div class="text-two">
              78%
            </div>
            <div class="small-box">
              <div class="small">
                <span>起播人数</span>
                <span>主页活跃人数</span>
              </div>
              <div class="small">
                <span>圈定用户数</span>
                <span>666666666</span>
              </div>
            </div>
          </div></el-col>

          <el-col :span="8"><div class="ibox">
            <div class="title-one">产品包曝光率</div>
            <div class="text-two">
              78%
            </div>
            <div class="small-box">
              <div class="small">
                <span>产品包曝光人数</span>
                <span>666666666</span>
              </div>
              <div class="small">
                <span>起播人数</span>
                <span>666666666</span>
              </div>
            </div>
          </div></el-col>

        </el-row>

        <el-row :gutter="20">

          <el-col :span="8"><div class="ibox">
            <div class="title-one">下单率</div>
            <div class="text-two">
              78%
            </div>
            <div class="small-box">
              <div class="small">
                <span>下单人数</span>
                <span>111111</span>
              </div>
              <div class="small">
                <span>曝光人数</span>
                <span>666666666</span>
              </div>
            </div>
          </div></el-col>

          <el-col :span="8"><div class="ibox">
            <div class="title-one">产品包曝光率</div>
            <div class="text-two">
              78%
            </div>
            <div class="small-box">
              <div class="small">
                <span>付费人数</span>
                <span>666666666</span>
              </div>
              <div class="small">
                <span>曝光人数</span>
                <span>666666666</span>
              </div>
            </div>
          </div></el-col>

          <el-col :span="8"><div class="ibox">
            <div class="title-one">付费金额</div>
            <div class="text-two" style="height: 70px">
              126,560
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
          <template v-if="show">
            <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj2" :key="index">
              <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
                <div class="unit-box" >
                  <div class="unit-header clearfix"><span v-if="chart.title">{{ chart.title }}</span></div>
                  <div class="unit-content" v-if="chart.title">
                    <div v-if="allChartData[key] && allChartData[key].series" :ref="key" :id="key" class="chart-div"></div>
                    <div v-else class="chart-div">
                      <el-empty :description="allChartData[key] || '暂无数据'"></el-empty>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

          </template>
          <el-row :gutter="20" class="unit-row" >
            <el-col :span="12">
              <div class="unit-box" >
                <div class="unit-header clearfix">
                  观影分类占比
                </div>
                <div class="unit-content" >
                  <div ref="pie1" class="chart-1"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="unit-box" >
                <div class="unit-header clearfix">
                  观影分类占比
                </div>
                <div class="unit-content" >
                  <div ref="pie2" class="chart-1"></div>
                </div>
              </div>
            </el-col>
          </el-row>

      </div>

    </el-tab-pane>

    <el-tab-pane label="付费型" name="two">

      <!-- 柱状图、折线图 -->
      <div class="launch-statistics">
          <template v-if="show">
            <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj" :key="index">
              <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
                <div class="unit-box" >
                  <div class="unit-header clearfix"><span v-if="chart.title">{{ chart.title }}</span></div>
                  <div class="unit-content" v-if="chart.title">
                    <div v-if="allChartData[key] && allChartData[key].series" :ref="key" :id="key" class="chart-div"></div>
                    <div v-else class="chart-div">
                      <el-empty :description="allChartData[key] || '暂无数据'"></el-empty>
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
</template>

<script>
export default {
  components: {},
  data () {
    return {
      formInline: {
        userId: '',
        type: [],
        timeRange: []
      },
      rules: {
        userId: [
          { required: true, message: '请输入人群ID', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        timeRange: [
          { type: 'array', required: true, message: '请选择日期', trigger: 'change' }
        ],
        type: [
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
          'crowdGroup_h_2': { type: 'bar', title: '各权益曝光人数及占比', span: 8 },
          'crowdGroup_h_3': { type: 'bar', title: '各权益下单人数及占比', span: 8 },
          'crowdGroup_h_4': { type: 'bar', title: '各权益付费人数及占比', span: 8 }
        }, {
          'crowdGroup_l_3': { type: 'line', title: '影视VIP曝光趋势', span: 8 },
          'crowdGroup_l_4': { type: 'line', title: '影视VIP下单趋势', span: 8 },
          'crowdGroup_l_5': { type: 'line', title: '影视VIP付费趋势', span: 8 }
        }, {
          'crowdGroup_h_5': { type: 'bar', title: '影视VIP曝光路径人数及占比', span: 8 },
          'crowdGroup_h_8': { type: 'bar', title: '影视VIP下单产品包分类人数及占比', span: 8 },
          'crowdGroup_h_6': { type: 'bar', title: '影视VIP付费路径人数及占比', span: 8 }
        },
        {
          'empty1': { span: 8 },
          'empty2': { span: 8 },
          'crowdGroup_h_7': { type: 'bar', title: '影视VIP付费产品包分类人数及占比', span: 8 }
        }
      ],
      rowObj2: [
        {
          'crowdGroup_h_2': { type: 'bar', title: '各权益起播人数及占比', span: 12 },
          'crowdGroup_h_3': { type: 'bar', title: '影视VIP起播趋势', span: 12 }
        }
      ],
      crowdId: 11882
      // policyId: 4323
    }
  },
  mounted () {
    this.showFunnel()

    const data = [
      { value: 1048, name: '电视剧' },
      { value: 735, name: '电影' },
      { value: 580, name: '综艺' },
      { value: 484, name: '纪录片' },
      { value: 300, name: '少儿' },
      { value: 300, name: '其他' }
    ]
    this.setPie('pie1', data)
    this.setPie('pie2', data)

    // chart5
    // 图表自适应
    window.addEventListener('resize', () => {
      for (var key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })

    this.show = false
    this.initRange()
    this.initChart()
    this.$nextTick(() => {
      this.show = true
    })
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
      this.show = false
      this.initRange()
      this.initChart()
      this.$nextTick(() => {
        this.show = true
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    // 漏斗图
    showFunnel () {
      const option = {
        title: {
          text: '漏斗图'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
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
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
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
            data: [
              { value: 60, name: 'Visit' },
              { value: 40, name: 'Inquiry' },
              { value: 20, name: 'Order' },
              { value: 80, name: 'Click' },
              { value: 100, name: 'Show' }
            ]
          }
        ]
      }
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs['chart1'])

      myChart.setOption(option)
    },
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
      this.allChartData = {}

      const params = {
        crowdId: this.crowdId,
        startDate: this.timeRange[0],
        endDate: this.timeRange[1]
      }

      // const params = {
      //   crowdId: 3219,
      //   startDate: '2022-05-11',
      //   endDate: '2022-06-10'
      // }

      // 获取所有图表数据
      this.$service.getPolicySixIndexStats2(params).then(res => {
        this.allChartData = res || {}

        this.$nextTick(() => {
          const rowObj = this.rowObj
          const rowObj2 = this.rowObj2
          rowObj.forEach(item => {
            // key 是代表 ref 值
            for (let key in item) {
              if (item[key].type === 'line') {
                this.showLine(this.allChartData[key], key)
              } else {
                this.showBar(this.allChartData[key], key)
              }
            }
          })
          rowObj2.forEach(item => {
            // key 是代表 ref 值
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

    //  柱状图
    showBar (data, chartID) {
      // console.log('showBar======111>>>', ...chartID)
      if (data && data.xaxis) {
        if (data.yunit === '%') {
          data.series = data.series.map(v => v * 100)
        }
        this.setBarEchart(chartID, '', data.xaxis, data.series, data.xunit, data.yunit)
      }
    },

    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '') {
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
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
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          barWidth: '10%',
          label: {
            show: true
          }
        }]
      }, true)
      this.allCharts[element] = myChart
    },

    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '') {
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      let echarts = require('echarts')
      // let myChart = echarts.init(this.$refs[element])
      let myChart = echarts.init(document.getElementById(element))
      myChart.setOption({
        title: {
          text: title || '多线性图'
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
    },

    // 环形图
    setPie (element, data) {
      // const name = '登录量'
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
            console.log('p------->', name)
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
                tarValue = data[i].value
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
        color: ['#fc8251', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],
        series: [
          {
            name: 'Access From',
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
      let myChart = echarts.init(this.$refs[element])

      myChart.setOption(option)
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
