<template>
<div class="content detail">
  <!-- {{ selectedServicer }} -->
  <!-- {{selectedScene}} -->
  <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
    <div class="title">接待员详情</div>

    <div style="padding: 0 15px 10px">

      <div class="detail-header">

        <div class="detail-header-column">
          <span class="detail-name">
            <span>{{ selectedServicer.receptionist }}</span>
            <div class="detail-name-border"></div>
          </span>
          <div class="d-info" >
            <!-- 复用的接待员 -->
            <template v-if="isCopiedServicer">
              <div style="white-space: nowrap;grid-column-start: 1;grid-column-end: 3;display: grid;">如需修改，请跳转到被复用的接待员处编辑</div>
              <div>复用自：</div>
              <el-button type="text" @click="redirctToScene(selectedServicer.refSceneId, selectedServicer.referenceId)" style="text-align: left;">{{ selectedServicer.refSceneName }} - {{ selectedServicer.receptionist }}</el-button>
              <div>复用时间：</div>
              <div style="white-space: nowrap;">{{ selectedServicer.createTime || '-'}}</div>
              <div>擅长(可选)：</div>
              <div>
                <el-select
                  ref="selectObj"
                  v-model="skillValue"
                  placeholder="选择技能"
                  @change="selectSkill"
                  disabled
                >
                  <div class="options-wrap">
                    <el-option
                      v-for="item in skillOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </div>
                </el-select>
              </div>
            </template>

            <template v-else>
              <div>创建人：</div>
              <div>{{ selectedServicer.userName || '-'}}</div>
              <div>创建时间：</div>
              <div style="white-space: nowrap;">{{ selectedServicer.createTime || '-'}}</div>
              <div>擅长(可选)：</div>
              <div v-if="selectedServicer.receptionist">
                <el-select
                  ref="selectObj"
                  v-model="skillValue"
                  placeholder="选择技能"
                  @change="selectSkill"
                  :popper-append-to-body="false"
                >
                  <!-- @blur="addOption"
                  @keyup.enter.native="addOption" -->
                  <div class="options-wrap">

                    <el-option
                      v-for="item in skillOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </div>

                  <div class="operate-wrap">
                    <el-form :inline="true" :model="formInline" >
                      <el-form-item prop="skillName">
                        <el-input
                          v-model="formInline.skillName"
                          placeholder="技能分类"
                          @keyup.enter.native="addOption"
                          clearable
                          >
                        </el-input>
                      </el-form-item>

                    </el-form>

                    <el-button type="text" @click="addOption" icon="el-icon-plus">添加技能分类</el-button>
                  </div>

                  <div slot="empty" class="operate-wrap">
                    <el-form :inline="true" :model="formInline">
                      <el-form-item prop="skillName">
                        <el-input
                          v-model="formInline.skillName"
                          placeholder="技能分类"
                          @keyup.enter.native="addOption"
                          clearable
                          >
                        </el-input>
                      </el-form-item>
                    </el-form>
                    <el-button type="text" @click="addOption" icon="el-icon-plus">添加技能分类</el-button>
                  </div>
                </el-select>
              </div>
              <div v-else>-</div>
            </template>
          </div>
          <div style="text-align: center;">业务范围</div>
          <div class="detail-business-type">
            方案：
            {{ selectedServicer.planId || '-' }} {{ selectedServicer.planName || '-' }}
            <div class="panel-footer"></div>
            <!-- <div class="box-fotter">
              <el-button type="text" icon="el-icon-plus">添加/修改业务范围</el-button>
            </div> -->

          </div>
        </div>
        <div class="servicer-img"></div>
        <div class="detail-header-column">
          <div class="target">我的任务（可选）</div>
          <!-- <div>请输入接待员的目标<i class="el-icon-edit"></i></div> -->

          <div class="flex-content">
            <div class="target-img"></div>

            <!-- 复用的接待员 -->
            <template v-if="isCopiedServicer">
              {{ target }}
            </template>
            <template v-else>
              <div v-if="!isEdit" @click="editTarget" class="target-text">
                <span>{{ target }}</span>
                <span v-if="selectedServicer.id" class="text-over"></span>
              </div>
              <!-- <el-input v-else type="text" ref="inputPriority" size="small" @blur="editStatuChange" v-model="target"></el-input> -->
              <el-input
                v-else
                ref="inputPriority"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请输入内容"
                @blur="editStatuChange"
                v-model="target"
                maxlength="200"
                show-word-limit>
              </el-input>
            </template>
          </div>
          <!-- targetKeyId: {{targetKeyId}}
          <br/>
          overview： {{overview}} -->
          <div class="kpi-wrap">
            <div>绩效目标(可选)</div>
            <div class="detail-kpi">
              <i class="el-icon-loading load-place" v-if="getGoalDataLoading"></i>
              <!-- <el-descriptions title="" column="2">
                <el-descriptions-item label="当前服务满意率">99889</el-descriptions-item>
                <el-descriptions-item label="接待用户数">5588</el-descriptions-item>
                <el-descriptions-item label="目标">苏州市</el-descriptions-item>
                <el-descriptions-item label="满意用户数">123 </el-descriptions-item>
              </el-descriptions> -->
              <div class="detail-kpi-table">
                <div style="display: flex;">
                  <span class="kpi-label" style="display: grid">

                    <!-- <el-dropdown @command="handleCommandTargetKey">
                      <span class="el-dropdown-link">
                        {{ targetKey === '' ? '请选择' : targetKey }}<i class="el-icon-arrow-down el-icon--right"></i>：
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in targetKeyList" :key="index.id" :command="item.id">{{ item.lable }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown> -->
                    <span style="font-size: 16px;" v-if="indicatorsTypelabel">{{ indicatorsTypelabel }}：</span>
                    <span v-if="selectedServicer.id">
                      <el-button type="text" icon="el-icon-plus" @click="editTargetKey">编辑绩效目标</el-button>
                    </span>

                  </span>
                  <span style="flex: 1; text-align: center;">
                    <span class="kpi-value" v-if="targetKeyId === 'payRate'">{{ toPercent(overview[targetKeyId]) || '-' }}</span>
                    <span class="kpi-value" v-else>{{ overview[targetKeyId] || '-' }}</span>
                  </span>
                </div>
                <div>
                  <span class="kpi-label">接待用户数：</span>
                  <span class="kpi-value">{{ overview.receptionUv}}</span>
                </div>
                <div>
                  <span class="kpi-label">目标：</span>
                  <span class="kpi-value">
                    <!-- {{ targetValue }} -->

                      <span v-if="!isEditValue" @click="editTargetValue" class="target-text">
                        <span>{{ targetValue }}</span>
                        <span v-if="selectedServicer.id" class="text-over"></span>
                      </span>
                      <el-input
                        v-else
                        ref="inputValue"
                        placeholder="请输入"
                        @blur="editTargetValueChange"
                        v-model="targetValue"
                        style="width: 100px">
                      </el-input>

                  </span>
                </div>
                <div>
                  <span class="kpi-label">满意用户数：</span>
                  <span class="kpi-value">{{ overview.contentUv }}</span>
                </div>
              </div>

              <!-- <el-row :gutter="20" class="unit-row" v-for="(row, index) in rowObj" :key="index"> -->
                <!-- <div v-for="(chart, key) in rowObj" :key="key"> -->

              <div >
                <!-- {{ allChartData }} -->
                <div v-if="allChartData[targetKeyId] && allChartData[targetKeyId].series && allChartData[targetKeyId].series.length > 0" :ref="targetKeyId" :id="targetKeyId" class="chart-div"></div>
                  <!-- <el-empty description="暂无数据"></el-empty> -->
                <div v-else class="chart-empty"></div>
              </div>
                <!-- </div> -->
              <!-- </el-row> -->

              <!--  -->

              <div class="panel-footer"></div>
            </div>
          </div>
        </div>

      </div>

      <div>
        <div class="title2">服务对象选择（可选）</div>
        <div class="set-start">
          <template v-if="entryList.length > 0" >
            <!-- {{ checkList }} -->
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-button :disabled="checkList.length === 0" type="text" @click="copyRules(entryList, 'entry')" style="margin-left: 20px">复制</el-button>
          </template>
          <el-button v-if="!isCopiedServicer" type="text" @click="pasteRules('entry')" style="float: right">粘贴条件</el-button>

          <div v-if="entryList.length === 0" class="no-data-wrap">
            <div class="noData"></div>
            <!-- 暂时木有内容呀～～ -->
          </div>

          <el-checkbox-group v-model="checkList" @change="checkListChange('entry')">
          <div v-for="entry in entryList" :key="entry.id" class="info-class">
            <el-checkbox :label="entry.id" :key="entry.id">
            </el-checkbox>
            <!-- <div class="item-id">{{ entry.id }}</div> -->
            <div class="border-line"  style="position: relative;">
              <div class="outer-and">
                <span class="and-or" :class="entry.link === 'OR' ? 'OR': ''">
                {{ entry.link === 'OR' ? '或' : '且' }}
                </span>
              </div>
              <!-- {{entry.rulesJson}} -->
              <!-- {{ JSON.parse(entry.rulesJson).rules }} -->
              <!-- ( 有效混合源爱奇艺影视会员 = true 且 芯片型号 = 6A848,RTD2982DQ 且 存储 = 4G,8G ) -->
              <span class="border-title">普通标签</span>
              <div class="rule-string" >
                <div v-if="entry.rulesJson && JSON.parse(entry.rulesJson).rules.length > 0">
                  <div
                    v-for="(item, index) in JSON.parse(entry.rulesJson).rules"
                    :key="index"
                    class="rule-detail"
                  >
                    <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(entry.rulesJson).condition] }}</div>
                    <div class="label-ground">(
                      <div
                        v-for="(childItem,childItemIndex) in item.rules"
                        :key="childItem.tagId+childItemIndex"
                        class="label-item"
                      >
                      <!-- {{childItem}} -->
                        <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                        <span class="txt">{{ childItem.categoryName ||  childItem.tagName }}</span>

                        <!-- 流转标签 -->
                        <template v-if="(childItem.dataSource === 20)">
                          <ShowFlowConditionRuleItem
                            :childItem="childItem"
                            :soureceSignList="soureceSignList"
                            >
                          </ShowFlowConditionRuleItem>
                        </template>

                        <template v-else>
                          <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
                          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                          <span class="in">
                            <span >{{ childItem.value }}</span>
                          </span>
                          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                        </template>

                      </div>)
                    </div>
                  </div>
                </div>
                <div v-else class="no-data-text">暂无</div>
              </div>

              <span class="border-title">行为标签</span>
              <!-- {{entry.behaviorRulesJson}} -->
              <div class="rule-string bav-wrap">
                <template v-if="entry.behaviorRulesJson && JSON.parse(entry.behaviorRulesJson).rules.length > 0">
                  <MultipleActionTagSelect
                    ref="multipleActionTagSelect"
                    :isView="true"
                    :behaviorRulesJson="JSON.parse(entry.behaviorRulesJson)"
                  ></MultipleActionTagSelect>
                </template>
                <div v-else class="no-data-text">暂无</div>
              </div>

              <span class="border-title">流转指标</span>
              <div class="rule-string">
                <div v-if="entry.flowCondition && JSON.parse(entry.flowCondition).rules.length > 0">
                  <!-- {{entry.flowCondition}} -->
                  <ShowFlowConditionRule
                    :flowCondition="JSON.parse(entry.flowCondition)"
                    :conditionEnum="conditionEnum"
                    :soureceSignList="soureceSignList"
                  ></ShowFlowConditionRule>

                </div>
                <div v-else class="no-data-text">暂无</div>
              </div>
              <!-- <div>{{item.behaviorRulesJson}}</div> -->
            </div>

            <div v-if="!isCopiedServicer" class="drop-class" >
              <el-dropdown @command="handleCommand" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" >
                <span class="el-dropdown-link" >
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="clearfix" :command="['editEntry', entry]">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item class="clearfix" :command="['deleteEntry', entry]">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </div>
          </el-checkbox-group>

          <!-- 选择了接待员时 且 不是复用的  显示-->
          <div class="box-fotter" v-if="selectedServicer.id && !isCopiedServicer">
            <!-- <el-button>添加</el-button> -->
            <el-button type="text" icon="el-icon-plus" @click="createClient">新建服务对象筛选</el-button>
          </div>
        </div>
      </div>

      <!-- 推荐绑定内容 -->
      <div
        v-if="entryList && entryList.length > 0 && tagCodeList.length > 0"
      >
        <div class="title2">推荐绑定内容</div>
        <div class="border-line info-class" style="display: block" v-loading="recommendLoading">

          <div class="bav-wrap" style="overflow: hidden;">
            内容源：
            <el-select v-model="selectSourceCode" @change="getUptmRecommendResourceList" class="select-source-sty">
              <el-option
                v-for="item in sourceList"
                :label="item.sourceTitle"
                :value="item.sourceCode"
                :key="item.sourceCode">
              </el-option>
            </el-select>
          </div>

          <div v-for="(arr, key) in recommendResourceList" :key="key" class="recommend-list" >
            <span class="border-title" >{{ getKeyName(key) }}：</span>
            <!-- {{ arr }} -->
            <template v-if="arr && arr.length > 0">
              <span
                v-for="film in arr"
                :key="film.id"
                class="film-btn"
                title="双击复制"
                @dblclick="copyText(film.id + '-' + film.title)"
              >
                <el-popover
                  placement="top"
                  width="150px"
                  trigger="manual"
                  content="复制成功"
                  :value="popoverVisible === film.id + '-' + film.title">
                  <span slot="reference">{{ film.id }} - {{ film.title }}</span>
                </el-popover>
              </span>
            </template>
            <span v-else class="no-data-text">暂无推荐</span>
          </div>
          <!-- {{ recommendResourceList }} -->
        </div>
      </div>

      <div>
        <div class="title2">服务终止条件（可选）</div>
        <div class="set-end">
          <template v-if="exportList.length > 0">
            <!-- {{ exportCheckList }} -->
            <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">全选</el-checkbox>
            <el-button :disabled="exportCheckList.length === 0" type="text" @click="copyRules(exportList, 'export')" style="margin-left: 20px">复制</el-button>
          </template>
          <el-button v-if="!isCopiedServicer" type="text" @click="pasteRules('export')" style="float: right">粘贴条件</el-button>

          <div v-if="exportList.length === 0" class="no-data-wrap">
            <div class="noData"></div>
            <!-- 暂时木有内容呀～～ -->
          </div>
          <el-checkbox-group v-model="exportCheckList" @change="checkListChange('export')">
          <div v-for="exportItem in exportList" :key="exportItem.id" class="info-class">
            <el-checkbox :label="exportItem.id" :key="exportItem.id">
            </el-checkbox>
            <!-- <div class="item-id">{{ exportItem.id }}</div> -->
            <div class="border-line"  style="position: relative;">
              <div class="outer-and">
                <span class="and-or" :class="exportItem.link === 'OR' ? 'OR': ''">
                {{ exportItem.link === 'OR' ? '或' : '且' }}
                </span>
              </div>
              <!-- {{exportItem.rulesJson}} -->
              <!-- ( 有效混合源爱奇艺影视会员 = true 且 芯片型号 = 6A848,RTD2982DQ 且 存储 = 4G,8G ) -->
              <span class="border-title">普通标签</span>
              <div class="rule-string" >
                <div v-if="exportItem.rulesJson && JSON.parse(exportItem.rulesJson).rules.length > 0">
                  <div
                    v-for="(item, index) in JSON.parse(exportItem.rulesJson).rules"
                    :key="index"
                    class="rule-detail"
                  >
                    <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(exportItem.rulesJson).condition] }}</div>
                    <div class="label-ground">(
                      <div
                        v-for="(childItem,childItemIndex) in item.rules"
                        :key="childItem.tagId+childItemIndex"
                        class="label-item"
                      >
                      <!-- {{childItem}} -->
                        <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                        <span class="txt">{{ childItem.categoryName || childItem.tagName}}</span>

                        <!-- 流转标签 -->
                        <template v-if="(childItem.dataSource === 20)">
                          <ShowFlowConditionRuleItem
                            :childItem="childItem"
                            :soureceSignList="soureceSignList"
                            >
                          </ShowFlowConditionRuleItem>
                        </template>

                        <template v-else>
                          <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
                          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                          <span class="in">
                            <span >{{ childItem.value }}</span>
                          </span>
                          <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                        </template>

                      </div>)
                    </div>
                  </div>
                </div>
                <div v-else class="no-data-text">暂无</div>
              </div>

              <span class="border-title">行为标签</span>
              <!-- {{exportItem.behaviorRulesJson}} -->
              <div class="rule-string bav-wrap">
                <template v-if="exportItem.behaviorRulesJson && JSON.parse(exportItem.behaviorRulesJson).rules.length > 0">
                  <MultipleActionTagSelect
                    ref="multipleActionTagSelect"
                    :isView="true"
                    :behaviorRulesJson="JSON.parse(exportItem.behaviorRulesJson)"
                  ></MultipleActionTagSelect>
                </template>
                <div v-else class="no-data-text">暂无</div>
              </div>

              <span class="border-title">流转指标</span>
              <div class="rule-string">
                <div v-if="exportItem.flowCondition && JSON.parse(exportItem.flowCondition).rules.length > 0">
                  <!-- {{exportItem.flowCondition}} -->
                  <ShowFlowConditionRule
                    :flowCondition="JSON.parse(exportItem.flowCondition)"
                    :conditionEnum="conditionEnum"
                    :soureceSignList="soureceSignList"
                  ></ShowFlowConditionRule>

                </div>
                <div v-else class="no-data-text">暂无</div>
              </div>
              <!-- <div>{{item.behaviorRulesJson}}</div> -->
            </div>

            <!-- 选择了转接待员 -->
            <div class="turn-servicer" v-if="exportItem.stopType === 1">
              转
              <el-button type="text" @click="redirctByNextId(exportItem.nextId)">{{ getServicerBynextId(exportItem.nextId).receptionist }} </el-button>
            </div>
            <div v-else class="turn-servicer">{{ getStopTypeName(exportItem.stopType)}}</div>
            <div v-if="!isCopiedServicer || exportItem.stopType === 1" class="drop-class">
              <el-dropdown @command="handleCommandExport" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom">
                <span class="el-dropdown-link" >
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="clearfix" :command="['editExport', exportItem]">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!isCopiedServicer" class="clearfix" :command="['deleteExport', exportItem]">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </div>
          </el-checkbox-group>
          <div class="box-fotter" v-if="selectedServicer.id && !isCopiedServicer">
            <!-- <el-button>添加</el-button> -->
            <el-button type="text" icon="el-icon-plus" @click="createExport">新建服务终止条件</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>

  <el-dialog
    :title="(editClientRow ? '编辑' : '新建')+ '服务对象选择'"
    :visible.sync="clientDialogVisible"
    width="1200px"
    v-if="clientDialogVisible"
  >
    <createClientDialog ref="createClientDialog" :editRow="editClientRow" :options="options"></createClientDialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clientDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditEntryRule">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    :title="(editExportRow ? '编辑' : '新建')+ '服务终止条件'"
    :visible.sync="exportDialogVisible"
    width="1200px"
    v-if="exportDialogVisible"
  >
    <createClientDialog
      ref="exportClientDialog"
      :editRow="editExportRow"
      type="export"
      :servicerListFilterSelect="servicerListFilterSelect"
      :options="options"
    ></createClientDialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="exportDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditExportRule">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="编辑复用服务终止条件"
    :visible.sync="reuseExportDialogVisible"
    width="700px"
    v-if="reuseExportDialogVisible"
  >
    <el-form
      :model="reuseForm"
      :rules="reuseFormRules"
      ref="form"
      label-width="100px"
    >
      <!-- 只有出口条件选择 -->
      <el-form-item label="处理操作" prop="stopType" class="inline-form-item">
        <el-select v-model="reuseForm.stopType" clearable @change="handleStopTypeChange" disabled>
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value">
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>

        <!-- 正确，下一步  选择同一场景下其他接待员 -->
      <el-form-item v-if="reuseForm.stopType === 1" prop="nextId" class="inline-form-item" style="margin-left: -100px;">
        <el-select v-model="reuseForm.nextId" clearable placeholder="请选择流转接待员">
          <el-option
            v-for="item in servicerListFilterSelect"
            :label="item.receptionist"
            :value="item.crowdId"
            :key="item.crowdId">
            {{ item.receptionist }}
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reuseExportDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="reuseExportRule">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="编辑绩效目标"
    :visible.sync="editTargetKeyVisible"
    width="700px"
  >
  <!-- {{ targetKeyFormParent }} -->
    <EditTargetKeyDialog
      ref="editTargetKeyDialogRef"
      v-if="editTargetKeyVisible"
      :selectedServicer="selectedServicer"
      :indicatorsOptions="indicatorsOptions"
      :soureceSignListOptions="soureceSignListOptions"
      :targetKeyFormParent.sync="targetKeyFormParent"
    ></EditTargetKeyDialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editTargetKeyVisible = false">取 消</el-button>
      <el-button type="primary" @click="comfirmEditTargetKey">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { handleSave as saveFunc } from './saveEntryFunc.js'

