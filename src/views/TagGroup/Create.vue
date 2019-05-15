<template>
    <el-dialog
        title="新建分组"
        :visible.sync="showCreateDialog"
    >
        <el-form :model="form" ref="form" :rules="rules" label-width="100px">
            <el-form-item label="父类" prop="pid">
                <el-select v-model="form.pid">
                    <el-option v-for="item in items" :label="item.groupName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分组名" prop="groupName">
                <el-input v-model="form.groupName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit('form')">提交</el-button>
                <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
            </el-form-item>
        </el-form>
        <!--<GateSchemaForm-->
            <!--ref="create-form"-->
            <!--:schema="schema"-->
            <!--v-model="tagGroup"-->
            <!--@submit="handleSubmit"-->
        <!--&gt;-->
        <!--</GateSchemaForm>-->
    </el-dialog>
</template>
<script>
// import _ from '@/gateschema'
export default {
    data() {
        return {
            showCreateDialog: false,
            tagGroup: {},
            items: [],
            form: {
                pid: '',
                groupName: ''
            },
            rules: {
                pid: [
                    { required: true, message: '请选择父类', trigger: 'change' },
                ],
                groupName: [
                    { required: true, message: '请填写分组名', trigger: 'blur' }
                ],
            }
            // schema: _
            //     .map({
            //         groupName: _.r.str.other('form', {label: '分组名'})
            //     })
            //     .other('form', {
            //         footer: {
            //             showSubmit: true,
            //             submitText: '提交'
            //         }
            //     })
        }
    },
    methods: {
        handleSubmit(form) {
            this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$service.createTagGroup(this.form, '新建分组成功').then(() => {
                            console.log(this.form)
                            this.showCreateDialog = false
                            this.$emit('create-end')
                        })
                    } else {
                        return false
                    }
            // if (errors.length === 0) {
            //     this.$service.createTagGroup(this.tagGroup, '新建分组成功').then(() => {
            //         this.showCreateDialog = false
            //         this.$emit('create-end')
            //     })
            // }
            })
        },
        getPidList () {
            this.$service.getParentIdList().then((data) => {
                console.log(data)
                this.items = data
            })
        }
    },
    created() {
        this.getPidList()
    }
}
</script>
