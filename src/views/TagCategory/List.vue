<template>
    <el-container>
        <el-header class="tag-category-read__header">
            标签种类
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable @keyup.enter.native="fetchData" v-model="filter.tagName" placeholder="种类名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button type="primary" @click="handleAddTagCategory"  v-permission="'hoder:label:add'">新建种类</el-button>
                </el-form-item>
            </el-form>
        </el-header>

        <el-main>
            <el-table border :data="tagCategoryList" >
                <el-table-column prop="tagId" label="ID" width="140">
                </el-table-column>
                <el-table-column prop="tagName" label="名称" width="140">
                </el-table-column>
                <el-table-column prop="dataSource" label="数据来源" >
                    <template slot-scope="scope">
                        {{ dataSourceEnum[scope.row.dataSource] }}
                    </template>
                </el-table-column>
                <el-table-column prop="tagType" label="类型" width="140">
                    <template slot-scope="scope">
                        {{ typeEnum[scope.row.tagType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="220">
                    <template slot-scope="scope">
                         <el-button-group>
                        <el-button
                            size="small"
                            type="success"
                            @click="$emit('read-tag-category', scope.row)"
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
    </el-container>
</template>

<script>
import TagCategoryUpsert from '../TagCategory/Upsert.vue'
export default {
    components: {
        TagCategoryUpsert
    },
    data() {
        return {
            tagCategory: null,
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
            }
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
            return {
                groupId: this.tagGroupId,
                ...this.filter,
                ...this.pagination
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
            // this.tagCategory = {
            //     groupId: this.tagGroupId
            // }
            this.$refs.tagCategoryUpsert.showCreateDialog = true
        },
        handleEditTagCategory(row) {
            this.tagCategory = row
            this.$refs.tagCategoryUpsert.showCreateDialog = true
        },
        handleDeleteTagCategory(row) {
            this.$confirm('确认删除？')
            .then(() => {
                this.$service.deleteTagCategory({tagId: row.tagId}, '删除成功').then(this.fetchData)
            })
            .catch(() => {
                //
            })
        },
        fetchData() {
            const filter = this.getFilter()
            this.$service.getTagGroupTreeList(filter).then((data) => {
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
