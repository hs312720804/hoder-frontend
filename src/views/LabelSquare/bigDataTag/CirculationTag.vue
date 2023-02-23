<template>
  <div class="my-collect">

    <!-- <tag-list
      :data-list="dataList"
      :current-selected-tags="currentSelectTag"
      :show-selection="showSelection"
      @fetch-data="fetchData"
      @change-checkList="handleCheckListChange"
      @table-selected="handleTableSelected"
      >
    </tag-list> -->

    <div class="tag-list">
      <!-- v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" -->
      <el-table
        ref="changeTable"
        border
        :data="dataList"
        @select="handleSelectOrCancel"
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
        <el-table-column prop="tagKey" label="tagKey">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <!-- <el-table-column prop="dataSource" label="数据来源">
          <template slot-scope="scope">
            {{ dataSourceEnum[scope.row.dataSource] }}
          </template>
        </el-table-column> -->

      </el-table>

    </div>

  </div>
</template>

<script>
// import tagList from '../coms/TagList'
export default {
  name: 'MyCollect',
  components: {
    // tagList
  },
  props: {
    checkList: {
      type: Array
    },
    currentSelectTag: {
      type: Array
    },
    showSelection: {
      type: Boolean
    }
  },
  watch: {
    dataList: 'updateTableSelected',
    currentSelectTag: 'updateTableSelected'
  },
  data () {
    return {
      dataList: [],
      multipleSelection: []
    }
  },
  methods: {
    updateTableSelected () {
      console.log('this.currentSelectTag---》', this.currentSelectTag)
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
    fetchData () {
    // 获取标签
      this.$service.getRuleIndicators().then(res => {
        this.dataList = res
      })
      this.$service.getSourceSign().then(res => {
        this.soureceSignList = res
      })
    },
    // handleCheckListChange (val) {
    //   this.$emit('change-checkList', val)
    // },
    // handleTableSelected (val, mode) {
    //   this.$emit('get-table-selected', val, mode)
    // }

    handleSelectOrCancel (select, row) {
      const selectedFlag = select.length && select.indexOf(row) !== -1
      // true就是选中，0或者false是取消选中
      if (selectedFlag) {
        this.$refs.changeTable.toggleRowSelection(row, true)
        this.$emit('get-table-selected', row, 'add')
      } else {
        this.$refs.changeTable.toggleRowSelection(row, false)
        this.$emit('get-table-selected', row, 'del')
      }
    },
    handleSelectAllOrCancel (select) {
      // 当select长度为0，则是取消全选，否则是全选
      const data = this.dataList
      if (select.length === 0) {
        for (let i = 0; i < data.length; i++) {
          this.$emit('get-table-selected', data[i], 'del')
        }
      } else {
        for (let j = 0; j < data.length; j++) {
          this.$emit('get-table-selected', data[j], 'add')
        }
      }
    }

  },
  created () {
    this.$root.$on('big-data-list-refresh', this.fetchData)
    this.fetchData()
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
</style>
