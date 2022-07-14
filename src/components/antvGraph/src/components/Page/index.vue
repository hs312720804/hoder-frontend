<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>

    <!-- v-if 用于每次打开都重新挂载 -->
    <el-dialog
      v-if="dialogVisible"
      title="设置动态流转条件"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <SetCirculationConditionsCom
        :crowdId="crowdId"
        :graph="graph"
        @handleCancel="dialogVisible = false"
        @handleSave="handleSave">
      </SetCirculationConditionsCom>
    </el-dialog>

    <el-dialog
      v-if="entryDialogVisible"
      title="设置进入条件"
      :visible.sync="entryDialogVisible"
      width="800px"
    >
      <SetEntryConditionsCom
        :crowdId="crowdId"
        :graph="graph"
        @handleCancel="entryDialogVisible = false"
        @handleSave="handleSave">
      </SetEntryConditionsCom>
    </el-dialog>
  </div>
</template>

<script>
// import G6 from '@antv/g6'
import G6 from '@antv/g6/build/g6'
import { initBehavors } from '@antvGraph/behavior'
import eventBus from '@antvGraph/utils/eventBus'
import Grid from '@antv/g6/build/grid'
// import SetCirculationConditionsCom from '@/DynamicPeopleConditions copy'
import SetCirculationConditionsCom from '@/components/dynamicPeople/SetCirculationConditionsCom.vue'
import SetEntryConditionsCom from '@/components/dynamicPeople/SetEntryConditionsCom.vue'

export default {
  components: {
    SetCirculationConditionsCom,
    SetEntryConditionsCom
  },
  data () {
    return {
      pageId: 'graph-container',
      graph: null,
      dialogVisible: false,
      crowdId: undefined, // 小人群ID
      allCrowdRule: [],
      currentTarget: null,
      entryDialogVisible: false
    }
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    initBehavors()
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
    this.bindEvent()
  },
  methods: {
    // 保存流转条件
    handleSave (paramsObj) {
      const parmas = {
        policyId: paramsObj.policyId,
        crowdId: this.crowdId,
        dynamicJson: JSON.stringify(paramsObj.rulesJson),
        applyAll: paramsObj.applyAll ? 1 : 0
      }
      // this.$service.setDynamicRule(parmas, '操作成功').then(res => {

      if (parmas.applyAll) { // 应用全部人群
        const graphData = this.graph.save()
        const nodes = graphData.nodes

        const setApplyAllNodes = nodes.map(item => {
          return {
            ...item,
            dynamicJson: parmas.dynamicJson
          }
        })

        const graphData2 = { // 覆盖nodes属性
          ...graphData,
          nodes: setApplyAllNodes
        }
        this.graph.read(graphData2)
      } else { // 修改单个人群
        const model = {
          dynamicJson: parmas.dynamicJson
        }

        this.graph.update(this.currentTarget, model) // 更新 流转规则 数据
      }

      this.dialogVisible = false

      // })
    },
    init () {
      const height = this.height - 42
      const width = this.width

      this.graph = new G6.Graph({
        container: 'graph-container',
        height: height,
        width: width,
        fitCenter: true, // 图是否自适应画布
        fitViewPadding: [ 20, 40, 50, 20 ],
        modes: {
          // 支持的 behavior
          default: [
            'drag-canvas',
            'zoom-canvas',
            'hover-node',
            'select-node',
            'hover-edge',
            'keyboard',
            'customer-events',
            'add-menu'
          ],
          mulitSelect: ['mulit-select'],
          addEdge: ['add-edge'],
          moveNode: ['drag-item']
        }
      })
      const { editor, command } = this.$parent
      editor.emit('afterAddPage', { graph: this.graph, command })
      editor.on('changeNodeData')
      this.readData()
    },
    readData () {
      let data = this.data
      if (data) {
        // read 方法的功能相当于 data 和 render 方法的结合。
        this.graph.read(data)
      }
    },
    bindEvent () {
      let _this = this
      eventBus.$on('afterAddPage', page => {
        _this.page = page
        _this.graph = _this.page.graph
        // 添加网格线

        _this.grid = new Grid()
        console.log('_this.graph==========>', _this.graph)
        _this.graph.addPlugin(_this.grid)

        eventBus.$on('nodeselectchange', item => {
          if (item.select === true && item.target.getType() === 'node') {
            _this.status = 'node-selected'
            _this.item = item.target
            _this.node = item.target.getModel()
          } else {
            _this.status = 'canvas-selected'
            _this.item = null
            _this.node = null
          }
        })
        eventBus.$on('nodeSettingRule', item => { // 设置流转条件
          const selectNode = item.target.getModel()

          _this.crowdId = selectNode.id
          _this.currentTarget = item.target // 当前操作对象
          this.$nextTick(() => {
            _this.dialogVisible = true
          })
        })

        eventBus.$on('nodeSettingEntry', item => { // 设置入口条件
          const selectNode = item.target.getModel()

          _this.crowdId = selectNode.id
          _this.currentTarget = item.target // 当前操作对象
          this.$nextTick(() => {
            _this.entryDialogVisible = true
          })
        })

        eventBus.$on('changeArithmeticType', item => { // 修改出口方式
          const selectNode = item.target.getModel()
          // 1定向 2随机 3 终止
          let i

          if (!selectNode.arithmetic) {
            i = 3
          } else if (selectNode.arithmetic == 1) {
            i = 2
          } else if (selectNode.arithmetic == 2) {
            i = 3
          } else if (selectNode.arithmetic == 3) {
            i = 1
          }

          console.log('changeArithmeticType=====', selectNode)

          // const parmas = {
          //   policyId: selectNode.policyId,
          //   crowdId: selectNode.crowdId,
          //   arithmetic: i
          // }
          // this.$service.setDynamicRule(parmas).then(res => {
          const model = {
            arithmetic: i
          }

          this.graph.update(item.target, model) // 更新 出口方式 数据
          // })
        })

        eventBus.$on('changeWeight', item => { // 修改权重
          const selectNode = item.target.getModel()
          _this.$prompt('请输入权重（权重越大，比重越高）', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[+]{0,1}(\d+)$/,
            inputErrorMessage: '只能输入正整数',
            inputValue: selectNode.weight || 0,
            closeOnClickModal: false
          }).then(({ value }) => {
            // const parmas = {
            //   policyId: selectNode.policyId,
            //   crowdId: selectNode.crowdId,
            //   weight: value
            // }
            // this.$service.setDynamicRule(parmas).then(res => {
            const model = {
              weight: value
            }

            this.graph.update(item.target, model) // 更新 优先级 数据
            // })
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        })
      })
    }

  }
}
</script>
