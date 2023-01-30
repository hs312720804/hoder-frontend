<template>
<div>
  <div class="overview-table">

    <div class="ibox">
      <div class="title-one">
        总请求量
      </div>
      <div class="text-two">
        {{ cc_format_number(3779572629) }}
        <!-- {{ cc_format_number(overview.homepageActiveUv) }} -->
      </div>
      <div class="small-box">
        <div class="small">
          <span>总命中量</span>
          <span>
            {{ cc_format_number(646387883) }}
            <!-- {{ cc_format_number(overview.quandingUv) }} -->
          </span>
        </div>
      </div>
    </div>

    <div class="ibox">
      <div class="title-one">总策略数
      </div>
      <div class="text-two">
        {{ cc_format_number(3851) }}
        <!-- {{ toPercent(overview.totalPlayRate) }} -->
      </div>
      <div class="small-box">
        <div class="small">
          <span>活跃策略数</span>
          <span>
            {{ cc_format_number(381) }}
            <!-- {{ cc_format_number(overview.totalPlayUv) }} -->
          </span>
        </div>

      </div>
    </div>

    <div class="ibox">
      <div class="title-one">总人群数
      </div>
      <div class="text-two">
        {{ cc_format_number(10571) }}
        <!-- {{ toPercent(overview.totalPkgShowRate) }} -->
      </div>
      <div class="small-box">
        <div class="small">
          <span>活跃人群数</span>
          {{ cc_format_number(1579) }}
          <!-- <span>{{ cc_format_number(overview.totalPkgShowUv) }}</span> -->
        </div>

      </div>
    </div>

    <div class="ibox">
      <div class="title-one">估算人群数量
      </div>
      <div class="text-two" style="height: 70px">
        {{ cc_format_number(2648) }}
        <!-- {{ toPercent(overview.totalPkgXiadanRate) }} -->
      </div>
    </div>

    <div class="ibox">
      <div class="title-one">AB人群数量
      </div>
      <div class="text-two" style="height: 70px">
        {{ cc_format_number(1724) }}
        <!-- {{ toPercent(overview.totalPkgPayRate) }} -->
      </div>
    </div>

  </div>
  <div class="chart-box box">
    <el-row v-for="(row, index) in rowObj" :key="index">
      <el-col :span="chart.span" v-for="(chart, key) in row" :key="key">
        <template>
          <div v-if="(show && chart.title)">
            <div
              v-if="allChartData[key] && ((allChartData[key].series && allChartData[key].series.length > 0) || allChartData[key].data)"
              :ref="key" :id="key" class="chart-div"></div>
            <div v-else class="chart-div">
              <el-empty description="暂无数据"></el-empty>
            </div>
          </div>
        </template>
      </el-col>
    </el-row>

  </div>

</div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      rowObj: [
        {
          classification: { type: 'pie', title: '标签来源占比', span: 8 },
          a1: { type: 'pie', title: '标签来源占比', span: 8 },
          a2: { type: 'pie', title: '标签来源占比', span: 8 }
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
        a1: {
          data: [
            {
              count: 10,
              name: 'push',
              percent: '45%'
            },
            {
              count: 15,
              name: 'pull',
              percent: '55%'
            }
          ],
          title: '历史总投放'
        },
        a2: {
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
          ],
          title: '人群寿命'
        }
      },
      colorList: ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#7ED3F4', '#40B27D', '#FC8452', '#A969C6']
    }
  },
  watch: {

  },
  methods: {
    statisticPieChart () {
      this.$service.statisticPieChart()
    },
    changeView () {
      this.showNav = !this.showNav
    },
    fetchData () {
      this.statisticPieChart()
      this.$service.getTagStatistics().then(res => {
        this.allChartData = {
          ...this.allChartData,
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
            // this.showBar(this.allChartData[key], key)
          } else if (item[key].type === 'pie') {
            this.showPie(this.allChartData[key], key)
          }
        }
      })
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
          text: title,
          left: 'center'
        },
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
            type: 'pie',
            radius: '40%',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
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
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
@import url('~@/assets/overview.styl')
.ibox
  background #fff
  border: 1px solid #ddd;
.overview-table
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
.chart-div
  height: 400px
</style>
