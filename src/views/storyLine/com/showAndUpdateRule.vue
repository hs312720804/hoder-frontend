<template>
<!-- 出入口条件展示、编辑出入口条件；新增出入口条件 -->
<div style="display: flex; flex: 1;">
  <template v-if="mode !== 'showAddDialog'">
    <!-- 显示 rule 条件 -->
    <div class="border-line" style="position: relative;">
      <div class="outer-and" v-if="ruleItem.rulesJson && JSON.parse(ruleItem.rulesJson).rules.length > 0 && ruleItem.behaviorRulesJson && JSON.parse(ruleItem.behaviorRulesJson).rules.length > 0">
        <span class="and-or" :class="ruleItem.link === 'OR' ? 'OR': ''" >
        {{ ruleItem.link === 'OR' ? '或' : '且' }}
        </span>
      </div>
      <div
        v-else-if="(ruleItem.rulesJson && JSON.parse(ruleItem.rulesJson).rules.length === 0) && (ruleItem.behaviorRulesJson && JSON.parse(ruleItem.behaviorRulesJson).rules.length === 0)">
        暂无数据
      </div>
      <!-- {{ conditionEnum }}
      {{ soureceSignList }} -->
      <!-- {{ruleItem.rulesJson}} -->
      <!-- {{ JSON.parse(ruleItem.rulesJson).rules }} -->
      <!-- ( 有效混合源爱奇艺影视会员 = true 且 芯片型号 = 6A848,RTD2982DQ 且 存储 = 4G,8G ) -->
      <template v-if="ruleItem.rulesJson && JSON.parse(ruleItem.rulesJson).rules.length > 0">
        <span class="border-title">普通标签</span>
        <div class="rule-string">
          <div>
            <ShowRule
              :rulesJson="JSON.parse(ruleItem.rulesJson)"
              :conditionEnum="conditionEnum"
              :soureceSignList="soureceSignList"
            >
            </ShowRule>

          </div>
        </div>
      </template>

      <template  v-if="ruleItem.behaviorRulesJson && JSON.parse(ruleItem.behaviorRulesJson).rules.length > 0">
        <span class="border-title">行为标签</span>
        <!-- {{ruleItem.behaviorRulesJson}} -->
        <div class="rule-string bav-wrap">
          <template>
            <MultipleActionTagSelect
              ref="multipleActionTagSelect"
              :isView="true"
              :behaviorRulesJson="JSON.parse(ruleItem.behaviorRulesJson)"
            ></MultipleActionTagSelect>
          </template>
          <!-- <div v-else class="no-data-text">暂无</div> -->
        </div>
      </template>

    </div>
    <!-- 入口条件 编辑、删除 -->
    <template v-if="ruleItem.ruleType === 'entry'">
      <div v-if="havePermissionsToUse" class="drop-class" >
        <el-dropdown @command="handleCommand" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" >
          <span class="el-dropdown-link" >
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" :command="['editEntry', ruleItem]">
              编辑
            </el-dropdown-item>
            <el-dropdown-item class="clearfix" :command="['deleteEntry', ruleItem]">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </template>
    <!-- 出口条件 编辑、删除 -->
    <template v-else>

      <!-- 选择了转接待员 -->
      <div class="turn-servicer" v-if="ruleItem.stopType === 1">
        转
        <el-button type="text" @click="redirctByNextId(ruleItem.nextId)">{{ getServicerBynextId(ruleItem.nextId).receptionist }} </el-button>
      </div>
      <div v-else class="turn-servicer">{{ getStopTypeName(ruleItem.stopType)}}</div>
      <div v-if="(!isCopiedServicer || ruleItem.stopType === 1) && canUse"  class="drop-class">
      <!-- <div v-if="(!isCopiedServicer || ruleItem.stopType === 1)" class="drop-class"> -->
        <el-dropdown @command="handleCommandExport" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom">
          <span class="el-dropdown-link">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix" :command="['editExport', ruleItem]">
              编辑
            </el-dropdown-item>
            <el-dropdown-item class="clearfix" :command="['deleteExport', ruleItem]" v-if="havePermissionsToUse">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div v-if="ruleItem.stopType === 1 && !ruleItem.nextId" style="color: red;">
        <i class="el-icon-warning"></i>
        <span style="font-size: 12px; margin-left: 5px">下一步不可为空</span>
      </div>
    </template>
  </template>

  <el-dialog
    :title="(editClientRow ? '编辑' : '新建')+ '入口条件'"
    :visible.sync="clientDialogVisible"
    width="1200px"
    v-if="clientDialogVisible"
  >
  <!-- {{ editClientRow }} -->
    <createClientDialog ref="createClientDialog" :editRow="editClientRow" :options="options"></createClientDialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clientDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditEntryRule">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    :title="(editExportRow ? '编辑' : '新建')+ '出口条件'"
    :visible.sync="exportDialogVisible"
    width="1200px"
    v-if="exportDialogVisible"
  >
    <createClientDialog
      ref="exportClientDialog"
      :editRow="editExportRow"
      type="export"
      :servicerListFilterSelect="servicerListFilterSelect"
      :options="options"
    ></createClientDialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="exportDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditExportRule">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="编辑复用出口条件"
    :visible.sync="reuseExportDialogVisible"
    width="700px"
    v-if="reuseExportDialogVisible"
  >
    <el-form
      :model="reuseForm"
      :rules="reuseFormRules"
      ref="form"
      label-width="100px"
    >
      <!-- 只有出口条件选择 -->
      <el-form-item label="处理操作" prop="stopType" class="inline-form-item">
        <el-select v-model="reuseForm.stopType" clearable @change="handleStopTypeChange" disabled>
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value">
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>

        <!-- 正确，下一步  选择同一场景下其他接待员 -->
      <el-form-item v-if="reuseForm.stopType === 1" prop="nextId" class="inline-form-item" style="margin-left: -100px;">
        <el-select v-model="reuseForm.nextId" clearable placeholder="请选择流转接待员">
          <el-option
            v-for="item in servicerListFilterSelect"
            :label="item.receptionist"
            :value="item.crowdId"
            :key="item.crowdId">
            {{ item.receptionist }}
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reuseExportDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="reuseExportRule">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/IndexForStoryLine.vue'
import ShowRule from '@/views/storyLine/com/ShowRule.vue'
import createClientDialog from '@/views/storyLine/createClientDialog.vue'
import { options } from '@/views/storyLine/utils'
import { validateRule, moveToRule, clearBehaviorRulesJson } from '@/views/storyLine/validateRuleData.js'

