<template>
  <div >
    <div class="detail-box">
      <div class="kpi-wrap">
        <!-- <el-button type="text" icon="el-icon-plus" @click="editTargetKey">编辑绩效目标</el-button> -->
        <div>
          效果指标
          <!-- <el-radio v-model="radio1" label="1" style="margin-right: 15px">仅当前接待员</el-radio>
                        <el-radio v-model="radio1" label="2">按分组统计</el-radio> -->
          <!-- <span class="tip-text">当接待员属于分组时，展示分组的绩效目标</span> -->
        </div>
        <!-- <i v-if="selectedServicer.id && canUse" @click="editTargetKey" class="el-icon-edit position-right" title="编辑绩效目标" ></i> -->

        <i class="el-icon-loading position-right" v-if="getGoalDataLoading" style="z-index: 99"></i>

        <el-dropdown v-else class="position-right" title="编辑绩效目标" @command="handleCommand" trigger="click" :hide-on-click="false">
          <span class="el-dropdown-link">
            <i class="el-icon-plus"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, key) in rowObj" :key="key" :command="key">
              <div :class="item.isShow ? 'checkedKpi' : ''">
                <i v-if="item.isShow" class="el-icon-check"></i>
                <i v-else class="seizeSeat"></i>
                <span> {{ item.title }}</span>
              </div>
            </el-dropdown-item>
            <!-- <el-dropdown-item>狮子头</el-dropdown-item>
                          <el-dropdown-item>螺蛳粉</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>

        <div>
          <!-- {{ selectedServicerId }} -->
          <!-- {{ overview }} -->
          <span class="reception-uv-span">
            <span style="font-size: 12px">命中用户数：</span>
            {{ selectedServicerOverView.receptionUv || '-' }}
          </span>
        </div>
        <!-- style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px;" -->
        <!-- <template v-if="selectedServicerOverView.id"> -->
          <div v-for="(item, key) in rowObj" :key="key">
            <div v-show="item.isShow" class="unit-box-wrap" style="position: relative">
              <div class="unit-box">
                <div v-if="(item.title)">
                  <div
                    v-if="allChartData[key] &&
                      allChartData[key].data &&
                      allChartData[key].data.series &&
                      allChartData[key].data.series.length > 0"
                    :ref="key"
                    :id="key"
                    class="chart-div"
                    @click="enlargeChart(key)"
                    :style="{height: getHeight(allChartData[key])}">
                  </div>
                  <div v-else>
                    <el-empty :description="`${item.title} 暂无数据`" :image-size="60"></el-empty>
                  </div>
                </div>
              </div>
              <i class="el-icon-close position-right el-icon-close-position-right" @click="handleCommand(key)" title="删除"></i>
            </div>
          </div>
        <!-- </template> -->
        <!-- <el-empty v-else description="暂无数据" :image-size="60"></el-empty> -->

      </div>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="800"
    >
    <!-- targetKeyId--{{ selectTargetChartKey }} -->
      <div
        v-if="allChartData[selectTargetChartKey] &&
        ((allChartData[selectTargetChartKey].series &&
        allChartData[selectTargetChartKey].series.length > 0) ||
        allChartData[selectTargetChartKey].data)"
        :ref="`big-${selectTargetChartKey}`"
        :id="`big-${selectTargetChartKey}`"
        style="height: 450px">
      </div>
    </el-dialog>
    <el-dialog
      title="编辑绩效目标"
      :visible.sync="editTargetKeyVisible"
      width="700px"
    >
    <!-- {{ targetKeyFormParent }} -->
      <EditTargetKeyDialog
        ref="editTargetKeyDialogRef"
        v-if="editTargetKeyVisible"
        :selectedServicer="selectedServicer"
        :indicatorsOptions="indicatorsOptions"
        :soureceSignListOptions="soureceSignListOptions"
        :targetKeyFormParent.sync="targetKeyFormParent"
      ></EditTargetKeyDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTargetKeyVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmEditTargetKey">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { removePendingRequest } from '@/services/cancelFetch'
import EditTargetKeyDialog from '../EditTargetKeyDialog.vue'

