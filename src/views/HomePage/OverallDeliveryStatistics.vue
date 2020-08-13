<template>
    <!-- 整体指标统计-->
    <div class="ifame-outer">
        <a href="http://bi.skysrt.com" target="_blank">点击跳转到整体指标统计页面</a>
        <!--<iframe :src="pageSrc" referrerpolicy="no-referrer" class="iframe" ></iframe>-->
    </div>
</template>

<script>
    export default {
        name: 'OverallDeliveryStatisticsAA',
        data () {
            return {
                // pageSrc: 'http://bi.skysrt.com'
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
