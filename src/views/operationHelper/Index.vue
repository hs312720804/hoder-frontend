<template>
<div>

  <!-- <div>
    <el-button @click="handleAdd" type="primary">新增</el-button>
  </div> -->

  <div class="header-wrap">

    <div class="search-input">
      <el-select v-model="searchForm.select" placeholder="请选择" slot="prepend"  style="width: 140px; margin-right: 10px">
        <el-option label="便捷面板" value="1"></el-option>
      </el-select>
      <el-input
        v-model="searchForm.policyName"
        placeholder="任务名、ID"
        @keyup.enter.native="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
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

  <el-dialog title="收货地址" :visible.sync="dialogFormVisible" >

    <el-form :model="form" :label-width="formLabelWidth" :rules="rules" ref="ruleForm" >
      <el-form-item label="任务ID" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="任务名" >
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="绑定人群" >
        <drag></drag>
        <div class="remark">备注：优先级从高到低，拖动以调整优先级，当同时命中多个人群时返回优先级高的人群</div>
      </el-form-item>
      <el-form-item label="投放时间" prop="dateRange">
        <el-radio-group v-model="form.timeType">
          <el-radio :label="0">立即投放</el-radio>
          <el-radio :label="1">指定时间段</el-radio>
        </el-radio-group>
        <el-date-picker
          v-if="form.timeType === 1"
          v-model="form.dateRange"
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
        name: [
          { required: true, message: '请输入任务ID', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // timeType: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        dateRange: [
          { type: 'array', required: true, message: '请选择时间范围', trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      form: {
        name: '',
        timeType: '',
        dateRange: []
      },
      formLabelWidth: '95px',
      searchForm: {
        select: '',
        policyName: ''
      },
      // filter: {

      // },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // totalCount: 0,
      // selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'id',
            prop: 'id',
            width: '50'
          },
          {
            label: '投放id',
            prop: 'launchCrowdId',
            width: '70'
          },
          {
            label: '名称',
            prop: 'name'

            // render: (h, params) => {
            //   return h('el-button', {
            //     props: {
            //       type: 'text'
            //     },
            //     on: {
            //       click: () => {
            //         this.handleRead(params)
            //       }
            //     }
            //   }, params.row.name)
            // }
          },
          {
            label: '协议',
            prop: 'protocol'
          },
          {
            label: '访问地址',
            prop: 'url'
          },
          {
            label: '参数',
            prop: 'param'
          },
          {
            label: '备注',
            prop: 'remark'
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
            label: '操作',
            fixed: 'right',
            width: '100',
            render: this.$c_utils.component.createOperationRender(this, {
              handleEdit: '编辑',
              handleDelete: '删除'
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
    handleSearch () {

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

    parseFilter () {
      const { pagination } = this
      // if (pagination) {
      //   filter.pageNum = pagination.currentPage
      //   filter.pageSize = pagination.pageSize
      // }
      return pagination
    },
    fetchData () {
      const pagination = this.parseFilter()
      this.$service.peoplePositonList(pagination).then((data) => {
        this.table.data = data.pageInfo.list
        this.pagination.total = data.pageInfo.total
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
</style>
