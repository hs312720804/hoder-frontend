<template>
    <el-container>
        <TagGroupList 
            v-show="mode === MODE.listTagGroup" 
            @list-category="handleListCategory" 
        />                
        <TagCategoryList
            v-if="tagGroup" 
            v-show="mode === MODE.listTagGroup"  
            :tag-group="tagGroup" 
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
import TagCategoryList from '../TagCategory/List.vue'
import TagCategoryRead from '../TagCategory/Read.vue'
const MODE = {
   listTagGroup: 'list-tag-group',
   readTagCategory: 'read-tag-category'
}
export default {
    components: {
        TagGroupList,
        TagCategoryList,
        TagCategoryRead,
    },
    data() {
        return {
            MODE,
            tag: null,
            filterText: '',
            tagGroup: null
        }
    },
    props: ['mode'],
    methods:{
        handleListCategory(tagGroup) {
            this.tagGroup = tagGroup
        },
        handleReadTagCategoryCancel() {
            this.$router.push({
                name: 'tag'
            })
        },
        handleReadTagCategory(tag) {
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