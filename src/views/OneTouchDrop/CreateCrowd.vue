<template>
  <div>
    <add-more-crowd
      :recordId="brotherRecordId"
      :isDynamicPeople="isDynamicPeople"
      :policyId="policyId"
      :policyName="policyName"
      :crowdId="crowdId"
      @resetFormData="resetFormData"
      @handleBackPrevStep="handleBackPrevStep"
      @handleToNextStep="handleToNextStep"
      @handleDynamicCrowdNextStep="handleDynamicCrowdNextStep"
      @handleDirectStrategyListBrother="handleDirectStrategyListBrother"
    >
    </add-more-crowd>
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
  props: ['recordId', 'isDynamicPeople', 'policyId', 'policyName', 'crowdId'],
  methods: {
    handleBackPrevStep (recordId) {
      this.$emit('crowdPrevStep', 1, recordId)
    },
    handleToNextStep (recordId, tempPolicyAndCrowd) {
      this.$emit('crowdNextStep', 1, recordId, tempPolicyAndCrowd)
    },
    handleDynamicCrowdNextStep (policyId, policyName, crowdId) {
      this.$emit('dynamicCrowdNextStep', 1, policyId, policyName, crowdId)
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
