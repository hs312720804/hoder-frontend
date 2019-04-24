<template>
    <el-dialog :title="tag.attrId ? '编辑标签' : '新建标签'" :visible.sync="showCreateDialog">
        <GateSchemaForm ref="gForm" @submit="handleSubmit" :schema="schema" v-model="tag">
        </GateSchemaForm>
    </el-dialog>

</template>

<script>
import _ from '@/gateschema'
export default {
   data() {
       return {
           showCreateDialog: false,
           tag: {
               tagId: undefined,
               tagType: undefined,
               attrName: undefined,
               attrValue: undefined
           },
           schema: _
            .map({
                attrName: _.r.str.other('form', {label: '名称', placeholder: '请输入名称'}),
                attrValue: _.r
                    .switch('/tagType', [
                        {
                            case: _.value('bool'),
                            schema: _.string.enum({
                                'true': 'true',
                                'false': 'false'
                            }).other('form', {label: '值', placeholder: '100位以内字符串'})
                        },
                        {
                            case: _.value('collect'),
                            schema: _.map({
                                ip: _.str.pattern(/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/).$msg('ip地址格式不正确').other('form',{placeholder: '请输入正确的ip地址'}),
                                port:_.str.pattern(/^[0-9]{4}$/).$msg('四位数字组合').other('form',{placeholder: '请输入四位数字端口号'}),
                                password:_.optional.str,
                                timeout:_.str.pattern(/^[0-9]{1,16}$/).$msg('该值为数字').other('form',{placeholder: '请输入以毫秒为单位的延时'}),
                                database:_.str.pattern(/^[0-9]{1,16}$/).$msg('该值为数字').other('form',{placeholder: '请输入数字'}),
                                cid:_.str.pattern(/^[0-9]{1,16}$/).$msg('该值为数字').other('form',{placeholder: '请输入数字'}),
                                ext1:_.optional.str,
                                version:_.optional.str
                            }).other('form', {label: '值'})
                        },
                        {
                            case: _.value('number'),
                            schema: _.string.pattern(/^\d+(\.\d+){1,100}$/).$msg('100位以内的数字').other('form',{label: '值', placeholder: '100位以内的数字'})
                        },
                        {
                            case: _.any,
                            schema: _.string.pattern(/^.{1,100}$/).$msg('100位以内字符串').other('form', {label: '值', placeholder: '100位以内字符串'})
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
           const form = this.$refs.gForm
           if (form) {
               form.activePaths = {}
           }
           this.tag = val || {}
           if (val.attrId != undefined && this.isJson(val.attrValue)) {
               val.attrValue = JSON.parse(val.attrValue)
           }
       }
   },
   methods: {
       handleSubmit(errors) {
           if (errors.length === 0) {
               this.$service.upsertTag(this.getFormData(), '提交成功').then(() => {
                   this.$emit('upsert-end')
                   this.showCreateDialog = false
               })
           }
       },
       getFormData(){
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
           if (typeof str == 'string') {
               try {
                   JSON.parse(str);
                   return true;
               } catch(e) {
                   return false;
               }
           }

       }
   }
}
</script>
