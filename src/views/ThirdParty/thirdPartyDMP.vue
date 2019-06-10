<template>
    <!-- 第三方DMP-->
    <div class="ifame-outer">
        <iframe :src="pageSrc" referrerpolicy="no-referrer" class="iframe" ></iframe>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                pageSrc: 'https://www.getui.com/cn/'
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
