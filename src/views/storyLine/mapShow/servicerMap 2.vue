<template>
  <div>
    <!-- {{ selectedServicerId }} -->
    <div id="container" class="graph-container" style="position: relative;"></div>
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
    return {}
  },

  created () {

  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const data = {
        nodes: [{
          id: '0',
          label: '0'
        },
        {
          id: '1',
          label: '1'
        },
        {
          id: '2',
          label: '2'
        },
        {
          id: '3',
          label: '3'
        },
        {
          id: '4',
          label: '4'
        },
        {
          id: '5',
          label: '5'
        },
        {
          id: '6',
          label: '6'
        },
        {
          id: '7',
          label: '7'
        },
        {
          id: '8',
          label: '8'
        },
        {
          id: '9',
          label: '9'
        },
        {
          id: '10',
          label: '10'
        },
        {
          id: '11',
          label: '11'
        },
        {
          id: '12',
          label: '12'
        },
        {
          id: '13',
          label: '13'
        },
        {
          id: '14',
          label: '14'
        },
        {
          id: '15',
          label: '15'
        }],
        edges: [{
          source: '0',
          target: '1'
        },
        {
          source: '0',
          target: '2'
        },
        {
          source: '0',
          target: '3'
        },
        {
          source: '0',
          target: '4'
        },
        {
          source: '0',
          target: '5'
        },
        {
          source: '0',
          target: '7'
        },
        {
          source: '0',
          target: '8'
        },
        {
          source: '0',
          target: '9'
        },
        {
          source: '0',
          target: '10'
        },
        {
          source: '0',
          target: '11'
        },
        {
          source: '0',
          target: '13'
        },
        {
          source: '0',
          target: '14'
        },
        {
          source: '0',
          target: '15'
        },
        {
          source: '2',
          target: '3'
        },
        {
          source: '4',
          target: '5'
        },
        {
          source: '4',
          target: '6'
        },
        {
          source: '5',
          target: '6'
        },
        {
          source: '7',
          target: '13'
        },
        {
          source: '8',
          target: '14'
        },
        {
          source: '9',
          target: '10'
        },
        {
          source: '10',
          target: '14'
        },
        {
          source: '10',
          target: '12'
        },
        {
          source: '11',
          target: '14'
        },
        {
          source: '12',
          target: '13'
        }]
      }
      // const descriptionDiv = document.createElement('div')
      // descriptionDiv.innerHTML = 'Dagre layout, rank seperation: 1, node seperation in same level: 1, layout direction: Top->Bottom, alignment of nodes: DL'
      const container = document.getElementById('container')
      // container.appendChild(descriptionDiv)
      const width = container.scrollWidth
      const height = container.scrollHeight - 30
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        fitView: true,
        modes: {
          default: ['drag-canvas', 'drag-node']
        },
        layout: {
          type: 'dagre',
          nodeSize: [40, 20],
          nodesep: 1,
          ranksep: 1
        },
        defaultNode: {
          size: [40, 20],
          shape: 'rect',
          style: {
            lineWidth: 2,
            stroke: '#5B8FF9',
            fill: '#C6E5FF'
          }
        },
        defaultEdge: {
          size: 1,
          color: '#e2e2e2',
          style: {
            endArrow: {
              path: 'M 4,0 L -4,-4 L -4,4 Z',
              d: 4
            }
          }
        }
      })

      const cloneData = JSON.parse(JSON.stringify(this.chartData))
      if (cloneData.nodes) {
        const nodes = cloneData.nodes.map(item => {
          return {
            label: item.receptionist,
            id: item.id.toString()
          }
        })
        cloneData.nodes = nodes
        // cloneData.nodes.forEach(item => {
        //   if (item.id == this.selectedServicerId) {
        //     item.style = {
        //       stroke: '#000',
        //       fill: '#999'
        //     }
        //   }
        // })
      }
      const data2 = cloneData
      console.log('data2----->', data2)
      // graph.data(data)
      // graph.render()
      if (data && data.nodes.length > 0) {
        // read 方法的功能相当于 data 和 render 方法的结合。
        graph.read(data2)
      }
    }

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
