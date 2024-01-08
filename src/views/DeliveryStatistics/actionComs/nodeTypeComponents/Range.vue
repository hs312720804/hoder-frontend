<template>
  <div class="label-item">
    <!-- <transition name="el-zoom-in-left"> -->
    <el-form :model="childItem" ref="rangeForm" :rules="rangeFormRules" >
      <div v-show="show3">
        <div class="range-row" >
          <div class="range-wrap" v-if="type.indexOf('range') > -1">
                <!-- {{childItem.valueObj.rang.newValue}} -->
            <span>周期范围</span>
            <span>
              <el-select
                v-model="childItem.valueObj.rangeType"
                style="width: 100px"
                name="oxve"
                class="input-inline sel"
                @change="handelSelectChange(childItem.valueObj.rang, rangeTypeList, childItem.valueObj.rangeType)"
              >
                <!-- <el-option value="fixed" label="固定周期"></el-option>
              <el-option value="move" label="动态周期"></el-option> -->
                <template v-for="item in rangeTypeList">
                  <el-option
                    :value="item.value"
                    :label="item.name"
                    :key="item.value"
                  ></el-option>
                </template>
              </el-select>
            </span>
            <span style="max-width: 252px; min-width: 252px; display: inline-block">
              <el-form-item v-if="childItem.valueObj.rangeType === 'fixed'" label="" prop="valueObj.rang.value">
                <span style="display: flex; flex-direction: column; align-items: flex-start;">
                  <span v-if="!newRangeFlag">
                    <el-date-picker
                      style="width: 220px;"
                      v-model="childItem.valueObj.rang.value"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="getPickerOptions(childItem.tagCode)"
                    >
                    </el-date-picker>
                  </span>
                  <span v-else>
                    <span v-for="(item, index) in childItem.valueObj.rang.newValue" :key="index" style="display: flex; flex-direction: row">  <!-- 多选 -->
                      <el-date-picker
                        style="width: 220px;"
                        v-model="item.value"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="getPickerOptions(childItem.tagCode)"
                        @change="HandleChange"
                      >
                      </el-date-picker>
                      <el-button v-if="index !== 0" type="text" @click="removeRange(index)" class="remove-btn">删除</el-button>
                    </span>
                  </span>
                  <el-button type="text" @click="addRange" class="add-btn">添加</el-button>
                </span>
              </el-form-item>

              <span v-else style="display: inline-block; width: 200px">
                最近
                <!-- 购买行为 720 天 其他 30 天 -->
                <!-- <el-input v-model="childItem.valueObj.rang" placeholder="请输入天数"></el-input>   -->
                <el-input-number
                  v-model="childItem.valueObj.rang.value"
                  :min="1"
                  :max="getMaxDay(childItem.tagCode)"
                  label="请输入天数"
                ></el-input-number>
                天
              </span>

            </span>
          </div>
          <div class="range-wrap" v-if="type.indexOf('week') > -1">
            <span>星期范围</span>
            <span>
              <el-select
                multiple
                v-model="childItem.valueObj.weekRang.value"
                style="width: 90px"
                name="oxve"
                class="input-inline sel"
                @change="handelSelectChange(childItem.valueObj.weekRang, weekRange)"
                :disabled="isSelectedDay"
              >
                <template v-for="item in weekRange">
                  <el-option
                    :value="item.value"
                    :label="item.name"
                    :key="item.value"
                  ></el-option>
                </template>
              </el-select>
            </span>
          </div>
          <div class="range-wrap" v-if="type.indexOf('time') > -1">
            <span>时间区间</span>
            <span>
              <el-select
                multiple
                v-model="childItem.valueObj.timeRange.value"
                style="width: 210px"
                name="oxve"
                class="input-inline"
                @change="handelSelectChange(childItem.valueObj.timeRange, timeRange)"
                :disabled="isSelectedDay"
              >
                <template v-for="item in timeRange">
                  <el-option
                    :value="item.value"
                    :label="item.name"
                    :key="item.value"
                  ></el-option>
                </template>
              </el-select>
            </span>
          </div>
        </div>
      </div>
    <!-- </transition> -->
    </el-form>
    <!-- <span @click="openOrClose">{{ show3 ? '< 收起' : '> 展开' }}</span> -->

  </div>
