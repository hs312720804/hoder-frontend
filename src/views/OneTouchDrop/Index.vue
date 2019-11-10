<template>
    <div>
        <div class="header">
            <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
                <el-step title="第一步：选择策略维度" ></el-step>
                <el-step title="第二步：设置人群条件" ></el-step>
                <el-step title="第三步：投放到业务平台" ></el-step>
            </el-steps>
        </div>
        <div>
            <create-policy
                    @policyNextStep="handlePolicyNextStep"
                    v-if="activeStep === 1"
                    :recordId="recordId"
                    :initTagList="initTagList"
            ></create-policy>
            <create-crowd
                    :recordId="recordId"
                    @crowdNextStep="handleCrowdNextStep"
                    @crowdPrevStep="handleCrowdPrevStep"
                    v-if="activeStep === 2">
            </create-crowd>
            <LaunchToBusiness
                    :recordId="recordId"
                    :currentPolicy="currentPolicy"
                    @nextStep="handleNextStep"
                    @launchPrevStep="handleLaunchPrevStep"
                    v-if="activeStep === 3"
            ></LaunchToBusiness>
        </div>
    </div>
</template>

<script>
    import createPolicy from './CreatePolicy'
    import createCrowd from './CreateCrowd'
    import LaunchToBusiness from './LaunchToBusinessPlatform'
    export default {
        name: "index",
        components: {
            createPolicy,
            createCrowd,
            LaunchToBusiness
        },
        data () {
            return {
                activeStep: 1,
                recordId: undefined,
                currentPolicy: {},
                initTagList: []
            }
        },
        methods: {
            handleNextStep(step,recordId) {
                this.activeStep = step + 1
                this.recordId = recordId
            },
            handleCrowdNextStep (step,recordId,currentPolicy) {
                this.activeStep = step + 1
                this.recordId = recordId
                this.currentPolicy = currentPolicy
            },
            handleCrowdPrevStep(step,recordId) {
                this.activeStep = step - 1
                this.recordId = recordId
            },
            handleLaunchPrevStep (step) {
                this.activeStep = step - 1
            },
            handlePolicyNextStep (recordId,tagList) {
                this.activeStep = 2
                this.recordId = recordId
                this.initTagList = tagList
            }
        }
    }
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
