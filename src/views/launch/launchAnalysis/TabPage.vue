<template>
  <div class="my-collect">
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane v-for="item in typeTabsList" :label="item.groupName" :name="item.value" :key="item.value" >
        </el-tab-pane>
      </el-tabs>

      <div class="filterFields">
        <el-form :model="formData" ref="formData" :inline="true">
          <el-form-item prop="versionCode">
            <!-- <el-select
              filterable
              v-model="formData.crowdIds"
              multiple
              placeholder="请选择123策略"
              @change="getCrowd"
              @remove-tag="removeTag"
            > -->
            <el-select
              filterable
              remote
              multiple
              clearable
              v-model="formData.versionCode"
              :remote-method="getBehaviorCrowdList"
              @change="handelBehaviorCrowdSelectChange($event)"
              @clear="getBehaviorCrowdList"
              placeholder="请选择人群ID、人群名"
            >
              <el-option
                v-for="(item, index) in behaviorCrowdList"
                :label="item.crowdName"
                :value="item.versionCode"
                :key="'versionCode' + index + businessType + activeName"
              >
                {{ item.crowdName }}_{{ item.versionCode }} ( {{ item.startPeriod }} - {{ item.endPeriod }} )
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="resourceIds" v-if="activeName !== 'tv'">
            <!-- {{ resourceList}} -->
            <el-select
              filterable
              remote
              multiple
              clearable
              v-model="formData.resourceIds"
              :remote-method="getResourceList"
              :placeholder="resourceIdsPlaceholder"
              @clear="getResourceList"
            >
              <el-option
                v-for="(item, index) in resourceList"
                :label="getLabelByActiveName(item)"
                :value="getLabelByActiveName(item)"
                :key="'resource' + index + businessType + activeName"
              >
                  <!-- {{ item.blockIdName + ' / ' + item.pageIdName + ' / ' + item.slotIdName }} -->
                  {{ getLabelByActiveName(item) }}
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item prop="type">
            <el-radio-group v-model="formData.type" @change="HandleDateTypeChange">
              <el-radio-button label="14" name="">近14天</el-radio-button>
              <el-radio-button label="30" name="">近30天</el-radio-button>
              <el-radio-button label="365" name="">全年</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="date">
            <el-date-picker
              style="width: 220px;"
              v-model="formData.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="getPickerOptions()"
            >
            </el-date-picker>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button @click="resetForm('formData')">重置</el-button>
          </el-form-item>
        </el-form>

      </div>

      <!-- {{ tableData.selected }}
      {{ tableData.selectionType }}
      {{ this.selected }} -->
      <div v-if="tableData.selected.length > 0">
        <span class="watchChartDiv">
          已选择 <span style="color: #409eff">{{ tableData.selected.length }} </span> 项

          <el-popover
            placement="top"
            title=""
            width="100"
            trigger="manual"
            transition="fade-in-linear"
            content="当前数据暂无图表"
            v-model="chartPopoverVisible">
            <el-button type="text" @click="watchFunnel" slot="reference">查看漏斗图</el-button>
            <el-button v-if="activeName === 'active'" type="text" @click="watchLine" slot="reference">查看折线图</el-button>
            <!-- <el-button slot="reference" @click="chartPopoverVisible = !chartPopoverVisible">手动激活</el-button> -->
          </el-popover>
        </span>
        <span style="color: #999; margin-left: 10px; font-size: 12px;">
          漏斗图和折线图不细分具体资源位或产品包
        </span>
      </div>

      <div class="secondScreening">
        数据展示：
        <el-radio-group v-model="showDataType" @change="HandleDataTypeChange">
          <el-radio :label="0">全部数据</el-radio>
          <el-radio :label="1">投前数据</el-radio>
          <el-radio :label="2">投后数据</el-radio>
        </el-radio-group>

        <a :href="downloadUrl" download ref="download_Url"></a>
        <i class="el-icon-download download"  @click="handleDownload"></i>

        <span style="float: right;">
          <el-checkbox v-model="checked1" @change="HandleShowDayChange">按天展示</el-checkbox>
          <!-- <el-checkbox v-if="activeName === 'tv' || activeName === 'top20'" v-model="checked2">区分top20影片</el-checkbox> -->
        </span>

      </div>

      <!-- <tag-list
        :tableData="tableData"
        :dataList="tableData.dataList"
        :check-list-parent="checkList"
        @change-checkList="handleCheckListChange"
        @table-selected="handleTableSelected"
      > -->

      <c-table
        v-loading="tbLoading"
        :props="tableData.props"
        :header="tableData.header"
        :data="tableData.data"
        :selected="tableData.selected"
        :selection-type="tableData.selectionType"
        @row-selection-add="handleRowSelectionAdd"
        @row-selection-remove="handleRowSelectionRemove"
        @all-row-selection-change="handleAllRowSelectionChange"
      >
      </c-table>
      <div align="right">
        <pagination
          :currentpage="filter.page"
          :pagesize="filter.pageSize"
          :totalcount="totalCount"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        ></pagination>
      </div>

      <!-- 折线图 -->
      <div v-if="Object.keys(lineChartData).length > 0" style="display: flex; width: 100%; justify-content: center; padding: 40px 0">
        <div ref="chart1" style="width: 48%; height: 360px; display: inline-block;">chart1</div>
        <div ref="chart2" style="width: 48%; height: 360px; display: inline-block;">chart2</div>
      </div>

      <!-- 漏斗图 -->
      <div style="clear: both">
        <div
          v-for="(item, index) in chartData"
          :key="'chart' + index"
          :id="'aaa'+index"
          style="float: left; width: 500px; height: 360px; padding: 20px 0 40px">
        </div>
      </div>

      <!-- this.chartData -->

      <!-- </tag-list> -->

      <!-- <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="500px">
          <el-form label-position="left" label-width="80px" :model="form">
            <el-form-item label="名称" required>
                <el-input v-model="form.tagName"></el-input>
            </el-form-item>
            <el-form-item label="英文名" required>
                <el-input v-model="form.tagKey"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddOrEdit">提 交</el-button>
          </div>
      </el-dialog> -->
  </div>
