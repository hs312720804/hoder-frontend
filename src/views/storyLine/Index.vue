<template>
  <div class="total-wrap" :class="styleType ? 'dark' : 'light'">

    <!-- 绝对定位元素 -->
    <div v-if="isCopiedServicer" class="copied-servicer-tip">如需修改，请跳转到被复用的接待员处编辑</div>
    <!-- {{groupServicer}} -->
    <!-- <div style="color: red; position: absolute; z-index: 999">
      【{{$route.params.sceneId}}】
      【{{selectedScene.id}}】
    </div> -->
    <!-- {{ selectedScene }} -->
    <div class='row-wrap'
      :style="{'grid-template-columns': viewType ? '200px 200px minmax(0, 1fr)': '200px minmax(0, 1fr)'}"
    >
      <el-button v-if="$route.params.sceneId === selectedScene.id" type="primary" @click="returnCrowd" style="position: absolute; right: 34px; top: 35px; z-index: 9">
        继续编辑
      </el-button>

      <!-- 切换样式 -->
      <!-- <el-button type="text" @click="changeStyle" class="change-style-btn">{{ styleType ? '深色版' : '浅色版' }}</el-button> -->
      <!-- <i :class="styleType ? 'el-icon-moon' : 'el-icon-sunny'" class="position-right change-style-btn "  @click="changeStyle"></i> -->

      <div class="box" v-if="isShowDetailName" style="position: relative">
        <!-- <i class="el-icon-arrow-left arrow-close" @click="openShowDetailName" ></i> -->
        <div class="content">
            <div class="title">
              场景
              <el-button
                type="text"
                style="position: absolute; right: 14px; top: 6px;"
                size="mini"
                @click="changeView"
                v-text="viewType ? '流转视图': '列表视图'">
              </el-button>
            </div>

            <div class="search">
              <el-input placeholder="场景名/创建人" v-model="searchScene" class="input-with-select" @keyup.enter.native="getSceneList">
                <el-button slot="append" icon="el-icon-search" @click="getSceneList"></el-button>
              </el-input>
            </div>

            <div class="sceneList-wrap">
              <!-- {{sceneList}} -->
              <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
                <div v-if="sceneList.length === 0" class="no-data-wrap">
                  暂时木有内容呀～～
                </div>
                <div
                  v-for="(item) in sceneList"
                  :key="item.id"
                  @click="selectScene(item.id)"
                  :class="{active: activeIndex === item.id, 'gray-row': item.putway === 2}"
                  >
                  <!-- <i class="icon el-icon-video-camera-solid"></i> -->
                  <div class="lists-item">
                    <i class="icon el-icon-monitor"></i>
                    <span class="item-content">
                      {{ item.sceneName }}
                    </span>
                    <span class="item-index">{{ item.id }}</span>
                    <span class="use-status-styl">
                      <span v-if="item.useStatus === '投放中'" @click="launchDetail(item.policyId)" class="border-title">投放中</span>
                      <span v-else>未投放</span>
                    </span>
                    <el-dropdown
                      trigger="hover"
                      class="el-dropdown"
                      :hide-on-click="false"
                      placement="bottom"
                      @command="handleSceneCommand"
                      @visible-change="e => sceneVisibleChange(e, item.id)"
                    >
                      <span class="el-dropdown-link">
                        . . .
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <div
                          v-if="sceneDropDownLoading"
                          v-loading="sceneDropDownLoading"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.8)">
                        </div>
                        <!--
                            sceneDropDownCanUse - 有权限
                              - 没有权限： 【重命名】、【下架】、【投放】、【删除】 置灰
                          -->
                        <template v-else>
                          <el-dropdown-item class="clearfix" :key="item.id" :command="['rename', item]" :disabled="!sceneDropDownCanUse">
                            <el-popover placement="top" trigger="click" ref="pop" >
                              <div slot="reference">重命名</div>
                              <div style="display: flex">
                                <el-input
                                  class="re-name-input"
                                  type="text"
                                  placeholder="请输入内容"
                                  v-model="rename"
                                  maxlength="50"
                                  show-word-limit
                                  clearable
                                  style="width: 250px"
                                >
                                </el-input>

                                <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                                <el-button type="primary" size="mini" @click="handelRename(item)">确定</el-button>
                              </div>
                            </el-popover>

                          </el-dropdown-item>

                          <!-- 场景的 planId 为 null, 才展示按钮 -->
                          <!-- :disabled="servicer.length === 0" -->
                          <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['putIn', item]" :disabled="!sceneDropDownCanUse ||item.useStatus === '投放中'">
                            投放
                          </el-dropdown-item>
                          <el-dropdown-item :command="['freshCache',item]">
                            <span v-if="item.status === 1">未同步</span>
                            <span v-if="item.status === 2">已同步</span>
                          </el-dropdown-item>
                          <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['offSet', item]" :disabled="!sceneDropDownCanUse">
                            <!-- putway : 1 - 上架中； 2 - 下架中 -->
                            {{ item.putway === 1 ? '下架' : '上架' }}
                          </el-dropdown-item>

                          <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['deleteScene', item]" :disabled="!sceneDropDownCanUse">
                            删除
                          </el-dropdown-item>
                          <el-dropdown-item v-if="item.planId" :command="['report',item]">
                          <!-- <el-dropdown-item :command="['report',item]"> -->
                            投放报告
                          </el-dropdown-item>
                          <el-dropdown-item :command="['detail',item]">
                            查看配置
                          </el-dropdown-item>
                        </template>

                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div v-if="selectedScene.id === item.id && selectedScene.startTime" style="font-size: 12px; padding: 0 10px 4px; color: #666;">
                    有效期：{{ selectedScene.startTime }}
                    <span style="margin-left: 39px"> ~{{ selectedScene.endTime }}</span>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <div class="box-fotter">
              <!-- <el-button>添加</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="addScene">添加</el-button>
            </div>
        </div>
      </div>
      <!-- <div v-else style="position: relative">
        <el-button plain @click="openShowDetailName">场景 <br/>
          <i class="el-icon-arrow-right " ></i>
        </el-button>
      </div> -->

      <div v-show="viewType" class="box" >
        <!-- <div class="title" v-if="!isShowDetailName">选择场景：{{ selectedScene.sceneName }}</div> -->
        <div class="content" >
          <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
            <div class="title">
              接待员
              <el-button v-if="servicer.length > 0" type="text" style="position: absolute;right: 14px;top: 6px;" icon="el-icon-plus" size="mini" @click="addGroup">分组</el-button>
            </div>

            <div class="search">
              <el-input placeholder="接待员/创建人" v-model="searchServicer" class="input-with-select" @keyup.enter.native="getServiceList">
                <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
              </el-input>
            </div>
            <div
            class="sceneList-wrap"
            v-loading="getServicerLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)">
              <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
                <div v-if="servicer.length === 0 && !getServicerLoading" class="no-data-wrap">
                  暂时木有内容呀～～
                </div>
                <div
                v-for="(group) in groupServicer"
                :key="group.groupId"
                :class="{ 'group-sty': group.groupId !== 0 }"
                >
                  <!-- {{group.groupId}} -->
                  <div class="lists-item" v-for="item in group.child" :key="item.id"  @click="selectServicer(item.id)" :class="{active: activeIndex2Id === item.id, 'gray-row': item.putway === 2}">
                    <i class="icon el-icon-user"></i>
                    <span class="item-content">
                      {{ item.receptionist }}
                    </span>
                    <span class="item-index">{{ item.id }}</span>
                    <el-dropdown
                      trigger="hover"
                      class="el-dropdown"
                      :hide-on-click="false"
                      placement="bottom"
                      @command="handleServiceCommand"
                    >
                      <!-- @visible-change="e => visibleChange(e, item.id)" -->
                      <span class="el-dropdown-link">
                        . . .
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <!-- canUse：{{ canUse }} -->

                        <!-- <div
                          v-if="dropDownLoading"
                          v-loading="dropDownLoading"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.8)">
                        </div> -->
                        <!--
                          referenceId - 复用接待员
                            - 是：禁用【重命名】、【复制】、【复用】
                          canUse - 有权限
                            - 没有权限： 禁用 【重命名】、【下架】、【删除】
                          item.type === 1  - 兜底接待员
                            - 禁用【复制】、【复用】
                        -->
                        <!-- <template v-else> -->
                          <el-dropdown-item class="clearfix" :command="['rename', item]" :disabled="!!item.referenceId || !sceneCanReuse" >
                            <el-popover placement="top" trigger="click" ref="pop">
                              <div slot="reference">重命名</div>
                              <div style="display: flex">
                                  <el-input
                                    type="text"
                                    placeholder="请输入内容"
                                    v-model="rename2"
                                    maxlength="50"
                                    show-word-limit
                                    clearable
                                    style="width: 250px"
                                  >
                                  </el-input>

                                <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                                <el-button type="primary" size="mini" @click="handelRename2(item)">确定</el-button>
                              </div>
                            </el-popover>

                          </el-dropdown-item>
                          <!-- {{ item }} -->
                          <el-dropdown-item class="clearfix" :command="['offSet', item]" :disabled="!sceneCanReuse">
                            {{ item.putway === 1 ? '下架' : '上架' }}
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['copy', item]" :disabled="!!item.referenceId || item.type === 1">
                            复制
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['copyUse', item]" :disabled="!!item.referenceId || item.type === 1">
                            复用
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['deleteService', item]" :disabled="!sceneCanReuse">
                            删除
                          </el-dropdown-item>
                        <!-- </template> -->

                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>

              </el-scrollbar>
            </div>
            <div class="box-fotter">
              <!-- <el-button>添加</el-button> -->
              <el-button :disabled="!sceneCanReuse" type="primary" icon="el-icon-plus" @click="addServicer">添加</el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div v-show="viewType" class="box">
        <!-- 接待员详情 -->
        <servicerDetail
          ref="servicerDetailRef"
          :canUse="sceneCanReuse"
          :servicer="servicer"
          :selectedScene="selectedScene"
          :selectedServicer="selectedServicer"
          :entryList="entryList"
          :exportList="exportList"
          :activeIndex2Id="activeIndex2Id"
          :styleType="styleType"
          @updataEntryList="getEntryListByReceptionistId"
          @updataExportList="getExportListByReceptionistId"
          @selectScene="selectScene"
          @selectServicer="selectServicer"
          @editReceptionist="editReceptionist"
        ></servicerDetail>
      </div>

      <template v-if="!viewType && isShowSceneChartData">
        <div class="box" v-loading="getSceneFlowChartLoading">
          <SceneMap
            :chartData="sceneChartData"
            :selectedScene="selectedScene"
            @selectServicer="changeViewAndSelectServicer"
            @showRuleDetail="item => editClientRow = item"
          ></SceneMap>
          <div style="display: grid; grid-template-columns: 50px auto; margin-top: 0px;">
            <!-- {{ editClientRow }} -->
            {{ editClientRow.id }}
            <showAllRule
              v-if="editClientRow.id"
              :entry="editClientRow"
              :conditionEnum="conditionEnum"
              :soureceSignList="soureceSignList"
            >
            </showAllRule>
          </div>
        </div>
      </template>

      <el-dialog
        title="一键投放"
        :visible.sync="dialogVisible"
        width="95%"
      >
        <!-- <el-form :model="formScene" :rules="formSceneRules" ref="formSceneRef" @submit.native.prevent>
          <el-form-item label="场景名：" label-width="90px" prop="name">
            <el-input v-model="formScene.name" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-form> -->
        <OneDrop
          v-if="dialogVisible"
          @updateSceneList="updateSceneList"
          @closeDialog="closeAddSceneDialog"
        ></OneDrop>

        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddScene">确 定</el-button>
        </span> -->
      </el-dialog>
      <!-- :fullscreen="createType === 0 ? false : true" -->
      <el-dialog
        title="添加接待员"
        :visible.sync="dialogVisible2"
        :width="createType === 0 ?'30%': '95%'"
        :close-on-press-escape="false"
        :show-close="false"
        >
        <div class="create-type-sty">
          创建方式：
          <el-radio v-model="createType" :label="0">逐个创建</el-radio>
          <el-radio v-model="createType" :label="1">批量创建</el-radio>
        </div>

        <!-- 单个创建 -->
        <el-form v-if="createType === 0" :model="formServicer" :rules="formServicerRules" ref="formServicerRef" @submit.native.prevent label-width="100px" >
          <el-form-item label="接待员名：" prop="receptionist">
            <el-input v-model.trim="formServicer.receptionist" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label=""  v-if="!currentSceneHasDoudi">
            <!-- <el-input v-model="formServicer.name" autocomplete="off" clearable></el-input> -->
            <el-checkbox v-model="formServicer.type">设为兜底接待员</el-checkbox>
          </el-form-item>
          <el-form-item label="" v-else>
            <span class="tip-text">仅支持创建一个兜底, 当前已有兜底接待员</span>
          </el-form-item>

          <el-form-item v-if="formServicer.type" label="兜底方式：" >
            <el-radio v-model="formServicer.planc" :label="0">直接兜底</el-radio>
            <el-radio v-model="formServicer.planc" :label="1">随机再兜底</el-radio>
          </el-form-item>
        </el-form>

        <!-- 批量创建 -->
        <MultiAdd v-else-if="dialogVisible2" v-model="multiAddStep" ref="multiAddRef" :batchId="batchId">

        </MultiAdd>
        <span v-if="createType === 0" slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddServicer">确 定</el-button>
        </span>

        <span v-else-if="createType === 1" slot="footer" class="dialog-footer">
          <!-- multiAddStep: {{ multiAddStep }} -->

          <el-button @click="dialogVisible2 = false">取 消</el-button>

          <el-button v-if="multiAddStep === 0" type="primary" @click="multiAddNextStep">下一步</el-button>

          <template v-else>
            <!-- <el-button @click="multiAddStep= multiAddStep - 1">上一步</el-button> -->
            <el-button  type="primary" @click="confirmMultiAddServicer">确 定</el-button>
          </template>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="showLaunchToBusiness" v-if="showLaunchToBusiness">
        <LaunchToBusiness
          :recordId="tempPolicyAndCrowd.policyId"
          :tempPolicyAndCrowd="tempPolicyAndCrowd"
          :fromStoryline="true"
          @closeDialog="handleCloseDialog"
          @refreshList="getSceneList"
        ></LaunchToBusiness>
      </el-dialog>
      <el-dialog :visible.sync="showDragVisible" v-if="showDragVisible" title="添加分组" width="550px" :close-on-click-modal="false">
        <!-- {{ groupData }} -->

        <!-- <div class="scene-type-class">
          分组类型：
          <el-radio v-model="sceneType" :label="1">跨平台分组</el-radio>
          <el-radio v-model="sceneType" :label="2">同平台分组</el-radio>
        </div> -->

        <drag
          :list="noGroupService"
          :groupData.sync="groupData"
          :launchPlatformData="launchPlatformData"
        ></drag>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDragVisible = false">取 消</el-button>
          <el-button type="primary" @click="addServicerGroup">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 复制 / 复用 接待员 -->
      <el-dialog :visible.sync="copyDialogVisible" :title="`${copyType === 'copyUse' ? '复用接待员到场景' : '将接待员复制到以下场景'}`" width="550px">
        <el-form :model="copyForm" ref="copyFormRef" :rules="copyFormRule">
          <el-form-item label="选择场景：" prop="sceneId">
            <!-- 复用 -->
            <el-select v-if="copyType === 'copyUse'" v-model="copyForm.sceneId" clearable filterable>
              <el-option
                v-for="item in sceneListFilterSelect"
                :key="item.id"
                :label="item.sceneName"
                :value="item.id">
              </el-option>
            </el-select>
            <!-- 复制 -->
            <el-select v-else v-model="copyForm.sceneId" clearable filterable>
              <el-option
                v-for="item in sceneList"
                :key="item.id"
                :label="item.sceneName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="copyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmCopy">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查看配置弹窗-->
      <el-dialog title="查看配置" :visible.sync="showConfiguration">
        <c-content-wrapper
          :pagination="detailPagination.pagination"
          @filter-change="handleFilterChange"
        >
          <c-table
            :data="seeDetailData.data"
            :props="seeDetailData.props"
            :header="seeDetailData.header"
          >
          </c-table>
        </c-content-wrapper>
        <!-- <el-input type="textarea" v-model="configTextarea" :rows="8" :readonly="true"></el-input> -->
      </el-dialog>
   </div>
  </div>
