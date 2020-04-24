<template>
    <el-container>
        <TagGroupList
            v-show="mode === MODE.listTagGroup || mode === MODE.readTagGroup"
            @read-tag-group="handleReadTagGroup"
        />
        <TagGroupRead
            v-show="mode === MODE.listTagGroup || mode === MODE.readTagGroup"
            @read-tag-category="handleReadTagCategory"
            :filterHistory="filterHistory"
            :useFilterHistory="useFilterHistory"
            @change-history-filter="handleChangeHistoryFilterFlag"
        />
        <TagCategoryRead
            v-if="mode === MODE.readTagCategory"
            @read-cancel="handleReadTagCategoryCancel"
        />
    </el-container>
</template>

<script>
import TagGroupList from './List.vue'
import TagGroupRead from './Read.vue'
import TagCategoryList from '../TagCategory/List.vue'
import TagCategoryRead from '../TagCategory/Read.vue'
const MODE = {
   listTagGroup: 'list-tag-group',
   readTagGroup: 'read-tag-group',
   readTagCategory: 'read-tag-category'
}
export default {
    components: {
        TagGroupRead,
        TagGroupList,
        TagCategoryList,
        TagCategoryRead,
    },
    data() {
        return {
            MODE,
            tag: null,
            filterText: '',
            tagGroupId: undefined,
            readTagCategoryBack: null,
            filterHistory: undefined,
            useFilterHistory: false
        }
    },
    props: ['mode'],
    methods:{
        handleReadTagGroup(tagGroup) {
            this.$router.push({
                name: 'tag-group-read',
                params: {
                    id: tagGroup.id
                }
            })
        },
        handleReadTagCategoryCancel() {
            const route = this.readTagCategoryBack || {name: 'tag-group-read'}
            this.$router.push(route)
            this.useFilterHistory = true
        },
        handleReadTagCategory(tag,filter) {
            this.readTagCategoryBack = this.$route.fullPath
            this.filterHistory = filter
            this.$router.push({
                name: 'tag-category-read',
                params: {
                    id: tag.tagId
                }
            })
        },
        handleChangeHistoryFilterFlag(flag) {
            this.useFilterHistory = flag
        }
    }
  };
</script>
