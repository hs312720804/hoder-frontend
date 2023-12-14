<template>
  <div class="row-wrap">
    <!-- 树状图 -->
    <div class="left-block" >
      <!-- <p>使用 scoped slot</p>
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              Delete
            </el-button>
          </span>
        </span>
      </el-tree> -->
      <!-- {{ selectedTreeNode }} -->
      <div>
        权益分类：
        <el-select
          style="margin-bottom: 10px;"
          v-model="selectValue"
          class="inline-input"
          @change="fetchTreeData"
        >
          <el-option
            v-for="item in tabList"
            :key="item.id"
            :label="item.productName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <!-- <el-dropdown>
        <span class="el-dropdown-link">
          权益分类：<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
          v-for="item in tabList"
          :key="item.id"
          :label="item.productName"
          :value="item.id"
          >{{item.productName}}</el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown> -->

      <TreeForm
        ref="treeFormRef"
        :treeData="treeData"
        class="tree-left"
        :limitLevel="limitLevel"
        @treeEdit="handleTreeEdit"
        @treeAdd="handleTreeAdd"
        @treeDelete="handleTreeDelete"
        @treePush="handleTreePush"
        @nodeClick="handleNodeClick"
      >
      </TreeForm>
    </div>

    <div class="detail-table">
      <div class="tip-wrap">

        <!-- {{ selectedTreeNode }} -->
        <i class="el-icon-folder-opened folder"></i>
        策略ID： {{ selectedTreeNodePolicy.policyId }}&nbsp;&nbsp;&nbsp;&nbsp;
        有效期：{{selectedTreeNodePolicy.crowdValidFrom}}  -  {{selectedTreeNodePolicy.crowdValidTo}}
      </div>
      <!-- 表格 -->
      <TableIndex
        ref="tableIndexRef"
        :activeName="activeName"
        :treeData="selectedCopiedTreeData"
        :limitLevel="limitLevel"
        :selectedTreeNode="selectedTreeNode"
        @editCrowd="handleTableEditCrowd"
        @refresh="refreshList"

      >
      </TableIndex>
    </div>
    <el-dialog
      :title="crowdForm.policyId ? '编辑策略组' : '添加策略组'"
      :visible.sync="updatePolicyDialog"
      width="550px"
    >
      <!-- {{ crowdForm }} -->
      <el-form :model="crowdForm" ref="crowdForm" label-width="130px" :rules="rules">
        <el-form-item label="策略组名：" prop="policyName">
            <el-input
              size="small"
              v-model="crowdForm.policyName"
              placeholder="策略组名"
              clearable
            ></el-input>
        </el-form-item>
        <el-form-item label="人群有效区间：" prop="period">
          <el-date-picker
            style="width: 100%;"
            v-model="crowdForm.period"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable>
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button @click="handleSubmit" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`${editRow ? editRow.sourceName : selectedTreeNode.sourceName} - ${editRow ? '编辑': '新增'}子人群`"
      :visible.sync="clientDialogVisible"
      width="1200px"
      v-if="clientDialogVisible"
    >
    <!-- editRow--{{ editRow }} -->
      <createClientDialog
        ref="createClientDialog"
        :selectedTreeNode="selectedTreeNode"
        :selectedTreeNodePolicy="selectedTreeNodePolicy"
        :editRow="editRow">
      </createClientDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clientDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditEntryRule">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="openMoveOrClearDialogVisible"
      width="420px"
      append-to-body
    >
      <div style="display: flex; align-items: center; gap: 10px">
        <i class="el-icon-warning" style="color: #e6a23c; font-size: 24px"></i>
        <span>
          单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="clearBehaviorRulesJson(openMoveOrClearDialogRef); openMoveOrCleardialogVisible = false">不保存</el-button>
        <el-button type="primary" @click="moveToRule(openMoveOrClearDialogRef); openMoveOrCleardialogVisible = false">确定移入</el-button> -->
        <el-button @click="handleClearBehaviorRulesJson">不保存</el-button>
        <el-button type="primary" @click="handleMoveToRule">确定移入</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="showLaunchToBusiness" v-if="showLaunchToBusiness">
      <StrategyPutIn
        :recordId="selectedTreeNode.policyId"
        :tempPolicyAndCrowd="selectedTreeNode"
        @closeDialog="showLaunchToBusiness = false"
        @refreshList="fetchTreeData"
      ></StrategyPutIn>
    </el-dialog>
  </div>
