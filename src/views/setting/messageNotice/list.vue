<template>
    <div class="message-notice">
        <ContentWrapper
                :filter="filter"
                :pagination="pagination"
                @filter-change="handleFilterChange"
                @filter-reset="handleFilterReset"
        >
            <div class="add-button">
                <el-button @click="handleAdd" type="primary" v-permission="'sysSetup:notice:add'">新增</el-button>
            </div>
            <Table
                    :props="table.props"
                    :header="tableHeader"
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
    import { ContentWrapper, Table, utils} from 'admin-toolkit'
    export default {
        name: "messageNotice",
        components: {
            ContentWrapper,
            Table
        },
        data () {
            return {
                noticeTypeEnum: {
                    1: "升级通知",
                    2: "系统通知"
                },
                readStatusEnum: {
                    0: '未读',
                    1: '已读'
                },
                filter: {},
                pagination: {},
                selected: [],
                table: {
                    props: {},
                    header: [
                        {
                            label: '序号',
                            type: 'index',
                            width: '50'
                        },
                        {
                            label: '消息标题',
                            prop: 'noticeTitle',
                            width: '300',
                            render: (h, params) => {
                                return h('el-button', {
                                    class: params.row.noticeStatus == 0 ? 'red-dot-title': 'normal-title',
                                    props: {
                                        type: 'text',
                                    },
                                    on: {
                                        click: () => {
                                            this.handleRead(params)
                                        }
                                    }
                                },params.row.noticeTitle)
                            }
                        },
                        {
                            label: '消息类型',
                            prop: 'noticeType',
                            render:(h, {row}) => {
                                return this.noticeTypeEnum[row.noticeType]
                            }
                        },
                        {
                            label: '推送时间',
                            prop: 'pushTime'
                        },
                        {
                            label: '状态',
                            prop: 'noticeStatus',
                            render:(h, {row}) => {
                                return this.readStatusEnum[row.noticeStatus]
                            }
                        },
                        {
                            label: '操作',
                            fixed: 'right',
                            width: '200',
                            render: utils.component.createOperationRender(this, {
                                handleRead: "详情",
                                handleEdit: "编辑",
                                handleDelete: "删除"
                            })
                        }
                    ],
                    data: [],
                    selected: [],
                    selectionType: 'multiple'
                }
            }
        },
        computed: {
            tableHeader () {
                debugger
                if ('sysSetup:notice:add' === false) {return this.table.header.slice(0, -1)}
                else {return this.table.header}
            }
        },
        methods: {
            handleRead ({row}) {
                this.$emit('open-add-page', row.noticeId, 'read')
            },
            handleAdd () {
                this.$emit('open-add-page')
            },
            handleEdit ({row}) {
                this.$emit('open-add-page', row.noticeId, 'edit')
            },
            handleDelete ({row}) {
                this.$confirm('确定删除此条消息通知吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then( () => {
                    this.$service.noticeDel({noticeId: row.noticeId}, '删除成功').then(
                        () => {
                            this.handleAllRowSelectionRemove()
                            this.fetchData()
                        }
                    )
                })
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
                    noticeId: undefined
                }
                this.fetchData()
            },
            handleRowSelectionAdd (targetItem) {
                this.selected.push(targetItem.noticeId)
                this.updateTableSelected()
            },
            handleRowSelectionRemove (targetItem) {
                this.selected = this.selected.filter(item => {
                    return item !== targetItem.noticeId
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
                    if (newSelectedIndex.indexOf(item.noticeId) > -1) {
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
                this.$service.noticeList(filter).then((data) => {
                    this.table.data = data.list
                    this.pagination.total = data.total
                })
            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.add-button
    margin 10px 0
.message-notice >>> .filter-form
    float right
    margin-bottom 20px
.message-notice >>> .red-dot-title
    position relative
    max-width 300px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    padding-left 12px
    &:before
        position absolute
        width 8px
        height 8px
        border-radius 10px
        content ""
        background-color red
        left 0
.message-notice >>> .normal-title
        max-width 300px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
</style>
