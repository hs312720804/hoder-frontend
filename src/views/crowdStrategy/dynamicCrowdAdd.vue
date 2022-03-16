<template>
    <div v-if="reloadFlag">
        <div class="header">
          <!-- 动态人群 -->
          <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
              <el-step title="第一步：圈出人群" icon="el-icon-edit"></el-step>
              <el-step title="第二步：动态人群配置" icon="el-icon-edit"></el-step>
              <el-step title="第三步：设置流转条件" icon="el-icon-edit"></el-step>
              <el-step title="第四步：投放到业务平台" icon="el-icon-edit"></el-step>
          </el-steps>

        </div>
        <!-- <div style="color: blue">
          isDynamicPeople: {{isDynamicPeople}} <br/>
          :policyId:: {{policyId}}<br/>
          :policyName:: {{ policyName }}<br/>
          :crowdId:: {{ crowdId }}<br/>
        </div> -->
        <!-- 动态人群 -->
        <div >
          <create-crowd
              v-if="policyId && activeStep === 0"
              :policyId="policyId"
              :crowdId="crowdId"
              :isDynamicPeople="isDynamicPeople"
              @crowdNextStep="handleCrowdNextStep"
              @crowdPrevStep="handleCrowdPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
              @dynamicCrowdNextStep="handleDynamicCrowdNextStep"
              @dynamicCrowdPrevStep="handleDynamicCrowdPrevStep"
          >
          </create-crowd>

          <!-- 动态人群设置 -->
          <dynamic-people-setting
            v-if="activeStep === 1"
            :policyId="policyId"
            :crowdId="crowdId"
            :isDynamicPeople="isDynamicPeople"
            @crowdNextStep="handleCrowdNextStep"
            @crowdPrevStep="handleCrowdPrevStep"
            @resetFormData="resetFormData"
            @handleDirectStrategyList="handleDirectStrategyList"
          >
          </dynamic-people-setting>

          <!-- 设置流转条件 -->
          <dynamic-people-conditions
            v-if="activeStep === 2"
            :policyId="policyId"
            :crowdId="crowdId"
            :isDynamicPeople="isDynamicPeople"
            @crowdNextStep="handleCrowdNextStep"
            @crowdPrevStep="handleCrowdPrevStep"
            @resetFormData="resetFormData"
            @handleDirectStrategyList="handleDirectStrategyList"
          >
          </dynamic-people-conditions>

          <launch-to-business
            v-if="activeStep === 3"
            :recordId="recordId"
            :tempPolicyAndCrowd="tempPolicyAndCrowd"
            :routeSource="routeSource"
            :policyId="policyId"
            :crowdId="crowdId"
            :dynamicMode="dynamicMode"
            :isDynamicPeople="isDynamicPeople"
            @nextStep="handleNextStep"
            @launchPrevStep="handleLaunchPrevStep"
            @resetFormData="resetFormData"
            @handleDirectStrategyList="handleDirectStrategyList"
            @goBackCrowdListPage="$emit('goBackCrowdListPage', true)"
          ></launch-to-business>

        </div>

    </div>
</template>

<script>
// import createPolicy from './CreatePolicy'
import { mapGetters } from 'vuex'
import createCrowd from '@/views/OneTouchDrop/CreateCrowd'
import LaunchToBusiness from '@/views/OneTouchDrop/LaunchToBusinessPlatform'
import newCreatePolicy from '@/views/LabelSquare/CreatePolicyWithLabelSquare'
import createConfigScheme from '@/views/OneTouchDrop/createConfigScheme'
import DynamicPeopleSetting from '@/components/dynamicPeople/DynamicPeopleSetting'
import DynamicPeopleConditions from '@/components/dynamicPeople/DynamicPeopleConditions'
export default {
  name: 'index',
  components: {
    // createPolicy,
    createCrowd,
    LaunchToBusiness,
    newCreatePolicy,
    createConfigScheme,
    DynamicPeopleSetting,
    DynamicPeopleConditions
  },
  props: {
    initPolicyId: {
      type: [String, Number],
      default: ''
    },
    initPolicyName: {
      type: [String],
      default: ''
    },
    initCrowdId: {
      type: [String, Number],
      default: undefined
    },
    dynamicMode: {
      type: [String],
      default: 'add'
    }
  },

  computed: {
    ...mapGetters(['policyName'])
  },
  data () {
    return {
      activeStep: 0,
      recordId: undefined,
      tempPolicyAndCrowd: {},
      initTagList: [],
      routeSource: undefined,
      peoplePageCheck: false,
      isDynamicPeople: false,
      programmeId: undefined,
      reloadFlag: true,
      policyId: undefined,
      // policyName: undefined,
      crowdId: undefined
    }
  },
  watch: {
    $route: {
      handler () {
        console.log('this.$route.params.refresh==>', this.$route.params.refresh)
        if (this.$route.params.refresh) {
          // 刷新页面
          this.initTagList = []
          this.reloadFlag = false
          this.resetFormData() // 重置数据
          this.$nextTick(() => {
            this.reloadFlag = true
          })
        }
      },
      deep: true
    },
    '$route.params.source': function (val, oldVal) {
      if (val != oldVal) {
        this.routeSource = val || undefined
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'strategyList') {
        vm.activeStep = 0
        next()
      }
      next()
    })
  },

  methods: {
    handleNextStep (step, recordId) {
      this.activeStep = step
      this.recordId = recordId
    },
    handleCrowdNextStep (step, recordId, tempPolicyAndCrowd) {
      this.activeStep = step
      this.recordId = recordId
      this.tempPolicyAndCrowd = tempPolicyAndCrowd
    },
    handleDynamicCrowdNextStep (step, policyId, policyName, crowdId) {
      this.activeStep = step
      this.policyId = policyId
      this.$store.commit('setPolicyName', policyName)
      this.crowdId = crowdId
    },
    handleDynamicCrowdPrevStep (step, policyId, policyName, crowdId) {
      // this.activeStep = step - 1
      this.policyId = policyId
      this.$store.commit('setPolicyName', policyName)
      this.crowdId = crowdId
      this.$emit('goBackCrowdListPage', true)
      // this.$router.push({ name: 'strategyList' })
    },
    handleCrowdPrevStep (step, recordId) {
      this.activeStep = step - 2
      this.recordId = recordId
    },
    handleLaunchPrevStep (step) {
      this.activeStep = step - 2
    },

    resetFormData () {
      this.activeStep = 0
      this.recordId = undefined
      // this.peoplePageCheck = false
      this.isDynamicPeople = false
      this.crowdId = undefined
      this.policyId = undefined
      this.$store.commit('setPolicyId', undefined)
      this.$store.commit('setPolicyName', undefined)
    },
    handleDirectStrategyList () {
      this.$root.$emit('stratege-list-refresh')
      if (this.routeSource) {
        this.$router.push({ path: 'launch/myPolicy' })
      } else {
        this.$router.push({ path: 'launch/strategyList' })
      }
    }
  },
  created () {
    if (this.$route.params.source) { this.routeSource = this.$route.params.source }
    this.$store.commit('setEditSchemeConfig', false)
    if (this.dynamicMode === 'edit') { // 大人群列表 -添加动态人群
      this.activeStep = 0
      this.isDynamicPeople = true
      this.policyId = this.initPolicyId
      this.$store.commit('setPolicyName', this.initPolicyName)
      this.crowdId = this.initCrowdId
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
