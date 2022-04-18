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
    handleSave (paramsObj) {
      const parmas = {
        policyId: paramsObj.policyId,
        crowdId: this.crowdId,
        dynamicJson: JSON.stringify(paramsObj.rulesJson),
        applyAll: paramsObj.applyAll ? 1 : 0
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
        // layout: {
        //   type: 'grid',
        //   begin: [ 20, 20 ],
        //   width: width - 20,
        //   height: height - 20
        // },
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
        eventBus.$on('nodeSettingRule', item => {
          const selectNode = item.target.getModel()
          // const allCrowd = this.dynamicRuleProvide.allCrowd

          // console.log('1111node====>', selectNode)

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

          const parmas = {
            policyId: selectNode.policyId,
            crowdId: selectNode.crowdId,
            arithmetic: i
          }
          this.$service.setDynamicRule(parmas).then(res => {
            const model = {
              arithmetic: i
            }

            this.graph.update(item.target, model)
          })
        })
        eventBus.$on('changeWeight', item => { // 修改权重
          const selectNode = item.target.getModel()
          _this.$prompt('请输入权重', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[+]{0,1}(\d+)$/,
            inputErrorMessage: '只能输入正整数',
            inputValue: selectNode.weight || 0,
            closeOnClickModal: false
          }).then(({ value }) => {
            // _this.$message({
            //   type: 'success',
            //   message: '你的邮箱是: ' + value
            // })
            const parmas = {
              policyId: selectNode.policyId,
              crowdId: selectNode.crowdId,
              weight: value
            }
            this.$service.setDynamicRule(parmas).then(res => {
              const model = {
                weight: value
              }

              this.graph.update(item.target, model)
            })
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

<style lang="stylus" scoped>

.form-class{
  width 100%
}
</style>
