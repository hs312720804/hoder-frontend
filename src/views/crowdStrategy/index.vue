<template>
    <div class="crowd-strategy">
      <strategy-list
        v-if="isShowStrategyList"
        @openCrowdPage="openCrowdPage"
        @openSchemePage="openSchemePage"
        :historyFilter="historyFilter"
        :showAllParent="showAllParent"
        :checkListFilter="checkListFilter"
        :parentSource="source"
      ></strategy-list>
      <crowd-index v-if="!isShowStrategyList && !isShowSchemePage" :selectRow="selectRow" @goBack="goBack"></crowd-index>
      <scheme-index v-if="isShowSchemePage" :selectRow="selectRow" @goBack="goBack"></scheme-index>
    </div>
</template>
<script>
import StrategyList from './strategyList'
import CrowdIndex from './crowdIndex'
import SchemeIndex from './schemeIndex'
export default {
  name: 'strategyListAA',
  data () {
    return {
      selectRow: null, // 选中的一行策略数据
      isShowStrategyList: true,
      historyFilter: null,
      checkListFilter: ['useStatus'],
      // listCurrentPage: undefined,
      // listPageSize: undefined
      showAllParent: false,
      isShowSchemePage: false
    }
  },
  props: ['source'],
  methods: {
    openCrowdPage (row, filter, checkList, showAll) {
      this.selectRow = row
      this.isShowStrategyList = false
      this.historyFilter = filter
      this.checkListFilter = checkList
      this.showAllParent = showAll
      // this.listCurrentPage = filter.page
      // this.listPageSize = filter.pageSize
    },
    openSchemePage (row) {
      this.isShowSchemePage = true
      this.isShowStrategyList = false
      this.selectRow = row
      this.$store.commit('setPolicyId', row.policyId)
    },
    goBack () {
      this.isShowStrategyList = true
      this.isShowSchemePage = false
    }
  },
  components: {
    StrategyList,
    CrowdIndex,
    SchemeIndex
  }
}
</script>

<style lang="stylus" scoped>
.crowd-strategy
  padding 14px
  background #fff
</style>