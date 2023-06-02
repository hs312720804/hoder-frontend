import Vue from 'vue'

export function drawTwoBarChart ({ title1, title2 }, xData, yData, xunit = '', yunit = '') {
  const vm = new Vue()
  const colorList = ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc']
  const seriesData = yData.map(item => {
    return {
      ...item,
      label: {
        show: true,
        // rotate: 90,
        position: item.xAxisIndex === 1 ? 'bottom' : 'top',
        formatter: function (data) {
          if (item.xAxisIndex === 1) {
            return `${vm.cc_format_number(Number(data.value * 100).toFixed(2))}%`
          } else {
            return `${vm.cc_format_number(data.value)}`
          }
        },
        color: '#000'
      }
    }
  })
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
  const options = {
    color: colorList,
    tooltip: {
      // trigger: 'item',
      axisPointer: {
        type: 'cross'
      },
      trigger: 'axis',
      formatter: function (parmas) {
        console.log('parmas--->', parmas)
        // let str = parmas[0].marker + parmas[0].name + '<br/>'
        let str = parmas[0].name + '<br/>'

        // if (item.axisIndex === 1) {
        //   str = str + '购买金额' + '<br/>'
        // } else {

        // }
        // str = str + '购买用户占比' + '<br/>'
        let tip1 = title1 + '<br/>'
        let tip2 = title2 + '<br/>'
        parmas.forEach((item, index) => {
          if (item.axisIndex === 0) {
            tip1 = tip1 + item.marker + item.seriesName + '：' + vm.cc_format_number(item.value) + '<br/>'
          } else {
            tip2 = tip2 + item.marker + item.seriesName + '：' + vm.cc_format_number(Number(item.value * 100).toFixed(2)) + '%' + '<br/>'
          }
        })
        str = str + tip1 + '<br/>' + tip2
        // for (const item of parmas) {
        // }
        return str
      }
    },
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     type: 'cross'
    //   }

    // },
    axisPointer: {
      link: { xAxisIndex: 'all' }
      // label: {
      //   backgroundColor: '#777'
      // }
    },
    legend: {
      data: legendData
    },
    // axisPointer: {
    //   link: { xAxisIndex: 'all' }
    // },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 40,
        xAxisIndex: [0, 1]
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 40,
        xAxisIndex: [0, 1]
      }
    ],
    grid: [{
      left: 50,
      right: 50,
      height: '35%'
    }, {
      left: 50,
      right: 50,
      top: '60%',
      height: '35%'
    }],
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: xData,
        axisLabel: {
          interval: 0,
          margin: 7,
          formatter: function (params) {
            let newParamsName = '' // 拼接后的新字符串
            const paramsNameNumber = params.length // 实际标签数
            const provideNumber = 8 // 每行显示的字数
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 如需换回，算出要显示的行数

            if (paramsNameNumber > provideNumber) {
              /** 循环每一行,p表示行 */

              for (let i = 0; i < rowNumber; i++) {
                let tempStr = '' // 每次截取的字符串
                const start = i * provideNumber // 截取位置开始
                const end = start + provideNumber // 截取位置结束

                // 最后一行的需要单独处理

                if (i == rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber)
                } else {
                  tempStr = params.substring(start, end) + '\n'
                }
                newParamsName += tempStr
              }
            } else {
              newParamsName = params
            }

            return newParamsName
          }
        }
      },
      {
        gridIndex: 1,
        type: 'category',
        data: xData,
        position: 'top',
        axisLabel: { show: false },
        axisTick: { show: false }
      }
    ],
    yAxis: [
      {
        name: title1,
        type: 'value',
        axisTick: { show: false },
        ...defaultYAxisOption
      },
      {
        name: title2,
        gridIndex: 1,
        type: 'value',
        axisTick: { show: false },
        inverse: true,
        ...defaultYAxisOption
      }
    ],
    series: seriesData
    //  [
    //   {
    //     name: '入职',
    //     type: 'bar',
    //     // hoverAnimation: false,
    //     data: [
    //       0.97, 0.96, 0.96, 0.95, 0.95
    //     ]
    //   },
    //   {
    //     name: '入职11',
    //     type: 'bar',
    //     // hoverAnimation: false,
    //     data: [
    //       1, 2, 3, 0.95, 0.95
    //     ]
    //   },
    //   {
    //     name: '入职22',
    //     type: 'bar',
    //     // hoverAnimation: false,
    //     data: [
    //       1, 2, 3, 0.95, 0.95
    //     ]
    //   },
    //   {
    //     name: '离职',
    //     type: 'bar',
    //     xAxisIndex: 1,
    //     yAxisIndex: 1,
    //     // hoverAnimation: false,
    //     data: [
    //       12, 45, 0.126, 0.69, 0.182
    //     ]
    //   },
    //   {
    //     name: '离职2',
    //     type: 'bar',
    //     xAxisIndex: 1,
    //     yAxisIndex: 1,
    //     // hoverAnimation: false,
    //     data: [
    //       12, 45, 0.126, 0.69, 0.182
    //     ]
    //   },
    //   {
    //     name: '离职3',
    //     type: 'bar',
    //     xAxisIndex: 1,
    //     yAxisIndex: 1,
    //     // hoverAnimation: false,
    //     data: [
    //       12, 45, 0.126, 0.69, 0.182
    //     ]
    //   }
    // ]
  }

  return options
  // const echarts = require('echarts')

  // // 基于准备好的dom，初始化echarts实例
  // const myLineChart = echarts.init(
  //   document.getElementById('lineChart')
  // )
  // myLineChart.setOption(option)
}
