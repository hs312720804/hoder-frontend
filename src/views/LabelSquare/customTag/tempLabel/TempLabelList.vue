<template>
  <!--
    crowdType
    2：临时人群
    3：行为人群
    4：广告数据银行
 -->
  <div class="temp-label-list">
    <div class="header">
      <div v-if="!showSelection">
        <el-button v-if="crowdType === 2" @click="handleAdd" type="primary">
          新建
        </el-button>

        <!-- 行为人群 -->
        <el-radio-group v-if="crowdType === 3" v-model="myself" @change="fetchData">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">我的</el-radio>
        </el-radio-group>
      </div>
      <div v-else></div>
      <div style="display: flex; justify-content: space-between; ">
        <!-- 标签分类搜索 -->
        <!-- <div class="search-input">
          <el-input placeholder="支持按标签名、ID搜索" class="header-input" v-model="launchName" @keyup.enter.native="fetchData">
          </el-input>
          <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
        </div> -->
        <!-- <el-popover placement="top" trigger="click" class="popover-button">
          <div>
            <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
              <el-checkbox label="creatorName">创建人</el-checkbox>
              <el-checkbox label="createTime">创建时间</el-checkbox>
              <el-checkbox label="department">业务部门</el-checkbox>
            </el-checkbox-group>
          </div>
          <i class="el-icon-cc-setting operate" slot="reference">
          </i>
        </el-popover> -->
      </div>

    </div>
    <div>
      <el-table ref="tempChangeTable" :data="tableData" border @select="handleSelectOrCancel"
        @select-all="handleSelectAllOrCancel">
        <el-table-column type="selection" width="55" v-if="showSelection"></el-table-column>
        <el-table-column prop="tagId" label="标签ID"></el-table-column>

        <!-- <el-table-column prop="launchCrowdId" label="投放ID"></el-table-column> -->
        <el-table-column prop="dmpCrowdId" label="dmp人群投放ID" width="120"></el-table-column>
        <el-table-column prop="launchName" label="名称" width="180"></el-table-column>
        <!--<el-table-column prop="jobEndTime" label="有效期"></el-table-column>-->
        <el-table-column prop="count" label="使用次数">
          <!--<template slot-scope="scope">-->
          <!--{{scope.row.history.status}}+++{{(launchStatusEnum[scope.row.history.status]).code}}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template v-slot="{row}">
            <CrowdStatus
              :row="row"
              :launchStatusEnum="launchStatusEnum"
              @get-list="fetchData"
            ></CrowdStatus>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" label="创建人" prop="creatorName">
        </el-table-column>
        <el-table-column v-if="(checkList.indexOf('createTime') > -1)" label="创建时间" prop="history.createTime">
        </el-table-column>
        <el-table-column v-if="(checkList.indexOf('department') > -1)" label="业务部门" prop="department">
        </el-table-column> -->
        <el-table-column label="设备数量">
          <template slot-scope="scope">
            {{ cc_format_number(scope.row.history.totalUser) }}
          </template>
        </el-table-column>
        <el-table-column label="微信数量">
          <template slot-scope="scope">
            {{ cc_format_number(scope.row.history.totalWxOpenid) }}
          </template>
        </el-table-column>
        <el-table-column label="版本" width="100">
          <template slot-scope="scope">
            {{ scope.row.history.version }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="总体耗时（min）">
          <template slot-scope="scope">
            {{ scope.row.spentTotalTime }}
          </template>
        </el-table-column> -->

        <el-table-column label="操作" width="120" v-if="!showSelection" fixed="right">
          <template slot-scope="scope">
            <TempLabelListOperate
              :crowdType="crowdType"
              :scope="scope"
              :launchStatusEnum="launchStatusEnum"
              @show-add="(id, statusCode) => $emit('show-add', id, statusCode)"
              @get-list="fetchData"
            >

            </TempLabelListOperate>
          </template>
        </el-table-column>
      </el-table>
      <div align="right">
        <pagination :currentpage="currentPage" :pagesize="pageSize" :totalcount="totalCount"
          @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange"></pagination>
      </div>
    </div>

    <!-- <el-dialog title="数据监控" :visible.sync="monitorDialog">
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
    </el-dialog> -->
  </div>
</template>

<script>
// import TipPopover from '@/views/crowdCompute/components/tipPopover.vue'
import TempLabelListOperate from '@/views/LabelSquare/coms/TempLabelListOperate.vue'
import CrowdStatus from '@/views/crowdCompute/components/crowdStatus.vue'
export default {
  name: 'TempLabel',
  components: {
    // TipPopover,
    TempLabelListOperate,
    CrowdStatus
  },
  props: {
    refreshFlag: {
      type: Boolean
    },
    showSelection: {
      type: Boolean
    },
    currentSelectTag: {
      type: Array
    },
    checkListParent: {
      type: Array
    },
    crowdType: {
      type: Number
    }
  },
  data () {
    return {
      myself: 1,
      tableData: [],
      filter: {},
      launchName: undefined,
      launchStatusEnum: {},
      pageSize: 10,
      currentPage: 1,
      totalCount: 1,
      // isShowCondition: false,
      // launchType: undefined,
      // launchTitle: '',
      // selectStrategy: null, // 人群条件的选择策略
      checkList: []
      // monitorDialog: false,
      // monitorRangeTime: undefined,
      // monitorOutForm: {
      //   pageSize: 10,
      //   pageNum: 1
      // },
      // monitorTotal: 0,
      // monitorTable: {
      //   props: {},
      //   header: [
      //     {
      //       label: '人群名称',
      //       prop: 'launch_name'
      //     },
      //     {
      //       label: 'dmp人群ID',
      //       prop: 'dmp_crowd_id'
      //     },
      //     // {
      //     //     label: '临时人群（SQL）指令',
      //     //     prop: 'crowd_sql',
      //     //     render: (h, params) => {
      //     //         return h('el-tooltip',{
      //     //             props: {
      //     //                 effect: 'dark',
      //     //                 content: params.row.crowd_sql,
      //     //                 placement:'top',
      //     //             }
      //     //         },
      //     //         [
      //     //             h('span', () => {
      //     //                 return params.row.crowd_sql ? params.row.crowd_sql.slice(0, 20) : ''
      //     //             }
      //     //         )]
      //     //         )

      //     //     }
      //     // },
      //     {
      //       label: '临时人群版本号',
      //       prop: 'version'
      //     },
      //     {
      //       label: '当前版本',
      //       prop: 'cur_version'
      //     },
      //     {
      //       label: '接收设备数量',
      //       prop: 'receive_total_user'
      //     },
      //     {
      //       label: '设备数量',
      //       prop: 'total_user'
      //     },
      //     {
      //       label: '人群位文件名称',
      //       prop: 'es_index'
      //     },
      //     {
      //       label: '状态',
      //       prop: 'status_name'
      //     },
      //     {
      //       label: '临时人群同步日期',
      //       prop: 'update_time'
      //     }
      //     // {
      //     //   label: '版本是否删除',
      //     //   render: (h, params) => {
      //     //     return h('div', {}, [
      //     //       h('span', {}, params.row.del_flag === 1 ? '否' : '是') // 1 否  2 是
      //     //     ])
      //     //   }
      //     // }
      //   ],
      //   data: []
      // }
    }
  },
  created () {
    this.$root.$on('custom-tag-list-refresh', this.fetchData)
    this.fetchData()
    // this.monitorRangeTime = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.$moment().subtract(0, 'days').format('YYYY-MM-DD')]
  },
  beforeDestroy () {
    this.$root.$off('custom-tag-list-refresh')
  },
  watch: {
    refreshFlag: function (val) {
      if (val) {
        this.fetchData()
      }
    },
    currentSelectTag: 'updateTableSelected',
    checkListParent: function (val) {
      this.checkList = val
    }
  },
  methods: {

    // handleMonitor (row) {
    //   this.monitorDialog = true
    //   this.selectedRow = row
    //   this.getDataMonitor()
    // },

    // getDataMonitor () {
    //   this.handleGetMonitorTableList()
    // },

    // handleGetMonitorTableList () {
    //   const monitorRangeTime = this.monitorRangeTime || []
    //   const startDate = monitorRangeTime[0] || ''
    //   const endDate = monitorRangeTime[1] || ''
    //   const params = {
    //     launchCrowdId: this.selectedRow.launchCrowdId,
    //     startDate,
    //     endDate,
    //     ...this.monitorOutForm
    //   }
    //   this.$service.launchVersionList(params).then(data => {
    //     if (data) {
    //       this.monitorTotal = data.pageInfo.total
    //       this.monitorTable.data = data.pageInfo.list || []
    //     } else {
    //       this.resultContent = '暂无数据'
    //     }
    //   })
    // },

    // // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    // handleMonitorSizeChange (val) {
    //   this.monitorOutForm.pageSize = val
    //   // 每次切换页码条，都把页面数重置为1
    //   this.monitorOutForm.pageNum = 1
    //   this.handleGetMonitorTableList()
    // },

    // // 页码变更, 如第1页变成第2页时,val=2
    // handleMonitorCurrentChange (val) {
    //   this.monitorOutForm.pageNum = val
    //   this.handleGetMonitorTableList()
    // },

    fetchData () {
      // eslint-disable-next-line no-debugger
      const filter = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        launchName: this.launchName
      }
      if (this.crowdType === 3) { // 行为标签tab
        filter.myself = this.myself
      }
      filter.crowdType = this.crowdType // 行为人群
      this.$service.getTempCrowdList(filter).then(data => {
        this.launchStatusEnum = data.launchStatusEnum
        this.tableData = data.pageInfo.list
        this.totalCount = data.pageInfo.total
        if (this.showSelection) {
          this.updateTableSelected()
        }
        this.tableData.forEach(item => {
          item.dataSource = 1
        })
      })
    },

    // handleShenCeAnalysis (row) {
    //   const launchCrowdId = row.launchCrowdId
    //   console.log('launchCrowdId', launchCrowdId)
    //   this.$service.sensorCrowdAnalysis({ launchCrowdId }).then(res => {
    //     console.log('res', res)
    //     // 人群已经发送到神策平台，请前往神策继续分析
    //     if (res.result.indexOf('成功') > 0 || res.result.indexOf('已经发送') > 0) {
    //       this.$message.success(res.result)
    //     } else {
    //       this.$message.info(res.result)
    //     }
    //   })
    // },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange (val) {
      this.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.currentPage = 1
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    },
    // condition (row) {
    //   this.isShowCondition = true
    //   this.$service
    //     .getTempCrowd({ launchCrowdId: row.launchCrowdId })
    //     .then(data => {
    //       this.launchTitle = '人群条件'
    //       this.selectStrategy = data.crowdSql
    //     })
    // },
    // // 删除
    // del (row) {
    //   const launchCrowdId = row.launchCrowdId
    //   this.$confirm('确定要删除吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.$service.delTempCrowd({ launchCrowdId }, '删除成功').then(() => {
    //         // this.$service.delNewTempCrowd({launchCrowdId}, "删除成功").then(() => {
    //         this.fetchData()
    //       })
    //     })
    //     .catch(() => {
    //     })
    // },
    // // 编辑
    // handleEdit (launchCrowdItem) {
    //   this.$emit('show-add', launchCrowdItem.launchCrowdId, this.launchStatusEnum[launchCrowdItem.history.status].code)
    // },
    // minitor (row) {},
    // 计算
    // calculate (row) {
    //   this.$service.calculateTempCrowd({ launchCrowdId: row.launchCrowdId, calType: row.calType }, '成功计算中').then(() => {
    //     this.fetchData()
    //   })
    // },
    // 新增
    handleAdd () {
      this.$emit('show-add')
    },
    handleSelectOrCancel (select, row) {
      const selectedFlag = select.length && select.indexOf(row) !== -1
      // true就是选中，0或者false是取消选中
      if (selectedFlag) {
        this.$refs.tempChangeTable.toggleRowSelection(row, true)
        this.$emit('table-selected', row, 'add')
      } else {
        this.$refs.tempChangeTable.toggleRowSelection(row, false)
        this.$emit('table-selected', row, 'del')
      }
    },
    handleSelectAllOrCancel (select) {
      // 当select长度为0，则是取消全选，否则是全选
      const data = this.tableData
      if (select.length === 0) {
        for (let i = 0; i < data.length; i++) {
          this.$emit('table-selected', data[i], 'del')
        }
      } else {
        for (let j = 0; j < data.length; j++) {
          this.$emit('table-selected', data[j], 'add')
        }
      }
    },
    updateTableSelected () {
      const arr = []
      const currentSelectRows = this.currentSelectTag
      this.tableData.forEach((item, index) => {
        currentSelectRows.forEach((i) => {
          if (item.tagId === i.tagId) {
            arr.push(this.tableData[index])
          }
        })
      })
      if (arr.length > 0) {
        // 如果存在，则先清空选中，再赋值
        this.$nextTick(() => {
          this.$refs.tempChangeTable.clearSelection()
          arr.forEach(row => {
            this.$refs.tempChangeTable.toggleRowSelection(row, true)
          })
        })
      } else {
        this.$refs.tempChangeTable.clearSelection()
      }
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
// .temp-label-list
//     margin-top 50px
.temp-label-list >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
.header
    display flex
    justify-content space-between
    margin 10px 0
.search-input
  position relative
  display flex
  width 350px
.icon-fixed
    position absolute
    top 8px
    right 10px
    transform rotate(-90deg)
.operate
    margin-left 20px
    cursor pointer
.monitor-time
    margin-bottom 30px
</style>
