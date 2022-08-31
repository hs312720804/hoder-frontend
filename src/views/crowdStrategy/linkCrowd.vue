<template>
  <div>
    <el-form :inline="true" :model="linkParams" class="demo-form-inline">
      <el-form-item label="人群ID：">
        <el-input v-model="linkParams.crowdId" placeholder="请输入人群ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="人群名：">
        <el-input v-model="linkParams.crowdName" placeholder="请输入人群名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchLinkCrowdList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- selectValue: {{ selectValue }} -->
    <el-table
      ref="multipleTable"
      :data="linkCrowdTableData"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
      border
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange">
      <el-table-column
        :reserve-selection="true"
        type="selection"
        width="55"
        :selectable="selected">
      </el-table-column>
      <el-table-column
        label="人群ID"
        prop="crowdId">
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      </el-table-column>
      <el-table-column
        prop="crowdName"
        label="人群名"
        width="300px">
      </el-table-column>
      <el-table-column
        prop="policyId"
        label="所属策略ID"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="policyName"
        label="所属策略名"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <div style="margin: 40px 0 0; overflow: hidden;">
      <pagination
        :currentpage="linkParams.pageNum"
        :pagesize="linkParams.pageSize"
        :totalcount="linkCrowdListTotal"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      ></pagination>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    selectRow: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      linkDialogVisible: false,
      linkCrowdTableData: [],
      linkParams: {
        crowdId: '',
        crowdName: '',
        pageNum: 1,
        pageSize: 10
      },
      linkCrowdListTotal: 0,
      selectValue: []
    }
  },
  watch: {
    value: {
      handler (val) {
        this.selectValue = val
      }
    }
  },
  created () {
    this.fetchLinkCrowdList()
  },
  methods: {
    selected (row, index) {
      // if (row.WaitConfirmRecord.is_confirm == 1) {
      //   return false // 不可勾选
      // } else {
      //   return true // 可勾选
      // }
      return true
    },
    // 查询引用人群列表
    fetchLinkCrowdList () {
      this.$service.getLinkCrowdList(this.linkParams).then(res => {
        this.linkCrowdTableData = res.rows || []
        this.linkCrowdListTotal = res.total || 0
      })
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange (val) {
      this.linkParams.pageSize = val
      this.fetchLinkCrowdList()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.linkParams.pageNum = val
      this.fetchLinkCrowdList()
    },

    getRowKeys (row) {
      return row.crowdId
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.selectValue = val
      this.$emit('input', val)
    }

  }

}
</script>
