<template>
    <div class="crowd-status">
        <div v-if="formData" style="text-align: center">总状态：<span style="color: #55a532">正常({{formData.hit ? '命中': '待命中'}})</span></div>
        <div
                v-if="formData"
                style="display: flex;justify-content: flex-end"
        >
            <search-input
                    :placeHolderText="'请输入ID或名称'"
                    @handle-search="handleSearchStatusData"
                    ref="searchInputWrapperRef"
            ></search-input>
        </div>
        <div class="flex-content">
            <div v-if="formData" class="normal">
                <div class="title">投放状态
                    <span>最近更新时间：{{requestApiTime}}</span>
                    <i class="el-icon-refresh refresh-small" @click="handleGetContent"></i>
                </div>
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
                                                <div>累计:{{child.firstResp.total}} <el-button type="text" @click="handleSeeDetail(child.schemeId,false,item.biId)">详情</el-button></div>
                                            </div>
                                            <div class="step-define" v-if="child.firstHit">
                                                <div class="step-define--number">4</div>
                                                <div class="step-define--title">首条命中</div>
                                                <div>{{child.firstHit.firstTime}}</div>
                                                <div>ID:{{child.firstHit.mac}}  {{child.firstHit.province}} {{child.firstHit.city}}</div>
                                                <div>累计:{{child.firstHit.total}}<el-button type="text" @click="handleSeeDetail(child.schemeId,true,item.biId)">详情</el-button></div>
                                            </div>
                                        <!--</div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 纵列第二块-->
                    <div :class="['first-line-part',(formData.biTrack.length === 1 && formData.biTrack[0].list.length === 1) ? 'one-list-fixed': '']">
                        <el-steps :active="2" align-center>
                            <el-step title="人群创建" :description="formData.createTime"></el-step>
                            <el-step title="同步配置" :description="formData.luaSyncTime" class="step-after"></el-step>
                        </el-steps>
                    </div>
                </div>
                <div class="no-data-tips" v-else>
                    <el-steps :active="2" align-center>
                        <el-step v-if="formData.createTime" title="人群创建" :description="formData.createTime"></el-step>
                        <el-step v-if="formData.luaSyncTime" title="同步配置" :description="formData.luaSyncTime" class="step-after"></el-step>
                    </el-steps>
                </div>
            </div>
            <div class="normal part" v-if="formData">
                <div class="title">设备命中查询</div>
                <div v-if="formData.biTrack.length > 0">
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
                                <hit-search-item :childItem="child" :crowdId="crowdId"></hit-search-item>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no-data-tips" v-else>
                    暂无数据
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="showDetailDialog" :title="detailDialogTitle">
            <div>
                <search-input
                        :placeHolderText="'请输入MAC'"
                        @handle-search="handleDetailSearch"
                        ref="searchInputRef"
                ></search-input>
            </div>
            <el-table
                    :data="tableData"
                    border
                    stripe
                    class="table"
            >
                <el-table-column label="时间" prop="time"></el-table-column>
                <el-table-column label="ID" prop="mac"></el-table-column>
                <el-table-column label="子人群归属" prop="crowdId"></el-table-column>
            </el-table>
            <div class="detail-tips">注：仅显示最新的100条</div>
        </el-dialog>
    </div>
</template>

