<template>
  <div>
    ，
    <!-- 模块活跃 -->
    <template v-if="childItem.tagKey === 'moduleActive'">
      <span class="txt">{{ getName(actionOptions, childItem.action) }}</span>，
      <span class="txt">{{ getName(locationTypeOptions, childItem.locationType) || '' }}</span>，
      <span class="txt">{{ childItem.locationId || '' }}</span>，
      <span class="txt">{{ getName(countOptions, childItem.count) || '' }}</span>
    </template>

    <!-- 优惠券活跃 -->
    <template v-if="childItem.tagKey === 'couponsActive'">
      <span class="txt">{{ getName(couponOptions, childItem.coupon) }}</span>，
    </template>

    <span v-if="childItem.tagKey !== 'moduleActive'" class="txt">{{ getsourceSignName(childItem.sourceSign)
    }}</span>

    <!-- 产品包下单 -->
    <template v-if="childItem.tagKey === 'productOrder'">
      ，<span class="txt">{{ getName(productCountOptions, childItem.count) }}</span>
    </template>

    <!-- 试看二维码 -->
    <template v-if="childItem.tagKey === 'detailAdPos'">
      ，<span class="txt">{{ getName(detailAdPosOptions, childItem.count) }}</span>
    </template>

    <!-- 详情页曝光 -->
    <template v-if="childItem.tagKey === 'detailPageView'">
      ，<span class="txt">{{ getName(detailPageViewOptions, childItem.count) }}</span>
    </template>

    <!-- 影视模型展示 -->
    <template v-if="childItem.tagKey === 'filmModelTag'">
      <span>{{ childItem.tagCnName }}</span>
    </template>

    <template>
      <span class="sel">&nbsp;&nbsp;{{ childItem.operator || '' }}&nbsp;&nbsp;</span>
      <span class="in">
        <span>{{ childItem.value }}</span>
      </span>
    </template>

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    childItem: {
      type: Object,
      default: () => {}
    },
    soureceSignList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      couponOptions: [{
        label: '曝光',
        value: 'couponShowPv'
      }, {
        label: '领用',
        value: 'couponCreatePv'
      }, {
        label: '使用',
        value: 'couponUsePv'
      }],
      actionOptions: [{
        label: '曝光',
        value: 'show'
      },
      {
        label: '点击',
        value: 'click'
      }],
      locationTypeOptions: [{
        label: '板块位',
        value: 1
      }, {
        label: '推荐位',
        value: 2
      }],
      countOptions: [{
        label: '次数',
        value: 'pv'
      }, {
        label: '天数',
        value: 'days'
      }],
      productCountOptions: [{
        label: '下单次数',
        value: 'orderNum'
      }, {
        label: '下单天数',
        value: 'orderDays'
      }],
      // 试看二维码
      detailAdPosOptions: [{
        label: '曝光次数',
        value: 'detailAdPosShowPv'
      }, {
        label: '曝光天数',
        value: 'detailAdPosShowDays'
      }],
      // 详情页曝光
      detailPageViewOptions: [{
        label: '次数',
        value: 'detailPageViewPv'
      }, {
        label: '天数',
        value: 'detailPageViewDays'
      }]
    }
  },
  created () {

  },
  methods: {
    getName (list, key) {
      const obj = list.find(item => {
        return key === item.value
      })
      return obj ? obj.label : ''
    },
    getsourceSignName (key) {
      const obj = this.soureceSignList.find(item => {
        return key === item.sourceSign
      })
      return obj ? obj.sourceName : ''
    }
  }
}
</script>

<style lang='stylus' scoped>
@import './sty/common.styl'
@import './sty/dark.styl'
@import './sty/light.styl'
</style>
