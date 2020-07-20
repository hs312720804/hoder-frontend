<template>
<div>

  <el-input
    ref="input"
    type="text"
    :name="name"
    :autocomplete="autocomplete"
    :value="inputValue"
    @input="handleInputValue"
    @blur="$emit('blur')"
    @change="$emit('change')"
    :disabled="disabled"
    :placeholder="placeholder"
    :maxlength="maxlength">
    <span
      v-if="prepend"
      slot="prepend">
      {{prepend}}
    </span>
    <span
      v-if="append"
      slot="append">
      {{append}}
    </span>
  </el-input>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      inputValue: undefined
    }
  },
  watch: {
    'inputValue': function(newV, oldV) {
      newV = _.trim(newV).replace(/,/g, '')
      if (newV !== null && newV !== undefined) {
        if (parseInt(newV) > this.max && newV.length <= this.maxlength) {
          this.inputValue = oldV
          this.$message({
            type: 'error',
            message: '最大值不能超过' + this.max
          })
        }
      }
    }
  },

  props: ['value', 'disabled', 'append', 'prepend', 'placeholder', 'name', 'autocomplete', 'maxlength', 'max', 'isIncludeZero'],
  methods: {
    handleInputValue(val) {
      val = _.trim(val).replace(/,/g, '')
      if (val === '' || /^[1-9]\d*$/.test(val) || (val === '0' && this.isIncludeZero)) {
        if (val !== '') {
          this.inputValue = this.format_number(val)
        } else {
          this.inputValue = val
        }
        this.$emit('input', this.inputValue)
      }
    },
    getPositiveInt (data) {
      return data.replace(/,/g, '')
    },
    format_number(n) {
      var b = parseInt(n).toString()
      var len = b.length
      if (len <= 3) { return b }
      var r = len % 3
      return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',')
    }
  },
  created() {
    this.$watch('value', (val) => {
      if (this.inputValue !== val) {
        this.inputValue = this.format_number(val)
        this.$emit('input', this.inputValue)
      }
    }, {
      immediate: true
    })
  }
}
</script>
