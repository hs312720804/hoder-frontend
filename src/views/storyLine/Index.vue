<template>
  <div class='row-wrap'>
    <div class="box">
      <div class="content">
        <div class="title">场景</div>

        <div class="search">
          <el-input placeholder="场景名/创建人" v-model="searchScene" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getSceneList"></el-button>
          </el-input>
        </div>

        <div class="sceneList-wrap">
          <!-- {{sceneList}} -->

          <div class="lists-item" v-for="(item,index) in sceneList" :key="item.id" @click="selectScene(index)" :class="{active: activeIndex === index}">
            <i class="icon el-icon-video-camera-solid"></i>
            <span class="item-content">
              {{ item.sceneName }}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ item.id }}
            </span>

            <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" @command="handleSceneCommand">
              <span class="el-dropdown-link">
                . . .
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" :key="item.id" :command="['rename', item]">
                  <!-- <el-popover
                    placement="top"
                    width="160"
                    v-model="renameVisible"
                    trigger="manual"
                  > -->
                    <!-- <div slot="reference">重命名</div> -->
                    <!-- <template #reference>
                      <span @click="renameVisible = true">重命名</span>
                    </template>
                    <p>这是一段内容这是一段内容确定删除吗？</p> -->
                    <!-- <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="renameVisible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="renameVisible = false">确定</el-button>
                    </div> -->

                  <!-- </el-popover> -->
                  <el-popover placement="top" trigger="click" ref="pop" >
                    <div slot="reference">重命名</div>
                    <div style="display: flex">
                      <el-input
                        class="re-name-input"
                        type="text"
                        placeholder="请输入内容"
                        v-model="rename"
                        maxlength="20"
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
                <el-dropdown-item class="clearfix" :command="['putIn', item]">
                  投放
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" :command="['offSet', item]">
                  {{ item.putway === 1 ? '下架' : '上架' }}
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" :command="['deleteScene', item]">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </div>
        <div class="box-fotter">
          <!-- <el-button>添加</el-button> -->
          <el-button type="primary" icon="el-icon-plus" @click="addScene">添加</el-button>
        </div>

      </div>
    </div>

    <div class="box">
      <div class="content">
        <div class="title">接待员 </div>

        <div class="search">
          <el-input placeholder="接待员/创建人" v-model="searchServicer" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
          </el-input>
        </div>
        <div class="sceneList-wrap" >
          <div class="lists-item" v-for="(item, index) in servicer" :key="item.id" @click="selectServicer(index)" :class="{active: activeIndex2 === index}">
            <i class="icon el-icon-user"></i>
            <span class="item-content">
              {{ item.receptionist }}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ item.id }}
            </span>
            <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" @command="handleServiceCommand">
              <span class="el-dropdown-link">
                . . .
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" :command="['rename', item]">

                  <el-popover placement="top" trigger="click" ref="pop">
                    <div slot="reference">重命名</div>
                    <div style="display: flex">
                      <el-input

                        type="text"
                        placeholder="请输入内容"
                        v-model="rename2"
                        maxlength="20"
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
                <el-dropdown-item class="clearfix" :command="['offSet', item]">
                  {{ item.putway === 1 ? '下架' : '上架' }}
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" :command="['deleteService', item]">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
        </div>
        <div class="box-fotter">
          <!-- <el-button>添加</el-button> -->
          <el-button type="primary" icon="el-icon-plus" @click="addServicer">添加</el-button>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="content detail">
        <div class="title">接待员详情</div>
        <div style="padding: 0 10px 10px 10px" >

          <div class="detail-header">

            <div class="detail-header-column">
              <div class="detail-name">{{ selectedServicer.receptionist }}</div>
              <div class="d-info">
                <div>创建人：</div>
                <div>李彪</div>
                <div>创建时间：</div>
                <div>{{ selectedServicer.createTime }}</div>
                <div>擅长：</div>
                <div>
                  <el-select
                    ref="selectObj"
                    v-model="skillValue"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="输入或选择技能"
                    clearable
                    @blur="addOption"
                    @change="selectSkill">
                    <el-option
                      v-for="item in skillOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div style="text-align: center;">业务范围</div>
              <div class="detail-business-type">
                <!-- <div class="box-fotter">
                  <el-button type="text" icon="el-icon-plus">添加/修改业务范围</el-button>
                </div> -->
              </div>
            </div>
            <div class="aaa"></div>
            <div class="detail-header-column">
              <div class="target">我的任务</div>
              <!-- <div>请输入接待员的目标<i class="el-icon-edit"></i></div> -->

              <div class="flex-content">
                <div class="target-img"></div>
                <div v-if="!isEdit" @click="editTarget" class="target-text">
                  <span>{{ target }}</span>
                  <span class="text-over"></span>
                </div>
                <!-- <el-input v-else type="text" ref="inputPriority" size="small" @blur="editStatuChange" v-model="target"></el-input> -->
                <el-input
                  v-else
                  ref="inputPriority"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  type="textarea"
                  placeholder="请输入内容"
                  @blur="editStatuChange"
                  v-model="target">
                </el-input>
              </div>

              <div class="kpi-wrap">
                <div>绩效目标</div>
                <div class="detail-kpi">
                  <!-- <el-descriptions title="" column="2">
                    <el-descriptions-item label="当前服务满意率">99889</el-descriptions-item>
                    <el-descriptions-item label="接待用户数">5588</el-descriptions-item>
                    <el-descriptions-item label="目标">苏州市</el-descriptions-item>
                    <el-descriptions-item label="满意用户数">123 </el-descriptions-item>
                  </el-descriptions> -->
                  <div class="detail-kpi-table">
                    <div>
                      <span class="kpi-label">

                        <el-dropdown @command="handleCommandTargetKey">
                          <span class="el-dropdown-link">
                            {{ targetKey }}<i class="el-icon-arrow-down el-icon--right"></i>：
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in targetKeyList" :key="index" :command="item">{{ item }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </span>
                      <span class="kpi-value">100%</span>
                    </div>
                    <div>
                      <span class="kpi-label">接待用户数：</span>
                      <span class="kpi-value">10000</span>
                    </div>
                    <div>
                      <span class="kpi-label">目标：</span>
                      <span class="kpi-value">10000</span>
                    </div>
                    <div>
                      <span class="kpi-label">满意用户数：</span>
                      <span class="kpi-value">10000</span>
                    </div>
                  </div>

                  <div class="chart-empty"></div>
                </div>
              </div>
            </div>

          </div>

          <div>
            <div class="title2">服务对象选择</div>
            <div class="set-start">
              <div v-for="entry in entryList" :key="entry.id" class="info-class">
                <div class="border-line"  style="position: relative;">
                  <div class="outer-and">
                    <span class="and-or" :class="entry.link === 'OR' ? 'OR': ''">
                    {{ entry.link === 'OR' ? '或' : '且' }}
                    </span>
                  </div>
                  <!-- {{entry.rulesJson}} -->
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
                            <span class="txt">{{ childItem.categoryName }}</span>
                            <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
                            <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                            <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                            <span class="in">
                              <span >{{ childItem.value }}</span>
                            </span>
                            <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                          </div>)
                        </div>
                      </div>
                    </div>
                    <div v-else>暂无</div>
                  </div>

                  <span class="border-title">流转指标</span>
                  <div class="rule-string">
                    <div v-if="entry.flowCondition && JSON.parse(entry.flowCondition).rules.length > 0">
                      <!-- {{entry.flowCondition}} -->
                      <div
                        v-for="(item, index) in JSON.parse(entry.flowCondition).rules"
                        :key="index"
                        class="rule-detail"
                      >
                        <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(entry.flowCondition).condition] }}</div>
                        <!-- {{ item }} -->
                        <div class="label-ground">
                          (
                          <div
                            v-for="(childItem, childItemIndex) in item.rules"
                            :key="childItem.tagId+childItemIndex"
                            class="label-item"
                          >
                            <!-- {{ childItem }} -->
                            <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                            <span class="txt">{{ childItem.tagName }}</span>，

                            <!-- 模块活跃 -->
                            <template v-if="childItem.tagKey=== 'moduleActive'" >
                              <span class="txt">{{ getName(actionOptions, childItem.action) }}</span>，
                              <span class="txt">{{ getName(locationTypeOptions, childItem.locationType) || '' }}</span>，
                              <span class="txt">{{ childItem.locationId || '' }}</span>，
                              <span class="txt">{{ getName(countOptions, childItem.count) || '' }}</span>
                            </template>

                            <!-- 优惠券活跃 -->
                            <template v-if="childItem.tagKey=== 'couponsActive'">
                              <span class="txt">{{ getName(couponOptions, childItem.coupon) }}</span>，
                            </template>

                            <span v-if="childItem.tagKey !== 'moduleActive'" class="txt">{{ getsourceSignName(childItem.sourceSign) }}</span>

                            <!-- 产品包下单 -->
                            <template v-if="childItem.tagKey=== 'productOrder'">
                              ，<span class="txt">{{ getName(productCountOptions, childItem.count) }}</span>
                            </template>

                            <span class="sel">&nbsp;&nbsp;{{ childItem.operator || '' }}&nbsp;&nbsp;</span>
                            <span class="in">
                              <span >{{ childItem.value }}</span>
                            </span>
                          </div>
                          )
                        </div>
                      </div>
                    </div>
                    <div v-else>暂无</div>
                  </div>

                  <span class="border-title">行为标签</span>
                  <!-- {{entry.behaviorRulesJson}} -->
                  <div class="rule-string"  style="overflow: auto">
                    <div v-if="entry.behaviorRulesJson && JSON.parse(entry.behaviorRulesJson).rules.length > 0">
                      <MultipleActionTagSelect
                        ref="multipleActionTagSelect"
                        :isView="true"
                        :behaviorRulesJson="JSON.parse(entry.behaviorRulesJson)"
                      ></MultipleActionTagSelect>
                    </div>
                    <div v-else>暂无</div>
                  </div>
                  <!-- <div>{{item.behaviorRulesJson}}</div> -->
                </div>

                <div class="drop-class">
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
              <div class="box-fotter">
                <!-- <el-button>添加</el-button> -->
                <el-button type="text" icon="el-icon-plus" @click="createClient">新建服务对象筛选</el-button>
              </div>
            </div>
          </div>
          <div>
            <div class="title2">服务终止条件</div>
            <div class="set-end">
              <div v-for="exportItem in exportList" :key="exportItem.id" class="info-class">
                <!-- <div class="border-line">
                  <div>{{ item.rulesJson }}</div>
                  <br/>
                  <div>{{ item.behaviorRulesJson }}</div>
                </div> -->
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
                            <span class="txt">{{ childItem.categoryName }}</span>
                            <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
                            <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                            <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                            <span class="in">
                              <span >{{ childItem.value }}</span>
                            </span>
                            <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                          </div>)
                        </div>
                      </div>
                    </div>
                    <div v-else>暂无</div>
                  </div>

                  <span class="border-title">行为标签</span>
                  <!-- {{exportItem.behaviorRulesJson}} -->
                  <div class="rule-string"  style="overflow: auto">
                    <div v-if="exportItem.behaviorRulesJson && JSON.parse(exportItem.behaviorRulesJson).rules.length > 0">
                      <MultipleActionTagSelect
                        ref="multipleActionTagSelect"
                        :isView="true"
                        :behaviorRulesJson="JSON.parse(exportItem.behaviorRulesJson)"
                      ></MultipleActionTagSelect>
                    </div>
                    <div v-else>暂无</div>
                  </div>
                  <!-- <div>{{item.behaviorRulesJson}}</div> -->
                </div>

                <div class="drop-class">
                  <el-dropdown @command="handleCommandExport" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" >
                    <span class="el-dropdown-link" >
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" :command="['editExport', exportItem]">
                        编辑
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" :command="['deleteExport', exportItem]">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>

              </div>
              <div class="box-fotter">
                <!-- <el-button>添加</el-button> -->
                <el-button type="text" icon="el-icon-plus" @click="createExport">新建服务终止条件</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加场景"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-form :model="formScene">
        <el-form-item label="场景名：" label-width="70px">
          <el-input v-model="formScene.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddScene">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加接待员"
      :visible.sync="dialogVisible2"
      width="30%"
      >
      <el-form :model="formServicer">
        <el-form-item label="接待员名：" label-width="90px">
          <el-input v-model="formServicer.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddServicer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="(editClientRow ? '编辑' : '新建')+ '服务对象选择'"
      :visible.sync="clientDialogVisible"
      width="1200px"
      v-if="clientDialogVisible"
    >
      <createClientDialog ref="createClientDialog" :editRow="editClientRow"></createClientDialog>
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
      <createClientDialog ref="exportClientDialog" :editRow="editExportRow" type="export"></createClientDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditExportRule">确 定</el-button>
      </span>
    </el-dialog>

 </div>
