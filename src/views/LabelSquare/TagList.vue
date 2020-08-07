<template>
    <div class="tag-list">
        <el-table
                v-show="!tagId"
                border
                :data="dataList"
                @selection-change="handleSelectionChange"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
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
                <template
                        slot="header"
                        slot-scope="{ column, $index }"
                >
                    操作
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
                        <i
                                class="el-icon-cc-setting operate"
                                slot="reference"
                        >
                        </i>
                    </el-popover>
                </template>
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                                type="text"
                                @click="handleSeeTagCategoryDetail(scope.row)"
                        >
                            查看
                        </el-button>
                        <div
                                :class="scope.row.myCollect ? 'el-icon-cc-star-fill': 'el-icon-cc-star'"
                                @click="handleCollect(scope.row)"
                        >
                        </div>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <tag-detail-list
                v-if="tagId"
                :tag-id="tagId"
                @read-cancel="handleReadTagCancel"
        >
        </tag-detail-list>
    </div>
</template>

<script>
    import tagDetailList from './TagDetail'
    export default {
        name: "TagList",
        props: {
            dataList: {
                type: Array
            },
            dataSourceEnum: {
                type: Object
            },
            typeEnum: {
                type: Object
            }
        },
        components: {
            tagDetailList
        },
        data () {
            return {
                multipleSelection: [],
                checkList: [],
                tagId: undefined
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val
                console.log(this.multipleSelection)
            },
            handleCheckListChange (val) {
                this.$service.saveListDimension({type: 4,behaviorShow: val.join(',')})
            },
            fetchCheckListData () {
                console.log('我执行了一次------')
                this.$service.getListDimension({type: 4}).then(data => {
                    if (data.behaviorShow) {
                        this.checkList = data.behaviorShow.split(',')
                    } else {
                        this.checkList = ['defineRemark']
                    }
                })
            },
            handleSeeTagCategoryDetail (row) {
                this.tagId = row.tagId
            },
            handleReadTagCancel () {
                this.tagId = undefined
            },
            handleCollect (currentTag) {
                const flag = currentTag.myCollect
                const tagId = currentTag.tagId
                if (flag) {
                    //    取消收藏
                    this.$service.cancelCollectTags({tagId},'已取消收藏！').then(() => {
                        this.$emit('fetch-data')
                    })
                } else {
                    //    收藏
                    this.$service.collectTags({tagId},'已成功收藏！').then(() => {
                        this.$emit('fetch-data')
                    })
                }
            }
        },
        created () {
            this.fetchCheckListData()
        }
    }
</script>

<style lang="stylus" scoped>
    .tag-list >>> .el-icon-cc-star-fill
        color #E6A13C
    .tag-list >>> .el-button-group
        display flex
        align-items center
        .el-button
            margin 0 5px
    .operate
        margin-left 20px
        cursor pointer
</style>
