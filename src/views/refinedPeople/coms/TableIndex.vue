<template>
  <div>
    <div v-if="selectedTreeNodePolicy.policyId" class="tip-wrap" >
      <!-- {{ selectedTreeNode }} -->
      <span>
        <i class="el-icon-folder-opened folder"></i>
        策略ID： {{ selectedTreeNodePolicy.policyId }}&nbsp;&nbsp;&nbsp;&nbsp;
        <i class="el-icon-date folder" style="color: #67c23a;;"></i>
        有效期：{{selectedTreeNodePolicy.crowdValidFrom}}  -  {{selectedTreeNodePolicy.crowdValidTo}}
      </span>

      <span class="tip-text-wrap">
        <div>
          7日是否有命中及命中次数:
          <span v-if="selectedTreeNodePolicy.past7ActiveSize" style="color: red">
            {{ cc_format_number(selectedTreeNodePolicy.past7ActiveSize) }}
          </span>
          <span v-else> 否 </span>
        </div>
        <div>
          7日是否有请求及请求次数:
          <span v-if="selectedTreeNodePolicy.past7ReqSize" style="color: red">
            {{ cc_format_number(selectedTreeNodePolicy.past7ReqSize) }}
          </span>
          <span v-else> 否 </span>
        </div>

      </span>
    </div>

    <div class="tag-list">
    <el-table ref="changeTable" border :data="dataList">
      <el-table-column prop="crowdId" label="ID">
      </el-table-column>
      <el-table-column prop="crowdName" label="人群名">
      </el-table-column>
      <el-table-column prop="priority" label="优先级">
        <!-- <template v-slot="row">
            {{ cc_format_number(row.size) }}
        </template> -->
        <template slot="header">
          优先级
          <el-popover
            placement="top"
            trigger="hover"
            class="popover-button"
          >
            <div>数字越大，优先级越高</div>
            <span class="priority-tip" slot="reference">!</span>
          </el-popover>
        </template>

        <template slot-scope="scope">
            <priorityEdit
              @refresh="fetchData"
              :showEdit="true"
              :data="scope.row.priority"
              :policyId="scope.row.policyId"
              :crowdId="scope.row.crowdId"
              :parentId="scope.row.parentId"
            >
            </priorityEdit>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="有效期">
        <template v-slot="{row}">
          <span v-if="row.isSettingValid === 0">默认</span>
          <span v-else>
            {{ row.crowdValidFrom }} - {{ row.crowdValidTo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="{row}">
          <div class="el-button-group">
            <el-button type="text" size="small" @click="onOrOffLocalCrowd(row)">
              <!-- 下架 -->
              <span v-if="row.putway === 1">下架</span>
              <span v-else>上架</span>
            </el-button>
            <el-button type="text" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="handleCopyCrowd(row)">
              复制
            </el-button>
            <el-button  type="text" size="small" @click="handleDel(row)">
              删除
            </el-button>
            <el-dropdown @command="handleCommandStastic">
              <el-button size="small" type="text">
                分析
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="['detail', row]">命中曝光分析</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <div align="right">
      <pagination
        :currentpage="filter.pageNum"
        :pagesize="filter.pageSize"
        :totalcount="totalCount"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"></pagination>
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

  <el-dialog
      title="复制人群"
      :visible.sync="updatePolicyDialog"
      width="550px"
    >
      <el-form :model="crowdForm" ref="form" label-width="150px" :rules="rules">
        <el-form-item label="选择目的父节点：" prop="launchName">
          <!-- {{ selectedCopiedTreeNode.sourceName || ''  }} -->
          <span v-for="(item,index) in selectedCopiedTreeNode" :key="item.id">
            <template v-if="index !== 0">,</template>{{ item.sourceName }}
          </span>
          <TreeForm
            v-if="updatePolicyDialog"
            :treeData="treeData"
            :btnFlg="false"
            :imultiple="true"
            :check-strictly="true"
            :limitLevel="limitLevel"
            style="height: 400px"
            @nodeCheck="handleNodeCheck"
          >
        </TreeForm>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button @click="handleCopySubmit" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 命中曝光分析 -->
    <el-dialog
      :visible.sync="showStatistics"
      width="90%"
      title="命中曝光分析"
    >
      <AfterPushDetail
        v-if="showStatistics"
        :currentCid="currentCid"
        :showStatistics="showStatistics"
      ></AfterPushDetail>
    </el-dialog>
  </div>
</template>

<script>
import TreeForm from './TreeForm.vue'
import priorityEdit from '@/components/PriorityEdit.vue'
import AfterPushDetail from '@/views/crowdStrategy/AfterPushDetail'

// import tagList from './coms/TagList'
export default {
  name: 'MyCollect',
  components: {
    TreeForm,
    priorityEdit,
    AfterPushDetail
  },
  props: {
    treeData: {
      type: [Array, Object],
      default: () => []
    },
    selectedTreeNode: {
      type: Object,
      default: () => {}
    },
    activeName: {
      type: String
    },
    limitLevel: {
      type: [Number],
      default: 10
    }
  },
  watch: {
    activeName: function (val) {
      if (val !== undefined) {
        // this.filter.source = val
        this.filter.pageNum = 1
        this.filter.pageSize = 10
        this.fetchData()
      }
    },
    selectedTreeNode: {
      handler (val) {
        if (val !== undefined) {
          this.filter.pageNum = 1
          this.filter.pageSize = 10
          this.fetchData()
        }
      },
      immediate: true,
      deep: true
    }
  },

  data () {
    return {
      selectedTreeNodePolicy: {},
      // 查看统计 投后效果弹窗 ------
      showStatistics: false,
      currentCid: undefined,
      // 查看统计 投后效果弹窗 --- end ---

      // 复制人群 弹窗---------------
      updatePolicyDialog: false,
      crowdForm: {
        launchName: ''
      },
      rules: {
        launchName: { required: true, message: '请输入', trigger: ['blur'] }
      },
      // 复制人群 弹窗---------------end

      selectedRow: {},
      // 投放 params ---
      recordId: undefined,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      // 投放 params ---end

      dataList: [],
      filter: {
        pageNum: 1,
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
      launchName: '',
      dialogTitle: '',
      totalCount: 0,
      selectedCopiedTreeNode: [],
      operateRow: {} // 当前编辑、复制的对象
    }
  },
  methods: {
    // 分析
    handleCommandStastic (scope) {
      const type = scope[0]
      const row = scope[1]
      this.currentCid = row.crowdId
      switch (type) {
        // 命中曝光分析
        case 'detail':
          this.showStatistics = true
          break
      }
    },
    // 树状 复选框被点击的时候触发
    handleNodeCheck (node, data) {
      const { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys } = node
      console.log('node-->', node)
      console.log('data-->', data)
      this.selectedCopiedTreeNode = checkedNodes
    },
    // 下架
    onOrOffLocalCrowd (row) {
      const params = {
        crowdId: row.crowdId,
        putway: row.putway === 1 ? 0 : 1
      }
      const tipText = params.putway ? '上架' : '下架'
      this.$confirm(`确定要${tipText}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.crowdUpDown(params, `${tipText}成功`).then(() => {
          this.fetchData()
        })
      })
    },
    handleCopyCrowd (row) {
      console.log('row-->', row)
      this.updatePolicyDialog = true
      this.operateRow = row
      // 重置数据
      this.selectedCopiedTreeNode = []
    },
    // 编辑人群
    handleEdit (row) {
      this.$emit('editCrowd', row)
    },
    // 删除人群
    handleDel (row) {
      const crowdId = row.crowdId
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.strategyCrowdDel({ crowdId }, '删除成功').then(() => {
          this.fetchData()
          // 刷新父级列表
          this.$emit('refresh')
        })
      })
    },
    handleDialogClose () {
      this.updatePolicyDialog = false
    },
    // 人群复制
    handleCopySubmit () {
      const policyCrowdDTOList = this.selectedCopiedTreeNode.map(item => {
        return {
          policyId: item.policyId,
          crowdId: item.isPolicy ? undefined : item.id
        }
      })
      const params = {
        crowdId: this.operateRow.crowdId,
        policyCrowdDTOList
      }
      this.$service.copyPolicyCrowd(params, '人群复制成功').then(rse => {
        // 刷新
        this.fetchData()
        // 刷新父级列表
        this.$emit('refresh')
        this.updatePolicyDialog = false
      })
    },
    // handleCloseDialog () {
    //   this.showLaunchToBusiness = false
    // },
    // handleMonitor (row) {
    //   this.monitorDialog = true
    //   this.selectedRow = row
    //   this.monitorRangeTime = [] // 重置选择时间
    //   this.getDataMonitor()
    // },
    // getDataMonitor () {
    //   // console.log('this.monitorRangeTime-->', this.monitorRangeTime)
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
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    // handleMonitorSizeChange (val) {
    //   this.monitorOutForm.pageSize = val
    //   // 每次切换页码条，都把页面数重置为1
    //   this.monitorOutForm.pageNum = 1
    //   this.handleGetMonitorTableList()
    // },
    // 页码变更, 如第1页变成第2页时,val=2
    // handleMonitorCurrentChange (val) {
    //   this.monitorOutForm.pageNum = val
    //   this.handleGetMonitorTableList()
    // },
    fetchData () {
      console.log('this.selectedTreeNode-->', this.selectedTreeNode)
      const params = {
        ...this.filter,
        policyId: this.selectedTreeNode.policyId,
        crowdId: this.selectedTreeNode.isPolicy ? undefined : this.selectedTreeNode.id
      }
      this.$service.refinementPolicyCrowdSearch(params).then(result => {
        // eslint-disable-next-line
        // debugger
        this.dataList = result.pageInfo ? result.pageInfo.list : []
        this.totalCount = result.pageInfo ? result.pageInfo.total : 0
        this.selectedTreeNodePolicy = result.policy
        console.log('this.dataList--->', this.dataList)
      })
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

  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
.search-input
  position relative
  display flex
  width 350px
.header
  display flex
  justify-content space-between
  margin 10px 0
.el-button-group >>> .el-button
  float none
  margin 0 3px
.tip-wrap {
  margin-bottom: 20px;
  color: rgba(0,0,0,0.65);
  font-size: 14px;
  line-height: 34px;
  padding: 1px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 4px solid #50bfff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tip-text-wrap {
  font-size: 12px;
  line-height: 25px
  color: red
}
</style>
