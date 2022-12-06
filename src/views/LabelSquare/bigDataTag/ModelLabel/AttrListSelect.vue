<template>
  <div class="tag-list">
    <el-table ref="changeTable" v-show="!tagId" v-loading="loading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" border :data="dataList" @select="handleSelectOrCancel"
      @select-all="handleSelectAllOrCancel">
      <el-table-column type="selection" width="55" v-if="showSelection">
      </el-table-column>
      <el-table-column prop="tagId" label="ID">
      </el-table-column>
      <el-table-column prop="tagName" label="名称">
        <template slot-scope="scope">
          {{ scope.row.tagName }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="数据来源">
        <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template>
      </el-table-column>

      <el-table-column prop="tagKey" label="标签code">
      </el-table-column>
      <el-table-column prop="tagType" label="类型">
        <template slot-scope="scope">
          {{ typeEnum[scope.row.tagType] }}
        </template>
      </el-table-column>

    </el-table>

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
    currentSelectTag: {
      type: Array
    }

  },

  data () {
    return {
      multipleSelection: [],
      tagId: undefined,
      checkList: []
    }
  },
  watch: {
    checkListParent: function (val) {
      this.checkList = val
    },
    dataList: 'updateTableSelected',
    currentSelectTag: 'updateTableSelected'
  },
  methods: {
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    // 更新选中状态
    updateTableSelected () {
      const arr = []
      const currentSelectRows = this.currentSelectTag
      this.dataList.forEach((item, index) => {
        currentSelectRows.forEach((i) => {
          if (item.tagId === i.tagId) {
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
        for (let i = 0; i < data.length; i++) {
          this.$emit('table-selected', data[i], 'del')
        }
      } else {
        for (let j = 0; j < data.length; j++) {
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
