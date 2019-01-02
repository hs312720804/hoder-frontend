<template>
    <div class="personalInformation">
        <el-form :label-position="labelPosition" label-width="200px" :model="personalInformation">
            <el-form-item label="账号" prop="loginName">
                {{personalInformation.loginName}}
            </el-form-item>
            <el-form-item label="归属机构" prop="officeName">
                {{personalInformation.officeName}}
            </el-form-item>
            <el-form-item label="真实姓名" prop="name">
                <el-input v-model="personalInformation.name" placeholder="如若修改请填写"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="personalInformation.mobile" placeholder="如若修改请填写"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="personalInformation.email" placeholder="如若修改请填写"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveInformation">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            labelPosition: 'right',
            personalInformation: {
                loginName: '',
                officeName: '',
                name: '',
                mobile: '',
                email: '',
                id:''

            }
            
        }
    },
    methods: {
        saveInformation: function () {
            const loginName = this.personalInformation.loginName;
            const officeName = this.personalInformation.officeName;
            const name = this.personalInformation.name;
            const mobile = this.personalInformation.mobile;
            const email = this.personalInformation.email;
            const id = this.personalInformation.id
            this.$service.updateUserInformation({id:id,loginName:loginName,officeName:officeName,name:name,mobile:mobile,email:email},"修改成功").then((data)=>{
            })
        }
    },
    created () {
        this.$service.get_user_json().then((data)=>{
            console.log("yonghuxinxi=====");
            console.log(data);
            this.personalInformation=data.user;
            this.personalInformation.id = data.user.id;
        })
    }
}
</script>
<style scoped>
    .personalInformation{
        width: 500px;
    }
</style>
