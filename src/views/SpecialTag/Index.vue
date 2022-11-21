<template>
    <div>
        <div class="header">
            <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
                <el-step title="第一步：挑选基础标签" icon="el-icon-edit"></el-step>
                <el-step title="第二步：编辑组合标签" icon="el-icon-edit"></el-step>
                <!-- <el-step title="第三步：投放到业务平台" icon="el-icon-edit"></el-step> -->
            </el-steps>
        </div>
        <div>
                    <!-- :recordId="recordId" -->
            <AddOrEditSpecialTag
                v-if="activeStep === 0"
                :mode="mode"
                :initTagList="initTagList"
                @policyNextStep="handlePolicyNextStep"
                :usedTagList="usedTagList"
                @resetFormData="resetFormData"
                @handleDirectStrategyList="handleDirectStrategyList">
            </AddOrEditSpecialTag>

                    <!-- :recordId="recordId" -->
            <create-crowd
                v-if="activeStep === 1"
                :initTagList="initTagList"
                @crowdNextStep="handleCrowdNextStep"
                @crowdPrevStep="handleCrowdPrevStep"
                @resetFormData="resetFormData"
                @handleDirectStrategyList="handleDirectStrategyList">
            </create-crowd>

        </div>
    </div>
</template>

<script>
import createCrowd from './CreateCrowd'
import AddOrEditSpecialTag from './AddOrEditSpecialTag'
export default {
  name: 'index',
  components: {
    // createPolicy,
    createCrowd,
    // LaunchToBusiness,
    AddOrEditSpecialTag
  },
  provide () {
    return {
      sTagIndex: this
    }
  },
  data () {
    return {
      mode: '',
      activeStep: 0,
      recordId: undefined,
      tempPolicyAndCrowd: {},
      initTagList: [],
      usedTagList: [],
      routeSource: undefined,
      specialTagDetail: {}
    }
  },
  watch: {
    // '$route.params.source' : function (val, oldVal) {
    //     if(val != oldVal) {
    //         this.routeSource = val ? val : undefined
    //     }
    // },
    '$route.query.specialTagId': function (val, oldVal) {
      if (val !== oldVal && !!val) {
        this.getSpecialTagDetail()
      }
    }

  },
  methods: {
    handleNextStep (step, recordId) {
      this.activeStep = step + 1
      // this.recordId = recordId
    },
    handleCrowdNextStep (step, recordId, tempPolicyAndCrowd) {
      this.activeStep = step + 1
      // this.recordId = recordId
      this.tempPolicyAndCrowd = tempPolicyAndCrowd
    },
    handleCrowdPrevStep (step, recordId) {
      this.activeStep = step - 1
      // this.recordId = recordId
    },
    handleLaunchPrevStep (step) {
      this.activeStep = step - 1
    },
    handlePolicyNextStep (tagList) {
      this.activeStep = 1
      // this.recordId = recordId
      this.initTagList = tagList
      // this.initTagList = [4398]
    },
    resetFormData () {
      this.activeStep = 0
      // this.recordId = undefined
    },
    handleDirectStrategyList () {
      this.$root.$emit('stratege-list-refresh')
      if (this.routeSource) {
        this.$router.push({ path: 'launch/myPolicy' })
      } else {
        this.$router.push({ path: 'strategyList' })
      }
    },
    getSpecialTagDetail () {
      this.$service.specialTagDetail({ specialTagId: this.$route.query.specialTagId }).then((data) => {
        this.specialTagDetail = data
        this.initTagList = this.specialTagDetail.tags || []
        if (this.specialTagDetail.useTags && this.specialTagDetail.useTags.length > 0) {
          this.usedTagList = this.specialTagDetail.useTags.map(item => {
            return Number(item.tagId)
          })
        }
      })
    }
  },
  created () {
    // if (this.$route.params.source) {this.routeSource = this.$route.params.source}
    if (this.$route.query.specialTagId) { // 编辑
      this.mode = 'edit'
      this.getSpecialTagDetail()
    }
  },
  destroyed () {
    // debugger
  }
}
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
