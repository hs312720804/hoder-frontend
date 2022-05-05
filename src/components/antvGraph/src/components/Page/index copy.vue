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
    init1 () {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json')
        .then(res => res.json())
        .then(data => {
          const width = document.getElementById('graph-container').scrollWidth
          const height = document.getElementById('graph-container').scrollHeight || 500
          this.graph = new G6.TreeGraph({
            container: 'graph-container',
            width,
            height,
            pixelRatio: 2,
            modes: {
              default: [{
                type: 'collapse-expand',
                onChange: function onChange (item, collapsed) {
                  const data = item.get('model').data
                  data.collapsed = collapsed
                  return true
                }
              }, 'drag-canvas', 'zoom-canvas' ]
            },
            defaultNode: {
              size: 26,
              anchorPoints: [[ 0, 0.5 ], [ 1, 0.5 ]],
              style: {
                fill: '#C6E5FF',
                stroke: '#5B8FF9'
              }
            },
            defaultEdge: {
              shape: 'cubic-horizontal',
              style: {
                stroke: '#A3B1BF'
              }
            },
            layout: {
              type: 'dendrogram',
              direction: 'LR', // H / V / LR / RL / TB / BT
              nodeSep: 30,
              rankSep: 100
            }
          })

          this.graph.node(function (node) {
            return {
              label: node.id,
              labelCfg: {
                position: node.children && node.children.length > 0 ? 'left' : 'right',
                offset: 5
              }
            }
          })

          this.graph.data(data)
          this.graph.render()
          this.graph.fitView()
        })
    },
    // 树形实验
    init2 () {
      // alert(1)
      const data = {
        nodes: [{
          id: '4',
          label: '4',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '5',
          label: '5',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '6',
          label: '6',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '7',
          label: '7',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '8',
          label: '8',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '9',
          label: '9',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '10',
          label: '10',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '11',
          label: '11',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }, {
          id: '12',
          label: '12',
          shape: 'customNode',
          type: 'node',
          size: [170, 40],
          color: '#1890ff'
        }],
        edges: [{
          source: '0',
          target: '1'
        }, {
          source: '0',
          target: '2'
        }, {
          source: '0',
          target: '3'
        }, {
          source: '0',
          target: '4'
        }, {
          source: '0',
          target: '5'
        }, {
          source: '0',
          target: '7'
        }, {
          source: '0',
          target: '8'
        }, {
          source: '0',
          target: '9'
        }, {
          source: '0',
          target: '10'
        }, {
          source: '0',
          target: '11'
        }, {
          source: '0',
          target: '13'
        }, {
          source: '0',
          target: '14'
        }, {
          source: '0',
          target: '15'
        }, {
          source: '0',
          target: '16'
        }, {
          source: '2',
          target: '3'
        }, {
          source: '4',
          target: '5'
        }, {
          source: '4',
          target: '6'
        }, {
          source: '5',
          target: '6'
        }, {
          source: '7',
          target: '13'
        }, {
          source: '8',
          target: '14'
        }, {
          source: '9',
          target: '10'
        }, {
          source: '10',
          target: '22'
        }, {
          source: '10',
          target: '14'
        }, {
          source: '10',
          target: '12'
        }, {
          source: '10',
          target: '24'
        }, {
          source: '10',
          target: '21'
        }, {
          source: '10',
          target: '20'
        }, {
          source: '11',
          target: '24'
        }, {
          source: '11',
          target: '22'
        }, {
          source: '11',
          target: '14'
        }, {
          source: '12',
          target: '13'
        }, {
          source: '16',
          target: '17'
        }, {
          source: '16',
          target: '18'
        }, {
          source: '16',
          target: '21'
        }, {
          source: '16',
          target: '22'
        }, {
          source: '17',
          target: '18'
        }, {
          source: '17',
          target: '20'
        }, {
          source: '18',
          target: '19'
        }, {
          source: '19',
          target: '20'
        }, {
          source: '19',
          target: '33'
        }, {
          source: '19',
          target: '22'
        }, {
          source: '19',
          target: '23'
        }, {
          source: '20',
          target: '21'
        }, {
          source: '21',
          target: '22'
        }, {
          source: '22',
          target: '24'
        }, {
          source: '22',
          target: '25'
        }, {
          source: '22',
          target: '26'
        }, {
          source: '22',
          target: '23'
        }, {
          source: '22',
          target: '28'
        }, {
          source: '22',
          target: '30'
        }, {
          source: '22',
          target: '31'
        }, {
          source: '22',
          target: '32'
        }, {
          source: '22',
          target: '33'
        }, {
          source: '23',
          target: '28'
        }, {
          source: '23',
          target: '27'
        }, {
          source: '23',
          target: '29'
        }, {
          source: '23',
          target: '30'
        }, {
          source: '23',
          target: '31'
        }, {
          source: '23',
          target: '33'
        }, {
          source: '32',
          target: '33'
        }]
      }
      // const data2 = this.data
      // data2.nodes = this.data.nodes.map(item => {
      //   console.log('item0000=========', item)
      //   return {
      //     id: item.id,
      //     name: item.name,
      //     label: item.label,
      //     crowdId: item.crowdId,
      //     crowdName: item.crowdName,
      //     shape: 'customNode',
      //     type: 'node',
      //     size: [170, 40],
      //     color: '#1890ff',
      //     x: undefined,
      //     y: undefined
      //   }
      // })
      // console.log('1=====================>', data2)
      // console.log('2=====================>', JSON.parse(JSON.stringify(data2)))
      const width = document.getElementById('graph-container').scrollWidth
      const height = document.getElementById('graph-container').scrollHeight || 500
      this.graph = new G6.Graph({
        container: 'graph-container',
        width,
        height,
        modes: {
          default: [ 'zoom-canvas', 'drag-canvas', 'drag-node' ]
        },
        layout: {
          type: 'grid',
          begin: [ 20, 20 ],
          width: width - 20,
          height: height - 20
        },
        animate: true,
        defaultNode: {
          size: 20,
          style: {
            fill: '#C6E5FF',
            stroke: '#5B8FF9'
          }
        },
        defaultEdge: {
          size: 1,
          color: '#e2e2e2'
        }
      })
      console.log('this.data==========>', data)
      const { editor, command } = this.$parent
      editor.emit('afterAddPage', { graph: this.graph, command })
      editor.on('changeNodeData')
      this.graph.read(data)
      // this.readData()
    },
    init () {
      const width = document.getElementById('graph-container').scrollWidth
      const height = document.getElementById('graph-container').scrollHeight || 500

      // const height = this.height - 42
      // const width = this.width

      this.graph = new G6.Graph({
        container: 'graph-container',
        height: height,
        width: width,
        // fitCenter: true, // 图是否自适应画布
        // layout: {
        //   type: 'grid',
        //   begin: [ 500, 500 ],
        //   // width: 10000,
        //   // height: 5000,
        //   linkDistance: 200 // 设置边长为 100
        // },
        // fitViewPadding: [ 20, 40, 50, 20 ],
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
      // this.graph.read(data)
      this.readData()
    },
    readData () {
      let data = this.data
      if (data) {
        // read 方法的功能相当于 data 和 render 方法的结合。
        this.graph.read(data)
      }
      // this.graph.fitView()
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
