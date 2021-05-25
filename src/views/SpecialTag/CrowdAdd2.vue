<template>
  <el-collapse class="el-collapse" accordion v-model="activeName">
    <div class="el-collapse_item">
      <template v-for="(crowd, i) in inputValue">
        <div class="items" :key="i">
          <el-collapse-item :name="i" :key="i" class="crowd-content">
            <el-form-item
              label="标签名称"
              :prop="formProp(i + '.specialTagName')"
              :rules="rules.specialTagName"
            >
              <el-input
                v-model="crowd.specialTagName"
                placeholder="标签名称"
              ></el-input>
            </el-form-item>
            <div style="position: relative">
              <el-form-item label="设置标签" class="multipleSelect" required>
                <MultipleSelect
                  :tags="tags"
                  :rulesJson="crowd.rulesJson"
                  :crowd="crowd"
                  :i="i"
                ></MultipleSelect>
              </el-form-item>
              <div class="outer-and" v-if="specialTags.length > 0">
                <el-button
                  type="danger"
                  v-if="
                    specialTags.length > 0 &&
                    tags.length > 0 &&
                    crowd.dynamicPolicyJson
                  "
                  @click="handleConditionChange(crowd)"
                  round
                  :key="i + 'condition'"
                  >{{
                    crowd.dynamicPolicyJson.link === 'OR' ? '或' : '且'
                  }}</el-button
                >
              </div>
              <el-form-item label="动态因子" v-if="specialTags.length > 0">
                <MultipleSelect
                  :specialTags="specialTags"
                  :dynamicPolicyJson="crowd.dynamicPolicyJson"
                  :crowd="crowd"
                  :i="i"
                ></MultipleSelect>
              </el-form-item>
            </div>
          </el-collapse-item>
          <a class="app-params__remove-param" @click="handleRemoveParam(i)">
            <i v-show="i > 0" class="icon iconfont el-icon-cc-delete"></i>
          </a>
        </div>
      </template>
      <br />
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
  </el-collapse>
</template>

