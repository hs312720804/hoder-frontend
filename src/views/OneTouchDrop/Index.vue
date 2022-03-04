<template>
    <div v-if="reloadFlag">
        <div class="header">
          <!-- 动态人群 -->
          <el-steps v-if="isDynamicPeople" :active="activeStep" finish-status="success" simple style="margin-top: 20px">
              <el-step title="第一步：选择策略维度" icon="el-icon-edit"></el-step>
              <el-step title="第二步：圈出人群" icon="el-icon-edit"></el-step>
              <el-step title="第三步：动态人群配置" icon="el-icon-edit"></el-step>
              <el-step title="第四步：设置流转条件" icon="el-icon-edit"></el-step>
              <el-step title="第五步：投放到业务平台" icon="el-icon-edit"></el-step>
          </el-steps>

          <!-- 普通人群 -->
          <el-steps v-else :active="activeStep" finish-status="success" simple style="margin-top: 20px">
              <el-step title="第一步：选择策略维度" icon="el-icon-edit"></el-step>
              <el-step title="第二步：创建人群" icon="el-icon-edit"></el-step>
              <el-step title="第三步：投放到业务平台" icon="el-icon-edit"></el-step>
          </el-steps>

        </div>
        <div>
          <div v-if="isDynamicPeople">

            <new-create-policy
              v-if="activeStep === 0"
              @policyNextStep="handlePolicyNextStep"
              :recordId="recordId"
              :initTagList="initTagList"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList">
              <template v-slot:isChoosePeople>
                  <!-- <el-checkbox
                      style="margin-left: 20px"
                      v-model="peoplePageCheck">
                      智能分人群模式
                  </el-checkbox> -->
                  <el-checkbox
                      style="margin-left: 20px"
                      v-model="isDynamicPeople">
                      动态人群
                  </el-checkbox>
              </template>
            </new-create-policy>
recordId::{{recordId}}
            <create-crowd
                v-if="!!recordId && !peoplePageCheck && activeStep === 1"
                :recordId="recordId"
                :isDynamicPeople="isDynamicPeople"
                @crowdNextStep="handleCrowdNextStep"
                @crowdPrevStep="handleCrowdPrevStep"
                @resetFormData="resetFormData"
                @handleDirectStrategyList="handleDirectStrategyList"
            >
            </create-crowd>

            <!-- 动态人群设置 -->
            <dynamic-people-setting
              v-if="activeStep === 2"
              :recordId="recordId"
              @crowdNextStep="handleCrowdNextStep"
              @crowdPrevStep="handleCrowdPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
            >
            </dynamic-people-setting>

            <!-- 设置流转条件 -->
            <dynamic-people-conditions
              v-if="activeStep === 3"
              :recordId="recordId"
              @crowdNextStep="handleCrowdNextStep"
              @crowdPrevStep="handleCrowdPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
            >
            </dynamic-people-conditions>

            <launch-to-business
              v-if="activeStep === 4"
              :recordId="recordId"
              :tempPolicyAndCrowd="tempPolicyAndCrowd"
              :routeSource="routeSource"
              @nextStep="handleNextStep"
              @launchPrevStep="handleLaunchPrevStep"
              @resetFormData="resetFormData"
              @handleDirectStrategyList="handleDirectStrategyList"
            ></launch-to-business>
          </div>

          <div v-else>

              <new-create-policy
                  v-if="activeStep === 0"
                  @policyNextStep="handlePolicyNextStep"
                  :recordId="recordId"
                  :initTagList="initTagList"
                  @resetFormData="resetFormData"
                  @handleDirectStrategyList="handleDirectStrategyList">
                  <template v-slot:isChoosePeople>
                      <!-- <el-checkbox
                          style="margin-left: 20px"
                          v-model="peoplePageCheck">
                          智能分人群模式
                      </el-checkbox> -->
                      <el-checkbox
                          style="margin-left: 20px"
                          v-model="isDynamicPeople">
                          动态人群
                      </el-checkbox>
                  </template>
              </new-create-policy>
              <!--<create-policy-->
                      <!--@policyNextStep="handlePolicyNextStep"-->
                      <!--v-if="activeStep === 0"-->
                      <!--:recordId="recordId"-->
                      <!--:initTagList="initTagList"-->
                      <!--@resetFormData="resetFormData"-->
                      <!--@handleDirectStrategyList="handleDirectStrategyList"-->
              <!--&gt;</create-policy>-->

              {{ recordId }}
              <create-crowd
                  v-if="!!recordId && !peoplePageCheck && activeStep === 1"
                  :recordId="recordId"
                  :isDynamicPeople="isDynamicPeople"
                  @crowdNextStep="handleCrowdNextStep"
                  @crowdPrevStep="handleCrowdPrevStep"
                  @resetFormData="resetFormData"
                  @handleDirectStrategyList="handleDirectStrategyList"
              >
              </create-crowd>

              <!--人群流程图-->
              <!-- <create-config-scheme
                  v-if="peoplePageCheck && activeStep === 1"
                  :recordId="recordId"
                  @crowdPrevStep="handleCrowdPrevStep"
                  @handleToNextStep="handleCrowdNextStep"
                  @resetFormData="resetFormData"
                  @handleDirectStrategyList="handleDirectStrategyList">
              </create-config-scheme> -->

              <launch-to-business
                  v-if="activeStep === 2"
                  :recordId="recordId"
                  :tempPolicyAndCrowd="tempPolicyAndCrowd"
                  :routeSource="routeSource"
                  @nextStep="handleNextStep"
                  @launchPrevStep="handleLaunchPrevStep"
                  @resetFormData="resetFormData"
                  @handleDirectStrategyList="handleDirectStrategyList"
              ></launch-to-business>
          </div>

        </div>
    </div>
</template>

<script>
import createPolicy from './CreatePolicy'
import createCrowd from './CreateCrowd'
import LaunchToBusiness from './LaunchToBusinessPlatform'
import newCreatePolicy from '../LabelSquare/CreatePolicyWithLabelSquare'
import createConfigScheme from './createConfigScheme'
import DynamicPeopleSetting from '@/components/dynamicPeople/DynamicPeopleSetting'
import DynamicPeopleConditions from '@/components/dynamicPeople/DynamicPeopleConditions'
export default {
  name: 'index',
  components: {
    createPolicy,
    createCrowd,
    LaunchToBusiness,
    newCreatePolicy,
    createConfigScheme,
    DynamicPeopleSetting,
    DynamicPeopleConditions
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
      reloadFlag: true
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
      this.activeStep = step + 1
      this.recordId = recordId
    },
    handleCrowdNextStep (step, recordId, tempPolicyAndCrowd) {
      this.activeStep = step + 1
      this.recordId = recordId
      this.tempPolicyAndCrowd = tempPolicyAndCrowd
    },
    handleCrowdPrevStep (step, recordId) {
      this.activeStep = step - 1
      this.recordId = recordId
    },
    handleLaunchPrevStep (step) {
      this.activeStep = step - 1
    },
    handlePolicyNextStep (recordId, tagList) {
      this.activeStep = 1
      this.recordId = recordId
      this.initTagList = tagList
    },
    resetFormData () {
      this.activeStep = 0
      this.recordId = undefined
      this.$store.commit('setPolicyId', undefined)
      this.peoplePageCheck = false
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
  }
}
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