</template>

<script>
// import tagList from './List'
import axios from 'axios'
export default {
  name: 'MyCollect',
  components: {
    // tagList
  },
  props: {
    checkList: {
      type: Array
    },
    currentSelectTag: {
      type: Array
    },
    showSelection: {
      type: Boolean
    },
    typeTabsList: {
      type: Array,
      default: () => []
    },
    businessType: {
      type: String
    }
  },

  data () {
    return {
      chartPopoverVisible: false,
      tbLoading: false,
      allCharts: {},
      dataList: [],
      filter: {
        // searchType: 1,
        // tagType: 2,
        // pageNum: 1,
        // pageSize: 10,
        // tagName: undefined
        businessType: this.businessType,
        effectType: '',
        versionCode: [],
        resourceIds: [],
        startPeriod: '',
        endPeriod: '',
        dataType: '',
        showDay: 0,
        page: 1,
        pageSize: 10
      },
      dataSourceEnum: {},
      typeEnum: {},
      multipleSelection: [],
      // dialogVisible: false,
      form: {
        tagName: '',
        tagKey: '',
        remark: ''
      },
      dialogTitle: '',
      totalCount: 0,
      activeName: 'ctr',
      showTypeTab: true,
      tableData: {},
      formData: {
        businessType: this.businessType,
        versionCode: [],
        resourceIds: []
        // type: '14',
        // date: []
      },
      behaviorCrowdList: [],
      behaviorCrowdListFilter: {
        businessType: this.businessType,
        effectType: this.activeName,
        keywords: '',
        page: 1,
        pageSize: 30
      },
      resourceList: [],
      showDataType: 0,
      checked1: false,
      checked2: false,
      selected: [],
      popoverVisible: true,
      chartData: [],
      lineChartData: {},
      downloadUrl: ''
    }
  },
  computed: {
    resourceIdsPlaceholder () {
      let text = ''
      switch (this.activeName) {
        case 'ctr':
          text = '资源位ID、资源位名称'
          break
        case 'package':
          text = '产品包ID、产品包类型'
          break
        case 'active':
          text = '成交路径'
          break
        case 'tv':
          text = ''
          break
        case 'top20':
          text = '影片ID、影片名'
          break
        case 'category':
          text = '分类'
          break
      }
      return text
    }
  },
  watch: {
    // 表格多选
    selected (val) {
      console.log('val===', val)
      console.log('val===', this.tableData.selected)
      // crowdId
      // crowdName
      val.forEach(item => {
        const selectedArr = this.tableData.data.filter(obj => {
          return obj.id === item
        })
        console.log(selectedArr)
        console.log('this.tableData.data==', this.tableData.data)
      })
    },
    businessType: {
      handler () {
        this.getBehaviorCrowdList() // 行为人群列表
        this.getResourceList() // 资源位列表
        this.resetForm('formData') // 切换tab的时候重置筛选并查询
        // this.fetchData()
      }
    },
    activeName: {
      handler (val) {
        switch (val) {
          case 'ctr':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  render: (h, { row }) => {
                    return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                  }
                },
                {
                  label: '人群ID&名称',
                  // prop: 'crowdIdName'
                  render: (h, { row }) => {
                    return row.crowdIdName ? row.crowdIdName : `${row.crowdId}_${row.crowdName}`
                  }
                },
                {
                  label: '圈定量',
                  prop: 'crowdAmount'
                  // render: (h, params) => {
                  //   return h('el-button', {
                  //     props: {
                  //       type: 'text'
                  //     },
                  //     on: {
                  //       click: () => {
                  //         this.handleRead(params)
                  //       }
                  //     }
                  //   }, params.row.sshUsername)
                  // }
                },
                {
                  label: '命中量',
                  prop: 'hitAmount'
                },
                {
                  label: '版面ID&名称',
                  prop: 'pageIdName'
                },
                {
                  label: '板块（专辑）id&名称',
                  prop: 'blockIdName'
                },
                {
                  label: '推荐位id&名称',
                  prop: 'slotIdName'
                },
                {
                  label: '曝光次数',
                  prop: 'exposureTimes'
                },
                {
                  label: '曝光人数',
                  prop: 'exposureNum'
                },
                {
                  label: '点击次数',
                  prop: 'clickTimes'
                },
                {
                  label: '点击人数',
                  prop: 'clickNum'
                  // render: (h, { row }) => {
                  //   if (row.status === 1) {
                  //     return '启用'
                  //   } else {
                  //     return '禁用'
                  //   }
                  // }
                },
                {
                  label: 'PV CTR',
                  prop: 'clickPv'
                },
                {
                  label: 'UV CTR',
                  prop: 'clickUv'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case 'package':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '人群ID',
                  prop: 'crowdId',
                  width: '70'
                },
                {
                  label: '人群名称',
                  prop: 'crowdName'
                },
                {
                  label: '日期',
                  // prop: 'statsDate'
                  render: (h, { row }) => {
                    return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                  }
                  // render: (h, params) => {
                  //   return h('el-button', {
                  //     props: {
                  //       type: 'text'
                  //     },
                  //     on: {
                  //       click: () => {
                  //         this.handleRead(params)
                  //       }
                  //     }
                  //   }, params.row.sshUsername)
                  // }
                },
                {
                  label: '产品包页面曝光次数',
                  prop: 'exposeTimes'
                },
                {
                  label: '产品包页面曝光人数',
                  prop: 'exposeNum'
                },
                {
                  label: '权益名',
                  prop: 'equityPackageName'
                },
                {
                  label: '产品包类型',
                  prop: 'packageType'
                },
                {
                  label: '成单路径',
                  prop: 'dealSource'
                },
                {
                  label: '产品包ID',
                  prop: 'packageId'
                },
                {
                  label: '单价(元)',
                  prop: 'unitPrice'
                },
                {
                  label: '成交单量',
                  prop: 'dealVolume'
                  // render: (h, { row }) => {
                  //   if (row.status === 1) {
                  //     return '启用'
                  //   } else {
                  //     return '禁用'
                  //   }
                  // }
                },
                {
                  label: '成单人数',
                  prop: 'dealNum'
                },
                {
                  label: '成交金额(元)',
                  prop: 'dealAmount'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case 'active':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '人群ID',
                  prop: 'crowdId',
                  width: '70'
                },
                {
                  label: '人群名称',
                  prop: 'crowdName'
                },
                {
                  label: '日期',
                  // prop: 'statsDate'
                  render: (h, { row }) => {
                    return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                  }
                },
                {
                  label: '圈定量',
                  prop: 'crowdNum'
                },
                {
                  label: '主页活跃量',
                  prop: 'activeUsersNum'
                },
                {
                  label: '起播活跃量',
                  prop: 'playVideoUsersNum'
                },
                {
                  label: '产品包页面曝光人数',
                  prop: 'exposeNum'
                },
                {
                  label: '成交路径',
                  prop: 'dealSource'
                },
                {
                  label: '成单总设备量',
                  prop: 'dealUsers'
                },
                {
                  label: '成单人数',
                  prop: 'dealUsers'
                },
                {
                  label: '成交单量',
                  prop: 'dealContractsNum'
                  // render: (h, { row }) => {
                  //   if (row.status === 1) {
                  //     return '启用'
                  //   } else {
                  //     return '禁用'
                  //   }
                  // }
                },

                {
                  label: '成交金额(元)',
                  prop: 'dealAmount'
                }
              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case 'tv':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  render: (h, { row }) => {
                    return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                  }
                },
                {
                  label: '人群ID&名称',
                  // prop: 'crowdIdName'
                  render: (h, { row }) => {
                    return row.crowdIdName ? row.crowdIdName : `${row.crowdId}_${row.crowdName}`
                  }
                  // render: (h, { row }) => {
                  //   return row.crowdId + row.crowdName
                  // }
                },
                {
                  label: '播放次数',
                  prop: 'watchTimes'
                  // render: (h, params) => {
                  //   return h('el-button', {
                  //     props: {
                  //       type: 'text'
                  //     },
                  //     on: {
                  //       click: () => {
                  //         this.handleRead(params)
                  //       }
                  //     }
                  //   }, params.row.sshUsername)
                  // }
                },
                {
                  label: '播放人数',
                  prop: 'viewersNum'
                },
                {
                  label: '播放总时长',
                  prop: 'watchLastingTime'
                },
                {
                  label: '平均每次时长',
                  prop: 'averageWatchPeriodByTime'
                },
                {
                  label: '平均每人时长',
                  prop: 'averageWatchPeriodByNum'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
          case 'top20':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  render: (h, { row }) => {
                    return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                  }
                },
                {
                  label: '人群ID&名称',
                  // prop: 'crowdIdName'
                  render: (h, { row }) => {
                    return row.crowdIdName ? row.crowdIdName : `${row.crowdId}_${row.crowdName}`
                  }
                  // render: (h, { row }) => {
                  //   return row.crowdId + row.crowdName
                  // }
                },
                {
                  label: '业务一级分类',
                  prop: 'videoFirstLevelClassification'
                },
                {
                  label: '影片ID&影片名',
                  render: (h, { row }) => {
                    return row.videoId + row.videoName
                  }
                },
                {
                  label: '影片排名',
                  prop: 'videoRanking'
                },
                {
                  label: '成单人数',
                  prop: 'dealUsers'
                },
                {
                  label: '成交单量',
                  prop: 'dealVolume'
                },
                {
                  label: '成交金额',
                  prop: 'dealAmount'
                },
                {
                  label: '播放次数',
                  prop: 'watchTimes'
                },
                {
                  label: '播放人数',
                  prop: 'viewersNum'
                },
                {
                  label: '播放总时长',
                  prop: 'watchLastingTimes'
                },
                {
                  label: '平均每次时长',
                  prop: 'averageWatchPeriodByTime'
                },
                {
                  label: '平均每人时长',
                  prop: 'averageWatchPeriodByNum'
                }
              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
          case 'category':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  render: (h, { row }) => {
                    return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                  }
                },
                {
                  label: '人群ID&名称',
                  // prop: 'crowdIdName'
                  render: (h, { row }) => {
                    return row.crowdIdName ? row.crowdIdName : `${row.crowdId}_${row.crowdName}`
                  }
                  // render: (h, { row }) => {
                  //   return row.crowdId + row.crowdName
                  // }
                },
                {
                  label: '分类（频道）',
                  prop: 'classificationChannel'
                },
                {
                  label: '播放次数',
                  prop: 'watchTimes'
                },
                {
                  label: '播放人数',
                  prop: 'viewersNum'
                },
                {
                  label: '播放总时长',
                  prop: 'watchLastingTimes'
                },
                {
                  label: '平均每次时长',
                  prop: 'averageWatchPeriodByTime'
                },
                {
                  label: '平均每人时长',
                  prop: 'averageWatchPeriodByNum'
                }
              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
        }
        this.getBehaviorCrowdList() // 行为人群列表
        this.getResourceList() // 资源位列表
        this.resetForm('formData') // 切换tab的时候重置筛选并查询
        // this.fetchData()
      },
      immediate: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 下载
    handleDownload () {
      if (this.totalCount > 100000) {
      // if (this.totalCount > 10) {
        return this.$message.error('最多下载10万条数据，请筛选后下载')
      }
      // example: ['1,2,3', '4,5,6'] => ['1', '2', '3', '4', '5', '6']
      const resourceIdsArr = this.formData.resourceIds ? this.formData.resourceIds.reduce((total, item) => {
        return total.concat(item.split(','))
      }, []) : []

      let params = {
        businessType: this.businessType,
        effectType: this.activeName,
        versionCode: this.formData.versionCode,
        resourceIds: resourceIdsArr,
        dataType: this.showDataType,
        showDay: this.checked1 ? 1 : 0,
        page: this.filter.page,
        // pageSize: this.filter.pageSize
        pageSize: this.totalCount
      }
      // params = qs.stringify(params, { indices: false })
      if (params.effectType === 'package') {
        params.pkgs = this.formData.resourceIds.map((item) => {
          const arr = item.split(',')
          return {
            packageId: arr[0],
            packageType: arr[1]
          }
        })
      } else {
        params.pkgs = undefined
      }
      const link = document.createElement('a')

      axios.post('/api/effect/download', params, { responseType: 'arraybuffer' }).then(res => {
        const name = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
        const title = decodeURIComponent(name) // 解码
        // 创建Blob对象，设置文件类型
        let blob = new Blob([res.data],
          { type: 'application/vnd.ms-excel' }
          // { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        )

        let objectUrl = URL.createObjectURL(blob) // 创建URL
        link.href = objectUrl
        link.download = title // 自定义文件名
        link.click() // 下载文件
        URL.revokeObjectURL(objectUrl) // 释放内存
      })
    },

    // 清除图表
    clearChart () {
      this.chartData = []
      this.lineChartData = {}
    },
    // 查看折线图
    watchLine () {
      // // 漏斗图的参数
      // const params = {
      //   businessType: this.businessType,
      //   effectType: this.activeName,
      //   versionCode: this.formData.versionCode,
      //   // versionCode: '1,2',
      //   // startPeriod: this.formData.date[0],
      //   // endPeriod: this.formData.date[1],
      //   dataType: this.showDataType,
      //   showDay: this.checked1 ? 1 : 0,
      //   page: this.filter.page,
      //   pageSize: this.filter.pageSize
      // }
      // let newParamsArr = this.tableData.data.filter(item => this.selected.includes(item.crowdId))
      let newParamsArr = this.selected

      newParamsArr = newParamsArr.map(obj => {
        return {
          crowdId: obj.crowdId,
          crowdName: obj.crowdName,
          effectType: this.activeName,
          versionCode: obj.versionCode,
          dataType: this.showDataType,
          showDay: this.checked1 ? 1 : 0,
          statsDate: obj.statsDate,
          startPeriod: obj.startPeriod,
          endPeriod: obj.endPeriod
        }
      })

      console.log('newParamsArr===', newParamsArr)
      this.$service.effectGetLine(newParamsArr).then(data => {
        console.log('data===>', data)
        // this.showFunnel(data)
        if (!data || data.length === 0) {
          this.chartPopoverVisible = !this.chartPopoverVisible
          setTimeout(() => {
            this.chartPopoverVisible = !this.chartPopoverVisible
          }, 2000)
          return
        }
        this.lineChartData = data
        const amount = this.lineChartData.amount
        // this.$nextTick(() => {
        const series = amount.data || []
        const legendData = series.map((key) => {
          return key.crowdName
        })
        const linesData = series.map((key) => {
          return { name: key.crowdName, data: key.data, type: 'line' }
        })

        const dealVolume = this.lineChartData.dealVolume
        // this.$nextTick(() => {
        const series2 = dealVolume.data || []
        const legendData2 = series2.map((key) => {
          return key.crowdName
        })
        const linesData2 = series2.map((key) => {
          return { name: key.crowdName, data: key.data, type: 'line' }
        })
        this.$nextTick(() => {
          this.setLinesEchart('chart1', '成交金额', amount.date, linesData, legendData)
          this.setLinesEchart('chart2', '成交单量', dealVolume.date, linesData2, legendData2)
        })
        // })
      })
    },
    getBusinessUseTendency (rangeType) {
      this.$service.getStatisticStrategyReqAndHit({ rangeType }).then((data) => {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          return { name: key.name, data: key.value, type: 'line' }
        })
        this.setLinesEchart('chart1', '', data.xaxis, linesData, legendData, data.xunit, data.yunit)
      })
    },
    // 查看漏斗图
    watchFunnel () {
      // this.selected
      // const table = this.tableData
      // let newParamsArr = this.tableData.data.filter(item => this.selected.includes(item.crowdId))
      let newParamsArr = this.selected

      newParamsArr = newParamsArr.map(obj => {
        return {
          crowdId: obj.crowdId,
          crowdName: obj.crowdName,
          effectType: this.activeName,
          versionCode: obj.versionCode,
          dataType: this.showDataType,
          showDay: this.checked1 ? 1 : 0,
          statsDate: obj.statsDate
        }
      })

      console.log('newParamsArr===', newParamsArr)
      this.$service.effectGetFunnel(newParamsArr).then(data => {
        console.log('data===>', data)
        // this.showFunnel(data)
        // this.chartData = data.concat(data).concat(data)
        if (!data || data.length === 0) {
          this.chartPopoverVisible = !this.chartPopoverVisible
          setTimeout(() => {
            this.chartPopoverVisible = !this.chartPopoverVisible
          }, 2000)
          return
        }
        this.chartData = data
        this.chartData.forEach((item, index) =>
          this.$nextTick(() => {
            this.showFunnel(item, `aaa${index}`)
          })
        )
      })
    },
    showFunnel (item, id) {
      const echarts = require('echarts')
      console.log('item.first===', item)
      console.log('item.id===', id)
      // var ins = '{s|转换率}\n' + toPercent(d.data.percent)

      function toPercent (point) {
        var str = Number(point * 100).toFixed(1)
        str += '%'
        return str
      }
      const total = toPercent(item.total)
      const subtext = `${item.crowdName}`
      const subtext2 = `统计周期：${item.startPeriod}-${item.endPeriod}，${item.dataType}`
      const data1 = item.data

      const data2 = [
        { value: 120, percent: item.first },
        { value: 120, percent: item.second }
      ]

      echarts.init(
        document.getElementById(id)).setOption({
        title: [
          {
            text: `总转化率${total}`,
            top: 56,
            left: 150,
            // align: 'center',
            textStyle: {
              fontFamily: 'MicrosoftYaHei',
              color: '#252525',
              fontSize: 16,
              fontWeight: 400
            }
          },
          {
            subtext: subtext,
            left: '41%',
            // top: '75%',
            bottom: 20,
            textAlign: 'center',
            subtextStyle: {
              fontFamily: 'MicrosoftYaHei',
              color: '#252525',
              fontSize: 14,
              fontWeight: 400
            }
          },
          {
            subtext: subtext2,
            left: '41%',
            // top: '75%',
            bottom: 0,
            textAlign: 'center',
            subtextStyle: {
              fontFamily: 'MicrosoftYaHei',
              color: 'gray',
              fontSize: 14,
              fontWeight: 400
            }
          }

        ],
        color: ['#1481E2', '#1F88E5', '#3594E8', '#4CA0EA', '#62ABED', '#79B8EF', '#8FC3F2'],
        xAxis: { show: false },
        yAxis: { show: false,
          type: 'category',
          inverse: true,
          min: 0,
          max: 2
        },
        series: [{
          type: 'funnel',
          sort: 'none',
          minSize: 90,
          maxSize: '70%',
          left: 0,
          top: 100,
          bottom: 50,
          gap: 2,
          label: {
            position: 'inside',
            fontFamily: 'Microsoft YaHei',
            fontSize: 16,
            color: '#fff',
            formatter: '{b}{xx|}\n{c}',
            rich: {
              xx: { padding: [6, 0] }
            }
          },
          data: data1
        },
        {
          type: 'pictorialBar',
          symbol: 'image://http://homework.mizholdings.com/kacha/kcsj/8351c72ed86c1a0c/.png',
          symbolSize: ['40%', 60],
          z: 1,
          symbolOffset: ['115%', 65],
          label: {
            show: true,
            position: 'right',
            offset: [-25, 65],
            align: 'center',
            backgroundColor: 'rgba(249,249,249,1)',
            width: 76,
            height: 60,
            fontStyle: 'Microsoft YaHei',
            formatter: function (d) {
              console.log('d====', d)
              var ins = '{s|转换率}\n' + toPercent(d.data.percent)

              function toPercent (point) {
                var str = Number(point * 100).toFixed(1)
                str += '%'
                return str
              }

              return ins
            },
            rich: {
              s: {
                fontSize: 14,
                color: '#545454',
                padding: [5, 0, 12, 0]
              },
              x: { fontSize: 16, color: '#121212' }
            }
          },
          data: data2
        }]
      })
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '') {
      // const _this = this
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title,
          top: 0
        },
        tooltip: {
          trigger: 'axis'
          // formatter: function (parmas) {
          //   let str = parmas[0].name + '<br/>'
          //   for (let item of parmas) {
          //     str = str + item.marker + item.seriesName + ' :  ' + item.value + yunit + '<br/>'
          //   }
          //   // return _this.cc_format_number(a.data)
          //   return str
          // }
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     formatter: function (params) {
          //       return '快照时间：' + params.value
          //     }
          //   }
          // }
          // formatter: function (params) {
          //   params = params[0]
          //   var date = new Date(params.name)
          //   return (
          //     date.getDate() +
          //     '/' +
          //     (date.getMonth() + 1) +
          //     '/' +
          //     date.getFullYear() +
          //     ' : ' +
          //     params.value[1]
          //   )
          // }
          // formatter: function (a) {
          //   return _this.cc_format_number(a.data)
          // }
          // formatter: '{b0}: {c0}<br />{b1}: {c1}'
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: function (a) {
        //     return _this.cc_format_number(a.data)
        //   }
        //   // formatter: "{a} <br/> {b}: {c} ({d}%)"
        // },
        legend: {
          data: legend
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 'auto',
            rotate: -45,
            formatter: function (value) {
              return value + xunit
            }
          }
        },
        yAxis: {
          type: 'value',
          // name: '温度',
          axisTick: {
            inside: true
          },
          scale: true,
          axisLabel: {
            margin: 5,
            formatter: function (value) {
              // if (value >= 10000 && value < 10000000) {
              //   value = value / 10000 + '万' + yunit
              // } else if (value >= 10000000) {
              //   value = value / 10000000 + '千万' + yunit
              // } else if (value >= 100000000) {
              //   value = value / 100000000 + '亿' + yunit
              // } else {
              //   value = value + yunit
              // }
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
        series: yData
      }, true)
      // console.log('chart===>', myChart)

      this.allCharts[element] = myChart
    },
    getLabelByActiveName (item) {
      let label = ''
      switch (this.activeName) {
        case 'ctr':
          label = item.blockIdName + ',' + item.pageIdName + ',' + item.slotIdName
          break
        case 'package':
          label = item.packageId + ',' + item.packageType
          break
        case 'active':
          label = item.dealSource || '--'
          break
        // case 'tv':
        //   text = ''
        //   break
        case 'top20':
          label = item.videoId
          break
        case 'category':
          label = item.classificationName
          break
      }
      return label
    },
    HandleShowDayChange () {
      // 重置
      this.filter.page = 1
      this.fetchData()
    },
    HandleDataTypeChange () {
      // 重置
      this.filter.page = 1
      this.fetchData()
    },
    // HandleDateTypeChange (val) {
    //   let currentDate = new Date()
    //   let old7Date = ''
    //   if (val === '14') {
    //     old7Date = currentDate.setDate(currentDate.getDate() - 15)
    //   } else if (val === '30') {
    //     old7Date = currentDate.setDate(currentDate.getDate() - 31)
    //   } else if (val === '365') {
    //     old7Date = currentDate.setDate(currentDate.getDate() - 365)
    //   }

    //   let date1 = this.$moment(old7Date).format('YYYY-MM-DD')
    //   // let date2 = this.$moment(currentDate.setDate(currentDate.getDate() - 1)).format('YYYY-MM-DD')
    //   let date2 = this.$moment().subtract(1, 'days').format('YYYY-MM-DD')

    //   this.formData.date = [date1, date2]

    //   console.log('111111111===', this.formData.date)
    // },
    resetForm (formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
      console.log('formData===', this.formData)
      // 重置
      this.filter.page = 1
      // 清空表格数据
      this.tableData.data = []
      this.totalCount = 0
      // 查询
      this.fetchData()
    },
    handelBehaviorCrowdSelectChange (e) {
      console.log(e)
    },

    // 人群列表
    getBehaviorCrowdList (query = '') {
      this.behaviorCrowdListFilter.effectType = this.activeName
      this.behaviorCrowdListFilter.keywords = query
      if (query !== '') { // 重置
        this.behaviorCrowdListFilter.page = 1
        this.behaviorCrowdList = []
      }
      this.loading = true
      this.$service.getEffectCrowd(this.behaviorCrowdListFilter).then(data => {
        // this.behaviorCrowdList = query !== '' ? data.rows : this.behaviorCrowdList.concat(data.rows)
        this.behaviorCrowdList = data.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 资源位列表
    getResourceList (query = '') {
      const params = {
        businessType: this.businessType,
        effectType: this.activeName,
        keywords: query,
        page: 1,
        pageSize: 100
      }

      if (query !== '') { // 重置
        // this.behaviorCrowdListFilter.page = 1
        this.resourceList = []
      }
      this.loading = true
      this.$service.getResource(params).then(data => {
        // this.resourceList = query !== '' ? data.rows : this.resourceList.concat(data.rows)
        this.resourceList = data.rows.filter(item => item)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // getAddList () {
    //   this.$service.addMultiVersionCrowd(2).then(data => {
    //     this.launchPlatform = data.biLists
    //     this.strategyPlatform = data.policies
    //     this.effectTimeList = data.efTime.map(item => {
    //       return { label: item + '天', value: item }
    //     })
    //     if (data.tempCrowds) {
    //       // 行为人群列表
    //       // this.behaviorCrowdList = data.tempCrowds.filter(item => {
    //       //     return item.isFxFullSql === 3
    //       // })

    //     }
    //   })
    // },
    getPickerOptions () {
      return this.pickerOptionsDayinRange(30, 720)
    },
    pickerOptionsDayinRange (day, range) { // element日期范围选择 range 天内 开始和结束不超 day天
      let _minTime = null
      let _maxTime = null

      return {
        onPick (time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            let timeRange = day * 24 * 60 * 60 * 1000
            _minTime = time.minDate.getTime() - timeRange // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate: (time) => {
          const day1 = range * 24 * 3600 * 1000 // 2年
          let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          let minTime = Date.now() - day1

          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() < _minTime || time.getTime() > _maxTime
          } else {
            return time.getTime() > maxTime || time.getTime() < minTime
          }
        }
      }
    },

    // 删除
    handleDelete (id) {
      this.$service.deleteSpecialTagType(id).then(() => {
        this.fetchData()
        this.$message('删除成功')
      })
    },
    // handleEdit (row) {
    //   const { tagId, tagName, tagKey, remark } = row
    //   this.form.tagId = tagId
    //   this.form.tagName = tagName
    //   this.form.tagKey = tagKey
    //   this.form.remark = remark || ''
    //   this.dialogTitle = '编辑种类'
    //   this.dialogVisible = true
    // },
    // 新增或编辑组合标签种类
    // async handleAddOrEdit () {
    //   if (this.form.tagId) { // 编辑
    //     await this.$service.editSpecialTagType(this.form)
    //   } else { // 新增
    //     await this.$service.addSpecialTagType(this.form)
    //   }
    //   this.fetchData()
    //   this.dialogVisible = false
    //   this.$message.success('保存成功')
    // },
    // 新增组合标签
    // handleAdd () {
    //   // 数据置空，否则会残留编辑的数据
    //   this.form = {
    //     tagName: '',
    //     tagKey: '',
    //     remark: ''
    //   }
    //   this.dialogTitle = '新增种类'
    //   this.dialogVisible = true
    // },
    fetchData () {
      this.tbLoading = true

      // 重置图表
      this.clearChart()
      // 重置多选
      this.selected = []
      this.tableData.selected = []

      console.log('formData======', this.formData)
      // example: ['1,2,3', '4,5,6'] => ['1', '2', '3', '4', '5', '6']
      const resourceIdsArr = this.formData.resourceIds ? this.formData.resourceIds.reduce((total, item) => {
        return total.concat(item.split(','))
      }, []) : []
      console.log('resourceIdsArr===', resourceIdsArr)
      let params = {
        businessType: this.businessType,
        effectType: this.activeName,
        versionCode: this.formData.versionCode,
        // versionCode: '1,2',
        resourceIds: resourceIdsArr,
        // startPeriod: this.formData.date[0],
        // endPeriod: this.formData.date[1],
        dataType: this.showDataType,
        showDay: this.checked1 ? 1 : 0,
        page: this.filter.page,
        pageSize: this.filter.pageSize
      }

      // 产品包成交需要加一个参数
      if (params.effectType === 'package') {
        params.pkgs = this.formData.resourceIds.map((item) => {
          const arr = item.split(',')
          return {
            packageId: arr[0],
            packageType: arr[1]
          }
        })
      } else if (params.effectType === 'ctr') {
        params.pkgs = this.formData.resourceIds.map((item) => {
          const arr = item.split(',')
          return {
            blockIdName: arr[0],
            pageIdName: arr[1],
            slotIdName: arr[2]
          }
        })
      } else {
        params.pkgs = undefined
      }
      // params = qs.stringify(params.versionCode)
      this.$service.getEffectData(params).then(result => {
        this.tbLoading = false
        this.tableData.data = result.rows
        this.totalCount = result.total
      }).catch(() => {
        this.tbLoading = false
      })
    },
    // fetchData () {
    // // 搜索时名称为空时，默认赋值为类型第一个
    // if (!this.filter.tagName && this.typeTabsList.length > 0) {
    //   this.filter.tagName = this.typeTabsList[0].groupName
    //   this.activeName = this.typeTabsList[0].value
    // }
    // this.showTypeTab = !!this.typeTabsList.find(item => item.groupName === this.filter.tagName) // 搜索时隐藏类型tab

    // const filter = this.filter
    // this.$service.searchByGroup(filter).then(data => {
    //   const result = data
    //   this.dataList = result.pageInfo.list
    //   this.totalCount = result.pageInfo.total
    //   this.dataSourceEnum = result.DataSourceMap
    //   this.typeEnum = result.tagKey
    // })
    // },
    // handleCheckListChange (val) {
    //   this.$emit('change-checkList', val)
    // },
    // handleTableSelected (val, mode) {
    //   this.$emit('get-table-selected', val, mode)
    // },

    // 每页显示数据量变更, 如每页显示10条变成每页显示20时, val=20
    handleSizeChange (val) {
      this.filter.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.filter.page = 1
      this.fetchData()
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.filter.page = val
      this.fetchData()
    },

    handleRowSelectionAdd (targetItem) {
      if (this.selected.length > 3) {
        return this.$message.error('表格最多能选4项')
      }
      this.selected.push(targetItem)
      this.updateTableSelected()
    },

    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item.id !== targetItem.id
      })
      this.updateTableSelected()
    },

    handleAllRowSelectionChange (value) {
      if (value) {
        if (this.tableData.data.length > 4) {
          return this.$message.error('表格最多能选4项，无法全选')
        }
        console.log('11111111===', this.tableData.selected)
        this.tableData.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.tableData.selected = []
      }
    },

    updateTableSelected () {
      const table = this.tableData
      const newSelectedIndex = this.selected.map(item => item)
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.some(selectItem => selectItem.id === item.id)) {
          result.push(index)
        }
        return result
      }, [])
      // console.log('this.selected==', this.selected)
    }
    // fetchTypeData () {

    // }
  }

}
</script>

<style lang="stylus" scoped>
    .my-collect >>> .el-icon-cc-star-fill
      color #E6A13C
    .my-collect >>> .el-button-group
      display flex
      align-items center
      .el-button
        margin 0 5px
    .my-collect >>> .el-tabs__header
      position relative !important
      width 100% !important
      z-index 999 !important
    .my-collect >>> .el-tabs__nav-wrap
      overflow: hidden !important
      margin-bottom: -1px !important
      position: relative !important
      margin-top: 0 !important
      padding-top: 0 !important
    .my-collect
        margin-top 50px
        position relative
    .header
        display flex
        justify-content space-between
        // margin 10px 0
    .search-input
        display flex
        width 30%
        position: absolute;
        z-index: 9999;
        right: 0;
        top: 0;
    .icon-fixed
        position absolute
        top 8px
        right 10px
        transform rotate(-90deg)
.secondScreening
  margin 10px 0 20px
.watchChartDiv
  background: #ecf5ff;
  border-color: #b3d8ff;
  padding: 6px 20px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
.download
  float: right
  font-size: 24px
  margin-left: 20px
  transition: color .15s linear
  cursor pointer
.download:hover
  color #409EFF

</style>
