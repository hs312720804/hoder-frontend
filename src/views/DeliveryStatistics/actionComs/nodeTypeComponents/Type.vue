<template>
  <el-form :model="countValueObj" ref="typeForm" :rules="typeFormRules" :inline="true">
    <el-form-item prop="type">
      <el-select
        v-model="countValueObj.type"
        style="max-width: 100px; min-width: 100px;"
        name="oxve"
        class="input-inline"
        @change="handleChange"
      >
        <!-- <el-option value="cishu" label="次数"></el-option>
        <el-option value="tianshu" label="天数"></el-option> -->
          <el-option
            v-for="attrChildItem in options"
            :value="attrChildItem.value"
            :label="attrChildItem.name"
            :key="attrChildItem.value"
            :disabled="attrChildItem.value === 'day' && isDisableDaySelect"
          >
          </el-option>
      </el-select>
    </el-form-item>
    <!-- {{attrChildItem}}
    {{isDisableDaySelect}} -->
    <el-form-item>
      <el-select
        v-model="countValueObj.operator"
        style="max-width: 100px; min-width: 100px;"
        name="oxve"
        class="input-inline"
        @change="handleOperatorChange"
      >
        <el-option value="="></el-option>
        <el-option value=">="></el-option>
        <el-option value="<="></el-option>
        <el-option value=">"></el-option>
        <el-option value="<"></el-option>
        <el-option value="between" label="位于区间"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="value">

      <span v-if="countValueObj.operator == 'between'" class="flex-row" style="width: 300px; height: 31px">
        <el-input-number :value="countValueObj.value1" @input="handelInputBetween($event, countValueObj, 'value1')" @blur="handelInputBlur(countValueObj)" controls-position="right"></el-input-number>
      ~ <el-input-number :value="countValueObj.value2" @input="handelInputBetween($event, countValueObj, 'value2')" @blur="handelInputBlur(countValueObj)" controls-position="right"></el-input-number>
      </span>

      <el-input
        v-else
        placeholder="请输入"
        v-model="countValueObj.value"
        clearable
        style="max-width: 100px; min-width: 100px;"
        @input="$emit('updateValue')"
      >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      attrList: [],
      isDisableDaySelect: false,
      typeFormRules: {}
    }
  },
  props: {
    countValueObj: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    }
    // childItem: {
    //   type: Object,
    //   default: () => {}
    // },
    // isRequired: {
    //   type: Boolean,
    //   default: true
    // }
    // isView: { // 查看模式
    //   type: Boolean,
    //   default: false
    // }
  },
  watch: {
    // countValueObj: {
    //   handler (val) {
    //     debugger
    //     this.$emit('updateValue')
    //   },
    //   deep: true
    // }
    // isRequired: { // 是否必填
    //   handler (val) {
    //     this.typeFormRules = {
    //       value: [
    //         { required: val, message: '请输入值', trigger: ['blur', 'change'] }
    //       ],
    //       type: [
    //         { required: true, message: '请选择', trigger: 'change' }
    //       ]
    //     }
    //   },
    //   immediate: true
    // },
    // childItem: {
    //   handler (val) {
    //     const weekRang = val.bav.weekRang.value
    //     const timeRange = val.bav.timeRange.value
    //     // 当选择了星期范围或者时间区间时，禁用【天数】选项

    //     const flag1 = (weekRang.length === 0 || weekRang.every(item => item === ''))
    //     const flag2 = (timeRange.length === 0 || timeRange.every(item => item === ''))
    //     if (flag1 && flag2) {
    //       this.isDisableDaySelect = false
    //     } else {
    //       this.isDisableDaySelect = true
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // options: {
    //   handler (val) {
    //     this.attrList = val.map(item => {
    //       return {
    //         name: item[this.nameKey],
    //         value: item[this.valueKey],
    //         field: item[this.fieldKey]
    //       }
    //     })
    //   },
    //   immediate: true
    // }
  },
  computed: {

  },
  methods: {
    handleChange (val) {
      const obj = this.options.find(item => item.value === val)
      this.countValueObj.field = obj.field
      this.$emit('updateValue')
    },
    handleOperatorChange () {
      this.countValueObj.value = ''
      this.countValueObj.value1 = ''
      this.countValueObj.value2 = ''
      this.$emit('updateValue')
    },
    handelInputBlur (item) {
      this.isFoucs = false

      if (!this.isFoucs && item.value1 && item.value2 && item.value2 < item.value1) { // 自定义时间仅支持正数，过期时间的大数在前面，小数在后面
        const num = item.value1
        item.value1 = item.value2
        item.value2 = num
      }
    },
    handelInputBetween (val, item, key) {
      this.$set(item, key, val)
      item[key] = val
      if (!item.value1 || item.value1 < 0) {
        this.$set(item, 'value1', 0)
      }
      if (!item.value2 || item.value2 < 0) {
        this.$set(item, 'value2', 0)
      }

      item.value = `${item.value1}-${item.value2}`
    }
  }
}
</script>
<style scoped  lang="stylus">
.label-item span, .oc-item {
  margin-right: 10px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
</style>
