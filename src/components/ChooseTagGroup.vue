<template>
    <div>
        <el-dialog
                title="复制标签"
                :visible.sync="showCreateDialog"
        >
            <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                <el-form-item label="父类" prop="pid">
                    <el-input style="display:none;" v-model="form.pid" placeholder="请选择父类目录"></el-input>
                    <el-input size="small" readonly v-model="parentGroupName" placeholder="请选择父类目录"></el-input>
                    <el-button size="small" type="primary" icon="search" @click="showPidList">选择</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
                    <el-button type="primary" @click="handleCancel()">取消</el-button>
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
    export default {
        data() {
            return {
                showCreateDialog: false,
                showSelectDialog: false,
                parentTree: [],
                parentProps:{
                    children:"children",
                    label:"groupName"
                },
                parentGroupName: '',
                currentSelectDada: '',
                tagGroup: {},
                items: [],
                form: {
                    pid: '',
                },
                rules: {
                    pid: [
                        { required: true, message: '请选择父类', trigger: 'change' },
                    ]
                },
                selectTop: false
            }
        },
        methods: {
            handleSubmit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$emit('saveCopyTag', this.form.pid)
                    } else {
                        return false
                    }
                })
            },
            handleCancel () {
                this.showCreateDialog = false
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
            this.parentGroupName = null
        }
    }
</script>
<style scoped lang="stylus">
    .organSelect >>> .is-current
        color:#3980e2
</style>
