<template>
    <div class="launch-tab-list">
        <el-tabs v-model="tabsValue" type="card">
            <el-tab-pane name="pull" label="人群分割投放（pull：针对主页产品包、广告、活动、弹窗、媒资）">
                <pull-list
                        :parentSource="source"
                        :showAllParent="showAll">
                </pull-list>
            </el-tab-pane>
            <el-tab-pane name="push" label="人群圈定投放（push：用于消息、微信圈定人群）">
                <push-list
                        :parentSource="source"
                        :showAllParent = "showAll"
                >
                </push-list>
            </el-tab-pane>
        </el-tabs>
        <div class="el-radio-header">
            <el-radio-group v-model="showAll">
                <el-radio :label="false">全部</el-radio>
                <el-radio :label="true">我的投放</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
    import pullList from './strategy/List'
    import pushList from './multiVersionCrowd/Index'
    export default {
        name: "launchTabListAA",
        components: {
            pullList,
            pushList
        },
        data () {
            return {
                tabsValue: 'pull',
                showAll: false
            }
        },
        props: ["source"]
    }
</script>

<style lang="stylus" scoped>
.launch-tab-list
    position relative
.el-radio-header
    position absolute
    top 0
    right 20px
</style>
