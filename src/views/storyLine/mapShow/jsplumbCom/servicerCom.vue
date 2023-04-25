<template>
  <div>
    <!-- <div class="shenjing-img">
    </div> -->
    <!-- 入口 -->
    <div class="e-list-sty entry" >
      <template v-if="entryList.length > 0">

        <span
          v-for="eItem in entryList"
          :key="eItem.id"
          :id="eItem.id"
          class="w"
          @click="openDetail(eItem)"
        >
          <!-- {{ eItem.id }} -->
        </span>
      </template>
      <div v-else class="branch-img">
      </div>
    </div>

    <!-- 连线 -->
    <div  class="connect-line-wrap">
      <span class="connect-name">{{ info.receptionist }}</span>
    </div>

    <!-- 出口 -->
    <div class="e-list-sty export">
      <template v-if="exportList.length > 0">
        <span
          v-for="eItem in exportList"
          :key="eItem.id"
          :id="eItem.id"
          class="w"
          :class="getClass(eItem.stopType)"
          @click="openDetail(eItem)"
        >
          <!-- {{eItem.id}} -->
        </span>
      </template>
      <div v-else class="branch-img" style="transform: rotate(180deg); margin-left: -17px; margin-top: -15px;">
      </div>
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
      // return this.info.entryList
      return this.info.entryConditions || []
    },
    exportList () {
      // return this.info.exportList
      return this.info.exportConditions || []
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
      // alert(item.id)
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
.branch-img {
  background: url('~@/assets/img/branch.svg')
  background-size: cover;
  width: 30px;
  height: 31px;
  display: inline-block;
  margin-left: 18px;
  z-index: 9;
  margin-bottom: -10px;
}
// .shenjing-img {
//   background: url('~@/assets/img/shenjing.png')
//   background-size: cover;
//   width: 30px;
//   height: 31px;
//   display: inline-block;
// }
</style>
