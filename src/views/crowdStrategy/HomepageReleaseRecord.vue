<template>
    <div>
        <c-content-wrapper
                :filter="filter"
                :pagination="pagination"
                @filter-change="handleFilterChange"
        >
            <div class="header-title">
                人群<span>{{$route.params.id}}:{{crowdName}}</span>主页投放相关的DMP记录
            </div>
            <div class="search-content">
                <div class="search-left">
                    <div>漏斗数据状态：</div>
                    <div>
                        <el-select v-model="dataEnumValue" placeholder="请选择">
                            <el-option
                                    v-for="item in dataTypeEnum"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-input v-model="searchStr" clearable placeholder="请输入版块名称（选填）"></el-input>
                    </div>
                    <div><el-button type="primary" @click="fetchData">搜索</el-button></div>
                </div>
                <div>
                    <el-button type="success" @click="handleBackToCrowdList">返回人群列表</el-button>
                </div>
            </div>
            <c-table
              :props="table.props"
              :header="table.header"
              :data="table.data"
            >
            </c-table>
        </c-content-wrapper>
        <el-dialog :visible.sync="showFunnel" @close="handleClose" title="该推荐位人群投后全链路的漏斗数据">
            <div class="export-button">
                <el-button type="primary" @click="handleExport">导出数据</el-button>
            </div>
            <div class="funnel-item" v-for="(item,index) in funnelData" :key="index">
                <div class="item-title">{{item.name}}</div>
                <div class="item-buf">
                    <div v-if="loadColor" :style="{width: (index < 6 ? (100-index*15) : 40) + '%',background: '#' + generateMixed(),margin: 'auto'}">
                        {{item.value}}
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'HomepageReleaseRecord',
  data () {
    return {
      filter: {},
      pagination: {},
      table: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '开始时间',
            prop: 'startTime'
          },
          {
            label: '结束时间',
            prop: 'endTime'
          },
          {
            label: '拉取版块数据时间',
            prop: 'createTime'
          },
          {
            label: '版块Id',
            prop: 'sectionId'
          },
          {
            label: '版块名称',
            prop: 'sectionName'
          },
          {
            label: '推荐位位置',
            prop: 'recommendedPosition'
          },
          {
            label: '推荐位名称',
            prop: 'recommendedName'
          },
          {
            label: '操作',
            render: this.$createOperationRender(this, {
              handleSeeFunnel: '查看数据漏斗'
            })
          }
        ],
        data: []
      },
      showFunnel: false,
      funnelTransform: {
        totalPopulation: '圈定人群总量',
        homepageActivity: '主页活跃量',
        homepageExposure: '主页曝光',
        homepageClick: '主页点击',
        homepageCtr: '主页ctr',
        orderNumber: '成交单量',
        orderTotal: '成交总金额'
      },
      funnelUnit: {
        totalPopulation: '人',
        homepageActivity: '人',
        homepageExposure: '次',
        homepageClick: '次',
        homepageCtr: '%',
        orderNumber: '单',
        orderTotal: '元'
      },
      funnelData: [],
      chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C', 'D', 'E', 'F'],
      loadColor: true,
      currentId: undefined,
      downloadUrl: undefined,
      crowdName: undefined,
      dataTypeEnum: [],
      dataEnumValue: 1,
      searchStr: undefined
    }
  },
  methods: {
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
    parseFilter () {
      const { filter, pagination } = this
      filter.bid = 2
      filter.crowdId = this.$route.params.homepageReleaseRecordId
      filter.searchStr = this.searchStr
      filter.status = this.dataEnumValue
      if (pagination) {
        filter.pageNum = pagination.currentPage || 1
        filter.pageSize = pagination.pageSize || 10
      }
      return filter
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getHomepageReleaseRecordList(filter).then((data) => {
        this.table.data = data.list
        this.pagination.total = data.total
      })
    },
    handleFilterChange () {
      this.fetchData()
    },
    handleEdit ({ row }) {
      this.$emit('open-add-page', row.id, 'edit')
    },
    handleSeeFunnel ({ row }) {
      const bdiId = row.id
      this.currentId = row.id
      this.showFunnel = true
      this.loadColor = true
      this.$service.getHomepageReleaseRecordFunnel({ bdiId }).then((data) => {
        if (data == null) {
          this.$refs['funnel'].innerHTML = '暂无数据'
        } else {
          const dataArr = []
          const obj = Object.keys(this.funnelTransform)
          obj.forEach((item) => {
            dataArr.push({ name: this.funnelTransform[item], value: data[item] + this.funnelUnit[item] })
          })
          this.funnelData = dataArr
        }
      })
    },
    handleExport () {
      this.$service.exportFile({
        url:  `/api/businessDelivery/exportExcel?bdiId=${this.currentId}`
      })
    },
    generateMixed () {
      let res = ''
      for (let i = 0; i < 6; i++) {
        let id = Math.ceil(Math.random() * 16)
        res += this.chars[id]
      }
      if (res == 'FFF' || res == 'FFFFFF') {
        res = '000000'
      }
      return res.slice(0, 6)
    },
    handleClose () {
      // 解决关闭弹窗，颜色会变化的问题
      this.loadColor = false
    },
    getDataTypeEnum () {
      this.$service.getHomepageReleaseRecordTypeEnum().then(data => {
        const arr = []
        Object.keys(data).forEach((item) => {
          arr.push({ label: data[item], value: parseInt(item) })
        })
        this.dataTypeEnum = arr
      })
    },
    handleBackToCrowdList () {
      // 根据GlobalStrategySource判断是从哪里跳来的
      const source = this.$appState.$get('GlobalStrategySource')
      if (source) {
        this.$router.push({ name: 'myPolicy' })
      } else {
        this.$router.push({ name: 'strategyList' })
      }
    }
  },
  watch: {
    '$route.params.homepageReleaseRecordId': function (val) {
      if (val !== undefined) {
        this.fetchData()
      }
    },
    // 解决当前页面，点击其他tab页，crowdName没值的问题
    '$route.params.crowdName': function (val) {
      if (val !== undefined) {
        this.crowdName = val
      }
    }
  },
  created () {
    this.getDataTypeEnum()
    this.fetchData()
    // 防止刷新页面策略名称被刷新而消失
    this.crowdName = this.$appState.$get('homepageReleaseCrowdName')
  }
}
</script>

<style lang="stylus" scoped>
.header-title
    text-align center
    margin-bottom 20px
    color purple
    span
        color red
.funnel-item
    display flex
    text-align center
    margin 15px 0
.item-title
    width 30%
.item-buf
    width 70%
    color #fff
.export-button
    display flex
    justify-content flex-end
.search-content
    display flex
    justify-content space-between
    margin 20px 0
.search-left
    display flex
    align-items center
    div + div
        margin 0 5px
</style>
