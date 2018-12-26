<template>
    <el-dialog
        title="新建分组"
        :visible.sync="showCreateDialog"
    >
        <GateSchemaForm 
            ref="create-form" 
            :schema="schema" 
            v-model="tagGroup"
            @submit="handleSubmit"
        >
        </GateSchemaForm>
    </el-dialog>
</template>
<script>
import _ from '@/gateschema'
export default {
    data() {
        return {
            showCreateDialog: false,
            tagGroup: {},
            schema: _
                .map({
                    groupName: _.r.str.other('form', {label: '分组名'})
                })
                .other('form', {
                    footer: {
                        showSubmit: true,
                        submitText: '提交'
                    }
                })
        }
    },
    methods: {
        handleSubmit(errors) {
            if (errors.length === 0) {
                this.$service.createTagGroup(this.tagGroup, '新建分组成功').then(() => {
                    this.showCreateDialog = false
                    this.$emit('create-end')
                })
            }
        }
    }
}
</script>
