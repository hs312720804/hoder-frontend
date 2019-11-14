<template>
    <div class="launch-list">
        <!-- authority -->
        <div class="TopNav">
            <div class="left">
                <el-button-group class="button-list">
                    <el-button
                            type="primary"
                            size="small"
                            @click="handleAdd"
                            v-permission="'hoder:launch:crowd:ver:add'"
                    >
                       新增投放
                    </el-button>
                    <el-button
                            type="primary"
                            size="small"
                            @click="handleCrowdDefineAdd"
                            v-permission="'hoder:launch:crowd:ver:add'"
                    >
                        新增自定义人群
                    </el-button>
                    <a href="http://mgr-hoder.skysrt.com/hoder-manual/ren-qun-guan-li/ren-qun-quan-ding.html" target="_blank">操作指南</a>
                </el-button-group>
            </div>
            <div class="right">
                <!-- form search -->
                <el-form
                        :inline="true"
                        :model="searchForm"
                        ref="searchForm"
                        @submit.native.prevent="submitForm"
                >
                    <el-form-item label prop="launchName">
                        <el-input v-model="searchForm.launchName" style="width: 200px" placeholder="请输入人群名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" icon="search" @click="submitForm">查询</el-button>
                        <el-button type="primary" size="small" @click="handleReset">
                            <a class="fa fa-refresh" style="color: white;"></a> 重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- talbe -->
        <el-table ref="myTable" :data="tableData" style="width: 100%;" stripe border>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="launchCrowdId" label="投放ID" width="60"></el-table-column>
            <el-table-column prop="launchName" label="投放名称" width="100">
                <template scope="scope">
                    <!-- 后期对自定义人群实现AB Test再切换到下列代码 -->
                    <!--<el-button type="text" v-if="scope.row.abTest === true" @click="showABTestDetail(scope.row)">{{scope.row.launchName}}</el-button>-->
                    <el-button type="text" v-if="scope.row.isFxFullSql == 0 && scope.row.abTest === true" @click="showABTestDetail(scope.row)">{{scope.row.launchName}}</el-button>
                    <span v-else>{{scope.row.launchName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="dmpCrowdId" label="人群投放Id" width="80"></el-table-column>
            <el-table-column prop="biName" label="投放平台" width="120"></el-table-column>
            <el-table-column prop="status" label="人群状态" width="70">
                <template scope="scope">
                    <!-- 计算失败要点击出弹窗 -->
                    <el-button type="text" v-if="scope.row.history.status == 5" @click="handleCountFail">{{launchStatusEnum[scope.row.history.status]}}</el-button>
                    <span v-else  style="margin-left: 10px">{{launchStatusEnum[scope.row.history.status]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="expiryTime" label="人群有效期" width="180">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.jobEndTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="人群类型">
                <template scope="scope">
                    {{crowdType[scope.row.isFxFullSql]}}
                </template>
            </el-table-column>
            <el-table-column prop="history.totalUser" label="设备数量" width="80"></el-table-column>
            <el-table-column prop="history.totalPhone" label="手机号数量" width="90"></el-table-column>
            <el-table-column prop="history.totalWxOpenid" label="微信openId数量" width="110"></el-table-column>
            <el-table-column prop="history.totalCoocaaOpenid" label="酷开openId数量" width="110"></el-table-column>
            <el-table-column prop="creatorName" label="创建人"></el-table-column>
            <el-table-column prop="department" label="业务部门"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="200">
                <template scope="scope">
                    <el-button-group  class="button-group-position">
                        <el-button
                                v-if="scope.row.history.status==1 || scope.row.history.status==5"
                                v-permission="'hoder:launch:crowd:ver:launch'"
                                size="small"
                                type="warning"
                                @click="lanuch(scope.$index, scope.row)"
                        >投放</el-button>
                        <el-button
                                v-if="scope.row.history.status==3"
                                v-permission="'hoder:launch:crowd:ver:cancel'"
                                size="small"
                                type="warning"
                                @click="cancelLanuch(scope.row)"
                        >取消投放</el-button>
                        <el-button
                                size="small"
                                type="success"
                                v-permission="'hoder:launch:crowd:ver:detail'"
                                @click="condition(scope.row) "
                        >人群条件</el-button>
                        <el-dropdown @command="handleCommandOpreate">
                            <el-button size="small" type="primary">
                                操作
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                        :command="['edit',scope.row]"
                                        v-permission="'hoder:launch:crowd:ver:modify'"
                                >编辑
                                </el-dropdown-item>
                                <el-dropdown-item
                                        :command="['del',scope.row]"
                                        v-permission="'hoder:launch:crowd:ver:delete'"
                                        v-if="scope.row.history.status==1 || scope.row.history.status==5"
                                        divided
                                >删除
                                </el-dropdown-item>
                                <!--<el-dropdown-item-->
                                        <!--:command="['divide',scope.row]"-->
                                        <!--v-if="scope.row.isFxFullSql == 1 && scope.row.abTest === false"-->
                                        <!--divided-->
                                <!--&gt;A/B test划分-->
                                <!--</el-dropdown-item>-->
                                <el-dropdown-item
                                :command="['commitHistory',scope.row]"
                                v-if="scope.row.history.status !== 1"
                                divided
                                >提交历史数据
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!--<el-button-->
                                <!--v-permission="'hoder:launch:crowd:ver:modify'"-->
                                <!--size="small"-->
                                <!--type="primary"-->
                                <!--@click="handleEdit(scope.row)"-->
                                <!--shiro:hasPermission="sysAdministrative:role:edit"-->
                        <!--&gt;编辑</el-button>-->
                        <!--<el-button-->
                                <!--v-if="scope.row.history.status==1"-->
                                <!--v-permission="'hoder:launch:crowd:ver:delete'"-->
                                <!--size="small"-->
                                <!--type="info"-->
                                <!--@click="del(scope.row)"-->
                        <!--&gt;删除</el-button>-->
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <!-- pagination -->
        <div align="right">
            <pagination
                    v-bind:currentpage="currentPage"
                    v-bind:pagesize="pageSize"
                    v-bind:totalcount="totalCount"
                    @handle-size-change="handleSizeChange"
                    @handle-current-change="handleCurrentChange"
            ></pagination>
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
        <!-- 投放提示估算弹窗 -->
        <el-dialog :visible.sync="showEstimate">
            <div class="choose-tip">请选择下列需要估算的字段，勾选保存后将估算该字段的人群数量</div>
            <el-checkbox-group v-model="estimateValue" aria-required="true">
                <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
            <div v-show='showError' class="error-msg">请至少选择一个要投放的人群</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEstimate = false">取 消</el-button>
                <el-button type="primary" @click="handleEstimate">投放</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="showDivide" title="圈定人群划分AB test">
            <el-form :model="divideForm" label-width="120px">
                <div class="first-step" v-show="step === 1">
                    <div>第一步：填写人群份数</div>
                    <el-form-item label="人群划分份数：">
                        <el-select size="mini" v-model="copies">
                            <el-option v-for="(part,index) in parts"
                                       :key="index"
                                       :label="part"
                                       :value="part"
                            >
                            </el-option>
                        </el-select>份
                    </el-form-item>
                    <div><el-button type="primary" @click="firstStep">下一步</el-button></div>
                </div>
                <div class="first-step" v-show="step === 2">
                    <div>第二步：设置人群占比</div>
                    <el-form-item label="各人群占比：">
                        <div class="block" v-for="(item,index) in copiesItem" :key="index">
                            <span>人群_{{alphaData[index]}}<span class="show-percent">{{percent[index]}}%</span></span>
                            <el-slider v-model="percent[index]" :key="item"></el-slider>
                        </div>
                    </el-form-item>
                    <el-form-item label="比例总和：">{{percentTotal}}</el-form-item>
                    <div>
                        <el-button type="primary" @click="step = 1">上一步</el-button>
                        <el-button type="primary" @click="secondStep">下一步</el-button>
                    </div>
                </div>
                <div class="first-step" v-show="step === 3">
                    <div>第三步：勾选计算的类型</div>
                    <el-form-item label="">
                        <el-checkbox-group v-model="divideForm.calType" aria-required="true">
                            <el-checkbox v-for="(item,index) in divideEstimateItems" :label="parseInt(item.value)" :key="index">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <div>
                        <el-button type="primary" @click="step = 2">上一步</el-button>
                        <el-button type="primary" @click="finish">确定</el-button>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!-- 计算失败弹窗 -->
        <el-dialog :visible.sync="showCountFailDialog" title="计算失败">
            <div class="count-fail-text">计算失败，原因可能是sql出错或者大数据计算失败，若想再次计算，请重新点击【投放】按钮</div>
        </el-dialog>
        <!-- 自定义人群 划分详情弹窗 -->
        <el-dialog :visible.sync="showDivideDetailDialog" title="划分详情">
            <el-table :data="DivideTableData" style="width: 100%;" stripe border v-if="dialogType">
                <el-table-column prop="id" label="投放子ID"></el-table-column>
                <el-table-column prop="launchName" label="人群名称"></el-table-column>
                <el-table-column prop="ratio" label="占比">
                    <template scope="scope">
                        {{scope.row.ratio}}%
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="数量"></el-table-column>
            </el-table>
            <el-table :data="DivideTableData" style="width: 100%;" stripe border v-else>
                <el-table-column prop="crowdId" label="投放子ID"></el-table-column>
                <el-table-column prop="crowdName" label="人群名称"></el-table-column>
                <el-table-column prop="ratio" label="占比">
                    <template scope="scope">
                        {{scope.row.ratio}}%
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="数量"></el-table-column>
            </el-table>
        </el-dialog>
        <commit-history-dialog
                :setShowCommitHistoryDialog="setShowCommitHistoryDialog"
                :crowdId="currentCrowdId"
                @closeDialog="setShowCommitHistoryDialog = false"
                @submit="handleSubmitHistory"
        ></commit-history-dialog>
    </div>
</template>
<script>
    import CommitHistoryDialog from '@/components/CommitHistory'
    export default {
        components: {
            CommitHistoryDialog
        },
        data() {
            return {
                // 表格当前页数据
                tableData: [],
                launchStatusEnum: {},
                //搜索条件
                criteria: {},
                // 列表页
                searchForm: {
                    launchName: ""
                },
                // 编辑页
                // editFormVisible: false,// 编辑界面是否显示
                // 默认每页数据量:pageSize
                pageSize: 10,
                // 当前页码:pageNum
                currentPage: 1,
                // 查询的页码
                start: 1,
                // 默认数据总数
                totalCount: 1,
                isShowCondition: false,
                selectStrategy: null,//人群条件的选择策略
                showEstimate: false,
                estimateValue: ['0'],
                estimateItems: [],
                currentLaunchId: '',
                showError: false,
                launchType: undefined,
                launchTitle: '',
                showDivide: false,
                parts: [2,3,4,5,6,7,8,9,10],
                copies: 2,
                step: 1,
                divideForm: this.genDefaultDivideForm(),
                copiesItem: [],
                percent: [],
                alphaData: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
                divideEstimateItems: [],
                showCountFailDialog: false,
                percentTotal: 0,
                showDivideDetailDialog: false,
                DivideTableData: [],
                dialogType: false,
                setShowCommitHistoryDialog: false,
                currentCrowdId: undefined,
                crowdType: {
                    0: '普通人群',
                    1: '自定义人群'
                }
            };
        },
        created() {
            this.loadData();
        },
        watch: {
            percent(val) {
                this.percentTotal = val.reduce((prev ,cur) => {
                    return prev + cur
                })
            }
        },
        methods: {
            genDefaultDivideForm (preset) {
                return {
                    launchCrowdId: undefined,
                    pct: [],
                    calType: [],
                    ...preset
                }
            },
            callback() {
                this.loadData();
            },
            handleAdd() {
                this.$emit("changeStatus", false, 0)
            },
            handleCrowdDefineAdd() {
                this.$emit("changeStatus", false, 1)
            },
            handleEdit(launchCrowdItem) {
                this.$emit("changeStatus", false, launchCrowdItem.isFxFullSql, launchCrowdItem.launchCrowdId, launchCrowdItem.history.status)
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
            // 从服务器读取数据
            loadData: function() {
                this.criteria["pageNum"] = this.currentPage
                this.criteria["pageSize"] = this.pageSize
                this.$service.getMultiVersionCrowd(this.criteria).then(data => {
                    this.launchStatusEnum = data.launchStatusEnum
                    this.tableData = data.pageInfo.list
                    this.totalCount = data.pageInfo.total
                })
            },
            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange: function(val) {
                this.pageSize = val
                this.loadData()
            },
            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange: function(val) {
                this.currentPage = val
                this.loadData()
            },
            // 搜索,提交表单
            submitForm: function() {
                // var _this = this
                // this.$refs.searchForm.validate(function(result) {
                //     if (result) {
                //         _this.criteria = _this.searchForm;
                //         _this.loadData()
                //     } else {
                //         return false
                //     }
                // });
                this.$refs.searchForm.validate((result) => {
                    if (result) {
                       this.criteria = this.searchForm
                       this.loadData()
                    } else {
                        return false
                    }
                })
            },
            // 重置
            handleReset () {
                this.searchForm.launchName = ''
                this.criteria = {}
                this.loadData()
            },
            // 修改状态
            lanuch (index, row) {
                this.currentLaunchId = row.launchCrowdId
                this.showEstimate = true
                this.$service.getEstimateType().then((data) => {
                    this.estimateItems = data
                })
            },
            handleEstimate () {
                if (this.estimateValue.length === 0) {
                    this.showError = true
                    return
                } else {this.showError = false}
                let calIdType = this.estimateValue.map((item) => item).join(',')
                this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId,calIdType: calIdType },"投放成功").then(() => {
                    this.showEstimate = false
                    this.callback()
                })
            },
            cancelLanuch(row) {
                var id = row.launchCrowdId;
                this.$confirm("确定要取消投放吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$service.cancelLaunchMultiVersionCrowd({ launchCrowdId: id },"取消投放成功").then(() => {
                            this.callback()
                        })
                    })
                    .catch(() => {
                    })
            },
            // 对象转成数组
            objectToArray (obj) {
                let arr = []
                for (let i in obj) {
                    arr.push({ value: i, label: obj[i] })
                }
                return arr
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
                    case 'divide':
                        this.divideAB(params)
                        break
                    case 'commitHistory':
                        this.handleCommitHistory(params)
                        break
                }
            },
            divideAB (row) {
                this.showDivide = true
                this.step = 1
                // 重置AB TEST 数据
                this.copies = 2
                const divideForm = this.genDefaultDivideForm()
                divideForm.launchCrowdId = row.launchCrowdId
                this.divideForm = divideForm
            },
            firstStep () {
                this.step = 2
                const copies = this.copies
                let arr = []
                let percentArray = []
                for (let i=0;i<copies;i++) {
                    arr.push(i)
                    percentArray.push(parseInt(100/copies))
                }
                let total = percentArray.reduce((prev ,cur) => {
                    return prev + cur
                })
                // 默认百分比设置，总和必须为100%，不能被整除的，都加在最后一个上
                if (100%copies !== 0) {
                    const lastPercent = 100 - total
                    percentArray[copies-1] = percentArray[copies-1] + lastPercent
                }
                this.copiesItem = arr
                this.percent = percentArray
            },
            secondStep () {
                if (this.percentTotal !== 100) {
                    this.$message.error('所有比例总和必须等于100%')
                    return
                }else {
                    this.step = 3
                    this.divideForm.pct = this.percent
                    this.$service.getEstimateType().then((data) => {
                        this.divideEstimateItems = this.objectToArray(data)
                    })
                }
            },
            finish () {
                const model = this.divideForm.launchCrowdId
                // const divideForm = JSON.stringify(this.divideForm)
                const divideForm = this.divideForm
                if (divideForm.calType.length === 0) {
                    this.$message.error('请至少勾选一个计算的类型进行投放')
                    return
                }
                let formData = {
                    pct: divideForm.pct,
                    calType: divideForm.calType
                }
                this.$service.ABTestAdd({model: model,data: formData},"新增A/B test划分成功").then(() => {
                    this.showDivide = false
                    this.callback()
                })
            },
            handleCountFail () {
                this.showCountFailDialog = true
            },
            showABTestDetail (row) {
                const launchCrowdId = row.launchCrowdId
                this.$service.getABTestDetail(launchCrowdId).then((data) => {
                    this.showDivideDetailDialog = true
                    this.dialogType = data.IsFxFullSql === 1
                    this.DivideTableData = data.abTestRatio
                })
            },
            handleCommitHistory (row) {
                this.setShowCommitHistoryDialog = true
                this.currentCrowdId = row.launchCrowdId
            },
            handleSubmitHistory (formData) {
                let submitForm = {
                    isSubmit: formData.isSubmit,
                    launchCrowdId: formData.id,
                    dateNum: formData.dateNum
                }
                this.$service.submitMultiHistoryData(submitForm, formData.isSubmit === 1 ? '提交历史数据成功' : '关闭提交成功').then(()=> {
                    this.setShowCommitHistoryDialog = false
                })
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .choose-tip
        margin 20px 0
        color red
    .launch-list >>> .button-group-position .el-button
        margin 3px
    .error-msg
        color red
        font-size 14px
        margin-top 10px
    .button-list >>> .el-button + .el-button
        margin 0 10px
    .button-list >>> .el-button
        border-radius 3px
    .manual
        margin 20px
    /*.block*/
        /*width 80%*/
        /*display inline-block*/
    /*.button-group-position >>> .el-dropdown-menu__item*/
        /*text-align center*/
    .count-fail-text
        color red
    .show-percent
        color red
        margin-left 20px
    .button-list
        display flex
        align-items center
</style>
