<template>
  <div>
    <add-more-crowd
      @resetFormData="resetFormData"
      :recordId="brotherRecordId"
      @handleBackPrevStep="handleBackPrevStep"
      @handleToNextStep="handleToNextStep"
      @handleDirectStrategyListBrother="handleDirectStrategyListBrother"
    ></add-more-crowd>
  </div>
</template>

<script>
import addMoreCrowd from '../crowdStrategy/AddMoreCrowds'
export default {
  name: 'CreateCrowd',
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
      this.$emit('crowdPrevStep', 1, recordId)
    },
    handleToNextStep (recordId, tempPolicyAndCrowd) {
      this.$emit('crowdNextStep', 1, recordId, tempPolicyAndCrowd)
    },
    resetFormData () {
      this.$emit('resetFormData')
    },
    handleDirectStrategyListBrother () {
      this.$emit('handleDirectStrategyList')
    }
  },
  created () {
    this.brotherRecordId = this.recordId
  }
}
</script>

<style scoped>
</style>
