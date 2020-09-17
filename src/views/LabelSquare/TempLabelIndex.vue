<template>
    <div class="temp-label">
        <temp-label-list
            v-show="showList"
            @show-add="handleShowAdd"
            :refreshFlag="refreshFlag"
            :show-selection="showSelection"
            :currentSelectTag="currentSelectTag"
            @table-selected="handleTableSelected"
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
        props: {
            showSelection: {
                type: Boolean
            },
            currentSelectTag: {
                type: Array
            }
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
                this.refreshFlag = false
                this.editLaunchCrowdId = id
                this.editStatus = code
            },
            handleRefreshList () {
                this.showList = true
                this.refreshFlag = true
            },
            handleTableSelected (val, mode) {
                this.$emit('get-table-selected',val, mode)
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
