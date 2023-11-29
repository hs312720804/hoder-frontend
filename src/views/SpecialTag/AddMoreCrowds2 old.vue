<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="130px">
      <CrowdAdd
        ref="CrowdAdd"
        v-model="form.rulesJson"
        prop-prefix="rulesJson."
        :initTagList="initTagList"/>

      <el-form-item>
        <el-button type="info" @click="handleBackPrevStep">返回</el-button>
        <!-- <el-button type="warning" @click="handleSave(0)">跳过保存</el-button> -->
        <el-button type="primary" @click="handleSave()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CrowdAdd from './CrowdAdd2.vue'
export default {
  components: {
    CrowdAdd
  },
  data: function () {
    return {
      detail: {},
      activeName: 0,
      form: {
        // purpose: undefined,
        rulesJson: [
          {
            recordId: this.getRecordId(),
            // 'tempCrowdId': undefined,
            specialTagName: '',
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
            }
            // 'limitLaunch': false,
            // 'limitLaunchCount': undefined
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
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 || time.getTime() > dateRange
        }
      }
    }
  },
  // props: ['recordId'],
  props: ['initTagList'],
  inject: ['sTagIndex'],
  methods: {
    getRecordId () {
      return this.recordId
    },
    validateForm (rulesJson) {
      // if (rulesJson.length === 0) {
      //     this.$message.error('请至少填写一个标签块内容或者一个动态因子完整的内容！')
      //     return
      // }
      let flag = true
      for (let index = 0; index < rulesJson.length; index++) {
        if (rulesJson[index].rulesJson.rules.length === 0 && rulesJson[index].behaviorRulesJson.rules.length === 0) {
          this.$message.error('请设置标签条件')
          flag = false
          break
        }
        if (!rulesJson[index].specialTagName) {
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
              this.$message.error('第' + (index + 1) + '人群的人群限制数量必须是大于1小于10万的整数')
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
              rulesItem.value = '-'
            } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
              this.$message.error('请正确填写第' + (index + 1) + '人群里第' + (i + 1) + '设置标签块里面的第' + (j + 1) + '行的值！')
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
                  if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) { rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay } else {
                    this.$message.error('第' + (index + 1) + '人群里面的第' + (i + 1) + '设置标签块里面的第' + (j + 1) + '行的天数值后面的值必须大于前面的')
                    flag = false
                    break
                  }
                } else {
                  this.$message.error('第' + (index + 1) + '人群里面的第' + (i + 1) + '设置标签块里面的第' + (j + 1) + '行的值是大于等于0的整数且不能超过4位数')
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
        let x
        let y = 0
        // 判断是否有未填写的项

        for (x = 0; x < behaviorRulesLength; x++) {
          for (y = 0; y < behaviorRules[x].rules.length; y++) {
            const rulesItem = behaviorRules[x].rules[y]

            // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
            const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
            if (isTimeTagKong) {
              rulesItem.value = '-'
            } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
              this.$message.error('请正确填写第' + (index + 1) + '人群里第' + (x + 1) + '行为标签块里面的第' + (y + 1) + '行的值！')
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
              this.$message.error('请正确填写第' + (index + 1) + '人群里第' + (n + 1) + '动态因子块里面的第' + (m + 1) + '行的值！')
              flag = false
              break
            }
            if (!flag) break
          }
          if (!flag) break
        }
      }
      return flag
    },

    getFormPromise (form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    },

    // 给 behaviorRulesJson 中的 table 添加序号
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

    handleSave () {
      const form = JSON.parse(JSON.stringify(this.form))

      // debugger
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.validateForm(form.rulesJson)) {
            return
          }

          // 获取到组件中的form 校验必填项
          // 周期范围 ref
          const rangeFormList = []
          const rangeRefList = this.$refs.CrowdAdd && this.$refs.CrowdAdd.$refs.multipleActionTagSelect && this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs ? this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs.range : []
          rangeRefList && rangeRefList.forEach(item => {
            rangeFormList.push(item.$refs.rangeForm)
          })

          // value值 ref
          const typeFormList = []
          const typeRefList = this.$refs.CrowdAdd && this.$refs.CrowdAdd.$refs.multipleActionTagSelect && this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs ? this.$refs.CrowdAdd.$refs.multipleActionTagSelect[0].$refs.bav : []

          const bavFormList = []

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

          const allList = rangeFormList.concat(typeFormList)

          if (allList.length > 0) { // 有行为标签的
            // 使用Promise.all去校验结果
            Promise.all(allList.map(this.getFormPromise)).then(res => {
              const validateResult = res.every(item => !!item)

              if (validateResult) {
                this.fetchSave(form)
              } else {
                this.$message.error('请输入必填项')
              }
            }).catch(() => {
              this.$message.error('请至少设置一个行为标签规则')
            })
          } else { // 没有行为标签的
            this.fetchSave(form)
          }
        } else {
          this.$message.error('请检查表单各项是否填写完整')
          return false
        }
      })
    },

    // 请求创建人群接口
    fetchSave (form) {
      const _this = this
      form.rulesJson[0].tagIds = this.initTagList.map((e) => e.tagId)
      form.rulesJson = form.rulesJson.map((e) => {
        // e.purpose = form.purpose
        e.tagIds = e.tagIds.join(',')
        // e.tagIds = e.tagIds
        e.rulesJson.rules = e.rulesJson.rules.map(item => {
          item.rules.forEach(rulesItem => {
            if (rulesItem.tagType === 'string' && rulesItem.operator === 'null') {
              rulesItem.operator = '='
            }
            // 多选的值，保存的时候需要转成字符串 2222
            if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
              rulesItem.value = rulesItem.value.join(',')
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
              rulesItem.value = rulesItem.value.join(',')
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

            if (rulesItem.tagCode === 'BAV0017' || rulesItem.tagCode === 'BAV0016' || rulesItem.tagCode === 'BAV0012' || rulesItem.tagCode === 'BAV0011') { // 【综合起播】数据需要重组  showBehaviorValue => behaviorValue
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
          return item
        })
        e.behaviorRulesJson = JSON.stringify(e.behaviorRulesJson)
        // e.dynamicPolicyJson = JSON.stringify(e.dynamicPolicyJson)
        // e.limitLaunchCount = e.limitLaunch ? e.limitLaunchCount : undefined

        return e
      })[0]
      // debugger
      const detail = this.detail
      if (detail) {
        form.rulesJson.belongTagId = detail.belongTagId
        form.rulesJson.parentId = detail.parentId
        form.rulesJson.specialTagId = detail.specialTagId
      } else {
        form.rulesJson.belongTagId = Number(this.$route.query.belongTagId)
        form.rulesJson.parentId = 0
      }

      console.log('form.rulesJson--->', form.rulesJson)
      if (this.$route.query.specialTagId) { // 编辑
        this.$service.editSpecialTag({ rulesJson: form.rulesJson }, '保存成功').then((data) => {
          // this.$emit('handleToNextStep',this.recordId,data)
          // alert('成功！')
          // 返回
          this.$router.push({
            path: '/labelSquare',
            query: {
              refresh: true
            }
          })
        })
      } else {
        this.$service.addSpecialTag({ rulesJson: form.rulesJson }, '新建成功').then((data) => {
          // this.$emit('handleToNextStep',this.recordId,data)
          // alert('成功！')
          // 返回
          this.$router.push({
            path: '/labelSquare',
            query: {
              refresh: true
            }
          })
        })
      }
    },

    // handleEdit () {
    //   const initTagList = this.initTagList
    //   // this.$service.getCrowdsDetail(recordId).then((data) => {
    //   //   console.log(data)
    //   // eslint-disable-next-line no-debugger
    //   debugger
    //     const data = initTagList.map((e) => {
    //       e.tagIds = e.tagIds
    //       e.dynamicPolicyJson = JSON.parse(e.dynamicPolicyJson)
    //       e.rulesJson = JSON.parse(e.rulesJson)
    //       e.rulesJson.rules.forEach(ruleItem => {
    //           ruleItem.rules.forEach(rulesEachItem => {
    //               if (rulesEachItem.tagType === 'string' && rulesEachItem.value === 'nil') {
    //                   rulesEachItem.operator = 'null'
    //               }
    //           })
    //       })
    //       e.rulesJson.specialTagId = this.sTagIndex.specialTagDetail.specialTag.specialTagName
    //       return e
    //     })
    //     this.form = {
    //       rulesJson: data,
    //     }
    //     // debugger
    //     // console.log('123=======', this.$route.params.specialTagId)
    //     // this.$service.specialTagDetail({ specialTagId: this.$route.params.specialTagId }).then((data) => {
    //     //     debugger
    //     // })
    //     // this.form = {
    //     //   rulesJson: []
    //     // }
    //   // })
    // },
    handleBackPrevStep () {
      this.$emit('handleBackPrevStep', this.recordId)
    },
    checkNum (num) {
      const numInt = parseInt(num)
      if ((/(^\d+$)/).test(num) && numInt <= 9999) {
        return true
      } else {
        this.$message.error('该值为必填项，且必须是大于等于0的整数且不能超过4位数')
        return false
      }
    }
  },
  created () {
    // this.handleEdit()
    // debugger
    this.detail = this.sTagIndex.specialTagDetail.specialTag || ''
    if (this.detail) this.form.rulesJson[0].specialTagName = this.detail.specialTagName || ''
    console.log('this.detail--------->', this.detail)
  }
}
</script>
