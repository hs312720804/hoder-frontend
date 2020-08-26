<template>
    <div class="temp-label">
        <div>
            <el-table :data="tableData" border>
                <el-table-column prop="launchCrowdId" label="ID"></el-table-column>
                <el-table-column prop="launchName" label="人群名称"></el-table-column>
                <el-table-column prop="jobEndTime" label="有效期"></el-table-column>
                <el-table-column prop="" label="使用次数"></el-table-column>
                <el-table-column prop="history.totalUser" label="设备数量"></el-table-column>
                <el-table-column prop="history.totalWxOpenid" label="微信数量"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button
                                    type="text"
                                    @click="handleSeeCrowdCondition(scope.row)"
                            >
                                人群条件
                            </el-button>
                            <el-button
                                    type="text"
                                    @click="minitor(scope.row)"
                            >
                                监控
                            </el-button>
                            <el-dropdown @command="handleCommandOpreate">
                                <el-button size="small" type="text">
                                    操作
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                            :command="['edit',scope.row]"
                                    >编辑
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                            :command="['monitor',scope.row]"
                                            v-permission="'hoder:launch:crowd:ver:index'"
                                    >数据监控
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                            :command="['del',scope.row]"
                                            v-permission="'hoder:launch:crowd:ver:delete'"
                                            v-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 || (launchStatusEnum[scope.row.history.status]).code === 7"
                                    >删除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <div align="right">
                <pagination
                        :currentpage="currentPage"
                        :pagesize="pageSize"
                        :totalcount="totalCount"
                        @handle-size-change="handleSizeChange"
                        @handle-current-change="handleCurrentChange"
                ></pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TempLabel",
        data () {
            return {
                tableData: [],
                filter: {},
                launchName: undefined,
                launchStatusEnum: {},
                pageSize: 10,
                currentPage: 1,
                totalCount: 1
            }
        },
        created () {
            this.$root.$on('temp-label-list-refresh', this.fetchData)
            this.fetchData()
        },
        methods: {
            fetchData () {
                const filter = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    launchName: this.launchName
                }
                this.$service.getTempCrowdList(filter).then(data => {
                    console.log(data)
                    this.launchStatusEnum = data.launchStatusEnum
                    this.tableData = data.pageInfo.list
                    this.totalCount = data.pageInfo.total
                })
            },
            handleCommandOpreate(scope) {
                const type = scope[0]
                const params = scope[1]
                switch (type) {
                    case 'edit':
                        this.handleEdit(params)
                        break
                    case 'del':
                        this.del(params)
                        break
                    case 'monitor':
                        this.handleMonitor(params)
                        break
                }
            },
            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange (val) {
                this.pageSize = val
                this.fetchData()
            },
            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange (val) {
                this.currentPage = val
                this.fetchData()
            },
            handleSeeCrowdCondition (row) {},
            minitor (row) {},
            more (row) {}
        }
    }
</script>

<style lang="stylus" scoped>
.temp-label
    margin-top 50px
.temp-label >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
</style>
