// import G6 from '@antv/g6';
import G6 from '@antv/g6/build/g6'
import { uniqueId } from '@antvGraph/utils'
const MIN_ARROW_SIZE = 3

const customEdge = {
  init () {
    const dashArray = [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 1, 1, 2],
      [0, 2, 1, 2],
      [1, 2, 1, 2],
      [2, 2, 1, 2],
      [3, 2, 1, 2],
      [4, 2, 1, 2]
    ]

    const lineDash = [4, 2, 1, 2]
    const interval = 9
    G6.registerEdge('customEdge', {
      draw (cfg, group) {
        let sourceNode, targetNode, start, end
        if (typeof (cfg.source) === 'string') {
          cfg.source = cfg.sourceNode
        }
        if (!cfg.start) {
          cfg.start = {
            x: 0,
            y: 17
          }
        }
        if (!cfg.end) {
          cfg.end = {
            x: 0,
            y: -17
          }
        }
        if (!cfg.source.x) {
          sourceNode = cfg.source.getModel()
          start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y }
        } else {
          start = cfg.source
        }
        if (typeof (cfg.target) === 'string') {
          cfg.target = cfg.targetNode
        }
        if (!cfg.target.x) {
          targetNode = cfg.target.getModel()
          end = { x: targetNode.x + cfg.end.x, y: targetNode.y + cfg.end.y }
        } else {
          end = cfg.target
        }

        let path = []
        let hgap = Math.abs(end.x - start.x)
        if (end.x > start.x) {
          path = [
            ['M', start.x, start.y],
            [
              'C',
              start.x,
              start.y + hgap / (hgap / 50),
              end.x,
              end.y - hgap / (hgap / 50),
              end.x,
              end.y - 4
            ],
            [
              'L',
              end.x,
              end.y
            ]
          ]
          // path = [[ 'M', start.x, start.y ],
          //   [ 'L', end.x / 3 + 2 / 3 * start.x, start.y ],
          //   [ 'L', end.x / 3 + 2 / 3 * start.x, end.y ],
          //   [ 'L', end.x, end.y ]]
        } else {
          // path = [[ 'M', start.x, start.y ],
          //   [ 'L', end.x / 3 + 2 / 3 * start.x, start.y ],
          //   [ 'L', end.x / 3 + 2 / 3 * start.x, end.y ],
          //   [ 'L', end.x, end.y ]]
          path = [
            ['M', start.x, start.y],
            [
              'C',
              start.x,
              // start.y + hgap / (hgap / 50),
              // end.x,
              // end.y - hgap / (hgap / 50),
              // end.x,
              end.y - 4
            ],
            [
              'L',
              end.x,
              end.y
            ]
          ]
        }
        let lineWidth = 1
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE
        const width = lineWidth * 10 / 3
        const halfHeight = lineWidth * 4 / 3
        const radius = lineWidth * 4
        const endArrowPath = [
          ['M', -width, halfHeight],
          ['L', 0, 0],
          ['L', -width, -halfHeight],
          ['A', radius, radius, 0, 0, 1, -width, halfHeight],
          ['Z']
        ]
        // ------------------------------

        // ------------------------------
        // const keyShape = group.addShape('path', {
        //   attrs: {
        //     id: 'edge' + uniqueId(),
        //     path: path,
        //     stroke: '#b8c3ce',
        //     lineAppendWidth: 10,
        //     endArrow: {
        //       path: endArrowPath
        //     }
        //   }
        // })
        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            // path: [
            //   [ 'M', cfg.startPoint.x, cfg.startPoint.y ],
            //   [ 'L', cfg.endPoint.x, cfg.endPoint.y ]
            // ],
            stroke: '#b8c3ce',
            lineAppendWidth: 20,
            lineWidth: 2,
            endArrow: {
              path: endArrowPath
            }
          }

        })

        // 定义的其他方法，都可以在draw里面调用， 如 drawShape、drawLabel 等。
        // this.drawShape()
        // const labelStyle = this.getLabelStyle(cfg)
        // console.log('labelStyle======', labelStyle)
        return keyShape
      },
      afterDraw (cfg, group) {
        if (cfg.source.getModel().isDoingStart && cfg.target.getModel().isDoingEnd) {
          const shape = group.get('children')[0]
          const length = shape.getTotalLength() // G 增加了 totalLength 的接口
          let totalArray = []
          for (var i = 0; i < length; i += interval) {
            totalArray = totalArray.concat(lineDash)
          }
          let index = 0
          shape.animate({
            onFrame () {
              const cfg = {
                lineDash: dashArray[index].concat(totalArray)
              }
              index = (index + 1) % interval
              return cfg
            },
            repeat: true
          }, 3000)
        }
      },
      setState (name, value, item) {
        const group = item.getContainer()
        const shape = group.get('children')[0]
        const selectStyles = () => {
          shape.attr('stroke', '#6ab7ff')
        }
        const unSelectStyles = () => {
          shape.attr('stroke', '#b8c3ce')
        }

        switch (name) {
          case 'selected':
          case 'hover':
            if (value) {
              selectStyles()
            } else {
              unSelectStyles()
            }
            break
        }
      }
    })
    G6.registerEdge('link-edge', {
      draw (cfg, group) {
        let sourceNode, targetNode, start, end
        if (!cfg.source.x) {
          sourceNode = cfg.source.getModel()
          start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y }
        } else {
          start = cfg.source
        }
        if (!cfg.target.x) {
          targetNode = cfg.target.getModel()
          end = { x: targetNode.x + cfg.end.x, y: targetNode.y + cfg.end.y }
        } else {
          end = cfg.target
        }

        let path = []
        path = [
          ['M', start.x, start.y],
          ['L', end.x, end.y]
        ]
        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            stroke: '#1890FF',
            strokeOpacity: 0.9,
            lineDash: [5, 5]
          }
        })
        return keyShape
      }
    })
  }
}

export default customEdge