<script>
    import HitSearchItem from './HitSearchItem'
    import searchInput from '@/components/SearchInput'
    export default {
        components: {
            HitSearchItem,
            searchInput
        },
        data() {
            return {
                formData: undefined,
                showDetailDialog: false,
                detailDialogTitle: '',
                tableData: [],
                apiTableData: [],
                requestApiTime: undefined,
                saveApiTableData: undefined,
                setTimeOutVal: undefined,
                lastRequestId: 0
            }
        },
        props: ['crowdId'],
        methods: {
            formatDate (d) {
                const time = new Date(d)
                let y = time.getFullYear(); // 年份
                let m = (time.getMonth() + 1).toString().padStart(2,'0'); // 月份
                let r = time.getDate().toString().padStart(2,'0'); // 日子
                let h = time.getHours().toString().padStart(2,'0')
                let mins = time.getMinutes().toString().padStart(2,'0')
                let s = time.getSeconds().toString().padStart(2,'0')
                return `${y}-${m}-${r} ${h}:${mins}:${s}`
            },
            handleGetContent() {
                const crowdId = this.crowdId
                const id = this.lastRequestId + 1
                this.lastRequestId = id
                this.$service.getCrowdStatus({crowdId: crowdId}).then((data) => {
                    if (this.lastRequestId !== id) {
                        return
                    }
                    const date = new Date()
                    this.requestApiTime = this.formatDate(date)
                    this.formData = data
                    this.saveApiTableData = data
                    console.log('saveApiTableData', this.saveApiTableData)
                    console.log('我执行了crowdId='+this.crowdId+'的刷新======时间为：'+this.requestApiTime)
                })
            },
            handleSetTimeOut () {
                console.log('我执行了定时器-----')
                this.setTimeOutVal = setInterval(() => {this.handleGetContent()},30000)
            },
            handleClearTimeOut () {
                console.log('=========我清除了定时器-----')
                clearInterval(this.setTimeOutVal)
            },
            handleSearchStatusData (searchVal) {
                this.handleClearTimeOut()
                const saveApiTableData = JSON.parse(JSON.stringify(this.saveApiTableData))
                if (searchVal) {
                //  支持ID或名称搜索
                const WrapperArr = []
                saveApiTableData.biTrack.forEach((item) => {
                    const a = []
                    item.list.forEach(childItem => {
                        if (childItem.resourceName.indexOf(searchVal) >= 0 || childItem.schemeId.indexOf(searchVal) >= 0) {
                            a.push(childItem)
                        }
                    })
                    if (a.length > 0) {
                        WrapperArr.push({biId: item.biId, biName: item.biName, list: a})
                    }
                })
                this.formData.biTrack = WrapperArr
                this.saveApiTableData =  saveApiTableData
                } else {
                    this.formData = saveApiTableData
                }
            },
            handleSeeDetail (schemalId,flag,bId) {
                this.detailDialogTitle = flag ? '命中详情' : '请求详情'
                // flag为true则是命中详情查询,flag为false则是访问详情查询
                var panelId = undefined
                var index = undefined
                if(schemalId.toString().indexOf('-') > 0) {
                    panelId = schemalId.split('-')[0]
                    index = schemalId.split('-')[1]
                } else {
                    panelId = schemalId
                    index = 0
                }
                const apiData = {
                    crowdId: this.crowdId,
                    bId,
                    panelId,
                    hit: flag,
                    index
                }
                this.$service.crowdRequestDetail(apiData).then(data => {
                    this.showDetailDialog = true
                    this.$nextTick(() => {
                        this.$refs.searchInputRef.resetForm()
                    })
                    this.tableData = data
                    this.apiTableData = data
                })
            },
            handleDetailSearch (id) {
                if (id) {
                    const arr = []
                    const apiData = this.apiTableData
                    const length = apiData.length
                    for (var i=0; i<length-1; i++) {
                        if (apiData[i].mac === id) {
                            arr[0] = apiData[i]
                            this.tableData = arr
                            return
                        }
                    }
                    if (arr.length === 0) {
                        this.tableData = []
                    }
                } else {
                    this.tableData = this.apiTableData
                }
            }
        },
        beforeDestroy () {
            this.handleClearTimeOut()
        },
        created () {
            this.handleGetContent()
            this.handleSetTimeOut()
        }
    }
</script>
<style lang="stylus" scoped>
.flex-content
    display flex
    justify-content center
    border-top 1px dashed #ccc
    border-bottom 1px dashed #ccc
    font-size 12px
    .normal
        width 730px
    .part
        width calc(100% - 730px)
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
    /*&:last-child*/
        /*.hit-step:before*/
            /*background #fff*/
.business-name
    display flex
    align-items center
    justify-content center
    width 20px
    border-bottom 1px dashed #ccc
    border-right 1px dashed #ccc
.child-item
    width 90px
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
    width 380px
    height 120px
    border-left 1px dashed #ccc
    border-bottom 1px dashed #ccc
    left 340px
    top 0
    display flex
.search-hit
    position absolute
    left 70%
.step-after:after
    content ''
    position absolute
    height 2px
    width 65px
    background #409EFF
    top 11px
    left 59px
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
.no-data-tips
    text-align center
.table
    height 361px
    overflow auto
.detail-tips
    font-size 12px
    color #ccc
    margin-top 10px
.refresh-small
    margin-left 10px
    font-size 12px
.first-line-part
    width 230px
.one-list-fixed
    position absolute
    top 0
    left 115px
</style>
