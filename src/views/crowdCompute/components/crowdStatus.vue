<template>
<div v-if="history.status">
  <!-- 状态为计算中，显示进度 -->
  <template v-if="history.status >=20 && history.status < 30">
    {{ history.process }}
  </template>
  <template v-else-if="(launchStatusEnum[history.status]).code === 3">
    计算完成
  </template>
  <template v-else-if="history.status === 41">
    结果为0
  </template>
  <!-- 新增计算中时是否是人群排队中 -->
  <template
    v-else-if="((launchStatusEnum[history.status]).code === 2 && (launchStatusEnum[history.status]).childrenCode === 23)">
    {{ (launchStatusEnum[history.status]).childrenName }}
  </template>
  <template
    v-else-if="(launchStatusEnum[history.status]).code === 1 || (launchStatusEnum[history.status]).code === 4 || (launchStatusEnum[history.status]).code === 7">
    <!-- 广告数据银行 crowdType：4 -->
    <span v-if="crowdType === 4">计算</span>
    <el-button type="text" v-else @click="calculate">计算</el-button>
  </template>
  <span v-else-if="(launchStatusEnum[history.status]).code === 5" style="color: red">
    计算失败
    <!-- ，<el-button type="text" @click="calculate(scope.row)">重试</el-button> -->
  </span>
  <template v-else>
    {{ (launchStatusEnum[history.status]).name }}
  </template>

  <TipPopover :launchStatusEnum="launchStatusEnum" :status="history.status"></TipPopover>
</div>
</template>

<script>
import TipPopover from '../components/tipPopover.vue'

export default {
  components: { TipPopover },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    // history: {
    //   type: Object,
    //   default: () => {}
    // },
    launchStatusEnum: {
      type: Object,
      default: () => {}
    },
    crowdType: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {

    }
  },
  computed: {
    history () {
      return this.row ? this.row.history : {}
    }
  },
  created () {

  },
  methods: {
    // 计算
    calculate () {
      const row = this.row
      this.$service.calculateTempCrowd({ launchCrowdId: row.launchCrowdId, calType: row.calType }, '成功计算中').then(() => {
        // this.fetchData()
        this.$emit('get-list')
      })
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
