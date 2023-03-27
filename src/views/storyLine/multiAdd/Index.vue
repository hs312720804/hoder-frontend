<template>
  <div>
    <el-steps :active="activeStep" style="width: 600px;" class="step-sty">
      <el-step title="配置公共属性"></el-step>
      <el-step title="配置单独属性"></el-step>
    </el-steps>

    <CommonSet v-if="activeStep === 0" ref="commonSetRef"></CommonSet>
    <AllPerSet v-else-if="activeStep === 1"></AllPerSet>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="activeStep= activeStep - 1">上一步</el-button>
      <el-button type="primary" @click="activeStep= activeStep + 1">下一步</el-button>
    </span> -->
  </div>
</template>
<script>
import CommonSet from './CommonSet.vue'
import AllPerSet from './AllPerSet.vue'

export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value: {
      handler (val) {
        this.activeStep = val
      },
      immediate: true
    },
    activeStep (val) {
      this.$emit('input', val)
    }
  },
  components: {
    CommonSet,
    AllPerSet
  },
  data () {
    return {
      activeStep: 0

    }
  },
  methods: {

  }
}
</script>
<style lang="styl">

</style>
