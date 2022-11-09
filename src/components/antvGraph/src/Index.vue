<template>
  <div id="g6">
    <!-- <div class="container">
      <div v-for="(item, index) in crowdList" :key="index">
        <div class="box" :style="returnStyle(index)">
        {{ item.crowdName }}
        </div>
      </div>
    </div> -->
    <G6Editor mode="edit" :data="flowChartData" :height="height" :width="width">
    </G6Editor>
  </div>
</template>

<script>
import G6Editor from './components/G6Editor'
import eventBus from '@antvGraph/utils/eventBus'
// import { uniqueId } from '@antvGraph/utils'
import CreateNodesAndEdges from './createNodesAndEdges'
export default {
  name: 'app',
  components: { G6Editor },
  // provide () {
  //   return {
  //     graphData: () => this.data
  //   }
  // },
  data () {
    return {
      width: 0,
      // height: 600,
      flowChartData: {},
      Y: -50,
      // X: 600,
      // Y: document.documentElement.clientHeight,
      X: 0,
      graph: null,
      crowdList: [],
      commonObj: {
        size: [
          150,
          40
        ],
        type: 'node',
        shape: 'customNode',
        color: '#1890ff'
        // image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
        // stateImage: '/static/img/ok.463ab0e4.svg'
      }

    }
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    currentGraphData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    currentGraphData: {
      handler () {
        this.crowdList = this.currentGraphData.allCrowd || {}

        if (this.crowdList.length === 0) { // 方案（小人群）至少有一个
          return
        }

        // 编辑 直接使用传入的json
        if (this.currentGraphData.flowChart) {
          this.flowChartData = JSON.parse(this.currentGraphData.flowChart)
        } else {
          const createNodesAndEdges = new CreateNodesAndEdges(this.type, this.crowdList, this.commonObj, this.height)
          // 新增（初始化）
          // 顺序，循环没有权重；随机，自定义有权重；
          this.flowChartData.nodes = []
          this.flowChartData.edges = []

          if (this.type === 3) { // 3-自定义 算法
            this.flowChartData.nodes = createNodesAndEdges.initDefaultNodes()
            this.flowChartData.edges = []
          } else if (this.type === 2) { // 2-随机 算法
            this.flowChartData.nodes = createNodesAndEdges.initRandomNodes()
            this.flowChartData.edges = []
          } else { // 0-顺序、1-循环、4-不流转 、5-算法
            // 初始数据
            this.flowChartData.nodes = createNodesAndEdges.initDefaultNodes()
            this.flowChartData.edges = createNodesAndEdges.initEdges() // 区分顺序、循环、不流转
          }
        }
        this.readData()
      },
      deep: true,
      immediate: true
    }
    // type: {
    //   handler (val) {

    //   },
    //   immediate: true
    // }

  },
  computed: {
    height () {
      return document.documentElement.clientHeight - 225
    }
  },
  created () {
    const _this = this
    eventBus.$on('afterAddPage', page => {
      _this.graph = page.graph
    })
  },
  mounted () {
    // 画布宽度
    this.width = document.getElementsByClassName('c-scrollbar--box')[0].offsetWidth - 40
  },
  methods: {

    // 刷新数据，渲染图表
    readData () {
      const flowChartData = this.flowChartData
      if (flowChartData) {
        // this.graph.clear()
        this.graph && this.graph.refresh(flowChartData)
      }
      if (this.graph) {
        this.graph.refresh()
        this.graph.read(flowChartData)
      }
    }
    // init () {
    //   // 初始数据
    //   this.flowChartData.nodes = this.initDefaultNodes()
    //   this.flowChartData.edges = this.initEdges(this.type)
    // },
    // // 初始化连线
    // initEdges (type) {
    //   let arr = []
    //   const data = this.crowdList
    //   const commonObj = {
    //     start: {
    //       x: 0,
    //       y: 17
    //     },
    //     end: {
    //       x: 0,
    //       y: -17
    //     },
    //     shape: 'customEdge',
    //     type: 'edge'
    //   }
    //   // 顺序
    //   if (type === 0 || type === 1) {
    //     data.reduce((current, item) => {
    //       arr.push({
    //         ...commonObj,
    //         source: current.crowdId.toString(),
    //         target: item.crowdId.toString(),
    //         sourceId: current.crowdId.toString(),
    //         targetId: item.crowdId.toString()
    //       })
    //       return item
    //     }, data[0])

    //     arr.shift()
    //   }
    //   if (type === 1) { // 循环
    //     arr.push({
    //       ...commonObj,
    //       label: '权重',
    //       source: (data[data.length - 1].crowdId).toString(),
    //       target: (data[0].crowdId).toString(),
    //       sourceId: (data[data.length - 1].crowdId).toString(),
    //       targetId: (data[0].crowdId).toString()
    //     })
    //   }

    //   return arr
    // },

    // // 初始化节点
    // initDefaultNodes () {
    //   const data = this.crowdList
    //   const commonObj = this.commonObj
    //   const height = this.height

    //   if (this.type === 3) { // 自定义
    //     commonObj.inPoints = [[0, 0.5]]
    //     commonObj.outPoints = [[1, 0.5]]
    //   } else { // 其他流转算法没有出入口
    //     commonObj.inPoints = undefined
    //     commonObj.outPoints = undefined
    //   }
    //   // this.Y = -90
    //   // this.X = this.width / 2
    //   this.X = -200
    //   this.Y = height / 2
    //   let arr = data.map((item, index) => {
    //     const x = this.X += 300
    //     const y = this.Y += 1

    //     // const x = this.X += 1
    //     // const y = this.Y += 150
    //     const obj = {
    //       ...commonObj,
    //       ...item,
    //       x,
    //       y,
    //       name: item.crowdName,
    //       label: item.crowdName,
    //       id: item.crowdId.toString(),
    //       arithmetic: null,
    //       weight: null,
    //       degree: 5
    //     }

    //     if (this.type === 3) { // 自定义
    //       obj.arithmetic = item.arithmetic ? item.arithmetic : 2
    //       obj.weight = item.weight
    //     }

    //     return obj
    //   })

    //   return arr
    // },

    // // 初始化随机节点
    // initRandomNodes () {
    //   const data = this.crowdList
    //   const commonObj = this.commonObj

    //   if (this.type === 3) { // 自定义
    //     commonObj.inPoints = [[0, 0.5]]
    //     commonObj.outPoints = [[1, 0.5]]
    //   } else { // 其他流转算法没有出入口
    //     commonObj.inPoints = undefined
    //     commonObj.outPoints = undefined
    //   }

    //   let arr = data.map((item, index) => {
    //     const xy = this.returnStyle(index)

    //     const x = xy.left
    //     const y = xy.top

    //     return {
    //       ...commonObj,
    //       ...item,
    //       x,
    //       y,
    //       name: item.crowdName,
    //       label: item.crowdName,
    //       id: item.crowdId.toString(),
    //       arithmetic: null
    //     }
    //   })

    //   // 初始数据
    //   // this.data = {
    //   //   nodes: arr
    //   // }

    //   return arr
    // },

    // returnStyle (index) {
    //   const obj = {

    //     radius: 200,
    //     // 每一个BOX对应的角度;
    //     avd: 0,
    //     // 每一个BOX对应的弧度;
    //     ahd: 0,
    //     dotLeft: 635,
    //     // 中心点纵坐标
    //     dotTop: 235
    //   }
    //   const len = this.crowdList.length
    //   // // 半径
    //   // this.radius = 200
    //   // // 每一个BOX对应的角度;
    //   obj.avd = 360 / len
    //   // 每一个BOX对应的弧度;
    //   obj.ahd = obj.avd * Math.PI / 180

    //   const ahd = obj.ahd
    //   const radius = obj.radius
    //   const dotLeft = obj.dotLeft
    //   const dotTop = obj.dotTop

    //   const left = Math.sin(ahd * index) * radius + dotLeft
    //   const top = Math.cos(ahd * index) * radius + dotTop

    //   return {
    //     left,
    //     top
    //   }
    // }
  }
}
</script>

<style lang="stylus" scoped>
html, body {
    overflow: hidden;
    margin: 0;
    font-size: 12px;
}
#app{
  margin: 0;
  padding: 0;
}
.container
  position relative
  width 500px
  height 500px
  border 1px solid blue
.box
  width 30px
  height 30px
  display: inline-block;
  border 1px solid red
  position absolute

</style>
