<template>
  <div class="form-class">
      <div style="color: red">
        <!-- 第4步
        :policyId:: {{ policyId }}<br/>
        :crowdId:: {{ crowdId }}<br/>
        dynamicRule: {{ dynamicRule }} -->

      </div>

      <div class="top">
        <span class="title">实验分组</span>
        {{ dynamic2GroupList }}
         <el-tabs
          v-model="groupCheckIndex"
          type="card"
          closable
          @tab-remove="removeTab"
          @tab-click="handleClick">
          <el-tab-pane
            v-for="(group, index) in dynamic2GroupList"
            :key="group.id"
            :label="group.name"
            :name="String(index)">
          </el-tab-pane>
        </el-tabs>
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="addGroup">
          添加分组
        </el-button>

        <div class="btn">
          <!-- <el-button type="info" @click="graph && graph.destroy(); $emit('goBackCrowdListPage')">返回</el-button> -->
          <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
          <el-button type="primary" @click="handleSave(3)">保存</el-button>
        </div>

      </div>

      <div style="position: absolute; top: 300px; z-index: 999;">
        <span class="inputArrow"></span>
        <!-- <el-button type="text">文字按钮</el-button> -->
        <!-- {{radioType === 3}} -->
        <template v-if="radioType === 3">
          <el-button type="text" @click="handleChangeBigArithmetic" style="display: inline-block; vertical-align: 23px;">
            {{ condition[this.bigArithmetic] }}
            <!-- {{ this.bigArithmetic }} -->
          </el-button>
          <!-- <div>1定向 2随机 3 终止</div> -->
          <el-select
            v-if="Number(this.bigArithmetic) == 1"
            v-model="exitCrowd"
            placeholder="请选择"
            style="width: 100px; display: inline-block; vertical-align: 23px;"
          >
            <el-option
              v-for="item in crowdOptions"
              :key="item.crowdId"
              :label="item.crowdName"
              :value="item.crowdId">
            </el-option>
          </el-select>
        </template>

      </div>

      <!-- 拓扑图 -->

      <antv-graph v-if="dynamicRule.allCrowd && dynamicRule.allCrowd.length > 0" :type="radioType" :dynamicRule="dynamicRule"></antv-graph>

      <el-dialog title="新建分组" :visible.sync="dialogFormVisible" width="800px">
        {{form}}
        <el-form :model="form" :label-width="formLabelWidth" class="addGroupForm">
          <el-form-item label="分组名称：" required>
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分组算法：" required>
            <el-select v-model="form.mainArithmetic" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择方案：" required >
            <!-- 可拖拽穿梭框 -->
            <AAA v-model="form.cid" :data="dynamic2CrowdList"></AAA>
          </el-form-item>
          <el-form-item label="分组占比：" required>
            <el-input v-model="form.flowNum" autocomplete="off"></el-input>%
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSaveGroup">确 定</el-button>
        </div>
      </el-dialog>
  </div>

</template>

