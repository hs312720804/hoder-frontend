<template>
    <div class="crowd-status">
        <div class="flex-content">
            <div v-if="formData" class="normal">
                <div class="title">投放状态 <span>最近更新时间：{{formData.luaSyncTime}}</span></div>
                <div
                        v-if="formData.biTrack.length > 0"
                        class="track-content"
                >
                    <!-- 纵列第一块-->
                    <div>
                        <div
                                v-for="(item,index) in formData.biTrack"
                                :key="index"
                                class="track-item"
                        >
                            <div class="business-name">{{item.biName}}</div>
                            <div v-if="item.list">
                                <div
                                        v-for="(child,childIndex) in item.list"
                                        :key="'child_'+childIndex"
                                        class="child-wrapper"
                                >
                                    <div class="child-item">
                                        <div>{{child.bizType}}</div>
                                        <div>{{child.schemeId}}</div>
                                        <div>{{child.resourceName}}</div>
                                    </div>
                                    <div class="hit-step">
                                        <!--<div>-->
                                            <div class="step-define" v-if="child.firstResp">
                                                <div class="step-define--number">3</div>
                                                <div class="step-define--title">首条请求</div>
                                                <div>{{child.firstResp.firstTime}}</div>
                                                <div>ID:{{child.firstResp.mac}}  {{child.firstResp.province}} {{child.firstResp.city}}</div>
                                                <div>累计:123444 <el-button type="text">详情</el-button></div>
                                            </div>
                                            <div class="step-define" v-if="child.firstHit">
                                                <div class="step-define--number">4</div>
                                                <div class="step-define--title">首条命中</div>
                                                <div>{{child.firstHit.firstTime}}</div>
                                                <div>ID:{{child.firstHit.mac}}  {{child.firstHit.province}} {{child.firstHit.city}}</div>
                                                <div>累计:123444 <el-button type="text">详情</el-button></div>
                                            </div>
                                        <!--</div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 纵列第二块-->
                    <div>
                        <el-steps :active="2" align-center>
                            <el-step title="人群创建" :description="formData.createTime"></el-step>
                            <el-step title="同步配置" :description="formData.luaSyncTime" class="step-after"></el-step>
                        </el-steps>
                    </div>
                </div>
                <div v-else>暂无数据</div>
            </div>
            <div class="normal part" v-if="formData">
                <div class="title">设备命中查询</div>
                <div
                        v-for="(item,index) in formData.biTrack"
                        :key="index"
                        class="hit-search-item"
                >
                    <div v-if="item.list">
                        <div
                                v-for="(child,childIndex) in item.list"
                                :key="'hit_search_child_'+childIndex"
                                class="hit-search-child-wrapper"
                        >
                            <hit-search-item :childItem="child"></hit-search-item>
                        </div>
                    </div>
                    <div v-else>
                        暂无数据
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HitSearchItem from './HitSearchItem'
    export default {
        components: {
            HitSearchItem
        },
        data() {
            return {
                formData: undefined
            }
        },
        props: ['crowdId'],
        methods: {
            handleGetContent() {
                const crowdId = this.crowdId
                this.$service.getCrowdStatus({crowdId: crowdId}).then((data) => {
                    console.log('data====', data)
                    this.formData = data
                })
            }
        },
        created () {
            this.handleGetContent()
        }
    }
</script>
<style lang="stylus" scoped>
.flex-content
    display flex
    justify-content center
    border-top 1px dashed #ccc
    border-bottom 1px dashed #ccc
    font-size 14px
    .normal
        width 770px
    .part
        width calc(100% - 770px)
        border-left 1px dashed #ccc
.title
    font-size 18px
    text-align center
    padding 5px 0
    border-bottom 1px dashed #ccc
    span
        font-size 12px
.track-item
    display flex
    &:last-child
        .hit-step:before
            background #fff
.business-name
    display flex
    align-items center
    justify-content center
    width 20px
    border-bottom 1px dashed #ccc
    border-right 1px dashed #ccc
.child-item
    width 100px
    height 120px
    border-bottom 1px dashed #ccc
    border-right 1px dashed #ccc
    text-align center
    padding-top 20px
.track-content
    display flex
    align-items center
    position relative
.child-wrapper
    position relative
.hit-step
    position absolute
    width 400px
    height 120px
    border-left 1px dashed #ccc
    border-bottom 1px dashed #ccc
    left 350px
    top 0
    display flex
.search-hit
    position absolute
    left 70%
.step-after:after
    content ''
    position absolute
    height 2px
    width 53px
    background #409EFF
    top 11px
    left 70px
.line-before:before
    content ''
    position absolute
    height 2px
    width 76px
    background #409EFF
    top 11px
    left -13px
.hit-step:before
    content ''
    position absolute
    height 120px
    width 2px
    background #409EFF
    top -107px
    left -13px
.step-flex
    flex-basis 0
    width 50%
.step-define
    width 50%
    box-sizing content-box
    .step-define--number
        position relative
        width 24px
        height 24px
        text-align center
        line-height 21px
        border 2px solid
        border-radius 50%
        margin auto
        color #409EFF
        &:before
            content ''
            position absolute
            height 2px
            width 103px
            background #409EFF
            top 9px
            left -103px
        &:after
            content ''
            position absolute
            height 2px
            width 75px
            background #409EFF
            top 9px
            left 22px
    &:last-child
        .step-define--number
            color #1ac71c
    .step-define--title
        text-align center
.track-item:first-child .child-wrapper:first-child .hit-step
    &:before
        background transparent
.hit-search-child-wrapper
    height 120px
    border-bottom 1px dashed #ccc
    width 100%
    overflow-x auto
    font-size 12px
</style>
