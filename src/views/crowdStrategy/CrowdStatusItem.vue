<template>
    <div>
        <el-steps :active="content.length">
            <el-step v-if="content[0]" :title="content[0].isCreate" :description="content[0].createTime"></el-step>
            <el-step v-if="content[1]" :title="content[1].isSync"   :description="content[1].syncTime"></el-step>
            <el-step v-if="content[2]" :title="content[2].isLaunch" :description="content[2].launchTime"></el-step>
            <el-step v-if="content[3]" :title="content[3].isHit"    :description="content[3].hitTime"></el-step>
            <el-step v-if="content[4]" :title="content[4].effect"   :description="content[4].prompt"></el-step>
        </el-steps>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                content: []
            }
        },
        props: ['crowdId'],
        methods: {
            handleGetContent() {
                const crowdId = this.crowdId
                    this.$service.getCrowdStatus({crowdId: crowdId}).then((data) => {
                        this.content = data.map(item => {
                            return {
                                isCreate: '',
                                createTime: '',
                                isSync: '',
                                syncTime: '',
                                isLaunch: '',
                                launchTime: '',
                                isHit: '',
                                ...item
                            }
                        })
                    })
            }
        },
        created () {
            this.handleGetContent()
        }
    }
</script>
