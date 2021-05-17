<template>
<div>
  <el-select
    v-model="item3.type"
    style="max-width: 100px; min-width: 100px;"
    name="oxve"
    class="input-inline"
  >
    <el-option value="cishu" label="次数"></el-option>
    <el-option value="tianshu" label="天数"></el-option>
  </el-select>
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
    }
  },
  // props: ['tags', 'crowd', 'specialTags', 'i'],
  props: {
    item3: {
      type: Object,
      default: () => {}
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