<template>
    <div class="third-interface-list">
        <c-content-wrapper
                :filter="filter"
                :pagination="pagination"
                @filter-change="handleFilterChange"
                @filter-reset="handleFilterReset"
        >
            <div class="add-button">
                <el-button @click="handleAdd" type="primary">新增</el-button>
            </div>
            <c-table
                    :props="table.props"
                    :header="table.header"
                    :data="table.data"
                    :selected="table.selected"
                    :selection-type="table.selectionType"
                    @row-selection-add="handleRowSelectionAdd"
                    @row-selection-remove="handleRowSelectionRemove"
                    @all-row-selection-change="handleAllRowSelectionChange"
            >
            </c-table>
        </c-content-wrapper>
    </div>
</template>

<script>
export default {
  name: 'thirdInterfaceList',
  data () {
    return {
      filter: {},
      // filterSchema: _.map({
      //     id: _.o
      //         .number.other('form', {
      //             label: ' ',
      //             placeholder: '请输入ID',
      //             cols: {
      //                 item: 14,
      //                 // label: 0,
      //                 wrapper: 18
      //             }
      //         })
      // }).other('form', {
      //     layout: 'inline',
      //     footer: {
      //         cols: {
      //             label: 0,
      //             wrapper: 24
      //         },
      //         showSubmit: true,
      //         submitText: '查询',
      //         showReset: true,
      //         resetText: '重置'
      //     }
      // }),
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          {
            label: 'id',
            prop: 'id',
            width: '50'
          },
          {
            label: '接口名称',
            prop: 'name',
            render: (h, params) => {
              return h('el-button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(params)
                  }
                }
              }, params.row.name)
            }
          },
          // {
          //     label: '名称',
          //     prop: 'name',
          //     render: (h, params) => {
          //         return h('el-button', {
          //             props: {
          //                 type: 'text'
          //             },
          //             on: {
          //                 click: () => {
          //                     this.handleRead(params)
          //                 }
          //             }
          //         }, params.row.name)
          //     }
          // },
          {
            label: '代码',
            prop: 'code'
          },
          {
            label: '接口地址',
            prop: 'reqUri'
          },
          {
            label: '请求方法',
            prop: 'reqMethod'
          },
          {
            label: '接口参数',
            prop: 'reqParam'
          },
          {
            label: '接口固定参数',
            prop: 'reqDefaultParamValue'
          },
          // {
          //     label: '请求之后处理',
          //     prop: 'resExplain'
          // },
          // {
          //     label: '请求之前处理',
          //     prop: 'reqBefore'
          // },
          // {
          //     label: '接口固定参数',
          //     prop: 'reqDefaultParamValue'
          // },
          // {
          //     label: '请求之后处理',
          //     prop: 'resExplain'
          // },
          // {
          //     label: '请求之前处理',
          //     prop: 'reqBefore'
          // },
          // {
          //     label: '是否保持长连接',
          //     prop: 'reqKeepalive'
          // },
          // {
          //     label: '超时',
          //     prop: 'reqKeepaliveTimeout'
          // },
          // {
          //     label: '连接池',
          //     prop: 'reqKeepalivePool'
          // },
          // {
          //     label: '请求头',
          //     prop: 'reqHeaders'
          // },
          // {
          //     label: '状态',
          //     prop: 'status',
          //     width: '60',
          //     render:(h, {row}) => {
          //         if(row.status === 1) {return '可用'}
          //         else {return '不可用'}
          //     }
          // },
          {
            label: '操作',
            fixed: 'right',
            width: '100',
            render: this.$createOperationRender(this, {
              handleEdit: '编辑',
              handleDelete: '删除'
            })
          }

        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  methods: {
    handleRead ({ row }) {
      this.$emit('open-add-page', row.id, 'read')
    },
    handleAdd () {
      this.$emit('open-add-page')
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
        this.$service.thirdInterfaceDel({ id: row.id }, '删除成功').then(
          () => {
            this.handleAllRowSelectionRemove()
            this.fetchData()
          }
        )
      })
    },
    handleFilterChange (type, filter) {
      if (filter) {
        this.filter = filter
      }
      if (type === 'query') {
        if (this.pagination) {
          this.pagination.currentPage = 1
        }
      }
      this.fetchData()
    },
    handleFilterReset () {
      this.filter = {
        id: undefined
      }
      this.fetchData()
    },
    handleRowSelectionAdd (targetItem) {
      this.selected.push(targetItem.id)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.id
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange (value) {
      if (value) {
        this.table.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.table.selected = []
      }
    },
    handleAllRowSelectionRemove () {
      this.selected = []
      this.table.selected = []
    },
    updateTableSelected () {
      const table = this.table
      const newSelectedIndex = this.selected.map(item => item)
      table.selected = table.data.reduce((result, item, index) => {
        if (newSelectedIndex.indexOf(item.id) > -1) {
          result.push(index)
        }
        return result
      }, [])
    },
    parseFilter () {
      const { filter, pagination } = this
      if (pagination) {
        filter.pageNum = pagination.currentPage
        filter.pageSize = pagination.pageSize
      }
      return filter
    },
    fetchData () {
      const filter = this.parseFilter()
      this.$service.getthirdInterfaceList(filter).then((data) => {
        this.table.data = data.pageInfo.list
        this.pagination.total = data.pageInfo.total
      })
    }
  },
  created () {
    this.fetchData()
  }
}

</script>

<style lang="stylus" scoped>
    .add-button
        margin 10px 0
    .third-interface-list >>> .filter-form
        float right
        margin-bottom 20px
</style>
