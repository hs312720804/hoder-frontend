<template>
    <el-dialog :title="tagCategory.tagId ? '编辑种类' : '新建种类'" :visible.sync="showCreateDialog">
        <GateSchemaForm ref="gForm" @submit="handleSubmit" :schema="schema" v-model="tagCategory">
            <el-select key="/groupId" :value="tagCategory.groupId" @input="handleInput('/groupId', $event)"   placeholder="请选择">
                <el-option
                    v-for="item in tagGroupList"
                    :key="item.groupId"
                    :label="item.groupName"
                    :value="item.groupId"
                    :disabled="item.groupId === 79"
                >
                </el-option>
            </el-select>
            <el-select key="/tagType" :value="tagCategory.tagType" @input="handleInput('/tagType', $event)" placeholder="请选择">
                <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </GateSchemaForm>
    </el-dialog>
</template>
<script>
import { cloneDeep } from 'lodash'
import _ from '@/gateschema'
export default {
   data() {
       return {
            showCreateDialog: false,
            tagCategory: {},
            tagGroupList: [],
            tagTypeList: [],
            schema: _
            .map({
                tagName: _.r.string.other('form', {label: '名称'}),
                tagKey: _.r
                    .string
                    .pattern(/^[A-Za-z][0-9a-zA-Z]{0,15}$/)
                    .$msg('字母开头，16位以内字母数字组合')
                    .other('form', {
                        label: '英文名',
                        placeholder: '字母开头，16位以内字母数字组合'
                    }),
                groupId: _.r.number.other('form', {label: '所属分组'}),
                tagType: _.r.string.other('form', {label: '类型'}),
                tagUnit: _.
                    switch('/tagType', [
                        {
                            case: _.value('number'),
                            schema: _.r
                        },
                        {
                            case: _.any,
                            schema: _.o.other('form', {hidden: true})
                        }
                    ])
                    .string.other('form', {label: '单位'}),
                remark: _.o.string.other('form', {label: '备注', type: 'textarea'})
            })
            .other('form', {
                footer: {
                    showSubmit: true,
                    submitText: '提交'
                }
            })
       }
   },
   props: ['typeEnum', 'currentTagCategory'],
   computed: {
       typeList() {
           const typeEnum = this.typeEnum || {}
           return Object.keys(typeEnum).map((key) => {
                return {
                    label: typeEnum[key],
                    value: key
                }
            })
       }
   },
   watch: {
       currentTagCategory(val) {
            const form = this.$refs.gForm
            if (form) {
                form.activePaths = {}
            }
            this.tagCategory = val ? cloneDeep(val) : {}
            this.fetchTagCategoryList()
       }
   },
   methods: {
       handleInput(path, value) {
           this.$refs.gForm.handleUserInput(path, value)
       },
       handleSubmit(errors) {
           if (errors.length === 0) {
               this.$service.upsertTagCategory(this.getFormData(), '提交成功').then(() => {
                   this.$emit('upsert-end')
                   this.showCreateDialog = false
               })
           }
       },
       getFormData(){
           const data = JSON.parse(JSON.stringify(this.tagCategory))
           delete data.createTime
           delete data.updateTime
           return data
       },
       fetchTagCategoryList() {
           // debugger
           // this.$service.getTagGroupList().then((data) => {
           //     this.tagGroupList = data
           // })
           this.$service.getParentIdList().then((data) => {
               this.tagGroupList = data
           })
       }
   },
   created() {
        this.tagCategory = this.currentTagCategory || {}
        this.fetchTagCategoryList()
   }
}
</script>

