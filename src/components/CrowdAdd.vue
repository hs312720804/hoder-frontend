<template>
<div style="margin-right: 30px">
  <!-- {{inputValue}} -->
  <!-- 动态人群 -->
  <div v-if="isDynamicPeople" class="el-collapse">
    <el-form-item label="" class="el-collapse_item">
      <template v-for="(crowd, i) in inputValue" >
        <div class="items crowd-content" :key="i" >

            <el-form-item label="人群名称" :prop="formProp(i +'.crowdName')" :rules="rules.crowdName">
              <el-input v-model="crowd.crowdName" placeholder="投放名称" :maxlength="50"></el-input>
            </el-form-item>

            <div style="position: relative">
              <div v-if="tags.length > 0">
                <el-form-item label="设置标签" required>
                  <!-- {{ crowd.rulesJson }} -->
                  <MultipleSelect
                    :tags="tags"
                    :rulesJson="crowd.rulesJson"
                    :crowd="crowd"
                    :i="i">
                  </MultipleSelect>
                </el-form-item>
              </div>

              <div class="outer-and" v-if="(tags.length > 0 && actionTags.length > 0  && hasBehaviorTag) || (tags.length > 0 &&  specialTags.length > 0) || (actionTags.length > 0  && hasBehaviorTag &&  specialTags.length > 0)">
                <el-button
                  type="danger"
                  @click="handleConditionChange(crowd)"
                  round
                  :key="i+'condition'"
                >{{ (crowd.behaviorRulesJson.link) === 'OR' ? '或' : '且' }}
                </el-button>

              <!-- {{ (crowd.behaviorRulesJson.link || crowd.behaviorRulesJson.link) === 'OR' ? '或' : '且' }}
              {{ crowd.behaviorRulesJson.link }} -->
              </div>

              <el-form-item label="行为标签" v-if="actionTags.length > 0 && hasBehaviorTag">
                <MultipleActionTagSelect
                  ref="multipleActionTagSelect"
                  :actionTags="actionTags"
                  :behaviorRulesJson="crowd.behaviorRulesJson"
                  :crowd="crowd"
                  :i="i"
                >
                <!-- @hasMoveBehaviorTagRule="hasMoveBehaviorTagRule" -->
                </MultipleActionTagSelect>
              </el-form-item>

              <el-form-item label="动态因子" v-if="specialTags.length > 0">
                <MultipleSelect
                  :specialTags="specialTags"
                  :dynamicPolicyJson="crowd.dynamicPolicyJson"
                  :crowd="crowd"
                  :i="i">
                </MultipleSelect>
              </el-form-item>

            </div>

            <el-form-item v-if="crowd.isShowAutoVersion" label="是否每日更新" prop="autoVersion">
              <el-radio-group v-model="crowd.autoVersion">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>

          <a class="app-params__remove-param" @click="handleRemoveParam(i)">
            <i v-show="i > 0" class="icon iconfont el-icon-cc-delete"></i>
          </a>
        </div>
      </template>
    </el-form-item>
  </div>

  <!-- 普通人群 -->
  <div v-else>
  <!-- <div> -->
    <el-collapse class="el-collapse" accordion v-model="activeName">
      <el-form-item label="人群条件" class="el-collapse_item">
        <div v-for="(crowd, i) in inputValue" :key="i + 'crowd'">
          <div class="items" :key="i">
            <el-collapse-item :name="i" :key="i" class="crowd-content">
              <template slot="title">
                <div class="collapse-title">
                  <div >
                    <!-- <i v-if="crowd.isLink" class="el-icon-link" style="font-size: 20px; color: #409EFF"></i>
                    {{crowd.crowdName}} -->
                    <el-tooltip placement="top">
                      <div slot="content">{{ crowd.crowdName }}</div>
                      <div class="name">
                        <i v-if="crowd.referCrowdId" class="el-icon-link" style="font-size: 20px; color: #409EFF"></i>
                        {{crowd.crowdName}}
                      </div>
                    </el-tooltip>
                  </div>
                  <!-- <div v-if="!crowd.referCrowdId"><el-button @click="handleEstimate(crowd)">估算</el-button></div> -->
                </div>
                <div class="collapse-title" style="justify-content: center" v-if="crowd.total0 != undefined">
                  <div>圈定设备数量：{{crowd.total0}} <span class="count-tips">（当人群条件有变化，请重新点击估算）</span></div>
                </div>
              </template>
              <el-form-item label="人群名称" :prop="formProp(i +'.crowdName')" :rules="rules.crowdName">
                <el-input v-model="crowd.crowdName" :disabled="!!crowd.referCrowdId" placeholder="投放名称" :maxlength="50"></el-input>
              </el-form-item>

              <template v-if="!crowd.referCrowdId" >

                <div style="position: relative" >

                  <div v-if="tags.length > 0">
                    <el-form-item label="设置标签" required>
                      <!-- {{ crowd.rulesJson }} -->
                      <MultipleSelect
                        :tags="tags"
                        :rulesJson="crowd.rulesJson"
                        :crowd="crowd"
                        :i="i">
                      </MultipleSelect>
                    </el-form-item>
                  </div>

                  <div class="outer-and" v-if="(tags.length > 0 && actionTags.length > 0  && hasBehaviorTag) || (tags.length > 0 &&  specialTags.length > 0) || (actionTags.length > 0  && hasBehaviorTag &&  specialTags.length > 0)">
                    <el-button
                      type="danger"
                      @click="handleConditionChange(crowd)"
                      round
                      :key="i+'condition'"
                    >{{ (crowd.behaviorRulesJson.link) === 'OR' ? '或' : '且' }}
                    </el-button>

                  <!-- {{ (crowd.behaviorRulesJson.link || crowd.dynamicPolicyJson.link) === 'OR' ? '或' : '且' }}
                  {{ crowd.dynamicPolicyJson.link }} -->
                  </div>

                  <el-form-item label="行为标签" v-if="actionTags.length > 0 && hasBehaviorTag">
                    <MultipleActionTagSelect
                      :key="i+'bav'"
                      ref="multipleActionTagSelect"
                      :actionTags="actionTags"
                      :behaviorRulesJson="crowd.behaviorRulesJson"
                      :crowd="crowd"
                      :i="i"
                    >
                    <!-- @hasMoveBehaviorTagRule="hasMoveBehaviorTagRule" -->
                    </MultipleActionTagSelect>
                  </el-form-item>

                  <el-form-item label="动态因子" v-if="specialTags.length > 0">
                    <MultipleSelect
                      :specialTags="specialTags"
                      :dynamicPolicyJson="crowd.dynamicPolicyJson"
                      :crowd="crowd"
                      :i="i">
                    </MultipleSelect>
                  </el-form-item>

                  <!-- <el-form-item label="用户行为满足" v-if="specialTags.length > 0">
                    <MUserAction :specialTags="specialTags" :dynamicPolicyJson="crowd.dynamicPolicyJson" :crowd="crowd" :i="i"></MUserAction>
                  </el-form-item> -->
                </div>

                <el-form-item v-if="crowd.isShowAutoVersion" label="是否每日更新" prop="autoVersion">
                  <el-radio-group v-model="crowd.autoVersion">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="是否限制投放数量" prop="limitLaunch">
                  <el-radio-group v-model="crowd.limitLaunch">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="投放数量" prop="limitLaunchCount" v-if="crowd.limitLaunch">
                  <el-input-number size="medium" placeholder="不能大于1,000,000" :max="1000000" :min="1" v-model="crowd.limitLaunchCount" style="width: 220px;"></el-input-number>
                  <span class="tip-text">命中的设备数量上限</span>
                </el-form-item>

                <el-form-item label="人群黑名单" prop="blackFlag">
                  <el-radio-group v-model="crowd.blackFlag">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>

                <template v-if="crowd.blackFlag === 1">
                  <div
                    class="filed-row"
                    v-for="(item, index) in crowd.blackList"
                    :key="index"
                    style="margin-left: 130px"
                  >
                    <el-form-item
                      :prop="propPrefix + i + '.blackList.' + index + '.value'"
                      :rules="[
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { validator: checkBlackName, trigger: ['blur'] }
                      ]">
                      <el-input
                        v-model="item.value"
                        placeholder="请输入要屏蔽的MAC地址"
                        clearable
                        style="width: 250px"
                        maxlength="12"
                        show-word-limit>
                      </el-input>

                      <el-button
                        v-if="crowd.blackList.length > 1"
                        type="text"
                        icon="el-icon-remove-outline"
                        class="delete-btn"
                        @click="handleDeleteBlack(index, crowd)"
                      >
                      </el-button>
                    </el-form-item>
                  </div>

                  <div class="filed-row" style="margin-left: 130px">
                    <el-button @click="handleAddBlack(crowd)" icon="el-icon-plus" class="add-btn">添加</el-button>
                  </div>
                </template>

                <el-form-item label="备注" :prop="formProp('remark')">
                  <el-input v-model="crowd.remark" placeholder="备注"></el-input>
                </el-form-item>

                <el-form-item label="优先级" :prop="formProp(i +'.crowdOrder')" :rules="rules.noEmpty">
                  <el-input-number v-model="crowd.crowdOrder" @change="changeSeq(i)" :precision="0"></el-input-number>
                </el-form-item>
                <el-button type="text" class="copyCrowd" @click="handleCopyCrowd(crowd, i)">复制人群</el-button>
              </template>
            </el-collapse-item>

            <a class="app-params__remove-param" @click="handleRemoveParam(i)">
              <!-- <i v-show="i > 0" class="icon iconfont el-icon-cc-delete"></i> -->
              <i class="icon iconfont el-icon-cc-delete"></i>
            </a>
          </div>
        </div>
        <!-- 选择了标签才有【添加】按钮 -->
        <!-- <el-button v-if="tags.length > 0" type="primary" plain @click="handleAddParam"> -->
        <el-button v-if="tags.length > 0 || actionTags.length > 0 || specialTags.length > 0" type="primary" plain @click="handleAddParam">
          <i class="el-icon-plus"></i>&nbsp;添加
        </el-button>
        <el-button type="primary" plain @click="handleOpenAddLinkCrowd">
          <i class="el-icon-link"></i>&nbsp;引用其他人群
        </el-button>
      </el-form-item>

    </el-collapse>
  </div>

  <el-dialog
    title="引用人群"
    :visible.sync="linkDialogVisible"
    width="800px"
  >
    <linkCrowd
      ref="linkCrowdCom"
      v-model="multipleSelection"
    >
    </linkCrowd>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button @click="handleClear">全部清空</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import MultipleSelect from './MultipleSelect.vue'
