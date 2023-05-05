
import Vue from 'vue'
// 通用柱状图参数设置

export function setBarEchart (title, xData, yData, xunit = '', yunit = '') {
  // const chartElement = document.getElementById(element)
  // if (!chartElement) return
  // // console.log('setBarEchart======111>>>', this.$refs)
  // // console.log('setBarEchart======111>>>', element)
  // // console.log('setBarEchart======111>>>', this.$refs[element])
  // // let myChart = echarts.init(this.$refs[element])
  // const _this = this
  // const echarts = require('echarts')
  // const myChart = echarts.init(chartElement)
  // myChart.setOption(
  const vm = new Vue()
  const colorList = ['#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc']

  const options = {
    title: {
      text: title
    },
    tooltip: {
      // trigger: 'item',
      trigger: 'axis',
      formatter: function (parmas) {
        // let str = parmas[0].marker + parmas[0].name + '<br/>'
        let str = parmas[0].name + '<br/>'
        // let str = ''
        for (const item of parmas) {
          // console.log('item-->', item)
          str = str + item.marker + vm.cc_format_number(item.value) + yunit + '<br/>'

          // str = str + item.name + ': ' + vm.cc_format_number(item.value) + yunit + '<br/>'
        }
        // return _this.cc_format_number(a.data)
        return str
      }
    },
    color: colorList,
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
  }
  return options
  // , true)

  // this.allCharts[element] = myChart
}
