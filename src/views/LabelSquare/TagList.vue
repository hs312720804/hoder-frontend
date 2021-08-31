<template>
    <div class="tag-list">
        <el-table
            ref="changeTable"
            v-show="!tagId"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            :data="dataList"
            @select="handleSelectOrCancel"
            @select-all="handleSelectAllOrCancel"
        >
            <el-table-column
                type="selection"
                width="55"
                v-if="showSelection"
            >
            </el-table-column>
            <el-table-column prop="tagId" label="ID">
            </el-table-column>
            <el-table-column prop="tagName" label="名称">
                <template slot-scope="scope">
                    {{ scope.row.tagName }}
                    <span v-if="scope.row.newOrUpdate" class="red-new">{{ scope.row.newOrUpdate }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="dataSource" label="数据来源">
                <template slot-scope="scope">
                    {{ dataSourceEnum[scope.row.dataSource] }}
                </template>
            </el-table-column>
            <el-table-column
                v-if="(checkList.indexOf('defineRemark') > -1)"
                prop="defineRemark"
                label="标签定义"
            >
            </el-table-column>
            <el-table-column
                v-if="(checkList.indexOf('tagValues') > -1)"
                prop="tagValues"
                label="示例值"
            >
            </el-table-column>
            <el-table-column
                v-if="(checkList.indexOf('tagKey') > -1)"
                prop="tagKey"
                label="标签code"
            >
            </el-table-column>
            <el-table-column
                v-if="(checkList.indexOf('tagType') > -1)"
                prop="tagType"
                label="类型"
            >
                <template slot-scope="scope">
                    {{ typeEnum[scope.row.tagType] }}
                </template>
            </el-table-column>
            <el-table-column
                    v-if="(checkList.indexOf('remark') > -1)"
                    prop="remark"
                    label="备注"
            >
            </el-table-column>
            <el-table-column
                    prop="operation"
                    label="操作"
                    v-if="!showSelection"
            >
                <!-- slot-scope="{ column, $index }" -->
                <template
                        slot="header"
                >
                    操作
                    <el-popover
                            placement="top"
                            trigger="click"
                            class="popover-button"
                    >
                        <div>
                            <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                                <el-checkbox label="tagKey">标签code</el-checkbox>
                                <el-checkbox label="tagValues">示例值</el-checkbox>
                                <el-checkbox label="defineRemark">标签定义</el-checkbox>
                                <el-checkbox label="tagType">类型</el-checkbox>
                                <el-checkbox label="remark">备注</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <i
                                class="el-icon-cc-setting operate"
                                slot="reference"
                        >
                        </i>
                    </el-popover>
                </template>
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                            type="text"
                            @click="handleSeeTagCategoryDetail(scope.row)"
                        >
                            查看
                        </el-button>
                        <el-button
                            v-if="showEditBtn"
                            type="text"
                            @click="handleEdit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-if="showDeleteBtn"
                            type="text"
                            @click="handleDelete(scope.row)"
                        >
                            删除
                        </el-button>
                        <div
                            :class="scope.row.myCollect ? 'el-icon-cc-star-fill': 'el-icon-cc-star'"
                            @click="handleCollect(scope.row)"
                        >
                        </div>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <slot></slot>
        <tag-detail-list
          v-if="tagId"
          :tag-id="tagId"
          @read-cancel="handleReadTagCancel"
        >
        </tag-detail-list>
    </div>
</template>

<script>
import tagDetailList from './TagDetail'
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
    tagDetailList
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
    'dataList': 'updateTableSelected',
    'currentSelectedTags': 'updateTableSelected'
  },
  methods: {
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleSeeTagCategoryDetail (row) {
      this.tagId = row.tagId
    },
    handleDelete (row) {
      this.$emit('delete', row.tagId)
    },
    handleEdit (row) {
      this.$emit('edit', row)
    },
    handleReadTagCancel () {
      this.tagId = undefined
    },
    handleCollect (currentTag) {
      const flag = currentTag.myCollect
      const tagId = currentTag.tagId
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
