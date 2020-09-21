<template>
  <div class="my-collect">
      <tag-list
        :data-list="dataList"
        :data-source-enum="dataSourceEnum"
        :type-enum="typeEnum"
        :check-list-parent="checkList"
        @fetch-data="fetchData"
        @change-checkList="handleCheckListChange"
        @table-selected="handleTableSelected"
        :current-selected-tags="currentSelectTag"
        :show-selection="showSelection"
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
        props: {
            tagName: {
                type: String
            },
            checkList: {
                type: Array
            },
            currentSelectTag: {
                type: Array
            },
            showSelection: {
                type: Boolean
            }
        },
        watch: {
            'tagName': function (val) {
                if (val !== undefined) {
                    this.filter.tagName = val
                    this.fetchData()
                }
            }
        },
        data () {
            return {
                dataList: [],
                filter: {
                    pageNum: 1,
                    pageSize: 300,
                    tagName: undefined
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
                    const result = data.data
                    this.dataList = result.pageInfo.list
                    this.dataSourceEnum = result.lableDataSourceEnum
                    this.typeEnum = result.tagsTypeEnum
                })
            },
            handleCheckListChange (val) {
                this.$emit('change-checkList',val)
            },
            handleTableSelected (val, mode) {
                this.$emit('get-table-selected',val,mode)
            }
        },
        created () {
            this.$root.$on('my-collect-list-refresh', this.fetchData)
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
    /*.my-collect*/
        /*margin-top 50px*/
</style>