</template>

<script>
import createClientDialog from './createClientDialog.vue'
import { handleSave as saveFunc } from './saveEntryFunc.js'
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/Index copy.vue'

export default {
  components: {
    createClientDialog,
    MultipleActionTagSelect
  },
  data () {
    return {
      couponOptions: [{
        label: '曝光',
        value: 'couponShowPv'
      }, {
        label: '领用',
        value: 'couponCreatePv'
      }, {
        label: '使用',
        value: 'couponUsePv'
      }],
      actionOptions: [{
        label: '曝光',
        value: 'show'
      },
      {
        label: '点击',
        value: 'click'
      }],
      locationTypeOptions: [{
        label: '板块位',
        value: 1
      }, {
        label: '推荐位',
        value: 2
      }],
      countOptions: [{
        label: '次数',
        value: 'pv'
      }, {
        label: '天数',
        value: 'days'
      }],
      productCountOptions: [{
        label: '下单次数',
        value: 'orderNum'
      }, {
        label: '下单天数',
        value: 'orderDays'
      }],
      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      editExportRow: {},
      exportDialogVisible: false,
      targetKeyList: ['付费率（%）', '付费单数', '付费金额（元）', '客单价（元）'],
      targetKey: '付费率（%）',
      editClientRow: {},
      skillOptions: [],
      skillValue: '',
      selectedScene: '', // 选择的场景
      selectedServicer: '', // 选择的服务员
      clientDialogVisible: false,
      searchScene: '',
      searchServicer: '',
      renameVisible: false,
      formScene: {
        name: ''
      },
      formServicer: {
        name: ''
      },
      dialogVisible: false,
      dialogVisible2: false,
      target: '请输入接待员的目标',
      priority: '',
      isEdit: false,
      activeIndex: 0,
      activeIndex2: 0,
      sceneList: [{
        id: 0,
        name: '新激活用户下单场景'
      }, {
        id: 1,
        name: '老用户下单场景'
      }, {
        id: 2,
        name: '新激活用户下单场景'
      }, {
        id: 3,
        name: '新激活用户下单场景'
      }],
      servicer: [{
        id: '001',
        name: '接待员1'
      }, {
        id: '002',
        name: '接待员2'
      }, {
        id: '003',
        name: '接待员3'
      }],
      skillList: [],
      entryList: [],
      exportList: [],
      rename: '',
      rename2: '',
      soureceSignList: []
    }
  },
  watch: {
    selectedServicer: {
      handler (val) {
        console.log('val------>', val)
        this.skillValue = val.skillId
        this.target = val.myTask
      }
    }
  },
  created () {
    this.getSceneList()
    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })
  },
  methods: {
    getName (list, key) {
      const obj = list.find(item => {
        return key === item.value
      })
      return obj ? obj.label : ''
    },
    getsourceSignName (key) {
      const obj = this.soureceSignList.find(item => {
        return key === item.sourceSign
      })
      return obj ? obj.sourceName : ''
    },
    getRulesJsonToString (rulesJson) {
      const rules = JSON.parse(rulesJson).rules
      const aaa = ''
      rules.forEach((item, index) => {
        if (index > 0) {
          const a = `<div class="label-or-space">${this.conditionEnum[JSON.parse(rulesJson).condition]}</div>`
          // const b = `<div class="label-ground">(
          //         <div
          //           v-for="(childItem,childItemIndex) in item.rules"
          //           :key="childItem.tagId+childItemIndex"
          //           class="label-item"
          //         >
          //           <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
          //           <span class="txt">{{ childItem.categoryName }}</span>
          //           <span class="sel">{{ childItem.operator }}</span>
          //           <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
          //           <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
          //           <span class="in">
          //             <span >{{ childItem.value }}</span>
          //           </span>
          //           <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
          //         </div>)
          //       </div>`
          item.rules.forEach((valObj, index2) => {

          })
        }
      })
    },
    handleCommandTargetKey (val) {
      this.targetKey = val
    },
    // 服务员选择技能
    selectSkill (e) {
      this.editReceptionist({
        id: this.selectedServicer.id,
        skillId: e
      }, 'no-refresh-list')
    },
    handelRename2 (item) {
      this.editReceptionist({
        id: item.id,
        // ...item,
        receptionist: this.rename2
      })
      this.handelClosePop()
    },
    deleteService (item) {
      this.editReceptionist({
        id: item.id,
        delFlag: 2
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
      }
    },
    showRename (item) {
      this.rename = item.sceneName
    },
    showRename2 (item) {
      this.rename2 = item.receptionist
    },
    // 投放
    putInScene (item) {
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
      this.editScene({
        ...item,
        delFlag: 2
      })
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
    editEntry (row) {
      console.log('editClientRow---->', row)
      this.editClientRow = row
      this.clientDialogVisible = true
    },
    deleteEntry (row) {
      this.$confirm('此操作将永久删除该服务对象, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addEntry({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.getEntryListByReceptionistId()
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
    editExport (row) {
      console.log('editClientRow---->', row)
      this.editExportRow = row
      this.exportDialogVisible = true
    },
    deleteExport (row) {
      this.$confirm('此操作将永久删除该终止条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addExport({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.getExportListByReceptionistId()
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
    // 新增/编辑入口条件
    addOrEditEntryRule () {
      const dialogRef = this.$refs.createClientDialog
      const rulesJson = dialogRef.rulesJson
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      const flowCondition = dialogRef.flowCondition

      saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit, flowCondition)

      // this.$service.addEntry(params, '添加成功').then(res => {
      //   // 刷新列表
      //   this.getEntryListByReceptionistId()
      //   this.clientDialogVisible = false
      // })
    },
    fetchAddOrEdit () {
      const dialogRef = this.$refs.createClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const rulesJson = JSON.stringify(dialogRef.rulesJson)
      const behaviorRulesJson = JSON.stringify(dialogRef.behaviorRulesJson)
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
        this.getEntryListByReceptionistId()
        this.clientDialogVisible = false
      })
    },
    // 新增、编辑出口条件
    addOrEditExportRule () {
      const dialogRef = this.$refs.exportClientDialog
      const rulesJson = dialogRef.rulesJson
      const behaviorRulesJson = dialogRef.behaviorRulesJson

      saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit2)
    },
    fetchAddOrEdit2 () {
      const dialogRef = this.$refs.exportClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const rulesJson = JSON.stringify(dialogRef.rulesJson)
      const behaviorRulesJson = JSON.stringify(dialogRef.behaviorRulesJson)
      let params = {}
      if (this.editExportRow) {
        params = {
          ...this.editExportRow,
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
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
          delFlag: 1,
          link: dialogRef.totalLink
        }
      }
      this.$service.addExport(params, '添加成功').then(res => {
        // 刷新列表
        this.getExportListByReceptionistId()
        this.exportDialogVisible = false
      })
    },
    addOption () {
      const { query } = this.$refs.selectObj
      if (!query) return

      // this.value = query
      // 选择原有的
      const existArr = this.skillOptions.filter(item => item.name === query)
      if (existArr.length > 0) {
        this.skillValue = existArr[0].id
        return
      }

      // 创建新技能，并选中
      const parmas = {
        sceneId: this.selectedScene.id,
        name: query
      }
      this.$service.addSceneSkill(parmas).then(async res => {
        const aaa = await this.getSkillListBySceneId()
        console.log('aaa--->', aaa)

        const existArr = this.skillOptions.filter(item => item.name === query)
        if (existArr.length > 0) {
          this.skillValue = existArr[0].id
        }
      })
    },

    // 根据场景ID获取技能列表
    getSkillListBySceneId () {
      const parmas = {
        sceneId: this.selectedScene.id
      }
      return this.$service.getSceneSkillList(parmas).then(res => {
        console.log('rs-->', res)
        this.skillOptions = res || []
        return res
      })
    },
    // 选择场景
    selectScene (index) {
      this.activeIndex = index
      this.selectedScene = this.sceneList[index] || {}
      this.getServiceList()
      this.getSkillListBySceneId()
    },
    // 选择服务员
    selectServicer (index) {
      this.activeIndex2 = index
      this.selectedServicer = this.servicer[index] || {}
      // 入口列表
      this.getEntryListByReceptionistId()
      // 出口列表
      this.getExportListByReceptionistId()
    },
    // 服务员列表
    getServiceList () {
      const parmas = {
        sceneId: this.selectedScene.id,
        keywords: this.searchServicer,
        pageNum: 1,
        pageSize: 100
      }
      this.servicer = []
      this.$service.getReceptionistList(parmas).then(res => {
        this.servicer = res.data || []
        if (this.servicer.length > 0) {
          this.selectServicer(0)
        }
        // this.activeIndex2 = 0
        // this.selectedServicer = this.servicer[0] || {}
      })
    },
    // 场景列表
    getSceneList () {
      const parmas = {
        keywords: this.searchScene,
        pageNum: 1,
        pageSize: 100
      }
      this.sceneList = []
      this.$service.getSceneList(parmas).then(res => {
        this.sceneList = res.data || []
        if (this.sceneList.length > 0) {
          this.selectScene(0)
        }
        // this.activeIndex = 0
        // this.selectedScene = this.sceneList[0] || {}
        // this.getServiceList()
        // this.getSkillListBySceneId()
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
    handelRename (item) {
      this.editScene({
        // id: item.id,
        ...item,
        sceneName: this.rename
      })
      this.handelClosePop()
    },
    editScene (parmas) {
      const list = this.sceneList

      this.$service.editScene(parmas).then(res => {
        // const index = list.findIndex(item => item.id === parmas.id)
        // list.splice(index, 1, parmas)
        this.getSceneList()
      })
    },
    // 编辑接待员
    editReceptionist (params, type) {
      const list = this.servicer
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
        console.log('item-----', item)
        item.doClose()
      })
    },
    addScene () {
      this.dialogVisible = true
    },
    addServicer () {
      this.dialogVisible2 = true
    },
    confirmAddScene () {
      // console.log('this.formScene.length--------', this.sceneList.length)
      const parmas = {
        sceneName: this.formScene.name
        // id: this.sceneList.length + 1
      }

      this.$service.addScene(parmas).then(res => {
        // this.sceneList.push(item)
        this.getSceneList()
        this.dialogVisible = false
      })
    },
    // 确定添加服务员
    confirmAddServicer () {
      const parmas = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionist: this.formServicer.name
        // id: this.sceneList.length + 1
      }

      this.$service.addReceptionist(parmas).then(res => {
        // this.sceneList.push(item)
        this.getServiceList()
        this.dialogVisible2 = false
      })
    },

    editTarget () {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.inputPriority.focus()
      })
    },
    editStatuChange () {
      this.editReceptionist({
        id: this.selectedServicer.id,
        myTask: this.target
      }, 'no-refresh-list')
      this.isEdit = false
    }
  }
}
</script>