<script>
import MultipleSelect from '@/components/MultipleSelect.vue'
export default {
  components: {
    MultipleSelect
  },
  data() {
    return {
      tags: [],
      specialTags: [],
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
        // noEmpty: [
        //   { required: true, message: '不能为空', trigger: 'blur' }
        // ],
        specialTagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
        // limitLaunchCount: [
        //   { required: true, message: '请输入大于0小于10万的限制数量', trigger: 'blur' }
        // ]
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      }
    }
  },
  props: ['value', 'propPrefix', 'initTagList'],
  watch: {
    value: 'setInputValue'
  },
  inject: ['sTagIndex'],
  methods: {
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
    handleCheckboxOk() {
      this.currentChildItem.value = this.checkboxValue
      this.showMoreTags = false
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
    fetchTagSuggestions(tagId) {
      this.$service
        .getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum: 1 })
        .then(data => {
          this.$set(this.cache, tagId, {
            select: data.select,
            list: data.pageInfo.list
          })
        })
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
    handleRemoveRule(crowd, rule, childRule) {
      const rulesJson = crowd.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      const tagIds = []
      crowd.rulesJson.rules.forEach(e => {
        e.rules.forEach(n => {
          if (!tagIds.includes(n.tagId)) {
            tagIds.push(n.tagId)
          }
        })
      })
      crowd.tagIds = tagIds
      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function(item) {
          return item !== rule
        })
      }
    },
    handleRemoveSpecialRule(crowd, rule, childRule) {
      const rulesJson = crowd.dynamicPolicyJson
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
    handleAddRule(crowd, tag) {
      if (crowd.rulesJson.rules.length > 50) {
        this.$message({
          type: 'error',
          message: '已达最大数量'
        })
        return
      }
      if (!crowd.tagIds.includes(tag.tagId)) {
        crowd.tagIds.push(tag.tagId)
      }
      if (tag.tagType === 'string' || tag.tagType === 'collect') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchTagSuggestions(tag.tagId)
        }
      }
      crowd.rulesJson.rules.push({
        condition: 'AND',
        rules: [
          {
            operator:
              tag.tagType === 'time' ? 'between' : this.getDefaultOperator('='),
            tagCode: tag.tagKey,
            tagName: tag.tagName,
            dataSource: tag.dataSource,
            value: '',
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
              tag.tagType === 'time'
                ? tag.endDay
                  ? tag.endDay
                  : ''
                : undefined,
            initValue: tag.initValue
          }
        ]
      })
    },
    handleAddChildRule(crowd, rule, tag) {
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
      }
      if (!crowd.tagIds.includes(tag.tagId)) {
        crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        operator:
          tag.tagType === 'time' ? 'between' : this.getDefaultOperator('='),
        tagCode: tag.tagKey,
        tagName: tag.tagName,
        dataSource: tag.dataSource,
        value: '',
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
        initValue: tag.initValue
      })
    },
    handleAddSpecialRule(crowd, tag) {
      if (crowd.dynamicPolicyJson.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      crowd.dynamicPolicyJson.rules.push({
        condition: 'AND',
        rules: [
          {
            operator: '=',
            tagCode: tag.tagKey,
            tagName: tag.tagName,
            dataSource: tag.dataSource,
            value: '',
            tagId: tag.tagId,
            tagType: tag.tagType,
            categoryName: tag.tagName,
            categoryCode: tag.tagKey,
            dynamic: {
              type: 1,
              version: ''
            },
            initValue: tag.initValue
          }
        ]
      })
    },
    handleAddSpecialChildRule(crowd, rule, tag) {
      if (rule.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      // if(tag.tagType==='string' || tag.tagType === 'collect'){
      //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
      // }
      if (!crowd.tagIds.includes(tag.tagId)) {
        crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        operator: '=',
        tagCode: tag.tagKey,
        tagName: tag.tagName,
        dataSource: tag.dataSource,
        value: '',
        tagId: tag.tagId,
        tagType: tag.tagType,
        categoryName: tag.tagName,
        categoryCode: tag.tagKey,
        dynamic: {
          type: 1,
          version: ''
        },
        initValue: tag.initValue
      })
      // console.log('crowd====', crowd)
    },
    changeSeq() {
      this.inputValue.sort(function(x, y) {
        return x.crowdOrder - y.crowdOrder
      })
      this.setSeq()
    },
    formProp(key) {
      // debugger
      return (this.propPrefix || '') + key
    },
    setInputValue(val) {
      // debugger
      // console.log('trigger setInputValue method')
      if (val !== this.inputValue) {
        // debugger
        if (val.length > 0) {
          this.inputValue = val
          this.setSeq()
        } else {
          if (this.inputValue.length > 0) {
            return
          }
          this.inputValue.push({
            parentId: '',
            belongTagId: '',
            recordId: this.getRecordId(),
            tempCrowdId: undefined,
            specialTagName: undefined,
            tagIds: [],
            // 'purpose': undefined,
            remark: undefined,
            crowdOrder: length + 1,
            rulesJson: {
              condition: 'OR',
              rules: []
            },
            dynamicPolicyJson: {
              link: 'AND',
              condition: 'AND',
              rules: []
            }
            // 'limitLaunch': false,
            // 'limitLaunchCount': undefined,
            // total0: undefined
          })
          this.setSeq()
        }
      }
    },
    emitInputValue() {
      this.$emit('input', this.inputValue)
    },
    // handleAddParam () {
    //   const length = this.inputValue.length
    //   this.activeName = length
    //   if (length >= 5) {
    //     this.$message({
    //       type: 'error',
    //       message: '最多添加5个'
    //     })
    //     return
    //   }
    //   this.inputValue.push(
    //     {
    //       'recordId': this.getRecordId(),
    //       'tempCrowdId': undefined,
    //       'crowdName': undefined,
    //       'tagIds': [],
    //       'purpose': undefined,
    //       'remark': undefined,
    //       'crowdOrder': length + 1,
    //       'rulesJson': {
    //         condition: 'OR',
    //         rules: []
    //       },
    //       'dynamicPolicyJson': {
    //           link: 'AND',
    //           condition: 'OR',
    //           rules: []
    //       },
    //       'limitLaunch': false,
    //       'limitLaunchCount': undefined,
    //       total0: undefined
    //     }
    //   )
    //   this.setSeq()
    // },
    getRecordId() {
      return this.recordId
    },
    setSeq() {
      let inputValue = JSON.parse(JSON.stringify(this.inputValue))
      this.inputValue = inputValue.map((e, index) => {
        e.crowdOrder = index + 1
        // if (e.dynamicPolicyJson) {
        //     e.dynamicPolicyJson = {
        //         condition: 'OR',
        //         rules: []
        //     }
        // }
        return e
      })
    },
    handleRemoveParam(index) {
      this.inputValue.splice(index, 1)
      this.setSeq()
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
    handleEstimate(formData) {
      this.$service.estimateTemp(formData.rulesJson).then(data => {
        if (data || data === 0) {
          this.$set(formData, 'total0', data)
        }
      })
    },
    handleOperatorChange(item) {
      if (item.tagType === 'string' && item.operator === 'null') {
        item.value = 'nil'
      } else {
        item.value = ''
      }
    },
    handleConditionChange(crowd) {
      crowd.dynamicPolicyJson.link =
        crowd.dynamicPolicyJson.link === 'AND' ? 'OR' : 'AND'
    },
    handleRulesConditionChange(item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
      // console.log(item.condition)
    }
  },
  created() {
    // console.log('this.params===', this.$route.params)
    // console.log('this.value', this.value)
    if (this.value) {
      // this.$service.tagInfoNew(this.recordId).then(data => {
      // this.tags = data
      const data = this.initTagList
      // console.log(data)
      const normalTags = []
      const specialTags = []
      data.forEach(item => {
        if (item.dataSource === 6) {
          specialTags.push(item)
        } else {
          normalTags.push(item)
        }
      })
      this.tags = normalTags
      this.specialTags = specialTags

      this.setInputValue(this.value)
      // })
    }
    this.$watch('inputValue', this.emitInputValue, {
      deep: true
    })

    // const detail = this.sTagIndex.specialTagDetail.specialTag

    //编辑
    // this.$service.crowdEdit({ crowdId: this.crowdId }).then(data => {
    // let policyData = data.policyCrowds
    // this.form.name = policyData.crowdName
    // this.form.remark = policyData.remark
    // this.priority = policyData.priority
    // this.form.limitLaunch = policyData.limitLaunch
    // this.form.limitLaunchCount = policyData.limitLaunch ? policyData.limitLaunchCount : undefined
    // this.currentLaunchLimitCount = policyData.limitLaunch ? policyData.limitLaunchCount : undefined
    let ruleJsonData = JSON.parse(
      this.sTagIndex.specialTagDetail.specialTag.rulesJson
    )
    var cacheIds = []
    if (ruleJsonData) {
      ruleJsonData.rules = ruleJsonData.rules.map(itemParent => {
        itemParent.rules.forEach(item => {
          if (item.tagType === 'string' || item.tagType === 'collect') {
            cacheIds.push(item.tagId)
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
        return itemParent
      })
      this.inputValue[0].rulesJson.rules = ruleJsonData.rules
      // console.log('ruleJsonData.rules===', ruleJsonData.rules)
    }

    // this.rulesJson = ruleJsonData
    // if (policyData.dynamicPolicyJson) {
    //     this.dynamicPolicyJson = JSON.parse(policyData.dynamicPolicyJson)
    // }
    // cacheIds = this.distinct(cacheIds,[])
    // if(cacheIds.length !== 0){
    //     cacheIds.forEach(this.fetchTagSuggestions)}
    // })
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

.app-params__remove-param {
  display: inline-block;
  cursor: pointer;
  // border 1px solid #999
  // border-radius 13px
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  color: #999;
  margin-left: 5px;
}

.items {
  display: flex;
  align-items: center;

  >>> .el-form-item {
    margin-bottom: 20px;
  }

  >>>.el-collapse-item__wrap {
    background-color: rgba(249, 249, 249, 0.85);
    padding: 10px;
    border: none;
  }
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

.add {
  border: 1px solid #ebeef5;
  padding: 20px;
  border-radius: 4px;
}

.title {
  font-size: 18px;
  margin-bottom: 30px;
}

.footer {
  display: flex;
  justify-content: flex-end;
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

.items >>> .collapse-title {
  width: 50%;
  display: flex;
  justify-content: space-between;
}

.items >>> .count-tips {
  color: red;
  font-size: 12px;
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

.el-collapse {
  >>> .el-tag--warningOrange {
    color: #512DA8;
    background-color: rgba(119, 81, 200, 0.4);
    border-color: rgba(81, 45, 168, 0.45);

    .el-tag__close {
      color: #512DA8;
    }
  }

  >>> .el-tag--warningOrange2 {
    color: #795548;
    background-color: rgba(167, 130, 117, 0.5);
    border-color: #7955488c;

    .el-tag__close {
      color: #512DA8;
    }
  }
  >>> .el-tag--warningCyan {
    color: #00bcd4;
    background-color: rgba(0, 189, 214, .1);
    border-color: #00bcd42b
  }
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
</style>
