<template>
  <div>
    <!-- <div style="color: red">
      isDynamicPeople: {{isDynamicPeople}} <br/>
      :policyId:: {{policyId}}<br/>
      :policyName:: {{ policyName }}<br/>
      :crowdId:: {{ crowdId }}<br/>
    </div> -->
    <!-- {{form.rulesJson}} -->
    <!-- {{ form }} -->
    <el-form :model="form" :rules="formRules" ref="form" label-width="130px">
      <CrowdAdd
        ref="CrowdAdd"
        v-model="form.rulesJson"
        prop-prefix="rulesJson."
        :recordId="recordId"
        :isDynamicPeople="isDynamicPeople"
        :policyId="policyId"
      />
      <!--<el-form-item label="人群用途" prop="purpose">-->
      <!--<el-input v-model="form.purpose" placeholder="填写人群用途"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="人群有效期" prop="crowdExp">-->
      <!--<el-date-picker-->
      <!--v-model="form.crowdExp"-->
      <!--type="datetimerange"-->
      <!--range-separator="至"-->
      <!--start-placeholder="开始日期"-->
      <!--end-placeholder="结束日期"-->
      <!--value-format="yyyy-MM-dd HH:mm"-->
      <!--format="yyyy-MM-dd HH:mm"-->
      <!--:picker-options="pickerOptions"-->
      <!--:default-time="['00:00:00', '23:59:59']"-->
      <!--&gt;-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <el-button v-if="!isDynamicPeople" type="warning" @click="handleSave(0)">跳过保存</el-button>
        <el-button type="primary" @click="handleSave(1)">下一步</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="openMoveOrClearDialogVisible"
      width="420px"
      append-to-body
    >
      <div style="display: flex;align-items: center; gap: 10px">
        <i class="el-icon-warning" style="color: #e6a23c; font-size: 24px"></i>
        <span>
          单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="clearBehaviorRulesJson(openMoveOrClearDialogRef); openMoveOrCleardialogVisible = false">不保存</el-button>
        <el-button type="primary" @click="moveToRule(openMoveOrClearDialogRef); openMoveOrCleardialogVisible = false">确定移入</el-button> -->
        <el-button @click="handleClearBehaviorRulesJson">不保存</el-button>
        <el-button type="primary" @click="handleMoveToRule">确定移入</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CrowdAdd from '@/components/CrowdAdd.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    CrowdAdd
  },
  computed: {
    ...mapGetters(['policyName'])
  },
  data: function () {
    return {
      openMoveOrClearDialogVisible: false,
      openMoveOrClearDialogRef: undefined,
      activeName: 0,
      form: {
        // purpose: undefined,
        rulesJson: [
          {
            recordId: this.getRecordId(),
            tempCrowdId: undefined,
            crowdName: undefined,
            tagIds: [],
            // 'purpose': undefined,
            remark: undefined,
            crowdOrder: 0,
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
            limitLaunchCount: undefined
          }
        ]
        // crowdExp: []
      },
      formRules: {
        // purpose: [{required: true, max: 10, message: '不超过 10 个字符', trigger: 'blur'}],
        // crowdExp: [{required: true, message: '请填写人群名称', trigger: 'blur'}],
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
      timeTagKongList: []
    }
  },
  watch: {
    form: {
      handler (val) {
        // console.log('form-form-new-val-rules------------', val.rulesJson[0].rulesJson.rules[0].rules[0])
        // console.log('form-form-new-val-value------------', val.rulesJson[0].rulesJson.rules[0].rules[0].value)
      },
      deep: true
    }
  },
  props: ['recordId', 'isDynamicPeople', 'policyId', 'crowdId'],

  methods: {
    getRecordId () {
      return this.recordId
    },
    validateForm (rulesJson) {
      this.timeTagKongList = []
      let flag = true
      // 判断是否有单独在行为标签栏使用红色标签的规则
      let operateTpye = false

      for (let index = 0; index < rulesJson.length; index++) {
        if (!rulesJson[index].crowdName) {
          this.$message.error('第' + (index + 1) + '人群的人群名称不能为空')
          flag = false
          break
        }
        if (rulesJson[index].limitLaunch) {
          if (!rulesJson[index].limitLaunchCount) {
            this.$message.error('第' + (index + 1) + '人群的人群限制数量为必填')
            flag = false
            break
          } else {
            if (!Number.isInteger(rulesJson[index].limitLaunchCount)) {
              this.$message.error(
                '第' +
                  (index + 1) +
                  '人群的人群限制数量必须是大于1小于10万的整数'
              )
              flag = false
              break
            }
          }
        }

        // ------------------- 普通标签规则校验 --------------------------
        const rulesJsonData = rulesJson[index].rulesJson
        const rules = rulesJsonData.rules
        const ruleLength = rules.length
        let i
        let j = 0
        // 判断是否有未填写的项

        for (i = 0; i < ruleLength; i++) {
          for (j = 0; j < rules[i].rules.length; j++) {
            const rulesItem = rules[i].rules[j]

            // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
            const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
            if (isTimeTagKong) {
              if (!this.timeTagKongList.includes(rulesItem.tagName)) {
                this.timeTagKongList.push(rulesItem.tagName)
              }
            } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
              this.$message.error(
                '请正确填写第' +
                  (index + 1) +
                  '人群里第' +
                  (i + 1) +
                  '设置标签块里面的第' +
                  (j + 1) +
                  '行的值！'
              )
              flag = false
              break
            } else if (rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3) {
              // 二期之后的
              if (rulesItem.version > 0) {
                const startDay = rulesItem.startDay ? rulesItem.startDay : '@'
                const endDay = rulesItem.endDay ? rulesItem.endDay : '@'
                rulesItem.value = startDay + '~' + endDay
              } else { // 一期
                if (this.checkNum(rulesItem.startDay) && this.checkNum(rulesItem.endDay)) {
                  if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) {
                    rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
                  } else {
                    this.$message.error(
                      '第' +
                        (index + 1) +
                        '人群里面的第' +
                        (i + 1) +
                        '设置标签块里面的第' +
                        (j + 1) +
                        '行的天数值后面的值必须大于前面的'
                    )
                    flag = false
                    break
                  }
                } else {
                  this.$message.error(
                    '第' +
                      (index + 1) +
                      '人群里面的第' +
                      (i + 1) +
                      '设置标签块里面的第' +
                      (j + 1) +
                      '行的值是大于等于0的整数且不能超过4位数'
                  )
                  flag = false
                  break
                }
              }
            }
          }
        }
        if (!flag) break

        // ------------------- 行为标签中的大数据标签规则校验 --------------------------
        const behaviorRulesJsonData = rulesJson[index].behaviorRulesJson
        const behaviorRules = behaviorRulesJsonData.rules
        const behaviorRulesLength = behaviorRules.length
        // 拥有行为标签规则
        let hasBehaviorRule = false

        let x
        let y = 0
        // 判断是否有未填写的项

        for (x = 0; x < behaviorRulesLength; x++) {
          for (y = 0; y < behaviorRules[x].rules.length; y++) {
            const rulesItem = behaviorRules[x].rules[y]
            if (rulesItem.dataSource === 8) {
              hasBehaviorRule = true
            }
            // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
            const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
            if (isTimeTagKong) {
              if (!this.timeTagKongList.includes(rulesItem.tagName)) {
                this.timeTagKongList.push(rulesItem.tagName)
              }
            } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
              this.$message.error(
                '请正确填写第' + (index + 1) + '人群里第' + (x + 1) + '行为标签块里面的第' + (y + 1) + '行的值！'
              )
              flag = false
              break
            } else if (rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3) {
              // 二期之后的
              if (rulesItem.version > 0) {
                const startDay = rulesItem.startDay ? rulesItem.startDay : '@'
                const endDay = rulesItem.endDay ? rulesItem.endDay : '@'
                rulesItem.value = startDay + '~' + endDay
              } else { // 一期
                if (this.checkNum(rulesItem.startDay) && this.checkNum(rulesItem.endDay)) {
                  if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) {
                    rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
                  } else {
                    this.$message.error('第' + (index + 1) + '人群里面的第' + (x + 1) + '行为标签块里面的第' + (y + 1) + '行的天数值后面的值必须大于前面的')
                    flag = false
                    break
                  }
                } else {
                  this.$message.error('第' + (index + 1) + '人群里面的第' + (x + 1) + '行为标签块里面的第' + (y + 1) + '行的值是大于等于0的整数且不能超过4位数')
                  flag = false
                  break
                }
              }
            }
          }
        }
        if (!flag) break

        // ------------------- 动态因子规则校验 --------------------------
        const dynamicPolicyJson = JSON.parse(JSON.stringify(rulesJson[index].dynamicPolicyJson))
        const dynamicPolicyJsonRules = JSON.parse(JSON.stringify(dynamicPolicyJson.rules))
        const dynamicPolicyJsonRulesLength = dynamicPolicyJsonRules.length
        // 判断是否有未填写的项
        let n
        let m = 0
        for (n = 0; n < dynamicPolicyJsonRulesLength; n++) {
          for (m = 0; m < dynamicPolicyJsonRules[n].rules.length; m++) {
            const rulesItem = dynamicPolicyJsonRules[n].rules[m]
            if (rulesItem.value === '' || rulesItem.dynamic.version === '') {
              this.$message.error(
                '请正确填写第' +
                  (index + 1) +
                  '人群里第' +
                  (n + 1) +
                  '动态因子块里面的第' +
                  (m + 1) +
                  '行的值！'
              )
              flag = false
              break
            }
            if (!flag) break
          }
          if (!flag) break
        }
        if (behaviorRules.length > 0 && !hasBehaviorRule) {
          flag = false
          operateTpye = { openMoveOrClear: true }
        }
      }
      return { flag, operateTpye }
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
    moveToRule (rulesJson, type) {
      const dialogRef = this.$refs.CrowdAdd
      const actionTags = dialogRef.actionTags
      const cacheIds = []
      actionTags.forEach(item => {
        // 获取大数据标签
        if ((item.dataSource !== 8) && (item.tagType === 'string' || item.tagType === 'collect')) {
          cacheIds.push(item.tagId)
        }
      })
      for (let index = 0; index < rulesJson.length; index++) {
        const behaviorRulesJsonData = rulesJson[index].behaviorRulesJson
        const behaviorRules = behaviorRulesJsonData.rules
        const behaviorRulesLength = behaviorRules.length
        // 拥有行为标签规则
        let hasBehaviorRule = false
        let x
        let y = 0
        // 判断是否有未填写的项

        for (x = 0; x < behaviorRulesLength; x++) {
          for (y = 0; y < behaviorRules[x].rules.length; y++) {
            const rulesItem = behaviorRules[x].rules[y]
            if (rulesItem.dataSource === 8) {
              hasBehaviorRule = true
            }
          }
        }
        if (behaviorRules.length > 0 && !hasBehaviorRule) {
          // 红色标签都放在行为标签栏中
          // 就需要特殊处理

          if (type !== 'clear') {
            // 将行为标签挪进设置标签栏
            const rulesJson1 = rulesJson[index].rulesJson
            rulesJson1.rules = rulesJson1.rules.concat(behaviorRules)

            // 重新获取下拉框的选项， 因为是不同的组件------------
            if (cacheIds.length > 0) {
              this.$nextTick(() => {
                cacheIds.forEach(dialogRef.$refs.MultipleSelectRef[index].fetchTagSuggestions)
              })
            }
            // 获取下拉框的选项-end-----------
          }

          // 清空行为标签
          this.clearBehaviorRulesJson(rulesJson, index)
        }
      }
    },
    // 单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏
    // 不移入 - 清空行为标签
    clearBehaviorRulesJson (rulesJson, index) {
      // const dialogRef = this.$refs.createClientDialog
      rulesJson[index].behaviorRulesJson = { link: 'AND', condition: 'OR', rules: [] }
    },
    // 不保存
    handleClearBehaviorRulesJson () {
      this.moveToRule(this.openMoveOrClearDialogRef, 'clear')
      this.openMoveOrClearDialogVisible = false
    },
    // 确定移入
    handleMoveToRule () {
      this.moveToRule(this.openMoveOrClearDialogRef)
      this.openMoveOrClearDialogVisible = false
    },
    handleSave (mode) {
      const form = JSON.parse(JSON.stringify(this.form))
      // if (form.purpose === undefined || form.purpose === '') {
      //     this.$message.error('人群用途不能为空')
      //     return
      // }

      this.$refs.form.validate(valid => {
        if (valid) {
          const { flag, operateTpye } = this.validateForm(form.rulesJson)

          if (!flag) {
            if (operateTpye.openMoveOrClear) {
              this.openMoveOrClearDialogVisible = true
              this.openMoveOrClearDialogRef = this.form.rulesJson
              // this.$confirm('单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?', '提示', {
              //   confirmButtonText: '确定移入',
              //   cancelButtonText: '不保存',
              //   type: 'warning'
              // }).then(() => {
              //   this.moveToRule(this.form.rulesJson)
              // }).catch(() => {
              //   // 清空行为标签
              //   this.moveToRule(this.form.rulesJson, 'clear')
              // })
            }
            return
          }

          let allList = []

          const allBavRule = this.$refs.CrowdAdd && this.$refs.CrowdAdd.$refs.multipleActionTagSelect && this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs ? this.$refs.CrowdAdd.$refs.multipleActionTagSelect : []
          // 获取到组件中的form 校验必填项
          if (allBavRule.length > 0) {
            // 周期范围 ref

            // const rangeRefList = this.$refs.CrowdAdd && this.$refs.CrowdAdd.$refs.multipleActionTagSelect && this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs ? this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs.range : []
            // const rangeRefList = this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs.range || []
            // rangeRefList && rangeRefList.forEach(item => {
            //   rangeFormList.push(item.$refs.rangeForm)
            // })
            console.log('allBavRule---------------->', allBavRule)
            // let rangeFormList = []
            // allBavRule.forEach(item => {
            //   if (item.$refs.range) {
            //     rangeFormList.push(item.$refs.range[0].$refs['rangeForm'])
            //   }
            // })

            // value值 ref
            const rangeFormList = []
            const bavFormList = []
            let typeRefList = []
            const typeFormList = []

            // const typeRefList = this.$refs.CrowdAdd && this.$refs.CrowdAdd.$refs.multipleActionTagSelect && this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs ? this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs.bav : []
            allBavRule.forEach(item => {
              const range = item.$refs.range
              const bav = item.$refs.bav
              if (range && range.length > 0) {
                range.forEach(r => {
                  rangeFormList.push(r.$refs.rangeForm)
                })
              }
              if (bav && bav.length > 0) {
                bav.forEach(b => {
                  // rangeFormList.push(r.$refs['rangeForm'])
                  bavFormList.push(b.$refs.bav)
                })
                typeRefList = typeRefList.concat(bav)
              }
              // if (item.$refs && item.$refs.bav && item.$refs.bav[0]) {
              // }
            })

            // let bavFormList = []

            typeRefList && typeRefList.forEach(item => {
              if (item.$refs.bav) bavFormList.push(item.$refs.bav)
              if (item.$refs.typeRef && Array.isArray(item.$refs.typeRef)) {
                item.$refs.typeRef.forEach(obj => {
                  typeFormList.push(obj.$refs.typeForm)
                })
              } else if (item.$refs.typeRef && typeof (item.$refs.typeRef) === 'object') {
                typeFormList.push(item.$refs.typeRef.$refs.typeForm)
              }
            })

            allList = rangeFormList.concat(typeFormList, bavFormList)
            console.log('rangeFormList=======', rangeFormList)
            console.log('typeFormList=======', typeFormList)
            console.log('bavFormList=======', bavFormList)
            console.log('allList=======', allList)
          }

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
                    this.fetchSave(form, mode)
                  } else {
                    this.$message.error('请输入必填项')
                  }
                }).catch(() => {
                  this.$message.error('请至少设置一个行为标签规则')
                })
              } else { // 没有行为标签的
                this.fetchSave(form, mode)
              }
            })
          } else {
            // 有行为标签的
            if (allList.length > 0) {
              // 使用Promise.all去校验结果
              Promise.all(allList.map(this.getFormPromise)).then(res => {
                const validateResult = res.every(item => !!item)

                if (validateResult) {
                  this.fetchSave(form, mode)
                } else {
                  this.$message.error('请输入必填项')
                }
              }).catch(() => {
                this.$message.error('请至少设置一个行为标签规则')
              })
            } else { // 没有行为标签的
              this.fetchSave(form, mode)
            }
          }
        } else {
          this.$message.error('请检查表单各项是否填写完整')
          return false
        }
      })
    },
    getValue (val) {
      val.forEach(item => {
        if (item.child.length === 0) {

        } else {
          this.getValue(item.child)
        }
      })
    },

    checkIfChildrenExist (data1, data2) {
      if (data1.child == null || data1.child.length === 0) {
        data1.child.push(data2)
        return data1
      }
      // 递归
      this.checkIfChildrenExist(data1.child[0], data2)
    },

    // ReorganizationData (data) { // 将数组变成层级关系
    //   let rData = []
    //   let len = data.length
    //   for (var i = len - 1; i > -1; i--) {
    //     rData = data[i]
    //     if (data[i - 1]) {
    //       rData = this.checkIfChildrenExist(data[i - 1], rData)
    //     }
    //   }
    //   return rData
    // },
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

    // 请求创建人群接口
    fetchSave (form, mode) {
      form.rulesJson = form.rulesJson.map(e => {
        e.versionNum = 2
        // e.purpose = form.purpose
        e.tagIds = e.tagIds.join(',')
        e.rulesJson.rules = e.rulesJson.rules.map(item => {
          item.rules.forEach(rulesItem => {
            if (rulesItem.tagType === 'string' && rulesItem.operator === 'null') {
              rulesItem.operator = '='
            }
            // 多选的值，保存的时候需要转成字符串 2222
            if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
              // rulesItem.value = typeof rulesItem.value === 'string' ? rulesItem.value : rulesItem.value.join(',')
              rulesItem.value = Array.isArray(rulesItem.value) ? rulesItem.value.join(',') : rulesItem.value
            }
          })
          return item
        })
        e.rulesJson = JSON.stringify(e.rulesJson)

        e.behaviorRulesJson = this.putBehaviorRulesJsonTableIndex(e.behaviorRulesJson)
        e.behaviorRulesJson.rules = e.behaviorRulesJson.rules.map(item => {
          item.rules.forEach(rulesItem => {
            // 多选的值，保存的时候需要转成字符串 2222
            if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
            // if (rulesItem.tagType === 'string') {
              // rulesItem.value = rulesItem.value.join(',')
              rulesItem.value = Array.isArray(rulesItem.value) ? rulesItem.value.join(',') : rulesItem.value
            }

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

            if (rulesItem.tagCode === 'BAV0017' || rulesItem.tagCode === 'BAV0016' || rulesItem.tagCode === 'BAV0012' || rulesItem.tagCode === 'BAV0011') { // 【综合起播】数据需要重组  showBehaviorValue => behaviorValue
              const rData = []
              const showBehaviorValue = rulesItem.bav.showBehaviorValue
              const countValue = JSON.parse(JSON.stringify(rulesItem.bav.countValue))

              showBehaviorValue.forEach(item => {
                const itemCopy = JSON.parse(JSON.stringify(item))
                const childArray = this.ReorganizationData(itemCopy.child)
                countValue.child = childArray
                itemCopy.child = [countValue]
                rData.push(itemCopy)
              })
              rulesItem.bav.behaviorValue = rData
            }
          })

          return item
        })
        e.behaviorRulesJson = JSON.stringify(e.behaviorRulesJson)

        e.dynamicPolicyJson = JSON.stringify(e.dynamicPolicyJson)
        // e.crowdValidFrom = form.crowdExp[0]
        // e.crowdValidTo = form.crowdExp[1]
        e.limitLaunchCount = e.limitLaunch ? e.limitLaunchCount : undefined

        // 黑名单
        if (e.blackFlag === 1) {
          const list = e.blackList.map(item => {
            return item.value
          })
          e.blacks = list.join(',')
        }

        return e
      })

      if (this.isDynamicPeople) { // 动态人群 新增、编辑
        const params = form.rulesJson[0]
        params.policyId = this.policyId
        params.crowdId = this.crowdId
        if (this.crowdId) {
          // 动态人群 编辑
          this.$service
            .crowdEdit(
              params,
              '操作成功'
            )
            .then((res) => {
              this.$emit('handleDynamicCrowdNextStep', this.policyId, this.policyName, this.crowdId)
            })
        } else {
          // 动态人群 新增
          this.$service
            .crowdSave(
              params,
              '操作成功'
            )
            .then((res) => {
              this.$emit('handleDynamicCrowdNextStep', this.policyId, this.policyName, res.crowdId)
            })
        }
      } else if (mode === 0) {
        this.$service
          .oneDropSaveCrowd(
            { recordId: this.recordId, data: form.rulesJson },
            '保存成功'
          )
          .then(() => {
            // this.$root.$emit('stratege-list-refresh')
            // this.$router.push({ path: 'launch/strategyList' })
            this.$emit('handleDirectStrategyListBrother')
            this.$emit('resetFormData')
          })
      } else {
        this.$service
          .tempCrowds(
            { rulesJson: form.rulesJson, recordId: this.recordId },
            '保存成功'
          )
          .then(data => {
            this.$emit('handleToNextStep', this.recordId, data)
          })
      }
    },
    handleEdit () {
      const recordId = this.recordId
      // let purpose = undefined
      // let crowdExp = []
      this.$service.getCrowdsDetail(recordId).then(data => {
        const data2 = data.map(e => {
          // if (index === 0) {
          // purpose = e.purpose
          // if (e.crowdValidFrom === null && e.crowdValidTo === null) {crowdExp = []}
          // else {
          //     crowdExp[0] = e.crowdValidFrom === null ? '' : e.crowdValidFrom
          //     crowdExp[1] = e.crowdValidTo === null ? '' : e.crowdValidTo
          // }
          // }
          e.tagIds = e.tagIds.split(',')
          e.dynamicPolicyJson = JSON.parse(e.dynamicPolicyJson)
          e.behaviorRulesJson = JSON.parse(e.behaviorRulesJson)
          e.rulesJson = JSON.parse(e.rulesJson)
          e.rulesJson.rules.forEach(ruleItem => {
            ruleItem.rules.forEach(rulesEachItem => {
              if (
                rulesEachItem.tagType === 'string' &&
                rulesEachItem.value === 'nil'
              ) {
                rulesEachItem.operator = 'null'
              }
              // 多选的值，回显的时候需要转成数组 2222
              if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null' && typeof (rulesEachItem.value) === 'string') {
                rulesEachItem.value = rulesEachItem.value === '' ? [] : rulesEachItem.value.split(',')
              }
            })
          })
          e.behaviorRulesJson.rules.forEach(ruleItem => {
            ruleItem.rules.forEach(rulesEachItem => {
              // 多选的值，回显的时候需要转成数组 2222
              if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null' && typeof (rulesEachItem.value) === 'string') {
                rulesEachItem.value = rulesEachItem.value === '' ? [] : rulesEachItem.value.split(',')
              }
            })
          })
          e.isShowAutoVersion = false

          // 黑名单 回显数据
          e.blackFlag = e.blackFlag ? e.blackFlag : 0
          e.blacks = e.blacks ? e.blacks : ''
          e.blackList = [{ value: '' }]
          if (e.blackFlag === 1) {
            e.blackList = e.blacks.split(',').map(item => {
              return {
                value: item
              }
            })
          }

          return e
        })

        this.form = {
          // purpose,
          rulesJson: data2
          // crowdExp
        }
        // 是否是否每日更新
        this.$nextTick(() => {
          this.$refs.CrowdAdd.hasMoveBehaviorTagRule()
        })
      })
    },
    handleBackPrevStep () {
      if (this.isDynamicPeople) {
        this.$emit('handleDynamicCrowdPrevStep', this.policyId, this.policyName, this.crowdId)
      } else {
        this.$emit('handleBackPrevStep', this.recordId)
      }
    },
    checkNum (num) {
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
    getCrowdDetail () {
      if (this.crowdId != null) {
        this.$service.crowdEdit({ crowdId: this.crowdId }).then(data => {
          const rule = [data.policyCrowds].map(e => {
          // if (index === 0) {
          // purpose = e.purpose
          // if (e.crowdValidFrom === null && e.crowdValidTo === null) {crowdExp = []}
          // else {
          //     crowdExp[0] = e.crowdValidFrom === null ? '' : e.crowdValidFrom
          //     crowdExp[1] = e.crowdValidTo === null ? '' : e.crowdValidTo
          // }
          // }
            const obj = {}
            obj.tagIds = e.tagIds.split(',')
            obj.crowdName = e.crowdName
            obj.dynamicPolicyJson = JSON.parse(e.dynamicPolicyJson)
            obj.behaviorRulesJson = JSON.parse(e.behaviorRulesJson)
            obj.rulesJson = JSON.parse(e.rulesJson)

            obj.rulesJson.rules.forEach(ruleItem => {
              ruleItem.rules.forEach(rulesEachItem => {
                if (
                  rulesEachItem.tagType === 'string' &&
                  rulesEachItem.value === 'nil'
                ) {
                  rulesEachItem.operator = 'null'
                }
                // 多选的值，回显的时候需要转成数组 2222
                if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null' && typeof (rulesEachItem.value) === 'string') {
                  rulesEachItem.value = rulesEachItem.value === '' ? [] : rulesEachItem.value.split(',')
                }
              })
            })
            obj.behaviorRulesJson.rules.forEach(ruleItem => {
              ruleItem.rules.forEach(rulesEachItem => {
              // 多选的值，回显的时候需要转成数组 2222
                if (rulesEachItem.tagType === 'string' && rulesEachItem.operator !== 'null' && typeof (rulesEachItem.value) === 'string') {
                  rulesEachItem.value = rulesEachItem.value === '' ? [] : rulesEachItem.value.split(',')
                }
              })
            })
            obj.isShowAutoVersion = false

            return obj
          })

          this.form = {
            rulesJson: rule
          }
          console.log('this.form===', this.form)
          // 是否是否每日更新
          this.$nextTick(() => {
            this.$refs.CrowdAdd.hasMoveBehaviorTagRule()
          })
        })
      }
    }
  },
  created () {
    if (this.isDynamicPeople) { // 动态人群
      this.getCrowdDetail()
    } else {
      this.handleEdit()
    }

    this.form.rulesJson[0].crowdName = this.isDynamicPeople ? `${this.policyName}(动态人群)` : undefined
  }
}
</script>
