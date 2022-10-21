<template>
  <div class="strategy-list">
    <div class="TopNav">
      <div class="header">
        <div class="header-left">
          <div>
            <el-radio-group v-model="showAll" @change="handleShowAllChange">
              <el-radio :label="true">全部</el-radio>
              <el-radio :label="false">我的</el-radio>
            </el-radio-group>
          </div>
          <div class="search-input">
            <el-input
              v-model="searchForm.policyName"
              style="width: 350px"
              placeholder="支持按策略、人群、创建人、部门搜索"
              @keyup.enter.native="handleSearch"
            ></el-input>
            <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
          </div>
        </div>
        <div class="header-right">
          <!--<div class="search-input">-->
            <!--<el-input-->
                    <!--v-model="searchForm.policyName"-->
                    <!--style="width: 350px"-->
                    <!--placeholder="支持按策略、人群、创建人、部门搜索"-->
                    <!--:clearable='true'-->
                    <!--@keyup.enter.native="handleSearch"-->
            <!--&gt;</el-input>-->
            <!--<i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>-->
          <!--</div>-->
          <div>
            <el-button
                    type="primary"
                    size="small"
                    @click="handleAdd"
                    v-permission="'hoder:policy:add'"
            >
              <a class="fa fa-plus" style="color: white;"></a>新增
            </el-button>
          </div>
            <!--<el-button-->
                    <!--type="primary"-->
                    <!--size="small"-->
                    <!--@click="freshService"-->
                    <!--v-permission="'hoder:policy:add'"-->
            <!--&gt;-->
              <!--<a class="fa fa-plus" style="color: white;"></a>刷新策略服务-->
            <!--</el-button>-->
          <div>
            <el-popover
              placement="top"
              trigger="click"
              class="popover-button"
            >
              <div>
                <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                  <el-checkbox label="createTime">创建时间</el-checkbox>
                  <el-checkbox label="creatorName">创建人</el-checkbox>
                  <el-checkbox label="useStatus">投放状态</el-checkbox>
                  <!-- <el-checkbox label="smart">是否动态策略</el-checkbox> -->
                  <el-checkbox label="department">业务部门</el-checkbox>
                </el-checkbox-group>
              </div>
              <i
                class="el-icon-cc-setting operate"
                slot="reference"
              >
              </i>
              <!--<el-button slot="reference">选择列表展示维度</el-button>-->
            </el-popover>
            <!--<a class="manual" href="http://mgr-hoder.skysrt.com/hoder-manual/ren-qun-fen-ge-guan-li.html" target="_blank">操作指南</a>-->
          </div>
        </div>
      </div>

    </div>
    <!-- talbe -->
    <el-table ref="myTable" :data="tableData" style="width: 100%;" stripe border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="policyId" label="策略ID" width="70"></el-table-column>
      <el-table-column prop="policyName" label="策略名称" width="150"></el-table-column>
      <!--<el-table-column prop="dataSource" label="数据来源" width="90">-->
        <!--<template scope="scope">-->
          <!--<span style="margin-left: 10px">{{lableDataSourceEnum[scope.row.dataSource]}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="tagsList" width="400px">
        <template
                slot="header"
                slot-scope="{ column, $index }"
        >
          策略维度（
          <span class="checkbox--red">红色</span>为大数据标签,
          <span class="checkbox--green">绿色</span>为自定义/本地标签,
          <span class="checkbox--blue">蓝色</span>为账号标签,
          <span class="checkbox--yellow">黄色</span>为实时标签,
          <span class="checkbox--orange">紫色</span>为动态指标,
          <span class="checkbox--orange2">棕色</span>为组合标签,
          <span class="checkbox--cyan">青色</span>为行为标签,
          <span class="checkbox--gray">灰色</span>为人群标签）
        </template>
        <template slot-scope="scope">
          <span v-for="item in scope.row.tagsList"
                :key="item.tagId"
                style="margin: 0 2px"
                :class="dataSourceColorClassEnum[item.dataSource]">
            {{item.tagName}}
          </span>
          <!--<el-tag-->
                  <!--size="mini"-->
                  <!--v-for="item in scope.row.tagsList"-->
                  <!--:key="item.tagId"-->
                  <!--:type= "dataSourceColorEnum[item.dataSource]"-->
          <!--&gt;{{item.tagName}}</el-tag>-->
        </template>
      </el-table-column>
      <!--<el-table-column prop="remark" label="应用场景" width="100px"></el-table-column>-->
      <el-table-column v-if="(checkList.indexOf('createTime') > -1)" prop="createTime" label="创建时间" width="170">
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" prop="creatorName" label="创建人" width="60"></el-table-column>
      <el-table-column v-if="(checkList.indexOf('department') > -1)" prop="department" label="业务部门" width="70"></el-table-column>
      <el-table-column v-if="(checkList.indexOf('useStatus') > -1)" prop="useStatus" label="状态" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.useStatus === '投放中'" @click="launchDetail(scope.row.policyId)" class="under_line">投放中</span>
          <span v-else>未投放</span>
        </template>
      </el-table-column>

      <!-- <el-table-column v-if="(checkList.indexOf('smart') > -1)" prop="past7Active" label="是否动态策略" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.smart" > 动态策略 </span>
          <span v-else> 普通策略 </span>
        </template>
      </el-table-column> -->

      <el-table-column prop="past7Active" label="7日是否有命中" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.past7Active === 1" style="color: red"> 是 </span>
          <span v-else> 否 </span>
        </template>
      </el-table-column>

      <el-table-column prop="past7Active" label="7日是否有请求" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.past7Req === 1" style="color: red"> 是 </span>
          <span v-else> 否 </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div class="el-button-group">
            <!-- 动态人群：{{scope.row.smart}} -->
            <!-- <el-button size="small" type="text" @click="crowdList(scope.row)" v-if="!scope.row.smart">查看人群</el-button>
            <el-button size="small" type="text" @click="smartScheme(scope.row)" v-else>查看方案</el-button> -->
            <el-button size="small" type="text" @click="crowdList(scope.row)" >查看人群</el-button>

            <!-- <el-button v-if="scope.row.useStatus === '未投放' && scope.row.isBehavior === 0" size="small" type="text" @click="handleLaunch(scope.row)">投放</el-button> -->
            <el-button v-if="scope.row.useStatus === '未投放'" size="small" type="text" @click="handleLaunch(scope.row)">投放</el-button>
            <el-button
                    size="small"
                    type="text"
                    v-permission="'hoder:policy:sync'"
                    @click="freshCache(scope.row)"
            >
              <span v-if="scope.row.status === 1">未同步</span>
              <span v-if="scope.row.status === 2">已同步</span>
            </el-button>
            <el-dropdown @command="handleCommand">
              <el-button size="small" type="text">
                更多
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        :command="['edit',scope.row]"
                        v-permission="'hoder:policy:edit'"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                        :command="['del',scope.row]"
                        v-permission="'hoder:policy:del'"
                >删除</el-dropdown-item>
                <el-dropdown-item
                        :command="['detail',scope.row]"
                >查看配置</el-dropdown-item>
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
                <el-dropdown-item
                        :command="['statics',scope.row]"
                >调用统计</el-dropdown-item>
                <el-dropdown-item
                    v-if="scope.row.smart"
                    :command="['viewEffect',scope.row]"
                >查看效果</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-dropdown @command="handleCommandStastic">-->
              <!--<el-button size="small" type="text">-->
                <!--统计-->
              <!--</el-button>-->
              <!--<el-dropdown-menu slot="dropdown">-->
                <!--<el-dropdown-item-->
                        <!--:command="['detail',scope.row]"-->
                <!--&gt;使用情况</el-dropdown-item>-->
              <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->
            <!--<el-button size="small" type="primary" @click="showOperate(scope.row)" class="operate">-->
                <!--<div>操作</div>-->
                <!--<ul v-if="scope.row.showOperateOrNot" class="more-operate">-->
                  <!--<li-->
                     <!--v-permission="'hoder:policy:edit'"-->
                     <!--@click="handleEdit(scope.row)"-->
                     <!--class="operate-item"-->
                  <!--&gt;-->
                    <!--编辑-->
                  <!--</li>-->
                  <!--<li-->
                     <!--v-permission="'hoder:policy:del'"-->
                     <!--@click="del(scope.row)"-->
                     <!--class="operate-item"-->
                  <!--&gt;-->
                    <!--删除-->
                  <!--</li>-->
                <!--</ul>-->
            <!--</el-button>-->
          </div>
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

    <!--新增界面-->
    <el-dialog
      :title="title"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="策略名称" prop="policyName">
          <el-input size="small" v-model="addForm.policyName" placeholder></el-input>
        </el-form-item>
        <!--<el-form-item label="数据来源" prop="dataSource">-->
          <!--<el-select v-model="addForm.dataSource" filterable placeholder="请选择类型" @change="getTags">-->
            <!--<el-option label="数据平台" value="2"></el-option>-->
            <!--<el-option label="自定义" value="1"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="策略维度" prop="conditionTagIds">-->
          <!--<el-tabs tab-position="top" style="height: 200px;">-->
            <!--<el-tab-pane-->
              <!--v-for="item in conditionTagIdsData"-->
              <!--:label="item.groupName"-->
              <!--:key="item.groupId"-->
            <!--&gt;-->
              <!--<el-checkbox-group v-model="addForm.conditionTagIds" class="checkList">-->
                <!--<el-checkbox v-for="v in item.child" :label="v.tagId" :key="v.tagId">{{v.tagName}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
            <!--</el-tab-pane>-->
          <!--</el-tabs>-->
        <!--</el-form-item>-->
        <div class="tags-tips">
          <!-- 1111注：红色为大数据标签,绿色为自定义/本地标签,蓝色为账号标签,黄色为实时标签,紫色为动态指标,棕色为组合标签,青色为行为标签 -->
          <span class="checkbox--red">红色为大数据标签</span>,
          <span class="checkbox--green">绿色为自定义/本地标签</span>,
          <span class="checkbox--blue">蓝色为账号标签</span>,
          <span class="checkbox--yellow">黄色为实时标签</span>,
          <span class="checkbox--orange">紫色为动态指标</span>,
          <span class="checkbox--orange2">棕色为组合标签</span>,
          <span class="checkbox--cyan">青色为行为标签</span>,
          <span class="checkbox--gray">灰色为人群标签</span>
        </div>
        <el-form-item label="策略维度" prop="conditionTagIds" >
          <el-tabs tab-position="top" style="height: 200px;">
            <!--<el-tab-pane-->
                    <!--v-for="item in conditionTagIdsData"-->
                    <!--:label="item.groupName"-->
                    <!--:key="item.groupId"-->
            <!--&gt;-->
            <div class="strategy-search">
            <el-input aria-placeholder="请输入标签关键字进行搜索"
                      v-model="searchValue"
                      class="strategy-search--input"
                      @keyup.enter.native="getTags()"
            >
            </el-input>
            <el-button @click="getTags()">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            </div>
              <el-checkbox-group v-model="checkedList" class="checkList" v-if="conditionTagsFiltered != '' ">
                <el-checkbox
                  v-for="item in conditionTagsFiltered"
                  :class="dataSourceColorClassEnum[item.tDataSource]"
                  :label="item.tagId"
                  :key="item.tagId"
                  @change="handleTagChange($event,item)"
                >
                  {{item.tagName}}
                </el-checkbox>
              </el-checkbox-group>
            <div class="checkbox--red" v-else>该标签不存在，请重新输入标签名进行搜索</div>
            <el-pagination
                    small
                    class="pagination"
                    layout="prev,pager,next"
                    :total="tagsListTotal"
                    :page-size="initPageSize"
                    :current-page="initCurrentPage"
                    @current-change="handleTagCurrentChange"
                    @prev-click="handleTagCurrentChange"
                    @next-click="handleTagCurrentChange"
            >
            </el-pagination>
            <!--</el-tab-pane>-->
          </el-tabs>
        </el-form-item>
        <el-form-item label="已选标签" style="margin-top: 90px">
          <!--<span v-for="tag in addForm.conditionTagIds" :key="tag">-->
            <!--<el-tag v-for="item in conditionTagIdsData"-->
                    <!--v-if="item.tagId === tag"-->
                    <!--:key="item.tagId"-->
                    <!--:type= "item.tDataSource === 1 ? 'success' : (item.tDataSource === 2 ? 'danger' : '')"-->
                    <!--closable-->
                    <!--@close="removeTag(item.tagId)"-->
            <!--&gt;-->
              <!--{{item.tagName}}-->
            <!--</el-tag>-->
            <el-tag v-for="item in tagList"
                    :key="item.tagId"
                    :type="dataSourceColorEnum[item.dataSource || item.tDataSource]"
                    closable
                    @close="removeTag(item)"
            >
              {{item.tagName}}
            </el-tag>
          <!--</span>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
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
    <!-- 查看统计弹窗-->
    <el-dialog
            :visible.sync="showStatistics"
            width="90%"
    >
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{linesTitle}}</div>
          <div class="main" ref="main" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{pieTitle}}</div>
          <div class="main" ref="hitBiTotal" v-if=" showStatistics === true"></div>
        </div>
      </div>
    </el-dialog>
    <!-- 投放中弹窗-->
    <el-dialog :visible.sync="showLaunch" title="该策略正在使用情况">
      <!--<div>该策略正在使用情况</div>-->
      <div>正在投放：<span v-for="(item,index) in launchItems" :key="index" class="launch-item">{{item}}</span></div>
    </el-dialog>
    <el-dialog :visible.sync="showLaunchToBusiness" :key="recordId">
      <LaunchToBusiness
              :recordId="recordId"
              :tempPolicyAndCrowd="tempPolicyAndCrowd"
              @closeDialog="handleCloseDialog"
      ></LaunchToBusiness>
    </el-dialog>
    <el-dialog :visible.sync="showViewEffect" width="80%">
      <viewEffectDialog :policyId="currentPid"></viewEffectDialog>
    </el-dialog>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import LaunchToBusiness from '../launch/StrategyPutIn'
