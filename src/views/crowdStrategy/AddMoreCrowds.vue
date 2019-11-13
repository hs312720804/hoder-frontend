<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="form" label-width="90px">
      <CrowdAdd v-model="form.rulesJson" prop-prefix="rulesJson." :recordId="recordId" />
      <el-form-item label="人群用途" prop="purpose">
        <el-input v-model="form.purpose" placeholder="填写人群用途"></el-input>
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
  data () {
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
            }
          }
        ]
      },
      formRules: {
        purpose: [{ required: true, max: 10, message: '不超过 10 个字符', trigger: 'blur' }]
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
        const rulesJsonData = rulesJson[index].rulesJson
        const rules = rulesJsonData.rules
        const ruleLength = rules.length
        let i, j = 0
        // 判断是否有未填写的项
        for (i = 0; i < ruleLength; i++) {
          for (j = 0; j < rules[i].rules.length; j++) {
            let rulesItem = rules[i].rules[j]
            if (rulesItem.value === '') {
              this.$message.error('第' + (index + 1) + '人群里面的第' + (i + 1) + '设置标签块里面的第' + (j + 1) + '行的值不能为空')
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
                this.$message.error('第' + (index + 1) + '人群里面的第' + (i + 1) + '设置标签块里面的第' + (j + 1) + '行的值是大于等于0的正整数')
                flag = false
                break
              }
            }
          }
        }
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
                    return e
                })
                if(mode === 0) {
                    this.$service.oneDropSaveCrowd({ recordId: this.recordId , data: form.rulesJson },'保存成功').then(() => {
                        this.$router.push({ path: 'launch/strategyList' })
                        this.$emit('resetFormData')
                    })
                } else {
                    this.$service.tempCrowds({ rulesJson: form.rulesJson, recordId: this.recordId }, '保存成功').then((data) => {
                        this.$emit('handleToNextStep',this.recordId,data)
                    })
                }
            } else {
                this.$message.error('人群用途输入格式不正确')
                return false
            }
        })
    },
    handleEdit () {
      const recordId = this.recordId
      let purpose = undefined
      this.$service.getCrowdsDetail(recordId).then((data) => {
        data = data.map((e, index) => {
          if (index === 0) {
            purpose = e.purpose
          }
          e.tagIds = e.tagIds.split(",")
          e.rulesJson = JSON.parse(e.rulesJson)
          return e
        })
        this.form = {
          purpose,
          rulesJson: data
        }
      })
    },
    handleBackPrevStep () {
        this.$emit('handleBackPrevStep',this.recordId)
    },
    checkNum(num) {
        if((/(^\d+$)/).test(num)) {
            return true
        }else {
            this.$message.error('该值为必填项，且必须是大于等于0的整数')
            return false
        }
    },
  },
  created () {
      this.handleEdit()
  }
}
</script>
