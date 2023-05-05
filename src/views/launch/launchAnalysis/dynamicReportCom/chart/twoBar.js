import Vue from 'vue'

export function drawTwoBarChart ({ title1, title2 }, xData, yData, xunit = '', yunit = '') {
  const vm = new Vue()
  const colorList = ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc']

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
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     animation: false
    //   }
    // },
    tooltip: {
      // trigger: 'item',
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
        parmas.forEach((item, index) => {
          if (item.axisIndex === 0) {
            if (index === 0) {
              str = str + '<br/>' + title1 + '<br/>'
            }
            str = str + item.marker + item.seriesName + '：' + vm.cc_format_number(item.value) + '<br/>'
            console.log('parmas[index + 1].axisIndex--->', parmas[index + 1])
            if (parmas[index + 1] && parmas[index + 1].axisIndex === 1) {
              str = str + '<br/>' + title2 + '<br/>'
            }
          } else {
            // if (item.axisIndex === 1) {
            //   str = '<br/>' + str + '购买用户占比' + '<br/>'
            // }
            str = str + item.marker + item.seriesName + '：' + vm.cc_format_number(Number(item.value * 100).toFixed(2)) + '%' + '<br/>'
          }
        })
        // for (const item of parmas) {
        // }
        return str
      }
    },
    // legend: {
    //   data: ['入职', '离职']
    // },
    axisPointer: {
      link: { xAxisIndex: 'all' }
    },
    grid: [{
      left: 50,
      right: 50,
      height: '35%'
    }, {
      left: 50,
      right: 50,
      top: '55%',
      height: '35%'
    }],
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: xData
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
        type: 'value',
        axisTick: { show: false },
        ...defaultYAxisOption
      },
      {
        gridIndex: 1,
        type: 'value',
        axisTick: { show: false },
        inverse: true,
        ...defaultYAxisOption
      }
    ],
    series: yData
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
