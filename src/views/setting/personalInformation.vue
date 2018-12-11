<template>
    <div class="personalInformation">
        <el-form :label-position="labelPosition" label-width="200px" :model="personalInformation">
            <el-form-item label="账号" prop="id">
                {{personalInformation.id}}
            </el-form-item>
            <el-form-item label="归属机构" prop="officeName">
                {{personalInformation.officeName}}
            </el-form-item>
            <el-form-item label="真实姓名" prop="username">
                <el-input v-model="personalInformation.username" placeholder="如若修改请填写"></el-input>
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
                id: 'liqi@coocaa.com',
                officeName: '研发部',
                username: '',
                mobile: '',
                email: '',

            }
            
        }
    },
    methods: {
        saveInformation: function () {
            alert("保存")
        }
    }
}
</script>
<style scoped>
    .personalInformation{
        width: 500px;
    }
</style>
