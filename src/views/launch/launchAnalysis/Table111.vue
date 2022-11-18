<template>
  <div class="add">

    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form
          :model="form"
          :rules="formRules"
          ref="form"
          label-width="130px"
        >
          <!-- <el-form-item label="人群名称" prop="name">
            <el-input
              size="small"
              v-model="form.name"
              placeholder="投放名称"
              :maxlength="50"
            ></el-input>
          </el-form-item> -->
          tags---{{tags}}
          <br/>
          <br/>
            <!-- tags---[ { "thirdPartyApiId": "", "tagId": "4439", "tagType": "string", "thirdPartyCode": "", "inputType": null, "tagKey": "T010121", "tagName": "购物APK版本", "dataSource": 2, "initValue": "0", "thirdPartyField": "", "child": [] }, { "thirdPartyApiId": "", "tagId": "8303", "tagType": "string", "thirdPartyCode": "", "inputType": null, "tagKey": "T010125", "tagName": "芯片型号", "dataSource": 2, "initValue": "0", "thirdPartyField": "", "child": [] } ] -->
            <!-- rulesJson --- {{ rulesJson }} -->

          <div style="position: relative">
            <div v-if="tags.length > 0">
              <el-form-item label="设置标签" class="multipleSelect" prop="tagIds">
                <MultipleSelect
                  :tags="tags"
                  :rulesJson="rulesJson"
                ></MultipleSelect>
              </el-form-item>
            </div>

            <div class="outer-and" v-if="(tags.length > 0 &&  actionTags.length > 0 && hasBehaviorTag) || (tags.length > 0 &&  specialTags.length > 0) || (actionTags.length > 0  && hasBehaviorTag &&  specialTags.length > 0)">
              <el-button
                type="danger"
                @click="handleConditionChange()"
                round
                :key="'condition'"
              >{{ (behaviorRulesJson.link) === 'OR' ? '或' : '且' }} </el-button>
            </div>

            <el-form-item label="行为标签" v-if="actionTags.length > 0 && hasBehaviorTag">
              <!-- {{behaviorRulesJson}} -->
              <MultipleActionTagSelect
                ref="multipleActionTagSelect"
                :actionTags="actionTags"
                :behaviorRulesJson="behaviorRulesJson"
              ></MultipleActionTagSelect>
                <!-- @hasMoveBehaviorTagRule="hasMoveBehaviorTagRule" -->
            </el-form-item>

            <el-form-item label="动态因子" v-if="specialTags.length > 0">
              <MultipleSelect
                :specialTags="specialTags"
                :dynamicPolicyJson="dynamicPolicyJson"
              ></MultipleSelect>
            </el-form-item>
          </div>

        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="显示更多标签"
      :append-to-body="true"
      :visible.sync="showMoreTags"
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
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMoreTags = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckboxOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MultipleSelect from '@/components/MultipleSelect.vue'
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/Index.vue'
export default {
  components: {
    MultipleSelect,
    MultipleActionTagSelect
  },
  data () {
    const checkIntNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('限制投放数量不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入大于0小于1,000,000的整数'))
      } else {
        callback()
      }
    }
    return {
      // attrs: [[${attrs}]] || {},
      versionNum: 2,
      cache: {},
      tags: [],
      actionTags: [],
      specialTags: [],
      tagInitSize: 200,
      tagCurrentPage: 1,
      tagSelectMoreShow: false,
      showMoreTags: false,
      tagList: [],
      checkboxValue: '',
      currentChildItem: '',
      // 选择更多标签分页
      initPageSize: 200,
      initCurrentPage: 1,
      tagsListTotal: 0,
      // tag 查询模块
      formInline: {
        attrName: ''
      },
      // usedTags: [[${usedTags}]] || {},
      rulesJson: { condition: 'OR', rules: [] },
      behaviorRulesJson: { link: 'AND', condition: 'OR', rules: [] },
      dynamicPolicyJson: { link: 'AND', condition: 'OR', rules: [] },
      suggestions: {},
      suggestionsNew: [],
      priority: '',
      form: {
        name: '',
        policyId: null,
        remark: '',
        // crowdExp: [],
        autoVersion: false,
        isShowAutoVersion: false,
        limitLaunch: false,
        limitLaunchCount: undefined
      },
      formRules: {
        name: [{ required: true, message: '请填写人群名称', trigger: 'blur' }],
        // crowdExp: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        limitLaunchCount: [{ validator: checkIntNumber, trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate (time) {
          // 设置可选时间为今天之后的60天内
          // 为了解当前时间不是23.59.59,第60选不了当前时间点之后的时间点
          // 比如当前是10.10.10,选不了第60天的10.10.10之后的点
          const today = new Date().setHours(23, 59, 59)
          const curDate = new Date(today).getTime()
          // 算出一个月的毫秒数，这里使用30的平均值，实际应根据具体的每个月有多少天计算
          const day = 60 * 24 * 3600 * 1000
          const dateRange = curDate + day
          return (
            time.getTime() < Date.now() - 24 * 60 * 60 * 1000 ||
            time.getTime() > dateRange
          )
        }
      },
      currentLaunchLimitCount: undefined,
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan',
        11: 'success',
        12: 'gray'
      },
      cityData: [],
      provinceValueList: [],
      timeTagKongList: []
    }
  },
  watch: {
    behaviorRulesJson: {
      handler () {
        this.hasMoveBehaviorTagRule()
      },
      deep: true
    }
  },
  computed: {
    hasBehaviorTag () {
      return this.actionTags.some(item => item.dataSource === 8)
    }
  },
  // props: ['policyId', 'crowdId', 'limitLaunchDisabled', 'isDynamicPeople'],
  methods: {

    // 判断是否有动态的时间周期的行为标签，有则展示勾选“是否每日更新”
    hasMoveBehaviorTagRule () {
      const crowd = this.form
      const behaviorRules = this.behaviorRulesJson.rules

      let hasBehaviorRule = false // 是否有行为标签
      let hasMoveRule = false // 是否有动态周期
      let hasFullTag = false // 是否有下面的标签，有的话就展示；应用状态 (BAV0009)，会员状态 (BAV0001)，购买行为 (BAV0003)，用户活跃 (BAV0010)
      const fullTagList = ['BAV0009', 'BAV0001', 'BAV0003', 'BAV0010']

      if (behaviorRules.length > 0) {
        hasBehaviorRule = true
        for (let x = 0; x < behaviorRules.length; x++) {
          const rule = behaviorRules[x]
          for (let y = 0; y < rule.rules.length; y++) {
            const item = rule.rules[y]
            if (item.bav && item.bav.rangeType === 'move') {
              hasMoveRule = true
              break
            }
            if (fullTagList.includes(item.tagCode)) {
              hasFullTag = true
              break
            }
          }
        }
      }

      if (hasBehaviorRule && (hasMoveRule || hasFullTag)) { // 展示勾选“是否每日更新”
        // 当有isShowAutoVersion并且 为 false的时候，初始默认选择是。否则不限制选择
        if (crowd.isShowAutoVersion !== undefined && !crowd.isShowAutoVersion) {
          crowd.autoVersion = true
        }
        crowd.isShowAutoVersion = true
      } else {
        crowd.isShowAutoVersion = false
        crowd.autoVersion = false
      }
    },

    // citySelectChange (val, childRule, cityList) {
    //   if (childRule.tagType === 'mix') {
    //     const matchCity = cityList.find(item => {
    //       return val === item.attrName
    //     })
    //     childRule.specialCondition = matchCity.rulesJson
    //     childRule.errorMsg = matchCity.rulesJson
    //       ? ''
    //       : '标签未配置，请先配置再使用'
    //     // console.log('inputValue=====', this.inputValue)
    //   }
    // },
    // 根据省id获取市列表
    areaSelectChange (val, tagCode, childItem) {
      // this.provinceValueList[index] = val
      // console.log(this.provinceValueList==='', this.provinceValueList)
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
          // console.log('this.cityData===', this.cityData)
        })
      }
    },
    changeTimeWays (childItem) {
      childItem.value = ''
      if (childItem.isDynamicTime) {
        childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2
      } else {
        this.$set(childItem, 'isDynamicTime', 2)
      }
    },
    handleRemoveRule (rule, childRule) {
      const rulesJson = this.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },
    handleRemoveSpecialRule (rule, childRule) {
      const rulesJson = this.dynamicPolicyJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },

    handleAddChildRule (rule, tag) {
      if (rule.rules.length > 50) {
        this.$message.warning('已达最大数量')
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
        initValue: tag.initValue,
        specialCondition: ''
      })
    },
    handleAddSpecialRule (tag) {
      if (this.dynamicPolicyJson.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      // if(tag.tagType==='string' || tag.tagType === 'collect'){
      //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
      // }
      this.dynamicPolicyJson.rules.push({
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
    handleAddSpecialChildRule (rule, tag) {
      if (rule.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      // if(tag.tagType==='string' || tag.tagType === 'collect'){
      //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
      // }
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
    },
    // 获取组合标签列表
    fetchSpecialTagSuggestions (tagId, tagKey) {
      const filter = {
        tagId,
        pageSize: 200,
        isSelect: 1
      }
      this.$service.specialTagDetailList(filter).then(data => {
        //     // this.itemList = data.list
        //     // this.total = data.total
        //     // console.log('data===>', data)
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
        this.$set(this.cache, tagId, {
          select: false,
          list
        })
        // console.log('123cache===', this.cache)
      })
    },

    // 获取行为标签下拉选项
    fetchActionTagSuggestions (tagCode) {
      if (this.bavAttrList[tagCode]) return
      this.$service.getBavTagList({ id: this.tagCodeValue[tagCode] }).then(res => {
        this.bavAttrList[tagCode] = res || {}
        this.$set(this.bavAttrList, tagCode, res)
        this.bavAttrList = Object.assign({}, this.bavAttrList, this.bavAttrList)
        console.log('this.bavAttrList==>', this.bavAttrList)
        // })
      })
    },

    fetchTagSuggestions (tagId) {
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
    handleCheckboxOk () {
      this.currentChildItem.value = this.checkboxValue
      this.showMoreTags = false
    },
    handleSelectMore (child) {
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
    handleCurrentChange (index) {
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
    onSubmit () {
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
    getDefaultOperator () {
      return '='
    },

    // 给 behaviorRulesJson 中的table 添加序号
    putBehaviorRulesJsonTableIndex (val) {
      if (val) {
        let tableIndex = 0
        const ruleList = val.rules
        ruleList.forEach(rule => {
          const ruleGroup = rule.rules
          ruleGroup.forEach(item => {
            tableIndex = tableIndex + 1
            item.table = item.table.split('$')[0] + '$' + tableIndex
            if (item.bav) item.bav.table = item.bav.table.split('$')[0] + '$' + tableIndex
          })
        })
      } else {
        val = { link: 'AND', condition: 'OR', rules: [] }
        // val = ''
      }
      return val
    },

    getFormPromise (form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },

    validateForm (rules, dynamicPolicyRules, behaviorRules = []) {
      this.timeTagKongList = []
      // 判断设置标签里是否有未填写的项
      let i
      let j = 0
      const ruleLength = rules.length
      const dynamicPolicyRulesLength = dynamicPolicyRules.length
      let rulesFlag = true

      // ------------------- 普通标签规则校验 --------------------------
      for (i = 0; i < ruleLength; i++) {
        for (j = 0; j < rules[i].rules.length; j++) {
          const rulesItem = rules[i].rules[j]

          // 多选的值，保存的时候需要转成字符串 2222
          if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
            rulesItem.value = rulesItem.value.join(',')
          }
          // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
          const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
          if (isTimeTagKong) {
            if (!this.timeTagKongList.includes(rulesItem.tagName)) {
              this.timeTagKongList.push(rulesItem.tagName)
            }
          } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
            this.$message.error(
              '请正确填写第' +
                (i + 1) +
                '设置标签块里面的第' +
                (j + 1) +
                '行的值！'
            )
            rulesFlag = false
            break
          } else if (rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3) {
            // 二期之后的
            if (rulesItem.version > 0) {
              const startDay = rulesItem.startDay ? rulesItem.startDay : '@'
              const endDay = rulesItem.endDay ? rulesItem.endDay : '@'
              rulesItem.value = startDay + '~' + endDay
            } else { // 一期
              if (
                this.checkNumMostFour(rulesItem.startDay) &&
                this.checkNumMostFour(rulesItem.endDay)
              ) {
                if (
                  parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)
                ) {
                  rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
                } else {
                  this.$message.error(
                    '第' +
                      (i + 1) +
                      '设置标签块里面的第' +
                      (j + 1) +
                      '行的天数值后面的值必须大于前面的'
                  )
                  rulesFlag = false
                  break
                }
              } else {
                this.$message.error(
                  '第' +
                    (i + 1) +
                    '设置标签块里面的第' +
                    (j + 1) +
                    '行的值是大于等于0的整数且不能超过4位数'
                )
                rulesFlag = false
                break
              }
            }
          } else if (rulesItem.tagType === 'string' && rulesItem.operator === 'null') {
            rulesItem.operator = '='
          }

          if (!rulesFlag) break
        }
        if (!rulesFlag) break
      }

      // ------------------- 行为标签中的大数据标签规则校验 --------------------------
      // ------------------- 行为标签中的【起播活跃】行为标签规则校验 兼容性处理--------------------------
      // const behaviorRulesJsonData = JSON.parse(JSON.stringify(rulesJson[index].behaviorRulesJson))
      // const behaviorRules = JSON.parse(JSON.stringify(behaviorRulesJsonData.rules))
      const behaviorRulesLength = behaviorRules.length
      let x
      let y = 0
      // 判断是否有未填写的项

      for (x = 0; x < behaviorRulesLength; x++) {
        for (y = 0; y < behaviorRules[x].rules.length; y++) {
          const rulesItem = behaviorRules[x].rules[y]

          if (rulesItem.isOldversion) { // 行为标签中的【起播活跃】行为标签规则校验 兼容性处理
            this.$message.error('【起播活跃 - BAV0011】组件升级，若要编辑请删除后重新创建')
            rulesFlag = false
            break
          }
          // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
          const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
          if (isTimeTagKong) {
            if (!this.timeTagKongList.includes(rulesItem.tagName)) {
              this.timeTagKongList.push(rulesItem.tagName)
            }
          } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
            this.$message.error(
              '请正确填写第' +
                (x + 1) +
                '行为标签块里面的第' +
                (y + 1) +
                '行的值！'
            )
            rulesFlag = false
            break
          } else if (
            rulesItem.tagType === 'time' &&
            rulesItem.isDynamicTime === 3
          ) {
            // 二期之后的
            if (rulesItem.version > 0) {
              const startDay = rulesItem.startDay ? rulesItem.startDay : '@'
              const endDay = rulesItem.endDay ? rulesItem.endDay : '@'
              rulesItem.value = startDay + '~' + endDay
            } else { // 一期
              if (
                this.checkNum(rulesItem.startDay) &&
                this.checkNum(rulesItem.endDay)
              ) {
                if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) {
                  rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
                } else {
                  this.$message.error(
                    '第' +
                      (x + 1) +
                      '行为标签块里面的第' +
                      (y + 1) +
                      '行的天数值后面的值必须大于前面的'
                  )
                  rulesFlag = false
                  break
                }
              } else {
                this.$message.error(
                  '第' +
                    (x + 1) +
                    '行为标签块里面的第' +
                    (y + 1) +
                    '行的值是大于等于0的整数且不能超过4位数'
                )
                rulesFlag = false
                break
              }
            }
          }
        }
      }
      // if (!rulesFlag) break

      // ------------------- 动态因子规则校验 --------------------------
      for (i = 0; i < dynamicPolicyRulesLength; i++) {
        for (j = 0; j < dynamicPolicyRules[i].rules.length; j++) {
          const rulesItem = dynamicPolicyRules[i].rules[j]
          if (rulesItem.value === '' || rulesItem.dynamic.version === '') {
            this.$message.error(
              '请正确填写第' +
                (i + 1) +
                '动态因子里面的第' +
                (j + 1) +
                '行的值！'
            )
            rulesFlag = false
            break
          }
          if (!rulesFlag) break
        }
        if (!rulesFlag) break
      }
      // if (!dynamicPolicyFlag) return
      return rulesFlag
    },

    checkIfChildrenExist (data1, data2) {
      if (data1.child == null || data1.child.length === 0) {
        data1.child.push(data2)
        return data1
      }
      // 递归
      this.checkIfChildrenExist(data1.child[0], data2)
    },

    ReorganizationData (data) { // 将数组变成层级关系
      let rData = []
      const len = data.length

      if (len > 1) {
        for (let i = len - 1; i > -1; i--) {
          rData = data[i]
          if (data[i - 1]) {
            rData = this.checkIfChildrenExist(data[i - 1], rData)
          }
        }
      } else {
        rData = data
        if (data[0] && data[0].child && data[0].child.length > 1) {
          rData[0].child = this.ReorganizationData(data[0].child)
        }
      }
      return rData
    },

    handleSave () {
      const _this = this
      this.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          const tagIds = []
          const ruleJson = JSON.parse(JSON.stringify(this.rulesJson))
          const behaviorRulesJson = this.putBehaviorRulesJsonTableIndex(JSON.parse(JSON.stringify(this.behaviorRulesJson)))
          const dynamicPolicyJson = JSON.parse(
            JSON.stringify(this.dynamicPolicyJson)
          )
          const rules = ruleJson.rules
          const dynamicPolicyRules = dynamicPolicyJson.rules

          const behaviorRules = behaviorRulesJson.rules

          if (this.limitLaunchDisabled && this.currentLaunchLimitCount) {
            if (this.currentLaunchLimitCount > form.limitLaunchCount) {
              this.$message.error('投放数量不能小于上一次设置的限制数量')
              return
            }
          }

          if (!this.validateForm(rules, dynamicPolicyRules, behaviorRules)) {
            return
          }

          // 添加tagIds
          rules.forEach(function (item) {
            item.rules.forEach(function (childItem) {
              if (tagIds.indexOf(childItem.tagId) === -1) {
                tagIds.push(childItem.tagId)
              }
              // delete childItem.startDay
              // delete childItem.endDay
            })
          })
          dynamicPolicyRules.forEach(function (item) {
            item.rules.forEach(function (childItem) {
              if (tagIds.indexOf(childItem.tagId) === -1) {
                tagIds.push(childItem.tagId)
              }
            })
          })
          behaviorRules.forEach(function (item) {
            item.rules.forEach(function (rulesItem) {
              if (tagIds.indexOf(rulesItem.tagId) === -1) {
                tagIds.push(rulesItem.tagId)
              }
              // 多选的值，保存的时候需要转成字符串 2222
              // if (childItem.tagType === 'string') {
              if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
                rulesItem.value = Array.isArray(rulesItem.value) ? rulesItem.value.join(',') : rulesItem.value
              }

              // if (rulesItem.bav && rulesItem.bav.rang.newValue) { // 日期多选
              if (rulesItem.bav && rulesItem.bav.rang.newValue && rulesItem.bav.rangeType === 'fixed') { // 固定周期 日期多选
                const newValue = rulesItem.bav.rang.newValue
                const data = []
                newValue.forEach(item => {
                  if (item.value && item.value.length > 0) data.push({ value: item.value })
                })
                rulesItem.bav.rang.newValue = data
                rulesItem.bav.rang.value = newValue.map(item => {
                  if (item.value) return item.value
                }).flat()
              }

              if (rulesItem.tagCode === 'BAV0012' || rulesItem.tagCode === 'BAV0011') { // 【综合起播】数据需要重组  showBehaviorValue => behaviorValue
                const rData = []
                const showBehaviorValue = rulesItem.bav.showBehaviorValue
                showBehaviorValue.forEach(item => {
                  const itemCopy = JSON.parse(JSON.stringify(item))
                  const childArray = _this.ReorganizationData(itemCopy.child)
                  const countValue = JSON.parse(JSON.stringify(rulesItem.bav.countValue))
                  countValue.child = childArray
                  itemCopy.child = [countValue]
                  rData.push(itemCopy)
                })
                rulesItem.bav.behaviorValue = rData
              }
            })
          })

          const data = {
            crowdName: form.name,
            tagIds: tagIds.join(','),
            rulesJson: JSON.stringify(ruleJson),
            behaviorRulesJson: JSON.stringify(behaviorRulesJson),
            dynamicPolicyJson: JSON.stringify(dynamicPolicyJson),
            remark: form.remark,
            policyId: form.policyId,
            // crowdValidFrom: form.crowdExp[0],
            // crowdValidTo: form.crowdExp[1],
            autoVersion: form.autoVersion,
            isShowAutoVersion: form.isShowAutoVersion,
            limitLaunch: form.limitLaunch,
            limitLaunchCount: form.limitLaunch
              ? form.limitLaunchCount
              : undefined,
            versionNum: 2
          }

          // 获取到组件中的form  校验必填项
          // 周期范围
          const rangeFormList = []
          const rangeRefList = this.$refs.multipleActionTagSelect && this.$refs.multipleActionTagSelect.$refs.range ? this.$refs.multipleActionTagSelect.$refs.range : []

          rangeRefList.forEach(item => {
            rangeFormList.push(item.$refs.rangeForm)
          })

          // value值
          const typeFormList = []
          const typeRefList = this.$refs.multipleActionTagSelect && this.$refs.multipleActionTagSelect.$refs.bav ? this.$refs.multipleActionTagSelect.$refs.bav : []

          const bavFormList = []

          // vue的特性,自动把v-for里面的ref展开成数组的形式，哪怕你的ref名字是唯一的
          typeRefList && typeRefList.forEach(item => {
            if (item.$refs.bav) bavFormList.push(item.$refs.bav)
            if (item.$refs.typeRef && Array.isArray(item.$refs.typeRef)) {
              item.$refs.typeRef.forEach(obj => {
                typeFormList.push(obj.$refs.typeForm)
              })
            } else if (item.$refs.typeRef && typeof (item.$refs.typeRef) === 'object') { // 【设备活跃】tab只有一个 type 组件，因此 typeRef 不为数组
              typeFormList.push(item.$refs.typeRef.$refs.typeForm)
            }
          })

          const allList = rangeFormList.concat(typeFormList, bavFormList)

          // 选择了属性为空的 time 类型的标签, 需要提示
          if (this.timeTagKongList.length > 0) {
            const tip = this.timeTagKongList.join(',')
            const h = this.$createElement
            this.$msgbox({
              title: '配置提醒',
              message: h('p', null, [
                h('span', null, `${tip}`),
                h('span', null, '标签的属性为空，请确认是否继续?'),
                h('div', { style: 'color: red' }, 'PS：标签为空代表要圈出该属性为空的人群')
              ]),
              showCancelButton: true,
              confirmButtonText: '继续',
              cancelButtonText: '取消'
            }).then(() => {
              if (allList.length > 0) { // 有行为标签的
                // 使用Promise.all去校验结果
                Promise.all(allList.map(this.getFormPromise)).then(res => {
                  const validateResult = res.every(item => !!item)
                  if (validateResult) {
                    // 新增或编辑
                    this.fetchAddOrEdit(data)
                  } else {
                    this.$message.error('请输入必填项')
                  }
                }).catch(() => {
                  this.$message.error('请至少设置一个行为标签规则')
                })
              } else { // 没有行为标签的
                // 新增或编辑
                this.fetchAddOrEdit(data)
              }
            })
          } else {
            if (allList.length > 0) { // 有行为标签的
              // 使用Promise.all去校验结果
              Promise.all(allList.map(this.getFormPromise)).then(res => {
                const validateResult = res.every(item => !!item)
                if (validateResult) {
                  // 新增或编辑
                  this.fetchAddOrEdit(data)
                } else {
                  this.$message.error('请输入必填项')
                }
              }).catch(() => {
                this.$message.error('请至少设置一个行为标签规则')
              })
            } else { // 没有行为标签的
              // 新增或编辑
              this.fetchAddOrEdit(data)
            }
          }
        } else {
          return false
        }
      })
    },

    // 请求新增或编辑接口
    fetchAddOrEdit (data) {
      const tipMessage = this.isDynamicPeople ? '操作成功' : `操作成功，${this.crowdId != null ? '修改人群条件会影响该策略下所有人群的交叉，请点击“估算”重新估算其他人群的圈定数据' : '新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据'}`

      if (this.crowdId != null) {
        data.crowdId = this.crowdId
        data.priority = this.priority
        this.$service
          .crowdUpdate(
            data,
            tipMessage
            // '操作成功，修改人群条件会影响该策略下所有人群的交叉，请点击“估算”重新估算其他人群的圈定数据'
          )
          .then(() => {
            this.$emit('goBackCrowdListPage', true)
          })
      } else {
        this.$service
          .crowdSave(
            data,
            tipMessage
            // '操作成功，新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据'
          )
          .then(() => {
            this.$emit('goBackCrowdListPage', true)
          })
      }
    },
    // 取消
    cancelAdd: function () {
      this.$emit('goBackCrowdListPage')
    },
    // 数组去重
    distinct (a, b) {
      const arr = a.concat(b)
      const result = []
      const obj = {}
      for (const i of arr) {
        if (!obj[i]) {
          result.push(i)
          obj[i] = 1
        }
      }
      return result
    },
    checkNum (num) {
      if (/(^\d+$)/.test(num)) {
        return true
      } else {
        this.$message.error('该值为必填项，且必须是大于等于0的整数')
        return false
      }
    },
    checkNumMostFour (num) {
      const numInt = parseInt(num)
      if (/(^\d+$)/.test(num) && numInt <= 9999) {
        return true
      } else {
        this.$message.error(
          '该值为必填项，且必须是大于等于0的整数且不能超过4位数'
        )
        return false
      }
    },

    handleOperatorChange (item) {
      if (item.tagType === 'string' && item.operator === 'null') {
        item.value = 'nil'
      } else {
        item.value = ''
      }
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    handleConditionChange () {
      this.behaviorRulesJson.link =
        this.behaviorRulesJson.link === 'AND' ? 'OR' : 'AND'
    }
  },
  created () {
    this.tags = [{ thirdPartyApiId: '', tagId: '8303', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010125', tagName: '芯片型号', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '8304', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010126', tagName: '存储', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }]
    this.actionTags = [{ thirdPartyApiId: '', tagId: '4946', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0008', tagName: '起播行为', dataSource: 8, initValue: '0', thirdPartyField: '', child: [{ thirdPartyApiId: 0, tagId: 4946, groupId: 8966, tagName: '起播行为', attrType: 'collect', attrId: 4041, attrStatus: 1, tagType: 'collect', mapThirdPartyApiField: '0', attrValue: 4041, tagKey: 'BAV0008', dataSource: 8, initValue: '0', attrName: '1', status: 1 }, { thirdPartyApiId: 0, tagId: 4946, groupId: 8966, tagName: '起播行为', attrType: 'collect', attrId: 5819, attrStatus: 1, tagType: 'collect', mapThirdPartyApiField: '0', attrValue: 5819, tagKey: 'BAV0008', dataSource: 8, initValue: '0', attrName: '1', status: 1 }] }, { thirdPartyApiId: '', tagId: '4939', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0001', tagName: '会员状态', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4940', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0002', tagName: '应用活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4941', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0003', tagName: '购买行为', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4942', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0004', tagName: '模块活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4943', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0005', tagName: '页面活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4944', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0006', tagName: '功能点击', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4945', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0007', tagName: '设备活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7341', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0009', tagName: '应用状态', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7342', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0010', tagName: '用户活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7377', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0011', tagName: '起播活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7380', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0012', tagName: '综合起播行为', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '8303', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010125', tagName: '芯片型号', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '8304', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010126', tagName: '存储', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '10067', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0013', tagName: '续费包签约状态', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '10068', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0014', tagName: '连续包签约-续费-解约次数', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '10069', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0015', tagName: '下单未支付', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }]
    this.specialTags = [{ thirdPartyApiId: '', tagId: '4466', tagType: 'number', thirdPartyCode: '', inputType: null, tagKey: 'exposeDays', tagName: '产品包曝光天数', dataSource: 6, initValue: '0.00', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4467', tagType: 'number', thirdPartyCode: '', inputType: null, tagKey: 'exposeTimes', tagName: '产品包曝光次数', dataSource: 6, initValue: '0', thirdPartyField: '', child: [] }]
  }

}
</script>
<style lang="stylus" scoped>
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

i {
  cursor: pointer;
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

.add {
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
  >>> .el-tag--gray {
    color: #fff;
    background-color: rgba(165,155,149, 1);
    border-color: rgba(165,155,149, 1);
    .el-tag__close {
      color #fff
      &:hover{
        background-color: #666
      }
    }
  }
}

.outer-and {
  position: relative;
  margin-left: 70px;
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
</style>
