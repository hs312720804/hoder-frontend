<template>
  <div>
    <add-more-crowd
      @resetFormData="resetFormData"
      :recordId="brotherRecordId"
      @handleBackPrevStep="handleBackPrevStep"
      @handleToNextStep="handleToNextStep"
    ></add-more-crowd>
  </div>
</template>

<script>
import addMoreCrowd from '../crowdStrategy/AddMoreCrowds'
export default {
  name: "CreateCrowd",
  components: {
    addMoreCrowd
  },
  data () {
    return {
      brotherRecordId: undefined
    }
  },
  props: ['recordId'],
  methods: {
    handleBackPrevStep (recordId) {
      this.$emit('crowdPrevStep', 2, recordId)
    },
    handleToNextStep (recordId, tempPolicyAndCrowd) {
      debugger
     // this.$emit('crowdNextStep', 2, recordId, tempPolicyAndCrowd)
    },
    resetFormData () {
      this.$emit('resetFormData')
    }
  },
  created () {
    this.brotherRecordId = this.recordId
  }
}
</script>

<style scoped>
</style>
