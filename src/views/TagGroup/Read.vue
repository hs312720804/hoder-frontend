<template>
    <el-container>
        <el-header class="tag-category-read__header">
            标签种类
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="filter.name" placeholder="种类名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                    <el-button type="primary" @click="$refs.tagCreate.showCreateDialog = true">新建种类</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        
        <el-main>
            <el-table border :data="tagList" >
                <el-table-column prop="tagId" label="ID" width="140">
                </el-table-column>
                <el-table-column prop="tagName" label="名称" width="140">
                </el-table-column>
                <el-table-column prop="lableDataSourceEnum" label="数据来源" >
                </el-table-column>
                <el-table-column prop="tagsType" label="类型" width="140">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="120">
                    <template scope="operation">
                        <el-button
                            size="small"
                            type="primary"
                            @click="$emit('read-tag', operation.row)"
                        >
                        查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <TagCreate ref="tagCreate" @create-end="fetchData" />
    </el-container>
</template>

<script>
import TagCreate from '../Tag/Create.vue'
export default {
    components: {
        TagCreate
    },
    data() {
        return {
            showCreateComponent: false,
            tagList: [],
            filter: {
                name: undefined
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
                categoryId: this.tagGroup.id,
                ...this.filter
            }
        },
        fetchData() {
            const filter = this.filter
            this.$service.getTagGroup(filter).then((data) => {
                this.tagList = data
            })
        },
    },
    created() {
        this.fetchData()
    } 
}
</script>
<style lang="stylus" scoped>
.tag-category-read__header
    line-height 60px
.tag-category-read__header >>> .el-form
    margin-top 15px
    float right
</style>
