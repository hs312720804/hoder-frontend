<template>
  <div>
    <!-- {{ selectedServicerId }} -->
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6/build/g6'

export default {
  name: 'crowdCirculationTrackAA',
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    selectedServicerId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      pageId: 'graph-container',
      form: {
        crowdId: 'crowdIdcrowdId',
        mac: 'crowdId',
        sourceSign: '',
        // policyId: 124,
        // mac: 'E56D2070F97D',
        // sourceSign: 1,
        beginTime: '',
        endTime: ''
      },
      dateRange: [],
      dateList: [],
      list: [],
      noneText: '暂无数据',
      graph: null,
      dialogVisible: false,
      allCrowdRule: [],
      len: 5, // 模拟数据个数
      // 扩展内置的 【circle】 shape
      defaultNodeConf: {
        afterDraw (cfg, group) {
        // console.log('cfg===', cfg)
        // console.log('group===', group)
          const height = parseInt(cfg.size)
          group.addShape('text', {
          // attrs: {
          //   x: 0,
          //   y: height / 2 + 20,
          //   // cursor: 'pointer',
          //   textAlign: 'center',
          //   text: `${cfg.id}`,
          //   fill: 'red'
          // }
            attrs: {
              x: 0,
              y: height / 2 + 20,
              text: `${cfg.receptionist}-${cfg.id}`,
              // fill: '#87adfb',
              fill: '#87adfb',
              fontWeight: 400,
              // shadowOffsetX: 10,
              // shadowOffsetY: 10,
              // shadowColor: '#999',
              // shadowBlur: 10,
              textAlign: 'center',
              fontSize: 12
            }
          })
        }
      },
      // 图表默认配置
      graphSet: {
        container: 'graph-container',
        defaultNode: {
          shape: 'circle-node',
          size: 30,
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9'
          },
          nodeStateStyles: {
            // 鼠标hover状态下的配置
            hover: {
              fillOpacity: 0.8
            },
            // 选中节点状态下的配置
            selected: {
              lineWidth: 5
            }
          },
          labelCfg: {
            position: 'top',
            offset: 10,
            style: {
            // ... 文本样式的配置
            }
          }

        },
        defaultEdge: {
          // shape: 'polyline',
          style: {
            radius: 20,
            offset: 30,
            endArrow: true,
            stroke: '#F6BD16'
          }
        },
        modes: {
          // 支持的 behavior
          default: ['drag-node', 'zoom-canvas', 'drag-canvas']
        },
        nodeStateStyles: {
          // 鼠标hover状态下的配置
          hover: {
            fillOpacity: 0.8
          },
          // 选中节点状态下的配置
          selected: {
            lineWidth: 5
          }
        }
      }
    }
  },

  created () {
    G6.registerNode(
      'circle-node',
      this.defaultNodeConf,
      // 注意这里继承了 'single-shape'
      'circle'
    )
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const width = 220
      // const width = document.getElementById('servicer-map').offsetWidth
      console.log('width--->', width)
      const height = document.getElementById('graph-container').scrollHeight || 200
      // const height = 300
      // const height = this.list.length < 20 ? 800 : this.list.length / 15 * 250
      // const height = this.len < 20 ? 400 : this.len / 15 * 250
      // const height = 150 * 16

      this.graph = new G6.Graph({
        ...this.graphSet,
        width,
        height,
        layout: {
          // type: 'fruchterman', // 推荐
          type: 'force', // 推荐
          // type: 'circular',
          // type: 'concentric',
          // workerEnabled: true,
          begin: [20, 20],
          nodeSize: 100,
          width: width - 20,
          height: height - 20,
          preventOverlap: true
          // sortBy: 'cluster'
        }
      })

      // graph.read(data)
      this.readOrClearData()

      this.graph.on('node:mouseenter', evt => {
        const { item } = evt
        this.graph.setItemState(item, 'hover', true)
      })
      this.graph.on('node:mouseleave', evt => {
        const { item } = evt
        this.graph.setItemState(item, 'hover', false)
      })
      // 单击
      // this.graph.on('node:click', evt => {
      //   const { item } = evt
      //   console.log('item------->', item)
      //   // this.graph.setItemState(item, 'selected', true)
      // })
      // 双击
      this.graph.on('node:dblclick', evt => {
        const { item } = evt
        this.dblClick(item)
        // this.graph.setItemState(item, 'selected', true)
      })
    },
    dblClick (item) {
      console.log('item------->', item._cfg.id)
      const servicerId = item._cfg.id

      // 选择接待员
      this.$emit('selectServicer', servicerId)
    },
    // 重构成图表所需数据格式
    // reconstructData  (data) {
    //   console.log('aaaaaa=======', data)
    //   // --------------构造所需数据结构--------------------
    //   const nodes = []
    //   const edges = []

    //   // -- 真实数据 --
    //   // let len = data.length
    //   // data.map((item, index) => {
    //   //   nodes.push({
    //   //     id: index + 1,
    //   //     crowdId: item.crowdId,
    //   //     label: item.crowdName,
    //   //     cluster: len--,
    //   //     date: item.hitDate
    //   //   })
    //   // })
    //   // --真实数据 end--

    //   // -- 模拟数据 --
    //   let num = this.len
    //   for (let i = 1; i < this.len; i++) {
    //     const obj = {
    //       id: i,
    //       // label: '【双旦测试】爱奇艺所有用户',
    //       cluster: num--,
    //       date: '2022-05-16 16:35:30'

    //     }
    //     if (i === 1) {
    //       obj.style = {
    //         fill: 'gary'
    //       }
    //     }
    //     nodes.push(obj)
    //   }
    //   // --模拟数据 end--
    //   console.log('节点============', nodes)

    //   nodes.reduce((current, item) => {
    //     edges.push({
    //       source: current.id.toString(),
    //       target: item.id.toString()
    //     })
    //     return item
    //   }, nodes[0])

    //   edges.shift()
    //   console.log('箭头============', edges)

    //   return {
    //     nodes,
    //     edges
    //   }
    //   // -------------- 构造所需数据结构- end-------------------
    // },
    // 渲染 或者 清空图表
    readOrClearData () {
      // 清空图表
      // if (this.list.length === 0) {
      //   this.graph && this.graph.clear()
      //   this.graph.read({})
      //   return
      // }
      // 渲染图表
      // const data = this.reconstructData(this.list)
      const cloneData = JSON.parse(JSON.stringify(this.chartData))
      if (cloneData.nodes) {
        const nodes = cloneData.nodes.map(item => {
          return {
            receptionist: item.receptionist,
            id: item.id
          }
        })
        cloneData.nodes = nodes
        cloneData.nodes.forEach(item => {
          if (item.id == this.selectedServicerId) {
            item.style = {
              stroke: '#000',
              fill: '#999'
            }
          }
        })
      }
      console.log('this.chartData=-===============>', cloneData)
      const data = cloneData

      if (data && data.nodes.length > 0) {
        // read 方法的功能相当于 data 和 render 方法的结合。
        this.graph.read(data)
      }
    },
    getFilter () {
      const filter = {
        crowdId: this.form.crowdId,
        mac: this.form.mac,
        sourceSign: this.form.sourceSign,
        beginTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }
      return filter
    }
    // handleSearch () {
    //   // 清空数据、清空图表
    //   this.list = []
    //   console.log('this.graph====', this.graph)
    //   // this.graph && this.graph.clear() && this.graph.read({})
    //   this.graph && this.graph._cfg && this.graph.destroy() // 若有图表，则销毁

    //   this.$refs.form.validate(valid => {
    //     if (valid) {
    //       const filter = this.getFilter()
    //       // this.$service.launchHelpCrowdIndex(filter).then(data => {
    //       // this.$service.dynamicCrowdHitLink(filter).then(data => {
    //       //   console.log('data=====>', data)
    //       // 链路数据
    //       // this.list = data || []

    //       // 生成链路图
    //       this.init()
    //       // })
    //     }
    //   })
    // }

  }

}
</script>

<style lang="stylus" scoped>
.result
    border 1px dashed #333
    padding 0 20px
    margin 20px
    overflow auto
    .result-item
        margin 20px 0
.red--text
    color red
.title
    margin-bottom 20px
.no-result
    margin 20px
</style>
