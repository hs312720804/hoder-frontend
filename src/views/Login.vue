<template>
<div id="login">
  <!-- {{ formConf }} -->
  <div v-if="!isLogin">
    <el-button type="primary" @click="(isLogin = !isLogin)" class="login-btn">登录</el-button>
    <Parser ref="parserRef" v-if="formConf" :formConf="formConf"  class="parser"></Parser>
  </div>

  <template v-else >
    <span class="web-logo" >
      <img src="../assets/img/logo.png" width="60px" height="60px">
      <img src="../assets/img/logo_text.png" width="95px" height="23px">
    </span>
    <el-row class="login-content">
      <el-col :span="6" :offset="9" class="login-form">
        <!-- <div class="login-logo"></div> -->

        <img src="../assets/img/bg1.jpg" class="login-bg" width="100%" height="100%">

        <p class="title">账号登录</p>
        <c-gate-schema-form ref="loginForm" :schema="formSchema" v-model="user" @submit="handleLogin">
        </c-gate-schema-form>

        <!-- <el-form ref="loginForm" :model="user" :rules="rules">
          <div class="login-title">登陆名称</div>
          <el-form-item label="" style="margin-bottom: 26px;">
            <el-input required v-model="user.username" placeholder="请输入登录名称"></el-input>
          </el-form-item>

          <div class="login-title">登陆密码</div>
          <el-form-item label="">
            <el-input required v-model="user.password" placeholder="请输入登陆密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="login-form__btn" type="primary" size="big" @click="handleLogin()">登录</el-button>
          </el-form-item>
        </el-form> -->

        <el-button class="login-form__btn" style="background-color: #2778FF; height: 45px" type="primary" size="big" @click="$refs.loginForm.handleSubmit()">登录</el-button>
      </el-col>
    </el-row>
  </template>
</div>
</template>

<script>
import _ from 'gateschema'
import axios from 'axios'
import { Parser } from '@ccms/cms-engine'

const schema = _.map({
  username: _.required.$msg('请输入登陆名称').string.other('form', {
    placeholder: '请输入登陆名称',
    label: '登陆名称'
  }),

  password: _.required.$msg('请输入登陆密码').string.other('form', {
    placeholder: '请输入登陆密码',
    type: 'password',
    label: '登陆密码'
  })
}).other('form', {
  cols: {
    label: 10,
    wrapper: 24
  },
  layout: 'vertical'
})
// const schema = _
//   .map({
//     email: _
//       .switch('/phone', [
//         {
//           case: _.required,
//           schema: _.optional
//         },
//         {
//           case: _.any,
//           schema: _.required.$msg('email or phone is required')
//         }
//       ])
//       .string.notEmpty.format('email'),

//     password: _.required.string.notEmpty.other('form', {
//       type: 'password'
//     })

//   })
//   .other('form', {
//     cols: {
//       label: 6,
//       wrapper: 24
//     },
//     layout: 'vertical'
//   })
export default {
  components: {
    Parser
  },
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: { required: true, message: '请输入登录名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' }
      },
      formConf: null,
      isLogin: false
    }
  },
  computed: {
    formSchema () {
      return this.schema || schema
    }
  },
  props: ['schema'],
  created () {
    console.log('created')
    this.getConfig()
  },
  methods: {
    getConfig () {
      const params = {
        uniqueId: '1602187350081798144'
      }
      axios.get('http://172.20.151.197:9080/dev_cms/release/page/info', { params }).then(res => {
        const data = res.data
        if (data.code === 1000) {
          this.formConf = JSON.parse(data.data.config)
        } else {
          this.formConf = null
        }

        console.log('this.formConf-->', this.formConf)
      })
    },
    handleLogin (err) {
      if (err.length === 0) {
        this.$login(this.user).then(() => {
          this.$router.push({
            path: this.$route.query.redirect || '/statisticsHomePage'
          })
        })
      }
    }
    // handleLogin () {
    //   this.$refs['loginForm'].validate((valid) => {
    //     if (valid) {
    //       this.$login(this.user).then(() => {
    //         this.$router.push({
    //           path: this.$route.query.redirect || '/statisticsHomePage'
    //         })
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="stylus" scoped>
.login-content
  height 100%
  display flex
  align-items center
.login-form
  // background-color rgba(0,0,0,.6)
  background-color #fff
  padding 40px
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  width 400px
  margin: 0 auto;
.login-form__btn
  width: 100%
  background-color: #2778FF;
  height: 45px;
  margin-top: 26px
#login
  height 100%
  overflow: auto;
  // background url('../assets/img/bg1.jpg');
  // background-size cover
.login-bg
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  z-index -1

.title
  font-size: 20px;
  // font-family: NotoSansHans-Medium, NotoSansHans;
  font-weight: 600;
  color: #2778FF;
  text-align center
  padding 0 0 19px
  margin-bottom 26px
  margin-top 0
  border-bottom: 1px solid #F2F2F2;
.login-form >>> .el-input--small .el-input__inner
  height 40px
  line-height 32px
.login-logo
  background url(../assets/img/coocaa_logo.png) no-repeat center
  background-size 60%
  height 30px
.login-title
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom 6px
>>>.sf-item__label
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom 6px
  ::before{
    content: ''
  }
>>>.sf-item__label
  margin-bottom 0
.web-logo
  position absolute
  top 18px
  left 36px
  img
    vertical-align middle
.login-btn
  position: absolute;
  z-index: 9999;
  right: 34px;
  top: 14px;
  border-radius: 14px;
</style>
