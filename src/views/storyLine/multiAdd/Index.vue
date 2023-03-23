<template>
<div>
  <!-- <el-steps :active="activeStep" finish-status="success" simple >
      <el-step title="1.配置公共属性" icon="el-icon-edit"></el-step>
      <el-step title="第二步：圈出人群" icon="el-icon-edit"></el-step>
  </el-steps> -->
  <el-steps :active="activeStep" style="width: 600px;margin: 0 auto">
    <el-step title="配置公共属性"></el-step>
    <el-step title="配置单独属性"></el-step>
  </el-steps>

  <CommonSet v-if="activeStep === 0"></CommonSet>
  <SingleSet v-else-if="activeStep === 1"></SingleSet>

  <div style="float: right">
    <el-button @click="activeStep= activeStep - 1">上一步</el-button>
    <el-button @click="activeStep= activeStep + 1">下一步</el-button>
  </div>
</div>
</template>
<script>
import CommonSet from './CommonSet.vue'
import SingleSet from './SingleSet.vue'

export default {
  components: {
    CommonSet,
    SingleSet
  },
  data () {
    return {
      activeStep: 1

    }
  },
  methods: {

  }
}
</script>
<style lang="styl">

</style>
