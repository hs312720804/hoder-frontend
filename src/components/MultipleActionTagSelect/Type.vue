<template>
  <el-form :model="item3" ref="typeForm" :rules="typeFormRules" :inline="true" :disabled="isView">
    <el-form-item prop="type">
      <el-select
        v-model="item3.type"
        style="max-width: 100px; min-width: 100px;"
        name="oxve"
        class="input-inline"
        @change="handleChange"
      >
        <!-- <el-option value="cishu" label="次数"></el-option>
        <el-option value="tianshu" label="天数"></el-option> -->
        <template v-for="attrChildItem in attrList">
          <el-option
            :value="attrChildItem.value"
            :label="attrChildItem.name"
            :key="attrChildItem.value"
            :disabled="attrChildItem.value === 'day' && isDisableDaySelect"
          >
          </el-option>
        </template>
      </el-select>
    </el-form-item>
    <!-- {{attrChildItem}}
    {{isDisableDaySelect}} -->
    <el-form-item>
      <el-select
        v-model="item3.operator"
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

      <span v-if="item3.operator == 'between'" class="flex-row" style="width: 300px; height: 31px">
        <el-input-number :value="item3.value1" @input="handelInputBetween($event, item3, 'value1')" @blur="handelInputBlur(item3)" controls-position="right"></el-input-number>
      ~ <el-input-number :value="item3.value2" @input="handelInputBetween($event, item3, 'value2')" @blur="handelInputBlur(item3)" controls-position="right"></el-input-number>
      </span>

      <el-input
        v-else
        placeholder="请输入"
        v-model="item3.value"
        clearable
        style="max-width: 100px; min-width: 100px;"
      >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  inject: ['_this'],
  data () {
    return {
      attrList: [],
      isDisableDaySelect: false,
      typeFormRules: {}
    }
  },
  // props: ['tags', 'crowd', 'specialTags', 'i'],
  props: {
    item3: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    },
    childItem: {
      type: Object,
      default: () => {}
    },
    isRequired: {
      type: Boolean,
      default: true
    }
    // isView: { // 查看模式
    //   type: Boolean,
    //   default: false
    // }
  },
  watch: {
    isRequired: { // 是否必填
      handler (val) {
        this.typeFormRules = {
          value: [
            { required: val, message: '请输入值', trigger: ['blur', 'change'] }
          ],
          type: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
      },
      immediate: true
    },
    childItem: {
      handler (val) {
        const weekRang = val.bav.weekRang.value
        const timeRange = val.bav.timeRange.value
        // 当选择了星期范围或者时间区间时，禁用【天数】选项

        const flag1 = (weekRang.length === 0 || weekRang.every(item => item === ''))
        const flag2 = (timeRange.length === 0 || timeRange.every(item => item === ''))
        if (flag1 && flag2) {
          this.isDisableDaySelect = false
        } else {
          this.isDisableDaySelect = true
        }
      },
      deep: true,
      immediate: true
    },
    options: {
      handler (val) {
        this.attrList = val.map(item => {
          return {
            name: item.dictLabel,
            value: item.dictValue,
            field: item.tableField
          }
        })
      },
      immediate: true
    }
  },
  computed: {
    isView () {
      return this._this && this._this.isView ? this._this.isView : false
    }
  },
  methods: {
    handleChange (val) {
      const obj = this.attrList.find(item => item.value === val)
      console.log('obj==>', obj)
      this.item3.field = obj.field
    },
    handleOperatorChange () {
      this.item3.value = ''
      this.item3.value1 = ''
      this.item3.value2 = ''
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
      console.log('val===', val)
      console.log('item===', item)
      console.log('key===', key)

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