</template>

<script>
// import types from '../types'
export default {
  // inject: ['_this'],
  data () {
    return {
      rangeTypeList: [],
      weekRange: [],
      timeRange: [],
      // pickerOptions0: {
      //   disabledDate: (time) => {
      //     const day1 = 90 * 24 * 3600 * 1000
      //     let maxTime = Date.now() - 1 * 24 * 3600 * 1000 // 固定周期支持选择未来最多30天
      //     let minTime = Date.now() - day1
      //     return time.getTime() > maxTime || time.getTime() < minTime
      //   }
      // },
      pickerOptions720: {
        disabledDate: (time) => {
          const day1 = 720 * 24 * 3600 * 1000 // 两年
          // let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          const maxTime = Date.now() + 30 * 24 * 3600 * 1000 // 固定周期支持选择未来最多30天
          const minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },

      show3: true,
      isSelectedDay: false,
      rangeFormRules: {
        'valueObj.rang.value': [
          { type: 'array', required: true, message: '请输入周期范围', trigger: ['change', 'blur'] }
        ]
      },
      newRangeFlag: false
    }
  },
  props: {
    type: {
      type: Array,
      default: () => ['range', 'week', 'time']
    },
    childItem: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    childItem: {
      handler (val) {
        // const list = val.bav.behaviorValue
        // this.isSelectedDay = false
        // // 判断是否选择了【天数】
        // this.handelIsSelectedDay(list)
        this.newRangeFlag = !!(this.childItem.valueObj.rang.newValue && this.childItem.valueObj.rang.newValue.length > 0)
      },
      deep: true,
      immediate: true
    },
    show: {
      handler (val) {
        this.show3 = val
      },
      immediate: true
    },
    options: { // 下拉框选项
      handler (val) {
        if (val) {
          const _this = this
          const periodRange = val.dict.periodRange || []
          const timeRange = val.dict.timeRange || []
          const weekRange = val.dict.weekRange || []
          this.rangeTypeList = periodRange.map(item => {
            // _this.childItem.valueObj.rang.field = item.tableField
            return {
              name: item.dictLabel,
              value: item.dictValue,
              field: item.tableField
            }
          })
          this.timeRange = timeRange.map(item => {
            return {
              name: item.dictLabel,
              value: item.dictValue,
              field: item.tableField
            }
          })
          this.weekRange = weekRange.map(item => {
            return {
              name: item.dictLabel,
              value: item.dictValue,
              field: item.tableField
            }
          })
          // this.childItem.valueObj.range.field = this.rangeTypeList[0].field || ''
        }
      },
      // deep: true,
      immediate: true
    }
  },
  computed: {
    // isView () {
    //   return this._this && this._this.isView ? this._this.isView : false
    // }
  },
  methods: {
    getPickerOptions (tagCode) {
      if (tagCode === 'BAV0003') { // 【购买行为】
        // return this.pickerOptions720  // 可选两年内的周期
        return this.pickerOptionsDayinRange(3650, 3650) // 可选在 【过去 10 年 + 未来30天】 的周期内，最大跨度 【3650天】；
      } else if (tagCode === 'BAV0008') { // 【起播行为】
        return this.pickerOptionsDayinRange(90, 180) // 可选在 【过去 6 个月 + 未来30天】 的周期内，最大跨度【90天】；
      } else if (tagCode === 'BAV0013' || tagCode === 'BAV0014' || tagCode === 'BAV0015') { // 【续费包签约状态】 、【连续包签约-续费-解约次数】、【下单未支付】
        return this.pickerOptionsDayinRange20211226(30) // 数据最早时间：【2021-12-26】，数据最晚时间：【未来30天】，最大跨度：【30天】；
      } else { // 其他
        return this.pickerOptionsDayinRange(30, 180) // 可选在 【过去6个月 + 未来30天】 的周期内，最大跨度 【30天】；
      }
    },
    pickerOptionsDayinRange20211226 (day) {
      let _minTime = null
      let _maxTime = null

      return {
        onPick (time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            const timeRange = day * 24 * 60 * 60 * 1000
            _minTime = time.minDate.getTime() - timeRange // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate: (time) => {
          // const day1 = range * 24 * 3600 * 1000
          // let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          const maxTime = Date.now() + 30 * 24 * 3600 * 1000
          const minTime = +new Date('2021-12-25')

          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() < _minTime || time.getTime() > _maxTime
          } else {
            return time.getTime() > maxTime || time.getTime() < minTime
          }
        }
      }
    },
    pickerOptionsDayinRange (day, range) { // element日期范围选择 range 天内 开始和结束不超 day天
      let _minTime = null
      let _maxTime = null

      return {
        onPick (time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            const timeRange = day * 24 * 60 * 60 * 1000
            _minTime = time.minDate.getTime() - timeRange // 最小时间
            _maxTime = time.minDate.getTime() + timeRange // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate: (time) => {
          const day1 = range * 24 * 3600 * 1000
          // let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          const maxTime = Date.now() + 30 * 24 * 3600 * 1000
          const minTime = Date.now() - day1

          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() > maxTime || time.getTime() < minTime || time.getTime() < _minTime || time.getTime() > _maxTime
          } else {
            return time.getTime() > maxTime || time.getTime() < minTime
          }
        }
      }
    },
    getMaxDay (tagCode) { // 动态周期
      if (tagCode === 'BAV0003') { // 【购买行为】
        return 3650
      } else if (tagCode === 'BAV0008' || tagCode === 'BAV0013') { // 【起播行为】 || 【续费包签约状态】
        return 90
      } else if (tagCode === 'BAV0014') { // 【连续包签约-续费-解约次数】
        return 180
      } else { // 其他
        return 30
      }
    },

    HandleChange (val) {
      this.childItem.valueObj.rang.value = val // 给一个值，避免出现必选红框
    },
    addRange () {
      // newValue, 多选固定周期的时候，用到这个字段
      this.newRangeFlag = true
      // this.$nextTick(() => {
      const date = this.childItem.valueObj.rang.value
      if (!this.childItem.valueObj.rang.newValue) {
        this.$delete(this.childItem.valueObj.rang, 'newValue')
        this.$set(this.childItem.valueObj.rang, 'newValue', [{ value: date }, { value: [] }])
      } else {
        this.childItem.valueObj.rang.newValue.push({ value: [] })
      }
      // })
    },

    removeRange (index) {
      this.childItem.valueObj.rang.newValue.splice(index, 1)
    },

    openOrClose () {
      this.show3 = !this.show3
    },

    handelSelectChange (item, list, type) {
      item.field = list[0].field
      if (type === 'fixed') {
        this.childItem.valueObj.rang.value = []
        this.childItem.valueObj.rang.newValue = undefined
        this.newRangeFlag = false
      } else if (type === 'move') {
        this.childItem.valueObj.rang.value = ''
      }
      if (type) this.$emit('hasMoveBehaviorTagRule')
    },

    // 判断是否有选择【天数】选项
    handelIsSelectedDay (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type === 'day') { // 判断是否选了【天数】
          this.isSelectedDay = true
          break
        } else if (list[i].child) {
          this.handelIsSelectedDay(list[i].child)
        }
      }
    }
  },
  created () {
    // console.log('rulesJson==', this.rulesJson)
    // this.weekRange = Object.keys(types.weekRange).map(item => {
    //   return {
    //     label: types.weekRange[item],
    //     value: item
    //   }
    // })
    // this.timeRange = Object.keys(types.timeRange).map(item => {
    //   return {
    //     label: types.timeRange[item],
    //     value: item
    //   }
    // })
  }
}
</script>
<style scoped  lang="stylus">
.label-item span, .oc-item {
  margin-right: 10px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.range-row {
  display: flex;
  flex-direction: row;
  // max-height: 33px
}
.range-wrap {
  // margin-bottom: 20px;
  display: flex;
  // align-items: center;
  line-height: 32px;
}

.add-btn
  position: absolute;
  right: 1px;
  top: 1px;

.remove-btn
  margin-left 5px
</style>
