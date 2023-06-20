import Vue from 'vue'

export function drawTwoBarChart ({ title1, title2 }, xData, yData, xunit = '', yunit = '') {
  const vm = new Vue()
  const echarts = require('echarts')

  const colorList = ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc']
  const seriesData = yData.map(item => {
    return {
      ...item,
      label: {
        show: true,
        // rotate: 90,
        // position: item.xAxisIndex === 2 ? 'bottom' : 'top',
        formatter: function (data) {
          console.log('value----->', item)
          // ${data.seriesName}
          if (item.xAxisIndex === 2) {
            return `${vm.cc_format_number(Number(data.value * 100).toFixed(2))}%`
          } else {
            return `${vm.cc_format_number(data.value)}`
          }
        },
        color: '#000'
      }
    }
  })
  console.log('seriesData-------->', seriesData)
  // 图例
  const legendData = yData.map((key) => {
    return key.name
  })
  const defaultYAxisOption = {
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
  }
  // 11111111111111111111
  // const xData = ['建筑石用材建筑石用材建筑石用材建筑石用材建筑石用材建筑石用材', '电（热）能', '矿石', '其他']
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
      legend: {
        data: legendData
      },
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
    series: seriesData
  })

  return option
  // const echarts = require('echarts')

  // // 基于准备好的dom，初始化echarts实例
  // const myLineChart = echarts.init(
  //   document.getElementById('lineChart')
  // )
  // myLineChart.setOption(option)
}
