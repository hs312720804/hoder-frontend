<template>
    <div>
        <group-image-list @open-add="handleOpenAddForm" @open-echarts="handleOpenEcharts" :refreshList="refreshList"></group-image-list>
        <group-image-add v-if="showAdd" @close-add="handleCloseAddForm" @upsert-end="handleRefreshData"></group-image-add>
        <device-echarts v-if="showEcharts" :current-cid="currentId" @close-echarts="handleCloseEcharts"></device-echarts>
    </div>
</template>

<script>
    import groupImageList from './List'
    import groupImageAdd from './Add'
    import deviceEcharts from './deviceEcharts'
    export default {
        name: "Index",
        components: {
            groupImageList,
            groupImageAdd,
            deviceEcharts
        },
        data () {
            return {
                showAdd: false,
                refreshList: false,
                currentId: undefined,
                showEcharts: false
            }
        },
        methods: {
            handleOpenAddForm () {
                this.showAdd = true
            },
            handleCloseAddForm () {
                this.showAdd = false
            },
            handleRefreshData () {
                this.refreshList = true
            },
            handleOpenEcharts (id) {
                this.currentId = id
                this.showEcharts = true
            },
            handleCloseEcharts () {
                this.showEcharts = false
            }
        }
    }
</script>

<style scoped>

</style>
