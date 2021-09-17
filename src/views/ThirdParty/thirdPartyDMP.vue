<template>
    <!-- 第三方DMP-->
    <div class="ifame-outer">
        <a href="https://www.getui.com/cn/" target="_blank">点击跳转到第三方页面</a>
        <!--<iframe :src="pageSrc" referrerpolicy="no-referrer" class="iframe" ></iframe>-->
    </div>
</template>

<script>
export default {
  name: 'thirdPartyDMPAA',
  data () {
    return {
      // pageSrc: 'https://www.getui.com/cn/'
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