<style lang='stylus' scoped>
.row-wrap {
  display: grid;
  grid-template-columns: 200px 200px minmax(0, 1fr);
  grid-template-rows: 100%;
  grid-gap: 20px;
  height 100%
  background: #000;
  margin: -20px;
  padding: 20px;
  background: rgb(243, 244, 250);

}
.box {
  // width: 150px;
  // border: 1px solid #000;
  // background: linear-gradient(to bottom, #34538b, #cd0000);
  // background-origin: border-box;
}
.content {
  height 100%
  background-color: #fff;
  overflow auto
  box-sizing: border-box;
  position relative
  // background: #fafafa;
  // background-image: url('https://img.alicdn.com/imgextra/i3/O1CN01kSoAWV1jd6n4fDpdT_!!6000000004570-2-tps-2200-1280.png');
  // background-size: 100%;

}

.icon
  font-size 20px
  width 30px

.title
  // font-size: 18px;
  // padding: 10px;
  // border-bottom: 1px dashed;
  // margin-bottom: 1px;
  padding: 10px 16px
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // min-height: 48px;
  // margin-bottom: -1px;
  // padding: 0 24px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 16px;

.lists-item
  // background rgb(237, 239, 255)
  // margin-bottom 10px
  // height: 36px;
  // line-height: 36px;
  font-size 14px
  color #666666
  padding 10px
  display flex
  border-bottom 1px dashed #f3f3f3
