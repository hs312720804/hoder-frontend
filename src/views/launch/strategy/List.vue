<template>
    <div class="strategy">
        <!--列表页-->
        <ContentWrapper
                :filter="filter"
                :pagination="pagination"
                @filter-change="handleFilterChange"
        >
            <div class="button-group">
                <div>
                <el-button
                        type="primary"
                        size="small"
                        @click="handleAdd"
                        v-permission="'hoder:launch:policy:save'"
                >新增投放</el-button>
                <a class="manual" href="http://mgr-hoder.skysrt.com/hoder-manual/ren-qun-guan-li/ren-qun-fen-ge-tou-fang.html" target="_blank">操作指南</a>
                </div>
                <div class="search-form">
                    <el-input v-model="filter.search" placeholder="请输入策略名称或ID"></el-input>
                    <el-button size="small" @click="handleSearch" type="primary">查询</el-button>
                    <el-button size="small" @click="handleFilterReset">重置</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane
                        v-for="item in launchPlatformData"
                        :label="item.biName+'(业务id:'+item.biId+')'"
                        :value="item.biId"
                        :key="item.biId"
                        :name="'name'+item.biId"
                ></el-tab-pane>
            </el-tabs>
            <Table
                    :props="table.props"
                    :header="table.header"
                    :data="table.data"
            >
            </Table>
        </ContentWrapper>
        <!--新增页面-->
        <el-dialog title="新增投放" :visible.sync="showAddDialog">
            <el-form :model="formData" :rules="rulesData" ref="formData">
                <el-form-item label="投放平台" prop="biIds" class="multipleSelect">
                    <el-select
                            v-model="formData.biIds"
                            multiple
                    >
                        <el-option
                                v-for="(platform,index) in Platforms"
                                :label="platform.biName"
                                :value="platform.biId"
                                :key="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择策略" prop="policyIds" class="multipleSelect">
                    <el-select
                            v-model="formData.policyIds"
                            multiple
                            filterable
                    >
                        <el-option
                                v-for="(strategy,index) in strategyData"
                                :label="strategy.policyId + '-' +strategy.policyName"
                                :value="strategy.policyId"
                                :key="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formData')">投放</el-button>
                    <el-button @click="handleCancel('formData')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import { ContentWrapper, Table, utils} from 'admin-toolkit'
    export default {
        components: {
            ContentWrapper,
            Table
        },
        data() {
            return {
                activeName: null,
                biId: null,
                launchPlatformData: [], //投放策略平台
                strategyData: [],
                Platforms: [],
                showAddDialog: false,
                formData: {
                    biIds: [],
                    policyIds: []
                },
                rulesData: {
                    biIds: [{ required: true, message: "请选择投放平台", trigger: "blur" }],
                    policyIds: [
                        { required: true, message: "请选择策略平台", trigger: "blur" }
                    ]
                },
                filter: {
                    search: undefined
                },
                pagination: {},
                // selected: [],
                table: {
                    props: {},
                    header: [
                        {
                            label: '序号',
                            type: 'index',
                            width: '50'
                        },
                        // {
                        //     label: '投放ID',
                        //     prop: 'launchPolicyId'
                        // },
                        {
                            label: '策略ID',
                            prop: 'policyId'
                        },
                        {
                            label: '策略名称',
                            prop: 'policyName'
                        },
                        {
                            label: '创建人',
                            prop: 'creator'
                        },
                        {
                            label: '创建部门',
                            prop: 'department'
                        },
                        {
                            label: '状态',
                            prop: 'status',
                            render: (h, { row }) => {
                                return this.launchStatusEnum[row.status]
                            }
                        },
                        {
                            label: '操作',
                            fixed: 'right',
                            width: '100',
                            render: utils.component.createOperationRender(this, {
                                cancelLaunch: "取消投放"
                            })
                        }

                    ],
                    data: [],
                    // selected: [],
                    // selectionType: 'multiple'
                },
                launchStatusEnum: { "1": "投放中" },
            }
        },
        methods: {
            getPolicyList() {
                this.$service.launchPolicyIndex().then(data => {
                    this.launchPlatformData = data.biLists
                    if (this.launchPlatformData.length > 0) {
                        this.biId = this.launchPlatformData[0].biId
                        this.activeName = "name" + this.biId
                        this.fetchData(this.biId)
                    }
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
                this.fetchData(this.biId)
            },
            handleFilterReset () {
                this.filter = {
                    search: undefined
                }
                this.fetchData(this.biId)
            },
            handleSearch () {
                this.fetchData(this.biId)
            },
            handleClick(tab) {
                this.biId = parseInt(tab.name.replace("name", ""))
                this.pagination.currentPage = 1
                this.fetchData(this.biId)
            },
            // 根据策略ID获取列表数据
            fetchData(crowdId) {
                const tabIndex = crowdId
                const pageNum = this.pagination.currentPage
                const pageSize = this.pagination.pageSize
                const search = this.filter.search
                this.$service.getCrowdsListByPolicyId({ tabIndex , pageNum, pageSize, search}).then((data)=> {
                    this.table.data = data.list
                    this.pagination.total = data.total
                })
            },
            handleAdd() {
                this.showAddDialog = true
                this.$service.getAddCrowdData().then((data) => {
                    this.Platforms = data.biLists
                    this.strategyData = data.polices
                })
            },
            cancelLaunch ({row}) {
                const launchForm = {
                    launchPolicyId: row.launchPolicyId,
                    policyId: row.policyId,
                    biId: this.biId
                }
                this.$confirm('确定要取消投放吗？取消投放之后这条记录将被删除，且策略及人群将不会投放到业务平台。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.cancelLaunchData(launchForm,'取消投放成功').then(() => { this.fetchData(this.biId) })
                })
            },
            handleCancel(formName) {
                this.showAddDialog =false
                this.$refs[formName].resetFields()
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let formData = JSON.stringify(this.formData)
                        formData = JSON.parse(formData)
                        this.$service.saveAddCrowdData(formData).then(() => {
                            this.showAddDialog =false
                            this.fetchData(this.biId)
                            this.$refs[formName].resetFields()
                        })
                    } else {
                        return false
                    }
                })
            },
        },
        created() {
            this.getPolicyList()
        }
    }
</script>
<style lang="stylus" scoped>
    .multipleSelect
        >>>.el-select
            width: 90%
    .button-group
        margin -20px 0 20px 0
        display flex
        align-items center
        justify-content space-around
    .search-form
        display flex
        width 85%
        justify-content flex-end
        .el-input
            width 20%
            margin-right 20px
    .manual
        margin-left 8px
</style>
