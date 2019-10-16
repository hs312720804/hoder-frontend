<template>
    <div>
        <div>{{content[0].isCreate}}:创建时间:{{content[0].createTime}}</div>
        <div>{{content[1].isSync}}:同步时间:{{content[1].syncTime}}</div>
        <div>{{content[2].isLaunch}}:投放时间:{{content[2].launchTime}}</div>
        <div>{{content[3].isHit}}:命中时间:{{content[3].hitTime}}</div>
        <div>{{content[4].effect}}:命中时间:{{content[4].prompt}}</div>
        <!--{{content}}-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                content: {
                    isCreate: '',
                    createTime: '',
                    isSync: '',
                    syncTime: '',
                    isLaunch: '',
                    launchTime: '',
                    isHit: ''
                },
                dataItem: {}
            }
        },
        props: ['crowdId'],
        methods: {
            handleGetContent() {
                const crowdId = this.crowdId
                if(!this.dataItem[crowdId]){
                    this.$service.getCrowdStatus({crowdId: crowdId}).then((data) => {
                        console.log(data)
                        this.content = data
                        this.dataItem[crowdId] = data
                        console.log(this.dataItem)
                    })
                }
            }
        },
        created () {
            this.handleGetContent()
        }
    }
</script>
