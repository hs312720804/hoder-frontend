<template>
    <div class="launch-setting">
        <!-- 列表 -->
        <div class="launch-setting-list">
            <div class="button-group">
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    stripe
            >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="业务分类" prop="biName"></el-table-column>
                <el-table-column label="业务id" prop="biId"></el-table-column>
                <el-table-column label="人群分割投放" prop="position">
                    <template slot-scope="scope">
                        <div v-if="scope.row.position.length > 1">
                            <div v-for="item in (scope.row.position.split(','))">
                                <el-checkbox v-if="item == 1" checked disabled></el-checkbox>
                            </div>
                        </div>
                        <div v-else>
                            <el-checkbox v-model="scope.row.position == 1"></el-checkbox>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="人群圈定" prop="position">
                    <template slot-scope="scope">
                        <div v-if="scope.row.position.length > 1">
                            <div v-for="item in (scope.row.position.split(','))">
                                <el-checkbox v-if="item == 2" checked disabled></el-checkbox>
                            </div>
                        </div>
                        <div v-else>
                            <el-checkbox v-model="scope.row.position == 2"></el-checkbox>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)" type="primary">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="pagination"
                    :current-page.sync="pagination.pageNum"
                    :page-size.sync="pagination.pageSize"
                    :total="total"
                    @size-change="fetchData"
                    @current-change="fetchData"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
        <!-- 新增和编辑 -->
        <el-dialog :title="title" :visible.sync="showAddDialog" >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
                <el-form-item label="业务名称" prop="biName">
                    <el-input v-model="ruleForm.biName" class="el-input-rewrite"></el-input>
                </el-form-item>
                <el-form-item label="业务id" v-if="currentId" prop="biId">
                    <el-input v-model="ruleForm.biId" class="el-input-rewrite" disabled></el-input>
                </el-form-item>
                <el-form-item label="业务投放方式" prop="positions">
                    <el-checkbox-group v-model="ruleForm.positions">
                        <el-checkbox :label="1" :key="1">人群分割投放</el-checkbox>
                        <el-checkbox :label="2" :key="2">人群圈定</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('ruleForm')">返回</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "launchSetting",
        data () {
            return {
                tableData: [],
                checked: true,
                pagination: {
                    pageSize: 10,
                    pageNum: 1
                },
                total: undefined,
                showAddDialog: false,
                title: '',
                currentId: undefined,
                ruleForm: {
                    biId: undefined,
                    biName: '',
                    positions: []
                },
                rules: {
                    biId: [
                        { required: true, message: '请输入业务ID', trigger: blur}
                    ],
                    biName: [
                        { required: true, message: '请输入业务名称', trigger: blur}
                    ],
                    positions: [
                        { type: 'array', required: true, message: '请至少勾选一个投放方式', trigger: blur}
                    ]
                }
            }
        },
        methods: {
            getFilter() {
                return {
                    // tagCategoryId: this.tagCategory.tagId,
                    // ...this.filter,
                    ...this.pagination
                }
            },
            fetchData() {
                const filter = this.getFilter()
                this.$service.getLaunchList(filter).then(data => {
                    this.tableData = data.list
                    this.total = data.total
                })
            },
            handleAdd () {
                this.showAddDialog = true
                this.title = '新增业务'
                this.currentId = ''
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const biId = this.currentId
                        let formData = JSON.parse(JSON.stringify(this.ruleForm))
                        if (biId) {
                            // 编辑保存
                            formData.biId = biId
                            console.log(formData)
                            this.$service.updateLaunchMenu(formData,'保存成功').then(() => {
                                this.showAddDialog = false
                                this.fetchData()
                            })
                        } else {
                            // 新增保存
                            this.$service.addLaunchMenu(formData,'保存成功').then(() => {
                                this.showAddDialog = false
                                this.fetchData()
                            })
                        }

                    } else {
                        return false
                    }
                })
            },
            resetForm(formName) {
                debugger
                // this.showAddDialog = false
                this.$refs[formName].resetFields()
            },
            handleEdit (row) {
                this.showAddDialog = true
                this.title = '编辑业务'
                this.currentId = row.biId
                console.log(row.position)
                let a = []
                this.ruleForm = {
                    biId: row.biId,
                    biName: row.biName,
                    positions: a.push(row.position)
                }
                console.log(this.ruleForm.positions)
            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.launch-setting-list
    >>> .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner
        background-color: #409EFF
        border-color: #409EFF
        cursor pointer
    >>> .el-checkbox__input.is-disabled .el-checkbox__inner::after
        cursor pointer
        border-color #fff
.pagination
    float right
    margin 10px 0
.button-group
    margin 20px 0
.el-input-rewrite
    width 80%
</style>
