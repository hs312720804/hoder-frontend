<template>
    <div>
        <group-image-list @open-add="handleOpenAddForm" :refreshList="refreshList"></group-image-list>
        <group-image-add v-if="showAdd" @close-add="handleCloseAddForm" @upsert-end="handleRefreshData"></group-image-add>
    </div>
</template>

<script>
    import groupImageList from './List'
    import groupImageAdd from './Add'
    export default {
        name: "Index",
        components: {
            groupImageList,
            groupImageAdd
        },
        data () {
            return {
                showAdd: false,
                refreshList: false
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
            }
        }
    }
</script>

<style scoped>

</style>