</template>

<script>
import TableIndex from './coms/TableIndex.vue'
import TreeForm from './coms/TreeForm.vue'
import createClientDialog from './coms/createClientDialog.vue'
import { validateRule, moveToRule, clearBehaviorRulesJson } from '@/views/storyLine/validateRuleData.js'
import StrategyPutIn from '../launch/StrategyPutIn'
export default {
  name: 'refinedPeople',
  components: {
    TableIndex,
    TreeForm,
    createClientDialog,
    StrategyPutIn
  },
  props: {
    showSelection: {
      type: Boolean
    },
    currentSelectTag: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

      // 投放--------------
      showLaunchToBusiness: false,
      // 投放 --------------end
      // 弹窗---------------
      updatePolicyDialog: false,
      crowdForm: {
        policyName: '',
        period: []
      },
      rules: {
        policyName: { required: true, message: '请输入', trigger: ['blur'] },
        period: { required: true, type: 'array', message: '请选择', trigger: ['change', 'blur'] }
      },
      // 弹窗---------------end
      selectValue: '',
      treeFlatData: [], // 扁平的树形数据
      treeData: [], // 父子结构的树形数据
      selectedCopiedTreeData: [], // 复制人群弹窗里用的 tree 数据

      limitLevel: 4,
      // 权益列表
      tabList: [{
        label: '爱奇艺',
        value: 'iqiyi'
      }, {
        label: '腾讯',
        value: 'tencent'
      }, {
        label: '优酷',
        value: 'youku'
      }, {
        label: '亲子',
        value: 'parent_child'
      }],
      activeName: 'iqiyi',
      checkList: [],
      tagList: [],
      tempCheckList: [],
      selectedTreeNode: {}, // 点击的树状节点
      selectedTreeNodePolicy: {}, // 点击的树状节点 对应的策略
      // 添加子人群--- start
      clientDialogVisible: false,
      editRow: undefined,
      openMoveOrClearDialogVisible: false,
      openMoveOrClearDialogRef: undefined
      // 添加子人群--- end
    }
  },
  watch: {
    selectedTreeNode: {
      handler (val) {
        // console.log('watch: selectedTreeNode-->', val)
        this.selectedTreeNodePolicy = this.treeFlatData.find(item => {
          return item.id === val.policyId
        })

        // console.log('this.selectedTreeNodePolicy-->', this.selectedTreeNodePolicy)
      }
    }
  },
  methods: {
    refreshList () {
      this.fetchTreeData()
    },
    // 不保存
    handleClearBehaviorRulesJson () {
      // 清空行为标签
      clearBehaviorRulesJson(this.openMoveOrClearDialogRef)
      this.openMoveOrClearDialogVisible = false
    },
    // 确定移入
    handleMoveToRule () {
      moveToRule(this.openMoveOrClearDialogRef)
      this.openMoveOrClearDialogVisible = false
    },
    // 投放
    aaa () {
      this.$service.freshCache({ policyId: this.recordId }).then(() => {
        // this.$emit('closeDialog')
        // this.$emit('refreshList')
        // this.$root.$emit('stratege-list-refresh')
      })
    },
    // ---------- 编辑策略组 start ---------
    // 增加策略组、子人群
    handleTreeAdd (node, data) {
      this.handleNodeClick(node, data)
      // console.log('data-->', data)
      if (data.type === 'root') {
        // 添加策略组
        this.updatePolicyDialog = true
        // 清空表单
        this.$nextTick(() => {
          this.$refs.crowdForm.resetFields()
          // console.log('this.crowdForm-->', this.crowdForm)
        })
        this.crowdForm.policyId = undefined
      } else {
        // 添加子人群
        this.clientDialogVisible = true
        this.editRow = undefined
      }
    },
    // table - 编辑子人群 open 弹窗
    handleTableEditCrowd (row) {
      // 编辑子人群
      this.clientDialogVisible = true
      // console.log('row-->', row)

      this.editRow = {
        isSettingValid: row.isSettingValid,
        policyId: row.policyId,
        isPolicy: false,
        crowdValidFrom: row.crowdValidFrom,
        crowdValidTo: row.crowdValidTo,
        id: row.crowdId,
        sourceName: row.crowdName,
        parentId: row.parentId
      }
    },
    // 编辑策略组、子人群 open 弹窗
    handleTreeEdit (node, data) {
      this.handleNodeClick(node, data)
      // 编辑策略组
      if (data.isPolicy) {
        this.updatePolicyDialog = true

        this.$nextTick(() => {
          // 移除表单项的校验结果
          this.$refs.crowdForm.clearValidate()
        })

        this.crowdForm.policyName = data.sourceName
        this.crowdForm.policyId = data.policyId
        this.crowdForm.period = [data.crowdValidFrom || '', data.crowdValidTo || '']
      } else {
        // 编辑子人群
        this.clientDialogVisible = true
        this.editRow = data
      }
    },
    // 编辑策略组 close
    handleDialogClose () {
      this.updatePolicyDialog = false
    },
    // 新增、编辑策略组 保存
    async handleSubmit () {
      const valid = await this.$refs.crowdForm.validate()
      if (!valid) return
      // 编辑
      if (this.crowdForm.policyId) {
        const params = {
          policyId: this.crowdForm.policyId,
          crowdValidFrom: this.crowdForm.period[0],
          crowdValidTo: this.crowdForm.period[1],
          policyName: this.crowdForm.policyName
        }
        this.$service.policyUpate(params, '编辑成功').then((data) => {
          this.fetchTreeData()
          this.updatePolicyDialog = false
        })
      } else {
        // 新增
        const params = {
          productId: this.selectValue,
          crowdValidFrom: this.crowdForm.period[0],
          crowdValidTo: this.crowdForm.period[1],
          policyName: this.crowdForm.policyName
        }
        this.$service.saveRefinementPolicy(params, '新增成功').then(res => {
          this.fetchTreeData()
          this.updatePolicyDialog = false
        })
      }
    },
    // 新增/编辑添加子人群
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
        if (err.openMoveOrClear) {
          this.openMoveOrClearDialogVisible = true
          this.openMoveOrClearDialogRef = dialogRef
        }
      })
    },
    // 删除 策略组 、子人群
    handleTreeDelete (node, data) {
      // console.log('node-->', node)
      // console.log('data-->', data)
      // this.$confirm('确定要删除吗?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      // 删除 策略组
      if (data.isPolicy) {
        const policyId = data.policyId
        this.$service.policyDel({ policyId }, '删除成功').then(() => {
          // 刷新列表
          this.fetchTreeData()
        })
      } else {
        // 删除子人群
        const crowdId = data.id
        this.$service.strategyCrowdDel({ crowdId }, '删除成功').then(() => {
          // 刷新列表
          this.fetchTreeData()
        })
      }
      // })
    },
    // 投放策略组
    handleTreePush (node, data) {
      this.handleNodeClick(node, data)
      this.showLaunchToBusiness = true
    },
    fetchAddOrEdit (data) {
      const dialogRef = this.$refs.createClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const { rulesJson, behaviorRulesJson } = data

      // const crowdName = dialogRef.form.name // 人群名称
      // const period = dialogRef.form.period // 人群有效区间
      // const isSettingValid = dialogRef.form.isSettingValid // 人群有效区间
      // const autoVersion = dialogRef.form.autoVersion // 是否每日更新
      // const isShowAutoVersion = dialogRef.form.isShowAutoVersion // 是否显示每日更新
      const { name: crowdName, period, isSettingValid, autoVersion, isShowAutoVersion } = dialogRef.form
      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      // 编辑
      if (this.editRow) {
        const { parentId, id, policyId } = this.editRow
        const params = {
        // ...this.editRow,
          crowdId: id,
          policyId,
          // -- 以下是新增参数-----
          crowdValidFrom: period[0] || '',
          crowdValidTo: period[1] || '',
          isSettingValid,
          // -- 以上是新增参数 --
          crowdName,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          link: dialogRef.totalLink,
          autoVersion,
          isShowAutoVersion
        }

        this.$service.crowdUpdate(params).then(() => {
          // 刷新列表
          this.fetchTreeData()
          // 刷新表格
          this.$refs.tableIndexRef.fetchData()
          this.clientDialogVisible = false
        })
      } else {
        // 新增
        const { id, policyId, isPolicy } = this.selectedTreeNode
        const params = {
          policyId,
          parentId: isPolicy ? 0 : id, // 在策略下创建的话，parentId 传 0， 在人群下创建的话，传该人群 id
          // -- 以下是新增参数-----
          crowdValidFrom: period[0] || '',
          crowdValidTo: period[1] || '',
          isSettingValid,
          // --- 以上是新增参数
          crowdName,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          link: dialogRef.totalLink,
          autoVersion,
          isShowAutoVersion
        }

        this.$service.crowdSave(params).then(() => {
          // 刷新列表
          this.fetchTreeData()
          this.clientDialogVisible = false
        })
      }

      // console.log('11111---->', params)
    },
    // ----------编辑策略组 end---------

    // 点击树状节点
    handleNodeClick (node, data) {
      // console.log('node-->', node)
      // console.log('data-->', data)
      if (data.type !== 'root') {
        // 设置选中节点数据
        this.selectedTreeNode = data
      }
    },

    fetchTreeData () {
      const params = {
        productId: this.selectValue || 1
      }
      this.$service.refinementPolicyTree(params).then(res => {
        // const a = [{
        //   id: 6679,
        //   isPolicy: true,
        //   parentId: 0,
        //   policyId: 6679,
        //   sourceName: '精细化人群1'
        // }, {
        //   id: 6689,
        //   isPolicy: false,
        //   parentId: 6679,
        //   policyId: 6689,
        //   sourceName: '子人群'
        // }]
        this.treeFlatData = res
        const root = [{
          id: -1,
          isPolicy: true,
          parentId: 0,
          sourceName: '所有策略',
          children: this.arrayToTree(res || []),
          type: 'root'
        }]

        this.treeData = root
        this.selectedCopiedTreeData = this.arrayToTree(res || [], this.limitLevel - 1)
        // console.log('this.selectedCopiedTreeData-->', this.selectedCopiedTreeData)

        this.$nextTick(() => {
          this.$refs.treeFormRef.$refs.tree.setCurrentKey(this.selectedTreeNode.id)
        })
      })
    },
    refinementPolicyProduct () {
      return this.$service.refinementPolicyProduct().then(res => {
        this.tabList = res || []
        this.selectValue = res[0].id
        return this.selectValue
      })
    },
    //   arrayToTree (arr, limitLevel) {
    //     // limitLevel - 超过这个层级的就不展示了；如果未定义的话，就不限制
    //     const arrCopy = JSON.parse(JSON.stringify(arr))

    //     return arrCopy.filter(item => {
    //       if (item.parentId === 0) item.level = 1

    //       item.children = arrCopy.filter(item2 => {
    //         if (item2.parentId === item.id) {
    //           if (item2.id === 21529) {
    //             debugger
    //             console.log('item.level-->', item)
    //             console.log('item.level-->', item.level)
    //           }
    //           item2.level = item.level ? item.level + 1 : undefined
    //         }
    //         return item2.parentId === item.id && (!limitLevel || (item2.level <= limitLevel && limitLevel))
    //       })

    //       return item.parentId === 0 && (!limitLevel || (item.level <= limitLevel && limitLevel))
    //     })
    //   }
    // },
    arrayToTree (arr, limitLevel) {
      // limitLevel - 超过这个层级的就不展示了；如果未定义的话，就不限制
      const arrCopy = JSON.parse(JSON.stringify(arr))

      function getChildByParentId (parentId, level) {
        if (level > limitLevel) { return [] }// 超过这个层级的就不展示了
        return arrCopy.reduce((prev, item) => {
          if (item.parentId === parentId) {
            item.level = level
            item.children = getChildByParentId(item.id, level + 1)
            prev.push(item)
          }
          return prev
        }, [])
      }

      return getChildByParentId(0, 1)
    }
  },
  async created () {
    // 权益
    await this.refinementPolicyProduct()
    // 树形的数据
    this.fetchTreeData()
  }
}
</script>

<style lang="stylus" scoped>
.row-wrap {
  display flex
  column-gap: 20px;
  height: 80vh;
  position: relative;
  top: 0;
}
.left-block {
  max-width: 500px;
  flex: 0 0 500px;
  position: relative;
  box-shadow: 20px 0px 23px -13px hsl(0deg 0% 93.06%)
  // box-shadow: inset -1px 0 0 #e7e7e7;
}
// .custom-tree-node {
//   display: flex;
//   align-items: center;
//   flex: 1;
//   justify-content: space-between;
//   font-size: 14px;
//   padding-right: 8px;
// }
.detail-table {
  flex: 1;
  width: 50%;
}
.tip-wrap {
  margin-bottom: 20px;
  color: rgba(0,0,0,0.65);
  font-size: 14px;
  line-height: 34px;
  padding: 1px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 4px solid #50bfff;
}
.tree-left {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 44px;
  overflow: auto;
}
</style>
