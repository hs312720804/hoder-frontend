<template>
    <TagCategoryList v-if="$route.params.id || $route.params.id == 0" :filterHistoryToList="filterHistory" :useFilterHistory="useFilterHistory"  @change-history-filter="handleChangeHistoryFilterFlag" @read-tag-category="handleIndexReadTagCategory" />
</template>

<script>
import TagCategoryList from '../TagCategory/List.vue'
export default {
  components: {
    TagCategoryList
  },
  props: ['filterHistory', 'useFilterHistory'],
  data () {
    return {
    }
  },
  methods: {
    handleIndexReadTagCategory (tag, filter) {
      this.$emit('read-tag-category', tag, filter)
    },
    handleChangeHistoryFilterFlag (flag) {
      this.$emit('change-history-filter', flag)
    }
  },
  created () {
  }
}
</script>
<style lang="stylus" scoped>
</style>
