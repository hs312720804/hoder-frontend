<template>
  <div>
    <el-button-group>
      <!--<el-button-->
      <!--type="text"-->
      <!--@click="calculate(scope.row)"-->
      <!--&gt;-->
      <!--计算-->
      <!--</el-button>-->
      <!-- <el-button
                            type="text"
                            @click="condition(scope.row)"
                    >
                        标签条件
                    </el-button> -->
      <el-button type="text" @click="handleEdit(scope.row)">
        编辑
      </el-button>
      <el-button type="text" @click="onOrOffLocalCrowd(scope.row)">
        <!-- {{ scope.row.launchTempCrowdStatus }} -->
        {{ scope.row.onOffCrowd ? '下架' : '上架' }}
      </el-button>
      <el-button type="text" @click="del(scope.row)">
        删除
      </el-button>
      <el-button type="text" @click="launchShence(scope.row)">
        神策分析
      </el-button>

      <a :href="launchedExportUrl" download ref="launchedDownLoad"></a>
      <el-button type="text" @click="handleExport(scope.row)">
        异常导出
      </el-button>
      <!--<el-button-->
      <!--type="text"-->
      <!--@click="minitor(scope.row)"-->
      <!--&gt;-->
      <!--监控-->
      <!--</el-button>-->
      <!-- <el-dropdown @command="handleCommandOpreate">
        <el-button size="small" type="text">
            操作
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
                    :command="['edit',scope.row]"
            >编辑
            </el-dropdown-item>
            <el-dropdown-item
                    :command="['del',scope.row]"
                    v-permission="'hoder:launch:crowd:ver:delete'"
                    v-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 || (launchStatusEnum[scope.row.history.status]).code === 7"
            >删除
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown> -->
    </el-button-group>

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    scope: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      launchedExportUrl: undefined

    }
  },
  created () {

  },
  methods: {
    // 编辑
    handleEdit (row) {
      const crowdName = row.launchName
      const localCrowdId = row.launchCrowdId
      this.$emit('show-add', localCrowdId, crowdName)
    },
    // 下架
    onOrOffLocalCrowd (row) {
      const localCrowdId = row.launchCrowdId
      const params = {
        onOffCrowd: !row.onOffCrowd,
        localCrowdId
      }
      const tipText = params.onOffCrowd ? '上架成功' : '下架成功'
      this.$service.OnOrOffLocalCrowd(params, tipText).then(() => {
        // this.fetchData()
        this.$emit('get-list')
      })
    },
    // 删除
    del (row) {
      // const crowdName = row.launchName
      const launchCrowdId = row.launchCrowdId
      // this.$confirm(`该标签正在被人群 ${crowdName} 人群名使用，你确定要删除吗`, "提示", {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.delTempCrowd({ launchCrowdId }, '删除成功').then(() => {
            // this.fetchData()
            this.$emit('get-list')
          })
        })
        .catch(() => {
        })
    },
    launchShence (row) {
      const launchCrowdId = row.launchCrowdId
      console.log('launchCrowdId', launchCrowdId)
      this.$service.sensorAnalysis({ launchCrowdId }).then(res => {
        console.log('res', res)
        // 人群已经发送到神策平台，请前往神策继续分析
        if (res.data.indexOf('成功') > 0 || res.data.indexOf('已经发送') > 0) {
          this.$message.success(res.data)
        } else {
          this.$message.info(res.data)
        }
      })
    },
    async handleExport (row) {
      const launchCrowdId = row.launchCrowdId
      console.log('launchCrowdId', launchCrowdId)
      // 0   文件生成中   1  文件已经生成
      const status = await this.$service.checkErrorMacFileIsExist({ launchCrowdId }).then(res => {
        this.$message.info(res.msg)
        return res.status || 0
      })
      console.log('status', status)
      if (status === 1) {
        // 下载文件
        this.launchedExportUrl = '/api/tempCrowd/downloadErrorMacFile?launchCrowdId=' + launchCrowdId
        this.$nextTick(() => {
          this.$refs.launchedDownLoad.click()
        })
      }
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
