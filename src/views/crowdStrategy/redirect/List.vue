<template>
    <div>
        <div>
            <el-button>新增重定向人群</el-button>
        </div>
        <el-table :data="tableData" border>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="人群id" prop="crowdId"></el-table-column>
            <el-table-column label="人群名称" prop="crowdName"></el-table-column>
            <el-table-column label="父人群id" prop="pcrowdId"></el-table-column>
            <el-table-column label="父人群名称" prop="pcrowdName"></el-table-column>
            <el-table-column label="是否生效" prop="apiStatus">
                <template slot-scope="scope">
                    <span v-if="scope.row.apiStatus === 1">已生效</span>
                    <span v-if="scope.row.apiStatus === 0">
                      <el-tooltip placement="right-start">
                        <div v-if="scope.row.putway === 0" slot="content">人群未生效，因为该人群条件已下架</div>
                        <div v-else slot="content">{{unActiveTips(scope.row.crowdValidStatus)}}</div>
                        <span class="uneffective">未生效<span>?</span></span>
                      </el-tooltip>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="是否为有效期内">
                <template slot-scope="scope">
                    {{crowdValidEnum[scope.row.crowdValidStatus] || '暂无数据'}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="350">
                <!-- eslint-disable-next-line -->
                <template slot-scope="scope">
                    <el-button>编辑</el-button>
                    <el-button>删除</el-button>
                    <el-button>投后效果</el-button>
                    <el-button>看主页数据</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div align="right">
            <pagination
                    v-bind:currentpage="currentPage"
                    v-bind:pagesize="pageSize"
                    v-bind:totalcount="totalCount"
                    @handle-size-change="handleSizeChange"
                    @handle-current-change="handleCurrentChange"
            ></pagination>
        </div>
    </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      tableData: [],
      crowdValidEnum: { 1: '未开始', 2: '有效期中', 3: '已过期' },
      pageSize: 10,
      currentPage: 1,
      totalCount: 1,
      filter: {},
      searchCont: undefined
    }
  },
  watch: {
    '$route.params.redirectListId': function (val, oldVal) {
      if (val !== oldVal && val) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () {
      this.parseFilter()
      this.$service.getRedirectCrowdList(this.filter).then(data => {
        this.tableData = data.list
        this.totalCount = data.total
      })
    },
    parseFilter () {
      const crowdId = this.$route.params.redirectListId
      this.filter = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        searchCont: this.searchCont,
        crowdId
      }
    },
    unActiveTips (activeType) {
      if (activeType === 1 || activeType === 3) {
        return '人群未生效，因为该人群条件' + this.crowdValidEnum[activeType]
      } else {
        return '人群未生效，因为未点击该策略的"同步按钮"'
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
.uneffective
    position relative
    cursor pointer
    span
        position absolute
        display inline-block
        width 12px
        height 12px
        border 1px solid
        border-radius 10px
        text-align center
        line-height 12px
</style>
