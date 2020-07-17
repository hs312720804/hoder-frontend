<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="130px">
      <CrowdAdd v-model="form.rulesJson" prop-prefix="rulesJson." :recordId="recordId" />
      <el-form-item label="人群用途" prop="purpose">
        <el-input v-model="form.purpose" placeholder="填写人群用途"></el-input>
      </el-form-item>
      <el-form-item label="人群有效期" prop="crowdExp">
        <el-date-picker
                v-model="form.crowdExp"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <el-button type="warning" @click="handleSave(0)">跳过保存</el-button>
        <el-button type="primary" @click="handleSave(1)">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CrowdAdd from '@/components/CrowdAdd.vue'
export default {
  components: {
    CrowdAdd
  },
    data: function () {
        return {
            activeName: 0,
            form: {
                purpose: undefined,
                rulesJson: [
                    {
                        'recordId': this.getRecordId(),
                        'tempCrowdId': undefined,
                        'crowdName': undefined,
                        'tagIds': [],
                        'purpose': undefined,
                        'remark': undefined,
                        'crowdOrder': 0,
                        'rulesJson': {
                            condition: 'OR',
                            rules: []
                        },
                        'limitLaunch': false,
                        'limitLaunchCount': undefined
                    }
                ],
                crowdExp: []
            },
            formRules: {
                purpose: [{required: true, max: 10, message: '不超过 10 个字符', trigger: 'blur'}],
                crowdExp: [{required: true, message: '请填写人群名称', trigger: 'blur'}],
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
  props: ['recordId'],
  methods: {
      getRecordId () {
          return this.recordId
      },
    validateForm (rulesJson) {
      let flag = true
      for (let index = 0; index < rulesJson.length; index++) {
        if (!rulesJson[index].crowdName) {
          this.$message.error('第' + (index + 1) + "人群的人群名称不能为空")
          flag = false
          break
        }
        if (rulesJson[index].limitLaunch) {
            if(!rulesJson[index].limitLaunchCount) {
                this.$message.error('第' + (index + 1) + "人群的人群限制数量为必填")
                flag = false
                break
            }else{
                if (!Number.isInteger(rulesJson[index].limitLaunchCount)) {
                    this.$message.error('第' + (index + 1) + "人群的人群限制数量必须是大于1小于10万的整数")
                    flag = false
                    break
                }
            }
        }
        const rulesJsonData = rulesJson[index].rulesJson
        const rules = rulesJsonData.rules
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
      }
      return flag
    },
    handleSave (mode) {
        let form = JSON.parse(JSON.stringify(this.form))
        // if (form.purpose === undefined || form.purpose === '') {
        //     this.$message.error('人群用途不能为空')
        //     return
        // }
        this.$refs['form'].validate((valid) => {
            if (valid) {
                if (!this.validateForm(form.rulesJson)) {
                    return
                }
                form.rulesJson = form.rulesJson.map((e) => {
                    e.purpose = form.purpose
                    e.tagIds = e.tagIds.join(',')
                    e.rulesJson = JSON.stringify(e.rulesJson)
                    e.crowdValidFrom = form.crowdExp[0]
                    e.crowdValidTo = form.crowdExp[1]
                    e.limitLaunchCount = e.limitLaunch ? e.limitLaunchCount : undefined
                    return e
                })
                if(mode === 0) {
                    this.$service.oneDropSaveCrowd({ recordId: this.recordId , data: form.rulesJson },'保存成功').then(() => {
                        // this.$root.$emit('stratege-list-refresh')
                        // this.$router.push({ path: 'launch/strategyList' })
                        this.$emit('handleDirectStrategyListBrother')
                        this.$emit('resetFormData')
                    })
                } else {
                    this.$service.tempCrowds({ rulesJson: form.rulesJson, recordId: this.recordId }, '保存成功').then((data) => {
                        this.$emit('handleToNextStep',this.recordId,data)
                    })
                }
            } else {
                this.$message.error('请检查表单各项是否填写完整')
                return false
            }
        })
    },
    handleEdit () {
      const recordId = this.recordId
      let purpose = undefined
      let crowdExp = []
      this.$service.getCrowdsDetail(recordId).then((data) => {
        data = data.map((e, index) => {
          if (index === 0) {
            purpose = e.purpose
              if (e.crowdValidFrom === null && e.crowdValidTo === null) {crowdExp = []}
              else {
                  crowdExp[0] = e.crowdValidFrom === null ? '' : e.crowdValidFrom
                  crowdExp[1] = e.crowdValidTo === null ? '' : e.crowdValidTo
              }
          }
          e.tagIds = e.tagIds.split(",")
          e.rulesJson = JSON.parse(e.rulesJson)
          return e
        })
        this.form = {
          purpose,
          rulesJson: data,
          crowdExp
        }
      })
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
      this.handleEdit()
  }
}
</script>
