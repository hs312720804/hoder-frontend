<template>
    <!-- 投前人群画像-->
    <div class="ifame-outer">
        <div>页面为给出</div>
        <iframe :src="pageSrc" referrerpolicy="no-referrer" class="iframe" ></iframe>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                pageSrc: 'http://192.168.2.226/#/explore'
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
