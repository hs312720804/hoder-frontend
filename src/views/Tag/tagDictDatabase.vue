<template>
    <div class="tag-dict-database-list">
        <ContentWrapper
                :filter="filter"
                :filterSchema="filterSchema"
                :pagination="pagination"
                @filter-change="handleFilterChange"
                @filter-reset="handleFilterReset"
        >
            <div><el-button @click="exportData" type="primary">导出</el-button></div>
            <Table
                    :props="table.props"
                    :header="table.header"
                    :data="table.data"
                    :selected="table.selected"
                    :selection-type="table.selectionType"
                    @row-selection-add="handleRowSelectionAdd"
                    @row-selection-remove="handleRowSelectionRemove"
                    @all-row-selection-change="handleAllRowSelectionChange"
            >
            </Table>
        </ContentWrapper>
    </div>
</template>

<script>
    import _ from 'gateschema'
    import { ContentWrapper, Table} from 'admin-toolkit'
    export default {
        name: "tagDictDatabaseAA",
        components: {
            ContentWrapper,
            Table
        },
        data () {
            return {
                filter: {},
                filterSchema: _.map({
                    tagName: _.o
                        .string.other('form', {
                            label: '请输入标签名称',
                            placeholder: '请输入标签名称',
                            cols: {
                                item: 8,
                                // label: 0,
                                wrapper: 10
                            }
                        }),
                    tagCode: _.o
                        .string.other('form',{
                            label:'请输入标签code',
                            placeholder: '请输入标签code',
                            cols: {
                                item: 8,
                                // label: 0,
                                wrapper: 10
                            }
                        })
                }).other('form', {
                    layout: 'inline',
                    footer: {
                        cols: {
                            label: 0,
                            wrapper: 24
                        },
                        showSubmit: true,
                        submitText: '查询',
                        showReset: true,
                        resetText: '重置'
                    }
                }),
                pagination: {
                },
                selected: [],
                table: {
                    props: {},
                    header: [
                        {
                            label: '标签名称',
                            prop: 'tagName'
                        },
                        {
                            label: '标签code',
                            prop: 'tagCode'
                        },
                        {
                            label: '标签值列值',
                            prop: 'tagValues'
                        },
                        {
                            label: '标签定义',
                            prop: 'description'
                        }

                    ],
                    data: [],
                    selected: [],
                    selectionType: 'multiple'
                }
            }
        },
        methods: {
            exportData () {
                this.$message('此功能待开发')
            },
            handleFilterChange (type, filter) {
                if (filter) {
                    this.filter = filter
                }
                if (type === 'query') {
                    if(this.pagination) {
                        this.pagination.currentPage = 1
                    }
                }
                this.fetchData()
            },
            handleFilterReset () {
                this.filter = {
                    tagName: undefined,
                    tagCode: undefined

                }
                this.fetchData()
            },
            handleRowSelectionAdd (targetItem) {
                this.selected.push(targetItem.id)
                this.updateTableSelected()
            },
            handleRowSelectionRemove (targetItem) {
                this.selected = this.selected.filter(item => {
                    return item !== targetItem.id
                })
                this.updateTableSelected()
            },
            handleAllRowSelectionChange (value) {
                if (value) {
                    this.table.data.forEach(this.handleRowSelectionAdd)
                } else {
                    this.selected = []
                    this.table.selected = []
                }
            },
            handleAllRowSelectionRemove () {
                this.selected = []
                this.table.selected = []
            },
            updateTableSelected() {
                const table = this.table
                const newSelectedIndex = this.selected.map(item => item)
                table.selected = table.data.reduce((result, item, index)=> {
                    if (newSelectedIndex.indexOf(item.id) > -1) {
                        result.push(index)
                    }
                    return result
                }, [])
            },
            parseFilter () {
                const {filter, pagination} = this
                if(pagination) {
                    filter.pageNum = pagination.currentPage
                    filter.pageSize = pagination.pageSize
                }
                return filter
            },
            fetchData () {
                const filter = this.parseFilter()
                this.$service.getTagDictDatabaseList(filter).then((data) => {
                    this.table.data = data.pageInfo.list
                    this.pagination.total = data.pageInfo.total
                    this.pagination.pageSize = data.pageInfo.pageSize
                })
            }
        },
        created() {
            this.fetchData()
        }
    }
</script>

<style scoped>

</style>
