<template>
  <div>
    <!-- <div class="shenjing-img">
    </div> -->
    <!-- 入口 -->
    <div class="e-list-sty entry">
      <template v-if="entryList.length > 0">

        <span
          v-for="eItem in entryList"
          :key="eItem.id"
          :id="`${idPer}${eItem.id}`"
          class="w"
          @dblclick="openDetail({...eItem, ruleType: 'entry'})"
        >
          {{ eItem.id }}
        </span>
      </template>
      <div v-else class="branch-img">
      </div>
    </div>

    <!-- 连线 -->
    <div class="connect-line-wrap">
      <span @dblclick="$emit('selectServicer', info.id)" class="connect-name" :id="`${idPer}${info.id}`">{{ info.id }}--{{info.receptionist }}</span>
    </div>

    <!-- 出口 -->
    <div class="e-list-sty export">
      <template v-if="exportList.length > 0">
        <span
          v-for="eItem in exportList"
          :key="eItem.id"
          :id="`${idPer}${eItem.id}`"
          class="w"
          :class="getClass(eItem.stopType)"
          @dblclick="openDetail({...eItem, ruleType: 'export'})"
        >
          {{ eItem.id }}
        </span>
      </template>
      <div v-else class="branch-img" style="transform: rotate(180deg); margin-left: -17px; margin-top: -15px;">
      </div>
    </div>

  </div>
</template>
<script>
import { options } from '@/views/storyLine/utils'

// console.log('lidao->', ForceDirected())
export default {
  name: 's-com',
  components: {
  },

  props: {
    info: {
      type: Object,
      default: () => { }
    },
    idPer: {
      type: String,
      default: ''
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
      drawer: false,
      options: options,
      editClientRow: {},
      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      soureceSignList: []
    }
  },
  created () {
    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })
  },
  mounted () {

  },
  methods: {

    openDetail (item) {
      // this.drawer = true
      // this.editClientRow = item
      // console.log('item--->', item)
      this.$emit('showRuleDetail', item)
      // alert(item.id)
    },
    getClass (type) {
      // const maps = {
      //   4: 'red', // 不喜欢，切换
      //   2: 'green', // 直接转化
      //   1: 'yellow', // 继续种草
      //   3: 'purple' // 继续观察
      // }
      const obj = this.options.find(item => item.value === type)

      return obj ? obj.color : ''
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
