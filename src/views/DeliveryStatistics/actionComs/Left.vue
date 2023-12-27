<template>
 <div class='' id=''>
  <!-- if (this.childItem.tagCode === 'BAV0017' || this.childItem.tagCode === 'BAV0016' || this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011') { -->
    <div v-for="item in nodeList" :key="item.id" class="wrap-div">
      <el-select v-if="item.type === 2"></el-select>
    </div>
    <i class="el-icon-circle-plus" @click="addNode"></i>
 </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {

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
  &:focus {
    border 1px solid #409eff
  }
}
.el-icon-circle-plus{
  font-size: 22px;
  color: #409eff;
  cursor pointer
}
</style>
