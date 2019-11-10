<template>
    <div>
        <add-more-crowd :recordId="brotherRecordId" @handleBackPrevStep="handleBackPrevStep" @handleToNextStep="handleToNextStep"></add-more-crowd>
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
        methods : {
            handleBackPrevStep(recordId) {
                this.$emit('crowdPrevStep',2,recordId)
            },
            handleToNextStep (recordId,currentPolicy) {
                this.$emit('crowdNextStep',2,recordId,currentPolicy)
            }
        },
        created () {
            this.brotherRecordId = this.recordId
        }
    }
</script>

<style scoped>

</style>
