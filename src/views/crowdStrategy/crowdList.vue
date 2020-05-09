<template>
  <div>
  <div class="crowd-list">
    <fieldset>
      <legend>{{selectRow.policyName}}</legend>
      <div>
        <div class="left">
          策略ID：{{selectRow.policyId}}
          策略纬度:
          <el-tag
            size="mini"
            v-for="item in selectRow.tagsList"
            :key="item.tagId"
            :type= "item.dataSource === 2 ? 'danger' : (item.dataSource === 1 ? 'success' : '')"
          >{{item.tagName}}</el-tag>
        </div>
        <div class="right">
          <el-button size="small" type="success" @click="goBack">返回</el-button>
        </div>
      </div>
    </fieldset>
    <!-- authority -->
    <div class="TopNav">
      <div class="left">
        <el-button-group>
          <!-- <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-permission="'hoder:crowd:add'"
          >
            <a class="fa fa-plus" style="color: white"></a>新增人群
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-permission="'hoder:crowd:add'"
          >
            <a class="fa fa-plus" style="color: white"></a>新增人群
          </el-button>
          <el-tooltip placement="top-start">
            <div slot="content">点击将按人群优先级除去交叉部分，批量估算所有上架中的人群</div>
            <span class="uneffective">
              <el-button
                    type="success"
                    size="small"
                    @click="handleBatchEstimate"
                    :disabled="canBatchEstimate"
            >
              批量估算
              </el-button>
              <!--<span>?</span>-->
            </span>
          </el-tooltip>
          <!--<el-button type="primary" @click="handleClickRedirect">-->
            <!--新增重定向人群-->
          <!--</el-button>-->
          <!--<a class="manual" href="http://mgr-hoder.skysrt.com/hoder-manual/ren-qun-fen-ge-guan-li/ren-qun-lie-biao.html" target="_blank">操作指南</a>-->
        </el-button-group>
          <el-popover
                  placement="top"
                  trigger="click"
                  class="popover-button"
          >
              <div>
                  <el-checkbox-group v-model="checkList">
                      <el-checkbox label="createTime">创建时间</el-checkbox>
                      <el-checkbox label="creatorName">创建人</el-checkbox>
                      <el-checkbox label="apiStatus">是否生效</el-checkbox>
                      <el-checkbox label="department">业务部门</el-checkbox>
                      <el-checkbox label="remark">备注</el-checkbox>
                      <el-checkbox label="crowdValidStatus">是否有效期内</el-checkbox>
                  </el-checkbox-group>
              </div>
              <el-button slot="reference">选择列表展示维度</el-button>
          </el-popover>
      </div>
      <div class="right">
        <!-- form search -->
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchForm"
          @submit.native.prevent="submitForm"
          shiro:hasPermission="sysAdministrative:role:search"
        >
          <el-form-item label="人群上下架状态" prop="putway">
              <el-select v-model="searchForm.putway">
                  <el-option
                          v-for="item in putwayOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label prop="crowdName">
            <el-input v-model="searchForm.crowdName" style="width: 200px" placeholder="请输入人群名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="search" @click="submitForm">查询</el-button>
            <el-button type="primary" size="small" @click="handleReset">
              <a class="fa fa-refresh" style="color: white"></a> 重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- talbe -->
    <el-table ref="myTable" :data="tableData" style="width: 100%" stripe border
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="人群名称:">
              <span>{{ props.row.crowdName }}</span>
            </el-form-item>
            <el-form-item label="标签:">
              <div
                v-for="(item, index) in JSON.parse(props.row.rulesJson).rules"
                :key="index"
                class="detail"
              >
                <div v-if="index>0" class="label-or-space">或</div>

                <div class="label-ground">(
                  <div
                    v-for="(childItem,childItemIndex) in item.rules"
                    :key="childItem.tagId+childItemIndex"
                    class="label-item"
                  >
                    <div v-if="childItemIndex>0" class="label-or-space">且</div>
                    <span class="txt">{{ childItem.categoryName }}</span>
                    <span class="sel">{{ childItem.operator }}</span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                    <span class="in">
                      <!-- <el-date-picker
                        v-if="childItem.tagType === 'time'"
                        class="datetime-format"
                        v-model="childItem.tagCode"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker> -->
                      <span >{{ childItem.value }}</span>
                    </span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                  </div>)
                </div>
              </div>
            </el-form-item>
            <el-form-item label="人群状态">
                <crowdStatusItem :crowd-id="props.row.crowdId" :key="props.row.crowdId"></crowdStatusItem>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="crowdId" label="ID" width="50"></el-table-column>
      <el-table-column prop="crowdName" label="人群名称" width="200">
           <template scope="scope">
               <span v-if="scope.row.abMainCrowd === 0">{{scope.row.crowdName}}</span>
               <el-button type="text" v-else @click="showDivideResult(scope.row.crowdId)">{{scope.row.crowdName}}</el-button>
           </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="100">
          <template slot-scope="scope">
              <priorityEdit :data="scope.row.priority" :policyId="scope.row.policyId" :crowdId="scope.row.crowdId"></priorityEdit>
          </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('remark') > -1)" prop="remark" label="备注" width="90"></el-table-column>
      <el-table-column v-if="(checkList.indexOf('apiStatus') > -1)" prop="apiStatus" label="是否生效" width="90">
        <template scope="scope">
          <span v-if="scope.row.apiStatus === 1">已生效</span>
          <span v-if="scope.row.apiStatus === 0">
              <el-tooltip placement="right-start">
                <div v-if="scope.row.putway === 0" slot="content">人群未生效，因为该人群条件已下架</div>
                <div v-else slot="content">{{unActiveTips(scope.row.crowdValidStatus)}}</div>
                <!--<div v-else>-->
                   <!--&lt;!&ndash;<div v-if="scope.row.crowdValidStatus === 1" slot="content">{{ scope.row.crowdValidStatus }}人群未生效，因为该人群条件未生效</div>&ndash;&gt;-->
                   <!--<div v-if="scope.row.crowdValidStatus === 3" slot="content">{{ scope.row.crowdValidStatus }}人群未生效，因为该人群条件已过期</div>-->
                   <!--<div v-else slot="content">{{ scope.row.crowdValidStatus }}人群未生效，因为未点击该策略的"同步按钮"</div>-->
                <!--</div>-->
                <span class="uneffective">未生效<span>?</span></span>
              </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="putway" label="上/下架" width="70px">
        <template scope="scope">
          <span v-if="scope.row.putway === 1">上架中</span>
          <span v-if="scope.row.putway === 0">已下架</span>
        </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('crowdValidStatus') > -1)" prop="crowdValidStatus" label="是否有效期内" width="100px">
        <template scope="scope">
            {{crowdValidEnum[scope.row.crowdValidStatus] || '暂无数据'}}
        </template>
      </el-table-column>
      <el-table-column label="是否AB测试" width="100px">
          <template scope="scope">
              {{abStatusEnum[scope.row.abstatus]}}
              <!--<span v-if="scope.row.abMainCrowd === 1">是</span>-->
              <!--<span v-if="scope.row.abMainCrowd === 0">否</span>-->
          </template>
      </el-table-column>
      <el-table-column prop="forcastStatus" label="估算状态" width="90">
          <template scope="scope">
              <span v-if="scope.row.forcastStatus == 1">未估算</span>
              <span v-if="scope.row.forcastStatus == 2">估算中</span>
              <el-button type="text" v-if="scope.row.forcastStatus == 3" @click="showCountResult(scope.row.crowdId)">已估算</el-button>
              <span v-if="scope.row.forcastStatus == 4">估算失败</span>
          </template>
      </el-table-column>
      <el-table-column prop="limitLaunch" label="是否限制投放数量" width="120">
        <template scope="scope">
          <el-button type="text" v-if="scope.row.limitLaunch" @click="handleShowLimitLaunch(scope.row.limitLaunchCount)">是</el-button>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('createTime') > -1)" prop="createTime" label="创建时间" width="180">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" prop="creatorName" label="创建人" width="80"></el-table-column>
      <el-table-column v-if="(checkList.indexOf('department') > -1)" prop="department" label="业务部门" width="80"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template scope="scope">
          <el-button-group>
            <el-dropdown @command="handleCommandOpreate">
              <el-button size="small" type="primary">
                操作
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        :command="['edit',scope.row]"
                        v-permission="'hoder:crowd:edit'"
                        :disabled="scope.row.putway === 0"
                >编辑
                </el-dropdown-item>
                <el-dropdown-item
                        :command="['del',scope.row]"
                        v-permission="'hoder:crowd:del'"
                >删除
                </el-dropdown-item>
                <el-dropdown-item
                        :command="['upDown',scope.row]"
                >人群<span v-if="scope.row.putway === 1">下架</span><span v-else>上架</span>
                </el-dropdown-item>
                <el-dropdown-item
                        :command="['copy',scope.row]"
                        :disabled="scope.row.putway === 0"
                >人群复制
                </el-dropdown-item>
                <!--<el-dropdown-item-->
                <!--:command="['divide',scope.row]"-->
                <!--v-if="scope.row.abMainCrowd === 0"-->
                <!--&gt;A/B test划分-->
                <!--</el-dropdown-item>-->
                <el-dropdown-item
                        :command="['commitHistory',scope.row]"
                >提交历史数据
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              size="small"
              type="warning"
              @click="handleClickEstimate(scope.row)"
              :disabled="scope.row.putway === 0"
            >估算</el-button>
            <!--<el-button-->
                    <!--size="small"-->
                    <!--type="primary"-->
                    <!--@click="handleClickRedirectWithId(scope.row)"-->
            <!--&gt;新增重定向投放</el-button>-->
              <el-button
                      v-if="scope.row.abMainCrowd === 0 && !scope.row.limitLaunch"
                      size="small"
                      type="success"
                      @click="divideAB(scope.row,'addABTest')"
              >AB实验
              </el-button>
            <el-dropdown @command="handleCommandStastic">
              <el-button size="small" type="danger">
                统计
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        :command="['estimatedDetail',scope.row]"
                        v-if="scope.row.forcastStatus == 3"
                >估算画像</el-dropdown-item>
                <el-dropdown-item
                        :command="['detail',scope.row]"
                >投后效果</el-dropdown-item>
                <el-dropdown-item
                        :command="['homepageData',scope.row]"
                >看主页数据</el-dropdown-item>
                <!--<el-dropdown-item-->
                        <!--:command="['redirectCrowd',scope.row]"-->
                <!--&gt;重定向数据</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
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
  </div>
  <!-- 估算弹窗 -->
  <el-dialog :visible.sync="showEstimate">
    <div class="estimate-tips">说明：
      <div>1、会自动过滤自定义条件，只估算包含大数据标签的人群数量</div>
      <div>2、依据人群优先级去重估算，重合部分算入优先级高的人群</div>
      <div>3、该策略下上架中的人群将参与去重估算</div>
    </div>
    <el-checkbox-group v-model="estimateValue">
      <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" :disabled="index==0">{{item}}</el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showEstimate = false">取 消</el-button>
      <el-button type="primary" @click="handleEstimate">提交估算</el-button>
    </span>
  </el-dialog>
  <!-- 估算结果弹窗 -->
   <el-dialog :visible.sync="showResult" title="估算结果">
       <div class="estimate-tips">只估算包含大数据标签的人群数量为：（已按人群优先级除去交叉人群，交叉部分算入优先级高的人群）</div>
       <div>设备：{{totalUser}}<span v-if="totalUser == '暂无数据'" class="blue-tip">（你的人群条件查无数据，请重新设置人群条件）</span></div>
       <div>手机号：{{total1 === undefined ? '暂无数据':total1}}</div>
       <div>酷开openId：{{total2}}</div>
       <div>微信openId：{{total3}}</div>
   </el-dialog>
    <!-- 查看统计 投后效果弹窗-->
    <el-dialog
            :visible.sync="showStatistics"
            width="90%"
    >
      <div class="export-button">
          <a :href="launchedExportUrl" download ref="launchedDownLoad"></a>
          <el-button type="success" @click="handleLaunchedExport">导出数据</el-button>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time0"
                    @input="handleInputTime(0, $event, 'drawCrowdLine')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{hitLinesTitle}}</div>
          <div class="main" ref="hitLine" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time1"
                    @input="handleInputTime(1, $event, 'drawCrowdPie')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{hitPieTitle}}</div>
          <div class="main" ref="hitPie" v-if=" showStatistics === true"></div>
        </div>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time2"
                    @input="handleInputTime(2, $event, 'drawExposeLine')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{exposeLinesTitle}}</div>
          <div class="main" ref="exposeLine" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time3"
                    @input="handleInputTime(3, $event, 'drawExposePie')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{exposePieTitle}}</div>
          <div class="main" ref="exposePie" v-if=" showStatistics === true"></div>
        </div>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time4"
                    @input="handleInputTime(4, $event, 'drawClickLine')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{clickLinesTitle}}</div>
          <div class="main" ref="clickLine" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time5"
                    @input="handleInputTime(5, $event, 'drawClickPie')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{clickPieTitle}}</div>
          <div class="main" ref="clickPie" v-if=" showStatistics === true"></div>
        </div>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time6"
                    @input="handleInputTime(6, $event, 'crowdLaunchDetail')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{crowdLaunchTitle}}</div>
          <div class="funnel-tips">人群投放过程中的数据（单位：条）</div>
          <div class="main" ref="crowdLaunch" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time7"
                    @input="handleInputTime(7, $event, 'setProvinceData')"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{exposeProvinceTitle}}</div>
          <div class="main" ref="exposeProvince" v-if=" showStatistics === true"></div>
        </div>
      </div>
    </el-dialog>
    <!--上下架确认弹窗-->
    <el-dialog title="提示" :visible.sync="showUpDownDialog">
      <div>{{upDownTips}}</div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="showUpDownDialog = false">取 消</el-button>
      <el-button type="primary" @click="handleUpDown">确定</el-button>
    </span>
    </el-dialog>
    <!--复制选择策略-->
    <el-dialog title="将人群复制到以下策略" :visible.sync="showCopyDialog">
      <el-form :model="policyCopyForm" :rules="copyRules" ref="policyCopyForm" class="copy-form">
        <el-form-item label="选择策略" prop="policyIds">
          <el-select
                  v-model="policyCopyForm.policyIds"
                  multiple
                  filterable
          >
            <el-option
              v-for="(item,index) in allPolices"
              :key="index"
              :label="item.policyId+'-'+item.policyName"
              :value="item.policyId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCopy('policyCopyForm')">确定</el-button>
          <el-button @click="handleCancelCopy('policyCopyForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 统计 估算画像 -->
    <el-dialog
            :visible.sync="showEstimateEcharts"
            width="90%"
            title="该人群估算出的用户画像"
    >
      <div class="export-button">
          <a :href="downloadUrl" download ref="download_Url"></a>
          <el-button type="success" @click="handleDownload">导出数据</el-button>
      </div>
      <div>
        <!--<div class="estimate-item">-->
          <!--<div class="estimate-title">基本信息</div>-->
          <!--<div class="estimate-statistic">-->
            <!--&lt;!&ndash;<div ref="circleSex" class="base-info-circle-echarts"></div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div ref="circleAge" class="base-info-circle-echarts"></div>&ndash;&gt;-->
            <!--<div ref="circleDevice" class="base-info-circle-echarts"></div>-->
          <!--</div>-->
        <!--</div>-->
        <div class="estimate-item">
          <div class="estimate-title">基本信息</div>
            <div class="estimate-statistic">
                <div class="province-city-active-content city-info-echarts">
                    <div ref="provinceMap" class="province-map"></div>
                    <div class="city-active-proportion" v-if="cityData">
                        <div class="city-active-proportion--title">城市活跃比</div>
                        <template v-if="cityData.length > 0">
                            <div  v-for="(item,index) in cityData" :key="index" class="city-active-proportion--name">
                                {{item.name}}:{{item.value}}
                            </div>
                        </template>
                        <div v-else>暂无数据</div>
                    </div>
                </div>
                <div class="city-info-echarts">
                    <div class="table-title">Top50城市活跃排名(近30天活跃)</div>
                    <Table
                            :props="table.props"
                            :header="table.header"
                            :data="table.data"
                            class="table-overflow"
                    >
                    </Table>
                </div>
                <div ref="circleDevice" class="base-info-circle-echarts" style="border: none;height: 300px"></div>
            </div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">用户类别</div>
          <div class="member-select">
              <div class="member-select--text">按会员权益</div>
              <el-select v-model="memberListType">
                  <template v-for="(item,index) in memberList">
                      <el-option
                              :key="index"
                              :label="item.label"
                              :value="item.value"
                      ></el-option>
                  </template>
              </el-select>
          </div>
          <div ref="member" class="member-total"></div>
          <div class="estimate-statistic">
              <div ref="memberActiveTime" class="member-total-item"></div>
              <div ref="memberMainPageActiveTime" class="member-total-item"></div>
              <div ref="memberExpirationTime" class="member-total-item"></div>
          </div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">付费分布</div>
          <div class="member-select">
              <div class="member-select--text">按会员权益</div>
              <el-select v-model="memberListByPay">
                  <template v-for="(item,index) in memberList">
                      <el-option
                              :key="index"
                              :label="item.label"
                              :value="item.value"
                      ></el-option>
                  </template>
              </el-select>
          </div>
          <div ref="payDetail" class="member-total"></div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">观影行为</div>
            <div>
                <div class="watch-tv-behavior">
                    <div class="member-select">
                        <div class="member-select--text">近7日/30日起播活跃率（有起播行为等活跃天数7日/或30日）</div>
                        <el-select v-model="expirationDay">
                            <template v-for="(item,index) in objectToArray(expirationDayList)">
                                <el-option
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="userBehavior" ref="userBehavior"></div>
                </div>
                <div class="watch-tv-behavior userBehavior" ref="watchPrefer"></div>
            </div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">活跃行为</div>
          <div ref="activeBehavior" class="activeBehaviorEcharts"></div>
        </div>
      </div>
    </el-dialog>
      <!--已划分弹窗显示-->
      <el-dialog :visible.sync="showDivideDetail" title="划分详情">
          <el-table :data="DivideTableData" style="width: 100%;" stripe border>
              <el-table-column prop="crowdId" label="投放子ID"></el-table-column>
              <el-table-column prop="crowdName" label="人群名称"></el-table-column>
              <el-table-column prop="ratio" label="占比">
                  <template scope="scope">
                      {{scope.row.ratio}}%
                  </template>
              </el-table-column>
              <el-table-column prop="count" label="数量"></el-table-column>
              <el-table-column label="操作" width="250">
                  <template scope="scope">
                      <el-button type="danger" @click="currentCid = scope.row.crowdId; showCrowdDetailDialog()">投后效果</el-button>
                      <el-button type="primary" @click="handleSeeHomepageData(scope.row.crowdId,scope.row.crowdName)">看主页数据</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </el-dialog>
      <commit-history-dialog
              :setShowCommitHistoryDialog="setShowCommitHistoryDialog"
              :crowdId="currentCrowdId"
              @closeDialog="setShowCommitHistoryDialog = false"
              @submit="handleSubmitHistory"
      ></commit-history-dialog>
      <el-dialog :visible.sync="showLimitLaunchDialog">
        <div>限制投放数量为：{{this.showLimitLaunchCount}}</div>
      </el-dialog>
  </div>
