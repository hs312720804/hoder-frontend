<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
    <el-dialog
      title="设置动态流转条件"
      :visible.sync="dialogVisible"
      width="800"
    >
      <DynamicPeopleConditionsCom
        :crowdId="crowdId"
        :allCrowdRule="dynamicRuleProvide.allCrowd"
        @handleCancel="dialogVisible = false"
        @handleSave="handleSave"
        >
      </DynamicPeopleConditionsCom>

    </el-dialog>
  </div>
</template>

<script>
// import G6 from '@antv/g6'
import G6 from '@antv/g6/build/g6'
import { initBehavors } from '@antvGraph/behavior'
import eventBus from '@antvGraph/utils/eventBus'
import Grid from '@antv/g6/build/grid'
// import DynamicPeopleConditionsCom from '@/DynamicPeopleConditions copy'
import DynamicPeopleConditionsCom from '@/components/dynamicPeople/DynamicPeopleConditionsCom'

export default {
  components: {
    DynamicPeopleConditionsCom
  },
  inject: ['dynamicRuleProvide'],
  data () {
    return {
      pageId: 'graph-container',
      graph: null,
      dialogVisible: false,
      crowdId: undefined, // 小人群ID
      allCrowdRule: []
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
    handleSave (rulesJson, policyId) {
      const parmas = {
        policyId: policyId,
        crowdId: this.crowdId,
        dynamicJson: JSON.stringify(rulesJson)
      }
      this.$service.setDynamicRule(parmas, '操作成功').then(res => {
        this.dialogVisible = false
      })
    },
    init () {
      const height = this.height - 42
      const width = this.width

      this.graph = new G6.Graph({
        container: 'graph-container',
        height: height,
        width: width,
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

      this.readData()
    },
    readData () {
      let data = this.data
      if (data) {
        this.graph.read(data)
      }
    },
    bindEvent () {
      let _this = this
      eventBus.$on('afterAddPage', page => {
        _this.page = page
        _this.graph = _this.page.graph
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
        eventBus.$on('nodeSettingRule', item => {
          const selectNode = item.target.getModel()
          // const allCrowd = this.dynamicRuleProvide.allCrowd

          console.log('1111node====>', selectNode)

          _this.crowdId = selectNode.id
          // _this.crowdRule = allCrowd.find(item => item.crowdId == _this.crowdId)
          // _this.allCrowdRule = allCrowd.map(item => {
          //   return {
          //     ...item,
          //     dynamicJson: item.dynamicJson ? JSON.parse(item.dynamicJson) : null
          //   }
          // })
          // this.dynamicRuleProvide.allCrowd = _this.allCrowdRule
          // item.crowdId == _this.crowdId)

          _this.dialogVisible = true

          // console.log('crowdRule=====', _this.allCrowdRule)
        })

        // 添加网格线
        _this.grid = new Grid()
        _this.graph.addPlugin(self.grid)
      })
    }

  }
}
</script>

<style lang="stylus" scoped>

.form-class{
  width 100%
}
</style>
