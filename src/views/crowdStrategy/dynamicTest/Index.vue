<template>
  <div style="position: relative">
    <template v-if="reloadFlag">
      <div style="height: calc(100vh - 200px); overflow: auto;">
          <div class="">
            <!-- 动态人群 -->
            <!-- style="width: calc(100% - 455px); margin-left: 252px;" -->
            <el-steps :active="activeStep" finish-status="success" simple >
                <el-step title="第一步：动态方案配置" icon="el-icon-edit"></el-step>
                <el-step title="第二步：流转方案配置" icon="el-icon-edit"></el-step>
                <el-step title="第三步：填写实验有效期" icon="el-icon-edit"></el-step>
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

            <!-- 动态人群设置 -->
            <step1
              ref="step1"
              v-if="activeStep === 0"
              :policyId="policyId"
              :crowdId="crowdId"
              @crowdNextStep="handleCrowdNextStep"
              @crowdPrevStep="handleCrowdPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
              @goBackCrowdListPage="$emit('goBackCrowdListPage', true)"
            >
            </step1>

            <!-- 设置流转条件 -->
            <step2
              ref="step2"
              v-if="activeStep === 1"
              :policyId="policyId"
              :crowdId="crowdId"
              @crowdNextStep="handleCrowdNextStep"
              @crowdPrevStep="handleCrowdPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
              @goBackCrowdListPage="$emit('goBackCrowdListPage', true)"
            >
            </step2>

            <!-- 第三步：填写实验有效期 -->
            <step3
              ref="step3"
              v-if="activeStep === 2"
              :policyId="policyId"
              :crowdId="crowdId"
              @crowdNextStep="handleCrowdNextStep"
              @crowdPrevStep="handleCrowdPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
              @goBackCrowdListPage="$emit('goBackCrowdListPage', true)"
            >
            </step3>

          </div>

          <div v-if="activeStep === 0" class="bottom-wrap">
            <el-button type="primary" @click="handleSaveStep1()">下一步</el-button>
            <el-button type="info" @click="$emit('goBackCrowdListPage')">返回</el-button>
          </div>

          <div v-if="activeStep === 2" class="bottom-wrap">
            <el-button type="primary" @click="handleSaveStep3">完成</el-button>
            <el-button type="info" @click="handleCrowdPrevStep(2)">上一步</el-button>
          </div>

      </div>
    </template>

    <div v-if="activeStep === 1" class="bottomBtn">
      <el-button type="primary" @click="handleSave" class="btn">下一步</el-button>
      <el-button type="info" @click="handleBackPrevStep" class="btn">上一步</el-button>
      <el-button type="info" @click="$emit('goBackCrowdListPage')" class="btn">返 回</el-button>
    </div>

  </div>
</template>

<script>
// import createPolicy from './CreatePolicy'
import { mapGetters } from 'vuex'
import step1 from './step1.vue'
import step2 from './step2.vue'
import step3 from './step3.vue'
export default {
  name: 'dynamicTest',
  components: {
    // createPolicy,
    step1,
    step2,
    step3
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
    initActiveStep: {
      type: [Number],
      default: 0
    }
  },

  computed: {
    ...mapGetters(['policyName'])
  },
  watch: {
    activeStep: {
      handler (val) {
        this.$emit('handleActiveStepChange', val)
      },
      immediate: true
    }
  },
  data () {
    return {
      activeStep: 0,
      recordId: undefined,
      tempPolicyAndCrowd: {},
      routeSource: undefined,
      peoplePageCheck: false,
      programmeId: undefined,
      reloadFlag: true,
      policyId: undefined,
      // policyName: undefined,
      crowdId: undefined
    }
  },

  methods: {
    handleSaveStep3 () {
      this.$refs.step3.handleSave()
    },
    handleSaveStep1 () {
      this.$refs.step1.handleSave()
    },
    handleBackPrevStep () {
      this.handleCrowdPrevStep(1, this.recordId)
    },
    handleSave () {
      this.$refs.step2.handleSave()
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

    handleCrowdPrevStep (step, recordId) {
      this.activeStep = step - 1
      this.recordId = recordId
    },

    resetFormData () {
      // this.activeStep = 0
      this.recordId = undefined
      // this.peoplePageCheck = false
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

    // this.activeStep = 0
    this.policyId = this.initPolicyId // 策略ID
    this.$store.commit('setPolicyName', this.initPolicyName)
    this.crowdId = this.initCrowdId // 大人群ID
    this.activeStep = this.initActiveStep // 第几步
    console.log('-----dynamicTest created-----')
  }
}
</script>

<style lang="stylus" scoped>
.bottomBtn {
  position: absolute;
  background: #fff;
  z-index: 999;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  // padding: 10px 20px 10px 10px;
  box-sizing: border-box;
  .btn {
    float right
  }
  .btn + .btn {
    margin-right 10px
  }
}
.bottom-wrap {
  width: 80%;
  margin: 0 auto 20px;
  display: flex;
  flex-direction: row-reverse;
  .el-button {
    margin-left 10px
  }
}
</style>