</template>
<script>
import { Table} from 'admin-toolkit'
import priorityEdit from '../../components/PriorityEdit'
import crowdStatusItem from './CrowdStatusItem'
import CommitHistoryDialog from '@/components/CommitHistory'
export default {
  components: {
      Table,
      priorityEdit,
      crowdStatusItem,
      CommitHistoryDialog
  },
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      //搜索条件
      criteria: {
        //  policyId:selectRow.policyId
      },
      searchForm: {
        crowdName: "",
        putway: ''
      },
      // 编辑页
      // editFormVisible: false,// 编辑界面是否显示
      // 默认每页数据量:pageSize
      pageSize: 10,
      // 当前页码:pageNum
      currentPage: 1,
      totalCount: 1,
      // 查询的页码
      start: 1,
      estimateItems: [],
      showEstimate: false,
      estimateValue: ['0'],
      estimateId: '',
        showResult: false,
        total1: undefined,
        total2: undefined,
        total3: undefined,
        totalUser: undefined,
        total4: undefined,
        time0: [],
        time1: [],
        time2: [],
        time3: [],
        time4: [],
        time5: [],
        time6: [],
        time7: [],
        showStatistics: false,
        hitLinesTitle: '',
        hitPieTitle: '',
        exposeLinesTitle: '',
        exposePieTitle: '',
        clickLinesTitle: '',
        clickPieTitle: '',
        crowdLaunchTitle: '',
        exposeProvinceTitle: '',
        startDate: '',
        endDate: '',
        currentCid: undefined,
        showUpDownDialog: false,
        upDownTips: '',
        currentTag: '',
        showCopyDialog: false,
        allPolices: [],
        policyCopyForm: {
          policyIds: []
        },
        copyRules: {
            policyIds: [
                {type: 'array', required: true, message: '请至少选择一个策略', trigger: 'change'}
            ]
        },
        showEstimateEcharts: false,
        table: {
            props: {},
            header: [
                {
                    label: '排名',
                    width: '50',
                    type: 'index'
                },
                {
                    label: '省份',
                    prop: 'name'
                },
                {
                    label: '活跃数量',
                    prop: 'value'
                },
                {
                    label: '占比',
                    prop: 'PCT'
                }
            ],
            data: []
        },
        cityData: null,
        memberList: [],
        memberListType: '',
        memberListByPay: '',
        expirationDayList: {
          '7': '近7日',
          '30': '近30日'
        },
        expirationDay: '7',
        fillEmptyData: {
          data: [{name: '总量',value: 0}],
          name: {data: ['总量']}
        },
        putwayOptions: [
            {
                value: '',
                label: '全部状态'
            },
            {
                value: 1,
                label: '上架'
            },
            {
                value: 0,
                label: '下架'
            }
        ],
        showDivideDetail: false,
        DivideTableData: [],
        setShowCommitHistoryDialog: false,
        currentCrowdId: undefined,
        abStatusEnum: {},
        checkList: ['apiStatus','crowdValidStatus'],
        downloadUrl: undefined,
        launchedExportUrl: undefined,
        crowdValidEnum: {},
        canBatchEstimate: false,
        estimateType: undefined,
        showLimitLaunchDialog: false,
        showLimitLaunchCount: undefined
    }
  },
  props: ["selectRow"],
  created() {
        // 高阶函数
      // this.$watch('time2', this.createTimeWatcher(2, 'drawExposeLine'))

      this.loadData()
      const start = new Date()
      const end = new Date()
      this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
      this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
  },
  watch: {
      memberListType(val,oldVal) {
          if(val !== oldVal && oldVal.length !== 0){
              this.getUserType()
          }
      },
      memberListByPay(val,oldVal) {
          if(val !== oldVal && oldVal.length !== 0){
              this.getPayDetail()
          }
      },
      expirationDay(val,oldVal) {
          if(val !== oldVal && oldVal.length !== 0){
              this.getWatchBehavior()
          }
      }
      // percent(val) {
      //     this.percentTotal = val.reduce((prev ,cur ,index ,array) => {
      //         return prev + cur
      //     })
      // }
  },
  methods: {
      // genDefaultDivideForm (preset) {
      //     return {
      //         crowdId: undefined,
      //         crowdName: undefined,
      //         pct: [],
      //         // remark: '',
      //         priority: undefined,
      //         validityTime: '',
      //         ...preset
      //     }
      // },
      handleInputTime (index, val, method) {
          const key = 'time' + index
          const oldVal = this[key]
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this[key] = val
                  this[method](this.currentCid,val[0],val[1])
              }else{
                  this.$message.error('日期间隔最多只能是30天！请重新选择日期')
              }
          }
      },
      // createTimeWatcher(index, method) {
      //     return (val) => {
      //         this.handleInputTime(index, val, method)
      //     }
      // },
    goBack() {
      this.$emit("goBack")
    },
    initTime() {
        this.time0 = [this.startDate,this.endDate]
        this.time1 = [this.startDate,this.endDate]
        this.time2 = [this.startDate,this.endDate]
        this.time3 = [this.startDate,this.endDate]
        this.time4 = [this.startDate,this.endDate]
        this.time5 = [this.startDate,this.endDate]
        this.time6 = [this.startDate,this.endDate]
        this.time7 = [this.startDate,this.endDate]
    },
    callback() {
        this.loadData()
    },
    handleAdd() {
      this.$emit("addCrowd")
    },
    edit(row) {
      this.$emit("addCrowd", row)
    },
    // 编辑ab test人群
    divideAB(row,mode) {
        this.$emit("editABCrowd", row, mode)
    },
    del(row) {
      var id = row.crowdId
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service.strategyCrowdDel({ crowdId: id},"删除人群会影响该策略下所有人群的估算数量，请点击“估算”重新估算其他人群的圈定数据").then(()=>{
            this.loadData()
          })
        }).catch(function(){

        })
    },
    // 批量估算
    handleBatchEstimate() {
        this.estimateType = 'batch'
        this.showEstimate = true
        this.$service.getEstimateType().then((data) => {
            this.estimateItems = data
        })
        //    初始化值
        this.estimateValue = ['0']
    },
    // 点击估算按钮
    handleClickEstimate(row) {
        this.estimateId = row.crowdId
        this.showEstimate = true
        this.estimateType = 'single'
        this.$service.getEstimateType().then((data) => {
            this.estimateItems = data
        })
    //    初始化值
        this.estimateValue = ['0']
    },
      // 提交估算
    handleEstimate () {
        let calIdType = this.estimateValue.map((item) => item).join(',')
        const formData = {
            policyId: this.selectRow.policyId,
            crowdId: this.estimateType === 'single'? this.estimateId : undefined,
            triggerUser: this.getUserName(),
            triggerTime: (new Date()).valueOf(),
            calIdType
        }
        if (this.estimateType === 'single') {
            this.$service.estimatePeople({crowdId: this.estimateId,calIdType: calIdType},"提交估算成功").then(
                () => {
                    this.showEstimate = false
                    this.loadData()
                }
            )
            // this.$service.singleCrowdEstimate(formData,"提交估算成功").then(
            //     () => {
            //         this.showEstimate = false
            //         this.loadData()
            //     }
            // )
        } else {
            this.$service.batchCrowdEstimate(formData,"提交估算成功").then(
                () => {
                    this.showEstimate = false
                    this.loadData()
                    this.canBatchEstimate = true
                    setTimeout(() => {
                        this.$set(this,'canBatchEstimate',false)
                    },5000)
                }
            )
        }
    },
    // 获取当前用户拼音
    getUserName () {
          return this.$appState.user.name.split('@')[0]
    },
      // 显示估算结果
      showCountResult (id) {
          const crowdId = id
          this.showResult = true
          this.$service.estimateResult({crowdId: crowdId}).then((data) => {
              this.total1 = data[0].total1 === null ? '暂无数据': data[0].total1
              const {total1,total2,total3,totalUser} = data[0] || {}
              // const {totalUser} = data[0] || {}
              this.total1 = total1 || '暂无数据'
              this.total2 = total2 || '暂无数据'
              this.total3 = total3 || '暂无数据'
              this.totalUser = totalUser || '暂无数据'
          })
      },
    // 从服务器读取数据
    loadData () {
      this.criteria["pageNum"] = this.currentPage
      this.criteria["pageSize"] = this.pageSize
      this.criteria.policyId = this.selectRow.policyId
      this.$service.viewCrowd(this.criteria).then(data => {
        this.abStatusEnum = data.ABStatus
        this.crowdValidEnum = data.crowdValidEnum
        this.tableData = data.pageInfo.list
        this.totalCount = data.pageInfo.total
      })
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadData()
    },
    // 搜索,提交表单
    submitForm () {
      this.$refs.searchForm.validate((result) => {
        if (result) {
          this.criteria = this.searchForm
          this.loadData()
        } else {
          return false
        }
      })
    },
    // 重置
    handleReset () {
      this.$refs.searchForm.resetFields()
    },
      // 通用多线性参数设置
      setLinesEchart (element,title,xData,yData,legend) {
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title
              },
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data: legend
              },
              xAxis: {
                  type: 'category',
                  data: xData,
                  axisLabel: {
                      interval: 0,
                      rotate: -45
                  }
              },
              yAxis: {
                  type: 'value',
                  axisTick: {
                      inside: true
                  },
                  scale: true,
                  axisLabel: {
                      margin: 2,
                      formatter: function (value) {
                          if (value >= 10000 && value < 10000000) {
                              value = value / 10000 + "万"
                          }
                          else if (value >= 10000000) {
                              value = value / 10000000 + "千万"
                          } return value
                      }
                  },
              },
              series: yData
          })
      },
      // 通用柱状图参数设置
      setBarEchart (element,title,xData,yData) {
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title
              },
              tooltip: {
                  trigger: 'axis'
              },
              xAxis: {
                  type: 'category',
                  data: xData,
                  axisLabel: {
                      interval: 0,
                      rotate: -45
                  }
              },
              yAxis: {
                  type: 'value',
                  axisTick: {
                      inside: true
                  },
                  scale: true,
                  axisLabel: {
                      margin: 2,
                      formatter: function (value) {
                          if (value >= 10000 && value < 10000000) {
                              value = value / 10000 + "万";
                          }
                          else if (value >= 10000000) {
                              value = value / 10000000 + "千万";
                          } return value;
                      }
                  },
              },
              series: [{
                  data: yData.length === 0 ? this.fillEmptyData.data : yData,
                  type: 'bar',
                  barWidth : 30
              }]
          })
      },
      // 圆饼图
      setCircleEcharts(element,title,legend,data,showDetail){
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title,
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: legend
              },
              series: [
                  {
                      name:'',
                      type:'pie',
                      radius: ['50%', '70%'],
                      // center: ['50%', '60%'],
                      avoidLabelOverlap: false,
                      itemStyle: {
                          normal: {label:{
                                  show:showDetail,
                                  formatter:'{b} : {c} ({d}%)'
                              },
                              labelLine:{show:showDetail}},
                          emphasis: {
                              label: {
                                  show: showDetail,
                                  formatter: "{b}\n{c} ({d}%)",
                                  position: 'center',
                                  textStyle: {
                                      fontSize: '20',
                                      fontWeight: 'bold'
                                  }
                              }
                          }
                      },
                      data: (data.length === 0) ? this.fillEmptyData.data : data
                  }
              ]
          })
      },
      // 双层夹心圆饼图
      setNestedCircleEcharts(element,title,legend,innerData,outData,showDetail){
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title,
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: legend
              },
              series: [

                  {
                      name: '访问来源',
                      type: 'pie',
                      selectedMode: 'single',
                      radius: [0, '30%'],

                      label: {
                          position: 'inner'
                      },
                      labelLine: {
                          show: false
                      },
                      // 里层所有数据
                      data: innerData
                  },
                  {
                      name: '',
                      type: 'pie',
                      radius: ['40%', '55%'],
                      label: {
                          formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                          backgroundColor: '#eee',
                          borderColor: '#aaa',
                          borderWidth: 1,
                          borderRadius: 4,
                          // shadowBlur:3,
                          // shadowOffsetX: 2,
                          // shadowOffsetY: 2,
                          // shadowColor: '#999',
                          // padding: [0, 7],
                          rich: {
                              a: {
                                  color: '#999',
                                  lineHeight: 22,
                                  align: 'center'
                              },
                              // abg: {
                              //     backgroundColor: '#333',
                              //     width: '100%',
                              //     align: 'right',
                              //     height: 22,
                              //     borderRadius: [4, 4, 0, 0]
                              // },
                              hr: {
                                  borderColor: '#aaa',
                                  width: '100%',
                                  borderWidth: 0.5,
                                  height: 0
                              },
                              b: {
                                  fontSize: 16,
                                  lineHeight: 33
                              },
                              per: {
                                  color: '#eee',
                                  backgroundColor: '#334455',
                                  padding: [2, 4],
                                  borderRadius: 2
                              }
                          }
                      },
                      data: (outData.length === 0) ? this.fillEmptyData.data : outData // 外层所有数据
                  }

              ]
          })
      },
      // 中国地图
      setMapEcharts (element,title,data,minValue,maxValue) {
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          // 中国地图
          myChart.setOption({
              title : {
                  text: title,
                  // subtext: '副标题',
                  left: 'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: '{b}<br/>({c})'
              },
              visualMap: {
                  min: minValue ? minValue : 0,
                  max: maxValue ? maxValue : 20000000,
                  text: ['High', 'Low'],
                  realtime: false,
                  calculable: true,
                  inRange: {
                      color: ['lightskyblue', 'yellow', 'orangered']
                  }
              },
              series : [
                  {
                      name: '省份分布',
                      type: 'map',
                      mapType: 'china',
                      roam: false,
                      label: {
                          normal: {
                              show: false
                          },
                          emphasis: {
                              show: true
                          }
                      },
                      data:data
                  },
              ]
          })
      },
      // 漏斗图
      setFunnelEcharts(element,title,legend,data){
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  data: legend
              },
              calculable: true,
              series: [
                  {
                      name:'漏斗图',
                      type:'funnel',
                      left: '10%',
                      top: 60,
                      //x2: 80,
                      bottom: 60,
                      width: '80%',
                      // height: {totalHeight} - y - y2,
                      min: 0,
                      max: 100,
                      minSize: '0%',
                      maxSize: '100%',
                      sort: 'descending',
                      gap: 2,
                      label: {
                          show: true,
                          position: 'inside'
                      },
                      labelLine: {
                          length: 10,
                          lineStyle: {
                              width: 1,
                              type: 'solid'
                          }
                      },
                      itemStyle: {
                          borderColor: '#fff',
                          borderWidth: 1
                      },
                      emphasis: {
                          label: {
                              fontSize: 20
                          }
                      },
                      data: data
                  }
              ]
          })
      },
      // 策略使用以及各业务使用次数统计
      handleCommandStastic(scope) {
          const type = scope[0]
          this.currentCid = scope[1].crowdId
          switch (type) {
              // 统计投后效果
              case 'detail':
                  this.showCrowdDetailDialog()
                  break
              // 人群画像估算
              case 'estimatedDetail':
                  this.showEstimateEcharts = true
                  this.getCrowdBaseInfo()
                  this.getCrowdProvinceInfo()
                  this.getTopActiveRank()
                  this.getMemberBenefits()
                  this.getWatchBehavior()
                  this.getActiveBehavior()
                  break
              case 'homepageData':
                  this.handleSeeHomepageData(this.currentCid,scope[1].crowdName)
                  break
              case 'redirectCrowd':
                  this.handleClickRedirectList(this.currentCid)
          }
      },
      // 显示投后效果弹窗
      showCrowdDetailDialog() {
          this.showStatistics = true
          this.initTime()
          this.drawCrowdPie(this.currentCid,this.time1[0],this.time1[1])
          this.drawCrowdLine(this.currentCid,this.time0[0],this.time0[1])
          this.drawExposePie(this.currentCid,this.time3[0],this.time3[1])
          this.drawExposeLine(this.currentCid,this.time2[0],this.time2[1])
          this.drawClickPie(this.currentCid,this.time5[0],this.time5[1])
          this.drawClickLine(this.currentCid,this.time4[0],this.time4[1])
          this.crowdLaunchDetail(this.currentCid,this.time6[0],this.time6[1])
          this.setProvinceData(this.currentCid,this.time7[0],this.time7[1])
      },
      // 统计投后效果---开始
      drawCrowdPie(id,startTime,endTime){
        this.$service.hitAndBiToTalPie({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
            if(data.data.length === 0){this.hitPieTitle = '累计命中次数按业务分布暂无数据'}
            else{this.hitPieTitle = '累计命中次数按业务分布'}
            this.setCircleEcharts('hitPie','',data.name,data.data,true)
        })
      },
      drawCrowdLine(id,startTime,endTime){
          this.$service.hitAndBiToTalLine({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const legendData = data.series.map((key) => {
                  return key.name
              })
              const linesData = data.series.map((key) => {
                  return {name:key.name, data:key.data, type: 'line'}
              })
              this.hitLinesTitle = '该人群总命中量以及各业务的命中量'
              this.setLinesEchart('hitLine','',data.date,linesData,legendData)
          })
      },
      drawExposePie(id,startTime,endTime){
          this.$service.exposeCrowdTotalPie({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              if(data.data.length === 0){this.exposePieTitle = '累计曝光数按业务分布暂无数据'}
              else{this.exposePieTitle = '累计曝光数按业务分布'}
              this.setCircleEcharts('exposePie','',data.name,data.data,true)
          })
      },
      drawExposeLine(id,startTime,endTime){
          this.$service.exposeCrowdTotalLine({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const legendData = data.series.map((key) => {
                  return key.name
              })
              const linesData = data.series.map((key) => {
                  return {name:key.name, data:key.data, type: 'line'}
              })
              this.exposeLinesTitle = '该人群总曝光量以及各业务的曝光量'
              this.setLinesEchart('exposeLine','',data.date,linesData,legendData)
          })
      },
      drawClickPie(id,startTime,endTime){
          this.$service.clickCrowdTotalPie({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              if(data.data.length === 0){this.clickPieTitle = '累计点击次数按业务分布暂无数据'}
              else{this.clickPieTitle = '累计点击次数按业务分布'}
              this.setCircleEcharts('clickPie','',data.name,data.data,true)
          })
      },
      drawClickLine(id,startTime,endTime){
          this.$service.clickCrowdTotalLine({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const legendData = data.series.map((key) => {
                  return key.name
              })
              const linesData = data.series.map((key) => {
                  return {name:key.name, data:key.data, type: 'line'}
              })
              this.clickLinesTitle = '该人群总点击以及各业务的点击次数'
              this.setLinesEchart('clickLine','',data.date,linesData,legendData)
          })
      },
      crowdLaunchDetail(id,startTime,endTime){
          this.$service.crowdLanuchData({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              if(data.data.length === 0){this.crowdLaunchTitle = '该人群投放数据漏斗基本详情暂无数据'}
              else{this.crowdLaunchTitle = '该人群投放数据漏斗基本详情'}
              this.setFunnelEcharts('crowdLaunch','',data.names,data.data)
          })
      },
      setProvinceData(id,startTime,endTime){
          this.$service.exposeProvinceScale({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const newData = data.map((item)=> {
                  return {name: item.name,value: parseFloat(item.value)}
              })
              this.exposeProvinceTitle = '曝光人群省份分布'
              this.setMapEcharts('exposeProvince','',newData)
          })
      },
      // 统计投后效果---结束
      formatDate (d) {
          const time = new Date(d)
          let y = time.getFullYear() // 年份
          let m = (time.getMonth() + 1).toString().padStart(2,'0') // 月份
          let r = time.getDate().toString().padStart(2,'0') // 日子
          return `${y}-${m}-${r}`
      },
      setDataInMonth(startDate,endDate){
          const startTime = new Date(startDate).getTime()
          const endTime = new Date(endDate).getTime()
          const oneMonth = 3600*1000*24*30
          return endTime - startTime <= oneMonth
      },
      upDownCrowd(row) {
        this.showUpDownDialog = true
        this.upDownTips = row.putway === 1 ? '确定下架人群吗？下架后该人群将无法使用，不再命中、返回' : '确定上架人群吗？点击确认后，该人群将可以用'
        this.currentTag = row
      },
      handleUpDown() {
        const row = this.currentTag
        this.$service.crowdUpDown({crowdId: row.crowdId, putway: row.putway === 1 ? 0 : 1 },(row.putway === 1 ? '下架' : '上架') + '人群会影响该策略下人群估算数量，请点击"估算"重新估算其他人群的圈定数据')
              .then(()=>{
                  this.showUpDownDialog = false
                  this.loadData()
              })
      },
      copyCrowd (row) {
        this.showCopyDialog = true
        this.$service.getAllPolicyList().then(data => {
            this.allPolices = data
        })
        this.currentTag = row
      },
      handleCopy (formName) {
          const row = this.currentTag
          let policyIds = this.policyCopyForm.policyIds.join(',')
          this.$refs[formName].validate((valid) => {
              if(valid) {
                  this.$service.crowdCopy({crowdId: row.crowdId, policyIds}, '复制成功')
                      .then(()=>{
                          this.handleCancelCopy('policyCopyForm')
                          this.loadData()
                      })
              }else {
                  return false
              }
          })
      },
      handleCancelCopy(formName) {
        this.showCopyDialog = false
        this.$refs[formName].resetFields()
      },
      handleCommandOpreate(scope) {
          const type = scope[0]
          const params = scope[1]
          switch (type) {
              case 'edit':
                  if (params.abMainCrowd === 1) {
                      this.divideAB(params,'editABTest')
                  } else {
                      this.edit(params)
                  }
                  break
              case 'del':
                  this.del(params)
                  break
              case 'upDown':
                  this.upDownCrowd(params)
                  break
              case 'copy':
                  this.copyCrowd(params)
                  break
              case 'divide':
                  this.divideAB(params,'addABTest')
                  break
              case 'commitHistory':
                  this.handleCommitHistory(params)
                  break
          }
      },
      tableRowClassName({row}) {
        if(row.putway === 0) {return 'gray-row'}
      },
      // 人群画像估算---开始
      getCrowdBaseInfo() {
        const crdId = this.currentCid
        // 性别，年龄，产品等级
        const typeEnum = ['portrait.family.sex','portrait.family.age.range','portrait.product.grade']
        // this.$service.getCrowdCountMap({params: {type: typeEnum[0]},crowdId: this.currentCid}).then(data => {
        //     const [names,values] = [[],[]]
        //     data.dataList.forEach(item => {
        //         names.push(item.name)
        //         values.push({value: item.value, name: item.name})
        //     })
        //     this.setCircleEcharts('circleSex', '性别分布', names, values,false)
        // })
        // this.$service.getCrowdCountMap({params: {type: typeEnum[1]},crowdId: this.currentCid}).then(data => {
        //     const [names,values] = [[],[]]
        //     data.dataList.forEach(item => {
        //         names.push(item.name)
        //         values.push({value: item.value, name: item.name})
        //     })
        //     this.setCircleEcharts('circleAge', '年龄分布', names, values,false)
        // })
        this.$service.getCrowdCountMap({params: {type: typeEnum[2]},crowdId: this.currentCid}).then(data => {
            const [names,values] = [[],[]]
            data.dataList.forEach(item => {
                names.push(item.name)
                values.push({value: item.value, name: item.name})
            })
            this.setCircleEcharts('circleDevice', '产品等级分布', names, values,true)
        })
      },
      getCrowdProvinceInfo() {
        const crdId = this.currentCid
          // 省份、城市活跃度
          const typeEnum = ['portrait.province','portrait.cities.rank']
          this.$service.getCrowdCountMap({params: {type: typeEnum[0]},crowdId: this.currentCid}).then(data => {
              const [names,nameWithValues,values,length] = [[],[],[],data.dataList.length]
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push(parseInt(item.value))
                  nameWithValues.push({value: parseInt(item.value), name: item.name})
              })
              const bubbleArr = this.bubbleSort(values)
              const max = bubbleArr[length-1]
              const min = bubbleArr[0]
              this.setMapEcharts('provinceMap','省份分布',nameWithValues,min,max)
          })
          this.$service.getCrowdCountMap({params: {type: typeEnum[1]},crowdId: this.currentCid}).then(data => {
              this.cityData = data.dataList
          })
      },
      getTopActiveRank() {
          const typeEnum = ['portrait.top50.active.city']
          this.$service.getCrowdCountMap({params: {type: typeEnum[0], orderBy: 'value',sortOrder: 'desc'},crowdId: this.currentCid}).then(data => {
              console.log(data.dataList)
              const arr = data.dataList
              var sum = 0
              arr.forEach(item => {
                  sum += parseInt(item.value)
              })
              this.table.data = arr.reduce((result, item) => {
                  return result.concat({ name: item.name, value: parseInt(item.value), PCT:((parseInt(item.value)/sum)*100).toFixed(2)+ '%' })
              }, [])
          })
      },
      getMemberBenefits() {
        this.$service.getEstimatedTvEnumData().then(data => {
            console.log(data)
            const memberListData = this.objectToArray(data)
            this.memberList = memberListData
            // 设置两个默认的下拉框选值
            this.memberListType = memberListData[0].value
            this.memberListByPay = memberListData[0].value
            this.getUserType()
            this.getPayDetail()
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
      getUserType() {
          // 正常用户类型
          const typeWithSelectEnum = {
              'jyVIP': "portrait.user.category.education.vip.member",
              'sjyVIP': "portrait.user.category.education.super.vip.member",
              'djPlatform': "portrait.user.category.premier.theater.member",
              'cjyVIP': "portrait.user.category.education.kids.vip.member",
              'aqy': "portrait.user.category.iqiyi.member",
              'multAqy': "portrait.user.category.mixed.source.iqiyi.member",
              'fkGarden': "portrait.user.category.4k.garden.member",
              'phyVIP': "portrait.user.category.sports.vip.member",
              'tencent': "portrait.user.category.tencent.movie.member",
              'kmVIP': "portrait.user.category.cool.meow.vip.member"
          }
          // 非会员
          const typeWithNoVipSelectEnum = {
              'jyVIP': "portrait.user.category.education.vip.nonmember",
              'sjyVIP': "portrait.user.category.education.super.vip.nonmember",
              'djPlatform': "portrait.user.category.premier.theater.nonmember",
              'cjyVIP': "portrait.user.category.education.kids.vip.nonmember",
              'aqy': "portrait.user.category.iqiyi.nonmember",
              'multAqy': "portrait.user.category.mixed.source.iqiyi.nonmember",
              'fkGarden': "portrait.user.category.4k.garden.nonmember",
              'phyVIP': "portrait.user.category.sports.vip.nonmember",
              'tencent': "portrait.user.category.tencent.movie.nonmember",
              'kmVIP': "portrait.user.category.cool.meow.vip.nonmember"
          }
          // 有效期会员
          const typeWithVipSelectEnum = {
              'jyVIP': "portrait.user.category.education.vip.validdate.member",
              'sjyVIP': "portrait.user.category.education.super.vip.validdate.member",
              'djPlatform': "portrait.user.category.premier.theater.validdate.member",
              'cjyVIP': "portrait.user.category.education.kids.vip.validdate.member",
              'aqy': "portrait.user.category.iqiyi.validdate.member",
              'multAqy': "portrait.user.category.mixed.source.iqiyi.validdate.member",
              'fkGarden': "portrait.user.category.4k.garden.validdate.member",
              'phyVIP': "portrait.user.category.sports.vip.validdate.member",
              'tencent': "portrait.user.category.tencent.movie.validdate.member",
              'kmVIP': "portrait.user.category.cool.meow.vip.validdate.member"
          }
          // 已过期会员
          const typeWithVipNoValidSelectEnum = {
              'jyVIP': "portrait.user.category.education.vip.expireddate.member",
              'sjyVIP': "portrait.user.category.education.super.vip.expireddate.member",
              'djPlatform': "portrait.user.category.premier.theater.expireddate.member",
              'cjyVIP': "portrait.user.category.education.kids.vip.expireddate.member",
              'aqy': "portrait.user.category.iqiyi.expireddate.member",
              'multAqy': "portrait.user.category.mixed.source.iqiyi.expireddate.member",
              'fkGarden': "portrait.user.category.4k.garden.expireddate.member",
              'phyVIP': "portrait.user.category.sports.vip.expireddate.member",
              'tencent': "portrait.user.category.tencent.movie.expireddate.member",
              'kmVIP': "portrait.user.category.cool.meow.vip.expireddate.member"
          }
          this.$service.getCrowdCountMap({params: {type: typeWithSelectEnum[this.memberListType]},crowdId: this.currentCid}).then(data => {
              console.log(data)
              const [names,values] = [[],[]]
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push({value: item.value, name: item.name})
                  console.log(item.name+':'+item.value)
              })
              this.setCircleEcharts('member','会员用户的分布情况',names,values,true)
          })
          this.$service.getCrowdCountMap({params: {type: typeWithNoVipSelectEnum[this.memberListType]},crowdId: this.currentCid}).then(data => {
              console.log(data)
              const [names,values] = [[],[]]
              var dataCount = 0
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push({value: item.value, name: item.name})
                  dataCount += parseInt(item.value)
              })
              console.log('非会员总数======'+dataCount)
              this.setCircleEcharts('memberMainPageActiveTime','从未是会员-按主页激活时间',names,values,false)
          })
          this.$service.getCrowdCountMap({params: {type: typeWithVipSelectEnum[this.memberListType]},crowdId: this.currentCid}).then(data => {
              console.log(data)
              const [names,values] = [[],[]]
              var dataCount = 0
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push({value: item.value, name: item.name})
                  dataCount += parseInt(item.value)
              })
              console.log('有效期会员总数======'+dataCount)
              this.setCircleEcharts('memberActiveTime','会员-按会员有效期时长',names,values,false)
          })
          this.$service.getCrowdCountMap({params: {type: typeWithVipNoValidSelectEnum[this.memberListType]},crowdId: this.currentCid}).then(data => {
              console.log(data)
              const [names,values] = [[],[]]
              var dataCount = 0
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push({value: item.value, name: item.name})
                  dataCount += parseInt(item.value)
              })
              console.log('过期会员总数======'+dataCount)
              this.setCircleEcharts('memberExpirationTime','过期会员-按会员过期时长',names,values,false)
          })
        // this.$service.getEstimatedUserTypeData({id: this.currentCid,category: this.memberListType}).then(data => {
        //     // 当data直接为空对象，里面uCgyTal啥都没有
        //     let spread,effectiveTime,activate,expire = {}
        //     if(Object.keys(data).length === 0) {
        //         spread = this.fillEmptyData
        //         effectiveTime = this.fillEmptyData
        //         activate = this.fillEmptyData
        //         expire = this.fillEmptyData
        //     }else {
        //         spread = data.uCgyTal
        //         effectiveTime = data.vipPrdTtl
        //         activate = data.nvActHptTtl
        //         expire = data.ovToutTtl
        //     }
        //     this.setCircleEcharts('member','会员用户的分布情况',spread.name,spread.data,true)
        //     this.setCircleEcharts('memberActiveTime','会员-按会员有效期时长',effectiveTime.name,effectiveTime.data,false)
        //     this.setCircleEcharts('memberMainPageActiveTime','从未是会员-按主页激活时间',activate.name,activate.data,false)
        //     this.setCircleEcharts('memberExpirationTime','过期会员-按会员过期时长',expire.name,expire.data,false)
        // })
      },
      getPayDetail() {
          const typeWithSelectEnum = {
              'jyVIP': "portrait.last.payment.education.vip",
              'sjyVIP': "portrait.last.payment.education.super.vip",
              'djPlatform': "portrait.last.payment.premier.theater",
              'cjyVIP': "portrait.last.payment.education.kids.vip",
              'aqy': "portrait.last.payment.iqiyi",
              'multAqy': "portrait.last.payment.mixed.source.iqiyi",
              'fkGarden': "portrait.last.payment.4k.garden",
              'phyVIP': "portrait.last.payment.sports.vip",
              'tencent': "portrait.last.payment.tencent.movie",
              'kmVIP': "portrait.last.payment.cool.meow.vip"
          }
          this.$service.getCrowdCountMap({params: {type: typeWithSelectEnum[this.memberListByPay]},crowdId: this.currentCid}).then(data => {
              console.log(data)
              const [names,values] = [[],[]]
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push({value: item.value, name: item.name})
              })
              this.setCircleEcharts('payDetail','上次付费的会员产品包情况',names,values,true)
          })
      },
      getWatchBehavior() {
          const typeEnum = ['portrait.user.viewing.preferences','portrait.broadcast.rate.within.seven.days','portrait.broadcast.rate.within.thirty.days']
          this.$service.getCrowdCountMap({params: {type: typeEnum[0]},crowdId: this.currentCid}).then(data => {
              const [names,values] = [[],[]]
              data.dataList.forEach(item => {
                  names.push(item.name)
                  values.push({value: item.value, name: item.name})
              })
              this.setCircleEcharts('watchPrefer','观影偏好',names,values)
          })
          if (this.expirationDay === '7') {
              this.$service.getCrowdCountMap({params: {type: typeEnum[1]}, crowdId: this.currentCid}).then(data => {
                  const [names, values] = [[], []]
                  data.dataList.forEach(item => {
                      names.push(item.name)
                      values.push({value: item.value, name: item.name})
                  })
                  this.setCircleEcharts('userBehavior', '', names, values)
              })
          } else {
              this.$service.getCrowdCountMap({params: {type: typeEnum[2]}, crowdId: this.currentCid}).then(data => {
                  const [names, values] = [[], []]
                  data.dataList.forEach(item => {
                      names.push(item.name)
                      values.push({value: item.value, name: item.name})
                  })
                  this.setCircleEcharts('userBehavior', '', names, values)
              })
          }
      },
      getActiveBehavior() {
          const typeEnum = ['portrait.active.device.amount.yesterday']
          const [names,values] = [[],[]]
          this.$service.getCrowdCountMap({params: {type: typeEnum[0]},crowdId: this.currentCid}).then(data => {
             data.dataList.forEach(item => {
                 names.push(item.name)
                 values.push({value: item.value, name: item.name})
             })
             this.setBarEchart('activeBehavior','圈定人群的设备活跃人数/主页活跃人数/起播活跃人数（前一日的值)',names,values)
          })
      },
      // 人群画像估算---结束
      // 显示划分详情
      showDivideResult (crowdId) {
          this.$service.getAbChilds(crowdId).then(data => {
              this.showDivideDetail = true
              this.DivideTableData = data
          })

      },
      // 提交历史数据
      handleCommitHistory (row) {
          this.setShowCommitHistoryDialog = true
          this.currentCrowdId = row.crowdId
      },
      handleSubmitHistory (formData) {
          let submitForm = {
              isSubmit: formData.isSubmit,
              crowdId: formData.id,
              dateNum: formData.dateNum
          }
          this.$service.submitPolicyHistoryData(submitForm, formData.isSubmit === 1 ? '提交历史数据成功' : '关闭提交成功').then(()=> {
              this.setShowCommitHistoryDialog = false
          })
      },
      // 查看主页数据
      handleSeeHomepageData (crowdId, crowdName) {
          this.showDivideDetail = false
          this.$appState.$set("homepageReleaseCrowdName", crowdName)
          this.$router.push({name: 'homepageReleaseRecord', params: {id: crowdId, crowdName: crowdName}})
      },
      //  导出估算画像数据
      handleDownload () {
          // this.downloadUrl = '/api/map/esCrdStsMapBasic/exportExcel/' + this.currentCid
          // this.$nextTick(() => {
          //     this.$refs.download_Url.click()
          // })
          this.downloadUrl = '/api/crowd/exportCrowdPortrait/' + this.currentCid
          // this.downloadUrl = '/api/crowd/exportCrowdPortrait/' + this.currentCid
          this.$nextTick(() => {
              this.$refs.download_Url.click()
          })
      },
      //  导出投后效果数据
      handleLaunchedExport () {
          this.launchedExportUrl =
              '/api/crowdAndPolicyStatistics/export/' + this.currentCid
              +'?sHitLineTime='+ this.time0[0] + '&eHitLineTime='+ this.time0[1]
              +'&sHitPieTime='+ this.time1[0] + '&eHitPieTime='+ this.time1[1]
              +'&sExposeLineTime='+ this.time2[0] + '&eExposeLineTime='+ this.time2[1]
              +'&sExposePieTime='+ this.time3[0] + '&eExposePieTime='+ this.time3[1]
              +'&sClickLineTime='+ this.time4[0] + '&eClickLineTime='+ this.time4[1]
              +'&sClickPieTime='+ this.time5[0] + '&eClickPieTime='+ this.time5[1]
              +'&sFunnelTime='+ this.time6[0] + '&eFunnelTime='+ this.time6[1]
              +'&sProvinceTime='+ this.time7[0] + '&eProvinceTime='+ this.time7[1]
          this.$nextTick(() => {
              this.$refs.launchedDownLoad.click()
          })
      },
      unActiveTips(activeType) {
          if (activeType == 1 || activeType == 3) {
              return '人群未生效，因为该人群条件' + this.crowdValidEnum[activeType]
          } else {
              return '人群未生效，因为未点击该策略的"同步按钮"'
          }
      },
      // 显示限制数量
      handleShowLimitLaunch (launchCount) {
          this.showLimitLaunchDialog = true
          this.showLimitLaunchCount = launchCount
      },
      handleClickRedirect () {
        this.$router.push({
            path: '/redirectAdd?policyId='+this.selectRow.policyId
        })
      },
      handleClickRedirectWithId (crowd) {
          console.log(crowd)
          this.$router.push({
              path: '/redirectAdd?policyId='+this.selectRow.policyId +'&crowdId=' + crowd.crowdId + '&crowdName=' + crowd.crowdName
          })
      },
      handleClickRedirectList (crowdId) {
          this.$router.push({
              params: {redirectListId : crowdId},
              name: 'redirectAdd'
          })
      },
      bubbleSort(arr) {
          // 冒泡排序
          const len = arr.length
          for(var i=0;i< len;i++) {
              for (var j=0;j<len-1-i;j++) {
                  if (arr[j] > arr[j + 1]) {
                      var temp = arr[j + 1]
                      arr[j + 1] = arr[j]
                      arr[j] = temp
                  }
              }
          }
          return arr
      }
  }
}
</script>
<style lang="stylus" scoped>
fieldset
  border: 1px solid #ebeef5
  font-size: 14px
  color: #909399
  margin-bottom: 20px
  padding: 10px
