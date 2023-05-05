<template>
<div class="border-line"  style="position: relative;">
  <div class="outer-and" v-if="entry.rulesJson && JSON.parse(entry.rulesJson).rules.length > 0 && entry.behaviorRulesJson && JSON.parse(entry.behaviorRulesJson).rules.length > 0">
    <span class="and-or" :class="entry.link === 'OR' ? 'OR': ''" >
    {{ entry.link === 'OR' ? '或' : '且' }}
    </span>
  </div>
  <!-- {{ conditionEnum }}
  {{ soureceSignList }} -->
  <!-- {{entry.rulesJson}} -->
  <!-- {{ JSON.parse(entry.rulesJson).rules }} -->
  <!-- ( 有效混合源爱奇艺影视会员 = true 且 芯片型号 = 6A848,RTD2982DQ 且 存储 = 4G,8G ) -->
  <template v-if="entry.rulesJson && JSON.parse(entry.rulesJson).rules.length > 0">
    <span class="border-title">普通标签</span>
    <div class="rule-string">
      <div>
        <ShowRule
          :rulesJson="JSON.parse(entry.rulesJson)"
          :conditionEnum="conditionEnum"
          :soureceSignList="soureceSignList"
        >
        </ShowRule>

      </div>
    </div>
  </template>

  <template  v-if="entry.behaviorRulesJson && JSON.parse(entry.behaviorRulesJson).rules.length > 0">
    <span class="border-title">行为标签</span>
    <!-- {{entry.behaviorRulesJson}} -->
    <div class="rule-string bav-wrap">
      <template>
        <MultipleActionTagSelect
          ref="multipleActionTagSelect"
          :isView="true"
          :behaviorRulesJson="JSON.parse(entry.behaviorRulesJson)"
        ></MultipleActionTagSelect>
      </template>
      <!-- <div v-else class="no-data-text">暂无</div> -->
    </div>
  </template>

</div>
</template>

<script>
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/IndexForStoryLine.vue'
import ShowRule from '@/views/storyLine/com/ShowRule.vue'

export default {
  components: {
    MultipleActionTagSelect,
    ShowRule
  },
  props: {
    entry: {
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