import createClientDialog from './createClientDialog.vue'
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/IndexForStoryLine.vue'
import ShowFlowConditionRule from './ShowFlowConditionRule.vue'
import ShowFlowConditionRuleItem from './ShowFlowConditionRuleItem.vue'
import EditTargetKeyDialog from './EditTargetKeyDialog.vue'

export default {
  components: {
    createClientDialog,
    MultipleActionTagSelect,
    ShowFlowConditionRule,
    ShowFlowConditionRuleItem,
    EditTargetKeyDialog
  },
  props: {
    servicer: {
      type: Array,
      default: () => []
    },
    selectedScene: {
      type: Object,
      default: () => {}
    },
    selectedServicer: {
      type: Object,
      default: () => {}
    },
    // skillOptions: {
    //   type: Array,
    //   default: () => []
    // },
    entryList: {
      type: Array,
      default: () => []
    },
    exportList: {
      type: Array,
      default: () => []
    },
    activeIndex2Id: {
      type: [Number, String],
      default: ''
    },
    styleType: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    entryList (val) {
      if (val.length > 0) {
        const returnArr = []

        val.forEach(item => {
          const ruleArr = JSON.parse(item.rulesJson).rules

          ruleArr.forEach(z1Item => {
            z1Item.rules.forEach(z2Item => {
              if (z2Item.tagKey === 'filmModelTag' && returnArr.findIndex(reItem => reItem.tagCode === z2Item.tagCode) === -1) {
                returnArr.push(z2Item)
              }
            })
          })
        })

        this.tagCodeList = returnArr
        this.getUptmRecommendResourceList()
      }
    },
    styleType () {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.dispose() // 销毁
      }
      this.drawChart()
    },
    selectedServicer: {
      handler (val) {
        // 选择接待员时，更新接待员详情数据
        this.skillValue = val.skillId // 技能
        this.target = val.myTask || '我的任务是...'// 任务
        this.targetValue = val.indicators || ''// 绩效指标

        // 入口多选 置空
        this.clearEntry()
        // 出口多选 置空
        this.clearExport()

        // 清空绩效图表
        this.allChartData = {}
        for (const key of Object.keys(this.allCharts)) {
          const chart = this.allCharts[key]
          chart.clear()
        }

        // 根据接待员 ID 获取绩效目标
        this.getTargetById()
        // const obj = this.targetKeyList.find(item => {
        //   return this.selectedServicer.indicatorsType === item.id
        // })

        // this.targetKey = obj ? obj.lable : '' // 目标指标
        // this.targetKeyId = obj ? obj.key : ''

        // if (obj) {
        //   // 曲线图
        //   this.getPerformanceGoalData()
        // }
      }
    },
    'selectedScene.id': {
      handler () {
        this.getSkillListBySceneId()
      }
    }
  },
  computed: {
    isCopiedServicer () {
      return !!this.selectedServicer.referenceId
    },
    // 过滤掉除了自己的其他接待员 （同一场景）
    servicerListFilterSelect () {
      const data = this.servicer.filter(item => item.id !== this.activeIndex2Id)
      return data
    },
    // 编辑绩效目标，下拉框数据
    soureceSignListOptions () {
      return this.soureceSignList.map(item => {
        return {
          resourceId: item.sourceSign,
          resourceName: item.sourceName
        }
      })
    }
  },
  data () {
    return {
      reuseExportDialogVisible: false,
      reuseForm: {
        stopType: '',
        nextId: ''
      },
      reuseFormRules: {
        stopType: [{ required: true, message: '请选择', trigger: 'change' }],
        nextId: [{ required: true, message: '请选择流转接待员', trigger: 'change' }]
      },
      options: [{
        value: 1,
        label: '正确，继续种草，下一步'
      }, {
        value: 2,
        label: '正确，直接转化'
      }, {
        value: 3,
        label: '不正确，继续观察'
      }, {
        value: 4,
        label: '不喜欢切换方案'
      }],
      // isCopiedServicer: false,
      checkList: [],
      exportCheckList: [],
      checkAll: false,
      isIndeterminate: false,
      checkAll2: false,
      isIndeterminate2: false,
      popoverVisible: '',
      recommendLoading: false,
      getGoalDataLoading: false,
      targetKeyFormParent: {
        id: '', // 接待员ID
        indicatorsType: '', // 1 会员付费率，2 会员成交单数 3 会员成交金额 4 会员客单价 5会员付费设备量 6 内容影片吸金订单量 7 订单转换率 8 订单均价 9 影片播放均价
        resource: [],
        videoSource: ''
      },

      indicatorsTypelabel: '',

      formInline: {
        skillName: ''
      },
      skillOptions: [],

      colorList: ['#0078ff', '#00ffcc', '#6395f9', '#35c493', '#FD9E06', '#5470c6', '#91cd77', '#ef6567', '#f9c956', '#75bedc'],

      rowObj: {
        arup: { type: 'line', title: '会员 - 客单价', targetKeyId: 4 },
        avgPlayPrice: { type: 'line', title: '内容 - 影片播放均价', targetKeyId: 9 },
        orderNum: { type: 'line', title: '内容 - 影片吸金订单量', targetKeyId: 6 },
        orderRatio: { type: 'line', title: '内容 - 影片订单转换率', targetKeyId: 7 },
        payNum: { type: 'line', title: '会员 - 付费单数', targetKeyId: 2 },
        payRate: { type: 'line', title: '会员 - 付费率', targetKeyId: 1 },
        payUv: { type: 'line', title: '会员 - 付费设备量', targetKeyId: 5 },
        perOrder: { type: 'line', title: '内容 - 影片订单均价', targetKeyId: 8 },
        price: { type: 'line', title: '会员 - 付费金额', targetKeyId: 3 }
      },
      allCharts: {},
      allChartData: {
      },
      overview: {},
      clientDialogVisible: false,
      target: '请输入接待员的目标',
      targetValue: '',
      skillValue: '',
      isEdit: false,
      isEditValue: false,

      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      editExportRow: {},
      exportDialogVisible: false,

      targetKeyList: [{
        // 1 付费率，2 成交单数 3 成交金额 4 客单价
        id: 1,
        key: 'payRate',
        lable: '付费率（%）'
      }, {
        id: 2,
        key: 'payNum',
        lable: '付费单数'
      }, {
        id: 3,
        key: 'price',
        lable: '付费金额（元）'
      }, {
        id: 4,
        key: 'arup',
        lable: '客单价（元）'
      }],
      targetKey: '付费率（%）',
      targetKeyId: '',
      soureceSignList: [],
      editTargetKeyVisible: false,
      indicatorsOptions: [
        {
          indicatorsType: 6,
          label: '内容 - 影片吸金订单量'
        }, {
          indicatorsType: 7,
          label: '内容 - 影片订单转换率'
        }, {
          indicatorsType: 8,
          label: '内容 - 影片订单均价'
        }, {
          indicatorsType: 9,
          label: '内容 - 影片播放均价'
        },
        {
          indicatorsType: 1,
          label: '会员 - 付费率'
        }, {
          indicatorsType: 2,
          label: '会员 - 付费单数'
        }, {
          indicatorsType: 3,
          label: '会员 - 付费金额'
        }, {
          indicatorsType: 4,
          label: '会员 - 客单价'
        }, {
          indicatorsType: 5,
          label: '会员 - 付费设备量'
        }
      ],
      sourceList: [], // 内容源
      selectSourceCode: 'tencent', // 所选内容源
      recommendResourceList: [], // 推荐影片
      tagCodeList: []
    }
  },
  created () {
    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })

    this.$service.getSourceList().then(res => {
      this.sourceList = res
    })
  },
  mounted () {
    window.addEventListener('resize', () => {
      for (const key of Object.keys(this.allCharts)) {
        const chart = this.allCharts[key]
        chart.resize()
      }
    })
  },

  methods: {
    reuseExportRule () {
      // this.editExportRow = row
      // if (this.isCopiedServicer) {
      //   this.reuseForm.stopType = row.stopType
      //   this.reuseForm.nextId = row.nextId || ''
      console.log('reuseForm--->', this.reuseForm)
      console.log('selectedServicer--->', this.selectedServicer)
      console.log('editExportRow--->', this.editExportRow)
      const parmas = {
        nId: this.selectedServicer.id,
        oId: this.selectedServicer.referenceId,
        exportId: this.editExportRow.id,
        ...this.reuseForm
      }
      this.$service.updateExport(parmas).then(res => {
        // 刷新列表
        this.$emit('updataExportList')
        this.reuseExportDialogVisible = false
      })
    },
    handleStopTypeChange () {
      // 切换处理操作时，清空选择的流转接待员 ID
      this.form.nextId = ''
    },
    redirctToScene (sceneId, servicerId) {
      this.$emit('selectScene', sceneId, servicerId)
    },
    // 入口全选
    handleCheckAllChange (val) {
      // 出口多选 置空
      this.clearExport()

      const allIds = this.entryList.map(item => item.id)
      this.checkList = val ? allIds : []
      this.isIndeterminate = false
    },
    // 出口全选
    handleCheckAllChange2 (val) {
      // 入口多选 置空
      this.clearEntry()

      const allIds = this.exportList.map(item => item.id)
      this.exportCheckList = val ? allIds : []
      this.isIndeterminate2 = false
    },
    clearEntry () {
      this.checkList = [] // 入口多选 置空
      this.isIndeterminate = false // 入口多选 置空
      this.checkAll = false // 出口多选 置空
    },
    clearExport () {
      this.exportCheckList = [] // 出口多选 置空
      this.isIndeterminate2 = false // 出口多选 置空
      this.checkAll2 = false // 出口多选 置空
    },
    // 选项框选择： 入口 和 出口多选是互斥的,
    checkListChange (type) {
      if (type === 'entry') {
        // 出口多选 置空
        this.clearExport()

        const checkedCount = this.checkList.length

        this.checkAll = checkedCount === this.entryList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.entryList.length
      } else if (type === 'export') {
        // 入口多选 置空
        this.clearEntry()

        const checkedCount = this.exportCheckList.length

        this.checkAll2 = checkedCount === this.exportList.length
        this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.exportList.length
      }
    },
    // 复制条件
    copyRules (allRules, type = '') {
      if (this.checkList.length > 0 || this.exportCheckList.length > 0) {
        const parmas = {
          selectedIds: type === 'entry' ? this.checkList : this.exportCheckList,
          allRules,
          type
        }
        this.$store.commit('SET_COPY_ENTRY_ID', parmas)
        this.$message.success('复制成功')
      } else {
        this.$message.info('请勾选需要复制条件')
      }
    },
    // 粘贴条件
    pasteRules (pasteType) {
      const { type, selectedIds, allRules } = this.$store.state.configScheme.copyServiceRules
      if (selectedIds.length === 0) {
        return this.$message.error('请先复制条件')
      }
      if (type === pasteType) {
        const arr = []
        selectedIds.forEach(id => {
          const objData = allRules.find(ruleData => ruleData.id === id)
          // objData && this.savePasteRule(objData, type)
          if (objData) {
            arr.push(objData)
          }
        })
        Promise.all(arr.map((item) => this.savePasteRule(item, type))).then(res => {
          this.$message.success('粘贴成功')
        })
      } else {
        this.$message.error('入口条件、出口条件不允许混用')
      }
    },
    // 保存到后端
    savePasteRule (data, type) {
      const params = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionistId: this.selectedServicer.id,
        tagIds: data.tagIds,
        rulesJson: data.rulesJson,
        behaviorRulesJson: data.behaviorRulesJson,
        flowCondition: data.flowCondition, // 流转指标
        delFlag: 1,
        link: data.link,
        stopType: data.stopType
        // nextId
      }
      if (type === 'entry') {
        this.$service.addEntry(params).then(res => {
          // 刷新列表
          this.$emit('updataEntryList')
        })
      } else if (type === 'export') {
        this.$service.addExport(params).then(res => {
          // 刷新列表
          this.$emit('updataExportList')
        })
      }
    },

    // handleCopy () {
    //   const range = document.createRange() // 创建range对象
    //   range.selectNode(document.getElementById('copycode')) // 获取复制内容的 id 选择器
    //   const selection = window.getSelection() // 创建 selection对象
    //   if (selection.rangeCount > 0) selection.removeAllRanges() // 如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
    //   selection.addRange(range) // 将range对象添加到selection选区当中，会高亮文本块
    //   document.execCommand('copy') // 复制选中的文字到剪贴板
    //   this.$toast('复制成功')
    //   selection.removeRange(range) // 移除选中的元素
    // },
    copyText (str) {
      const input = document.createElement('input')
      const body = document.querySelector('body')
      body.append(input)
      input.value = str
      this.popoverVisible = str
      input.select()
      document.execCommand('copy')
      input.remove()

      setTimeout(() => {
        this.popoverVisible = ''
      }, 3000)
      // this.$message({
      //   message: '复制成功',
      //   type: 'success'
      // })
    },
    getKeyName (key) {
      const obj = this.tagCodeList.find(item => Number(item.tagCode) === Number(key))
      return obj ? obj.tagCnName : ''
    },
    getUptmRecommendResourceList () {
      this.recommendLoading = true
      this.recommendResourceList = []
      const tagCodeList = this.tagCodeList
      if (tagCodeList.length > 0) {
        const tagCodes = tagCodeList.map(item => item.tagCode).join(',')
        const params = {
          source: this.selectSourceCode,
          tagCodes
        }
        this.$service.getTopRecommendResourceList(params).then(res => {
          this.recommendResourceList = res || []
          this.recommendLoading = false
        }).catch(() => {
          this.recommendResourceList = []
          this.recommendLoading = false
        })
      }
    },
    getStopTypeName (val) {
      if (val === 2) {
        return '直接转化'
      } else if (val === 3) {
        return '继续观察'
      } else if (val === 4) {
        return '不喜欢'
      }
    },
    getName (val, list) {
      const obj = list.find(item => item.indicatorsType === val)
      return obj ? obj.label : ''
    },

    // 根据接待员ID获取绩效目标
    getTargetById () {
      // 清空
      this.indicatorsTypelabel = ''
      this.targetKeyId = ''

      const parmas = {
        id: this.selectedServicer.id
      }
      if (!parmas.id) return

      this.$service.getTargetById(parmas).then(res => {
        for (const key in this.rowObj) {
          if (this.rowObj[key].targetKeyId === res.indicatorsType) {
            this.targetKeyId = key
          }
        }
        this.indicatorsTypelabel = this.getName(res.indicatorsType, this.indicatorsOptions)
        // 曲线图
        this.getPerformanceGoalData()
      })
    },

    comfirmEditTargetKey () {
      if (!this.targetKeyFormParent.indicatorsType) {
        return this.$message.error('请选择指标')
      }
      this.$refs.editTargetKeyDialogRef.$refs.targetKeyFormRef.validate((valid) => {
        if (valid) {
          let resource = []

          // 会员
          if (this.targetKeyFormParent.indicatorsType < 6) {
            resource = [this.targetKeyFormParent.resource]
          } else { // 内容
            resource = this.targetKeyFormParent.resource && this.targetKeyFormParent.resource.map(item => {
              return {
                ...item,
                videoSource: this.targetKeyFormParent.videoSource
              }
            })
          }

          const parmas = {
            ...this.targetKeyFormParent,
            resource: JSON.stringify(resource),
            id: this.selectedServicer.id // 接待员ID
          }

          this.$service.saveEditIndicator(parmas, '操作成功').then(res => {
            // 刷新数据
            this.getTargetById()
            this.editTargetKeyVisible = false
          })
        }
      })
    },

    editTargetKey () {
      this.getTargetById()
      this.editTargetKeyVisible = true
    },
    toPercent (point) {
      if (!point) return ''
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },

    redirctByNextId (id) {
      const servicer = this.getServicerBynextId(id)
      // 选择接待员
      this.$emit('selectServicer', servicer.id)
      // this.selectServicer(servicer.id)
    },
    // 根据crowdId 获取名称
    getServicerBynextId (id) {
      const obj = this.servicer.find(item => item.crowdId === id)
      return obj || {}
    },
    // 新增/编辑入口条件
    addOrEditEntryRule () {
      const dialogRef = this.$refs.createClientDialog
      const rulesJson = dialogRef.rulesJson
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      const flowCondition = dialogRef.flowCondition

      saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit, flowCondition)
    },
    fetchAddOrEdit (data) {
      const dialogRef = this.$refs.createClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const { rulesJson, behaviorRulesJson } = data

      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      let params = {}
      if (this.editClientRow) {
        params = {
          ...this.editClientRow,
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink
        }
      } else {
        params = {
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink
        }
      }
      this.$service.addEntry(params, '添加成功').then(res => {
        // 刷新列表
        this.$emit('updataEntryList')
        // this.getEntryListByReceptionistId()
        this.clientDialogVisible = false
      })
    },
    // 新增、编辑出口条件
    addOrEditExportRule () {
      const dialogRef = this.$refs.exportClientDialog
      const rulesJson = dialogRef.rulesJson
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      const flowCondition = dialogRef.flowCondition

      saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit2, flowCondition)
    },
    fetchAddOrEdit2 (data) {
      const dialogRef = this.$refs.exportClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      // const rulesJson = JSON.stringify(dialogRef.rulesJson)
      // const behaviorRulesJson = JSON.stringify(dialogRef.behaviorRulesJson)
      const { rulesJson, behaviorRulesJson } = data
      const stopType = dialogRef.form.stopType // 处理操作
      const nextId = dialogRef.form.nextId // 流转接待员

      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      // let params = {}

      let params = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionistId: this.selectedServicer.id,
        tagIds,
        rulesJson,
        behaviorRulesJson,
        flowCondition, // 流转指标
        delFlag: 1,
        link: dialogRef.totalLink,
        stopType,
        nextId
      }
      if (this.editExportRow) { // 编辑
        const defaultData = { ...this.editExportRow }
        params = Object.assign(defaultData, params)
      }

      this.$service.addExport(params, '添加成功').then(res => {
        // 刷新列表
        this.$emit('updataExportList')
        // this.getExportListByReceptionistId()
        this.exportDialogVisible = false
      })
    },

    // 新建服务对象筛选
    createClient () {
      this.editClientRow = undefined
      this.clientDialogVisible = true
    },
    createExport  () {
      this.editExportRow = undefined
      this.exportDialogVisible = true
    },
    handleCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'editEntry') {
        this.editEntry(row)
      } else if (type === 'deleteEntry') {
        this.deleteEntry(row)
      }
    },
    // 编辑入口
    editEntry (row) {
      this.editClientRow = row
      this.clientDialogVisible = true
    },
    // 删入口
    deleteEntry (row) {
      this.$confirm('此操作将永久删除该服务对象, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addEntry({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.$emit('updataEntryList')
          // this.getEntryListByReceptionistId()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCommandExport (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'editExport') {
        this.editExport(row)
      } else if (type === 'deleteExport') {
        this.deleteExport(row)
      }
    },
    // 编辑出口
    editExport (row) {
      this.editExportRow = row
      if (this.isCopiedServicer) { // 编辑复用接待员的
        this.reuseForm.stopType = row.stopType
        this.reuseForm.nextId = row.nextId || ''
        this.reuseExportDialogVisible = true
      } else {
        this.exportDialogVisible = true
      }
    },
    // 删除出口
    deleteExport (row) {
      this.$confirm('此操作将永久删除该终止条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addExport({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.$emit('updataExportList')
          // this.getExportListByReceptionistId()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 服务员选择技能
    async selectSkill (e) {
      // 先判断是否是选择了已有的ID
      // const existIdArr = this.skillOptions.filter(item => item.id === e)
      // if (existIdArr.length > 0) {
      this.$emit('editReceptionist', {
        id: this.selectedServicer.id,
        skillId: e
      })
    },

    addOption () {
      if (this.formInline.skillName === '') {
        return this.$message.error('请输入技能分类')
      }
      // // 创建新技能，并选中
      const parmas = {
        sceneId: this.selectedScene.id,
        name: this.formInline.skillName
      }

      this.$service.addSceneSkill(parmas, '添加成功').then(async res => {
        this.formInline.skillName = ''
        this.getSkillListBySceneId()
      })
    },
    // 根据场景ID获取技能列表
    getSkillListBySceneId () {
      const parmas = {
        sceneId: this.selectedScene.id
      }
      return this.$service.getSceneSkillList(parmas).then(res => {
        this.skillOptions = res || []
        return res
      })
    },

    editTargetValue () {
      this.isEditValue = true
      this.$nextTick(() => {
        this.$refs.inputValue.focus()
      })
    },
    editTarget () {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.inputPriority.focus()
      })
    },
    editStatuChange () {
      this.$emit('editReceptionist', {
        id: this.selectedServicer.id,
        myTask: this.target
      }, 'no-refresh-list')

      // this.editReceptionist({
      //   id: this.selectedServicer.id,
      //   myTask: this.target
      // }, 'no-refresh-list')

      this.selectedServicer.myTask = this.target
      this.isEdit = false
    },
    editTargetValueChange () {
      // 数字正则
      const numPattern = /^-?\d*\.?\d+$/
      // 百分比正则
      // const patt = /^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/
      const patt = /^(100|[1-9]*\d(\.\d\d?\d?)?)%$|0$/

      if (numPattern.test(this.targetValue) || patt.test(this.targetValue)) {
        this.$emit('editReceptionist', {
          id: this.selectedServicer.id,
          indicators: this.targetValue
        }, 'no-refresh-list')

        // this.editReceptionist({
        //   id: this.selectedServicer.id,
        //   indicators: this.targetValue
        // }, 'no-refresh-list')

        // eslint-disable-next-line vue/no-mutating-props
        this.selectedServicer.indicators = this.targetValue
        this.isEditValue = false
      } else {
        this.$message.warning('请输入数字或百分比')
      }
    },

    // 设置绩效目标的 key 值
    // handleCommandTargetKey (val) {
    //   const obj = this.targetKeyList.find(item => {
    //     return val === item.id
    //   })
    //   this.$emit('editReceptionist', {
    //     id: this.selectedServicer.id,
    //     indicatorsType: obj.id
    //   }, 'no-refresh-list')

    //   // this.editReceptionist({
    //   //   id: this.selectedServicer.id,
    //   //   indicatorsType: obj.id
    //   // }, 'no-refresh-list')

    //   this.targetKey = obj ? obj.lable : ''
    //   this.targetKeyId = obj ? obj.key : ''

    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.selectedServicer.indicatorsType = obj ? obj.id : ''
    //   // 曲线图
    //   this.getPerformanceGoalData()
    // },

    // 接待员绩效目标查询接口
    getPerformanceGoalData () {
      this.allChartData = {}
      this.overview = {}
      const params = {
        // 【动态分组ID】,如果不是通过动态人群创建的故事线，这个的dynamicRuleId传【场景id】
        dynamicRuleId: this.selectedScene.planId || this.selectedScene.id,
        crowdId: this.selectedServicer.crowdId, // 接待员的人群 id
        isDelCache: 0 // 是否删除绩效目标缓存   0 否  1 是
      }
      // const params = {
      //   // 【动态分组ID】,如果不是通过动态人群创建的故事线，这个的 dynamicRuleId 传【场景id】
      //   dynamicRuleId: 447,
      //   crowdId: 16549, // 接待员id
      //   isDelCache: 0 // 是否删除绩效目标缓存   0 否  1 是
      // }
      // const params = {
      //   // 【动态分组ID】,如果不是通过动态人群创建的故事线，这个的 dynamicRuleId 传【场景id】
      //   dynamicRuleId: 333,
      //   crowdId: 15230, // 接待员id
      //   isDelCache: 0 // 是否删除绩效目标缓存   0 否  1 是
      // }
      this.getGoalDataLoading = true
      this.$service.getPerformanceGoalData(params).then(res => {
        // 下面 if 判断是因为接口太慢，避免渲染了上个接口的数据
        // if (res.overview && res.overview.data && res.overview.data.crowdId === this.selectedServicer.crowdId) {
        if (res && res.data && res.data.overview && res.data.overview.data.crowdId === this.selectedServicer.crowdId) {
          const tableData = res.data || {}
          this.allChartData = tableData || {}
          this.overview = tableData.overview ? tableData.overview.data : {}
          this.$nextTick(() => {
            this.drawChart()
          })
        }
        this.getGoalDataLoading = false
      })
    },
    drawChart () {
      const rowObj = this.rowObj
      // key 是代表 ref 值
      for (const key in rowObj) {
        if (rowObj[key].type === 'line') {
          this.showLine(this.allChartData[key], key)
        }
      }
    },
    //  折线图
    showLine (data, chartID) {
      const hasY2 = false
      if (data && data.xaxis && data.xaxis.length > 0) {
        const series = data.series || []
        const legendData = series.map((key) => {
          return key.name
        })
        const linesData = series.map((key) => {
          if (data.yunit === '%') {
            const arr = key.value.map(v => v * 100)
            return { name: key.name, data: arr, type: 'line' }
          } else {
            return { name: key.name, data: key.value, type: 'line' }
          }
        })

        this.setLinesEchart(chartID, '', data.xaxis, linesData, legendData, data.xunit, data.yunit, hasY2)
      }
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend, xunit = '', yunit = '', hasY2 = false, yAxisObjName1 = '', yAxisObjName2 = '') {
      const chartElement = document.getElementById(element)
      if (!chartElement) return

      const echarts = require('echarts')
      const _this = this
      const yAxisObj = {
        type: 'value',
        name: yAxisObjName1,
        axisTick: {
          show: false,
          inside: true
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: this.styleType ? '#273169' : '#000'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            // color: this.styleType ? '#0E183A' : '#c2c2c7'
            color: this.styleType ? 'rgba(255,255,255,0.1)' : '#c2c2c7'
          }

        },
        // scale: true,
        axisLabel: {
          color: this.styleType ? '#fff' : '#000',
          // margin: 30,
          formatter: function (value) {
            if (value >= 100000000) {
              value = value / 100000000 + '亿' + yunit
            } else if (value >= 10000000) {
              value = value / 10000000 + '千万' + yunit
            } else if (value >= 10000 && value < 10000000) {
              value = value / 10000 + '万' + yunit
            } else {
              value = value + yunit
            }
            return value
          }
        }
      }
      // let myChart = echarts.init(this.$refs[element])
      const option = {
        backgroundColor: '', // rgba设置透明度0.1
        grid: {
          top: 10,
          right: 50,
          left: 50,
          bottom: 30
        },
        title: {
          text: title
        },
        textStyle: { // 图例的文字样式
          color: '#ffffff80'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        color: _this.colorList,
        legend: {
          show: false,
          data: legend,
          icon: 'circle',
          top: '10%',
          right: '10%',
          textStyle: { // 图例的文字样式
            color: this.styleType ? '#fff' : '#000'
          }
        },
        xAxis: {
          type: 'category',
          data: xData,
          // 轴线的字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: this.styleType ? '#fff' : '#000',
              fontSize: '12px'
              // fontSize: 16, 可直接写数字,单位px
            }
          },
          // 轴线的样式
          axisLine: {
            lineStyle: {
              color: this.styleType ? '#273169' : '#000'
              // color: this.styleType ? '##0E183A' : '#000'
            }
          }
          // // 网格线样式
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: ['#273169']
          //   }
          // }
          // axisLabel: {
          //   interval: 'auto',
          //   rotate: yData.length > 10 ? -45 : 0,
          //   formatter: function (value) {
          //     return value + xunit
          //   }
          // }
        },
        yAxis: [yAxisObj],
        series: yData.map(item => {
          return {
            ...item,
            areaStyle: { // 要加这个属性,折线与下方的区域才能填充颜色
              // color: 'red', // 可以直接填充颜色
              opacity: this.styleType ? 1 : 0,
              color: { // 这边是设置渐变色,好看一点
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(0,156,255,0.5)'
                  },
                  {
                    offset: 0.5, // 这是于下方线的距离,设置1就不留空隙
                    color: 'rgba(0,156,255,0)'
                  }
                ],
                global: false
              }
            }
          }
        })
      }

      const myChart = echarts.init(chartElement)
      myChart.setOption(option, true)
      this.allCharts[element] = myChart
    }

  }
}
</script>

<style lang="stylus" scoped>
@import './sty/common.styl'
@import './sty/dark.styl'
@import './sty/light.styl'
.chart-div{
  height: 130px
}
.load-place {
  position absolute
  right 10px
  top 10px
  font-size 18px
}
.recommend-list {
  padding: 10px 0;
}
.recommend-list + .recommend-list {
  border-top: 1px dashed #4a4a4a;
  // border-top: 1px dashed #f3f3f3
}
.select-source-sty :deep(.el-input__inner) {
  background-color: rgb(255 0 0 / 0%);
  color: #606266;
}
.film-btn {
  color: #67c23a;
  background: #f0f9eb;
  border: 1px solid #c2e7b0;
  font-size: 12px;
  border-radius: 3px;
  padding: 5px 12px;
  display inline-block
  margin: 3px
  &:hover {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
}
.inline-form-item {
  display: inline-block;
  margin-right: 10px
  vertical-align: top;
}

</style>