export default {
  components: {
    MultipleActionTagSelect,
    ShowRule,
    createClientDialog
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    havePermissionsToUse: {
      type: Boolean,
      default: false
    },
    isCopiedServicer: {
      type: Boolean,
      default: false
    },
    canUse: {
      type: Boolean,
      default: false
    },
    ruleItem: {
      type: Object,
      default: () => {}
    },
    conditionEnum: {
      type: Object,
      default: () => {}
    },
    soureceSignList: {
      type: Array,
      default: () => []
    },
    servicer: {
      type: Array,
      default: () => []
    },
    servicerListFilterSelect: {
      type: Array,
      default: () => []
    },
    selectedScene: {
      type: Object,
      default: () => {}
    },
    selectedServicer: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      options: options,
      editClientRow: {},
      editExportRow: {},
      exportDialogVisible: false,
      clientDialogVisible: false,
      reuseExportDialogVisible: false,
      reuseForm: {
        stopType: '',
        nextId: ''
      },
      reuseFormRules: {
        stopType: [{ required: true, message: '请选择', trigger: 'change' }],
        nextId: [{ required: true, message: '请选择流转接待员', trigger: 'change' }]
      }
    }
  },
  computed: {

  },
  created () {

  },
  methods: {
    // 编辑复用出口条件
    reuseExportRule () {
      // this.editExportRow = row
      // if (this.isCopiedServicer) {
      //   this.reuseForm.stopType = row.stopType
      //   this.reuseForm.nextId = row.nextId || ''
      console.log('reuseForm--->', this.reuseForm)
      console.log('selectedServicer--->', this.selectedServicer)
      console.log('editExportRow--->', this.editExportRow)
      const parmas = {
        nId: this.selectedServicer.id,
        oId: this.selectedServicer.referenceId,
        exportId: this.editExportRow.id,
        ...this.reuseForm
      }
      this.$service.updateExport(parmas).then(res => {
        // 刷新列表
        this.$emit('updataExportList')
        // 流转关系图
        // this.getFlowChart()
        this.reuseExportDialogVisible = false
      })
    },
    // 新增/编辑入口条件
    addOrEditEntryRule () {
      const dialogRef = this.$refs.createClientDialog
      // 普通标签规则
      const rulesJson = dialogRef.rulesJson
      // 行为标签规则
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      // 流转条件规则
      const flowCondition = dialogRef.flowCondition

      // 校验规则
      const validPromise = validateRule(dialogRef, rulesJson, behaviorRulesJson, flowCondition)

      validPromise.then(data => {
        this.fetchAddOrEdit(data)
      }).catch(err => {
        console.log('err-->', err)
        if (err.openMoveOrClear) {
          this.$confirm('单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?', '提示', {
            confirmButtonText: '确定移入',
            cancelButtonText: '不保存',
            type: 'warning'
          }).then(() => {
            moveToRule(dialogRef)
          }).catch(() => {
            // 清空行为标签
            clearBehaviorRulesJson(dialogRef)
          })
        }
      })
    },
    // // 单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏
    // // 移入
    // moveToRule (dialogRef) {
    //   // const dialogRef = this.$refs.createClientDialog
    //   // 将行为标签挪进设置标签栏
    //   const behaviorRulesJsonRules = dialogRef.behaviorRulesJson.rules || []
    //   dialogRef.rulesJson.rules = dialogRef.rulesJson.rules.concat(behaviorRulesJsonRules)
    //   const actionTags = dialogRef.actionTags
    //   const cacheIds = []
    //   actionTags.forEach(item => {
    //     // 获取大数据标签
    //     if ((item.dataSource !== 8) && (item.tagType === 'string' || item.tagType === 'collect')) {
    //       cacheIds.push(item.tagId)
    //     }
    //   })
    //   if (cacheIds.length > 0) {
    //     cacheIds.forEach(dialogRef.$refs.MultipleSelectRef.fetchTagSuggestions)
    //   }
    //   // 清空行为标签
    //   this.clearBehaviorRulesJson()
    // },
    // // 单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏
    // // 不移入 - 清空行为标签
    // clearBehaviorRulesJson (dialogRef) {
    //   // const dialogRef = this.$refs.createClientDialog
    //   dialogRef.behaviorRulesJson = { link: 'AND', condition: 'OR', rules: [] }
    // },
    fetchAddOrEdit (data) {
      const dialogRef = this.$refs.createClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const { rulesJson, behaviorRulesJson } = data

      const autoVersion = dialogRef.form.autoVersion // 是否每日更新
      const isShowAutoVersion = dialogRef.form.isShowAutoVersion // 是否显示每日更新

      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      let params = {}
      if (this.editClientRow) {
        params = {
          ...this.editClientRow,
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink,
          autoVersion,
          isShowAutoVersion
        }
      } else {
        params = {
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink,
          autoVersion,
          isShowAutoVersion
        }
      }
      this.$service.addEntry(params, '添加成功').then(res => {
        // 刷新列表
        this.$emit('updataEntryList')
        // this.getEntryListByReceptionistId()
        this.clientDialogVisible = false
      })
    },
    // 新增、编辑出口条件
    addOrEditExportRule () {
      const dialogRef = this.$refs.exportClientDialog
      // 普通标签规则
      const rulesJson = dialogRef.rulesJson
      // 行为标签规则
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      // 流转条件规则
      const flowCondition = dialogRef.flowCondition

      // saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit2, flowCondition)

      // 校验规则
      const validPromise = validateRule(dialogRef, rulesJson, behaviorRulesJson, flowCondition)

      validPromise.then(data => {
        this.fetchAddOrEdit2(data)
      }).catch(err => {
        console.log('err-->', err)
        if (err.openMoveOrClear) {
          this.$confirm('单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?', '提示', {
            confirmButtonText: '确定移入',
            cancelButtonText: '不保存',
            type: 'warning'
          }).then(() => {
            moveToRule(dialogRef)
          }).catch(() => {
            // 清空行为标签
            clearBehaviorRulesJson(dialogRef)
          })
        }
      })
    },
    // 新增、编辑出口条件
    fetchAddOrEdit2 (data) {
      const dialogRef = this.$refs.exportClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      // debugger
      // const tagList = dialogRef.tags.map(item => item.tagId)
      // const tagIds = tagList.join(',')

      const { rulesJson, behaviorRulesJson } = data

      const stopType = dialogRef.form.stopType // 处理操作
      const nextId = dialogRef.form.nextId // 流转接待员
      const autoVersion = dialogRef.form.autoVersion // 是否每日更新
      const isShowAutoVersion = dialogRef.form.isShowAutoVersion // 是否显示每日更新

      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      // let params = {}

      let params = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionistId: this.selectedServicer.id,
        tagIds,
        rulesJson,
        behaviorRulesJson,
        flowCondition, // 流转指标
        delFlag: 1,
        link: dialogRef.totalLink,
        stopType,
        nextId,
        autoVersion,
        isShowAutoVersion
      }
      if (this.editExportRow) { // 编辑
        const defaultData = { ...this.editExportRow }
        params = Object.assign(defaultData, params)
      }

      this.$service.addExport(params, '添加成功').then(res => {
        this.$emit('updataExportList')
        // 刷新列表
        // this.$emit('updataExportList')
        // // 刷新流转关系图
        // this.getFlowChart()
        // this.getExportListByReceptionistId()
        this.exportDialogVisible = false
      })
    },
    getStopTypeName (val) {
      if (val === 2) {
        return '已转化'
      } else if (val === 4) {
        return '不感兴趣'
      }
    },
    redirctByNextId (id) {
      const servicer = this.getServicerBynextId(id)
      // 选择接待员
      this.$emit('selectServicer', servicer.id)
      // this.selectServicer(servicer.id)
    },
    // 根据crowdId 获取名称
    getServicerBynextId (id) {
      const obj = this.servicer.find(item => item.crowdId === id)
      return obj || {}
    },
    handleCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'editEntry') {
        this.editEntry(row)
      } else if (type === 'deleteEntry') {
        this.deleteEntry(row)
      }
    },
    // 编辑入口
    editEntry (row) {
      this.editClientRow = row
      this.clientDialogVisible = true
    },
    // 删入口
    deleteEntry (row) {
      this.$confirm('此操作将永久删除该入口条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addEntry({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.$emit('updataEntryList')
          // this.getEntryListByReceptionistId()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCommandExport (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'editExport') {
        this.editExport(row)
      } else if (type === 'deleteExport') {
        this.deleteExport(row)
      }
    },
    // 编辑出口
    editExport (row) {
      this.editExportRow = row
      if (this.isCopiedServicer) { // 编辑复用接待员的
        this.reuseForm.stopType = row.stopType
        this.reuseForm.nextId = row.nextId || ''
        this.reuseExportDialogVisible = true
      } else {
        this.exportDialogVisible = true
      }
    },
    // 删除出口
    deleteExport (row) {
      this.$confirm('此操作将永久删除该出口条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addExport({ ...row, delFlag: 2 }, '删除成功').then(res => {
          this.$emit('updataExportList')
          // // 刷新列表
          // this.$emit('updataExportList')
          // // 刷新流转关系图
          // this.getFlowChart()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../sty/common.styl'
@import '../sty/dark.styl'
@import '../sty/light.styl'
</style>
