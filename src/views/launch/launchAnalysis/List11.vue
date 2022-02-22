<template>
    <div class="tag-list">
        <c-table
          :props="tableData.props"
          :header="tableData.header"
          :data="tableData.data"
          :selected="tableData.selected"
          :selection-type="tableData.selectionType"
          @row-selection-add="handleRowSelectionAdd"
          @row-selection-remove="handleRowSelectionRemove"
          @all-row-selection-change="handleAllRowSelectionChange"
        >
        </c-table>

        <!-- 分页 -->
    </div>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    dataList: {
      type: Array
    },
    dataSourceEnum: {
      type: Object
    },
    typeEnum: {
      type: Object
    },
    checkListParent: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    showSelection: {
      type: Boolean
    },
    currentSelectedTags: {
      type: Array
    },
    showDeleteBtn: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Object
    }
  },
  data () {
    return {
      multipleSelection: [],
      tagId: undefined,
      checkList: [],
      selected: []

    }
  },
  watch: {
    checkListParent: function (val) {
      this.checkList = val
    },
    'dataList': 'updateTableSelected',
    'currentSelectedTags': 'updateTableSelected'
  },
  methods: {
    handleRowSelectionAdd (targetItem) {
      console.log('targetItem===', targetItem)
      this.selected.push(targetItem.versionCode)
      this.updateTableSelected()
    },
    handleRowSelectionRemove (targetItem) {
      this.selected = this.selected.filter(item => {
        return item !== targetItem.versionCode
      })
      this.updateTableSelected()
    },
    handleAllRowSelectionChange (value) {
      alert(value)
      if (value) {
        alert(this.tableData.data)
        this.tableData.data.forEach(this.handleRowSelectionAdd)
      } else {
        this.selected = []
        this.tableData.selected = []
      }
    },
    handleAllRowSelectionRemove () {
      this.selected = []
      this.tableData.selected = []
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },

    updateTableSelected () {
      const arr = []
      const currentSelectRows = this.currentSelectedTags
      this.dataList.forEach((item, index) => {
        currentSelectRows.forEach((i) => {
          if (item.versionCode === i.versionCode) {
            arr.push(this.dataList[index])
          }
        })
      })
      if (arr.length > 0) {
        // 如果存在，则先清空选中，再赋值
        this.$nextTick(() => {
          this.$refs.changeTable.clearSelection()
          arr.forEach(row => {
            this.$refs.changeTable.toggleRowSelection(row, true)
          })
        })
      } else {
        this.$refs.changeTable.clearSelection()
      }
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
      const data = this.dataList
      if (select.length === 0) {
        for (var i = 0; i < data.length; i++) {
          this.$emit('table-selected', data[i], 'del')
        }
      } else {
        for (var j = 0; j < data.length; j++) {
          this.$emit('table-selected', data[j], 'add')
        }
      }
    }
  },
  created () {
    this.checkList = this.checkListParent
  }
}
</script>

<style lang="stylus" scoped>
.tag-list >>> .el-icon-cc-star-fill
    color #E6A13C
.tag-list >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
.operate
    margin-left 20px
    cursor pointer
.red-new
    color #ff0000
    position absolute
    top 0
</style>
