<template>
    <div>
        <add-more-crowd @handleBackPrevStep="handleBackPrevStep" @handleToNextStep="handleToNextStep"></add-more-crowd>
    </div>
</template>

<script>
    import addMoreCrowd from '../crowdStrategy/AddMoreCrowds'
    export default {
        name: "CreateCrowd",
        components: {
            addMoreCrowd
        },
        props: ['recordId'],
        methods : {
            handleBackPrevStep() {
                this.$emit('prevStep',2)
            },
            handleToNextStep () {
                this.$emit('nextStep',2)
            }
        },
        created () {
            console.log(this.recordId)
        }
    }
</script>

<style scoped>

</style>
