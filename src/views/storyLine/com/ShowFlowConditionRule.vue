<template>
  <div>
    <div v-for="(item, index) in flowCondition.rules" :key="index" class="rule-detail">
      <div v-if="index > 0" class="label-or-space">{{ conditionEnum[flowCondition.condition] }}</div>
      <!-- {{ item }} -->
      <div class="label-ground">
        (
        <div v-for="(childItem, childItemIndex) in item.rules" :key="childItem.tagId + childItemIndex" class="label-item">
          <!-- {{ childItem }} -->
          <div v-if="childItemIndex > 0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
          <span class="txt">{{ childItem.tagName }}</span>

          <ShowFlowConditionRuleItem
            :childItem="childItem"
            :soureceSignList="soureceSignList"
            >
          </ShowFlowConditionRuleItem>

        </div>
        )
      </div>
    </div>
  </div>
</template>

<script>
import ShowFlowConditionRuleItem from './ShowFlowConditionRuleItem.vue'
export default {
  components: { ShowFlowConditionRuleItem },
  props: {
    flowCondition: {
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
