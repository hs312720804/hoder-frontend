<template>
  <div class="label-content">
    <el-tabs v-model="activeName" @tab-click="handleTabChange" class="label-content-wrap">

      <el-tab-pane label="临时标签" name="tempLabel">
        <temp-label-index :show-selection="showSelection" :currentSelectTag="tagList" :checkList="tempCheckList"
          :crowdType=2 @get-table-selected="handleGetTableSelectedData" @change-checkList="handleTempCheckListChange">
        </temp-label-index>
      </el-tab-pane>

      <el-tab-pane label="行为标签" name="behaviorLabel">
        <temp-label-index :show-selection="showSelection" :currentSelectTag="tagList" :checkList="tempCheckList"
          @get-table-selected="handleGetTableSelectedData" @change-checkList="handleTempCheckListChange" :crowdType=3>
        </temp-label-index>
      </el-tab-pane>

      <el-tab-pane label="数据银行标签" name="bankLabel">
        <temp-label-index :show-selection="showSelection" :currentSelectTag="tagList" :checkList="tempCheckList"
          @get-table-selected="handleGetTableSelectedData" @change-checkList="handleTempCheckListChange" :crowdType=4>
        </temp-label-index>
      </el-tab-pane>

      <el-tab-pane label="模型标签" name="modelLabel">
        <ModelLabelIndex :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </ModelLabelIndex>
      </el-tab-pane>

    </el-tabs>

    <div v-if="showSelection">
      <div>已选标签：</div>
      <el-tag v-for="(item, index) in tagList" :key="item.tagId + '_' + index" :type="dataSourceColorEnum[item.dataSource]"
        closable @close="removeTag(item)">
        {{ item.tagName }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import tempLabelIndex from './tempLabel/TempLabelIndex'
import ModelLabelIndex from './ModelLabel/ModelLabelIndex.vue'

export default {
  name: 'labelSquareAA',
  components: {
    tempLabelIndex,
    ModelLabelIndex
  },
  data () {
    return {
      activeName: 'tempLabel',
      searchVal: '',
      labelZoneTagName: undefined,
      myCollectTagName: undefined,
      checkList: [],
      tagList: [],
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning'
      },
      showSelection: false,
      tempCheckList: []
    }
  },
  methods: {

    handleClearSearch () {
      this.searchVal = undefined
      this.labelZoneTagName = undefined
      this.myCollectTagName = undefined
    },
    fetchCheckListData () {
      this.$service.getListDimension({ type: 4 }).then(data => {
        if (data) {
          if (data.behaviorShow) {
            this.checkList = data.behaviorShow.split(',')
          } else {
            this.checkList = ['defineRemark']
          }
        } else {
          this.checkList = ['defineRemark']
        }
      })
    },

    handleTabChange () {
      switch (this.activeName) {
        case 'tempLabel':
          // 临时标签
          this.fetchTempCheckListData()
          this.$root.$emit('temp-label-list-refresh-2')
          break

        case 'behaviorLabel':
          // 行为标签
          this.fetchTempCheckListData()
          this.$root.$emit('temp-label-list-refresh-3')
          break
        case 'bankLabel':
          // 数据银行标签
          this.fetchTempCheckListData()
          this.$root.$emit('temp-label-list-refresh-4')
          break

        case 'modelLabel':
          // 模型标签
          // this.fetchListData()
          this.$root.$emit('model-tag-list-refresh')
          break
      }
    },
    handleGetTableSelectedData (val, mode) {
      // 只支持单数组，多数组要多次调用这个
      const tagList = this.tagList
      if (mode === 'add') {
        // 如果有匹配的，就直接return
        let firstIndex = -1
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i].tagId === val.tagId) {
            firstIndex = i
            return
          }
        }
        // 如果没有匹配的，就执行新增
        if (firstIndex === -1) {
          this.tagList.push(val)
        }
      } else {
        // 取消选中的则删除这一项
        let index = -1
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i].tagId === val.tagId) {
            index = i
            this.tagList.splice(index, 1)
            return
          }
        }
      }
    },
    removeTag (tag) {
      // const addForm = this.addForm
      // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
    },
    fetchTempCheckListData () {
      this.$service.getListDimension({ type: 5 }).then(data => {
        if (data) {
          if (data.behaviorShow) {
            this.tempCheckList = data.behaviorShow.split(',')
          } else {
            this.tempCheckList = ['defineRemark']
          }
        } else {
          this.tempCheckList = ['defineRemark']
        }
      })
    },
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 4, behaviorShow: val.join(',') })
    },
    handleTempCheckListChange (val) {
      this.$service.saveListDimension({ type: 5, behaviorShow: val.join(',') })
    }
  },
  created () {
    this.fetchCheckListData()
    this.fetchTempCheckListData()
  }
}
</script>

<style lang="stylus" scoped>
.label-content
  position relative
.search-input
  position fixed
  top 118px
  right 35px
  width 350px
  z-index 999
  .icon-fixed
    position absolute
    top 8px
    right 10px
    transform rotate(-90deg)
.label-content >>> .el-tabs__header
  // position fixed
  width 100%
  z-index 999
.label-content >>> .el-tabs__nav-wrap
  background #fff
  z-index 999
  margin-top: -20px;
  padding-top: 20px;
.label-content-wrap> >>> .el-tabs__content
  height calc(100vh - 200px);
  overflow: auto
</style>
