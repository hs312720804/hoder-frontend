<!--策略配置-流程图功能配置方案-->
<template>
    <div class="configScheme-wrap">
        <div class="content">
            <!--左侧工具栏-->
            <div id="flowStencil" class="sider" />
            <div class="panel">
                <!--流程图画板-->
                <div id="flowContainer" class="x6-graph" />
            </div>
        </div>
        <!--人群配置-->
        <people-dialog
          :show="peopleDialogStatus"
          :info="editPeopleInfo"
          @savePeople="savePeople"
        >
        </people-dialog>
        <!--入口配置-->
        <entry-config
            :entryData="entryData"
            :show="schemeStart"
            :recordId="recordId"
            :policyId="policyId"
            :splitRadio="splitRadio"
            @saveEntryData="saveEntryData"
        >
        </entry-config>
        <!--组出口配置-->
        <out-condition
            :recordId="recordId"
            :show="outConditionStatus"
            :outputData="outputData"
            :policyId="policyId"
            @saveOutputCondition="saveOutputCondition">
        </out-condition>
        <!--放大缩小操作-->
        <div class="scale-group">
            <el-tooltip class="item" content="放大画布" placement="top-start">
                <el-button icon="el-icon-plus" @click="scaleGraph(0.2)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" content="缩小画布" placement="top-start">
                <el-button icon="el-icon-minus" @click="scaleGraph(-0.2)"></el-button>
            </el-tooltip>
        </div>
        <!--按钮操作-->
        <div class="btn-group" v-if="!isSmartEdit">
            <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
            <el-button type="warning" @click="handleSave(0)">跳过保存</el-button>
            <el-button type="primary" @click="handleSave(1)">下一步</el-button>
        </div>
    </div>
</template>

