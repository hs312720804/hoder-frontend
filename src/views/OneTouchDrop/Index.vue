<template>
    <div v-if="reloadFlag">
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
                    @handleDirectStrategyList="handleDirectStrategyList">
                <template v-slot:isChoosePeople>
                    <el-checkbox
                        style="margin-left: 20px"
                        v-model="peoplePageCheck">
                        智能分人群模式
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
            <create-crowd
                :recordId="recordId"
                @crowdNextStep="handleCrowdNextStep"
                @crowdPrevStep="handleCrowdPrevStep"
                @resetFormData="resetFormData"
                @handleDirectStrategyList="handleDirectStrategyList"
                v-if="!!recordId && !peoplePageCheck && activeStep === 1">
            </create-crowd>
            <!--人群流程图-->
            <create-config-scheme
                v-if="peoplePageCheck && activeStep === 1"
                :recordId="recordId"
                @crowdPrevStep="handleCrowdPrevStep"
                @handleToNextStep="handleCrowdNextStep"
                @resetFormData="resetFormData"
                @handleDirectStrategyList="handleDirectStrategyList">
            </create-config-scheme>
            <launch-to-business
                    :recordId="recordId"
                    :tempPolicyAndCrowd="tempPolicyAndCrowd"
                    :routeSource="routeSource"
                    @nextStep="handleNextStep"
                    @launchPrevStep="handleLaunchPrevStep"
                    @resetFormData="resetFormData"
                    @handleDirectStrategyList="handleDirectStrategyList"
                    v-if="activeStep === 2"
            ></launch-to-business>
        </div>
    </div>
</template>

<script>
    import createPolicy from './CreatePolicy'
    import createCrowd from './CreateCrowd'
    import LaunchToBusiness from './LaunchToBusinessPlatform'
    import newCreatePolicy from '../LabelSquare/CreatePolicyWithLabelSquare'
    import createConfigScheme from './createConfigScheme'
    export default {
        name: "index",
        components: {
            createPolicy,
            createCrowd,
            LaunchToBusiness,
            newCreatePolicy,
            createConfigScheme
        },
        data () {
            return {
                activeStep: 0,
                recordId: undefined,
                tempPolicyAndCrowd: {},
                initTagList: [],
                routeSource: undefined,
                peoplePageCheck: false,
                programmeId: undefined,
                reloadFlag: true
            }
        },
        watch: {
            $route: {
                handler() {
                   console.log('this.$route.params.refresh==>', this.$route.params.refresh)
                    if (this.$route.params.refresh) {
                        // 刷新页面
                        this.initTagList = []
                        this.reloadFlag = false
                        this.$nextTick(() => {
                            this.reloadFlag = true
                        })
                    }
                },
                deep: true,
            },
            '$route.params.source' : function (val, oldVal) {
                if(val != oldVal) {
                    this.routeSource = val ? val : undefined
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if (from.name === 'strategyList') {
                    vm.activeStep = 0;
                    next();
                }
                next();
            })
        },
        methods: {
            handleNextStep(step,recordId) {
                this.activeStep = step + 1
                this.recordId = recordId
            },
            handleCrowdNextStep (step,recordId, tempPolicyAndCrowd) {
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
                this.$store.commit('setPolicyId', undefined)
                this.peoplePageCheck = false
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
            if (this.$route.params.source) {this.routeSource = this.$route.params.source}
            this.$store.commit('setEditSchemeConfig', false)
        }
    }
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
