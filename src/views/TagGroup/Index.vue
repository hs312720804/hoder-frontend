<template>
    <el-container>
        <TagGroupList 
            v-show="mode === MODE.listTagGroup || mode === MODE.readTagGroup" 
            @read-tag-group="handleReadTagGroup" 
        />                
        <TagGroupRead
            v-show="mode === MODE.listTagGroup || mode === MODE.readTagGroup"
            @read-tag-category="handleReadTagCategory"
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
            readTagCategoryBack: null
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
            const route = this.readTagCategoryBack || {name: 'tag'}
            this.$router.push(route)
        },
        handleReadTagCategory(tag) {
            this.readTagCategoryBack = this.$route.fullPath
            this.$router.push({
                name: 'tag-category-read',
                params: {
                    id: tag.tagId
                }
            })
        }
    }
  };
</script>