<script>
import peopleDialog from './graph/peopleDialog'
import entryConfig from './graph/entryConfig'
import outCondition from './graph/outCondition'
import graphMixin from './graph/graphMixin'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
export default {
  props: ['recordId'],
  name: 'CreateConfigScheme',
  mixins: [graphMixin],
  data () {
    return {
      schemeConfig: {
        programmeName: '方案入口', // 入口名称
        inputCondition: null, // 入口规则
        remark: '', // 入口备注
        smartStrategies: [] // 流程图配置
      },
      graph: null,
      schemeData: [], // 存储数据集合
      currentNode: null,
      peopleDialogStatus: {
        is: false
      },
      peopleId: null, // 每次点击人群时找到对应的id
      groupId: null, // 点击人群时所在组id
      schemeStart: {
        is: false
      },
      groupIdx: 1, // 组的序号
      peopleIdx: 1, // 人群序号
      entryData: [],
      outputData: [],
      editPeopleInfo: {}, // 编辑时传入的数据
      tempPortArr: [], // 临时存储已连接port
      splitRadio: '',
      outConditionStatus: { // 出口规则配置
        is: false
      }
    }
  },
  components: {
    peopleDialog,
    entryConfig,
    outCondition
  },
  mounted () {
    this.initGraph()
  },
  computed: {
    ...mapGetters(['policyInfo', 'policyId', 'isSmartEdit'])
  },
  methods: {
    // 还原数据
    handleParseData (data) {
      data.inputCondition = data.inputCondition ? JSON.parse(data.inputCondition) : []
      data.smartStrategies && data.smartStrategies.forEach(item => {
        item.mapGrid = JSON.parse(item.mapGrid)
        item.outCondition = item.outCondition ? JSON.parse(item.outCondition) : []
        if (item.smartStrategyNodes && item.smartStrategyNodes.length > 0) {
          item.smartStrategyNodes.forEach(v => {
            v.mapGrid = JSON.parse(v.mapGrid)
            v.nodeCondition = JSON.parse(v.nodeCondition)
          })
        }
      })
    },
    // 处理删除节点索引规则
    setNodeIdx (identify, node, deleteNode = false) {
      const sourceId = node.mapGrid.source
      const targetId = node.mapGrid.target
      if (identify === 'schemeGroup') {
        let nextNode = this.findNodesById(null, targetId)
        if (!nextNode) {
        } else {
          if (deleteNode) {
            node.strategyIndex = 0
          }
          if (nextNode.strategyIndex >= 1) {
            nextNode.strategyIndex = node.strategyIndex + 1
          } else {
            nextNode.strategyIndex = 0
          }
          this.setNodeIdx(nextNode.mapGrid.identify, nextNode)
        }
      } else {
        let nextNode = this.findNodesById(sourceId, targetId)
        if (!nextNode) {

        } else {
          if (deleteNode) {
            node.strategyNodeIndex = 0
          }
          if (nextNode.strategyNodeIndex >= 1) {
            nextNode.strategyNodeIndex = node.strategyNodeIndex + 1
          } else {
            nextNode.strategyNodeIndex = 0
          }
          this.setNodeIdx(nextNode.mapGrid.identify, nextNode)
        }
      }
    },
    // 添加开始节点
    addStartNode () {
      this.currentNode = {
        strategyName: '方案入口',
        strategyIndex: 0,
        defaultStrategy: false,
        smartStrategyNodes: [],
        remark: '',
        mapGrid: {
          x: 300, // 节点x坐标
          y: 20, // 节点y坐标
          source: 'startNode', // 节点边原对象
          target: '', // 节点边目标对象
          id: 'startNode',
          identify: 'start'
        }
      }
      this.schemeData.push(this.currentNode)
    },
    addGroupNode (node) {
      let groupNameColl = this.findGroupName(this.schemeData)
      let pos = node.position()
      this.groupIdx = this.getMaxNum(groupNameColl.toString())
      this.currentNode = {
        strategyName: `策略${this.groupIdx}`,
        strategyIndex: 0, // 是否有连线
        defaultStrategy: true,
        outCondition: '',
        remark: '',
        mapGrid: {
          x: pos.x, // 节点x坐标
          y: pos.y, // 节点y坐标
          source: '', // 节点边原对象
          target: '', // 节点边目标对象
          id: node.id,
          identify: 'schemeGroup'
        },
        smartStrategyNodes: []
      }
      node.attr({
        text: {
          text: `策略${this.groupIdx}`
        }
      })
      node.setTools(this.setTools())
      this.schemeData.push(this.currentNode)
      node.size({ width: 250, height: 180 })
    },
    addPeopleNode (node) {
      this.$nextTick(() => {
        let parent = node.parent
        if (!parent) {
          this.$message({
            message: '人群只能放置在策略组中!',
            type: 'warning'
          })
          node.remove()
          return false
        }
        let crowdNameColl = this.findGroupCrowdName(this.schemeData)
        let pos = node.position()
        this.peopleIdx = this.getMaxNum(crowdNameColl.toString(), 'child')
        this.currentNode = {
          nodeCondition: {}, // 存储人群用户信息
          strategyNodeName: `人群${this.peopleIdx}`,
          strategyNodeIndex: 0,
          mapGrid: {
            x: pos.x, // 节点x坐标
            y: pos.y, // 节点y坐标
            source: '', // 节点边原对象
            target: '', // 节点边目标对象
            id: node.id, // 人群id
            identify: 'crowd'
          }
        }
        node.attr({
          text: {
            text: `人群${this.peopleIdx}`
          }
        })
        this.schemeData.forEach(item => {
          if (item.mapGrid.id === parent.id) {
            item.smartStrategyNodes.push(this.currentNode)
          }
        })
      })
    },
    // 保存人群信息
    savePeople (data) {
      this.schemeData.forEach(item => {
        if (item.mapGrid.id === this.groupId) {
          item.smartStrategyNodes.forEach(v => {
            if (v.mapGrid.id === this.peopleId) {
              v.nodeCondition = data.condition
              v.strategyNodeName = data.strategyNodeName
            }
            this.peopleDialogStatus.is = false
          })
        }
      })
      this.currentNode.attr({
        text: {
          textWrap: {
            text: data.strategyNodeName
          }
        }
      })
    },
    // 查找节点数据
    findNodesById (parentId, id) {
      let result
      if (!parentId) {
        result = this.schemeData.find(item => {
          return item.mapGrid.id === id
        })
      } else {
        this.schemeData.forEach(item => {
          if (item.mapGrid.id === parentId) {
            result = item.smartStrategyNodes.find(v => {
              return v.mapGrid.id === id
            })
          }
        })
      }
      return result
    },
    findChildId (arr) {
      let result = []
      arr && arr.forEach(item => {
        result.push(item.mapGrid.id)
      })
      return result
    },
    // 上一步操作
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 1, this.recordId)
    },
    // 处理保存数据
    handleSaveData (config) {
      let schemeData = cloneDeep(this.schemeData)
      // 将节点数组mapGuid存储为JSON字符串
      schemeData.forEach(item => {
        item.mapGrid = JSON.stringify(item.mapGrid)
        item.outCondition = JSON.stringify(item.outCondition)
        if (item.smartStrategyNodes && item.smartStrategyNodes.length > 0) {
          item.smartStrategyNodes.forEach(v => {
            v.mapGrid = JSON.stringify(v.mapGrid)
            v.nodeCondition = JSON.stringify(v.nodeCondition)
          })
        }
      })
      config.smartStrategies = schemeData
      return config
    },
    // 跳过直接保存
    handleSave (idx) {
      let schemeConfig = this.handleSaveData(this.schemeConfig)
      if (!this.policyId) {
        this.schemeConfig.recordId = this.recordId
        // 如果还没有创建策略流程图 则走创建逻辑
        let data = {
          recordId: this.recordId,
          data: schemeConfig
        }
        this.$store.dispatch('saveSmartProgramme', data).then(rs => {
          if (idx === 0) {
            this.$emit('handleDirectStrategyList')
            this.$emit('resetFormData')
          } else {
            // 下一步操作
            this.$store.commit('setPolicyId', rs.policyId)
            this.$store.dispatch('getPolicyInfo', rs.policyId).then(rs => {
              let obj = {
                tempPolicy: {
                  recordId: this.recordId,
                  policyName: rs.policyName
                }
              }
              this.$emit('handleToNextStep', 1, null, obj)
            })
          }
        })
      } else {
        let data = {
          data: schemeConfig,
          params: { programmeId: schemeConfig.programmeId }
        }
        this.$store.dispatch('saveSmartProgramme', data).then(() => {
          if (idx === 0) {
            this.$emit('handleDirectStrategyList')
            this.$emit('resetFormData')
          } else {
            this.$store.dispatch('getPolicyInfo', this.policyId).then(rs => {
              let obj = {
                tempPolicy: {
                  recordId: this.recordId,
                  policyName: rs.policyName
                }
              }
              this.$emit('handleToNextStep', 1, null, obj)
            })
          }
        })
      }
    },
    // 保存入口配置信息
    saveEntryData (data, data1) {
      this.entryData = data
      this.splitRadio = data1
      let tempArr = [data, data1]
      this.schemeConfig.inputCondition = JSON.stringify(tempArr)
      this.schemeStart.is = false
    },
    // 查找策略索引名称
    findGroupName (arr) {
      return arr && arr.map(item => {
        return item.strategyName
      })
    },
    // 查找人群名字索引
    findGroupCrowdName (arr) {
      let result = []
      arr.forEach(item => {
        item.smartStrategyNodes && item.smartStrategyNodes.forEach(v => {
          result.push(v.strategyNodeName)
        })
      })
      return result
    },
    // 查找策略索引名称最大值
    getMaxNum (str, flag) {
      let reg
      if (!flag) {
        reg = /策略(\d+)/g
      } else {
        reg = /人群(\d+)/g
      }
      let m = 0, v = 0
      while (m != null) {
        m = reg.exec(str)
        if (m != null) {
          v = Math.max(v, m[1])
        }
      }
      return v + 1
    },
    // 出口规则配置
    addGroupOutCondition (node) {
      this.groupId = node.id
      let result = this.findNodesById(null, node.id)
      this.outputData = result.outCondition.length > 0 ? result.outCondition : []
      this.outConditionStatus.is = true
    },
    saveOutputCondition (data) {
      let result = this.findNodesById(null, this.groupId)
      this.outputData = data
      result.outCondition = cloneDeep(data)
      this.outConditionStatus.is = false
    },
    // 设置出口规则节点
    setTools () {
      let _this = this
      return [{
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 14,
                stroke: 'green',
                strokeWidth: 2,
                fill: 'green',
                cursor: 'pointer'
              }
            },
            {
              tagName: 'text',
              textContent: '出口11111',
              selector: 'icon',
              attrs: {
                fill: '#ffffff',
                fontSize: 10,
                textAnchor: 'middle',
                pointerEvents: 'none',
                y: '0.3em'
              }
            }
          ],
          x: '50%',
          y: '100%',
          offset: { x: 0, y: -20 },
          onClick ({ cell }) {
            // 添加出口规则
            _this.addGroupOutCondition(cell)
          }
        }
      }]
    }
  }
}
</script>

