<template>
  <div
    id="canvas"
    class="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan"
  >

    <div
      v-for="(group, index) in groupServicer"
      :key="group.groupId ? group.groupId : group.id"
      class="item-container window"
      :style="{left: positionObj[`c${index}`].x + 'px', top: positionObj[`c${index}`].y + 'px'}"
      :id="idPer + index"
    >
      <!-- {{ positionObj[`c${index}`] }} -->
      <!-- :style="{left: getXY(index).x + 'px', top: getXY(index).y + 'px'}" -->
      <div v-if="group.groupId" class="group-container">
        <div v-for="item in group.child" :key="item.id">
          <!-- {{ item.receptionist }} -->
          <servicerCom
            style="float: left; margin: 20px"
            :info="item"
          ></servicerCom>
        </div>
      </div>

      <div v-else >
        <!-- {{ group.receptionist }} -->
        <servicerCom :info="group"></servicerCom>
      </div>

  </div>
</div>
</template>
<script>
import { jsPlumb } from 'jsplumb'
import servicerCom from './servicerCom'
// import myMinix from './minix'
import setMoveAndDrag from './setMoveAndDrag'

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
      idPer: 'c',
      // jsPlumb 实例
      j: '',
      positionObj: {}, // 位置信息
      setJsplumbObj: {
        Container: 'canvas',
        // 连线的样式
        Connector: 'StateMachine',
        // Endpoint: ['Dot', { radius: 3 }],
        Endpoint: 'Blank',
        // 绘制连线
        PaintStyle: { stroke: '#000', strokeWidth: 2 },
        // hover 上去的样式
        HoverPaintStyle: { stroke: 'blue', strokeWidth: 2 },
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
  },
  mounted () {
    jsPlumb.ready(() => {
      // 创建实例
      this.j = (window.j = jsPlumb.getInstance(this.setJsplumbObj))
      const j = this.j

      j.batch(() => {
        // 可拖动
        j.draggable(jsPlumb.getSelector('.flowchart-demo .window'))

        // 创建所有节点连接
        this.createConnections(this.relations)

        // j.repaintEverything()
      })
    })

    // 获取节点的位置, 然后将元素设为绝对定位元素
    this.adjust()

    // 设置画布可拖拽，滚动放大缩小
    setMoveAndDrag('#wrap', '#canvas')
  },
  methods: {
    adjust () {
      // 获取元素位置
      this.groupServicer.forEach((item, index) => {
        this.getXY(index)
      })
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
      const sourceDom = document.getElementById(source)
      const targetDom = document.getElementById(target)
      this.j.connect({ source: sourceDom, target: targetDom })
    },
    getXY (index) {
      debugger
      const id = `c${index}`
      const dom = document.getElementById(id)
      const poOffsetLeft = dom.offsetLeft
      const poOffsetTop = dom.offsetTop
      const obj = {
        x: poOffsetLeft,
        y: poOffsetTop
      }
      // this.$set(this.positionObj, id, obj)
      this.positionObj[id] = obj
      console.log(' positionObj--->', this.positionObj)
      // console.log('poOffsetLeft-->', 'poOffsetTop--->', poOffsetLeft, poOffsetTop)
      // const numer = index + 1
      // const rowTotal = 3
      // const size = [500, 300]

      // const x = (index % rowTotal) * size[0]
      // const y = (Math.ceil(numer / rowTotal) - 1) * size[1]
      // return {
      //   x, y
      // }
    }

  }
}
</script>

<style scoped lang="stylus">
@import './style.styl'

</style>
