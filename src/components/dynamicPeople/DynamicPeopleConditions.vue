<template>
  <div class="form-class">
      <!-- <div style="color: red">
        第4步
        isDynamicPeople: {{isDynamicPeople}} <br/>
        :policyId:: {{policyId}}<br/>
        :policyName:: {{ policyName }}<br/>
        :crowdId:: {{ crowdId }}<br/>
        {{rulesJson}}
      </div> -->

      <div class="top">
        <span class="title">流转算法：</span>
         <!-- {{radioType}} -->
        <el-radio-group v-model="radioType" style="margin: 20px 0">
          <el-radio :label="0">顺序</el-radio>
          <el-radio :label="1">循环</el-radio>
          <el-radio :label="2">随机</el-radio>
          <el-radio :label="3">自定义</el-radio>
        </el-radio-group>

        <div v-if="dynamicMode === 'editSingle'" class="btn">
          <el-button type="info" @click="graph && graph.destroy(); $emit('goBackCrowdListPage')">返回</el-button>
          <el-button type="primary" @click="handleSave(3)">保存</el-button>
        </div>
        <div v-else class="btn">
          <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
          <el-button type="warning" @click="handleSave(0)">跳过保存</el-button>
          <el-button type="primary" @click="handleSave(3)">下一步</el-button>
        </div>
      </div>

      <div style="position: absolute; top: 300px; z-index: 999;">
        <span class="inputArrow"></span>
        <!-- <el-button type="text">文字按钮</el-button> -->
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

        <!-- {{ crowdOptions }} -->
        <!-- <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleExitCrowdVisibleChange">
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in crowdOptions"
              :key="item.crowdId"
              :command="item.crowdId"
              :disabled="item.disabled"
            >
              {{item.crowdName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>

      <!-- 拓扑图 -->

      <antv-graph v-if="dynamicRule.allCrowd && dynamicRule.allCrowd.length > 0" :type="radioType" :dynamicRule="dynamicRule"></antv-graph>

  </div>

</template>

<script>
import antvGraph from '@antvGraph/Index.vue'
import eventBus from '@antvGraph/utils/eventBus'
export default {
  components: {
    antvGraph
  },
  // props: ['recordId', 'tempPolicyAndCrowd', 'routeSource'],
  props: ['isDynamicPeople', 'policyId', 'crowdId', 'dynamicMode'],
  data () {
    return {
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
      tags: [
      //   {
      //   tagId: 1,
      //   tagKey: 'day',
      //   tagName: '产品包曝光天数',
      //   tagType: 'int',
      // }, {
      //   tagId: 2
        // tagKey: "cout"
        // tagName: "曝光次数"
        // tagType: "int"
      // }
      ],
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
      crowdOptions: []
    }
  },
  watch: {
    radioType: {
      handler () {
        // this.showGraph = false
        // this.$nextTick(() => {
        //   this.showGraph = true
        // })
      }
    }
  },
  created () {
    // 获取流转条件
    // this.$service.getRuleIndicators().then(res => {
    //   this.tags = res
    // })

    if (this.crowdId) {
      this.$service.getDynamicRule({ crowdId: this.crowdId }).then(res => {
        console.log('res===', res)
        if (res) {
          // 小人群列表
          this.dynamicRule = res
          this.radioType = res.mainArithmetic // 流转算法
          this.bigArithmetic = res.arithmetic // 大的出口条件

          // 大的出口 选择定向时，选择人群id
          this.crowdOptions = res.allCrowd
          // const flowChart = res.flowChart ? JSON.parse(res.flowChart) : {}
          // this.handleExitCrowdVisibleChange(flowChart)

          this.exitCrowd = res.exitCrowd
        }
      })
      this.bindEvent()
    }
  },
  beforeDestroy () {
    this.graph && this.graph.destroyed()
    eventBus.$off()
  },
  methods: {
    bindEvent () {
      eventBus.$on('afterAddPage', page => {
        this.graph = page.graph
      })
      eventBus.$on('deleteItem', (item) => {
        // console.log('item==>', item)
        // const flowChart = this.graph ? this.graph.save() : {}
        // this.handleExitCrowdVisibleChange(flowChart)
      })
      eventBus.$on('addItem', item => {
        // console.log('item==>', item)
        // const flowChart = this.graph ? this.graph.save() : {}
        // this.handleExitCrowdVisibleChange(flowChart)
      })
    },
    handleCommand (command) {
      this.$message('click on item ' + command)
    },
    handleExitCrowdVisibleChange (flowChart) {
      // 流程图数据
      // console.log('flowChart===>', flowChart)

      const edges = flowChart.edges
      const isTargetCrowdIdList = edges.map(item => item.target)
      // console.log('targetCrowdIdList====>', isTargetCrowdIdList)
      const allCrowdList = this.dynamicRule.allCrowd
      this.crowdOptions = allCrowdList.filter(item => {
        return !isTargetCrowdIdList.includes(item.crowdId)
      }) || []

      this.crowdOptions = this.crowdOptions.map(item => {
        return {
          ...item
          // disabled: true
        }
      })
      // console.log('this.crowdOptions==>', this.crowdOptions)
    },
    handleChangeBigArithmetic () {
      // 1定向 2随机 3 终止
      let i

      if (!this.bigArithmetic) {
        i = 2
      } else if (Number(this.bigArithmetic) === 1) {
        i = 2
      } else if (Number(this.bigArithmetic) === 2) {
        i = 3
      } else if (Number(this.bigArithmetic) === 3) {
        i = 1
      }
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
      this.$emit('crowdPrevStep', 3, this.recordId)
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
        if (this.dynamicMode === 'edit') { // 大人群列表 -添加动态人群
          if (mode === 3) {
            this.$emit('crowdNextStep', 3)
          } else {
            this.$emit('goBackCrowdListPage')
          }
        } else if (this.dynamicMode === 'editSingle') { // 大人群列表 - 单个编辑
          this.$emit('goBackCrowdListPage')
        } else { // 策略流程
          if (mode === 3) {
            this.$emit('crowdNextStep', 3)
          } else {
            this.$emit('handleDirectStrategyList')
            // this.$router.push({ path: 'launch/launchTabList' })
          }
        }
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
  // width: 80%;
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
  background: url('../../assets/icons/arrow.svg')
  background-size: cover;
  width: 63px;
  height: 60px;
  display: inline-block;

}
</style>
