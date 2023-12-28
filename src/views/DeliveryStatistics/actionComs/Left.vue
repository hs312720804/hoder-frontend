<template>
 <div class='' id=''>
  <!-- if (this.childItem.tagCode === 'BAV0017' || this.childItem.tagCode === 'BAV0016' || this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011') { -->
    <div class="left-block">
      标签条件：
      <div
        v-for="node in nodeList"
        :key="node.id"
        class="wrap-div"
        :class="{'is-foucs': focusNode.id === node.id}"
        @click="nodeClick(node)" >
        <el-select
          v-if="node.type === 2"
          placeholder="输入框"
          class="none-pointer-events"
          v-model="aaa">
        </el-select>
        node=={{ node }}
      </div>
      <i class="el-icon-circle-plus" @click="addNode"></i>
    </div>

    <Right
      :focusNode.sync="focusNode"
      class="right-block">
    </Right>

    {{focusNode}}
 </div>
</template>

<script>
import { nodeTypeText } from './enum.js'
import Right from './Right.vue'
export default {
  components: {
    Right
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
  created () {

  },
  methods: {
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
  &:focus {
    border 1px solid #409eff
  }
}
.is-foucs {
  border: 2px solid #409EFF
}
.el-icon-circle-plus{
  font-size: 22px;
  color: #409eff;
  cursor pointer
}
.none-pointer-events {
  pointer-events: none;
}

</style>
