<template>
    <div>
        <el-form :model="outForm" inline label-width="200px" style="border-bottom: 1px dashed #ccc;margin-bottom: 20px">
            <el-form-item label="MAC地址：">
                <el-input v-model="outForm.MAC" clearable></el-input>
            </el-form-item>
            <el-form-item label="策略ID：">
                <el-input v-model="outForm.policyId" clearable></el-input>
            </el-form-item>
            <el-form-item label=" ">
                <el-checkbox v-model="outForm.auto">自动填充参数</el-checkbox>
            </el-form-item>
        </el-form>
        <el-form :model="form" inline label-width="200px">
            <el-form-item label="devId：">
                <el-input v-model="form.devId" clearable></el-input>
            </el-form-item>
            <el-form-item label="reqSource：">
                <el-input v-model="form.reqSource" clearable></el-input>
            </el-form-item>
            <el-form-item label="devInfo：">
                <el-input v-model="form.devInfo" clearable></el-input>
            </el-form-item>
            <el-form-item label="mac：">
                <el-input v-model="form.mac" clearable></el-input>
            </el-form-item>
            <el-form-item label="policyIds：">
                <el-input v-model="form.policyIds" clearable></el-input>
            </el-form-item>
            <el-form-item label="uniqueFlag：">
                <el-radio :label="true" v-model="form.uniqueFlag">是</el-radio>
                <el-radio :label="false" v-model="form.uniqueFlag">否</el-radio>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="info" @click="handleReset">重置</el-button>
                <el-button v-show="showNext" type="success" @click="handleNext">下一条</el-button>
            </el-form-item>
        </el-form>
        <div class="content" v-if="resultContent">{{resultContent}}</div>
    </div>
</template>

<script>
    export default {
        name: "hitSearch",
        data () {
            return {
                form: this.genForm(),
                outForm: this.genOutForm(),
                pageNum: 0,
                pageSize: 1,
                showNext: false,
                resultContent: undefined
            }
        },
        watch: {
            'outForm.auto': function(val) {
                if (val) {
                    this.handleGetAutoData()
                } else {
                    this.form = this.genForm()
                }
            }
        },
        methods: {
            genForm (preset) {
                return {
                    devId: undefined,
                    devInfo: undefined,
                    policyIds: undefined,
                    reqSource: undefined,
                    mac: undefined,
                    uniqueFlag: undefined,
                    ...preset
                }
            },
            genOutForm (present) {
                return {
                    MAC: undefined,
                    policyId: undefined,
                    auto: false,
                    ...present
                }
            },
            handleReset () {
                this.form = this.genForm()
                this.outForm = this.genOutForm()
                this.resultContent = undefined
                this.showNext = false
            },
            handleSearch () {
                const form = this.form
                this.$service.getHitSearchData(form).then(data => {
                    this.resultContent = data
                })
            },
            checkOutForm () {
                const form = this.outForm
                if (form.MAC || form.policyId){
                    return true
                } else {
                    this.$message.error('MAC或策略ID至少得填一项！')
                    return false
                }
            },
            parseAutoFilter () {
                const form = this.outForm
                return {
                    MAC: form.MAC,
                    policyId: form.policyId,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
            },
            handleGetAutoData () {
                const checkOutFormFlag = this.checkOutForm()
                if (checkOutFormFlag) {
                    const filter = this.parseAutoFilter()
                    this.$service.getAutoFilledParams(filter).then(data => {
                        if (data.length > 0) {
                            this.form = data[0]
                            this.showNext = true
                        } else {
                            this.showNext = false
                        }
                    })
                }
            },
            handleNext () {
                this.pageNum = this.pageNum + 1
                this.handleGetAutoData()
            }
        }
    }
</script>

<style lang="stylus" scoped>
.content
    margin 20px
    border 1px solid #ccc
    padding 20px
</style>
