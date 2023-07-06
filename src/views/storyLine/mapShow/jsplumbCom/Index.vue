<template>
  <div
    id="canvas"
    class="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan"
  >
<!-- {{ relations }}
  {{ groupServicer }} -->
  <!-- :style="{
    left: positionObj[`${idPer}${index}`].x + 'px',
    top: positionObj[`${idPer}${index}`].y + 'px'}" -->
    <div
      v-for="(group, index) in groupServicer"
      :key="group.groupId ? group.groupId : group.id"
      class="item-container window"
      :style="{
        left: positionObj[`${idPer}${index}`].x + 'px',
        top: positionObj[`${idPer}${index}`].y + 'px'}"
      :id="idPer + index"
    >
      <div v-if="group.groupId" class="group-container" :style="{ width: group.child.length === 1  ? '150px': '425px' }">
        <div v-for="item in group.child" :key="item.id">
          <!-- {{ item.receptionist }} -->
          <!-- {{ item.id }} -->
          <servicerCom
            style="float: left; margin: 20px"
            :info="item"
            :idPer="idPer"
            @selectServicer="id => $emit('selectServicer', id)"
            @showRuleDetail="item => $emit('showRuleDetail', item)"
          ></servicerCom>
        </div>
      </div>

      <div v-else >
        <!-- {{ group.id }} -->
        <servicerCom
          :info="group"
          :idPer="idPer"
          @selectServicer="id => $emit('selectServicer', id)"
          @showRuleDetail="item => $emit('showRuleDetail', item)"
        >
        </servicerCom>
      </div>

  </div>
</div>
</template>
<script>
import { jsPlumb } from 'jsplumb'
import servicerCom from './servicerCom'
// import myMinix from './minix'
import setMoveAndDrag from './setMoveAndDrag'
import { DagreLayout } from '@antv/layout'

