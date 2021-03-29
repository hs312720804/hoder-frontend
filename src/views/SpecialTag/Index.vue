<template>
    <div>
        <div class="header">
            <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
                <el-step title="第一步：挑选基础标签" icon="el-icon-edit"></el-step>
                <el-step title="第二步：编辑特色标签" icon="el-icon-edit"></el-step>
                <!-- <el-step title="第三步：投放到业务平台" icon="el-icon-edit"></el-step> -->
            </el-steps>
        </div>
        <div>
                    <!-- :recordId="recordId" -->
            <new-create-policy
                    @policyNextStep="handlePolicyNextStep"
                    v-if="activeStep === 0"
                    :initTagList="initTagList"
                    :usedTagList="usedTagList"
                    @resetFormData="resetFormData"
                    @handleDirectStrategyList="handleDirectStrategyList"
            >
            </new-create-policy>
     
                    <!-- :recordId="recordId" -->
            <create-crowd
                    :initTagList="initTagList"
                    @crowdNextStep="handleCrowdNextStep"
                    @crowdPrevStep="handleCrowdPrevStep"
                    @resetFormData="resetFormData"
                    @handleDirectStrategyList="handleDirectStrategyList"
                    v-if="activeStep === 1">
            </create-crowd>
        
        </div>
    </div>
</template>

<script>
    import createCrowd from './CreateCrowd'
    import newCreatePolicy from './AddOrEditSpecialTag'
    export default {
        name: "index",
        components: {
            // createPolicy,
            createCrowd,
            // LaunchToBusiness,
            newCreatePolicy
        },
        provide () {
            return {
                sTagIndex: this
            }
        },
        data () {
            return {
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
            '$route.query.specialTagId' : function (val, oldVal) {
                if(val != oldVal && !!val) {
                    this.getSpecialTagDetail()
                }
            }
            
        },
        methods: {
            handleNextStep(step, recordId) {
                this.activeStep = step + 1
                // this.recordId = recordId
            },
            handleCrowdNextStep (step,recordId,tempPolicyAndCrowd) {
                this.activeStep = step + 1
                // this.recordId = recordId
                this.tempPolicyAndCrowd = tempPolicyAndCrowd
            },
            handleCrowdPrevStep(step,recordId) {
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
                    this.$router.push({ path: 'launch/strategyList' })
                }
            },
            getSpecialTagDetail () {
                console.log('123=======', this.$route.query.specialTagId)
                this.$service.specialTagDetail({ specialTagId: this.$route.query.specialTagId }).then((data) => {
                    // debugger
                    this.specialTagDetail = data
                    this.initTagList = this.specialTagDetail.tags || []
                    if (this.specialTagDetail.useTags.length > 0) {
                        this.usedTagList = this.specialTagDetail.useTags.map(item => {
                            return Number(item.tagId)
                        })
                    }
                 
                    console.log('this.specialTagDetail===', JSON.stringify(this.specialTagDetail))
                })
            }
        },
        created () {
            // if (this.$route.params.source) {this.routeSource = this.$route.params.source}
             if (this.$route.query.specialTagId) {
                this.getSpecialTagDetail()
            }
        },
        destroyed() {
            // debugger
        }
    }
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