fieldset>div
  display: flex
  justify-content: space-between
.label-ground, .label-item, .detail
  display: flex
.demo-table-expand >>> .el-form-item__content
  display: flex
.label-or-space
  color: #1ac71c
  margin: 0 5px
.echarts-container
  position relative
  width 50%
  height auto
  float left
.crowd-statistic
  border-bottom 1px dashed #ccc
  &:before
  &:after
    display table
    content ""
  &:after
    clear: both
.main
  width 100%
  height 300px
  padding 30px
.click-date-picker
  text-align center
  margin 20px 0
.lines-title
  position absolute
  font-size 18px
  font-weight bold
  color #000
  margin-left 25px
.funnel-tips
  font-size 14px
  color #333
  margin 50px 0 0 25px
.crowd-list >>> .el-table tr.gray-row
  color #ccc
.copy-form >>> .el-select
  width 85%
.uneffective
  position relative
  cursor pointer
  span
    position absolute
    display inline-block
    width 12px
    height 12px
    border 1px solid
    border-radius 10px
    text-align center
    line-height 12px
.manual
  margin 20px
.estimate-item
  border-top 1px dashed #000
  &:first-child
    border-top none
.base-info-circle-echarts
  border-left 1px dashed #000
  &:first-child
    border-left none
.estimate-statistic
  display flex
