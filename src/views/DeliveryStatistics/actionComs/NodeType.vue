<template>
<div class='' id=''>
  <el-select
    v-if="nodeType === 2"
    placeholder="下拉框"
    class="none-pointer-events"
    v-model="nodeValue"
  >
  </el-select>
  <el-input
    v-if="nodeType === 3"
    placeholder="输入框"
    class="input-class none-pointer-events"
    v-model="nodeValue"
  >
  </el-input>

  <el-form v-if="nodeType === 6" :inline="true" >
    <el-form-item prop="type">
      <el-select
        v-model="item3.type"
        style="max-width: 100px; min-width: 100px;"
        name="oxve"
        class="input-inline"
      >
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        v-model="item3.operator"
        style="max-width: 100px; min-width: 100px;"
        name="oxve"
        class="input-inline"
      >
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
</div>
</template>

<script>
import Type from '@/components/MultipleActionTagSelect/Type'
export default {
  provide () {
    return {
      _this: this
    }
  },
  components: { Type },
  props: {
    nodeType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      nodeValue: '',
      item3: {
        type: '',
        operator: '',
        value: '',
        value1: '',
        value2: ''
      }
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>
.none-pointer-events {
  pointer-events: none;
}
.input-class {
  width: 150px;
}
</style>
