<template>
  <el-form :model="item3" ref="typeForm" :rules="typeFormRules" :inline="true">
    <el-select
      v-model="item3.type"
      style="max-width: 100px; min-width: 100px;"
      name="oxve"
      class="input-inline"
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
    <!-- {{attrChildItem}}
    {{isDisableDaySelect}} -->
    <el-select
      v-model="item3.operator"
      style="max-width: 100px; min-width: 100px;"
      name="oxve"
      class="input-inline"
    >
      <el-option value="="></el-option>
      <el-option value=">="></el-option>
      <el-option value="<="></el-option>
      <el-option value=">"></el-option>
      <el-option value="<"></el-option>
    </el-select>

    <el-form-item prop="value">
      <el-input
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
  data () {
    return {
      attrList: [],
      isDisableDaySelect: false,
      typeFormRules: {
        value: [
          { required: true, message: '请输入值', trigger: 'blur' },
          { required: true, message: '请输入值', trigger: 'change' }
        ]
      }
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
    }
  },
  watch: {
    childItem: {
      handler (val) {
        const weekRang = val.bav.weekRang.value
        const timeRange = val.bav.timeRange.value
        // 当选择了星期范围或者时间区间时，禁用【天数】选项
        if (weekRang.length === 0 && timeRange.length === 0) {
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
        console.log('2222===>', this.attrList)
      },
      // deep: true,
      immediate: true
    }
  },
  methods: {}
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