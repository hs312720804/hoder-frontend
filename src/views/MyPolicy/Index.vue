<template>
    <div>
        <el-tabs v-model="tabsValue" type="card">
            <el-tab-pane name="crowd" label="我的人群">
                <policy-list></policy-list>
            </el-tab-pane>
            <el-tab-pane name="launch" label="我的投放">
                <launch-list></launch-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import policyList from '../crowdStrategy/index'
import launchList from '../launch/LaunchTabList'
    export default {
        name: "Index",
        components: {
            policyList,
            launchList
        },
        data () {
            return {
                tabsValue: 'crowd'
            }
        }
    }
</script>

<style scoped>

</style>
