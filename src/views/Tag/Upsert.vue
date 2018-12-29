<template>
    <el-dialog :title="tag.attrId ? '编辑标签' : '编辑标签'" :visible.sync="showCreateDialog">
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
           },
           schema: _
            .map({
                attrName: _.r.str.other('form', {label: '名称', placeholder: '请输入名称'}),
                attrValue: _.r.str.pattern(/^[0-9A-Za-z]{1,16}$/).$msg('16位以内字母数字组合').other('form', {label: '值', placeholder: '16位以内字母数字组合'})
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
       currentTag(val) {
            const form = this.$refs.gForm
            if (form) {
                form.activePaths = {}
            }
            this.tag = val || {} 
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
           delete data.createTime
           delete data.updateTime
           return data
       }
   }
}
</script>
