<template>
    <div class="launchToBusiness">
      <!-- <div style="color: red">
          isDynamicPeople: {{isDynamicPeople}} <br/>
          :policyId:: {{policyId}}<br/>
          :policyName:: {{ policyName }}<br/>
          :crowdId:: {{ crowdId }}<br/>
        </div> -->
        <el-form :model="crowdForm" :rules="rulesData" ref="crowdForm" label-width="100px">
            <el-form-item v-if="!isDynamicPeople" label="投放模式" prop="launchMode">
                <el-checkbox v-model="crowdForm.launchMode.pull">pull模式（用于主页、产品包、广告、活动、弹窗、媒资）</el-checkbox>
                <el-checkbox :disabled="!!policyId" v-model="crowdForm.launchMode.push">push模式（用于消息、微信）</el-checkbox>
            </el-form-item>
            <div class="border" v-if="crowdForm.launchMode.pull">
                <div class="tips">投放模式(pull):针对主页、产品包、广告、活动、弹窗、媒资</div>
                <el-form-item label="投放平台" prop="biIdsPull" class="multipleSelect">
                    <el-select
                      v-model="crowdForm.biIdsPull"
                      multiple
                    >
                        <el-option
                          v-for="(platform,index) in Platforms"
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
                            disabled
                    >
                        <!--<el-option-->
                                <!--v-for="(strategy,index) in strategyData"-->
                                <!--:label="strategy.policyId + '-' +strategy.policyName"-->
                                <!--:value="strategy.policyId"-->
                                <!--:key="index"-->
                        <!--&gt;-->
                        <!--</el-option>-->
                        <el-option
                                :label="strategyData.policyName"
                                :value="strategyData.policyId"
                        >
                        </el-option>
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
                <el-form-item label="选择策略" prop="policyIds">
                    <el-select
                            filterable
                            v-model="crowdForm.policyIds"
                            disabled
                            @change="getCrowd"
                            @remove-tag="removeTag"
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

                <el-form-item label="选择人群" prop="policyCrowdIds">
                        <el-form-item v-for="(v,index) in crowdData" :label="v.policyName" :key="v.policyId+'_'+index">
                            <el-checkbox-group v-model="crowdForm.policyCrowdIds" @change="handelCheckoutGroup($event, index, crowdData)">
                                <el-checkbox
                                    v-for="item in v.childs"
                                    :label="v.policyId+'_'+item.tempCrowdId"
                                    :key="item.tempCrowdId+''"
                                    :disabled="item.canLaunch === false || item.isDisabledCrowd"
                                >
                                {{ item.crowdName }}
                                </el-checkbox>
                            </el-checkbox-group>
                            <span style="color: red">单次仅可投放一个包含行为标签的人群</span>
                        </el-form-item>
                </el-form-item>
                <!--<el-form-item label="数据有效期" prop="expiryDay">-->
                    <!--<el-select-->
                            <!--v-model="crowdForm.expiryDay"-->
                    <!--&gt;-->
                        <!--<el-option-->
                                <!--v-for="(item,index) in effectTimeList"-->
                                <!--:key="index"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value"-->
                        <!--&gt;-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
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
                    <el-checkbox-group v-model="crowdForm.calType">
                        <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" :disabled="index==0">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
                <el-button type="warning" @click="submitForm('crowdForm', false)">存稿不投放</el-button>
                <el-button type="primary" @click="submitForm('crowdForm', true)">投放</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LaunchToBusinessPlatform',
  props: ['recordId', 'tempPolicyAndCrowd', 'routeSource', 'isDynamicPeople', 'policyId', 'crowdId', 'dynamicMode'],
  data () {
    return {
      crowdForm: {
        biIdsPull: [],
        policyIdsPull: '',
        abTest: false,
        launchCrowdId: '', // 投放ID
        launchName: '', // 投放名称
        biIds: '', // 投放平台ID
        remark: '',
        //      dataSource: 2,
        policyIds: '',
        policyCrowdIds: [],
        // expiryDay: 7,
        autoVersion: 0,
        autoLaunchTime: undefined,
        launchMode: {
          pull: true,
          push: false
        },
        calType: ['0']
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
      strategyData: {
        policyId: undefined,
        policyName: ''
      },
      launchPlatform: [],
      strategyPlatform: [],
      effectTimeList: [],
      crowdData: [],
      estimateItems: []
    }
  },
  computed: {
    ...mapGetters(['policyName'])
  },
  methods: {
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
      let checkedList = crowdList.filter(item => {
        const flag = val.includes(policyId + '_' + item.tempCrowdId)
        return flag
      }) || []

      // 若无选中，则全部恢复可选状态
      if (checkedList.length === 0) {
        this.crowdData[index].childs.forEach(item => {
          item.isDisabledCrowd = false
        })
        this.$set(this.crowdData, index, this.crowdData[index])
      }

      for (let i = 0; i < checkedList.length; i++) {
        // eslint-disable-next-line no-debugger
        debugger
        let obj = checkedList[i]
        if (obj.isBehaviorCrowd) { // 选了行为人群
          this.crowdData[index].childs.forEach(item => {
            // eslint-disable-next-line no-debugger
            debugger
            if (obj.tempCrowdId === item.tempCrowdId) {
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

      console.log('this.crowdData==', this.crowdData)

      // v.policyId+'_'+item.tempCrowdId
    },
    handleGetCurrentPolicy () {
      this.$service.getAddCrowdData().then((data) => {
        this.Platforms = data.biLists // 投放平台
      })
      if (this.isDynamicPeople) return // 动态人群，后面的不执行了

      const tempPolicyAndCrowdData = this.tempPolicyAndCrowd
      console.log('tempPolicyAndCrowdData===', tempPolicyAndCrowdData)
      const currentPolicy = {
        policyId: tempPolicyAndCrowdData.tempPolicy.recordId,
        policyName: tempPolicyAndCrowdData.tempPolicy.policyName
      }
      this.strategyData = currentPolicy
      let crowdTempArr = []
      let crowdArr = crowdTempArr.concat(currentPolicy)
      this.strategyPlatform = crowdArr
      this.crowdForm.policyIdsPull = currentPolicy.policyId
      this.crowdForm.policyIds = currentPolicy.policyId
      tempPolicyAndCrowdData.tempCrowds = tempPolicyAndCrowdData.tempCrowds.map(item => {
        let isBehaviorCrowd = false
        let behaviorRulesJson = JSON.parse(item.behaviorRulesJson)
        if (behaviorRulesJson && behaviorRulesJson.rules && behaviorRulesJson.rules.length > 0) {
          isBehaviorCrowd = true
        }
        return {
          ...item,
          isBehaviorCrowd, // 是否为行为人群
          isDisabledCrowd: false // 是否禁用
        }
      })
      let arr = []
      let currentCrowd = {
        policyId: tempPolicyAndCrowdData.tempPolicy.recordId,
        policyName: tempPolicyAndCrowdData.tempPolicy.policyName,
        childs: tempPolicyAndCrowdData.tempCrowds
      }
      this.crowdData = arr.concat(currentCrowd)
    },
    submitForm (formName, launch) {
      if (!this.crowdForm.launchMode.pull && !this.crowdForm.launchMode.push) {
        this.$message.error('请勾选至少一种投放模式')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let crowdForm = JSON.stringify(this.crowdForm)
          crowdForm = JSON.parse(crowdForm)
          if (this.crowdForm.launchMode.push) {
            crowdForm.biIds = crowdForm.biIds.join(',')
            crowdForm.calType = crowdForm.calType.join(',')
            crowdForm.policyIds = crowdForm.policyIds
            crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v) => {
              return v.split('_')[1]
            }).join(',')
          }
          let formData = {
            launch: launch,
            pullBiIds: crowdForm.biIdsPull,
            pull: crowdForm.launchMode.pull,
            push: crowdForm.launchMode.push,
            multiVersionCrowd: this.crowdForm.launchMode.push ? {
              autoLaunchTime: crowdForm.autoLaunchTime,
              autoVersion: crowdForm.autoVersion,
              biIds: crowdForm.biIds,
              // expiryDay:  crowdForm.expiryDay,
              launchName: crowdForm.launchName,
              policyCrowdIds: crowdForm.policyCrowdIds,
              calType: crowdForm.calType,
              remark: crowdForm.remark
            } : undefined
          }
          // 动态人群的保存 只能pull
          if (this.policyId) {
            let data = {
              biIds: crowdForm.biIdsPull,
              policyIds: [this.policyId]
            }
            if (launch) {
              // 方案创建需要先同步后投放
              this.$service.freshCache({ policyId: this.policyId }, '同步成功').then(() => {
                setTimeout(() => {
                  this.$service.saveAddCrowdData(data, 'pull投放成功').then(res => {
                    if (this.routeSource) {
                      this.$router.push({
                        name: 'myPolicy',
                        params: { changeTab: 'ToMyLaunch' }
                      })
                    }

                    if (this.dynamicMode === 'edit') { // 大人群列表 -添加动态人群
                      this.$emit('goBackCrowdListPage')
                    } else { // 创建策略流程
                      this.$router.push({ path: 'launch/launchTabList' })
                      // this.$root.$emit('stratege-list-refresh')
                      // this.$emit('resetFormData')
                    }
                  })
                }, 300)
              })
            } else {
              if (this.dynamicMode === 'edit') { // 大人群列表 -添加动态人群
                this.$emit('goBackCrowdListPage')
              } else { // 创建策略流程
                this.$router.push({ path: 'launch/launchTabList' })
                // this.$root.$emit('stratege-list-refresh')
                // this.$emit('resetFormData')
              }
            }
          } else {
            this.$service.oneDropCrowdSaveAndLaunch({ recordId: this.recordId, data: formData }, '投放成功').then((data) => {
              if (data.policyId) {
                // 一键投放成功之后，调'未同步'的接口，手动进行同步
                this.jumpToRouter(launch, data.policyId)
              } else {
                if (this.routeSource) {
                  this.$router.push({
                    name: 'myPolicy',
                    params: { changeTab: 'ToMyLaunch' }
                  })
                } else {
                  this.$router.push({ path: 'launch/launchTabList' })
                }
                // this.$router.push({ path: 'launch/launchTabList' })
                this.$root.$emit('stratege-list-refresh')
                this.$emit('resetFormData')
              }
            }).catch((err) => {
              if (err.message.indexOf('已存在') === -1) {
                if (this.routeSource) {
                  this.$router.push({
                    name: 'myPolicy',
                    params: { changeTab: 'ToMyLaunch' }
                  })
                } else {
                  this.$router.push({ path: 'launch/launchTabList' })
                }
                // this.$router.push({ path: 'launch/launchTabList' })
                this.$root.$emit('stratege-list-refresh')
                this.$emit('resetFormData')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    jumpToRouter (launch, policyId) {
      if (launch) {
        this.$service.freshCache({ policyId: policyId }).then(() => {
          if (this.routeSource) {
            this.$router.push({
              name: 'myPolicy',
              params: { changeTab: 'ToMyLaunch' }
            })
          } else {
            this.$router.push({ path: 'launch/launchTabList' })
          }
          // this.$router.push({ path: 'launch/launchTabList' })
          this.$root.$emit('stratege-list-refresh')
          this.$emit('resetFormData')
        })
      } else {
        this.$emit('handleDirectStrategyList')
        // this.$root.$emit('stratege-list-refresh')
        // this.$router.push({ path: 'launch/strategyList' })
        this.$emit('resetFormData')
      }
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
    getCrowd () {
      let policyId = this.crowdForm.policyIds
      // if (this.crowdForm.abTest) {
      //     policyId = this.crowdForm.policyIds
      // } else {
      //     policyId = this.crowdForm.policyIds.join(",")
      // }
      this.$service
        .getStrategyCrowds({ policyIds: policyId, abTest: this.crowdForm.abTest })
        .then(data => {
          if (this.crowdForm.abTest) {
            let newDataForm = []
            const pid = Object.keys(data[0].childs)
            pid.forEach((item) => {
              newDataForm.push({ Pid: item, childs: data[0].childs[item] })
            })
            this.crowdData = newDataForm
          } else {
            this.crowdData = data
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    removeTag (policyId) {
      this.crowdForm.policyCrowdIds = this.crowdForm.policyCrowdIds.filter((v) => {
        if (v.split('_')[0] != policyId) { return v }
      })
    },
    handleBackPrevStep () {
      if (this.isDynamicPeople) {
        this.$emit('launchPrevStep', 4)
      } else {
        this.$emit('launchPrevStep', 2)
      }
    },
    getCountDataEnum () {
      this.$service.getEstimateType().then((data) => {
        this.estimateItems = data
      })
    }
  },
  created () {
    if (this.isDynamicPeople) { // 动态人群
      this.crowdForm.launchMode.push = false
      this.crowdForm.policyIdsPull = this.policyName
    }
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
</style>
