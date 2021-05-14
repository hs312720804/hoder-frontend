<template>
  <div class="label-container multipleSelect">
    <!-- 行为标签 -->
    <!-- {{ actionTags}} -->
    <div v-if="actionTags && actionTags.length > 0">
      <div
        v-show="actionRulesJson.rules.length > 1"
        class="label-or-space"
        :key="i + 'or'"
      >
        <el-button
          type="success"
          round
          :key="'button2' + '_' + i"
          @click="handleRulesConditionChange(actionRulesJson)"
        >
          {{ actionRulesJson.condition === 'AND' ? '且' : '或' }}
        </el-button>
      </div>
      <template v-for="(item, index) in actionRulesJson.rules">
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
              <!-- 行为标签专属日期选项 111111111111111111111111111-->
              <div v-if="childItem.dataSource === 8" class="behavior-label">

                <Range :childItem="childItem" :type="childItem.tagCode === 'BAV0003' ? ['range'] : ['range', 'week', 'time']"></Range>
                <div class="bav-attr-warp">
                  <el-tag
                    class="oc-item"
                    :type="dataSourceColorEnum[childItem.dataSource]"
                    >{{ childItem.tagName }}
                  </el-tag>

                  <span class="flex-column">
                    <!-- {{childItem.categoryCode}} -->
                    <!-- {{childItem}} -->
                      <!-- 第一级 -->
                      <el-select
                        multiple
                        v-model="childItem.bav.value"
                        style="width: 120px"
                        name="oxve"
                        class="input-inline"
                        @change="handelBehavirSelectChange(childItem)"
                      >
                        <template v-for="item in getBehaviorAttrList(childItem.dataSource)" >
                          <el-option :value="item.value" :label="item.label" :key="item.value"></el-option>
                        </template>
                      </el-select>
                      <div v-for="(item) in childItem.bav.behaviorValue" :key="item.value" class="flex-row child-attr-wrap" >
                        
                        <span class="w100">{{ item.label }}</span>
                        <span class="flex-column" >
                          <!-- 第二级 -->
                          <!-- {{ item.childCheckedVal }} -->
                          <el-select
                            multiple
                            v-model="item.childCheckedVal"
                            style="width: 110px;"
                            name="asdq"
                            class="input-inline"
                            @change="handelChildBehavirSelectChange(item)"
                          >
                            <template v-for="attrChildItem in getChildBehaviorAttrList()">
                              <el-option :value="attrChildItem.value" :label="attrChildItem.label" :key="attrChildItem.value"></el-option>
                            </template>
                          </el-select>

                          <span v-for="(item2, index) in item.child" :key="index" class="flex-row child">
                            <span class="w100">{{ item2.label }}</span>
                            <!-- 第三级 -->
                            <span v-for="(item3, index2) in item2.child" :key="'typeInputValue'+index2" class="flex-row">
                              <!-- 次数、天数 -->
                              <Times :item3="item3"></Times>
                            </span>
                          </span>
                        </span>
                      </div>
                  </span>
                </div>
              </div>

              <!-- 行为标签专属日期选项 end111111111111111111111111111-->

              
            </div>
            <div class="label-add">
              <div class="optional-condition">
                <el-tag
                  class="oc-item"
                  v-for="tagItem in actionTags"
                  :key="tagItem.tagItem"
                  @click.native="handleAddActionChildRule(item, tagItem)"
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
          v-if="actionTags.length"
          :style="{
            'padding-top': actionRulesJson.rules.length > 0 ? '10px' : 0,
          }"
        >
          <el-tag
            class="oc-item"
            v-for="item in actionTags"
            :key="item.tagName"
            @click.native="handleAddActionRule(item)"
            :type="dataSourceColorEnum[item.dataSource]"
            >{{ item.tagName }}
          </el-tag>
        </div>
      </div>
    </div>

    <el-dialog
      title="显示更多标签"
      :visible.sync="showMoreTags"
      :append-to-body="true"
      class="showMoreTags"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标签名称">
          <el-input
            v-model="formInline.attrName"
            placeholder="标签名称"
            @keyup.enter.native="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-radio-group v-model="checkboxValue">
          <el-radio
            v-for="(tag, index) in tagList"
            :label="tag.attrValue"
            :key="tag.attrId + index"
            >{{ tag.attrName }}</el-radio
          >
        </el-radio-group>
      </div>
      <el-pagination
        small
        class="pagination"
        layout="prev,pager,next"
        :total="tagsListTotal"
        :page-size="initPageSize"
        :current-page="initCurrentPage"
        @current-change="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMoreTags = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckboxOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import List from '../../views/DevelopTools/ipManage/list.vue'
