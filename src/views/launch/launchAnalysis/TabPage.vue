<template>
  <div class="my-collect">

      <el-tabs
        v-model="activeName"
        @tab-click="handleTabChange"
      >
        <el-tab-pane v-for="item in typeTabsList" :label="item.groupName" :name="item.groupName" :key="item.groupName" >
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
              v-model="formData.crowdIds"
              :remote-method="getBehaviorCrowdList"
              @change="handelBehaviorCrowdSelectChange($event)"
              @clear="getBehaviorCrowdList"
              placeholder="请选择人群ID、人群名、分类名称"
            >
              <el-option
                  v-for="item in behaviorCrowdList"
                  :label="item.launchName"
                  :value="item.policyIds+'_'+item.policyCrowdIds"
                  :key="item.launchCrowdId+''"

              >
                  {{ item.launchName }} -- {{ item.launchCrowdId }}
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="type">
            <el-radio-group v-model="formData.type">
              <el-radio-button label="近14天"></el-radio-button>
              <el-radio-button label="近30天"></el-radio-button>
              <el-radio-button label="全年"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="date">
            <!-- <el-date-picker
              v-model="formData.date"
              type="dateRange"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              value="yyyy-MM-dd"
            >
            </el-date-picker> -->
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
          </el-form-item>

          <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetForm('formData')">重置</el-button>
          </el-form-item>
        </el-form>

      </div>

      <div class="secondScreening">
        数据展示：
        <el-radio-group v-model="radio">
          <el-radio :label="0">全部数据</el-radio>
          <el-radio :label="1">投前数据</el-radio>
          <el-radio :label="2">投后数据</el-radio>
        </el-radio-group>

        <span style="float: right;">
          <el-checkbox v-model="checked1">按天展示</el-checkbox>
          <el-checkbox v-model="checked2">区分top20影片</el-checkbox>
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
    }
  },

  data () {
    return {
      dataList: [],
      filter: {
        searchType: 1,
        tagType: 2,
        pageNum: 1,
        pageSize: 10,
        tagName: undefined
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
      typeTabsList: [],
      activeName: '',
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
        type: '近14天',
        mac: undefined,
        cOpenid: undefined,
        thirdUserId: undefined,
        tagId: undefined,
        tagAttrId: undefined,
        tempMac: undefined,
        crowdIds: '',
        date: []
      },
      behaviorCrowdList: [],
      behaviorCrowdListFilter: {
        crowdType: 3,
        pageNum: 1,
        pageSize: 30
      },
      radio: 0,
      checked1: false,
      checked2: false

    }
  },
  watch: {
    activeName: {
      handler (val) {
        switch (val) {
          case '流量CTR':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '圈定量',
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
                  label: '命中量',
                  prop: 'sshPassword'
                },
                {
                  label: '版面ID&名称',
                  prop: 'projectDir'
                },
                {
                  label: '板块（专辑）id&名称',
                  prop: 'reloadApi'
                },
                {
                  label: '推荐位id&名称',
                  prop: 'luaPath'
                },
                {
                  label: '曝光次数',
                  prop: 'sshPort'
                },
                {
                  label: '曝光人数',
                  prop: 'host'
                },
                {
                  label: '点击次数',
                  prop: 'remark'
                },
                {
                  label: '点击人数',
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
                  label: 'PV CTR',
                  prop: 'createTime'
                },
                {
                  label: 'UV CTR',
                  prop: 'updateTime'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case '产品包成交':
            this.tableData = {
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
            }
            break
          case '活跃成交':
            this.tableData = {
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
                  label: '圈定量',
                  prop: 'sshPassword'
                },
                {
                  label: '主页活跃量',
                  prop: 'projectDir'
                },
                {
                  label: '起播活跃量',
                  prop: 'reloadApi'
                },
                {
                  label: '产品包页面曝光人数',
                  prop: 'luaPath'
                },
                {
                  label: '成交路径',
                  prop: 'sshPort'
                },
                {
                  label: '成单总设备量',
                  prop: 'host'
                },
                {
                  label: '成单人数',
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
            }
            break
          case '观影行为':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '播放次数',
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
                  label: '播放人数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放总时长',
                  prop: 'projectDir'
                },
                {
                  label: '平均每次时长',
                  prop: 'reloadApi'
                },
                {
                  label: '平均每人时长',
                  prop: 'luaPath'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
          case '观影TOP20影片':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '业务一级分类',
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
                  label: '影片ID&影片名',
                  prop: 'sshPassword'
                },
                {
                  label: '影片排名',
                  prop: 'projectDir'
                },
                {
                  label: '成单人数',
                  prop: 'sshPassword'
                },
                {
                  label: '成交单量',
                  prop: 'projectDir'
                },
                {
                  label: '成交金额',
                  prop: 'projectDir'
                },
                {
                  label: '播放次数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放人数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放总时长',
                  prop: 'projectDir'
                },
                {
                  label: '平均每次时长',
                  prop: 'reloadApi'
                },
                {
                  label: '平均每人时长',
                  prop: 'luaPath'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
          case '观影分类':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '分类（频道）',
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
                  label: '播放次数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放人数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放总时长',
                  prop: 'projectDir'
                },
                {
                  label: '平均每次时长',
                  prop: 'reloadApi'
                },
                {
                  label: '平均每人时长',
                  prop: 'luaPath'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSearch () {

    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      console.log('formData===', this.formData)
    },
    handelBehaviorCrowdSelectChange (e) {
      console.log(e)
    },
    getBehaviorCrowdList (query = '') {
      this.behaviorCrowdListFilter.launchName = query
      if (query !== '') { // 重置
        this.behaviorCrowdListFilter.pageNum = 1
        this.behaviorCrowdList = []
      }
      this.loading = true
      this.$service.getTempLaunchList(this.behaviorCrowdListFilter).then(data => {
        this.behaviorCrowdListpages = data.pageInfo.pages // 总页数
        this.behaviorCrowdList = query !== '' ? data.pageInfo.list : this.behaviorCrowdList.concat(data.pageInfo.list)
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
    handleTabChange () {
      this.filter.tagName = this.activeName
      this.fetchData()
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
    async fetchData () {
      // 搜索时名称为空时，默认赋值为类型第一个
      if (!this.filter.tagName && this.typeTabsList.length > 0) {
        this.filter.tagName = this.typeTabsList[0].groupName
        this.activeName = this.typeTabsList[0].groupName
      }
      this.showTypeTab = !!this.typeTabsList.find(item => item.groupName === this.filter.tagName) // 搜索时隐藏类型tab

      const filter = this.filter
      this.$service.searchByGroup(filter).then(data => {
        const result = data
        this.dataList = result.pageInfo.list
        this.totalCount = result.pageInfo.total
        this.dataSourceEnum = result.DataSourceMap
        this.typeEnum = result.tagKey
      })
    },
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
    },
    fetchTypeData () {
      // const typeFilter = {
      //   searchType: 2,
      //   tagType: 2,
      //   pageNum: 1,
      //   pageSize: 10
      // }

      this.typeTabsList = [
        {
          'groupName': '流量CTR'
        },
        {
          'groupName': '产品包成交'
        },
        {
          'groupName': '活跃成交'
        },
        {
          'groupName': '观影行为'
        },
        {
          'groupName': '观影TOP20影片'
        },
        {
          'groupName': '观影分类'
        }
      ]
      console.log('this.typeTabsList===', this.typeTabsList)
      this.filter.tagName = this.typeTabsList[0].groupName
      this.activeName = this.typeTabsList[0].groupName
    }
  },
  created () {
    this.$root.$on('third-tag-list-refresh', this.fetchData)
    this.fetchTypeData()
    this.fetchData()

    this.getBehaviorCrowdList() // 行为人群列表
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
