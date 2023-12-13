<template>
  <div>
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
              style="width: 380px"
              v-model="form.name"
              placeholder="人群名称"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="人群有效区间：" prop="period">
            <el-date-picker
              style="width: 380px"
              v-model="form.period"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable>
            </el-date-picker>
          </el-form-item>

          <el-form-item label="添加标签" >
            <el-button @click="addTagDialogVisible = true">添加标签</el-button>
          </el-form-item>

          <!-- 设置条件 -->
          <div class="add" style="position: relative">
            <!-- 且、或 切换 -->
            <div class="outer-and" v-if="tags.length > 0 && actionTags.length > 0  && hasBehaviorTag">
              <el-button
                type="danger"
                @click="handleConditionChange()"
                round
                :key="'condition'"
              >{{ totalLink === 'OR' ? '或' : '且' }} </el-button>
            </div>
            <div v-if="tags.length > 0">
              <el-form-item label="设置标签：" class="multipleSelect">
                <!-- {{ tags }} -->
                <MultipleSelect
                  ref="MultipleSelectRef"
                  :tags="tags"
                  :checkedList="checkedList"
                  :allTagList="tagList"
                  :rulesJson="rulesJson"
                  :stopType="form.stopType"
                  @emitTags="emitTags"
                ></MultipleSelect>
              </el-form-item>
            </div>

            <el-form-item label="行为标签：" v-if="actionTags.length > 0 && hasBehaviorTag">
              <!-- {{behaviorRulesJson}} -->
              <MultipleActionTagSelect
                ref="multipleActionTagSelect"
                :actionTags="actionTags"
                :behaviorRulesJson="behaviorRulesJson"
              ></MultipleActionTagSelect>
            </el-form-item>
          </div>

        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="添加标签"
      :visible.sync="addTagDialogVisible"
      width="1200px"
      v-if="addTagDialogVisible"
      append-to-body
    >
      <CreatePolicyWithLabelSquare
        pageType="refinePeopleTag"
        class="refine-people-add-tag"
        :initTagList="tagList"
        @policyNextStep="handlePolicyNextStep"
        @resetFormData="resetFormData"
        @handleDirectStrategyList="handleDirectStrategyList">
      </CreatePolicyWithLabelSquare>
    </el-dialog>

  </div>
