<template>
    <div class="launch-list">
        <!-- authority -->
        <div class="header">
            <div class="header-left">
                <div class="search-input">
                    <el-input
                            v-model="searchForm.launchName"
                            style="width: 350px"
                            placeholder="请输入投放名称或ID"
                            :clearable='true'
                            @keyup.enter.native="handleSearch"
                    ></el-input>
                    <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
                </div>
            </div>
            <div class="header-right">
                <!-- form search -->
                <!--<el-form-->
                        <!--:inline="true"-->
                        <!--:model="searchForm"-->
                        <!--ref="searchForm"-->
                        <!--@submit.native.prevent="submitForm"-->
                <!--&gt;-->
                    <!--<el-form-item label prop="launchName">-->
                        <!--<el-input v-model="searchForm.launchName" style="width: 200px" placeholder="请输入投放名称或ID"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" size="small" icon="search" @click="submitForm">查询</el-button>-->
                        <!--<el-button type="primary" size="small" @click="handleReset">-->
                            <!--<a class="fa fa-refresh" style="color: white;"></a> 重置-->
                        <!--</el-button>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
                <div class="button-list">
                    <el-button
                            type="primary"
                            size="small"
                            @click="handleAdd"
                            v-permission="'hoder:launch:crowd:ver:add'"
                    >
                        新增投放
                    </el-button>
                    <!--<el-button-->
                    <!--type="primary"-->
                    <!--size="small"-->
                    <!--@click="handleCrowdDefineAdd"-->
                    <!--v-permission="'hoder:launch:crowd:ver:add'"-->
                    <!--&gt;-->
                    <!--新增自定义人群-->
                    <!--</el-button>-->
                    <el-popover
                            placement="top"
                            trigger="click"
                            class="popover-button"
                    >
                        <div>
                            <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                                <el-checkbox label="createTime">创建时间</el-checkbox>
                                <el-checkbox label="creatorName">创建人</el-checkbox>
                                <el-checkbox label="status">投放状态</el-checkbox>
                                <el-checkbox label="department">业务部门</el-checkbox>
                                <el-checkbox label="totalWxOpenid">微信openId数量</el-checkbox>
                                <el-checkbox label="totalPhone">手机号数量</el-checkbox>
                                <el-checkbox label="totalUser">设备数量</el-checkbox>
                                <el-checkbox label="totalCoocaaOpenid">酷开openId数量</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <i
                                class="el-icon-cc-setting operate"
                                slot="reference"
                        >
                        </i>
                        <!--<el-button slot="reference">选择列表展示维度</el-button>-->
                    </el-popover>
                    <!--<a href="http://mgr-hoder.skysrt.com/hoder-manual/ren-qun-guan-li/ren-qun-quan-ding.html" target="_blank">操作指南</a>-->
                </div>
            </div>
        </div>
        <!-- talbe -->
        <el-table ref="myTable" :data="tableData" style="width: 100%;" stripe border>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="launchCrowdId" label="投放ID" width="60">
                <template slot-scope="scope">
                    <div :class="(launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 ? 'red-text' : ''">
                        <span v-if="(launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5">！</span>
                        <span>{{scope.row.launchCrowdId}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="launchName" label="投放名称" width="100">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.abTest === true" @click="showABTestDetail(scope.row)">{{scope.row.launchName}}</el-button>
                    <span v-else :class="(launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 ? 'red-text' : ''">{{scope.row.launchName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="dmpCrowdId" label="人群投放Id" width="80"></el-table-column>
            <el-table-column prop="biName" label="投放平台" width="120"></el-table-column>
            <el-table-column v-if="(checkList.indexOf('status') > -1)" prop="status" label="人群状态" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.isFxFullSql === 1 && scope.row.tempCrowdId > 0">
                        <span v-if="scope.row.launchTempCrowdStatus">投放中</span>
                        <span v-else>待投放</span>
                    </span>
                    <span v-else>
                         <!-- 当投放中，人群波动，要显示红色-->
                        <span v-if="!(launchStatusEnum[scope.row.history.status].childrenName)"
                              :class="(launchStatusEnum[scope.row.history.status]).code === 91 ? 'red-text': ''"
                        >
                            {{(launchStatusEnum[scope.row.history.status]).name}}
                        </span>
                        <span v-else>
                              <el-tooltip placement="right-start">
                                <div slot="content">{{(launchStatusEnum[scope.row.history.status]).childrenName}}</div>
                                  <span class="uneffective"><span :class="(launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 ? 'red-text' : ''">{{(launchStatusEnum[scope.row.history.status]).name}}</span><span class="circle">?</span></span>
                              </el-tooltip>
                        </span>
                    </span>
                    <!--<el-button type="text" v-if="scope.row.history.status == 5" @click="handleCountFail">{{launchStatusEnum[scope.row.history.status]}}</el-button>-->
                    <!--<span v-else  style="margin-left: 10px">{{launchStatusEnum[scope.row.history.status].name}}</span>-->
                </template>
            </el-table-column>
            <!--<el-table-column prop="expiryTime" label="人群有效期" width="180">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-icon name="time"></el-icon>-->
                    <!--<span style="margin-left: 10px">{{ scope.row.jobEndTime }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="人群类型">
                <template slot-scope="scope">
                    {{crowdType[scope.row.isFxFullSql]}}
                </template>
            </el-table-column>
            <el-table-column
                    v-if="(checkList.indexOf('totalUser') > -1)"
                    label="设备数量"
                    width="80"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.history.totalUser">
                        {{cc_format_number(scope.row.history.totalUser)}}
                    </div>
                    <div v-else>
                        {{scope.row.history.totalUser}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="(checkList.indexOf('totalPhone') > -1)"
                    prop="history.totalPhone"
                    label="手机号数量"
                    width="90"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.history.totalPhone">
                        {{cc_format_number(scope.row.history.totalPhone)}}
                    </div>
                    <div v-else>
                        {{scope.row.history.totalPhone}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="(checkList.indexOf('totalWxOpenid') > -1)"
                    prop="history.totalWxOpenid"
                    label="微信openId数量"
                    width="110"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.history.totalWxOpenid">
                        {{cc_format_number(scope.row.history.totalWxOpenid)}}
                    </div>
                    <div v-else>
                        {{scope.row.history.totalWxOpenid}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="(checkList.indexOf('totalCoocaaOpenid') > -1)"
                    prop="history.totalCoocaaOpenid"
                    label="酷开openId数量"
                    width="110"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.history.totalCoocaaOpenid">
                        {{cc_format_number(scope.row.history.totalCoocaaOpenid)}}
                    </div>
                    <div v-else>
                        {{scope.row.history.totalCoocaaOpenid}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" prop="creatorName" label="创建人"></el-table-column>
            <el-table-column v-if="(checkList.indexOf('createTime') > -1)" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column v-if="(checkList.indexOf('department') > -1)" prop="department" label="业务部门"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="200">
                <template slot-scope="scope">
                    <el-button-group  class="button-group-position">
                        <!-- 投放按钮显示的状态：1未投放，4计算失败，5投放失败，7已过期 -->
                        <span v-if="scope.row.isFxFullSql === 1 && scope.row.tempCrowdId > 0">
                            <el-button
                                    v-if="!scope.row.launchTempCrowdStatus"
                                    v-permission="'hoder:launch:crowd:ver:launch'"
                                    size="small"
                                    type="text"
                                    @click="lanuch(scope.$index, scope.row)"
                            >投放</el-button>
                            <el-button
                                    v-else
                                    v-permission="'hoder:launch:crowd:ver:cancel'"
                                    size="small"
                                    type="text"
                                    @click="cancelLanuch(scope.row)"
                            >取消投放</el-button>
                        </span>
                        <span v-else>
                            <el-button
                                    v-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 || (launchStatusEnum[scope.row.history.status]).code === 7 "
                                    v-permission="'hoder:launch:crowd:ver:launch'"
                                    size="small"
                                    type="text"
                                    @click="lanuch(scope.$index, scope.row)"
                            >投放</el-button>
                            <!-- 取消投放显示的状态：3投放中 -->
                            <el-button
                                    v-if="(launchStatusEnum[scope.row.history.status]).code === 3 || (launchStatusEnum[scope.row.history.status]).code === 91"
                                    v-permission="'hoder:launch:crowd:ver:cancel'"
                                    size="small"
                                    type="text"
                                    @click="cancelLanuch(scope.row)"
                            >取消投放</el-button>
                        </span>
                        <!--<el-button-->
                                <!--v-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 || (launchStatusEnum[scope.row.history.status]).code === 7 "-->
                                <!--v-permission="'hoder:launch:crowd:ver:launch'"-->
                                <!--size="small"-->
                                <!--type="warning"-->
                                <!--@click="lanuch(scope.$index, scope.row)"-->
                        <!--&gt;投放</el-button>-->
                        <!--&lt;!&ndash; 取消投放显示的状态：3投放中 &ndash;&gt;-->
                        <!--<el-button-->
                                <!--v-if="(launchStatusEnum[scope.row.history.status]).code === 3 || (launchStatusEnum[scope.row.history.status]).code === 91"-->
                                <!--v-permission="'hoder:launch:crowd:ver:cancel'"-->
                                <!--size="small"-->
                                <!--type="warning"-->
                                <!--@click="cancelLanuch(scope.row)"-->
                        <!--&gt;取消投放</el-button>-->
                        <el-button
                                size="small"
                                type="text"
                                v-permission="'hoder:launch:crowd:ver:detail'"
                                @click="condition(scope.row) "
                        >人群条件</el-button>
                        <el-dropdown @command="handleCommandOpreate">
                            <el-button size="small" type="text">
                                操作
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                        :command="['edit',scope.row]"
                                        v-permission="'hoder:launch:crowd:ver:modify'"
                                >编辑
                                </el-dropdown-item>
                                 <el-dropdown-item
                                        v-if="scope.row.isFxFullSql === 1 && (launchStatusEnum[scope.row.history.status]).code === 91"
                                        :command="['adjust',scope.row]"
                                        v-permission="'hoder:launch:crowd:ver:index'"
                                >调整波动阀值
                                </el-dropdown-item>
                                <el-dropdown-item
                                        v-if="((scope.row.isFxFullSql === 1) || (scope.row.isFxFullSql === 0 && (launchStatusEnum[scope.row.history.status]).code === 3 || (launchStatusEnum[scope.row.history.status]).code === 91))"
                                        :command="['monitor',scope.row]"
                                        v-permission="'hoder:launch:crowd:ver:index'"
                                >数据监控
                                </el-dropdown-item>
                                <span v-if="scope.row.isFxFullSql === 1 && scope.row.tempCrowdId > 0">
                                    <span v-if="!scope.row.launchTempCrowdStatus">
                                        <el-dropdown-item
                                                :command="['del',scope.row]"
                                                v-permission="'hoder:launch:crowd:ver:delete'"
                                        >删除
                                        </el-dropdown-item>
                                    </span>
                                </span>
                                <span v-else>
                                    <el-dropdown-item
                                            :command="['del',scope.row]"
                                            v-permission="'hoder:launch:crowd:ver:delete'"
                                            v-if="(launchStatusEnum[scope.row.history.status]).code === 1 || (launchStatusEnum[scope.row.history.status]).code === 4 || (launchStatusEnum[scope.row.history.status]).code === 5 || (launchStatusEnum[scope.row.history.status]).code === 7"
                                    >删除
                                    </el-dropdown-item>
                                </span>
                                <el-dropdown-item
                                        :command="['divide',scope.row]"
                                        v-if="scope.row.isFxFullSql == 1 && scope.row.abTest === false && (launchStatusEnum[scope.row.history.status]).code === 1"
                                >AB实验
                                </el-dropdown-item>
                                <el-dropdown-item
                                :command="['commitHistory',scope.row]"
                                v-if="(launchStatusEnum[scope.row.history.status]).code !== 1"
                                divided
                                >提交历史数据
                                </el-dropdown-item>
                                <el-dropdown-item
                                        v-if="!scope.row.myCollect"
                                        :command="['collect',scope.row]"
                                >添加到'我的'</el-dropdown-item>
                                <el-dropdown-item
                                        v-if="scope.row.myCollect && !parentSource"
                                        disabled
                                >添加到'我的'</el-dropdown-item>
                                <el-dropdown-item
                                        v-if="scope.row.myCollect && parentSource && scope.row.creator !== $appState.user.userId"
                                        :command="['collect',scope.row]"
                                >从'我的'删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button
                                v-if="(launchStatusEnum[scope.row.history.status]).code !== 1"
                                size="small"
                                type="text"
                                @click="handleGetLaunchDetail(scope.row)"
                        >投放详情</el-button>
                        <!--<el-button-->
                                <!--v-if="scope.row.history.status==1"-->
                                <!--v-permission="'hoder:launch:crowd:ver:delete'"-->
                                <!--size="small"-->
                                <!--type="info"-->
                                <!--@click="del(scope.row)"-->
                        <!--&gt;删除</el-button>-->
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <!-- pagination -->
        <div align="right">
            <pagination
                    v-bind:currentpage="currentPage"
                    v-bind:pagesize="pageSize"
                    v-bind:totalcount="totalCount"
                    @handle-size-change="handleSizeChange"
                    @handle-current-change="handleCurrentChange"
            ></pagination>
        </div>
        <el-dialog :title="launchTitle" :visible.sync="isShowCondition">
            <el-form v-if="launchType === 0">
                <el-form-item :label="item.policyName" v-for="item in selectStrategy" :key="item.policyName">
                    <el-checkbox
                            v-model="v.choosed"
                            v-for="v in item.childs"
                            :key="v.crowdId"
                            disabled
                    >{{v.crowdName}}
                    </el-checkbox>
                </el-form-item>
            </el-form>
            <div v-if="launchType === 1">{{selectStrategy}}</div>
        </el-dialog>

        <!-- 投放提示 -->
        <el-dialog :visible.sync="showLaunchTip" title="投放提醒">
            <div class="choose-tip">{{ launchTip }}</div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showLaunchTip = false">取 消</el-button>
                <el-button type="primary" @click="confirmLaunch">投 放</el-button>
            </span>
        </el-dialog>

        <!-- 投放提示估算弹窗 -->
        <el-dialog :visible.sync="showEstimate">
            <div class="choose-tip">请选择下列需要估算的字段，勾选保存后将估算该字段的人群数量</div>
            <el-checkbox-group v-model="estimateValue" :disabled="accountDefine" aria-required="true">
                <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
            <div v-show='showError' class="error-msg">请至少选择一个要投放的人群</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEstimate = false">取 消</el-button>
                <el-button type="primary" @click="handleEstimate(estimateValue)">投放</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="showDivide" title="圈定人群划分AB test">
            <el-form :model="divideForm" label-width="120px">
                <div class="first-step" v-show="step === 1">
                    <div>第一步：填写人群份数</div>
                    <el-form-item label="人群划分份数：">
                        <el-select size="mini" v-model="copies">
                            <el-option v-for="(part,index) in parts"
                                       :key="index"
                                       :label="part"
                                       :value="part"
                            >
                            </el-option>
                        </el-select>份
                    </el-form-item>
                    <div><el-button type="primary" @click="firstStep">下一步</el-button></div>
                </div>
                <div class="first-step" v-show="step === 2">
                    <div>第二步：设置人群占比</div>
                    <el-form-item label="各人群占比：">
                        <div class="block" v-for="(item,index) in copiesItem" :key="index">
                            <span>人群_{{alphaData[index]}}<span class="show-percent">{{percent[index]}}%</span></span>
                            <el-slider v-model="percent[index]" :key="item"></el-slider>
                        </div>
                    </el-form-item>
                    <el-form-item label="比例总和：">{{percentTotal}}</el-form-item>
                    <div>
                        <el-button type="primary" @click="step = 1">上一步</el-button>
                        <el-button type="primary" @click="secondStep">下一步</el-button>
                    </div>
                </div>
                <div class="first-step" v-show="step === 3">
                    <div>第三步：勾选计算的类型</div>
                    <el-form-item label="">
                        <el-checkbox-group v-model="divideForm.calType" aria-required="true">
                            <el-checkbox v-for="(item,index) in divideEstimateItems" :label="parseInt(item.value)" :key="index">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <div>
                        <el-button type="primary" @click="step = 2">上一步</el-button>
                        <el-button type="warning" @click="finish(0)">存稿不投放</el-button>
                        <el-button type="primary" @click="finish(1)">投放</el-button>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!-- 计算失败弹窗 -->
        <el-dialog :visible.sync="showCountFailDialog" title="计算失败">
            <div class="count-fail-text">计算失败，原因可能是sql出错或者大数据计算失败，若想再次计算，请重新点击【投放】按钮</div>
        </el-dialog>
        <!-- 自定义人群 划分详情弹窗 -->
        <el-dialog :visible.sync="showDivideDetailDialog" title="划分详情">
            <el-table :data="DivideTableData" style="width: 100%;" stripe border>
                <el-table-column prop="id" label="投放子ID"></el-table-column>
                <el-table-column prop="launchName" label="人群名称"></el-table-column>
                <el-table-column prop="ratio" label="占比">
                    <template slot-scope="scope">
                        {{scope.row.ratio}}%
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="数量"></el-table-column>
            </el-table>
            <!--<el-table :data="DivideTableData" style="width: 100%;" stripe border v-else>-->
                <!--<el-table-column prop="crowdId" label="投放子ID"></el-table-column>-->
                <!--<el-table-column prop="crowdName" label="人群名称"></el-table-column>-->
                <!--<el-table-column prop="ratio" label="占比">-->
                    <!--<template scope="scope">-->
                        <!--{{scope.row.ratio}}%-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column prop="count" label="数量"></el-table-column>-->
            <!--</el-table>-->
        </el-dialog>
        <commit-history-dialog
                :setShowCommitHistoryDialog="setShowCommitHistoryDialog"
                :crowdId="currentCrowdId"
                @closeDialog="setShowCommitHistoryDialog = false"
                @submit="handleSubmitHistory"
        ></commit-history-dialog>
        <el-dialog title="投放详情" :visible.sync="showLaunchDetail">
            <el-form :form="launchDetailFormData" label-width="140px">
                <el-form-item label="创建时间：">{{launchDetailFormData.createTime || '暂无数据'}}</el-form-item>
                <el-form-item label="是否更新：">{{updateEnum[launchDetailFormData.autoVision] || '暂无数据'}}</el-form-item>
                <el-form-item label="更新时间：">{{launchDetailFormData.autoTime || '暂无数据'}}</el-form-item>
                <el-form-item label="任务调度是否更新：">{{updateEnum[launchDetailFormData.autoUpdate] || '暂无数据'}}</el-form-item>
                <el-form-item label="任务调度：">
                    <div v-if="launchDetailFormData.logs.length > 0">
                        <div v-for="(item,index) in launchDetailFormData.logs" :key="index">{{item}}</div>
                    </div>
                    <div v-else>暂无数据</div>
                </el-form-item>
                <el-form-item label="所属标签分类：">{{launchDetailFormData.tempTag || '暂无数据'}}</el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="数据监控" :visible.sync="monitorDialog">
            <el-date-picker
              v-model="monitorRangeTime"
              type="daterange"
              align="right"
              @change="getDataMonitor"
              class="monitor-time"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <div class="monitor-legend" v-if="isShowMonitorTab">
            <el-radio-group v-model="monitorTab">
              <el-radio-button label="mac" >设备数量</el-radio-button>
              <el-radio-button label="wx" >wxopenId</el-radio-button>
          </el-radio-group>
          </div>
          <ve-histogram
                  v-if="(monitorTab ==='mac' && isShowMonitorTab) || (chartMonitorMacData && !isShowMonitorTab)"
                  :settings="{ yAxisName: ['设备数量'], xAxisType: ['value']}"
                  :extend="chartExtend"
                  :data="chartMonitorMacData">
          </ve-histogram>
          <ve-histogram
                  v-if="(monitorTab ==='wx' && isShowMonitorTab) || (chartMonitorWxData && !isShowMonitorTab)"
                  :settings="{ yAxisName: ['wxopenId'], xAxisType: ['value']}"
                  :extend="chartExtend"
                  :data="chartMonitorWxData">
          </ve-histogram>
        </el-dialog>
        <el-dialog title="调整波动阀值" :visible.sync="adjustDialog" :width="screenWidth >1100 ? '1020px' : '80%'">
            <ve-line :data="adjustChartdata" :settings="{ yAxisType: ['percent']}" :extend="adjustExtend"></ve-line>
            <el-form :inline="true">
            <el-row>
             <el-col :span="7">
               <el-form-item label="Mac数量基准" prop="macInitialValue">
                      <el-input v-model="crowdDefineForm.macInitialValue" :disabled="true"></el-input>
                  </el-form-item>
             </el-col>
             <el-col :span="8">
                <el-row>
                   <el-col :span="18">
               <el-form-item label="环比低于" label-width="100px" prop="macBelowPer">
                      <el-input-number v-model="crowdDefineForm.macBelowPer" :precision="2"  :min="1"></el-input-number>
                  </el-form-item>
                  </el-col>
                  <el-col :span="6">
                  <el-form-item label="%,则告警">
                  </el-form-item>
                    </el-col>
                 </el-row>
             </el-col>
              <el-col :span="8">
                <el-row>
                   <el-col :span="18">
                 <el-form-item label="环比高于" label-width="100px"  prop="macAbovePer">
                      <el-input-number v-model="crowdDefineForm.macAbovePer" :precision="2"  :min="1" :max="100"></el-input-number>
                  </el-form-item>
                  </el-col>
                    <el-col :span="6">
                  <el-form-item label="%,则告警">
                  </el-form-item>
                    </el-col>
                 </el-row>
              </el-col>
            </el-row>
            <el-row>
               <el-col :span="7">
                 <el-form-item label="微信数量基准" prop="wxInitialValue">
                   <el-input v-model="crowdDefineForm.wxInitialValue" :disabled="true"></el-input>
                  </el-form-item>
               </el-col>
               <el-col :span="8">
                 <el-row>
                   <el-col :span="18">
                 <el-form-item label="环比低于" label-width="100px" prop="wxBelowPer">
                      <el-input-number v-model="crowdDefineForm.wxBelowPer" :precision="2"  :min="1"></el-input-number>
                  </el-form-item>
                   </el-col>
                   <el-col :span="6">
                  <el-form-item label="%,则告警">
                  </el-form-item>
                    </el-col>
                 </el-row>
               </el-col>
               <el-col :span="8">
                 <el-row>
                   <el-col :span="18">
                  <el-form-item label="环比高于" label-width="100px"  prop="wxAbovePer">
                      <el-input-number v-model="crowdDefineForm.wxAbovePer" :precision="2"  :min="1" :max="100"></el-input-number>
                  </el-form-item>
                     </el-col>
                  <el-col :span="6">
                  <el-form-item label="%,则告警">
                  </el-form-item>
                    </el-col>
                 </el-row>
               </el-col>
            </el-row>
            <el-row justify="end" v-if="selectedRow && selectedRow.history && selectedRow.history.status === 91">
               <el-col :span="4" :offset="20">
               <el-button @click="adjustDialog=false">取消</el-button>
               <el-button type="primary" @click="handleFluctuationLaunch">确定调整</el-button>
               </el-col>
            </el-row>
             </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import CommitHistoryDialog from '@/components/CommitHistory'
    export default {
        components: {
            CommitHistoryDialog
        },
        data() {
            return {
                // 表格当前页数据
                tableData: [],
                launchStatusEnum: {},
                //搜索条件
                criteria: {},
                // 列表页
                searchForm: {
                    launchName: ""
                },
                adjustExtend: {
                  series: {
                    smooth: false,
                    type: 'line'
                  }
                },
                screenWidth: undefined,
                crowdDefineForm: {
                    macInitialValue: undefined, //Mac基准值
                    macAbovePer: undefined, //Mac最大阈值
                    macBelowPer: undefined, //Mac最小阈值
                    wxInitialValue: undefined, //微信基准值
                    wxAbovePer: undefined, //微信最大阈值
                    wxBelowPer: undefined, //微信最小阈值
                },
                // 编辑页
                // editFormVisible: false,// 编辑界面是否显示
                // 默认每页数据量:pageSize
                pageSize: 10,
                // 当前页码:pageNum
                currentPage: 1,
                // 查询的页码
                start: 1,
                // 默认数据总数
                totalCount: 1,
                isShowCondition: false,
                selectStrategy: null,//人群条件的选择策略
                adjustDialog: false,
                adjustChartdata: undefined, // 调整波动阀值图表数据
                monitorDialog: false,
                monitorRangeTime: undefined,
                chartMonitorMacData: undefined, // 数据监控设备图表数据
                chartMonitorWxData: undefined, // 数据监控设备图表数据
                selectedRow: {},
                monitorTab: 'mac',
                showEstimate: false,
                showLaunchTip: false,
                launchTip: '',
                currentLaunchRow: {},
                estimateValue: ['0'],
                estimateItems: [],
                currentLaunchId: '',
                showError: false,
                launchType: undefined,
                launchTitle: '',
                showDivide: false,
                parts: [2,3,4,5],
                copies: 2,
                step: 1,
                divideForm: this.genDefaultDivideForm(),
                copiesItem: [],
                percent: [],
                alphaData: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
                divideEstimateItems: [],
                showCountFailDialog: false,
                percentTotal: 0,
                showDivideDetailDialog: false,
                DivideTableData: [],
                // dialogType: false,
                setShowCommitHistoryDialog: false,
                currentCrowdId: undefined,
                crowdType: {
                    0: '普通人群',
                    1: '自定义人群'
                },
                checkList: ['status','totalWxOpenid','totalUser'],
                showLaunchDetail: false,
                launchDetailFormData: {
                    createTime: '',
                    autoUpdate: null,
                    autoTime: '',
                    logs:[],
                    tempTag: '',
                    autoVision: null
                },
                updateEnum: {
                    0: '否',
                    1: '是'
                },
                chartExtend: {
                    xAxis: {
                        axisLabel: {
                            margin: 15,
                            interval: 0,
                            rotate: 45
                        },
                        triggerEvent: true
                    }
                },
                accountDefine: false
            };
        },
        props: ["parentSource","showAllParent"],
        created() {
            this.screenWidth = window.screen.width
            this.loadData();
            this.monitorRangeTime = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.$moment().subtract(0, 'days').format('YYYY-MM-DD')]
        },
        computed: {
          isShowMonitorTab () {
            return this.chartMonitorMacData && this.chartMonitorWxData
          }
        },
        watch: {
            percent(val) {
                this.percentTotal = val.reduce((prev ,cur) => {
                    return prev + cur
                })
            },
            showAllParent () {
                this.loadData()
            }
        },
        methods: {
            genDefaultDivideForm (preset) {
                return {
                    launchCrowdId: undefined,
                    pct: [],
                    calType: [],
                    ...preset
                }
            },
            callback() {
                this.loadData();
            },
            handleAdd() {
                this.$emit("changeStatus", false, 0)
            },
            handleCrowdDefineAdd() {
                this.$emit("changeStatus", false, 1)
            },
            handleEdit(launchCrowdItem) {
                this.$emit("changeStatus", false, launchCrowdItem.isFxFullSql, launchCrowdItem.launchCrowdId, this.launchStatusEnum[launchCrowdItem.history.status].code)
            },
            condition(row) {
                this.isShowCondition = true
                this.$service
                    .MultiVersionCrowdPeople({ launchCrowdId: row.launchCrowdId })
                    .then(data => {
                        this.launchType = data.type
                        if ( data.type === 1) {
                            this.launchTitle = '人群条件'
                            this.selectStrategy = data.sqlRule
                        }
                        else {
                            this.launchTitle = '选择的策略'
                            this.selectStrategy = data.respcl
                        }
                    })
            },
            del(row) {
                var id = row.launchCrowdId
                this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$service.delMultiVersionCrowd(id, "删除成功").then(() => {
                            this.callback()
                        })
                    })
                    .catch(() => {
                    })
            },
            // 从服务器读取数据
            loadData () {
                this.$service.getListDimension({type: 3}).then(data => {
                    if (data) {
                        if (data.behaviorShow) {
                            this.checkList = data.behaviorShow.split(',')
                        }
                    }
                })
                this.criteria["pageNum"] = this.currentPage
                this.criteria["pageSize"] = this.pageSize
                if(this.showAllParent) {
                    this.$service.getMyMultiVersionCrowd(this.criteria).then(data => {
                        this.launchStatusEnum = data.launchStatusEnum
                        this.tableData = data.pageInfo.list
                        this.totalCount = data.pageInfo.total
                    })
                }else {
                    this.$service.getMultiVersionCrowd(this.criteria).then(data => {
                        this.launchStatusEnum = data.launchStatusEnum
                        this.tableData = data.pageInfo.list
                        this.totalCount = data.pageInfo.total
                    })
                }
            },
            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange: function(val) {
                this.pageSize = val
                this.loadData()
            },
            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange: function(val) {
                this.currentPage = val
                this.loadData()
            },
            // 搜索,提交表单
            handleSearch () {
                this.criteria = this.searchForm
                this.loadData()
            },
            // submitForm: function() {
            //     // var _this = this
            //     // this.$refs.searchForm.validate(function(result) {
            //     //     if (result) {
            //     //         _this.criteria = _this.searchForm;
            //     //         _this.loadData()
            //     //     } else {
            //     //         return false
            //     //     }
            //     // });
            //     this.$refs.searchForm.validate((result) => {
            //         if (result) {
            //            this.criteria = this.searchForm
            //            this.loadData()
            //         } else {
            //             return false
            //         }
            //     })
            // },
            // 重置
            handleReset () {
                this.searchForm.launchName = ''
                this.criteria = {}
                this.loadData()
            },

            // 修改状态
            lanuch (index, row) {
                this.currentLaunchRow = row
                this.currentLaunchId = row.launchCrowdId
                const parmas = {
                    crowdIds: this.currentLaunchId
                }
                this.$service.alertLaunch(parmas).then((data) => {
                    // eslint-disable-next-line no-debugger
                    this.showLaunchTip = true
                    this.launchTip = data
                })
                // this.currentLaunchId = row.launchCrowdId
                // this.showEstimate = true
                // // 当普通投放，勾选了 账号去重关联，投放默认置灰且全部勾选
                // if (row.setCalculate) {
                //     this.accountDefine = true
                //     this.estimateValue = ['0','1','2','3']
                // } else {
                //     this.accountDefine = false
                //     this.estimateValue = ['0']
                // }
                // this.$service.getEstimateType().then((data) => {
                //     this.estimateItems = data
                // })
            },
            
            // 确认投放
            confirmLaunch () {
                this.showLaunchTip = false
                this.showEstimate = true
                // 当普通投放，勾选了 账号去重关联，投放默认置灰且全部勾选
                if (this.currentLaunchId.setCalculate) {
                    this.accountDefine = true
                    this.estimateValue = ['0','1','2','3']
                } else {
                    this.accountDefine = false
                    this.estimateValue = ['0']
                }
                this.$service.getEstimateType().then((data) => {
                    this.estimateItems = data
                })
            },

            handleEstimate (calTypes) {
                if (calTypes.length === 0) {
                    this.$message.error('请至少选择一个要投放的人群')
                    return
                }
                let calIdType = calTypes.map((item) => item).join(',')
                this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId,calIdType: calIdType },"投放成功").then(() => {
                    this.showEstimate = false
                    this.callback()
                })
            },
            // handleEstimate () {
            //     if (this.estimateValue.length === 0) {
            //         this.showError = true
            //         return
            //     } else {this.showError = false}
            //     let calIdType = this.estimateValue.map((item) => item).join(',')
            //     this.$service.LaunchMultiVersionCrowd({ launchCrowdId: this.currentLaunchId,calIdType: calIdType },"投放成功").then(() => {
            //         this.showEstimate = false
            //         this.callback()
            //     })
            // },
            cancelLanuch(row) {
                var id = row.launchCrowdId;
                this.$confirm("确定要取消投放吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$service.cancelLaunchMultiVersionCrowd({ launchCrowdId: id },"取消投放成功").then(() => {
                            this.callback()
                        })
                    })
                    .catch(() => {
                    })
            },
            // 对象转成数组
            objectToArray (obj) {
                let arr = []
                for (let i in obj) {
                    arr.push({ value: i, label: obj[i] })
                }
                return arr
            },
            handleCommandOpreate(scope) {
                const type = scope[0]
                const params = scope[1]
                switch (type) {
                    case 'edit':
                        this.handleEdit(params)
                        break
                    case 'del':
                        this.del(params)
                        break
                    case 'divide':
                        this.divideAB(params)
                        break
                    case 'commitHistory':
                        this.handleCommitHistory(params)
                        break
                    case 'collect':
                        this.handlePushCollect(params)
                        break
                    case 'adjust':
                        this.handleAdjust(params)
                        break
                    case 'monitor':
                        this.handleMonitor(params)
                        break
                }
            },
            handleFluctuationLaunch () {
              const crowdDefineForm = JSON.parse(JSON.stringify(this.crowdDefineForm))
              const macInitialValue = crowdDefineForm.macInitialValue
              const wxInitialValue = crowdDefineForm.wxInitialValue
              crowdDefineForm.macInitialValue = macInitialValue ? macInitialValue.replace(/,/g, '') : undefined
              crowdDefineForm.wxInitialValue = wxInitialValue ? wxInitialValue.replace(/,/g, '') : undefined
              this.$service.fluctuationLaunch({ launchCrowdId: this.selectedRow.launchCrowdId, ...crowdDefineForm }, '调整成功').then(() => {
                this.adjustDialog = false
              })
            },
            /**
             * 千分位格式化
            */
            format_number(n) {
              var b = parseInt(n).toString()
              var len = b.length
              if (len <= 3) { return b }
              var r = len % 3
              return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',')
            },
            handleAdjust (row) {
               this.adjustDialog = true
               this.selectedRow = row
               this.$service.fluctuation({ launchCrowdId: row.launchCrowdId}).then((data) => {
                 const { macInitialValue, macAbovePer, macBelowPer, wxInitialValue, wxAbovePer, wxBelowPer } = data.multiVersionCrowd
                 this.crowdDefineForm = {
                   macInitialValue: macInitialValue === null ? undefined : this.format_number(macInitialValue),
                   macAbovePer: macAbovePer === null ? undefined : macAbovePer,
                   macBelowPer: macBelowPer === null ? undefined : macBelowPer,
                   wxInitialValue: wxInitialValue === null ? undefined : this.format_number(wxInitialValue),
                   wxAbovePer: wxAbovePer === null ? undefined : wxAbovePer,
                   wxBelowPer: wxBelowPer === null ? undefined : wxBelowPer,
                 }
                 this.adjustChartdata = {
                   columns: ['日期', 'mac数量波动', '微信数量波动']
                 }
                 const rows = data.data.reduce((r, c) => {
                   r.push({
                     '日期': c.date,
                     'mac数量波动': c.macTrendPer,
                    '微信数量波动': c.wxTrendPer
                   })
                   return r
                 }, [])
                 this.adjustChartdata = {
                   columns: ['日期', 'mac数量波动', '微信数量波动'],
                   rows
                 }
               })
            },
            handleMonitor (row) {
               this.monitorDialog = true
               this.selectedRow = row
               this.getDataMonitor()
            },
            setMonitorFormart (data) {
              const columns = ['日期', 'SQL圈定的人群数量', 'DMP收到的人群数量']
              const rows = data.reduce((r, c) => {
                  r.push({
                    'DMP收到的人群数量': c.rec_num,
                    'SQL圈定的人群数量': c.cul_num,
                    '日期': c.date,
                  })
                  return r
                }, [])
              return {
                columns,
                rows
              }
            },
            getDataMonitor () {
               const monitorRangeTime = this.monitorRangeTime
               const startDate = monitorRangeTime[0]
               const endDate = monitorRangeTime[1]
               this.$service.dataMonitor({ launchCrowdId: this.selectedRow.launchCrowdId, startDate, endDate}).then((data) => {
                 // const colunms = ['日期', 'SQL圈定的人群数量', 'DMP收到的人群数量']
                 this.monitorTab = data.mac ? 'mac' : 'wx'
                 this.chartMonitorMacData = data.mac ? this.setMonitorFormart(data.mac) : undefined
                 this.chartMonitorWxData = data.wx ? this.setMonitorFormart(data.wx) : undefined
                 // if (data.mac) {
                 //   this.chartMonitorMacData = this.setMonitorFormart(data.mac)
                 // }
                 // if (data.wx) {
                 //   this.chartMonitorWxData = this.setMonitorFormart(data.wx)
                 // }
               })
            },
            divideAB (row) {
                this.showDivide = true
                this.step = 1
                // 重置AB TEST 数据
                this.copies = 2
                const divideForm = this.genDefaultDivideForm()
                divideForm.launchCrowdId = row.launchCrowdId
                this.divideForm = divideForm
            },
            firstStep () {
                this.step = 2
                const copies = this.copies
                let arr = []
                let percentArray = []
                for (let i=0;i<copies;i++) {
                    arr.push(i)
                    percentArray.push(parseInt(100/copies))
                }
                let total = percentArray.reduce((prev ,cur) => {
                    return prev + cur
                })
                // 默认百分比设置，总和必须为100%，不能被整除的，都加在最后一个上
                if (100%copies !== 0) {
                    const lastPercent = 100 - total
                    percentArray[copies-1] = percentArray[copies-1] + lastPercent
                }
                this.copiesItem = arr
                this.percent = percentArray
            },
            secondStep () {
                if (this.percentTotal !== 100) {
                    this.$message.error('所有比例总和必须等于100%')
                    return
                }else {
                    this.step = 3
                    this.divideForm.pct = this.percent
                    this.$service.getEstimateType().then((data) => {
                        this.divideEstimateItems = this.objectToArray(data)
                    })
                }
            },
            finish (saveType) {
                const model = this.divideForm.launchCrowdId
                // const divideForm = JSON.stringify(this.divideForm)
                const divideForm = this.divideForm
                if (divideForm.calType.length === 0) {
                    this.$message.error('请至少勾选一个计算的类型进行投放')
                    return
                }
                let formData = {
                    pct: divideForm.pct,
                    calType: divideForm.calType
                }
                this.$service.ABTestAdd({model: model,data: formData},"新增A/B test划分成功").then(() => {
                    this.showDivide = false
                    this.callback()
                    if (saveType === 1) {
                        this.currentLaunchId = this.divideForm.launchCrowdId
                        this.handleEstimate(formData.calType)
                    }
                })
            },
            handleCountFail () {
                this.showCountFailDialog = true
            },
            showABTestDetail (row) {
                const launchCrowdId = row.launchCrowdId
                this.$service.getABTestDetail(launchCrowdId).then((data) => {
                    this.showDivideDetailDialog = true
                    // this.dialogType = data.IsFxFullSql === 1
                    this.DivideTableData = data.abTestRatio
                })
            },
            handleCommitHistory (row) {
                this.setShowCommitHistoryDialog = true
                this.currentCrowdId = row.launchCrowdId
            },
            handleSubmitHistory (formData) {
                let submitForm = {
                    isSubmit: formData.isSubmit,
                    launchCrowdId: formData.id,
                    dateNum: formData.dateNum
                }
                this.$service.submitMultiHistoryData(submitForm, formData.isSubmit === 1 ? '提交历史数据成功' : '关闭提交成功').then(()=> {
                    this.setShowCommitHistoryDialog = false
                })
            },
            // 投放详情弹窗
            handleGetLaunchDetail (row) {
                this.showLaunchDetail = true
                this.$service.getPushLaunchDetail(row.launchCrowdId).then(data => {
                    this.launchDetailFormData = data
                })
            },
            handlePushCollect (row) {
                const collectFlag = row.myCollect
                const launchCrowdId = row.launchCrowdId
                if (collectFlag) {
                    this.$service.removeCollectPush({launchCrowdId},'成功取消收藏此圈定人群！').then(() => {
                        this.loadData()
                    })
                } else {
                    this.$service.collectPush({launchCrowdId},'成功收藏圈定人群！').then(() => {
                        this.loadData()
                    })
                }
            },
            handleCheckListChange (val) {
                this.$service.saveListDimension({type: 3,behaviorShow: val.join(',')})
            }
        }
    }
