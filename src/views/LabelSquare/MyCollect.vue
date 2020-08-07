<template>
  <div class="my-collect">
      <tag-list
        :data-list="dataList"
        :data-source-enum="dataSourceEnum"
        :type-enum="typeEnum"
        @fetch-data="fetchData"
      >
      </tag-list>
  </div>
</template>

<script>
    import tagList from './TagList'
    export default {
        name: "MyCollect",
        components: {
            tagList
        },
        data () {
            return {
                dataList: [],
                filter: {
                    pageNum: 1,
                    pageSize: 300
                },
                dataSourceEnum: {},
                typeEnum: {},
                multipleSelection: []
            }
        },
        methods: {
            fetchData () {
                const filter = this.filter
                this.$service.collectTagsList(filter).then(data => {
                    console.log(data)
                    const result = data.data
                    this.dataList = result.pageInfo.list
                    this.dataSourceEnum = result.lableDataSourceEnum
                    this.typeEnum = result.tagsTypeEnum
                })
            },

        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
    .my-collect >>> .el-icon-cc-star-fill
        color #E6A13C
    .my-collect >>> .el-button-group
        display flex
        align-items center
        .el-button
            margin 0 5px
</style>
