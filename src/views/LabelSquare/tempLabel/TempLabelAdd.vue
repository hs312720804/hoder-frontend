<template>
<!--
  crowdType
  2：临时人群
  3：行为人群
  4：广告数据银行
-->
  <div class="add">
    <el-row>
      <el-col :span="24">
        <div class="title">{{ title }}</div>
      </el-col>
    </el-row>
    <!--新增编辑界面-->
    <!--新增临时人群-->
    <div>
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form
            :model="crowdDefineForm"
            :rules="crowdDefineFormRules"
            ref="crowdDefineForm"
            label-width="140px"
          >
            <el-form-item label="人群名称" prop="launchName">
              <el-input
                size="small"
                v-model="crowdDefineForm.launchName"
                :disabled="
                  status !== undefined && (status === 2 || status === 3)
                "
                :maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="SQL语句" prop="crowdSql">
              <el-input
                type="textarea"
                placeholder="请输入生成临时人群的sql语句"
                :disabled="
                  status !== undefined && (status === 2 || status === 3)
                "
                v-model="crowdDefineForm.crowdSql"
              >
              </el-input>
            </el-form-item>
            <div class="horizontal-line">
              <el-form-item label="每天是否更新" prop="autoVersion">
                <el-radio-group
                  v-model="crowdDefineForm.autoVersion"
                  :disabled="
                    status !== undefined && (status === 2 || status === 3)
                  "
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="每天更新时间点"
                prop="autoLaunchTime"
                v-if="crowdDefineForm.autoVersion === 1"
              >
                <el-time-picker
                  v-model="crowdDefineForm.autoLaunchTime"
                  value-format="HH:mm:ss"
                  :disabled="
                    status !== undefined && (status === 2 || status === 3)
                  "
                  :picker-options="{
                    selectableRange: '9:00:00 - 23:59:59'
                  }"
                ></el-time-picker>
              </el-form-item>

              <!-- <el-form-item label="更新持续时间" prop="expiryDay" v-if="crowdDefineForm.autoVersion === 1">
                <el-select
                v-model="crowdDefineForm.expiryDay"
                :disabled="status!==undefined && (status === 2 || status === 3)"
                >
                  <el-option
                  v-for="(item,index) in effectTimeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
            </div>

            <div class="basic-line" v-if="crowdDefineForm.autoVersion === 1 && crowdType === 2">
              <el-form-item label="Mac数量基准" class="one-line">
                <el-form-item
                  label=""
                  prop="macInitialValue"
                  class="inline-block base-line"
                >
                  <cc-input-thousands-int
                    v-model="crowdDefineForm.macInitialValue"
                    ref="inputThousandsInt"
                    @change="handleRule"
                  >
                  </cc-input-thousands-int>
                </el-form-item>
                <el-form-item
                  label="环比低于"
                  label-width="100px"
                  prop="macBelowPer"
                  class="inline-block ratio"
                >
                  <el-input-number
                    v-model="crowdDefineForm.macBelowPer"
                    :precision="2"
                    @change="handleRule"
                    :min="1"
                  ></el-input-number> </el-form-item
                >&nbsp;&nbsp;%，则告警
                <el-form-item
                  label="环比高于"
                  label-width="100px"
                  prop="macAbovePer"
                  class="inline-block ratio"
                >
                  <el-input-number
                    v-model="crowdDefineForm.macAbovePer"
                    :precision="2"
                    :min="1"
                  ></el-input-number> </el-form-item
                >&nbsp;&nbsp;%，则告警
                <span>请至少填写一组基准和环比阀值</span>
              </el-form-item>
              <el-form-item label="微信数量基准" class="one-line">
                <el-form-item
                  label=""
                  prop="wxInitialValue"
                  class="inline-block base-line"
                >
                  <cc-input-thousands-int
                    v-model="crowdDefineForm.wxInitialValue"
                  >
                  </cc-input-thousands-int>
                </el-form-item>
                <el-form-item
                  label="环比低于"
                  label-width="100px"
                  prop="wxBelowPer"
                  class="inline-block ratio"
                >
                  <el-input-number
                    v-model="crowdDefineForm.wxBelowPer"
                    :precision="2"
                    @change="handleRule"
                    :min="1"
                  ></el-input-number> </el-form-item
                >&nbsp;&nbsp;%，则告警
                <el-form-item
                  label="环比高于"
                  label-width="100px"
                  prop="wxAbovePer"
                  class="inline-block ratio"
                >
                  <el-input-number
                    v-model="crowdDefineForm.wxAbovePer"
                    :precision="2"
                    @change="handleRule"
                    :min="1"
                  ></el-input-number> </el-form-item
                >&nbsp;&nbsp;%，则告警
                <span>请至少填写一组基准和环比阀值</span>
              </el-form-item>
              <div class="basic-line-error">{{ basicLineErrorText }}</div>
            </div>
            <el-form-item label="该人群所属的视频源">
              <el-radio-group
                v-model="crowdDefineForm.videoSource"
                :disabled="
                  status !== undefined && (status === 2 || status === 3)
                "
              >
                <el-radio label="0">不区分</el-radio>
                <el-radio label="1">区分</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-show="crowdDefineForm.videoSource === '1'">
              <el-checkbox-group
                v-model="crowdDefineForm.videoSourceIds"
                :disabled="
                  status !== undefined && (status === 2 || status === 3)
                "
              >
                <el-checkbox
                  v-for="(item, index) in videoSourceList"
                  :key="index"
                  :label="item.tagValueId"
                  >{{ item.tagValue }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="数据类型" prop="calType">
              <el-checkbox-group
                v-model="crowdDefineForm.calType"
                aria-required="true"
                :disabled="
                  status !== undefined && (status === 2 || status === 3)
                "
              >
                <el-checkbox
                  v-for="(item, index) in estimateItems"
                  :value="index"
                  :label="index"
                  :key="index"
                  >{{ item }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="footer">
        <el-button @click="cancelAdd">返回</el-button>
        <el-button type="primary" @click="addSubmit" v-if="crowdType === 2">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import CcInputThousandsInt from '@/components/CcInputThousandsInt'
export default {
  components: {
    CcInputThousandsInt
  },
  data () {
    return {
      // 表格当前页数据
      strategyPlatform: [],
      launchPlatform: [],
      getStrategyCrowds: [],
      title: '',
      basicLineErrorText: '',
      // 新增自定义人群
      crowdDefineForm: {
        launchCrowdId: undefined,
        launchName: '', // 投放名称
        crowdSql: '',
        // expiryDay: 7,
        autoVersion: 0,
        calType: ['0'],
        // proTempTag: false,
        autoLaunchTime: undefined,
        basicLine: undefined, // 数量基准验证用
        macInitialValue: undefined, // Mac基准值
        macAbovePer: undefined, // Mac最大阈值
        macBelowPer: 5.0, // Mac最小阈值
        wxInitialValue: undefined, // 微信基准值
        wxAbovePer: undefined, // 微信最大阈值
        wxBelowPer: undefined, // 微信最小阈值
        // minMacEstimateCount: undefined,
        // maxMacEstimateCount: undefined,
        // minWxEstimateCount: undefined,
        // maxWxEstimateCount: undefined,
        videoSource: '0',
        videoSourceIds: []
      },
      // abTestApart: undefined,
      status: undefined,
      crowdDefineFormRules: {
        launchName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        crowdSql: [
          { required: true, message: '请输入SQL语句', trigger: 'blur' }
        ],
        // proTempTag: [
        //     { required: true, message: "请选择是否生成临时标签", trigger: "blur" }
        // ],
        autoVersion: [
          { required: true, message: '请选择每天是否更新', trigger: 'blur' }
        ],
        autoLaunchTime: [
          { required: true, message: '请选择每天更新时间点', trigger: 'blur' }
        ],
        calType: [
          { required: true, message: '请至少勾选一项数据类型', trigger: 'blur' }
        ]
      },
      filterText: '',
      crowdData: [],
      effectTimeList: [],
      estimateItems: [],
      tagsList: [],
      formatTimeSet: undefined,
      firstTimeLoad: false,
      alphaData: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N'
      ],
      percent: [],
      copiesItem: [],
      // percentTotal: 0,
      videoSourceList: []
    }
  },
  props: ['editLaunchCrowdId', 'model', 'editStatus', 'crowdType'],
  watch: {
    // 'crowdForm.abTest': function (val, oldVal) {
    //     // 根第一次加载的时候不判断，当值变的时候再触发
    //     if (oldVal && this.firstTimeLoad) {
    //         this.crowdForm.policyIds = val ? '' : []
    //         this.crowdData = []
    //         this.firstTimeLoad = false
    //     }
    //     if (val && !this.firstTimeLoad) {
    //         this.crowdData = []
    //         this.crowdForm.policyIds = val ? '' : []
    //         this.firstTimeLoad = true
    //     }
    // },
    // percent(val) {
    //     this.percentTotal = val.reduce((prev ,cur) => {
    //         return prev + cur
    //     })
    // },
    'crowdDefineForm.videoSource': function (val) {
      if (val === '0') {
        this.crowdDefineForm.videoSourceIds = []
      }
    }
  },
  created () {
    this.getAddList()
    this.handleGetVideoList()
    if (this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined) {
      this.title = '编辑临时人群'
      if (this.crowdType === 3 || this.crowdType === 4) this.title = '查看'
      // this.$service.editMultiVersionCrowd(this.editLaunchCrowdId).then(data => {
      this.$service
        .getTempCrowd({ launchCrowdId: this.editLaunchCrowdId })
        .then(data => {
          let row = data
          // let abTestRatio = data.ratio || {}
          let {
            macInitialValue,
            macAbovePer,
            macBelowPer,
            wxInitialValue,
            wxAbovePer,
            wxBelowPer
          } = row
          this.crowdDefineForm = {
            launchCrowdId: row.launchCrowdId,
            launchName: row.launchName,
            crowdSql: row.crowdSql,
            // expiryDay: row.expiryDay,
            autoVersion: row.autoVersion,
            calType: row.calType.split(','),
            // proTempTag: row.proTempTag,
            autoLaunchTime: row.autoLaunchTime,
            // abTest: row.abTest,
            // ratios: abTestRatio,
            macInitialValue:
              macInitialValue === null ? undefined : macInitialValue, // Mac基准值
            macAbovePer: macAbovePer === null ? undefined : macAbovePer, // Mac最大阈值
            macBelowPer: macBelowPer === null ? undefined : macBelowPer, // Mac最小阈值
            wxInitialValue:
              wxInitialValue === null ? undefined : wxInitialValue, // 微信基准值
            wxAbovePer: wxAbovePer === null ? undefined : wxAbovePer, // 微信最大阈值
            wxBelowPer: wxBelowPer === null ? undefined : wxBelowPer, // 微信最小阈值
            videoSource: row.videoSource === '0' ? '0' : '1',
            videoSourceIds:
              row.videoSource === '0' ? [] : row.videoSource.split(',')
          }

          this.status = this.editStatus
          // 当是行为人群 或者 广告数据银行时，只能查看，不能编辑
          if (this.crowdType === 3 || this.crowdType === 4) this.status = 2
        })
    } else {
      this.title = '新增临时人群'
    }
  },
  methods: {
    callback () {
      this.$emit('changeStatus', true)
    },
    removeTag (policyId) {
      this.crowdForm.policyCrowdIds = this.crowdForm.policyCrowdIds.filter(
        v => {
          if (v.split('_')[0] != policyId) return v
        }
      )
    },
    // 新增
    handleRule () {
      let crowdForm = JSON.parse(JSON.stringify(this.crowdDefineForm))
      let macInitialValue = crowdForm.macInitialValue
      const macBelowPer = crowdForm.macBelowPer
      let wxInitialValue = crowdForm.wxInitialValue
      const wxBelowPer = crowdForm.wxBelowPer
      macInitialValue = macInitialValue && macInitialValue.toString().replace(/,/g, '')
      wxInitialValue = wxInitialValue && wxInitialValue.toString().replace(/,/g, '')
      this.validateBasicLine(
        macInitialValue,
        macBelowPer,
        wxInitialValue,
        wxBelowPer
      )
    },
    validateBasicLine (
      macInitialValue,
      macBelowPer,
      wxInitialValue,
      wxBelowPer
    ) {
      const macCondition =
        (macInitialValue === undefined || macInitialValue === '') &&
        (macBelowPer === undefined || macBelowPer === '')
      const wxCondition =
        (wxInitialValue === undefined || wxInitialValue === '') &&
        (wxBelowPer === undefined || wxBelowPer === '')
      if (macCondition && wxCondition) {
        this.basicLineErrorText = '请至少填写一组基准和环比阀值'
        return false
      } else if (
        macInitialValue !== undefined &&
        macInitialValue !== '' &&
        (macBelowPer === undefined || macBelowPer === '')
      ) {
        this.basicLineErrorText = '请把Mac数量环比低于这个选项填写完整'
        return false
      } else if (
        macBelowPer !== undefined &&
        macBelowPer !== '' &&
        (macInitialValue === undefined || macInitialValue === '')
      ) {
        this.basicLineErrorText = '请把Mac数量基准这个选项填写完整'
        return false
      } else if (
        wxInitialValue !== undefined &&
        wxInitialValue !== '' &&
        (wxBelowPer === undefined || wxBelowPer === '')
      ) {
        this.basicLineErrorText = '请把微信数量环比低于这个选项填写完整'
        return false
      } else if (
        wxBelowPer !== undefined &&
        wxBelowPer !== '' &&
        (wxInitialValue === undefined || wxInitialValue === '')
      ) {
        this.basicLineErrorText = '请把微信数量基准这个选项填写完整'
        return false
      } else {
        this.basicLineErrorText = ''
        return true
      }
    },
    addSubmit () {
      this.$refs.crowdDefineForm.validate(valid => {
        if (valid) {
          let crowdForm = JSON.stringify(this.crowdDefineForm)
          crowdForm = JSON.parse(crowdForm)
          // crowdForm.biIds = crowdForm.biIds.join(",")
          crowdForm.calType = crowdForm.calType.join(',')
          crowdForm.crowdSql = crowdForm.crowdSql.trim()
          // 校验当区分视频源时，是否勾选内容源
          if (crowdForm.videoSource === '1') {
            if (crowdForm.videoSourceIds.length === 0) {
              this.$message.error('请必须勾选至少一种内容源！')
              return
            } else {
              crowdForm.videoSource = crowdForm.videoSourceIds.join(',')
            }
          }
          // ab划分对保存的数据进行处理
          // if ( this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined) {
          //     if (this.percentTotal !== 100) {
          //         this.$message.error('划分的所有比例总和必须等于100%，请调整比例再保存！')
          //         return
          //     }
          //     let oldRatio = crowdForm.ratios
          //     Object.keys(oldRatio).forEach((key, index) => {
          //         oldRatio[key] = this.percent[index]
          //     })
          //     crowdForm.ratios = oldRatio
          // }
          // let { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = crowdForm
          let {
            macInitialValue,
            macBelowPer,
            wxInitialValue,
            wxBelowPer
          } = crowdForm
          macInitialValue = macInitialValue && macInitialValue.toString().replace(/,/g, '')
          wxInitialValue = wxInitialValue && wxInitialValue.toString().replace(/,/g, '')
          crowdForm.macInitialValue = macInitialValue
          crowdForm.wxInitialValue = wxInitialValue
          if (
            crowdForm.autoVersion === 1 &&
            !this.validateBasicLine(
              macInitialValue,
              macBelowPer,
              wxInitialValue,
              wxBelowPer
            )
          ) {
            return
          }
          if (this.crowdType === 2) { crowdForm.tempCrowd = true }
          if (
            this.editLaunchCrowdId != null &&
            this.editLaunchCrowdId != undefined
          ) {
            // this.$service.saveEditMultiVersionCrowd({model: this.model, data: crowdForm},"编辑成功").then(() => {
            //     this.callback()
            // })
            this.$service.updateTempCrowd(crowdForm, '编辑成功').then(() => {
              this.callback()
            })
          } else {
            // this.$service.saveAddMultiVersionCrowd({data: crowdForm},"新增成功").then(() => {
            //     this.callback()
            // })
            this.$service.addTempCrowd(crowdForm, '新增成功').then(() => {
              this.callback()
            })
          }
        } else {
          return false
        }
      })
    },
    // 取消
    cancelAdd () {
      this.$emit('cancel-add')
    },
    getAddList () {
      this.$service.addMultiVersionCrowd(1).then(data => {
        this.launchPlatform = data.biLists
        this.effectTimeList = data.efTime.map(item => {
          return { label: item + '天', value: item }
        })
      })
      this.$service.getEstimateType().then(data => {
        this.estimateItems = data
      })
      this.$service.searchTags().then(data => {
        this.tagsList = data
      })
    },
    // 数组去重
    distinct (a, b) {
      let arr = a.concat(b)
      let result = []
      let obj = {}
      for (let i of arr) {
        if (!obj[i]) {
          result.push(i)
          obj[i] = 1
        }
      }
      return result
    },
    handleGetVideoList () {
      this.$service.getVideoSourceList().then(data => {
        this.videoSourceList = data
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.basic-line {
  border: 1px dashed #ccc;
  position: relative;
  padding-top: 10px;

  .basic-line-error {
    margin-left: 35px;
    margin-bottom: 10px;
    color: red;
  }
}

.horizontal-line {
  display: flex;
}

.multipleSelect {
  >>>.el-select {
    width: 100%;
  }
}

.add {
  border: 1px solid #ebeef5;
  padding: 20px;
  border-radius: 4px;
  margin-top: 50px;
}

.title {
  font-size: 18px;
  margin-bottom: 30px;
}

.footer {
  display: flex;
  justify-content: flex-end;
}

.inline-block {
  display: inline-block;
}

.one-line {
  position: relative;

  span {
    color: #c3bcbc;
    position: absolute;
    left: 0px;
    top: 30px;
  }
}

.base-line {
  width: 180px;
}

.ratio {
  width: 230px;
}
</style>
