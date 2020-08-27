<template>
    <div class="temp-label">
        <temp-label-list
            v-show="showList"
            @show-add="showList = false"
        >
        </temp-label-list>
        <temp-label-add
            v-if="!showList"
            @cancel-add = "showList = true"
        >
        </temp-label-add>
    </div>
</template>

<script>
    import tempLabelList from './TempLabelList'
    import tempLabelAdd from './TempLabelAdd'
    export default {
        name: "TempLabel",
        components: {
            tempLabelList,
            tempLabelAdd
        },
        data () {
            return {
                showList: true
            }
        },
        created () {
        },
        methods: {

        }
    }
</script>

<style lang="stylus" scoped>
.temp-label
    margin-top 50px
.temp-label >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
</style>
