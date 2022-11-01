<template>
    <div class="addPeoplePosition">
        <div class="title">{{title}}</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="130px">
            <el-form-item label="接口名称" prop="name">
                <el-input v-model="form.name" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="代码" prop="code">
                <el-input v-model="form.code" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="接口地址" prop="reqUri">
                <el-input v-model="form.reqUri" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="reqMethod">
                <el-input v-model="form.reqMethod" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="接口参数" prop="reqParam">
                <el-input v-model="form.reqParam" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="接口固定参数" prop="reqDefaultParamValue">
                <el-input type="textarea" v-model="form.reqDefaultParamValue" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="请求之前处理" prop="reqBefore">
                <el-input type="textarea" v-model="form.reqBefore" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="请求之后处理" prop="resExplain">
                <el-input type="textarea" v-model="form.resExplain" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="是否保持长连接" prop="reqKeepalive">
                <el-radio v-model="form.reqKeepalive" label="true" :disabled="disableValue">是</el-radio>
                <el-radio v-model="form.reqKeepalive" label="false" :disabled="disableValue">否</el-radio>
            </el-form-item>
            <el-form-item label="超时" prop="reqKeepaliveTimeout">
                <el-input v-model="form.reqKeepaliveTimeout" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="连接池" prop="reqKeepalivePool">
                <el-input v-model="form.reqKeepalivePool" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="请求头" prop="reqHeaders">
                <el-input v-model="form.reqHeaders" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="save" v-if="this.mode!= 'read'">保存</el-button>
                <el-button @click="goBack">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import 'async-validate'
export default {
  name: 'thirdInterfaceAdd',
  props: {
    editId: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        name: '',
        code: '',
        reqUri: '',
        reqMethod: '',
        reqParam: '',
        reqDefaultParamValue: '',
        reqBefore: '',
        resExplain: '',
        reqKeepalive: '',
        reqKeepaliveTimeout: '',
        reqKeepalivePool: '',
        reqHeaders: ''
      },
      crowdIds: [],
      title: '',
      disableValue: false,
      rules: {
        name: [
          { required: true, message: '请输入接口名称', trigger: 'blur' },
          { message: '长度小于100个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入接口代码', trigger: 'blur' },
          { pattern: /^[a-zA-Z][a-zA-Z_0-9_]{0,99}$/, message: '100位以内以字母开头的数字和字母下划线组合', trigger: 'blur' }
        ],
        reqUri: [
          { required: true, message: '请输入接口地址', trigger: 'blur' },
          { min: 1, max: 200, message: '长度小于200个字符', trigger: 'blur' }
        ],
        reqMethod: [
          { required: true, message: '请输入请求方法', trigger: 'blur' },
          { min: 1, max: 20, message: '长度小于20个字符', trigger: 'blur' }
        ],
        reqParam: [
          { required: true, message: '请输入接口参数', trigger: 'blur' },
          { min: 1, max: 100, message: '长度小于100个字符', trigger: 'blur' }
        ],
        reqDefaultParamValue: [
          { required: false, message: '请输入接口固定参数', trigger: 'blur' },
          { min: 0, max: 1000, message: '长度小于1000个字符', trigger: 'blur' }
        ],
        reqBefore: [
          { required: false, message: '请输入请求之前处理', trigger: 'blur' }
          // {min: 0, max: 2000, message: '长度小于2000个字符', trigger: 'blur'}
        ],
        resExplain: [
          { required: true, message: '请输入请求之后处理', trigger: 'blur' }
          // {min: 1, max: 2000, message: '长度小于2000个字符', trigger: 'blur'}
        ],
        reqKeepaliveTimeout: [
          { pattern: /^\d+$/, message: '必须输入不小于0的整数', trigger: 'blur' }
        ],
        reqKeepalivePool: [
          { pattern: /^\d+$/, message: '必须输入不小于0的整数', trigger: 'blur' }
        ],
        reqHeaders: [
          { required: false, type: 'string', message: '请输入字符串', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getDetail () {
      this.$service.getThirdInterfaceDetail({ id: this.editId }).then(
        (data) => {
          this.form = data
          // if(this.mode === 'edit') {this.form.id = this.editId}
        }
      )
    },
    // 数组化[{label, value}]
    // _arrayingOption(arr, label, value) {
    //     return arr.reduce((result, item) => {
    //         return result.concat({ label: item[label], value: item[value] })
    //     }, [])
    // },
    goBack () {
      this.$emit('open-list-page')
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.editId === undefined) {
            this.$service.getthirdInterfaceAdd(this.form, '保存成功').then(() => {
              this.$emit('open-list-page')
            })
          } else {
            const submitData = {
              id: this.editId,
              code: this.form.code,
              name: this.form.name,
              reqUri: this.form.reqUri,
              reqMethod: this.form.reqMethod,
              reqParam: this.form.reqParam,
              reqDefaultParamValue: this.form.reqDefaultParamValue,
              reqBefore: this.form.reqBefore,
              resExplain: this.form.resExplain,
              reqKeepalive: this.form.reqKeepalive,
              reqKeepaliveTimeout: this.form.reqKeepaliveTimeout,
              reqKeepalivePool: this.form.reqKeepalivePool,
              reqHeaders: this.form.reqHeaders
            }
            this.$service.getthirdInterfaceEdit(submitData, '修改成功').then(() => {
              this.$emit('open-list-page')
            })
          }
        }
      })
    }
  },
  created () {
    if (this.editId === undefined) {
      this.title = '新增'
      this.form.protocol = 'http'
    } else {
      if (this.mode === 'edit') {
        this.title = '编辑'
        this.getDetail()
      } else {
        this.title = '查看详情'
        this.getDetail()
        this.disableValue = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .addPeoplePosition
        width 80%
        margin-left 20px
    .title
        margin 20px
        font-size 30px
    .example
        font-size 12px
        color #ccc
    .example div
        overflow auto
</style>
