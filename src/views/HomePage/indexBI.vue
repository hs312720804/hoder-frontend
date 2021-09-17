<template>
    <!-- 已有的BI指数-->
    <div class="ifame-outer">
        <iframe :src="pageSrc" referrerpolicy="no-referrer" class="iframe" ></iframe>
    </div>
</template>

<script>
export default {
  name: 'indexBIAA',
  data () {
    return {
      pageSrc: 'http://192.168.2.165:8080/xmind/service/BI20190606html'
    }
  }
}
</script>

<style lang="stylus" scoped>
    .ifame-outer
        position relative
        width 100%
        height 100%
    .iframe
        width 100%
        height 100%
</style>
