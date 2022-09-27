<template>
  <!-- 选择 operator -->
  <span>
    <el-select style="width: 80px" name="oxve" v-model="childItem.operator" class="input-inline">
      <template>
        <el-option value="="></el-option>
        <el-option value=">="></el-option>
        <el-option value="<="></el-option>
        <el-option value=">"></el-option>
        <el-option value="<"></el-option>
      </template>
    </el-select>

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
 }
</script>

