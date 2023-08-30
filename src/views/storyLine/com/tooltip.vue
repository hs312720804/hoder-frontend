<template>
<el-tooltip class="item" effect="dark" :content="content" placement="top-start" :disabled="disabled">

  <!-- <i v-if="type === 'icon'" class="el-icon-message-solid el-icon-question-tip"></i> -->

  <span v-if="type === 'icon'" class="not-allow-icon"></span>

  <span class="wrapper el-button">
    <slot></slot>
  </span>

</el-tooltip>
</template>

<script>
export default {
  components: {},
  props: {
    content: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    }
  }

}
</script>

<style lang='stylus' scoped>
.el-icon-error
  color #ccc
.not-allow-icon {
  display inline-block
  width: 18px;
  height 18px;
  background: url('~@/assets/img/notAllow.png') no-repeat
  background-size: cover;
  vertical-align: text-bottom;
  cursor: no-drop;
}
</style>
