<template>
    <div>
        <div class="header">
            <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
                <el-step title="第一步：选择策略维度" icon="el-icon-edit"></el-step>
                <el-step title="第二步：创建人群" icon="el-icon-edit"></el-step>
                <el-step title="第三步：投放到业务平台" icon="el-icon-edit"></el-step>
            </el-steps>
        </div>
        <div>
            <new-create-policy
                    @policyNextStep="handlePolicyNextStep"
                    v-if="activeStep === 0"
                    :recordId="recordId"
                    :initTagList="initTagList"
                    @resetFormData="resetFormData"
                    @handleDirectStrategyList="handleDirectStrategyList"
            >
            </new-create-policy>
            <!--<create-policy-->
                    <!--@policyNextStep="handlePolicyNextStep"-->
                    <!--v-if="activeStep === 0"-->
                    <!--:recordId="recordId"-->
                    <!--:initTagList="initTagList"-->
                    <!--@resetFormData="resetFormData"-->
                    <!--@handleDirectStrategyList="handleDirectStrategyList"-->
            <!--&gt;</create-policy>-->
            <create-crowd
                    :recordId="recordId"
                    @crowdNextStep="handleCrowdNextStep"
                    @crowdPrevStep="handleCrowdPrevStep"
                    @resetFormData="resetFormData"
                    @handleDirectStrategyList="handleDirectStrategyList"
                    v-if="activeStep === 1">
            </create-crowd>
            <LaunchToBusiness
                    :recordId="recordId"
                    :tempPolicyAndCrowd="tempPolicyAndCrowd"
                    :routeSource="routeSource"
                    @nextStep="handleNextStep"
                    @launchPrevStep="handleLaunchPrevStep"
                    @resetFormData="resetFormData"
                    @handleDirectStrategyList="handleDirectStrategyList"
                    v-if="activeStep === 2"
            ></LaunchToBusiness>
        </div>
    </div>
</template>

<script>
    import createPolicy from './CreatePolicy'
    import createCrowd from './CreateCrowd'
    import LaunchToBusiness from './LaunchToBusinessPlatform'
    import newCreatePolicy from '../LabelSquare/CreatePolicyWithLabelSquare'
import func from '../../../vue-temp/vue-editor-bridge'
    export default {
        name: "index",
        components: {
            createPolicy,
            createCrowd,
            LaunchToBusiness,
            newCreatePolicy
        },
        data () {
            return {
                activeStep: 0,
                recordId: undefined,
                tempPolicyAndCrowd: {},
                initTagList: [],
                routeSource: undefined
            }
        },
        watch: {
            '$route.params.source' : function (val, oldVal) {
                if(val != oldVal) {
                    this.routeSource = val ? val : undefined
                }
            },
            '$route.params.recordId' : function (val ,oldVal) {
                console.log('我是watch里面的id---',val)
                this.recordId = val
            }
        },
        methods: {
            handleNextStep(step,recordId) {
                this.activeStep = step + 1
                this.recordId = recordId
            },
            handleCrowdNextStep (step,recordId,tempPolicyAndCrowd) {
                this.activeStep = step + 1
                this.recordId = recordId
                this.tempPolicyAndCrowd = tempPolicyAndCrowd
            },
            handleCrowdPrevStep(step,recordId) {
                this.activeStep = step - 1
                this.recordId = recordId
            },
            handleLaunchPrevStep (step) {
                this.activeStep = step - 1
            },
            handlePolicyNextStep (recordId,tagList) {
                this.activeStep = 1
                this.recordId = recordId
                this.initTagList = tagList
            },
            resetFormData () {
                this.activeStep = 0
                this.recordId = undefined
            },
            handleDirectStrategyList () {
                this.$root.$emit('stratege-list-refresh')
                if (this.routeSource) {
                    this.$router.push({ path: 'launch/myPolicy' })
                } else{
                    this.$router.push({ path: 'launch/strategyList' })
                }
            }
        },
        created () {
            if (this.$route.params.source) {this.routeSource = this.$route.params.source
            if (this.$route.params.recordId) {this.recordId = this.$route.params.recordId}}
        }
    }
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
