<template>
    <div class="launchToBusiness">
        <el-form :model="crowdForm" :rules="rulesData" ref="crowdForm" label-width="110px">
            <el-form-item v-if="!tempPolicyAndCrowd.smart" label="投放模式" prop="launchMode">
                <el-checkbox v-model="crowdForm.launchMode.pull" :disabled="pullSuccessPushFail">pull模式（用于主页、产品包、广告、活动、弹窗、媒资）</el-checkbox>
                <el-checkbox v-model="crowdForm.launchMode.push">push模式（用于消息、微信）</el-checkbox>
            </el-form-item>
            <div class="border" v-if="crowdForm.launchMode.pull">
                <div class="tips">投放模式(pull):针对主页、产品包、广告、活动、弹窗、媒资</div>
                <el-form-item label="投放平台" prop="biIdsPull" class="multipleSelect">
                    <el-select
                      v-model="crowdForm.biIdsPull"
                      multiple
                    >
                        <el-option
                          v-for="(platform, index) in Platforms"
                          :label="platform.biName"
                          :value="platform.biId"
                          :key="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当前策略">
                    <el-select
                      v-model="crowdForm.policyIdsPull"
                      multiple
                      disabled
                    >
                        <el-option
                          v-for="(strategy,index) in strategyData"
                          :label="strategy.policyId + '-' +strategy.policyName"
                          :value="strategy.policyId"
                          :key="index"
                        >
                        </el-option>
                        <!--<el-option-->
                                <!--:label="strategyData.policyName"-->
                                <!--:value="strategyData.policyId"-->
                        <!--&gt;-->
                        <!--</el-option>-->
                    </el-select>
                </el-form-item>
            </div>
            <div class="border" v-if="crowdForm.launchMode.push">
                <div class="tips">投放模式（push）:针对消息、微信</div>
                <el-form-item label="投放名称" prop="launchName">
                    <el-input size="small"
                              v-model="crowdForm.launchName"
                              placeholder="投放名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="投放平台" class="multipleSelect" prop="biIds">
                    <el-select v-model="crowdForm.biIds" multiple placeholder="请选择投放平台">
                        <el-option
                                v-for="item in launchPlatform"
                                :key="item.biId+''"
                                :label="item.biName"
                                :value="item.biId+''"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据来源" prop="dataSource">
                    <input type="hidden" value="2" v-model="crowdForm.dataSource">
                    <el-input size="small" readonly value="大数据"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input size="small" v-model="crowdForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="是否投放子人群">
                    <el-radio-group v-model="crowdForm.abTest">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择人群类型" class="form-width">
                    <el-radio-group
                      v-model="crowdForm.crowdType"
                    >
                      <el-radio :label="0">普通人群</el-radio> <!-- false -->
                      <el-radio :label="3">行为人群</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="选择策略" prop="policyIds">
                  <!-- @change="getCrowd"
                  @remove-tag="removeTag" -->
                    <el-select
                        filterable
                        v-model="crowdForm.policyIds"
                        disabled
                    >
                        <el-option
                          v-for="item in strategyPlatform"
                          :key="item.policyId+''"
                          :label="item.policyName"
                          :value="item.policyId"
                        >{{ item.policyName }}
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- 普通人群 -->
                <template v-if="crowdForm.crowdType === 0">

                  <el-form-item
                      label="选择人群"
                      prop="policyCrowdIds"
                  >
                      <el-form-item v-for="(v,index) in crowdData" :label="crowdForm.abTest ? v.Pid: v.policyName" :key="v.policyId+'_'+index">
                        <el-checkbox-group v-model="crowdForm.policyCrowdIds" >
                            <el-checkbox
                              v-for="item in v.childs"
                              :label="item.policyId+'_'+item.crowdId"
                              :key="item.crowdId+''"
                              :disabled="item.canLaunch === false"
                            >
                            {{ item.crowdName }}
                            <!-- {{ item.crowdId }} -->
                            </el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>

                  </el-form-item>
                </template>

                <!-- 选择行为人群 & 投放子人群 -->
                <template v-if="crowdForm.crowdType === 3 && crowdForm.abTest">
                <!-- 选择行为人群 & 投放子人群 -->
                  <el-form-item
                    label="选择人群"
                    prop="policyCrowdIds"
                  >
                    <el-form-item v-for="(v,index) in crowdData" :label="v.Pid" :key="v.policyId+'_'+index">
                        <!-- {{crowdData}} -->
                        <el-checkbox-group v-model="crowdForm.policyCrowdIds" >
                            <el-checkbox
                                v-for="item in v.childs"
                                :label="item.policyId+'_'+item.crowdId+'_'+item.pid"
                                :key="item.crowdId+''"
                                :disabled="item.canLaunch === false"
                            >
                            {{ item.crowdName }}
                            <!-- {{ item.crowdId }} -->
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                  </el-form-item>
                </template>

                <!-- 选择行为人群 & 不投放子人群 -->
                <template v-else-if="crowdForm.crowdType === 3">
                <!-- 选择行为人群 & 不投放子人群 -->
                  <el-form-item
                    label="选择人群"
                    prop="tempCrowdId"
                  >
                      <!-- @change="handelBehaviorCrowdSelectChange($event, crowdForm.tempCrowdId)" -->
                      <!-- {{this.crowdForm.policyCrowdIds}} -->
                      <!-- {{behaviorCrowdList}} -->
                      <el-select
                        filterable
                        v-model="crowdForm.policyCrowdIds[0]"
                        @change="handelBehaviorCrowdSelectChange($event, crowdForm.policyCrowdIds[0], behaviorCrowdList)"
                      >
                          <el-option
                              v-for="item in behaviorCrowdList"
                              :label="item.crowdName"
                              :value="item.policyId+'_'+item.crowdId"
                              :key="item.crowdId"
                          >
                              {{ item.crowdName }} -- {{ item.behaviorTempCrowdId }}
                          </el-option>
                          <!-- <el-option
                              v-for="item in behaviorCrowdList"
                              :label="item.launchName"
                              :value="item.launchCrowdId"
                              :key="item.launchCrowdId"
                          >
                              {{ item.launchName }}
                          </el-option> -->
                      </el-select>
                  </el-form-item>
                </template>

                <!-- v1.2.3版本需求中： 隐藏“每天是否更新” -->
                <el-form-item label="每天是否更新" prop="autoVersion">
                    <el-select
                      v-model="crowdForm.autoVersion"
                    >
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdForm.autoVersion === 1">
                    <el-time-picker
                        v-model="crowdForm.autoLaunchTime"
                        value-format="HH:mm:ss"
                        :picker-options="{
                            selectableRange: '9:00:00 - 23:59:59'
                        }"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item label="数据类型">
                    <el-checkbox-group v-model="crowdForm.calType" :disabled="crowdForm.crowdType === 3">
                        <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" :disabled="index==0">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div v-if="crowdForm.crowdType === 3" class="tip">Tips: 行为人群当前仅支持push设备类型</div>
            </div>
            <el-form-item>
                <el-button type="info" @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="submitForm('crowdForm')">投放</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'StrategyPutIn',
  props: ['recordId', 'tempPolicyAndCrowd'],
  data () {
    return {
      crowdForm: {
        biIdsPull: [],
        policyIdsPull: [],
        abTest: false,
        launchCrowdId: '', // 投放ID
        launchName: '', // 投放名称
        biIds: '', // 投放平台ID
        remark: '',
        //      dataSource: 2,
        policyIds: undefined,
        policyCrowdIds: [],
        // expiryDay: 7,
        autoVersion: 0,
        autoLaunchTime: undefined,
        launchMode: {
          pull: true,
          push: false
        },
        calType: ['0'],
        crowdType: 0
      },
      rulesData: {
        launchMode: [{
          required: true, message: '请至少勾选一个投放模式'
        }],
        biIdsPull: [{ required: true, message: '请选择投放平台', trigger: 'blur' }],
        // policyIdsPull: [
        //     { required: true, message: "请选择策略平台", trigger: "blur" }
        // ],
        launchName: [
          { required: true, message: '请输入投放名称', trigger: 'blur' }
        ],
        biIds: [{ required: true, message: '请选择投放平台', trigger: 'blur' }],
        policyIds: [
          { required: true, message: '请选择策略平台', trigger: 'blur' }
        ],
        policyCrowdIds: [
          { required: true, message: '请选择人群', trigger: 'blur' }
        ],
        autoLaunchTime: [
          { required: true, message: '请选择每天更新时间点', trigger: 'blur' }
        ]
      },
      Platforms: [],
      strategyData: [],
      launchPlatform: [],
      strategyPlatform: [],
      effectTimeList: [],
      crowdData: [],
      estimateItems: [],
      firstTimeLoad: false,
      savePullDataSuccess: false,
      savePushDataSuccess: false,
      pullFail: false,
      pushFail: false,
      pullSuccessPushFail: false,
      behaviorCrowdList: []
    }
  },
  methods: {
    handelBehaviorCrowdSelectChange (e, selectedV, list) {
      const policyCrowdIds = selectedV.split('_')[1]
      // item.policyIds+'_'+item.policyCrowdIds
      this.crowdForm.tempCrowdId = list.find(item => {
        return Number(item.crowdId) === Number(policyCrowdIds)
      }).behaviorTempCrowdId
    },
    /*
      行为人群和普通人群不能混用；
      行为人群只能选择一个；
      普通人群可以多选；
    */
    handelCheckoutGroup (val, index, crowdData) {
      // console.log(val)
      // console.log(index)
      // console.log(crowdData)

      const crowdList = crowdData[index].childs
      const policyId = crowdData[index].policyId

      // 选中的对象list
      const checkedList = crowdList.filter(item => {
        const flag = val.includes(policyId + '_' + item.crowdId)
        return flag
      }) || []

      // 若无选中，则全部恢复可选状态
      if (checkedList.length === 0) {
        this.crowdData[index].childs.forEach(item => {
          item.isDisabledCrowd = false
        })
        this.$set(this.crowdData, index, this.crowdData[index])
      }
      /* eslint-disable */
      for (let i = 0; i < checkedList.length; i++) {
        const obj = checkedList[i]
        if (obj.isBehaviorCrowd) { // 选了行为人群
          this.crowdData[index].childs.forEach(item => {
            if (obj.crowdId === item.crowdId) {
              item.isDisabledCrowd = false
            } else {
              item.isDisabledCrowd = true
            }
          })
          this.$set(this.crowdData, index, this.crowdData[index])
          break
        } else { // 选了普通人群
          this.crowdData[index].childs.forEach(item => {
            if (item.isBehaviorCrowd) {
              item.isDisabledCrowd = true
            } else {
              item.isDisabledCrowd = false
            }
          })
          this.$set(this.crowdData, index, this.crowdData[index])
          break
        }
      }
      /* eslint-enable */

      console.log('this.crowdData==', this.crowdData)
    },
    handleGetCurrentPolicy () {
      this.$service.getAddCrowdData().then((data) => {
        this.Platforms = data.biLists
      })
      const tempPolicyAndCrowdData = this.tempPolicyAndCrowd
      const a = []
      this.strategyData = a.concat(tempPolicyAndCrowdData)
      this.strategyPlatform = a.concat(tempPolicyAndCrowdData)
      // let crowdTempArr = []
      // let crowdArr = crowdTempArr.concat(currentPolicy)
      // this.strategyPlatform = crowdArr
      const initArr = []
      const setPolicyArr = initArr.concat(tempPolicyAndCrowdData.policyId)
      this.crowdForm.policyIdsPull = setPolicyArr
      this.crowdForm.policyIds = tempPolicyAndCrowdData.policyId
      this.getCrowd()
      this.firstTimeLoad = true
    },
    getCrowd () {
      // 置空选择
      this.crowdForm.policyCrowdIds = [] // 选择人群
      this.crowdForm.crowdId = '' // 大人群ID
      this.crowdData = [] // 选择人群列表

      // 动态策略不执行
      if (this.tempPolicyAndCrowd.smart) return

      if (this.crowdForm.crowdType === 0) { // 获取普通人群
        this.getNomarlCrowd()
      } else if (this.crowdForm.abTest) { // 获取行为人群 + 投放子人群
        this.getABChildByPolicyId()
      } else { // 获取行为人群 + 不投放子人群
        this.getBehaviorCrowdByPolicyId()
      }
    },
    getNomarlCrowd () {
      const policyId = this.crowdForm.policyIds
      // if (this.crowdForm.abTest) {
      //     policyId = this.crowdForm.policyIds
      // } else {
      //     policyId = this.crowdForm.policyIds.join(",")
      // }
      this.$service
        .getStrategyCrowds({ policyIds: policyId, abTest: this.crowdForm.abTest })
        .then(data => {
          if (this.crowdForm.abTest) {
            const newDataForm = []
            const pid = Object.keys(data[0].childs)
            pid.forEach((item) => {
              newDataForm.push({ Pid: item, childs: data[0].childs[item] })
            })
            this.crowdData = newDataForm
          } else {
            this.crowdData = data
          }
          this.crowdData = this.crowdData.map(policy => {
            policy.childs = policy.childs.map(item => {
              let isBehaviorCrowd = false
              const behaviorRulesJson = JSON.parse(item.behaviorRulesJson)
              if (behaviorRulesJson && behaviorRulesJson.rules && behaviorRulesJson.rules.length > 0) {
                isBehaviorCrowd = true
              }

              return {
                ...item,
                isBehaviorCrowd: isBehaviorCrowd, // 是否为行为人群
                isDisabledCrowd: false // 是否禁用
              }
            })
            return policy
          })
        })
    },

    // 行为人群 - 获取选择的策略下的人群
    getBehaviorCrowdByPolicyId () {
      const policyId = this.crowdForm.policyIds

      return this.$service.getBehaviorCrowdByPolicyId({ policyId })
        .then(data => {
          this.behaviorCrowdList = data
        })
        .catch(() => {})
    },
    // 行为人群 - 获取选择的策略下的人群
    getABChildByPolicyId () {
      let policyId = null
      if (this.crowdForm.abTest) {
        policyId = this.crowdForm.policyIds
      } else {
        policyId = this.crowdForm.policyIds.join(',')
      }
      return this.$service.getABChildByPolicyId({ policyId })
        .then(data => {
          if (this.crowdForm.abTest) {
            // 重置
            this.crowdForm.policyCrowdIds = [] // 选择人群
            this.crowdForm.crowdId = '' // 大人群ID

            const newDataForm = []
            const pid = Object.keys(data[0].childs)
            pid.forEach((item) => {
              newDataForm.push({ Pid: item, childs: data[0].childs[item] })
            })
            this.crowdData = newDataForm
          } else {
            this.crowdData = data
          }
        })
        .catch(() => {})
    },
    // pull模式保存
    savePullData () {
      const formData = {
        biIds: this.crowdForm.biIdsPull,
        policyIds: this.crowdForm.policyIdsPull
      }
      this.$service.saveAddCrowdData(formData, 'pull投放成功').then(() => {
        if (this.crowdForm.launchMode.push) {
          this.savePullDataSuccess = true
          this.savePushData()
        } else {
          this.handleEnd()
        }
      }).catch(e => {
        this.pullFail = true
        this.$message.error(e)
      })
    },
    reParamsData () {
      // const checkedCrowd = this.crowdData[0].childs.find(item => {
      //   return this.crowdForm.policyCrowdIds[0] === this.crowdData[0].policyId + '_' + item.crowdId
      // })

      const crowdForm = JSON.parse(JSON.stringify(this.crowdForm))

      const formData = {
        crowdType: crowdForm.crowdType,
        biIds: crowdForm.biIds.join(','),
        policyIds: crowdForm.policyIds,
        policyCrowdIds: crowdForm.policyCrowdIds.map((v) => {
          return v.split('_')[1]
        }).join(','),
        abTest: crowdForm.abTest,
        launchName: crowdForm.launchName, // 投放名称
        remark: crowdForm.remark,
        // expiryDay: crowdForm.expiryDay,
        autoVersion: crowdForm.autoVersion,
        autoLaunchTime: crowdForm.autoLaunchTime,
        launchCrowdId: crowdForm.launchCrowdId,
        tempCrowdId: crowdForm.tempCrowdId
      }

      if (crowdForm.crowdType === 3) { // 行为人群
        // 投放子人群
        if (crowdForm.abTest) {
          formData.crowdType = 9
          formData.crowdId = crowdForm.policyCrowdIds[0].split('_')[2]
          formData.tempCrowdId = 0
        }
      } else { // 普通人群
        formData.tempCrowdId = 0
      }

      // if (checkedCrowd.isBehaviorCrowd) formData.tempCrowdId = checkedCrowd.behaviorTempCrowdId // push 行为人群需要传 tempCrowdId

      return formData
    },
    // push模式保存
    savePushData () {
      // crowdForm.policyCrowdIds
      // v.policyId+'_'+item.crowdId

      // 获取接口所需参数
      const formData = this.reParamsData()
      const calTypes = this.crowdForm.calType

      this.$service.saveAddMultiVersionCrowd({ model: formData.crowdType, data: formData }).then((data) => {
        this.handleEstimate(calTypes, data.launchCrowdId)
      }).catch(e => {
        this.handlePushError(e)
      })
    },
    handlePushError (e) {
      this.pushFail = true
      this.$message.error(e)
      if (this.crowdForm.launchMode.pull && !this.pullFail) {
        // pull成功 push异常,把pull去掉勾选且禁选
        this.crowdForm.launchMode.pull = false
        this.pullSuccessPushFail = true
      }
    },
    handleEstimate (calTypes, id) {
      if (calTypes.length === 0) {
        this.$message.error('请至少选择一个要投放的人群')
        return
      }
      const calIdType = calTypes.map((item) => item).join(',')
      this.$service.LaunchMultiVersionCrowd({ launchCrowdId: id, calIdType: calIdType }, 'push投放成功').then(() => {
        if (this.crowdForm.launchMode.pull) {
          this.savePushDataSuccess = true
        } else {
          this.handleEnd()
        }
      }).catch(e => {
        this.handlePushError(e)
      })
    },
    submitForm (formName) {
      // 重置保存成功的参数
      this.savePushDataSuccess = false
      this.savePullDataSuccess = false
      if (!this.crowdForm.launchMode.pull && !this.crowdForm.launchMode.push) {
        this.$message.error('请勾选至少一种投放模式')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.crowdForm.launchMode.pull) {
            this.savePullData()
          } else {
            this.savePushData()
          }
        } else {
          return false
        }
      })
    },
    // 手动同步策略和刷新策略列表页，关闭弹窗
    handleEnd () {
      this.$service.freshCache({ policyId: this.recordId }).then(() => {
        this.$emit('closeDialog')
        this.$root.$emit('stratege-list-refresh')
      })
    },
    getCrowdInitList () {
      this.$service.addMultiVersionCrowd(0).then(data => {
        this.launchPlatform = data.biLists
        // this.strategyPlatform = data.policies
        this.effectTimeList = data.efTime.map(item => {
          return { label: item + '天', value: item }
        })
      })
    },
    // removeTag (policyId) {
    //   this.crowdForm.policyCrowdIds = this.crowdForm.policyCrowdIds.filter((v) => {
    //     if (v.split('_')[0] != policyId) { return v }
    //   })
    // },
    handleCancel () {
      this.$emit('closeDialog')
    },
    getCountDataEnum () {
      this.$service.getEstimateType().then((data) => {
        this.estimateItems = data
      })
    }
  },
  watch: {
    recordId: function (val, oldVal) {
      if (val !== oldVal) {
        this.handleGetCurrentPolicy()
      }
    },
    'crowdForm.crowdType': function (val, oldVal) {
      // 根第一次加载的时候不判断，当值变的时候再触发
      if (val !== oldVal && oldVal !== undefined) {
        this.getCrowd()
      }
    },
    'crowdForm.abTest': function (val, oldVal) {
      // 根第一次加载的时候不判断，当值变的时候再触发
      if (val !== oldVal && oldVal !== undefined) {
        this.getCrowd()
      }
    },
    savePullDataSuccess: function (val) {
      if (this.savePushDataSuccess && val) {
        this.handleEnd()
      }
    },
    savePushDataSuccess: function (val) {
      if (this.savePullDataSuccess && val) {
        this.handleEnd()
      }
    }
  },
  created () {
    this.getCountDataEnum()
    this.handleGetCurrentPolicy()
    this.getCrowdInitList()
  }
}
</script>

<style lang="stylus" scoped>
.launchToBusiness
    width 80%
    margin auto
    >>> .el-select
        width 100%
.border
    border 1px dashed #ccc
    border-radius 30px
    padding 20px
    margin-bottom 20px
.tips
    color #333
    margin 10px
.tip
  color: #999;
  margin: 0 50px
</style>
