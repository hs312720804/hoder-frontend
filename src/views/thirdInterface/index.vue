<template>
    <div>
        <thirdInterfaceList v-if="showList" @open-add-page="openAddPage"></thirdInterfaceList>
        <thirdInterfaceAdd v-else :editId="editId" :mode="mode" @open-list-page="openListPage"></thirdInterfaceAdd>
    </div>
</template>

<script>
    import thirdInterfaceList from './list'
    import thirdInterfaceAdd from './add'
    export default {
        name: "thirdInterfaceAA",
        components: {
            thirdInterfaceAdd,
            thirdInterfaceList
        },
        data () {
            return {
                showList: true,
                editId: '',
                mode: ''
            }
        },
        methods: {
            openAddPage (rowId,mode) {
                this.showList = false
                this.editId = rowId
                this.mode = mode
            },
            openListPage () {
                this.showList = true
            }
        },
        created () {

        }
    }
</script>

<style scoped>

</style>
