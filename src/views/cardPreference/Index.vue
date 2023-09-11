<template>
  <div class="label-content">
    <el-tabs v-model="activeName" @tab-click="handleTabChange" class="label-content-wrap">

      <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.value" :key="item.value" >
      </el-tab-pane>

      <BehaviorTag
        :activeName="activeName"
      >
      </BehaviorTag>

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
      tabList: [{
        label: '爱奇艺',
        value: 'iqiyi'
      }, {
        label: '腾讯',
        value: 'tencent'
      }, {
        label: '优酷',
        value: 'youku'
      }, {
        label: '亲子',
        value: 'parent_child'
      }
      ],
      activeName: 'iqiyi',
      searchVal: '',
      checkList: [],
      tagList: [],
      tempCheckList: []
    }
  },
  methods: {

    handleTabChange () {
    },
    handleGetTableSelectedData (val, mode) {
      this.$emit('get-table-selected', val, mode)
    }
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
@import './common.styl'
</style>