<script>
import antvGraph from '@antvGraph/Index.vue'
import eventBus from '@antvGraph/utils/eventBus'
import AAA from './DragSortMultiSelect'
export default {
  components: {
    antvGraph,
    AAA
  },
  props: ['policyId', 'crowdId'],

  data () {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 5; i++) {
        data.push({
          key: i,
          label: `方案 ${i}`
        })
      }
      return data
    }
    return {
      groupCheckIndex: 0,
      radioType: 0,
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      },
      tags: [],
      rulesJson: {
        condition: 'OR',
        rules: []
      },
      i: 0,
      showGraph: true,
      dynamicRule: {},
      graph: undefined,
      condition: {
        1: '定向',
        2: '随机',
        3: '终止'
      },
      bigArithmetic: '',
      exitCrowd: '',
      crowdOptions: [],
      dialogFormVisible: false,
      data: generateData(),
      form: {
        name: '',
        policyId: this.policyId,
        crowdId: this.crowdId,
        mainArithmetic: '',
        cid: [],
        flowNum: ''
      },
      formLabelWidth: '120px',
      options: [{
        value: 0,
        label: '顺序'
      }, {
        value: 1,
        label: '循环'
      }, {
        value: 2,
        label: '随机'
      }, {
        value: 3,
        label: '自定义'
      }],
      dynamic2CrowdList: [], // 小人群列表
      dynamic2GroupList: [] // 分组列表
    }
  },
  watch: {
    radioType: {
      handler () {
        // 修改流转算法 type 时，重新获取最新的拓扑图数据
        this.$service.getDynamicRule({ crowdId: this.crowdId }).then(res => {
          this.dynamicRule = res || {}
        })
      }
    }
  },
  created () {
    // if (this.crowdId) {
    this.getDynamic2CrowdList() // 获取小人群列表
    this.getDynamic2PlanList() // 获取实验组列表
    this.getRule()
    this.bindEvent()
    // }
  },
  beforeDestroy () {
    // console.log('this.graph===>', this.graph)
    // this.graph && this.graph.destroyed()
    if (this.graph) {
      this.graph = null
    }
    eventBus.$off()
  },
  methods: {
    // 选中分组
    handleClick (item) {
      console.log('item===>', item)
    },
    // 删除分组
    removeTab (index) {
      const currentGroup = this.dynamic2GroupList[index]
      this.$confirm(`此操作将永久删除 ${currentGroup.name} 分组, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: currentGroup.id
        }
        this.$service.deleteDynamic2Plan(params, '删除分组成功').then(res => {
          this.groupCheckIndex = '0'
          this.getDynamic2PlanList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新建实验分组
    handleSaveGroup () {
      const params = {
        ...this.form,
        cid: this.form.cid.join(',')
      }
      this.$service.addDynamic2Plan(params, '新建分组成功').then(res => {
        this.dialogFormVisible = false
        this.getDynamic2PlanList()
      })
    },

    // 获取实验组列表
    getDynamic2PlanList () {
      this.$service.getDynamic2PlanList({ crowdId: this.crowdId }).then(res => {
        this.dynamic2GroupList = res || []
      })
    },

    // 获取小人群列表
    getDynamic2CrowdList () {
      const params = {
        crowdId: this.crowdId // 大人群ID    不能为空
      }
      this.$service.getDynamic2CrowdList(params).then(res => {
        this.dynamic2CrowdList = res.map(item => {
          return {
            id: item.crowdId,
            label: item.crowdName
          }
        }) || []
      })
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 1, this.recordId)
    },
    addGroup () {
      this.dialogFormVisible = true
    },
    getRule () {
      const res = {
        'policyId': 4112,
        'flowChart': null,
        'mainArithmetic': 0,
        'allCrowd': [{
          'policyId': 4112,
          'dynamicJson': null,
          'weight': 0,
          'arithmetic': null,
          'priority': 345,
          'crowdId': 11222,
          'crowdName': '345'
        }, {
          'policyId': 4112,
          'dynamicJson': '{"condition":"OR","rules":[{"condition":"AND","rules":[{"tagId":2,"tagKey":"exposeTimes","tagName":"产品包曝光次数","tagType":"int","operator":">","value":10}]}]}',
          'weight': 120,
          'arithmetic': null,
          'priority': 23,
          'crowdId': 11223,
          'crowdName': '23'
        }],
        'arithmetic': null,
        'unused': [{
          'policyId': 4112,
          'dynamicJson': null,
          'weight': 0,
          'arithmetic': null,
          'priority': 345,
          'crowdId': 11222,
          'crowdName': '345'
        }, {
          'policyId': 4112,
          'dynamicJson': '{"condition":"OR","rules":[{"condition":"AND","rules":[{"tagId":2,"tagKey":"exposeTimes","tagName":"产品包曝光次数","tagType":"int","operator":">","value":10}]}]}',
          'weight': 120,
          'arithmetic': null,
          'priority': 23,
          'crowdId': 11223,
          'crowdName': '23'
        }],
        'crowdId': 11219,
        'exitCrowd': null
      }

      this.dynamicRule = res
      this.radioType = res.mainArithmetic // 流转算法
      this.bigArithmetic = res.arithmetic || 2 // 大的出口条件， 默认【随机】

      // 大的出口 选择定向时，选择人群id
      this.crowdOptions = res.allCrowd

      this.exitCrowd = res.exitCrowd
      // this.$service.getDynamicRule({ crowdId: this.crowdId }).then(res => {
      //   console.log('res===', res)
      //   if (res) {
      //     // 小人群列表
      //     this.dynamicRule = res
      //     this.radioType = res.mainArithmetic // 流转算法
      //     this.bigArithmetic = res.arithmetic || 2 // 大的出口条件， 默认【随机】

      //     // 大的出口 选择定向时，选择人群id
      //     this.crowdOptions = res.allCrowd

      //     this.exitCrowd = res.exitCrowd
      //   }
      // })
    },
    bindEvent () {
      const _this = this
      eventBus.$on('afterAddPage', page => {
        this.graph = page.graph
        this.graph.on('afteradditem', function (ev) {
          const flowChart = _this.graph ? _this.graph.save() : {}
          _this.handleExitCrowdVisibleChange(flowChart)
        })
        // 子项数据变化后
        this.graph.on('afterremoveitem', function (ev) {
          const flowChart = _this.graph ? _this.graph.save() : {}
          _this.handleExitCrowdVisibleChange(flowChart)
        }) // 子项数据变化后
      })
    },
    handleCommand (command) {
      this.$message('click on item ' + command)
    },
    handleExitCrowdVisibleChange (flowChart) {
      // 流程图数据
      const edges = flowChart.edges
      if (!edges) return

      // 注意这里要统一成字符串：.toString()
      const isTargetCrowdIdList = edges.map(item => item.target.toString())
      const allCrowdList = this.dynamicRule.allCrowd
      this.crowdOptions = allCrowdList.filter(item => {
        return !isTargetCrowdIdList.includes(item.crowdId.toString())
      }) || []

      this.crowdOptions = this.crowdOptions.map(item => {
        return {
          ...item
        }
      })
    },
    handleChangeBigArithmetic () {
      // 1定向 2随机 3 终止
      let i

      if (!this.bigArithmetic) {
        i = 2
      } else if (Number(this.bigArithmetic) === 1) {
        i = 2
      } else if (Number(this.bigArithmetic) === 2) {
        i = 1
      }
      //  else if (Number(this.bigArithmetic) === 3) {
      //   i = 1
      // }
      this.bigArithmetic = i
    },

    handleAddChildRule (tag) {
      // if (rule.rules.length > 50) {
      //   this.$message({
      //     type: 'error',
      //     message: '已达最大数量'
      //   })
      //   return
      // }
      // if (tag.tagType === 'string' || tag.tagType === 'collect') {
      //   if (this.cache[tag.tagId] === undefined) {
      //     this.fetchTagSuggestions(tag.tagId)
      //   }
      // } else if (tag.tagType === 'mix') {
      //   if (this.cache[tag.tagId] === undefined) {
      //     this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
      //   }
      // }
      // if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
      //   this.crowd.tagIds.push(tag.tagId)
      // }
      this.rulesJson.rules.push({
        ...tag,
        operator: '>',
        value: ''
      })
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    handleRemoveRule (index) {
      const rulesJson = this.rulesJson
      rulesJson.rules.splice(index, 1)
      // const tagIds = []
      // rulesJson.rules.forEach(e => {
      //   e.rules.forEach(n => {
      //     if (!tagIds.includes(n.tagId)) {
      //       tagIds.push(n.tagId)
      //     }
      //   })
      // })
      // if (this.crowd && this.crowd.rulesJson) this.crowd.tagIds = tagIds

      // if (rule.rules.length === 0) {
      //   rulesJson.rules = rulesJson.rules.filter(function (item) {
      //     return item !== rule
      //   })
      // }
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 1, this.recordId)
    },
    handleSave (mode) {
      // 流程图JSON
      const flowChartJson = this.graph ? JSON.stringify(this.graph.save()) : ''
      const parmas = {
        policyId: this.policyId,
        crowdId: this.crowdId,
        mainArithmetic: this.radioType,
        // arithmetic: 1,
        flowChart: flowChartJson,
        exitCrowd: this.exitCrowd,
        arithmetic: this.bigArithmetic
        // dynamicJson: JSON.stringify(this.rulesJson)
      }
      this.$service.setBigCrowdRule(parmas, '操作成功').then(res => {
        // if (this.dynamicMode === 'edit') { // 大人群列表 -添加动态人群
        //   if (mode === 3) {
        //     this.$emit('crowdNextStep', 3)
        //   } else {
        //     this.$emit('goBackCrowdListPage')
        //   }
        // } else if (this.dynamicMode === 'editSingle') { // 大人群列表 - 单个编辑
        //   this.$emit('goBackCrowdListPage')
        // } else { // 策略流程
        //   if (mode === 3) {
        //     this.$emit('crowdNextStep', 3)
        //   } else {
        //     this.$emit('handleDirectStrategyList')
        //     // this.$router.push({ path: 'launch/launchTabList' })
        //   }
        // }
      })
    },
    // 编辑人群时保存
    // save (mode) {
    //   const parmas = {
    //     policyId: this.policyId,
    //     crowdId: this.crowdId,
    //     dynamicJson: JSON.stringify(this.rulesJson)
    //   }
    //   this.$service.setDynamicRule(parmas).then(res => {
    //     this.$message.success('操作成功')
    //     if (mode === 3) { // 下一步
    //       this.$emit('crowdNextStep', 3, this.recordId)
    //     } else {
    //       if (this.dynamicMode === 'edit') { // 大人群列表 -添加动态人群
    //         this.$emit('goBackCrowdListPage')
    //       } else { // 创建策略流程
    //         this.$router.push({ path: 'launch/launchTabList' })
    //       }
    //     }
    //   })
    // },
    resetFormData () {
      this.$emit('resetFormData')
    },
    handleDirectStrategyListBrother () {
      this.$emit('handleDirectStrategyList')
    }
  }
}
</script>

<style scoped  lang="stylus">
.form-class{
  margin: 0 auto 20px;
}
.div-class{
  padding: 20px;
  background-color: rgba(249,249,249,0.85);
  margin-bottom 20px
}
.el-collapse_item >>> .el-collapse-item__header {
  padding-left: 10px;
  background-color: rgba(249, 249, 249, 0.85);
}

.el-collapse_item >>> .el-collapse-item {
  display: inline-block;
  width: 100%;
  margin-right: 10px;
}

.el-icon-remove-outline {
  width: 20px;
  height: 20px;
}

.el-collapse {
  border-top: none;
  border-bottom: none;
}

.multipleSelect {
  >>>.el-select {
    width: 100%;
  }
}

.mix-area-select {
  >>>.el-select {
    width: 50%;
  }
}

.label-ground {
  border: 1px dashed #ccc;
  padding: 10px;
  margin: 10px 0;
}

.label-item {
  display: flex;
  position: relative;
}

.paddingTop {
  padding-top: 50px;
}

.label-item .and {
  position: absolute;
  top: 5px;
  left: 260px;
  width: 40px;
  height: 40px;
}

.label-item .txt, .label-item .sel {
  width: 150px;
}

.label-item .txt {
  text-align: right;
}

.label-item .in {
  min-width: 250px;
}

.label-item span, .oc-item {
  margin-right: 10px;
}

.label-add {
  margin-top: 10px;
}

.label-add >>> span {
  cursor: pointer;
}

.label-or >>> span {
  cursor: pointer;
}

i {
  cursor: pointer;
}

.label-item .time-dot-select {
  width: 120px;
}

.label-item .time-dot-input {
  display: inline-block;
  width: 80px;
  margin: 0 7px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}

.pagination {
  float: right;
}

.showMoreTags >>> .el-radio {
  margin: 5px;
}

.label-item .time-dot-select-new {
  width: 90px;
}

.outer-and {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: 0;
  width: 3px;
  height: auto;
  margin: auto 10px;
  border: 1px dashed red;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-item {
  display: flex;
  margin-right: 10px;

  div+div {
    margin-left: 10px;
  }
}

.tag-condition--parent {
  position: relative;
  z-index: 1;
}

.tag-condition {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: -17px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #E6A23C;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-container {
  position: relative;
  z-index: 1;
}

.label-or-space {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 5px;
  left: -40px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #67C23A;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.behavior-label {
  white-space: nowrap;
  overflow-x: auto;
  display: flex
}
.w100 {
  min-width: 100px;
}
.flexColumn {
  display: flex;
  flex-direction: column;
}
.flexRow {
  display: flex;
  flex-direction: row;
}
.title {
  font-size 16px
}
.btn{
  position: absolute;right: 0;top: 0;
}
.top {
  position relative
  right: 0
  width 100%
  background: #fff
}
.inputArrow{
  // background: url('@/assets/icons/arrow.svg')
  background-size: cover;
  width: 63px;
  height: 60px;
  display: inline-block;
}
.addGroupForm .el-input, .addGroupForm .el-select {
  width: 300px;
}
</style>
