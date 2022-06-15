import G6 from '@antv/g6/build/g6'
import { uniqueId } from '@antvGraph/utils'
// import Shape from '@antv/g6/src/shapes'

/** 参数说明：
   * 根据长度截取先使用字符串，超长部分追加…
   * str 对象字符串
   * len 目标字节长度
   * 返回值： 处理结果字符串
   */
function cutString (str, len) {
  // length属性读出来的汉字长度为1
  if (str.length * 2 <= len) {
    return str
  }
  var strlen = 0
  var s = ''
  for (var i = 0; i < str.length; i++) {
    s = s + str.charAt(i)
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2
      if (strlen >= len) {
        return s.substring(0, s.length - 1) + '...'
      }
    } else {
      strlen = strlen + 1
      if (strlen >= len) {
        return s.substring(0, s.length - 2) + '...'
      }
    }
  }
  return s
}

const EXPAND_ICON = function EXPAND_ICON (x, y, r) {
  return [
    ['M', x - r, y - r],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x + 2 - r, y - r],
    ['L', x + r - 2, y - r],
    ['M', x, y - 2 * r + 2],
    ['L', x, y - 2]
  ]
}
const condition = {
  1: '定向',
  2: '随机',
  3: '终止'
}
const customNode = {
  init () {
    G6.registerNode('customNode', {
      draw (cfg, group) {
        let size = cfg.size
        if (!size) {
          size = [170, 34]
        }
        // 此处必须是NUMBER 不然bbox不正常1
        const width = parseInt(size[0])
        const height = parseInt(size[1])
        const color = cfg.color
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2
        const mainId = 'rect' + uniqueId()
        const shape = group.addShape('rect', {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: '#ced4d9',
            fill: '#fff', // 此处必须有fill 不然不能触发事件
            radius: 4
          }
        })
        // ---------------------------------------------
        // group.addShape('marker', {
        //   attrs: {
        //     x: 90,
        //     y: 9,
        //     r: 6,
        //     stroke: '#707070',
        //     cursor: 'pointer',
        //     symbol: EXPAND_ICON
        //   },
        //   name: 'add-item'
        // })
        // group.addShape('dom', {
        //   attrs: {
        //     width: 20,
        //     height: 20,
        //     html: `
        //       <span style="margin:auto; padding:auto; color: #5B8FF9">${cfg.label}</span>
        //       `
        //   }
        // })

        // 出口条件
        // if (cfg.arithmetic) {
        //   const innerCircle = group.addShape('text', {
        //     attrs: {
        //       x: offsetX + width / 2 + 10,
        //       y: offsetY + height + 20,
        //       cursor: 'pointer',
        //       label: 'aaaaa',
        //       text: condition[cfg.arithmetic],
        //       fill: color
        //     }
        //   })
        //   innerCircle.set('className', 'changeArithmeticType')
        // }

        // 权重
        if (cfg.weight !== null && cfg.weight !== undefined) { // 这里不能直接判断 cfg.weight ,因为有值为 0 的情况
          const weightText = group.addShape('text', {
            attrs: {
              x: -(width / 2),
              y: offsetY + height + 20,
              cursor: 'pointer',
              label: 'aaaaa',
              text: '权重：' + cfg.weight,
              fill: color
            }
          })
          weightText.set('className', 'changeWeight')
        }
        group.addShape('text', {
          attrs: {
            x: -(width / 2) + 90,
            y: offsetY + height + 20,
            cursor: 'pointer',
            label: 'aaaaa',
            text: `id:  ${cfg.id}`,
            fill: color
          }
        })

        // 流转条件 设置className属性
        const innerCircle1 = group.addShape('rect', {
          attrs: {
            x: width / 2 - 56,
            y: offsetY + height / 2 - 10,
            text: '流转条件',
            width: 56,
            height: 20,
            fill: color,
            parent: mainId,
            radius: 4
          }
        })
        const innerCircle2 = group.addShape('text', {
          attrs: {
            x: width / 2 - 50,
            y: offsetY + height / 2,
            // textAlign: 'center',
            textBaseline: 'middle',
            parent: mainId,
            text: '流转条件',
            fill: '#fff'
          }
        })
        innerCircle1.set('className', 'aaaa')
        innerCircle2.set('className', 'aaaa')

        // group.addShape('image', {
        //   attrs: {
        //     x: offsetX + width - 32,
        //     y: offsetY + 8,
        //     width: 16,
        //     height: 16,
        //     parent: mainId,
        //     img: arrow
        //   }
        // })

        // ------------------------------------------------
        group.addShape('rect', {
          attrs: {
            x: offsetX,
            y: offsetY,
            width: 4,
            height: height,
            fill: color,
            parent: mainId,
            radius: [4, 0, 0, 4]
          }
        })
        // group.addShape('image', {
        //   attrs: {
        //     x: offsetX + 16,
        //     y: offsetY + 8,
        //     width: 20,
        //     height: 16,
        //     img: cfg.image,
        //     parent: mainId
        //   }
        // })

        // if (cfg.backImage) {
        // const clip = new Shape.Rect({
        //   attrs: {
        //     x: offsetX,
        //     y: offsetY,
        //     width: width,
        //     height: height,
        //     fill: '#fff',
        //     radius: 4
        //   }
        // })
        // group.addShape('image', {
        //   attrs: {
        //     x: offsetX,
        //     y: offsetY,
        //     width: width,
        //     height: height,
        //     img: cfg.backImage,
        //     clip: clip
        //   }
        // })
        // }
        if (cfg.label) {
          var str = cfg.label
          // eslint-disable-next-line no-control-regex
          str = str.replace(/[^\x00-\xff]/g, '$&\x01').replace(/.{10}\x01?/g, '$&\n').replace(/\x01/g, '')
          if (str.length > 15) {
            str = cutString(str, 20)
          }

          group.addShape('text', {
            attrs: {
              id: 'label' + uniqueId(),
              // x: offsetX + width / 2 - 70,
              // y: offsetY + height / 2,
              x: offsetX + width / 2 - 70,
              y: offsetY + height / 2 - 12,
              textAlign: 'middle',
              textBaseline: 'top',
              text: str,
              parent: mainId,
              fill: '#333',
              fontSize: 14,
              lineWidth: 20,
              width: 30
            }
          })
          // group.addShape('rect', {
          //   attrs: {
          //     id: 'label' + uniqueId(),
          //     x: offsetX + width / 2,
          //     y: offsetY + height / 2,
          //     textAlign: 'center',
          //     textBaseline: 'middle',
          //     text: '设置流转条件',
          //     parent: mainId,
          //     fill: '#565758'
          //   }
          // })
          // group.addShape('button', {
          //   attrs: {
          //     x: 0,
          //     y: 0,
          //     width: 40,
          //     height: 40,
          //     fill: color,
          //     parent: mainId,
          //     radius: [4, 0, 0, 4]

          //   }
          // })
        }

        if (cfg.inPoints) {
          for (let i = 0; i < cfg.inPoints.length; i++) {
            let x
            let y = 0
            // 0为顶 1为底
            if (cfg.inPoints[i][0] === 0) {
              y = 0
            } else {
              y = height
            }
            x = width * cfg.inPoints[i][1]
            const id = 'circle' + uniqueId()
            group.addShape('circle', {
              attrs: {
                id: 'circle' + uniqueId(),
                parent: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 10,
                isInPointOut: true,
                fill: '#1890ff',
                opacity: 0
              }
            })
            group.addShape('circle', {
              attrs: {
                id: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 3,
                isInPoint: true,
                fill: '#fff',
                stroke: '#1890ff',
                opacity: 0
              }
            })
            // group.addShape('circle', {
            //   attrs: {
            //     id: 'circle' + uniqueId(),
            //     parent: id,
            //     x: -x,
            //     y: 0,
            //     r: 10,
            //     isInPointOut: true,
            //     fill: '#1890ff',
            //     opacity: 0
            //   }
            // })
            // group.addShape('circle', {
            //   attrs: {
            //     id: id,
            //     x: -x,
            //     y: 0,
            //     r: 3,
            //     isInPoint: true,
            //     fill: '#fff',
            //     stroke: '#1890ff',
            //     opacity: 0
            //   }
            // })
          }
        }
        if (cfg.outPoints) {
          for (let i = 0; i < cfg.outPoints.length; i++) {
            let x
            let y = 0
            // 0为顶 1为底
            if (cfg.outPoints[i][0] === 0) {
              y = 0
            } else {
              y = height
            }
            x = width * cfg.outPoints[i][1]
            const id = 'circle' + uniqueId()
            group.addShape('circle', {
              attrs: {
                id: 'circle' + uniqueId(),
                parent: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 10,
                isOutPointOut: true,
                fill: '#1890ff',
                opacity: 0// 默認0 需要時改成0.3
              }
            })
            group.addShape('circle', {
              attrs: {
                id: id,
                x: x + offsetX,
                y: y + offsetY,
                r: 3,
                isOutPoint: true,
                fill: '#fff',
                stroke: '#1890ff',
                opacity: 0
              }
            })
            // group.addShape('circle', {
            //   attrs: {
            //     id: 'circle' + uniqueId(),
            //     parent: id,
            //     x: x,
            //     y: 0,
            //     r: 10,
            //     isOutPointOut: true,
            //     fill: '#1890ff',
            //     opacity: 0// 默認0 需要時改成0.3
            //   }
            // })
            // group.addShape('circle', {
            //   attrs: {
            //     id: id,
            //     x: x,
            //     y: 0,
            //     r: 3,
            //     isOutPoint: true,
            //     fill: '#fff',
            //     stroke: '#1890ff',
            //     opacity: 0
            //   }
            // })
          }
        }
        // group.sort()
        // 添加文本、更多图形
        return shape
      },
      // 设置状态
      setState (name, value, item) {
        const group = item.getContainer()
        const shape = group.get('children')[0] // 顺序根据 draw 时确定

        const children = group.findAll(g => {
          return g._attrs.parent === shape._attrs.id
        })
        const circles = group.findAll(circle => {
          return circle._attrs.isInPoint || circle._attrs.isOutPoint
        })
        const selectStyles = () => {
          shape.attr('fill', '#f3f9ff')
          shape.attr('stroke', '#6ab7ff')
          shape.attr('cursor', 'move')
          children.forEach(child => {
            child.attr('cursor', 'move')
          })
          circles.forEach(circle => {
            circle.attr('opacity', 1)
          })
        }
        const unSelectStyles = () => {
          shape.attr('fill', '#fff')
          shape.attr('stroke', '#ced4d9')
          circles.forEach(circle => {
            circle.attr('opacity', 0)
          })
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
  }
}

export default customNode
