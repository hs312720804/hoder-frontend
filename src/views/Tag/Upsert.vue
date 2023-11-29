<template>
    <el-dialog
            :title="tag.attrId ? '编辑标签' : '新建标签'"
            :visible.sync="showCreateDialog"
            :append-to-body='true'
    >
        <!-- <c-gate-schema-form ref="gForm" @submit="handleSubmit" :schema="schema" v-model="tag">
        </c-gate-schema-form> -->

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="名称" prop="attrName">
            <el-input v-model="ruleForm.attrName" placeholder="请输入名称" ></el-input>
          </el-form-item>
          <el-form-item label="值" prop="attrValue">
            <el-input v-model="ruleForm.attrValue" placeholder="100位以内字符串" ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">立即创建</el-button>

          </el-form-item>
        </el-form>


    </el-dialog>

</template>

<script>
import _ from '@/gateschema'
export default {
  data () {
    return {
      showCreateDialog: false,
      tag: {
        tagId: undefined,
        tagType: undefined,
        attrName: undefined,
        attrValue: undefined
      },
      ruleForm: {
        attrName: '',
        attrValue: ''
      },
      rules: {
        attrName: { required: true, message: '请输入名称', trigger: ['blur'] },
        attrValue: { required: true, message: '请输入值', trigger: ['blur'] },
      },
      schema: _
        .map({
          attrName: _.r.str.other('form', { label: '名称', placeholder: '请输入名称' }),
          attrValue: _.r
            .switch('/tagType', [
              {
                case: _.value('bool'),
                schema: _.string.enum({
                  true: 'true',
                  false: 'false'
                }).other('form', { label: '值', placeholder: '100位以内字符串' })
              },
              {
                case: _.value('collect'),
                schema: _.map({
                  ip: _.str.pattern(/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/).$msg('ip地址格式不正确').other('form', { placeholder: '请输入正确的ip地址' }),
                  port: _.str.pattern(/^[0-9]{4}$/).$msg('四位数字组合').other('form', { placeholder: '请输入四位数字端口号' }),
                  password: _.optional.str,
                  timeout: _.str.pattern(/^[0-9]{1,16}$/).$msg('该值为数字').other('form', { placeholder: '请输入以毫秒为单位的延时' }),
                  database: _.str.pattern(/^[0-9]{1,16}$/).$msg('该值为数字').other('form', { placeholder: '请输入数字' }),
                  cid: _.str.pattern(/^[0-9]{1,16}$/).$msg('该值为数字').other('form', { placeholder: '请输入数字' }),
                  ext1: _.optional.str,
                  version: _.optional.str
                }).other('form', { label: '值' })
              },
              {
                case: _.value('number'),
                // schema: _.string.pattern(/^\d+(\.\d+){1,100}$/).$msg('100位以内的数字').other('form',{label: '值', placeholder: '100位以内的数字'})
                schema: _.number.pattern(/^.{1,100}$/).$msg('100位以内的数字').other('form', { label: '值', placeholder: '100位以内的数字' })
              },
              {
                case: _.any,
                schema: _.string.pattern(/^.{1,100}$/).$msg('100位以内字符串').other('form', { label: '值', placeholder: '100位以内字符串' })
              }
            ])
        })
        .other('form', {
          footer: {
            showSubmit: true,
            submitText: '提交'
          }
        })
    }
  },
  props: ['currentTag'],
  watch: {
    currentTag: function (val) {
      // const form = this.$refs.gForm
      // if (form) {
      //   form.activePaths = {}
      // }
      this.tag = val || {}
      this.ruleForm = val || {}

      // if (val.attrId != undefined && this.isJson(val.attrValue)) {
      //   val.attrValue = JSON.parse(val.attrValue)
      // }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            tagId: this.tag.tagId
          }
          this.$service.upsertTag(params, '提交成功').then(() => {
            this.$emit('upsert-end')
            this.showCreateDialog = false
          })
        }
      })
    },
    getFormData () {
      const data = JSON.parse(JSON.stringify(this.tag))
      if (typeof data.attrValue === 'object') {
        data.attrValue = JSON.stringify(data.attrValue)
      }
      delete data.tagType
      delete data.createTime
      delete data.updateTime
      return data
    },
    isJson (str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    }
  }
}
</script>
