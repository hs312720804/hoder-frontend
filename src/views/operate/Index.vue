<template>
  <div class="box">
    <!-- component 组件是 Vue 内置的 -->
    <!-- is 表示要渲染的组件的名字 -->
    <template v-if="!!comName">
      <component :is="comName"></component>
    </template>

  </div>
</template>

<script>
// 动态人群报告
import DynamicCrowdReport from '@/views/launch/launchAnalysis/DynamicReport'
import homepageReleaseRecord from '@/views/crowdStrategy/HomepageReleaseRecord'
// 组合标签
import specialTag from '@/views/SpecialTag/Index'


export default {
  components: {
    DynamicCrowdReport,
    homepageReleaseRecord,
    specialTag
  },
  data() {
    return {
      comName: ''
    }
  },
  watch: {
    $route: {
      handler () {
        this.comName = this.$route.query.comName || ''
      },
      immediate: true
    }
  },
  created() {
    console.log('val ---> created', this.$route.query.comName)
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>


</style>

