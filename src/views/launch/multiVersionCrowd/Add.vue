<template>
    <div class="add">
        <el-row>
            <el-col :span="24">
                <div class="title">{{title}}</div>
            </el-col>
        </el-row>
        <!--新增编辑界面-->
        <!--新增自定义人群-->
        <div v-if="model == 1 && isTempCrowd">
            <el-row :gutter="40" >
                <el-col :span="24">
                    <el-form :model="crowdDefineForm" :rules="crowdDefineFormRules" ref="crowdDefineForm" label-width="140px">
                        <el-form-item label="人群名称" prop="launchName">
                            <el-input size="small"
                                      v-model="crowdDefineForm.launchName"
                                      :disabled="status!==undefined && (status === 2 || status === 3)"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="SQL语句" prop="crowdSql">
                            <el-input type="textarea"
                                      placeholder="请输入生成临时人群的sql语句"
                                      :disabled="status!==undefined && (status === 2 || status === 3)"
                                      v-model="crowdDefineForm.crowdSql">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="投放平台" class="multipleSelect" prop="biIds">
                            <el-select v-model="crowdDefineForm.biIds" multiple placeholder="请选择投放平台">
                                <el-option
                                        v-for="(item,index) in launchPlatform"
                                        :key="index"
                                        :label="item.biName"
                                        :value="item.biId+''"
                                >
                                    <!-- {{item.biName}} -->
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据有效期" prop="expiryDay">
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
                        </el-form-item>
                        <div class="horizontal-line">
                        <el-form-item label="是否生成临时标签" prop="proTempTag">
                            <el-radio-group v-model="crowdDefineForm.proTempTag">
                                <el-radio :label="false">否</el-radio>
                                <el-radio :label="true">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择标签" prop="tagId" v-if="crowdDefineForm.proTempTag === true">
                            <el-select
                                    v-model="crowdDefineForm.tagId"
                                    filterable
                                    class="select-tag"
                                    :disabled="status!==undefined && (status === 2 || status === 3)"
                            >
                                <el-option
                                    v-for="item in tagsList"
                                    :key="item.tagId"
                                    :label="item.tagName"
                                    :value="item.tagId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </div>
                            <div class="horizontal-line">
                        <el-form-item label="每天是否更新" prop="autoVersion">
                           <el-radio-group v-model="crowdDefineForm.autoVersion"  :disabled="status!==undefined && (status === 2 || status === 3)">
                                <el-radio :label="0">否</el-radio>
                                <el-radio :label="1">是</el-radio>
                            </el-radio-group>
                            <!-- <el-select
                                    v-model="crowdDefineForm.autoVersion"
                                    :disabled="status!==undefined && (status === 2 || status === 3)"
                            >
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select> -->
                        </el-form-item>
                        <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdDefineForm.autoVersion === 1">
                            <el-time-picker
                                    v-model="crowdDefineForm.autoLaunchTime"
                                    value-format="HH:mm:ss"
                                    :disabled="status!==undefined && (status === 2 || status === 3)"
                            ></el-time-picker>
                        </el-form-item>
                            </div>
                            <div class="basic-line" v-if="crowdDefineForm.autoVersion === 1">
                            <el-form-item label="Mac数量基准" class="one-line" >
                                  <el-form-item label="" prop="macInitialValue" class="inline-block  base-line">
                                    <cc-input-thousands-int
                                      v-model="crowdDefineForm.macInitialValue"
                                      ref="inputThousandsInt"
                                      @change="handleRule"
                                      >
                                    </cc-input-thousands-int>
                                  </el-form-item>
                                  <el-form-item label="环比低于" label-width="100px" prop="macBelowPer" class="inline-block ratio">
                                    <el-input-number v-model="crowdDefineForm.macBelowPer" :precision="2" @change="handleRule" :min="1" :max="100"></el-input-number>
                                  </el-form-item>&nbsp;&nbsp;%，则告警
                                  <el-form-item label="环比高于" label-width="100px"  prop="macAbovePer" class="inline-block ratio">
                                    <el-input-number v-model="crowdDefineForm.macAbovePer" :precision="2"  :min="1" :max="100"></el-input-number>
                                  </el-form-item>&nbsp;&nbsp;%，则告警
                                  <span>请至少填写一组基准和环比阀值</span>
                              </el-form-item>
                              <el-form-item label="微信数量基准" class="one-line">
                                  <el-form-item label="" prop="wxInitialValue" class="inline-block  base-line">
                                    <cc-input-thousands-int
                                      v-model="crowdDefineForm.wxInitialValue"
                                      >
                                    </cc-input-thousands-int>
                                  </el-form-item>
                                  <el-form-item label="环比低于" label-width="100px" prop="wxBelowPer" class="inline-block ratio">
                                      <el-input-number v-model="crowdDefineForm.wxBelowPer" :precision="2" @change="handleRule" :min="1" :max="100"></el-input-number>
                                  </el-form-item>&nbsp;&nbsp;%，则告警
                                  <el-form-item label="环比高于" label-width="100px"  prop="wxAbovePer" class="inline-block ratio">
                                      <el-input-number v-model="crowdDefineForm.wxAbovePer" :precision="2" @change="handleRule" :min="1" :max="100"></el-input-number>

                                  </el-form-item>&nbsp;&nbsp;%，则告警
                                    <span>请至少填写一组基准和环比阀值</span>
                              </el-form-item>
                              <div class="basic-line-error">{{basicLineErrorText}}</div>

                            </div>
                        <!-- <el-form-item label="微信数量" v-if="crowdDefineForm.autoVersion === 1">
                            <el-form-item label="mac数量不少于" prop="minMacEstimateCount" class="inline-block">
                                <el-input v-model="crowdDefineForm.minMacEstimateCount" type="number" placeholder="请输入mac数量的最小值"></el-input>
                            </el-form-item>
                            <el-form-item label="微信数量不少于" prop="minWxEstimateCount" class="inline-block">
                                <el-input v-model="crowdDefineForm.minWxEstimateCount" type="number" placeholder="请输入微信数量的最小值"></el-input>
                            </el-form-item>
                        </el-form-item> -->
                        <!-- <el-form-item label="人群数量上限" v-if="crowdDefineForm.autoVersion === 1">
                            <el-form-item label="mac数量不超过" prop="maxMacEstimateCount" class="inline-block">
                                <el-input v-model="crowdDefineForm.maxMacEstimateCount" type="number" placeholder="请输入mac数量的最大值"></el-input>
                            </el-form-item>
                            <el-form-item label="微信数量不超过" prop="maxWxEstimateCount" class="inline-block">
                                <el-input v-model="crowdDefineForm.maxWxEstimateCount" type="number" placeholder="请输入微信数量的最大值"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="人群数量下限" v-if="crowdDefineForm.autoVersion === 1">
                            <el-form-item label="mac数量不少于" prop="minMacEstimateCount" class="inline-block">
                                <el-input v-model="crowdDefineForm.minMacEstimateCount" type="number" placeholder="请输入mac数量的最小值"></el-input>
                            </el-form-item>
                            <el-form-item label="微信数量不少于" prop="minWxEstimateCount" class="inline-block">
                                <el-input v-model="crowdDefineForm.minWxEstimateCount" type="number" placeholder="请输入微信数量的最小值"></el-input>
                            </el-form-item>
                        </el-form-item> -->
                        <el-form-item label="数据类型" prop="calType">
                            <el-checkbox-group v-model="crowdDefineForm.calType" :disabled="status!==undefined && (status === 2 || status === 3)">
                                <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" :disabled="index==0">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <div style="width: 80%" v-if="editLaunchCrowdId!=null && editLaunchCrowdId != undefined && crowdDefineForm.abTest">
                        <el-form-item label="人群划分份数">
                            <el-input disabled v-model="abTestApart" style="width: 10%;margin-right: 10px"></el-input>份
                        </el-form-item>
                        <el-form-item label="各人群占比">
                            <div class="block" v-for="(item,index) in copiesItem" :key="index">
                                <span>人群_{{alphaData[index]}}<span class="show-percent">{{percent[index]}}%</span></span>
                                <el-slider :disabled="status === 2 || status === 3" v-model="percent[index]" :key="item"></el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item label="比例总和：">{{percentTotal}}</el-form-item>
                        </div>
                        <el-form-item label="该人群所属的视频源">
                            <el-radio-group v-model="crowdDefineForm.videoSource">
                                <el-radio label="0">不区分</el-radio>
                                <el-radio label="1">区分</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="" v-show="crowdDefineForm.videoSource === '1'">
                            <el-checkbox-group v-model="crowdDefineForm.videoSourceIds">
                                <el-checkbox v-for="(item,index) in videoSourceList" :key="index" :label="item.tagValueId">{{item.tagValue}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="footer">
                <el-button @click="cancelAdd">返回</el-button>
                <el-button type="primary" @click="addSubmit">保存</el-button>
            </div>
        </div>
        <!--新增投放-->
        <div v-else>
            <el-form :model="crowdForm" :rules="crowdFormRules" ref="crowdForm" label-width="100px">
                <el-form-item label="投放名称" prop="launchName" class="form-width">
                    <el-input size="small"
                              v-model="crowdForm.launchName"
                              placeholder="投放名称"
                              :disabled="status!==undefined && (status === 2 || status === 3)"
                    ></el-input>
                </el-form-item>
                <el-form-item label="投放平台" class="multipleSelect" prop="biIds">
                    <el-select
                            v-model="crowdForm.biIds"
                            @change="handleBiIdChange"
                            multiple
                            placeholder="请选择投放平台"
                            style="width: 56%"
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
                            style="margin-left: 20px">
                        账号关联去重
                    </el-checkbox>
                </el-form-item>
                <!--<el-form-item label="数据来源" prop="dataSource" class="form-width">-->
                    <!--<input type="hidden" value="2" v-model="crowdForm.dataSource">-->
                    <!--<el-input size="small" readonly value="大数据"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="备注" prop="remark" class="form-width">-->
                    <!--<el-input size="small" v-model="crowdForm.remark"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="是否做abTest" class="form-width" v-if="!crowdForm.crowdType">
                    <el-radio-group v-model="crowdForm.abTest">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择人群类型" class="form-width">
                    <el-radio-group
                            v-model="crowdForm.crowdType"
                            :disabled="disabledCrowdType"
                    >
                        <el-radio :label="false">普通人群</el-radio>
                        <el-radio :label="true">临时人群</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        v-if="!crowdForm.crowdType"
                        label="选择策略"
                        prop="policyIds"
                        class="multipleSelect form-width"
                >
                    <el-select
                            filterable
                            v-model="crowdForm.policyIds"
                            :key="crowdForm.abTest"
                            :multiple="!crowdForm.abTest"
                            placeholder="请选择策略"
                            @change="getCrowd"
                            @remove-tag="removeTag"
                            :disabled="status!==undefined && (status === 2 || status === 3)"
                    >
                        <el-option
                                v-for="item in strategyPlatform"
                                :key="item.policyId+''"
                                :label="item.policyName"
                                :value="item.policyId+''"
                        >{{item.policyName}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        label="选择人群"
                        prop="policyCrowdIds"
                        v-if="!crowdForm.crowdType"
                >
                    <div v-if="!crowdForm.abTest">
                        <el-form-item v-for="(v,index) in crowdData" :label="v.policyName" :key="v.policyId+'_'+index">
                            <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">
                                <el-checkbox
                                        v-for="item in v.childs"
                                        :label="v.policyId+'_'+item.crowdId"
                                        :key="item.crowdId+''"
                                        :disabled="item.canLaunch === false"
                                >{{item.crowdName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item v-for="(v,index) in crowdData" :label="v.Pid" :key="index">
                            <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">
                                <el-checkbox
                                        v-for="item in v.childs"
                                        :label="item.policyId+'_'+item.crowdId"
                                        :key="item.crowdId+''"
                                        :disabled="item.canLaunch === false"
                                >{{item.crowdName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                </el-form-item>
                <!-- 选择临时人群 -->
                <el-form-item
                        label="选择人群"
                        prop="tempCrowdId"
                        v-if="crowdForm.crowdType"
                >
                    <el-select v-model="crowdForm.tempCrowdId">
                        <el-option
                                v-for="item in tempCrowdList"
                                :key="item.launchCrowdId+''"
                                :label="item.launchName"
                                :value="item.launchCrowdId"
                        >{{item.launchName}}
                        </el-option>
                    </el-select>
                    <!--<div v-if="!crowdForm.abTest">-->
                        <!--<el-form-item v-for="(v,index) in crowdData" :label="v.policyName" :key="v.policyId+'_'+index">-->
                            <!--<el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">-->
                                <!--<el-checkbox-->
                                        <!--v-for="item in v.childs"-->
                                        <!--:label="v.policyId+'_'+item.crowdId"-->
                                        <!--:key="item.crowdId+''"-->
                                        <!--:disabled="item.canLaunch === false"-->
                                <!--&gt;{{item.crowdName}}-->
                                <!--</el-checkbox>-->
                            <!--</el-checkbox-group>-->
                        <!--</el-form-item>-->
                    <!--</div>-->
                    <!--<div v-else>-->
                        <!--<el-form-item v-for="(v,index) in crowdData" :label="v.Pid" :key="index">-->
                            <!--<el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">-->
                                <!--<el-checkbox-->
                                        <!--v-for="item in v.childs"-->
                                        <!--:label="item.policyId+'_'+item.crowdId"-->
                                        <!--:key="item.crowdId+''"-->
                                        <!--:disabled="item.canLaunch === false"-->
                                <!--&gt;{{item.crowdName}}-->
                                <!--</el-checkbox>-->
                            <!--</el-checkbox-group>-->
                        <!--</el-form-item>-->
                    <!--</div>-->
                </el-form-item>
                <!--<el-form-item label="数据有效期" prop="expiryDay" class="form-width">-->
                    <!--<el-select-->
                            <!--v-model="crowdForm.expiryDay"-->
                            <!--:disabled="status!==undefined && (status === 2 || status === 3)"-->
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
                <el-form-item label="每天是否更新" prop="autoVersion" class="form-width">
                    <el-select
                            v-model="crowdForm.autoVersion"
                            :disabled="status!==undefined && (status === 2 || status === 3)"
                    >
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdForm.autoVersion === 1" class="form-width">
                    <el-time-picker
                            v-model="crowdForm.autoLaunchTime"
                            value-format="HH:mm:ss"
                            :disabled="status!==undefined && (status === 2 || status === 3)"
                    ></el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
                <el-button @click="cancelAdd">返回</el-button>
                <el-button type="primary" @click="addSubmit">保存</el-button>
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
        data() {
            // 正整数数字校验
            const reg = /^[1-9][0-9]{0,7}$/
            var checkMaxMac = (rule, value, callback) => {
                if (value) {
                    const testFlag = reg.test(value)
                    if (!testFlag) {
                        callback(new Error('请输入正整数,最多8位数'))
                    } else if (this.crowdDefineForm.minMacEstimateCount && (parseInt(value) < parseInt(this.crowdDefineForm.minMacEstimateCount))) {
                        callback(new Error('mac数量上限必须大于mac数量下限'))
                    }
                    else {
                        callback()
                    }
                } else {
                    callback()
                    return true
                }
            };
            var checkMinMac = (rule, value, callback) => {
                if (value) {
                    const testFlag = reg.test(value)
                    if (!testFlag) {
                        callback(new Error('请输入正整数,最多8位数'))
                    } else if (this.crowdDefineForm.maxMacEstimateCount && (parseInt(value) > parseInt(this.crowdDefineForm.maxMacEstimateCount))) {
                        callback(new Error('mac数量下限必须小于mac数量上限'))
                    }
                    else {
                        callback()
                    }
                } else {
                    callback()
                    return true
                }
            };
            var checkMaxWx = (rule, value, callback) => {
                if (value) {
                    const testFlag = reg.test(value)
                    if (!testFlag) {
                        callback(new Error('请输入正整数,最多8位数'))
                    } else if (this.crowdDefineForm.minWxEstimateCount && (parseInt(value) < parseInt(this.crowdDefineForm.minWxEstimateCount))) {
                        callback(new Error('微信数量上限必须大于微信数量下限'))
                    }
                    else {
                        callback()
                    }
                } else {
                    callback()
                    return true
                }
            };
            var checkMinWx = (rule, value, callback) => {
                if (value) {
                    const testFlag = reg.test(value)
                    if (!testFlag) {
                        callback(new Error('请输入正整数,最多8位数'))
                    } else if (this.crowdDefineForm.maxWxEstimateCount && (parseInt(value) > parseInt(this.crowdDefineForm.maxWxEstimateCount))) {
                        callback(new Error('微信数量下限必须小于微信数量上限'))
                    }
                    else {
                        callback()
                    }
                } else {
                    callback()
                    return true
                }
            };
            return {
                // 表格当前页数据
                strategyPlatform: [],
                launchPlatform: [],
                getStrategyCrowds: [],
                title: "",
                basicLineErrorText: '',
                // 新增界面数据
                crowdForm: {
                    abTest: false,
                    launchCrowdId: "", //投放ID
                    launchName: "", //投放名称
                    biIds: "", //投放平台ID
                    // remark: "",
                    //      dataSource: 2,
                    policyIds: [],
                    policyCrowdIds: [],
                    // expiryDay: 7,
                    autoVersion: 0,
                    autoLaunchTime: undefined,
                    setCalculate: false, //，当投放平台只有消息触达时，设置账号关联相关
                    crowdType: false,
                    tempCrowdId: undefined
                },
                // 新增自定义人群
                crowdDefineForm: {
                    launchCrowdId: undefined,
                    launchName: "", //投放名称
                    biIds: "", //投放平台ID
                    crowdSql: '',
                    expiryDay: 7,
                    autoVersion: 0,
                    calType: ['0'],
                    proTempTag: false,
                    autoLaunchTime: undefined,
                    tagId: undefined,
                    abTest: undefined,
                    ratios: undefined,
                    basicLine: undefined, // 数量基准验证用
                    macInitialValue: undefined, //Mac基准值
                    macAbovePer: undefined, //Mac最大阈值
                    macBelowPer: 5.00, //Mac最小阈值
                    wxInitialValue: undefined, //微信基准值
                    wxAbovePer: undefined, //微信最大阈值
                    wxBelowPer: undefined, //微信最小阈值
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
                        { required: true, message: "请输入投放名称", trigger: "blur" }
                    ],
                    biIds: [{ required: true, message: "请选择投放平台", trigger: "blur" }],
                    policyIds: [
                        { required: true, message: "请选择策略平台", trigger: "blur" }
                    ],
                    policyCrowdIds: [
                        { required: true, message: "请选择人群", trigger: "blur" }
                    ],
                    autoLaunchTime: [
                        { required: true, message: "请选择每天更新时间点", trigger: "blur" }
                    ],
                    tempCrowdId: [
                        { required: true, message: "请选择人群", trigger: "blur" }
                    ]
                },
                crowdDefineFormRules: {
                    launchName: [
                        { required: true, message: "请输入人群名称", trigger: "blur" }
                    ],
                    biIds: [
                        { required: true, message: "请选择投放平台", trigger: "blur" }
                    ],
                    crowdSql: [
                        { required: true, message: "请输入SQL语句", trigger: "blur" }
                    ],
                    proTempTag: [
                        { required: true, message: "请选择是否生成临时标签", trigger: "blur" }
                    ],
                    autoVersion: [
                        { required: true, message: "请选择每天是否更新", trigger: "blur" }
                    ],
                    autoLaunchTime: [
                        { required: true, message: "请选择每天更新时间点", trigger: "blur" }
                    ],
                    tagId: [
                        { required: true, message: "请选择标签", trigger: "blur" }
                    ],
                    maxMacEstimateCount: [
                        { required: false,validator: checkMaxMac, trigger: "blur"}
                    ],
                    maxWxEstimateCount: [
                        { required: false,validator: checkMaxWx, trigger: "blur"}
                    ],
                    minMacEstimateCount: [
                        { required: false,validator: checkMinMac, trigger: "blur"}
                    ],
                    minWxEstimateCount: [
                        { required: false,validator: checkMinWx, trigger: "blur"}
                    ]
                },
                filterText: "",
                crowdData: [],
                effectTimeList: [],
                estimateItems: [],
                tagsList: [],
                formatTimeSet: undefined,
                firstTimeLoad: false,
                alphaData: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
                percent: [],
                copiesItem: [],
                percentTotal: 0,
                videoSourceList: [],
                showAccountRelative: false,
                tempCrowdList: [],
                disabledCrowdType: false,
                isTempCrowd: false
            }
        },
        props: ["editLaunchCrowdId", "model","editStatus","parentSource"],
        watch: {
            'crowdForm.abTest': function (val, oldVal) {
                // 根第一次加载的时候不判断，当值变的时候再触发
                if (oldVal && this.firstTimeLoad) {
                    this.crowdForm.policyIds = val ? '' : []
                    this.crowdData = []
                    this.firstTimeLoad = false
                }
                if (val && !this.firstTimeLoad) {
                    this.crowdData = []
                    this.crowdForm.policyIds = val ? '' : []
                    this.firstTimeLoad = true
                }
            },
            percent(val) {
                this.percentTotal = val.reduce((prev ,cur) => {
                    return prev + cur
                })
            },
            'crowdDefineForm.videoSource': function (val) {
                if (val === '0') {
                    this.crowdDefineForm.videoSourceIds = []
                }
            }
        },
        created() {
            this.getTempCrowdList()
            this.getAddList(this.model)
            this.handleGetVideoList()
            if (this.editLaunchCrowdId!=null&& this.editLaunchCrowdId != undefined) {
                this.title = "编辑"
                this.$service.editMultiVersionCrowd(this.editLaunchCrowdId).then(data => {
                    let row = data.launchCrowd
                    let abTestRatio = data.ratio || {}
                    // 当row.tempCrowdId=0，就是普通人群
                    this.isTempCrowd = !row.tempCrowdId
                    if (this.model == 1 && !row.tempCrowdId) {
                            // const biIds = this.distinct(data.launchCrowdBiIds,[])
                            const biIds = data.launchCrowdBiIds
                            let { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = row
                            this.crowdDefineForm = {
                                launchCrowdId: row.launchCrowdId,
                                launchName: row.launchName,
                                biIds: biIds,
                                crowdSql: row.crowdSql,
                                expiryDay: row.expiryDay,
                                autoVersion: row.autoVersion,
                                calType: row.calType.split(","),
                                proTempTag: row.proTempTag,
                                autoLaunchTime: row.autoLaunchTime,
                                tagId: row.tagId,
                                abTest: row.abTest,
                                ratios: abTestRatio,
                                macInitialValue: macInitialValue === null ? undefined : macInitialValue, //Mac基准值
                                macAbovePer: macAbovePer === null ? undefined : macAbovePer, //Mac最大阈值
                                macBelowPer: macBelowPer === null ? undefined : macBelowPer, //Mac最小阈值
                                wxInitialValue: wxInitialValue === null ? undefined : wxInitialValue, //微信基准值
                                wxAbovePer: wxAbovePer === null ? undefined : wxAbovePer, //微信最大阈值
                                wxBelowPer: wxBelowPer === null ? undefined : wxBelowPer, //微信最小阈值
                                // minMacEstimateCount: row.minMacEstimateCount,
                                // maxMacEstimateCount: row.maxMacEstimateCount,
                                // minWxEstimateCount: row.minWxEstimateCount,
                                // maxWxEstimateCount: row.maxWxEstimateCount,
                                videoSource: row.videoSource === null ? '0' : '1',
                                videoSourceIds: row.videoSource === null ? [] : row.videoSource.split(",")
                            }
                            if (row.abTest) {
                                this.abTestApart = Object.keys(abTestRatio).length
                                let a = []
                                Object.keys(abTestRatio).forEach(item => {
                                    a.push(abTestRatio[item])
                                })
                                let arr = []
                                for (let i = 0; i < this.abTestApart; i++) {
                                    arr.push(i)
                                }
                                this.copiesItem = arr
                                this.percent = a
                            }
                            this.status = this.editStatus
                    } else {
                        this.launchPlatform = data.biLists
                        // this.strategyPlatform = data.policies
                        this.crowdForm.launchCrowdId = row.launchCrowdId
                        this.crowdForm.dmpCrowdId = row.dmpCrowdId
                        this.crowdForm.launchName = row.launchName
                        this.crowdForm.biIds = data.launchCrowdBiIds
                        this.crowdForm.crowdType = row.tempCrowdId ? true : false
                        this.disabledCrowdType = true
                        // this.crowdForm.remark = row.remark
                        // this.crowdForm.dataSource = row.dataSource
                        // this.crowdForm.expiryDay = row.expiryDay
                        this.crowdForm.autoVersion = row.autoVersion
                        this.crowdForm.autoLaunchTime = row.autoLaunchTime
                        this.crowdForm.abTest = row.abTest
                        if (this.crowdForm.biIds.join(',') === '7') {
                            this.showAccountRelative = true
                        }
                        this.crowdForm.setCalculate = row.setCalculate
                        this.status = this.editStatus
                        if (row.tempCrowdId) {
                            this.crowdForm.tempCrowdId = row.tempCrowdId
                            this.crowdForm.policyIds = []
                            this.crowdForm.policyCrowdIds = []
                        } else {
                            this.crowdForm.tempCrowdId = undefined
                            this.crowdForm.policyIds = row.abTest ? row.policyIds : row.policyIds.split(",")
                            this.getCrowd()
                            data.respcl.forEach(element => {
                                element.childs.forEach(v => {
                                    if (v.choosed)
                                        this.crowdForm.policyCrowdIds.push(element.policyId + "_" + v.crowdId)
                                })
                            })
                        }
                        this.firstTimeLoad = true
                    }
                })
            } else {
                this.title = this.model == 1 ? '新增自定义人群' : '新增'
            }
        },
        methods: {
            callback () {
                this.$emit("changeStatus", true)
            },
            removeTag (policyId) {
                this.crowdForm.policyCrowdIds=this.crowdForm.policyCrowdIds.filter((v)=>{
                    if(v.split("_")[0]!=policyId)
                        return v
                })
            },
            getCrowd () {
                let policyId = null
                if (this.crowdForm.abTest) {
                    policyId = this.crowdForm.policyIds
                } else {
                    policyId = this.crowdForm.policyIds.join(",")
                }
                this.$service
                    .getStrategyCrowds({ policyIds: policyId, abTest: this.crowdForm.abTest })
                    .then(data => {
                        if(this.crowdForm.abTest) {
                            let newDataForm = []
                            const pid = Object.keys(data[0].childs)
                            pid.forEach((item) => {
                                newDataForm.push({Pid: item, childs: data[0].childs[item]})
                            })
                            this.crowdData = newDataForm
                        }else {
                            this.crowdData = data
                        }
                    })
                    .catch(() => {})
            },
            // 新增
            addSubmit () {
                if (this.model == 1)
                 {
                   this.saveDefineCrowd()
                }
                else
                {
                  this.saveNormalCrowd()
                }
            },
            saveNormalCrowd () {
                this.$refs.crowdForm.validate(valid => {
                    if (valid) {
                        let crowdForm = JSON.stringify(this.crowdForm)
                        crowdForm = JSON.parse(crowdForm)
                        crowdForm.biIds = crowdForm.biIds.join(",")
                        // 选择的是临时人群
                        if (crowdForm.crowdType) {
                            crowdForm.abTest = false
                            crowdForm.policyIds = undefined
                            crowdForm.policyCrowdIds = undefined
                        } else {
                            crowdForm.tempCrowdId = 0
                            crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(",")
                            crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v)=>{
                                return v.split("_")[1]
                            }).join(",")
                        }
                        // crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(",")
                        // crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v)=>{
                        //     return v.split("_")[1]
                        // }).join(",")
                        if ( this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined ) {
                            this.$service.saveEditMultiVersionCrowd({model: crowdForm.crowdType ? 1 : 0, data: crowdForm},"编辑成功").then(() => {
                                this.callback()
                            })
                        } else {
                            this.$service.saveAddMultiVersionCrowd({model: crowdForm.crowdType ? 1 : 0,data: crowdForm},"新增成功").then(() => {
                                this.callback()
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            handleRule () {
              let crowdForm = JSON.parse(JSON.stringify(this.crowdDefineForm))
              let macInitialValue = crowdForm.macInitialValue
              const macBelowPer = crowdForm.macBelowPer
              let wxInitialValue = crowdForm.wxInitialValue
              const wxBelowPer = crowdForm.wxBelowPer
              macInitialValue = macInitialValue && macInitialValue.replace(/,/g, '')
              wxInitialValue = wxInitialValue && wxInitialValue.replace(/,/g, '')
              this.validateBasicLine (macInitialValue, macBelowPer, wxInitialValue, wxBelowPer)
            },
            validateBasicLine (macInitialValue, macBelowPer, wxInitialValue, wxBelowPer) {
              const macCondition = (macInitialValue === undefined || macInitialValue === '') && (macBelowPer === undefined || macBelowPer === '')
              const wxCondition = (wxInitialValue === undefined || wxInitialValue === '') && (wxBelowPer === undefined || wxBelowPer === '')
              if (macCondition && wxCondition) {
                this.basicLineErrorText = '请至少填写一组基准和环比阀值'
                return false
              }
              else if ((macInitialValue !== undefined && macInitialValue !== '') && (macBelowPer === undefined || macBelowPer === '')) {
                this.basicLineErrorText = '请把Mac数量环比低于这个选项填写完整'
                return false
              }
              else if ((macBelowPer !== undefined && macBelowPer !== '') && (macInitialValue === undefined || macInitialValue === '')) {
                this.basicLineErrorText = '请把Mac数量基准这个选项填写完整'
                return false
              }
              else if ((wxInitialValue !== undefined && wxInitialValue !== '') && (wxBelowPer === undefined || wxBelowPer === '')) {
                this.basicLineErrorText = '请把微信数量环比低于这个选项填写完整'
                return false
              }
              else if ((wxBelowPer !== undefined && wxBelowPer !== '') && (wxInitialValue === undefined || wxInitialValue === '')) {
                this.basicLineErrorText = '请把微信数量基准这个选项填写完整'
                return false
              } else {
                this.basicLineErrorText = ''
                return true
              }
            },
            // 保存自定义人群
            saveDefineCrowd () {
                this.$refs.crowdDefineForm.validate(valid => {
                    if (valid) {
                        let crowdForm = JSON.stringify(this.crowdDefineForm)
                        crowdForm = JSON.parse(crowdForm)
                        crowdForm.biIds = crowdForm.biIds.join(",")
                        crowdForm.calType = crowdForm.calType.join(",")
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
                        if ( this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined && crowdForm.abTest ) {
                            if (this.percentTotal !== 100) {
                                this.$message.error('划分的所有比例总和必须等于100%，请调整比例再保存！')
                                return
                            }
                            let oldRatio = crowdForm.ratios
                            Object.keys(oldRatio).forEach((key, index) => {
                                oldRatio[key] = this.percent[index]
                            })
                            crowdForm.ratios = oldRatio
                        }
                        // let { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = crowdForm
                        let { macInitialValue, macBelowPer, wxInitialValue, wxBelowPer } = crowdForm
                        macInitialValue = macInitialValue && macInitialValue.replace(/,/g, '')
                        wxInitialValue = wxInitialValue && wxInitialValue.replace(/,/g, '')
                        crowdForm.macInitialValue = macInitialValue
                        crowdForm.wxInitialValue = wxInitialValue
                        if (crowdForm.autoVersion === 1 && !this.validateBasicLine(macInitialValue, macBelowPer, wxInitialValue, wxBelowPer)) {
                          return
                        }
                        // const macCondition = (macInitialValue === undefined || macInitialValue === '') && (macBelowPer === undefined || macBelowPer === '')
                        // const wxCondition = (wxInitialValue === undefined || wxInitialValue === '') && (wxBelowPer === undefined || wxBelowPer === '')
                        // if (macCondition && wxCondition) {
                        //   this.basicLineErrorText = '请至少填写一组基准和环比阀值'
                        //   return
                        // }
                        // else if ((macInitialValue !== undefined && macInitialValue !== '') && (macBelowPer === undefined || macBelowPer === '')) {
                        //   this.basicLineErrorText = '请把Mac数量环比低于这个选项填写完整'
                        //   return
                        // }
                        // else if ((macBelowPer !== undefined && macBelowPer !== '') && (macInitialValue === undefined || macInitialValue === '')) {
                        //   this.basicLineErrorText = '请把Mac数量基准这个选项填写完整'
                        //   return
                        // }
                        // else if ((wxInitialValue !== undefined && wxInitialValue !== '') && (wxBelowPer === undefined || wxBelowPer === '')) {
                        //   this.basicLineErrorText = '请把微信数量环比低于这个选项填写完整'
                        //   return
                        // }
                        // else if ((wxBelowPer !== undefined && wxBelowPer !== '') && (wxInitialValue === undefined || wxInitialValue === '')) {
                        //   this.basicLineErrorText = '请把微信数量基准这个选项填写完整'
                        //   return
                        // }
                        // const macCondition = macInitialValue !== undefined && macInitialValue !== '' && macBelowPer !== undefined && macBelowPer !== ''
                        // const wxCondition = wxInitialValue !== undefined && wxInitialValue !== '' && wxBelowPer !== undefined && wxBelowPer !== ''
                        // if (crowdForm.autoVersion === 1) {
                        //     if (!(macCondition || wxCondition)) {
                        //       this.basicLineErrorText = '请至少填写一组基准和环比阀值'
                        //       return
                        //     }
                        //     if (macCondition) {
                        //       if ((wxInitialValue !== undefined && wxInitialValue !== '')) {
                        //         if (wxBelowPer === undefined || wxBelowPer === '') {
                        //           this.basicLineErrorText = '请把微信数量环比低于这个选项填写完整'
                        //           return
                        //         }
                        //       }
                        //       if ((wxBelowPer !== undefined && wxBelowPer !== '')) {
                        //         if (wxInitialValue === undefined || wxInitialValue === '') {
                        //            this.basicLineErrorText = '请把微信数量基准这个选项填写完整'

                        //           return
                        //         }
                        //       }
                        //     }
                        //     if (wxCondition) {
                        //       if ((macInitialValue !== undefined && macInitialValue !== '')) {
                        //         if (macBelowPer === undefined || macBelowPer === '') {
                        //            this.basicLineErrorText = '请把Mac数量环比低于这个选项填写完整'
                        //           return
                        //         }
                        //       }
                        //       if ((macBelowPer !== undefined && macBelowPer !== '')) {
                        //         if (macInitialValue === undefined || macInitialValue === '') {
                        //           this.basicLineErrorText = '请把Mac数量基准这个选项填写完整'
                        //           return
                        //         }
                        //       }
                        //     }
                        // }

                        if ( this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined ) {
                            this.$service.saveEditMultiVersionCrowd({model: this.model, data: crowdForm},"编辑成功").then(() => {
                                this.callback()
                            })
                        } else {
                            this.$service.saveAddMultiVersionCrowd({model: this.model, data: crowdForm},"新增成功").then(() => {
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
                this.$emit("goBack")
            },
            getAddList (model) {
                if (model === 1) {
                    this.$service.addMultiVersionCrowd(this.model).then(data => {
                        this.launchPlatform = data.biLists
                        this.effectTimeList = data.efTime.map(item => {
                            return { label: item + '天',value: item }
                        })
                    })
                    this.$service.getEstimateType().then((data) => {
                        this.estimateItems = data
                    })
                    this.$service.searchTags().then(data=> {
                        this.tagsList = data
                    })
                }
                else {
                    if (this.parentSource) {
                        this.$service.addMyMultiVersionCrowd(this.model).then(data => {
                            this.launchPlatform = data.biLists
                            this.strategyPlatform = data.policies
                            this.effectTimeList = data.efTime.map(item => {
                                return { label: item + '天',value: item }
                            })
                        })
                    } else {
                        this.$service.addMultiVersionCrowd(this.model).then(data => {
                            this.launchPlatform = data.biLists
                            this.strategyPlatform = data.policies
                            this.effectTimeList = data.efTime.map(item => {
                                return {label: item + '天', value: item}
                            })
                        })
                    }
                }
            },
            // 数组去重
            distinct(a, b) {
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
            },
            handleBiIdChange (val) {
                if (val) {
                    if(val.join(',') === '7') {
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
            getTempCrowdList () {
                const filter = {
                    pageNum: 1,
                    pageSize: 100
                }
                this.$service.getTempCrowdList(filter).then(data => {
                    this.tempCrowdList = data.pageInfo.list
                    // this.launchStatusEnum = data.launchStatusEnum
                    // this.tableData = data.pageInfo.list
                    // this.totalCount = data.pageInfo.total
                })
            }
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
</style>




