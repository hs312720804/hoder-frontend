<template>
    <div class="ip-manage-list">
        <c-content-wrapper
                :filter="filter"
                :filterSchema="filterSchema"
                :pagination="pagination"
                @filter-change="handleFilterChange"
                @filter-reset="handleFilterReset"
        >
            <div><el-button @click="handleAdd" type="primary">新增</el-button></div>
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
import _ from 'gateschema'
export default {
  name: 'list',
  data () {
    return {
      filter: {},
      filterSchema: _.map({
        host: _.o
          .string.other('form', {
            label: ' ',
            placeholder: '请输入ip地址',
            cols: {
              item: 14,
              // label: 0,
              wrapper: 18
            }
          })
      }).other('form', {
        layout: 'inline',
        footer: {
          cols: {
            label: 0,
            wrapper: 24
          },
          showSubmit: true,
          submitText: '查询',
          showReset: true,
          resetText: '重置'
        }
      }),
      pagination: {},
      selected: [],
      table: {
        props: {},
        header: [
          // {
          //     label: '序号',
          //     prop: ''
          // },
          {
            label: 'id',
            prop: 'id',
            width: '50'
          },
          {
            label: '业务分组',
            prop: 'group'
          },
          {
            label: '用户名',
            prop: 'sshUsername',
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
              }, params.row.sshUsername)
            }
          },
          {
            label: '密码',
            prop: 'sshPassword'
          },
          {
            label: '接口项目地址',
            prop: 'projectDir'
          },
          {
            label: '刷新地址',
            prop: 'reloadApi',
            width: '300'
          },
          {
            label: 'lua脚本地址',
            prop: 'luaPath'
          },
          {
            label: '服务端口',
            prop: 'sshPort'
          },
          {
            label: 'ip地址',
            prop: 'host'
          },
          {
            label: '备注',
            prop: 'remark'
          },
          {
            label: '启用/禁用',
            prop: 'status',
            render: (h, { row }) => {
              if (row.status === 1) {
                return '启用'
              } else {
                return '禁用'
              }
            }
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '更新时间',
            prop: 'updateTime'
          },
          // {
          //     label: '创建人',
          //     prop: 'creator'
          // },
          // {
          //     label: '更新人',
          //     prop: 'updator'
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
      this.$confirm('确定删除此条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.delIpManage(row.id, '删除成功').then(
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
      this.$service.getIpManageList(filter).then((data) => {
        this.table.data = data.list
        this.pagination.total = data.total
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
.ip-manage-list
  >>> .filter-form
    float right
  >>>.content-list
    margin 0
</style>