</template>
<script>
import MultipleSelect from '@/components/MultipleSelect.vue'
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/Index.vue'
import { dataSourceColorEnum, dataSourceColorClassEnum } from '@/utils/tags.js'
import CreatePolicyWithLabelSquare from '@/views/LabelSquare/CreatePolicyWithLabelSquare'
export default {
  components: {
    MultipleSelect,
    MultipleActionTagSelect,
    CreatePolicyWithLabelSquare
  },
  provide () {
    return {
      _this: this
    }
  },
  data () {
    return {
      addTagDialogVisible: false,
      checkedList: [],
      totalLink: 'OR',
      tagList: [],
      addForm: {
        conditionTagIds: [],
        crowdTagCrowdIds: []
        // 以上为表单提交的参数
      },

      searchValue: '',
      selectTagInitPageSize: 500,
      selectTagTagsListTotal: 0,
      selectTagInitCurrentPage: 1,
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
        nextId: '',
        autoVersion: false,
        isShowAutoVersion: false,
        period: []
      },
      formRules: {
        // stopType: [{ required: true, message: '请选择', trigger: 'change' }],
        // nextId: [{ required: true, message: '请选择流转接待员', trigger: 'change' }]
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
      conditionTagsFiltered: [],
      collapseAddTagsFlag: false,
      circulationTagDataList: [],
      soureceSignList: []
    }
  },
  watch: {
    behaviorRulesJson: {
      handler () {
        // this.hasMoveBehaviorTagRule()
      },
      deep: true
    },
    tagList: {
      handler (val) {
        console.log('watch:tagList')
        this.checkedList = val.map(item => item.tagId)
        this.sortTag()
      }
    },
    circulationTagDataListProp: {
      handler (val) {
        console.log('val===>', val)
        this.circulationTagDataList = val
      },
      immediate: true
    },
    soureceSignListProp: {
      handler (val) {
        this.soureceSignList = val
      },
      immediate: true
    },
    conditionTagsFilteredProp: {
      handler (val) {
        this.conditionTagsFiltered = val
      },
      immediate: true
    }

  },
  computed: {
    hasBehaviorTag () {
      return this.actionTags.some(item => item.dataSource === 8)
    },
    dataSourceColorEnum () {
      return dataSourceColorEnum
    },
    dataSourceColorClassEnum () {
      return dataSourceColorClassEnum
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
    },
    options: {
      type: Array,
      default: () => []
    },
    defaultData: {
      type: Object,
      default: () => {}
    },
    circulationTagDataListProp: {
      type: Array,
      default: () => []
    },
    soureceSignListProp: {
      type: Array,
      default: () => []
    },
    conditionTagsFilteredProp: {
      type: Array,
      default: () => []
    },
    selectTagTagsListTotalProp: {
      type: Number,
      default: 0
    }

  },
  methods: {
    // 添加标签 --- start
    handlePolicyNextStep (tagList) {
      this.initTagList = tagList
      console.log('tagList-->', tagList)
      // this.initTagList = [4398]
      this.addTagDialogVisible = false
    },
    // 返回
    resetFormData () {
      this.addTagDialogVisible = false
    },
    handleDirectStrategyList () {},
    // 添加标签 --- end

    // remoteMethod (query) {
    //   // 是否是加载更多
    //   const isLoadMore = query === undefined

    //   // 重置
    //   if (!isLoadMore) {
    //     this.remoteMethodParams.pageNum = 1
    //     this.filmModelTagOptions = []
    //     this.remoteMethodParams.s = query
    //   }

    //   this.loading = true

    //   const params = {
    //     ...this.remoteMethodParams
    //   }

    //   this.$service.policyTagSeach(params).then(data => {
    //     this.totalPages = data.pageInfo.pages // 总页数

    //     const list = data.pageInfo.list.map(item => {
    //       return {
    //         ...item,
    //         dataSource: item.tDataSource
    //       }
    //     })
    //     this.searchOptions = !isLoadMore ? list : this.searchOptions.concat(list)

    //     this.loading = false
    //   }).catch(() => {
    //     this.searchOptions = []
    //     this.loading = false
    //   })
    // },
    emitTags (data) {
      this.tagList = data
    },
    // 判断是否展示 “是否每日更新” 单选框
    // 判断条件： 是否设置行为标签规则，只要设置了行为标签规则就显示,默认值为 ‘是’,反之隐藏；
    // hasMoveBehaviorTagRule () {
    //   const crowd = this.form
    //   const behaviorRules = this.behaviorRulesJson ? this.behaviorRulesJson.rules : []

    //   let hasBehaviorRule = false // 是否有行为标签
    //   if (behaviorRules.length > 0) {
    //     hasBehaviorRule = true
    //   }

    //   if (hasBehaviorRule) { // 展示勾选“是否每日更新”
    //     // 当有 isShowAutoVersion 并且 为  false 的时候，初始默认选择是。否则不限制选择
    //     if (crowd.isShowAutoVersion !== undefined && !crowd.isShowAutoVersion) {
    //       crowd.autoVersion = true
    //     }
    //     crowd.isShowAutoVersion = true
    //   } else {
    //     crowd.isShowAutoVersion = false
    //     crowd.autoVersion = false
    //   }
    // },
    // 获取流转标签
    async getCirculationTag () {
      await this.$service.getRuleIndicators().then(res => {
        this.circulationTagDataList = res
      })
      this.$service.getSourceSign().then(res => {
        this.soureceSignList = res
      })
    },

    // getTags () {
    //   // this.addForm.conditionTagIds = [];
    //   this.$service
    //     .policyTagSeach({ pageNum: this.selectTagInitCurrentPage, pageSize: this.selectTagInitPageSize, s: this.searchValue, isStoryline: 1 })
    //     .then(data => {
    //       this.conditionTagsFiltered = data.pageInfo.list.map(item => {
    //         return {
    //           ...item,
    //           dataSource: item.tDataSource
    //         }
    //       })
    //       this.selectTagTagsListTotal = data.pageInfo.total
    //     })
    // },
    // removeTag (tag) {
    //   const addForm = this.addForm
    //   if (tag.tDataSource === 12) {
    //     // 人群标签 id 集合
    //     addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.filter(tagId => tagId !== tag.tagId)
    //   } else {
    //     // 其他的标签 id 集合
    //     addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
    //   }
    //   // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
    //   this.tagList.splice(this.tagList.indexOf(tag), 1)
    //   // this.tagList.forEach(item => {item.filter(item => item.tagId !== id)})
    // },
    // handleTagCurrentChange (pages) {
    //   this.selectTagInitCurrentPage = pages
    //   this.getTags()
    // },

    // // 请求新增或编辑接口
    // fetchAddOrEdit (data) {
    //   const tipMessage = this.isDynamicPeople ? '操作成功' : `操作成功，${this.crowdId != null ? '修改人群条件会影响该策略下所有人群的交叉，请点击“估算”重新估算其他人群的圈定数据' : '新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据'}`

    //   if (this.crowdId != null) {
    //     data.crowdId = this.crowdId
    //     data.priority = this.priority
    //     this.$service
    //       .crowdUpdate(
    //         data,
    //         tipMessage
    //         // '操作成功，修改人群条件会影响该策略下所有人群的交叉，请点击“估算”重新估算其他人群的圈定数据'
    //       )
    //       .then(() => {
    //         this.$emit('goBackCrowdListPage', true)
    //       })
    //   } else {
    //     this.$service
    //       .crowdSave(
    //         data,
    //         tipMessage
    //         // '操作成功，新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据'
    //       )
    //       .then(() => {
    //         this.$emit('goBackCrowdListPage', true)
    //       })
    //   }
    // },

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
      // 设置标签中，加上了效果指标
      this.tags = [...this.circulationTagDataList, ...normalTags]
      // 行为标签
      this.actionTags = actionTags
      this.specialTags = specialTags
      // console.log('this.tags------------->', this.tags)
      // console.log('this.actionTags------------->', this.actionTags)
      // console.log('this.specialTags------------->', this.specialTags)
    },
    // 回显编辑数据
    reviewEditData () {
      // 编辑数据
      const policyData = this.editRow
      this.totalLink = policyData.link // 总运算符

      this.form.autoVersion = policyData.autoVersion || false
      this.form.isShowAutoVersion = policyData.isShowAutoVersion || false

      const tagIds = policyData.tagIds

      if (policyData.id) {
        this.$service.getTagsByEntryId({ entryId: policyData.id }).then(data => {
          this.tagList = data || []
          this.sortTag()
        })
      } else if (tagIds && tagIds !== '') {
        this.$service.getTagAttrsByTagIds({ tagIds }).then(data => {
          this.tagList = data || []
          this.sortTag()
        })
      } else {
        this.sortTag() // 初始化所选标签
        if (this.defaultData) { this.setDefaultData() } // 设置初始默认数据, 【批量创建】会用到
      }

      let cacheIds = []

      const cacheActionIds = []
      const cacheSpecialIds = []
      if (policyData.rulesJson) {
        const ruleJsonData = JSON.parse(policyData.rulesJson)
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
            // 多选的值，回显的时候需要转成数组
            if (item.tagType === 'string' && item.operator !== 'null' && typeof (item.value) === 'string') {
              item.value = item.value === '' ? [] : item.value.split(',')
            }
          })
          return itemParent
        })

        this.rulesJson = ruleJsonData
      }

      if (policyData.behaviorRulesJson) {
        this.behaviorRulesJson = JSON.parse(policyData.behaviorRulesJson)
        this.behaviorRulesJson.rules.forEach(ruleItem => {
          ruleItem.rules.forEach(rulesEachItem => {
          // 多选的值，回显的时候需要转成数组
            if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null' && typeof (rulesEachItem.value) === 'string') {
              rulesEachItem.value = rulesEachItem.value === '' ? [] : rulesEachItem.value.split(',')
            }
          })
        })
      }

      this.flowCondition = policyData.flowCondition ? JSON.parse(policyData.flowCondition) : { condition: 'OR', rules: [] }

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
    },
    // 设置默认数据
    setDefaultData () {
      const ruleJsonData = this.defaultData.rulesJson
      this.rulesJson = ruleJsonData
    }
  },
  async created () {
    // if (this.conditionTagsFilteredProp.length === 0) {
    //   this.getTags() // 获取所有的标签列表
    // }

    // 有传入的参数就不需要调用接口了
    if (this.circulationTagDataListProp.length === 0 && this.soureceSignListProp.length === 0) {
      await this.getCirculationTag() // 获取流转标签
    }

    // 编辑 回显
    if (this.editRow) {
      this.reviewEditData()
    } else {
      this.sortTag() // 初始化所选标签
      if (this.defaultData) { this.setDefaultData() } // 设置初始默认数据, 【批量创建】会用到
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
  padding: 20px 0
  border-radius: 4px;
  background: #ebebeb47;
  margin-bottom: 18px
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
  @import '~@/assets/tag.styl'
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
  @import '~@/assets/tag.styl'
}
.inline-form-item {
  display: inline-block;
  margin-right: 10px
  vertical-align: top;
}
.refine-people-add-tag.one-step-select-tag{
  padding: 0
  .fix-bottom-form {
    position: sticky;
    bottom: 0;
    right: 0;
    width: auto
  }
}
</style>
