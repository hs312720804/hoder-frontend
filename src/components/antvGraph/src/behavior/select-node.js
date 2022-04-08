
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
    debugger
    const { item, target } = e
    const targetType = target.get('type')
    const name = target.get('name')
    const model = item.getModel()
    if (name === 'add-item') {
      if (!model.children) {
        model.children = []
      }
      const id = 'ra'
      var str = prompt('请输入节点名称', '比如c3-3-4')
      if (str) {
        target.attrs.text = str
        model.children.push({
          id,
          name: 1,
          label: str
        })
        this.graph.updateChild(model, model.id)
      }
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
