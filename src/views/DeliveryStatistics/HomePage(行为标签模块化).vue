<template>
  <div class="row-wrap">
   <!-- if (this.childItem.tagCode === 'BAV0017' || this.childItem.tagCode === 'BAV0016' || this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011') { -->
     <div class="left-block">
       <!-- 标签条件： -->
       <div
         v-for="node in nodeList"
         :key="node.id"
         class="wrap-div"
         :class="{'is-foucs': focusNode.id === node.id}"
         @click="nodeClick(node)" >
         <!-- <el-select
           v-if="node.type === 2"
           placeholder="输入框"
           class="none-pointer-events"
           v-model="aaa"
          >
         </el-select> -->
         <NodeType :nodeType="node.type"></NodeType>

         <!-- <div class="operator-wrap" >
          <i class="el-icon-plus" title="添加关联属性"></i>
         </div> -->

         node=={{ node }}
       </div>
       <div><el-button type="primary" @click="addNode">添加</el-button></div>
     </div>

     <Right
       :focusNode="focusNode"
       @updateFocusNode="handleUpdateFocusNode"
       >
     </Right>

  </div>
 </template>

<script>
import NodeType from './actionComs/NodeType.vue'
import Right from './actionComs/Right.vue'
export default {
  components: {
    Right,
    NodeType
  },

  data () {
    return {
      aaa: '',
      focusNode: {},
      id: 0,
      nodeList: [
        {
          // 节点类型:
          // 1: 周期范围
          // 2: 下拉框
          // 3: 输入框
          // 4: 搜索框
          // 5: 范围选择
          // 6: 指标框
          id: 0,
          type: 2,
          isRequired: true, // 2. 节点是否为必选项
          dataSource: '', // 4. 数据来源
          relation: '' // 5. 节点之间的关联

        }
      ]
    }
  },
  watch: {

  },
  created () {

  },
  methods: {
    handleUpdateFocusNode (node) {
      this.nodeList = this.nodeList.map(item => {
        if (node.id === item.id) {
          return { ...item, ...node }
        } else {
          return { ...item }
        }
      })
      // a = { ...a, ...node }
    },
    nodeClick (node) {
      this.focusNode = node
      this.$emit('node-click', node)
    },
    getDefaultNodeformat () {
      return {
        id: '',
        type: '',
        isRequired: false, // 2. 节点是否为必选项
        dataSource: '', // 4. 数据来源
        relation: '' // 5. 节点之间的关联
      }
    },
    addNode () {
      const node = this.getDefaultNodeformat()
      node.type = 2
      node.id = ++this.id
      this.nodeList.push(node)
    }
  }
}
</script>

 <style lang='stylus' scoped>
.wrap-div {
  background #f0f4ff
  padding: 10px
  margin: 5px
  display: inline-block
  border-radius: 4px;
  border: 2px solid #fff
  position relative
  &:focus {
    border 1px solid #409eff
  }
}
.is-foucs {
  border: 2px solid #409EFF
  .operator-wrap {
    visibility visible
  }
}
.el-icon-circle-plus{
  font-size: 22px;
  color: #409eff;
  cursor pointer
}

.row-wrap {
  display flex
  column-gap: 20px;
  // height: 80vh;
  position: relative;
  top: 0;
}
.left-block {
  flex: 1;
  width: 50%;
  // box-shadow: 20px 0px 23px -13px hsl(0deg 0% 93.06%)
}

.operator-wrap {
  position: absolute;
  top: 0;
  right: 0;
  background: #1890ff;
  color: #fff;
  border-radius: 2px
  visibility hidden
  .el-icon-plus {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
