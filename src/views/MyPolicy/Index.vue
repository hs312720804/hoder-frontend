<template>
    <div>
        <el-tabs v-model="tabsValue" type="card">
            <el-tab-pane name="crowd" label="我的人群">
                <policy-list :source="source"></policy-list>
            </el-tab-pane>
            <el-tab-pane name="launch" label="我的投放">
                <launch-list :source="source"></launch-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import policyList from '../crowdStrategy/index'
import launchList from '../launch/LaunchTabList'
export default {
  name: 'myPolicyAA',
  components: {
    policyList,
    launchList
  },
  data () {
    return {
      tabsValue: 'crowd',
      source: 'myCrowd'
    }
  },
  watch: {
    '$route.params.changeTab': function (val, oldVal) {
      if (val != oldVal && val) {
        this.tabsValue = 'launch'
      }
    }
  },
  created () {
    if (this.$route.params.changeTab) {
      this.tabsValue = 'launch'
    }
  }
}
</script>

<style scoped>

</style>
