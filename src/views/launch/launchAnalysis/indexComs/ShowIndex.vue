<template>
 <div>
  <div class="sticky-bar">
    <template v-if="Object.keys(allCrowdData).length > 1">
      <div
        v-for="(item, key) in allCrowdData"
        :key="key"
        class="sticky-bar-item"
      >
        {{ key }}- {{ item.crowdName }}
      </div>
    </template>
  </div>

    <div class="show-index-panel">
      <showData
        v-for="(item, key) in allCrowdData" :key="key"
        ref="domShowData"
        :crowdId="key"
        :pageStatus="item.status"
        :overview="item.overview ? item.overview.data : {}"
        :allChartData="item"
        :class="key%2 === 0 ? 'd-color': 's-color'"
        :isSingShowPanel="Object.keys(allCrowdData).length === 1"
      >
      </showData>
    </div>

    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="内容型" name="one">
      </el-tab-pane>
      <el-tab-pane label="付费型" name="two">
      </el-tab-pane>
    </el-tabs>

    <div class="show-index-panel">
      <showChart
        v-for="(item, key) in allCrowdData" :key="key"
        :activeName="activeName"
        :crowdId="key"
        :pageStatus="item.status"
        :overview="item.overview ? item.overview.data : {}"
        :allChartData="item"
        :class="key%2 === 0 ? 'd-color': 's-color'"
        :isSingShowPanel="Object.keys(allCrowdData).length === 1"
      >
      </showChart>
    </div>

</div>
</template>

<script>
import showData from './showData.vue'
import showChart from './showChart.vue'
export default {
  components: { showData, showChart },
  props: {
    // crowdId: {
    //   type: [Number, String],
    //   default: 0
    // },
    // pageStatus: {
    //   type: Number,
    //   default: 0
    // },
    // overview: {
    //   type: Object,
    //   default: () => {}
    // },
    allChartData: {
      type: Object,
      default: () => {}
    },
    allCrowdData: {
      type: Object,
      default: () => {}
    }

  },
  data () {
    return {
      activeName: 'one'
    }
  },

  mounted () {
  }

}
</script>
<style lang='stylus' scoped>
@import url('~@/assets/overview.styl')
.d-color {
  .ibox{
    background #83c7f724 !important
  }
}

.s-color {
  .ibox{
    background #c9e1bd1c !important;
  }
}
.sticky-bar {
  display: flex;
  column-gap: 10px;
  position: sticky;
  top: -20px;
  text-align: center;
  z-index: 99;
  color #fff
  font-size: 14px;
  font-weight: 600;
  .sticky-bar-item {
    background-color: #3974f6;
    // overflow: auto;
    position: relative;
    bottom: 0;
    flex: 1
    height: 36px;
    line-height: 36px;
    border-radius: 10px 10px 0 0;
  }
}
.show-index-panel {
  display: flex;
  column-gap: 10px;
}
.d-color {
  // background red
}
</style>
