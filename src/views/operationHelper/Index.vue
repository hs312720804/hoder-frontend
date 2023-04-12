<template>
<div>

  <!-- <div>
    <el-button @click="handleAdd" type="primary">新增</el-button>
  </div> -->

  <div class="header-wrap">

    <div class="search-input">
      <el-select v-model="searchForm.bizId" placeholder="请选择" slot="prepend"  style="width: 140px; margin-right: 10px">
        <el-option label="便捷面板" :value="1"></el-option>
      </el-select>
      <el-input
        v-model="searchForm.keywords"
        placeholder="任务名、ID"
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

  </div>

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

  <el-dialog :title="form.id ? '编辑运营任务' : '新建运营任务'" :visible.sync="dialogFormVisible" width="800px">
    <!-- {{ form }} -->
    <el-form :model="form" :label-width="formLabelWidth" :rules="rules" ref="ruleForm">
      <el-form-item label="任务ID" prop="taskCode" class="inline-form-item">
        <el-input v-model="form.taskCode" autocomplete="off" :disabled="Boolean(form.id)"></el-input>
      </el-form-item>
      <el-form-item label="任务名" prop="taskName" class="inline-form-item">
        <el-input v-model="form.taskName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="绑定人群" prop="binds">
        <div class="list-header">
          <span>方案</span>
          <span>人群</span>
          <span>可拖拽</span>
          <span>优先级</span>
        </div>
        <drag :bizId="searchForm.bizId" :form="form"></drag>
        <div class="remark">备注：优先级从高到低，拖动以调整优先级，当同时命中多个人群时返回优先级高的人群</div>
      </el-form-item>
      <!-- <el-form-item label="投放时间" prop="putType">
        <el-radio-group v-model="form.putType">
          <el-radio :label="1">立即投放</el-radio>
          <el-radio :label="2">指定时间段</el-radio>
        </el-radio-group>
        <el-date-picker
          v-if="form.putType === 2"
          v-model="form.putTime"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="margin-left: 20px"
          :picker-options="pickerOptions"
        >
        </el-date-picker>

      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" @click="handleSave">投 放</el-button>
    </div>
  </el-dialog>

  <!-- 动态人群 - 查看效果 -->
  <el-dialog :visible.sync="showViewEffect" width="80%" title="投后效果">
    <!-- currentTaskId --- {{currentTaskId}} -->
    <viewEffectDialog :row="currentRow"></viewEffectDialog>
  </el-dialog>

  <!-- 查看配置弹窗-->
  <el-dialog title="查看配置" :visible.sync="showConfiguration">
    <c-content-wrapper
      :pagination="detailPagination.pagination"
      @filter-change="loadDetailList"
    >
      <c-table
        :data="seeDetailData.data"
        :props="seeDetailData.props"
        :header="seeDetailData.header"
      >
      </c-table>
    </c-content-wrapper>
    <!-- <el-input type="textarea" v-model="configTextarea" :rows="8" :readonly="true"></el-input> -->
  </el-dialog>

</div>
</template>

