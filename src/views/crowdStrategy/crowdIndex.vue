<template>
  <div>
    <!-- @editDynamicPeopleSetting="editDynamicPeopleSetting"
    @editDynamicPeopleConditions="editDynamicPeopleConditions"
    @addDynamicCrowd="addDynamicCrowd" -->
    <crowd-list
      v-show="isShowCrowdList"
      ref="list"
      :selectRow="selectRow"
      @goBack="goBackFirstLayer"
      @addCrowd="addCrowd"
      @addLinkCrowd="openAddLinkCrowd"
      @editABCrowd="editABCrowd"
      @getBigCrowdId="getBigCrowdId"
      @handleDynamicTest="handleDynamicTest"
    ></crowd-list>
    <CrowdAdd
      v-if="!isShowCrowdList && !isAbTest && mode === ''"
      :crowd="crowd"
      :isDynamicPeople="isDynamicPeople"
      :crowdId="crowdId"
      :policyId="selectRow.policyId"
      :limitLaunchDisabled="effectCrowd"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </CrowdAdd>

    <!-- 编辑AB人群 -->
    <div v-if="!isShowCrowdList && isAbTest && mode === 'editABTest'">
      <el-tabs v-model="tabSet" type="card">
        <el-tab-pane label="编辑人群条件" name="first">
          <crowd-add
            :crowd="crowd"
            :crowdId="crowdId"
            :policyId="selectRow.policyId"
            :limitLaunchDisabled="effectCrowd"
            @goBackCrowdListPage="goBackCrowdListPage"
          >
          </crowd-add>
        </el-tab-pane>
        <el-tab-pane label="编辑AB子人群" name="second">
          <crowd-a-b-add
            :crowd="crowd"
            :mode="isAbTest ? 'editABTest' : ''"
            @goBackCrowdListPage="goBackCrowdListPage"
          ></crowd-a-b-add>
        </el-tab-pane>
      </el-tabs>
    </div>
    <crowd-a-b-add
      v-if="!isShowCrowdList && mode === 'addABTest'"
      @goBackCrowdListPage="goBackCrowdListPage"
      :crowd="crowd"
    ></crowd-a-b-add>

    <!-- 动态人群设置
    <dynamic-people-setting
      v-if="!isShowCrowdList && mode === 'step2'"
      :policyId="policyId"
      :policyName="policyName"
      :crowdId="crowdId"
      dynamicMode="editSingle"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </dynamic-people-setting>

    设置流转条件
    <dynamic-people-conditions
      v-if="!isShowCrowdList && mode === 'step3'"
      :policyId="policyId"
      :policyName="policyName"
      :crowdId="crowdId"
      dynamicMode="editSingle"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </dynamic-people-conditions>
    添加动态人群 流程
    <DynamicCrowdAdd
      v-if="!isShowCrowdList && mode === 'isAddDynamicCrowd'"
      :initPolicyId="selectRow.policyId"
      :initPolicyName="selectRow.policyName"
      :initCrowdId="bigCrowdId"
      dynamicMode="edit"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </DynamicCrowdAdd> -->

    <!-- 动态人群3期 新增动态实验 流程 -->
    <DynamicTest
      v-if="!isShowCrowdList && mode === 'addDynamicTest'"
      :initPolicyId="selectRow.policyId"
      :initPolicyName="selectRow.policyName"
      :initCrowdId="bigCrowdId"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </DynamicTest>
    <!-- 编辑动态实验 -->
    <div v-if="!isShowCrowdList && mode === 'editDynamicCrowd'">
      <!-- style="width: 252px; position: absolute;" -->
      <!-- <el-tabs v-model="tabSet" type="card" v-if="tabSet === 'first' || (tabSet === 'second' && dynamicTestActiveStep !== 1)"> -->
      <el-tabs v-model="tabSet" type="card" @tab-click="handleTabClick" :before-leave="handleBeforeTagLeave">
        <el-tab-pane label="编辑人群条件" name="first">
        </el-tab-pane>
        <el-tab-pane label="编辑动态人群" name="second">
        </el-tab-pane>
      </el-tabs>
      <crowd-add
        ref="crowdAddRef"
        v-if="tabSet === 'first'"
        :crowd="crowd"
        :crowdId="crowdId"
        :policyId="selectRow.policyId"
        :limitLaunchDisabled="effectCrowd"
        @goBackCrowdListPage="goBackCrowdListPage"
        >
      </crowd-add>
      <DynamicTest
        ref="dynamicTestRef"
        v-if="tabSet === 'second'"
        :initPolicyId="selectRow.policyId"
        :initPolicyName="selectRow.policyName"
        :initCrowdId="bigCrowdId"
        :initActiveStep="initActiveStep"
        @goBackCrowdListPage="goBackCrowdListPage"
        @handleActiveStepChange="handleActiveStepChange"
      >
      </DynamicTest>
    </div>
    <el-dialog
      title="引用人群"
      :visible.sync="linkDialogVisible"
    >
      <linkCrowd
        ref="linkCrowdCom"
        v-model="multipleSelection"
        @goBackCrowdListPage="goBackCrowdListPage"
      >
      </linkCrowd>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button @click="handleClear">全部清空</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CrowdAdd from './crowdAdd'
