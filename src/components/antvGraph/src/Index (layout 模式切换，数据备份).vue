<template>
  <div id="g6">
    <!-- <div class="container">
      <div v-for="(item, index) in crowdList" :key="index">
        <div class="box" :style="returnStyle(index)">
        {{ item.crowdName }}
        </div>
      </div>
    </div> -->
    <G6Editor mode="edit" :data="data" :height="600" :width="width">
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
  provide () {
    return {
      dynamicRuleProvide: this.dynamicRule
    }
  },
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
      // crowdList: [{
      //   crowdId: 'dynamic1',
      //   crowdName: '动态1'
      // }, {
      //   crowdId: 'dynamic2',
      //   crowdName: '动态2'
      // }, {
      //   crowdId: 'dynamic3',
      //   crowdName: '动态3'
      // }, {
      //   crowdId: 'dynamic4',
      //   crowdName: '动态4'
      // }, {
      //   crowdId: 'dynamic5',
      //   crowdName: '动态5'
      // }, {
      //   crowdId: 'dynamic6',
      //   crowdName: '动态6'
      // }, {
      //   crowdId: 'dynamic7',
      //   crowdName: '动态7'
      // }]
      // type: 1
    }
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    dynamicRule: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    dynamicRule: {
      handler () {
        this.crowdList = this.dynamicRule.allCrowd || {}

        if (this.type === 3) { // 随机 、编辑模式
          const defaultNodes = this.initDefaultNodes()
          console.log('this.data.nodes===>1111111', defaultNodes)

          // this.data.nodes = this.initDefaultNodes()
          if (this.dynamicRule.flowChart) { // 编辑数据
            const flowChart = JSON.parse(this.dynamicRule.flowChart)
            console.log('flowChart===', flowChart)

            this.data.nodes = defaultNodes.map(defaultObj => {
              const editObj = flowChart.nodes.find(node => {
                return node.crowdId === defaultObj.crowdId
                // console.log('node============>', node)
              })
              // console.log('defaultObj============>', defaultObj)

              if (editObj) {
                return {
                  ...editObj,
                  ...defaultObj,
                  x: editObj.x, // 位置 - 接口传递的
                  y: editObj.y, // 位置 - 接口传递的
                  inPoints: defaultObj.inPoints, // 入口点 - 默认的
                  outPoints: defaultObj.outPoints // 入口点 - 默认的
                }
                // return {
                //   // arithmetic: 2,
                //   // dynamicJson: '',
                //   color: defaultObj.color,
                //   crowdId: defaultObj.crowdId,
                //   crowdName: defaultObj.crowdName,
                //   degree: 1,
                //   id: defaultObj.id,
                //   inPoints: defaultObj.inPoints, // 入口点 - 默认的
                //   label: defaultObj.label,
                //   name: defaultObj.name,
                //   outPoints: defaultObj.outPoints, // 入口点 - 默认的
                //   policyId: defaultObj.policyId,
                //   priority: defaultObj.priority,
                //   shape: 'customNode',
                //   size: [150, 40],
                //   type: 'node',
                //   weight: defaultObj.weight,
                //   x: editObj.x,
                //   y: editObj.y
                // }
              }
              return defaultObj
              // return {
              //   color: defaultObj.color,
              //   crowdId: defaultObj.crowdId,
              //   crowdName: defaultObj.crowdName,
              //   degree: 1,
              //   id: defaultObj.id,
              //   inPoints: defaultObj.inPoints, // 入口点 - 默认的
              //   label: defaultObj.label,
              //   name: defaultObj.name,
              //   outPoints: defaultObj.outPoints, // 入口点 - 默认的
              //   policyId: defaultObj.policyId,
              //   priority: defaultObj.priority,
              //   shape: 'customNode',
              //   size: [150, 40],
              //   type: 'node',
              //   weight: defaultObj.weight,
              //   x: defaultObj.x,
              //   y: defaultObj.y
              // }
            })

            this.data.edges = flowChart.edges.map(item => {
              return {
                ...item,
                source: item.source.toString(),
                target: item.target.toString(),
                sourceId: item.sourceId.toString(),
                targetId: item.targetId.toString()
              }
            })
          } else {
            this.data.edges = []
            this.data.nodes = defaultNodes
          }
          console.log('data23333333333========', this.data)
          // this.data = flowChart || {}
        } else if (this.crowdList.length > 0) { // 新增
          this.data.edges = []
          if (this.type === 0 || this.type === 1) {
            // alert(11)
            this.init()
          } else if (this.type === 2) {
            this.initRandomNodes()
          } else {
            this.init()
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
  created () {
    const _this = this
    eventBus.$on('afterAddPage', page => {
      _this.graph = page.graph
    })
  },
  mounted () {
    // 画布宽度
    this.width = document.getElementsByClassName('el-main')[0].offsetWidth - 40
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

      return {
        left,
        top
      }
    },
    // 随机
    initRandomNodes () {
      const data = this.crowdList
      const commonObj = this.commonObj

      let arr = data.map((item, index) => {
        const xy = this.returnStyle(index)

        const x = xy.left
        const y = xy.top

        return {
          ...commonObj,
          ...item,
          x,
          y,
          name: item.crowdName,
          label: item.crowdName,
          id: item.crowdId,
          arithmetic: null
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
        // this.graph.clear()
        this.graph && this.graph.refresh(data)
      }
      if (this.graph) {
        this.graph.refresh()
        this.graph.read(data)
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
      if (type === 0 || type === 1) {
        data.reduce((current, item) => {
          arr.push({
            ...commonObj,
            source: current.crowdId.toString(),
            target: item.crowdId.toString(),
            sourceId: current.crowdId.toString(),
            targetId: item.crowdId.toString()
          })
          return item
        }, data[0])

        arr.shift()
      }
      if (type === 1) { // 循环
        arr.push({
          ...commonObj,
          label: '权重',
          source: (data[data.length - 1].crowdId).toString(),
          target: (data[0].crowdId).toString(),
          sourceId: (data[data.length - 1].crowdId).toString(),
          targetId: (data[0].crowdId).toString()
        })
      }

      return arr
    },

    initDefaultNodes () {
      const data = this.crowdList
      const commonObj = this.commonObj

      if (this.type === 3) { // 自定义
        commonObj.inPoints = [[0, 0.5]]
        commonObj.outPoints = [[1, 0.5]]
      }
      // this.Y = -90
      // this.X = this.width / 2
      this.X = -200
      this.Y = this.height / 2
      console.log('this.X===alertz=========', this.X)
      console.log('data======', this.data)
      let arr = data.map((item, index) => {
        const x = this.X += 300
        const y = this.Y += 1

        // const x = this.X += 1
        // const y = this.Y += 150
        const obj = {
          ...commonObj,
          ...item,
          x,
          y,
          name: item.crowdName,
          label: item.crowdName,
          id: item.crowdId,
          arithmetic: null,
          weight: null,
          degree: 5
        }
        // const obj = {
        //   arithmetic: 0,
        //   weight: 0,
        //   inPoints: 0, // 入口点 - 默认的
        //   outPoints: 0, // 入口点 - 默认的
        //   color: commonObj.color,
        //   crowdId: item.crowdId,
        //   crowdName: item.crowdName,
        //   degree: 1,
        //   id: item.crowdId,
        //   label: item.crowdName,
        //   name: item.crowdName,
        //   policyId: item.policyId,
        //   priority: item.priority || '',
        //   shape: commonObj.shape,
        //   size: [150, 40],
        //   type: commonObj.type,
        //   x,
        //   y

        //   // color: defaultObj.color,
        //   // crowdId: defaultObj.crowdId,
        //   // crowdName: defaultObj.crowdName,
        //   // degree: 1,
        //   // id: defaultObj.id,
        //   // inPoints: defaultObj.inPoints, // 入口点 - 默认的
        //   // label: defaultObj.label,
        //   // name: defaultObj.name,
        //   // outPoints: defaultObj.outPoints, // 入口点 - 默认的
        //   // policyId: defaultObj.policyId,
        //   // priority: defaultObj.priority,
        //   // shape: 'customNode',
        //   // size: [150, 40],
        //   // type: 'node',
        //   // weight: defaultObj.weight,
        //   // x: editObj.x,
        //   // y: editObj.y
        // }

        if (this.type === 3) { // 自定义
          obj.arithmetic = item.arithmetic ? item.arithmetic : 2
          obj.weight = item.weight
        }

        return obj
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
