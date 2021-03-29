<template>
    <div class="device-portrait-content">
        <div class="header">
            <div class="button-group">
                <el-button type="primary" @click="handleAddDevice">新增设备信息包</el-button>
            </div>
            <div class="search-content">
                <el-input v-model="searchVal" placeholder="请输入设备包名称" clearable></el-input>
                <el-button @click="fetchData" type="primary">搜索</el-button>
            </div>
        </div>
        <!--列表页-->
        <el-table :data="tableData" border stripe>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="设备包名称" prop="name"></el-table-column>
            <el-table-column label="总数量" prop="totalSize">
                <template slot-scope="scope">
                    {{cc_format_number(scope.row.totalSize)}}
                </template>
            </el-table-column>
            <el-table-column label="可识别数量" prop="realSize">
                <template slot-scope="scope">
                    {{cc_format_number(scope.row.realSize)}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    {{statusEnum[scope.row.status]}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="primary"
                            @click="handleSeeEcharts(scope.row.id)">查看画像</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentpage="pagination.currentPage"
                    :pagesize="pagination.pageSize"
                    :totalcount="pagination.totalCount"
                    @handle-size-change="handleSizeChange"
                    @handle-current-change="handleCurrentChange">
        </pagination>
    </div>
</template>

<script>
    export default {
        name: "List",
        components: {},
        props: ['refreshList'],
        data () {
            return {
                tableData: [],
                statusEnum: {
                    0: '已提交',
                    1: '已解析',
                    2: '估算中',
                    3: '已估算',
                    4: '估算失败'
                },
                pagination: {
                    pageSize: 10,
                    currentPage: 1,
                    totalCount: 0
                },
                searchVal: undefined
            }
        },
        watch: {
            'refreshList': function (val) {
                if(val) {
                    this.fetchData()
                }
            }
        },
        methods: {
            getFilter () {
                const filter = {
                    pageNum: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    fileName: this.searchVal
                }
                return filter
            },
            fetchData () {
                const filter = this.getFilter()
                this.$service.getDevicePortraitList(filter).then(data => {
                    this.tableData = data.list
                    this.pagination.totalCount = data.total
                })
            },
            handleSizeChange (val) {
                this.pagination.pageSize = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                this.pagination.currentPage = val
                this.fetchData()
            },
            handleSeeEcharts (id) {
                this.$emit('open-echarts',id)
            },
            handleDelete (id) {
                this.$confirm('确定删除吗？')
                .then(() => {
                    this.$service.devicePortraintDel({id},'删除成功').then(()=> {
                        this.fetchData()
                    })
                })
                .catch(() => {
                })
            },
            handleAddDevice() {
                this.$emit('open-add')
            },
        },
        created() {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.device-portrait-content
    /*margin 20px*/
.header,.button-group,.search-content
    display flex
.header
    justify-content space-between
    margin 10px 0
</style>
