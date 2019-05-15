<template>
    <TagCategoryList v-if="$route.params.id || $route.params.id == 0" @read-tag-category="$emit('read-tag-category', $event)" />
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
