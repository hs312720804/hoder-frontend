<template>
  <span v-if="getIsShow(status)">
    <el-popover
      placement="top"
      trigger="hover"
    >
      状态码：<span style="font-weight: 600;">{{ (launchStatusEnum[status]).childrenCode }}</span><br/>
      <span style="color: red">{{ launchStatusEnum[status].childrenName}}</span>

      <span slot="reference" class="priority-tip">?</span>
    </el-popover>
  </span>
</template>

<script>
export default {
  props: {
    launchStatusEnum: {
      type: Array,
      default: () => {}
    },
    status: {
      type: Array,
      default: () => {}
    }
  },
  components: {},
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    getIsShow (status) {
      const launchStatusEnum = this.launchStatusEnum
      // 状态为计算中，显示进度
      const flag = status >= 20 && status < 30
      // 结果为0
      const flag2 = status === 41
      // 人群排队
      const flag3 = launchStatusEnum[status].code === 2 && (launchStatusEnum[status]).childrenCode === 23
      // 计算失败
      const flag4 = launchStatusEnum[status].code === 5
      // // 待计算
      // const flag5 = launchStatusEnum[status].code === 1 || launchStatusEnum[status].code === 4 || launchStatusEnum[status].code === 7

      return flag || flag2 || flag3 || flag4
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
