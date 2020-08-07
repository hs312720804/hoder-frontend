<template>
    <div class="label-zone">
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
                            v-if="activeTab == childItem.groupId"
                            :data-list="dataList"
                            :data-source-enum="dataSourceEnum"
                            :type-enum="typeEnum"
                            @fetch-data="fetchTagList"
                    >
                    </tag-list>
                </el-tab-pane>
            </el-tabs>
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
        data () {
            return {
                treeData: [],
                activeTab: undefined,
                dataList: [],
                filter: {
                    pageNum: 1,
                    pageSize: 300,
                    groupId: undefined
                },
                dataSourceEnum: {},
                typeEnum: {}
            }
        },
        methods: {
            fetchData() {
                this.$service.getParentIdList().then((data) => {
                    console.log('我是标签广场里的data', data)
                    const result = []
                    data.forEach(item => {
                        item.children.forEach(secondChild => {
                            const childList = secondChild.children.map(childItem => {
                                return {groupId: childItem.groupId.toString(), groupName: childItem.groupName}
                            })
                            result.push({ parentName:secondChild.groupName,parentId: secondChild.groupId, children: childList })
                        })
                    })
                    console.log(result)
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
                    })
                }
            },
            handleTabClick () {
                this.filter.groupId = this.activeTab
                this.fetchTagList()
            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.tab-content
    padding 15px
    border 1px dashed #ccc
    margin-bottom 10px
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
</style>
