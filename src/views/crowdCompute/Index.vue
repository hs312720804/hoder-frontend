<template>
<div class="label-content">
  <el-tabs
    v-model="activeName"
    @tab-click="handleTabChange"
    class="label-content-wrap"
  >
    <el-tab-pane label="统计" name="total">
      <total></total>
    </el-tab-pane>

  </el-tabs>

</div>
</template>

<script>
import total from './total'
export default {
  name: 'crowdCompute',
  components: {
    total
  },
  data () {
    return {
      activeName: 'total'
    }
  },
  methods: {
    handleTabChange () {

    }
  }

}
</script>

<style lang="stylus" scoped>
.label-content-wrap> >>> .el-tabs__content
  height calc(100vh - 200px);
  overflow: auto
  .el-tab-pane
    height 100%
</style>
