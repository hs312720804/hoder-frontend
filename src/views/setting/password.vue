<template>
    <div class="modifyPassword">
        <el-form :label-position="labelPosition" label-width="200px" :model="passwordModify" ref="passwordModify" :rules="rulesPwd">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="passwordModify.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordModify.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input v-model="passwordModify.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="savePassword">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        var validateOldPass = (rule, value, callback) => {
            if (value === ''){
                callback(new Error('请输入原始密码'));
            }else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === ''){
                callback(new Error('请输入密码'));
            }else {
                if (this.passwordModify.newPassword !== ''){
                    this.$refs.passwordModify.validateField('newPassword')
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === ''){
                callback(new Error('请再次输入密码'));
            }else if (value != this.passwordModify.newPassword) {
                callback(new Error('两次输入密码不一致！'));
            }else{
                callback();
            }
        };
        return{
            labelPosition: 'right',
            passwordModify: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rulesPwd: {
                oldPassword: [
                    { validator :validateOldPass, trigger: 'blur'}
                ],
                newPassword: [
                    { validator :validatePass, trigger: 'blur'}
                ],
                confirmPassword: [
                    { validator :validatePass2, trigger: 'blur'}
                ]
            }
            
        }
    },
    methods: {
        savePassword: function () {
            this.$message('保存')
        }

    },
    created: {

    }
}
</script>
<style scoped>
  .modifyPassword{
      width: 500px;
  }
</style>