.active
  background rgb(237, 239, 255)

.item-content
  flex 1
.el-dropdown
  display: inline-flex;
  position: relative;
  color: var(--el-text-color-regular);
  font-size: var(--el-font-size-base);
  line-height: 1;
  vertical-align: top;

// @supports (-webkit-mask: none) or (mask: none) {
//   .box {
//     // border: none;
//     // background: linear-gradient(to bottom, #34538b, #cd0000) no-repeat;
//     // -webkit-mask-image: linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px),  linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px);
//     // -webkit-mask-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
//     // -webkit-mask-position: 0 0, 0 0, 0 100%, 100% 0;
//     // -webkit-mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;
//     // /* 合并写法 */
//     // mask: linear-gradient(to right, #000 6px, transparent 6px) repeat-x,
//     // linear-gradient(to bottom, #000 6px, transparent 6px) repeat-y,
//     // linear-gradient(to right, #000 6px, transparent 6px) repeat-x 0 100%,
//     // linear-gradient(to bottom, #000 6px, transparent 6px) repeat-y 100% 0;
//     // mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;

//     border: none;
//     background: linear-gradient(to bottom, #34538b, #cd0000) no-repeat;
//     -webkit-mask-image: linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px), linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px);
//     -webkit-mask-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
//     -webkit-mask-position: 0 0, 0 0, 0 100%, 100% 0;
//     -webkit-mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;
//   }
// }
.detail {
  // padding: 15px
}
.detail-name {
  font-size 24px
  color: #676a6c;
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 100;
}
.detail-header {
  display: grid
  grid-template-columns: 35% 53px auto
  // grid-column-gap: 20px
}
.detail-header-column {
  // padding: 20px
  box-sizing border-box
  // div {
  //   margin-bottom 20px
  // }
}
.target {
  font-size 18px
}
.detail-business-type {
  height: 90px;
  width: 100%;
  background: #f4f4f5;
  margin-top: 15px;
  position: relative
}
.kpi-wrap {
  display grid;
  grid-template-columns: 45px auto
}
.detail-kpi {
  height: 200px;
  width: 100%;
  // border 1px solid #ccc
  background: #f4f4f5;
  font-size 14px
  padding: 15px;
  box-sizing: border-box;
  line-height: 14px;
}
.detail-kpi-table {
  width: 100%;
  display grid
  grid-template-columns: 50% 50%
  grid-template-rows: 35px 35px
  grid-column-gap: 20px
}
.set-start, .set-end {
  min-height 150px
  // border 1px solid #ccc
  background: #f4f4f5;
  position: relative
  padding-bottom: 50px
  overflow: auto;
}
.box-fotter {
  position: absolute;
  bottom: 0;
  padding: 10px;
  display: grid;
  /* justify-content: center; */
  /* grid-template-columns: 100%; */
  /* align-items: center; */
  /* grid-template-rows: auto; */
  width: 100%;
  box-sizing: border-box;
}