import CrowdList from './crowdList.vue'
import CrowdABAdd from './crowdAbTest'
import DynamicPeopleSetting from '@/components/dynamicPeople/DynamicPeopleSetting'
// import DynamicPeopleConditions from '@/components/dynamicPeople/DynamicPeopleConditions'
import DynamicCrowdAdd from './dynamicCrowdAdd'
import DynamicTest from './dynamicTest/Index'
import LinkCrowd from './linkCrowd.vue'
export default {
  data () {
    return {
      isShowCrowdList: true, // 是否显示人群列表
      crowdId: null, // 编辑的ID
      isAbTest: false,
      tabSet: 'first',
      mode: '',
      crowd: undefined,
      effectCrowd: false,
      activeStep: 0,
      bigCrowdId: undefined,
      isDynamicPeople: false,
      linkDialogVisible: false,
      multipleSelection: [],
      dynamicGroupId: undefined,
      dynamicTestActiveStep: 0
    }
  },
  props: ['selectRow'],
  provide () {
    return {
      crowdIndexThis: this
    }
  },
  methods: {
    handleBeforeTagLeave (activeName, oldActiveName) {
      if (oldActiveName === 'first') {
        const crowdAddRef = this.$refs.crowdAddRef
        // 手动触发保存人群
        crowdAddRef.handleTabChangeSave()

        console.log('crowdAddRef--->', crowdAddRef)
      } else {
        const dynamicTestRef = this.$refs.dynamicTestRef

        const step = dynamicTestRef.activeStep // 动态人群第几步

        if (step === 0) {
          dynamicTestRef.handleSaveStep1()
        } else if (step === 1) {
          dynamicTestRef.handleSave()
        } else if (step === 2) {
          dynamicTestRef.handleSaveStep3()
        }
        console.log('step--->', step)
      }
    },
    handleTabClick (e) {
      // console.log('e---->', e)
      // console.log('e---->', this.tabSet)
      // 动态人群的步骤重置为0（第一步）
      this.initActiveStep = 0
    },
    handleActiveStepChange (val) {
      this.dynamicTestActiveStep = val
    },
    // 添加引用人群
    openAddLinkCrowd (row) {
      this.$refs.linkCrowdCom && this.$refs.linkCrowdCom.$refs.multipleTable && this.$refs.linkCrowdCom.$refs.multipleTable.clearSelection()
      this.linkDialogVisible = true
    },
    // 取消
    handleCancel () {
      this.linkDialogVisible = false
    },
    // 全部清空
    handleClear () {
      // this.multipleSelection = []
      this.$refs.linkCrowdCom.$refs.multipleTable.clearSelection()
    },
    // 确定 - 创建引用人群
    handleConfirm () {
      const parmas = this.multipleSelection.map(item => {
        return {
          crowdName: `${item.crowdName}（引用人群）`,
          policyId: this.selectRow.policyId,
          referCrowdId: item.crowdId
        }
      })
      this.$service.createReferCrowd(parmas, '操作成功').then(res => {
        this.goBackCrowdListPage(true)
        this.linkDialogVisible = false
      })
    },
    getBigCrowdId (crowdId) {
      this.bigCrowdId = crowdId
    },
    goBackFirstLayer () {
      // 回到第一层页面，即策略列表页
      this.$emit('goBack')
    },

    // 新增、编辑人群
    addCrowd (row) {
      this.crowd = row
      const tableData = this.$refs.list.tableData
      if (tableData.length > 49) {
        return this.$message.warning('策略下人群数量已达最大值')
      }
      // 编辑添加
      const crowdId = row ? row.crowdId : undefined
      this.mode = ''
      this.isAbTest = false
      this.isShowCrowdList = false
      this.isDynamicPeople = row && row.smart ? row.smart : false
      if (crowdId) {
        this.crowdId = crowdId
        // 当策略在投放中且在有效期内，人群限制投放不可编辑
        this.effectCrowd = (this.selectRow.useStatus === '投放中' && row.crowdValidStatus == 2)
      } else {
        this.crowdId = null
        this.effectCrowd = false
      }
    },

    // 编辑 abtest 人群
    editABCrowd (row, mode) {
      this.crowd = row
      this.isShowCrowdList = false
      this.isAbTest = row.abMainCrowd === 1
      this.crowdId = row.crowdId
      this.mode = mode
      // 当策略在投放中且在有效期内，或已经是ab划分的主人群，人群限制投放不可编辑
      this.effectCrowd = ((this.selectRow.useStatus === '投放中' && row.apiStatus == 2) || this.isAbTest)
    },
    // 添加/编辑 动态人群
    handleDynamicTest (row, mode, defaultSetingObj) {
      this.crowd = row
      this.isShowCrowdList = false
      this.mode = mode
      this.crowdId = row.crowdId
      this.bigCrowdId = row.crowdId // 大人群ID
      // debugger
      // defaultSetingObj = defaultSetingObj ? {tabSet = 'first', initActiveStep = 0}
      this.tabSet = defaultSetingObj ? defaultSetingObj.tabSet : 'first'
      this.initActiveStep = defaultSetingObj ? defaultSetingObj.initActiveStep : 0
      this.dynamicGroupId = row.id || undefined
      // console.log('mode====', mode)
    },
    goBackCrowdListPage (isLoadData) {
      this.isShowCrowdList = true
      if (isLoadData) this.$refs.list.loadData()
    }
    // 编辑动态人群
    // editDynamicCrowd (row) {
    //   this.isShowCrowdList = false
    //   this.bigCrowdId = row.crowdId // 大人群ID
    //   this.mode = 'editDynamicCrowd'
    // }
    // editDynamicPeopleSetting (row) {
    //   console.log('this.selectRow===', this.selectRow)
    //   this.isShowCrowdList = false
    //   this.mode = 'step2'
    //   this.crowdId = row.crowdId
    //   this.policyId = row.policyId
    //   this.policyName = row.policyName
    // },
    // editDynamicPeopleConditions  (row) {
    //   console.log('this.selectRow===', this.selectRow)
    //   this.isShowCrowdList = false
    //   this.mode = 'step3'
    //   this.crowdId = row.crowdId
    //   this.policyId = row.policyId
    //   this.policyName = row.policyName
    // },
    // 添加动态人群
    // addDynamicCrowd () {
    //   this.isShowCrowdList = false
    //   this.mode = 'isAddDynamicCrowd'
    // },

  },
  components: {
    CrowdAdd,
    CrowdList,
    CrowdABAdd,
    DynamicPeopleSetting,
    // DynamicPeopleConditions,
    DynamicCrowdAdd,
    DynamicTest,
    LinkCrowd
  }
}
</script>
