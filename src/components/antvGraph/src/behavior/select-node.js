
import Util from '@antv/g6/src/util'
import eventBus from '@antvGraph/utils/eventBus'
export default {
  getDefaultCfg () {
    return {
      multiple: true,
      keyCode: 16
    }
  },
  getEvents () {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick',
      'canvas:mouseover': 'onCanvasMouseover',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown',
      'click': 'onGraphClick'
    }
  },
  onGraphClick (e) {
    const item = e
    const graph = self.graph

    console.log('item===', item)
    console.log('shape===', graph)
  },
  onClick (e) {
    const { item, target } = e
    // ---------------------------

    // -------------------------------
    // const name = target.get('name')
    // const model = item.getModel()
    if (target.get('className') === 'aaaa') { // 点击设置流转条件
      // 如果点击是发生在节点里面的小圆上，则更新对应的label
      // this.graph.updateItem(item, {
      //   label: '点击了圆',
      //   labelCfg: {
      //     style: {
      //       fill: '#003a8c',
      //       fontSize: 16
      //     }
      //   }
      // })
      eventBus.$emit('nodeSettingRule', { target: item, select: true })
    } else {
      const self = this
      const item = e.item
      const graph = self.graph
      const autoPaint = graph.get('autoPaint')
      graph.setAutoPaint(false)
      const selectedEdges = graph.findAllByState('edge', 'selected')
      Util.each(selectedEdges, edge => {
        graph.setItemState(edge, 'selected', false)
      })
      if (!self.keydown || !self.multiple) {
        const selected = graph.findAllByState('node', 'selected')
        Util.each(selected, node => {
          if (node !== item) {
            graph.setItemState(node, 'selected', false)
          }
        })
      }
      if (item.hasState('selected')) {
        if (self.shouldUpdate.call(self, e)) {
          graph.setItemState(item, 'selected', false)
        }

        eventBus.$emit('nodeselectchange', { target: item, select: false })
      } else {
        if (self.shouldUpdate.call(self, e)) {
          graph.setItemState(item, 'selected', true)
        }
        eventBus.$emit('nodeselectchange', { target: item, select: true })
      }
      graph.setAutoPaint(autoPaint)
      graph.paint()
    }
  },
  onCanvasClick () {
    const graph = this.graph
    const autoPaint = graph.get('autoPaint')
    graph.setAutoPaint(false)
    const selected = graph.findAllByState('node', 'selected')
    Util.each(selected, node => {
      graph.setItemState(node, 'selected', false)
      eventBus.$emit('nodeselectchange', { target: node, select: false })
    })

    const selectedEdges = graph.findAllByState('edge', 'selected')
    Util.each(selectedEdges, edge => {
      graph.setItemState(edge, 'selected', false)
      eventBus.$emit('nodeselectchange', { target: edge, select: false })
    })

    graph.paint()
    graph.setAutoPaint(autoPaint)
  },
  onCanvasMouseover () {
    const graph = this.graph
    graph.paint()
  },
  onKeyDown (e) {
    const code = e.keyCode || e.which
    if (code === this.keyCode) {
      this.keydown = true
    } else {
      this.keydown = false
    }
  },
  onKeyUp () {
    this.keydown = false
  }
}
