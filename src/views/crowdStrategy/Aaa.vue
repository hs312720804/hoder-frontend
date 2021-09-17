<template>
 <div class='' id='' style="heigth: 100px">
     123
    <el-input v-bind="$props"></el-input>
 </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {

    }
  },
  created () {
    console.log('prop===>', this.$props)
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>

</style>
