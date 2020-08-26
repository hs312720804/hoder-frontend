<template>
    <div class="label-content">
        <el-tabs
                v-model="activeName"
                @tab-click="handldTabChange"
        >
            <el-tab-pane label="临时标签" name="tempLabel">
                <temp-label></temp-label>
            </el-tab-pane>
            <el-tab-pane label="标签专区" name="labelZone">
                <label-zone
                        :tagName="labelZoneTagName"
                        @clear-search="handleClearSearch"
                        :checkList="checkList"
                        @change-checkList="handleCheckListChange"
                        @fetch-checkList="fetchCheckListData"
                >
                </label-zone>
            </el-tab-pane>
            <el-tab-pane label="我的收藏" name="myCollect">
                <my-collect
                        :tagName="myCollectTagName"
                        :checkList="checkList"
                        @clear-search="handleClearSearch"
                        @change-checkList="handleCheckListChange"
                >
                </my-collect>
            </el-tab-pane>
        </el-tabs>
        <div class="search-input" v-if="activeName === 'labelZone' || activeName === 'myCollect'">
            <el-input
                    v-model="searchVal"
                    placeholder="支持按标签名、Code、描述搜索"
                    @keyup.enter.native="handleSearch"
            >
            </el-input>
            <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
        </div>
    </div>
</template>

<script>
    import labelZone from './LabelZone'
    import myCollect from './MyCollect'
    import tempLabel from './TempLabel'
    export default {
        name: "labelSquareAA",
        components: {
            labelZone,
            myCollect,
            tempLabel
        },
        data () {
            return {
                activeName: 'labelZone',
                searchVal: '',
                labelZoneTagName: undefined,
                myCollectTagName: undefined,
                checkList: []
            }
        },
        methods: {
            handleSearch () {
                // 全局搜索
                if(this.activeName === 'labelZone') {
                    this.labelZoneTagName = this.searchVal
                } else {
                    this.myCollectTagName = this.searchVal
                }
            },
            handleClearSearch () {
                this.searchVal = undefined
                this.labelZoneTagName = undefined
                this.myCollectTagName = undefined
            },
            fetchCheckListData () {
                this.$service.getListDimension({type: 4}).then(data => {
                    if (data) {
                        if (data.behaviorShow) {
                            this.checkList = data.behaviorShow.split(',')
                        } else {
                            this.checkList = ['defineRemark']
                        }
                    } else {
                        this.checkList = ['defineRemark']
                    }
                })
            },
            handleCheckListChange (val) {
                this.$service.saveListDimension({type: 4,behaviorShow: val.join(',')})
            },
            handldTabChange () {
                switch (this.activeName) {
                    case 'labelZone':
                        //    刷新标签广场页
                        this.fetchCheckListData()
                        this.$root.$emit('label-zone-list-refresh')
                        break
                    case 'myCollect':
                        //    刷新我的收藏
                        this.fetchCheckListData()
                        this.$root.$emit('my-collect-list-refresh')
                        break
                    case 'tempLabel':
                        this.$root.$emit('temp-label-list-refresh')
                        break
                }
            }
        },
        created () {
            this.fetchCheckListData()
        }
    }
</script>

<style lang="stylus" scoped>
.label-content
    position relative
.search-input
    position fixed
    top 118px
    right 35px
    width 20%
    z-index 999
    .icon-fixed
        position absolute
        top 8px
        right 10px
.label-content >>> .el-tabs__header
    position fixed
    width 100%
    z-index 999
.label-content >>> .el-tabs__nav-wrap
    background #fff
    z-index 999
</style>
