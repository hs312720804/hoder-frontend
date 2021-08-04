<template>
  <div class="my-collect">
      <div class="header">
            <div v-if="!showSelection">
                <el-button
                    @click="handleAdd"
                    type="primary"
                >
                    新建
                </el-button>
            </div>
            <div class="search-input">
                <el-input
                        placeholder="支持按人群名、ID搜索"
                        class="header-input"
                        v-model="launchName"
                        @keyup.enter.native="fetchData"
                ></el-input>
                <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
            </div>
        </div>
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

      <el-dialog
        title="新建种类"
        :visible.sync="dialogVisible"
        width="500px">
            <el-form label-position="left" label-width="80px" :model="form">
                <el-form-item label="名称" required>
                    <el-input v-model="form.tagName"></el-input>
                </el-form-item>
                <el-form-item label="英文名" required>
                    <el-input v-model="form.tagKey"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.tagKey"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddOrEdit">提 交</el-button>
            </div>
      </el-dialog>
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
                multipleSelection: [],
                dialogVisible: false,
                form: {
                    tagName: '',
                    tagKey: ''
                }
            }
        },
        methods: {
            // 新增或编辑组合标签种类
            handleAddOrEdit() {
                this.$service.addSpecialTagType(this.form).then(res => {
                    
                })
            },
            // 新增组合标签
            handleAdd () {
                this.dialogVisible = true
            },
            fetchData () {
                const filter = this.filter
                this.$service.specialTagList(filter).then(data => {
                    // eslint-disable-next-line
                    // debugger
                    const result = data
                    this.dataList = result.pageInfo.list
                    this.dataSourceEnum = result.DataSourceMap
                    this.typeEnum = result.tagKey
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
            this.$root.$on('special-tag-list-refresh', this.fetchData)
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
    .my-collect
        margin-top 50px
    .header
        display flex
        justify-content space-between
        margin 10px 0
    .search-input
        position relative
        display flex
        width 30%
    .icon-fixed
        position absolute
        top 8px
        right 10px
        transform rotate(-90deg)
</style>
