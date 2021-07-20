<template>
  <div class="add">
    <el-row>
      <el-col :span="24">
        <div class="title" v-if="crowdId == null">新增人群</div>
        <div class="title" v-if="crowdId != null">编辑人群</div>
      </el-col>
    </el-row>
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form
          :model="form"
          :rules="formRules"
          ref="form"
          label-width="130px"
        >
          <el-form-item label="人群名称" prop="name">
            <el-input
              size="small"
              v-model="form.name"
              placeholder="投放名称"
            ></el-input>
          </el-form-item>
          <div style="position: relative">
            <div v-if="tags.length > 0">
              <el-form-item label="设置标签" class="multipleSelect" prop="tagIds">
                <MultipleSelect
                  :tags="tags"
                  :rulesJson="rulesJson"
                ></MultipleSelect>
              </el-form-item>
            </div>
            <!-- <div class="outer-and" v-if="specialTags.length > 0">
              <el-button
                type="danger"
                v-if="
                  specialTags.length > 0 && tags.length > 0 && dynamicPolicyJson
                "
                @click="handleConditionChange()"
                round
                :key="'condition'"
                >{{ dynamicPolicyJson.link === 'OR' ? '或' : '且' }}
              </el-button>
            </div> -->
            <div class="outer-and" v-if="(tags.length > 0 &&  actionTags.length > 0 && hasBehaviorTag) || (tags.length > 0 &&  specialTags.length > 0) || (actionTags.length > 0  && hasBehaviorTag &&  specialTags.length > 0)">
              <el-button
                type="danger"
                @click="handleConditionChange(crowd)"
                round
                :key="'condition'"
              >{{ (dynamicPolicyJson.link) === 'OR' ? '或' : '且' }}</el-button>
            </div>

            <el-form-item label="行为标签" v-if="actionTags.length > 0 && hasBehaviorTag">
              <!-- {{behaviorRulesJson}} -->
              <MultipleActionTagSelect 
                ref="multipleActionTagSelect"
                :actionTags="actionTags" 
                :behaviorRulesJson="behaviorRulesJson" 
              ></MultipleActionTagSelect>
            </el-form-item>

            <el-form-item label="动态因子" v-if="specialTags.length > 0">
              <MultipleSelect
                :specialTags="specialTags"
                :dynamicPolicyJson="dynamicPolicyJson"
              ></MultipleSelect>
            </el-form-item>
          </div>

          <el-form-item v-if="form.isShowAutoVersion" label="是否每日更新" prop="autoVersion" > 
            <el-radio-group v-model="form.autoVersion">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否限制投放数量" prop="limitLaunch">
            <el-radio-group
              v-model="form.limitLaunch"
              :disabled="limitLaunchDisabled"
            >
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="投放数量"
            prop="limitLaunchCount"
            v-if="form.limitLaunch"
          >
            <el-input-number
              size="medium"
              placeholder="不能大于100万"
              :max="1000000"
              :min="1"
              v-model="form.limitLaunchCount"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input size="small" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="priority" v-if="crowdId != null">
            <el-input size="small" v-model="priority"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="footer">
      <el-button @click="cancelAdd">返回</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
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
  data() {
    var checkIntNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('限制投放数量不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入大于0小于100万的整数'))
      } else {
        callback()
      }
    }
    return {
      //attrs: [[${attrs}]] || {},
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
        disabledDate(time) {
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
        8: 'warningCyan'
      },
      cityData: [],
      provinceValueList: [],
      timeTagKongList: []
    }
  },
  watch: {
    behaviorRulesJson: {
      handler() {
        this.hasMoveBehaviorTagRule()
      },
      deep: true
    }
  },
  computed: {
    hasBehaviorTag() {
      return this.actionTags.some(item => item.dataSource === 8)
    }
  },
  props: ['policyId', 'crowdId', 'limitLaunchDisabled'],
  methods: {

    // 判断是否有动态的时间周期的行为标签，有则展示勾选“是否每日更新”
    hasMoveBehaviorTagRule() {
      console.log('this.inputValue11111111===>' ,this.form)

      // eslint-disable-next-line no-debugger
      // debugger
        let crowd = this.form
        const behaviorRules = this.behaviorRulesJson.rules
        let hasBehaviorRule = false
        let hasMoveRule = false
        if (behaviorRules.length > 0) {

          hasBehaviorRule = true
          // eslint-disable-next-line no-debugger
          // debugger
          for (let x = 0; x < behaviorRules.length; x++) {
            let rule = behaviorRules[x]
            for (let y = 0; y < rule.rules.length; y++) {
              let item = rule.rules[y]
              if (item.bav && item.bav.rangeType === 'move') {
                hasMoveRule = true
                break;
              }
            }
          }
        }

        if (hasBehaviorRule && hasMoveRule) { // 展示勾选“是否每日更新”
          // 当有isShowAutoVersion并且 为 false的时候，初始默认选择是。否则不限制选择
          if (crowd.isShowAutoVersion !== undefined && !crowd.isShowAutoVersion) { 
            crowd.autoVersion = true 
          } 
          crowd.isShowAutoVersion = true
          // crowd.autoVersion = true
        } else {
          crowd.isShowAutoVersion = false
          crowd.autoVersion = false
        }


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
    changeTimeWays(childItem) {
      childItem.value = ''
      if (childItem.isDynamicTime) {
        childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2
      } else {
        this.$set(childItem, 'isDynamicTime', 2)
      }
    },
    handleRemoveRule(rule, childRule) {
      const rulesJson = this.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
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
    handleAddRule(tag) {
      if (this.rulesJson.rules.length > 50) {
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
      this.rulesJson.rules.push({
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
            initValue: tag.initValue,
            specialCondition:
              tag.tagType === 'mix'
                ? tag.rulesJson
                  ? tag.rulesJson
                  : ''
                : undefined
          }
        ]
      })
    },
    handleAddChildRule(rule, tag) {
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
    handleAddSpecialRule(tag) {
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
    handleAddSpecialChildRule(rule, tag) {
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
    // 获取特色标签列表
    fetchSpecialTagSuggestions(tagId, tagKey) {
      const filter = {
        tagId,
        pageSize: 100
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
        // debugger
        this.$set(this.cache, tagId, {
          select: false,
          list
        })
        // console.log('123cache===', this.cache)
      })
    },

    // 获取行为标签下拉选项
    fetchActionTagSuggestions(tagCode) {
      if (this.bavAttrList[tagCode]) return
      this.$service.getBavTagList({ id: this.tagCodeValue[tagCode] }).then(res => {
        // eslint-disable-next-line no-debugger
        // this.$nextTick(() => {
          this.bavAttrList[tagCode] = res || {}
          this.$set(this.bavAttrList, tagCode, res)
          this.bavAttrList = Object.assign({}, this.bavAttrList, this.bavAttrList)
          console.log('this.bavAttrList==>', this.bavAttrList)
        // })
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
    getDefaultOperator() {
      return '='
    },

    // 给 behaviorRulesJson 中的table 添加序号
    putBehaviorRulesJsonTableIndex (val) {
      if (val) {
        let tableIndex = 0
        let ruleList = val.rules
        ruleList.forEach(rule => {
          let ruleGroup = rule.rules
          ruleGroup.forEach(item => {
            tableIndex = tableIndex+1
            item.table = item.table.split('$')[0] + '$' + tableIndex
            if (item.bav) item.bav.table = item.bav.table.split('$')[0] + '$' + tableIndex
          })
        })
      } else {
        val = {link: 'AND', condition: 'OR', rules:[]}
        // val = ''
      }
      return val
    },

    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res);
        })
      })
    },

    validateForm(rules, dynamicPolicyRules, behaviorRules = []) {
      this.timeTagKongList = []
      // 判断设置标签里是否有未填写的项
      let i,
          j = 0
      const ruleLength = rules.length
      const dynamicPolicyRulesLength = dynamicPolicyRules.length
      let rulesFlag = true

      // ------------------- 普通标签规则校验 --------------------------
      for (i = 0; i < ruleLength; i++) {
        for (j = 0; j < rules[i].rules.length; j++) {
          let rulesItem = rules[i].rules[j]

          // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
          const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
          if (isTimeTagKong) {
            if (!this.timeTagKongList.includes(rulesItem.tagName)) {
              this.timeTagKongList.push(rulesItem.tagName)
            }
          }

          else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0 )) {
            this.$message.error(
              '请正确填写第' +
                (i + 1) +
                '设置标签块里面的第' +
                (j + 1) +
                '行的值！'
            )
            rulesFlag = false
            break
          } else if (
            rulesItem.tagType === 'time' &&
            rulesItem.isDynamicTime === 3
          ) {
            if (
              this.checkNumMostFour(rulesItem.startDay) &&
              this.checkNumMostFour(rulesItem.endDay)
            ) {
              if (
                parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)
              ) {
                rulesItem.value =
                  rulesItem.startDay + '-' + rulesItem.endDay
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
          } else if (
            rulesItem.tagType === 'string' &&
            rulesItem.operator === 'null'
          ) {
            rulesItem.operator = '='
          }
          // 多选的值，保存的时候需要转成字符串 2222
          // if (rulesItem.tagType === 'string') {
          if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
            rulesItem.value = rulesItem.value.join(',')
          }
          if (!rulesFlag) break
        }
        if (!rulesFlag) break
      }
      
      // ------------------- 行为标签中的大数据标签规则校验 --------------------------
      // const behaviorRulesJsonData = JSON.parse(JSON.stringify(rulesJson[index].behaviorRulesJson))
      // const behaviorRules = JSON.parse(JSON.stringify(behaviorRulesJsonData.rules))
      const behaviorRulesLength = behaviorRules.length
      let x,
        y = 0
      // 判断是否有未填写的项

      for (x = 0; x < behaviorRulesLength; x++) {
        for (y = 0; y < behaviorRules[x].rules.length; y++) {
          let rulesItem = behaviorRules[x].rules[y]
          
          // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
          const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
          if (isTimeTagKong) {
            if (!this.timeTagKongList.includes(rulesItem.tagName)) {
              this.timeTagKongList.push(rulesItem.tagName)
            }
          }
          
          else if ( rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0 )) {
            this.$message.error(
              '请正确填写第' +
                (x + 1) +
                '行为标签块里面的第' +
                (y + 1) +
                '行的值！'
            )
            rulesFlag = false
            break
          } 
          else if (
            rulesItem.tagType === 'time' &&
            rulesItem.isDynamicTime === 3
          ) {
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
        // if (!rulesFlag) break

      // ------------------- 动态因子规则校验 --------------------------
      for (i = 0; i < dynamicPolicyRulesLength; i++) {
        for (j = 0; j < dynamicPolicyRules[i].rules.length; j++) {
          let rulesItem = dynamicPolicyRules[i].rules[j]
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

    handleSave() {
      this.$refs['form'].validate(valid => {
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

          
          // 如果设置标签和动态因子都没有选rules则报错
          // if (ruleLength === 0 && dynamicPolicyRulesLength === 0) {
          //   this.$message.error(
          //     '请至少填写一个标签块内容或者一个动态因子完整的内容！'
          //   )
          //   return
          // }
          if (this.limitLaunchDisabled && this.currentLaunchLimitCount) {
            if (this.currentLaunchLimitCount > form.limitLaunchCount) {
              this.$message.error('投放数量不能小于上一次设置的限制数量')
              return
            }
          }

          if (!this.validateForm(rules, dynamicPolicyRules, behaviorRules)) {
            return
          }
          // 判断设置标签里是否有未填写的项 --------------------------------------------
          // let i,
          //   j = 0
          // const ruleLength = rules.length
          // const dynamicPolicyRulesLength = dynamicPolicyRules.length
          // let rulesFlag = true
          // for (i = 0; i < ruleLength; i++) {
          //   for (j = 0; j < rules[i].rules.length; j++) {
          //     let rulesItem = rules[i].rules[j]
          //     if (rulesItem.value === '') {
          //       this.$message.error(
          //         '请正确填写第' +
          //           (i + 1) +
          //           '设置标签块里面的第' +
          //           (j + 1) +
          //           '行的值！'
          //       )
          //       rulesFlag = false
          //       break
          //     } else if (
          //       rulesItem.tagType === 'time' &&
          //       rulesItem.isDynamicTime === 3
          //     ) {
          //       if (
          //         this.checkNumMostFour(rulesItem.startDay) &&
          //         this.checkNumMostFour(rulesItem.endDay)
          //       ) {
          //         if (
          //           parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)
          //         ) {
          //           rulesItem.value =
          //             rulesItem.startDay + '-' + rulesItem.endDay
          //         } else {
          //           this.$message.error(
          //             '第' +
          //               (i + 1) +
          //               '设置标签块里面的第' +
          //               (j + 1) +
          //               '行的天数值后面的值必须大于前面的'
          //           )
          //           rulesFlag = false
          //           break
          //         }
          //       } else {
          //         this.$message.error(
          //           '第' +
          //             (i + 1) +
          //             '设置标签块里面的第' +
          //             (j + 1) +
          //             '行的值是大于等于0的整数且不能超过4位数'
          //         )
          //         rulesFlag = false
          //         break
          //       }
          //     } else if (
          //       rulesItem.tagType === 'string' &&
          //       rulesItem.operator === 'null'
          //     ) {
          //       rulesItem.operator = '='
          //     }
          //     if (!rulesFlag) break
          //   }
          //   if (!rulesFlag) break
          // }
          // if (!rulesFlag) return
          
          // //判断动态因子里面是否有未填的
          // let dynamicPolicyFlag = true
          // for (i = 0; i < dynamicPolicyRulesLength; i++) {
          //   for (j = 0; j < dynamicPolicyRules[i].rules.length; j++) {
          //     let rulesItem = dynamicPolicyRules[i].rules[j]
          //     if (rulesItem.value === '' || rulesItem.dynamic.version === '') {
          //       this.$message.error(
          //         '请正确填写第' +
          //           (i + 1) +
          //           '动态因子里面的第' +
          //           (j + 1) +
          //           '行的值！'
          //       )
          //       dynamicPolicyFlag = false
          //       break
          //     }
          //     if (!dynamicPolicyFlag) break
          //   }
          //   if (!dynamicPolicyFlag) break
          // }
          // if (!dynamicPolicyFlag) return

          // --------------------------------------------
          // 如果外层条件是且，则设置标签和动态因子都是必填，如果是或则选填
          // if (dynamicPolicyJson.condition === 'AND') {
          //     if (ruleLength === 0 || dynamicPolicyRulesLength === 0) {
          //         this.$message.error('因为动态因子上面的条件为且，所以请填写至少一个标签块内容和一个动态因子完整的内容！')
          //         return
          //     }
          //     if (!validateJsonRules(true) || !validateDynamicPolicyRules(true)) {
          //         return
          //     }
          // } else {
          // //    或的时候校验一个是否已填
          //     if (!validateJsonRules(false) && !validateDynamicPolicyRules(false)) {
          //         this.$message.error('请至少填写一个标签块内容或者一个动态因子完整的内容！')
          //         return
          //     } else {
          //         if (!validateJsonRules(false)) {
          //             const dynamicFlag = validateDynamicPolicyRules(true)
          //             if (!dynamicFlag) {return}
          //         }
          //         if (!validateDynamicPolicyRules(false)) {
          //             const rulesFlag = validateJsonRules(true)
          //             if (!rulesFlag) {return}
          //         }
          //     }
          // }
          // 添加tagIds
          rules.forEach(function(item) {
            item.rules.forEach(function(childItem) {
              if (tagIds.indexOf(childItem.tagId) === -1) {
                tagIds.push(childItem.tagId)
              }
              delete childItem.startDay
              delete childItem.endDay
            })
          })
          dynamicPolicyRules.forEach(function(item) {
            item.rules.forEach(function(childItem) {
              if (tagIds.indexOf(childItem.tagId) === -1) {
                tagIds.push(childItem.tagId)
              }
            })
          })
          behaviorRules.forEach(function(item) {
            item.rules.forEach(function(childItem) {
              if (tagIds.indexOf(childItem.tagId) === -1) {
                tagIds.push(childItem.tagId)
              }
              // 多选的值，保存的时候需要转成字符串 2222
              // if (childItem.tagType === 'string') {
              if (childItem.tagType === 'string' && childItem.operator !== 'null') {
                childItem.value = Array.isArray(childItem.value) ? childItem.value.join(',') : childItem.value
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
              : undefined
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

          // vue的特性,自动把v-for里面的ref展开成数组的形式，哪怕你的ref名字是唯一的
          typeRefList.forEach(item => {
            
            if ( item.$refs.typeRef && Array.isArray(item.$refs.typeRef) ) {
              item.$refs.typeRef.forEach(obj => {
                typeFormList.push(obj.$refs.typeForm)
              })
            } else if ( item.$refs.typeRef && typeof (item.$refs.typeRef) === 'object' ) {  // 【设备活跃】tab只有一个 type 组件，因此 typeRef 不为数组
              typeFormList.push(item.$refs.typeRef.$refs.typeForm)
            }
            
          })

          let allList = rangeFormList.concat(typeFormList)

          // 选择了属性为空的 time 类型的标签, 需要提示
          if (this.timeTagKongList.length > 0) {
            const tip = this.timeTagKongList.join(',')
            const h = this.$createElement;
            this.$msgbox({
              title: '配置提醒',
              message: h('p', null, [
                h('span', null, `${tip}`),
                h('span', null, `标签的属性为空，请确认是否继续?`),
                h('div', {style: 'color: red'}, 'PS：标签为空代表要圈出该属性为空的人群')
              ]),
              showCancelButton: true,
              confirmButtonText: '继续',
              cancelButtonText: '取消',
            }).then(() => {
              if (allList.length > 0) {  // 有行为标签的
                // 使用Promise.all去校验结果
                Promise.all(allList.map(this.getFormPromise)).then(res => {
                  const validateResult = res.every(item => !!item);
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
            if (allList.length > 0) {  // 有行为标签的
              // 使用Promise.all去校验结果
              Promise.all(allList.map(this.getFormPromise)).then(res => {
                const validateResult = res.every(item => !!item);
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
    fetchAddOrEdit(data) {
      if (this.crowdId != null) {
        data.crowdId = this.crowdId
        data.priority = this.priority
        this.$service
          .crowdUpdate(
            data,
            '操作成功，修改人群条件会影响该策略下所有人群的交叉，请点击“估算”重新估算其他人群的圈定数据'
          )
          .then(() => {
            this.$emit('goBackCrowdListPage', true)
          })
      } else {
        this.$service
          .crowdSave(
            data,
            '操作成功，新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据'
          )
          .then(() => {
            this.$emit('goBackCrowdListPage', true)
          })
      }
    },
    // 取消
    cancelAdd: function() {
      this.$emit('goBackCrowdListPage')
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
        this.$message.error('该值为必填项，且必须是大于等于0的整数')
        return false
      }
    },
    checkNumMostFour(num) {
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
    // bigNum(item) {
    //   const startDay = item.startDay
    //   const endDay = item.endDay
    //   if (this.checkNumMostFour(endDay)) {
    //     if (parseInt(startDay) >= parseInt(endDay)) {
    //       this.$message.error('第二个值必须大于第一个值')
    //     } else {
    //       item.value = startDay + '-' + endDay
    //     }
    //   } else {
    //     item.value = ''
    //   }
    // },
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
    handleConditionChange() {
      this.dynamicPolicyJson.link =
        this.dynamicPolicyJson.link === 'AND' ? 'OR' : 'AND'
    }
  },
  created() {
    this.form.policyId = this.policyId
    this.$service
      .getTagsByPoliceId({ policyId: this.form.policyId })
      .then(data => {
        const normalTags = []
        const actionTags = []
        const specialTags = []
        data.forEach(item => {
          if (item.dataSource === 6) { // 效果指标
            specialTags.push(item)
          } else if ( item.dataSource === 8 ) { // 行为标签
            actionTags.push(item)
          } else if ( item.dataSource === 2 ) { // 大数据标签
            actionTags.push(item)
            normalTags.push(item)
          } else {
            normalTags.push(item)
          }
        })
        this.tags = normalTags
        this.actionTags = actionTags
        this.specialTags = specialTags
      })
    if (this.crowdId != null)
      //编辑
      this.$service.crowdEdit({ crowdId: this.crowdId }).then(data => {
        let policyData = data.policyCrowds
        this.form.name = policyData.crowdName
        this.form.remark = policyData.remark
        this.priority = policyData.priority

        // eslint-disable-next-line no-debugger
        debugger
        this.form.autoVersion = policyData.autoVersion
        this.form.isShowAutoVersion = true

        this.form.limitLaunch = policyData.limitLaunch
        this.form.limitLaunchCount = policyData.limitLaunch
          ? policyData.limitLaunchCount
          : undefined
        this.currentLaunchLimitCount = policyData.limitLaunch
          ? policyData.limitLaunchCount
          : undefined
        let ruleJsonData = JSON.parse(policyData.rulesJson)
        let cacheIds = []
        let cacheActionIds = []
        let cacheSpecialIds = []
        ruleJsonData.rules = ruleJsonData.rules.map(itemParent => {
          itemParent.rules.forEach(item => {
            // 行为标签
            if (item.dataSource === 8) {
              cacheActionIds.push(item.tagCode)
            } else if (item.tagType === 'string' || item.tagType === 'collect') {
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
            // 多选的值，回显的时候需要转成数组 2222
            // if (item.tagType === 'string') {
            if (item.tagType === 'string' && item.operator !== 'null') {
              item.value = item.value.split(',')
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

        this.rulesJson = ruleJsonData

        this.behaviorRulesJson = JSON.parse(policyData.behaviorRulesJson)

        this.behaviorRulesJson.rules.forEach(ruleItem => {
          ruleItem.rules.forEach(rulesEachItem => {
            // 多选的值，回显的时候需要转成数组 2222
            // if (rulesEachItem.tagType === 'string') {
            if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null') {
              rulesEachItem.value = rulesEachItem.value.split(',')
            }
          })
        })

        if (policyData.dynamicPolicyJson) {
          this.dynamicPolicyJson = JSON.parse(policyData.dynamicPolicyJson)
        }

        cacheIds = this.distinct(cacheIds, [])
        if (cacheIds.length !== 0) {
          cacheIds.forEach(this.fetchTagSuggestions)
        }

        // 行为标签的 id 集合
        if (cacheActionIds.length !== 0) {
          cacheActionIds.forEach(tagCode => {
            this.fetchActionTagSuggestions(tagCode)
          })
        }

        // 特色标签的 id 集合
        if (cacheSpecialIds.length !== 0) {
          cacheSpecialIds.forEach(item => {
            this.fetchSpecialTagSuggestions(item.tagId, item.tagCode)
            this.areaSelectChange(item.provinceValue, item.tagCode) // 根据省id获取市列表
          })
        }
      })
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


