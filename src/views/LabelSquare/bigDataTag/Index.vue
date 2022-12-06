<template>
  <div class="label-content">
    <el-tabs v-model="activeName" @tab-click="handleTabChange" class="label-content-wrap">
      <el-tab-pane label="行为标签" name="behaviorLabel">
        <BehaviorTag
          :tagName="myCollectTagName"
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </BehaviorTag>
      </el-tab-pane>
      <el-tab-pane label="设备标签" name="labelZone">
        <label-zone
          :tagName="labelZoneTagName"
          @clear-search="handleClearSearch"
          :checkList="checkList"
          @change-checkList="handleCheckListChange"
          @fetch-checkList="fetchCheckListData"
          @get-table-selected="handleGetTableSelectedData"
          :show-selection="showSelection"
          :currentSelectTag="currentSelectTag">
        </label-zone>
      </el-tab-pane>

      <el-tab-pane label="模型标签" name="modelLabel">
        <!-- 一键投放时用这个组件 -->
        <ModelLabelIndexSelect
          v-if="showSelection"
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="currentSelectTag"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"
        >
        </ModelLabelIndexSelect>

        <!-- 标签广场用这个 -->
        <ModelLabelIndex
          v-else
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="currentSelectTag"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </ModelLabelIndex>
      </el-tab-pane>

    </el-tabs>

    <!-- <div v-if="showSelection">
      <div>已选标签：</div>
      <el-tag v-for="(item, index) in tagList" :key="item.tagId + '_' + index" :type="dataSourceColorEnum[item.dataSource]"
        closable @close="removeTag(item)">
        {{ item.tagName }}
      </el-tag>
    </div> -->
  </div>
</template>

<script>
import labelZone from './device.vue'
import ModelLabelIndex from './ModelLabel/ModelLabelIndex.vue'
import ModelLabelIndexSelect from './ModelLabel/ModelLabelIndexSelect.vue'
import BehaviorTag from './BehaviorTag.vue'

export default {
  name: 'bigDataTag',
  components: {
    labelZone,
    ModelLabelIndex,
    ModelLabelIndexSelect,
    BehaviorTag
  },
  props: {
    showSelection: {
      type: Boolean
    },
    currentSelectTag: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeName: 'labelZone',
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
      tempCheckList: []
    }
  },
  methods: {

    handleSearch () {
      // 全局搜索
      if (this.activeName === 'labelZone') {
        this.labelZoneTagName = this.searchVal
      } else {
        this.myCollectTagName = this.searchVal
      }
    },
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
    },
    handleGetTableSelectedData (val, mode) {
      this.$emit('get-table-selected', val, mode)
      // 只支持单数组，多数组要多次调用这个
      // const tagList = this.tagList
      // if (mode === 'add') {
      //   // 如果有匹配的，就直接return
      //   let firstIndex = -1
      //   for (let i = 0; i < tagList.length; i++) {
      //     if (tagList[i].tagId === val.tagId) {
      //       firstIndex = i
      //       return
      //     }
      //   }
      //   // 如果没有匹配的，就执行新增
      //   if (firstIndex === -1) {
      //     this.tagList.push(val)
      //   }
      // } else {
      //   // 取消选中的则删除这一项
      //   let index = -1
      //   for (let i = 0; i < tagList.length; i++) {
      //     if (tagList[i].tagId === val.tagId) {
      //       index = i
      //       this.tagList.splice(index, 1)
      //       return
      //     }
      //   }
      // }
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
@import '../common.styl'
</style>
