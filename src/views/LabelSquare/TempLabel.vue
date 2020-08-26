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
                            <el-button
                                    type="text"
                                    @click="more(scope.row)"
                            >
                                更多
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TempLabel",
        data () {
            return {
                tableData: [],
                filter: {
                    pageNum: 1,
                    pageSize: 5,
                    launchName: undefined
                }
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            fetchData () {
                const filter = this.filter
                this.$service.getTempCrowdList(filter).then(data => {
                    console.log(data)
                    this.tableData = data.pageInfo.list
                })
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
