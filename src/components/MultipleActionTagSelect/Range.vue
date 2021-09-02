<template>
  <div>
    <!-- <transition name="el-zoom-in-left"> -->
    <el-form :model="childItem" ref="rangeForm" :rules="rangeFormRules">
      <div v-show="show3">
        <div style="display: flex; flex-direction: row">
          <div class="range-wrap" v-if="type.indexOf('range') > -1">
                <!-- {{childItem.bav.rang.newValue}} -->
            <span>周期范围</span>
            <span>
              <el-select
                v-model="childItem.bav.rangeType"
                style="width: 100px"
                name="oxve"
                class="input-inline sel"
                @change="handelSelectChange(childItem.bav.rang, rangeTypeList, childItem.bav.rangeType)"
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
              <el-form-item v-if="childItem.bav.rangeType === 'fixed'" label="" prop="bav.rang.value">
                <span style="display: flex; flex-direction: column; align-items: flex-start;">
                  <span v-if="!newRangeFlag">
                    <el-date-picker
                      style="width: 220px;"
                      v-model="childItem.bav.rang.value"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="childItem.tagCode === 'BAV0003' ? pickerOptions720 : pickerOptions0"
                    >
                    </el-date-picker>
                  </span>

                  <span v-else v-for="(item, index) in childItem.bav.rang.newValue" :key="index" style="display: flex; flex-direction: row">
                    <el-date-picker
                      style="width: 220px;"
                      v-model="item.value"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="childItem.tagCode === 'BAV0003' ? pickerOptions720 : pickerOptions0"
                      @change="HandleChange"
                    >
                    </el-date-picker>
                    <el-button v-if="index !== 0" type="text" @click="removeRange(index)" class="remove-btn">删除</el-button>
                  </span>
                  <el-button type="text" @click="addRange" class="add-btn">添加</el-button>
                </span>
              </el-form-item>

              <span v-else style="display: inline-block; width: 200px">
                最近
                <!-- 购买行为730天 其他30天 -->
                <!-- <el-input v-model="childItem.bav.rang" placeholder="请输入天数"></el-input>   -->
                <el-input-number
                  v-model="childItem.bav.rang.value"
                  :min="1"
                  :max="childItem.tagCode === 'BAV0003' ? 720 : 30"
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
                v-model="childItem.bav.weekRang.value"
                style="width: 90px"
                name="oxve"
                class="input-inline sel"
                @change="handelSelectChange(childItem.bav.weekRang, weekRange)"
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
                v-model="childItem.bav.timeRange.value"
                style="width: 210px"
                name="oxve"
                class="input-inline"
                @change="handelSelectChange(childItem.bav.timeRange, timeRange)"
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
  data () {
    return {
      rangeTypeList: [],
      weekRange: [],
      timeRange: [],
      pickerOptions0: {
        disabledDate: (time) => {
          const day1 = 90 * 24 * 3600 * 1000
          let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          let minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },
      pickerOptions720: {
        disabledDate: (time) => {
          const day1 = 720 * 24 * 3600 * 1000
          let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          let minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },
      show3: true,
      isSelectedDay: false,
      rangeFormRules: {
        'bav.rang.value': [
          { type: 'array', required: true, message: '请输入周期范围', trigger: ['change', 'blur'] }
        ]
      }
      // newRangeFlag: false
    }
  },
  computed: {
    newRangeFlag () {
      return !!this.childItem.bav.rang.newValue || (this.childItem.bav.rang.newValue && this.childItem.bav.rang.newValue.length > 0)
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
        let list = val.bav.behaviorValue
        this.isSelectedDay = false
        // 判断是否选择了【天数】
        this.handelIsSelectedDay(list)
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
            _this.childItem.bav.rang.field = item.tableField
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
          // this.childItem.bav.range.field = this.rangeTypeList[0].field || ''
        }
      },
      // deep: true,
      immediate: true
    }
  },
  methods: {
    HandleChange (val) {
      this.childItem.bav.rang.value = val // 给一个值，避免出现必选红框
    },
    addRange () {
      this.newRangeFlag = true
      const date = this.childItem.bav.rang.value
      if (!this.childItem.bav.rang.newValue) {
        this.$set(this.childItem.bav.rang, 'newValue', [{ value: date }, { value: [] }])
      } else {
        this.childItem.bav.rang.newValue.push({ value: [] })
      }
    },

    removeRange (index) {
      this.childItem.bav.rang.newValue.splice(index, 1)
    },

    openOrClose () {
      this.show3 = !this.show3
    },

    handelSelectChange (item, list, type) {
      item.field = list[0].field
      if (type === 'fixed') {
        this.childItem.bav.rang.value = []
      } else if (type === 'move') {
        this.childItem.bav.rang.value = ''
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

.range-wrap {
  margin-bottom: 20px;
  display: flex;
}

.add-btn
  position: absolute;
  right: 1px;
  top: 1px;

.remove-btn
  margin-left 5px
</style>