.d-info {
  background-color: #f4f4f5;
  color: #909399;
  padding: 8px 16px;
  font-size: 12px;
  display: grid;
  grid-template-columns: 68px auto
  grid-template-rows: repeat(3, 30px)
  align-items: center
  // margin-top: 10px;
  margin: 20px 0
  width: 68%
}

.search {
  padding 0 10px 10px 10px
}

.flex-content
  display flex
  margin 10px 0
  align-items: center;
.text-over
  display inline-block
  background url(../../assets/pencil.png) no-repeat right center
  width 16px
  height 16px
  margin-left 10px
.aaa {
  background: url(../../assets/img/d35f7a388e2aedf26c15d7dce4f8a94f.webp) right center no-repeat;
  // width: 124px;
  // height: 126px;
  // background-size: 100%;
  // margin-left: -41px;
  // margin-top: -39px;
  width: 178px;
  height: 168px;
  background-size: 100%;
  margin-left: -117px;
  margin-top: -17px;
  // width: 149px;
  //   height: 145px;
  //   background-size: 100%;
  //   margin-left: -51px;
  //   margin-top: -51px;
}
.target-img
  background: url(../../assets/img/target.png) right center;
  width: 60px;
  height: 60px;
  background-size: 100%;
  flex: 0 0 auto;
  margin-right: 15px;
