<template>
  <div>
    <!-- {{ crowdType }}
    {{ scope.row.launchName.indexOf('命中导出_') > -1 }} -->
    <el-button-group>
      <!--<el-button-->
      <!--type="text"-->
      <!--@click="calculate(scope.row)"-->
      <!--&gt;-->
      <!--计算-->
      <!--</el-button>-->
      <!-- 导出的临时标签，不能操作，操作按钮禁用 -->
      <el-button v-if="crowdType !== 4" :disabled="scope.row.launchName.indexOf('命中导出_') > -1" type="text" @click="condition(scope.row)">
        标签条件
      </el-button>
      <!--<el-button-->
      <!--type="text"-->
      <!--@click="minitor(scope.row)"-->
      <!--&gt;-->
      <!--监控-->
      <!--</el-button>-->
      <el-dropdown @command="handleCommandOpreate" :disabled="scope.row.launchName.indexOf('命中导出_') > -1">
        <el-button size="small" type="text">
          操作
        </el-button>
        <!--
          crowdType: 2 临时标签
          crowdType: 3 行为标签
        -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="crowdType !== 4" :command="['edit', scope.row]">
            {{ crowdType !== 2 ? '查看' : '编辑' }}
          </el-dropdown-item>

          <!--<el-dropdown-item-->
          <!--:command="['monitor',scope.row]"-->
          <!--v-permission="'hoder:launch:crowd:ver:index'"-->
          <!--&gt;数据监控-->
          <!--</el-dropdown-item>-->
          <!-- v-if="(scope.row.history.status && ((launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 || (launchStatusEnum[scope.row.history.status]).code === 7))" -->

          <!-- 行为标签不展示删除按钮 -->
          <el-dropdown-item
            v-if="(scope.row.history.status && (launchStatusEnum[scope.row.history.status]).code !== 2) && crowdType !== 3"
            :command="['del', scope.row]" v-permission="'hoder:launch:crowd:ver:delete'">删除
          </el-dropdown-item>
          <el-dropdown-item :command="['monitor', scope.row]" v-permission="'hoder:launch:crowd:ver:index'">
            数据监控
          </el-dropdown-item>
          <el-dropdown-item :command="['shenCeAnalysis', scope.row]"
            v-permission="'hoder:launch:crowd:ver:index'">
            神策分析
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </el-button-group>

    <el-dialog :title="launchTitle" :visible.sync="isShowCondition" :append-to-body="true">
      <!--<el-form v-if="launchType === 0">-->
      <!--<el-form-item :label="item.policyName" v-for="item in selectStrategy" :key="item.policyName">-->
      <!--<el-checkbox-->
      <!--v-model="v.choosed"-->
      <!--v-for="v in item.childs"-->
      <!--:key="v.crowdId"-->
      <!--disabled-->
      <!--&gt;{{v.crowdName}}-->
      <!--</el-checkbox>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div v-if="launchType === 1">{{selectStrategy}}</div>-->
      <div>{{ selectStrategy }}</div>
    </el-dialog>

    <el-dialog title="数据监控" :visible.sync="monitorDialog" :append-to-body="true">
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

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // :crowdType="crowdType"
    // :scope="scope"
    crowdType: {
      type: [Number, String],
      default: ''
    },
    scope: {
      type: Object,
      default: () => {}
    },
    launchStatusEnum: {
      type: Object,
      default: () => {}
    }

  },
  data () {
    return {
      launchTitle: '',
      isShowCondition: false,
      selectStrategy: null, // 人群条件的选择策略
      monitorDialog: false,
      selectedRow: {},
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
    }
  },
  created () {

  },
  methods: {
    condition (row) {
      this.isShowCondition = true
      this.$service
        .getTempCrowd({ launchCrowdId: row.launchCrowdId })
        .then(data => {
          this.launchTitle = '人群条件'
          this.selectStrategy = data.crowdSql
        })
    },
    handleCommandOpreate (scope) {
      const type = scope[0]
      const params = scope[1]
      switch (type) {
        case 'edit':
          this.handleEdit(params)
          break
        case 'del':
          this.del(params)
          break
        case 'monitor':
          this.handleMonitor(params)
          break
        case 'shenCeAnalysis':
          this.handleShenCeAnalysis(params)
          break
      }
    },
    // 编辑
    handleEdit (launchCrowdItem) {
      this.$emit('show-add', launchCrowdItem.launchCrowdId, this.launchStatusEnum[launchCrowdItem.history.status].code)
    },
    // 删除
    del (row) {
      const launchCrowdId = row.launchCrowdId
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.delTempCrowd({ launchCrowdId }, '删除成功').then(() => {
            // this.$service.delNewTempCrowd({launchCrowdId}, "删除成功").then(() => {
            // this.fetchData()
            this.$emit('get-list')
          })
        })
        .catch(() => {
        })
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
    handleShenCeAnalysis (row) {
      const launchCrowdId = row.launchCrowdId
      console.log('launchCrowdId', launchCrowdId)
      this.$service.sensorCrowdAnalysis({ launchCrowdId }).then(res => {
        console.log('res', res)
        // 人群已经发送到神策平台，请前往神策继续分析
        if (res.result.indexOf('成功') > 0 || res.result.indexOf('已经发送') > 0) {
          this.$message.success(res.result)
        } else {
          this.$message.info(res.result)
        }
      })
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
