<template>
  <div class="tag-list">
    <!-- {{tagId}} -->
    <el-table
      ref="changeTable"
      v-show="!tagId"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      border
      :data="dataList"
      @select="handleSelectOrCancel"
      @select-all="handleSelectAllOrCancel">
      <el-table-column type="selection" width="55" v-if="showSelection">
      </el-table-column>
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="tagName" label="名称">
        <template slot-scope="scope">
          {{ scope.row.tagName }}
          <span v-if="scope.row.newOrUpdate" class="red-new">{{ scope.row.newOrUpdate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tagEnName" label="英文名">
        <!-- <template slot-scope="scope">
          {{ dataSourceEnum[scope.row.dataSource] }}
        </template> -->
      </el-table-column>

      <el-table-column v-if="(checkList.indexOf('remark') > -1)" prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="operation" label="操作" v-if="!showSelection">
        <!-- slot-scope="{ column, $index }" -->
        <template slot="header">
          操作
          <el-popover placement="top" trigger="click" class="popover-button">
            <div>
              <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                <el-checkbox label="remark">备注</el-checkbox>
              </el-checkbox-group>
            </div>
            <i class="el-icon-cc-setting operate" slot="reference">
            </i>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="text" @click="handleSeeTagCategoryDetail(scope.row)">
              查看
            </el-button>
            <el-button type="text" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="text" @click="handleRefresh(scope.row)">
              更新模型
            </el-button>
            <el-button type="text" @click="handleDelete(scope.row)">
              删除
            </el-button>
            <!-- <div :class="scope.row.myCollect ? 'el-icon-cc-star-fill' : 'el-icon-cc-star'"
              @click="handleCollect(scope.row)">
            </div> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <tag-detail v-if="tagId" :tag-id="tagId" :row="currentRow" @read-cancel="handleReadTagCancel">
    </tag-detail>
    <!-- 分页 -->
    <slot v-else></slot>
  </div>
</template>

<script>
import tagDetail from './TagDetail'
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
    }
  },
  components: {
    tagDetail
  },
  data () {
    return {
      multipleSelection: [],
      tagId: undefined,
      checkList: [],
      currentRow: {}
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
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleSeeTagCategoryDetail (row) {
      this.tagId = row.id
      this.currentRow = row
    },
    handleRefresh(row) {
      this.$confirm(`是否确认更新模型标签: ${row.tagName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.updateModelTag({ modelTagId: row.id }, '更新成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更新'
        })      
      })
      
    },
    handleDelete (row) {
      this.$emit('delete', row.id)
    },
    handleEdit (row) {
      this.$emit('edit', row)
    },
    handleReadTagCancel () {
      this.tagId = undefined
    },
    handleCollect (currentTag) {
      const flag = currentTag.myCollect
      const tagId = currentTag.id
      if (flag) {
        //    取消收藏
        this.$service.cancelCollectTags({ tagId }, '已取消收藏！').then(() => {
          this.$emit('fetch-data')
        })
      } else {
        //    收藏
        this.$service.collectTags({ tagId }, '已成功收藏！').then(() => {
          this.$emit('fetch-data')
        })
      }
    },
    updateTableSelected () {
      const arr = []
      const currentSelectRows = this.currentSelectedTags
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
