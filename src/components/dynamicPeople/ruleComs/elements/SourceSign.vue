<template>
 <!-- 选择产品包 -->
 <span style="margin-top: 4px;">
  <el-form-item 
    label="" 
    :prop="'rules.' + index + '.rules.' + n + '.sourceSign'" 
    :rules="{
      required: true, message: '产品包不能为空', trigger: 'change'
    }"
  >
    <el-select 
      placeholder="请选择产品包"
      clearable 
      style="width: 180px"
      name="oxve" 
      v-model="childItem.sourceSign"
      filterable 
      class="input-inline">
      <template>
        <el-option 
          v-for="item in soureceSignList" 
          :value="item.sourceSign" 
          :key="item.sourceSign"
          :label="item.sourceName">
        </el-option>
      </template>

    </el-select>
  </el-form-item>
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
      // soureceSignList: this._this.soureceSignList
    }
  },
  computed: {
    soureceSignList() {
      return this._this.soureceSignList
    }
  },
  created() {
    console.log('_this==',this._this)
  },
  methods: {

  }
 }
</script>

<style lang='stylus' scoped>

 
</style>