</template>

<script>
import LaunchToBusiness from '../launch/StrategyPutIn'
import drag from './drag.vue'
import servicerDetail from './servicerDetail.vue'
import { removePendingRequest } from '@/services/cancelFetch'
import MultiAdd from './multiAdd/Index'
import OneDrop from './oneDrop/Index'
// 校验规则
// import { validateRule } from './validateRuleData.js'
import { confirmMultiAddServicerFn, multiAddNextStepFn } from './multiAdd/func.js'

import SceneMap from './mapShow/sceneMap.vue'
import showAllRule from '@/views/storyLine/com/showAllRule.vue'

export default {
  components: {
    LaunchToBusiness,
    drag,
    servicerDetail,
    MultiAdd,
    OneDrop,
    SceneMap,
    showAllRule
  },

  provide () {
    return {
      _this: this
    }
  },
  data () {
    return {
      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      soureceSignList: [],
      getSceneFlowChartLoading: false,
      isShowSceneChartData: true,
      sceneChartData: {},
      viewType: true,
      sceneCanReuse: false, // 当前场景是否有权限
      // canUse: false, // 下拉框的接待员是否有权限操作
      sceneDropDownLoading: true,
      sceneDropDownCanUse: false, // 下拉框的接待员是否有权限操作
      currentSceneHasDoudi: false,
      batchId: '',
      sceneType: 1,
      multiAddStep: 0,
      dropDownLoading: true,
      createType: 0, // 0-单个创建； 1-批量创建
      isShowDetailName: true,
      getServicerLoading: false,
      showConfiguration: false,
      seeDetailData: {
        props: {
          border: true
        },
        data: [],
        header: [
          {
            label: '版本号',
            prop: 'versionId'
          },
          {
            label: '文件名称',
            prop: 'fileName'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '操作',
            width: '100px',
            render: (h, { row }) => {
              return h('el-popover', {
                attrs: {
                  placement: 'left',
                  width: '600',
                  trigger: 'click'
                }
              }, [
                h('el-input', {
                  props: {
                    type: 'textarea',
                    rows: 8,
                    readonly: true,
                    value: row.content,
                    autosize: { minRows: 10, maxRows: 20 }
                  },
                  class: 'get-setting'
                }),
                h('el-button', {
                  props: {
                    type: 'text'
                  },
                  slot: 'reference'
                }, '查看配置')])
            }
          }
        ]
      },
      detailPagination: {
        filter: {},
        pagination: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        currentId: null
      },
      formServicerRules: {
        receptionist: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      copyFormRule: {
        sceneId: [
          { required: true, message: '请选择场景', trigger: 'change' }
        ]
      },
      tipMsg: '下一步不可为空',
      // tipMsg: '请完善当前接待员服务终止条件中的处理操作',
      copyType: '',
      copyForm: {
        id: '',
        sceneId: ''
      },
      copyDialogVisible: false,
      noGroupService: [],
      styleType: false,
      groupData: [{
        list: [],
        groupName: '组1'
      }],
      showDragVisible: false,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      editClientRow: {},
      selectedScene: {}, // 选择的场景
      selectedServicer: {}, // 选择的服务员
      searchScene: '',
      searchServicer: '',
      renameVisible: false,
      formServicer: {
        receptionist: '',
        type: false,
        planc: 0
      },
      dialogVisible: false,
      dialogVisible2: false,
      activeIndex: 0, // 当前所选场景
      activeIndex2Id: '', // 当前所选接待员
      sceneList: [],
      servicer: [],
      skillList: [],
      entryList: [],
      exportList: [],
      rename: '',
      rename2: '',
      launchPlatformData: []
    }
  },

  computed: {
    isCopiedServicer () {
      return !!this.selectedServicer.referenceId
    },
    havePermissionsToCheck () {
      // sceneCanReuse - 当前登录用户对于该场景是否有权限
      // isCopiedServicer - 是否为复用的接待员 true-是  false-否
      // return this.selectedServicer.id && !this.isCopiedServicer && this.sceneCanReuse
      return this.selectedServicer.id && this.sceneCanReuse
    },
    // 接待员分组数据
    groupServicer () {
      const arr = this.mergeSameAttribute(this.servicer)
      return arr
    },
    // 过滤掉除了自己的其他接待员 （同一场景）
    servicerListFilterSelect () {
      const data = this.servicer.filter(item => item.id !== this.activeIndex2Id)
      return data
    },
    // 过滤掉当前选择接待员，获得其他接待员
    sceneListFilterSelect () {
      return this.sceneList.filter(item => item.id !== this.activeIndex)
    }
  },
  watch: {
    '$route.params': {
      handler (val) {
        // if (val.sceneId) {
        this.getSceneList()
        // }
      },
      immediate: true
    },
    'selectedScene.id' () {
      this.editClientRow = {}
    }
  },
  created () {
    // this.getSceneList()

    this.getPolicyList()

    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })
  },
  mounted () {
    window.addEventListener('visibilitychange', this.handleVisiable)
    // window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // window.addEventListener('beforeunload', this.aaaa)
    // window.addEventListener('unload', this.updateHandler)
    console.log('window-->', window)
    console.log('docment-->', document)
    console.log('docment-->', document === window.document)
  },
  destroyed () {
    window.removeEventListener('visibilitychange', this.handleVisiable)
    // window.removeEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // window.removeEventListener('beforeunload', this.aaaa)
    // window.removeEventListener('unload', this.updateHandler)
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // if (to.name === 'detail') { // 若要跳到详情页，则将分页和筛选信息存在Storage
    //   window.sessionStorage.setItem('pageInfo', JSON.stringify(this.pageInfo))
    // } else { // 若不是详情页，则清楚分页信息
    //   window.sessionStorage.removeItem('pageInfo')
    // }
    const bool = this.getIsAllSetNextId()
    // 当没有权限时，不需要要校验
    if (bool || !this.havePermissionsToCheck) {
      // 执行路由跳转
      next()
    } else {
      alert(this.tipMsg)
    }
  },
  methods: {
    changeViewAndSelectServicer (id) {
      this.viewType = !this.viewType
      this.selectServicer(id)
    },
    changeView () {
      this.viewType = !this.viewType
      this.getSceneFlowChart()
    },
    getSceneFlowChart () {
      const params = {
        id: this.selectedScene.id
      }
      this.getSceneFlowChartLoading = true
      this.$service.sceneFlowChart(params).then(res => {
        console.log('', 'res--->', res)
        this.getSceneFlowChartLoading = false
        this.sceneChartData = res
        this.isShowSceneChartData = true
      })
    },
    launchDetail (pid) {
      this.showLaunch = true
      this.$service.policyUseInBi({ policyId: pid }).then((data) => {
        this.launchItems = data
      })
    },
    updateSceneList () {
      this.getSceneList('add')
    },
    closeAddSceneDialog () {
      this.dialogVisible = false
    },
    confirmMultiAddServicer () {
      const allPerSetRef = this.$refs.multiAddRef.$refs.allPerSetRef
      const p = confirmMultiAddServicerFn({ allPerSetRef })
      console.log('a--->', p)

      p.then(receptionists => {
        // this.fetchSave(receptionists)

        const params = {
          batchId: this.batchId,
          receptionists
        }
        // 第二步保存
        this.$service.batchSaveSecond(params, '成功保存').then(res => {
          // 刷新接待员列表
          this.getServiceList('add')
          this.dialogVisible2 = false
        })
      })
    },

    // 批量创建接待员 - 下一步
    multiAddNextStep () {
      const commonSetRef = this.$refs.multiAddRef.$refs.commonSetRef
      const p = multiAddNextStepFn({ commonSetRef })
      p.then(res => {
        const { allEntryArr, allExportArr, ruleFormData } = res
        this.batchSaveFirst({ allEntryArr, allExportArr, ruleFormData })
      })
    },

    batchSaveFirst ({ allEntryArr, allExportArr, ruleFormData }) {
      console.log('ruleFormData--->', ruleFormData)

      const parmas = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        namePre: ruleFormData.prependName,
        nameSuf: ruleFormData.appendName,
        tagIds: ruleFormData.resource,
        entry: allEntryArr,
        export: allExportArr
      }
      this.$service.batchSaveFirst(parmas).then(res => {
        this.batchId = res || ''
        // 下一步
        this.multiAddStep = this.multiAddStep + 1
      }).catch(() => {
        // this.multiAddStep = this.multiAddStep + 1
      })
    },
    // visibleChange (val, id) {
    //   console.log(val, id)
    //   if (val && id) {
    //     this.dropDownLoading = true
    //     const params = {
    //       id
    //     }
    //     this.$service.getCanReuse(params).then(res => {
    //       this.dropDownLoading = false
    //       this.canUse = res || false
    //     })
    //   }
    // },
    sceneVisibleChange (val, id) {
      if (val && id) {
        this.sceneDropDownLoading = true
        const params = {
          id
        }
        this.$service.getSceneCanReuse(params).then(res => {
          this.sceneDropDownLoading = false
          this.sceneDropDownCanUse = res || false
        })
      }
    },
    // openShowDetailName () {
    //   this.isShowDetailName = !this.isShowDetailName
    // },
    seeDevDetail (row) {
      this.showConfiguration = true
      this.detailPagination.currentId = row.policyId
      this.loadDetailList()
    },
    loadDetailList () {
      const params = {
        policyId: this.detailPagination.currentId,
        pageNum: this.detailPagination.pagination.currentPage,
        pageSize: this.detailPagination.pagination.pageSize
      }
      this.$service.seeDevFileList(params).then((data) => {
        this.seeDetailData.data = data.rows
        this.detailPagination.pagination.total = data.total
      })
    },
    // 查看配置分页
    handleFilterChange () {
      this.loadDetailList(this.detailPagination.currentId)
    },

    // 判断是否已经设置了出口条件的下一步
    getIsAllSetNextId () {
      const length = this.exportList.length

      // 查找未填写完整的索引
      const incompleteIndex = this.exportList.findIndex(exItem => exItem.stopType && exItem.stopType === 1 && !exItem.nextId)
      // const isAllSet = length > 0 && this.exportList.every(item => (!!item.stopType && item.stopType !== 1) || (item.stopType === 1 && item.nextId))
      const isAllSet = (length > 0 && incompleteIndex === -1) || (length === 0)

      if (isAllSet) { // 全部已经设置了出口 -下一步
        return true
      } else {
        const servicerDetailRef = this.$refs.servicerDetailRef.$refs.exportRef

        for (const [key, item] of Object.entries(servicerDetailRef)) {
          if (Number(incompleteIndex) === Number(key)) { // 判断选中的dom为要滑动的dom
            item.scrollIntoView({ behavior: 'instant' }) // 滑动到可视区域
            break
          }
        }

        return false
      }
    },
    handleVisiable (e) {
      switch (e.target.visibilityState) {
        case 'prerender':
          // console.log('网页预渲染，内容不可见')
          break
        case 'hidden': {
          // console.log('内容不可见，处理后台、最小化、锁屏状态')
          // alert('当前接待员出口下一步不可为空')
          const bool = this.getIsAllSetNextId()
          // 当没有权限时，不需要要校验
          if (!(bool || !this.havePermissionsToCheck)) {
            alert(this.tipMsg)
          }
          break
        }
        case 'visible':
          console.log('处于正常打开')
          break
      }
    },
    mergeSameAttribute  (arr) {
      const dataInfo = {}
      arr.forEach((item, index) => {
        const { groupId } = item
        if (!dataInfo[groupId]) {
          dataInfo[groupId] = {
            groupId: item.groupId,
            child: []
          }
        }
        dataInfo[groupId].child.push(item)
      })
      const list = Object.values(dataInfo) // list 转换成功的数据
      return list
    },
    getListGroupBySceneId () {
      return new Promise((resolve, reject) => {
        const params = {
          sceneId: this.selectedScene.id
        }
        this.noGroupService = JSON.parse(JSON.stringify(this.servicer))
        this.$service.getListGroup(params).then(res => {
          if (res && res.length > 0) {
            this.groupData = res.map(item => {
              const list = item.list.map(obj => {
                const ser = this.servicer.find(s => obj.receptionistId === s.id)
                const receptionist = ser ? ser.receptionist : ''

                this.noGroupService = this.noGroupService.filter(s => obj.receptionistId !== s.id) // 过滤没有分组的接待员
                // if (aIndex > -1) this.noGroupService.splice(aIndex, 1)

                return {
                  ...obj,
                  receptionist
                }
              })
              return {
                id: item.id,
                sceneId: item.sceneId,
                groupName: item.groupName,
                list
              }
            })
          } else {
            // 初始化
            this.groupData = [{
              list: [],
              groupName: '组1'
            }]
          }
        })
        resolve(this.groupData)
      })
    },

    changeStyle () {
      this.styleType = !this.styleType
    },
    getPolicyList () {
      this.$service.launchPolicyIndex().then(data => {
        this.launchPlatformData = data.biLists
      })
    },
    // 添加接待员分组
    addServicerGroup () {
      const list = []
      this.groupData.forEach(group => {
        if (group.list.length > 0) {
          list.push(
            {
              ...group,
              sceneId: this.selectedScene.id
            }
          )
        }
      })
      const params = {
        list,
        sceneType: this.sceneType
      }
      this.$service.addGroup(params).then(res => {
        // 刷新列表
        this.getServiceList()
        this.showDragVisible = false
      }, '成功')
    },
    // 添加分组
    async addGroup () {
      // 接待员分组
      await this.getListGroupBySceneId()
      this.showDragVisible = true
    },
    handleCloseDialog () {
      this.showLaunchToBusiness = false
    },

    handelRename2 (item) {
      if (!this.rename2) {
        return this.$message.error('请输入名称')
      }
      this.editReceptionist({
        id: item.id,
        // ...item,
        receptionist: this.rename2
      })
      this.handelClosePop()
    },
    deleteService (item) {
      this.$confirm('此操作将永久删除该接待员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editReceptionist({
          id: item.id,
          delFlag: 2
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    offSetService (item) {
      // putway  1 上架 2 下架
      this.editReceptionist({
        id: item.id,
        putway: item.putway === 1 ? 2 : 1
      })
    },
    handleServiceCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'rename') {
        this.showRename2(row)
      } else if (type === 'offSet') {
        this.offSetService(row)
      } else if (type === 'deleteService') {
        this.deleteService(row)
      } else if (type === 'copy') {
        this.copyService(row)
      } else if (type === 'copyUse') {
        this.copyService(row, 'copyUse')
      }
    },
    copyService (item, type = 'copy') {
      this.copyType = type
      this.copyForm.id = item.id
      this.copyDialogVisible = true
      // 初始化数据
      this.$nextTick(res => {
        this.$refs.copyFormRef.resetFields()
      })
    },
    comfirmCopy () {
      if (this.copyType === 'copyUse') {
        console.log('提交保存复用')
        this.$refs.copyFormRef.validate((valid) => {
          if (valid) {
            this.$service.reuseReceptionist(this.copyForm, '复用成功').then(res => {
              // 刷新列表
              this.getServiceList()
              this.copyDialogVisible = false
            })
          }
        })
      } else {
        this.$refs.copyFormRef.validate((valid) => {
          if (valid) {
            this.$service.copyServicer(this.copyForm, '复制成功').then(res => {
              // 刷新列表
              this.getServiceList()
              this.copyDialogVisible = false
            })
          }
        })
      }
    },
    handleSceneCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'rename') {
        this.showRename(row)
      } else if (type === 'putIn') {
        this.putInScene(row)
      } else if (type === 'offSet') {
        this.offSetScene(row)
      } else if (type === 'deleteScene') {
        this.deleteScene(row)
      } else if (type === 'detail') {
        this.seeDevDetail(row)
      } else if (type === 'report') {
        this.goToDynamicCrowdReport(row)
      } else if (type === 'freshCache') {
        this.freshCache(row)
      }
    },
    freshCache (row) {
      this.$confirm('新建的人群策略将实时生效，旧的策略更新需要延时2小时生效', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.freshCache({ policyId: row.policyId }).then(data => {
            this.getSceneList()
            this.$message({
              type: 'info',
              message: data
            })
          })
        })
    },
    // 跳转投后报告页面
    goToDynamicCrowdReport ({ id, sceneName }) {
      const componentName = 'storyReport'
      this.$router.push({ path: '/dynamicReport', query: { id, sceneName, componentName, type: 'story' } })
    },

    returnCrowd () {
      this.$router.push({ name: 'strategyList' })
    },
    showRename (item) {
      this.rename = item.sceneName
    },
    showRename2 (item) {
      this.rename2 = item.receptionist
    },
    // 投放
    putInScene (item) {
      this.tempPolicyAndCrowd = {
        ...item,
        policyName: item.sceneName,
        smart: true
      }
      this.showLaunchToBusiness = true
      // this.editScene({
      //   ...item,
      //   putway: 1
      // })
    },
    // 下架
    offSetScene (item) {
      // putway  1 上架 2 下架
      this.editScene({
        ...item,
        putway: item.putway === 1 ? 2 : 1
      })
    },
    deleteScene (item) {
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editScene({
          ...item,
          delFlag: 2
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 根据接待员ID获取入口列表
    getEntryListByReceptionistId () {
      const parmas = {
        receptionistId: this.selectedServicer.id
      }
      this.$service.getEntryList(parmas).then(res => {
        this.entryList = res || []
      })
    },
    // 根据接待员ID获取出口列表
    getExportListByReceptionistId () {
      const parmas = {
        receptionistId: this.selectedServicer.id
      }
      this.$service.getExportList(parmas).then(res => {
        this.exportList = res || []
      })
    },

    // 选择场景
    async selectScene (id, selectServicerId) {
      const bool = this.getIsAllSetNextId()
      // 当没有权限时，不需要要校验
      if (bool || !this.havePermissionsToCheck) {
        this.activeIndex = id

        // this.selectedScene = this.sceneList[index] || {}
        const obj = this.sceneList.find(item => item.id === id)
        this.selectedScene = obj || {}

        this.searchServicer = '' // 接待员的搜索条件置空
        // 判断当前所选场景是否有权限
        await this.getSceneCanReuse()

        this.getServiceList('list', selectServicerId)

        // 查看拓扑图
        this.isShowSceneChartData = false
        this.getSceneFlowChart()
      } else {
        alert(this.tipMsg)
      }
    },
    // 选择服务员
    selectServicer (id) {
      console.log('havePermissionsToCheck===>', this.havePermissionsToCheck)
      const bool = this.getIsAllSetNextId()
      // 当没有权限时，不需要要校验
      if (bool || !this.havePermissionsToCheck) {
        // 跳转
        this.activeIndex2Id = Number(id)
        const obj = this.servicer.find(item => Number(item.id) === Number(id))
        this.selectedServicer = obj || {}

        // 入口列表
        this.getEntryListByReceptionistId()
        // 出口列表
        this.getExportListByReceptionistId()
      } else {
        alert(this.tipMsg)
      }
    },

    // 服务员列表
    getServiceList (type = 'list', selectServicerId) {
      const parmas = {
        sceneId: this.selectedScene.id,
        keywords: this.searchServicer,
        pageNum: 1,
        pageSize: 1000
      }
      this.servicer = []
      // 再次点击详情时中断之前的详情请求，防止数据被之前接口数据所覆盖·
      removePendingRequest({
        method: 'get',
        url: '/api/receptionist/list'
      })
      this.getServicerLoading = true
      this.$service.getReceptionistList(parmas).then(res => {
        this.servicer = res.data || []
        this.selectedServicer = {}
        this.entryList = []
        this.exportList = []
        this.getServicerLoading = false
        if (this.servicer.length > 0) {
          if (selectServicerId) this.activeIndex2Id = selectServicerId
          const obj = this.servicer.find(item => item.id === this.activeIndex2Id)

          this.activeIndex2Id = obj ? obj.id : this.servicer[0].id

          if (type === 'add') { // 添加接待员，焦点落在新增的上面
            this.activeIndex2Id = this.servicer[0].id
          }

          this.selectServicer(this.activeIndex2Id)
        }
        // this.activeIndex2 = 0
        // this.selectedServicer = this.servicer[0] || {}
      })
    },
    // 场景列表
    getSceneList (type = 'list') {
      const parmas = {
        keywords: this.searchScene,
        pageNum: 1,
        pageSize: 1000
      }
      this.sceneList = []
      this.$service.getSceneList(parmas).then(res => {
        this.sceneList = res.data || []
        if (this.sceneList.length > 0) {
          // 获取从动态人群跳转过来的场景ID，并选中
          const id = this.$route.params.sceneId || this.activeIndex
          const obj = this.sceneList.find(item => item.id === id)

          this.activeIndex = obj ? obj.id : this.sceneList[0].id
          // const redirctIndex = this.sceneList.findIndex(item => Number(id) === Number(item.id))
          // if (redirctIndex > 0) {
          //   this.activeIndex = redirctIndex
          // } else if (this.sceneList.length <= this.activeIndex) {
          //   this.activeIndex = 0
          // }
          // this.activeIndex = redirctIndex > 0 ? redirctIndex : this.activeIndex

          if (type === 'add') { // 添加接待员，焦点落在新增的上面
            this.activeIndex = this.sceneList[0].id
          }
          this.selectScene(this.activeIndex)
        }
        // this.activeIndex = 0
        // this.selectedScene = this.sceneList[0] || {}
        // this.getServiceList()
      })
    },
    // 判断当前所选场景是否有权限
    getSceneCanReuse () {
      // 再次点击详情时中断之前的请求，防止数据被之前接口数据所覆盖·
      removePendingRequest({
        method: 'get',
        url: '/api/scene/getAccess'
      })

      this.sceneCanReuse = false
      if (this.selectedScene.id) {
        const params = {
          id: this.selectedScene.id
        }
        return this.$service.getSceneCanReuse(params).then(res => {
          this.sceneCanReuse = res || false
        })
      }
    },
    handelRename (item) {
      if (!this.rename) {
        return this.$message.error('请输入名称')
      }
      this.editScene({
        // id: item.id,
        ...item,
        sceneName: this.rename
      })
      this.handelClosePop()
    },
    editScene (parmas) {
      // const list = this.sceneList

      this.$service.editScene(parmas).then(res => {
        // const index = list.findIndex(item => item.id === parmas.id)
        // list.splice(index, 1, parmas)
        this.getSceneList()
      })
    },
    // 编辑接待员
    editReceptionist (params, type) {
      // const list = this.servicer
      this.$service.editReceptionist(params).then(res => {
        // const index = list.findIndex(item => item.id === params.id)
        // list.splice(index, 1, params)
        if (type === 'no-refresh-list') return
        this.getServiceList()
      })
    },
    handelClosePop () {
      const pops = this.$refs.pop
      pops.forEach(item => {
        item.doClose()
      })
    },
    addScene () {
      this.dialogVisible = true
    },
    addServicer () {
      this.multiAddStep = 0 // 批量创建的步骤重置为 第一步
      this.dialogVisible2 = true

      // 判断场景是否有兜底接待员
      this.getType()
      this.$nextTick(() => {
        this.formServicer.type = false
        this.$refs.formServicerRef.resetFields()
      })
    },
    getType () {
      const params = {
        sceneId: this.selectedScene.id
      }
      this.$service.getReceptionistType(params).then(res => {
        this.currentSceneHasDoudi = res || false
      })
    },
    confirmAddScene () {
      // console.log('this.formScene.length--------', this.sceneList.length)
      this.$refs.formSceneRef.validate(valid => {
        if (valid) {
          const parmas = {
            sceneName: this.formScene.name
            // id: this.sceneList.length + 1
          }

          this.$service.addScene(parmas).then(res => {
            // this.sceneList.push(item)
            // const _this = this
            this.getSceneList('add')
            this.dialogVisible = false
          })
        }
      })
    },
    // 确定添加服务员
    confirmAddServicer () {
      this.$refs.formServicerRef.validate(valid => {
        if (valid) {
          const parmas = {
            sceneId: this.selectedScene.id,
            policyId: this.selectedScene.policyId,
            // receptionist: this.formServicer.name
            // id: this.sceneList.length + 1,
            ...this.formServicer,
            type: this.formServicer.type ? 1 : 0
          }

          this.$service.addReceptionist(parmas).then(res => {
            // this.sceneList.push(item)
            this.getServiceList('add')
            this.dialogVisible2 = false
          })
        }
      })
    }

  }
}
</script>

<style lang="stylus" scoped>
@import './sty/common.styl'
@import './sty/dark.styl'
@import './sty/light.styl'

#octagon {
  width: 100px;
  height: 100px;
  background: red;
  position: relative;
}
#octagon:before {
  content: "";
  width: 100px;
  position: absolute;
  top: 0; left: 0;
  border-bottom: 29px solid red;
  border-left: 29px solid #fff;
  border-right: 29px solid #fff;
  box-sizing: border-box;
}
#octagon:after {
  content: "";
  width: 100px;
  position: absolute;
  bottom: 0; left: 0;
  border-top: 29px solid red;
  border-left: 29px solid #fff;
  border-right: 29px solid #fff;
  box-sizing: border-box;
}
.arrow-close {
  position: absolute;
  top: 50%;
  z-index: 99;
  right: -14px;
  height: 50px;
  line-height: 50px;
  background: #fff;
  border-radius: 0 6px 6px 0;
}
.create-type-sty {
  padding 0 0 30px 57px
}
.scene-type-class {
  margin -10px 20px 20px
}
.use-status-styl {
  position: absolute;
  z-index: 99;
  right: 2px;
  font-size: 12px;
  bottom: -3px;
  color: #999;
}
</style>