.target-text
  font-size: 14px
.chart-empty {
  background: url(../../assets/img/chart.png) center center no-repeat;
  width: 100%;
  height: 95px;
  background-size: contain;
  text-align: center;
}
.title2 {
  font-size: 16px;
  padding: 16px 0 10px 0;
  text-align: center;
  color: rgba(0,0,0,0.85);
  font-weight: 500;
}
.re-name-input ::v-deep .el-input__inner {
// .re-name-input >>> .el-input__inner {
  padding-right: 77px;
}
.sceneList-wrap
  position: absolute;
  width: 100%;
  bottom: 53px;
  top: 83px;
  overflow: auto;
.info-class {
  box-sizing: border-box;
  overflow: hidden;
  transition: opacity .2s;
  color: #131e0e;
  margin: 10px;
  margin-right: 0
  font-size: 14px
  word-break: break-word;
  display grid
  grid-template-columns: auto 30px;
  align-items: top
}
.border-line{
  padding: 8px 16px 8px 26px
  border-radius: 4px;
  border: 1px solid #67c23a;
  display: grid;
  grid-template-columns: 72px auto;
  grid-gap: 10px 0;
}
.drop-class {
  width: 30px;
  cursor: pointer;
  .el-dropdown-link {
    display: grid;
    grid-template-rows: repeat(3, 5px);
    width: 30px;
    height: 20px;
    justify-content: center
    font-size: 22px
  }
}
.kpi-label .el-dropdown
  color: #409eff;
.rule-string, .rule-detail, .label-ground, .label-item
  display flex
  flex-wrap: wrap;

.label-or-space
  color: #1ac71c;
  margin: 0 5px;
// .label-item
//   white-space: nowrap;
.border-title
  color: #67c23a;
  font-size: 12px;
  line-height: 20px;

.outer-and {
  margin-left: 70px;
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: 0;
  width: 3px;
  height: auto;
  margin: auto 10px;
  border: 1px dashed #adb1f4
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.and-or {
  padding: 4px 6px
  color: #FFF;
  background-color: #67c23a;
  border-color: #67c23a;
  border-radius 20px
  font-size 12px
}

.OR {
  background-color: #8f8383;
}
</style>