import types from '../types'
import Range from './Range.vue'
import Times from './Times.vue'
export default {
  data() {
    return {
      // tags: [],
      // specialTags: [],
      aaaa: [],
      weekRange: [],
      timeRange: [],
      weekRangeVal: [],
      timeRangeVal: [],
      value1: [],
      checkedVal: [],
      periodRangeVal: '',
      defaultChildObj: {
        name: '',
        value: '',
        filed: '',
        operator: '',
        type: '',
        child: [{
          name: '',
          value: '',
          filed: '',
          operator: '',
          type: '',
        }]
      },
// ----------------
      cache: {},
      tagSelectMoreShow: false,
      showMoreTags: false,
      tagsListTotal: 0,
      formInline: {
        attrName: ''
      },
      tagList: [],
      checkboxValue: '',
      currentChildItem: '',
      suggestions: {},
      suggestionsNew: [],
      priority: '',
      initPageSize: 200,
      initCurrentPage: 1,
      activeName: 0,
      inputValue: [],
      rules: {
        noEmpty: [{ required: true, message: '不能为空', trigger: 'blur' }],
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        limitLaunchCount: [
          {
            required: true,
            message: '请输入大于0小于100万的限制数量',
            trigger: 'blur'
          }
        ]
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan',
      },
      cityData: [],
      provinceValueList: []
    }
  },
  components: {
    Range,
    Times,
    List
  },
  // props: ['tags', 'crowd', 'specialTags', 'i'],
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    actionTags: {
      type: Array,
      default: () => []
    },
    specialTags: {
      type: Array,
      default: () => []
    },
    i: {
      type: Number,
      default: 0
    },
    actionRulesJson: {
      type: Object,
      default: () => {}
    },
    crowd: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    actionRulesJson: {
      handler(val) {
        console.log('crowd==>', val)
        this.fetchAllTagSuggestions()
      },
      deep: true,
      immediate: true
    },
    
  },
  methods: {
    getDefaultChildObj() {
      return JSON.parse(JSON.stringify(this.defaultChildObj))
    },
    handelBehavirSelectChange(childItem) {
      const vals = childItem.bav.value
      const checkedList = childItem.bav.behaviorValue
      const behaviorAttrList = this.getBehaviorAttrList(childItem.dataSource)
      childItem.bav.behaviorValue = this.byValsGetValList(vals, checkedList, behaviorAttrList)
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, checkedList -- 已经组装好的集合, attrList -- 下拉框列表
    byValsGetValList (vals, checkedList, attrList, isLast = false) {
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      let list = []
      vals.forEach(val => {
        // eslint-disable-next-line no-debugger
        debugger
        const aa = [{ name: '', value: '', filed: '', operator: '=', type: 'cishu' }]
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj = checkedList.find(item => item.value === val) || attrList.find(item => item.value === val)
        obj.childCheckedVal = obj.childCheckedVal || []
        // obj.child = obj.child || aa
        // eslint-disable-next-line no-debugger
        debugger
        // console.log('obj.child=>>', obj.child)
        obj.child = obj.child || (isLast ? aa : [])
        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })
      // console.log('list===>', list)
      return list 
    },
    
    handelChildBehavirSelectChange(childItem) {
      // console.log(childItem)
      // eslint-disable-next-line no-debugger
      // debugger
      const vals = childItem.childCheckedVal
      const checkedList = childItem.child || []
      const behaviorAttrList = this.getChildBehaviorAttrList()
      childItem.child = this.byValsGetValList(vals, checkedList, behaviorAttrList, true)
      // this.checkedList[i].childCheckedVal = val
      // let obj = Object.assign(this.checkedList[i], {childCheckedVal: val})
      // this.$set(this.checkedList, i, obj)
      // console.log(this.checkedList)
    },
    getBehaviorAttrList() {
      return [{
        value: 'xiazai',
        label: '下载应用'
      }, {
        value: 'qidong',
        label: '启动应用'
      }, {
        value: 'xiezai',
        label: '卸载应用'
      }]
    },

    getChildBehaviorAttrList() {
      return [{
        value: 'mg',
        label: '芒果TV'
      },{
        value: 'tx',
        label: '腾讯视频'
      },{
        value: 'bl',
        label: 'bilibili'
      }]
    },
    // 111111111111111111
    handleCheckboxOk() {
      this.currentChildItem.value = this.checkboxValue
      this.showMoreTags = false
    },
    handleCurrentChange(index) {
      this.initCurrentPage = index
      this.$service
        .getTagAttr({
          tagId: this.currentChildItem.tagId,
          pageSize: this.initPageSize,
          pageNum: index
        })
        .then(data => {
          this.tagList = data.pageInfo.list
        })
    },
    citySelectChange(val, childRule, cityList) {
      if (childRule.tagType === 'mix') {
        const matchCity = cityList.find(item => {
          return val === item.attrName
        })
        childRule.specialCondition = matchCity.rulesJson
        childRule.errorMsg = matchCity.rulesJson
          ? ''
          : '标签未配置，请先配置再使用'
        // console.log('inputValue=====', this.inputValue)
      }
    },
    // 根据省id获取市列表
    areaSelectChange(val, tagCode, childItem) {
      if (childItem) childItem.value = ''
      if (tagCode === 'mix_area') {
        const params = {
          id: val
        }
        return this.$service.specialTagChild(params).then(data => {
          const cityData = data.slice().map(item => {
            return {
              attrValue: item.specialTagName,
              attrName: item.specialTagName,
              attrId: item.specialTagId,
              rulesJson: item.rulesJson
            }
          })
          this.$set(this.cityData, val, cityData)
        })
      }
    },
    changeTimeWays(childItem) {
      childItem.value = ''
      if (childItem.isDynamicTime) {
        childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2
      } else {
        this.$set(childItem, 'isDynamicTime', 2)
      }
    },
    getDefaultOperator() {
      return '='
    },
    onSubmit() {
      this.$service
        .getTagAttr({
          tagId: this.currentChildItem.tagId,
          pageSize: this.initPageSize,
          pageNum: 1,
          attrName: this.formInline.attrName
        })
        .then(data => {
          this.tagList = data.pageInfo.list
          this.tagsListTotal = data.pageInfo.total
        })
    },
    handleSelectMore(child) {
      this.checkboxValue = ''
      this.formInline.attrName = ''
      this.currentChildItem = child
      // this.showMoreTags = true
      this.$service
        .getTagAttr({
          tagId: child.tagId,
          pageSize: this.initPageSize,
          pageNum: this.initCurrentPage
        })
        .then(data => {
          this.showMoreTags = true
          this.tagList = data.pageInfo.list
          this.tagsListTotal = data.pageInfo.total
        })
    },
    // 获取特色标签列表
    fetchSpecialTagSuggestions(tagId, tagKey) {
      const filter = {
        tagId,
        pageSize: 100
      }
      this.$service.specialTagDetailList(filter).then(data => {
        const list = data.list.map(item => {
          return {
            attrId: item.specialTagId,
            attrName: item.specialTagName,
            attrValue:
              tagKey === 'mix_area' ? item.specialTagId : item.specialTagName,
            // attrValue: item.specialTagName,
            dataSource: 7,
            rulesJson: item.rulesJson
          }
        })
        // debugger
        this.$set(this.cache, tagId, {
          select: false,
          list
        })
      })
    },
    fetchTagSuggestions(tagId) {
      this.$service
        // .getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum: 1 })
        .getTagAttr({ tagId: tagId, pageNum: 1 })
        .then(data => {
          this.$set(this.cache, tagId, {
            select: data.select,
            list: data.pageInfo.list
          })
        })
    },
    handleRemoveRule(rule, childRule) {
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
        rulesJson.rules = rulesJson.rules.filter(function(item) {
          return item !== rule
        })
      }
    },
    handleRemoveSpecialRule(rule, childRule) {
      const rulesJson = this.dynamicPolicyJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function(item) {
          return item !== rule
        })
      }
    },
    /*添加一级标签 */
    /**
     * tag 为标签
     */
    handleAddActionRule(tag) {
      if (this.actionRulesJson.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      this.actionRulesJson.rules.push({
        condition: 'AND',
        rules: [
          {
            operator: '=',
            tagCode: tag.tagKey,
            tagName: tag.tagName,
            dataSource: tag.dataSource,
            tagId: tag.tagId,
            tagType: tag.tagType,
            categoryCode: tag.tagKey,
            bav: {
              value: [],
              behaviorValue: [],
              rangeType: 'fixed',
              rang: "",
              weekRang: [],
              timeRange: []
            }
          }
        ]
      })
    },
    handleAddActionChildRule(rule, tag) {
      if (rule.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
        this.crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        operator: '=',
        tagCode: tag.tagKey,
        tagName: tag.tagName,
        dataSource: tag.dataSource,
        tagId: tag.tagId,
        tagType: tag.tagType,
        categoryCode: tag.tagKey,
        bav: {
          value: [],
          behaviorValue: [],
          rangeType: 'fixed',
          rang: "",
          weekRang: [],
          timeRange: []
        }
      })
    },
    // 数组去重
    distinct(a, b) {
      let arr = a.concat(b)
      let result = []
      let obj = {}
      for (let i of arr) {
        if (!obj[i]) {
          result.push(i)
          obj[i] = 1
        }
      }
      return result
    },
    checkNum(num) {
      if (/(^\d+$)/.test(num)) {
        return true
      } else {
        this.$message.error('该值为必填项，且必须是大于等于0整数')
        return false
      }
    },
    checkNumMostFour(num) {
      const numInt = parseInt(num)
      if (/(^\d+$)/.test(num) && numInt <= 9999) {
        return true
      } else {
        this.$message.error(
          '该值为必填项，且必须是大于等于0整数且不能超过4位数'
        )
        return false
      }
    },
    bigNum(item) {
      const startDay = item.startDay
      const endDay = item.endDay
      if (this.checkNumMostFour(endDay)) {
        if (parseInt(startDay) >= parseInt(endDay)) {
          this.$message.error('第二个值必须大于第一个值')
        } else {
          item.value = startDay + '-' + endDay
        }
      } else {
        item.value = ''
      }
    },
    handleOperatorChange(item) {
      if (item.tagType === 'string' && item.operator === 'null') {
        item.value = 'nil'
      } else {
        item.value = ''
      }
    },
    handleRulesConditionChange(item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    fetchAllTagSuggestions() {
      // console.log('this.tags====', this.tags)
      // console.log('this.tags====', this.specialTags)
      let ruleJsonData = this.actionRulesJson || {}
      // console.log('ruleJsonData==>',  ruleJsonData)
      const len = (JSON.stringify(ruleJsonData) !== '{}' && ruleJsonData.rules) ? ruleJsonData.rules.length : 0
      // console.log('ruleJsonData==>',  ruleJsonData)

      if (len > 0) {
        let cacheIds = []
        let cacheSpecialIds = []
        ruleJsonData.rules.forEach(itemParent => {
          itemParent.rules.forEach(item => {
            if (item.tagType === 'string' || item.tagType === 'collect') {
              cacheIds.push(item.tagId)
            }
            if (item.tagType === 'mix') {
              cacheSpecialIds.push({
                tagId: item.tagId,
                tagCode: item.tagCode,
                provinceValue: item.provinceValue
              })
            }
            if (item.tagType === 'string' && item.value === 'nil') {
              item.operator = 'null'
            }
            if (item.tagType === 'time' && item.isDynamicTime === 3) {
              const value = item.value.split('-')
              this.$set(item, 'startDay', value[0])
              this.$set(item, 'endDay', value[1])
            } else if (item.tagType === 'time' && item.isDynamicTime !== 3) {
              this.$set(item, 'dateAreaType', '')
              this.$set(item, 'dynamicTimeType', parseInt(item.dynamicTimeType))
            }
          })
          // return itemParent
        })
        // this.rulesJson = ruleJsonData
        // if (policyData.dynamicPolicyJson) {
        //   this.dynamicPolicyJson = JSON.parse(policyData.dynamicPolicyJson)
        // }
        cacheIds = this.distinct(cacheIds, [])
        if (cacheIds.length !== 0) {
          cacheIds.forEach(this.fetchTagSuggestions)
        }
        // 特色标签的 id 集合
        if (cacheSpecialIds.length !== 0) {
          cacheSpecialIds.forEach(item => {
            this.fetchSpecialTagSuggestions(item.tagId, item.tagCode)
            this.areaSelectChange(item.provinceValue, item.tagCode) // 根据省id获取市列表
          })
        }
      }
    }
  },
  created() {
    // console.log('rulesJson==', this.rulesJson)
    this.weekRange = Object.keys(types.weekRange).map(item => {
      return {
        label: types.weekRange[item],
        value: item
      }
    })
    this.timeRange = Object.keys(types.timeRange).map(item => {
      return {
        label: types.timeRange[item],
        value: item
      }
    })
  }
}
</script>
<style scoped  lang="stylus">
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
  width: 250px;
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
  overflow-y: hidden;
  display: flex
}
.w100 {
  min-width: 100px;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.child-attr-wrap {
  border: 1px dashed #fff;
  padding: 20px 5px;
  margin: 10px 0
  &:hover {
    // text-decoration: underline;
    border-color: rgb(0, 188, 212)
    border-radius: 7px
  }
}
.bav-attr-warp {
  align-items: baseline
  border: 1px dashed #fff;
  display: flex;
  margin-bottom: 10px;
  &:hover {
    // text-decoration: underline;
    border-color: rgb(0, 188, 212)
    border-radius: 7px
  }
}
</style>