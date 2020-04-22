<template>
    <el-container>
        <el-header class="tag-category-read__header">
            <el-popover
                    placement="top"
                    trigger="click"
                    class="popover-button"
            >
                <div>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="tagKey">标签code</el-checkbox>
                        <el-checkbox label="tagValues">示例值</el-checkbox>
                        <el-checkbox label="defineRemark">标签定义</el-checkbox>
                        <el-checkbox label="tagType">类型</el-checkbox>
                        <el-checkbox label="remark">备注</el-checkbox>
                    </el-checkbox-group>
                </div>
                <el-button slot="reference">选择列表展示维度</el-button>
            </el-popover>
            <el-form :inline="true">
                <el-form-item>
                    <el-input style="width: 250px" clearable @keyup.enter.native="fetchData" v-model="filter.tagName" placeholder="请输入标签种类名称或者标签code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button type="primary" @click="handleAddTagCategory"  v-permission="'hoder:label:add'">新建种类</el-button>
                </el-form-item>
            </el-form>
        </el-header>

        <el-main>
            <el-table border :data="tagCategoryList" >
                <el-table-column prop="tagId" label="ID" width="100">
                </el-table-column>
                <el-table-column prop="tagName" label="名称" width="140">
                </el-table-column>
                <el-table-column prop="dataSource" label="数据来源" >
                    <template slot-scope="scope">
                        {{ dataSourceEnum[scope.row.dataSource] }}
                    </template>
                </el-table-column>
                <el-table-column v-if="(checkList.indexOf('defineRemark') > -1)" prop="defineRemark" label="标签定义">
                </el-table-column>
                <el-table-column v-if="(checkList.indexOf('tagValues') > -1)" prop="tagValues" label="示例值">
                </el-table-column>
                <el-table-column v-if="(checkList.indexOf('tagKey') > -1)" prop="tagKey" label="标签code">
                </el-table-column>
                <el-table-column v-if="(checkList.indexOf('tagType') > -1)" prop="tagType" label="类型" width="140">
                    <template slot-scope="scope">
                        {{ typeEnum[scope.row.tagType] }}
                    </template>
                </el-table-column>
                <el-table-column v-if="(checkList.indexOf('remark') > -1)" prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="260">
                    <template slot-scope="scope">
                         <el-button-group>
                        <el-button
                            size="small"
                            type="success"
                            @click="handleSeeTagCategoryDetail(scope.row)"
                        >
                            查看
                        </el-button>
                        <el-button
                            size="small"
                            type="primary"
                            v-permission="'hoder:label:modify'"
                            @click="handleEditTagCategory(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            size="small"
                            type="info"
                             v-permission="'hoder:label:del'"
                            @click="handleDeleteTagCategory(scope.row)"
                        >
                            删除
                        </el-button>
                        <el-button
                                size="small"
                                type="success"
                                @click="handleCopyToTag(scope.row)"
                        >
                            复制
                        </el-button>
                         </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                :current-page.sync="pagination.pageNum"
                :page-size.sync="pagination.pageSize"
                :total="pagination.total"
                @size-change="fetchData"
                @current-change="fetchData"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </el-main>
        <TagCategoryUpsert
            ref="tagCategoryUpsert"
            :current-tag-category="tagCategory"
            :type-enum="typeEnum"
            :data-source-enum="dataSourceEnum"
            @upsert-end="fetchData"
        />
        <choose-tag-group
                ref="chooseTagGroup"
                @saveCopyTag="handleSaveCopyForm"
        ></choose-tag-group>
    </el-container>
</template>

<script>
import { cloneDeep } from 'lodash'
import TagCategoryUpsert from '../TagCategory/Upsert.vue'
import ChooseTagGroup from '@/components/ChooseTagGroup.vue'
export default {
    components: {
        TagCategoryUpsert,
        ChooseTagGroup
    },
    props:['filterHistoryToList','useFilterHistory'],
    data() {
        return {
            tagCategory: {},
            tagCategoryList: [],
            dataSourceEnum: {},
            typeEnum: {},
            filter: {
                tagName: undefined
            },
            pagination: {
                pageNum: undefined,
                pageSize: undefined,
                total: undefined
            },
            filterAll : undefined,
            checkList: ['defineRemark'],
            currentTagId: undefined
        }
    },
    computed: {
        tagGroupId() {
            return +this.$route.params.id
        }
    },
    watch: {
        '$route.params.id': 'handleTagGroupIdChange'
    },
    methods: {
        getFilter() {
            const filterHistoryToList = this.filterHistoryToList
            if(filterHistoryToList && this.useFilterHistory){
                this.$emit('change-history-filter', false)
                this.filter.tagName = filterHistoryToList.tagName
                return {
                    groupId: this.tagGroupId,
                    pageNum: filterHistoryToList.pageNum,
                    pageSize: filterHistoryToList.pageSize,
                    ...this.filter
                }
            } else {
                return {
                    groupId: this.tagGroupId,
                    pageNum: this.pagination.pageNum,
                    pageSize: this.pagination.pageSize,
                    ...this.filter
                }
            }
        },
        resetFilter() {
            this.filter = {
                tagName: undefined
            }
        },
        handleTagGroupIdChange() {
            this.resetFilter()
            this.fetchData()
        },
        handleAddTagCategory() {
            this.tagCategory = {}
            this.$refs.tagCategoryUpsert.showCreateDialog = true
        },
        handleSeeTagCategoryDetail (row) {
            this.$emit('read-tag-category', row, this.filterAll)
        },
        handleEditTagCategory(row) {
            this.tagCategory = cloneDeep(row)
            this.$nextTick(()=> {
                this.$refs.tagCategoryUpsert.showCreateDialog = true
            })
        },
        handleDeleteTagCategory(row) {
            this.$confirm('确认删除？')
            .then(() => {
                this.$service.deleteTagCategory({tagId: row.tagId,groupId: row.groupId}, '删除成功').then(this.fetchData)
            })
            .catch(() => {
                //
            })
        },
        handleCopyToTag (row) {
            this.$refs.chooseTagGroup.showCreateDialog = true
            this.currentTagId = row.tagId
        },
        handleSaveCopyForm (pid) {
            this.$service.copyLabelSingle({tagGroupId: pid,tagIds: this.currentTagId},'复制成功')
            .then(() => {
                this.$refs.chooseTagGroup.showCreateDialog = false
                this.fetchData()
            })
        },
        fetchData() {
            this.filterAll = this.getFilter()
            this.$service.getTagGroupTreeList(this.filterAll).then((data) => {
                this.tagCategoryList = data.pageInfo.list
                this.dataSourceEnum = data.lableDataSourceEnum
                this.typeEnum = data.tagsTypeEnum
                this.pagination.total = data.pageInfo.total
                this.pagination.pageNum = data.pageInfo.pageNum
                this.pagination.pageSize = data.pageInfo.pageSize
            })
            // this.$service.getTagCategoryList(filter).then(({itemList, pagination, dataSourceEnum, typeEnum}) => {
            //     this.tagCategoryList = itemList
            //     this.dataSourceEnum = dataSourceEnum
            //     this.typeEnum = typeEnum
            //     this.pagination = pagination
            // })
        },
    },
    created() {
        this.fetchData()
    }
}
</script>
<style lang="stylus" scoped>
.pagination
    float right
    margin-top 10px
.tag-category-read__header
    line-height 60px
.tag-category-read__header >>> .el-form
    margin-top 15px
    float right
</style>