export default {
  name: 'js-group',
  components: {
    servicerCom
  },
  // mixins: [myMinix],
  props: {
    // 节点信息
    groupServicer: {
      type: Array,
      default: () => []
    },
    // 连线信息
    relations: {
      type: Array,
      default: () => []
      // ['0_out_2uuu', '1_i1231n'],
      // ['1_in1231313', '0_45in_4'],
    }
  },
  data () {
    return {
      dagreModel: {},
      idPer: 'ccc',
      // jsPlumb 实例
      j: '',
      positionObj: {}, // 位置信息
      setJsplumbObj: {
        Container: 'canvas',
        // 连线的样式
        Connector: 'StateMachine', // 直线
        // DragOptions: { cursor: 'pointer', zIndex: 2000 },

        // Connector: ['Bezier', { curviness: 50 }],
        Endpoint: ['Dot', { radius: 2 }],
        // Endpoint: 'Blank',
        // 绘制连线
        PaintStyle: { stroke: '#1890ff80', strokeWidth: 2 },
        // EndpointStyle: { radius: 5, fill: 'gray' },
        // hover 上去的样式
        // HoverPaintStyle: { stroke: 'blue', strokeWidth: 2 },
        HoverPaintStyle: { stroke: '#1e8151', strokeWidth: 2 },
        // 锚点
        Anchor: 'Center',
        // 箭头
        ConnectionOverlays: [
          [
            'Arrow',
            {
              location: 1,
              id: 'arrow',
              length: 8,
              width: 8,
              foldback: 0.8,
              zIndex: 3
            }
          ]
        ],
        // 添加 overlay，如箭头
        Overlays: [['Arrow', { width: 8, length: 8, location: 1 }]] // overlay
      }
    }
  },
  created () {
    // 获取元素位置
    this.groupServicer.forEach((item, index) => {
      const id = `${this.idPer}${index}`
      const obj = {
        x: 0,
        y: 0
      }
      this.$set(this.positionObj, id, obj)
    })

    // console.log('relations-->', this.relations)
  },
  mounted () {
    // 通过 @antv/layout 获取元素节点的位置信息
    this.getLocationByAntvLayout()

    // 1、创建 jsPlumb 实例
    // 2、将元素的位置信息统一保存在一个对象里，将元素设为绝对定位元素
    // 3、创建所有节点连接
    this.initJsPlumb()

    // 设置画布可拖拽，滚动放大缩小
    setMoveAndDrag('#wrap', '#canvas')
  },
  methods: {
    // 通过 @antv/layout 获取元素节点
    getLocationByAntvLayout () {
      const IndexRelationsForDagreLayout = this.getParentIndexRelations(this.relations)
      console.log('1111111111111->>>>', IndexRelationsForDagreLayout)

      const nodes = this.groupServicer.map((item, index) => {
        return {
          id: `${this.idPer}${index}`,
          // comboId: `${this.idPer}${index}`,
          width: 400,
          height: 100
        }
      })

      const edges = IndexRelationsForDagreLayout.map(item => {
        return {
          source: `${this.idPer}${item[0]}`,
          target: `${this.idPer}${item[1]}`
        }
      })

      const model = {
        nodes,
        edges
      }

      const dagreLayout = new DagreLayout({
        type: 'dagre',
        rankdir: 'TB',
        // align: "UL",
        // ranksep: 7,
        // nodesep: 5,
        // rankdir: 'LR',
        // align: 'UL',
        nodesepFunc: () => 50,
        ranksepFunc: () => 70,
        controlPoints: true,
        sortByCombo: false
      })

      const dagreModel = dagreLayout.layout(model)
      console.log('333333333333333dagreModel--->', dagreModel)
      this.dagreModel = dagreModel
    },
    // 1、创建 jsPlumb 实例
    // 2、将元素的位置信息统一保存在一个对象里，将元素设为绝对定位元素
    // 3、创建所有节点连接
    initJsPlumb () {
      const _this = this
      jsPlumb.ready(() => {
      // 1、创建 jsPlumb 实例
        this.j = (window.j = jsPlumb.getInstance(this.setJsplumbObj))
        const j = this.j

        j.registerConnectionType('basic', {
          anchor: 'Continuous',
          connector: 'StateMachine'
        })

        j.batch(() => {
          const windows = jsPlumb.getSelector('.flowchart-demo .window')
          // 可拖动
          for (let i = 0; i < windows.length; i++) {
            _this.initNode(windows[i], j)
          }

        // j.repaintEverything()
        })
        // 2、将元素的位置信息统一保存在一个对象里，将元素设为绝对定位元素
        this.adjust()

        this.$nextTick(() => {
        // 3、创建所有节点连接
          this.createConnections(this.relations)
        })
      })
    // j.draggable(jsPlumb.getSelector('.flowchart-demo .window'))
    },

    // getLeftTop (id, type) {
    //   this.$nextTick(() => {

    //   })
    //   console.log('22222222222222----------------->', this.dagreModel)
    //   const nodes = this.dagreModel.nodes
    //   const obj = nodes.find(item => item.id === id)
    //   return type === 'left' ? obj.x + 'px' : obj.y + 'px'
    // },
    getParentIndexRelations (edges) {
      console.log('relations-->', edges)
      return edges.map(itemArr => {
        console.log('itemArr', itemArr)
        const source = itemArr[0]
        const target = itemArr[1]
        const sourceParentIndex = this.getParentIndex(source)
        const targetParentIndex = this.getParentIndex(target)
        return [sourceParentIndex, targetParentIndex]
      })
    },
    getParentIndex (id) {
      let returnId
      const currertId = Number(id)
      const nodes = this.groupServicer
      console.log('groupServicer-->', nodes)
      const len = nodes.length
      for (let i = 0; i < len; i++) {
        const node = nodes[i]
        // 分组的
        if (node.groupId) {
          const servicerList = node.child
          for (let y = 0; y < servicerList.length; y++) {
            const servicer = servicerList[y]
            const conditions = [...servicer.entryConditions, ...servicer.exportConditions]
            const findIndex = conditions.findIndex(item => Number(item.id) === currertId)

            if (Number(servicer.id) === currertId || findIndex > -1) {
              returnId = i
              break
            }
          }
        } else {
          const conditions = [...node.entryConditions, ...node.exportConditions]

          const findIndex = conditions.findIndex(item => Number(item.id) === currertId)

          if (Number(node.id) === currertId || findIndex > -1) {
            returnId = i
          }
        }
      }
      return returnId
    },
    initNode (el, instance) {
      // initialise draggable elements.
      instance.draggable(el)

      instance.makeSource(el, {
        filter: '.ep',
        anchor: 'Continuous',
        connectorStyle: {
          stroke: '#5c96bc',
          strokeWidth: 2,
          outlineStroke: 'transparent',
          outlineWidth: 0
        },
        connectionType: 'basic',
        extract: {
          action: 'the-action'
        }
        // maxConnections: 2,
        // onMaxConnections (info, e) {
        //   alert(`Maximum connections (${info.maxConnections}) reached`)
        // }
      })

      instance.makeTarget(el, {
        dropOptions: { hoverClass: 'dragHover' },
        anchor: 'Continuous',
        allowLoopback: true
      })

      // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
      // version of this demo to find out about new nodes being added.
      //
      instance.fire('jsPlumbDemoNodeAdded', el)
    },
    adjust () {
      // 获取元素位置
      // this.groupServicer.forEach((item, index) => {
      //   this.getXY(index)
      // })

      const nodes = this.dagreModel.nodes
      nodes.forEach(item => {
        const obj = {
          x: item.x,
          y: item.y
        }
        // this.$set(this.positionObj, id, obj)
        this.positionObj[item.id] = obj
      })
      // obj.x + 'px' : obj.y + 'px'

      // 统一将元素设为绝对定位元素
      const items = document.getElementsByClassName('item-container')
      for (let i = 0, len = items.length; i < len; i++) {
        items[i].style.position = 'absolute'
      }
    },
    createConnections (relations) {
      // 添加连线
      for (const item of relations) {
        this.addconnect(item[0], item[1])
      }
    },
    // 添加连线
    addconnect (source, target) {
      // debugger
      const sourceId = `${this.idPer}${source}`
      const targetId = `${this.idPer}${target}`

      const sourceDom = document.getElementById(sourceId)
      const targetDom = document.getElementById(targetId)

      this.j.connect({ source: sourceDom, target: targetDom, type: 'basic' })
    }

    // getXY (index) {
    //   // debugger
    //   const id = `${this.idPer}${index}`
    //   const dom = document.getElementById(id)
    //   const poOffsetLeft = dom.offsetLeft
    //   const poOffsetTop = dom.offsetTop
    //   const initialPosition = [30, 50] // 起点位置
    //   const obj = {
    //     x: poOffsetLeft + initialPosition[0],
    //     y: poOffsetTop + initialPosition[1]
    //   }
    //   // this.$set(this.positionObj, id, obj)
    //   this.positionObj[id] = obj
    //   console.log(' positionObj--->', this.positionObj)
    //   // console.log('poOffsetLeft-->', 'poOffsetTop--->', poOffsetLeft, poOffsetTop)
    //   // const numer = index + 1
    //   // const rowTotal = 3
    //   // const size = [500, 300]

    //   // const x = (index % rowTotal) * size[0]
    //   // const y = (Math.ceil(numer / rowTotal) - 1) * size[1]
    //   // return {
    //   //   x, y
    //   // }
    // }

  }
}
</script>

<style scoped lang="stylus">
@import './style.styl'

</style>
