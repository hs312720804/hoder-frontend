<template>
    <div class="hoder-pages">
        <!-- form query -->
        <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        @submit.native.prevent="submitForm"
        shiro:hasPermission="sysAdministrative:user:query"
        >
            <el-form-item label="操作用户" prop="loginName">
                <el-input
                v-model="queryForm.loginName"
                style="width: 200px"
                size="small"
                placeholder="请输入操作用户"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="search" @click="submitForm">
                    <i class="el-icon-search"></i><span>查询</span></el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="handleReset"
                    shiro:hasPermission="sysAdministrative:user:batchDel"
                ><i class="el-icon-delete"></i><span>重置</span>
                </el-button>
            </el-form-item>
        </el-form>

        <!-- talbe -->
        <el-table ref="myTable" :data="tableData" style="width: 100%;" stripe border>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="操作">
                            <span>{{ props.row.operation }}</span>
                        </el-form-item><br/>
                        <el-form-item label="操作前">
                            <span>{{ props.row.operateBefore }}</span>
                        </el-form-item><br/>
                        <el-form-item label="操作后">
                            <span>{{ props.row.operateAfter }}</span>
                        </el-form-item><br/>
                        <el-form-item label="操作Ip">
                            <span>{{ props.row.operateIp }}</span>
                        </el-form-item><br/>
                        <el-form-item label="操作时间">
                            <span>{{ props.row.operateTime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="loginName" label="账号" width="200"></el-table-column>
            <el-table-column prop="operation" label="操作" width="300"></el-table-column>
            <el-table-column prop="operateBefore" label="操作前" :show-overflow-tooltip="true" width="300"></el-table-column>
            <el-table-column prop="operateAfter" label="操作后" :show-overflow-tooltip="true" width="300"></el-table-column>
            <el-table-column prop="operateIp" label="操作IP" width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="100"></el-table-column>
            <el-table-column prop="operateTime" fixed="right" label="操作时间" width="200">
                <template slot-scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.operateTime }}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <div align="right"  >
            <pagination v-bind:currentpage="currentPage"
                        v-bind:pagesize="pageSize"
                        v-bind:totalcount="totalCount"
                        @handle-size-change="handleSizeChange"
                        @handle-current-change="handleCurrentChange">
            </pagination>
        </div>
    </div>
</template>
<script>
export default {
  name: 'operateLogAA',
  data () {
    return {
      // 表格当前页数据
      tableData: [],
      queryForm: {
        loginName: ''
      },
      pageSize: 10,
      // 当前页码:pageNum
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 6,
      // 查询条件
      criteria: {}
    }
  },
  methods: {
    loadData: function () {
      this.criteria['pageNum'] = this.currentPage
      this.criteria['pageSize'] = this.pageSize
      this.$service.get_operateLogs_json(this.criteria).then(data => {
        this.tableData = data.pageInfo.list
        this.totalCount = data.pageInfo.total
      })
    },
    // 查询,提交表单
    submitForm: function () {
      var _this = this
      this.$refs.queryForm.validate(function (result) {
        if (result) {
          _this.criteria = _this.queryForm
          _this.loadData()
        } else {
          return false
        }
      })
    },
    // 显示新增界面
    pageRefresh: function () {
      var _this = this
      if (this.tableData[0].loginName) {
        this.$refs.queryForm.validate(function (result) {
          if (result) {
            _this.criteria = _this.queryForm
            _this.loadData()
          } else {
            return false
          }
        })
      } else {
        this.$message('未查询！')
      }
    },

    // 重置
    handleReset: function () {
      this.$refs.queryForm.resetFields()
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange: function (val) {
      this.pageSize = val
      this.loadData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange: function (val) {
      this.currentPage = val
      this.loadData()
    }
  },
  created () {
    this.loadData()
  }
}
</script>
