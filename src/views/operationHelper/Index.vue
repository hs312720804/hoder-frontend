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

  <el-dialog title="新建运营任务" :visible.sync="dialogFormVisible" >

    <el-form :model="form" :label-width="formLabelWidth" :rules="rules" ref="ruleForm" >
      <el-form-item label="任务ID" prop="taskCode">
        <el-input v-model="form.taskCode" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="任务名" >
        <el-input v-model="form.taskName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="绑定人群" >
        <drag></drag>
        <div class="remark">备注：优先级从高到低，拖动以调整优先级，当同时命中多个人群时返回优先级高的人群</div>
      </el-form-item>
      <el-form-item label="投放时间" prop="putType">
        <el-radio-group v-model="form.putType">
          <el-radio :label="1">立即投放</el-radio>
          <el-radio :label="2">指定时间段</el-radio>
        </el-radio-group>
        <el-date-picker
          v-if="form.putType === 1"
          v-model="form.putTime"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-left: 20px"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="dialogFormVisible = false">保存草稿</el-button>
      <el-button type="primary" @click="handleSave">投 放</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import drag from './drag.vue'
export default {
  name: 'peoplePositionList',
  data () {
    return {
      rules: {
        taskCode: [
          { required: true, message: '请输入任务ID', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // timeType: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        putTime: [
          { type: 'array', required: true, message: '请选择时间范围', trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      searchForm: {
        bizId: 1,
        keywords: ''
      },
      form: {
        bizId: 1,
        taskCode: '',
        taskName: '',
        binds: [],
        putType: '',
        putTime: []
      },
      formLabelWidth: '95px',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },

      table: {
        props: {},
        header: [
          {
            label: 'id',
            prop: 'id',
            width: '50'
          },
          {
            label: '任务名',
            prop: 'taskName'
          },
          {
            label: '绑定详情(人群有交叉时优先展示优先级高的绑定方案)',
            render: (h, { row }) => {
              const list = row.binds
              console.log('params-->', row)
              console.log('list-->', list)
              const group = []
              list.forEach(item => {
                group.push(h(
                  'div',
                  [
                    h('span', item.crowdName),
                    h('span', { class: 'text-tip' }, '绑定'),
                    h('span', item.resourceName)
                  ]
                ))
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
                h('div', { class: 'aaa' }, group)
              ])
            }
          },
          {
            label: '状态',
            prop: 'status',
            width: '60',
            render: (h, { row }) => {
              if (row.status === 1) { return '可用' } else { return '不可用' }
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
            width: '100',
            render: this.$c_utils.component.createOperationRender(this, {
              handleEdit: '编辑',
              handleOffSet: '下架',
              handleDelete: '删除',
              aaa: '投后效果'
            })
          }

        ],
        data: [],
        selected: [],
        selectionType: 'none'
      }
    }
  },
  methods: {
    // 下架任务
    handleOffSet (row) {
      console.log('row--->', row)
      this.$service.assistantTaskPutway().then(res => {

      })
    },
    handleSave () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
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
    },
    handleEdit ({ row }) {
      this.$emit('open-add-page', row.id, 'edit')
    },
    handleDelete ({ row }) {
      this.$confirm('确定删除此活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.peoplePositonDel({ id: row.id }, '删除成功').then(
          () => {
            this.handleAllRowSelectionRemove()
            this.fetchData()
          }
        )
      })
    },
    handleFilterChange (type, pagination) {
      if (pagination) {
        this.pagination = pagination
      }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
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
  },
  components: {
    drag
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
</style>