export default {
  components: {
    EditTargetKeyDialog

  },
  props: {
    selectedScene: {
      type: Object,
      default: () => {}
    },
    selectedServicer: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      overview: {},
      dialogVisible: false,
      selectTargetChartKey: '',
      editTargetKeyVisible: false,
      colorList: ['#FD9E06', '#5470c6', '#6395f9', '#35c493', '#ef6567', '#f9c956', '#91cd77', '#75bedc'],
      // colorList: ['#0078ff', '#00ffcc', '#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],
      rowObj: // 格式固定,请勿随意更改
        {
          payRate: { type: 'line', title: '会员 - 付费率', targetKeyId: 1, span: 24, isShow: true },
          payNum: { type: 'line', title: '会员 - 付费单数', targetKeyId: 2, span: 24, isShow: true },
          price: { type: 'line', title: '会员 - 付费金额', targetKeyId: 3, span: 24, isShow: true },
          arup: { type: 'line', title: '会员 - 客单价', targetKeyId: 4, span: 24, isShow: true },
          payUv: { type: 'line', title: '会员 - 付费设备量', targetKeyId: 5, span: 24, isShow: true },
          orderNum: { type: 'line', title: '内容 - 影片吸金订单量', targetKeyId: 6, span: 24, isShow: true },
          orderRatio: { type: 'line', title: '内容 - 影片订单转化率', targetKeyId: 7, span: 24, isShow: true },
          perOrder: { type: 'line', title: '内容 - 影片订单均价', targetKeyId: 8, span: 24, isShow: true },
          avgPlayPrice: { type: 'line', title: '内容 - 影片播放均价', targetKeyId: 9, span: 24, isShow: true }
        },
      allCharts: {}, // echart 实例
      allChartsOption: {}, // echart option
      allChartData: {},
      getGoalDataLoading: false,
      targetValue: '',
      // targetKeyList: [{
      //   // 1 付费率，2 成交单数 3 成交金额 4 客单价
      //   id: 1,
      //   key: 'payRate',
      //   lable: '付费率（%）'
      // }, {
      //   id: 2,
      //   key: 'payNum',
      //   lable: '付费单数'
      // }, {
      //   id: 3,
      //   key: 'price',
      //   lable: '付费金额（元）'
      // }, {
      //   id: 4,
      //   key: 'arup',
      //   lable: '客单价（元）'
      // }],
      // targetKey: '付费率（%）',
      // targetKeyId: '',
      indicatorsOptions: [
        {
          indicatorsType: 6,
          label: '内容 - 影片吸金订单量'
        }, {
          indicatorsType: 7,
          label: '内容 - 影片订单转换率'
        }, {
          indicatorsType: 8,
          label: '内容 - 影片订单均价'
        }, {
          indicatorsType: 9,
          label: '内容 - 影片播放均价'
        },
        {
          indicatorsType: 1,
          label: '会员 - 付费率'
        }, {
          indicatorsType: 2,
          label: '会员 - 付费单数'
        }, {
          indicatorsType: 3,
          label: '会员 - 付费金额'
        }, {
          indicatorsType: 4,
          label: '会员 - 客单价'
        }, {
          indicatorsType: 5,
          label: '会员 - 付费设备量'
        }
      ]
    }
  },
  watch: {
    'selectedServicer.id': {
      handler (val) {
        // 中断之前的请求，防止数据被之前接口数据所覆盖·
        removePendingRequest({
          method: 'get',
          url: '/api/getPerformanceGoalData'
        })
        // 再次点击详情时中断之前的详情请求，防止数据被之前接口数据所覆盖·
        removePendingRequest({
          method: 'get',
          url: '/api/receptionist/getReceptionistById'
        })
        // 清空绩效图表
        this.allChartData = {}
        // 重置数据
        this.overview = {}
        for (const key of Object.keys(this.allCharts)) {
          const chart = this.allCharts[key]
          chart.clear()
        }
        if (val) {
          // 根据接待员 ID 获取绩效目标
          this.getTargetById()
        }
      },
      immediate: true
    }
  },
  computed: {
    selectedServicerId () {
      // return '2655' || this.selectedServicer.id // 假数据
      return Number(this.selectedServicer.id)
    },
    selectedServicerOverView () {
      // return this.overview[0]
      // const selectedServicer = this.overview && this.overview.length > 0 ? this.overview.find(item => item.id === 855) : undefined // 假数据
      // console.log('this.selectedServicer', this.selectedServicer)
      // console.log('this.overview', this.overview)

      const crowdId = Number(this.selectedServicer.crowdId)

      const selectedServicer = this.overview && this.overview.length > 0 ? this.overview.find(item => Number(item.crowdId) === crowdId) : undefined
      return selectedServicer || {}
    }
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
    getHeight (currentChartData) {
      const chartData = currentChartData.data

      if (chartData && (chartData.series && chartData.series.length > 2)) {
        return chartData.series.length * 60 + 'px'
      } else {
        return '230px'
      }
    },
    enlargeChart (key) {
      const echarts = require('echarts')
      this.dialogVisible = true
      this.selectTargetChartKey = key
      this.$nextTick(() => {
        console.log('allChartData--->', this.allChartData)
        console.log('allCharts--->', this.allCharts)
        console.log('allCharts--->', this.allChartsOption[key])
        const chartElement = document.getElementById(`big-${key}`)
        const myChart = echarts.init(chartElement)
        myChart.setOption(this.allChartsOption[key], true)
      })
    },
    editTargetKey () {
      this.getTargetById()
      this.editTargetKeyVisible = true
    },
    // 刷新图表
    refreshChart () {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.dispose() // 销毁
      }
      this.drawChart()
    },
    // editTargetValueChange () {
    //   // 数字正则
    //   const numPattern = /^-?\d*\.?\d+$/
    //   // 百分比正则
    //   // const patt = /^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/
    //   const patt = /^(100|[1-9]*\d(\.\d\d?\d?)?)%$|0$/

    //   if (numPattern.test(this.targetValue) || patt.test(this.targetValue)) {
    //     this.$emit('editReceptionist', {
    //       id: this.selectedServicer.id,
    //       indicators: this.targetValue
    //     }, 'no-refresh-list')

    //     // this.editReceptionist({
    //     //   id: this.selectedServicer.id,
    //     //   indicators: this.targetValue
    //     // }, 'no-refresh-list')

    //     // eslint-disable-next-line vue/no-mutating-props
    //     this.selectedServicer.indicators = this.targetValue
    //     this.isEditValue = false

    //     // 刷新图表
    //     this.refreshChart()
    //   } else {
    //     this.$message.warning('请输入数字或百分比')
    //   }
    // },
    getName (val, list) {
      const obj = list.find(item => item.indicatorsType === val)
      return obj ? obj.label : ''
    },
    comfirmEditTargetKey () {
      if (!this.targetKeyFormParent.indicatorsType) {
        return this.$message.error('请选择指标')
      }
      this.$refs.editTargetKeyDialogRef.$refs.targetKeyFormRef.validate((valid) => {
        if (valid) {
          let resource = []

          // 会员
          if (this.targetKeyFormParent.indicatorsType < 6) {
            resource = [this.targetKeyFormParent.resource]
          } else { // 内容
            resource = this.targetKeyFormParent.resource && this.targetKeyFormParent.resource.map(item => {
              return {
                ...item,
                videoSource: this.targetKeyFormParent.videoSource
              }
            })
          }

          const parmas = {
            ...this.targetKeyFormParent,
            resource: JSON.stringify(resource),
            id: this.selectedServicer.id // 接待员ID
          }

          this.$service.saveEditIndicator(parmas, '操作成功').then(res => {
            // 刷新数据
            this.getTargetById()
            this.editTargetKeyVisible = false
          })
        }
      })
    },
    // 根据接待员ID获取绩效目标
    getTargetById () {
      // 清空
      // this.indicatorsTypelabel = ''
      // this.targetKeyId = ''

      const parmas = {
        id: this.selectedServicer.id
      }
      if (!parmas.id) return

      this.$service.getTargetById(parmas).then(res => {
        // for (const key in this.rowObj) {
        //   if (this.rowObj[key].targetKeyId === res.indicatorsType) {
        //     this.targetKeyId = key
        //   }
        // }
        // this.indicatorsTypelabel = this.getName(res.indicatorsType, this.indicatorsOptions)
        // 曲线图
        this.getPerformanceGoalData()
      })
    },
    // 接待员绩效目标查询接口
    getPerformanceGoalData () {
      this.allChartData = {}
      this.overview = {}
      const params = {
        // 【动态分组ID】,如果不是通过动态人群创建的故事线，这个的dynamicRuleId传【场景id】
        dynamicRuleId: this.selectedScene.planId || this.selectedScene.id,
        // crowdId: this.selectedServicer.crowdId, // 接待员的人群 id
        sceneId: this.selectedScene.id, // 所选场景 id
        isDelCache: 0 // 是否删除绩效目标缓存   0 否  1 是
      }
      // const params = {
      //   // 【动态分组ID】,如果不是通过动态人群创建的故事线，这个的 dynamicRuleId 传【场景id】
      //   dynamicRuleId: 447,
      //   crowdId: 16549, // 接待员id
      //   isDelCache: 0 // 是否删除绩效目标缓存   0 否  1 是
      // }
      // const params = {
      //   // 【动态分组ID】,如果不是通过动态人群创建的故事线，这个的 dynamicRuleId 传【场景id】
      //   dynamicRuleId: 333,
      //   crowdId: 15230, // 接待员id
      //   isDelCache: 0 // 是否删除绩效目标缓存   0 否  1 是
      // }
      this.getGoalDataLoading = true
      this.$service.getPerformanceGoalData(params).then(res => {
        if (res && res.data && res.data.overview) {
          const tableData = res.data || {}
          this.allChartData = tableData || {}
          this.overview = tableData.overview ? tableData.overview.data : {}
          // 图表没有数据的就不展示了
          for (const key in this.rowObj) {
            if (tableData[key] && tableData[key].data && tableData[key].data.series && tableData[key].data.series.length > 0) {
              this.rowObj[key].isShow = true
            } else {
              this.rowObj[key].isShow = false
            }
          }
          this.$nextTick(() => {
            this.drawChart()
          })
        }
        this.getGoalDataLoading = false
      }).catch(() => {
        this.getGoalDataLoading = false
      })
    },
    drawChart () {
      const rowObj = this.rowObj
      // key 是代表 ref 值
      for (const key in rowObj) {
        if (rowObj[key].type === 'line' && this.allChartData[key] && this.allChartData[key].data) {
          this.showLine(this.allChartData[key].data, key)
        }
      }

      // rowObj.forEach(item => {
      //   // key 是代表 ref 值
      //   for (const key in item) {
      //     if (item[key].type === 'line') {
      //       this.showLine(this.allChartData[key], key)
      //     }
      //   }
      // })
    },
    //  折线图
    showLine (data, chartID) {
      const hasY2 = false
      if (data && data.xaxis && data.xaxis.length > 0) {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        // 需要转为百分比的 key 值
        const ratioMap = ['orderRatio', 'payRate']
        const linesData = series.map((key) => {
          // if (data.yunit === '%') {
          if (ratioMap.includes(chartID)) {
            const arr = key.value.map(v => Number(v * 100).toFixed(2))
            data.yunit = '%'
            return { name: key.name, data: arr, type: 'line' }
          } else {
            return { name: key.name, data: key.value, type: 'line' }
          }
        })

        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit, hasY2)
      }
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '', hasY2 = false, yAxisObjName1 = '', yAxisObjName2 = '') {
      const chartElement = document.getElementById(element)
      // console.log('chartElement---->', chartElement)
      // console.log('yData---->', yData)
      if (!chartElement) return

      const echarts = require('echarts')
      const _this = this
      const yAxisObj = {
        type: 'value',
        name: yAxisObjName1,
        axisTick: {
          show: false,
          inside: true
        },
        axisLine: {
          show: false
          // lineStyle: {
          //   color: this.styleType ? '#273169' : '#000'
          // }
        },
        splitLine: {
          show: true
        },
        axisLabel: {
          interval: 'auto',
          width: 70,
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
      // const markLineTargetValue = this.targetValue.includes('%') ? this.targetValue.replace('%', '') : this.targetValue
      // yAxisObj.max = Math.max(markLineTargetValue, ...yData[0].data)
      // yAxisObj.min = Math.min(markLineTargetValue, ...yData[0].data)
      // let myChart = echarts.init(this.$refs[element])
      const option = {
        backgroundColor: '', // rgba设置透明度0.1
        // grid: {
        //   top: 10,
        //   right: 50,
        //   left: 50,
        //   bottom: 30
        // },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: false
        // },
        grid: {
          top: yData.length > 2 ? yData.length * 30 : 50,
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true,
          borderWidth: '0'
        },
        title: {
          text: title
          // text: 'Main Title',
          // subtext: 'Sub Title',
          // left: 'center',
          // top: 'center',
          // textStyle: {
          //   fontSize: 30
          // }
        },
        // textStyle: { // 图例的文字样式
        //   color: '#ffffff80'
        // },
        tooltip: {
          trigger: 'axis',
          // formatter: '{a} <br/>{b} : {c} %',
          formatter: function (parmas) {
            let str = parmas[0].name + '<br/>'
            // let str = ''
            for (const item of parmas) {
              str = str + item.marker + item.seriesName + ': ' + _this.cc_format_number(item.value) + yunit + '<br/>'
            }
            // return _this.cc_format_number(a.data)
            return str
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        color: _this.colorList,
        legend: {
          // show: false,
          data: legend,
          // icon: 'circle',
          top: '5%'
          // right: '10%',
          // textStyle: { // 图例的文字样式
          //   color: this.styleType ? '#fff' : '#000'
          // }
        },
        xAxis: {
          type: 'category',
          data: xData,
          // 轴线的字体样式
          axisLabel: {
            show: true
            // textStyle: {
            //   color: this.styleType ? '#fff' : '#000',
            //   fontSize: '12px'
            //   // fontSize: 16, 可直接写数字,单位px
            // }
          }
          // 轴线的样式
          // axisLine: {
          //   lineStyle: {
          //     color: this.styleType ? '#273169' : '#000'
          //     // color: this.styleType ? '##0E183A' : '#000'
          //   }
          // }
          // // 网格线样式
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: ['#273169']
          //   }
          // }
          // axisLabel: {
          //   interval: 'auto',
          //   rotate: yData.length > 10 ? -45 : 0,
          //   formatter: function (value) {
          //     return value + xunit
          //   }
          // }
        },
        yAxis: [yAxisObj],
        series: yData.map(item => {
          const crowdId = Number(item.name.split('-')[1])
          return {
            ...item,
            // stack: 'Total',
            // smooth: true,
            // lineStyle: {
            //   width: 0
            // },
            // showSymbol: false,
            label: {
              show: false,
              position: 'top',
              formatter: function (data) {
                return `${data.value}${yunit}`
              },
              color: '#666'
            },
            // areaStyle: {
            //   // opacity: 0.8,
            //   // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //   //   {
            //   //     offset: 0,
            //   //     color: 'rgb(0, 221, 255, 0.5)'
            //   //   },
            //   //   {
            //   //     offset: 1,
            //   //     color: 'rgba(77, 119, 255, 0)'
            //   //   }
            //   // ])
            //   opacity: 0.8,
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     {
            //       offset: 0,
            //       color: 'rgb(0, 221, 255)'
            //     },
            //     {
            //       offset: 1,
            //       color: 'rgb(77, 119, 255)'
            //     }
            //   ])
            // },
            emphasis: {
              focus: 'series'
            },
            lineStyle: {
              width: crowdId === _this.selectedServicerId ? 3 : 1,
              type: crowdId === _this.selectedServicerId ? 'solid' : 'dashed'
            }
            // 目标
            // markLine: {
            //   // silent: true,
            //   lineStyle: {
            //     color: '#333'
            //   },
            //   data: [
            //     {
            //       yAxis: markLineTargetValue
            //     }
            //   ]
            // }
          }
        })
      }

      const myChart = echarts.init(chartElement)
      myChart.setOption(option, true)
      this.allCharts[element] = myChart
      this.allChartsOption[element] = option
    },
    handleCommand (command) {
      const rowObj = this.rowObj
      // rowObj.forEach(item => {
      //   // key 是代表 ref 值
      //   for (const key in item) {
      //     if (key === command) {
      //       item[key].isShow = !item[key].isShow
      //     }
      //   }
      // })
      for (const key in rowObj) {
        if (key === command) {
          const item = rowObj[key]
          item.isShow = !item.isShow
        }
      }
      // this.$message('click on item ' + command)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../sty/common.styl'
@import '../sty/dark.styl'
@import '../sty/light.styl'
.position-right {
  position absolute
  right: 2px
  top: 2px
}
</style>
