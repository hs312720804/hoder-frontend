<template>
    <div>
        <notice-list v-if="showList" @open-add-page="openAddPage"></notice-list>
        <notice-add v-else :editId="editId" :mode="mode" @open-list-page="openListPage"></notice-add>
    </div>
</template>

<script>
    import noticeList from './list'
    import noticeAdd from './add'
    export default {
        name: "noticeAA",
        components: {
            noticeList,
            noticeAdd
        },
        data () {
            return {
                showList: true,
                editId: '',
                mode: ''
            }
        },
        watch : {
            '$route.query' (val) {
                if (Object.keys(val).length !== 0) {
                    this.openAddPage(val.noticeId, val.mode)
                }
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
            const routePrams = this.$route.query
            if (Object.keys(routePrams).length !== 0) {this.openAddPage(routePrams.noticeId,routePrams.mode)}
        }
    }
</script>

<style scoped>

</style>
