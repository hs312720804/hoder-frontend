<template>
    <div class="add">
        <el-row>
            <el-col :span="24">
                <div class="title">{{title}}</div>
                <!-- <div>{{ crowdForm }}</div> <br/>
                policyIds - {{ this.crowdForm.policyIds }} // 选择策略<br/>
                policyCrowdIds - {{ crowdForm.policyCrowdIds }} // 选择人群<br/>
                crowdId - {{ this.crowdForm.crowdId }} // 大人群ID<br/>
                this.editLaunchCrowdId -- {{ editLaunchCrowdId }} -->
            </el-col>
        </el-row>
        <!--新增编辑界面-->
        <div >
            <el-form :model="crowdForm" :rules="crowdFormRules" ref="crowdForm" label-width="130px">
                <el-form-item label="投放名称" prop="launchName" class="form-width">
                    <el-input size="small"
                              v-model="crowdForm.launchName"
                              placeholder="投放名称"
                              :disabled="status!==undefined && (status === 2 || status === 3)"
                    ></el-input>
                </el-form-item>
                <el-form-item label="投放平台" class="multipleSelect form-width" prop="biIds">
                    <el-select
                      ref="multipleSelectRef"
                      v-model="crowdForm.biIds"
                      multiple
                      placeholder="请选择投放平台"
                      :disabled="status!==undefined && (status === 2 || status === 3)"
                      @change="handleBiIdChange"
                    >
                        <el-option
                                v-for="item in launchPlatform"
                                :key="item.biId+''"
                                :label="item.biName"
                                :value="item.biId+''"
                        >
                            <!-- {{item.biName}} -->
                        </el-option>
                    </el-select>
                    <el-checkbox
                            v-if="showAccountRelative"
                            v-model="crowdForm.setCalculate"
                            style="margin-left: 20px;position: absolute">
                        账号关联去重
                    </el-checkbox>
                </el-form-item>

                <!-- 只有当选择了【消息触达】才显示【投放应用】 -->
                <el-form-item v-if="crowdForm.biIds.includes('7')" label="投放应用" class="multipleSelect form-width" prop="packageName">
                  <el-select
                    v-model="crowdForm.packageName"
                    placeholder="请选择投放应用"
                    clearable
                  >
                    <el-option
                      v-for="item in pushPackageList"
                      :key="item.id"
                      :label="item.appName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <!-- 【普通人群】 、 【行为人群】 、【设备投放】 可以选择是否投放子人群 -->
                <el-form-item label="是否投放子人群" class="form-width" v-if="crowdForm.crowdType === 0 || crowdForm.crowdType === 3 || crowdForm.crowdType === 4">
                    <el-radio-group v-model="crowdForm.abTest" @change="handleAbTestChange" :disabled="status!==undefined && (status === 2 || status === 3)">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item ref="crowdFormItem" label="估算字段" class="form-width" prop="calIdType" required>
                  <!-- <br/>
                  {{ crowdForm }}
                  <br/>
                  {{ crowdForm.calIdType }} -->

                  <el-checkbox-group v-model="crowdForm.calIdType" :disabled="accountDefine" aria-required="true">
                    <el-checkbox
                      v-for="(item, index) in estimateItems"
                      :value="index"
                      :label="index"
                      :key="index"
                      @change="estimateValueChange(index)"
                      :disabled="crowdForm.crowdType === 3 && (index == 1 || index == 2 || index == 3)">
                      {{ item }}
                      <el-popover
                        v-if="index === '0'"
                        placement="top"
                        trigger="hover"
                        style="margin-left: 2px; "
                      >
                        当勾选了手机号、酷开openId、微信openId时，设备默认勾选
                        <span slot="reference" class="priority-tip">?</span>
                      </el-popover>
                      <el-popover
                        v-if="index === '5'"
                        placement="top"
                        trigger="hover"
                        style="margin-left: 2px; "
                      >
                        pushId 与其他数据类型互斥
                        <span slot="reference" class="priority-tip">?</span>
                      </el-popover>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择人群类型" class="form-width">
                    <el-radio-group
                      v-model="crowdForm.crowdType"
                      :disabled="disabledCrowdType"
                      style="white-space: nowrap;"
                    >
                        <el-radio :label="0">策略型人群</el-radio>
                        <el-radio :label="1">标签型人群</el-radio>

                    </el-radio-group>
                </el-form-item>

                <!-- 选择本地人群 -->
                <!-- <el-form-item v-if="crowdForm.crowdType === 2"
                  label="选择人群"
                  prop="tempCrowdId"
                >
                    <el-select
                        filterable
                        remote
                        clearable
                        v-model="crowdForm.tempCrowdId"
                        v-loadmore="{'methord': handelLoadmore}"
                        :remote-method="getTempCrowdList2"
                        :disabled="status!==undefined && (status === 2 || status === 3)"
                    >
                        <el-option
                            v-for="item in tempCrowdList2"
                            :key="item.launchCrowdId+''"
                            :label="item.launchName"
                            :value="item.launchCrowdId"
                        >
                        {{item.launchName}}
                        </el-option>
                    </el-select>

                </el-form-item> -->

                <!-- 选择行为人群 & 投放子人群 -->
                <!-- <template v-if="crowdForm.crowdType === 3 && crowdForm.abTest">
                  <el-form-item
                    label="选择策略"
                    prop="policyIds"
                    class="multipleSelect form-width"
                  >
                    <el-select
                      filterable
                      v-model="crowdForm.policyIds"
                      placeholder="请选择策略"
                      @change="getABChildByPolicyId"
                      @remove-tag="removeTag"
                      :disabled="status!==undefined && (status === 2 || status === 3)"
                    >
                      <el-option
                        v-for="item in behaviorPolicyList"
                        :key="item.policyId+''"
                        :label="item.policyName"
                        :value="item.policyId+''"
                      >{{ item.policyName }}
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    label="选择人群"
                    prop="policyCrowdIds"
                  >

                    <el-form-item v-for="(v,index) in crowdData" :label="v.Pid" :key="v.policyId+'_'+index">

                        <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">
                            <el-checkbox
                                v-for="item in v.childs"
                                :label="item.policyId+'_'+item.crowdId+'_'+item.pid"
                                :key="item.crowdId+''"
                                :disabled="item.canLaunch === false"
                            >
                            {{ item.crowdName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                  </el-form-item>
                </template> -->

                <!-- 选择行为人群 & 不投放子人群 -->
                <!-- <template v-else-if="crowdForm.crowdType === 3">
                  <el-form-item
                    label="选择人群"
                    prop="tempCrowdId"
                  >
                      <el-select
                          filterable
                          remote
                          clearable
                          v-model="crowdForm.policyCrowdIds[0]"
                          @change="handelBehaviorCrowdSelectChange($event, crowdForm.policyCrowdIds[0], behaviorCrowdList)"
                          v-loadmore="{'methord': handelLoadmore}"
                          :remote-method="getBehaviorCrowdList"
                          @clear="getBehaviorCrowdList"
                          :disabled="status!==undefined && (status === 2 || status === 3)"
                      >
                          <el-option
                              v-for="item in behaviorCrowdList"
                              :label="item.launchName"
                              :value="item.policyIds+'_'+item.policyCrowdIds"
                              :key="item.policyCrowdIds"
                          >
                              {{ item.launchName }} -- {{ item.launchCrowdId }}
                          </el-option>

                      </el-select>
                  </el-form-item>
                </template> -->

                <!-- 策略型人群 -->
                <template v-if="crowdForm.crowdType === 0">
                  <el-form-item
                    label="选择策略"
                    prop="policyIds"
                    class="multipleSelect form-width"
                  >
                  <!-- {{ crowdForm.policyIds }} -->
                  <!-- :multiple="!crowdForm.abTest" -->
                    <el-select
                      v-model="crowdForm.policyIds"
                      :key="crowdForm.abTest + 4"
                      placeholder="请选择策略"
                      @change="getCrowd"
                      @remove-tag="removeTag"
                      :disabled="status!==undefined && (status === 2 || status === 3)"
                      :loading="bitmapRemoteLoading"
                      filterable
                      remote
                      v-loadmore="{'methord': handeBitmapPushPolicyListLoadmore}"
                      :remote-method="bitmapRemoteMethod"
                    >
                      <el-option
                        v-for="item in bitmapPushPolicyList"
                        :key="item.policyId+''"
                        :label="item.policyName"
                        :value="item.policyId+''"
                      >{{ item.policyName }}
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    label="选择人群"
                    prop="policyCrowdIds"
                  >
                      <!-- {{ crowdForm.policyCrowdIds }} -->
                      <el-form-item v-for="(v,index) in crowdData" :label="crowdForm.abTest ? v.Pid: v.policyName" :key="v.policyId+'_'+index">
                        <el-radio-group
                        v-model="crowdForm.policyCrowdIds"
                        :disabled="status!==undefined && (status === 2 || status === 3)"
                        @input="event => crowdRadioChange(event, v.childs)"
                      >
                            <el-radio
                              v-for="item in v.childs"
                              :label="item.policyId+'_'+item.crowdId"
                              :key="item.crowdId+''"
                              :disabled="item.canLaunch === false"
                              style="line-height: 32px;"
                            >
                            {{ item.crowdName }}
                            </el-radio>
                        </el-radio-group>
                      </el-form-item>

                  </el-form-item>
                </template>
                 <!-- 标签型人群 -->
                <el-form-item v-else
                    label="选择标签"
                    prop="tempCrowdId"
                  >
                    <el-select
                        filterable
                        remote
                        clearable
                        v-model="crowdForm.tempCrowdId"
                        v-loadmore="{'methord': handelLoadmore}"
                        :remote-method="getTempCrowdList"
                        :disabled="status!==undefined && (status === 2 || status === 3)"
                        @change="event => crowdSelectChange(event, tempCrowdList)"
                    >
                        <el-option
                            v-for="item in tempCrowdList"
                            :key="item.launchCrowdId+''"
                            :label="item.launchName"
                            :value="item.launchCrowdId"
                        >
                        {{item.launchName }}
                        </el-option>
                    </el-select>

                </el-form-item>

                <el-form-item
                  v-if="crowdForm.crowdType === 0 || crowdForm.crowdType === 4"
                  label="每天是否更新"
                  prop="autoVersion"
                  class="form-width"
                >
                  <el-select
                    v-model="crowdForm.autoVersion"
                    :disabled="status!==undefined && (status === 2 || status === 3)"
                  >
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdForm.autoVersion === 1 && (crowdForm.crowdType === 0 || crowdForm.crowdType === 4)" class="form-width">
                  <el-time-picker
                    v-model="crowdForm.autoLaunchTime"
                    value-format="HH:mm:ss"
                    :disabled="status!==undefined && (status === 2 || status === 3)"
                    :picker-options="{
                        selectableRange: '9:00:00 - 23:59:59'
                    }"
                  ></el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
              <el-button @click="cancelAdd">返回</el-button>
              <!-- 只有【设备投放】 不显示【保存】按钮 -->
              <el-button type="primary" @click="handleSave">保存</el-button>
              <!-- 需要投放提示 -->
              <!-- <el-button
                      v-if="!(status!==undefined && (status === 2 || status === 3))"
                      type="primary"
                      @click="handelLaunch"
              >直接投放</el-button> -->

              <!-- 不需要投放提示 -->
              <el-button
                v-if="!(status!==undefined && (status === 2 || status === 3))"
                type="primary"
                @click="handleLaunchDirectly"
              >
                直接投放
              </el-button>

            </div>

        </div>
    </div>
</template>
<script>
// import CcInputThousandsInt from '@/components/CcInputThousandsInt'
export default {
  components: {
    // CcInputThousandsInt
  },
  data () {
    // 正整数数字校验
    const reg = /^[1-9][0-9]{0,7}$/
    const checkMaxMac = (rule, value, callback) => {
      if (value) {
        const testFlag = reg.test(value)
        if (!testFlag) {
          callback(new Error('请输入正整数,最多8位数'))
        } else if (this.crowdDefineForm.minMacEstimateCount && (parseInt(value) < parseInt(this.crowdDefineForm.minMacEstimateCount))) {
          callback(new Error('mac数量上限必须大于mac数量下限'))
        } else {
          callback()
        }
      } else {
        callback()
        return true
      }
    }
    const checkMinMac = (rule, value, callback) => {
      if (value) {
        const testFlag = reg.test(value)
        if (!testFlag) {
          callback(new Error('请输入正整数,最多8位数'))
        } else if (this.crowdDefineForm.maxMacEstimateCount && (parseInt(value) > parseInt(this.crowdDefineForm.maxMacEstimateCount))) {
          callback(new Error('mac数量下限必须小于mac数量上限'))
        } else {
          callback()
        }
      } else {
        callback()
        return true
      }
    }
    const checkMaxWx = (rule, value, callback) => {
      if (value) {
        const testFlag = reg.test(value)
        if (!testFlag) {
          callback(new Error('请输入正整数,最多8位数'))
        } else if (this.crowdDefineForm.minWxEstimateCount && (parseInt(value) < parseInt(this.crowdDefineForm.minWxEstimateCount))) {
          callback(new Error('微信数量上限必须大于微信数量下限'))
        } else {
          callback()
        }
      } else {
        callback()
        return true
      }
    }
    const checkMinWx = (rule, value, callback) => {
      if (value) {
        const testFlag = reg.test(value)
        if (!testFlag) {
          callback(new Error('请输入正整数,最多8位数'))
        } else if (this.crowdDefineForm.maxWxEstimateCount && (parseInt(value) > parseInt(this.crowdDefineForm.maxWxEstimateCount))) {
          callback(new Error('微信数量下限必须小于微信数量上限'))
        } else {
          callback()
        }
      } else {
        callback()
        return true
      }
    }
    return {
      // 人群类型为【普通人群】的 策略列表参数
      remoteLoading: false,
      totalPages: 0,
      remoteMethodParams: {
        pageNum: 1,
        pageSize: 30,
        keyword: ''
      },
      strategyPlatform: [],
      // -------人群类型为【普通人群】的 策略列表参数 end-------
      // 人群类型为【设备投放】的 策略列表
      bitmapRemoteLoading: false,
      bitmapTotalPages: 0,
      bitmapMethodParams: {
        pageNum: 1,
        pageSize: 30,
        keyword: ''
      },
      bitmapPushPolicyList: [],
      // --------人群类型为【设备投放】的 策略列表 - end------

      launchPlatform: [], // 投放平台
      getStrategyCrowds: [],
      title: '',
      basicLineErrorText: '',
      // 新增界面数据
      crowdForm: {
        abTest: false,
        launchCrowdId: '', // 投放ID
        launchName: '', // 投放名称
        biIds: '', // 投放平台ID
        // remark: "",
        //      dataSource: 2,
        policyIds: [],
        policyCrowdIds: '',
        // expiryDay: 7,
        autoVersion: 0,
        autoLaunchTime: undefined,
        setCalculate: false, // ，当投放平台只有消息触达时，设置账号关联相关
        crowdType: 0,
        tempCrowdId: undefined,
        packageName: '',
        saveMode: undefined,
        calIdType: ['0']
      },
      // 新增自定义人群
      crowdDefineForm: {
        launchCrowdId: undefined,
        launchName: '', // 投放名称
        biIds: '', // 投放平台ID
        crowdSql: '',
        expiryDay: 7,
        autoVersion: 0,
        calIdType: ['0'],
        proTempTag: false,
        autoLaunchTime: undefined,
        tagId: undefined,
        abTest: undefined,
        ratios: undefined,
        basicLine: undefined, // 数量基准验证用
        macInitialValue: undefined, // Mac基准值
        macAbovePer: undefined, // Mac最大阈值
        macBelowPer: 5.00, // Mac最小阈值
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
      abTestApart: undefined,
      status: undefined,
      crowdFormRules: {
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
        ],
        tempCrowdId: [
          { required: true, message: '请选择人群', trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: '请选择投放应用', trigger: 'blur' }
        ],
        calIdType: [
          { type: 'array', required: true, message: '请选择估算字段', trigger: ['change', 'blur'] }
        ]
      },
      crowdDefineFormRules: {
        launchName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        biIds: [
          { required: true, message: '请选择投放平台', trigger: 'blur' }
        ],
        crowdSql: [
          { required: true, message: '请输入SQL语句', trigger: 'blur' }
        ],
        proTempTag: [
          { required: true, message: '请选择是否生成临时标签', trigger: 'blur' }
        ],
        autoVersion: [
          { required: true, message: '请选择每天是否更新', trigger: 'blur' }
        ],
        autoLaunchTime: [
          { required: true, message: '请选择每天更新时间点', trigger: 'blur' }
        ],
        tagId: [
          { required: true, message: '请选择标签', trigger: 'blur' }
        ],
        maxMacEstimateCount: [
          { required: false, validator: checkMaxMac, trigger: 'blur' }
        ],
        maxWxEstimateCount: [
          { required: false, validator: checkMaxWx, trigger: 'blur' }
        ],
        minMacEstimateCount: [
          { required: false, validator: checkMinMac, trigger: 'blur' }
        ],
        minWxEstimateCount: [
          { required: false, validator: checkMinWx, trigger: 'blur' }
        ]
      },
      filterText: '',
      crowdData: [],
      effectTimeList: [],
      estimateItems: [],
      tagsList: [],
      formatTimeSet: undefined,
      firstTimeLoad: false,
      alphaData: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      percent: [],
      copiesItem: [],
      percentTotal: 0,
      videoSourceList: [],
      showAccountRelative: false,
      tempCrowdList: [],
      tempCrowdList2: [],
      disabledCrowdType: false,
      isTempCrowd: false,
      showEstimate: false,
      showLaunchTip: false,
      launchTip: '',
      currentLaunchRow: {},
      estimateValue: ['0'],
      accountDefine: false,
      currentLaunchId: undefined,
      islaunchDirectly: false,
      tempListFilter: {
        crowdType: 1,
        pageNum: 1,
        pageSize: 10
      },
      tempListpages: 0,
      tempListFilter2: {
        crowdType: 2,
        pageNum: 1,
        pageSize: 10
      },
      tempListpages2: 0,
      behaviorPolicyList: [], // 行为人群 - 策略列表
      behaviorCrowdList: [], // 行为人群 - 所选策略下的人群列表
      behaviorCrowdListFilter: {
        crowdType: 3,
        pageNum: 1,
        pageSize: 30
      },
      behaviorCrowdListpages: 0,
      loading: false,
      pushPackageList: []
    }
  },
  props: ['editLaunchCrowdId', 'model', 'editStatus', 'parentSource', 'showAllParent'],
  watch: {
    estimateValue: {
      handler (val) {
        this.crowdForm.calIdType = val
        // console.log('this.$refs.crowdFormItem-->', this.$refs.crowdFormItem)
        // this.$refs.crowdFormItem.$emit('el.form.change')
      },
      immediate: true
    },
    // 'crowdForm.abTest': function (val, oldVal) {
    //     // 根第一次加载的时候不判断，当值变的时候再触发
    //     if (oldVal && this.firstTimeLoad) {
    //         this.crowdForm.policyIds = val ? '' : []
    //         this.crowdData = []
    //         // this.firstTimeLoad = false
    //     }
    //     if (val && !this.firstTimeLoad) {
    //         this.crowdData = []
    //         this.crowdForm.policyIds = val ? '' : []
    //         // this.firstTimeLoad = true
    //     }
    // },
    percent (val) {
      this.percentTotal = val.reduce((prev, cur) => {
        return prev + cur
      })
    },
    'crowdDefineForm.videoSource': function (val) {
      if (val === '0') {
        this.crowdDefineForm.videoSourceIds = []
      }
    },
    'crowdForm.crowdType' () { // 切换时置空
      // 重置
      this.crowdForm.policyIds = '' // 选择策略
      this.crowdForm.policyCrowdIds = [] // 选择人群
      this.crowdForm.crowdId = '' // 大人群ID
      this.crowdData = [] // 选择人群列表
      this.crowdForm.tempCrowdId = ''
    }
  },

  methods: {
    crowdRadioChange (selectedV, list) {
      // const policyCrowdIds = selectedV.split('_')[1]
      // const obj = list.find(item => {
      //   return Number(item.crowdId) === Number(policyCrowdIds)
      // }) || {}
      this.crowdForm.saveMode = 0
    },
    crowdSelectChange (selectedV, list) {
      const obj = list.find(item => {
        return Number(item.launchCrowdId) === Number(selectedV)
      }) || {}
      this.crowdForm.saveMode = obj.isFxFullSql

      // 标签型人群 - 行为人群 需要传递以下两个参数
      if (Number(obj.isFxFullSql) === 3) {
        this.crowdForm.policyIds = obj.policyIds
        this.crowdForm.policyCrowdIds = obj.policyCrowdIds
      }

      console.log('this.crowdForm-->', this.crowdForm)
    },
    multipleSelectChange () {
      // 改变选中值后，自动收起下拉框
      this.$refs.multipleSelectRef.blur()
    },
    handePushListLoadmore () {
      if (this.remoteMethodParams.pageNum < this.totalPages) {
        this.remoteMethodParams.pageNum++ // 滚动加载翻页
        this.remoteMethod()
      }
    },
    remoteMethod (query) {
      // 是否是加载更多
      const isLoadMore = query === undefined

      // 下拉框搜索，需要重置
      if (!isLoadMore) {
        this.remoteMethodParams.pageNum = 1
        this.strategyPlatform = []
        this.remoteMethodParams.keyword = query
      }

      this.remoteLoading = true

      const params = {
        ...this.remoteMethodParams
      }

      this.$service.getPushList(params).then(res => {
        // this.filmModelTagOptions = res.row
        this.totalPages = res.pages // 总页数
        this.strategyPlatform = !isLoadMore ? res.rows : this.strategyPlatform.concat(res.rows)

        this.remoteLoading = false
      }).catch(() => {
        this.strategyPlatform = []
        this.remoteLoading = false
      })
    },

    handeBitmapPushPolicyListLoadmore () {
      if (this.bitmapMethodParams.pageNum < this.bitmapTotalPages) {
        this.bitmapMethodParams.pageNum++ // 滚动加载翻页
        this.bitmapRemoteMethod()
      }
    },

    bitmapRemoteMethod (query) {
      // 是否是加载更多
      const isLoadMore = query === undefined

      // 下拉框搜索，需要重置
      if (!isLoadMore) {
        this.bitmapMethodParams.pageNum = 1
        this.bitmapPushPolicyList = []
        this.bitmapMethodParams.keyword = query
      }

      this.bitmapRemoteLoading = true

      const params = {
        ...this.bitmapMethodParams
      }

      this.$service.getBitmapPushPolicyList(params).then(res => {
        this.bitmapTotalPages = res.pages // 总页数
        this.bitmapPushPolicyList = !isLoadMore ? res.rows : this.bitmapPushPolicyList.concat(res.rows)

        this.bitmapRemoteLoading = false
      }).catch(() => {
        this.bitmapPushPolicyList = []
        this.bitmapRemoteLoading = false
      })
    },

    getPushPackageList () {
      const parmas = {
        pageNum: 0,
        pageSize: 200
      }
      this.$service.getPushPackageList(parmas).then(res => {
        this.pushPackageList = res.rows || []
      })
    },
    // 滚动加载
    handelLoadmore () {
      const crowdType = this.crowdForm.crowdType
      if (crowdType === 1 && !this.loading) { // 临时人群
        if (this.tempListFilter.pageNum < this.tempListpages) {
          this.tempListFilter.pageNum++ // 滚动加载翻页
          this.getTempCrowdList()
        }
      } else if (crowdType === 2 && !this.loading) { // 临时人群
        console.log('this.tempListpages2', this.tempListpages2)
        console.log('this.his.tempListFilter2.pageNum', this.tempListFilter2.pageNum)
        if (this.tempListFilter2.pageNum < this.tempListpages2) {
          this.tempListFilter2.pageNum++ // 滚动加载翻页
          this.getTempCrowdList2()
        }
      } else if (crowdType === 3 && !this.loading) { // 行为人群
        if (this.behaviorCrowdListFilter.pageNum < this.behaviorCrowdListpages) {
          this.behaviorCrowdListFilter.pageNum++ // 滚动加载翻页
          this.getBehaviorCrowdList()
        }
      }
    },

    // handelBehaviorCrowdSelectChange (e, selectedV, list) {
    //   this.crowdForm.policyIds = selectedV.split('_')[0]
    //   const policyCrowdIds = selectedV.split('_')[1]
    //   // item.policyIds+'_'+item.policyCrowdIds
    //   this.crowdForm.tempCrowdId = list.find(item => {
    //     // console.log(this.crowdForm.policyIds  +  '===' + item.policyIds)
    //     // console.log(policyCrowdIds  +  '===' + item.policyCrowdIds)
    //     const a = item.policyIds == this.crowdForm.policyIds
    //     const b = item.policyCrowdIds == policyCrowdIds
    //     return a && b
    //   }).launchCrowdId
    // },
    callback () {
      this.$emit('changeStatus', true)
    },
    removeTag (policyId) {
      this.crowdForm.policyCrowdIds = this.crowdForm.policyCrowdIds.filter((v) => {
        if (v.split('_')[0] != policyId) { return v }
      })
    },
    // 【普通人群】、【设备投放】 - 获取选择的策略下的人群
    getCrowd () {
      // let policyId = null
      // if (this.crowdForm.abTest) {
      // policyId = this.crowdForm.policyIds
      // } else {
      // policyId = this.crowdForm.policyIds.join(',')
      // }
      // this.crowdForm.crowdType === 0 代表【普通人群】

      // this.$service.getStrategyCrowds({ policyIds: policyId, abTest: this.crowdForm.abTest })
      const fetchMethod = this.$service.getBitmapPushCrowdList({
        policyIds: this.crowdForm.policyIds,
        abTest: this.crowdForm.abTest,
        calIdType: this.crowdForm.calIdType.join(',')
      })

      return fetchMethod.then(data => {
        // if (this.crowdForm.abTest) {
        //   // 重置
        //   this.crowdForm.policyCrowdIds = [] // 选择人群
        //   this.crowdForm.crowdId = '' // 大人群ID

        //   const newDataForm = []
        //   const pid = Object.keys(data[0].childs)
        //   pid.forEach((item) => {
        //     newDataForm.push({ Pid: item, childs: data[0].childs[item] })
        //   })

        //   this.crowdData = newDataForm
        // } else {
        this.crowdData = data
        // }
      })
    },

    // 行为人群 - 获取选择的策略下的人群
    // getABChildByPolicyId () {
    //   let policyId = null
    //   if (this.crowdForm.abTest) {
    //     policyId = this.crowdForm.policyIds
    //   } else {
    //     policyId = this.crowdForm.policyIds.join(',')
    //   }
    //   return this.$service.getABChildByPolicyId({ policyId })
    //     .then(data => {
    //       if (this.crowdForm.abTest) {
    //         // 重置
    //         this.crowdForm.policyCrowdIds = [] // 选择人群
    //         this.crowdForm.crowdId = '' // 大人群ID

    //         const newDataForm = []
    //         const pid = Object.keys(data[0].childs)
    //         pid.forEach((item) => {
    //           newDataForm.push({ Pid: item, childs: data[0].childs[item] })
    //         })
    //         this.crowdData = newDataForm
    //       } else {
    //         this.crowdData = data
    //       }
    //     })
    //     .catch(() => {})
    // },
    // 保存
    handleSave () {
      this.islaunchDirectly = false
      this.saveNormalCrowd()
    },
    // 根据接口需要，重构参数结构
    reParamsData () {
      console.log('this.crowdForm-->', this.crowdForm)
      const crowdForm = JSON.parse(JSON.stringify(this.crowdForm))

      crowdForm.biIds = crowdForm.biIds.join(',')
      // crowdForm.calIdType = this.crowdForm.calIdType.join(',') // 投放字段
      crowdForm.calType = this.crowdForm.calIdType.join(',') // 投放字段

      // if (crowdForm.crowdType === 1 || crowdForm.crowdType === 2) { // 临时人群/本地人群
      //   crowdForm.abTest = false
      //   crowdForm.policyIds = undefined
      //   crowdForm.policyCrowdIds = undefined
      // } else { // 普通人群
      //   crowdForm.tempCrowdId = 0
      //   crowdForm.crowdType = crowdForm.saveMode
      //   // crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(',')
      //   // crowdForm.policyIds = crowdForm.policyIds

      //   // crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v) => {
      //   //   return v.split('_')[1]
      //   // }).join(',')
      //   crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.split('_')[1]
      // }

      // 策略型人群
      if (Number(crowdForm.saveMode) === 0) {
        crowdForm.tempCrowdId = 0
        crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.split('_')[1]
      } else if (Number(crowdForm.saveMode) === 3) { // 标签型人群 - 行为人群
        crowdForm.abTest = false
      } else { // 标签型人群 - 除了行为人群的其他人群
        crowdForm.abTest = false
        crowdForm.policyIds = undefined
        crowdForm.policyCrowdIds = undefined
      }

      crowdForm.crowdType = crowdForm.saveMode

      console.log('crowdForm-->', crowdForm)

      return crowdForm

      // crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(",")
      // crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v)=>{
      //     return v.split("_")[1]
      // }).join(",")
    },
    // 保存
    async saveNormalCrowd (type = '') {
      const valid = await this.$refs.crowdForm.validate()
      if (valid) {
        return new Promise((resolve, reject) => {
          // 获取接口所需参数
          const crowdForm = this.reParamsData()
          const fetchMethod = this.editLaunchCrowdId !== null && this.editLaunchCrowdId !== undefined
            ? { method: this.$service.saveEditMultiVersionCrowd, msg: '编辑成功' }
            : { method: this.$service.saveAddMultiVersionCrowd, msg: '新增成功' }

          fetchMethod.method({
            model: crowdForm.saveMode,
            data: crowdForm
          }, fetchMethod.msg).then((data) => {
            if (type === '') {
              this.callback()
            }
            resolve(data)
          })
        })
      }
      // if (this.editLaunchCrowdId !== null && this.editLaunchCrowdId !== undefined) {
      //   this.$service.saveEditMultiVersionCrowd({ model: crowdForm.saveMode, data: crowdForm }, '编辑成功').then((data) => {
      //     this.callback()
      //   })
      // } else {
      //   this.$service.saveAddMultiVersionCrowd({ model: crowdForm.saveMode, data: crowdForm }, '新增成功').then((data) => {
      //     this.callback()
      //   })
      // }
    },
    handleRule () {
      const crowdForm = JSON.parse(JSON.stringify(this.crowdDefineForm))
      let macInitialValue = crowdForm.macInitialValue
      const macBelowPer = crowdForm.macBelowPer
      let wxInitialValue = crowdForm.wxInitialValue
      const wxBelowPer = crowdForm.wxBelowPer
      macInitialValue = macInitialValue && macInitialValue.toString().replace(/,/g, '')
      wxInitialValue = wxInitialValue && wxInitialValue.toString().replace(/,/g, '')
      this.validateBasicLine(macInitialValue, macBelowPer, wxInitialValue, wxBelowPer)
    },
    validateBasicLine (macInitialValue, macBelowPer, wxInitialValue, wxBelowPer) {
      const macCondition = (macInitialValue === undefined || macInitialValue === '') && (macBelowPer === undefined || macBelowPer === '')
      const wxCondition = (wxInitialValue === undefined || wxInitialValue === '') && (wxBelowPer === undefined || wxBelowPer === '')
      if (macCondition && wxCondition) {
        this.basicLineErrorText = '请至少填写一组基准和环比阀值'
        return false
      } else if ((macInitialValue !== undefined && macInitialValue !== '') && (macBelowPer === undefined || macBelowPer === '')) {
        this.basicLineErrorText = '请把Mac数量环比低于这个选项填写完整'
        return false
      } else if ((macBelowPer !== undefined && macBelowPer !== '') && (macInitialValue === undefined || macInitialValue === '')) {
        this.basicLineErrorText = '请把Mac数量基准这个选项填写完整'
        return false
      } else if ((wxInitialValue !== undefined && wxInitialValue !== '') && (wxBelowPer === undefined || wxBelowPer === '')) {
        this.basicLineErrorText = '请把微信数量环比低于这个选项填写完整'
        return false
      } else if ((wxBelowPer !== undefined && wxBelowPer !== '') && (wxInitialValue === undefined || wxInitialValue === '')) {
        this.basicLineErrorText = '请把微信数量基准这个选项填写完整'
        return false
      } else {
        this.basicLineErrorText = ''
        return true
      }
    },

    // 取消
    cancelAdd () {
      this.$emit('goBack')
    },
    getAddList (model) {
      this.$service.getEstimateType().then((data) => {
        this.estimateItems = data
      })
      // 投放平台
      this.$service.getPushPlatform().then((data) => {
        this.launchPlatform = data || []
      })
      if (model === 1) { // 新增自定义人群
        this.$service.addMultiVersionCrowd(this.model).then(data => {
          this.launchPlatform = data.biLists
          this.effectTimeList = data.efTime.map(item => {
            return { label: item + '天', value: item }
          })
        })
        this.$service.searchTags().then(data => {
          this.tagsList = data
        })
      } else { // 新增
        // 获取人群类型为【普通人群】的 策略列表
        this.remoteMethod()

        // 获取人群类型为【设备投放】的 策略列表
        this.bitmapRemoteMethod()

        // if (this.showAllParent) {
        //   this.$service.addMyMultiVersionCrowd(this.model).then(data => {
        //     this.launchPlatform = data.biLists
        //     this.strategyPlatform = data.policies
        //     this.effectTimeList = data.efTime.map(item => {
        //       return { label: item + '天', value: item }
        //     })
        //   })
        // } else {
        //   this.$service.addMultiVersionCrowd(this.model).then(data => {
        //     this.launchPlatform = data.biLists
        //     this.strategyPlatform = data.policies
        //     this.effectTimeList = data.efTime.map(item => {
        //       return { label: item + '天', value: item }
        //     })
        //     if (data.tempCrowds) {
        //       // 行为人群列表
        //       // this.behaviorCrowdList = data.tempCrowds.filter(item => {
        //       //     return item.isFxFullSql === 3
        //       // })
        //     }
        //   })
        // }
      }
    },
    // 数组去重
    distinct (a, b) {
      const arr = a.concat(b)
      const result = []
      const obj = {}
      for (const i of arr) {
        if (!obj[i]) {
          result.push(i)
          obj[i] = 1
        }
      }
      return result
    },
    // 人群圈定 视频源枚举
    handleGetVideoList () {
      this.$service.getVideoSourceList().then(data => {
        this.videoSourceList = data
      })
    },
    handleBiIdChange (val) {
      // 改变选中值后，自动收起下拉框
      this.$refs.multipleSelectRef.blur()

      if (val) {
        if (val.join(',') === '7') {
          this.showAccountRelative = true
        } else {
          this.showAccountRelative = false
          this.crowdForm.setCalculate = false
        }
      } else {
        this.showAccountRelative = false
        this.crowdForm.setCalculate = false
      }
    },
    // 临时标签 下拉列表
    getTempCrowdList (query = '') {
      this.tempListFilter.launchName = query
      if (query !== '') { // 重置
        this.tempListFilter.pageNum = 1
        this.tempCrowdList = []
      }
      this.loading = true
      this.$service.getTempLaunchList(this.tempListFilter).then(data => {
        this.tempListpages = data.pageInfo.pages // 总页数
        this.tempCrowdList = this.tempCrowdList.concat(data.pageInfo.list)
        this.loading = false
        // this.launchStatusEnum = data.launchStatusEnum
        // this.tableData = data.pageInfo.list
        // this.totalCount = data.pageInfo.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 本地标签 下拉列表
    getTempCrowdList2 (query = '') {
      this.tempListFilter2.launchName = query
      if (query !== '') { // 重置
        this.tempListFilter2.pageNum = 1
        this.tempCrowdList2 = []
      }
      this.loading = true
      this.$service.getTempLaunchList(this.tempListFilter2).then(data => {
        this.tempListpages2 = data.pageInfo.pages // 总页数
        this.tempCrowdList2 = this.tempCrowdList2.concat(data.pageInfo.list)
        this.loading = false
        // this.launchStatusEnum = data.launchStatusEnum
        // this.tableData = data.pageInfo.list
        // this.totalCount = data.pageInfo.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 行为人群下拉列表
    getBehaviorCrowdList (query = '') {
      this.behaviorCrowdListFilter.launchName = query
      if (query !== '') { // 重置
        this.behaviorCrowdListFilter.pageNum = 1
        this.behaviorCrowdList = []
      }
      this.loading = true
      this.$service.getTempLaunchList(this.behaviorCrowdListFilter).then(data => {
        this.behaviorCrowdListpages = data.pageInfo.pages // 总页数
        this.behaviorCrowdList = query !== '' ? data.pageInfo.list : this.behaviorCrowdList.concat(data.pageInfo.list)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 行为人群 - 策略列表
    getBehaviorPolicyList () {
      this.$service.getBehaviorABPolicy().then(data => {
        this.behaviorPolicyList = data || []
      })
    },

    // 是否投放子人群
    handleAbTestChange (val) {
      // 重置
      if (val) {
        this.crowdForm.policyIds = ''
        this.crowdData = []
      } else {
        this.crowdForm.policyIds = []
        this.crowdData = []
      }

      this.crowdForm.policyCrowdIds = []
    },

    // 投放提示
    // handelLaunch () {
    //   this.islaunchDirectly = true
    //   // 临时人群/本地人群 直接投放，不展示投放提示
    //   if (this.crowdForm.crowdType === 1 || this.crowdForm.crowdType === 3) {
    //     this.handleLaunchDirectly()
    //     return
    //   }
    //   console.log('this.crowdForm==>', this.crowdForm)
    //   // let policyCrowdIds = JSON.parse(JSON.stringify(this.crowdForm.policyCrowdIds))
    //   const crowdIds = this.crowdForm.policyCrowdIds.map(item => item.split('_')[1]).join(',')
    //   // 先进行保存校验
    //   this.$refs.crowdForm.validate(valid => {
    //     if (valid) {
    //       const parmas = {
    //         crowdIds
    //       }
    //       this.$service.alertLaunch(parmas).then((data) => {
    //         this.showLaunchTip = true
    //         this.launchTip = data
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // },

    // 确认投放
    // confirmLaunch () {
    //   this.showEstimatePop()
    // },

    // 选项之间互斥
    estimateValueChange (val) {
      const arr1 = ['0', '1', '2', '3']
      const arr2 = ['5']

      // arr1 与 arr2 选中值互斥
      if (arr1.includes(val)) {
        const vals = this.crowdForm.calIdType
        const index = vals.findIndex(item => item === '5')

        if (index > -1) {
          this.crowdForm.calIdType.splice(index, 1)
        }
      } else {
        this.crowdForm.calIdType = arr2
      }

      // 选择了 ['1', '2', '3'] ，必须勾选 '0'
      if (['1', '2', '3'].includes(val)) {
        this.crowdForm.calIdType = [...new Set(['0', ...this.crowdForm.calIdType])]
      }
    },
    // 直接投放，没有投放提示
    handleLaunchDirectly () {
      // 先进行保存校验
      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          // // 投放【策略型人群】
          // if (this.crowdForm.crowdType === 4) {
          //   this.handleEstimateBitmapPush()
          // } else {
          //   // this.showEstimatePop()
          // }
          this.handleEstimate()
        } else {
          return false
        }
      })
    },

    // async handleEstimateBitmapPush () {
    //   const valid = await this.$refs.crowdForm.validate

    //   if (valid) {
    //     // 获取接口所需参数
    //     const crowdForm = this.reParamsData(this.crowdForm)
    //     // 编辑
    //     if (this.editLaunchCrowdId != null && this.editLaunchCrowdId !== undefined) {
    //       // this.$service.saveEditMultiVersionCrowd({ model: crowdForm.crowdType, data: crowdForm }, '编辑成功').then(() => {
    //       //   this.currentLaunchId = this.editLaunchCrowdId
    //       //   this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {
    //       //     this.showEstimate = false
    //       //     this.callback()
    //       //   })
    //       // })
    //     } else {
    //       this.$service.saveAddMultiVersionCrowd({ model: crowdForm.saveMode, data: crowdForm }, '新增成功').then((data) => {
    //         this.currentLaunchId = data.launchCrowdId
    //         // this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {

    //         //   this.callback()
    //         // })
    //         this.$service.bitmapPush({ launchCrowdId: this.currentLaunchId, calIdType: crowdForm.calIdType }, '投放成功').then((data) => {
    //           // this.currentLaunchId = data.launchCrowdId
    //           this.callback()
    //         })
    //       })

    //       // 新增
    //       // this.$service.bitmapPush(crowdForm, '新增成功').then((data) => {
    //       //   // this.currentLaunchId = data.launchCrowdId
    //       //   this.callback()
    //       // })
    //     }
    //   }
    // },

    async handleEstimate () {
      const valid = await this.$refs.crowdForm.validate()

      if (valid) {
        // 获取接口所需参数
        const crowdForm = this.reParamsData(this.crowdForm)
        // 先保存，再投放
        const data = await this.saveNormalCrowd('push')
        // 是否为编辑状态
        this.currentLaunchId = this.editLaunchCrowdId !== null && this.editLaunchCrowdId !== undefined
          ? this.editLaunchCrowdId
          : data.launchCrowdId

        const fetchMethod = Number(crowdForm.crowdType) === 0
          ? this.$service.bitmapPush
          : this.$service.LaunchMultiVersionCrowd

        fetchMethod({ launchCrowdId: this.currentLaunchId, calIdType: crowdForm.calIdType }, '投放成功').then(() => {
          this.callback()
        })

        // this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: crowdForm.calIdType }, '投放成功').then(() => {
        //   this.callback()
        // })
        // if (this.editLaunchCrowdId !== null && this.editLaunchCrowdId !== undefined) {
        //   this.$service.saveEditMultiVersionCrowd({ model: crowdForm.saveMode, data: crowdForm }, '编辑成功').then(() => {
        //     this.currentLaunchId = this.editLaunchCrowdId
        //     this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {
        //       this.showEstimate = false
        //       this.callback()
        //       // }
        //     })
        //   })
        // } else {
        //   this.$service.saveAddMultiVersionCrowd({ model: crowdForm.saveMode, data: crowdForm }, '新增成功').then((data) => {
        //     this.currentLaunchId = data.launchCrowdId
        //     this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {
        //       this.showEstimate = false
        //       this.callback()
        //       // }
        //     })
        //   })
        // }
      }
    },
    // async setEdit () {
    //   // 编辑
    //   if (this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined) {
    //     this.title = '编辑'
    //     this.$service.editMultiVersionCrowd(this.editLaunchCrowdId).then(async data => {
    //       const row = data.launchCrowd
    //       const abTestRatio = data.ratio || {}
    //       // 当 row.tempCrowdId=0，就是普通人群
    //       this.isTempCrowd = !row.tempCrowdId
    //       // row.crowdType不为null，则 row.crowdType == 1 是临时人群
    //       // row.crowdType为null，当row.tempCrowdId=0，就是普通人群
    //       // this.isTempCrowd = (row.crowdType && row.crowdType === 1) ? true : !row.tempCrowdId
    //       if (Number(this.model) === 1 && !row.tempCrowdId) { // 自定义人群
    //       // const biIds = this.distinct(data.launchCrowdBiIds,[])
    //         const biIds = data.launchCrowdBiIds
    //         const { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = row
    //         this.crowdDefineForm = {
    //           launchCrowdId: row.launchCrowdId,
    //           launchName: row.launchName,
    //           biIds: biIds,
    //           crowdSql: row.crowdSql,
    //           expiryDay: row.expiryDay,
    //           autoVersion: row.autoVersion,
    //           calType: row.calType.split(','),
    //           proTempTag: row.proTempTag,
    //           autoLaunchTime: row.autoLaunchTime,
    //           tagId: row.tagId,
    //           abTest: row.abTest,
    //           ratios: abTestRatio,
    //           macInitialValue: macInitialValue === null ? undefined : macInitialValue, // Mac基准值
    //           macAbovePer: macAbovePer === null ? undefined : macAbovePer, // Mac最大阈值
    //           macBelowPer: macBelowPer === null ? undefined : macBelowPer, // Mac最小阈值
    //           wxInitialValue: wxInitialValue === null ? undefined : wxInitialValue, // 微信基准值
    //           wxAbovePer: wxAbovePer === null ? undefined : wxAbovePer, // 微信最大阈值
    //           wxBelowPer: wxBelowPer === null ? undefined : wxBelowPer, // 微信最小阈值
    //           // minMacEstimateCount: row.minMacEstimateCount,
    //           // maxMacEstimateCount: row.maxMacEstimateCount,
    //           // minWxEstimateCount: row.minWxEstimateCount,
    //           // maxWxEstimateCount: row.maxWxEstimateCount,
    //           videoSource: row.videoSource === null ? '0' : '1',
    //           videoSourceIds: row.videoSource === null ? [] : row.videoSource.split(',')
    //         }
    //         if (row.abTest) {
    //           this.abTestApart = Object.keys(abTestRatio).length
    //           const a = []
    //           Object.keys(abTestRatio).forEach(item => {
    //             a.push(abTestRatio[item])
    //           })
    //           const arr = []
    //           for (let i = 0; i < this.abTestApart; i++) {
    //             arr.push(i)
    //           }
    //           this.copiesItem = arr
    //           this.percent = a
    //         }
    //         this.status = this.editStatus
    //       } else {
    //         // *****************************************************
    //         this.launchPlatform = data.biLists
    //         // this.strategyPlatform = data.policies
    //         this.crowdForm.launchCrowdId = row.launchCrowdId
    //         this.crowdForm.dmpCrowdId = row.dmpCrowdId
    //         this.crowdForm.launchName = row.launchName
    //         this.crowdForm.biIds = data.launchCrowdBiIds
    //         // this.crowdForm.crowdType = row.tempCrowdId ? 1 : 0
    //         this.crowdForm.crowdType = row.crowdType ? row.crowdType : (row.tempCrowdId ? 1 : 0)
    //         this.disabledCrowdType = true
    //         // this.crowdForm.remark = row.remark
    //         // this.crowdForm.dataSource = row.dataSource
    //         // this.crowdForm.expiryDay = row.expiryDay
    //         this.crowdForm.autoVersion = row.autoVersion
    //         this.crowdForm.autoLaunchTime = row.autoLaunchTime
    //         this.crowdForm.abTest = row.abTest
    //         if (this.crowdForm.biIds.join(',') === '7') {
    //           this.showAccountRelative = true
    //         }
    //         this.crowdForm.packageName = Number(row.packageName) // 投放应用
    //         this.crowdForm.setCalculate = row.setCalculate
    //         this.status = this.editStatus
    //         // if (row.tempCrowdId) {
    //         if (this.crowdForm.crowdType === 1) { // 临时人群
    //           this.crowdForm.tempCrowdId = row.tempCrowdId
    //           this.crowdForm.policyIds = undefined
    //           this.crowdForm.policyCrowdIds = undefined
    //         } else if (this.crowdForm.crowdType === 3) { // 行为人群
    //         // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
    //           this.$nextTick(async () => {
    //             this.crowdForm.tempCrowdId = row.tempCrowdId
    //             this.crowdForm.policyIds = row.policyIds
    //             // :label="v.policyId+'_'+item.crowdId+'_'+item.pid"
    //             this.crowdForm.policyCrowdIds.push(`${row.policyIds}_${row.policyCrowdIds}`)
    //           })
    //         } else if (this.crowdForm.crowdType === 0) { // 普通人群
    //           this.crowdForm.tempCrowdId = undefined

    //           // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
    //           this.$nextTick(async () => {
    //             this.crowdForm.policyIds = row.abTest ? row.policyIds : row.policyIds.split(',')
    //             // 等待获取所选策略下的人群列表
    //             await this.getCrowd()
    //             data.respcl && data.respcl.forEach(element => {
    //               element.childs.forEach(v => {
    //                 if (v.choosed) { this.crowdForm.policyCrowdIds.push(`${element.policyId}_${v.crowdId}`) }
    //                 console.log('this.crowdForm.policyCrowdIds===', this.crowdForm.policyCrowdIds)
    //               })
    //             })
    //           })
    //         } else if (this.crowdForm.crowdType === 9) {
    //           // 行为人群 + 投放子人群 的 crowdType 为 9
    //           this.crowdForm.crowdType = 3
    //           this.crowdForm.tempCrowdId = undefined
    //           console.log('row===', row.policyIds)

    //           // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
    //           this.$nextTick(async () => {
    //             this.crowdForm.policyIds = row.policyIds
    //             // 等待获取所选策略下的人群列表
    //             await this.getABChildByPolicyId()

    //             data.respcl && data.respcl.forEach(element => {
    //               element.childs.forEach((v, index) => {
    //                 // item.policyId+'_'+item.crowdId+'_'+item.pid
    //                 if (v.choosed) { this.crowdForm.policyCrowdIds.push(`${element.policyId}_${v.crowdId}_${v.pid}`) }
    //               })
    //             })
    //           })
    //           // data.respcl.forEach(element => {
    //           //   element.childs.forEach(v => {
    //           //     if (v.choosed) { this.crowdForm.policyCrowdIds.push(element.policyId + '_' + v.crowdId) }
    //           //   })
    //           // })
    //         }
    //         // ***********************************************************
    //       // this.firstTimeLoad = true
    //       }
    //     })
    //   } else {
    //     this.title = Number(this.model) === 1 ? '新增自定义人群' : '新增'
    //   }
    // }
    async setEdit () {
      const isEdit = this.editLaunchCrowdId !== null && this.editLaunchCrowdId !== undefined
      // 编辑
      if (isEdit) {
        this.title = '编辑'
        const data = await this.$service.editMultiVersionCrowd(this.editLaunchCrowdId)
        // this.$service.editMultiVersionCrowd(this.editLaunchCrowdId).then(async data => {
        const row = data.launchCrowd

        this.launchPlatform = data.biLists
        this.crowdForm.biIds = data.launchCrowdBiIds
        // this.strategyPlatform = data.policies
        this.crowdForm.launchCrowdId = row.launchCrowdId
        this.crowdForm.launchName = row.launchName
        // 人群类型 crowdType   0 - 策略型人群   其他 - 标签型人群
        this.crowdForm.crowdType = row.isFxFullSql === 0 ? 0 : row.isFxFullSql

        this.disabledCrowdType = true

        this.crowdForm.autoVersion = row.autoVersion
        this.crowdForm.autoLaunchTime = row.autoLaunchTime
        this.crowdForm.abTest = row.abTest

        if (this.crowdForm.biIds.join(',') === '7') {
          this.showAccountRelative = true
        }

        this.crowdForm.packageName = Number(row.packageName) // 投放应用
        this.crowdForm.setCalculate = row.setCalculate

        this.status = this.editStatus
        // if (row.tempCrowdId) {
        if (this.crowdForm.crowdType === 0) { // 普通人群
          this.crowdForm.tempCrowdId = undefined

          // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
          this.$nextTick(async () => {
            this.crowdForm.policyIds = row.policyIds
            // 等待获取所选策略下的人群列表
            await this.getCrowd()
            data.respcl && data.respcl.forEach(element => {
              element.childs.forEach(v => {
                if (v.choosed) {
                  this.crowdForm.policyCrowdIds = `${element.policyId}_${v.crowdId}`
                }
                // console.log('this.crowdForm.policyCrowdIds===', this.crowdForm.policyCrowdIds)
              })
            })
            // console.log('this.crowdForm===', this.crowdForm)
          })
        } else if (this.crowdForm.crowdType === 3) { // 【标签型人群】 - 行为人群
          // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
          this.$nextTick(async () => {
            this.crowdForm.tempCrowdId = row.tempCrowdId
            this.crowdForm.policyIds = row.policyIds
            // :label="v.policyId+'_'+item.crowdId+'_'+item.pid"
            this.crowdForm.policyCrowdIds.push(`${row.policyIds}_${row.policyCrowdIds}`)
          })
        } else { // 【标签型人群】 - 其他
          this.crowdForm.tempCrowdId = row.tempCrowdId
          this.crowdForm.policyIds = undefined
          this.crowdForm.policyCrowdIds = undefined
        }
      } else {
        this.title = '新增'
      }
    }
  },

  created () {
    this.tempCrowdList = []
    this.tempListpages = 0

    this.tempCrowdList2 = []
    this.tempListpages2 = 0

    this.setEdit() // 初始化编辑数据

    this.getAddList(this.model) // 普通人群策略列表
    this.getTempCrowdList() // 临时人群列表
    this.getTempCrowdList2() // 本地人群列表
    this.getBehaviorPolicyList() // 行为人群 - 策略列表
    this.getBehaviorCrowdList() // 行为人群 - 人群列表
    this.handleGetVideoList() // 人群圈定 视频源枚举
    this.getPushPackageList() // 获取pushAPP接口
  }
}
</script>
<style lang="stylus" scoped>
  .basic-line
    border 1px dashed #ccc
    position relative
    padding-top 10px
    .basic-line-error
      margin-left 35px
      margin-bottom 10px
      color red
  .horizontal-line
    display flex
  .multipleSelect
      >>>.el-select
          width: 100%
  .add
      border: 1px solid #ebeef5
      padding: 20px
      border-radius: 4px
  .title
      font-size: 18px
      margin-bottom: 30px
  .footer
      display: flex
      justify-content: flex-end
  .inline-block
      display inline-block
  .one-line
      position relative
      span
        color #c3bcbc
        position absolute
        left 0px
        top 30px
  .base-line
    width 180px
  .ratio
    width 230px
  .form-width
    width 60%
.tip
  color: #999;
  margin: 20px 0 0 0;
</style>
