<template>
    <div>
        <PeoplePositionList v-if="showList" @open-add-page="openAddPage"></PeoplePositionList>
        <PeoplePositionAdd v-else :editId="editId" :mode="mode" @open-list-page="openListPage"></PeoplePositionAdd>
    </div>
</template>

<script>
import PeoplePositionList from './peoplePositionList'
import PeoplePositionAdd from './peoplePositionAdd'
export default {
  name: 'dataManageAA',
  components: {
    PeoplePositionAdd,
    PeoplePositionList
  },
  data () {
    return {
      showList: true,
      editId: '',
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
  },
  created () {

  }
}
</script>

<style scoped>

</style>
