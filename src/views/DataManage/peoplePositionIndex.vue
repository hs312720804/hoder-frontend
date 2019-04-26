<template>
    <div>
        <ContentWrapper
                :filter="filter"
                :filterSchema="filterSchema"
                :pagination="pagination"
                @filter-change="handleFilterChange"
                @filter-reset="handleFilterReset"
        >
            <div><el-button>新增</el-button></div>
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
import { ContentWrapper, Table, utils} from 'admin-toolkit'
export default {
    name: "peoplePositionIndex",
    components: {
        ContentWrapper,
        Table
    },
    data () {
        return {
            filter: {},
            filterSchema: _.map({
                id: _.o
                    .number.other('form',{
                        label: 'ID',
                        placeholder: '请输入ID',
                        cols: {
                            item: 6,
                            label: 0,
                            wrapper: 18
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
            pagination: {},
            selected: [],
            table: {
                props: {},
                header: [
                    {
                        label: 'id',
                        prop: 'id'
                    },
                    {
                        label: '名称',
                        prop: 'name'
                    },
                    {
                        label: '协议',
                        prop: 'protocol'
                    },
                    {
                        label: '地址',
                        prop: 'url'
                    },
                    {
                        label: '参数',
                        prop: 'param'
                    },
                    {
                        label: '备注',
                        prop: 'remark'
                    },
                    {
                        label: '状态',
                        prop: 'status'
                    },
                    {
                        label: '创建者',
                        prop: 'creator'
                    },
                    {
                        label: '更新者',
                        prop: 'updator'
                    },
                    {
                        label: '创建时间',
                        prop: 'createTime'
                    },
                    {
                        label: '最后更新时间',
                        prop: 'updateTime'
                    },
                    {
                        label: '操作',
                        fixed: 'right',
                        width: '200',
                        render: utils.component.createOperationRender(this, {
                            handleDelete: "删除",
                            handleEdit: "编辑",
                        })
                    }

                ],
                data: [],
                selected: [],
                selectionType: 'multiple'
            }
        }
    },
    methods: {
        handleFilterChange () {},
        handleFilterReset () {},
        handleRowSelectionAdd () {},
        handleRowSelectionRemove () {},
        handleAllRowSelectionChange () {},
        fetchData () {
            this.$service.peoplePositonList().then((data) => {
                console.log(data)
                this.table.data = data.pageInfo.list
                this.pagination.total = data.pageInfo.total
            })
        }
    },
    created () {
        this.fetchData()
    }
}
</script>

<style scoped>

</style>
