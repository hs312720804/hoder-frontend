<template>
  <div class="tag-list">
    <el-table ref="changeTable" border :data="dataList"
    >
      <el-table-column prop="launchCrowdId" label="卡种包ID">
      </el-table-column>
      <el-table-column prop="card" label="卡种包名">
      </el-table-column>
      <!-- <el-table-column prop="will" label="描述">
        <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="will" label="付费意愿">
      </el-table-column> -->

      <el-table-column prop="size" label="数量">
        <template slot-scope="scope">
            {{ cc_format_number(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期">
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot="header">
          操作
          <!-- <el-popover placement="top" trigger="click" class="popover-button">
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
          </el-popover> -->
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <!-- <el-button type="text" @click="handleSeeTagCategoryDetail(scope.row)">
              查看
            </el-button>
            <el-button v-if="showEditBtn" type="text" @click="handleEdit(scope.row)">
              编辑
            </el-button> -->
            <!-- <el-button type="text" @click="handleLaunch(scope.row)">
              投放
            </el-button> -->
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

    <!-- <el-dialog :visible.sync="showLaunchToBusiness">
      <StrategyPutIn
        :recordId="recordId"
        :tempPolicyAndCrowd="tempPolicyAndCrowd"
        @closeDialog="handleCloseDialog"
      ></StrategyPutIn>
    </el-dialog> -->

  </div>
</template>

<script>
// import StrategyPutIn from '@/views/launch/StrategyPutIn'

export default {
  name: 'TagList',
  props: {
    dataList: {
      type: Array
    }
    // checkListParent: {
    //   type: Array
    // },
    // loading: {
    //   type: Boolean
    // },
    // showSelection: {
    //   type: Boolean
    // },
    // currentSelectedTags: {
    //   type: Array
    // },
    // showDeleteBtn: {
    //   type: Boolean,
    //   default: false
    // },
    // showEditBtn: {
    //   type: Boolean,
    //   default: false
    // },
    // tabIndex: {
    //   type: [String, Number],
    //   default: ''
    // }
  },
  components: {
    // StrategyPutIn
  },
  data () {
    return {
      selectedRow: {},
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
      }
      // 监控 params ---end

      // multipleSelection: [],
      // tagId: undefined,
      // checkList: [],
      // showDetailDialog: false,
      // dataSourceEnum: {},
      // typeEnum: {}
    }
  },
  watch: {
    // checkListParent: function (val) {
    //   this.checkList = val
    // },
    // dataList: 'updateTableSelected',
    // currentSelectedTags: 'updateTableSelected',
    // 'selectedRow.id' (val) {
    //   // 切换时，重置弹窗中的时间范围选择
    //   this.monitorRangeTime = []
    //   console.log('this.monitorRangeTime22222--->', this.monitorRangeTime)
    // }
  },
  methods: {
    // handleLaunch (row) {
    //   this.showLaunchToBusiness = true
    //   this.recordId = row.policyId
    //   this.tempPolicyAndCrowd = row
    // },
    handleCloseDialog () {
      this.showLaunchToBusiness = false
    },
    handleMonitor (row) {
      this.monitorDialog = true
      this.selectedRow = row
      this.monitorRangeTime = [] // 重置选择时间
      this.getDataMonitor()
    },
    getDataMonitor () {
      // console.log('this.monitorRangeTime-->', this.monitorRangeTime)
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
    }
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
