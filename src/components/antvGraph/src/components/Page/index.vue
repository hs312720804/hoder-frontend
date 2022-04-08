<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6/build/g6'
import { initBehavors } from '@antvGraph/behavior'
import eventBus from '@antvGraph/utils/eventBus'
import Grid from '@antv/g6/build/grid'

export default {
  data () {
    return {
      pageId: 'graph-container',
      graph: null
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
      let self = this
      eventBus.$on('afterAddPage', page => {
        self.page = page
        self.graph = self.page.graph
        eventBus.$on('nodeselectchange', item => {
          if (item.select === true && item.target.getType() === 'node') {
            self.status = 'node-selected'
            self.item = item.target
            self.node = item.target.getModel()
          } else {
            self.status = 'canvas-selected'
            self.item = null
            self.node = null
          }
        })

        // 添加网格线
        self.grid = new Grid()
        self.graph.addPlugin(self.grid)
      })
    }
  }
}
</script>

<style scoped>
.page{
  /* margin-left:200px; */
  /* margin-right: 200px; */
}
</style>
