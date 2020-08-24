<template>
    <div class="label-zone">
        <div v-if="tagName === undefined || tagName === ''">
            <div
                    v-for="item in treeData"
                    :key="item.parentId"
                    class="tab-content"
            >
                <div class="title">{{item.parentName}}</div>
                <el-tabs
                        v-model="activeTab"
                        @tab-click="handleTabClick"
                >
                    <el-tab-pane
                            v-for="childItem in item.children"
                            :label="childItem.groupName"
                            :key="childItem.groupId"
                            :name="childItem.groupId"
                    >
                        <tag-list
                                v-show="toggleShow"
                                :data-list="dataList"
                                :data-source-enum="dataSourceEnum"
                                :type-enum="typeEnum"
                                :loading="loading"
                                :check-list-parent="checkList"
                                @fetch-data="fetchTagList"
                                @change-checkList="handleCheckListChange"
                        >
                        </tag-list>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div    class="other-form"
                v-else>
            <tag-list
                    :data-list="dataList"
                    :data-source-enum="dataSourceEnum"
                    :type-enum="typeEnum"
                    :loading="loading"
                    :check-list-parent="checkList"
                    @fetch-data="fetchTagAllList"
                    @change-checkList="handleCheckListChange"
            >
            </tag-list>
        </div>
    </div>
</template>

<script>
    import tagList from './TagList'
    export default {
        name: "LabelZone",
        components: {
            tagList
        },
        props: {
            tagName: {
                type: String
            },
            checkList: {
                type: Array
            }
        },
        data () {
            return {
                treeData: [],
                activeTab: undefined,
                dataList: [],
                filter: {
                    pageNum: 1,
                    pageSize: 300,
                    groupId: undefined,
                    tagName: undefined
                },
                dataSourceEnum: {},
                typeEnum: {},
                toggleShow: false,
                loading: true
            }
        },
        watch: {
            'tagName': function (val) {
                if (val !== undefined && val !== '') {
                    this.filter.tagName = val
                    this.fetchTagAllList()
                }else {
                    this.filter.tagName = val
                    this.fetchTagList()
                }
            }
        },
        methods: {
            fetchData() {
                this.$service.getParentIdList().then((data) => {
                    const result = []
                    data.forEach(item => {
                        item.children.forEach(secondChild => {
                            const childList = secondChild.children.map(childItem => {
                                return {groupId: childItem.groupId.toString(), groupName: childItem.groupName}
                            })
                            result.push({ parentName:secondChild.groupName,parentId: secondChild.groupId, children: childList })
                        })
                    })
                    this.treeData = result
                    // this.activeTab = result[0].children[0].groupId
                    // this.filter.groupId = this.activeTab
                    this.fetchTagList()
                })
            },
            fetchTagList () {
                const filter = this.filter
                if (this.filter.groupId) {
                    this.$service.getTagGroupTreeList(filter).then((data) => {
                        this.dataList = data.pageInfo.list
                        this.dataSourceEnum = data.lableDataSourceEnum
                        this.typeEnum = data.tagsTypeEnum
                        this.loading = false
                    })
                }
            },
            fetchTagAllList () {
                const filter = JSON.parse(JSON.stringify(this.filter))
                filter.groupId = 0
                this.$service.getTagGroupTreeList(filter).then((data) => {
                    this.dataList = data.pageInfo.list
                    this.dataSourceEnum = data.lableDataSourceEnum
                    this.typeEnum = data.tagsTypeEnum
                    this.loading = false
                })
            },
            handleTabClick () {
                // 当前tab再次点击收缩表格
                if (this.filter.groupId !== this.activeTab) {
                    this.toggleShow = true
                    this.filter.groupId = this.activeTab
                    this.loading = true
                } else {
                    this.toggleShow = !this.toggleShow
                    return
                }
                // 切换tab清空搜索框的值
                this.filter.tagName = undefined
                // this.dataList = []
                this.$emit('clear-search')
                this.$emit('fetch-checkList')
                this.fetchTagList()
            },
            handleCheckListChange (val) {
                this.$emit('change-checkList',val)
            }
        },
        created () {
            this.$root.$on('label-zone-list-refresh', this.fetchData)
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.tab-content
    padding 12px
    border 1px dashed #ccc
    margin-bottom 5px
    position relative
    z-index 1
    &:first-child
        margin-top 50px
.label-zone >>> .el-icon-cc-star-fill
    color #E6A13C
.label-zone >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
.title
    font-weight bold
.popover-button
    float right
    margin-bottom 20px
.label-zone >>> .el-tabs__nav-wrap::after
    background none
.label-zone .tab-content >>> .el-tabs__header
   position relative
.label-zone >>> .el-tabs__nav
    white-space normal
.label-zone >>> .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
.label-zone >>> .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.label-zone >>> .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.label-zone >>> .el-tabs--top .el-tabs__item.is-top:nth-child(2)
    padding 0 20px
.other-form
    margin-top 50px
.label-zone >>> .el-tabs__active-bar
    display none
.label-zone .tab-content >>> .el-tabs__nav-wrap
    background none
    z-index -9999
</style>
