<template>
  <!--
    crowdType
    2：临时人群
    3：行为人群
    4：广告数据银行
 -->
  <div class="temp-label-list">
    <div class="header">
      <!-- <div v-if="!showSelection">
        <el-button v-if="crowdType === 2" @click="handleAdd" type="primary">
          新建
        </el-button>

        <el-radio-group v-if="crowdType === 3" v-model="myself" @change="fetchData" >
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">我的</el-radio>
        </el-radio-group>
      </div> -->
      <div></div>
      <div style="display: flex; justify-content: space-between; ">
        <div class="search-input">
          <el-input placeholder="请输入人群ID或人群名" class="header-input" v-model="condition" @keyup.enter.native="fetchData">
          </el-input>
          <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
        </div>
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
      <!-- {{tableData}} -->
      <el-table ref="tempChangeTable" :data="tableData" border @select="handleSelectOrCancel" @select-all="handleSelectAllOrCancel">
        <el-table-column type="selection" width="55" v-if="showSelection" :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column prop="crowdId" label="人群ID" width="120"></el-table-column>
        <el-table-column prop="crowdName" label="人群名" width="230"></el-table-column>
     
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status">
              {{ launchStatusEnum[scope.row.status] }}
              <!-- <div v-if="(launchStatusEnum[scope.row.status]).code === 3">
                计算完成
              </div>
              <div
                v-else-if="((launchStatusEnum[scope.row.status]).code === 2 && (launchStatusEnum[scope.row.status]).childrenCode === 23)">
                {{ (launchStatusEnum[scope.row.status]).childrenName }}
              </div>
              <div
                v-else-if="(launchStatusEnum[scope.row.status]).code === 1 || (launchStatusEnum[scope.row.status]).code === 4 || (launchStatusEnum[scope.row.status]).code === 7">
                <span v-if="crowdType === 4">计算</span>
                <el-button type="text" v-else @click="calculate(scope.row)">计算</el-button>
              </div>
              <div v-else-if="(launchStatusEnum[scope.row.status]).code === 5" style="color: red">
                计算失败
              </div>
              <div v-else>
                {{ (launchStatusEnum[scope.row.status]).name }}
              </div> -->
            </div>
          </template>
        </el-table-column>
       
     
        <el-table-column label="所属策略ID" prop="policyId">
          <!-- <template slot-scope="scope">
            {{ scope.row.dmpCrowdId }}
          </template> -->
        </el-table-column>
        <el-table-column label="所属策略名">
          <!-- <template slot-scope="scope">
            {{ scope.row.history.version }}
          </template> -->
        </el-table-column>
       
      </el-table>
      <div align="right">
        <pagination :currentpage="currentPage" :pagesize="pageSize" :totalcount="totalCount"
          @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange"></pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CrowdLabel',
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
      condition: undefined,
      launchStatusEnum: {},
      pageSize: 10,
      currentPage: 1,
      totalCount: 1,
      isShowCondition: false,
      // launchType: undefined,
      launchTitle: '',
      selectStrategy: null, // 人群条件的选择策略
      checkList: [],
      
    }
  },
  created () {
    this.$root.$on(`crowd-label-list-refresh`, this.fetchData)
    this.fetchData()
    // this.monitorRangeTime = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.$moment().subtract(0, 'days').format('YYYY-MM-DD')]
  },
  beforeDestroy () {
    this.$root.$off(`crowd-label-list-refresh`)
  },
  watch: {
    'refreshFlag': function (val) {
      if (val) {
        this.fetchData()
      }
    },
    'currentSelectTag': 'updateTableSelected',
    checkListParent: function (val) {
      this.checkList = val
    }
  },
  methods: {
    // 判断表格的复选框是否置灰、禁止选择
    checkSelectable(row, index) {
      return row.status === 1 // 只有状态为 生效中的才能选
    },
    handleMonitor (row) {
      this.monitorDialog = true
      this.selectedRow = row
      this.getDataMonitor()
    },

    getDataMonitor () {
      this.handleGetMonitorTableList()
    },

    handleGetMonitorTableList () {
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

    fetchData () {
      // eslint-disable-next-line no-debugger
      const filter = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        condition: this.condition
      }
      // if (this.crowdType === 3) { // 行为标签tab
      //   filter.myself = this.myself
      // }
      // filter.crowdType = this.crowdType // 行为人群
      this.$service.getCrowdCrowdTagList(filter).then(data => {
        this.launchStatusEnum = data.launchStatus

        const list = data.pageInfo.list || []
        this.tableData = list.map(item => {
          return {
            ...item,
            tagId: item.crowdId,
            tagName: item.crowdName,
            dataSource: item.dataSource ? item.dataSource : 12
          }
        }) || []
        this.totalCount = data.pageInfo.total
        if (this.showSelection) {
          this.updateTableSelected()
        }
        // this.tableData.forEach(item => {
        //   item.dataSource = 1
        // })
      })
    },
    // handleCommandOpreate (scope) {
    //   const type = scope[0]
    //   const params = scope[1]
    //   switch (type) {
    //     case 'edit':
    //       this.handleEdit(params)
    //       break
    //     case 'del':
    //       this.del(params)
    //       break
    //     case 'monitor':
    //       this.handleMonitor(params)
    //       break
    //   }
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
    // 删除
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
    // 编辑
    // handleEdit (launchCrowdItem) {
    //   this.$emit('show-add', launchCrowdItem.launchCrowdId, this.launchStatusEnum[launchCrowdItem.history.status].code)
    // },
    // minitor (row) {},
    // 计算
    calculate (row) {
      this.$service.calculateTempCrowd({ launchCrowdId: row.launchCrowdId, calType: row.calType }, '成功计算中').then(() => {
        this.fetchData()
      })
    },
    // 新增
    // handleAdd () {
    //   this.$emit('show-add')
    // },
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
        for (var i = 0; i < data.length; i++) {
          this.$emit('table-selected', data[i], 'del')
        }
      } else {
        for (var j = 0; j < data.length; j++) {
          if (data[j].status === 1) { // 只有状态为生效中的才能被勾选
            this.$emit('table-selected', data[j], 'add')
          }
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
    .temp-label-list
        margin-top 50px
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
