<template>
    <el-card shadow="never">
        <div slot="header">
            <span>标签列表</span>
            <el-form :inline="true" style="float: right">
                <el-form-item>
                    <el-input clearable @keyup.enter.native="fetchData" v-model="filter.name" placeholder="标签名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button
                            type="primary"
                            @click="handleAddTag"
                            v-if="tagCategory.dataSource !== 2"
                            v-permission="'hoder:label:attr:add'"
                    >
                        新建标签
                    </el-button>
                    <el-button
                            type="primary"
                            @click="handleAddBatchTag"
                            v-if="tagCategory.dataSource !== 2"
                            v-permission="'hoder:label:attr:add'"
                    >
                        批量上传
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table border :data="itemList">
            <el-table-column prop="attrId" label="ID" width="140">
            </el-table-column>
            <el-table-column prop="attrName" label="名称">
            </el-table-column>
            <el-table-column prop="attrValue" label="值">
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="220"
                             v-if="tagCategory.dataSource !== 2"
            >
                <template slot-scope="scope">
                    <el-button-group>
                    <el-button
                        size="small"
                        type="success"
                        @click="handleEditTag(scope.row)"
                        v-permission="'hoder:label:attr:modify'"
                    >
                        编辑
                    </el-button>
                    <el-button
                        size="small"
                        type="info"
                         v-permission="'hoder:label:attr:del'"
                        @click="handleDeleteTag(scope.row)"
                    >
                        删除
                    </el-button>
                    </el-button-group>
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
        <TagUpsert ref="tagUpsert" @upsert-end="fetchData" :current-tag="tag" />
        <BatchUpload ref="BatchUpload" @upsert-end="fetchData" :current-tag="tag" />
    </el-card>

</template>
<script>
import TagUpsert from './Upsert.vue'
import BatchUpload from './batchUpload.vue'
export default {
    components: {
        TagUpsert,
        BatchUpload
    },
    data() {
        return {
            itemList: [],
            tag: {},
            pagination: {

            },
            filter: {
                name: undefined,
            }
        }
    },
    props: ['tagCategory'],
    methods: {
        getFilter() {
            return {
                tagCategoryId: this.tagCategory.tagId,
                ...this.filter,
                ...this.pagination
            }
        },
        fetchData() {
            const filter = this.getFilter()
            this.$service.getTagList(filter).then(({itemList, pagination}) => {
                this.itemList = itemList
                this.pagination = pagination
            })
        },
        handleAddTag() {
            this.tag = {
                tagId: this.tagCategory.tagId,
            }
            this.tag.tagType = this.tagCategory.tagType
            this.$refs.tagUpsert.showCreateDialog = true
        },
        handleAddBatchTag () {
            this.tag = {
                tagId: this.tagCategory.tagId,
            }
            this.tag.tagType = this.tagCategory.tagType
            this.$refs.BatchUpload.showBatchDialog = true
        },
        handleEditTag(row) {
            this.tag = JSON.parse(JSON.stringify(row))
            this.tag.tagType = this.tagCategory.tagType
            this.$refs.tagUpsert.showCreateDialog = true
        },
        handleDeleteTag(row) {
            this.$confirm('确定删除？')
            .then(() => {
                this.$service.deleteTag(row, '删除成功').then(() => {
                    this.fetchData()
                })
            })
            .catch(() => {
                //
            })
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
<style lang="stylus" scoped>
.pagination
    float right
    margin 10px 0
</style>
