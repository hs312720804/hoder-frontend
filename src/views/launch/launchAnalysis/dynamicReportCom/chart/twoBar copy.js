export function drawTwoBarChart () {
  const echarts = require('echarts')

  const xData = ['建筑石用材建筑石用材建筑石用材建筑石用材建筑石用材建筑石用材', '电（热）能', '矿石', '其他']
  const lastYearData = [88, 59, 32, 15]
  const thisYearData = [99.45, 72.69, 53.46, 30.22]
  const timeLineData = [1]
  const textColor = '#fff'
  const lineColor = 'rgba(255,255,255,0.2)'
  const colors = [{
    borderColor: 'rgba(2, 191, 232,1)',
    start: 'rgba(2, 191, 232,0.8)',
    end: 'rgba(2, 191, 232,0.1)'
  },
  {
    borderColor: 'rgba(1, 231, 152,1)',
    start: 'rgba(1, 231, 152,0.1)',
    end: 'rgba(1, 231, 152,0.8)'
  }]
  // 基于准备好的dom，初始化echarts实例
  const myLineChart = echarts.init(
    document.getElementById('lineChart')
  )
  // 指定图表的配置项和数据
  const option = {
    baseOption: {
      // backgroundColor: background,
      timeline: {
        show: false,
        top: 0,
        data: []
      },
      grid: [
        {
          show: false,
          left: '12%',
          top: '0%',
          bottom: '0%',
          containLabel: true,
          width: '28%'
        },
        {
          show: false,
          left: '52.5%',
          top: '0%',
          bottom: '18%',
          width: '0%'
        },
        {
          show: false,
          right: '12%',
          top: '0%',
          bottom: '0%',
          containLabel: true,
          width: '28%'
        }
      ],
      axisPointer: {
        link: { xAxisIndex: 'all' }
      },
      xAxis: [
        {
          type: 'value',
          inverse: true, // 强制设置坐标轴分割间隔
          axisLine: { // 坐标轴轴线相关设置
            show: true, // 是否显示坐标轴轴线
            onZero: true, // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
            lineStyle: {
              color: '#00A5CA45'
            }
          },
          axisTick: {
            show: true
          },
          position: 'bottom',
          axisLabel: {
            show: true,
            color: '#c6d3d7',
            fontSize: 12,
            fontFamily: 'DINPro-Regular'
          },
          splitLine: {
            show: false
          }
        },
        {
          gridIndex: 1,
          show: false
        },
        {
          gridIndex: 2,
          axisLine: {
            show: true, // 是否显示坐标轴轴线
            onZero: true, // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
            lineStyle: {
              color: 'rgba(1, 231, 152, 0.3)'
            }
          },
          axisTick: {
            show: true
          },
          position: 'bottom',
          axisLabel: {
            show: true,
            color: '#c6d3d7',
            fontSize: 12,
            fontFamily: 'DINPro-Regular'
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          inverse: true,
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00A5CA45'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          data: xData
        },
        {
          gridIndex: 1,
          type: 'category',
          inverse: true,
          position: 'left',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            // padding:[-5,0,20,0],
            textStyle: {
              color: '#c1cbcc',
              fontSize: 12,
              fontFamily: 'pmzd_title'
            },
            align: 'center'
          },
          data: xData.map(function (value) {
            return {
              value: value,
              textStyle: {
                align: 'center'
              }
            }
          })
        },
        {
          gridIndex: 2,
          type: 'category',
          inverse: true,
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: lineColor
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          data: xData
        }
      ],
      series: []
    },
    options: []
  }
  option.baseOption.timeline.data.push(timeLineData[0])
  option.options.push({
    series: [
      {
        name: '2017',
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: true, // 开启显示
              position: 'left', // 在上方显示
              textStyle: { // 数值样式
                color: colors[0].borderColor,
                fontSize: 12
              }
            },
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: colors[0].start
            },
            {
              offset: 1,
              color: colors[0].end
            }
            ]),
            borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: colors[0].borderColor
            },
            {
              offset: 1,
              color: colors[0].end
            }
            ]),
            borderWidth: 1
          }
        },
        data: lastYearData,
        animationEasing: 'elasticOut'
      },
      {
        name: '2018',
        type: 'bar',
        // stack: "2",
        // barWidth: 25,
        xAxisIndex: 2,
        yAxisIndex: 2,
        itemStyle: {
          normal: {
            label: {
              show: true, // 开启显示
              position: 'right', // 在上方显示
              textStyle: { // 数值样式
                color: colors[1].borderColor,
                fontSize: 12
              }
            },
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: colors[1].start
            },
            {
              offset: 1,
              color: colors[1].end
            }
            ]),
            borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: colors[1].start
            },
            {
              offset: 1,
              color: colors[1].borderColor
            }
            ]),
            borderWidth: 1
          }
        },
        data: thisYearData,
        animationEasing: 'elasticOut'
      }
    ]
  })
  // 使用刚指定的配置项和数据显示图表。
  myLineChart.setOption(option)
  // return option
}
