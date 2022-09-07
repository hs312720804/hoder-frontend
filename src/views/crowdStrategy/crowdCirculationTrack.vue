<template>
  <div>
    <div class="title">查询指定Mac的流转轨迹</div>
    <el-form :model="form" ref="form" :rules="rules" :inline="true">
      <el-form-item label="主人群ID：" prop="crowdId">
        <el-input v-model="form.crowdId" clearable></el-input>
      </el-form-item>
      <el-form-item label="MAC地址" prop="mac">
        <el-input v-model="form.mac" clearable></el-input>
      </el-form-item>
      <el-form-item label="产品包" prop="sourceSign">
        <!-- <el-input v-model="form.sourceSign" clearable></el-input> -->
        <el-select
          placeholder="请选择产品包"
          clearable
          style="width: 180px"
          name="oxve"
          v-model="form.sourceSign"
          class="input-inline"
        >
          <!-- number 类型 -->
          <template>
            <el-option v-for="item in soureceSignList" :value="item.sourceSign" :key="item.sourceSign" :label="item.sourceName"></el-option>
          </template>

        </el-select>

      </el-form-item>
      <el-form-item label="日期：" prop="date">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          clearable
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div>

      <el-empty v-if="list.length === 0" description="暂无数据"></el-empty>
      <div :id="pageId" class="graph-container" style="position: relative;"></div>
      <!-- <Flow></Flow> -->
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6/build/g6'
import Flow from '@antvGraph/components/Flow'
export default {
  name: 'crowdCirculationTrackAA',
  data () {
    return {
      form: {
        policyId: '',
        mac: '',
        sourceSign: '',
        // policyId: 124,
        // mac: 'E56D2070F97D',
        // sourceSign: 1,
        beginTime: '',
        endTime: ''
      },
      dateRange: [],
      dateList: [],
      rules: {
        crowdId: { required: true, message: '请输入策略id', trigger: 'blur' },
        mac: { required: true, message: '请输入mac', trigger: 'blur' },
        sourceSign: { required: true, message: '请输入sourceSign', trigger: 'blur' }
      },
      pickerOptions: { // 策略投放后到今天的日期都可以选
        disabledDate: (time) => {
          // const day1 = 30 * 24 * 3600 * 1000
          let maxTime = Date.now()
          // let minTime = Date.now() - day1
          return time.getTime() > maxTime
        }
      },
      list: [],
      noneText: '暂无数据',
      pageId: 'graph-container',
      graph: null,
      dialogVisible: false,
      allCrowdRule: [],
      len: 10, // 模拟数据个数
      soureceSignList: []

    }
  },
  components: {
    Flow
  },
  created () {
    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })
    // 扩展内置的 【circle】 shape
    const defaultNodeConf = {
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
            text: `${cfg.date}`,
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
    }
    G6.registerNode(
      'circle-node',
      defaultNodeConf,
      // 注意这里继承了 'single-shape'
      'circle'
    )
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () {
      const width = document.getElementById('graph-container').scrollWidth
      // const height = document.getElementById('graph-container').scrollHeight || 800
      const height = this.list.length < 20 ? 400 : this.list.length / 15 * 250
      // const height = this.len < 20 ? 400 : this.len / 15 * 250
      // const height = 150 * 16

      this.graph = new G6.Graph({
        container: 'graph-container',
        width,
        height,
        layout: {
          type: 'grid',
          begin: [ 20, 20 ],
          width: width - 20,
          height: height - 20,
          sortBy: 'cluster'
        },
        defaultNode: {
          shape: 'circle-node',
          size: 70,
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
          default: [ 'drag-node' ]
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
      // this.graph.on('node:click', evt => {
      //   const { item } = evt
      //   this.graph.setItemState(item, 'selected', true)
      // })
    },
    // 重构成图表所需数据格式
    reconstructData  (data) {
      console.log('aaaaaa=======', data)
      // --------------构造所需数据结构--------------------
      const nodes = []
      const edges = []

      // -- 真实数据 --
      let len = data.length
      data.map((item, index) => {
        nodes.push({
          id: index + 1,
          crowdId: item.crowdId,
          label: item.crowdName,
          cluster: len--,
          date: item.hitDate
        })
      })
      // --真实数据 end--

      // -- 模拟数据 --
      // let num = this.len
      // for (let i = 1; i < this.len; i++) {
      //   nodes.push({
      //     id: i,
      //     label: '【双旦测试】爱奇艺所有用户',
      //     cluster: num--,
      //     date: '2022-05-16 16:35:30'
      //   })
      // }
      // --模拟数据 end--
      console.log('节点============', nodes)

      nodes.reduce((current, item) => {
        edges.push({
          source: current.id.toString(),
          target: item.id.toString()
        })
        return item
      }, nodes[0])

      edges.shift()
      console.log('箭头============', edges)

      return {
        nodes,
        edges
      }
      // -------------- 构造所需数据结构- end-------------------
    },
    // 渲染 或者 清空图表
    readOrClearData () {
      // 清空图表
      if (this.list.length === 0) {
        this.graph && this.graph.clear()
        this.graph.read({})
        return
      }
      // 渲染图表
      let data = this.reconstructData(this.list)
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
    },
    handleSearch () {
      // 清空数据、清空图表
      this.list = []
      console.log('this.graph====', this.graph)
      // this.graph && this.graph.clear() && this.graph.read({})
      this.graph && this.graph._cfg && this.graph.destroy() // 若有图表，则销毁

      this.$refs.form.validate(valid => {
        if (valid) {
          const filter = this.getFilter()
          // this.$service.launchHelpCrowdIndex(filter).then(data => {
          this.$service.dynamicCrowdHitLink(filter).then(data => {
            console.log('data=====>', data)
            // 链路数据
            this.list = data || []

            // 生成链路图
            this.init()
          })
        }
      })
    }

    // formatDate (d) {
    //   const time = new Date(d)
    //   let y = time.getFullYear() // 年份
    //   let m = (time.getMonth() + 1).toString().padStart(2, '0') // 月份
    //   let r = time.getDate().toString().padStart(2, '0') // 日子
    //   return `${y}-${m}-${r}`
    // },
    // setDateData () {
    //   const a = []
    //   for (let i = 0; i < 5; i++) {
    //     a.push(this.formatDate((new Date()).setTime((new Date()).getTime() - 3600 * 1000 * 24 * i)))
    //   }
    //   this.dateList = a
    //   this.form.date = a[1]
    // },
    // initaaa () {
    //   G6.registerEdge('line-arrow', {
    //     options: {
    //       style: {
    //         stroke: '#ccc'
    //       }
    //     },
    //     draw: function draw (cfg, group) {
    //       const startPoint = cfg.startPoint
    //       const endPoint = cfg.endPoint

    //       const stroke = cfg.style && cfg.style.stroke || this.options.style.stroke

    //       const keyShape = group.addShape('path', {
    //         attrs: {
    //           path: [[ 'M', startPoint.x, startPoint.y ], [ 'L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y ], [ 'L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y ], [ 'L', endPoint.x, endPoint.y ]],
    //           stroke,
    //           lineWidth: 1,
    //           // startArrow: {
    //           //   path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
    //           //   d: 6
    //           // },
    //           endArrow: {
    //             path: 'M 6,0 L -6,-6 L -3,0 L -6,6 Z',
    //             d: 6
    //           },
    //           className: 'edge-shape'
    //         }
    //       })
    //       return keyShape
    //     }
    //   })

    //   const data = {
    //     nodes: [
    //       {
    //         id: '1',
    //         label: 'node1',
    //         // x: 150,
    //         // y: 100,
    //         size: 40
    //         // anchorPoints: [[ 1, 0.5 ], [ 1, 0 ]]
    //       }, {
    //         id: '2',
    //         label: 'node2',
    //         // x: 150,
    //         // y: 100,
    //         size: 40
    //         // anchorPoints: [[ 1, 0.5 ], [ 1, 0 ]]
    //       }, {
    //         id: '3',
    //         label: 'node3',
    //         // x: 150,
    //         // y: 100,
    //         size: 40
    //         // anchorPoints: [[ 1, 0.5 ], [ 1, 0 ]]
    //       }, {
    //         id: '4',
    //         label: 'node4',
    //         // x: 150,
    //         // y: 100,
    //         size: 40
    //         // anchorPoints: [[ 1, 0.5 ], [ 1, 0 ]]
    //       }, {
    //         id: '7',
    //         label: 'node7',
    //         // x: 150,
    //         // y: 100,
    //         size: 40
    //         // anchorPoints: [[ 1, 0.5 ], [ 1, 0 ]]
    //       }, {
    //         id: '8',
    //         label: 'node8',
    //         // x: 300,
    //         // y: 200,
    //         size: 40
    //         // anchorPoints: [[ 0, 0.5 ], [ 0, 1 ]]
    //       }],
    //     edges: [
    //       {
    //         source: '1',
    //         target: '2'
    //         // sourceAnchor: 0,
    //         // targetAnchor: 0
    //       }, {
    //         source: '2',
    //         target: '3'
    //         // sourceAnchor: 0,
    //         // targetAnchor: 0
    //       },
    //       {
    //         source: '3',
    //         target: '4'
    //         // sourceAnchor: 0,
    //         // targetAnchor: 0
    //       }]
    //   }

    //   const width = document.getElementById('graph-container').scrollWidth
    //   const height = document.getElementById('graph-container').scrollHeight || 500
    //   const graph = new G6.Graph({
    //     container: 'graph-container',
    //     width,
    //     height,
    //     layout: {
    //       type: 'grid',
    //       begin: [ 20, 20 ]
    //     },
    //     modes: {
    //       // 支持的 behavior
    //       default: [ 'drag-node', 'drag-canvas' ]
    //     },
    //     defaultNode: {
    //       shape: 'circle',
    //       style: {
    //         fill: '#DEE9FF',
    //         stroke: '#5B8FF9'
    //       }
    //       // linkPoints: {
    //       //   left: true,
    //       //   right: true,
    //       //   fill: '#fff',
    //       //   stroke: '#1890FF',
    //       //   size: 3
    //       // }
    //     },
    //     defaultEdge: {
    //       shape: 'polyline',
    //       style: {
    //         radius: 10,
    //         offset: 30,
    //         endArrow: true,
    //         stroke: '#F6BD16'
    //       }
    //     }
    //     // defaultEdge: {
    //     //   shape: 'line-arrow',
    //     //   style: {
    //     //     stroke: '#F6BD16'
    //     //   }
    //     // }
    //   })

    //   graph.data(data)
    //   graph.render()
    // },
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
