<template>
<div class="box" >
  <div class="avatar">
    <tree :treeData="tableData" :linkProps="linkProps" :linkPropsName="linkPropsName"></tree>
  </div>
</div>
</template>

<script>
import tree from './tree.vue'
import myMinix from './minix';
export default {
  mixins: [myMinix], // todo.vue 中声明 minix 进行混合
   components: {
    tree: tree
   },
   props: {
    tableData: {
      type: Array,
      default: () => []
    },
    linkProps: {
      type: Object,
      default: () => {}
    },
    linkPropsName: {
      type: Object,
      default: () => {}
    },
   },
   computed: {
    // zoomStye () {
    //   const INIT_WIDTH = this.INIT_WIDTH
    //   const INIT_HEIGHT = this.INIT_HEIGHT
    //   // const width = INIT_WIDTH * (1 + (100 - this.scale)/100)
    //   // const height = INIT_HEIGHT * (1 + (100 - this.scale)/100)
    //   // console.log(width)
    //   // console.log(height)
    //   return {
    //     width: `${INIT_WIDTH}px`,
    //     height: `${INIT_HEIGHT}px`,
    //     // transform: `scale(${this.scale/100})`,
    //     // position: 'absolute'
    //   }
    // // return {}
    // }
  },

   data () {
     return {
      INIT_WIDTH: 3000,
      INIT_HEIGHT: 600,
      scale: 100,
      // tableData: [{
      //   name: 'nodeA',
      //   value: 10,
      //   ratio: 100,
      //   children: [
           
      //     {
      //       name: 'nodeAa',
      //       value: 4,
      //       ratio: 40,
      //        children: [{
      //         name: 'nodeAs',
      //         value: 20,
      //         ratio: 50
      //       },{
      //         name: 'nodeAs',
      //         value: 20,
      //         ratio: 50,
      //         children: [{
      //           name: 'nodeAs1111',
      //           value: 20,
      //           ratio: 50,
      //           children: [{
      //             name: 'nodeAs1111',
      //             value: 20,
      //             ratio: 50,
      //             children: [{
      //               name: 'nodeAs1111',
      //               value: 20,
      //               ratio: 50,
      //               children: [{
      //                 name: 'nodeAs1111',
      //                 value: 20,
      //                 ratio: 50,
      //               }]
      //             }]
      //           }]
      //         },
      //         {
      //           name: 'nodeA222',
      //           value: 20,
      //           ratio: 50,
      //         }]
      //       }]
      //     },
      //     {
      //       name: 'nodeAb',
      //       value: 6,
      //       ratio: 60,
      //       children: [{
      //         name: 'node1',
      //         value: 20,
      //         ratio: 10
      //       },{
      //         name: 'node2',
      //         value: 20,
      //         ratio: 10
      //       },{
      //         name: 'node3',
      //         value: 20,
      //         ratio: 10
      //       },{
      //         name: 'node4',
      //         value: 20,
      //         ratio: 10
      //       },{
      //         name: 'node2',
      //         value: 20,
      //         ratio: 10
      //       },{
      //         name: 'node3',
      //         value: 20,
      //         ratio: 10
      //       },{
      //         name: 'node4',
      //         value: 20,
      //         ratio: 10
      //       }]
      //     }
      //   ]
      // },]
     }
   },
   mounted() {
    // this.aaa()
   },
   methods: {
     
    //  aaa () {
    //   const _this = this
    //   //给页面绑定滑轮滚动事件
    //   var scrollFn = function(e){
    //     if (window.scrollTimer) return;
    //       // 如果有需要阻止默认事件或事件冒泡的可以打开
    //       // e.preventDefault();
    //       // e.stopPropagation();
    //       window.scrollTimer = setTimeout(() => {
    //         e = e || window.event;
    //         var isGoDown = true;
    //         if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件
    //           if (e.wheelDelta > 0) { //当滑轮向上滚动时
    //             isGoDown = false;
    //           }
    //         } else if (e.detail) { //Firefox滑轮事件
    //           if (e.detail < 0) { //当滑轮向下滚动时
    //             isGoDown = false;
    //           }
    //         }
    //       if (isGoDown) {
    //         //向下滚动，执行放大元素
    //         zoomInFn();
    //       } else {
    //         //向上滚动，执行缩小元素
    //         zoomOutFn();
    //       }
    //       clearTimeout(window.scrollTimer);
    //       window.scrollTimer = null;
    //     }, 100);
    //   };
    //   //设定元素元大小为100；
    //   var zoom = 100;
    //   //缩小
    //   var zoomInFn = function(){
    //     zoom -= 10;
    //     if (zoom < 20) {
    //       zoom = 20
    //     }
    //     setDivScale();
    //   };
    //   //放大
    //   var zoomOutFn = function(){
    //     zoom += 10;
    //     if (zoom > 200) {
    //       zoom = 200
    //     }
    //     setDivScale();
    //   };
    //   //设置元素放大倍率样式
    //   var setDivScale = function(){
    //     var scale = zoom / 100 ;
    //     _this.scale = scale
    //     // document.getElementById('zoomchangebox').setAttribute('style','transform : scale(' + scale + ')');
    //   };

    //   //给页面绑定鼠标滚动事件
    //   if (document.addEventListener) {//firefox
    //     document.body.addEventListener('DOMMouseScroll', scrollFn, false);
    //   }
    //   document.body.addEventListener('mousewheel', scrollFn, false);

    // }
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
.box {
  // position: relative;
  // margin: 50px auto;
  // width: 100%;
  // height: 100%;
  // border: 2px solid red;
  // overflow: hidden;
  position: absolute;
  /* margin: 50px auto; */
  /* width: 100%; */
  /* height: 100%; */
  border: 2px dashed #e4e5e3;
  overflow: hidden;
  top: 60px;
  bottom: 0;
  right: 0;
  left: 0;
}

.avatar {
  display: inline-block;
  // width: 10px;
  height: 600px;
  // background-color: pink;
  left: 50px;
  top: 50px;
  transform: translate(100px, 100px);
}

.avatar img {
  width: 100%;
}
</style>

