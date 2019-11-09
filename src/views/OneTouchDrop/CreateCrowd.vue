<template>
    <div>
        <add-more-crowd></add-more-crowd>
    </div>
</template>

<script>
    import addMoreCrowd from '../crowdStrategy/AddMoreCrowds'
    export default {
        name: "CreateCrowd",
        components: {
            addMoreCrowd
        },
        data () {}
    }
</script>

<style scoped>

</style>
