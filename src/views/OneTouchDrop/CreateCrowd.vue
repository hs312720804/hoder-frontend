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
            handleBackPrevStep() {
                this.$emit('prevStep',2)
            },
            handleToNextStep (recordId) {
                this.$emit('nextStep',2,recordId)
            }
        },
        created () {
            console.log('我是create')
            console.log(this.recordId)
            this.brotherRecordId = this.recordId
        }
    }
</script>

<style scoped>

</style>
