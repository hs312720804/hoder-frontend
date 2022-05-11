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
          <!-- <el-form-item prop="versionCode"> -->
            <!-- <el-select
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
            </el-select> -->

          <span v-if="activeName === 'ctr'">
            <el-form-item prop="crowdId">
              <el-input
                v-model="formData.crowdId"
                placeholder="人群ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="crowdName">
              <el-input
                v-model="formData.crowdName"
                placeholder="人群名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="pageIdName">
              <el-input
                v-model="formData.pageIdName"
                placeholder="版面ID或版面名称"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="blockIdName">
              <el-input
                v-model="formData.blockIdName"
                placeholder="板块ID或板块名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="slotIdName">
              <el-input
                v-model="formData.slotIdName"
                placeholder="推荐位ID或名称"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
          </span>

          <span v-else-if="activeName === 'package'">
            <el-form-item prop="crowdId">
              <el-input
                v-model="formData.crowdId"
                placeholder="人群ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="crowdName">
              <el-input
                v-model="formData.crowdName"
                placeholder="人群名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="equityPackageName">
              <el-input
                v-model="formData.equityPackageName"
                placeholder="权益名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="packageType">
              <el-input
                v-model="formData.packageType"
                placeholder="产品包类型"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="dealSource">
              <el-input
                v-model="formData.dealSource"
                placeholder="成单路径"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="packageId">
              <el-input
                v-model="formData.packageId"
                placeholder="产品包ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
          </span>

          <span v-else-if="activeName === 'active'">
            <el-form-item prop="crowdId">
              <el-input
                v-model="formData.crowdId"
                placeholder="人群ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="crowdName">
              <el-input
                v-model="formData.crowdName"
                placeholder="人群名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="dealSource">
              <el-input
                v-model="formData.dealSource"
                placeholder="成交路径"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
          </span>

          <span v-else-if="activeName === 'tv'">
            <el-form-item prop="crowdId">
              <el-input
                v-model="formData.crowdId"
                placeholder="人群ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="crowdName">
              <el-input
                v-model="formData.crowdName"
                placeholder="人群名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
          </span>

          <span v-else-if="activeName === 'top20'">
            <el-form-item prop="crowdId">
              <el-input
                v-model="formData.crowdId"
                placeholder="人群ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="crowdName">
              <el-input
                v-model="formData.crowdName"
                placeholder="人群名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="videoFirstLevelClassification">
              <el-input
                v-model="formData.videoFirstLevelClassification"
                placeholder="业务一级分类"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="videoId">
              <el-input
                v-model="formData.videoId"
                placeholder="影片ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="videoName">
              <el-input
                v-model="formData.videoName"
                placeholder="影片名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
          </span>

          <span v-else-if="activeName === 'category'">
            <el-form-item prop="crowdId">
              <el-input
                v-model="formData.crowdId"
                placeholder="人群ID"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="crowdName">
              <el-input
                v-model="formData.crowdName"
                placeholder="人群名"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="classificationName">
              <el-input
                v-model="formData.classificationName"
                placeholder="分类"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="classificationChannel">
              <el-input
                v-model="formData.classificationChannel"
                placeholder="频道"
                class="filter-input"
                clearable>
              </el-input>
            </el-form-item>
          </span>

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
        <!-- <el-radio-group v-model="showDataType" @change="HandleDataTypeChange">
          <el-radio :label="0">全部数据</el-radio>
          <el-radio :label="1">投前数据</el-radio>
          <el-radio :label="2">投后数据</el-radio>
        </el-radio-group> -->

        <a :href="downloadUrl" download ref="download_Url"></a>
        <i v-if="showLoadingDownload" class="el-icon-loading" style="float: right; color: #5cb6ff;"></i>
        <i class="el-icon-download download"  @click="handleDownload"></i>

        <span style="float: right;">
          <el-checkbox v-model="checked1" @change="HandleShowDayChange">按天展示</el-checkbox>
        </span>

      </div>

      <c-table
        v-if="showTable"
        ref="tabTable"
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
      <div style="overflow: hidden; width: 100%">
        <div
          v-for="(item, index) in chartData"
          :key="'chart' + index"
          :id="'funnelChart'+index"
          style="float: left; width: 500px; height: 360px; padding: 20px 0 40px">
        </div>
      </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TabPage',
  components: {
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
      // activeName: 'category',
      activeName: 'ctr',
      showTypeTab: true,
      tableData: {},
      formData: {
        // businessType: this.businessType
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
      downloadUrl: '',
      showTable: true,
      showLoadingDownload: false
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
        if (val === 'ctr') {
          this.formData = {
            crowdId: '',
            crowdName: '',
            pageIdName: '',
            blockIdName: '',
            slotIdName: ''
          }
        } else if (val === 'package') {
          this.formData = {
            crowdId: '',
            crowdName: '',
            packageType: '',
            equityPackageName: '',
            dealSource: '',
            packageId: ''
          }
        } else if (val === 'active') {
          this.formData = {
            crowdId: '',
            crowdName: '',
            dealSource: ''
          }
        } else if (val === 'tv') {
          this.formData = {
            crowdId: '',
            crowdName: ''
          }
        } else if (val === 'top20') {
          this.formData = {
            crowdId: '',
            crowdName: '',
            videoFirstLevelClassification: '',
            videoId: '',
            videoName: ''
          }
        } else if (val === 'category') {
          this.formData = {
            crowdId: '',
            crowdName: '',
            classificationName: '',
            classificationChannel: ''
          }
        }
        this.showTable = false

        this.$nextTick(() => {
          this.showTable = true
          // 设置表格表头数据
          this.setTableData(val)

          // 行为人群列表
          // this.getBehaviorCrowdList()

          // 资源位列表
          // this.getResourceList()

          // 切换tab的时候重置筛选并查询
          this.resetForm('formData')
        })
      },
      immediate: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    setTableData (val) {
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
                prop: 'crowdAmount',
                sortable: true,
                sortBy: 'crowdAmount'
              },
              {
                label: '命中量',
                prop: 'hitAmount',
                sortable: true
              },
              {
                label: '版面ID&名称',
                prop: 'pageIdName',
                width: 150,
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '板块（专辑）id&名称',
                prop: 'blockIdName',
                width: 180,
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '推荐位id&名称',
                prop: 'slotIdName',
                width: 150,
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '曝光次数',
                prop: 'exposureTimes',
                sortable: true
              },
              {
                label: '曝光人数',
                prop: 'exposureNum',
                sortable: true
                // sortMethod: this.sortDevName,
                // defaultSort: " {prop: 'exposureNum'} "
              },
              {
                label: '点击次数',
                prop: 'clickTimes',
                sortable: true
              },
              {
                label: '点击人数',
                prop: 'clickNum',
                sortable: true
              },
              {
                label: 'PV CTR',
                prop: 'clickPv',
                sortable: true
              },
              {
                label: 'UV CTR',
                prop: 'clickUv',
                sortable: true
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
              },
              {
                label: '产品包页面曝光次数',
                prop: 'exposeTimes',
                sortable: true
              },
              {
                label: '产品包页面曝光人数',
                prop: 'exposeNum',
                sortable: true
              },
              {
                label: '权益名',
                prop: 'equityPackageName',
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '产品包类型',
                prop: 'packageType',
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '成单路径',
                prop: 'dealSource',
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '产品包ID',
                prop: 'packageId',
                sortable: true
              },
              {
                label: '单价(元)',
                prop: 'unitPrice',
                sortable: true
              },
              {
                label: '成交单量',
                prop: 'dealVolume',
                sortable: true
              },
              {
                label: '成单人数',
                prop: 'dealNum',
                sortable: true
              },
              {
                label: '成交金额(元)',
                prop: 'dealAmount',
                sortable: true
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
                render: (h, { row }) => {
                  return this.checked1 ? row.statsDate : `${row.startPeriod} - ${row.endPeriod}`
                }
              },
              {
                label: '圈定量',
                prop: 'crowdNum',
                sortable: true
              },
              {
                label: '主页活跃量',
                prop: 'activeUsersNum',
                sortable: true
              },
              {
                label: '起播活跃量',
                prop: 'playVideoUsersNum',
                sortable: true
              },
              {
                label: '产品包页面曝光人数',
                prop: 'exposeNum',
                sortable: true
              },
              {
                label: '成交路径',
                prop: 'dealSource',
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '成单总设备量',
                prop: 'dealUsers',
                sortable: true
              },
              {
                label: '成单人数',
                prop: 'dealUsers',
                sortable: true
              },
              {
                label: '成交单量',
                prop: 'dealContractsNum',
                sortable: true
              },
              {
                label: '成交金额(元)',
                prop: 'dealAmount',
                sortable: true
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
              },
              {
                label: '播放次数',
                prop: 'watchTimes',
                sortable: true
              },
              {
                label: '播放人数',
                prop: 'viewersNum',
                sortable: true
              },
              {
                label: '播放总时长',
                prop: 'watchLastingTimes',
                sortable: true
              },
              {
                label: '平均每次时长',
                prop: 'averageWatchPeriodByTime',
                sortable: true
              },
              {
                label: '平均每人时长',
                prop: 'averageWatchPeriodByNum',
                sortable: true
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
              },
              {
                label: '业务一级分类',
                prop: 'videoFirstLevelClassification',
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '影片ID&影片名',
                render: (h, { row }) => {
                  return row.videoId + row.videoName
                },
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '影片排名',
                prop: 'videoRanking',
                sortable: true
              },
              {
                label: '成单人数',
                prop: 'dealUsers',
                sortable: true
              },
              {
                label: '成交单量',
                prop: 'dealVolume',
                sortable: true
              },
              {
                label: '成交金额',
                prop: 'dealAmount',
                sortable: true
              },
              {
                label: '播放次数',
                prop: 'watchTimes',
                sortable: true
              },
              {
                label: '播放人数',
                prop: 'viewersNum',
                sortable: true
              },
              {
                label: '播放总时长',
                prop: 'watchLastingTimes',
                sortable: true
              },
              {
                label: '平均每次时长',
                prop: 'averageWatchPeriodByTime',
                sortable: true
              },
              {
                label: '平均每人时长',
                prop: 'averageWatchPeriodByNum',
                sortable: true
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
                label: '分类',
                prop: 'classificationName',
                sortable: true,
                sortMethod: this.sortDevName
                // render: (h, { row }) => {
                //   return `${row.classificationName} - ${row.classificationChannel}`
                // }
              },
              {
                label: '频道',
                prop: 'classificationChannel',
                sortable: true,
                sortMethod: this.sortDevName
              },
              {
                label: '播放次数',
                prop: 'watchTimes',
                sortable: true
              },
              {
                label: '播放人数',
                prop: 'viewersNum',
                sortable: true
              },
              {
                label: '播放总时长',
                prop: 'watchLastingTimes',
                sortable: true
              },
              {
                label: '平均每次时长',
                prop: 'averageWatchPeriodByTime',
                sortable: true
              },
              {
                label: '平均每人时长',
                prop: 'averageWatchPeriodByNum',
                sortable: true
              }
            ],
            data: [],
            selected: [],
            selectionType: 'none'
          }
          break
      }
    },
    sortDevName (str1, str2) {
      console.log('str1===', str1)
      console.log('str2===', str2)
      console.log('=================================')
      let res = 0
      for (let i = 0; ;i++) {
        if (!str1[i] || !str2[i]) {
          res = str1.length - str2.length
          break
        }
        const char1 = str1[i]
        const char1Type = this.getChartType(char1)
        const char2 = str2[i]
        const char2Type = this.getChartType(char2)
        // 类型相同的逐个比较字符
        if (char1Type[0] === char2Type[0]) {
          if (char1 === char2) {
            continue
          } else {
            if (char1Type[0] === 'zh') {
              res = char1.localeCompare(char2)
            } else if (char1Type[0] === 'en') {
              res = char1.charCodeAt(0) - char2.charCodeAt(0)
            } else {
              res = char1 - char2
            }
            break
          }
        } else {
          // 类型不同的，直接用返回的数字相减
          res = char1Type[1] - char2Type[1]
          break
        }
      }
      return res
    },
    getChartType (char) {
      // 数字可按照排序的要求进行自定义，我这边产品的要求是
      // 数字（0->9）->大写字母（A->Z）->小写字母（a->z）->中文拼音（a->z）
      if (/^[\u4e00-\u9fa5]$/.test(char)) {
        return ['zh', 300]
      }
      if (/^[a-zA-Z]$/.test(char)) {
        return ['en', 200]
      }
      if (/^[0-9]$/.test(char)) {
        return ['number', 100]
      }
      return ['others', 999]
    },
    // 下载
    handleDownload () {
      if (this.showLoadingDownload) return
      this.showLoadingDownload = true
      if (this.totalCount > 100000) {
      // if (this.totalCount > 10) {
        return this.$message.error('最多下载10万条数据，请筛选后下载')
      }

      // let params = {
      //   businessType: this.businessType,
      //   effectType: this.activeName,
      //   versionCode: this.formData.versionCode,
      //   resourceIds: resourceIdsArr,
      //   dataType: this.showDataType,
      //   showDay: this.checked1 ? 1 : 0,
      //   page: this.filter.page,
      //   pageSize: this.totalCount
      // }

      let params = {
        businessType: this.businessType,
        effectType: this.activeName,
        dataType: 2, // 0-全部数据、1-投前数据、2-投后数据
        showDay: this.checked1 ? 1 : 0, // 是否按天展示
        page: this.filter.page,
        pageSize: this.totalCount,
        ...this.formData
      }

      const link = document.createElement('a')

      axios.post('/api/effect/downloadNew', params, { responseType: 'arraybuffer' }).then(res => {
        this.showLoadingDownload = false
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
    // 滚动到底部
    setBottom () {
      this.$nextTick(() => {
        var container = document.querySelector('.el-main')
        // container.scrollTop = container.scrollHeight
        container.scrollTo(0, container.scrollHeight)
      })
    },
    // 查看折线图
    watchLine () {
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

      // console.log('newParamsArr===', newParamsArr)
      this.$service.effectGetLine(newParamsArr).then(data => {
        // console.log('data===>', data)
        // this.showFunnel(data)

        // if (!data || data.length === 0) {
        if (!data || data.length === 0 || (data.amount.data.length === 0 && data.dealVolume.data.length === 0)) {
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
          this.setBottom() // 滚动到底部
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

      // console.log('newParamsArr===', newParamsArr)
      this.$service.effectGetFunnel(newParamsArr).then(data => {
        // console.log('data===>', data)
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
        this.chartData.forEach((item, index) => {
          this.$nextTick(() => {
            this.showFunnel(item, `funnelChart${index}`)
            this.setBottom() // 滚动到底部
          })
        })
      })
    },
    showFunnel (item, id) {
      const echarts = require('echarts')
      // console.log('item.first===', item)
      // console.log('item.id===', id)
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
              // console.log('d====', d)
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
        },
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

    resetForm (formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
      this.$refs.tabTable && this.$refs.tabTable.$refs.table.clearSort()

      // console.log('formData===', this.formData)
      // 重置
      this.filter.page = 1
      // 清空表格数据
      this.tableData.data = []
      this.totalCount = 0
      // 查询
      this.fetchData()
    },
    handelBehaviorCrowdSelectChange (e) {
      // console.log(e)
    },

    // 人群列表
    getBehaviorCrowdList (query = '') {
      // this.behaviorCrowdListFilter.effectType = this.activeName
      // this.behaviorCrowdListFilter.keywords = query
      const params = {
        businessType: this.businessType,
        effectType: this.activeName,
        keywords: query,
        page: 1,
        pageSize: 100
      }
      if (query !== '') { // 重置
        // this.behaviorCrowdListFilter.page = 1
        this.behaviorCrowdList = []
      }
      this.loading = true
      this.$service.getEffectCrowd(params).then(data => {
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

    fetchData () {
      this.tbLoading = true

      // 重置图表
      this.clearChart()
      // 重置多选
      this.selected = []
      this.tableData.selected = []

      console.log('formData======', this.formData)

      let params = {
        businessType: this.businessType,
        effectType: this.activeName,
        dataType: 2, // 0-全部数据、1-投前数据、2-投后数据
        showDay: this.checked1 ? 1 : 0, // 是否按天展示
        page: this.filter.page,
        pageSize: this.filter.pageSize,
        ...this.formData
      }

      let api = ''
      const val = this.activeName
      if (val === 'ctr') {
        api = 'getCtr'
      } else if (val === 'package') {
        api = 'getPackage'
      } else if (val === 'active') {
        api = 'getActive'
      } else if (val === 'tv') {
        api = 'getTv'
      } else if (val === 'top20') {
        api = 'getTvTop'
      } else if (val === 'category') {
        api = 'getCategory'
      }

      this.$service[api](params).then(result => {
        this.tbLoading = false
        this.tableData.data = result.rows
        this.totalCount = result.total
      }).catch(() => {
        this.tbLoading = false
      })
    },

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
    }

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
        width 350px
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
.filter-input
  width 150px
</style>
