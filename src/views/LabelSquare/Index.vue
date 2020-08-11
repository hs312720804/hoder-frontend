<template>
    <div class="label-content">
        <el-tabs
                v-model="activeName"
                @tab-click="handldTabChange"
                v-if="checkList.length > 0"
        >
            <el-tab-pane label="标签专区" name="labelZone">
                <label-zone
                        :tagName="labelZoneTagName"
                        @clear-search="handleClearSearch"
                        :checkList="checkList"
                        @change-checkList="handleCheckListChange"
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
        <div class="search-input">
            <el-input
                    v-model="searchVal"
                    placeholder="支持按标签名、Code、描述搜索"
            >
            </el-input>
            <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
        </div>
    </div>
</template>

<script>
    import labelZone from './LabelZone'
    import myCollect from './MyCollect'
    export default {
        name: "Index",
        components: {
            labelZone,
            myCollect
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
                    if (data.behaviorShow) {
                        this.checkList = data.behaviorShow.split(',')
                    } else {
                        this.checkList = ['defineRemark']
                    }
                })
            },
            handleCheckListChange (val) {
                this.$service.saveListDimension({type: 4,behaviorShow: val.join(',')})
            },
            handldTabChange () {
                this.fetchCheckListData()
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
    position absolute
    top 0
    right 10px
    width 20%
    .icon-fixed
        position absolute
        top 8px
        right 10px
.label-content >>> .el-tabs__header
    position fixed
    width 100%
    z-index 999
</style>
