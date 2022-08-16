<template>
<div class="alignment-wrapper">
  <div v-dragscroll  class="vue-drag-scroll-out-wrapper">
    <div class="vue-drag-scroll-wrapper" :style="zoomStye">
      <div style="height: 600px">
        <tree :treeData="tableData"></tree>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import tree from './tree.vue'
 export default {
   components: {
    tree: tree
   },
   computed: {
    zoomStye () {
      const INIT_WIDTH = 3000
      const INIT_HEIGHT = 3000
      const width = INIT_WIDTH * (1 + (100 - this.scale)/100)
      const height = INIT_HEIGHT * (1 + (100 - this.scale)/100)
      console.log(width)
      console.log(height)
      return {
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${this.scale/100})`
      }
    }
  },

   data () {
     return {
      scale: 100,
      tableData: [{
        name: 'nodeA',
        value: 10,
        ratio: 100,
        children: [
           
          {
            name: 'nodeAa',
            value: 4,
            ratio: 40,
             children: [{
              name: 'nodeAs',
              value: 20,
              ratio: 50
            },{
              name: 'nodeAs',
              value: 20,
              ratio: 50,
              children: [{
                name: 'nodeAs1111',
                value: 20,
                ratio: 50,
                children: [{
                  name: 'nodeAs1111',
                  value: 20,
                  ratio: 50,
                  children: [{
                    name: 'nodeAs1111',
                    value: 20,
                    ratio: 50,
                    children: [{
                      name: 'nodeAs1111',
                      value: 20,
                      ratio: 50,
                    }]
                  }]
                }]
              },
              {
                name: 'nodeA222',
                value: 20,
                ratio: 50,
              }]
            }]
          },
          {
            name: 'nodeAb',
            value: 6,
            ratio: 60,
            children: [{
              name: 'node1',
              value: 20,
              ratio: 10
            },{
              name: 'node2',
              value: 20,
              ratio: 10
            },{
              name: 'node3',
              value: 20,
              ratio: 10
            },{
              name: 'node4',
              value: 20,
              ratio: 10
            },{
              name: 'node2',
              value: 20,
              ratio: 10
            },{
              name: 'node3',
              value: 20,
              ratio: 10
            },{
              name: 'node4',
              value: 20,
              ratio: 10
            }]
          }
        ]
      },]
     }
   },
   mounted() {
   },
   methods: {
    
    aaa () {
    }
   }
 }
</script>


<style scoped lang="scss">
.alignment-wrapper{
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
  overflow: hidden;
}
.vue-drag-scroll-out-wrapper{
  /* &::-webkit-scrollbar { width: 0 !important } */
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    cursor: grab;
    // position: absolute;
    // top:0;
    // left: 0;
    // &::-webkit-scrollbar { width: 0 !important }
}
.vue-drag-scroll-wrapper{
  position: relative;
}
.vue-drag-scroll-wrapper{
  display: flex;
  flex-direction: column;
  position: relative;
}
.inner-div-wrapper{
  top: 10%;
  position: absolute;
  left: 25%;
}
.inner-div{
  display: block;
  width: 300px;
  height: 100px;
  background: #A3F3E9;
  margin: 20px;
}
 .tolbox-zoom-wrapper{
    position: absolute;
    left: 24px;
    bottom: 40px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;
    box-shadow: 0 1px 10px rgba(31,35,41,.06);
    background: #fff;
    box-sizing: border-box;
    cursor: auto;
    user-select: none;
    .zoom-inner{
      display: inline-flex;
      align-items: center;
      .iconfont{
        font-size: 24px;
        color: #1f2329;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }
      .iconfont:nth-child(2){
        margin-left: 8px;
      }
    }
    .scale-text{
      margin-left: 14px;
      color: #646a73;
      font-weight: 500;
      line-height: 22px;
      font-size: 14px;
    }
  }
</style>

