<template>
    <div>
        <div class="crowd-ab-title">
            <div class="title" v-if="mode === 'editABTest'"></div>
            <div class="title" v-else>新增AB test子人群</div>
            <div @click="cancelAdd" class="el-icon-close icon-hover"></div>
        </div>
        <!--<el-row>-->
            <!--<el-col :span="24">-->
                <!---->
            <!--</el-col>-->
        <!--</el-row>-->
        <el-form :model="divideForm" :rules="divideFormRules" ref="divideForm" label-width="120px">
            <div class="first-step" v-show="step === 1">
                <div class="divide-header">第一步：填写人群份数</div>
                <template v-if="showDivideEdit">
                    <el-form-item  v-for="(item,index) in crowdEditDivideForm.name"  :label="alphaData[index]+'人群名称：'" :key="index">
                        <el-input v-model="crowdEditDivideForm.name[index]"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="人群划分份数：">
                    <el-select size="mini" v-model="copies" :disabled="showDivideEdit">
                        <el-option v-for="(part,index) in parts"
                                   :key="index"
                                   :label="part"
                                   :value="part"
                        >
                        </el-option>
                    </el-select>份
                </el-form-item>
                <el-form-item><el-button type="primary" @click="firstStep">下一步</el-button></el-form-item>
            </div>
            <div class="first-step" v-show="step === 2">
                <div class="divide-header">第二步：设置人群占比</div>
                <el-form-item label="各人群占比：">
                    <div class="block" v-for="(item,index) in copiesItem" :key="index">
                        <span>人群_{{alphaData[index]}}<span class="show-percent">{{percent[index]}}%</span></span>
                        <el-slider v-model="percent[index]" :key="item"></el-slider>
                    </div>
                </el-form-item>
                <el-form-item label="比例总和：">{{percentTotal}}</el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="step = 1">上一步</el-button>
                    <el-button type="primary" @click="secondStep">下一步</el-button>
                </el-form-item>
            </div>
            <div class="first-step" v-show="step === 3">
                <div class="divide-header">第三步：填写实验有效期并保存</div>
                <el-form-item label="实验有效期：" prop="validityTime">
                    <el-date-picker
                      v-model="divideForm.validityTime"
                      type='datetimerange'
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      align="right"
                      :default-time="['', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="step = 2">上一步</el-button>
                    <el-button 
                      type="primary"
                      @click="finish('divideForm')"
                      v-loading.fullscreen.lock="fullscreenLoading"
                      element-loading-text="保存中，请稍候"
                      element-loading-background="rgba(0, 0, 0, 0.5)"
                    >
                    完成
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'crowdAbTest',
  props: ['crowd', 'mode'],
  data () {
    return {
      fullscreenLoading: false,
      divideForm: this.genDefaultDivideForm(),
      divideFormRules: {
        validityTime: [
          { type: 'array', required: true, message: '请选择实验有效期', trigger: 'blur' }
        ]
      },
      parts: [2, 3, 4, 5],
      copies: 3,
      step: 1,
      copiesItem: [],
      percent: [],
      alphaData: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      showDivideEdit: false,
      crowdEditDivideForm: {
        currentCrowdId: undefined,
        id: [],
        name: [],
        pct: [],
        crowdId: []
      },
      percentTotal: 0,
      crowdChildItem: []
    }
  },
  watch: {
    percent (val) {
      this.percentTotal = val.reduce((prev, cur) => {
        return prev + cur
      })
    }
  },
  methods: {
    genDefaultDivideForm (preset) {
      return {
        crowdId: undefined,
        crowdName: undefined,
        pct: [],
        validityTime: '',
        ...preset
      }
    },
    cancelAdd () {
      this.$emit('goBackCrowdListPage')
    },
    // AB test划分
    handleSetData (row) {
      this.step = 1
      this.showDivideEdit = false
      const divideForm = this.genDefaultDivideForm()
      divideForm.crowdId = row.crowdId
      divideForm.crowdName = row.crowdName
      if (row.abMainCrowd === 1) {
        this.showDivideEdit = true
        this.$service.crowdABTestEdit(row.crowdId).then(data => {
          const crowd = data.crowds
          this.copies = crowd.length
          const percent = data.ratio
          this.crowdChildItem = crowd
          let [pctArr, names, ids, pcts, crowdIds] = [[], [], [], [], [], []]
          for (let i = 0; i < percent.length; i++) {
            pctArr.push(percent[i].ratio)
            pcts.push(percent[i].ratio)
            ids.push(percent[i].id)
            for (let j = 0; j < crowd.length; j++) {
              if (percent[i].crowdId === crowd[j].crowdId) {
                names.push(crowd[j].crowdName)
                crowdIds.push(crowd[j].crowdId)
                divideForm.validityTime = [crowd[j].abStartTime, crowd[j].abEndTime]
              }
            }
          }
          this.percent = pctArr
          this.crowdEditDivideForm = {
            currentCrowdId: row.crowdId,
            id: ids,
            name: names,
            pct: pcts,
            crowdId: crowdIds
          }
        })
        divideForm.crowdName = row.crowdName
      }
      this.divideForm = divideForm
    },
    firstStep () {
      this.step = 2
      const copies = this.copies
      let arr = []
      let percentArray = []
      for (let i = 0; i < copies; i++) {
        arr.push(i)
        percentArray.push(parseInt(100 / copies))
      }
      this.copiesItem = arr
      if (!this.showDivideEdit) {
        this.percent = percentArray
      }
    },
    secondStep () {
      let total = this.percentTotal
      if (total > 100) {
        this.$message.error('所有比例总和不能超过100%')
      } else {
        this.step = 3
        this.divideForm.pct = this.percent
      }
    },
    finish (formName) {
      const form = this.divideForm
      const crowdLength = form.pct.length
      let crowdData = []
      let item = {}
      // AB TEST 新增保存时
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true
          if (!this.showDivideEdit) {
            for (let i = 0; i < crowdLength; i++) {
              item = {
                name: this.alphaData[i] + '人群' + '_' + form.crowdName,
                pct: form.pct[i]
              }
              crowdData.push(item)
            }
            let formData = {
              crowd: crowdData,
              startTime: form.validityTime[0],
              endTime: form.validityTime[1]
            }
            this.$service.crowdABTestAdd({ model: form.crowdId, data: formData }, '新增A/B test划分成功').then(() => {
              this.fullscreenLoading = false
              this.$emit('goBackCrowdListPage', true)
            })
          } else {
            const getFormData = this.crowdEditDivideForm
            for (let i = 0; i < crowdLength; i++) {
              item = {
                id: getFormData.id[i],
                // name: getFormData.crowdId[i] === getFormData.currentCrowdId ? form.crowdName : getFormData.name[i],
                name: getFormData.name[i],
                pct: form.pct[i]
              }
              crowdData.push(item)
            }
            let formData = {
              crowd: crowdData,
              startTime: form.validityTime[0],
              endTime: form.validityTime[1]
            }
            this.$service.crowdABTestEditSave({ model: getFormData.currentCrowdId, data: formData }, '编辑保存A/B test划分成功').then(() => {
              this.fullscreenLoading = false
              this.$emit('goBackCrowdListPage', true)
            })
          }
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.handleSetData(this.crowd)
  }
}
</script>

<style lang="stylus" scoped>
    .show-percent
        color red
        margin-left 20px
    .divide-header
        background #0086b3
        color #fff
        padding 15px
        font-size 16px
        margin-bottom 20px
    .icon-hover
        cursor pointer
    .crowd-ab-title
        display flex
        justify-content space-between
        margin-bottom 20px
</style>
