<template>
    <div class="label-content">
        <el-tabs
                v-model="activeName"
                @tab-click="handleTabChange"
        >
            <el-tab-pane label="临时人群" name="tempLabel">
                <temp-label-index
                        :show-selection="showSelection"
                        :currentSelectTag="tagList"
                        :checkList="tempCheckList"
                        @get-table-selected="handleGetTableSelectedData"
                        @change-checkList="handleTempCheckListChange"
                        @fetch-checkList="fetchTempCheckListData"
                >
                </temp-label-index>
            </el-tab-pane>
            <el-tab-pane label="标签专区" name="labelZone">
                <label-zone
                        :tagName="labelZoneTagName"
                        @clear-search="handleClearSearch"
                        :checkList="checkList"
                        @change-checkList="handleCheckListChange"
                        @fetch-checkList="fetchCheckListData"
                        @get-table-selected="handleGetTableSelectedData"
                        :show-selection="showSelection"
                        :currentSelectTag="tagList"
                >
                </label-zone>
            </el-tab-pane>
            <el-tab-pane label="我的收藏" name="myCollect">
                <my-collect
                        :tagName="myCollectTagName"
                        :checkList="checkList"
                        @clear-search="handleClearSearch"
                        @change-checkList="handleCheckListChange"
                        @get-table-selected="handleGetTableSelectedData"
                        :show-selection="showSelection"
                        :currentSelectTag="tagList"
                >
                </my-collect>
            </el-tab-pane>
            <el-tab-pane label="特色标签" name="specialTag">
                <special-tag
                        :tagName="myCollectTagName"
                        :checkList="checkList"
                        @clear-search="handleClearSearch"
                        @change-checkList="handleCheckListChange"
                        @get-table-selected="handleGetTableSelectedData"
                        :show-selection="showSelection"
                        :currentSelectTag="tagList"
                >
                </special-tag>
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
        <div v-if="showSelection">
            <div>已选标签：</div>
            <el-tag v-for="(item,index) in tagList"
                    :key="item.tagId+'_'+index"
                    :type="dataSourceColorEnum[item.dataSource]"
                    closable
                    @close="removeTag(item)"
            >
                {{item.tagName}}
            </el-tag>
        </div>
    </div>
</template>

<script>
    import labelZone from './LabelZone'
    import myCollect from './MyCollect'
    import tempLabelIndex from './TempLabelIndex'
    import specialTag from './SpecialTag'
    
    export default {
        name: "labelSquareAA",
        components: {
            labelZone,
            myCollect,
            tempLabelIndex,
            specialTag
        },
        data () {
            return {
                activeName: 'labelZone',
                searchVal: '',
                labelZoneTagName: undefined,
                myCollectTagName: undefined,
                checkList: [],
                tagList: [],
                dataSourceColorEnum: {
                    1: 'success',
                    2: 'danger',
                    3: '',
                    5: 'warning'
                },
                showSelection: false,
                tempCheckList: []
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
            handleTabChange () {
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
                        this.fetchTempCheckListData()
                        this.$root.$emit('temp-label-list-refresh')
                        break
                    case 'specialTag':
                        //    刷新特色标签
                        this.fetchCheckListData()
                        this.$root.$emit('special-tag-list-refresh')
                        break
                }
            },
            handleGetTableSelectedData (val,mode) {
                // 只支持单数组，多数组要多次调用这个
                const tagList = this.tagList
                if(mode === 'add') {
                    // 如果有匹配的，就直接return
                    let firstIndex = -1
                    for (var i=0; i < tagList.length;i++) {
                        if (tagList[i].tagId === val.tagId) {
                            firstIndex = i
                            return
                        }
                    }
                    // 如果没有匹配的，就执行新增
                    if (firstIndex === -1) {
                        this.tagList.push(val)
                    }
                } else {
                    // 取消选中的则删除这一项
                    let index = -1
                    for (var i=0; i < tagList.length;i++) {
                        if (tagList[i].tagId === val.tagId) {
                            index = i
                            this.tagList.splice(index,1)
                            return
                        }
                    }
                }
            },
            removeTag(tag) {
                // const addForm = this.addForm
                // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
                this.tagList.splice(this.tagList.indexOf(tag),1)
            },
            fetchTempCheckListData () {
                this.$service.getListDimension({type: 5}).then(data => {
                    if (data) {
                        if (data.behaviorShow) {
                            this.tempCheckList = data.behaviorShow.split(',')
                        } else {
                            this.tempCheckList = ['defineRemark']
                        }
                    } else {
                        this.tempCheckList = ['defineRemark']
                    }
                })
            },
            handleTempCheckListChange (val) {
                this.$service.saveListDimension({type: 5,behaviorShow: val.join(',')})
            }
        },
        created () {
            this.fetchCheckListData()
            this.fetchTempCheckListData()
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
        transform rotate(-90deg)
.label-content >>> .el-tabs__header
    position fixed
    width 100%
    z-index 999
.label-content >>> .el-tabs__nav-wrap
    background #fff
    z-index 999
</style>