.base-info-circle-echarts
  width 33%
  height 220px
.table-overflow
  height 360px
  overflow auto
.city-info-echarts
    width 33%
    border-right 1px dashed
.province-map
    width 100%
    height 300px
.province-city-active-content
    display flex
    flex-direction column
.city-active-proportion
    display block
    margin-left 20px
.city-active-proportion--title
    font-size 18px
.city-active-proportion--name
    width 50%
    display inline-block
    margin 5px 0
.table-title
    font-size 18px
    margin 20px 0
.estimate-title
    padding 10px 20px
    background-color #ccc
    font-size 18px
    color red
    display inline-block
    margin 20px 0
.member-select
    display flex
    align-items center
    justify-content center
    .member-select--text
        margin-right 20px
.member-total
    width 50%
    height 300px
    margin auto
.member-total-item
    width 33%
    height 300px
    border-left 1px dashed #000
    &:first-child
        border-left none
/*.watch-tv-behavior*/
    /*border-top 1px dashed #000*/
    /*&:first-child*/
        /*border-top none*/
.userBehavior
    width 100%
    height 300px
.activeBehaviorEcharts
    width 50%
    height 300px
    margin auto
.button_underline
    text-decoration underline
.text-over
    width 16px
    height 16px
    background url(../../assets/pencil.png) no-repeat right center
    text-align center
.estimate-tips
    margin 10px 0
    color red
.left div
    margin-right 25px
.export-button
    display flex
    justify-content flex-end
.crowd-list >>> .el-button-group > .el-button
    float none
.blue-tip
    color #0086b3
</style>
