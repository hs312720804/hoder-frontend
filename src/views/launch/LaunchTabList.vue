<template>
    <div>
        <el-tabs v-model="tabsValue" type="card">
            <el-tab-pane name="pull" label="人群分割投放（pull）">
                <pull-list></pull-list>
            </el-tab-pane>
            <el-tab-pane name="push" label="人群圈定投放（push）">
                <push-list></push-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import pullList from './strategy/List'
    import pushList from './multiVersionCrowd/Index'
    export default {
        name: "LaunchTabList",
        components: {
            pullList,
            pushList
        },
        data () {
            return {
                tabsValue: 'pull'
            }
        }
    }
</script>

<style scoped>

</style>
