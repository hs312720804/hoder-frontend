export function drawTwoBarChart () {
  const echarts = require('echarts')
  const data1 = [820, 932, 901, 934, 1290, 1330, 1320, 1330, 1340]
  const data2 = [134, 133, 132, 133, 129, 93, 90, 93, 82]
  // 获取最大值方法
  function calMax (arr) {
    const max = Math.max.apply(null, arr) // 获取最大值方法
    const maxint = Math.ceil(max / 5) // 向上以5的倍数取整
    const maxval = maxint * 5 + 5 // 最终设置的最大值
    return maxval // 输出最大值
  }
  // 获取最小值方法
  function calMin (arr) {
    const min = Math.min.apply(null, arr) // 获取最小值方法
    const minint = Math.floor(min / 1) // 向下以1的倍数取整
    const minval = minint * 1 - 5 // 最终设置的最小值
    return minval // 输出最小值
  }
  // 调用方法，获取数据的最大值&最小值
  const maxData1 = calMax(data1)
  const maxData2 = calMax(data2)
  const minData1 = calMin(data1)
  const minData2 = calMin(data2)

  const option = {
    title: {
      text: '示例',
      left: 'center',
      subtext: '',
      textStyle: {
        color: '#000'
      }
    },
    color: ['#60c4c4', '#fca268', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      left: 'right',
      data: ['示例1', '示例2'],
      textStyle: { fontSize: 16 }
    },
    toolbox: {
      show: false
    },
    Calculable: true,
    grid: [{ bottom: '50%' }, { top: '50%' }],
    xAxis: [
      {
        type: 'category',
        axisLine: { show: true, onZero: false },
        // axisTick: { show: false },
        axisLabel: { show: false, color: 'green', fontSize: 20 },
        // splitArea: { show: false },
        splitNumber: 20,
        splitLine: { show: false },
        data: [],
        position: 'bottom',
        zlevel: 10,
        show: true,
        min: 0,
        nameTextStyle: { fontSize: 16 }
      },
      {
        type: 'category',
        show: true,
        axisLine: { show: true, onZero: false },
        // axisTick: { show: false },
        axisLabel: { show: true, color: 'green', fontSize: 16 },
        // splitArea: { show: false },
        splitNumber: 20,
        splitLine: { show: false },
        data: [],
        gridIndex: 1,
        position: 'bottom',
        zlevel: 10,
        min: 0,
        nameTextStyle: { fontSize: 16 }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '示例1',
        axisLine: { show: true, onZero: false, lineStyle: { color: '#000' } },
        axisLabel: { formatter: '{value}', fontSize: 16 },
        minInterval: 1,
        splitLine: false,
        nameTextStyle: { fontSize: 16 },
        min: 0
      },
      {
        type: 'value',
        name: '示例2',
        axisLine: { show: true, onZero: false, lineStyle: { color: '#000' } },
        axisLabel: { formatter: '{value}', fontSize: 16 },
        minInterval: 1,
        position: 'left',
        splitLine: false,
        gridIndex: 1,
        nameGap: 30,
        inverse: true,
        nameTextStyle: { fontSize: 16 },
        min: 0
      }
    ],
    series: [
      { type: 'bar', name: '示例1', barMaxWidth: 40, data: [20, 40, 60, 80, 100] },
      { type: 'bar', name: '示例2', barMaxWidth: 40, data: [100000, 1, 5000, 50, 40000], xAxisIndex: 1, yAxisIndex: 1 }
    ]
  }

  // 基于准备好的dom，初始化echarts实例
  const myLineChart = echarts.init(
    document.getElementById('lineChart')
  )
  myLineChart.setOption(option)
}
