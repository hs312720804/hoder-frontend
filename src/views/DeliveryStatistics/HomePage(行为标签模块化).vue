<template>
<div class="row-wrap">
  <Left class="left-block"></Left>
  <Right class="right-block"></Right>
</div>
</template>
<script>
import Right from './actionComs/Right.vue'
import Left from './actionComs/Left.vue'

export default {
  name: 'actionCom',
  components: {
    Right,
    Left
  },
  created () {
    const a = [1, 23]
    const b = `${a}`
    console.log(b)
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="stylus" scoped>
.row-wrap {
  display flex
  column-gap: 20px;
  height: 80vh;
  position: relative;
  top: 0;
}
.left-block {
  flex: 1;
  width: 50%;
  box-shadow: 20px 0px 23px -13px hsl(0deg 0% 93.06%)
}
.right-block {
  max-width: 500px;
  flex: 0 0 500px;
  position: relative;
  // box-shadow: inset -1px 0 0 #e7e7e7;
}
</style>
