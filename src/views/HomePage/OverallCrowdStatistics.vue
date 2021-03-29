<template>
    <!-- 整体人群统计-->
    <div class="ifame-outer">
        <iframe :src="pageSrc" referrerpolicy="no-referrer" class="iframe" ></iframe>
    </div>
</template>

<script>
    export default {
        name: 'OverallCrowdStatisticsAA',
        data () {
            return {
                pageSrc: 'http://datav.aliyuncs.com/share/a8611c7d492ad70e37afe8b72a92de62'
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
