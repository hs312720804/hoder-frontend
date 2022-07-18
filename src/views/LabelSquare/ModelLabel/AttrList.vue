<template>
    <el-card shadow="never">
        <div slot="header" v-if="!showSelection">
            <span>标签列表</span>
            <el-form :inline="true" style="float: right">
                <el-form-item>
                    <el-input clearable @keyup.enter.native="fetchData" v-model="filter.launchName" placeholder="支持人群名、ID搜索"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button
                      type="primary"
                      @click="openAddDialog"
                      v-permission="'hoder:label:attr:add'">
                        新建属性
                    </el-button>
                    <!-- <el-button
                            type="primary"
                            @click="handleAddBatchTag"
                            v-if="tagCategory.dataSource !== 2"
                            v-permission="'hoder:label:attr:add'"
                    >
                        批量上传
                    </el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div>
          <el-table
            ref="changeTable"
            :data="itemList"
            border
            @select="handleSelectOrCancel"
            @select-all="handleSelectAllOrCancel">
            <el-table-column
              type="selection"
              width="55"
              v-if="showSelection"
            ></el-table-column>
            <el-table-column prop="launchCrowdId" label="标签ID"></el-table-column>
            <el-table-column prop="dmpCrowdId" label="人群ID" width="120"></el-table-column>
            <el-table-column prop="launchName" label="名称" width="230"></el-table-column>
            <!--<el-table-column prop="jobEndTime" label="有效期"></el-table-column>-->
            <el-table-column prop="count" label="使用次数">
              <!--<template slot-scope="scope">-->
              <!--{{scope.row.history.status}}+++{{(launchStatusEnum[scope.row.history.status]).code}}-->
              <!--</template>-->
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <!-- {{ scope.row.history.status }} -->
                <div v-if="scope.row.history.status">
                  <div v-if="(launchStatusEnum[scope.row.history.status]).code === 3">
                    计算完成
                  </div>
                  <!-- 新增计算中时是否是人群派对中 -->
                  <div
                    v-else-if="((launchStatusEnum[scope.row.history.status]).code === 2 && (launchStatusEnum[scope.row.history.status]).childrenCode === 23)">
                    {{ (launchStatusEnum[scope.row.history.status]).childrenName }}
                  </div>
                  <div
                    v-else-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 7">
                    <span v-if="crowdType === 4">计算</span>
                    <el-button type="text" v-else @click="calculate(scope.row)">计算</el-button>
                  </div>
                  <div v-else-if="(launchStatusEnum[scope.row.history.status]).code === 5" style="color: red">
                    计算失败
                  </div>
                  <div v-else>
                    {{ (launchStatusEnum[scope.row.history.status]).name }}
                  </div>
                </div>
              </template>
            </el-table-column>

              <!-- <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" label="创建人" prop="creatorName">
              </el-table-column>
              <el-table-column v-if="(checkList.indexOf('createTime') > -1)" label="创建时间" prop="history.createTime">
              </el-table-column>
              <el-table-column v-if="(checkList.indexOf('department') > -1)" label="业务部门" prop="department">
              </el-table-column> -->
            <el-table-column label="创建人" prop="creatorName">
            </el-table-column>
            <el-table-column label="创建时间" prop="history.createTime">
            </el-table-column>
            <el-table-column label="业务部门" prop="department">
            </el-table-column>
            <el-table-column label="设备数量">
              <template slot-scope="scope">
                {{ cc_format_number(scope.row.history.totalUser) }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="微信数量">
              <template slot-scope="scope">
                {{ cc_format_number(scope.row.history.totalWxOpenid) }}
              </template>
            </el-table-column> -->
            <el-table-column label="总体耗时">
              <template slot-scope="scope">
                {{ scope.row.spentTotalTime }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="dmp人群ID">
              <template slot-scope="scope">
                {{ scope.row.dmpCrowdId }}
              </template>
            </el-table-column> -->
            <el-table-column label="版本">
              <template slot-scope="scope">
                {{ scope.row.history.version }}
              </template>
            </el-table-column>
            <el-table-column v-if="!showSelection" label="操作" width="200" >
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    size="small"
                    type="text"
                    @click="openEditDialog(scope.row)"
                    v-permission="'hoder:label:attr:modify'"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="text"
                    v-permission="'hoder:label:attr:del'"
                    @click="handleDeleteTag(scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    size="small"
                    type="text"
                    @click="handleMonitor(scope.row)"
                    v-permission="'hoder:launch:crowd:ver:index'"
                  >
                    数据监控
                  </el-button>
                  <!-- <el-dropdown-item :command="['monitor', scope.row]" v-permission="'hoder:launch:crowd:ver:index'">数据监控
                  </el-dropdown-item> -->
                </el-button-group>
              </template>
                <!-- <el-button-group>
                  <el-dropdown @command="handleCommandOpreate">
                    <el-button size="small" type="text">
                      操作
                    </el-button>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="crowdType !== 4" :command="['edit', scope.row]">
                        {{ crowdType !== 2 ? '查看' : '编辑' }}
                      </el-dropdown-item>

                      <el-dropdown-item
                        v-if="(scope.row.history.status && (launchStatusEnum[scope.row.history.status]).code !== 2) && crowdType !== 3"
                        :command="['del', scope.row]" v-permission="'hoder:launch:crowd:ver:delete'">删除
                      </el-dropdown-item>
                      <el-dropdown-item :command="['monitor', scope.row]" v-permission="'hoder:launch:crowd:ver:index'">数据监控
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-button-group> -->

            </el-table-column>
          </el-table>

        <!-- <div align="right">
          <pagination :currentpage="currentPage" :pagesize="pageSize" :totalcount="totalCount"
            @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange"></pagination>
        </div> -->
        </div>

        <el-pagination
            class="pagination"
            :current-page="pagination.pageNum"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @size-change="fetchData"
            @current-change="fetchData"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- <TagUpsert ref="tagUpsert" @upsert-end="fetchData" :current-tag="tag" />
        <BatchUpload ref="BatchUpload" @upsert-end="fetchData" :current-tag="tag" /> -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px">
          <el-form
            :model="attrForm"
            :rules="attrFormRules"
            ref="attrFormRef"
            label-width="80px"
          >
            <el-form-item label="属性名称" prop="launchName">
              <el-input
                size="small"
                v-model="attrForm.launchName"
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="SQL语句" prop="crowdSql">
              <el-input
                type="textarea"
                placeholder="请输入生成样本数据的sql语句"
                v-model="attrForm.crowdSql"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddOrEdit">保 存</el-button>
          </div>
        </el-dialog>
      <el-dialog title="数据监控" :visible.sync="monitorDialog">
        <el-date-picker
          v-model="monitorRangeTime"
          type="daterange"
          align="right"
          @change="getDataMonitor"
          class="monitor-time"
          value-format="yyyy-MM-dd"
        ></el-date-picker>

        <c-table
          :props="monitorTable.props"
          :header="monitorTable.header"
          :data="monitorTable.data"
        >
        </c-table>
        <div style="margin: 30px 0 0; overflow: auto">
            <pagination
                :currentpage="monitorOutForm.pageNum"
                :pagesize="monitorOutForm.pageSize"
                :totalcount="monitorTotal"
                @handle-size-change="handleMonitorSizeChange"
                @handle-current-change="handleMonitorCurrentChange"
            ></pagination>
        </div>
      </el-dialog>

    </el-card>

</template>
<script>
// import TagUpsert from './Upsert.vue'

// import BatchUpload from './batchUpload.vue'
export default {
  components: {
    // TagUpsert,
    // BatchUpload
  },
  data () {
    return {
      crowdType: 5,
      itemList: [],
      tag: {},
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      filter: {
        launchName: undefined
      },
      attrForm: {
        launchName: '',
        crowdSql: '',
        modelTagId: this.row.id,
        tempCrowd: true,
        'calType': '0',
        'macBelowPer': 5,
        'checkRecvPercentage': 0,
        'videoSource': '0',
        'videoSourceIds': []
      },
      dialogVisible: false,
      dialogTitle: '新增样本属性',
      attrFormRules: {
        launchName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        crowdSql: [
          { required: true, message: '请输入SQL语句', trigger: 'blur' }
        ]
      },
      launchStatusEnum: {},
      monitorDialog: false,
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
            label: '临时人群es index',
            prop: 'es_index'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            label: '临时人群同步日期',
            prop: 'update_time'
          },
          {
            label: '版本是否删除',
            render: (h, params) => {
              return h('div', {}, [
                h('span', {}, params.row.del_flag === 1 ? '否' : '是') // 1 否  2 是
              ])
            }
          }
        ],
        data: []
      }
    }
  },
  props: {
    row: {
      type: Object
    },
    showSelection: {
      type: Boolean
    }

  },
  watch: {
    row: {
      handler (val) {
        this.fetchData()
      },
      deep: true
    }
  },
  methods: {
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
    handleSelectOrCancel (select, row) {
      const selectedFlag = select.length && select.indexOf(row) !== -1
      // true就是选中，0或者false是取消选中
      if (selectedFlag) {
        this.$refs.changeTable.toggleRowSelection(row, true)
        this.$emit('table-selected', row, 'add')
      } else {
        this.$refs.changeTable.toggleRowSelection(row, false)
        this.$emit('table-selected', row, 'del')
      }
    },
    handleSelectAllOrCancel (select) {
      // 当select长度为0，则是取消全选，否则是全选
      const data = this.itemList
      if (select.length === 0) {
        for (var i = 0; i < data.length; i++) {
          this.$emit('table-selected', data[i], 'del')
        }
      } else {
        for (var j = 0; j < data.length; j++) {
          this.$emit('table-selected', data[j], 'add')
        }
      }
    },
    getFilter () {
      return {
        modelTagId: this.row.id,
        ...this.filter,
        ...this.pagination,
        crowdType: this.crowdType
      }
    },
    //     2、模型属性查询：
    // http://172.20.155.103:3000/mock/140/tempCrowd/index?pageNum=1&pageSize=10&crowdType=5&modelTagId=3
    fetchData () {
      const filter = this.getFilter()
      this.$service.getTempCrowdList(filter).then(data => {
        this.itemList = data.pageInfo.list
        this.pagination.total = data.pageInfo.total
        this.launchStatusEnum = data.launchStatusEnum
      })
    },
    openAddDialog () {
      this.dialogTitle = '新增样本属性'
      // 初始化表单
      this.attrForm = {
        launchName: '',
        crowdSql: '',
        modelTagId: this.row.id,
        tempCrowd: true
      }
      this.launchCrowdId = null // 编辑时的标签id
      this.dialogVisible = true
      this.$refs['attrFormRef'] && this.$refs['attrFormRef'].resetFields()
    },
    handleAddOrEdit () {
      this.$refs['attrFormRef'].validate((valid) => {
        if (valid) {
          if (this.launchCrowdId) { // 编辑
            const params = {
              launchCrowdId: this.launchCrowdId,
              ...this.attrForm
            }
            this.$service.updateTempCrowd(params, '修改成功').then(() => {
              this.fetchData()
              this.dialogVisible = false
            })
          } else { // 新增
            this.$service.addTempCrowd(this.attrForm, '新增成功').then(() => {
              this.fetchData()
              this.dialogVisible = false
            })
          }
        }
      })
    },
    // 点击编辑, 打开弹窗
    openEditDialog (row) {
      this.launchCrowdId = row.launchCrowdId
      this.$service
        .getTempCrowd({ launchCrowdId: row.launchCrowdId })
        .then(data => {
          this.dialogTitle = '编辑样本属性'
          this.selectStrategy = data.crowdSql
          this.attrForm.launchName = data.launchName
          this.attrForm.crowdSql = data.crowdSql
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs['attrFormRef'].clearValidate()
          })
        })
    },
    // handleAddBatchTag () {
    //   this.tag = {
    //     tagId: this.tagCategory.tagId
    //   }
    //   this.tag.tagType = this.tagCategory.tagType
    //   this.$refs.BatchUpload.showBatchDialog = true
    // },

    handleDeleteTag (row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.delTempCrowd({ launchCrowdId: row.launchCrowdId }, '删除成功').then(() => {
            this.fetchData()
          })
        })
        .catch(() => {
          //
        })
    },
    // 计算
    calculate (row) {
      this.$service.calculateTempCrowd({ launchCrowdId: row.launchCrowdId, calType: row.calType }, '成功计算中').then(() => {
        this.fetchData()
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style lang="stylus" scoped>
.pagination
    float right
    margin 10px 0
</style>
