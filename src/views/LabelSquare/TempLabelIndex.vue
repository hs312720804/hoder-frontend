<template>
    <div class="temp-label">
        <temp-label-list
            v-show="showList"
            @show-add="handleShowAdd"
            :refresh="refreshFlag"
        >
        </temp-label-list>
        <temp-label-add
            v-if="!showList"
            :editLaunchCrowdId="editLaunchCrowdId"
            :editStatus="editStatus"
            @cancel-add = "showList = true"
            @changeStatus = "handleRefreshList"
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
                editStatus: undefined,
                refreshFlag: false
            }
        },
        created () {
        },
        methods: {
            handleShowAdd (id, code) {
                this.showList = false
                this.editLaunchCrowdId = id
                this.editStatus = code
            },
            handleRefreshList () {
                this.refreshFlag = true
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
