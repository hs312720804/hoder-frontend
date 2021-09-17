<template>
    <div class="crowd-status">
        <el-steps :active="content.length">
            <el-step v-if="content[0]" :title="content[0].isCreate" :description="content[0].createTime"></el-step>
            <el-step v-if="content[1]" :title="content[1].isSync"   :description="content[1].syncTime"></el-step>
            <el-step v-if="content[2]" :title="content[2].isLaunch" :description="content[2].launchTime"></el-step>
            <template v-if="content.length > 5">
                <el-step v-for="(item,index) in hitMap" :key="index" :title="content[item].isHit" :description="content[item].hitTime"></el-step>
            </template>
            <template v-if="content.length <= 5&& content[3]">
                <el-step v-if="content[3]" :title="content[3].isHit"    :description="content[3].hitTime"></el-step>
            </template>
            <template v-if="content.length > 5">
                <el-step v-if="content[content.length-1]" :title="content[content.length-1].effect" :description="content[content.length-1].prompt"></el-step>
            </template>
            <template v-if="content.length <= 5&& content[4]">
                <el-step v-if="content[4]" :title="content[4].effect"   :description="content[4].prompt"></el-step>
            </template>
        </el-steps>
    </div>
</template>

<script>
export default {
  data () {
    return {
      content: [],
      hitMap: []
    }
  },
  props: ['crowdId'],
  methods: {
    handleGetContent () {
      const crowdId = this.crowdId
      this.$service.getCrowdStatus({ crowdId: crowdId }).then((data) => {
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
        if (data.length > 5) {
          for (let i = 0; i < data.length - 4; i++) {
            this.hitMap.push(i + 3)
          }
        }
      })
    }
  },
  created () {
    this.handleGetContent()
  }
}
</script>
<style lang="stylus" scoped>
    .crowd-status >>> .el-step__title
        white-space nowrap
        padding-right 10px
</style>
