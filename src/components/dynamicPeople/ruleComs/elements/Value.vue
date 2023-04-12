<template>
  <!-- 输入 value -->
  <span>
    <!-- 影视模型  只能在 1 - 10 中选择-->
    <el-input-number
      v-if="childItem.tagKey === 'filmModelTag'"
      :key="n + 'input'"
      v-model="childItem.value"
      placeholder="请输入"
      :min="1"
      :max="10">
    </el-input-number>

    <!-- 其他标签 -->
    <el-input-number
      v-else
      :key="n + 'input'"
      v-model="childItem.value"
      placeholder="请输入"
      :min="0">
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
    }
  },
  data () {
    return {

    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>

</style>
