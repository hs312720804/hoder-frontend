<template>
<div>
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
  <!-- <el-input v-model="item3.value" placeholder="请输入" style="max-width: 100px; min-width: 100px;"></el-input> -->
  <el-input
    placeholder="请输入"
    v-model="item3.value"
    clearable
    style="max-width: 100px; min-width: 100px;"
  >
  </el-input>
</div>
</template>

<script>
export default {
  data() {
    return {
      attrList: [],
      isDisableDaySelect: false
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
      handler(val) {
        console.log('val', val)
        const rangeType = val.bav.rangeType
        const weekRang = val.bav.weekRang.value
        const timeRange = val.bav.timeRange.value
        // 判断是否禁用【天数】选项
        if (weekRang.length === 0 && timeRange.length === 0 ) {
          this.isDisableDaySelect = false
        } else {
          this.isDisableDaySelect = true
        }
      },
      // deep: true,
      immediate: true
    },
    options: {
      handler(val) {
        this.attrList = val.map(item => {
          return {
            name: item.dictLabel,
            value: item.dictValue,
            field: item.tableField,
          }
        })
        console.log('2222===>', this.attrList)
      },
      // deep: true,
      immediate: true
    }
  },
  methods: {},
  created() {
    
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