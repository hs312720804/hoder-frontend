<template>
    <!-- 统计 估算画像 -->
    <el-dialog
      :visible.sync="showEstimateEcharts"
      width="90%"
      title="该人群估算出的用户画像"
      @close="$emit('close-echarts')"
    >
        <div class="export-button">
          <el-button type="success" @click="handleDownload">导出数据</el-button>
        </div>
        <div>
            <!--<div class="estimate-item">-->
            <!--<div class="estimate-title">基本信息</div>-->
            <!--<div class="estimate-statistic">-->
            <!--&lt;!&ndash;<div ref="circleSex" class="base-info-circle-echarts"></div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div ref="circleAge" class="base-info-circle-echarts"></div>&ndash;&gt;-->
            <!--<div ref="circleDevice" class="base-info-circle-echarts"></div>-->
            <!--</div>-->
            <!--</div>-->
            <div class="estimate-item">
                <div class="estimate-title">基本信息</div>
                <div class="estimate-statistic">
                    <div class="province-city-active-content city-info-echarts">
                        <div ref="provinceMap" class="province-map"></div>
                        <div class="city-active-proportion" v-if="cityData">
                            <div class="city-active-proportion--title">城市活跃比</div>
                            <template v-if="cityData.length > 0">
                                <div  v-for="(item,index) in cityData" :key="index" class="city-active-proportion--name">
                                    {{item.name}}:{{item.value}}
                                </div>
                            </template>
                            <div v-else>暂无数据</div>
                        </div>
                    </div>
                    <div class="city-info-echarts">
                        <div class="table-title">Top50城市活跃排名(近30天活跃)</div>
                        <c-table
                                :props="table.props"
                                :header="table.header"
                                :data="table.data"
                                class="table-overflow"
                        >
                        </c-table>
                    </div>
                    <div ref="circleDevice" class="base-info-circle-echarts" style="border: none;height: 300px"></div>
                </div>
            </div>
            <div class="estimate-item">
                <div class="estimate-title">用户类别</div>
                <div class="member-select">
                    <div class="member-select--text">按会员权益</div>
                    <el-select v-model="memberListType">
                        <template v-for="(item,index) in memberList">
                            <el-option
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </template>
                    </el-select>
                </div>
                <div ref="member" class="member-total"></div>
                <div class="estimate-statistic">
                    <div ref="memberActiveTime" class="member-total-item"></div>
                    <div ref="memberMainPageActiveTime" class="member-total-item"></div>
                    <div ref="memberExpirationTime" class="member-total-item"></div>
                </div>
            </div>
            <div class="estimate-item">
                <div class="estimate-title">付费分布</div>
                <div class="member-select">
                    <div class="member-select--text">按会员权益</div>
                    <el-select v-model="memberListByPay">
                        <template v-for="(item,index) in memberList">
                            <el-option
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </template>
                    </el-select>
                </div>
                <div ref="payDetail" class="member-total"></div>
            </div>
            <div class="estimate-item">
                <div class="estimate-title">观影行为</div>
                <div>
                    <div class="watch-tv-behavior">
                        <div class="member-select">
                            <div class="member-select--text">近7日/30日起播活跃率（有起播行为等活跃天数7日/或30日）</div>
                            <el-select v-model="expirationDay">
                                <template v-for="(item,index) in objectToArray(expirationDayList)">
                                    <el-option
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </template>
                            </el-select>
                        </div>
                        <div class="userBehavior" ref="userBehavior"></div>
                    </div>
                    <div class="watch-tv-behavior userBehavior" ref="watchPrefer"></div>
                </div>
            </div>
            <div class="estimate-item">
                <div class="estimate-title">活跃行为</div>
                <div ref="activeBehavior" class="activeBehaviorEcharts"></div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'deviceEcharts',
  props: ['currentCid'],
  data () {
    return {
      showEstimateEcharts: true,
      downloadUrl: undefined,
      cityData: null,
      table: {
        props: {},
        header: [
          {
            label: '排名',
            width: '50',
            type: 'index'
          },
          {
            label: '省份',
            prop: 'name'
          },
          {
            label: '活跃数量',
            prop: 'value'
          },
          {
            label: '占比',
            prop: 'PCT'
          }
        ],
        data: []
      },
      memberList: [],
      memberListType: '',
      memberListByPay: '',
      expirationDayList: {
        7: '近7日',
        30: '近30日'
      },
      expirationDay: '7',
      fillEmptyData: {
        data: [{ name: '总量', value: 0 }],
        name: { data: ['总量'] }
      }
    }
  },
  watch: {
    memberListType (val, oldVal) {
      if (val !== oldVal && oldVal.length !== 0) {
        this.getUserType()
      }
    },
    memberListByPay (val, oldVal) {
      if (val !== oldVal && oldVal.length !== 0) {
        this.getPayDetail()
      }
    },
    expirationDay (val, oldVal) {
      if (val !== oldVal && oldVal.length !== 0) {
        this.getWatchBehavior()
      }
    }
  },
  methods: {
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return _this.cc_format_number(a.data)
          }
        },
        legend: {
          data: legend
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 0,
            rotate: -45
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            margin: 2,
            formatter: function (value) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + '万'
              } else if (value >= 10000000) {
                value = value / 10000000 + '千万'
              } return value
            }
          }
        },
        series: yData
      })
    },
    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return _this.cc_format_number(a.data)
          }
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 0,
            rotate: -45
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            margin: 2,
            formatter: function (value) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + '万'
              } else if (value >= 10000000) {
                value = value / 10000000 + '千万'
              } return value
            }
          }
        },
        series: [{
          data: yData.length === 0 ? this.fillEmptyData.data : yData,
          type: 'bar',
          barWidth: 30
        }]
      })
    },
    // 圆饼图
    setCircleEcharts (element, title, legend, data, showDetail) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title,
          left: 'center'
        },
        // tooltip: {
        //     trigger: 'item',
        //     formatter: "{a} <br/>{b}: {c} ({d}%)"
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return a.data.name + ':' + _this.cc_format_number(a.data.value) + '(' + a.percent + ')%'
          }
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: legend
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            // center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: showDetail,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: showDetail }
              },
              emphasis: {
                label: {
                  show: showDetail,
                  formatter: '{b}\n{c} ({d}%)',
                  position: 'center',
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            data: (data.length === 0) ? this.fillEmptyData.data : data
          }
        ]
      })
    },
    // 中国地图
    setMapEcharts (element, title, data, minValue, maxValue) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      // 中国地图
      myChart.setOption({
        title: {
          text: title,
          // subtext: '副标题',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return a.data.name + ':' + _this.cc_format_number(a.data.value)
          }
        },
        // tooltip : {
        //     trigger: 'item',
        //     formatter: '{b}<br/>({c})'
        // },
        visualMap: {
          min: minValue || 0,
          max: maxValue || 20000000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: '省份分布',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: data
          }
        ]
      })
    },
    // 漏斗图
    setFunnelEcharts (element, title, legend, data) {
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: legend
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            // x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
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
            data: data
          }
        ]
      })
    },
    //  导出估算画像数据
    handleDownload () {
      this.$service.exportFile({
        url:  `/api/crowd/exportDevPacketPortrait/${this.currentCid}`
      })
    },
    // 设备画像---开始
    getCrowdBaseInfo () {
      // 性别，年龄，产品等级
      const typeEnum = ['portrait.family.sex', 'portrait.family.age.range', 'portrait.product.grade']
      // this.$service.seeDevicePortraintCharts({params: {type: typeEnum[0]},id: this.currentCid}).then(data => {
      //     const [names,values] = [[],[]]
      //     data.dataList.forEach(item => {
      //         names.push(item.name)
      //         values.push({value: item.value, name: item.name})
      //     })
      //     this.setCircleEcharts('circleSex', '性别分布', names, values,false)
      // })
      // this.$service.seeDevicePortraintCharts({params: {type: typeEnum[1]},id: this.currentCid}).then(data => {
      //     const [names,values] = [[],[]]
      //     data.dataList.forEach(item => {
      //         names.push(item.name)
      //         values.push({value: item.value, name: item.name})
      //     })
      //     this.setCircleEcharts('circleAge', '年龄分布', names, values,false)
      // })
      this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[2] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('circleDevice', '产品等级分布', names, values, true)
      })
    },
    getCrowdProvinceInfo () {
      // 省份、城市活跃度
      const typeEnum = ['portrait.province', 'portrait.cities.rank']
      this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[0] }, id: this.currentCid }).then(data => {
        const [names, nameWithValues, values, length] = [[], [], [], data.dataList.length]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push(parseInt(item.value))
          nameWithValues.push({ value: parseInt(item.value), name: item.name })
        })
        const bubbleArr = this.bubbleSort(values)
        const max = bubbleArr[length - 1]
        const min = bubbleArr[0]
        this.setMapEcharts('provinceMap', '省份分布', nameWithValues, min, max)
      })
      this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[1] }, id: this.currentCid }).then(data => {
        this.cityData = data.dataList
      })
    },
    getTopActiveRank () {
      const typeEnum = ['portrait.top50.active.city']
      this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[0], orderBy: 'value', sortOrder: 'desc' }, id: this.currentCid }).then(data => {
        const arr = data.dataList
        let sum = 0
        arr.forEach(item => {
          sum += parseInt(item.value)
        })
        this.table.data = arr.reduce((result, item) => {
          return result.concat({ name: item.name, value: parseInt(item.value), PCT: ((parseInt(item.value) / sum) * 100).toFixed(2) + '%' })
        }, [])
      })
    },
    getMemberBenefits () {
      this.$service.getEstimatedTvEnumData().then(data => {
        const memberListData = this.objectToArray(data)
        this.memberList = memberListData
        // 设置两个默认的下拉框选值
        this.memberListType = memberListData[0].value
        this.memberListByPay = memberListData[0].value
        this.getUserType()
        this.getPayDetail()
      })
    },
    // 对象转成数组
    objectToArray (obj) {
      const arr = []
      for (const i in obj) {
        arr.push({ value: i, label: obj[i] })
      }
      return arr
    },
    getUserType () {
      // 正常用户类型
      const typeWithSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.member',
        sjyVIP: 'portrait.user.category.education.super.vip.member',
        djPlatform: 'portrait.user.category.premier.theater.member',
        cjyVIP: 'portrait.user.category.education.kids.vip.member',
        aqy: 'portrait.user.category.iqiyi.member',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.member',
        fkGarden: 'portrait.user.category.4k.garden.member',
        phyVIP: 'portrait.user.category.sports.vip.member',
        tencent: 'portrait.user.category.tencent.movie.member',
        kmVIP: 'portrait.user.category.cool.meow.vip.member'
      }
      // 非会员
      const typeWithNoVipSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.nonmember',
        sjyVIP: 'portrait.user.category.education.super.vip.nonmember',
        djPlatform: 'portrait.user.category.premier.theater.nonmember',
        cjyVIP: 'portrait.user.category.education.kids.vip.nonmember',
        aqy: 'portrait.user.category.iqiyi.nonmember',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.nonmember',
        fkGarden: 'portrait.user.category.4k.garden.nonmember',
        phyVIP: 'portrait.user.category.sports.vip.nonmember',
        tencent: 'portrait.user.category.tencent.movie.nonmember',
        kmVIP: 'portrait.user.category.cool.meow.vip.nonmember'
      }
      // 有效期会员
      const typeWithVipSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.validdate.member',
        sjyVIP: 'portrait.user.category.education.super.vip.validdate.member',
        djPlatform: 'portrait.user.category.premier.theater.validdate.member',
        cjyVIP: 'portrait.user.category.education.kids.vip.validdate.member',
        aqy: 'portrait.user.category.iqiyi.validdate.member',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.validdate.member',
        fkGarden: 'portrait.user.category.4k.garden.validdate.member',
        phyVIP: 'portrait.user.category.sports.vip.validdate.member',
        tencent: 'portrait.user.category.tencent.movie.validdate.member',
        kmVIP: 'portrait.user.category.cool.meow.vip.validdate.member'
      }
      // 已过期会员
      const typeWithVipNoValidSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.expireddate.member',
        sjyVIP: 'portrait.user.category.education.super.vip.expireddate.member',
        djPlatform: 'portrait.user.category.premier.theater.expireddate.member',
        cjyVIP: 'portrait.user.category.education.kids.vip.expireddate.member',
        aqy: 'portrait.user.category.iqiyi.expireddate.member',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.expireddate.member',
        fkGarden: 'portrait.user.category.4k.garden.expireddate.member',
        phyVIP: 'portrait.user.category.sports.vip.expireddate.member',
        tencent: 'portrait.user.category.tencent.movie.expireddate.member',
        kmVIP: 'portrait.user.category.cool.meow.vip.expireddate.member'
      }
      this.$service.seeDevicePortraintCharts({ params: { type: typeWithSelectEnum[this.memberListType] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('member', '会员用户的分布情况', names, values, true)
      })
      this.$service.seeDevicePortraintCharts({ params: { type: typeWithNoVipSelectEnum[this.memberListType] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('memberMainPageActiveTime', '从未是会员-按主页激活时间', names, values, false)
      })
      this.$service.seeDevicePortraintCharts({ params: { type: typeWithVipSelectEnum[this.memberListType] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('memberActiveTime', '会员-按会员有效期时长', names, values, false)
      })
      this.$service.seeDevicePortraintCharts({ params: { type: typeWithVipNoValidSelectEnum[this.memberListType] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('memberExpirationTime', '过期会员-按会员过期时长', names, values, false)
      })
      // this.$service.getEstimatedUserTypeData({id: this.currentCid,category: this.memberListType}).then(data => {
      //     // 当data直接为空对象，里面uCgyTal啥都没有
      //     let spread,effectiveTime,activate,expire = {}
      //     if(Object.keys(data).length === 0) {
      //         spread = this.fillEmptyData
      //         effectiveTime = this.fillEmptyData
      //         activate = this.fillEmptyData
      //         expire = this.fillEmptyData
      //     }else {
      //         spread = data.uCgyTal
      //         effectiveTime = data.vipPrdTtl
      //         activate = data.nvActHptTtl
      //         expire = data.ovToutTtl
      //     }
      //     this.setCircleEcharts('member','会员用户的分布情况',spread.name,spread.data,true)
      //     this.setCircleEcharts('memberActiveTime','会员-按会员有效期时长',effectiveTime.name,effectiveTime.data,false)
      //     this.setCircleEcharts('memberMainPageActiveTime','从未是会员-按主页激活时间',activate.name,activate.data,false)
      //     this.setCircleEcharts('memberExpirationTime','过期会员-按会员过期时长',expire.name,expire.data,false)
      // })
    },
    getPayDetail () {
      const typeWithSelectEnum = {
        jyVIP: 'portrait.last.payment.education.vip',
        sjyVIP: 'portrait.last.payment.education.super.vip',
        djPlatform: 'portrait.last.payment.premier.theater',
        cjyVIP: 'portrait.last.payment.education.kids.vip',
        aqy: 'portrait.last.payment.iqiyi',
        multAqy: 'portrait.last.payment.mixed.source.iqiyi',
        fkGarden: 'portrait.last.payment.4k.garden',
        phyVIP: 'portrait.last.payment.sports.vip',
        tencent: 'portrait.last.payment.tencent.movie',
        kmVIP: 'portrait.last.payment.cool.meow.vip'
      }
      this.$service.seeDevicePortraintCharts({ params: { type: typeWithSelectEnum[this.memberListByPay] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('payDetail', '上次付费的会员产品包情况', names, values, true)
      })
    },
    getWatchBehavior () {
      const typeEnum = ['portrait.user.viewing.preferences', 'portrait.broadcast.rate.within.seven.days', 'portrait.broadcast.rate.within.thirty.days']
      this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[0] }, id: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('watchPrefer', '观影偏好', names, values)
      })
      if (this.expirationDay === '7') {
        this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[1] }, id: this.currentCid }).then(data => {
          const [names, values] = [[], []]
          data.dataList.forEach(item => {
            names.push(item.name)
            values.push({ value: item.value, name: item.name })
          })
          this.setCircleEcharts('userBehavior', '', names, values)
        })
      } else {
        this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[2] }, id: this.currentCid }).then(data => {
          const [names, values] = [[], []]
          data.dataList.forEach(item => {
            names.push(item.name)
            values.push({ value: item.value, name: item.name })
          })
          this.setCircleEcharts('userBehavior', '', names, values)
        })
      }
    },
    getActiveBehavior () {
      const typeEnum = ['portrait.active.device.amount.yesterday']
      const [names, values] = [[], []]
      this.$service.seeDevicePortraintCharts({ params: { type: typeEnum[0] }, id: this.currentCid }).then(data => {
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setBarEchart('activeBehavior', '圈定人群的设备活跃人数/主页活跃人数/起播活跃人数（前一日的值)', names, values)
      })
    },
    // 设备画像---结束
    bubbleSort (arr) {
      // 冒泡排序
      const len = arr.length
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j + 1]
            arr[j + 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      return arr
    },
    fetchData () {
      this.getCrowdBaseInfo()
      this.getCrowdProvinceInfo()
      this.getTopActiveRank()
      this.getMemberBenefits()
      this.getWatchBehavior()
      this.getActiveBehavior()
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
    .export-button
        display flex
        justify-content flex-end
    .estimate-item
        border-top 1px dashed #000
    &:first-child
        border-top none
    .base-info-circle-echarts
        border-left 1px dashed #000
        &:first-child
            border-left none
    .estimate-statistic
        display flex
    .base-info-circle-echarts
        width 33%
        height 220px
    .table-overflow
        height 360px
        overflow auto
        margin 10px
    .city-info-echarts
        width 33%
        border-right 1px dashed
    .province-map
        width 100%
        height 300px
    .province-city-active-content
        display flex
        flex-direction column
    .city-active-proportion
        display block
        margin-left 20px
    .city-active-proportion--title
        font-size 18px
    .city-active-proportion--name
        width 50%
        display inline-block
        margin 5px 0
    .table-title
        font-size 18px
        margin 10px
    .estimate-title
        padding 10px 20px
        background-color #ccc
        font-size 18px
        color red
        display inline-block
        margin 20px 0
    .member-select
        display flex
        align-items center
        justify-content center
        .member-select--text
            margin-right 20px
    .member-total
        width 50%
        height 300px
        margin auto
    .member-total-item
        width 33%
        height 300px
        border-left 1px dashed #000
        &:first-child
            border-left none
    .userBehavior
        width 100%
        height 300px
    .activeBehaviorEcharts
        width 50%
        height 300px
        margin auto
    .button_underline
        text-decoration underline
    .text-over
        width 16px
        height 16px
        background url(../../assets/pencil.png) no-repeat right center
        text-align center
    .estimate-tips
        margin 10px 0
        color red
    .left div
        margin-right 25px
</style>
