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
      :min="0"
      :class="{ 'recommended-value': childItem.value === recommendedValue }">
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
    recommendedValue: { // 推荐值
      type: Number,
      default: undefined
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
.recommended-value  {
  width: 160px
  ::v-deep .el-input__inner {
    padding-left: 0;
  }
  ::v-deep .el-input {
    &:after {
      content: '（推荐值）'
      position: absolute;
      white-space: nowrap;
      left: 62px;
      font-size: 12px;
      color: #999;
      line-height: 32px;
    }
  }
}

</style>
