<template>
<div id="login">
  <el-row class="login-content">
    <el-col :span="6" :offset="9" class="login-form">
      <div class="login-logo"></div>
      <p class="title">人群策略平台</p>
      <GateSchemaForm ref="loginForm" :schema="formSchema" v-model="user" @submit="handleLogin">

      </GateSchemaForm>
      <el-button class="login-form__btn" type="primary" size="big" @click="$refs.loginForm.handleSubmit()">登录</el-button>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import _ from "gateschema";
const schema = _.map({
  username: _.required.$msg("请输入登录名").string.other("form", {
    placeholder: "登录名"
  }),
  password: _.required.$msg("请输入密码").string.other("form", {
    placeholder: "密码",
    type: "password"
  })
}).other("form", {
  cols: {
    label: 0,
    wrapper: 24
  }
});
export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    };
  },
  computed: {
    formSchema() {
      return this.schema || schema;
    }
  },
  props: ["schema"],
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
};
</script>
<style lang="stylus" scoped>
.login-content
  height 100%
  display flex
  align-items center
.login-form
  background-color rgba(0,0,0,.6)
  padding 30px
.login-form__btn
  width: 100%
#login
  height 100%
  background url('../assets/img/bg1.jpg');
  background-size cover
.title
   font-family 'Niconne'
   font-size 24px
   color #fff
   text-align center
   margin 10px
.login-form >>> .el-input--small .el-input__inner
    height 40px
    line-height 32px
.login-logo
  background url(../assets/img/coocaa_logo.png) no-repeat center
  background-size 60%
  height 30px


</style>
