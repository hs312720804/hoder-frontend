<template>
    <el-row>
        <el-col :span="6" :offset="9" class="login-form">
            <GateSchemaForm ref="loginForm" :schema="formSchema" v-model="user" @submit="handleLogin">
            </GateSchemaForm>
            <el-button 
                class="login-form__btn" 
                type="primary"
                @click="$refs.loginForm.handleSubmit()"
            >
                登录
            </el-button>
        </el-col>
    </el-row>
</template>

<script>
import _ from 'gateschema'
const schema = _
    .map({
        loginName: _
            .required
            .$msg('请输入登录名')
            .string
            .other('form', {
                placeholder: '登录名'
            }),
        password: _
            .required
            .$msg('请输入密码')
            .string
            .other('form', {
                placeholder: '密码',
                type: 'password'
            })
    })
    .other('form', {
        cols: {
            label: 0,
            wrapper: 24
        }
    })
export default {
    data() {
        return {
            user: {
                loginName: '',
                password: ''
            }
        }
    },
    computed: {
        formSchema() {
            return this.schema || schema
        }
    },
    props: ['schema'],
    methods: {
        handleLogin(err) {
            if (err.length === 0) {
                this.$login(this.user).then(() => {
                    this.$router.push({
                        path: this.$route.query.redirect || '/'
                    })
                })
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
.login-form 
    margin-top 50px
.login-form__btn 
    width 100%
</style>