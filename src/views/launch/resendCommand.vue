<template>
    <div>
        <el-form :model="outForm" inline class="first-form">
            <el-form-item label="投放ID：">
                <el-input v-model="outForm.launchCrowdId" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleResendCommand">触发计算</el-button>
            </el-form-item>
        </el-form>
        <el-form :model="form" inline label-width="100px" class="second-form">
            
        </el-form>
        <c-table
            :props="table.props"
            :header="table.header"
            :data="table.data"
            class="table-overflow"
        >
        </c-table>
    </div>
</template>

<script>
    export default {
        name: "resendCommandAA",
        data () {
            return {
                outForm: {
                    launchCrowdId: ''
                },
                pageNum: 0,
                pageSize: 1,
                showNext: false,
                resultContent: undefined,
                table: {
                    props: {},
                    header: [
                        {
                            label: 'id',
                            width: '50',
                            type: 'index',
                            prop: 'id'
                        },
                        {
                            label: '投放ID',
                            prop: 'launchCrowdId'
                        },
                        {
                            label: '投放SQL',
                            prop: 'crowdSql'
                        },
                        {
                            label: '投放版本',
                            prop: 'version'
                        },
                        {
                            label: '投放人ID',
                            prop: 'creator'
                        },
                        {
                            label: '投放时间',
                            prop: 'createTime'
                        },
                        {
                            label: '投放队列',
                            prop: 'topic'
                        },
                        {
                            label: '投放状态',
                            prop: 'status'
                        },
                        {
                            label: '说明',
                            prop: 'remark'
                        }
                    ],
                    data: []
                },
            }
        },
        methods: {
            handleResendCommand() {
                this.$service.manualLaunch(this.outForm).then(data => {

                })
            },

            handleGetManualLaunchList () {
                const form = this.outForm
                this.$service.getManualLaunchList(form).then(data => {
                    if (data) {
                       this.table.data = data
                    } else {
                        this.resultContent = '暂无数据'
                    }

                })
            },
            // checkOutForm () {
            //     const form = this.outForm
            //     if (form.MAC || form.policyId) {
            //         return true
            //     } else {
            //         this.$message.error('MAC或策略ID至少得填一项！')
            //         return false
            //     }
            // },
            // parseAutoFilter () {
            //     const form = this.outForm
            //     return {
            //         MAC: form.MAC,
            //         policyId: form.policyId,
            //         pageSize: this.pageSize,
            //         pageNum: this.pageNum
            //     }
            // },
            // handleGetAutoData () {
            //     const checkOutFormFlag = this.checkOutForm()
            //     if (checkOutFormFlag) {
            //         const filter = this.parseAutoFilter()
            //         this.$service.getAutoFilledParams(filter).then(data => {
            //             if (data.length > 0) {
            //                 this.form = data[0]
            //                 this.showNext = true
            //             } else {
            //                 this.showNext = false
            //             }
            //         })
            //     }
            // }
           
        }
    }
</script>

<style lang="stylus" scoped>
.content
    margin 20px
    border 1px solid #ccc
    padding 20px
.first-form
    border-bottom 1px dashed #ccc
    margin-bottom 20px

</style>
