<template>
    <div>
        <el-dialog
                :title="tagCategory.tagId ? '编辑种类' : '新建种类'"
                :visible.sync="showCreateDialog"
        >
            <GateSchemaForm ref="gForm" @submit="handleSubmit" :schema="schema" v-model="tagCategory">
                <div key="/groupId">
                    <el-input style="display: none"  v-model="tagCategory.groupId" placeholder="请选择父类"></el-input>
                    <el-input   size="small" readonly v-model="parentGroupName" placeholder="请选择父类"></el-input>
                    <el-button  size="small" type="primary" icon="search" @click="selectParent">选择</el-button>
                </div>
                <!--<el-select key="/groupId" :value="tagCategory.groupId" @input="handleInput('/groupId', $event)"   placeholder="请选择">-->
                    <!--<el-option-->
                        <!--v-for="item in tagGroupList"-->
                        <!--:key="item.groupId"-->
                        <!--:label="item.groupName"-->
                        <!--:value="item.groupId"-->
                        <!--:disabled="item.groupId === 79"-->
                    <!--&gt;-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <el-select
                        key="/dataSource"
                        :value="tagCategory.dataSource"
                        @input="handleInput('/dataSource', $event)" placeholder="请选择"
                >
                    <el-option
                            v-for="item in dataSourceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.value == 2"
                    >
                    </el-option>
                </el-select>
                <el-select
                        key="/mapThirdPartyApiField"
                        :value="tagCategory.mapThirdPartyApiField"
                        @input="handleInput('/mapThirdPartyApiField', $event)" placeholder="请选择"
                >
                    <el-option
                            v-for="item in thirdInterfaces"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    >
                    </el-option>
                </el-select>
                <el-select
                        key="/tagType"
                        :value="tagCategory.tagType"
                        :disabled="tagCategory.dataSource === 2"
                        @input="handleInput('/tagType', $event)" placeholder="请选择"
                >
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
        <!--选择父类弹窗-->
        <el-dialog
                title="选择父类"
                :visible.sync="showSelectDialog"
                width="30%"
                class="organSelect"
        >
            <el-tree
                    :data="parentTree"
                    :props="parentProps"
                    accordion
                    @node-click="handleSelectNodeClick">
            </el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="parentSelectCancel">取 消</el-button>
            <el-button type="primary" @click="parentSelectOk">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import _ from '@/gateschema'
export default {
   data() {
       return {
            parentGroupName: '',
            showCreateDialog: false,
            showSelectDialog: false,
            tagCategory: {},
            // tagGroupList: [],
            dataSourceList: [],
            tagTypeList: [],
            parentTree: [],
            currentSelectDada: '',
            parentProps:{
               chilidren:"children",
               label:"groupName"
            },
            hideThirdparam: true,
            thirdInterfaces: []
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
       },
       schema() {
           const isDisabled = this.tagCategory.dataSource === 2 ? true : false
           // const hideThirdparam = this.tagCategory.dataSource === 3 ? false : true
           return  _.map({
                   tagName: _.r.string.other('form', {label: '名称',disabled:isDisabled}),
                   tagKey: _.r
                       .string
                       .pattern(/^[A-Za-z][0-9a-zA-Z_]{0,15}$/)
                       .$msg('字母开头，16位以内字母数字下划线组合')
                       .other('form', {
                           label: '英文名',
                           placeholder: '字母开头，16位以内字母数字组合',
                           disabled:isDisabled
                       }),
                   groupId: _.r.number.other('form', {label: '所属分组'}),
                   tagType: _.r.string.other('form', {label: '类型'}),
                   tagUnit: _.
                   switch('/tagType', [
                       {
                           case: _.value('number'),
                           schema:_.optional.string.pattern(/^[A-Za-z][0-9a-zA-Z]{0,15}$/)
                       },
                       {
                           case: _.any,
                           schema: _.o.other('form', {hidden: true})
                       }
                   ])
                       .other('form', {label: '单位',disabled:isDisabled}),
                   remark: _.o.string.other('form', {label: '备注', type: 'textarea'}),
                   dataSource: _.r.number.other('form', {label: '数据来源'}),
                   mapThirdPartyApiField: _.r.number.other('form', {label: '第三方接口',hidden:this.hideThirdparam}),
                   thirdPartyApiId: _.r.string
                       .pattern(/^[A-Za-z][0-9a-zA-Z_]{0,15}$/)
                       .$msg('字母开头，16位以内字母数字下划线组合')
                       .other('form', {label: '映射字段',hidden:this.hideThirdparam}),
               })
               .other('form', {
                   footer: {
                       showSubmit: true,
                       submitText: '提交'
                   }
               })
       }
   },
   watch: {
       'tagCategory.dataSource':
           function (newVal, oldVal) {
               if(newVal === 3) {this.hideThirdparam = false}
               else {this.hideThirdparam = true}
           },
       currentTagCategory(val) {
            const form = this.$refs.gForm
            if (form) {
                form.activePaths = {}
            }
            this.tagCategory = val ? cloneDeep(val) : {}
            this.getParentInfo()
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
       getDataSourceList () {
           this.$service.getDatasource().then((data) => {
               let arr = Object.keys(data).map(value => ({value: parseInt(value), label:data[value]}))
               this.dataSourceList = arr
           })
       },
       getThirdInterfaces () {
           this.$service.getthirdInterfaceSelectList().then((data) => {
               console.log(data)
               this.thirdInterfaces = data
               // let arr = Object.keys(data).map(value => ({value: parseInt(value), label:data[value]}))
               // this.thirdInterfaces = arr
           })
       },
       // fetchTagCategoryList() {
       //     this.$service.getParentIdList().then((data) => {
       //         this.tagGroupList = data
       //     })
       // },
       selectParent() {
           this.showSelectDialog = true
       },
       getParentInfo() {
           this.$service.getParentIdList().then((data) => {
               const id = this.tagCategory.tagId
               const source = this.tagCategory.dataSource
               if (id && source === 2) {
                   this.parentTree = data
               }else {
                   this.parentTree = data.filter(function (item) {
                       return (item.groupId != 79)
                   })
               }
               const parentId = this.tagCategory.groupId
               if (parentId) {
                   this.$service.findLabelGroupById({ groupId: parentId }).then((detail) => {
                       this.parentGroupName = detail.groupName
                   })

               }else {this.parentGroupName = ''}
           })
       },
       handleSelectNodeClick (node) {
           this.currentSelectDada = node
       },
       parentSelectCancel () {
           this.showSelectDialog = false
       },
       parentSelectOk () {
          this.tagCategory.groupId = this.currentSelectDada.groupId
          this.parentGroupName = this.currentSelectDada.groupName
          this.showSelectDialog = false
       }
   },
   created() {
       this.getDataSourceList()
       this.getThirdInterfaces()
       this.tagCategory = this.currentTagCategory || {}
       this.getParentInfo()
   }
}
</script>
<style scoped lang="stylus">
 .organSelect >>> .is-current
    color:#3980e2
</style>

