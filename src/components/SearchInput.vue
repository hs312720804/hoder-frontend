<template>
    <div class="search-input">
        <el-input
                v-model="searchValue"
                class="input-width"
                :placeholder="placeHolderText"
                :clearable='true'
                @keyup.enter.native="handleSearch"
        ></el-input>
        <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
    </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: ['placeHolderText'],
  data () {
    return {
      searchValue: undefined
    }
  },
  methods: {
    handleSearch () {
      this.$emit('handle-search', this.searchValue)
    },
    resetForm () {
      this.searchValue = undefined
    }
  }
}
</script>

<style lang="stylus" scoped>
    .search-input
        position relative
        margin 0 5px 15px
        width 350px
    .input-width
        width 100%
    .icon-fixed
        position absolute
        top 8px
        right 28px
        transform rotate(-90deg)
</style>
