<template>
  <div id="g6">
    <!-- <div class="container">
      <div v-for="(item, index) in crowdList" :key="index">
        <div class="box" :style="returnStyle(index)">
        {{ item.crowdName }}
        </div>
      </div>
    </div> -->

    <G6Editor mode="edit" :data="data" :height="600">
    </G6Editor>
  </div>
</template>

<script>
import G6Editor from './components/G6Editor'
import eventBus from '@antvGraph/utils/eventBus'
// import { uniqueId } from '@antvGraph/utils'
export default {
  name: 'app',
  components: { G6Editor },
  data () {
    return {
      width: 0,
      height: 600,
      data: {},
      Y: -50,
      // X: 600,
      // Y: document.documentElement.clientHeight,
      X: 0,
      graph: null,
      crowdList: [{
        crowdId: 'dynamic1',
        crowdName: '动态1'
      }, {
        crowdId: 'dynamic2',
        crowdName: '动态2'
      }, {
        crowdId: 'dynamic3',
        crowdName: '动态3'
      }, {
        crowdId: 'dynamic4',
        crowdName: '动态4'
      }, {
        crowdId: 'dynamic5',
        crowdName: '动态5'
      }, {
        crowdId: 'dynamic6',
        crowdName: '动态6'
      }, {
        crowdId: 'dynamic7',
        crowdName: '动态7'
      }]
      // type: 1
    }
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  watch: {
    type: {
      handler (val) {
        if (val === 0 || val === 1) {
          this.init()
        } else if (val === 2) {
          this.initRandomNodes()
        } else {

        }
        console.log('this====', this.$children)
        this.readData()
      },
      immediate: true
    }
  },
  created () {
    // this.init()
  },
  mounted () {
    this.width = document.getElementById('g6').offsetWidth

    const _this = this
    eventBus.$on('afterAddPage', page => {
      _this.graph = page.graph
    })
  },
  methods: {
    returnStyle (index) {
      const obj = {

        radius: 200,
        // 每一个BOX对应的角度;
        avd: 0,
        // 每一个BOX对应的弧度;
        ahd: 0,
        dotLeft: 635,
        // 中心点纵坐标
        dotTop: 235
      }
      const len = this.crowdList.length
      // // 半径
      // this.radius = 200
      // // 每一个BOX对应的角度;
      obj.avd = 360 / len
      // 每一个BOX对应的弧度;
      obj.ahd = obj.avd * Math.PI / 180

      const ahd = obj.ahd
      const radius = obj.radius
      const dotLeft = obj.dotLeft
      const dotTop = obj.dotTop

      const left = Math.sin(ahd * index) * radius + dotLeft
      const top = Math.cos(ahd * index) * radius + dotTop

      console.log('left===', left)
      console.log('top===', top)
      return {
        left,
        top
      }
    },
    initRandomNodes () {
      const data = this.crowdList
      const commonObj = {
        size: [
          '170',
          '34'
        ],
        type: 'node',
        shape: 'customNode',
        color: '#1890ff',
        image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
        stateImage: '/static/img/ok.463ab0e4.svg'
      }
      let arr = data.map((item, index) => {
        const xy = this.returnStyle(index)

        const x = xy.left
        const y = xy.top

        return {
          ...commonObj,
          x,
          y,
          name: item.crowdName,
          label: item.crowdName,
          id: item.crowdId
        }
      })

      console.log('arr===>', arr)
      // 初始数据
      this.data = {
        nodes: arr
      }
    },
    readData () {
      let data = this.data
      if (data) {
        this.graph && this.graph.read(data)
      }
    },
    init () {
      // 初始数据
      this.data.nodes = this.initDefaultNodes()
      this.data.edges = this.initEdges(this.type)
    },
    initEdges (type) {
      let arr = []
      const data = this.crowdList
      const commonObj = {
        start: {
          x: 0,
          y: 17
        },
        end: {
          x: 0,
          y: -17
        },
        shape: 'customEdge',
        type: 'edge'
      }
      // 顺序
      if (type === 0) {
        data.reduce((current, item) => {
          arr.push({
            ...commonObj,
            source: current.crowdId,
            target: item.crowdId,
            sourceId: current.crowdId,
            targetId: item.crowdId
          })
          return item
        }, data[0])

        arr.shift()
      } else if (type === 1) { // 循环
        data.reduce((current, item) => {
          arr.push({
            ...commonObj,
            source: current.crowdId,
            target: item.crowdId,
            sourceId: current.crowdId,
            targetId: item.crowdId
          })
          return item
        }, data[0])

        arr.shift()

        arr.push({
          ...commonObj,
          source: data[data.length - 1].crowdId,
          target: data[0].crowdId,
          sourceId: data[data.length - 1].crowdId,
          targetId: data[0].crowdId
        })
      }

      return arr
    },

    initDefaultNodes () {
      const data = this.crowdList
      const commonObj = {
        size: [
          '170',
          '34'
        ],
        type: 'node',
        shape: 'customNode',
        color: '#1890ff',
        image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
        stateImage: '/static/img/ok.463ab0e4.svg'
        // inPoints: [[0, 0.5]],
        // outPoints: [[1, 0.5]]
      }
      // this.Y = -90
      // this.X = this.width / 2
      this.X = -200
      this.Y = this.height / 2
      console.log('this.X==', this.X)
      console.log('this.Y==', this.Y)
      let arr = data.map((item, index) => {
        const x = this.X += 300
        const y = this.Y += 1

        // const x = this.X += 1
        // const y = this.Y += 150
        return {
          ...commonObj,
          x,
          y,
          name: item.crowdName,
          label: item.crowdName,
          id: item.crowdId
        }
      })

      console.log('arr===>', arr)
      return arr
    }
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