import viewEffectDialog from '../launch/viewEffectDialog'
export default {
  components: {
    LaunchToBusiness,
    viewEffectDialog
  },
  data () {
    return {
      showViewEffect: false,
      // 表格当前页数据
      tableData: [],
      // lableDataSourceEnum: {
      //   1: "自定义",
      //   2: "数据平台"
      // },
      // 搜索条件
      criteria: {},
      initPageSize: 500,
      tagsListTotal: 0,
      initCurrentPage: 1,
      // 列表页
      searchForm: {
        policyName: ''
        // constType: 'POLICY_NAME'
      },
      // policyNameHolder: '请输入策略名称',
      title: '',
      showConfiguration: false,
      showStatistics: false,
      linesTitle: '',
      pieTitle: '',
      time: [],
      time1: [],
      startDate: '',
      endDate: '',
      currentPid: undefined,
      configTextarea: '',
      showLaunch: false,
      launchItems: [],
      // 编辑页
      // editFormVisible: false,// 编辑界面是否显示
      // 默认每页数据量:pageSize
      pageSize: 10,
      // 当前页码:pageNum
      currentPage: 1,
      totalCount: 1,
      // 查询的页码
      start: 1,
      addFormVisible: false,
      conditionTagIdsData: [], // 策略维度
      conditionTagsFiltered: [],
      tagList: [],
      defaultProps: {
        children: 'child',
        label: 'groupName'
      },
      // 默认数据总数
      addForm: {
        policyId: '',
        policyName: '',
        // dataSource: "2",
        conditionTagIds: [],
        crowdTagCrowdIds: []
        // 以上为表单提交的参数
      },
      addFormRules: {
        policyName: [
          { required: true, message: '请填写策略名称', trigger: 'blur' }
        ]
      },
      statusTip: undefined,
      searchValue: '',
      reloadHistory: true,
      placeHolderInputObject: {
        POLICY_NAME: '请输入策略名称',
        POLICY_ID: '请输入策略id',
        TAG_NAME: '请输入策略维度',
        CREATOR_NAME: '请输入创建人名称',
        OFFICE_NAME: '请输入创建人部门名称',
        CROWD_ID: '请输入人群ID'
      },
      recordId: undefined,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      launchSource: 'strategy',
      checkList: [],
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorClassEnum: {
        1: 'checkbox--green',
        2: 'checkbox--red',
        3: 'checkbox--blue',
        5: 'checkbox--yellow',
        6: 'checkbox--orange',
        7: 'checkbox--orange2',
        8: 'checkbox--cyan',
        11: 'success',
        12: 'gray'
      },
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan',
        11: 'success',
        12: 'gray'
      },
      showAll: false,
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
                    value: row.content
                  }
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
      }
    }
  },
  props: ['historyFilter', 'checkListFilter', 'parentSource', 'showAllParent'],
  created () {
    this.$root.$on('stratege-list-refresh', this.loadData)
    this.loadData()
    // this.setGlobalStrategySource()
    const start = new Date()
    const end = new Date()
    this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
    this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
  },
  watch: {
    // refresh: function (val) {
    //     debugger
    //     if(val === true) {
    //         this.loadData()
    //     }
    // },
    // 'searchForm.constType': function (val) {
    //     this.policyNameHolder = this.placeHolderInputObject[val]
    // },
    time (val, oldVal) {
      if (this.currentPid && oldVal.length !== 0) {
        if (this.setDataInMonth(val[0], val[1])) {
          this.drawLines(this.currentPid, val[0], val[1])
        } else {
          this.$message('日期间隔最多只能是30天！请重新选择日期')
          this.time = oldVal
        }
      }
    },
    time1 (val, oldVal) {
      if (this.currentPid && oldVal.length !== 0) {
        if (this.setDataInMonth(val[0], val[1])) {
          this.drawPie(this.currentPid, val[0], val[1])
        } else {
          this.$message('日期间隔最多只能是30天！请重新选择日期')
          this.time1 = oldVal
        }
      }
    },
    tagList (val) {
      this.checkedList = val.map(item => item.tagId)
    }
  },
  methods: {
    freshService () {
      this.$service.freshService().then(data => {
        this.$message({
          type: 'info',
          message: data
        })
      })
    },
    freshCache (row) {
      this.$confirm('新建的人群策略将实时生效，旧的策略更新需要延时2小时生效', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.freshCache({ policyId: row.policyId }).then(data => {
            this.loadData()
            this.$message({
              type: 'info',
              message: data
            })
          })
        })
    },
    getTags () {
      // this.addForm.conditionTagIds = [];
      this.$service
        .policyTagSeach({ pageNum: this.initCurrentPage, pageSize: this.initPageSize, s: this.searchValue })
        .then(data => {
          //  let checkboxData = []
          // data.forEach((item) => { item.child.forEach((checkboxItem) => {checkboxData.push(checkboxItem)})})
          //  this.conditionTagIdsData = checkboxData
          //  this.conditionTagsFiltered = checkboxData
          this.conditionTagsFiltered = data.pageInfo.list
          this.tagsListTotal = data.pageInfo.total
        })
    },
    // searchTag() {
    //     let searchValue = this.searchValue
    //     let selectTagsIndexed = this.addForm.conditionTagIds.reduce((result, tagId) => {
    //         result[tagId] = true
    //         return result
    //     }, {})
    //     this.$service
    //         .policyTagSeach({ s: searchValue })
    //         .then(data => {
    //             // this.conditionTagsFiltered = data.reduce((result, item) => result
    //             //     .concat(item.child.filter(tag => !selectTagsIndexed[tag.tagId])), [])
    //             this.conditionTagsFiltered = data.pageInfo.list
    //         })
    // },
    handleTagCurrentChange (pages) {
      this.initCurrentPage = pages
      this.getTags()
    },
    removeTag (tag) {
      const addForm = this.addForm
      if (tag.tDataSource === 12) {
        // 人群标签 id 集合
        addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.filter(tagId => tagId !== tag.tagId)
      } else {
        // 其他的标签 id 集合
        addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      }
      // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
      // this.tagList.forEach(item => {item.filter(item => item.tagId !== id)})
    },
    handleTagChange (flag, item) {
      let arr = []
      if (flag) {
        this.tagList.push(item)
        if (item.tDataSource === 12) {
          // 人群标签 id 集合
          this.addForm.crowdTagCrowdIds.push(item.tagId)
        } else {
          // 其他的标签 id 集合
          this.addForm.conditionTagIds.push(item.tagId)
        }
      } else {
        arr = this.tagList
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].tagId == item.tagId) { arr.splice(i, 1) }
        }

        if (item.tDataSource === 12) {
          // 人群标签 id 集合
          this.addForm.crowdTagCrowdIds = this.addForm.crowdTagCrowdIds.filter(tagId => tagId !== item.tagId)
        } else {
          // 其他的标签 id 集合
          this.addForm.conditionTagIds = this.addForm.conditionTagIds.filter(tagId => tagId !== item.tagId)
        }
      }
    },
    resetSearch () {
      this.searchValue = ''
      const currentTagsId = this.addForm.conditionTagIds
      this.getTags()
      this.addForm.conditionTagIds = currentTagsId
    },
    handleAdd () {
      this.$router.push({
        name: 'oneTouchDrop',
        params: { source: this.parentSource ? 'myCrowd' : undefined, refresh: true } // 刷新页面
      })
      // 清空编辑时设置的数据
      this.$store.commit('setSchemeConfigNull')
      // this.addFormVisible = true;
      // this.addForm.policyName = "";
      // this.addForm.policyId = "";
      // this.title = "新增";
      // this.searchValue = ''
      // this.getTags();
      // this.tagList = []
      // this.addForm.conditionTagIds = [];
    },
    handleEdit (row) {
      const Row = cloneDeep(row)
      this.addFormVisible = true
      this.title = '编辑'
      this.addForm.policyId = Row.policyId
      this.addForm.policyName = Row.policyName
      // this.addForm.dataSource = row.dataSource.toString();
      this.searchValue = ''
      this.getTags()
      this.tagList = Row.tagsList
      this.addForm.conditionTagIds = Row.conditionTagIds
        .split(',')
        .map(function (v) {
          return parseInt(v)
        })
      this.addForm.crowdTagCrowdIds = Row.crowdTagCrowdIds && Row.crowdTagCrowdIds
        .split(',')
        .map(function (v) {
          return parseInt(v)
        }) || []
      // this.addForm.conditionTagIds = []
      // this.addForm.crowdTagCrowdIds = []

      // this.tagList.forEach(function (v) {
      //   if (v.dataSource === 12) {
      //     this.addForm.crowdTagCrowdIds.push(parseInt(v.tagId)) // 人群标签
      //   } else {
      //     this.addForm.conditionTagIds.push(parseInt(v.tagId))
      //   }
      // })
      // row.conditionTagIds.split(",");
    },
    crowdList (row) {
      this.$emit('openCrowdPage', row, this.criteria, this.checkList, this.showAll)
    },
    smartScheme (row) {
      this.$emit('openSchemePage', row)
    },
    del (row) {
      const id = row.policyId
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.policyDel({ policyId: id }, '删除成功').then(() => {
            this.loadData()
          })
        })
        .catch(() => {})
    },
    // setGlobalStrategySource ()  {
    //     if (this.parentSource){
    //         this.$appState.$set('GlobalStrategySource', this.parentSource)
    //     } else {
    //         this.$appState.$set('GlobalStrategySource', undefined)
    //     }
    // },
    // 从服务器读取数据
    loadData () {
      this.$service.getListDimension({ type: 1 }).then(data => {
        if (data) {
          if (data.behaviorShow) {
            this.checkList = data.behaviorShow.split(',')
          }
        }
      })
      // 从列表返回第一次加载的时候，要保留上一次的页码数和size
      if (this.reloadHistory) {
        if (this.historyFilter != null) {
          this.criteria = this.historyFilter
          this.searchForm = {
            policyName: this.historyFilter.policyName
            // constType: this.historyFilter.constType || 'POLICY_NAME'
          }
          this.currentPage = this.historyFilter.pageNum || this.currentPage
          this.pageSize = this.historyFilter.pageSize || this.pageSize
        }
        if (this.showAllParent) {
          this.showAll = this.showAllParent
        } else {
          this.showAll = false
        }
        this.reloadHistory = false
      }
      // this.checkList = this.checkListFilter
      this.criteria.pageNum = this.currentPage
      this.criteria.pageSize = this.pageSize

      // 如果是【我的人群】模块进入
      if (!this.showAll) {
        this.$service.getMyCrowdList(this.criteria).then(data => {
          if (data.pageInfo) {
            const originalTableData = data.pageInfo && data.pageInfo.list ? data.pageInfo.list : []
            this.totalCount = data.pageInfo ? data.pageInfo.total : 0
            // 单独获得策略标签维度
            const currentStrategyIds = []
            originalTableData.forEach(item => {
              currentStrategyIds.push(item.policyId)
            })
            this.$service.getSrtategyTagsList({ policyIds: currentStrategyIds.join(',') }).then(tagList => {
              originalTableData.forEach((item) => {
                item.tagsList = tagList[item.policyId]
              })
              this.tableData = originalTableData
            })
          } else {
            this.tableData = []
            this.totalCount = 0
          }
        })
        // this.$appState.$set('GlobalStrategySource', this.parentSource)
      } else {
        this.$service.policyList(this.criteria).then(data => {
          if (data.pageInfo) {
            const originalTableData = data.pageInfo.list
            this.totalCount = data.pageInfo.total
            // 单独获得策略标签维度
            const currentStrategyIds = []
            originalTableData.forEach(item => {
              currentStrategyIds.push(item.policyId)
            })
            this.$service.getSrtategyTagsList({ policyIds: currentStrategyIds.join(',') }).then(tagList => {
              originalTableData.forEach((item) => {
                item.tagsList = tagList[item.policyId]
              })
              this.tableData = originalTableData
            })
          } else {
            this.tableData = []
            this.totalCount = 0
          }
        })
        // this.$appState.$set('GlobalStrategySource', '')
      }
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange: function (val) {
      this.pageSize = val
      this.loadData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange: function (val) {
      this.currentPage = val
      this.loadData()
    },
    // 搜索,提交表单
    handleSearch () {
      this.criteria = this.searchForm
      // pageNum重置为1
      this.currentPage = 1
      this.loadData()
    },
    // 重置
    handleReset () {
      this.searchForm.policyName = ''
      // this.searchForm.constType = 'POLICY_NAME'
      this.criteria = {}
      this.loadData()
      // this.$refs.searchForm.resetFields();
    },
    // 查看详情
    // handleDetail: function(index, row) {
    //   // var id = row.id;
    //   // todo: 以后再做
    // },
    // 新增
    addSubmit: function () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let addForm = JSON.stringify(this.addForm)
          addForm = JSON.parse(addForm)
          // 人群标签 id 集合
          addForm.conditionTagIds = addForm.conditionTagIds.join(',')
          // 其他的标签 id 集合
          addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.join(',')
          if (this.addForm.policyId != '') {
            this.$service.policyUpate(addForm, '编辑成功').then(() => {
              this.loadData()
              this.addFormVisible = false
            })
          } else {
            this.$service.policyAddSave(addForm, '添加成功').then(() => {
              this.loadData()
              this.addFormVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 取消
    cancelAdd: function () {
      this.addFormVisible = false
    },
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
    handleCommand (scope) {
      const type = scope[0]
      const params = scope[1]
      if (type === 'edit') {
        this.handleEdit(params)
        // 如果是smart=true 则证明是流程图创建人群 否则普通人群创建
        // if (params.smart) {
        //     this.$router.push({
        //         name: 'oneTouchDrop',
        //         params: {
        //             source: this.parentSource ? 'myCrowd': undefined,
        //         },
        //         query: {
        //             policyId: params.policyId
        //         }
        //     })
        // }
      } else if (type === 'del') {
        this.del(params)
      } else if (type === 'detail') {
        this.seeDevDetail(params)
      } else if (type === 'collect') {
        this.handlePolicyCollect(params)
      } else if (type === 'statics') {
        this.currentPid = scope[1].policyId
        this.showStatistics = true
        // 重置时间
        this.time = [this.startDate, this.endDate]
        this.time1 = [this.startDate, this.endDate]
        this.drawPie(this.currentPid, this.startDate, this.endDate)
        this.drawLines(this.currentPid, this.startDate, this.endDate)
      } else if (type === 'viewEffect') {
        this.showViewEffect = true
        this.currentPid = params.policyId
      }
    },
    // 通用多线性参数设置
    setLinesEchart (element, title, xData, yData, legend) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return _this.cc_format_number(a.data)
          }
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
                value = value / 10000 + '万'
              } else if (value >= 10000000) {
                value = value / 10000000 + '千万'
              } return value
            }
          }
        },
        series: yData
      })
    },
    setCircleEcharts (element, title, legend, data) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        // tooltip: {
        //     trigger: 'item',
        //     formatter: "{a} <br/>{b}: {c} ({d}%)"
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return a.data.name + ':' + _this.cc_format_number(a.data.value) + '(' + a.percent + ')%'
          }
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: legend
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              },
              emphasis: {
                label: {
                  show: true,
                  formatter: '{b}\n{c} ({d}%)',
                  position: 'center',
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            // label: {
            //     normal: {
            //         show: true,
            //         formatter: "{a}{b}: {c} ({d}%)"
            //     },
            //     emphasis: {
            //         show: true,
            //         textStyle: {
            //             fontSize: '30',
            //             fontWeight: 'bold'
            //         }
            //     }
            // },
            // labelLine: {
            //     normal: {
            //         show: false
            //     }
            // },
            data: data
          }
        ]
      })
    },
    // 策略使用以及各业务使用次数统计
    handleCommandStastic (scope) {
      const type = scope[0]
      this.currentPid = scope[1].policyId
      this.showStatistics = true
      if (type === 'detail') {
        // 重置时间
        this.time = [this.startDate, this.endDate]
        this.time1 = [this.startDate, this.endDate]
        this.drawPie(this.currentPid, this.startDate, this.endDate)
        this.drawLines(this.currentPid, this.startDate, this.endDate)
      }
    },
    drawPie (id, startTime, endTime) {
      this.$service.policyWithBiTotalPie({ pid: id, startTime: startTime, endTime: endTime }).then((data) => {
        if (data.data.length === 0) { this.pieTitle = '累计使用次数按业务分部暂无数据' } else { this.pieTitle = '累计使用次数按业务分部' }
        this.setCircleEcharts('hitBiTotal', '', data.name, data.data)
      })
    },
    drawLines (id, startTime, endTime) {
      this.$service.policyWithBiTotalLine({ pid: id, startTime: startTime, endTime: endTime }).then((data) => {
        const legendData = data.series.map((key) => {
          return key.name
        })
        const linesData = data.series.map((key) => {
          return { name: key.name, data: key.data, type: 'line' }
        })
        this.linesTitle = '策略使用以及各业务使用次数统计'
        this.setLinesEchart('main', '', data.date, linesData, legendData)
      })
    },
    formatDate (d) {
      const time = new Date(d)
      const y = time.getFullYear() // 年份
      const m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
      const r = time.getDate().toString().padStart(2, '0') // 日子
      return `${y}-${m}-${r}`
    },
    launchDetail (pid) {
      this.showLaunch = true
      this.$service.policyUseInBi({ policyId: pid }).then((data) => {
        this.launchItems = data
      })
    },
    setDataInMonth (startDate, endDate) {
      const startTime = new Date(startDate).getTime()
      const endTime = new Date(endDate).getTime()
      const oneMonth = 3600 * 1000 * 24 * 30
      if (endTime - startTime > oneMonth) { return false } else { return true }
    },
    handleLaunch (row) {
      this.showLaunchToBusiness = true
      this.recordId = row.policyId
      this.tempPolicyAndCrowd = row
    },
    handleCloseDialog () {
      this.showLaunchToBusiness = false
    },
    handlePolicyCollect (row) {
      const collectFlag = row.myCollect
      const policyId = row.policyId
      if (collectFlag) {
        this.$service.removeCollectPolicy({ policyId }, '成功取消收藏此策略！').then(() => {
          this.loadData()
        })
      } else {
        this.$service.collectPolicy({ policyId }, '成功收藏此策略！').then(() => {
          this.loadData()
        })
      }
    },
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 1, behaviorShow: val.join(',') })
    },
    handleShowAllChange () {
      this.loadData()
    }
  }
}
</script>
<style lang="stylus" scoped>
.checkList
  >>> .el-checkbox+.el-checkbox
    margin-left: 0px
  >>> .el-checkbox
    min-width: 130px
    margin-right: 5px
