<template>
    <el-aside width="230" style="background-color: rgb(238, 241, 246)" v-permission="'hoder:label:group:index'">
        <div class="tag-category-list">
            <el-header class="tag-category-list__header">
                分组
                <el-button class="btn-add-category" v-permission="'hoder:label:group:modify'" type="text" @click="$refs.tagGroupCreate.showCreateDialog = true">新建</el-button>
            </el-header>
            <div class="filter">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                >
                </el-input>
            </div>

            <div class="tag-category-list">
                <ul>
                    <li 
                        v-for="(tagGroup, index) in tagGroupListFiltered" 
                        :key="tagGroup.id"
                        :class="activeId == tagGroup.id ? 'active' : ''"
                        @click="handleReadTagGroup(tagGroup)"
                    > 
                        {{ tagGroup.name }}
                    </li>
                </ul>
            </div>

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
    computed: {
        tagGroupListFiltered() {
            const filterText = this.filterText
            if (!filterText) {
                return this.tagGroupList
            } else {
                return this.tagGroupList.filter(({name}) => name.indexOf(filterText) > -1)
            }
        },
        activeId() {
            return this.$route.params.id 
        }
    },
    methods: {
        fetchData() {
            return this.$service.getTagGroupList().then((data) => {
                this.tagGroupList = data
            })
        },
        handleReadTagGroup(item) {
            this.$emit('read-tag-group', item)
        }
    },
    created() {
        const activeId = this.activeId
        if (activeId) {
            this.fetchData()
        } else {
            this.fetchData().then(() => {
                this.handleReadTagGroup(this.tagGroupList[0])
            })
        }
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

.tag-category-list
    ul 
        padding 0
        list-style none
    li 
        height 35px
        line-height 35px
        color #606266
        font-size 14px
        text-indent 20px
        cursor pointer
        &:hover
            background-color #f5f7fa
    li.active
        background #409eff
        color #fff

</style>
