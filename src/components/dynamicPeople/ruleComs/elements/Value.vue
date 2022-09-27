<template>
  <!-- 输入 value -->
  <span>
    <el-input-number :key="n + 'input'" v-model="childItem.value" placeholder="请输入" :min="0">
    </el-input-number>
  </span>
</template>

<script>
export default {
  inject: ['_this'],
  props: {
    childItem: {
      type: Object,
      default: () => {}
    },
    
    index: {
      type: Number,
      default: 0
    },
    n: {
      type: Number,
      default: 0
    },
  },
  data () {
    return {
    
    }
  },
  created() {
  },
  methods: {

  }
 }
</script>

<style lang='stylus' scoped>

 
</style>
