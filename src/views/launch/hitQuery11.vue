<template>
  <div class="box7">
    <div class="title">处理进度</div>
    <div class="box7-content">
      <div class="line-box">
        <div class="line1">
          <div :class="box1Info.dqhjbh === '0101' ? 'now' : box1Info.dqhjbh > '0101' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>省公司下发</span></div>
          <div :class="box1Info.dqhjbh > '0101' ? 'finishedLine' : ''" class="xiafa">下发</div>
          <div :class="box1Info.dqhjbh === '0102' ? 'now' : box1Info.dqhjbh > '0102' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>地市局下发</span></div>
          <div :class="box1Info.dqhjbh > '0102' ? 'finishedLine' : ''" class="xiafa">下发</div>
          <div :class="box1Info.dqhjbh === '0103' ? 'now' : box1Info.dqhjbh > '0103' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>区县局下发</span></div>
          <div :class="box1Info.dqhjbh > '0103' ? 'finishedLine' : ''" class="xiafa">下发</div>
          <div :class="box1Info.dqhjbh === '0104' ? 'now' : box1Info.dqhjbh > '0104' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>派单</span></div>
          <div :class="box1Info.dqhjbh > '0104' ? 'finishedLine' : ''" class="middle-xiafa">下发</div>
        </div>
        <div class="line2">
          <div :class="box1Info.dqhjbh === '0105' ? 'now' : box1Info.dqhjbh > '0105' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>工单处理</span></div>
          <div :class="box1Info.dqhjbh > '0105' ? 'finishedLine' : ''" class="shangjiao">上交</div>
          <div :class="box1Info.dqhjbh === '0106' ? 'now' : box1Info.dqhjbh > '0106' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>班长审核</span></div>
          <div :class="box1Info.dqhjbh > '0106' ? 'finishedLine' : ''" class="shangjiao">上交</div>
          <div :class="box1Info.dqhjbh === '0107' ? 'now' : box1Info.dqhjbh > '0107' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>区县局审核</span></div>
          <div :class="box1Info.dqhjbh > '0107' ? 'finishedLine' : ''" class="shangjiao">上交</div>
          <div :class="box1Info.dqhjbh === '0108' ? 'now' : box1Info.dqhjbh > '0108' ? 'finishedIcon' : ''" class="item"><div class="icon"></div><span>地市局审核</span></div>
          <div :class="box1Info.dqhjbh > '0108' ? 'finishedLine' : ''" class="last-shangjiao">上交</div>
        </div>
        <div :class="box1Info.dqhjbh === '0110' ? 'now' : box1Info.dqhjbh > '0110' ? 'finishedIcon' : ''" class="last-item"><div class="icon"></div><span>归档</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hitQueryAA',
  data () {
    return {
      box1Info: '0105',
      form: {
        policyId: '4107',
        mac: '1ca7708b28e4',
        cOpenId: '',
        thirdUserId: '',
        vUserId: ''
      },
      // dateRange: [],
      // dateList: [],
      rules: {
        policyId: { required: true, message: '请输入策略id', trigger: 'blur' },
        mac: { required: true, message: '请输入mac', trigger: 'blur' }
        // sourceSign: { required: true, message: '请输入sourceSign', trigger: 'blur' }
      },
      // pickerOptions: { // 策略投放后到今天的日期都可以选
      //   disabledDate: (time) => {
      //     // const day1 = 30 * 24 * 3600 * 1000
      //     let maxTime = Date.now()
      //     // let minTime = Date.now() - day1
      //     return time.getTime() > maxTime
      //   }
      // },
      list: [],
      noneText: '暂无数据'
      // pageId: 'graph-container',
      // graph: null,
      // dialogVisible: false,
      // allCrowdRule: [],
      // len: 10 // 模拟数据个数
    }
  },

  created () {

  },
  mounted () {
    // this.init()

  },
  methods: {

    getFilter () {
      const filter = {
        policyId: '', // 策略ID
        mac: '', // mac
        cOpenId: '', // 酷开账号
        thirdUserId: '', // 第三方账号
        vUserId: ''
      }
      return filter
    },
    handleSearch () {
      // 清空数据、清空图表
      this.list = []

      this.$refs.form.validate(valid => {
        if (valid) {
          // const filter = this.getFilter()
          this.$service.hitDetail(this.form).then(data => {
            console.log('data=====>', data)
            // 链路数据
            this.list = data.rows || []
          })
        }
      })
    }

  }

}
</script>

<style lang="stylus" scoped>
.box7-content
    width 90%
    margin 0 auto
    padding 15px 10px
    display flex
    position relative
    .line-box
      margin 0 auto
      .line1
        display flex
        padding-bottom 25px
        height 50px
      .line2
        display flex
        height 50px
        padding 25px 0
        flex-direction row-reverse
      .line1,.line2
        position relative
        .xiafa,.shangjiao
          font-size $s_font
          position relative
          color #ccc
        .xiafa:before,.shangjiao:before
          content ''
          border-bottom 2px solid #d9d9d9
          width 80px
          height 1px
          position absolute
          top 15px
          left 50%
          transform translateX(-50%)
          z-index 0
        .item
          width 60px
          display flex
          flex-direction column
          align-items center
          margin-top 10px
          z-index 1
          .icon
            width 15px
            height 15px
            border-radius 50%
            border 5px solid #d9d9d9
            box-sizing border-box
            background-color #eee
          span
            width 100%
            text-align center
            text-overflow ellipsis
            white-space nowrap
            margin-top 5px
            font-size $s_font
            color #888
            overflow hidden
.middle-xiafa
  text-align right
  position absolute
  top 65px
  right 15px
  font-size $s_font
  color #ccc
.middle-xiafa:before
  content ''
  position absolute
  top -49px
  right -10px
  width 30px
  height 98px
  border 2px solid #d9d9d9
  border-radius 5px
  border-left none
  z-index 0
.last-item
  padding-top 25px
  width 60px
  display flex
  flex-direction column
  align-items center
  margin-top 10px
  position relative
  z-index 2
  .icon
    width 15px
    height 15px
    box-sizing border-box
    border-radius 50%
    border 5px solid #d9d9d9
    background #eee
  span
    margin-top 5px
    font-size $s_font
    color #888
.last-shangjiao
  position absolute
  bottom -11px
  left 0
  font-size $s_font
  color #ccc
.last-shangjiao:before
  content ''
  position absolute
  top -58px
  left -5px
  width 35px
  height 98px
  border 2px solid #d9d9d9
  border-right none
  border-radius 5px
.finishedIcon
  .icon
    border-color #2e7fcb !important
    background #eee !important
  span
    color #2e7fcb !important
.finishedLine
  color #2e7fcb !important
.finishedLine:before
  border-color #2e7fcb !important
.now
  .icon
    border-color #f47e00 !important
    background #eee !important
  span
    color #f47e00 !important

</style>
