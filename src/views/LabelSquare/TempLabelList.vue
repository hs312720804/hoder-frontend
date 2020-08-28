<template>
    <div class="temp-label-list">
        <div class="header">
            <el-button
                    @click="handleAdd"
                    type="primary">
                新建
            </el-button>
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
                                    @click="condition(scope.row)"
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
        <el-dialog :title="launchTitle" :visible.sync="isShowCondition">
            <el-form v-if="launchType === 0">
                <el-form-item :label="item.policyName" v-for="item in selectStrategy" :key="item.policyName">
                    <el-checkbox
                            v-model="v.choosed"
                            v-for="v in item.childs"
                            :key="v.crowdId"
                            disabled
                    >{{v.crowdName}}
                    </el-checkbox>
                </el-form-item>
            </el-form>
            <div v-if="launchType === 1">{{selectStrategy}}</div>
        </el-dialog>
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
                totalCount: 1,
                isShowCondition: false,
                launchType: undefined,
                launchTitle: '',
                selectStrategy: null,//人群条件的选择策略
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
                //每次切换页码条，都把页面数重置为1
                this.currentPage = 1
                this.fetchData()
            },
            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange (val) {
                this.currentPage = val
                this.fetchData()
            },
            condition(row) {
                this.isShowCondition = true
                this.$service
                .MultiVersionCrowdPeople({ launchCrowdId: row.launchCrowdId })
                .then(data => {
                    this.launchType = data.type
                    if ( data.type === 1) {
                        this.launchTitle = '人群条件'
                        this.selectStrategy = data.sqlRule
                    }
                    else {
                        this.launchTitle = '选择的策略'
                        this.selectStrategy = data.respcl
                    }
                })
            },
            // 删除
            del(row) {
                var id = row.launchCrowdId
                this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.$service.delMultiVersionCrowd(id, "删除成功").then(() => {
                        this.callback()
                    })
                })
                .catch(() => {
                })
            },
            // 编辑
            handleEdit(launchCrowdItem) {
                this.$emit("show-add", launchCrowdItem.launchCrowdId, this.launchStatusEnum[launchCrowdItem.history.status].code)
            },
            minitor (row) {},
            more (row) {},
            // 新增
            handleAdd () {
                this.$emit('show-add')
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .temp-label-list
        margin-top 50px
    .temp-label-list >>> .el-button-group
        display flex
        align-items center
        .el-button
            margin 0 5px
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
