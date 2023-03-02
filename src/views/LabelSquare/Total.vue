<template>
  <div class="total-wrap">
    <div class="max-top box">
      <div class="title">使用最多TOP30</div>
      <div class="content-wrap">
        <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
          <div class="lists-wrap">
            <div v-for="(item, index) in topMax30" :key="index" class="lists-item">
              <span class="item-index">{{ index + 1 }}、</span>
              {{ item.tagName }}
              <span class="item-type">{{ item.tagCategory }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="min-top box">
      <div class="title">使用最少TOP30</div>
      <div class="content-wrap">
        <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
          <div class="lists-wrap">
            <div v-for="(item, index) in topMin30" :key="index" class="lists-item">
              <span class="item-index">{{ index + 1 }}、</span>
              {{ item.tagName }}
              <span class="item-type">{{ item.tagCategory }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>

    </div>
    <div class="chart-box box">

      <div v-for="(row, index) in rowObj" :key="index">
        <div :span="chart.span" v-for="(chart, key) in row" :key="key">
          <div class="unit-box">

            <div v-if="(show && chart.title)">
              <div
                v-if="allChartData[key] && ((allChartData[key].series && allChartData[key].series.length > 0) || allChartData[key].data)"
                :ref="key" :id="key" class="chart-div"></div>
              <div v-else class="chart-div">
                <el-empty description="暂无数据"></el-empty>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      topMax30: [],
      topMin30: [],
      rowObj: [
        {
          classification: { type: 'pie', title: '标签来源占比', span: 24 }
        },
        {
          addTags: { type: 'bar', title: '各权益付费人数及占比', span: 24 }
        }
      ],
      show: true,
      allCharts: {},
      allChartData: {
        classification: {
          data: [
            {
              count: 30,
              name: '电视剧',
              percent: '76.92%'
            },
            {
              count: 29,
              name: '电影',
              percent: '74.36%'
            },
            {
              count: 24,
              name: '综艺',
              percent: '61.54%'
            },
            {
              count: 14,
              name: '动漫',
              percent: '35.90%'
            },
            {
              count: 14,
              name: '儿童',
              percent: '35.90%'
            },
            {
              count: 3,
              name: '纪录片',
              percent: '7.69%'
            },
            {
              count: 1,
              name: '游戏',
              percent: '2.56%'
            },
            {
              count: 1,
              name: '其他',
              percent: '2.56%'
            }
          ]
          // title: '标签来源占比'
        },
        addTags: {
          xaxis: [
            '影视VIP',
            '酷奇异果VIP',
            '4K花园'
          ],
          yunit: '',
          dataaxis: [
            '0.38%',
            '0.00%',
            '99.62%'
          ],
          series: [
            39,
            0,
            10228
          ],
          series2: null,
          // title: '近一个月新增标签来源',
          xunit: ''
        }
      },
      colorList: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#7ED3F4', '#40B27D', '#FC8452', '#A969C6']
      // colorList: ['#0078ff', '#00ffcc', '#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc']

    }
  },
  created () {
    this.fetchData()
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
    fetchData () {
      this.$service.getTagStatistics().then(res => {
        this.topMax30 = res.topMax30
        this.topMin30 = res.topMin30
        this.allChartData = {
          addTags: res.addTags,
          classification: {
            data: res.classification,
            title: '标签来源占比'
          }
        }
        this.drawChart()

        console.log('this.allChartData===', this.allChartData)
      })
    },
    drawChart () {
      const rowObj = this.rowObj

      rowObj.forEach(item => {
        // key 是代表 ref 值
        for (const key in item) {
          if (item[key].type === 'bar') {
            this.showBar(this.allChartData[key], key)
          } else if (item[key].type === 'pie') {
            this.showPie(this.allChartData[key], key)
          }
        }
      })
    },
    //  柱状图
    showBar (data, chartID) {
      // console.log('showBar======111>>>', ...chartID)
      if (data && data.xaxis && data.xaxis.length > 0) {
        if (data.yunit === '%') {
          data.series = data.series.map(v => v * 100)
        }
        // console.log('23333=========>', data)
        this.setBarEchart(chartID, data.title, data.xaxis, data.series, data.xunit, data.yunit, data.dataaxis)
      }
    },
    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData, xunit = '', yunit = '', dataaxis = []) {
      const chartElement = document.getElementById(element)
      if (!chartElement) return
      // console.log('setBarEchart======111>>>', this.$refs)
      // console.log('setBarEchart======111>>>', element)
      // console.log('setBarEchart======111>>>', this.$refs[element])
      // let myChart = echarts.init(this.$refs[element])
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(chartElement)
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          // trigger: 'item',
          trigger: 'axis',
          formatter: function (parmas) {
            let str = parmas[0].seriesName + '<br/>' + parmas[0].marker
            // let str = ''
            for (const item of parmas) {
              str = str + item.name + ': ' + _this.cc_format_number(item.value) + yunit + '<br/>'
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
          name: title,
          // data: yData.length === 0 ? this.fillEmptyData.data : yData,
          data: yData,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          barWidth: yData.length > 10 ? '30%' : 20 // 10%
          // label: {
          //   show: true,
          //   position: 'top',
          //   formatter: function (data) {
          //     // console.log('value----->', data.dataIndex)
          //     return `${dataaxis[data.dataIndex]}`
          //   },
          //   color: '#000'
          // }
        }]
      }, true)

      if (element === 'vipPkgShow' || element === 'vipPkgXiadan' || element === 'vipPkgPay' || element === 'vipPlay') {
        myChart.getZr().off('click')
        myChart.getZr().on('click', params => {
          const pointInPixel = [params.offsetX, params.offsetY]
          if (myChart.containPixel('grid', pointInPixel)) {
            const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
            // console.log(xIndex)
            // console.log(xData)
            const sourceName = xData[xIndex]
            _this.onSubmit(sourceName)
            // console.log('current--------->', sourceName)
          }
        })
      }

      this.allCharts[element] = myChart
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
          // show: legend.show, // 展示图例
          x: 'right', // 水平居右
          y: 'center', // 垂直居中
          // icon: 'circle', // 图例icon为方块
          backgroundColor: 'transparent',
          itemHeight: 10, // 图例icon高度
          itemWidth: 20, // 图例icon宽度
          orient: 'vertical', // 垂直排列
          type: 'scroll', // 可滚动翻页的图例
          pageIconSize: 8, // 翻页按钮大小
          pageIconColor: '#2C86FF', // 翻页箭头颜色
          pageIconInactiveColor: 'rgba(44,132,251,0.40)', // 翻页（即翻页到头时箭头的颜色
          pageTextStyle: {
            color: '#999' // 翻页数字颜色
          },
          align: 'left', // 图例icon在左侧
          // formatter: function (name) {
          //   let tarValue
          //   for (let i = 0; i < data.length; i++) {
          //     if (data[i].name === name) {
          //       tarValue = data[i].percent
          //     }
          //   }

          //   // return [`{name|${name}}`, `{num|${tarValue}}`].join(' |  ')
          //   return `{name|${name}}    |    {num|${tarValue}}`
          // },
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
          }
        },
        color: _this.colorList,

        series: [
          {
            // name: 'Access From',
            type: 'pie',
            // radius: ['40%', '70%'],
            // avoidLabelOverlap: true,

            // center: ['40%', 'center'],
            // radius: ['40%', '60%'],
            // avoidLabelOverlap: true,
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
            // label: {
            //   show: false,
            //   position: 'center'
            // },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            // labelLine: {
            //   show: false
            // },
            data
          }
        ]
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

<style lang='stylus' scoped>
.total-wrap
  display grid
  grid-template-columns: 22% 22% minmax(0, 1fr)
  height 100%
  background: #f3f4fa;
.box
  border-right 1px dashed #e9e9e9
  position relative
.content-wrap
  position: absolute;
  width: 100%;
  bottom: 12px;
  top: 46px;
  overflow: auto;
.title {
  padding: 10px 16px 20px
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 16px;
}
.lists-wrap {
  padding: 0 15px 15px
}
.lists-item {
  font-size: 14px;
  color: #666;
  word-break: break-word;
  margin-bottom 10px
}
.item-index {
  font-size: 12px;
}
.item-type {
  font-size: 12px;
  margin-right: 10px;
  color: #67C23A;
  margin-left 5px
}
.unit-box {
  border-radius: 4px;
  height: 100%;
  background #f3f4fa
}
#classification
  height: calc(50vh - 80px)

#addTags
  height: calc(50vh - 160px)
.chart-box {
  padding: 20px;
}

</style>
