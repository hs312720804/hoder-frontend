<template>
  <div class="my-collect">
      {{activeName}}
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane v-for="item in typeTabsList" :label="item.groupName" :name="item.value" :key="item.value" >
        </el-tab-pane>
      </el-tabs>

      <div class="filterFields">
        <el-form :model="formData" ref="formData" :inline="true">
          <el-form-item prop="crowdIds">
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
              placeholder="请选择人群ID、人群名、分类名称"
            >
              <el-option
                  v-for="item in behaviorCrowdList"
                  :label="item.crowdName"
                  :value="item.versionCode"
                  :key="'versionCode' + item.crowdId + businessType + activeName"

              >
                  {{ item.crowdName }} -- {{ item.crowdId }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="resourceIds">
            <!-- {{ resourceList}} -->
            <el-select
              filterable
              remote
              multiple
              clearable
              v-model="formData.resourceIds"
              :remote-method="getResourceList"
              @clear="getResourceList"
              placeholder="资源位ID、资源位名称"
            >
              <el-option
                  v-for="(item, index) in resourceList"
                  :label="item.slotIdName"
                  :value="item.slotIdName"
                  :key="'resource' + index + businessType + activeName"

              >
                  {{ item.slotIdName }}
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

      <div class="secondScreening">
        数据展示：
        <el-radio-group v-model="showDataType" @change="HandleDataTypeChange">
          <el-radio :label="0">全部数据</el-radio>
          <el-radio :label="1">投前数据</el-radio>
          <el-radio :label="2">投后数据</el-radio>
        </el-radio-group>

        <span style="float: right;">
          <el-checkbox v-model="checked1" @change="HandleShowDayChange">按天展示</el-checkbox>
          <el-checkbox v-if="activeName === 'tv' || activeName === 'top20'" v-model="checked2">区分top20影片</el-checkbox>
        </span>

      </div>

      <tag-list
        :tableData="tableData"
      >
        <div align="right">
          <pagination
              :currentpage="filter.pageNum"
              :pagesize="filter.pageSize"
              :totalcount="totalCount"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
          ></pagination>
        </div>
      </tag-list>

      <el-dialog
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
      </el-dialog>
  </div>
</template>

<script>
import tagList from './List'
import qs from 'qs'
export default {
  name: 'MyCollect',
  components: {
    tagList
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
      dataList: [],
      filter: {
        // searchType: 1,
        // tagType: 2,
        // pageNum: 1,
        // pageSize: 10,
        // tagName: undefined
        businessType: this.businessType,
        effectType: '',
        versionCode: '',
        resourceIds: '',
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
      dialogVisible: false,
      form: {
        tagName: '',
        tagKey: '',
        remark: ''
      },
      dialogTitle: '',
      totalCount: 0,
      activeName: 'ctr',
      showTypeTab: true,
      tableData: {
        props: {},
        header: [
          {
            label: '人群ID',
            prop: 'id',
            width: '70'
          },
          {
            label: '人群名称',
            prop: 'group'
          },
          {
            label: '日期',
            prop: 'sshUsername',
            render: (h, params) => {
              return h('el-button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(params)
                  }
                }
              }, params.row.sshUsername)
            }
          },
          {
            label: '产品包页面曝光次数',
            prop: 'sshPassword'
          },
          {
            label: '产品包页面曝光人数',
            prop: 'projectDir'
          },
          {
            label: '权益名',
            prop: 'reloadApi'
          },
          {
            label: '产品包类型',
            prop: 'luaPath'
          },
          {
            label: '成单路径',
            prop: 'sshPort'
          },
          {
            label: '产品包ID',
            prop: 'host'
          },
          {
            label: '单价(元)',
            prop: 'remark'
          },
          {
            label: '成交单量',
            prop: 'status',
            render: (h, { row }) => {
              if (row.status === 1) {
                return '启用'
              } else {
                return '禁用'
              }
            }
          },
          {
            label: '成单人数',
            prop: 'createTime'
          },
          {
            label: '成交金额(元)',
            prop: 'updateTime'
          }

        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      },
      formData: {
        versionCode: ''
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
      checked2: false

    }
  },
  watch: {
    businessType: {
      handler () {
        this.getBehaviorCrowdList() // 行为人群列表
        this.getResourceList() // 资源位列表
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
                  width: '100',
                  render: (h, { row }) => {
                    return row.statsDate
                  }
                },
                {
                  label: '人群ID&名称',
                  prop: 'group',
                  render: (h, { row }) => {
                    return row.id + row.crowdName
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
                  prop: 'statsDate'
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
                  prop: 'statsDate'
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
                  prop: 'dealContractsNum'
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
                  label: '成单人数',
                  prop: 'dealUsers'
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
                  prop: 'statsDate',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  render: (h, { row }) => {
                    return row.crowdId + row.crowdName
                  }
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
                  prop: 'statsDate',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  render: (h, { row }) => {
                    return row.crowdId + row.crowdName
                  }
                },
                {
                  label: '业务一级分类',
                  prop: 'reqSource'
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
                  prop: 'statsDate',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  render: (h, { row }) => {
                    return row.crowdId + row.crowdName
                  }
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
        this.fetchData()
      },
      immediate: true
    }
  },
  methods: {
    HandleShowDayChange () {
      this.fetchData()
    },
    HandleDataTypeChange () {
      // 切换数据展示
      this.filter.pageNum = 1
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
      this.$refs[formName].resetFields()
      console.log('formData===', this.formData)
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
        this.behaviorCrowdList = query !== '' ? data.rows : this.behaviorCrowdList.concat(data.rows)
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
        this.resourceList = query !== '' ? data.rows : this.resourceList.concat(data.rows)
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
    handleEdit (row) {
      const { tagId, tagName, tagKey, remark } = row
      this.form.tagId = tagId
      this.form.tagName = tagName
      this.form.tagKey = tagKey
      this.form.remark = remark || ''
      this.dialogTitle = '编辑种类'
      this.dialogVisible = true
    },
    // 新增或编辑组合标签种类
    async handleAddOrEdit () {
      if (this.form.tagId) { // 编辑
        await this.$service.editSpecialTagType(this.form)
      } else { // 新增
        await this.$service.addSpecialTagType(this.form)
      }
      this.fetchData()
      this.dialogVisible = false
      this.$message.success('保存成功')
    },
    // 新增组合标签
    handleAdd () {
      // 数据置空，否则会残留编辑的数据
      this.form = {
        tagName: '',
        tagKey: '',
        remark: ''
      }
      this.dialogTitle = '新增种类'
      this.dialogVisible = true
    },
    fetchData () {
      console.log('formData======', this.formData)
      let params = {
        businessType: this.businessType,
        effectType: this.activeName,
        versionCode: this.formData.versionCode,
        // versionCode: '1,2',
        resourceIds: '',
        // startPeriod: this.formData.date[0],
        // endPeriod: this.formData.date[1],
        dataType: this.showDataType,
        showDay: this.checked1 ? 1 : 0,
        page: this.filter.page,
        pageSize: this.filter.pageSize
      }

      // params = qs.stringify(params.versionCode)

      this.$service.getEffectData(params).then(result => {
        this.tableData.data = result.rows
        this.totalCount = result.total
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
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleTableSelected (val, mode) {
      this.$emit('get-table-selected', val, mode)
    },

    // 每页显示数据量变更, 如每页显示10条变成每页显示20时, val=20
    handleSizeChange (val) {
      this.filter.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.filter.pageNum = 1
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.filter.pageNum = val
      this.fetchData()
    }
    // fetchTypeData () {

    // }
  },
  created () {
    // this.fetchTypeData()
    // this.fetchData()
    // this.HandleDateTypeChange(this.formData.type) // 切换日期类型
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
</style>