import MultipleActionTagSelect from './MultipleActionTagSelect/Index.vue'
// import MUserAction from './MUserAction.vue'
import LinkCrowd from '@/views/crowdStrategy/linkCrowd.vue'

export default {
  components: {
    MultipleSelect,
    MultipleActionTagSelect,
    LinkCrowd
  },
  data () {
    // function validateKV (rule, value, cb) {
    //   if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
    //     cb(new Error('请勿输入特殊或空白字符'))
    //   } else {
    //     cb()
    //   }
    // }
    return {
      tags: [],
      actionTags: [],
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
        noEmpty: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        limitLaunchCount: [
          { required: true, message: '请输入大于0小于1,000,000的限制数量', trigger: 'blur' }
        ]
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      cityData: [],
      provinceValueList: [],
      linkDialogVisible: false,
      multipleSelection: []
    }
  },
  props: {
    value: {
      type: [String, Array]
    },
    propPrefix: {
      type: String
    },
    recordId: {
      type: Number
    },
    isDynamicPeople: {
      type: Boolean,
      default: false
    },
    policyId: {
      type: [Number, String]
    }
  },
  watch: {
    value: { // 父组件传入的参数，数组，人群列表的规则
      handler (val) {
        this.setInputValue(val)
      }
    },
    inputValue: {
      handler () {
        this.emitInputValue()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 没有行为标签，只有大数据标签这一栏时，不展示【行为标签】这一栏。
    hasBehaviorTag () {
      return this.actionTags.some(item => item.dataSource === 8)
    }
  },
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
    handleDeleteBlack (index, crowd) {
      crowd.blackList.splice(index, 1)
    },
    // 添加字段
    handleAddBlack (crowd) {
      if (crowd.blackList.length < 100) { // 黑名单数量上限为 100
        crowd.blackList.push({
          value: ''
        })
      }
    },
    // 取消
    handleCancel () {
      this.linkDialogVisible = false
    },
    // 全部清空
    handleClear () {
      // this.multipleSelection = []
      this.$refs.linkCrowdCom.$refs.multipleTable.clearSelection()
    },

    handleOpenAddLinkCrowd () {
      this.$refs.linkCrowdCom && this.$refs.linkCrowdCom.$refs.multipleTable && this.$refs.linkCrowdCom.$refs.multipleTable.clearSelection()
      this.linkDialogVisible = true
    },
    // handleCurrentChange (index) {
    //   this.initCurrentPage = index
    //   this.$service.getTagAttr({ tagId: this.currentChildItem.tagId, pageSize: this.initPageSize, pageNum: index }).then(data => {
    //     this.tagList = data.pageInfo.list
    //   })
    // },
    changeSeq () {
      this.inputValue.sort(function (x, y) {
        return x.crowdOrder - y.crowdOrder
      })
      // this.setSeq()
    },
    formProp (key) {
      return (this.propPrefix || '') + key
    },

    // 判断是否展示 “是否每日更新” 单选框
    // 判断条件： 满足1、2其中一条就显示,默认值为 是，反之隐藏；
    // 1、行为标签选择【动态周期】;
    // 2、选择了以下标签：【应用状态 (BAV0009)】，【会员状态 (BAV0001)】，【购买行为 (BAV0003)】，【用户活跃 (BAV0010)】，【优惠券行为(BAV0016)】 ;
    hasMoveBehaviorTagRule () {
      this.inputValue.forEach((crowd) => {
        const behaviorRules = crowd.behaviorRulesJson.rules
        let hasBehaviorRule = false
        let hasMoveRule = false
        let hasFullTag = false // 是否有下面的标签，有的话就展示；【应用状态 (BAV0009)】，【会员状态 (BAV0001)】，【购买行为 (BAV0003)】，【用户活跃 (BAV0010)】，【优惠券行为(BAV0016)】 ;
        const fullTagList = ['BAV0009', 'BAV0001', 'BAV0003', 'BAV0010', 'BAV0016']

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
      })
      console.log('this.inputValue==>', this.inputValue)
    },

    setInputValue (val) {
      if (val !== this.inputValue) {
        if (val.length > 0) {
          this.inputValue = JSON.parse(JSON.stringify(val))
          // this.setSeq()
        } else { // 初始化
          // 如果已有人群规则，或者选择的 tag 数量为 0，就不做任何操作
          if (this.inputValue.length > 0 || this.tagList.length === 0) {
            return
          }
          // 人群规则初始值
          this.inputValue.push(
            {
              recordId: this.getRecordId(),
              tempCrowdId: undefined,
              crowdName: undefined,
              tagIds: [],
              purpose: undefined,
              remark: undefined,
              crowdOrder: 1,
              rulesJson: {
                condition: 'OR',
                rules: []
              },
              behaviorRulesJson: {
                link: 'AND',
                condition: 'OR',
                rules: []
              },
              dynamicPolicyJson: {
                link: 'AND',
                condition: 'AND',
                rules: []
              },
              autoVersion: false,
              isShowAutoVersion: false,
              limitLaunch: false,
              limitLaunchCount: undefined,
              total0: undefined,
              blackFlag: 0, // 黑名单
              blacks: '',
              blackList: [{ // 前端数据，不需要传给后端
                value: ''
              }]
            }
          )
          // this.setSeq()
        }
      }
      // console.log('122222222222222222------------>', this.inputValue)
    },
    emitInputValue (val) {
      this.hasMoveBehaviorTagRule() // 判断是否有动态的时间周期的行为标签，有则展示勾选“是否每日更新”
      this.$emit('input', this.inputValue)
    },
    // 复制人群
    handleCopyCrowd (crowd, index) {
      // 深拷贝
      const crowdData = JSON.parse(JSON.stringify(crowd))
      this.handleAddParam({ copyCrowdData: crowdData, copyCrowdIndex: index })
    },
    // 确定 - 创建引用人群
    handleConfirm () {
      this.multipleSelection.forEach(item => {
        const isExisted = this.inputValue.some(crowd => crowd.referCrowdId === item.crowdId) // 判断是否已添加，若已添加的，就不重复新增
        if (!isExisted) {
          this.handleAddParam({ linkCrowd: item })
        }
      })
      this.linkDialogVisible = false
    },
    // 获取复制人群的后缀
    getCopyIndex (index, name) {
      const cName = `${name || '复制人群'}（${index + 1}）`
      const obj = this.inputValue.find(item => item.crowdName === cName)
      if (obj) { // 有同名的人群
        return this.getCopyIndex(index + 1, name)
      } else {
        return cName
      }
    },
    // 添加人群
    handleAddParam ({ copyCrowdData, copyCrowdIndex, linkCrowd }) {
      const length = this.inputValue.length
      this.activeName = length
      if (length >= 50) {
        this.$message({
          type: 'error',
          message: '最多添加50个'
        })
        return
      }
      if (copyCrowdData) { // 复制人群
        // var date = new Date()
        // var hour = date.getHours() // 时
        // var minutes = date.getMinutes() // 分
        // let time = `${hour}${minutes}`
        const copyName = this.getCopyIndex(0, copyCrowdData.crowdName)
        this.inputValue.push({
          ...copyCrowdData,
          crowdName: copyName
        })
      } else { // 添加普通人群、引用其他人群
        const crowdName = linkCrowd ? `${linkCrowd.crowdName}（引用人群）` : undefined
        this.inputValue.push(
          {
            referCrowdId: linkCrowd ? linkCrowd.crowdId : null,
            isLink: !!linkCrowd,
            recordId: this.getRecordId(),
            tempCrowdId: undefined,
            crowdName: crowdName,
            tagIds: [],
            purpose: undefined,
            remark: undefined,
            crowdOrder: length + 1,
            rulesJson: {
              condition: 'OR',
              rules: []
            },
            behaviorRulesJson: {
              link: 'AND',
              condition: 'OR',
              rules: []
            },
            dynamicPolicyJson: {
              link: 'AND',
              condition: 'OR',
              rules: []
            },
            autoVersion: false,
            isShowAutoVersion: false,
            limitLaunch: false,
            limitLaunchCount: undefined,
            total0: undefined,
            blackFlag: 0, // 黑名单
            blacks: '',
            blackList: [{ // 前端数据，不需要传给后端
              value: ''
            }]

          }
        )
      }
      // this.setSeq()
    },
    getRecordId () {
      return this.recordId
    },
    setSeq () {
      const inputValue = JSON.parse(JSON.stringify(this.inputValue))
      this.inputValue = inputValue.map((e, index) => {
        e.crowdOrder = index + 1
        return e
      })
    },
    handleRemoveParam (index) {
      this.inputValue.splice(index, 1)
      // this.setSeq()
    },
    handleEstimate (formData) {
      this.$service.estimateTemp(formData.rulesJson).then((data) => {
        if (data || data === 0) {
          this.$set(formData, 'total0', data)
        }
      })
    },
    handleConditionChange (crowd) {
      crowd.behaviorRulesJson.link = crowd.behaviorRulesJson.link === 'AND' ? 'OR' : 'AND'
      // crowd.rulesJson.link = crowd.behaviorRulesJson.link = crowd.dynamicPolicyJson.link
      crowd.rulesJson.link = crowd.behaviorRulesJson.link
    }
  },
  created () {
    if (this.isDynamicPeople) { // 动态人群
      this.$service.getTagsByPoliceId({ policyId: this.policyId }).then(data => {
        const normalTags = []
        const actionTags = []
        const specialTags = []
        data && data.forEach(item => {
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
        this.tags = normalTags
        this.actionTags = actionTags
        this.specialTags = specialTags
        this.setInputValue(this.value)
      })
    } else {
      if (this.value) {
        this.$service.tagInfoNew(this.recordId).then(data => {
          // this.tags = data
          // console.log(data)
          const normalTags = []
          const actionTags = []
          const specialTags = []
          this.tagList = data || []// 所有已选的标签
          data && data.forEach(item => {
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
          this.tags = normalTags
          this.actionTags = actionTags
          this.specialTags = specialTags
          this.setInputValue(this.value)
        })
      }
    }
  }
}
</script>
<style scoped  lang="stylus">
.el-collapse_item >>> .el-collapse-item__header
  padding-left 10px
  background-color rgba(249, 249, 249, 0.85)
.el-collapse_item >>> .el-collapse-item
  display inline-block
  width 100%
  margin-right 10px
.el-icon-remove-outline
  width 20px
  height 20px
.app-params__remove-param
  display inline-block
  cursor pointer
  width 26px
  height 26px
  line-height 26px
  text-align center
  color #999
  margin-left 5px
.items
  display flex
  align-items center
  >>> .el-form-item
    margin-bottom 20px
  >>>.el-collapse-item__wrap
    background-color rgba(249, 249, 249, 0.85)
    padding 10px
    // border none
    border-bottom: 1px dashed #ededed;
.el-collapse
  border-top none
  border-bottom none
.title
  font-size 18px
  margin-bottom 30px
.footer
  display flex
  justify-content flex-end
i
  cursor pointer
.el-date-editor.el-input, .el-date-editor.el-input__inner
  width 100%
.pagination
  float right
.showMoreTags >>> .el-radio
  margin 5px
.items >>> .collapse-title
  width 50%
  display flex
  justify-content space-between
  .name
    // width: 400px
    white-space nowrap
    text-overflow: ellipsis;
    overflow: hidden;

.items >>> .count-tips
  color red
  font-size 12px
.outer-and
  position absolute
  top 10px
  right 0
  bottom 3px
  left 0
  width 3px
  height auto
  margin auto 10px
  border 1px dashed red
  border-right 0
  z-index 999
  display flex
  align-items center
  justify-content center
.el-collapse
  @import '~@/assets/tag.styl'
.crowd-content
  width 100%
  display inline-block
  background-color: rgba(249,249,249,0.85);
.copyCrowd
  float right
</style>
