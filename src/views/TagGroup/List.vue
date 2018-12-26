<template>
    <el-aside width="230" style="background-color: rgb(238, 241, 246)">
        <div class="tag-category-list">
            <el-header class="tag-category-list__header">
                分组
                <el-button class="btn-add-category" type="text" @click="$refs.tagGroupCreate.showCreateDialog = true">新建</el-button>
            </el-header>
            <div class="filter">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                >
                </el-input>
            </div>

            <el-tree 
                ref="tag-category-list"
                :data="tagGroupList" 
                :props="{label: 'name'}"
                default-expand-all 
                :filter-node-method="handleFilterTagGroupList" 
                @node-click="handleReadTagGroup"
                >
            </el-tree>

            <TagGroupCreate ref="tagGroupCreate" @create-end="fetchData" />
        </div>
    </el-aside>
</template>
<script>
import TagGroupCreate from './Create.vue'
export default {
    components: {
        TagGroupCreate
    },
    data() {
        return {
            filterText: undefined,
            tagGroupList: [],
        }
    },
    watch: {
        filterText(val) {
            this.$refs['tag-category-list'].filter(val)
        }
    },
    methods: {
        fetchData() {
            this.$service.getTagGroupList().then((data) => {
                this.tagGroupList = data
            })
        },
        handleFilterTagGroupList(value, data) {
            if (value) {
                return data.name.indexOf(value) !== -1;
            }
            return true
        },
        handleReadTagGroup(item) {
            this.$emit('list-category', item)
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
<style lang="stylus" scoped>
.tag-category-list__header
    line-height 60px
.btn-add-category
    float right
    margin-top 15px
.filter
    padding 10px 15px
.tag-category-list >>> .el-tree
    background none
.tag-category-list >>> .el-tree-node__content
    height 35px
.tag-category-list >>> .el-tree-node__label
    list-style none
    line-height 35px
.tag-category-list >>> li span
    text-decoration none
    cursor pointer
    color #333
</style>
