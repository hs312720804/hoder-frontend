<template>

<!-- <div>
  <el-button @click="handleAdd" type="primary">新增</el-button>
</div> -->
<div class="my-collect">
  <div class="header">
    <div v-if="!showSelection">
      <el-button @click="handleAdd" type="primary">
        新建
      </el-button>
    </div>
    <div v-else></div>
    <!-- 标签分类搜索 -->
    <!-- <div class="search-input">
      <el-input placeholder="支持按标签名、ID搜索" class="header-input" v-model="filter.tagName"
        @keyup.enter.native="fetchData"></el-input>
      <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
    </div> -->
    <div class="search-input">
      <el-input
        v-model="searchForm.search"
        placeholder="请输入"
        @keyup.enter.native="fetchData"
      >
        <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
      </el-input>
    </div>

  </div>
  <!-- <div class="header-wrap">

    <div class="search-input">
      <el-input
        v-model="searchForm.keywords"
        placeholder="请输入"
        @keyup.enter.native="fetchData"
      >
        <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
      </el-input>
    </div>

    <el-button
      type="primary"
      size="small"
      @click="handleAdd"
    >
      <a class="fa fa-plus" style="color: white;"></a>新增
    </el-button>

  </div> -->

  <c-table
    class="list-table"
    :props="table.props"
    :header="table.header"
    :data="table.data"
  >
  </c-table>

  <div align="right">
    <pagination
      :currentpage="pagination.page"
      :pagesize="pagination.pageSize"
      :totalcount="pagination.total"
      @handle-size-change="handleSizeChange"
      @handle-current-change="handleCurrentChange"
    ></pagination>
  </div>

  <el-dialog title="新建人群扩充" :visible.sync="dialogFormVisible" width="600px">
    <!-- {{ form }} -->
    <el-form :model="form" :label-width="formLabelWidth" :rules="rules" ref="ruleForm">
      <el-form-item label="选择原始人群/标签：" prop="historyCrowdId" >
        <!-- <el-input v-model="form.historyCrowdId" autocomplete="off" placeholder="请搜索选择"></el-input> -->

        <el-select
          style="width: 100%"
          v-model="form.historyCrowdId"
          filterable
          remote
          placeholder="请搜索选择"
          clearable
          :remote-method="qiBoRemoteMethod"
          :loading="getCrowdListLoading"
          v-loadmore="{'methord': handelQiboLoadmore}"
        >
          <el-option
            v-for="item in crowdList"
            :value="item.value"
            :label="item.value + '-' + item.name"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扩充至：" prop="extendNum" >
        <el-input v-model="form.extendNum" autocomplete="off" placeholder="xxxxx扩充至xx万"></el-input>
      </el-form-item>
      <el-form-item label="扩充后人群命名：" prop="launchName" >
        <el-input v-model="form.launchName" autocomplete="off" placeholder="xxxxx扩充至xx万"></el-input>
      </el-form-item>
      <el-form-item label="人群描述：" prop="remark" >
        <el-input v-model="form.remark" autocomplete="off" placeholder="请输入至少五个字符"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import CrowdStatus from '@/views/crowdCompute/components/crowdStatus.vue'