.checkList
  height: 200px
  overflow: auto

.strategy-search
  display flex
  margin-bottom 10px
.strategy-search--input
  width 70%
  margin-right 20px
.tags-tips
  font-size 12px
  text-align: center;
  white-space nowrap
.page-num
  width 30px
  height 30px
  border-radius 100px
  padding 0
.active
  border-color #0086b3
  color #0086b3
.pagination
  float right
.operate
  position relative
  z-index 0
  font-size 20px
  cursor pointer
  margin-left 10px
.more-operate
  position absolute
  z-index 999
.operate-item
  background #9a6e3a
ul > li
  list-style none
.echarts-container
  position relative
  width 50%
  height auto
  float left
.crowd-statistic
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
.under_line
  text-decoration underline
  color blue
  cursor pointer
.launch-item + .launch-item
  margin-left 20px
.manual
  margin 20px
.search-input
  position relative
  margin 0 15px
.icon-fixed
  position absolute
  top 8px
  right 28px
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
.strategy-list
  >>> .el-tag--warningOrange
    color #512DA8
    background-color rgba(119, 81, 200, .4)
    border-color rgba(81, 45, 168, .45)
    .el-tag__close
      color #512DA8
  >>> .el-tag--warningOrange2
    color: #795548;
    background-color: rgba(167, 130, 117, .5);
    border-color: #7955488c;
    .el-tag__close
      color #512DA8
  >>> .el-tag--warningCyan
    color: #00bcd4;
    background-color: rgba(0, 189, 214, .1);
    border-color: #00bcd42b
  >>> .el-tag--gray {
    color: #fff;
    background-color: rgba(165,155,149, 1);
    border-color: rgba(165,155,149, 1);
    .el-tag__close {
      color #fff
      &:hover{
        background-color: #666
      }
    }
  }
.header-left
  display flex
  align-items center

/*flex布局*/
    .parent{
      display: flex;
      display: -webkit-flex;
      display: -o-flex;
      display: -moz-flex;
      display: -ms-flex;
      align-items: stretch;
    }
    .left{
      background: aqua;
    }
    .right{
      margin-left: 110px;
      background: antiquewhite;
    }
</style>
<!-- <style lang="stylus">
.el-textarea__inner
  min-height 400px !important
</style> -->
