<template>
  <div class="form-class" id="step2">
    <!-- <div class="column_diagram">
      <button class="column_fell_screen" @click="fullScreen()">全屏显示</button>
      <button class="column_fell_screen1" @click="fullExit()">退出全屏</button>
    </div> -->

      <!-- <div style="color: red"> -->
        <!-- 第4步
        :policyId:: {{ policyId }}<br/>
        <hr>
        :crowdId:: {{ crowdId }}<br/>
        <hr> -->
        <!-- 当前图表的数据:<br/> {{ currentGraphData }}<br/>
        <hr>
        所有分组的全部数据: <br/>{{ allGroupList }}<br/>
        <hr> -->
        <!-- 当前选中的分组数据: <br/>{{ currentGroup }}<br/> -->
        <!-- <hr> -->
        <!-- groupCheckIndex::{{groupCheckIndex}} -->
      <!-- </div> -->
      <div class="top">
      <!-- <div> -->
        <el-tabs
          v-if="allGroupList.length > 0"
          v-model="groupCheckIndex"
          type="card"
          closable
          @tab-remove="removeTab"
          style="width: calc(100% - 112px)"
        >
          <el-tab-pane
            v-for="(group, index) in allGroupList"
            :key="group.id"
            :label="group.name"
            :name="String(index)">
          </el-tab-pane>
        </el-tabs>
          <!-- <span class="title">实验分组</span> -->
        <el-button
          style="position: absolute; right: 0; top: 17px"
          type="success"
          icon="el-icon-plus"
          class="addGroupBtn"
          @click="addGroup">
          添加分组
        </el-button>

          <!-- <el-button type="info" @click="graph && graph.destroy(); $emit('goBackCrowdListPage')">返回</el-button> -->
          <!-- <el-button type="info" @click="handleBackPrevStep">下一步</el-button> -->
        <!-- <div>
          <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
          <el-button type="primary" @click="handleSave">下一步</el-button>
        </div> -->

          <!-- 分组列表 -->
          <!-- @tab-click="handleClick" -->

      </div>

      <div v-if="allGroupList.length > 0">
        <div style="position: absolute; top: 102px; z-index: 999;">
          <!-- radioType 1-循环 不显示入口箭头 -->
          <span v-if="radioType !== 1" class="inputArrow"></span>
          <!-- <el-button type="text">文字按钮</el-button> -->
          <!-- {{radioType === 3}} -->
          <!-- radioType 3-自定义 选择定向或随机 -->
          <template v-if="radioType === 3">
            <el-button type="text" @click="handleChangeBigArithmetic" style="display: inline-block; vertical-align: 23px;">
              {{ condition[this.bigArithmetic] }}
              <!-- {{ this.bigArithmetic }} -->
            </el-button>

            <!-- bigArithmetic - 1定向 2随机 3 终止 -->
            <el-select
              v-if="Number(this.bigArithmetic) == 1"
              v-model="currentGroup.exitCrowd"
              placeholder="请选择"
              style="width: 100px; display: inline-block; vertical-align: 23px; margin-left: 10px;"
            >
              <el-option
                v-for="item in crowdOptions"
                :key="item.crowdId"
                :label="item.crowdName"
                :value="item.crowdId">
              </el-option>
            </el-select>
            <!-- <el-dropdown
              v-if="Number(this.bigArithmetic) == 1"
              @command="handleCommand"
              style="width: 100px; display: inline-block; vertical-align: 23px;">
              <span class="el-dropdown-link">
                请选择<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in crowdOptions"
                  :command="item.crowdId"
                  :key="item.crowdId"
                  >
                  {{item.crowdName}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>

        </div>
        <!-- options: [{
          value: 0,
          label: '顺序'
        }, {
          value: 1,
          label: '循环'
        }, {
          value: 2,
          label: '随机'
        }, {
          value: 3,
          label: '自定义'
        }, {
          value: 4,
          label: '不流转'
        }, {
          value: 5,
          label: '智能'
        }], -->
        <div class="circulationModeName">
          <span v-if="radioType === 4">不流转</span>
          <span v-else>{{ getCirculationMode(radioType) }}流转</span>
          <el-tooltip class="item" effect="dark" content="分组占比" placement="top-start">
            <div class="flowNum"><el-input v-model="currentGroup.flowNum" placeholder="占比" ></el-input><span style="margin-left: 8px">%</span></div>
          </el-tooltip>
          <span v-if="radioType === 5" class="openLoopStyle">
            开启循环
            <el-switch
              v-model="currentGroup.openLoop"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </span>
        </div>
        <!-- --------{{currentGroup}} -->
        <div v-if="radioType === 6" class="aaa">
          <el-button type="primary" size="large" @click="$router.push({ name: 'storyLine', params: { sceneId: currentGroup.sceneId } })">配置故事运营</el-button>
        </div>
        <div style="position: relative" v-else>
          <!-- 拓扑图 -->
          <!-- currentGraphData: 当前图表的数据 -->
          <antv-graph v-if="currentGraphData.allCrowd && currentGraphData.allCrowd.length > 0" :type="radioType" :currentGraphData="currentGraphData"></antv-graph>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无分组，请添加"></el-empty>
      </div>

      <el-dialog title="新建分组" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="800px">
        <!-- {{form}} -->
        <el-form ref="groupForm" :model="form" :rules="rules" :label-width="formLabelWidth" class="addGroupForm">

          <el-form-item label="流转方式：" required>
            <el-col :span="14">
              <el-form-item prop="mainArithmetic">
                <el-tooltip class="item" effect="dark" content="分组算法" placement="top-start">
                  <el-select v-model="form.mainArithmetic" clearable placeholder="请选择" style="width: 200px;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="分组名称：" required>
            <el-col :span="5" >
              <el-form-item prop="name">
                <el-input v-model="form.name" clearable autocomplete="off" ></el-input>
              </el-form-item>
            </el-col>

          </el-form-item>
          <!-- <el-form-item label="分组算法：" required>
            <el-select v-model="form.mainArithmetic" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="选择方案：" required style="margin-bottom: 36px">
            <!-- 可拖拽穿梭框 -->
            <!-- 重新打开弹窗时，重置重新挂载穿梭框 -->
              <template v-if="form.mainArithmetic === 4">
                <el-select v-model="form.cid" placeholder="请选择方案">
                  <el-option
                    v-for="item in smallCrowdList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                    {{ item.id }} - {{ item.label }}
                  </el-option>
                </el-select>
              </template>
              <template v-else>
                <DragSortMultiSelect v-if="dialogFormVisible" v-model="form.cid" :data="smallCrowdList"></DragSortMultiSelect>
              </template>
          </el-form-item>
          <el-form-item label="分组占比：" required prop="flowNum">
            <el-input v-model="form.flowNum" clearable autocomplete="off" style="margin: 0 10px 0 0"></el-input>%
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSaveGroup">确 定</el-button>
        </div>
      </el-dialog>
  </div>

</template>

<script>
import antvGraph from '@antvGraph/Index.vue'
import eventBus from '@antvGraph/utils/eventBus'
import DragSortMultiSelect from './DragSortMultiSelect'
import CreateNodesAndEdges from '@/components/antvGraph/src/createNodesAndEdges'

export default {
  components: {
    antvGraph,
    DragSortMultiSelect
  },
  props: ['policyId', 'crowdId'],
  inject: ['crowdIndexThis'],
  data () {
    return {
      initDynamicGroupId: this.crowdIndexThis.dynamicGroupId,
      groupCheckIndex: undefined,
      radioType: 0,
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      },
      tags: [],
      rulesJson: {
        condition: 'OR',
        rules: []
      },
      i: 0,
      showGraph: true,
      currentGraphData: { // 当前图表的数据
        flowChart: null,
        allCrowd: []
      },
      graph: undefined,
      condition: {
        1: '定向',
        2: '随机',
        3: '终止'
      },
      bigArithmetic: '',
      exitCrowd: '',
      crowdOptions: [],
      dialogFormVisible: false,
      // data: generateData(),
      form: {
        name: '',
        policyId: this.policyId,
        crowdId: this.crowdId,
        mainArithmetic: '',
        cid: [],
        flowNum: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ],
        mainArithmetic: [
          { required: true, message: '请选择流转算法', trigger: 'change' }
        ],
        cid: [
          { required: true, message: '请至少选择一个方案', trigger: 'change' }
        ],
        flowNum: [
          { required: true, message: '请输入分组占比', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      options: [
        {
          value: 6,
          label: '故事线'
        }, {
          value: 0,
          label: '顺序'
        }, {
          value: 1,
          label: '循环'
        }, {
          value: 2,
          label: '随机'
        }, {
          value: 3,
          label: '自定义'
        }, {
          value: 4,
          label: '不流转'
        }, {
          value: 5,
          label: '智能'
        }],
      smallCrowdList: [], // 小人群列表
      allGroupList: [], // 所有分组的全部数据
      currentGroup: {}, // 当前选中的分组数据
      commonObj: {
        size: [
          150,
          40
        ],
        type: 'node',
        shape: 'customNode',
        color: '#1890ff'
      }
    }
  },
  watch: {
    // radioType: {
    //   handler () {
    //     // 修改流转算法 type 时，重新获取最新的拓扑图数据
    //     this.$service.getDynamicRule({ crowdId: this.crowdId }).then(res => {
    //       this.dynamicRule = res || {}
    //     })
    //   }
    // }
    'form.mainArithmetic' (val, oldV) {
      if (val === 4) {
        this.form.cid = ''
      } else if (oldV === 4) {
        this.form.cid = []
      }
    },
    // allGroupList: {
    //   handler (val) {
    //   },
    //   deep: true
    // },
    groupCheckIndex: {
      handler (val, oldV) {
        if (this.allGroupList.length > 0) {
          // 获取当前图表的graph数据，并保存
          const currentGroupChartJson = this.getChartJson()
          if (currentGroupChartJson && this.allGroupList[oldV]) {
            this.allGroupList[oldV].flowChart = currentGroupChartJson || null
          }

          // 设置分组中小人群数据、图表数据
          this.setGroupData(val)
        }
      },
      immediate: true
    }
  },
  computed: {
    height () {
      return document.documentElement.clientHeight - 225
    }
  },
  created () {
    // if (this.crowdId) {
    this.bindEvent()
    this.getDynamic2CrowdList() // 获取小人群列表
    this.getDynamic2PlanList() // 获取实验组列表
    // this.getRule()
    // }
  },
  beforeDestroy () {
    // console.log('this.graph===>', this.graph)
    // this.graph && this.graph.destroyed()
    // alert('beforeDestroy')
    if (this.graph) {
      this.graph = null
    }
    eventBus.$off()
  },
  methods: {
    fullScreen () {
      // const element = document.documentElement // 若要全屏页面中div，var element= document.getElementById("divID");
      const element = document.getElementById('step2') // 若要全屏页面中div，var element= document.getElementById("divID");

      // IE 10及以下ActiveXObject
      if (window.ActiveXObject) {
        const WsShell = new ActiveXObject('WScript.Shell')
        WsShell.SendKeys('{F11}')
      } else if (element.requestFullScreen) {
        // HTML W3C 提议
        element.requestFullScreen()
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        // Webkit (works in Safari5.1 and Chrome 15)
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        // Firefox (works in nightly)
        element.mozRequestFullScreen()
      }
    },

    // 退出全屏
    fullExit () {
      const element = document.documentElement // 若要全屏页面中div，var element= document.getElementById("divID");
      // IE ActiveXObject
      if (window.ActiveXObject) {
        const WsShell = new ActiveXObject('WScript.Shell')
        WsShell.SendKeys('{F11}')
      } else if (element.requestFullScreen) {
        // HTML5 W3C 提议
        document.exitFullscreen()
      } else if (element.msRequestFullscreen) {
        // IE 11
        document.msExitFullscreen()
      } else if (element.webkitRequestFullScreen) {
        // Webkit (works in Safari5.1 and Chrome 15)
        document.webkitCancelFullScreen()
      } else if (element.mozRequestFullScreen) {
        // Firefox (works in nightly)
        document.mozCancelFullScreen()
      }
    },

    getCirculationMode (type) {
      const obj = this.options.find(item => item.value === type)
      return obj.label
    },
    // 设置分组中小人群数据、图表数据
    setGroupData (val) {
      this.currentGroup = this.allGroupList[val]
      const currentGroup = this.currentGroup

      const cid = currentGroup.cid // 方案id 'id1, id2'
      this.radioType = currentGroup.mainArithmetic // 流转算法
      this.bigArithmetic = currentGroup.arithmetic || 2 // 大的出口条件， 默认【随机】

      const params = {
        crowdId: this.crowdId, // 大人群ID    不能为空
        child: cid
      }
      // 获取人群中的方案
      this.$service.getDynamic2CrowdList(params).then(res => {
        this.currentGraphData.flowChart = currentGroup.flowChart
        this.currentGraphData.allCrowd = res
        // 大的出口 选择定向时，选择人群id
        this.crowdOptions = res
      })
    },
    getChartJson () {
      const flowChartJson = this.graph ? JSON.stringify(this.graph.save()) : null

      return flowChartJson
    },
    // 删除分组
    removeTab (index) {
      const currentGroup = this.allGroupList[index]
      this.$confirm(`此操作将永久删除 ${currentGroup.name} 分组, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: currentGroup.id
        }
        this.$service.deleteDynamic2Plan(params, '删除分组成功').then(res => {
          // this.getDynamic2PlanList('delete')
          this.allGroupList.splice(index, 1)

          const groupCheckIndexOld = this.groupCheckIndex
          this.groupCheckIndex = (this.allGroupList.length - 1).toString()

          // 删除分组时，如果索引不会变量，则需要手动触发 setGroupData 方法
          if (groupCheckIndexOld === this.groupCheckIndex) {
            // 设置分组中小人群数据、图表数据
            this.setGroupData(this.groupCheckIndex)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增分组，根据选择算法和方案，生成flowChart
    async getFlowChart (type, bigCrowdId, cid) {
      // 获取人群中的方案
      const params = {
        crowdId: bigCrowdId, // 大人群ID    不能为空
        child: cid
      }
      const crowdList = await this.$service.getDynamic2CrowdList(params).then(res => {
        return res
      })

      const createNodesAndEdges = new CreateNodesAndEdges(type, crowdList, this.commonObj, this.height)

      // 新增（初始化）
      // 顺序，循环没有权重；随机，自定义有权重；

      const flowChartData = {
        nodes: [],
        edges: []
      }
      if (type === 3) { // 3-自定义 算法
        flowChartData.nodes = createNodesAndEdges.initDefaultNodes()
        flowChartData.edges = []
      } else if (type === 2) { // 2-随机 算法
        flowChartData.nodes = createNodesAndEdges.initRandomNodes()
        flowChartData.edges = []
      } else { // 0-顺序、1-循环、4-不流转 算法
        // 初始数据
        flowChartData.nodes = createNodesAndEdges.initDefaultNodes()
        flowChartData.edges = createNodesAndEdges.initEdges() // 区分顺序、循环、不流转
      }
      return JSON.stringify(flowChartData)
    },
    // 新建实验分组
    handleSaveGroup () {
      this.$refs.groupForm.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.form,
            cid: Array.isArray(this.form.cid) ? this.form.cid.join(',') : this.form.cid
          }

          // 生成拓扑图数据
          const flowChart = await this.getFlowChart(params.mainArithmetic, params.crowdId, params.cid)
          params.flowChart = flowChart

          this.$service.addDynamic2Plan(params, '新建分组成功').then(res => {
            this.allGroupList.push(res)
            this.groupCheckIndex = (this.allGroupList.length - 1).toString()

            if (this.form.mainArithmetic === 6) { // 创建故事线
              console.log('form', this.form)
              const crowdNames = this.form.cid.map(id => {
                const obj = this.smallCrowdList.find(item => item.id === id)
                return obj.label
              })
              const params = {
                planId: res.id,
                policyId: this.form.policyId,
                sceneName: this.form.name, // 方案组名称
                crowdNames: crowdNames.join(',') // 创建方案组选择的小人群名称
              }
              this.$service.addScenedynamic(params).then(res => {
                console.log('id===========', res)
                this.$router.push({ name: 'storyLine', params: { sceneId: res } })
              })
            }
            this.dialogFormVisible = false
            // this.getDynamic2PlanList('add')
          })
        }
      })
    },

    // 获取实验组列表
    getDynamic2PlanList (mode) {
      this.$service.getDynamic2PlanList({ crowdId: this.crowdId }).then(res => {
        // const groupList = res || [] // 新数据
        this.allGroupList = res || [] // 新数据

        // // 现有的分组，就用已有的数据
        // // 新增的分组，赋新值
        // this.allGroupList = groupList.map(item => {
        //   const oldItem = this.allGroupList.filter(obj => obj.id === item.id)

        //   if (oldItem.length > 0) {
        //     return {
        //       ...oldItem[0]
        //     }
        //   } else {
        //     return {
        //       ...item
        //     }
        //   }
        // })

        // // 获取当前图表的graph数据，并保存
        // const currentGroupChartJson = this.getChartJson()
        // if (currentGroupChartJson && this.allGroupList[this.groupCheckIndex]) {
        // // if (currentGroupChartJson) {
        //   this.allGroupList[this.groupCheckIndex].flowChart = currentGroupChartJson || null
        // }
        // if (mode === 'add' || mode === 'delete') {
        //   this.groupCheckIndex = (this.allGroupList.length - 1).toString()
        // } else {
        //   this.groupCheckIndex = '0' // 获取到分组列表后，默认选择第一个
        // }
        // 设置分组中小人群数据、图表数据
        // if (this.allGroupList.length) {
        //   this.setGroupData(0)
        // }

        // 直接跳转到对应的tab
        if (this.initDynamicGroupId) {
          const index = this.allGroupList.findIndex(item => item.id === this.initDynamicGroupId)
          // console.log('2---------------------->', index)
          // this.setGroupData(index)
          this.groupCheckIndex = index.toString()
        } else if (this.allGroupList.length) {
          this.setGroupData(0)
        }
      })
    },

    // 获取全部小人群列表
    getDynamic2CrowdList () {
      const params = {
        crowdId: this.crowdId // 大人群ID    不能为空
      }
      this.$service.getDynamic2CrowdList(params).then(res => {
        this.smallCrowdList = res.map(item => {
          return {
            id: item.crowdId,
            label: item.crowdName
          }
        }) || []
      })
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 1, this.recordId)
    },
    addGroup () {
      this.dialogFormVisible = true
      console.log('this.$refs.groupForm===', this.$refs.groupForm)
      this.$refs.groupForm && this.$refs.groupForm.resetFields() // 重置表单数据
      this.form = {
        name: '',
        policyId: this.policyId,
        crowdId: this.crowdId,
        mainArithmetic: 0,
        cid: [],
        flowNum: ''
      }
    },

    bindEvent () {
      const _this = this
      eventBus.$on('afterAddPage', page => {
        // alert('create')
        this.graph = page.graph
        this.graph.on('afteradditem', function (ev) {
          const flowChart = _this.graph ? _this.graph.save() : {}
          _this.handleExitCrowdVisibleChange(flowChart)
        })
        // 子项数据变化后
        this.graph.on('afterremoveitem', function (ev) {
          const flowChart = _this.graph ? _this.graph.save() : {}
          _this.handleExitCrowdVisibleChange(flowChart)
        }) // 子项数据变化后
      })
    },
    handleExitCrowdVisibleChange (flowChart) {
      // 流程图数据
      const edges = flowChart.edges
      if (!edges) return

      // 注意这里要统一成字符串：.toString()
      const isTargetCrowdIdList = edges.map(item => item.target.toString())
      const allCrowdList = this.currentGraphData.allCrowd
      this.crowdOptions = allCrowdList.filter(item => {
        return !isTargetCrowdIdList.includes(item.crowdId.toString())
      }) || []

      this.crowdOptions = this.crowdOptions.map(item => {
        return {
          ...item
        }
      })
    },
    handleChangeBigArithmetic () {
      // 1定向 2随机 3 终止
      let i

      if (!this.bigArithmetic) {
        i = 2
      } else if (Number(this.bigArithmetic) === 1) {
        i = 2
      } else if (Number(this.bigArithmetic) === 2) {
        i = 1
      }
      //  else if (Number(this.bigArithmetic) === 3) {
      //   i = 1
      // }
      this.bigArithmetic = i
      // 设置当前分组的数据
      this.currentGroup.arithmetic = i // 大人群出口方式

      // this.allGroupList[this.groupCheckIndex].arithmetic = i
    },

    handleAddChildRule (tag) {
      this.rulesJson.rules.push({
        ...tag,
        operator: '>',
        value: ''
      })
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    handleRemoveRule (index) {
      const rulesJson = this.rulesJson
      rulesJson.rules.splice(index, 1)
    },

    handleSave () {
      // 获取当前图表的graph数据，并保存
      const currentGroupChartJson = this.getChartJson()
      if (currentGroupChartJson) {
        console.log('currentGroupChartJson====', currentGroupChartJson)
        this.allGroupList[this.groupCheckIndex].flowChart = currentGroupChartJson || null
      }

      // 所有实验分组的数据
      const parmas = this.allGroupList

      this.$service.saveDynamic2Plan(parmas, '操作成功').then(res => {
        // this.$emit('goBackCrowdListPage')
        this.$emit('crowdNextStep', 2)
      })
    },

    resetFormData () {
      this.$emit('resetFormData')
    },
    handleDirectStrategyListBrother () {
      this.$emit('handleDirectStrategyList')
    }
  }
}
</script>

<style scoped  lang="stylus">
.form-class{
  margin: 0 auto 20px;
  position: relative;
}
.div-class{
  padding: 20px;
  background-color: rgba(249,249,249,0.85);
  margin-bottom 20px
}
.el-collapse_item >>> .el-collapse-item__header {
  padding-left: 10px;
  background-color: rgba(249, 249, 249, 0.85);
}

.el-collapse_item >>> .el-collapse-item {
  display: inline-block;
  width: 100%;
  margin-right: 10px;
}

.el-icon-remove-outline {
  width: 20px;
  height: 20px;
}

.el-collapse {
  border-top: none;
  border-bottom: none;
}

.multipleSelect {
  >>>.el-select {
    width: 100%;
  }
}

.mix-area-select {
  >>>.el-select {
    width: 50%;
  }
}

.label-ground {
  border: 1px dashed #ccc;
  padding: 10px;
  margin: 10px 0;
}

.label-item {
  display: flex;
  position: relative;
}

.paddingTop {
  padding-top: 50px;
}

.label-item .and {
  position: absolute;
  top: 5px;
  left: 260px;
  width: 40px;
  height: 40px;
}

.label-item .txt, .label-item .sel {
  width: 150px;
}

.label-item .txt {
  text-align: right;
}

.label-item .in {
  min-width: 250px;
}

.label-item span, .oc-item {
  margin-right: 10px;
}

.label-add {
  margin-top: 10px;
}

.label-add >>> span {
  cursor: pointer;
}

.label-or >>> span {
  cursor: pointer;
}

i {
  cursor: pointer;
}

.label-item .time-dot-select {
  width: 120px;
}

.label-item .time-dot-input {
  display: inline-block;
  width: 80px;
  margin: 0 7px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}

.pagination {
  float: right;
}

.showMoreTags >>> .el-radio {
  margin: 5px;
}

.label-item .time-dot-select-new {
  width: 90px;
}

.outer-and {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: 0;
  width: 3px;
  height: auto;
  margin: auto 10px;
  border: 1px dashed red;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-item {
  display: flex;
  margin-right: 10px;

  div+div {
    margin-left: 10px;
  }
}

.tag-condition--parent {
  position: relative;
  z-index: 1;
}

.tag-condition {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: -17px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #E6A23C;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-container {
  position: relative;
  z-index: 1;
}

.label-or-space {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 5px;
  left: -40px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #67C23A;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.behavior-label {
  white-space: nowrap;
  overflow-x: auto;
  display: flex
}
.w100 {
  min-width: 100px;
}
.flexColumn {
  display: flex;
  flex-direction: column;
}
.flexRow {
  display: flex;
  flex-direction: row;
}
.title {
  font-size: 18px;
  color: #67c23a;
  font-weight: 800;
}

.top {
  // position relative
  // width 100%
  // background: #fff
  // display: flex;
  // justify-content: space-between;
  padding: 12px 0;
  // flex-direction: row-reverse;
}
.inputArrow{
  background: url('../../../assets/img/arrow_right.png')
  background-size: cover;
  width: 63px;
  height: 60px;
  display: inline-block;
}
.addGroupForm .el-input, .addGroupForm .el-select {
  width: 200px;
}
.circulationModeName {
  // position: absolute;
  font-size: 16px;
  line-height 30px
  text-align: center;
  top: 57px;
  color: #000;
  z-index: 999
  position: absolute;
  left: 50%;
  // left: 285px;
}
.addGroupBtn{
  margin 0 10px
}

.flowNum{
  width: 86px;
  vertical-align: text-top;
  white-space: nowrap;
  font-size: 16px;
  float: right;
  margin: 0 10px;
}
.openLoopStyle{
  position: absolute;
  width: 180px;
  top: 50px;
  font-size: 16px;
  right: 0px;
}
.aaa {
  width: 100%;
  height: 395px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4fa;
  margin-top: 10px;
}
</style>
