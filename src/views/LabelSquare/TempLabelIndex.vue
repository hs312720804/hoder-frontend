<template>
    <div class="temp-label">
        <temp-label-list
            v-show="showList"
            @show-add="handleShowAdd"
        >
        </temp-label-list>
        <temp-label-add
            v-if="!showList"
            :editLaunchCrowdId="editLaunchCrowdId"
            :editStatus="editStatus"
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
                showList: true,
                editLaunchCrowdId: undefined,
                editStatus: undefined
            }
        },
        created () {
        },
        methods: {
            handleShowAdd (id, code) {
                this.showList = false
                this.editLaunchCrowdId = id
                this.editStatus = code
            }
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
