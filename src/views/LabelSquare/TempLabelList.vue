<template>
    <div class="temp-label-list">
        <div class="header">
            <el-button
                    @click="handleAdd"
                    type="primary"
                    v-if="!showSelection"
            >
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
            <el-table
                    ref="tempChangeTable"
                    :data="tableData"
                    border
                    @select="handleSelectOrCancel"
            >
                <el-table-column
                        type="selection"
                        width="55"
                        v-if="showSelection"
                ></el-table-column>
                <el-table-column prop="launchCrowdId" label="ID"></el-table-column>
                <el-table-column prop="dmpCrowdId" label="投放ID"></el-table-column>
                <el-table-column prop="launchName" label="人群名称"></el-table-column>
                <!--<el-table-column prop="jobEndTime" label="有效期"></el-table-column>-->
                <el-table-column prop="count" label="使用次数">
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.history.status}}+++{{(launchStatusEnum[scope.row.history.status]).code}}-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div v-if="(launchStatusEnum[scope.row.history.status]).code === 3">
                            计算完成
                        </div>
                        <div v-else-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 7"
                        >
                            <el-button type="text" @click="calculate(scope.row)">计算</el-button>
                        </div>
                        <div v-else-if="(launchStatusEnum[scope.row.history.status]).code === 5">
                            计算失败，<el-button type="text" @click="calculate(scope.row)">重试</el-button>
                        </div>
                        <div v-else>
                            {{(launchStatusEnum[scope.row.history.status]).name}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="history.totalUser" label="设备数量"></el-table-column>
                <el-table-column prop="history.totalWxOpenid" label="微信数量"></el-table-column>
                <el-table-column
                        label="操作"
                        width="200"
                        v-if="!showSelection"
                >
                    <template slot-scope="scope">
                        <el-button-group>
                            <!--<el-button-->
                                    <!--type="text"-->
                                    <!--@click="calculate(scope.row)"-->
                            <!--&gt;-->
                                <!--计算-->
                            <!--</el-button>-->
                            <el-button
                                    type="text"
                                    @click="condition(scope.row)"
                            >
                                标签条件
                            </el-button>
                            <!--<el-button-->
                                    <!--type="text"-->
                                    <!--@click="minitor(scope.row)"-->
                            <!--&gt;-->
                                <!--监控-->
                            <!--</el-button>-->
                            <el-dropdown @command="handleCommandOpreate">
                                <el-button size="small" type="text">
                                    操作
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                            :command="['edit',scope.row]"
                                    >编辑
                                    </el-dropdown-item>
                                    <!--<el-dropdown-item-->
                                            <!--:command="['monitor',scope.row]"-->
                                            <!--v-permission="'hoder:launch:crowd:ver:index'"-->
                                    <!--&gt;数据监控-->
                                    <!--</el-dropdown-item>-->
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
            <!--<el-form v-if="launchType === 0">-->
                <!--<el-form-item :label="item.policyName" v-for="item in selectStrategy" :key="item.policyName">-->
                    <!--<el-checkbox-->
                            <!--v-model="v.choosed"-->
                            <!--v-for="v in item.childs"-->
                            <!--:key="v.crowdId"-->
                            <!--disabled-->
                    <!--&gt;{{v.crowdName}}-->
                    <!--</el-checkbox>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div v-if="launchType === 1">{{selectStrategy}}</div>-->
            <div>{{selectStrategy}}</div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TempLabel",
        props: {
            refreshFlag: {
                type: Boolean
            },
            showSelection: {
                type: Boolean
            },
            currentSelectTag: {
                type: Array
            }
        },
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
                // launchType: undefined,
                launchTitle: '',
                selectStrategy: null,//人群条件的选择策略
            }
        },
        created () {
            this.$root.$on('temp-label-list-refresh', this.fetchData)
            this.fetchData()
        },
        watch: {
            'refreshFlag': function (val) {
                if (val) {
                    this.fetchData()
                }
            },
            'currentSelectTag': 'updateTableSelected'
        },
        methods: {
            fetchData () {
                const filter = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    launchName: this.launchName
                }
                this.$service.getTempCrowdList(filter).then(data => {
                    this.launchStatusEnum = data.launchStatusEnum
                    this.tableData = data.pageInfo.list
                    this.totalCount = data.pageInfo.total
                    if (this.showSelection) {
                        this.updateTableSelected()
                    }
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
                    // case 'monitor':
                    //     this.handleMonitor(params)
                    //     break
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
                .getTempCrowd({ launchCrowdId: row.launchCrowdId })
                .then(data => {
                    this.launchTitle = '人群条件'
                    this.selectStrategy = data.crowdSql
                })
            },
            // 删除
            del(row) {
                const launchCrowdId = row.launchCrowdId
                this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.$service.delTempCrowd({launchCrowdId}, "删除成功").then(() => {
                        this.fetchData()
                    })
                })
                .catch(() => {
                })
            },
            // 编辑
            handleEdit(launchCrowdItem) {
                this.$emit("show-add", launchCrowdItem.launchCrowdId, this.launchStatusEnum[launchCrowdItem.history.status].code)
            },
            // minitor (row) {},
            // 计算
            calculate (row) {
                this.$service.calculateTempCrowd({launchCrowdId: row.launchCrowdId,calType: row.calType},'成功计算中').then(()=> {
                    this.fetchData()
                })
            },
            // 新增
            handleAdd () {
                this.$emit('show-add')
            },
            handleSelectOrCancel (select, row) {
                const selectedFlag = select.length && select.indexOf(row) !== -1
                // true就是选中，0或者false是取消选中
                if (selectedFlag) {
                    this.$refs.tempChangeTable.toggleRowSelection(row,true)
                    this.$emit('table-selected',row, 'add')
                } else {
                    this.$refs.tempChangeTable.toggleRowSelection(row,false)
                    this.$emit('table-selected',row, 'del')
                }
            },
            updateTableSelected () {
                const arr = []
                const currentSelectRows = this.currentSelectTag
                this.tableData.forEach((item, index) => {
                    currentSelectRows.forEach((i) => {
                        if (item.tagId === i.tagId) {
                            arr.push(this.tableData[index])
                        }
                    })
                })
                if (arr) {
                    // 如果存在，则先清空选中，再赋值
                    this.$nextTick(() => {
                        this.$refs.tempChangeTable.clearSelection()
                        arr.forEach(row => {
                            this.$refs.tempChangeTable.toggleRowSelection(row,true)
                        })
                    })
                } else {
                    this.$refs.tempChangeTable.clearSelection()
                }
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
