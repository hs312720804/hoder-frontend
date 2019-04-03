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
                            }).other('form', {label: '值', placeholder: '16位以内字母数字组合'})
                        },
                        {
                            case: _.value('collect'),
                            schema: _.map({
                                ip: _.str,
                                port:_.str,
                                password:_.optional.str,
                                timeout:_.str,
                                database:_.str,
                                cid:_.str,
                                ext1:_.optional.str,
                                ext2:_.optional.str
                            }).other('form', {label: '值'})
                        },
                        {
                            case: _.any,
                            schema: _.string.pattern(/^[0-9A-Za-z]{1,16}$/).$msg('16位以内字母数字组合').other('form', {label: '值', placeholder: '16位以内字母数字组合'})
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
