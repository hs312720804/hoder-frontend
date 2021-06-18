<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="130px">
      <CrowdAdd v-model="form.rulesJson" prop-prefix="rulesJson." :initTagList="initTagList"/>
  
      <el-form-item>
        <el-button type="info" @click="handleBackPrevStep">返回</el-button>
        <!-- <el-button type="warning" @click="handleSave(0)">跳过保存</el-button> -->
        <el-button type="primary" @click="handleSave(1)">保存</el-button>
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
          activeName: 0,
          form: {
              // purpose: undefined,
              rulesJson: [
                  {
                      'recordId': this.getRecordId(),
                      // 'tempCrowdId': undefined,
                      'specialTagName': '',
                      'tagIds': [],
                      // 'purpose': undefined,
                      'remark': undefined,
                      'crowdOrder': 0,
                      'rulesJson': {
                          condition: 'OR',
                          rules: []
                      },
                      'dynamicPolicyJson': {
                          link: 'AND',
                          condition: 'OR',
                          rules: []
                      },
                      // 'limitLaunch': false,
                      // 'limitLaunchCount': undefined
                  }
              ],
              // crowdExp: []
          },
          formRules: {
              // purpose: [{required: true, max: 10, message: '不超过 10 个字符', trigger: 'blur'}],
              // crowdExp: [{required: true, message: '请填写人群名称', trigger: 'blur'}],
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
        if (rulesJson[index].rulesJson.rules.length === 0) {
          this.$message.error('请设置标签条件')
          flag = false
          break
        }
        if (!rulesJson[index].specialTagName) {
          this.$message.error('第' + (index + 1) + "人群的人群名称不能为空")
          flag = false
          break
        }
        if (rulesJson[index].limitLaunch) {
            if(!rulesJson[index].limitLaunchCount) {
                this.$message.error('第' + (index + 1) + "人群的人群限制数量为必填")
                flag = false
                break
            } else {
                if (!Number.isInteger(rulesJson[index].limitLaunchCount)) {
                    this.$message.error('第' + (index + 1) + "人群的人群限制数量必须是大于1小于10万的整数")
                    flag = false
                    break
                }
            }
        }
        const rulesJsonData = JSON.parse(JSON.stringify(rulesJson[index].rulesJson))
        const rules = JSON.parse(JSON.stringify(rulesJsonData.rules))
        const ruleLength = rules.length
        let i, j = 0
        // 判断是否有未填写的项
        for (i = 0; i < ruleLength; i++) {
          for (j = 0; j < rules[i].rules.length; j++) {
            let rulesItem = rules[i].rules[j]
            if (rulesItem.value === '') {
              this.$message.error('请正确填写第'+(index + 1)+'人群里第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的值！')
              flag = false
              break
            } else if (rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3) {
              if (this.checkNum(rulesItem.startDay) && this.checkNum(rulesItem.endDay)) {
                if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) { rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay }
                else {
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
          if(!flag) break
          const dynamicPolicyJson = JSON.parse(JSON.stringify(rulesJson[index].dynamicPolicyJson))
          const dynamicPolicyJsonRules = JSON.parse(JSON.stringify(dynamicPolicyJson.rules))
          const dynamicPolicyJsonRulesLength = dynamicPolicyJsonRules.length
          // 判断是否有未填写的项
          let n, m = 0
          for (n = 0; n < dynamicPolicyJsonRulesLength; n++) {
              for (m = 0; m < dynamicPolicyJsonRules[n].rules.length; m++) {
                  let rulesItem = dynamicPolicyJsonRules[n].rules[m]
                  if (rulesItem.value === '' || rulesItem.dynamic.version === '') {
                      this.$message.error('请正确填写第'+(index + 1)+'人群里第'+(n+1)+'动态因子块里面的第'+(m+1)+'行的值！')
                      flag = false
                      break
                  }
                  if(!flag) break
              }
              if(!flag) break
          }
      }
      return flag
    },
    handleSave () {
        let form = JSON.parse(JSON.stringify(this.form))
       
        // debugger
        this.$refs['form'].validate((valid) => {
          // debugger
            if (valid) {
                if (!this.validateForm(form.rulesJson)) {
                    return
                }
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
                        })
                        return item
                    })
                    e.rulesJson = JSON.stringify(e.rulesJson)
                    // e.dynamicPolicyJson = JSON.stringify(e.dynamicPolicyJson)
                    // e.limitLaunchCount = e.limitLaunch ? e.limitLaunchCount : undefined
                    
                    return e
                })[0]
                // debugger
                const detail = this.sTagIndex.specialTagDetail.specialTag
                if (detail) {
                  form.rulesJson.belongTagId = detail.belongTagId
                  form.rulesJson.parentId = detail.parentId
                  form.rulesJson.specialTagId = detail.specialTagId
                } else {
                  form.rulesJson.belongTagId = Number(this.$route.query.belongTagId)
                  form.rulesJson.parentId =  0
                }
                

            
                if (this.$route.query.specialTagId) { // 编辑
                  this.$service.editSpecialTag({ rulesJson: form.rulesJson}, '保存成功').then((data) => {
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
                  this.$service.addSpecialTag({ rulesJson: form.rulesJson}, '新建成功').then((data) => {
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
            } else {
                this.$message.error('请检查表单各项是否填写完整')
                return false
            }
        })
    },
    handleEdit () {
      const initTagList = this.initTagList
      // this.$service.getCrowdsDetail(recordId).then((data) => {
      //   console.log(data)
        const data = initTagList.map((e) => {
          e.tagIds = e.tagIds
          e.dynamicPolicyJson = JSON.parse(e.dynamicPolicyJson)
          e.rulesJson = JSON.parse(e.rulesJson)
          e.rulesJson.rules.forEach(ruleItem => {
              ruleItem.rules.forEach(rulesEachItem => {
                  if (rulesEachItem.tagType === 'string' && rulesEachItem.value === 'nil') {
                      rulesEachItem.operator = 'null'
                  }
              })
          })
          e.rulesJson.specialTagId = this.sTagIndex.specialTagDetail.specialTag.specialTagName
          return e
        })
        this.form = {
          rulesJson: data,
        }
        // debugger
        // console.log('123=======', this.$route.params.specialTagId)
        // this.$service.specialTagDetail({ specialTagId: this.$route.params.specialTagId }).then((data) => {
        //     debugger
        // })
        // this.form = {
        //   rulesJson: []
        // }
      // })
    },
    handleBackPrevStep () {
        this.$emit('handleBackPrevStep',this.recordId)
    },
    checkNum(num) {
        const numInt = parseInt(num)
        if((/(^\d+$)/).test(num) && numInt <= 9999) {
            return true
        }else {
            this.$message.error('该值为必填项，且必须是大于等于0的整数且不能超过4位数')
            return false
        }
    },
  },
  created () {
    // alert(111)
    // this.handleEdit()
    // debugger
    this.form.rulesJson[0].specialTagName = this.sTagIndex.specialTagDetail.specialTag.specialTagName
  }
}
</script>
