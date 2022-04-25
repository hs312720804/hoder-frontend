import { uniqueId } from '@antvGraph/utils'
import eventBus from '@antvGraph/utils/eventBus'

export default class Editor {
  constructor () {
    this.id = uniqueId()
  }
  getGrpah () {
    return this.graph
  }
  emit (event, params) {
    if (event === 'afterAddPage') {
      this.graph = params.graph
    }
    eventBus.$emit(event, params)
  }
  on (event) {
    switch (event) {
      case 'changeNodeData':
        this.graph.refresh()
        break
    }
  }
  add (type, item) {
    // 处理添加、删除线段的时候，当source、target不为字符串时报错的问题
    if (item.source) {
      item.source = item.source.toString()
    }
    if (item.target) {
      item.target = item.target.toString()
    }
    this.graph.add(type, item)
  }
  update (item, model) {
    this.graph.update(item, model)
  }
  remove (item) {
    const node = this.graph.findById(item.id)
    this.graph.remove(node)
  }
}
