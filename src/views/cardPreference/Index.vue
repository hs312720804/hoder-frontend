<template>
  <div class="label-content">
    <el-tabs v-model="activeName" @tab-click="handleTabChange" class="label-content-wrap">

      <el-tab-pane label="爱奇艺" name="aiqiyi">
        <BehaviorTag
          :tagName="myCollectTagName"
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"
        >
        </BehaviorTag>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
// import labelZone from './Device.vue'
// import ModelLabelIndex from './ModelLabel/ModelLabelIndex.vue'
// import ModelLabelIndexSelect from './ModelLabel/ModelLabelIndexSelect.vue'
import BehaviorTag from './BehaviorTag.vue'
// import CirculationTag from './CirculationTag.vue'
// import RealTimeTag from './RealTimeTag.vue'

export default {
  name: 'bigDataTag',
  components: {
    // labelZone,
    // ModelLabelIndex,
    // ModelLabelIndexSelect,
    BehaviorTag
    // CirculationTag,
    // RealTimeTag
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
      activeName: 'aiqiyi',
      searchVal: '',
      labelZoneTagName: undefined,
      myCollectTagName: undefined,
      checkList: [],
      tagList: [],
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
@import './common.styl'
</style>