<script>
import drag from './drag.vue'
import viewEffectDialog from './viewEffectDialog.vue'
export default {
  name: 'peoplePositionList',
  data () {
    return {
      detailPagination: {
        filter: {},
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        taskCode: null
      },
      showConfiguration: false,
      seeDetailData: {
        props: {
          border: true
        },
        data: [],
        header: [
          {
            label: '版本号',
            prop: 'versionId'
          },
          {
            label: '文件名称',
            prop: 'fileName'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '操作',
            width: '100px',
            render: (h, { row }) => {
              return h('el-popover', {
                attrs: {
                  placement: 'left',
                  width: '600',
                  trigger: 'click'
                }
              }, [
                h('el-input', {
                  props: {
                    type: 'textarea',
                    rows: 8,
                    readonly: true,
                    value: row.content,
                    autosize: { minRows: 10, maxRows: 20 }
                  },
                  class: 'get-setting'
                }),
                h('el-button', {
                  props: {
                    type: 'text'
                  },
                  slot: 'reference'
                }, '查看配置')])
            }
          }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          // 可选时间为包括今天在内的未来时间的三个月内，不可选时间置灰。
          return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000) || time.getTime() > (Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
      },
      currentTaskId: '',
      rules: {
        taskCode: [
          { required: true, message: '请输入任务ID', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        // putType: [
        //   { required: true, message: '请选择投放时间', trigger: 'change' }
        // ],
        // putTime: [
        //   { type: 'array', required: true, message: '请选择时间范围', trigger: 'change' }
        // ],
        binds: { type: 'array', required: true, message: '请设置绑定人群', trigger: 'blur' }

      },
      dialogFormVisible: false,
      searchForm: {
        bizId: 1,
        keywords: ''
      },
      form: {

      },
      formLabelWidth: '95px',
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
            prop: 'id'
          },
          {
            label: '任务ID',
            prop: 'taskCode'
          },
          {
            label: '任务名',
            prop: 'taskName'
          },
          {
            label: '绑定详情(人群有交叉时优先展示优先级高的绑定方案)',
            width: '320px',
            render: (h, { row }) => {
              const list = row.binds || []
              const group = []
              list.forEach(item => {
                if (!!item.resourceName && !!item.crowdName) {
                  group.push(h(
                    'div',
                    [
                      h('span', item.resourceName),
                      h('span', { class: 'text-tip' }, '绑定'),
                      h('span', item.crowdName)
                    ]
                  ))
                }
              })

              return h('div', {
                class: 'table-cell-wrap'
              },
              [
                h('div', { class: 'table-cell-wrap-icon' }, [
                  h('span', '高'),
                  h('span', '低')
                ]),
                h('div', { class: 'arrow-wrap' }, [
                  h('div', { class: 'arrow' })
                ]),
                h('div', group)
              ])
            }
          },
          {
            label: '状态',
            // prop: 'status',
            render: (h, { row }) => {
              const dict = {
                1: '生效中',
                2: '已下架',
                3: '草稿',
                4: '未开始（未到投放周期）',
                5: '已过期（已过投放周期内）'
              }
              return dict[row.status]
            }
          },
          {
            label: '创建人',
            prop: 'userName'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '操作',
            fixed: 'right',
            width: '200px',
            // render: this.$c_utils.component.createOperationRender(this, {
            //   handleEdit: '编辑',
            //   handleOffSet: '上架',
            //   handleDelete: '删除',
            //   aaa: '投后效果'
            // }),

            // render: (h, params) => {
            //   return h('div', {
            //   }, [
            //     h('el-button', {
            //       props: {
            //         type: 'text'
            //       },
            //       on: {
            //         click: () => { this.handleEdit(params) }
            //       }
            //     }, '编辑')])
            // }

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
                    type: 'text',
                    disabled: params.row.putway === 3 && method === 'handleOffSet' // 草稿不允许上下架
                  },
                  on: {
                    click: () => {
                      this[method](params)
                    }
                  }
                }, label)
              }
              return h('div', null, [
                createBtn('编辑', 'handleEdit'),
                createBtn(params.row.putway === 1 ? '下架' : '上架', 'handleOffSet'),
                createBtn('删除', 'handleDelete'),
                createBtn('投后效果', 'handleViewEffectDialog'),
                createBtn(params.row.synchronous === 1 ? '未同步' : '已同步', 'freshCache'),
                createBtn('查看配置', 'seeDevDetail')
              ])
            }

          }

        ],
        data: [],
        selected: [],
        selectionType: 'none'
      },
      showViewEffect: false,
      currentRow: {}
    }
  },
  methods: {
    // handleFilterChange (type, pagination) {
    //   if (pagination) {
    //     this.pagination = pagination
    //   }
    //   if (type === 'query') {
    //     if (this.pagination) {
    //       this.pagination.currentPage = 1
    //     }
    //   }
    //   this.fetchData()
    // },
    // // 查看配置分页
    // handleFilterChange () {
    //   this.loadDetailList(this.detailPagination.currentId)
    // },
    seeDevDetail ({ row }) {
      this.showConfiguration = true
      this.detailPagination.taskCode = row.taskCode
      this.loadDetailList()
    },
    loadDetailList () {
      const params = {
        taskCode: this.detailPagination.taskCode,
        pageNum: this.detailPagination.pagination.currentPage,
        pageSize: this.detailPagination.pagination.pageSize
      }
      this.$service.getAssistantLuaList(params).then((data) => {
        this.seeDetailData.data = data.rows
        this.detailPagination.pagination.total = data.total
      })
    },
    // 同步
    freshCache ({ row }) {
      this.$confirm('新建的人群策略将实时生效，旧的策略更新需要延时2小时生效', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.genLuaById({ taskCode: row.taskCode }, '操作成功').then(data => {
            this.fetchData()
          })
        })
    },
    handleViewEffectDialog ({ row }) {
      this.currentRow = row
      this.showViewEffect = true
    },
    tableRowClassName ({ row }) {
      if (row.putway === 2) { return 'gray-row' }
    },
    initFormData () {
      return {
        bizId: 1,
        taskCode: '',
        taskName: '',
        binds: [{
          resourceCode: '',
          resourceName: ''
        }, {
          resourceCode: '',
          resourceName: ''
        }]
        // putType: 1,
        // putTime: []
      }
    },
    // 下架任务
    handleOffSet ({ row }) {
      const params = {
        id: row.id,
        putway: row.putway === 1 ? 2 : 1 // 1 上架 2 下架
      }
      this.$service.assistantTaskPutway(params).then(res => {
        this.fetchData()
      })
    },
    // 保存草稿
    handleSaveDraft () {
      if (this.form.taskCode === '' || this.form.taskName === '') {
        return this.$message.error('请输入 任务ID 和 任务名称 ')
      }
      const params = {
        ...this.form,
        putTime: Array.isArray(this.form.putTime) ? this.form.putTime.join(',') : this.form.putTime,
        priority: null, // 优先级字段不创
        putway: 3 // 草稿
      }

      this.$service.saveAssistantTask(params).then(res => {
        this.fetchData()
        this.dialogFormVisible = false
      })
    },
    handleSave () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('this.form-->', this.form)

          const params = {
            ...this.form,
            putTime: Array.isArray(this.form.putTime) ? this.form.putTime.join(',') : this.form.putTime,
            priority: null, // 优先级字段不创
            putway: 1 // 投放
          }

          this.$service.saveAssistantTask(params).then(res => {
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
    handleDelete ({ row }) {
      this.$confirm('确定删除此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id,
          delFlag: 2
        }
        this.$service.delAssistantTask(params, '删除成功').then(() => {
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
        ...this.searchForm
      }
      this.$service.assistantTaskList(params).then((data) => {
        this.table.data = data.row
        this.pagination.total = data.total
      })
    }
  },
  created () {
    this.fetchData()
    // 初始化数据
    this.form = this.initFormData()
  },
  components: {
    drag,
    viewEffectDialog
  }
}

</script>

<style lang="stylus" scoped>
.header-wrap
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
.search-input
  display: flex;
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
