<template>
    <div class="label-zone">
        <div
                v-for="item in treeData"
                :key="item.parentId"
                class="tab-content"
        >
            <div :class="item.children.length === 0 ? 'title-with-no-child': 'title'">{{item.parentName}}</div>
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
                    <el-popover
                            placement="top"
                            trigger="click"
                            class="popover-button"
                    >
                        <div>
                            <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                                <el-checkbox label="tagKey">标签code</el-checkbox>
                                <el-checkbox label="tagValues">示例值</el-checkbox>
                                <el-checkbox label="defineRemark">标签定义</el-checkbox>
                                <el-checkbox label="tagType">类型</el-checkbox>
                                <el-checkbox label="remark">备注</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <el-button slot="reference">选择列表展示维度</el-button>
                    </el-popover>
                    <el-table border :data="dataList" >
                        <el-table-column prop="tagId" label="ID">
                        </el-table-column>
                        <el-table-column prop="tagName" label="名称">
                        </el-table-column>
                        <el-table-column prop="dataSource" label="数据来源" >
                            <template slot-scope="scope">
                                {{ dataSourceEnum[scope.row.dataSource] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="(checkList.indexOf('defineRemark') > -1)"
                                prop="defineRemark"
                                label="标签定义"
                        >
                        </el-table-column>
                        <el-table-column
                                v-if="(checkList.indexOf('tagValues') > -1)"
                                prop="tagValues"
                                label="示例值"
                        >
                        </el-table-column>
                        <el-table-column
                                v-if="(checkList.indexOf('tagKey') > -1)"
                                prop="tagKey"
                                label="标签code"
                        >
                        </el-table-column>
                        <el-table-column
                                v-if="(checkList.indexOf('tagType') > -1)"
                                prop="tagType"
                                label="类型"
                        >
                            <template slot-scope="scope">
                                {{ typeEnum[scope.row.tagType] }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="(checkList.indexOf('remark') > -1)"
                                prop="remark"
                                label="备注"
                        >
                        </el-table-column>
                        <el-table-column prop="operation" label="操作">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button
                                            type="text"
                                            @click="handleSeeTagCategoryDetail(scope.row)"
                                    >
                                        查看
                                    </el-button>
                                    <!--<el-button-->
                                            <!--type="text"-->
                                            <!--v-permission="'hoder:label:modify'"-->
                                            <!--@click="handleEditTagCategory(scope.row)"-->
                                    <!--&gt;-->
                                        <!--编辑-->
                                    <!--</el-button>-->
                                    <!--<el-button-->
                                            <!--type="text"-->
                                            <!--v-permission="'hoder:label:del'"-->
                                            <!--@click="handleDeleteTagCategory(scope.row)"-->
                                    <!--&gt;-->
                                        <!--删除-->
                                    <!--</el-button>-->
                                    <!--<el-button-->
                                            <!--type="text"-->
                                            <!--@click="handleCopyToTag(scope.row)"-->
                                    <!--&gt;-->
                                        <!--复制-->
                                    <!--</el-button>-->
                                    <div :class="scope.row.myCollect ? 'el-icon-cc-star-fill': 'el-icon-cc-star'" @click="handleCollect(scope.row)"></div>
                                    <!--<div v-else class="el-icon-cc-star"></div>-->
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LabelZone",
        data () {
            return {
                treeData: [],
                activeTab: undefined,
                dataList: [],
                filter: {
                    pageNum: 1,
                    pageSize: 1000,
                    groupId: undefined
                },
                statusList: {
                    '1': '启用',
                    '2': '禁用'
                },
                dataSourceEnum: {},
                typeEnum: {},
                checkList: ['defineRemark'],
            }
        },
        methods: {
            fetchData() {
                this.fetchCheckListData()
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
                    this.activeTab = result[0].children[0].groupId
                    this.filter.groupId = this.activeTab
                    this.fetchTagList()
                })
            },
            fetchTagList () {
                const filter = this.filter
                this.$service.getTagGroupTreeList(filter).then((data) => {
                    this.dataList = data.pageInfo.list
                    this.dataSourceEnum = data.lableDataSourceEnum
                    this.typeEnum = data.tagsTypeEnum
                })
            },
            fetchCheckListData () {
                this.$service.getListDimension({type: 4}).then(data => {
                    if (data.behaviorShow) {
                        this.checkList = data.behaviorShow.split(',')
                    }
                })
            },
            handleCheckListChange (val) {
                this.$service.saveListDimension({type: 4,behaviorShow: val.join(',')})
            },
            handleTabClick () {
                this.filter.groupId = this.activeTab
                this.fetchTagList()
            },
            handleCollect (currentTag) {
                const flag = currentTag.myCollect
                const tagId = currentTag.tagId
                if (flag) {
                    //    取消收藏
                    this.$service.cancelCollectTags({tagId},'已取消收藏！').then(() => {
                        this.fetchData()
                    })
                } else {
                    //    收藏
                    this.$service.collectTags({tagId},'已成功收藏！').then(() => {
                        this.fetchData()
                    })
                }
            },
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.tab-content
    padding 20px
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
    margin 10px
    font-weight bold
    float left
.title-with-no-child
    margin 0
    font-weight bold
    float left
.popover-button
    float right
    margin-bottom 20px
</style>
