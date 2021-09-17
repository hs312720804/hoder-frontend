import { Addon, FunctionExt, Shape } from '@antv/x6'
import './shapeInfo'
export default class FlowGraph {
  static init (graph) {
    this.graph = graph
    this.initStencil()
    this.initShape()
    this.initEvent()
  }
  // 左边导航
  static initStencil () {
    this.stencil = new Addon.Stencil({
      title: '',
      target: this.graph,
      search: false,
      stencilGraphWidth: 160,
      collapsable: false,
      groups: [
        {
          name: 'basicComponents',
          title: '基础组件',
          collapsable: false,
          graphHeight: 160,
          layoutOptions: {
            columns: 1,
            marginX: 40
          }
        }
        // {
        //   name: 'groupComponents',
        //   title: '节点组',
        //   collapsable: true,
        //   graphHeight: 100,
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60
        //   }
        // }
      ]
    })
    const stencilContainer = document.querySelector('#flowStencil')
    stencilContainer.appendChild(this.stencil.container)
  }
  // 图形
  static initShape () {
    const { graph } = this
    // 人群节点
    const r2 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 40,
      height: 40,
      label: '人群',
      name: 'people',
      attrs: {
        body: {
          fill: '#1790ff',
          stroke: '#1790ff',
          rx: 35,
          ry: 35
        },
        text: {
          fill: '#FFFFFF'
          // textWrap: {
          //   // text: '人群'
          // }
        }
      }
    })
    // 组节点
    const g1 = graph.createNode({
      name: 'group',
      shape: 'flowGroupNode',
      label: '策略',
      attrs: {
        body: {
          fill: 'orange',
          stroke: 'orange'
        },
        text: {
          fill: '#FFFFFF'
          // text: '策略'
        }
      },
      data: {
        parent: true
      }
    })

    // 添加到侧边栏中
    this.stencil.load([r2, g1], 'basicComponents')
    // this.stencil.load([g1], 'basicComponents')
  }
  // 展示链接点
  static showPorts (ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  // 初始化事件
  static initEvent () {
    const { graph } = this
    const container = document.getElementById('flowContainer')
    graph.on('node:mouseenter', FunctionExt.debounce(() => {
      const ports = container.querySelectorAll('.x6-port-body')
      this.showPorts(ports, true)
    }),
    500
    )
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body'
      )
      this.showPorts(ports, false)
    })
    // 扩展父节点
    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })
    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          parent.prop('originSize', parent.getSize())
        }
        originSize = parent.prop('originSize')

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          parent.prop('originPosition', parent.getPosition())
        }
        originPosition = parent.prop('originPosition')

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(30)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }
        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y }
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the `originPosition` and `originSize` in our handlers.
            { skipParentHandler: true }
          )
        }
      }
    })
  }
  // 销毁
  static destroy () {
    this.graph.dispose()
  }
}
