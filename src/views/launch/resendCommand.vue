<template>
    <div class="hoder-pages">
        <el-form :model="outForm" inline class="first-form">
            <el-form-item label="投放ID：">
                <el-input v-model="outForm.launchCrowdId" @keyup.enter.native="handleGetManualLaunchList" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleResendCommand">触发计算</el-button>
            </el-form-item>
        </el-form>
        <c-table
            :props="table.props"
            :header="table.header"
            :data="table.data"
            class="table-overflow"
        >
        </c-table>
            <!-- <el-pagination
                class="pagination"
                :current-page.sync="outForm.pageNum"
                :page-size.sync="outForm.pageSize"
                :total="total"
                @size-change="handleGetManualLaunchList"
                @current-change="handleGetManualLaunchList"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination> -->
        <pagination
            :currentpage="outForm.pageNum"
            :pagesize="outForm.pageSize"
            :totalcount="total"
            @handle-size-change="handleSizeChange"
            @handle-current-change="handleCurrentChange"
        ></pagination>
    </div>
</template>

<script>
export default {
  name: 'resendCommandAA',
  data () {
    return {
      outForm: {
        launchCrowdId: '',
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      showNext: false,
      resultContent: undefined,
      table: {
        props: {},
        header: [
          {
            label: 'id',
            width: '50',
            prop: 'id'
          },
          {
            label: '投放ID',
            prop: 'launchCrowdId'
          },
          {
            label: '投放SQL',
            prop: 'crowdSql'
          },
          {
            label: '投放版本',
            prop: 'version'
          },
          {
            label: '投放人',
            // prop: 'creator'
            prop: 'creatorName'

          },
          {
            label: '投放时间',
            prop: 'createTime'
          },
          {
            label: '投放队列',
            prop: 'topic'
          },
          {
            label: '投放状态',
            prop: 'status',
            render: (h, { row }) => {
              if (row.status === 1) { return '成功' } else { return '失败' }
            }
          },
          {
            label: '说明',
            prop: 'remark'
          }
        ],
        data: []
      }
    }
  },
  methods: {
    handleResendCommand () {
      this.$service.manualLaunch(this.outForm).then(data => {
        this.outForm.pageNum = 1
        this.handleGetManualLaunchList()
      })
    },

    handleGetManualLaunchList () {
      this.$service.getManualLaunchList(this.outForm).then(data => {
        if (data) {
          this.total = data.pageInfo.total
          this.table.data = data.pageInfo.list || []
        } else {
          this.resultContent = '暂无数据'
        }
      })
    },

    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange (val) {
      this.outForm.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.currentPage = 1
      this.handleGetManualLaunchList()
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.outForm.pageNum = val
      this.handleGetManualLaunchList()
    }

  },
  mounted () {
    this.handleGetManualLaunchList()
  }

}
</script>

<style lang="stylus" scoped>
.content
    margin 20px
    border 1px solid #ccc
    padding 20px
.first-form
    border-bottom 1px dashed #ccc
    margin-bottom 20px

</style>
