<template>
  <div v-if="tags && tags.length > 0" class="form-class">
      <div class="div-class">
        <div
          v-show="rulesJson.rules.length > 1"
          class="label-or-space"
          :key="i + 'or'"
        >
          <el-button
            type="success"
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
              <div class="tag-condition" v-show="item.rules.length > 1">
                <el-button
                  type="warning"
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
                :key="index + 'tagId' + n"
                :class="{ 'label-item': true, paddingTop: n > 0 }"
              >

                <span class="txt">{{ childItem.categoryName }}</span>

                <span class="sel">
                  <!-- 不是时间（time）类型的下拉框 -->
                  <el-select
                    style="width: 80px"
                    name="oxve"
                    v-model="childItem.operator"
                    class="input-inline"
                    @change="handleOperatorChange(childItem)"
                  >
                    <!-- number 类型 -->
                    <template v-if="childItem.tagType === 'number'">
                      <el-option value="="></el-option>
                      <el-option value=">="></el-option>
                      <el-option value="<="></el-option>
                      <el-option value=">"></el-option>
                      <el-option value="<"></el-option>
                    </template>

                  </el-select>

                  <!-- 是时间（time）类型的下拉框 -->
                  <template v-if="childItem.tagType === 'time'">

                    <!-- 一期 -->
                    <template >
                      <!-- 新方案 -->
                      <el-select v-show="childItem.isDynamicTime === 3"
                        class="time-dot-select-new"
                        :key="n + 'timeKey'"
                        v-model="childItem.dateAreaType"
                        @change="handelTimeTagTypeSelectChange(childItem)"
                      >
                        <el-option :value="0" label="空"></el-option>
                        <el-option :value="1" label="已过期"></el-option>
                        <el-option :value="2" label="未过期"></el-option>
                      </el-select>

                      <!-- 旧方案 -->
                      <el-select v-show="childItem.isDynamicTime !== 3"
                        style="width: 80px"
                        name="oxve"
                        v-model="childItem.operator"
                        class="input-inline"
                        @change="handleOperatorChange(childItem)"
                      >
                        <el-option value="="></el-option>
                        <el-option value=">="></el-option>
                        <el-option value="<="></el-option>
                        <el-option value=">"></el-option>
                        <el-option value="<"></el-option>
                      </el-select>

                    </template>

                  </template>
                </span>

                <span class="in">
                  <!-- time 类型 -->

                  <!-- number 类型 -->
                  <el-input-number v-if="childItem.tagType === 'number'"
                    :key="index + 'input'"
                    v-model="childItem.value"
                    placeholder="请输入内容"
                  ></el-input-number>

                </span>

                <span class="i" @click="handleRemoveRule(item, childItem)">
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
      </div>

      <!-- <div class="label-or">
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
      </div> -->
      <div>
        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <!-- <el-button type="warning" @click="handleSave(0)">跳过保存</el-button> -->
        <!-- <el-button type="primary" @click="handleSave(1)">下一步</el-button> -->
        <el-button type="primary" @click="handleToNextStep(3)">下一步</el-button>
      </div>
    </div>

</template>

<script>
export default {
  components: {},
  props: ['recordId', 'tempPolicyAndCrowd', 'routeSource'],
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
      tags: [{
        'thirdPartyApiId': '',
        'tagId': '8321',
        'tagType': 'number',
        'thirdPartyCode': '',
        'inputType': null,
        'tagKey': 'T042003',
        'tagName': '产品包曝光天数',
        'dataSource': 2,
        'initValue': '0',
        'thirdPartyField': '',
        'child': []
      }, {
        'thirdPartyApiId': '',
        'tagId': '8323',
        'tagType': 'number',
        'thirdPartyCode': '',
        'inputType': null,
        'tagKey': 'T042005',
        'tagName': '产品包曝光次数',
        'dataSource': 2,
        'initValue': '0',
        'thirdPartyField': '',
        'child': []
      }],
      rulesJson: {
        'condition': 'OR',
        'rules': [{
          'condition': 'AND',
          'rules': [{
            'version': 2,
            'operator': '>=',
            'tagCode': 'T042003',
            'tagName': '产品包曝光天数',
            'dataSource': 2,
            'value': 5,
            'tagId': '8321',
            'tagType': 'number',
            'categoryName': '产品包曝光天数',
            'categoryCode': 'T042003',
            'dynamicTimeType': 1,
            'isDynamicTime': 3,
            'thirdPartyCode': '',
            'thirdPartyField': '',
            'dateAreaType': 0,
            'initValue': '0'
          }, {
            'version': 2,
            'operator': '=',
            'tagCode': 'T042005',
            'tagName': '产品包曝光次数',
            'dataSource': 2,
            'value': 5,
            'tagId': '8323',
            'tagType': 'number',
            'categoryName': '产品包曝光次数',
            'categoryCode': 'T042005',
            'dynamicTimeType': 1,
            'isDynamicTime': 3,
            'thirdPartyCode': '',
            'thirdPartyField': '',
            'dateAreaType': 0,
            'initValue': '0',
            'specialCondition': ''
          }]
        }]
      },
      i: 0
    }
  },
  created () {

  },
  methods: {
    // 添加字段
    handleAddFiled () {
      this.menu.fields.push({
        label: '',
        prop: ''
      })
    },
    // 删除字段
    handleReduceFiled (key) {
      this.menu.fields.splice(key, 1)
    },
    handleAddChildRule (rule, tag) {
      if (rule.rules.length > 50) {
        this.$message({
          type: 'error',
          message: '已达最大数量'
        })
        return
      }
      if (tag.tagType === 'string' || tag.tagType === 'collect') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchTagSuggestions(tag.tagId)
        }
      } else if (tag.tagType === 'mix') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
        }
      }
      if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
        this.crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        version: 2,
        tagCode: tag.tagKey,
        tagName: tag.tagName,
        dataSource: tag.dataSource,
        value: tag.tagType === 'time' ? '-' : '',
        tagId: tag.tagId,
        tagType: tag.tagType,
        categoryName: tag.tagName,
        categoryCode: tag.tagKey,
        dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
        isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
        thirdPartyCode: tag.thirdPartyCode,
        thirdPartyField: tag.thirdPartyField,
        dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
        startDay:
          tag.tagType === 'time'
            ? tag.startDay
              ? tag.startDay
              : ''
            : undefined,
        endDay:
          tag.tagType === 'time' ? (tag.endDay ? tag.endDay : '') : undefined,
        initValue: tag.initValue,
        specialCondition: ''
      })
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    handleRemoveRule (rule, childRule) {
      const rulesJson = this.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      const tagIds = []
      rulesJson.rules.forEach(e => {
        e.rules.forEach(n => {
          if (!tagIds.includes(n.tagId)) {
            tagIds.push(n.tagId)
          }
        })
      })
      if (this.crowd && this.crowd.rulesJson) this.crowd.tagIds = tagIds

      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 3, this.recordId)
    },
    handleToNextStep () {
      this.$emit('crowdNextStep', 3, this.recordId)
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
.form-class{
  width: 80%;
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

</style>
