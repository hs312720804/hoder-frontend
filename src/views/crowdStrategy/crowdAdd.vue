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
        <!-- rulesJson----------{{ rulesJson }} -->
          <el-form-item label="人群名称" prop="name">
            <el-input
              size="small"
              v-model="form.name"
              placeholder="投放名称"
              :maxlength="50"
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
                >{{ behaviorRulesJson.link === 'OR' ? '或' : '且' }}
              </el-button>
            </div> -->
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

          <el-form-item v-if="form.isShowAutoVersion" label="是否每日更新" prop="autoVersion" >
            <el-radio-group v-model="form.autoVersion">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 动态人群不展示下面的 -->
          <template v-if="!isDynamicPeople">
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
                placeholder="不能大于1,000,000"
                :max="1000000"
                :min="1"
                v-model="form.limitLaunchCount"
                style="width: 220px;"
              ></el-input-number>
              <span class="tip-text">命中的设备数量上限</span>
            </el-form-item>
            <el-form-item label="人群黑名单" prop="blackFlag">
              <el-radio-group v-model="form.blackFlag">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>

            <template v-if="form.blackFlag === 1">
              <div
                class="filed-row"
                v-for="(item, index) in form.blackList"
                :key="index"
              >
                <el-form-item
                  :prop="'blackList.' + index + '.value'"
                  :rules="[
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: checkBlackName, trigger: ['blur'] }
                  ]">
                  <el-input
                    v-model="item.value"
                    placeholder="请输入要屏蔽的MAC地址"
                    clearable
                    style="width: 250px">
                  </el-input>

                  <el-button
                    v-if="form.blackList.length > 1"
                    type="text"
                    icon="el-icon-remove-outline"
                    class="delete-btn"
                    @click="handleDeleteBlack(index)"
                  >
                  </el-button>
                </el-form-item>
              </div>

              <div class="filed-row" style="margin-left: 130px">
                <el-button @click="handleAddBlack" icon="el-icon-plus" class="add-btn">添加</el-button>
              </div>
            </template>

            <el-form-item label="备注" prop="remark">
              <el-input size="small" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="优先级" prop="priority" v-if="crowdId != null">
              <el-input size="small" v-model="priority"></el-input>
            </el-form-item>
          </template>
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
import { handleSave as saveFunc } from './crowdAddSaveFunc.js'
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
        limitLaunchCount: undefined,
        blackFlag: 0,
        blacks: '',
        blackList: [{ // 前端数据，不需要传给后端
          value: ''
        }]
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
      aaa: []
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
  props: ['policyId', 'crowdId', 'limitLaunchDisabled', 'isDynamicPeople', 'crowd'],
  methods: {
    checkBlackName (rule, value, callback) {
      console.warn('checkBlackName')
      const reg = /^[a-fA-F0-9]{12}$/
      // const reg = /^[\w]{12}$/

      if (!reg.test(value)) {
        callback(new Error('mac 格式为大小写的 a-f 和数字的 12 位字符组合'))
      } else {
        callback()
      }
    },
    handleDeleteBlack (index) {
      this.form.blackList.splice(index, 1)
    },
    // 添加字段
    handleAddBlack () {
      if (this.form.blackList.length < 100) { // 黑名单数量上限为 100
        this.form.blackList.push({
          value: ''
        })
      }
    },

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
    /* 添加一级标签 */
    /**
     * tag 为标签
     */
    // handleAddRule (tag) {
    //   if (this.rulesJson.rules.length > 50) {
    //     this.$message.warning('已达最大数量')
    //     return
    //   }
    //   if (tag.tagType === 'string' || tag.tagType === 'collect') {
    //     if (this.cache[tag.tagId] === undefined) {
    //       this.fetchTagSuggestions(tag.tagId)
    //     }
    //   } else if (tag.tagType === 'mix') {
    //     if (this.cache[tag.tagId] === undefined) {
    //       this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
    //     }
    //   }
    //   this.rulesJson.rules.push({
    //     condition: 'AND',
    //     rules: [
    //       {
    //         operator:
    //           tag.tagType === 'time' ? 'between' : this.getDefaultOperator('='),
    //         tagCode: tag.tagKey,
    //         tagName: tag.tagName,
    //         dataSource: tag.dataSource,
    //         value: '',
    //         tagId: tag.tagId,
    //         tagType: tag.tagType,
    //         categoryName: tag.tagName,
    //         categoryCode: tag.tagKey,
    //         dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
    //         isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
    //         thirdPartyCode: tag.thirdPartyCode,
    //         thirdPartyField: tag.thirdPartyField,
    //         dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
    //         startDay:
    //           tag.tagType === 'time'
    //             ? tag.startDay
    //               ? tag.startDay
    //               : ''
    //             : undefined,
    //         endDay:
    //           tag.tagType === 'time'
    //             ? tag.endDay
    //               ? tag.endDay
    //               : ''
    //             : undefined,
    //         initValue: tag.initValue,
    //         specialCondition:
    //           tag.tagType === 'mix'
    //             ? tag.rulesJson
    //               ? tag.rulesJson
    //               : ''
    //             : undefined
    //       }
    //     ]
    //   })
    // },
    // handleAddChildRule (rule, tag) {
    //   if (rule.rules.length > 50) {
    //     this.$message.warning('已达最大数量')
    //     return
    //   }
    //   if (tag.tagType === 'string' || tag.tagType === 'collect') {
    //     if (this.cache[tag.tagId] === undefined) {
    //       this.fetchTagSuggestions(tag.tagId)
    //     }
    //   } else if (tag.tagType === 'mix') {
    //     if (this.cache[tag.tagId] === undefined) {
    //       this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
    //     }
    //   }
    //   rule.rules.push({
    //     operator:
    //       tag.tagType === 'time' ? 'between' : this.getDefaultOperator('='),
    //     tagCode: tag.tagKey,
    //     tagName: tag.tagName,
    //     dataSource: tag.dataSource,
    //     value: '',
    //     tagId: tag.tagId,
    //     tagType: tag.tagType,
    //     categoryName: tag.tagName,
    //     categoryCode: tag.tagKey,
    //     dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
    //     isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
    //     thirdPartyCode: tag.thirdPartyCode,
    //     thirdPartyField: tag.thirdPartyField,
    //     dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
    //     startDay:
    //       tag.tagType === 'time'
    //         ? tag.startDay
    //           ? tag.startDay
    //           : ''
    //         : undefined,
    //     endDay:
    //       tag.tagType === 'time' ? (tag.endDay ? tag.endDay : '') : undefined,
    //     initValue: tag.initValue,
    //     specialCondition: ''
    //   })
    // },
    // handleAddSpecialRule (tag) {
    //   if (this.dynamicPolicyJson.rules.length > 50) {
    //     this.$message.warning('已达最大数量')
    //     return
    //   }
    //   // if(tag.tagType==='string' || tag.tagType === 'collect'){
    //   //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
    //   // }
    //   this.dynamicPolicyJson.rules.push({
    //     condition: 'AND',
    //     rules: [
    //       {
    //         operator: '=',
    //         tagCode: tag.tagKey,
    //         tagName: tag.tagName,
    //         dataSource: tag.dataSource,
    //         value: '',
    //         tagId: tag.tagId,
    //         tagType: tag.tagType,
    //         categoryName: tag.tagName,
    //         categoryCode: tag.tagKey,
    //         dynamic: {
    //           type: 1,
    //           version: ''
    //         },
    //         initValue: tag.initValue
    //       }
    //     ]
    //   })
    // },
    // handleAddSpecialChildRule (rule, tag) {
    //   if (rule.rules.length > 50) {
    //     this.$message.warning('已达最大数量')
    //     return
    //   }
    //   // if(tag.tagType==='string' || tag.tagType === 'collect'){
    //   //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
    //   // }
    //   rule.rules.push({
    //     operator: '=',
    //     tagCode: tag.tagKey,
    //     tagName: tag.tagName,
    //     dataSource: tag.dataSource,
    //     value: '',
    //     tagId: tag.tagId,
    //     tagType: tag.tagType,
    //     categoryName: tag.tagName,
    //     categoryCode: tag.tagKey,
    //     dynamic: {
    //       type: 1,
    //       version: ''
    //     },
    //     initValue: tag.initValue
    //   })
    // },
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

    handleSave () {
      saveFunc(this, this.form, this.rulesJson, this.behaviorRulesJson, this.dynamicPolicyJson, this.limitLaunchDisabled, this.currentLaunchLimitCount, this.fetchAddOrEdit)
    },

    handleTabChangeSave () {
      saveFunc(this, this.form, this.rulesJson, this.behaviorRulesJson, this.dynamicPolicyJson, this.limitLaunchDisabled, this.currentLaunchLimitCount, this.tabFetchAddOrEdit)
    },

    // 切换tab的时候手动触发保存，ref 调用
    tabFetchAddOrEdit (data) {
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
            // this.$emit('goBackCrowdListPage', true)
          })
      } else {
        this.$service
          .crowdSave(
            data,
            tipMessage
            // '操作成功，新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据'
          )
          .then(() => {
            // this.$emit('goBackCrowdListPage', true)
          })
      }
    },
    // 请求新增或编辑接口
    fetchAddOrEdit (data) {
      console.log('this------>', this)

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
    cancelAdd () {
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
    // checkNum (num) {
    //   if (/(^\d+$)/.test(num)) {
    //     return true
    //   } else {
    //     this.$message.error('该值为必填项，且必须是大于等于0的整数')
    //     return false
    //   }
    // },

    // handleOperatorChange (item) {
    //   if (item.tagType === 'string' && item.operator === 'null') {
    //     item.value = 'nil'
    //   } else {
    //     item.value = ''
    //   }
    // },
    // handleRulesConditionChange (item) {
    //   item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    // },
    handleConditionChange () {
      this.behaviorRulesJson.link =
        this.behaviorRulesJson.link === 'AND' ? 'OR' : 'AND'
    }
  },
  created () {
    this.form.policyId = this.policyId
    this.$service
      .getTagsByPoliceId({ policyId: this.form.policyId })
      .then(data => {
        let normalTags = []
        const actionTags = []
        const specialTags = []
        data.forEach(item => {
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
        if (this.crowd && this.crowd.isUsedAsTag === 1) {
          normalTags = normalTags.filter(item => item.dataSource !== 12)
        }
        this.tags = normalTags
        this.actionTags = actionTags
        this.specialTags = specialTags
      })
      // 编辑
    if (this.crowdId != null) {
      this.$service.crowdEdit({ crowdId: this.crowdId }).then(data => {
        const policyData = data.policyCrowds
        this.form.name = policyData.crowdName
        this.form.remark = policyData.remark
        this.priority = policyData.priority
        this.versionNum = policyData.versionNum || 0

        this.form.autoVersion = policyData.autoVersion
        this.form.isShowAutoVersion = true

        this.form.limitLaunch = policyData.limitLaunch
        this.form.limitLaunchCount = policyData.limitLaunch
          ? policyData.limitLaunchCount
          : undefined

        // 黑名单 回显数据
        this.form.blackFlag = policyData.blackFlag
        this.form.blacks = policyData.blacks
        if (policyData.blackFlag === 1) {
          this.form.blackList = policyData.blacks.split(',').map(item => {
            return {
              value: item
            }
          })
        }

        this.currentLaunchLimitCount = policyData.limitLaunch
          ? policyData.limitLaunchCount
          : undefined
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

        const defaultChild = [
          { name: '', value: '', filed: '', operator: '=', type: 'string', child: [] }
        ]

        this.behaviorRulesJson.rules.forEach(ruleItem => {
          ruleItem.rules.forEach(rulesEachItem => {
          // 多选的值，回显的时候需要转成数组 2222
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
      })
    }
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
.filed-row {
  margin-bottom 15px
  position relative
}
</style>
