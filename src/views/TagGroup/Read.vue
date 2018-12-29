<template>
    <TagCategoryList v-if="$route.params.id" @read-tag-category="$emit('read-tag-category', $event)" />
</template>

<script>
import TagCategoryList from '../TagCategory/List.vue'
export default {
    components: {
        TagCategoryList
    },
    data() {
        return {
        }
    },
    methods: {
    },
    created() {
    } 
}
</script>
<style lang="stylus" scoped>
</style>
