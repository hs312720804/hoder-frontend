<template>
    <div>
        <el-tabs v-model="tabsValue" type="card">
            <el-tab-pane name="pull" label="人群分割投放（pull：针对主页产品包、广告、活动、弹窗、媒资）">
                <!--<div class="tips">备注：pull模式（针对主页产品包、广告、活动、弹窗、媒资）</div>-->
                <pull-list></pull-list>
            </el-tab-pane>
            <el-tab-pane name="push" label="人群圈定投放（push：用于消息、微信圈定人群）">
                <!--<div class="tips">备注：push模式（用于消息、微信圈定人群）</div>-->
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

<style lang="stylus" scoped>
/*.tips*/
    /*padding-bottom 10px*/
</style>
