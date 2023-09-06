<template>
  <div class="tag-list">
    <el-table ref="changeTable" v-loading="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" border :data="dataList" @select="handleSelectOrCancel"
      @select-all="handleSelectAllOrCancel">
      <el-table-column type="selection" width="55" v-if="showSelection">
      </el-table-column>
      <el-table-column prop="tagId" label="卡种包ID">
      </el-table-column>
      <el-table-column prop="tagName" label="卡种包名">
        <template slot-scope="scope">
          {{ scope.row.tagName }}
          <span v-if="scope.row.newOrUpdate" class="red-new">{{ scope.row.newOrUpdate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="描述">
        <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="付费意愿">
        <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="数量">
        <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="更新日期">
        <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" v-if="!showSelection">
        <template slot="header">
          操作
          <el-popover placement="top" trigger="click" class="popover-button">
            <div>
              <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                <el-checkbox label="tagKey">标签code</el-checkbox>
                <el-checkbox label="tagValues">示例值</el-checkbox>
                <el-checkbox label="defineRemark">标签定义</el-checkbox>
                <el-checkbox label="tagType">类型</el-checkbox>
                <el-checkbox label="remark">备注</el-checkbox>
              </el-checkbox-group>
            </div>
            <i class="el-icon-cc-setting operate" slot="reference">
            </i>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <!-- <el-button type="text" @click="handleSeeTagCategoryDetail(scope.row)">
              查看
            </el-button>
            <el-button v-if="showEditBtn" type="text" @click="handleEdit(scope.row)">
              编辑
            </el-button> -->
            <el-button type="text" @click="handleLaunch(scope.row)">
              投放
            </el-button>
            <el-button  type="text" @click="handleMonitor(scope.row)">
              数据监控
            </el-button>

          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <slot></slot>

    <el-dialog title="数据监控" :visible.sync="monitorDialog">
      <el-date-picker v-model="monitorRangeTime" type="daterange" align="right" @change="getDataMonitor"
        class="monitor-time" value-format="yyyy-MM-dd"></el-date-picker>

      <c-table :props="monitorTable.props" :header="monitorTable.header" :data="monitorTable.data"
        class="table-overflow">
      </c-table>
      <div style="margin: 30px 0 0; overflow: auto">
        <pagination :currentpage="monitorOutForm.pageNum" :pagesize="monitorOutForm.pageSize" :totalcount="monitorTotal"
          @handle-size-change="handleMonitorSizeChange" @handle-current-change="handleMonitorCurrentChange">
        </pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showLaunchToBusiness">
      <StrategyPutIn
        :recordId="recordId"
        :tempPolicyAndCrowd="tempPolicyAndCrowd"
        @closeDialog="handleCloseDialog"
      ></StrategyPutIn>
    </el-dialog>

  </div>
</template>

<script>
import StrategyPutIn from '@/views/launch/StrategyPutIn'

export default {
  name: 'TagList',
  props: {
    dataList: {
      type: Array
    },
    checkListParent: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    showSelection: {
      type: Boolean
    },
    currentSelectedTags: {
      type: Array
    },
    showDeleteBtn: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    StrategyPutIn
  },
  data () {
    return {
      // 投放 params ---
      recordId: undefined,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      // 投放 params ---end

      // 监控 params ---
      monitorDialog: false,
      monitorRangeTime: undefined,
      monitorOutForm: {
        pageSize: 10,
        pageNum: 1
      },
      monitorTotal: 0,
      monitorTable: {
        props: {},
        header: [
          {
            label: '人群名称',
            prop: 'launch_name'
          },
          {
            label: 'dmp人群ID',
            prop: 'dmp_crowd_id'
          },
          // {
          //     label: '临时人群（SQL）指令',
          //     prop: 'crowd_sql',
          //     render: (h, params) => {
          //         return h('el-tooltip',{
          //             props: {
          //                 effect: 'dark',
          //                 content: params.row.crowd_sql,
          //                 placement:'top',
          //             }
          //         },
          //         [
          //             h('span', () => {
          //                 return params.row.crowd_sql ? params.row.crowd_sql.slice(0, 20) : ''
          //             }
          //         )]
          //         )
          //     }
          // },
          {
            label: '临时人群版本号',
            prop: 'version'
          },
          {
            label: '当前版本',
            prop: 'cur_version'
          },
          {
            label: '接收设备数量',
            prop: 'receive_total_user'
          },
          {
            label: '设备数量',
            prop: 'total_user'
          },
          {
            label: '人群位文件名称',
            prop: 'es_index'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            label: '临时人群同步日期',
            prop: 'update_time'
          }
          // {
          //   label: '版本是否删除',
          //   render: (h, params) => {
          //     return h('div', {}, [
          //       h('span', {}, params.row.del_flag === 1 ? '否' : '是') // 1 否  2 是
          //     ])
          //   }
          // }
        ],
        data: []
      },
      // 监控 params ---end

      multipleSelection: [],
      tagId: undefined,
      checkList: [],
      showDetailDialog: false,
      dataSourceEnum: {},
      typeEnum: {}
    }
  },
  watch: {
    checkListParent: function (val) {
      this.checkList = val
    },
    dataList: 'updateTableSelected',
    currentSelectedTags: 'updateTableSelected'
  },
  methods: {
    handleLaunch (row) {
      this.showLaunchToBusiness = true
      this.recordId = row.policyId
      this.tempPolicyAndCrowd = row
    },
    handleCloseDialog () {
      this.showLaunchToBusiness = false
    },
    handleMonitor (row) {
      this.monitorDialog = true
      this.selectedRow = row
      this.getDataMonitor()
    },
    getDataMonitor () {
      const monitorRangeTime = this.monitorRangeTime || []
      const startDate = monitorRangeTime[0] || ''
      const endDate = monitorRangeTime[1] || ''
      const params = {
        launchCrowdId: this.selectedRow.launchCrowdId,
        startDate,
        endDate,
        ...this.monitorOutForm
      }
      this.$service.launchVersionList(params).then(data => {
        if (data) {
          this.monitorTotal = data.pageInfo.total
          this.monitorTable.data = data.pageInfo.list || []
        } else {
          this.resultContent = '暂无数据'
        }
      })
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleMonitorSizeChange (val) {
      this.monitorOutForm.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.monitorOutForm.pageNum = 1
      this.handleGetMonitorTableList()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleMonitorCurrentChange (val) {
      this.monitorOutForm.pageNum = val
      this.handleGetMonitorTableList()
    },
    getDataSourceList () {
      this.$service.getDatasource().then((data) => {
        // const arr = Object.keys(data).map(value => ({ value: parseInt(value), label: data[value] }))
        // this.dataSourceEnum = arr
        this.dataSourceEnum = data || {}
      })
    },
    getTagType () {
      this.$service.getTagType().then((data) => {
        // const arr = Object.keys(data).map(value => ({ value: parseInt(value), label: data[value] }))
        // this.dataSourceEnum = arr
        this.typeEnum = data || {}
      })
    },

    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleSeeTagCategoryDetail (row) {
      this.tagId = row.tagId

      // 选中 tab 的 indedx, 构造 id
      const id = `tab-content-${this.tabIndex}`
      const target = document.getElementById(id)
      const parent = document.querySelector('.el-main')
      parent.scrollTop = target.offsetTop // 滚动条滑到可视位置
    },
    handleDelete (row) {
      this.$emit('delete', row.tagId)
    },
    handleEdit (row) {
      this.$emit('edit', row)
    },
    handleReadTagCancel () {
      this.tagId = undefined
    },
    handleCollect (currentTag) {
      const flag = currentTag.myCollect
      const tagId = currentTag.tagId
      if (flag) {
        //    取消收藏
        this.$service.cancelCollectTags({ tagId }, '已取消收藏！').then(() => {
          this.$emit('fetch-data')
        })
      } else {
        //    收藏
        this.$service.collectTags({ tagId }, '已成功收藏！').then(() => {
          this.$emit('fetch-data')
        })
      }
    },
    updateTableSelected () {
      const arr = []
      const currentSelectRows = this.currentSelectedTags
      this.dataList.forEach((item, index) => {
        currentSelectRows.forEach((i) => {
          if (item.tagId === i.tagId) {
            arr.push(this.dataList[index])
          }
        })
      })
      if (arr.length > 0) {
        // 如果存在，则先清空选中，再赋值
        this.$nextTick(() => {
          this.$refs.changeTable.clearSelection()
          arr.forEach(row => {
            this.$refs.changeTable.toggleRowSelection(row, true)
          })
        })
      } else {
        this.$refs.changeTable.clearSelection()
      }
    },
    handleSelectOrCancel (select, row) {
      const selectedFlag = select.length && select.indexOf(row) !== -1
      // true就是选中，0或者false是取消选中
      if (selectedFlag) {
        this.$refs.changeTable.toggleRowSelection(row, true)
        this.$emit('table-selected', row, 'add')
      } else {
        this.$refs.changeTable.toggleRowSelection(row, false)
        this.$emit('table-selected', row, 'del')
      }
    },
    handleSelectAllOrCancel (select) {
      // 当select长度为0，则是取消全选，否则是全选
      const data = this.dataList
      if (select.length === 0) {
        for (let i = 0; i < data.length; i++) {
          this.$emit('table-selected', data[i], 'del')
        }
      } else {
        for (let j = 0; j < data.length; j++) {
          this.$emit('table-selected', data[j], 'add')
        }
      }
    }
  },
  created () {
    this.getDataSourceList()
    this.getTagType()
    this.checkList = this.checkListParent
  }
}
</script>

<style lang="stylus" scoped>
.tag-list >>> .el-icon-cc-star-fill
    color #E6A13C
.tag-list >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
.operate
    margin-left 20px
    cursor pointer
.red-new
    color #ff0000
    position absolute
    top 0

.monitor-time {
  margin-bottom: 30px;
}
</style>
