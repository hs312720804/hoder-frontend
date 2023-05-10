<template>
<div>
  <div v-for="(item, index) in rulesJson.rules" :key="index" class="rule-detail">
    <div v-if="index > 0" class="label-or-space">{{ conditionEnum[rulesJson.condition] }}</div>
    <div class="label-ground">(
      <div v-for="(childItem, childItemIndex) in item.rules" :key="childItem.tagId + childItemIndex" class="label-item">
        <!-- {{childItem}} -->
        <div v-if="childItemIndex > 0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
        <span class="txt">{{ childItem.categoryName || childItem.tagName }}</span>

        <!-- 流转标签 -->
        <template v-if="(childItem.dataSource === 20)">
          <ShowFlowConditionRuleItem :childItem="childItem" :soureceSignList="soureceSignList">
          </ShowFlowConditionRuleItem>
        </template>

        <template v-else>
          <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
          <span
            v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
          <span
            v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
          <span class="in">
            <span>{{ childItem.value }}</span>
          </span>
          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
        </template>

      </div>)
    </div>
  </div>
</div>
</template>

<script>
import ShowFlowConditionRuleItem from './ShowFlowConditionRuleItem.vue'

export default {
  components: {
    ShowFlowConditionRuleItem
  },
  props: {
    rulesJson: {
      type: Object,
      default: () => {}
    },
    conditionEnum: {
      type: Object,
      default: () => {}
    },
    soureceSignList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>
@import '../sty/common.styl'
@import '../sty/dark.styl'
@import '../sty/light.styl'
</style>
