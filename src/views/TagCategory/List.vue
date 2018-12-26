<template>
    <el-container>
        <el-header class="tag-category-read__header">
            标签种类
            <el-form :inline="true">
                <el-form-item>
                    <el-input clearable @keyup.enter.native="fetchData" v-model="filter.name" placeholder="种类名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button type="primary" @click="handleAddTagCategory">新建种类</el-button>
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
                        <el-button
                            size="small"
                            type="text"
                            @click="$emit('read-tag-category', scope.row)"
                        >
                            查看
                        </el-button>
                        <el-button
                            size="small"
                            type="text"
                            @click="handleEditTagCategory(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            size="small"
                            type="text"
                            @click="handleDeleteTagCategory(scope.row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="pagination"
                :current-page.sync="pagination.currentPage"
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
                name: undefined
            },
            pagination: {
                currentPage: undefined,
                pageSize: undefined,
                total: undefined
            }
        }
    },
    props: ['tagGroup'],
    watch: {
        tagGroup: 'fetchData'
    },
    methods: {
        getFilter() {
            return {
                groupId: this.tagGroup.id,
                ...this.filter,
                ...this.pagination
            }
        },
        handleAddTagCategory() {
            this.tagCategory = {
                groupId: this.tagGroup.id
            }
            this.$refs.tagCategoryUpsert.showCreateDialog = true
        },
        handleEditTagCategory(row) {
            this.tagCategory = row
            this.$refs.tagCategoryUpsert.showCreateDialog = true
        },
        handleDeleteTagCategory(row) {
            this.$confirm('确认删除？')
            .then(() => {
                this.$service.deleteTagCategory({tagId: row.tagId}, '删除成功')
                this.fetchData()
            })
            .catch(() => {
                //
            })
        },
        fetchData() {
            const filter = this.getFilter()
            this.$service.getTagCategoryList(filter).then(({itemList, pagination, dataSourceEnum, typeEnum}) => {
                this.tagCategoryList = itemList
                this.dataSourceEnum = dataSourceEnum
                this.typeEnum = typeEnum
                this.pagination = pagination
            })
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
