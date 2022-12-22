<template>
 <component :is="componentTag"></component>
</template>

<script>
import CrowdReport from './dynamicReportCom/CrowdReport.vue'
import ErrorReport from './dynamicReportCom/ErrorReport.vue'
export default {
  components: { CrowdReport, ErrorReport },
  created () {
    console.log('val ---> created', this.$route.query.crowdId)
    console.log('val ---> created', this.$route.query.error)
  },
  watch: {
    $route: {
      handler () {
        // this.crowdId = this.$route.query.crowdId || ''
        // // this.crowdId = 12461
        // this.crowdName = this.$route.query.crowdName || ''
        // if (this.crowdId !== '') {
        //   this.initData()
        //   this.$nextTick(() => {
        //     console.log('val--->', document.querySelector('.el-main'))
        //     document.querySelector('.el-main').scrollTop = 0
        //   })
        // }
        if (this.$route.query.error) {
          this.componentTag = 'ErrorReport'
        } else {
          this.componentTag = 'CrowdReport'
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      componentTag: ''
    }
  },
  methods: {

  }
}
</script>