<style lang="stylus" scoped>
    .configScheme-wrap
        width: 100%;
        height: 100%;
        .header
            display: flex;
            justify-content: space-between;
            height: 48px;
            line-height: 48px;
            padding-left: 16px;
            padding-right: 32px;
            background: #fff;
            box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            color: rgba(0, 0, 0, 0.45);
        .content
            display: flex;
            .sider
                position: relative;
                width: 200px;
                border-right: 1px solid rgba(0, 0, 0, 0.08);
            .panel
                height: 100%;
        .scale-group
            position: absolute;
            bottom: 100px;
            right: 100px;
        .btn-group
            position: absolute;
            bottom: 20px;
            right: 40px;
    // 调整边界
    .ant-drawer-body
        padding: 0;
    //解决左侧遮罩的问题
    .x6-widget-dnd
        z-index: 1000;

    // 左侧动画
    @keyframes stroke
        100%
            stroke-dashoffset: -400;
    .animate-text1,
    .animate-text2,
    .animate-text3,
    .animate-text4
        font-weight: bold;
        fill: none;
        stroke-width: 2px;
        stroke-dasharray: 90 310;
        animation: stroke 3s infinite linear;
    .animate-text1
        stroke: #873bf4;
        text-shadow: 0 0 2px #873bf4;
        animation-delay: -1.5s;
    .animate-text2
        stroke: #ff6e06;
        text-shadow: 0 0 2px #ff6e06;
        animation-delay: -3s;
</style>
