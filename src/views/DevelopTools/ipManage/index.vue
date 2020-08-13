<template>
    <div>
        <ip-manage-list v-if="showList" @open-add-page="openAddPage"></ip-manage-list>
        <ip-manage-add v-else :editId="editId" :mode="mode" @open-list-page="openListPage"></ip-manage-add>
    </div>
</template>

<script>
    import ipManageList from './list'
    import ipManageAdd from './add'
    export default {
        name: "ipManageAA",
        components: {
            ipManageList,
            ipManageAdd
        },
        data () {
            return {
                showList: true,
                editId: undefined,
                mode: ''
            }
        },
        methods: {
            openAddPage (rowId, mode) {
                this.showList = false
                this.editId = rowId
                this.mode = mode
            },
            openListPage () {
                this.showList = true
            }
        }
    }
</script>

<style scoped>

</style>
