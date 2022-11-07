<template>
  <div id="app">2222
    <el-scrollbar style="height:100%" wrap-style="overflow-x:hidden;">
    <router-view />
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="stylus" scoped>
#app
  height 100%
  overflow hidden
</style>
