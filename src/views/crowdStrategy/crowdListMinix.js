// import { Table} from 'admin-toolkit'
import priorityEdit from '../../components/PriorityEdit'
// import crowdStatusItem from './CrowdStatusItem'
import crowdStatusResource from './CrowdStatusResource'
import CommitHistoryDialog from '@/components/CommitHistory'
import numOrTextEdit from '../../components/EditNumOrText'
import viewEffectDialog from '../launch/viewEffectDialog'
import LinkAnalysis from './LinkAnalysis/Index'
import AfterPushDetail from './AfterPushDetail'
import { dataSourceColorEnum } from '@/utils/tags.js'
import TipPopover from '@/views/crowdCompute/components/tipPopover.vue'
import ShowRule from '@/views/storyLine/com/ShowRule.vue'
export default {
  components: {
    // Table,
    priorityEdit,
    crowdStatusResource,
    CommitHistoryDialog,
    numOrTextEdit,
    viewEffectDialog,
    LinkAnalysis,
    TipPopover,
    AfterPushDetail,
    ShowRule
  },
  data () {
    const checkFinanceCode = (rule, value, callback) => {
      if (value) {
        const reg = /^\d+$/
        if (reg.test(value) === false) {
          callback(new Error('请输入正整数或0'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      alertTimeValue: '12:00',
      queryCrowdHitAlertListTable: {
        props: {},
        header: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '监控时间',
            prop: 'alertTime',
            sortable: true
          },
          {
            label: '期望设备量',
            prop: 'hitSize',
            render: (h, params) => {
              return params.row.compareType + '  ' + params.row.hitSize
            }
          },
          {
            label: '状态',
            prop: 'statusName',
            render: (h, params) => {
              if (params.row.statusName === '监控中') {
                return h('span', { class: 'green' }, params.row.statusName)
              } else {
                return h('span', params.row.statusName)
              }
            }
          },
          {
            label: '创建人',
            prop: 'creator'
          },
          {
            label: '操作',
            render: this.$c_utils.component.createOperationRender(this, {
              handleDeleteHitAlert: '删除'
            })
          }

        ],
        data: []
      },
      showHitDialog: false,
      hitForm: {
        alertTime: '',
        hitSize: 0,
        compareType: '<'
      },
      hitRules: {
        hitSize: [
          { required: true, message: '请输入命中设备量', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: checkFinanceCode } // 自定义正则
        ],
        alertTime: [{ required: true, message: '请选择监控时间', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate (time) {
          // // 设置可选时间为今天或今天之后的日期
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      analysisTableData: [],
      showFlowLinkAnalysisDialog: false,
      linkProps: {},
      linkPropsName: {},
      linkPropsNameTip: {},
      shenCeForm: {
        dateRange: [],
        crowdId: '',
        autoVersion: false
      },
      shenCeDialog: false,
      showOperationalAnalysis: false,
      operationalAnalysisUrl: '',
      showEditDynamicCrowdName: false,
      dynamicCrowd: {},
      // 表格当前页数据
      tableData: [],
      contrastCrowdTableData: [], // 对比人群数据
      testResult: '',
      formTest: {
        mac: undefined,
        policyId: undefined,
        crowdId: undefined
      },
      rules: {
        mac: [{ required: true, message: '请输入Mac', trigger: 'blur' }]
      },
      // 搜索条件
      criteria: {
        //  policyId:selectRow.policyId
      },
      searchForm: {
        crowdName: ''
        // putway: ''
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
      testDialogVisible: false,
      estimateId: '',
      showResult: false,
      total1: undefined,
      total2: undefined,
      total3: undefined,
      totalUser: undefined,
      total4: undefined,
      // time0: [],
      // time1: [],
      // time2: [],
      // time3: [],
      // time4: [],
      // time5: [],
      // time6: [],
      // time7: [],
      showStatistics: false,
      // hitLinesTitle: '',
      // hitPieTitle: '',
      // exposeLinesTitle: '',
      // exposePieTitle: '',
      // clickLinesTitle: '',
      // clickPieTitle: '',
      // crowdLaunchTitle: '',
      // exposeProvinceTitle: '',
      // startDate: '',
      // endDate: '',
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
          { type: 'array', required: true, message: '请至少选择一个策略', trigger: 'change' }
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
        7: '近7日',
        30: '近30日'
      },
      expirationDay: '7',
      fillEmptyData: {
        data: [{ name: '总量', value: 0 }],
        name: { data: ['总量'] }
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
      subdividePeopleList: [],
      independentParams: {
        pageSize: 10,
        pageNum: 1
      },
      independentTotal: 0,
      setShowCommitHistoryDialog: false,
      currentCrowdId: undefined,
      abStatusEnum: {},
      launchStatusEnum: {},
      independentLaunchStatusEnum: {},
      checkList: ['creatorName'],
      downloadUrl: undefined,
      launchedExportUrl: undefined,
      crowdValidEnum: {},
      canBatchEstimate: false,
      estimateType: undefined,
      showLimitLaunchDialog: false,
      showLimitLaunchCount: undefined,
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      // dataSourceColorEnum: {
      //   1: 'success',
      //   2: 'danger',
      //   3: '',
      //   5: 'warning',
      //   6: 'warningOrange',
      //   7: 'warningOrange2',
      //   8: 'warningCyan',
      //   11: 'success',
      //   12: 'gray'
      // },
      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      showBypassDialog: false,
      showBypassStep: 1,
      byPassForm: this.genBypassForm(),
      ratioEnum: this.genInitApart(),
      selectList: [],
      bypassSaveFlag: '',
      showByPassColumn: false,
      tableMerge: [],
      initTableMerge: [],
      showConfiguration: false,
      showAppointment: false,
      appointmentForm: {
        value: []
      },
      configTextarea: '',
      initExpandCrowd: [],
      copyErrorMsg: '', // 人群复制捕获错误信息
      monitorDialog: false,
      monitorRangeTime: undefined,
      monitorOutForm: {
        pageSize: 10,
        pageNum: 1
      },
      monitorTotal: 0,
      monitorTable: {
        props: {},
        header: [
          {
            label: '人群名称',
            prop: 'launch_name'
          },
          {
            label: 'dmp人群ID',
            prop: 'dmp_crowd_id'
          },
          {
            label: '临时人群版本号',
            prop: 'version'
          },
          {
            label: '当前版本',
            prop: 'cur_version'
          },
          {
            label: '接收设备数量',
            prop: 'receive_total_user'
          },
          {
            label: '设备数量',
            prop: 'total_user'
          },
          {
            label: '人群位文件名称',
            prop: 'es_index'
          },
          {
            label: '状态',
            prop: 'status_name'
          },
          {
            label: '临时人群同步日期',
            prop: 'update_time'
          }
          // {
          //   label: '版本是否删除',
          //   render: (h, params) => {
          //     return h('div', {}, [
          //       h('span', {}, params.row.del_flag === 1 ? '否' : '是') // 1 否  2 是
          //     ])
          //   }
          // }
        ],
        data: []
      },
      soureceSignList: [],
      dynamic2GroupList: [], // 动态人群实验分组列表
      showDynamicListDetail: false,
      dynamic2GroupListTable: {
        props: {},
        header: [
          {
            label: '流转ID',
            prop: 'id'
          },
          {
            label: '流转名称',
            prop: 'name'
          },
          {
            label: '占比',
            prop: 'flowNum',
            render: (h, { row }) => {
              return h('div', {}, `${row.flowNum}%`)
            }
          },
          {
            label: '流转方式',
            prop: 'mainArithmetic',
            render: (h, { row }) => {
              const options = ['顺序', '循环', '随机', '自定义', '不流转', '智能', '故事线']
              return options[row.mainArithmetic]
            }
          },
          {
            label: '数量',
            prop: 'crowdNum'
          },
          {
            label: '状态',
            prop: 'mainArithmetic',
            render: (h, { row }) => {
              // const options = ['顺序', '循环', '随机', '自定义', '不流转', '智能', '故事线']
              return '下架'
            }
          },
          {
            label: '流转条件',
            width: '300',
            prop: 'flowChart',
            render: (h, { row }) => {
              const nodes = JSON.parse(row.flowChart).nodes || []
              console.log('nodes-->', nodes)
              // return flowChart.dynamicJson
              // <ShowRule
              //   :rulesJson="JSON.parse(ruleItem.rulesJson)"
              //   :conditionEnum="conditionEnum"
              //   :soureceSignList="soureceSignList"
              // >
              // </ShowRule>
              const getRule = (item) => h(ShowRule, {
                props: {
                  rulesJson: JSON.parse(item.dynamicJson),
                  conditionEnum: this.conditionEnum,
                  soureceSignList: this.soureceSignList
                }
              })
              const res = []
              nodes.forEach(item => {
                res.push(h('div', {}, [
                  h('span',
                    {
                      class: 'show-rule-styl'
                    },
                    `${item.crowdName}：`
                  ),
                  getRule(item)
                ])
                )
              })
              // return res

              return h('div', null, res)
            }
          },
          {
            label: '操作',
            // fixed: 'right',
            width: '180',
            // render: this.$c_utils.component.createOperationRender(this, {
            //   handleEditDynamic2GroupList: '编辑',
            //   handleFlowLinkAnalysis: '流转链路分析'
            // }),
            render: (h, params) => {
              const createBtn = (label, method, permission) => {
                return h('el-button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this[method](params)
                    }
                  }
                }, label)
              }
              return h('div', null, [
                createBtn('编辑', 'handleEditDynamic2GroupList'),
                createBtn('流转链路分析', 'handleFlowLinkAnalysis'),
                createBtn(params.row.putway === 1 ? '下架' : '上架', 'handleOffSet')
              ])
            }
          }
        ],
        data: []
      },
      showViewEffect: false,
      currentCrowd: {}

    }
  },
  props: ['selectRow'],
  computed: {
    smart () {
      return this.selectRow.smart
    },
    dataSourceColorEnum () {
      return dataSourceColorEnum
    }
    // abStartTimeFormat () {
    //   const time = this.currentCrowd.abStartTime || ''
    //   // if (time) {
    //   return this.$moment(time).format('YYYY-MM-DD')
    //   // } else {
    //   // return ''
    //   // }
    // },
    // after30Days () {
    //   return this.$moment().add(30, 'days').format('YYYY-MM-DD')
    // }
  },
  created () {
    // 高阶函数
    // this.$watch('time2', this.createTimeWatcher(2, 'drawExposeLine'))

    this.loadData()

    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })
    // const start = new Date()
    // const end = new Date()
    // this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
    // this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
  },
  // mounted () {
  //   function changeMobsfIframe () {
  //     const mobsf = document.getElementById('mobsf')
  //     const deviceWidth = document.body.clientWidth
  //     const deviceHeight = document.body.clientHeight
  //     mobsf.style.width = (Number(deviceWidth) - 240) + 'px' // 数字是页面布局宽度差值
  //     mobsf.style.height = (Number(deviceHeight) - 64) + 'px' // 数字是页面布局高度差
  //   }
  //   changeMobsfIframe()

  //   window.onresize = function () {
  //     changeMobsfIframe()
  //   }
  // },
  watch: {
    memberListType (val, oldVal) {
      if (val !== oldVal && oldVal.length !== 0) {
        this.getUserType()
      }
    },
    memberListByPay (val, oldVal) {
      if (val !== oldVal && oldVal.length !== 0) {
        this.getPayDetail()
      }
    },
    expirationDay (val, oldVal) {
      if (val !== oldVal && oldVal.length !== 0) {
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

    onChange (time) {
      console.log(time)
      this.alertTimeValue = time
    },
    handleDeleteHitAlert ({ row }) {
      console.log('row--->', row)
      const params = { id: row.id }
      this.$service.deleteCrowdHitAlert(params, '删除成功').then(() => {
        this.queryCrowdHitAlertList()
      })
    },
    // 获取当前接待员命中监控
    queryCrowdHitAlertList () {
      const params = {
        crowdId: this.currentTag.crowdId
      }
      this.$service.queryCrowdHitAlertList(params).then(data => {
        this.queryCrowdHitAlertListTable.data = data || []
      })
    },
    hitMonitoring (row) {
      console.log('row-->', row)
      this.currentTag = row // 当前所选人群

      // 获取监控列表
      this.queryCrowdHitAlertList()
      this.showHitDialog = true
      // 清空表单
      this.$nextTick(() => {
        this.$refs.hitForm.resetFields()
      })
    },
    async handlOpenHit () {
      const valid = await this.$refs.hitForm.validate()
      if (valid) {
        console.log('hitForm--->', this.hitForm)
        const params = {
          ...this.hitForm,
          crowdId: this.currentTag.crowdId,
          hitSize: Number(this.hitForm.hitSize),
          alertTime: `${this.hitForm.alertTime} ${this.alertTimeValue}`
          // compareType: '>'
        }
        this.$service.addCrowdHitAlert(params, '添加成功').then(res => {
          this.queryCrowdHitAlertList()
        })
      }
    },
    // pickerShenCeOptionsDayinRange (day, startTime) { //   开始和结束不超 day天   startTime - 最早时间
    //   let _minTime = null
    //   let _maxTime = null

    //   return {
    //     onPick (time) {
    //       // 如果选择了只选择了一个时间
    //       if (!time.maxDate) {
    //         const timeRange = day * 24 * 60 * 60 * 1000
    //         _minTime = time.minDate.getTime() - timeRange // 最小时间
    //         _maxTime = time.minDate.getTime() + timeRange // 最大时间
    //         // 如果选了两个时间，那就清空本次范围判断数据，以备重选
    //       } else {
    //         _minTime = _maxTime = null
    //       }
    //     },
    //     disabledDate: (time) => {
    //       const maxTime = Date.now()
    //       const day1 = 720 * 24 * 3600 * 1000
    //       let minTime = Date.now() - day1

    //       if (startTime) {
    //         minTime = new Date(startTime) - 1 * 24 * 3600 * 1000
    //         // minTime = Date.now(startTime) - 1 * 24 * 3600 * 1000
    //       }

    //       // onPick后触发
    //       // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
    //       if (_minTime && _maxTime) {
    //         return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() < _minTime || time.getTime() > _maxTime
    //       } else {
    //         return time.getTime() > maxTime || time.getTime() < minTime
    //       }
    //     }
    //   }
    // },
    pickerShenCeOptionsDayinRange (day, startTime) { // 开始和结束不超 day天   startTime - 最早时间
      // const _minTime = null
      // const _maxTime = null

      return {
        // onPick (time) {
        //   // 如果选择了只选择了一个时间
        //   if (!time.maxDate) {
        //     const timeRange = day * 24 * 60 * 60 * 1000
        //     _minTime = time.minDate.getTime() - timeRange // 最小时间
        //     _maxTime = time.minDate.getTime() + timeRange // 最大时间
        //     // 如果选了两个时间，那就清空本次范围判断数据，以备重选
        //   } else {
        //     _minTime = _maxTime = null
        //   }
        // },
        disabledDate: (time) => {
          // const day1 = 720 * 24 * 3600 * 1000 // 2 年
          // let minTime = Date.now() - day1 // 最小值是过去 2 年内
          // // 如果有设定起始日期，那最小日期就是设定的起始日期
          // if (startTime) {
          //   minTime = new Date(startTime) - 1 * 24 * 3600 * 1000
          // }

          const maxTime = Date.now() + 30 * 24 * 3600 * 1000 // 最大值是未来 30 天内

          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          // if (_minTime && _maxTime) {
          //   return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() < _minTime || time.getTime() > _maxTime
          // } else {
          // return time.getTime() > maxTime || time.getTime() < minTime
          return time.getTime() > maxTime
          // }
        }
      }
    },
    // 流转链路分析
    handleFlowLinkAnalysis ({ row }) {
      console.log('row------------', row)
      const parmas = {
        dynamicRuleId: row.id // 分组 ID
        // dynamicRuleId: 77, // 分组 ID
      }
      // const data = [{
      //   arup: 59.48,
      //   payUv: 964,
      //   path: 11679,
      //   price: 57334.00,
      //   payRate: 0.01,
      //   dynamicRuleName: '分组1',
      //   child: [{
      //     arup: 56.86,
      //     payUv: 42,
      //     path: '11679_11680',
      //     price: 2388.00,
      //     payRate: 0.01,
      //     hitUv: 151131,
      //     nowCrowdName: '方案1',
      //     child: [
      //       {
      //         arup: 0.00,
      //         payUv: 0,
      //         path: '11679_11680_11679',
      //         price: 0.00,
      //         payRate: 0.00,
      //         child: [],
      //         hitUv: 571,
      //         nowCrowdName: '方案1-1'
      //       }, {
      //         arup: 0.00,
      //         payUv: 0,
      //         path: '11679_11680_11679',
      //         price: 0.00,
      //         payRate: 0.00,
      //         child: [],
      //         hitUv: 571,
      //         nowCrowdName: '方案1-2'
      //       }
      //     ]
      //   }, {
      //     nowCrowdName: '方案2',
      //     arup: 56.86,
      //     payUv: 42,
      //     path: '11679_11680',
      //     price: 2388.00,
      //     payRate: 0.01,
      //     hitUv: 151131,
      //     child: [
      //       {
      //         arup: 0.00,
      //         payUv: 0,
      //         path: '11679_11680_11679',
      //         price: 0.00,
      //         payRate: 0.00,
      //         child: [],
      //         hitUv: 571,
      //         nowCrowdName: '方案1-1'
      //       }, {
      //         arup: 0.00,
      //         payUv: 0,
      //         path: '11679_11680_11679',
      //         price: 0.00,
      //         payRate: 0.00,
      //         child: [],
      //         hitUv: 571,
      //         nowCrowdName: '方案1-2'
      //       }
      //     ]
      //   }, {
      //     nowCrowdName: '方案2',
      //     arup: 56.86,
      //     payUv: 42,
      //     path: '11679_11680',
      //     price: 2388.00,
      //     payRate: 0.01,
      //     hitUv: 151131,
      //     child: [
      //       {
      //         arup: 0.00,
      //         payUv: 0,
      //         path: '11679_11680_11679',
      //         price: 0.00,
      //         payRate: 0.00,
      //         child: [],
      //         hitUv: 571,
      //         nowCrowdName: '方案1-1'
      //       }, {
      //         arup: 0.00,
      //         payUv: 0,
      //         path: '11679_11680_11679',
      //         price: 0.00,
      //         payRate: 0.00,
      //         child: [],
      //         hitUv: 571,
      //         nowCrowdName: '方案1-2'
      //       }
      //     ]
      //   }]

      // }]

      this.linkProps = {
        // name: 'dynamicRuleName',
        children: 'child'
      }

      this.linkPropsName = {
        path: '路径',
        payUv: '转化设备量',
        arup: '客单价',
        fatherPath: '父路径',
        price: '付费总金额',
        payRate: '转化率',
        hitUv: '流入设备量',
        totalHitUv: '总流入设备量',
        ratio: '比例',
        dynamicRuleName: '分组名称',
        nowCrowdName: '方案名称'
        // level: '层级',
      }
      this.linkPropsNameTip = {
        payUv: '当前路径中付费的用户量',
        arup: '付费总金额/转化设备量',
        path: '用户在该组动态人群中流转的人群顺序',
        price: '当前路径中付费的总金额',
        payRate: '转化设备量/流入设备量',
        hitUv: '人群命中量',
        ratio: '当前路径流入设备量/父级路径流入设备量'
      }
      this.$service.getCrowdFlowPath(parmas).then(res => {
        if (typeof res.data === 'string') {
          return this.$message.info(res.data) // 数据不存在
        }
        console.log('res====>', res)
        const data = [res]

        this.showFlowLinkAnalysisDialog = true
        this.analysisTableData = this.constructLinkData(data, 0)

        console.log('this.analysisTableData====', this.analysisTableData)
      })
    },
    // 递归处理路径分析
    constructLinkData (data, zLevel) {
      const childLevel = zLevel + 1 // child 的层级加1
      if (!data || data.length === 0) {
        return []
      }
      const len = data ? data.length : 0
      return data.map(item => {
        let obj = {}

        // 第一级 什么都不变
        if (zLevel === 0) {
          return {
            dynamicRuleName: item.dynamicRuleName,
            totalHitUv: this.cc_format_number(item.hitUv),
            child: this.constructLinkData(item.child, childLevel),
            ratio: '100%',
            level: zLevel
          }
        }
        // 往他的 child 插入一条已转化对象
        else if ((item.name || item.dynamicRuleName || item.nowCrowdName) && item.payUv > 0) {
          // len = len + 1
          const zhuanhuaObj = {
            path: item.path,
            payUv: this.cc_format_number(item.payUv),
            payRate: this.toPercent(item.payRate),
            arup: this.cc_format_number(item.arup),
            price: this.cc_format_number(item.price)
          }
          // obj.child = []
          const child = item.child && item.child.length > 0 ? item.child : []
          child.unshift(zhuanhuaObj)

          obj = {
            nowCrowdName: item.nowCrowdName,
            path: item.path,
            ratio: this.toPercent(item.hitRate), // 比例
            hitUv: this.cc_format_number(item.hitUv),
            // ratio: zLevel === 0 ? (1 / len * 100) : (1 / (len+1) * 100) // 等分比例
            level: zLevel,
            child: this.constructLinkData(child, childLevel)
          }
        } else { // 完全转化的块， 或者 payUv 为 0 的块
          const child = item.child && item.child.length > 0 ? item.child : []
          obj = {
            nowCrowdName: item.nowCrowdName,
            path: item.path,
            ratio: item.ratio
              ? item.ratio
              : item.hitRate ? this.toPercent(item.hitRate) : undefined, // 比例
            payUv: item.payUv > 0 ? item.payUv : undefined,
            payRate: item.payRate ? item.payRate : undefined,
            arup: item.arup ? item.arup : undefined,
            price: item.price ? item.price : undefined,
            hitUv: item.hitUv,
            // ratio: zLevel === 0 ? 100 : 1 / len * 100, // 等分比例
            level: zLevel,
            child: child.length > 0 ? this.constructLinkData(child, childLevel) : undefined
          }
        }
        return obj
      })
    },

    toPercent (point) {
      let str = Number(point * 100).toFixed(2)
      str += '%'
      return str
    },
    handleEditDynamic2GroupList ({ row }) {
      // const crowdId = row.crowdId
      // console.log(...arguments)
      this.handleDynamicTest(row, 'editDynamicCrowd', { tabSet: 'second', initActiveStep: 1 })
      this.showDynamicListDetail = false
    },
    // 是否为引用人群
    isReferCrowd (id) {
      return id
    },
    // 互斥
    isShow (key, row) {
      // abMainCrowd    0-普通人群  1-ab主   2-ab的小   3-再分割

      // abMainCrowd = 1  代表是AB分割人群
      // abMainCrowd = 3 代表是再分割人群
      // dynamicFlag = 1 代表是动态人群

      // 显示的条件：

      // // AB
      // const showAB = row.abMainCrowd === 0 && !row.limitLaunch

      // // 画像平台分析
      // const showYunying = row.behaviorTempCrowdId && row.abMainCrowd !== 1

      // // 动态实验
      // const showDynamic = row.dynamicFlag === 1

      // AB人群
      const isAB = row.abMainCrowd === 1

      // 运营分析（再分割人群）
      const isYunying = row.abMainCrowd === 3

      // 动态实验
      const isDynamic = row.dynamicFlag === 1

      if (key === 'AB') {
        return !isAB && !isYunying && !isDynamic && !row.limitLaunch
        // return !isAB && !isYunying && !isDynamic
      } else if (key === 'Yunying') {
        return !isAB && !isDynamic
      } else if (key === 'Dynamic') {
        return !isAB && !isYunying && !isDynamic
      }
    },
    handleSortChange (obj) {
      console.log('column====', obj)
      console.log('<========================>', this.initExpandCrowd)

      // orderField：  人群ID：crowd_id, 优先级：priority  状态： putway
      // order：    ASC,DESC 切换

      const sortParams = {
        orderField: obj.prop
      }
      this.currentPage = 1 // 页码重置为 1

      if (obj.order === 'descending') {
        sortParams.order = 'DESC'
      } else if (obj.order === 'ascending') {
        sortParams.order = 'ASC'
      } else {
        sortParams.order = null
      }
      this.loadData(sortParams, 'sort')
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleMonitorSizeChange (val) {
      this.monitorOutForm.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.monitorOutForm.pageNum = 1
      this.handleGetMonitorTableList()
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleMonitorCurrentChange (val) {
      this.monitorOutForm.pageNum = val
      this.handleGetMonitorTableList()
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleIndependentSizeChange (val) {
      this.independentParams.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.independentParams.pageNum = 1
      this.showDivideResult(this.independentParams.crowdId)
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleIndependentCurrentChange (val) {
      this.independentParams.pageNum = val
      this.showDivideResult(this.independentParams.crowdId)
    },
    // 计算
    calculate (row) {
      this.$service.calculateTempCrowd({ launchCrowdId: row.launchCrowdId, calType: row.calType }, '成功计算中').then(() => {
        this.showDivideResult(row.crowdId)
      })
    },
    handleMonitor (row) {
      this.monitorDialog = true
      this.selectedRow = row
      this.handleGetMonitorTableList()
    },
    getDataMonitor () {
      this.handleGetMonitorTableList()
    },
    handleGetMonitorTableList () {
      const monitorRangeTime = this.monitorRangeTime || []
      const startDate = monitorRangeTime[0] || ''
      const endDate = monitorRangeTime[1] || ''
      const params = {
        launchCrowdId: this.selectedRow.launchCrowdId,
        startDate,
        endDate,
        ...this.monitorOutForm
      }
      this.$service.launchVersionList(params).then(data => {
        if (data) {
          this.monitorTotal = data.pageInfo.total
          this.monitorTable.data = data.pageInfo.list || []
        } else {
          this.resultContent = '暂无数据'
        }
      })
    },
    pickerOptionsDayinRange (day) { // element日期范围选择 range 天内 开始和结束不超 day天
      let _minTime = null
      let _maxTime = null

      return {
        onPick (time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            const timeRange = day * 24 * 60 * 60 * 1000
            _minTime = time.minDate.getTime() - timeRange // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate: (time) => {
          // const day1 = range * 24 * 3600 * 1000 // 2年

          if (this.DivideTableData && this.DivideTableData.length > 0) { // AB人群
            // AB 实验有效期：{{ DivideTableData[0].abStartTime  }} - {{ DivideTableData[0].abEndTime }}
            // 如果是AB子人群，则预约的起止时间不超过当前配置的实验有效期，超过的日期则为灰色不可点
            const abStartTime = new Date(this.DivideTableData[0].abStartTime).getTime()
            const abEndTime = new Date(this.DivideTableData[0].abEndTime).getTime()

            // 选择了一个时间的时候
            if (_minTime && _maxTime) {
              return time.getTime() < _minTime || time.getTime() > _maxTime || time.getTime() < abStartTime || time.getTime() > abEndTime
            }

            // 没有选择时间, 或者选择了两个时间的时候
            return time.getTime() < abStartTime || time.getTime() > abEndTime
          }

          // onPick后触发
          // 选择了一个时间的时候
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime
          }
        }
      }
    },
    /* mac 改变的时候触发 */
    handleMacChange () {
      this.testResult = ''
    },
    handleTest () {
      this.$refs.formTest.$refs.form.validate((valid) => {
        if (valid) {
          this.$service.polisyTest(this.formTest).then((data) => {
            this.testResult = data.result
          })
        }
      })
    },
    /* 投前测试 */
    isShowTest (item) {
      const tagsList = this.selectRow.tagsList || []// 所有的tags
      const currentItemTagIds = item.tagIds || ''// 当前行的tags
      const tagsArr = currentItemTagIds.split(',')
      let flag = false
      for (let i = 0; i < tagsArr.length; i++) {
        const tag = tagsList.find((e) => {
          return e.tagId === parseInt(tagsArr[i])
        }) || {}
        if (tag.dataSource === 3) {
          flag = true
          break
        }
      }
      return flag
    },
    /**
       * 打开投前测试弹出框
       */
    handleOpenTestDialog (item) {
      this.testDialogVisible = true
      this.formTest.policyId = item.policyId
      this.formTest.crowdId = item.crowdId
    },
    genInitApart () {
      return [
        {
          label: 1,
          value: 1
        },
        {
          label: 2,
          value: 2
        },
        {
          label: 3,
          value: 3
        },
        {
          label: 4,
          value: 4
        },
        {
          label: 5,
          value: 5
        }
      ]
    },
    genBypassForm (present) {
      return {
        apart: 2,
        // bypass: [{name: '',ratio: '',crowds: [{ crowdId: '',crowdName: '',priority: 1 }]}],
        bypass: [],
        ...present
        // crowds: [{ crowdId: '',crowdName: '',priority: 1 }]
      }
    },
    // handleInputTime (index, val, method) {
    //   const key = 'time' + index
    //   const oldVal = this[key]
    //   if (this.currentCid && oldVal.length !== 0) {
    //     if (this.setDataInMonth(val[0], val[1])) {
    //       this[key] = val
    //       this[method](this.currentCid, val[0], val[1])
    //     } else {
    //       this.$message.error('日期间隔最多只能是30天！请重新选择日期')
    //     }
    //   }
    // },
    goBack () {
      this.$emit('goBack')
    },
    // initTime () {
    //   this.time0 = [this.startDate, this.endDate]
    //   this.time1 = [this.startDate, this.endDate]
    //   this.time2 = [this.startDate, this.endDate]
    //   this.time3 = [this.startDate, this.endDate]
    //   this.time4 = [this.startDate, this.endDate]
    //   this.time5 = [this.startDate, this.endDate]
    //   this.time6 = [this.startDate, this.endDate]
    //   this.time7 = [this.startDate, this.endDate]
    // },
    callback () {
      this.loadData()
    },
    handleAdd () {
      this.$emit('addCrowd')
    },
    handleLink () {
      this.$emit('addLinkCrowd')
    },
    handleAddDynamic () {
      this.$emit('addDynamicCrowd')
    },

    // 新增/编辑动态实验
    handleDynamicTest (row, mode, tabSet) {
      this.$emit('handleDynamicTest', row, mode, tabSet)
    },
    edit (row) {
      this.$emit('addCrowd', row)
    },
    // 编辑ab test人群
    divideAB (row, mode) {
      this.$emit('editABCrowd', row, mode)
    },
    del (row) {
      const id = row.crowdId
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.strategyCrowdDel({ crowdId: id }, '删除人群会影响该策略下所有人群的估算数量，请点击“估算”重新估算其他人群的圈定数据').then(() => {
            this.loadData()
          })
        }).catch(function () {

        })
    },
    // 批量估算
    handleBatchEstimate () {
      this.estimateType = 'batch'
      this.showEstimate = true
      this.$service.getEstimateType().then((data) => {
        this.estimateItems = data
      })
      //    初始化值
      this.estimateValue = ['0']
    },
    // 点击估算按钮
    handleClickEstimate (row) {
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
      const calIdType = this.estimateValue.map((item) => item).join(',')
      const formData = {
        policyId: this.selectRow.policyId,
        crowdId: this.estimateType === 'single' ? this.estimateId : undefined,
        triggerUser: this.getUserName(),
        triggerTime: (new Date()).valueOf(),
        calIdType
      }
      if (this.estimateType === 'single') {
        this.$service.estimatePeople({ crowdId: this.estimateId, calIdType: calIdType }).then((res) => {
          this.showEstimate = false
          this.loadData()

          if (res.code === '3000') {
            this.$message({
              title: '提示',
              type: 'warning',
              message: res.msg
            })
          } else {
            this.$message({
              title: '操作成功',
              type: 'success',
              message: '提交估算成功'
            })
          }
        })
      } else {
        this.$service.batchCrowdEstimate(formData, '提交估算成功').then(
          () => {
            this.showEstimate = false
            this.loadData()
            this.canBatchEstimate = true
            setTimeout(() => {
              this.$set(this, 'canBatchEstimate', false)
            }, 5000)
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
      this.$service.estimateResult({ crowdId: crowdId }).then((data) => {
        this.total1 = data[0].total1 === null ? '暂无数据' : data[0].total1
        const { total1, total2, total3, totalUser } = data[0] || {}
        // const {totalUser} = data[0] || {}
        this.total1 = this.cc_format_number(total1) || '暂无数据'
        this.total2 = this.cc_format_number(total2) || '暂无数据'
        this.total3 = this.cc_format_number(total3) || '暂无数据'
        this.totalUser = this.cc_format_number(totalUser) || '暂无数据'
      })
    },
    // 从服务器读取数据
    loadData (sortParams, loadType) {
      this.$service.getListDimension({ type: 2 }).then(data => {
        if (data) {
          if (data.behaviorShow) {
            this.checkList = data.behaviorShow.split(',')
          }
        }
      })
      this.criteria.pageNum = this.currentPage
      this.criteria.pageSize = this.pageSize
      this.criteria.policyId = this.selectRow.policyId

      if (sortParams) {
        this.criteria = {
          ...this.criteria,
          ...sortParams
        }
      }
      this.$service.viewCrowd(this.criteria).then(data => {
        if (data.bypass === 1) {
          // 分流的人群
          const tableArr = []
          const apartArr = []
          const tableMerge = []
          if (data.bypassList) {
            data.bypassList.forEach(item => {
              tableMerge.push(item.crowdsList.length)
              item.crowdsList.forEach((crowdItem, index) => {
                if (index < item.crowdsList.length - 1) {
                  tableMerge.push(0)
                }
                tableArr.push({
                  bypassName: item.bypassName,
                  id: item.id,
                  ratio: item.ratio,
                  policyId: item.policyId,
                  ...crowdItem,
                  bypassId: item.bypassId
                })
              })
              apartArr.push(item.crowdsList.length)
            })
            this.initTableMerge = JSON.parse(JSON.stringify(tableMerge))
            this.tableMerge = tableMerge
            this.totalCount = apartArr.reduce((prev, cur) => {
              return prev + cur
            })
            this.tableData = tableArr
          }
        } else {
          this.tableData = data.pageInfo.list
          this.totalCount = data.pageInfo.total
          this.contrastCrowdTableData = data.dynamicCrowd // 动态人群对比人群表格数据
          this.$emit('getBigCrowdId', data.crowdId || undefined)
        }
        // console.log('this.tableData===', this.tableData[0].rulesJson)

        this.abStatusEnum = data.ABStatus
        this.launchStatusEnum = data.launchStatus
        this.crowdValidEnum = data.crowdValidEnum
        this.showByPassColumn = data.bypass === 1 // 是否分流
        // this.showByPassColumn = data.policy.smart
        // if (loadType !== 'sort') {
        //   this.initExpandCrowd = []
        //   if (this.tableData.length > 0) {
        //     this.initExpandCrowd.push(this.tableData[0].crowdId)
        //   }
        // }
        // 再插入一项
        // this.tableMerge[0] = this.tableMerge[0] + 1
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
    handleSearch () {
      this.criteria = this.searchForm
      this.loadData()
    },
    // 重置
    handleReset () {
      this.$refs.searchForm.resetFields()
      this.loadData()
    },
    // // 通用多线性参数设置
    // setLinesEchart (element, title, xData, yData, legend) {
    //   const _this = this
    //   const echarts = require('echarts')
    //   const myChart = echarts.init(this.$refs[element])
    //   myChart.setOption({
    //     title: {
    //       text: title
    //     },
    //     // tooltip: {
    //     //     trigger: 'axis'
    //     // },
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: function (a) {
    //         return _this.cc_format_number(a.data)
    //       }
    //     },
    //     legend: {
    //       data: legend
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: xData,
    //       axisLabel: {
    //         interval: 0,
    //         rotate: -45
    //       }
    //     },
    //     yAxis: {
    //       type: 'value',
    //       axisTick: {
    //         inside: true
    //       },
    //       scale: true,
    //       axisLabel: {
    //         margin: 2,
    //         formatter: function (value) {
    //           if (value >= 10000 && value < 10000000) {
    //             value = value / 10000 + '万'
    //           } else if (value >= 10000000) {
    //             value = value / 10000000 + '千万'
    //           } return value
    //         }
    //       }
    //     },
    //     series: yData
    //   })
    // },
    // 通用柱状图参数设置
    setBarEchart (element, title, xData, yData) {
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
        series: [{
          data: yData.length === 0 ? this.fillEmptyData.data : yData,
          type: 'bar',
          barWidth: 30
        }]
      })
    },
    // 圆饼图
    setCircleEcharts (element, title, legend, data, showDetail) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title,
          left: 'center'
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
            // center: ['50%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                label: {
                  show: showDetail,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: showDetail }
              },
              emphasis: {
                label: {
                  show: showDetail,
                  formatter: '{b}\n{c} ({d}%)',
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
    // setNestedCircleEcharts(element,title,legend,innerData,outData,showDetail){
    //     let echarts = require('echarts')
    //     let myChart = echarts.init(this.$refs[element])
    //     myChart.setOption({
    //         title: {
    //             text: title,
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'item',
    //             formatter: "{a} <br/>{b}: {c} ({d}%)"
    //         },
    //         legend: {
    //             orient: 'vertical',
    //             x: 'right',
    //             data: legend
    //         },
    //         series: [
    //
    //             {
    //                 name: '访问来源',
    //                 type: 'pie',
    //                 selectedMode: 'single',
    //                 radius: [0, '30%'],
    //
    //                 label: {
    //                     position: 'inner'
    //                 },
    //                 labelLine: {
    //                     show: false
    //                 },
    //                 // 里层所有数据
    //                 data: innerData
    //             },
    //             {
    //                 name: '',
    //                 type: 'pie',
    //                 radius: ['40%', '55%'],
    //                 label: {
    //                     formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
    //                     backgroundColor: '#eee',
    //                     borderColor: '#aaa',
    //                     borderWidth: 1,
    //                     borderRadius: 4,
    //                     // shadowBlur:3,
    //                     // shadowOffsetX: 2,
    //                     // shadowOffsetY: 2,
    //                     // shadowColor: '#999',
    //                     // padding: [0, 7],
    //                     rich: {
    //                         a: {
    //                             color: '#999',
    //                             lineHeight: 22,
    //                             align: 'center'
    //                         },
    //                         // abg: {
    //                         //     backgroundColor: '#333',
    //                         //     width: '100%',
    //                         //     align: 'right',
    //                         //     height: 22,
    //                         //     borderRadius: [4, 4, 0, 0]
    //                         // },
    //                         hr: {
    //                             borderColor: '#aaa',
    //                             width: '100%',
    //                             borderWidth: 0.5,
    //                             height: 0
    //                         },
    //                         b: {
    //                             fontSize: 16,
    //                             lineHeight: 33
    //                         },
    //                         per: {
    //                             color: '#eee',
    //                             backgroundColor: '#334455',
    //                             padding: [2, 4],
    //                             borderRadius: 2
    //                         }
    //                     }
    //                 },
    //                 data: (outData.length === 0) ? this.fillEmptyData.data : outData // 外层所有数据
    //             }
    //
    //         ]
    //     })
    // },
    // 中国地图
    setMapEcharts (element, title, data, minValue, maxValue) {
      const _this = this
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      // 中国地图
      myChart.setOption({
        title: {
          text: title,
          // subtext: '副标题',
          left: 'center'
        },
        // tooltip : {
        //     trigger: 'item',
        //     formatter: '{b}<br/>({c})'
        // },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            return a.data.name + ':' + _this.cc_format_number(a.data.value)
          }
        },
        visualMap: {
          min: minValue || 0,
          max: maxValue || 20000000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
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
            data: data
          }
        ]
      })
    },
    // 漏斗图
    setFunnelEcharts (element, title, legend, data) {
      const echarts = require('echarts')
      const myChart = echarts.init(this.$refs[element])
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: legend
        },
        calculable: true,
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            // x2: 80,
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
    handleCommandStastic (scope) {
      const type = scope[0]
      const row = scope[1]
      this.currentCid = row.crowdId
      switch (type) {
        // 统计投后效果
        case 'detail':
          if (row.dynamicFlag === 1) { // 动态人群
            this.showViewEffect = true
          } else {
            this.showCrowdDetailDialog()
          }
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
          this.handleSeeHomepageData(this.currentCid, row.crowdName)
          break
        case 'redirectCrowd':
          this.handleClickRedirectList(this.currentCid)
          break
        case 'appointment':
          this.showAppointmentDialog(this.currentCid)
          break
        case 'operationalAnalysis':
          this.goToOperationalAnalysis(this.currentCid)
          break
        case 'dynamicReport':
          // 动态实验报告
          this.goToDynamicCrowdReport(this.currentCid, row.crowdName, row.launchTime)
          break
        case 'nomalyMonitoring':
          // 流转异常监控
          this.goToNomalyMonitoring(this.currentCid, row.crowdName)
          break
        case 'shenCeAnalysis':
          this.handleShenCeAnalysis(row)
          break
      }
    },
    goToDynamicCrowdReport (crowdId, crowdName, launchTime) {
      this.$router.push({ path: '/dynamicReport', query: { crowdId, crowdName, launchTime } })
    },
    goToNomalyMonitoring (crowdId, crowdName) {
      this.$router.push({ path: '/dynamicReport', query: { crowdId, crowdName, error: true } })
    },
    goToOperationalAnalysis (crowdId) {
      this.$service.portraitParam({ crowdId }).then(res => {
        const url = res.url
        window.open(url)
        // this.showOperationalAnalysis = true
        // this.operationalAnalysisUrl = 'http://192.168.2.177/portraittest'
        // this.operationalAnalysisUrl = url

        // this.$nextTick(() => {
        //   this.iframeWin = this.$refs.myIframe.contentWindow
        //   // // 最开始做的是点击事件是没有问题的  后面需要自动传值就不行  也试了模拟点击还是不行
        //   // // 原因是iframe还没加载完  所以使用onload
        //   document.getElementById('myIframe').onload = function () {
        //     this.fatherpost(url)
        //   }
        // var iframe = document.querySelector('#myIframe')
        // this.populateIframe(iframe, [
        //   ['Authorization', 'Bearer ' + this.getToken()],
        //   ['Access-Control-Allow-Origin', '*']
        // ], url)
        // })
        // this.operationalAnalysisUrl = 'http://mgr-hoder.skysrt.com/#/keyIndicatorTrends'
        // this.operationalAnalysisUrl = 'http://192.168.2.177/analysis/userportrait?policyId=2861'
      })
    },
    // fatherpost (url) { // iframe传值
    //   this.iframeWin.postMessage({
    //     params: {
    //       // data: data// 传的数据
    //     }
    //   }, url)
    // },
    // getToken () {
    //   return 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2tleSI6ImEyNjU1OWUzLTM4NzMtNDlkOS04M2JhLTZmMzZhY2I5NTdhZCIsInVzZXJuYW1lIjoiYWRtaW4ifQ.pn8TCTTvXymw5YG9EzBpXaNSfMYZoEfCJH48bpKPriCzxFa8UtI6G7DqBoyn6bs7I3U4WZYzuoNvC6g_R7cZqA'
    // },
    populateIframe (iframe, headers, url) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://192.168.2.177/prod-api/auth/login')
      xhr.responseType = 'blob'
      headers.forEach((header) => {
        xhr.setRequestHeader(header[0], header[1])
      })
      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            iframe.src = URL.createObjectURL(xhr.response)
          }
        }
      }
      xhr.send()
      this.operationalAnalysisUrl = url
    },
    // 预约投后分析
    showAppointmentDialog (crowdId) {
      this.estimateId = crowdId
      this.showAppointment = true

      // 重置
      this.$refs.appointmentForm && this.$refs.appointmentForm.resetFields()
    },
    HandleAppointment () {
      this.$refs.appointmentForm.validate((valid) => {
        if (valid) {
          const params = {
            startPeriod: this.appointmentForm.value[0],
            endPeriod: this.appointmentForm.value[1],
            crowdId: this.estimateId
          }
          this.$service.sendEffectCommand(params).then(() => {
            this.$message.success('预约成功')
            this.showAppointment = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // // 显示投后效果弹窗
    showCrowdDetailDialog () {
      this.showStatistics = true
      // this.initTime()
      // this.drawCrowdPie(this.currentCid, this.time1[0], this.time1[1])
      // this.drawCrowdLine(this.currentCid, this.time0[0], this.time0[1])
      // this.drawExposePie(this.currentCid, this.time3[0], this.time3[1])
      // this.drawExposeLine(this.currentCid, this.time2[0], this.time2[1])
      // this.drawClickPie(this.currentCid, this.time5[0], this.time5[1])
      // this.drawClickLine(this.currentCid, this.time4[0], this.time4[1])
      // this.crowdLaunchDetail(this.currentCid, this.time6[0], this.time6[1])
      // this.setProvinceData(this.currentCid, this.time7[0], this.time7[1])
    },
    // // 统计投后效果---开始
    // drawCrowdPie (id, startTime, endTime) {
    //   this.$service.hitAndBiToTalPie({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     if (data.data.length === 0) { this.hitPieTitle = '累计命中次数按业务分布暂无数据' } else { this.hitPieTitle = '累计命中次数按业务分布' }
    //     this.setCircleEcharts('hitPie', '', data.name, data.data, true)
    //   })
    // },
    // drawCrowdLine (id, startTime, endTime) {
    //   this.$service.hitAndBiToTalLine({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     const legendData = data.series.map((key) => {
    //       return key.name
    //     })
    //     const linesData = data.series.map((key) => {
    //       return { name: key.name, data: key.data, type: 'line' }
    //     })
    //     this.hitLinesTitle = '该人群总命中量以及各业务的命中量'
    //     this.setLinesEchart('hitLine', '', data.date, linesData, legendData)
    //   })
    // },
    // drawExposePie (id, startTime, endTime) {
    //   this.$service.exposeCrowdTotalPie({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     if (data.data.length === 0) { this.exposePieTitle = '累计曝光数按业务分布暂无数据' } else { this.exposePieTitle = '累计曝光数按业务分布' }
    //     this.setCircleEcharts('exposePie', '', data.name, data.data, true)
    //   })
    // },
    // drawExposeLine (id, startTime, endTime) {
    //   this.$service.exposeCrowdTotalLine({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     const legendData = data.series.map((key) => {
    //       return key.name
    //     })
    //     const linesData = data.series.map((key) => {
    //       return { name: key.name, data: key.data, type: 'line' }
    //     })
    //     this.exposeLinesTitle = '该人群总曝光量以及各业务的曝光量'
    //     this.setLinesEchart('exposeLine', '', data.date, linesData, legendData)
    //   })
    // },
    // drawClickPie (id, startTime, endTime) {
    //   this.$service.clickCrowdTotalPie({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     if (data.data.length === 0) { this.clickPieTitle = '累计点击次数按业务分布暂无数据' } else { this.clickPieTitle = '累计点击次数按业务分布' }
    //     this.setCircleEcharts('clickPie', '', data.name, data.data, true)
    //   })
    // },
    // drawClickLine (id, startTime, endTime) {
    //   this.$service.clickCrowdTotalLine({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     const legendData = data.series.map((key) => {
    //       return key.name
    //     })
    //     const linesData = data.series.map((key) => {
    //       return { name: key.name, data: key.data, type: 'line' }
    //     })
    //     this.clickLinesTitle = '该人群总点击以及各业务的点击次数'
    //     this.setLinesEchart('clickLine', '', data.date, linesData, legendData)
    //   })
    // },
    // crowdLaunchDetail (id, startTime, endTime) {
    //   this.$service.crowdLanuchData({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     if (data.data.length === 0) { this.crowdLaunchTitle = '该人群投放数据漏斗基本详情暂无数据' } else { this.crowdLaunchTitle = '该人群投放数据漏斗基本详情' }
    //     this.setFunnelEcharts('crowdLaunch', '', data.names, data.data)
    //   })
    // },
    // setProvinceData (id, startTime, endTime) {
    //   this.$service.exposeProvinceScale({ cid: id, startTime: startTime, endTime: endTime }).then((data) => {
    //     const newData = data.map((item) => {
    //       return { name: item.name, value: parseFloat(item.value) }
    //     })
    //     this.exposeProvinceTitle = '曝光人群省份分布'
    //     this.setMapEcharts('exposeProvince', '', newData)
    //   })
    // },
    // 统计投后效果---结束
    // formatDate (d) {
    //   const time = new Date(d)
    //   const y = time.getFullYear() // 年份
    //   const m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
    //   const r = time.getDate().toString().padStart(2, '0') // 日子
    //   return `${y}-${m}-${r}`
    // },
    // setDataInMonth (startDate, endDate) {
    //   const startTime = new Date(startDate).getTime()
    //   const endTime = new Date(endDate).getTime()
    //   const oneMonth = 3600 * 1000 * 24 * 30
    //   return endTime - startTime <= oneMonth
    // },
    upDownCrowd (row) {
      this.showUpDownDialog = true
      this.upDownTips = row.putway === 1 ? '确定下架人群吗？下架后该人群将无法使用，不再命中、返回' : '确定上架人群吗？点击确认后，该人群将可以用'
      this.currentTag = row
    },
    handleUpDown () {
      const row = this.currentTag
      // 区分动态人群、普通提示语
      const tipMessage = this.smart ? '操作成功' : (row.putway === 1 ? '下架' : '上架') + '人群会影响该策略下人群估算数量，请点击"估算"重新估算其他人群的圈定数据'
      if (this.smart) {
        this.$service.putwayCrowd({ policyId: row.policyId, crowdId: row.crowdId, putway: row.putway === 1 ? 0 : 1 }, tipMessage)
          .then(() => {
            this.showUpDownDialog = false
            this.loadData()
          })
      } else {
        this.$service.crowdUpDown({ crowdId: row.crowdId, putway: row.putway === 1 ? 0 : 1 }, tipMessage)
          .then(() => {
            this.showUpDownDialog = false
            this.loadData()
          })
      }
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
      const policyIds = this.policyCopyForm.policyIds.join(',')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$service.crowdCopy({ crowdId: row.crowdId, policyIds }, '复制成功')
            .then(() => {
              this.handleCancelCopy('policyCopyForm')
              this.loadData()
            }).catch(err => {
              this.copyErrorMsg = err.message
            })
        } else {
          return false
        }
      })
    },
    handleCancelCopy (formName) {
      this.showCopyDialog = false
      this.$refs[formName].resetFields()
      this.copyErrorMsg = ''
    },
    handleCommandOpreate (scope) {
      const type = scope[0]
      const params = scope[1]
      switch (type) {
        case 'edit':
          if (params.abMainCrowd === 1) { // AB人群
            this.divideAB(params, 'editABTest')
          } else if (params.dynamicFlag === 1) { // 编辑动态人群
            this.handleDynamicTest(params, 'editDynamicCrowd')
          } else {
            // 编辑人群规则
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
          this.divideAB(params, 'addABTest')
          break
        case 'commitHistory':
          this.handleCommitHistory(params)
          break
      }
    },
    handleShenCeAnalysis (row, type) {
      this.currentCrowd = row

      // 发送 AB 子人群的神策分析
      if (type === 'AB') {
        const date = this.$moment(row.abStartTime).add(1, 'days') // 加一天
        this.currentCrowd.launchTime = date
      }

      this.shenCeForm.dateRange = [] // 清空

      this.shenCeForm.crowdId = row.crowdId
      // console.log('this.row------>', row)

      this.shenCeDialog = true
      // 重置表单
      this.$nextTick(() => {
        this.$refs.shenCeForm.resetFields()
        // 回显数据
        if (row.sensorStartTime && row.sensorEndTime) {
          this.shenCeForm.dateRange = [row.sensorStartTime, row.sensorEndTime]
        }
        this.shenCeForm.autoVersion = row.jobId > 0
      })
    },
    ConfirmShenCeAnalysis (row) {
      const parmas = {
        crowdId: this.shenCeForm.crowdId,
        startDate: this.shenCeForm.dateRange[0],
        endDate: this.shenCeForm.dateRange[1],
        autoVersion: this.shenCeForm.autoVersion
      }
      this.$service.sensorHitData(parmas).then(res => {
        console.log('res', res)
        // 同步修改列表中的数据
        this.tableData.forEach(item => {
          if (parmas.crowdId === item.crowdId) {
            item.sensorStartTime = parmas.startDate
            item.sensorEndTime = parmas.endDate
            item.jobId = parmas.autoVersion ? 1 : 0
          }
        })
        // 人群已经发送到神策平台，请前往神策继续分析
        if (res.result.indexOf('成功') > 0 || res.result.indexOf('已经发送') > 0) {
          this.$message.success(res.result)
        } else {
          this.$message.info(res.result)
        }
        this.shenCeDialog = false
      })
    },
    // 动态人群 - 小人群功能
    handleDynamicCommandOpreate (scope) {
      const type = scope[0]
      const params = scope[1]
      switch (type) {
        case 'edit':
          this.editDynamicCrowdName(params)
          break
        case 'del':
          this.delDynamicCrowd(params)
          break
        case 'upDown':
          this.upDownCrowd(params)
          break
        case 'copy':
          this.copyCrowd(params)
          break
        case 'divide':
          this.divideAB(params, 'addABTest')
          break
        case 'commitHistory':
          this.handleCommitHistory(params)
          break
      }
    },
    // 删除字段
    delDynamicCrowd (row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            policyId: row.policyId || '',
            crowdId: row.crowdId || ''
          }

          this.$service.delDynamicCrowd(params).then(() => {
            this.loadData()
          })
        }).catch(function () {

        })
    },
    // 编辑大人群
    handleBigDynamicCommandOpreate (scope) {
      const type = scope[0]
      const params = scope[1]
      switch (type) {
        case 'step1':
          this.handleDynamicCrowdStep1(params)
          break
        case 'step2':
          this.handleDynamicCrowdStep2(params)
          break
        case 'step3':
          this.handleDynamicCrowdStep3(params)
          break
      }
    },
    handleDynamicCrowdStep1 (row) {
      row.smart = true
      // row.crowdId = row.crowdPid
      const rowObj = {
        ...row,
        crowdId: row.crowdPid
      }
      this.$emit('addCrowd', rowObj)
    },
    handleDynamicCrowdStep2 (row) {
      // row.crowdId = row.crowdPid
      const rowObj = {
        ...row,
        crowdId: row.crowdPid
      }
      this.$emit('editDynamicPeopleSetting', rowObj)
    },
    handleDynamicCrowdStep3 (row) {
      // row.crowdId = row.crowdPid
      const rowObj = {
        ...row,
        crowdId: row.crowdPid
      }
      this.$emit('editDynamicPeopleConditions', rowObj)
    },
    // 打开编辑动态人群名称弹窗
    editDynamicCrowdName (params) {
      console.log('params===', params)
      this.dynamicCrowd = JSON.parse(JSON.stringify(params))
      this.showEditDynamicCrowdName = true
    },
    // 编辑动态人群名称
    handleEditDynamicCrowdName () {
      const params = {
        policyId: this.dynamicCrowd.policyId,
        crowdId: this.dynamicCrowd.crowdId,
        crowdName: this.dynamicCrowd.crowdName
      }
      this.$service.updateDynamicCrowdName(params, '编辑名称成功').then(res => {
        this.loadData()
        this.showEditDynamicCrowdName = false
      })
    },
    tableRowClassName ({ row }) {
      if (row.putway === 0) { return 'gray-row' }
    },
    // 人群画像估算---开始
    getCrowdBaseInfo () {
      // const crdId = this.currentCid
      // 性别，年龄，产品等级
      const typeEnum = ['portrait.family.sex', 'portrait.family.age.range', 'portrait.product.grade']
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
      this.$service.getCrowdCountMap({ params: { type: typeEnum[2] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('circleDevice', '产品等级分布', names, values, true)
      })
    },
    getCrowdProvinceInfo () {
      // const crdId = this.currentCid
      // 省份、城市活跃度
      const typeEnum = ['portrait.province', 'portrait.cities.rank']
      this.$service.getCrowdCountMap({ params: { type: typeEnum[0] }, crowdId: this.currentCid }).then(data => {
        const [names, nameWithValues, values, length] = [[], [], [], data.dataList.length]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push(parseInt(item.value))
          nameWithValues.push({ value: parseInt(item.value), name: item.name })
        })
        const bubbleArr = this.bubbleSort(values)
        const max = bubbleArr[length - 1]
        const min = bubbleArr[0]
        this.setMapEcharts('provinceMap', '省份分布', nameWithValues, min, max)
      })
      this.$service.getCrowdCountMap({ params: { type: typeEnum[1] }, crowdId: this.currentCid }).then(data => {
        this.cityData = data.dataList
      })
    },
    getTopActiveRank () {
      const typeEnum = ['portrait.top50.active.city']
      this.$service.getCrowdCountMap({ params: { type: typeEnum[0], orderBy: 'value', sortOrder: 'desc' }, crowdId: this.currentCid }).then(data => {
        const arr = data.dataList
        let sum = 0
        arr.forEach(item => {
          sum += parseInt(item.value)
        })
        this.table.data = arr.reduce((result, item) => {
          return result.concat({ name: item.name, value: parseInt(item.value), PCT: ((parseInt(item.value) / sum) * 100).toFixed(2) + '%' })
        }, [])
      })
    },
    getMemberBenefits () {
      this.$service.getEstimatedTvEnumData().then(data => {
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
      const arr = []
      for (const i in obj) {
        arr.push({ value: i, label: obj[i] })
      }
      return arr
    },
    getUserType () {
      // 正常用户类型
      const typeWithSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.member',
        sjyVIP: 'portrait.user.category.education.super.vip.member',
        djPlatform: 'portrait.user.category.premier.theater.member',
        cjyVIP: 'portrait.user.category.education.kids.vip.member',
        aqy: 'portrait.user.category.iqiyi.member',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.member',
        fkGarden: 'portrait.user.category.4k.garden.member',
        phyVIP: 'portrait.user.category.sports.vip.member',
        tencent: 'portrait.user.category.tencent.movie.member',
        kmVIP: 'portrait.user.category.cool.meow.vip.member'
      }
      // 非会员
      const typeWithNoVipSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.nonmember',
        sjyVIP: 'portrait.user.category.education.super.vip.nonmember',
        djPlatform: 'portrait.user.category.premier.theater.nonmember',
        cjyVIP: 'portrait.user.category.education.kids.vip.nonmember',
        aqy: 'portrait.user.category.iqiyi.nonmember',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.nonmember',
        fkGarden: 'portrait.user.category.4k.garden.nonmember',
        phyVIP: 'portrait.user.category.sports.vip.nonmember',
        tencent: 'portrait.user.category.tencent.movie.nonmember',
        kmVIP: 'portrait.user.category.cool.meow.vip.nonmember'
      }
      // 有效期会员
      const typeWithVipSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.validdate.member',
        sjyVIP: 'portrait.user.category.education.super.vip.validdate.member',
        djPlatform: 'portrait.user.category.premier.theater.validdate.member',
        cjyVIP: 'portrait.user.category.education.kids.vip.validdate.member',
        aqy: 'portrait.user.category.iqiyi.validdate.member',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.validdate.member',
        fkGarden: 'portrait.user.category.4k.garden.validdate.member',
        phyVIP: 'portrait.user.category.sports.vip.validdate.member',
        tencent: 'portrait.user.category.tencent.movie.validdate.member',
        kmVIP: 'portrait.user.category.cool.meow.vip.validdate.member'
      }
      // 已过期会员
      const typeWithVipNoValidSelectEnum = {
        jyVIP: 'portrait.user.category.education.vip.expireddate.member',
        sjyVIP: 'portrait.user.category.education.super.vip.expireddate.member',
        djPlatform: 'portrait.user.category.premier.theater.expireddate.member',
        cjyVIP: 'portrait.user.category.education.kids.vip.expireddate.member',
        aqy: 'portrait.user.category.iqiyi.expireddate.member',
        multAqy: 'portrait.user.category.mixed.source.iqiyi.expireddate.member',
        fkGarden: 'portrait.user.category.4k.garden.expireddate.member',
        phyVIP: 'portrait.user.category.sports.vip.expireddate.member',
        tencent: 'portrait.user.category.tencent.movie.expireddate.member',
        kmVIP: 'portrait.user.category.cool.meow.vip.expireddate.member'
      }
      this.$service.getCrowdCountMap({ params: { type: typeWithSelectEnum[this.memberListType] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('member', '会员用户的分布情况', names, values, true)
      })
      this.$service.getCrowdCountMap({ params: { type: typeWithNoVipSelectEnum[this.memberListType] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        // var dataCount = 0
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
          // dataCount += parseInt(item.value)
        })
        this.setCircleEcharts('memberMainPageActiveTime', '从未是会员-按主页激活时间', names, values, false)
      })
      this.$service.getCrowdCountMap({ params: { type: typeWithVipSelectEnum[this.memberListType] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        // var dataCount = 0
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
          // dataCount += parseInt(item.value)
        })
        this.setCircleEcharts('memberActiveTime', '会员-按会员有效期时长', names, values, false)
      })
      this.$service.getCrowdCountMap({ params: { type: typeWithVipNoValidSelectEnum[this.memberListType] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        // var dataCount = 0
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
          // dataCount += parseInt(item.value)
        })
        this.setCircleEcharts('memberExpirationTime', '过期会员-按会员过期时长', names, values, false)
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
    getPayDetail () {
      const typeWithSelectEnum = {
        jyVIP: 'portrait.last.payment.education.vip',
        sjyVIP: 'portrait.last.payment.education.super.vip',
        djPlatform: 'portrait.last.payment.premier.theater',
        cjyVIP: 'portrait.last.payment.education.kids.vip',
        aqy: 'portrait.last.payment.iqiyi',
        multAqy: 'portrait.last.payment.mixed.source.iqiyi',
        fkGarden: 'portrait.last.payment.4k.garden',
        phyVIP: 'portrait.last.payment.sports.vip',
        tencent: 'portrait.last.payment.tencent.movie',
        kmVIP: 'portrait.last.payment.cool.meow.vip'
      }
      this.$service.getCrowdCountMap({ params: { type: typeWithSelectEnum[this.memberListByPay] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('payDetail', '上次付费的会员产品包情况', names, values, true)
      })
    },
    getWatchBehavior () {
      const typeEnum = ['portrait.user.viewing.preferences', 'portrait.broadcast.rate.within.seven.days', 'portrait.broadcast.rate.within.thirty.days']
      this.$service.getCrowdCountMap({ params: { type: typeEnum[0] }, crowdId: this.currentCid }).then(data => {
        const [names, values] = [[], []]
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setCircleEcharts('watchPrefer', '观影偏好', names, values)
      })
      if (this.expirationDay === '7') {
        this.$service.getCrowdCountMap({ params: { type: typeEnum[1] }, crowdId: this.currentCid }).then(data => {
          const [names, values] = [[], []]
          data.dataList.forEach(item => {
            names.push(item.name)
            values.push({ value: item.value, name: item.name })
          })
          this.setCircleEcharts('userBehavior', '', names, values)
        })
      } else {
        this.$service.getCrowdCountMap({ params: { type: typeEnum[2] }, crowdId: this.currentCid }).then(data => {
          const [names, values] = [[], []]
          data.dataList.forEach(item => {
            names.push(item.name)
            values.push({ value: item.value, name: item.name })
          })
          this.setCircleEcharts('userBehavior', '', names, values)
        })
      }
    },
    getActiveBehavior () {
      const typeEnum = ['portrait.active.device.amount.yesterday']
      const [names, values] = [[], []]
      this.$service.getCrowdCountMap({ params: { type: typeEnum[0] }, crowdId: this.currentCid }).then(data => {
        data.dataList.forEach(item => {
          names.push(item.name)
          values.push({ value: item.value, name: item.name })
        })
        this.setBarEchart('activeBehavior', '圈定人群的设备活跃人数/主页活跃人数/起播活跃人数（前一日的值)', names, values)
      })
    },

    // 获取实验组列表
    showDynamicList (crowdId) {
      this.$service.getDynamic2PlanList({ crowdId }).then(res => {
        // this.dynamic2GroupList = res || []
        this.dynamic2GroupListTable.data = res || []
        this.showDynamicListDetail = true
      })
    },

    // 人群画像估算---结束
    // 显示划分详情
    showDivideResult (crowdId) {
      // 重置
      this.DivideTableData = [] // AB人群列表
      this.subdividePeopleList = [] // 再分割人群列表

      // 查询AB人群
      this.$service.getAbChilds(crowdId).then(data => {
        this.showDivideDetail = true
        this.DivideTableData = data
      })

      // 查询再分割人群
      this.independentParams.crowdId = crowdId

      this.$service.searchIndependentAnalysisByCrowdId(this.independentParams).then(data => {
        this.showDivideDetail = true
        this.subdividePeopleList = data ? data.pageInfo.list : []
        this.independentTotal = data ? data.pageInfo.total : 0
        this.independentLaunchStatusEnum = data ? data.launchStatusEnum : {}
      })
    },
    // 提交历史数据
    handleCommitHistory (row) {
      this.setShowCommitHistoryDialog = true
      this.currentCrowdId = row.crowdId
    },
    handleSubmitHistory (formData) {
      const submitForm = {
        isSubmit: formData.isSubmit,
        crowdId: formData.id,
        dateNum: formData.dateNum
      }
      this.$service.submitPolicyHistoryData(submitForm, formData.isSubmit === 1 ? '提交历史数据成功' : '关闭提交成功').then(() => {
        this.setShowCommitHistoryDialog = false
      })
    },
    // 查看主页数据
    handleSeeHomepageData (crowdId, crowdName) {
      this.showDivideDetail = false
      this.$appState.$set('homepageReleaseCrowdName', crowdName)
      this.$router.push({ name: 'homepageReleaseRecord', params: { homepageReleaseRecordId: crowdId, crowdName: crowdName } })
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
    // //  导出投后效果数据
    // handleLaunchedExport () {
    //   this.launchedExportUrl =
    //           '/api/crowdAndPolicyStatistics/export/' + this.currentCid +
    //           '?sHitLineTime=' + this.time0[0] + '&eHitLineTime=' + this.time0[1] +
    //           '&sHitPieTime=' + this.time1[0] + '&eHitPieTime=' + this.time1[1] +
    //           '&sExposeLineTime=' + this.time2[0] + '&eExposeLineTime=' + this.time2[1] +
    //           '&sExposePieTime=' + this.time3[0] + '&eExposePieTime=' + this.time3[1] +
    //           '&sClickLineTime=' + this.time4[0] + '&eClickLineTime=' + this.time4[1] +
    //           '&sClickPieTime=' + this.time5[0] + '&eClickPieTime=' + this.time5[1] +
    //           '&sFunnelTime=' + this.time6[0] + '&eFunnelTime=' + this.time6[1] +
    //           '&sProvinceTime=' + this.time7[0] + '&eProvinceTime=' + this.time7[1]
    //   this.$nextTick(() => {
    //     this.$refs.launchedDownLoad.click()
    //   })
    // },
    unActiveTips (activeType) {
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
        path: '/redirectAdd?policyId=' + this.selectRow.policyId
      })
    },
    handleClickRedirectWithId (crowd) {
      this.$router.push({
        path: '/redirectAdd?policyId=' + this.selectRow.policyId + '&crowdId=' + crowd.crowdId + '&crowdName=' + crowd.crowdName
      })
    },
    handleClickRedirectList (crowdId) {
      this.$router.push({
        params: { redirectListId: crowdId },
        name: 'redirectAdd'
      })
    },
    bubbleSort (arr) {
      // 冒泡排序
      const len = arr.length
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j + 1]
            arr[j + 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      return arr
    },
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 2, behaviorShow: val.join(',') })
    },
    handleByPass () {
      this.handleGetEditDetail()
      this.handleGetBypassCrowdList()
    },
    handleBypassApartChange () {
      const aparts = this.byPassForm.apart
      const bypassList = this.byPassForm.bypass
      const addLength = aparts - bypassList.length
      if (addLength > 0) {
        for (let i = 0; i < addLength; i++) {
          this.byPassForm.bypass.push({ name: '分组' + ((bypassList.length || 0) + 1), ratio: 0, crowds: [] })
        }
      } else {
        this.byPassForm.bypass.splice(bypassList.length + addLength, -addLength)
      }
    },
    handleGetEditDetail () {
      this.$service.getBypassCrowdDetail({ policyId: this.selectRow.policyId }).then(data => {
        if (data.bypassList.length === 0) {
          // 没有找到分流的信息，走新增保存接口
          this.bypassSaveFlag = 'add'
          // 分组初始化为1,2,3,4,5
          this.ratioEnum = this.genInitApart()
          this.byPassForm = this.genBypassForm()
          this.handleBypassApartChange()
        } else {
          //    有分流的信息，走编辑保存接口
          this.bypassSaveFlag = 'edit'
          this.byPassForm.apart = data.size
          this.byPassForm.bypass = data.bypassList.map(item => {
            return {
              name: item.bypassName,
              ratio: item.ratio,
              id: item.id,
              bypassId: item.bypassId,
              crowds: item.crowdsList,
              policyId: item.policyId,
              crowdSelect: ''
            }
          })
          // 分组只能选择比当前分组大的
          this.ratioEnum = this.ratioEnum.filter(item => {
            return item.value >= data.size
          })
        }
      })
    },
    handleCancelBypass () {
      this.showBypassDialog = false
      this.byPassForm = this.genBypassForm()
      this.showBypassStep = 1
    },
    handleSaveBypass () {
      // 校验 每一个分组是否都填写
      // 校验 份数是否小于等于100%
      const byPassDetail = JSON.parse(JSON.stringify(this.byPassForm.bypass))
      const bypassLength = byPassDetail.length
      const apiData = []
      let ratioTotal = 0
      if (bypassLength === 0) {
        this.$message.error('请选择人群填写分流信息！')
        return
      }
      for (let i = 0; i < bypassLength; i++) {
        const eachPartLength = byPassDetail[i].crowds.length
        if (eachPartLength === 0) {
          // 校验是否填写了分流人群
          this.$message.error('请在第' + (i + 1) + '块勾选需要分流的人群！')
          return
        } else {
          // 判断人群分流的每组优先级是否存在相同
          for (let j = 0; j < eachPartLength - 1; j++) {
            for (let n = j + 1; n < eachPartLength; n++) {
              if (byPassDetail[i].crowds[j].priority === byPassDetail[i].crowds[n].priority) {
                this.$message.error('第' + (i + 1) + '分组里人群第' + (j + 1) + '和' + (n + 1) + '人群优先级有重复，请修改之后再保存！')
                return
              }
            }
          }
          ratioTotal += byPassDetail[i].ratio
          if (this.bypassSaveFlag === 'add') {
            apiData.push({ name: byPassDetail[i].name, ratio: parseInt(byPassDetail[i].ratio), crowds: byPassDetail[i].crowds })
          } else {
            apiData.push({
              bypassId: byPassDetail[i].bypassId,
              id: byPassDetail[i].id,
              policyId: byPassDetail[i].policyId,
              name: byPassDetail[i].name,
              ratio: parseInt(byPassDetail[i].ratio),
              crowds: byPassDetail[i].crowds.map(crowdItem => {
                return { crowdId: crowdItem.crowdId, crowdName: crowdItem.crowdName, priority: crowdItem.priority }
              })
            })
          }
        }
      }
      if (ratioTotal > 100 || ratioTotal < 0) {
        this.$message.error('分流总比例不得大于100%或者小于0')
        return
      }
      // 新增接口数据格式
      // bypass:[{name: '一组',ratio: 30,crowds: [{crowdId: 123,crowdName: '123name',priority: 1}]}]

      // 编辑保存接口数据格式
      // bypass:[{id: 123,name: '一组',ratio: 30,policyId: 123,bypassId: 1,crowds: [{crowdId: 123,crowdName: '123name',priority: 1}]}]
      if (this.bypassSaveFlag === 'edit') {
        // 编辑保存
        this.$service.saveBypassCrowdEdit({ data: { bypass: apiData }, params: { policyId: this.selectRow.policyId } }, '分流编辑保存成功！').then(() => {
          this.showBypassDialog = false
          this.loadData()
        })
      } else {
        // 新增保存
        this.$service.saveBypassCrowdAdd({ data: { bypass: apiData }, params: { policyId: this.selectRow.policyId } }, '分流新增保存成功！').then(() => {
          this.showBypassDialog = false
          this.loadData()
        })
      }
    },
    handleGetBypassCrowdList () {
      this.$service.getBypassCrowdList({ policyId: this.selectRow.policyId }).then(data => {
        this.selectList = data
        // 如果可选的人群数小于2，则不显示分流按钮
        if (this.selectList.length < 1) {
          this.$message.error('只有当前人群数量大于0才能分流！')
          return
        }
        this.showBypassDialog = true
      })
    },
    handleCrowdSelectChange (item) {
      const currentCrowds = item.crowds.map(item => { return item.crowdId }).join(',')
      if (currentCrowds.indexOf(item.crowdSelect) > -1) {

      } else {
        const filterCrowd = this.selectList.filter(crowdItem => { return crowdItem.crowdId === item.crowdSelect })
        item.crowds.push({ crowdId: filterCrowd[0].crowdId, crowdName: filterCrowd[0].crowdName, priority: item.crowds.length + 1 })
      }
    },
    handleRemoveCrowds (tableItem, crowdId) {
      const idMap = tableItem.crowds.map(item => {
        return item.crowdId
      })
      const index = idMap.indexOf(crowdId)
      tableItem.crowds.splice(index, 1)
      if (tableItem.crowds.length === 0) {
        tableItem.crowdSelect = ''
      }
    },
    handleNextBypass () {
      this.showBypassStep = 2
    },
    handleExpandChange (row, expandedRows) {
      // 获取当前展开行的 crowdId
      this.initExpandCrowd = expandedRows.map(item => {
        return item.crowdId
      })

      if (this.showByPassColumn) {
        const currentCrowds = expandedRows.map(item => {
          return item.crowdId
        })
        let currentIndex = 0
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].crowdId === row.crowdId) {
            currentIndex = i
            break
          }
        }
        // 递归找到父类的expandIndex
        let lengthTotal = 0
        const testIndex = (current, i, arr) => {
          lengthTotal += arr[i]
          if (current >= i && current < lengthTotal) {
            return i
          } else {
            i = i + arr[i]
            return testIndex(current, i, arr)
          }
        }
        const parentExpandIndex = testIndex(currentIndex, 0, this.initTableMerge)
        if (currentCrowds.indexOf(row.crowdId) > -1) {
          // 当包含当前列，则是展开
          // tableMerge[I] >= 1则表示只有一行，只用把当前的tableMerge + 1
          // 如果tableMerge = 0,则表示当前的要等于2，并且它前面合并集要+1
          // 合并行的头
          if (this.initTableMerge[currentIndex] !== 0) {
            // 属于合并行
            this.tableMerge[currentIndex] = this.tableMerge[currentIndex] + 1
          }
          if (currentIndex !== parentExpandIndex) {
            this.tableMerge[parentExpandIndex] = this.tableMerge[parentExpandIndex] + 1
          }
          // this.tableMerge[currentIndex] = this.tableMerge[currentIndex] + 2
          // if (currentIndex > 0) {
          //     this.tableMerge[currentIndex-1] = this.tableMerge[currentIndex-1] + 1
          // }
        } else {
          // 关闭当前展开行
          if (this.initTableMerge[currentIndex] !== 0) {
            // 属于合并行
            this.tableMerge[currentIndex] = this.tableMerge[currentIndex] - 1
          }
          if (currentIndex !== parentExpandIndex) {
            this.tableMerge[parentExpandIndex] = this.tableMerge[parentExpandIndex] - 1
          }
        }
      }
    },
    objectSpanMethod ({ rowIndex, columnIndex }) {
      if (this.showByPassColumn) {
        if (columnIndex === 0) {
          const row1 = this.tableMerge[rowIndex]
          const col1 = row1 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
          return {
            rowspan: row1,
            colspan: col1
          }
        }
      }
    },
    smartObjectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      const titleName = column.label // 表头标题
      // if (columnIndex === 8 || columnIndex === 5) {
      if (titleName === '流量占比' || titleName === '编辑') {
        if (rowIndex === 0) {
          return {
            rowspan: 100,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleEditBypass () {
      this.handleByPass()
      this.showBypassStep = 2
    },
    handleDeleteBypass (row) {
      this.$service.delBypassCrowd({ pid: row.id }, '删除分流成功！').then(() => {
        this.loadData()
      })
    },
    handleSeeConfigBypass (id) {
      this.$service.seeDevFile({ policyId: id }).then((data) => {
        this.showConfiguration = true
        this.configTextarea = data.content
      })
        .catch(() => {
          // this.showConfiguration = true
          // this.configTextarea = '该策略没有配置文件'
        })
    },
    // 改变策略复制错误文案清空
    policyCopySelChange (val) {
      this.copyErrorMsg = ''
    }
  }
}
