<template>
    <div>
        <ActionList :actions="actions" />
        <ContentList 
            :filter="filter"
            :filterSchema="filterSchema"
            :table="table"
            :pagination="pagination"
            @filter-change="fetchData"
        >
        </ContentList>
    </div>
</template>

<script>
import { ActionList, ContentList, utils } from "admin-toolkit"
import _ from 'gateschema'

const componentUtil = utils.component
export default {
    components: {
        ActionList,
        ContentList
    },
    data() {
        return {
            actions: {
                handleCreate: {
                    type: 'primary',
                    text: '创建'
                }
            },
            filter: {},
            filterSchema: _.map({
            id: _.o.string.other("form", {
                placeholder: "请输入 id",
                cols: {
                item: 5,
                label: 6,
                wrapper: 16,
                xsLabel: 0,
                xsWrapper: 24
                }
            }),
            name: _.o.string.other("form", {
                placeholder: "请输入 name",
                cols: {
                item: 5,
                label: 8,
                wrapper: 16,
                xsLabel: 0,
                xsWrapper: {
                    offset: 2,
                    span: 22
                }
                }
            })
            }).other("form", {
            layout: "inline",
            footer: {
                cols: {
                label: 0,
                wrapper: 24
                },
                showSubmit: true,
                submitText: "查询"
            }
            }),
            tableHeader: [
            ],
            table: {
            props: {
                border: true,
            },
            header: [
                {
                type: "selection",
                width: "55"
                },
                {
                label: "ID",
                prop: "id",
                sortable: false
                },
                {
                label: "名称",
                prop: "name",
                sortable: true
                },
                {
                label: "操作",
                render: componentUtil.createOperationRender(this, {
                    handleRead: "查看",
                    handleEdit: "编辑",
                    handleDelete: "删除"
                })
                }
            ],
            data: [
                {
                id: "1",
                name: "名称1"
                },
                {
                id: "2",
                name: "名称2"
                }
            ]
            },
            pagination: {
                currentPage: 3,
                total: 200
            }
        }
    },
    methods: {
        handleCreate() {
            this.$router.push({name: 'post_create'})
        },
        fetchData() {
            console.group('fetchData')
            console.log('filter', this.filter)
            console.log('pagination', this.pagination)
            console.groupEnd('fetchData')
        }
    }
}
</script>