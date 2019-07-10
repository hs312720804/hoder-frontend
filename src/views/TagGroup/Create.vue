<template>
    <div>
        <el-dialog
            title="新建分组"
            :visible.sync="showCreateDialog"
        >
            <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="父类" prop="pid">
                    <el-input style="display:none;" v-model="form.pid" placeholder="请选择父类目录"></el-input>
                    <el-input size="small" readonly v-model="parentGroupName" placeholder="请选择父类目录"></el-input>
                    <el-button size="small" type="primary" icon="search" @click="showPidList">选择</el-button>
                    <!--<el-select v-model="form.pid">-->
                        <!--<el-option v-for="item in items" :label="item.groupName" :value="item.groupId" :key="item.groupId"></el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item label="分组名" prop="groupName">
                    <el-input v-model="form.groupName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('form')">提交</el-button>
                    <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--选择父类弹窗-->
        <el-dialog
                title="选择父类"
                :visible.sync="showSelectDialog"
                width="30%"
                class="organSelect"
        >
            <el-button type="text" @click="handleTopMenu">顶级目录</el-button>
            <el-tree
                    :data="parentTree"
                    :props="parentProps"
                    accordion
                    @node-click="handleSelectNodeClick">
            </el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="parentSelectCancel">取 消</el-button>
            <el-button type="primary" @click="parentSelectOk">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
// import _ from '@/gateschema'
export default {
    data() {
        return {
            showCreateDialog: false,
            showSelectDialog: false,
            parentTree: [],
            parentProps:{
                chilidren:"children",
                label:"groupName"
            },
            parentGroupName: '',
            currentSelectDada: '',
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
            },
            selectTop: false
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
                this.parentTree = data
            })
        },
        showPidList () {
            this.showSelectDialog = true
        },
        handleSelectNodeClick (node) {
            this.selectTop = false
            this.currentSelectDada = node
        },
        handleTopMenu(){
            this.selectTop = true
        },
        parentSelectCancel () {
            this.showSelectDialog = false
        },
        parentSelectOk () {
            if(this.selectTop){
                this.form.pid = 0
                this.parentGroupName = '顶级目录'
            }else{
                this.form.pid = this.currentSelectDada.groupId
                this.parentGroupName = this.currentSelectDada.groupName
            }
            this.showSelectDialog = false
        }
    },
    created() {
        this.getPidList()
        this.form.pid = null
        this.form.groupName = null
        this.parentGroupName = null
    }
}
</script>
<style scoped lang="stylus">
    .organSelect >>> .is-current
        color:#3980e2
</style>
