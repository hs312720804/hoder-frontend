<template>
  <div>
    <!-- {{rulesJson}}
    <hr>
    {{ selectModelGroupValue }} -->
    <el-row>
      <el-col :span="4" class="row-title">
      选择入口标签：
      </el-col>
      <el-col :span="20">
      <el-select
        name="oxve"
        v-model="selectModelGroupValue"
        class="input-inline"
        :multiple="true"
        @change="handleSelectModelGroup"
      >
        <!-- number 类型 -->
        <template>
          <el-option
            v-for="item in dataList"
            :key="item.id"
            :value="item.id"
            :label="item.tagName">
          </el-option>

        </template>

      </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4"  class="row-title">
      设置进入条件：
      </el-col>
      <el-col :span="20">
      <div class="label-container">
        <div v-if="tags && tags.length > 0">
        <!-- <div > -->
          <div
            v-show="rulesJson.rules.length > 1"
            class="label-or-space"
            :style="{'border-color': rulesJson.condition === 'AND' ?  '#67c23a' : '#e6a23c'}"
            :key="i + 'or'"
          >
            <el-button
              :type="rulesJson.condition === 'AND' ? 'success' : 'warning'"
              round
              :key="'button2' + '_' + i"
              @click="handleRulesConditionChange(rulesJson)"
            >
              {{ rulesJson.condition === 'AND' ? '且' : '或' }}
            </el-button>
          </div>
          <template v-for="(item, index) in rulesJson.rules">
            <div class="label-ground" :key="index">
              <div class="tag-condition--parent">
                <!-- {{ item.rules }} -->
                <div class="tag-condition" v-show="item.rules.length > 1" :style="{'border-color': item.condition === 'AND'?  '#67c23a' : '#e6a23c'}">
                  <el-button
                    :type="item.condition === 'AND' ? 'success' : 'warning'"
                    @click="handleRulesConditionChange(item)"
                    round
                    size="small"
                    :key="'button' + index + '_' + i"
                  >
                    {{ item.condition === 'AND' ? '且' : '或' }}
                  </el-button>
                </div>
                <div
                  v-for="(childItem, n) in item.rules"
                  :key="'tagId' + n"
                  :class="{ 'label-item': true, paddingTop: n > 0 }"
                >

                  <span class="txt">{{ childItem.tagName }}</span>

                  <span class="sel">
                    <el-select
                      style="width: 80px"
                      name="oxve"
                      v-model="childItem.operator"
                      class="input-inline"
                    >
                      <!-- number 类型 -->
                      <template>
                        <el-option value="=" label="是"></el-option>
                        <el-option value="!=" label="否"></el-option>
                      </template>

                    </el-select>

                  </span>

                  <!-- <span class="in">
                    <el-select
                      :key="n + 'input'"
                      name="oxve"
                      v-model="childItem.value"
                      class="input-inline"
                    >

                      <template>
                        <el-option value="="></el-option>
                        <el-option value=">="></el-option>
                        <el-option value="<="></el-option>
                        <el-option value=">"></el-option>
                        <el-option value="<"></el-option>
                      </template>

                    </el-select>

                  </span> -->

                  <span class="i" @click="handleRemoveRule(item, childItem)" >
                    <i class="icon iconfont el-icon-cc-delete"></i>
                  </span>
                </div>
                <div class="label-add">
                  <div class="optional-condition">
                    <el-tag
                      class="oc-item"
                      v-for="tagItem in tags"
                      :key="tagItem.tagItem"
                      @click.native="handleAddChildRule(item, tagItem)"
                      :type="dataSourceColorEnum[tagItem.dataSource]"
                      >{{ tagItem.tagName }}</el-tag
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="label-or">
            <div
              class="optional-condition"
              v-if="tags.length"
              :style="{
                'padding-top': rulesJson.rules.length > 0 ? '10px' : 0,
              }"
            >
              <el-tag
                class="oc-item"
                v-for="item in tags"
                :key="item.tagName"
                @click.native="handleAddRule(item)"
                :type="dataSourceColorEnum[item.dataSource]"
                >{{ item.tagName }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      </el-col>
    <div style="float: right">
      <el-button type="warning" @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
    </el-row>
  </div>
</template>

<script>
export default {
  // props: ['recordId', 'tempPolicyAndCrowd', 'routeSource'],
  props: ['isDynamicPeople', 'crowdId', 'graph', 'dynamicMode', 'allCrowdRule'],
  // inject: ['graphData'],
  // computed: {
  //   computedGraphData () {
  //     return this.graphData()
  //   }
  // },
  data () {
    return {
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
      crowdRule: {},
      policyId: '',
      applyAll: false,
      initRulesJson: {},
      selectModelGroupValue: [],
      filter: {
        pageNum: 1,
        pageSize: 100,
        condition: ''
      },
      dataList: []
    }
  },
  watch: {
    crowdId: {
      handler (val) {
        this.init()
      }
    }
  },
  created () {
    // 获取标签
    // this.$service.getRuleIndicators().then(res => {
    //   this.tags = res
    // })
  },
  mounted () {
    this.fetchData()
    this.init()
  },
  methods: {
    handleSelectModelGroup (val) {
      this.fetchTagData()
    },
    fetchData () {
      const filter = this.filter
      this.$service.searchModelTag(filter).then(data => {
        const result = data
        this.dataList = result.records.map(item => {
          return {
            ...item,
            tagId: item.id
          }
        }) || []
      })
    },
    // getFilter () {
    //   return {
    //     modelTagId: this.selectModelGroupValue,
    //     pageNum: 1,
    //     pageSize: 100,
    //     crowdType: 5
    //   }
    // },
    // fetchTagData () {
    //   const filter = this.getFilter()
    //   this.$service.getTempCrowdList(filter).then(data => {
    //     this.tags = data.pageInfo.list
    //   })
    // },
    fetchTagData () {
      const modelTagIds = this.selectModelGroupValue.join(',')
      this.$service.getModelTag({ modelTagIds }).then((data) => {
        const list = [
          {
            'tagVersion': 'dmp_crowd_111923_2022071803',
            'tagId': 9848,
            'tagType': 'collect',
            'tagName': '123112312',
            'tagKey': 'temp_crowd_8087',
            'dataSource': 11
          },
          {
            'tagVersion': 'dmp_crowd_111924_2022071802',
            'tagId': 9849,
            'tagType': 'collect',
            'tagName': '2222222',
            'tagKey': 'temp_crowd_8088',
            'dataSource': 11
          },
          {
            'tagVersion': 'dmp_crowd_111940_2022071802',
            'tagId': 9851,
            'tagType': 'collect',
            'tagName': '模型标签3',
            'tagKey': 'temp_crowd_8090',
            'dataSource': 11
          },
          {
            'tagVersion': 'dmp_crowd_111941_2022071802',
            'tagId': 9852,
            'tagType': 'collect',
            'tagName': '模型标签4',
            'tagKey': 'temp_crowd_8091',
            'dataSource': 11
          },
          {
            'tagVersion': 'dmp_crowd_111944_2022071803',
            'tagId': 9854,
            'tagType': 'collect',
            'tagName': '1111',
            'tagKey': 'temp_crowd_8093',
            'dataSource': 11
          }
        ]
        this.tags = data.list || []
        // this.tags = list
      })
    },
    handleSave () {
      // tagVersion 字段的值，赋给 value 字段
      const rules = this.rulesJson.rules.map(item => {
        const rules = item.rules
        item.rules = rules.map(obj => {
          return {
            ...obj,
            value: obj.tagVersion
          }
        })
        return item
      })
      this.rulesJson.rules = rules
      // 保存时，重置初始数据
      this.initRulesJson = JSON.parse(JSON.stringify(this.rulesJson))
      this.$emit('handleSave', { enterCondition: this.rulesJson, selectModelGroupValue: this.selectModelGroupValue })
    },
    handleCancel () {
      this.rulesJson = JSON.parse(JSON.stringify(this.initRulesJson))
      this.$emit('handleCancel')
    },
    init () {
      if (this.crowdId) {
        // const graphData = this.computedGraphData // 当前图表的数据
        const graphData = this.graph.save() // 当前图表的数据

        const res = graphData.nodes.find(item => {
          return Number(item.crowdId) === Number(this.crowdId)
        })

        // this.crowdRule = this.allCrowdRule.find(item => item.crowdId == this.crowdId)
        this.policyId = res.policyId || ''

        if (res.selectModelGroupValue) { // 选择的模型标签分组
          this.selectModelGroupValue = res.selectModelGroupValue
          // 获取标签
          this.fetchTagData()
        } else {
          // 初始化
          this.selectModelGroupValue = []
        }

        if (res.enterCondition) { // 入口条件 json
          this.initRulesJson = JSON.parse(res.enterCondition)
          this.rulesJson = JSON.parse(res.enterCondition)
          console.log('res===', this.rulesJson)
        } else {
          // 初始化
          this.rulesJson = {
            condition: 'OR',
            rules: []
          }
        }
      }
    },
    handleAddRule (tag) {
      this.rulesJson.rules.push({
        condition: 'AND',
        rules: [{
          ...tag,
          operator: '=',
          value: ''
        }]
      })
    },
    handleAddChildRule (rule, tag) {
      rule.rules.push({
        ...tag,
        operator: '=',
        value: ''
      })
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    // handleRemoveRule (index) {
    //   const rulesJson = this.rulesJson
    //   rulesJson.rules.splice(index, 1)
    // },
    handleRemoveRule (rule, childRule) {
      const rulesJson = this.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)

      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 3, this.recordId)
    },

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
.label-container{
  margin: 0 0 20px;
  padding: 0 0 0 40px;
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
  line-height: 40px
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
  left: 0;
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
.row-title {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 18px
}
</style>
