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
                attrName: _.str.other('form', {label: '名称'}),
                attrValue: _.str.other('form', {label: '值'})
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
               this.$service.upsertTag(this.tag, '提交成功').then(() => {
                   this.$emit('upsert-end')
                   this.showCreateDialog = false
               })
           }
       }
   }
}
</script>
