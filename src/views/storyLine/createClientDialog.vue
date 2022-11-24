<template>
  <div>
    <!-- {{tagList}} -->
    <el-form :model="addForm" ref="addForm" label-width="100px">
      <el-form-item label="添加标签：" prop="conditionTagIds" class="add-tag-form-item" :style="{ height: collapseAddTagsFlag ? '270px' : '0px' }">
        <div class="strategy-search">
          <el-input aria-placeholder="请输入标签关键字进行搜索"
            v-model="searchValue"
            class="strategy-search--input"
            @keyup.enter.native="getTags()"
          >
          </el-input>
          <el-button type="primary" @click="getTags()">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>

        <el-checkbox-group v-model="checkedList" class="checkList" v-if="conditionTagsFiltered != '' ">
          <el-checkbox
            v-for="item in conditionTagsFiltered"
            :class="dataSourceColorClassEnum[item.dataSource]"
            :label="item.tagId"
            :key="item.tagId"
            @change="handleTagChange($event,item)"
          >
            {{item.tagName}}
          </el-checkbox>
        </el-checkbox-group>
        <div class="checkbox--red" v-else>该标签不存在，请重新输入标签名进行搜索</div>
        <el-pagination
          small
          class="pagination"
          layout="prev,pager,next"
          :total="selectTagTagsListTotal"
          :page-size="selectTagInitPageSize"
          :current-page="selectTagInitCurrentPage"
          @current-change="handleTagCurrentChange"
          @prev-click="handleTagCurrentChange"
          @next-click="handleTagCurrentChange"
        >
        </el-pagination>
      </el-form-item>
      <el-form-item label="已选标签：" class="selected-tags">
        <el-tag v-for="item in tagList"
          :key="item.tagId"
          :type="dataSourceColorEnum[item.dataSource || item.tDataSource]"
          closable
          @close="removeTag(item)"
        >
          {{item.tagName}}
        </el-tag>

        <!-- <i
          class="add-tag-icon el-icon-circle-plus-outline el-icon-circle-plus"
          @click="collapseAddTags()">
        </i> -->
        <el-button
          class="add-tag-icon"
          icon="el-icon-search"
          @click="collapseAddTags()">
          添加标签
      </el-button>

      </el-form-item>
    </el-form>
    <div class="add">

      <!-- 新增标签 -->

      <!-- {{ tagList }}

      <br/>
      {{checkedList}} -->

      <!--新增编辑界面-->
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form
            :model="form"
            :rules="formRules"
            ref="form"
            label-width="130px"
          >
          <!-- 只有出口条件选择 -->
            <el-form-item label="处理操作" v-if="type !== 'entry'" prop="stopType" class="inline-form-item">
              <el-select v-model="form.stopType" clearable @change="handleStopTypeChange">
                <el-option
                  v-for="item in options"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>

              <!-- 正确，下一步  选择同一场景下其他接待员 -->
            <el-form-item v-if="type !== 'entry' && form.stopType === 1" prop="nextId" class="inline-form-item" style="margin-left: -130px;">
              <el-select v-model="form.nextId" clearable placeholder="请选择流转接待员">
                <el-option
                  v-for="item in servicerListFilterSelect"
                  :label="item.receptionist"
                  :value="item.crowdId"
                  :key="item.crowdId">
                  {{ item.receptionist }}
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="人群名称" prop="name">
              <el-input
                size="small"
                v-model="form.name"
                placeholder="投放名称"
                :maxlength="50"
              ></el-input>
            </el-form-item> -->
            <!-- tags---{{tags}} -->
            <!-- <br/> -->
            <!-- <br/> -->
            <!-- tags---[ { "thirdPartyApiId": "", "tagId": "4439", "tagType": "string", "thirdPartyCode": "", "inputType": null, "tagKey": "T010121", "tagName": "购物APK版本", "dataSource": 2, "initValue": "0", "thirdPartyField": "", "child": [] }, { "thirdPartyApiId": "", "tagId": "8303", "tagType": "string", "thirdPartyCode": "", "inputType": null, "tagKey": "T010125", "tagName": "芯片型号", "dataSource": 2, "initValue": "0", "thirdPartyField": "", "child": [] } ] -->
            <!-- rulesJson --- {{ rulesJson }} -->

            <div style="position: relative">
              <!-- 且、或 切换 -->
              <!-- <div class="outer-and" v-if="(tags.length > 0 &&  actionTags.length > 0 && hasBehaviorTag) || (tags.length > 0 &&  specialTags.length > 0) || (actionTags.length > 0  && hasBehaviorTag &&  specialTags.length > 0)"> -->
              <div class="outer-and" v-if="(tags.length > 0) || (actionTags.length > 0  && hasBehaviorTag)">
                <el-button
                  type="danger"
                  @click="handleConditionChange()"
                  round
                  :key="'condition'"
                >{{ totalLink === 'OR' ? '或' : '且' }} </el-button>
              </div>

              <div v-if="tags.length > 0">
                <el-form-item label="设置标签" class="multipleSelect" prop="tagIds">
                  <MultipleSelect
                    :tags="tags"
                    :rulesJson="rulesJson"
                  ></MultipleSelect>
                </el-form-item>
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

              <!-- <el-form-item label="动态因子" v-if="specialTags.length > 0">
                <MultipleSelect
                  :specialTags="specialTags"
                  :dynamicPolicyJson="dynamicPolicyJson"
                ></MultipleSelect>
              </el-form-item> -->
              <el-form-item label="流转条件">
                <SetCirculationConditionsCom
                  ref="setCirculationRef"
                  :storyLineCirculationRulesJson.sync="flowCondition">
                </SetCirculationConditionsCom>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>

    </div>
  </div>
