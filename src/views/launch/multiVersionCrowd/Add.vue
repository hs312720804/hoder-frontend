<template>
    <div class="add">
        <el-row>
            <el-col :span="24">
                <div class="title">{{title}}</div>
                <!-- <div>{{ crowdForm }}</div> -->
                <!-- policyIds - {{ this.crowdForm.policyIds }} // 选择策略
                policyCrowdIds - {{ crowdForm.policyCrowdIds }} // 选择人群
                crowdId - {{ this.crowdForm.crowdId }} // 大人群ID -->
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
                                      :maxlength="50"
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
                                    :picker-options="{
                                        selectableRange: '9:00:00 - 23:59:59'
                                    }"
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
                                    <el-input-number v-model="crowdDefineForm.macBelowPer" :precision="2" @change="handleRule" :min="1" ></el-input-number>
                                  </el-form-item>&nbsp;&nbsp;%，则告警
                                  <el-form-item label="环比高于" label-width="100px"  prop="macAbovePer" class="inline-block ratio">
                                    <el-input-number v-model="crowdDefineForm.macAbovePer" :precision="2"  :min="1" ></el-input-number>
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
                                      <el-input-number v-model="crowdDefineForm.wxBelowPer" :precision="2" @change="handleRule" :min="1" ></el-input-number>
                                  </el-form-item>&nbsp;&nbsp;%，则告警
                                  <el-form-item label="环比高于" label-width="100px"  prop="wxAbovePer" class="inline-block ratio">
                                      <el-input-number v-model="crowdDefineForm.wxAbovePer" :precision="2" @change="handleRule" :min="1" ></el-input-number>

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
                      v-model="crowdForm.biIds"
                      @change="handleBiIdChange"
                      multiple
                      placeholder="请选择投放平台"
                      :disabled="status!==undefined && (status === 2 || status === 3)"
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

                <!-- 只有当选择了【消息楚触达】才显示【投放应用】 -->
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
                <!--<el-form-item label="数据来源" prop="dataSource" class="form-width">-->
                    <!--<input type="hidden" value="2" v-model="crowdForm.dataSource">-->
                    <!--<el-input size="small" readonly value="大数据"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="备注" prop="remark" class="form-width">-->
                    <!--<el-input size="small" v-model="crowdForm.remark"></el-input>-->
                <!--</el-form-item>-->
                <!-- {{ crowdForm.crowdType }} -->

                <!-- 普通人群 、 行为人群 可以选择是否投放子人群 -->
                <el-form-item label="是否投放子人群" class="form-width" v-if="crowdForm.crowdType === 0 || crowdForm.crowdType === 3">
                    <el-radio-group v-model="crowdForm.abTest" @change="handleAbTestChange" :disabled="status!==undefined && (status === 2 || status === 3)">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择人群类型" class="form-width">
                    <el-radio-group
                            v-model="crowdForm.crowdType"
                            :disabled="disabledCrowdType"
                    >
                        <el-radio :label="0">普通人群</el-radio> <!-- false -->
                        <el-radio :label="1">临时标签/本地标签</el-radio><!-- true -->
                        <el-radio :label="3">行为人群</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 普通人群 -->
                <template v-if="crowdForm.crowdType === 0">
                  <el-form-item
                    label="选择策略"
                    prop="policyIds"
                    class="multipleSelect form-width"
                  >
                  <!-- {{crowdForm.policyIds}} -->
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
                      >{{ item.policyName }}
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item
                      label="选择人群"
                      prop="policyCrowdIds"
                  >
                      <!-- {{ crowdForm.policyCrowdIds }} -->
                              <!-- :disabled="item.canLaunch === false || (item.behaviorRulesJson && JSON.parse(item.behaviorRulesJson).rules && JSON.parse(item.behaviorRulesJson).rules.length > 0)" -->

                      <el-form-item v-for="(v,index) in crowdData" :label="crowdForm.abTest ? v.Pid: v.policyName" :key="v.policyId+'_'+index">
                        <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">
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

                      <!-- <div v-if="!crowdForm.abTest">
                          <el-form-item v-for="(v,index) in crowdData" :label="v.policyName" :key="v.policyId+'_'+index">
                              <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">
                                  <el-checkbox
                                          v-for="item in v.childs"
                                          :label="item.policyId+'_'+item.crowdId"
                                          :key="item.crowdId+''"
                                          :disabled="item.canLaunch === false || (item.behaviorRulesJson && JSON.parse(item.behaviorRulesJson).rules && JSON.parse(item.behaviorRulesJson).rules.length > 0)"
                                  >
                                  {{ item.crowdName}}
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
                      </div> -->
                  </el-form-item>
                </template>

                <!-- 选择临时人群 -->
                <el-form-item v-if="crowdForm.crowdType === 1"
                    label="选择人群"
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
                    >
                        <el-option
                            v-for="item in tempCrowdList"
                            :key="item.launchCrowdId+''"
                            :label="item.launchName"
                            :value="item.launchCrowdId"
                        >
                        {{item.launchName}}
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

                <!-- 选择行为人群 & 投放子人群 -->
                <template v-if="crowdForm.crowdType === 3 && crowdForm.abTest">
                <!-- crowdForm.policyIds 111=={{crowdForm.policyIds}} -->
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
                        <!-- {{crowdData}} -->

                        <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && (status === 2 || status === 3)">
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
                  <el-form-item
                    label="选择人群"
                    prop="tempCrowdId"
                  >
                      <!-- @change="handelBehaviorCrowdSelectChange($event, crowdForm.tempCrowdId)" -->
                      <!-- {{this.crowdForm.policyCrowdIds}} -->
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
                <el-form-item
                  v-if="crowdForm.crowdType === 0"
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
                <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdForm.autoVersion === 1 && crowdForm.crowdType === 0" class="form-width">
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
              <el-button type="primary" @click="addSubmit">保存</el-button>
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
                @click="launchDirectly"
              >直接投放</el-button>

            </div>

            <!-- 投放提示 -->
            <!-- <el-dialog :visible.sync="showLaunchTip" title="投放提醒">
                <div class="choose-tip">{{ launchTip }}</div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="showLaunchTip = false">取 消</el-button>
                    <el-button type="primary" @click="confirmLaunch">投 放</el-button>
                </span>
            </el-dialog> -->

            <!-- 投放提示估算弹窗 -->
            <el-dialog :visible.sync="showEstimate">
              <div class="choose-tip">请选择下列需要估算的字段，勾选保存后将估算该字段的人群数量</div>
              <el-checkbox-group v-model="estimateValue" :disabled="accountDefine" aria-required="true">
                  <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
                  <span slot="footer" class="dialog-footer">
                  <el-button @click="showEstimate = false">取 消</el-button>
                  <el-button type="primary" @click="handleEstimate(estimateValue)">投 放</el-button>
              </span>
              <div v-if="crowdForm.crowdType === 3" class="tip">Tips: 行为人群当前仅支持push设备类型</div>
            </el-dialog>
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
      // 表格当前页数据
      strategyPlatform: [],
      launchPlatform: [],
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
        policyCrowdIds: [],
        // expiryDay: 7,
        autoVersion: 0,
        autoLaunchTime: undefined,
        setCalculate: false, // ，当投放平台只有消息触达时，设置账号关联相关
        crowdType: 0,
        tempCrowdId: undefined,
        packageName: ''
      },
      // 新增自定义人群
      crowdDefineForm: {
        launchCrowdId: undefined,
        launchName: '', // 投放名称
        biIds: '', // 投放平台ID
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
    }
  },

  methods: {
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
      } else if (crowdType === 3 && !this.loading) { // 行为人群
        if (this.behaviorCrowdListFilter.pageNum < this.behaviorCrowdListpages) {
          this.behaviorCrowdListFilter.pageNum++ // 滚动加载翻页
          this.getBehaviorCrowdList()
        }
      }
    },

    handelBehaviorCrowdSelectChange (e, selectedV, list) {
      this.crowdForm.policyIds = selectedV.split('_')[0]
      const policyCrowdIds = selectedV.split('_')[1]
      // item.policyIds+'_'+item.policyCrowdIds
      this.crowdForm.tempCrowdId = list.find(item => {
        // console.log(this.crowdForm.policyIds  +  '===' + item.policyIds)
        // console.log(policyCrowdIds  +  '===' + item.policyCrowdIds)
        const a = item.policyIds == this.crowdForm.policyIds
        const b = item.policyCrowdIds == policyCrowdIds
        return a && b
      }).launchCrowdId
    },
    callback () {
      this.$emit('changeStatus', true)
    },
    removeTag (policyId) {
      this.crowdForm.policyCrowdIds = this.crowdForm.policyCrowdIds.filter((v) => {
        if (v.split('_')[0] != policyId) { return v }
      })
    },
    // 普通人群 - 获取选择的策略下的人群
    getCrowd () {
      let policyId = null
      if (this.crowdForm.abTest) {
        policyId = this.crowdForm.policyIds
      } else {
        policyId = this.crowdForm.policyIds.join(',')
      }
      return this.$service.getStrategyCrowds({ policyIds: policyId, abTest: this.crowdForm.abTest })
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
            console.log('newDataForm====', newDataForm)
            this.crowdData = newDataForm
          } else {
            this.crowdData = data
          }
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
    // 新增
    addSubmit () {
      this.islaunchDirectly = false
      if (Number(this.model) === 1 && this.isTempCrowd) {
        this.saveDefineCrowd()
      } else {
        this.saveNormalCrowd()
      }
    },
    // 根据接口需要，重构参数结构
    reParamsData () {
      const crowdForm = JSON.parse(JSON.stringify(this.crowdForm))
      crowdForm.biIds = crowdForm.biIds.join(',')
      if (crowdForm.crowdType === 1) { // 临时人群
        crowdForm.abTest = false
        crowdForm.policyIds = undefined
        crowdForm.policyCrowdIds = undefined
      } else if (crowdForm.crowdType === 3) { // 行为人群
        // crowdForm.tempCrowdId = undefined
        // crowdForm.policyIds = crowdForm.policyIds

        // 投放子人群
        if (crowdForm.abTest) {
          crowdForm.crowdType = 9
          crowdForm.crowdId = crowdForm.policyCrowdIds[0].split('_')[2]
          // crowdForm.tempCrowdId = crowdForm.policyCrowdIds[0].split('_')[2]
        }

        crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v) => {
          return v.split('_')[1]
        }).join(',')
      } else { // 普通人群
        crowdForm.tempCrowdId = 0
        crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(',')

        crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v) => {
          return v.split('_')[1]
        }).join(',')
      }

      return crowdForm

      // crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(",")
      // crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v)=>{
      //     return v.split("_")[1]
      // }).join(",")
    },
    saveNormalCrowd () {
      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          // 获取接口所需参数
          const crowdForm = this.reParamsData()

          if (this.editLaunchCrowdId !== null && this.editLaunchCrowdId !== undefined) {
            this.$service.saveEditMultiVersionCrowd({ model: crowdForm.crowdType, data: crowdForm }, '编辑成功').then((data) => {
              this.callback()
              if (crowdForm.crowdType === 3 && this.islaunchDirectly) { // 行为人群
                // if (crowdForm.crowdType === 3) { // 行为人群
                this.$service.calculateTempCrowd({ launchCrowdId: data.launchCrowdId, calType: data.calType }, '成功计算中').then(() => {
                  this.fetchData()
                })
              }
            })
          } else {
            this.$service.saveAddMultiVersionCrowd({ model: crowdForm.crowdType, data: crowdForm }, '新增成功').then((data) => {
              this.callback()
              if (crowdForm.crowdType === 3 && this.islaunchDirectly) { // 行为人群
                // if (crowdForm.crowdType === 3) { // 行为人群
                this.$service.calculateTempCrowd({ launchCrowdId: data.launchCrowdId, calType: data.calType }, '成功计算中').then(() => {
                  this.fetchData()
                })
              }
            })
          }
        } else {
          return false
        }
      })
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
    // 保存自定义人群
    saveDefineCrowd () {
      this.$refs.crowdDefineForm.validate(valid => {
        if (valid) {
          let crowdForm = JSON.stringify(this.crowdDefineForm)
          crowdForm = JSON.parse(crowdForm)
          crowdForm.biIds = crowdForm.biIds.join(',')
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
          if (this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined && crowdForm.abTest) {
            if (this.percentTotal !== 100) {
              this.$message.error('划分的所有比例总和必须等于100%，请调整比例再保存！')
              return
            }
            const oldRatio = crowdForm.ratios
            Object.keys(oldRatio).forEach((key, index) => {
              oldRatio[key] = this.percent[index]
            })
            crowdForm.ratios = oldRatio
          }
          // let { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = crowdForm
          let { macInitialValue, macBelowPer, wxInitialValue, wxBelowPer } = crowdForm
          macInitialValue = macInitialValue && macInitialValue.toString().replace(/,/g, '')
          wxInitialValue = wxInitialValue && wxInitialValue.toString().replace(/,/g, '')
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

          if (this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined) {
            this.$service.saveEditMultiVersionCrowd({ model: this.model, data: crowdForm }, '编辑成功').then(() => {
              this.callback()
            })
          } else {
            this.$service.saveAddMultiVersionCrowd({ model: this.model, data: crowdForm }, '新增成功').then(() => {
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
      this.$emit('goBack')
    },
    getAddList (model) {
      this.$service.getEstimateType().then((data) => {
        this.estimateItems = data
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
        if (this.showAllParent) {
          this.$service.addMyMultiVersionCrowd(this.model).then(data => {
            this.launchPlatform = data.biLists
            this.strategyPlatform = data.policies
            this.effectTimeList = data.efTime.map(item => {
              return { label: item + '天', value: item }
            })
          })
        } else {
          this.$service.addMultiVersionCrowd(this.model).then(data => {
            this.launchPlatform = data.biLists
            this.strategyPlatform = data.policies
            this.effectTimeList = data.efTime.map(item => {
              return { label: item + '天', value: item }
            })
            if (data.tempCrowds) {
              // 行为人群列表
              // this.behaviorCrowdList = data.tempCrowds.filter(item => {
              //     return item.isFxFullSql === 3
              // })
            }
          })
        }
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
    // 临时标签/本地标签 下拉列表
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
    handelLaunch () {
      this.islaunchDirectly = true
      // 临时人群/本地人群 直接投放，不展示投放提示
      if (this.crowdForm.crowdType === 1 || this.crowdForm.crowdType === 3) {
        this.launchDirectly()
        return
      }
      console.log('this.crowdForm==>', this.crowdForm)
      // let policyCrowdIds = JSON.parse(JSON.stringify(this.crowdForm.policyCrowdIds))
      const crowdIds = this.crowdForm.policyCrowdIds.map(item => item.split('_')[1]).join(',')
      // 先进行保存校验
      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          const parmas = {
            crowdIds
          }
          this.$service.alertLaunch(parmas).then((data) => {
            this.showLaunchTip = true
            this.launchTip = data
          })
        } else {
          return false
        }
      })
    },

    // 确认投放
    // confirmLaunch () {
    //   this.showEstimatePop()
    // },

    // 直接投放，没有投放提示
    launchDirectly () {
      console.log('this.crowdForm==>', this.crowdForm)
      // 先进行保存校验
      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          this.showEstimatePop()
        } else {
          return false
        }
      })
    },

    showEstimatePop () {
      this.showEstimate = true
      console.log(' this.crowdForm.crowdType==', this.crowdForm.crowdType)
      console.log(' this.crowdForm.crowdType==', this.crowdForm.crowdType === '3')
      console.log(' this.crowdForm.crowdType==', this.crowdForm.crowdType === 3)
      // 当普通投放，勾选了 账号去重关联，投放默认置灰且全部勾选
      if (this.crowdForm.setCalculate) {
        this.accountDefine = true
        this.estimateValue = ['0', '1', '2', '3']
      } else if (this.crowdForm.crowdType === 3) { // 行为人群push时，不支持选择数据类型，数据类型选择的其他选项置灰不可选，在类型下展示“Tips: 行为人群当前仅支持push设备类型”
        this.accountDefine = true
        this.estimateValue = ['0']
      } else {
        this.accountDefine = false
        this.estimateValue = ['0']
      }
    },

    handleEstimate (calTypes) {
      if (calTypes.length === 0) {
        this.$message.error('请至少选择一个要投放的人群')
        return
      }
      const calIdType = calTypes.map((item) => item).join(',')

      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          // 获取接口所需参数
          const crowdForm = this.reParamsData(this.crowdForm)

          if (this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined) {
            this.$service.saveEditMultiVersionCrowd({ model: crowdForm.crowdType, data: crowdForm }, '编辑成功').then(() => {
              this.currentLaunchId = this.editLaunchCrowdId
              this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {
                // 行为人群需要 lua 一下
                // if (crowdForm.crowdType === 3) {
                //     this.$service.freshCache({policyId: crowdForm.policyIds}).then(() => {
                //         this.showEstimate = false
                //         this.callback()
                //     })
                // } else {
                this.showEstimate = false
                this.callback()
                // }
              })
            })
          } else {
            this.$service.saveAddMultiVersionCrowd({ model: crowdForm.crowdType, data: crowdForm }, '新增成功').then((data) => {
              this.currentLaunchId = data.launchCrowdId
              this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {
                // 行为人群需要 lua 一下
                // if (crowdForm.crowdType === 3) {
                //     this.$service.freshCache({policyId: crowdForm.policyIds}).then(() => {
                //         this.showEstimate = false
                //         this.callback()
                //     })
                // } else {
                this.showEstimate = false
                this.callback()
                // }
              })
            })
          }
        } else {
          return false
        }
      })
    },
    async setEdit () {
      // 编辑
      if (this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined) {
        this.title = '编辑'
        this.$service.editMultiVersionCrowd(this.editLaunchCrowdId).then(async data => {
          const row = data.launchCrowd
          const abTestRatio = data.ratio || {}
          // 当 row.tempCrowdId=0，就是普通人群
          this.isTempCrowd = !row.tempCrowdId
          // row.crowdType不为null，则 row.crowdType == 1 是临时人群
          // row.crowdType为null，当row.tempCrowdId=0，就是普通人群
          // this.isTempCrowd = (row.crowdType && row.crowdType === 1) ? true : !row.tempCrowdId
          if (Number(this.model) === 1 && !row.tempCrowdId) { // 自定义人群
          // const biIds = this.distinct(data.launchCrowdBiIds,[])
            const biIds = data.launchCrowdBiIds
            const { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = row
            this.crowdDefineForm = {
              launchCrowdId: row.launchCrowdId,
              launchName: row.launchName,
              biIds: biIds,
              crowdSql: row.crowdSql,
              expiryDay: row.expiryDay,
              autoVersion: row.autoVersion,
              calType: row.calType.split(','),
              proTempTag: row.proTempTag,
              autoLaunchTime: row.autoLaunchTime,
              tagId: row.tagId,
              abTest: row.abTest,
              ratios: abTestRatio,
              macInitialValue: macInitialValue === null ? undefined : macInitialValue, // Mac基准值
              macAbovePer: macAbovePer === null ? undefined : macAbovePer, // Mac最大阈值
              macBelowPer: macBelowPer === null ? undefined : macBelowPer, // Mac最小阈值
              wxInitialValue: wxInitialValue === null ? undefined : wxInitialValue, // 微信基准值
              wxAbovePer: wxAbovePer === null ? undefined : wxAbovePer, // 微信最大阈值
              wxBelowPer: wxBelowPer === null ? undefined : wxBelowPer, // 微信最小阈值
              // minMacEstimateCount: row.minMacEstimateCount,
              // maxMacEstimateCount: row.maxMacEstimateCount,
              // minWxEstimateCount: row.minWxEstimateCount,
              // maxWxEstimateCount: row.maxWxEstimateCount,
              videoSource: row.videoSource === null ? '0' : '1',
              videoSourceIds: row.videoSource === null ? [] : row.videoSource.split(',')
            }
            if (row.abTest) {
              this.abTestApart = Object.keys(abTestRatio).length
              const a = []
              Object.keys(abTestRatio).forEach(item => {
                a.push(abTestRatio[item])
              })
              const arr = []
              for (let i = 0; i < this.abTestApart; i++) {
                arr.push(i)
              }
              this.copiesItem = arr
              this.percent = a
            }
            this.status = this.editStatus
          } else {
            // *****************************************************
            this.launchPlatform = data.biLists
            // this.strategyPlatform = data.policies
            this.crowdForm.launchCrowdId = row.launchCrowdId
            this.crowdForm.dmpCrowdId = row.dmpCrowdId
            this.crowdForm.launchName = row.launchName
            this.crowdForm.biIds = data.launchCrowdBiIds
            // this.crowdForm.crowdType = row.tempCrowdId ? 1 : 0
            this.crowdForm.crowdType = row.crowdType ? row.crowdType : (row.tempCrowdId ? 1 : 0)
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
            this.crowdForm.packageName = Number(row.packageName) // 投放应用
            this.crowdForm.setCalculate = row.setCalculate
            this.status = this.editStatus
            // if (row.tempCrowdId) {
            if (this.crowdForm.crowdType === 1) { // 临时人群
              this.crowdForm.tempCrowdId = row.tempCrowdId
              this.crowdForm.policyIds = undefined
              this.crowdForm.policyCrowdIds = undefined
            } else if (this.crowdForm.crowdType === 3) { // 行为人群
            // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
              this.$nextTick(async () => {
                this.crowdForm.tempCrowdId = row.tempCrowdId
                this.crowdForm.policyIds = row.policyIds
                // :label="v.policyId+'_'+item.crowdId+'_'+item.pid"
                this.crowdForm.policyCrowdIds.push(`${row.policyIds}_${row.policyCrowdIds}`)
              })
            } else if (this.crowdForm.crowdType === 0) { // 普通人群
              this.crowdForm.tempCrowdId = undefined

              // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
              this.$nextTick(async () => {
                this.crowdForm.policyIds = row.abTest ? row.policyIds : row.policyIds.split(',')
                // 等待获取所选策略下的人群列表
                await this.getCrowd()
                data.respcl && data.respcl.forEach(element => {
                  element.childs.forEach(v => {
                    if (v.choosed) { this.crowdForm.policyCrowdIds.push(`${element.policyId}_${v.crowdId}`) }
                    console.log('this.crowdForm.policyCrowdIds===', this.crowdForm.policyCrowdIds)
                  })
                })
              })
            } else if (this.crowdForm.crowdType === 9) {
              // 行为人群 + 投放子人群 的 crowdType 为 9
              this.crowdForm.crowdType = 3
              this.crowdForm.tempCrowdId = undefined
              console.log('row===', row.policyIds)

              // 上面切换 crowdType 时会清空数据，因此将数据赋值放到下一轮循环时执行。
              this.$nextTick(async () => {
                this.crowdForm.policyIds = row.policyIds
                // 等待获取所选策略下的人群列表
                await this.getABChildByPolicyId()

                data.respcl && data.respcl.forEach(element => {
                  element.childs.forEach((v, index) => {
                    // item.policyId+'_'+item.crowdId+'_'+item.pid
                    if (v.choosed) { this.crowdForm.policyCrowdIds.push(`${element.policyId}_${v.crowdId}_${v.pid}`) }
                  })
                })
              })
              // data.respcl.forEach(element => {
              //   element.childs.forEach(v => {
              //     if (v.choosed) { this.crowdForm.policyCrowdIds.push(element.policyId + '_' + v.crowdId) }
              //   })
              // })
            }
            // ***********************************************************
          // this.firstTimeLoad = true
          }
        })
      } else {
        this.title = Number(this.model) === 1 ? '新增自定义人群' : '新增'
      }
    }
  },

  created () {
    this.tempCrowdList = []
    this.tempListpages = 0

    this.setEdit() // 初始化编辑数据

    this.getAddList(this.model) // 普通人群策略列表
    this.getTempCrowdList() // 临时人群/本地人群列表
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