</script>
<style lang="stylus" scoped>
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
      width 150px
    .ratio
      width 130px
    .monitor-time
      margin-bottom 30px
    .monitor-legend
      text-align center
      margin-bottom 30px
    .choose-tip
        margin 20px 0
        color red
    .launch-list >>> .button-group-position .el-button
        margin 3px
    .error-msg
        color red
        font-size 14px
        margin-top 10px
    .button-list >>> .el-button + .el-button
        margin 0 10px
    .button-list >>> .el-button
        border-radius 3px
    .manual
        margin 20px
    /*.block*/
        /*width 80%*/
        /*display inline-block*/
    /*.button-group-position >>> .el-dropdown-menu__item*/
        /*text-align center*/
    .count-fail-text
        color red
    .show-percent
        color red
        margin-left 20px
    .button-list
        display flex
        align-items center
    .uneffective
        position relative
        cursor pointer
        .circle
            position absolute
            display inline-block
            width 12px
            height 12px
            border 1px solid
            border-radius 10px
            text-align center
            line-height 12px
    .red-text
        color red
    .popover-button
        margin-left 10px
    .operate
        position relative
        z-index 0
        font-size 20px
        cursor pointer
        margin-left 10px
    .search-input
        position relative
        margin 0 10px
    .icon-fixed
        position absolute
        top 8px
        right 20px
        transform rotate(-90deg)
    .header
        width 100%
        display flex
        justify-content space-between
        margin-bottom 10px
        .header-right
            display flex
            align-items center
    .el-button-group >>> .el-button
        float none
        margin 0 3px
</style>