</template>
<script>
import MultipleSelect from '@/components/MultipleSelect.vue'
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/Index.vue'
import SetCirculationConditionsCom from '@/components/dynamicPeople/SetCirculationConditionsCom.vue'

export default {
  components: {
    MultipleSelect,
    MultipleActionTagSelect,
    SetCirculationConditionsCom
  },
  data () {
    return {
      options: [{
        value: 1,
        label: '正确，继续种草，下一步'
      }, {
        value: 2,
        label: '正确，直接转化'
      }, {
        value: 3,
        label: '不正确，继续观察'
      }, {
        value: 4,
        label: '不喜欢切换方案'
      }],
      // options2: [],
      totalLink: 'OR',
      tagList: [],
      addForm: {
        conditionTagIds: [],
        crowdTagCrowdIds: []
        // 以上为表单提交的参数
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorClassEnum: {
        1: 'checkbox--green',
        2: 'checkbox--red',
        3: 'checkbox--blue',
        5: 'checkbox--yellow',
        6: 'checkbox--orange',
        7: 'checkbox--orange2',
        8: 'checkbox--cyan',
        11: 'success',
        12: 'gray'
      },
      checkedList: [],
      searchValue: '',
      selectTagInitPageSize: 500,
      selectTagTagsListTotal: 0,
      selectTagInitCurrentPage: 1,
      // attrs: [[${attrs}]] || {},
      versionNum: 2,
      cache: {},
      tags: [],
      actionTags: [],
      specialTags: [],
      tagInitSize: 200,
      tagCurrentPage: 1,
      tagSelectMoreShow: false,
      // showMoreTags: false,
      // tagList: [],
      checkboxValue: '',
      currentChildItem: '',
      // 选择更多标签分页
      // initPageSize: 200,
      // initCurrentPage: 1,
      // tagsListTotal: 0,
      // tag 查询模块
      formInline: {
        attrName: ''
      },
      // usedTags: [[${usedTags}]] || {},
      rulesJson: { condition: 'OR', rules: [] },
      behaviorRulesJson: { link: 'AND', condition: 'OR', rules: [] },
      dynamicPolicyJson: { link: 'AND', condition: 'OR', rules: [] },
      flowCondition: { condition: 'OR', rules: [] },
      suggestions: {},
      suggestionsNew: [],
      priority: '',
      form: {
        stopType: '',
        nextId: ''
      },
      formRules: {
        stopType: [{ required: true, message: '请选择', trigger: 'change' }],
        nextId: [{ required: true, message: '请选择流转接待员', trigger: 'change' }]
        // // crowdExp: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        // limitLaunchCount: [{ validator: checkIntNumber, trigger: 'blur' }]
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
      timeTagKongList: [],
      conditionTagsFiltered: [],
      collapseAddTagsFlag: false
    }
  },
  watch: {
    // behaviorRulesJson: {
    //   handler () {
    //     this.hasMoveBehaviorTagRule()
    //   },
    //   deep: true
    // }
    tagList (val) {
      this.checkedList = val.map(item => item.tagId)
      this.sortTag()
    }
  },
  computed: {
    hasBehaviorTag () {
      return this.actionTags.some(item => item.dataSource === 8)
    }
  },
  props: {
    editRow: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'entry'
    },
    servicerListFilterSelect: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleStopTypeChange () {
      // 切换处理操作时，清空选择的流转接待员 ID
      this.form.nextId = ''
    },
    collapseAddTags () {
      this.collapseAddTagsFlag = !this.collapseAddTagsFlag
    },
    getTags () {
      // this.addForm.conditionTagIds = [];
      this.$service
        .policyTagSeach({ pageNum: this.selectTagInitCurrentPage, pageSize: this.selectTagInitPageSize, s: this.searchValue, isStoryline: 1 })
        .then(data => {
          //  let checkboxData = []
          // data.forEach((item) => { item.child.forEach((checkboxItem) => {checkboxData.push(checkboxItem)})})
          //  this.conditionTagIdsData = checkboxData
          //  this.conditionTagsFiltered = checkboxData
          this.conditionTagsFiltered = data.pageInfo.list.map(item => {
            return {
              ...item,
              dataSource: item.tDataSource
            }
          })

          this.selectTagTagsListTotal = data.pageInfo.total
        })
    },
    removeTag (tag) {
      const addForm = this.addForm
      if (tag.tDataSource === 12) {
        // 人群标签 id 集合
        addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.filter(tagId => tagId !== tag.tagId)
      } else {
        // 其他的标签 id 集合
        addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      }
      // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
      // this.tagList.forEach(item => {item.filter(item => item.tagId !== id)})
    },
    handleTagCurrentChange (pages) {
      this.selectTagInitCurrentPage = pages
      this.getTags()
    },
    handleTagChange (flag, item) {
      console.log('flag--------->', flag)
      let arr = []
      // flag - true: 选中  false: 取消选中
      if (flag) {
        this.tagList.push(item)
        if (item.tDataSource === 12) {
          // 人群标签 id 集合
          this.addForm.crowdTagCrowdIds.push(item.tagId)
        } else {
          // 其他的标签 id 集合
          this.addForm.conditionTagIds.push(item.tagId)
        }
      } else {
        arr = this.tagList
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].tagId == item.tagId) { arr.splice(i, 1) }
        }

        if (item.tDataSource === 12) {
          // 人群标签 id 集合
          this.addForm.crowdTagCrowdIds = this.addForm.crowdTagCrowdIds.filter(tagId => tagId !== item.tagId)
        } else {
          // 其他的标签 id 集合
          this.addForm.conditionTagIds = this.addForm.conditionTagIds.filter(tagId => tagId !== item.tagId)
        }
      }
    },
    resetSearch () {
      this.searchValue = ''
      const currentTagsId = this.addForm.conditionTagIds
      this.getTags()
      this.addForm.conditionTagIds = currentTagsId
    },
    // 判断是否有动态的时间周期的行为标签，有则展示勾选“是否每日更新”
    // hasMoveBehaviorTagRule () {
    //   const crowd = this.form
    //   const behaviorRules = this.behaviorRulesJson.rules

    //   let hasBehaviorRule = false // 是否有行为标签
    //   let hasMoveRule = false // 是否有动态周期
    //   let hasFullTag = false // 是否有下面的标签，有的话就展示；应用状态 (BAV0009)，会员状态 (BAV0001)，购买行为 (BAV0003)，用户活跃 (BAV0010)
    //   const fullTagList = ['BAV0009', 'BAV0001', 'BAV0003', 'BAV0010']

    //   if (behaviorRules.length > 0) {
    //     hasBehaviorRule = true
    //     for (let x = 0; x < behaviorRules.length; x++) {
    //       const rule = behaviorRules[x]
    //       for (let y = 0; y < rule.rules.length; y++) {
    //         const item = rule.rules[y]
    //         if (item.bav && item.bav.rangeType === 'move') {
    //           hasMoveRule = true
    //           break
    //         }
    //         if (fullTagList.includes(item.tagCode)) {
    //           hasFullTag = true
    //           break
    //         }
    //       }
    //     }
    //   }

    //   if (hasBehaviorRule && (hasMoveRule || hasFullTag)) { // 展示勾选“是否每日更新”
    //     // 当有isShowAutoVersion并且 为 false的时候，初始默认选择是。否则不限制选择
    //     if (crowd.isShowAutoVersion !== undefined && !crowd.isShowAutoVersion) {
    //       crowd.autoVersion = true
    //     }
    //     crowd.isShowAutoVersion = true
    //   } else {
    //     crowd.isShowAutoVersion = false
    //     crowd.autoVersion = false
    //   }
    // },

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
    // areaSelectChange (val, tagCode, childItem) {
    //   // this.provinceValueList[index] = val
    //   // console.log(this.provinceValueList==='', this.provinceValueList)
    //   if (childItem) childItem.value = ''
    //   if (tagCode === 'mix_area') {
    //     const params = {
    //       id: val
    //     }
    //     return this.$service.specialTagChild(params).then(data => {
    //       const cityData = data.slice().map(item => {
    //         return {
    //           attrValue: item.specialTagName,
    //           attrName: item.specialTagName,
    //           attrId: item.specialTagId,
    //           rulesJson: item.rulesJson
    //         }
    //       })
    //       this.$set(this.cityData, val, cityData)
    //       // console.log('this.cityData===', this.cityData)
    //     })
    //   }
    // },
    // changeTimeWays (childItem) {
    //   childItem.value = ''
    //   if (childItem.isDynamicTime) {
    //     childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2
    //   } else {
    //     this.$set(childItem, 'isDynamicTime', 2)
    //   }
    // },
    // handleRemoveRule (rule, childRule) {
    //   const rulesJson = this.rulesJson
    //   rule.rules.splice(rule.rules.indexOf(childRule), 1)
    //   if (rule.rules.length === 0) {
    //     rulesJson.rules = rulesJson.rules.filter(function (item) {
    //       return item !== rule
    //     })
    //   }
    // },
    // handleRemoveSpecialRule (rule, childRule) {
    //   const rulesJson = this.dynamicPolicyJson
    //   rule.rules.splice(rule.rules.indexOf(childRule), 1)
    //   if (rule.rules.length === 0) {
    //     rulesJson.rules = rulesJson.rules.filter(function (item) {
    //       return item !== rule
    //     })
    //   }
    // },

    // handleCheckboxOk () {
    //   this.currentChildItem.value = this.checkboxValue
    //   this.showMoreTags = false
    // },
    // handleSelectMore (child) {
    //   this.checkboxValue = ''
    //   this.formInline.attrName = ''
    //   this.currentChildItem = child
    //   // this.showMoreTags = true
    //   this.$service
    //     .getTagAttr({
    //       tagId: child.tagId,
    //       pageSize: this.initPageSize,
    //       pageNum: this.initCurrentPage
    //     })
    //     .then(data => {
    //       this.showMoreTags = true
    //       this.tagList = data.pageInfo.list
    //       this.tagsListTotal = data.pageInfo.total
    //     })
    // },
    // handleCurrentChange (index) {
    //   this.initCurrentPage = index
    //   this.$service
    //     .getTagAttr({
    //       tagId: this.currentChildItem.tagId,
    //       pageSize: this.initPageSize,
    //       pageNum: index
    //     })
    //     .then(data => {
    //       this.tagList = data.pageInfo.list
    //     })
    // },
    // onSubmit () {
    //   this.$service
    //     .getTagAttr({
    //       tagId: this.currentChildItem.tagId,
    //       pageSize: this.initPageSize,
    //       pageNum: 1,
    //       attrName: this.formInline.attrName
    //     })
    //     .then(data => {
    //       this.tagList = data.pageInfo.list
    //       this.tagsListTotal = data.pageInfo.total
    //     })
    // },
    // getDefaultOperator () {
    //   return '='
    // },

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
      this.totalLink = this.totalLink === 'AND' ? 'OR' : 'AND'
    },
    // 获取不同种类的标签
    sortTag () {
      const normalTags = []
      const actionTags = []
      const specialTags = []
      const allTags = this.tagList

      allTags.forEach(item => {
        if (item.dataSource === 6) { // 效果指标
          specialTags.push(item)
        } else if (item.dataSource === 8) { // 行为标签
          actionTags.push(item)
        } else if (item.dataSource === 2) { // 大数据标签
          actionTags.push(item)
          normalTags.push(item)
        } else {
          normalTags.push(item)
        }
      })
      // 如果当前人群已经当做人群标签被使用了，那么就不能使用人群标签，需要过滤掉
      // if (this.crowd && this.crowd.isUsedAsTag === 1) {
      //   normalTags = normalTags.filter(item => item.dataSource !== 12)
      // }
      this.tags = normalTags
      this.actionTags = actionTags
      this.specialTags = specialTags
      console.log('this.tags------------->', this.tags)
      console.log('this.actionTags------------->', this.actionTags)
      console.log('this.specialTags------------->', this.specialTags)
    },
    // 回显编辑数据
    reviewEditData () {
      // 编辑数据
      const policyData = this.editRow

      this.totalLink = policyData.link // 总运算符
      if (this.type === 'entry') { // 入口
        this.$service.getTagsByEntryId({ entryId: policyData.id }).then(data => {
          this.tagList = data || []
          this.sortTag()
        })
      } else { // 出口
        this.form.stopType = policyData.stopType
        this.form.nextId = policyData.nextId

        this.$service.getTagsByExportId({ exportId: policyData.id }).then(data => {
          this.tagList = data || []
          this.sortTag()
        })
      }

      const ruleJsonData = JSON.parse(policyData.rulesJson)
      let cacheIds = []
      const cacheActionIds = []
      const cacheSpecialIds = []
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
          if (item.tagType === 'string' && item.operator !== 'null' && typeof (item.value) === 'string') {
            item.value = item.value === '' ? [] : item.value.split(',')
          }
          if (item.version === 0) {
            if (item.tagType === 'time' && item.isDynamicTime === 3) {
              const value = item.value.split('-')
              this.$set(item, 'startDay', value[0])
              this.$set(item, 'endDay', value[1])
            } else if (item.tagType === 'time' && item.isDynamicTime !== 3) {
              this.$set(item, 'dateAreaType', '')
              this.$set(item, 'dynamicTimeType', parseInt(item.dynamicTimeType))
            }
          }
        })
        return itemParent
      })

      this.rulesJson = ruleJsonData

      this.behaviorRulesJson = JSON.parse(policyData.behaviorRulesJson)

      this.flowCondition = policyData.flowCondition ? JSON.parse(policyData.flowCondition) : { condition: 'OR', rules: [] }

      const defaultChild = [
        { name: '', value: '', filed: '', operator: '=', type: 'string', child: [] }
      ]

      this.behaviorRulesJson.rules.forEach(ruleItem => {
        ruleItem.rules.forEach(rulesEachItem => {
          // 多选的值，回显的时候需要转成数组
          if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null' && typeof (rulesEachItem.value) === 'string') {
            rulesEachItem.value = rulesEachItem.value === '' ? [] : rulesEachItem.value.split(',')
          }
          // 手动构建数据 一期数据格式兼容二期
          if (this.versionNum === 0) {
            if (rulesEachItem.tagCode === 'BAV0001' || rulesEachItem.tagCode === 'BAV0003' || rulesEachItem.tagCode === 'BAV0004' || rulesEachItem.tagCode === 'BAV0006') { // 会员状态、购买行为、模块活跃、功能使用 添加第一级）
              const ruleCopy = JSON.parse(JSON.stringify(rulesEachItem.bav)) // 原始数据
              rulesEachItem.bav.behaviorValue = JSON.parse(JSON.stringify(defaultChild))
              rulesEachItem.bav.behaviorValue[0].child = ruleCopy.behaviorValue
              rulesEachItem.bav.behaviorValue[0].childCheckedVal = ruleCopy.value
            } else if (rulesEachItem.tagCode === 'BAV0002') { // 应用活跃
              rulesEachItem.bav.behaviorValue.forEach(rule => {
                const ruleCopy = JSON.parse(JSON.stringify(rule)) // 原始数据
                rule.child = JSON.parse(JSON.stringify(defaultChild))
                rule.child[0].child = ruleCopy.child
                rule.child[0].childCheckedVal = ruleCopy.childCheckedVal
              })
            } else if (rulesEachItem.tagCode === 'BAV0005') { // 页面活跃 第一级选项 产品包收银台 -> 影视收银台
              const matchIndex = rulesEachItem.bav.value.findIndex(item => item === '产品页')
              if (matchIndex > -1) {
                rulesEachItem.bav.value.splice(matchIndex, 1, '影视收银台')
                rulesEachItem.bav.behaviorValue.forEach(rule => {
                  if (rule.value === '产品页') {
                    rule.value = '影视收银台'
                    rule.name = '影视收银台'
                  }
                })
              }
            }
          }

          if (this.versionNum < 2) { // 【起播活跃】 三期兼容前面几期的
            if (rulesEachItem.tagCode === 'BAV0011') {
              rulesEachItem.isOldversion = true // 是否是旧版本
            }
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

      // 组合标签的 id 集合
      if (cacheSpecialIds.length !== 0) {
        cacheSpecialIds.forEach(item => {
          this.fetchSpecialTagSuggestions(item.tagId, item.tagCode)
          this.areaSelectChange(item.provinceValue, item.tagCode) // 根据省id获取市列表
        })
      }
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
    }
  },
  created () {
    this.getTags() // 获取所有的标签列表

    // 编辑 回显
    if (this.editRow != null) {
      this.reviewEditData()
    }

    // this.tags = [{ thirdPartyApiId: '', tagId: '8303', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010125', tagName: '芯片型号', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '8304', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010126', tagName: '存储', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }]
    // this.actionTags = [{ thirdPartyApiId: '', tagId: '4946', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0008', tagName: '起播行为', dataSource: 8, initValue: '0', thirdPartyField: '', child: [{ thirdPartyApiId: 0, tagId: 4946, groupId: 8966, tagName: '起播行为', attrType: 'collect', attrId: 4041, attrStatus: 1, tagType: 'collect', mapThirdPartyApiField: '0', attrValue: 4041, tagKey: 'BAV0008', dataSource: 8, initValue: '0', attrName: '1', status: 1 }, { thirdPartyApiId: 0, tagId: 4946, groupId: 8966, tagName: '起播行为', attrType: 'collect', attrId: 5819, attrStatus: 1, tagType: 'collect', mapThirdPartyApiField: '0', attrValue: 5819, tagKey: 'BAV0008', dataSource: 8, initValue: '0', attrName: '1', status: 1 }] }, { thirdPartyApiId: '', tagId: '4939', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0001', tagName: '会员状态', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4940', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0002', tagName: '应用活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4941', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0003', tagName: '购买行为', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4942', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0004', tagName: '模块活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4943', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0005', tagName: '页面活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4944', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0006', tagName: '功能点击', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4945', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0007', tagName: '设备活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7341', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0009', tagName: '应用状态', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7342', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0010', tagName: '用户活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7377', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0011', tagName: '起播活跃', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '7380', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0012', tagName: '综合起播行为', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '8303', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010125', tagName: '芯片型号', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '8304', tagType: 'string', thirdPartyCode: '', inputType: null, tagKey: 'T010126', tagName: '存储', dataSource: 2, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '10067', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0013', tagName: '续费包签约状态', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '10068', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0014', tagName: '连续包签约-续费-解约次数', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '10069', tagType: 'collect', thirdPartyCode: '', inputType: null, tagKey: 'BAV0015', tagName: '下单未支付', dataSource: 8, initValue: '0', thirdPartyField: '', child: [] }]
    // this.specialTags = [{ thirdPartyApiId: '', tagId: '4466', tagType: 'number', thirdPartyCode: '', inputType: null, tagKey: 'exposeDays', tagName: '产品包曝光天数', dataSource: 6, initValue: '0.00', thirdPartyField: '', child: [] }, { thirdPartyApiId: '', tagId: '4467', tagType: 'number', thirdPartyCode: '', inputType: null, tagKey: 'exposeTimes', tagName: '产品包曝光次数', dataSource: 6, initValue: '0', thirdPartyField: '', child: [] }]
  }

}
</script>
<style lang="stylus" scoped>
.add {
  border: 1px solid #ebeef5;
  padding: 20px;
  border-radius: 4px;
  background: #ebebeb47;
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
.checkList
  height: 200px
  overflow: auto
  margin-top: 10px
.strategy-search
  display flex
  justify-self center
.strategy-search--input
  width 50%
  margin-right 20px
.add-tag-icon
  // font-size 28px
  vertical-align: middle
  margin-left: 20px;
.add-tag-icon:hover
  color: #409EFF
.add-tag-form-item
  overflow hidden
  transition all 0.5s
.el-icon-arrow-up
  font-size: 26px;
  float right
.selected-tags {
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
.inline-form-item {
  display: inline-block;
  margin-right: 10px
  vertical-align: top;
}
</style>
