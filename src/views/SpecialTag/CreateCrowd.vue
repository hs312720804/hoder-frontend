<template>
  <div>
    <add-more-crowd
      @resetFormData="resetFormData"
      :initTagList="brotherInitTagList"
      @handleBackPrevStep="handleBackPrevStep"
      @handleToNextStep="handleToNextStep"
      @handleDirectStrategyListBrother="handleDirectStrategyListBrother"
    ></add-more-crowd>
  </div>
</template>

<script>
import addMoreCrowd from './AddMoreCrowds2'
export default {
  name: 'CreateCrowd',
  components: {
    addMoreCrowd
  },
  data () {
    return {
      // brotherRecordId: undefined
      brotherInitTagList: undefined
    }
  },
  // props: ['recordId'],
  props: ['initTagList'],
  methods: {
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 1)
    },
    handleToNextStep (tempPolicyAndCrowd) {
      this.$emit('crowdNextStep', 1, tempPolicyAndCrowd)
    },
    resetFormData () {
      this.$emit('resetFormData')
    },
    handleDirectStrategyListBrother () {
      this.$emit('handleDirectStrategyList')
    }
  },
  created () {
    this.brotherInitTagList = this.initTagList
  }
}
</script>

<style scoped>
</style>
