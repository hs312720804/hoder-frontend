<template>
    <div>
        <el-form :model="outForm" ref="outForm" inline class="first-form">
            <el-form-item label="" prop="condition">
                <el-input
                  v-model="outForm.condition"
                  @keyup.enter="handleGetManualLaunchList"
                  clearable
                  placeholder="人群ID、人群名、投放ID">
                </el-input>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="handleResendCommand">触发计算</el-button> -->
              <el-button type="primary" @click="handleGetManualLaunchList">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
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
  name: 'LaunchStatusAA',
  data () {
    return {
      outForm: {
        condition: '',
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
            label: '投放ID',
            prop: 'id'
          },
          {
            label: '人群ID',
            width: '70',
            prop: 'crowdId'
          },
          {
            label: '人群名称',
            prop: 'crowdName',
            width: '100'
          },
          {
            label: '时间范围',
            // prop: 'version',
            width: '200',
            render: (h, { row }) => {
              return row.startPeriod + '-' + row.endPeriod
            }
          },
          {
            label: '状态',
            prop: 'statusName'
          },
          {
            label: '创建人',
            // prop: 'creator'
            prop: 'name'

          },
          {
            label: '创建时间',
            width: '100',
            prop: 'createTime'
          },
          // {
          //   label: '业务部门',
          //   prop: 'topic'
          // },
          {
            label: '总体耗时',
            prop: 'calculateTimes'
          }
          // {
          //   label: '操作',
          //   fixed: 'right',
          //   width: '100',
          //   render: this.$c_utils.component.createOperationRender(this, {
          //     handleViewInstructions: '查看指令'
          //   })
          // }

        ],
        data: []
      }
    }
  },
  methods: {
    // handleViewInstructions () {

    // },
    handleResendCommand () {
      this.$service.manualLaunch(this.outForm).then(data => {
        this.outForm.pageNum = 1
        this.handleGetManualLaunchList()
      })
    },

    handleGetManualLaunchList () {
      this.$service.queryEffectAppointment(this.outForm).then(data => {
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
    },
    resetForm () {
      this.$refs['outForm'].resetFields()
      // 重置时，都把页面数重置为1
      this.currentPage = 1
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