export default {
  name: 'peoplePositionList',
  components: { CrowdStatus },
  data () {
    return {
      showSelection: false,
      rules: {
        historyCrowdId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        extendNum: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        launchName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      searchForm: {
        search: ''
      },
      form: {},
      formLabelWidth: '155px',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      table: {
        props: { 'row-class-name': this.tableRowClassName },
        header: [
          {
            label: 'id',
            prop: 'launchCrowdId'
          },
          {
            label: '人群标签名',
            prop: 'launchName'
          },
          {
            label: '描述',
            prop: 'remark'
          },
          {
            label: '数量',
            render: (h, { row }) => {
              return this.cc_format_number(row.history.totalMac)
            }
          },
          {
            label: '原始数量',
            render: (h, { row }) => {
              return this.cc_format_number(row.history.totalMac)
            }
          },
          {
            label: '状态',
            // prop: 'status',
            render: (h, { row }) => {
              return h(CrowdStatus, {
                props: {
                  history: row.history,
                  launchStatusEnum: this.launchStatusEnum
                }
              })
            }
          },
          {
            label: '创建人',
            prop: 'creatorName'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '操作',
            fixed: 'right',
            render: (h, params) => {
              const createBtn = (label, method, permission) => {
                return h('el-button', {
                  // directives: [
                  //   {
                  //     name: 'permission',
                  //     value: permission
                  //   }
                  // ],
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this[method](params)
                    }
                  }
                }, label)
              }
              return h('div', null, [
                createBtn(params.row.onOffCrowd ? '下架' : '上架', 'handleOffSet'),
                createBtn('删除', 'handleDelete')
              ])
            }

          }

        ],
        data: [],
        selected: [],
        selectionType: 'none'
      },
      // showViewEffect: false,
      currentRow: {},
      // --------
      getCrowdListLoading: false,
      crowdList: [],
      getCrowdListParams: {
        pageNum: 1,
        pageSize: 100,
        crowdType: 1, // 固定为1
        launchName: ''
      },
      getCrowdListQuery: '',
      launchStatusEnum: {}
    }
  },
  methods: {
    // 起播行为影片搜索更多
    handelQiboLoadmore () {
      this.getCrowdListParams.pageNum++ // 滚动加载翻页
      this.qiBoRemoteMethod(this.getCrowdListQuery)
    },

    qiBoRemoteMethod (query) {
      // 重新查询，不是滚动加载
      if (this.getCrowdListQuery !== query) {
        this.crowdList = []
        this.getCrowdListParams.pageNum = 1 // 页码归1
      }

      // if (query !== '') {
      this.getCrowdListLoading = true

      this.getCrowdListParams.launchName = query || ''

      this.$service.getTempLaunchList(this.getCrowdListParams).then(data => {
        this.getCrowdListLoading = false
        this.getCrowdListQuery = query // 记录查询关键字，滚动加载时要用到
        let list = data.pageInfo.list

        list = list.map(obj => {
          return {
            name: obj.launchName,
            value: obj.versionId
          }
        })
        this.crowdList.push(...list)
      }).catch(() => {
        this.getCrowdListLoading = false
      })
      // }
      // else {
      //   this.crowdList = []
      // }
    },
    tableRowClassName ({ row }) {
      if (row.putway === 2) { return 'gray-row' }
    },
    initFormData () {
      return {
        historyCrowdId: '',
        extendNum: '',
        launchName: '',
        remark: ''
      }
    },

    // 保存草稿
    // handleSaveDraft () {
    //   if (this.form.taskCode === '' || this.form.taskName === '') {
    //     return this.$message.error('请输入 任务ID 和 任务名称 ')
    //   }
    //   const params = {
    //     ...this.form,
    //     putTime: Array.isArray(this.form.putTime) ? this.form.putTime.join(',') : this.form.putTime,
    //     priority: null, // 优先级字段不创
    //     putway: 3 // 草稿
    //   }

    //   this.$service.saveAssistantTask(params).then(res => {
    //     this.fetchData()
    //     this.dialogFormVisible = false
    //   })
    // },
    handleSave () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('this.form-->', this.form)

          const params = {
            ...this.form
          }

          this.$service.addExtendCrowd(params).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时, val=20
    handleSizeChange (val) {
      this.pagination.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.pagination.pageNum = 1
      this.fetchData()
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.fetchData()
    },

    handleAdd () {
      this.dialogFormVisible = true
      this.$nextTick(res => {
        // 初始化数据
        this.form = this.initFormData()
        this.$refs.ruleForm.resetFields()
      })
    },
    handleEdit ({ row }) {
      const params = {
        id: row.id
      }
      this.$service.getAssistantTaskDetail(params).then(res => {
        this.form = {
          ...res,
          putTime: res.putTime ? res.putTime.split(',') : []
        }

        this.dialogFormVisible = true

        this.$nextTick(() => {
          // 移除表单项的校验结果
          this.$refs.ruleForm.clearValidate()
        })
      })
    },
    // 下架任务
    handleOffSet ({ row }) {
      const params = {
        extendCrowdId: row.launchCrowdId,
        onOffCrowd: !row.onOffCrowd
      }
      this.$service.onOrOffExtendCrowd(params).then(res => {
        this.fetchData()
      })
    },
    handleDelete ({ row }) {
      this.$confirm('确定删除此扩充人群吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          launchCrowdId: row.launchCrowdId
        }
        this.$service.deleteExtendCrowd(params, '删除成功').then(() => {
          this.fetchData()
        })
      })
    },

    // parseFilter () {
    //   const { pagination } = this
    //   // if (pagination) {
    //   //   filter.pageNum = pagination.currentPage
    //   //   filter.pageSize = pagination.pageSize
    //   // }
    //   return pagination
    // },
    fetchData () {
      const params = {
        ...this.pagination,
        ...this.searchForm,
        page: this.pagination.pageNum
      }
      // console.log('this.searchForm-->', this.pagination)
      // console.log('params-->', params)
      this.$service.getExtendCrowd(params).then((data) => {
        this.launchStatusEnum = data.launchStatusEnum
        const pageInfo = data.pageInfo
        this.table.data = pageInfo.list
        this.pagination.total = pageInfo.total
      })
    }
  },
  created () {
    this.fetchData()
    // 初始化数据
    this.form = this.initFormData()
    this.qiBoRemoteMethod() // 弹窗 - 下拉列表
  }
}

</script>

<style lang="stylus" scoped>
@import '../common.styl'
.search-input
  position relative
  display flex
  width 350px
.header
  display flex
  justify-content space-between
  margin 10px 0
// .header-wrap
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 20px;
// .search-input
//   display: flex;
.remark
  font-size 12px
  color: #999
>>>.table-cell-wrap{
  display grid
  grid-template-columns: 20px 25px auto;
  .arrow-wrap {
    height: 100%;
    background: #606266;
    width: 2px;
    margin-left: 7px;
    position: relative;
  }
  .arrow {
    width: 10px;
    height: 10px;
    border: 2px solid;
    border-color: transparent transparent #606266 #606266;
    position: absolute;
    bottom: 2px;
    left: -4px;
    transform: rotate(314deg);
  }

  // .arrow::after{
  //   content: '';
  //   position: absolute;
  //   right: -7px;
  //   top: -9px;
  //   border: 7px solid;
  //   border-color: #fff transparent transparent transparent;
  // }

}
// >>>.text-wrap
//   display flex
//   justify-content: space-between;
>>>.text-tip
  font-size 12px
  color: #E6A23C
  margin 0 10px

>>>.table-cell-wrap-icon{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list-table >>> .el-table tr.gray-row
  color #ccc
.inline-form-item {
  width: 299px;
  display: inline-block;
  margin-right: 14px;
}

.list-header {
  display: flex;
  color: #999;
  font-size: 12px;
  justify-content: space-between;
  border-bottom: 1px dashed #efefef;
  span:nth-child(1) {
    margin-left: 95px;
  }
  span:nth-child(2) {
    margin-left: 234px;
  }
  span:nth-child(3) {
    margin-left: 62px;
  }
}
</style>
