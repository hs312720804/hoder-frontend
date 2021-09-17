<template>
    <div>
        <el-tooltip class="item" effect="dark" :content="content || '加载中...'" placement="right-end">
            <span @mouseover="handleGetContent()">{{ label }}</span>
        </el-tooltip>
    </div>
</template>

<script>
export default {
  data () {
    return {
      content: ''
    }
  },
  props: ['policyId', 'label'],
  methods: {
    handleGetContent () {
      const policyId = this.policyId
      if (!this.content) {
        this.$service.getCrowdsByPolicyId({ policyId }).then((data) => {
          const crowdIds = []
          data.forEach((item) => {
            crowdIds.push(item.crowdId)
          })
          this.content = '策略id:' + policyId + ';包含人群id:' + crowdIds
        })
      }
    }
  }
}
</script>
