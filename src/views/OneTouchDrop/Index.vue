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
            <create-policy @nextStep="handleNextStep" v-show="activeStep === 1"></create-policy>
            <create-crowd v-show="activeStep === 2"></create-crowd>
            <LaunchToBusiness v-show="activeStep === 3"></LaunchToBusiness>
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
                activeStep: 1
            }
        },
        methods: {
            handleNextStep(step) {
                this.activeStep = step
            }
        }
    }
</script>

<style lang="stylus" scoped>
.header
    margin-bottom 20px
</style>
