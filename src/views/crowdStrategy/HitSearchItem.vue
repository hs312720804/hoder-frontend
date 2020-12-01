<template>
    <div class="hit-search-content">
        <div class="hit-search-header">
            <div style="width: 160px">
                MAC地址
                <el-input
                        v-model="searchForm.mac"
                        class="small-input"
                        size="small"
                >
                </el-input>
            </div>
            <div style="width: 118px">
                ID
                <el-input
                        v-model="searchForm.openId"
                        class="small-input"
                        size="small"
                >
                </el-input>
            </div>
            <div>
                <el-button
                        type="primary"
                        size="mini"
                        @click="handleSearch"
                >查询</el-button>
            </div>
        </div>
        <div
                v-if="showResult"
                class="hit-search-result"
                ref="hitSearchResult"
        >
            <div class="result-content">
                <div style="margin: auto">
                    <div>
                        <span>相关标签</span><span>更新日期{{formatYesterdayDate()}}</span>
                    </div>
                    <el-input type="textarea" class="text-area" v-model="hitResult"></el-input>
                </div>
                <div class="hit-step" v-if="showStep">
                    <div class="step-define">
                        <div class="step-define--number">1</div>
                        <div class="step-define--title">是否请求</div>
                        <!--<div>请求次数：<el-button type="text" @click="handleRequestDetail()">详情</el-button></div>-->
                        <div>请求<el-button type="text" @click="handleRequestDetail()">详情</el-button></div>
                        <div>最近请求时间：{{lastReqTime}}</div>
                    </div>
                    <div class="step-define">
                        <div class="step-define--number">2</div>
                        <div class="step-define--title">是否命中</div>
                        <!--<div>命中次数：<el-button type="text" @click="handleHitDetail()">详情</el-button></div>-->
                        <div>命中<el-button type="text" @click="handleHitDetail()">详情</el-button></div>
                        <div>最近命中时间：{{lastHitTime}}</div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="showDetailDialog" :title="detailDialogTitle">
            <el-table
                    :data="tableData"
                    border
                    stripe
                    class="table"
            >
                <el-table-column label="时间" prop="time"></el-table-column>
                <el-table-column label="mac" prop="mac"></el-table-column>
                <el-table-column label="子人群归属" prop="crowdId"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "HitSearchItem",
        props: ['childItem','crowdId'],
        data () {
            return {
                searchForm: {
                    mac: undefined,
                    openId: undefined
                },
                showResult: false,
                hitResult: undefined,
                showDetailDialog: false,
                detailDialogTitle: '',
                tableData: [],
                lastReqTime: '暂无数据',
                lastHitTime: '暂无数据',
                showStep: true
            }
        },
        methods: {
            handleSearch () {
                const searchApi = JSON.parse(JSON.stringify(this.searchForm))
                this.$service.searchHitCrowd({crowdId: this.crowdId, params: searchApi}).then(data => {
                    this.showResult = true
                    this.hitResult = JSON.stringify(data)
                })
                // 获取时间和总数
                const schemeId = this.childItem.schemeId.toString()
                const panelId = schemeId.indexOf('-') > 0 ? schemeId.split('-')[0] : schemeId
                const index = schemeId.indexOf('-') > 0 ? schemeId.split('-')[1] : 0
                const macApiData = {
                    crowdId: this.crowdId,
                    panelId,
                    index,
                    bId: 2,
                    hit: false
                }
                if (this.searchForm.mac) {
                    this.$service.macLogSearch({mac: this.searchForm.mac, params: macApiData}).then(data => {
                        if (Object.keys(data).length > 0) {
                            this.lastReqTime = data.VisitedTime
                            this.lastHitTime = data.HitTime
                        } else {
                            this.$nextTick(() => {
                                this.$refs.hitSearchResult.style.width = '300px'
                            })
                            this.showStep = false
                        }

                    })
                }
            },
            handleRequestDetail () {
                const schemeId = this.childItem.schemeId.toString()
                const panelId = schemeId.indexOf('-') > 0 ? schemeId.split('-')[0] : schemeId
                const index = schemeId.indexOf('-') > 0 ? schemeId.split('-')[1] : 0
                const reqLogApi = {
                    mac: this.searchForm.mac,
                    crowdId: this.crowdId,
                    panelId,
                    index
                }
                this.$service.macRequestDetail(reqLogApi).then(data => {
                    this.showDetailDialog = true
                    this.detailDialogTitle = '请求详情'
                    this.tableData = data
                })
            },
            handleHitDetail () {
                const schemeId = this.childItem.schemeId.toString()
                const panelId = schemeId.indexOf('-') > 0 ? schemeId.split('-')[0] : schemeId
                const index = schemeId.indexOf('-') > 0 ? schemeId.split('-')[1] : 0
                const hitLogApi = {
                    mac: this.searchForm.mac,
                    crowdId: this.crowdId,
                    panelId,
                    index
                }
                this.$service.macHitDetail(hitLogApi).then(data => {
                    this.showDetailDialog = true
                    this.detailDialogTitle = '命中详情'
                    this.tableData = data
                })
            },
            formatYesterdayDate () {
                const yesterday = new Date().getTime() - 1*24*60*60*1000
                const time = new Date(yesterday)
                let y = time.getFullYear() // 年份
                let m = (time.getMonth() + 1).toString().padStart(2,'0') // 月份
                let r = time.getDate().toString().padStart(2,'0') // 日子
                return `${y}-${m}-${r}`
            }
        }
    }
</script>

<style lang="stylus" scoped>
.hit-search-content
    font-size 10px
.hit-search-header
    display flex
    width 330px
    margin auto
.small-input
    display inline-block
    width 100px
.hit-search-result
    width 500px
    margin auto
.hit-step
    display flex
    width 380px
.result-content
    display flex
.step-define
    width 50%
    box-sizing content-box
    text-align center
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
            width 98px
            background #409EFF
            top 9px
            left -98px
        &:after
            content ''
            position absolute
            height 2px
            width 70px
            background #409EFF
            top 9px
            left 22px
    &:first-child
        .step-define--number
            &:before
                background none
    &:last-child
        .step-define--number
            color #1ac71c
    .step-define--title
        text-align center
.text-area
    width 220px
</style>
