<template>
  <!-- 预览面板· -->
<div
class="preview-panel"
:class="{'detail-component-hide': !showDetail}">
  <!-- {{ nodeList }} -->
  <div
    class="flex-item"
    :class="showDetail ? 'el-icon-s-unfold' :'el-icon-s-fold'"
    @click="showDetail = !showDetail"
  >
  </div>
  <div class="title">预览面板</div>
  <div class="flex-row">
    <el-tag class="oc-item" type="warningCyan">{{ tagDetail.tagCode }} - {{ tagDetail.tagName }}</el-tag>
    <div
      v-for="nodeDetail in nodeList"
      :key="nodeDetail.id"
    >
      <!-- {{ nodeDetail.valueObj }} -->
      <!-- v-model="nodeDetail.valueObj"
      :nodeType="nodeDetail.type"
      :options="getOptions(nodeDetail.keyName)" -->
      <NodeIndex
        :nodeDetail="nodeDetail"
        :nodeType="nodeDetail.type"
        :apiData="apiData"
        @addDiguiNode="$event => handleAddDiguiNode($event, nodeDetail)">
      </NodeIndex>
    </div>
  </div>
</div>
</template>

<script>
import NodeIndex from './nodeTypeComponents/NodeIndex.vue'
export default {
  components: { NodeIndex },
  props: {
    tagDetail: {
      type: Object,
      default: () => {}
    },
    nodeList: {
      type: Array,
      default: () => []
    },
    apiData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showDetail: true, // 显示详情弹窗
      nodeValueList: []
    }
  },
  watch: {
    // nodeList: {
    //   handler (val) {
    //     this.nodeValueList = val.map(item => {
    //       return {
    //         ...item,
    //         valueObj: {
    //           name: '',
    //           value: '',
    //           field: '',
    //           operator: '',
    //           type: ''
    //         }
    //       }
    //     })
    //   },
    //   immediate: true
    // }
  },
  // computed: {
  //   nodeValueList () {
  //     return this.nodeList.map(item => {
  //       return {
  //         ...item,
  //         valueObj: {
  //           name: '',
  //           value: '',
  //           field: '',
  //           operator: '',
  //           type: ''
  //         }
  //       }
  //     })
  //   }
  // },
  created () {

  },
  methods: {
    // getDefaultNodeformat () {
    //   return {
    //     id: 0,
    //     type: 2,
    //     keyName: '',
    //     isDiguiNode: true,
    //     diGuiKeyName: '',
    //     nextNodeList: []
    //   }
    // },
    getOptions (keyName) {
      return this.apiData.dict[keyName]
    },
    handleAddDiguiNode (valueObj, nodeDetail) {
      // // 找现有的
      // const obj = this.nodeValueList.find(item => item.parentId === nodeDetail.id)
      // // 修改
      // if (obj) {
      //   obj.keyName = valueObj.mapName
      // } else {
      //   // 新增
      //   const index = this.nodeValueList.findIndex(item => item.id === nodeDetail.id)
      //   const obj = this.getDefaultNodeformat()
      //   // this.nodeValueList[index]
      //   console.log('this.nodeValueList[index]--->', this.nodeValueList[index])
      //   this.nodeValueList.splice(index + 1, 0, {
      //     ...obj,
      //     id: `${obj.id}_${Math.random()}`,
      //     keyName: nodeDetail.valueObj.mapName,
      //     parentId: nodeDetail.id
      //   })
      // }
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/assets/tag.styl'
.preview-panel {
  position: absolute;
  bottom: 0px;
  height: auto
  background: rgb(255, 255, 255);
  right: 0;
  left: 0;
  border: 10px solid rgb(246, 246, 246);
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 10px -5px, rgba(0, 0, 0, 0.14) 0px 16px 24px 2px, rgba(0, 0, 0, 0.12) 0px 6px 30px 5px;
  transition: height 0.5s ease 0s;
  z-index: 1001;
}
.flex-row {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  margin: 10px 0
  overflow-x: auto;
  >div {
    white-space: nowrap;
  }
}
.oc-item {
  margin-top 5px
}
.detail-component-hide {
  height: 0
  border: 0

}
.flex-item {
  font-size: 30px;
  color: #000;
  position: absolute;
  left: 50%;
  top: -38px;
  background: rgba(119,119,119,0.169);
  padding: 0 20px;
  border-radius: 20px 20px 0 0;
}
</style>
