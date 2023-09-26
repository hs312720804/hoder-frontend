<template>
  <!-- 输入 value -->
  <el-form-item
    label=""
    :prop="'rules.' + index + '.rules.' + n + '.value'"
    :rules="[
      { validator: validatePass, trigger: ['blur', 'change'] },
    ]"
    class="form-item-styl"
  >
  <!-- recommendedValue -- {{ recommendedValue }} -->
    <!-- 影视模型  只能在 1 - 10 中选择-->
    <el-input-number
      v-if="childItem.tagKey === 'filmModelTag'"
      :key="n + 'input'"
      v-model.number="childItem.value"
      placeholder="请输入"
      :min="1"
      :max="10">
    </el-input-number>

    <!-- 其他标签 -->

    <el-input
      v-else
      :key="n + 'input'"
      v-model.number="childItem.value"
      placeholder="请输入"
      :min="0"
      :class="{ 'recommended-value': childItem.value === recommendedValue }"
      :clearable="childItem.value !== recommendedValue"
      style="width: 90px">
    </el-input>
  </el-form-item>
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
    // value 值的校验
    validatePass (rule, value, callback) {
      if (value === undefined || value === null || value === '') {
        return callback(new Error('请输入值'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value < 0) {
          callback(new Error('必须大于0'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.recommended-value  {
  // ::v-deep .el-input__inner {
  //   padding-left: 0;
  // }
  // ::v-deep .el-input__inner {
  &:after {
    content: '（推荐值）'
    position: absolute;
    white-space: nowrap;
    left: 26px;
    font-size: 12px;
    color: #999;
    line-height: 32px;
  }
}
// }

</style>
