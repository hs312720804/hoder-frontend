<template>
  <div>
    <!-- 入口 -->
    <div class="e-list-sty">
      <span
        v-for="eItem in entryList"
        :key="eItem.id"
        :id="eItem.id"
        class="w"
        @click="openDetail(eItem)"
      >
        <!-- {{ eItem.id }} -->
      </span>
    </div>

    <!-- 连线 -->
    <div  class="connect-line-wrap" v-if="entryList.length > 0 && exportList.length > 0">
      <span class="connect-name" style="background-color: #fff;">{{ info.receptionist }}</span>
    </div>

    <!-- 出口 -->
    <div class="e-list-sty">
      <span
        v-for="eItem in exportList"
        :key="eItem.id"
        :id="eItem.id"
        class="w"
        :class="getClass(eItem.type)"
        @click="openDetail(eItem)"
      >
        <!-- {{eItem.id}} -->
      </span>
    </div>
  </div>
</template>
<script>

// console.log('lidao->', ForceDirected())
export default {
  name: 's-com',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    entryList () {
      return this.info.entryList
    },
    exportList () {
      return this.info.exportList
    }
  },
  data () {
    return {
      j: ''
    }
  },
  mounted () {

  },
  methods: {
    openDetail (item) {
      alert(item.id)
    },
    getClass (type) {
      const maps = {
        0: 'red', // 不喜欢，切换
        1: 'green', // 直接转化
        2: 'yellow', // 继续种草
        3: 'purple' // 继续观察
      }
      return maps[type]
    }
  }
}
</script>

<style scoped lang="stylus">
@import './style.styl'

</style>
