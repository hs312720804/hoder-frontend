<template>
  <div class="my-collect">
    <!-- <div class="header">
      <div v-if="!showSelection">
        <el-button @click="handleAdd" type="primary">
          新建
        </el-button>
      </div>
      <div v-else></div>
      标签分类搜索
      <div class="search-input">
        <el-input placeholder="支持按标签名搜索" class="header-input" v-model="launchName"
          @keyup.enter.native="fetchData"></el-input>
        <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
      </div>
    </div> -->
    <!-- <tag-list
      :data-list="dataList">
      <div align="right">
        <pagination :currentpage="filter.pageNum" :pagesize="filter.pageSize" :totalcount="totalCount"
          @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange"></pagination>
      </div>
    </tag-list> -->

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
            >
            </priorityEdit>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="有效期">
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="{row}">
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
  </div>
</template>

<script>
import TreeForm from './TreeForm.vue'
import priorityEdit from '@/components/PriorityEdit.vue'
// import tagList from './coms/TagList'
export default {
  name: 'MyCollect',
  components: {
    TreeForm,
    priorityEdit
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
      // 弹窗---------------
      updatePolicyDialog: false,
      crowdForm: {
        launchName: ''
      },
      rules: {
        launchName: { required: true, message: '请输入', trigger: ['blur'] }
      },
      // 弹窗---------------end

      selectedRow: {},
      // 投放 params ---
      recordId: undefined,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      // 投放 params ---end

      // 监控 params ---
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

      //   ],
      //   data: []
      // },
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
      this.$service.refinementPolicyCrowdSearch(params).then(data => {
        // eslint-disable-next-line
        // debugger
        const result = data
        this.dataList = result.pageInfo ? result.pageInfo.list : []
        this.totalCount = result.pageInfo ? result.pageInfo.total : 0

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
</style>
