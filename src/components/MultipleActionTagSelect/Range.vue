<template>
  <div>
    <!-- <transition name="el-zoom-in-left"> -->
    <el-form :model="childItem" ref="rangeForm" :rules="rangeFormRules">
      <div v-show="show3">
        <div style="display: flex; flex-direction: row">
          <div class="range-wrap" v-if="type.indexOf('range') > -1">
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
            <span style="max-width: 220px; min-width: 220px; display: inline-block">
              <el-form-item label="" prop="bav.rang.value" v-if="childItem.bav.rangeType === 'fixed'">
                <el-date-picker
                  v-model="childItem.bav.rang.value"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="childItem.tagCode === 'BAV0003' ? pickerOptions720 : pickerOptions0"
                >
                </el-date-picker>
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
  data() {
    return {
      rangeTypeList: [],
      weekRange: [],
      timeRange: [],
      pickerOptions0: {
        disabledDate:(time)=> {
          const day1 =  31 * 24 * 3600 * 1000
          let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          let minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },
      pickerOptions720: {
        disabledDate:(time)=> {
          const day1 =  720 * 24 * 3600 * 1000
          let maxTime = Date.now() - 1 * 24 * 3600 * 1000
          let minTime = Date.now() - day1
          return time.getTime() > maxTime || time.getTime() < minTime
        }
      },
      show3: true,
      isSelectedDay: false,
      rangeFormRules: {
        'bav.rang.value': [
          { type: 'array', required: true, message: '请输入周期范围', trigger: 'change' },
          { type: 'array', required: true, message: '请输入周期范围', trigger: 'blur' }
        ]
      }
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
      handler(val) {
        console.log('6666666666666===', val)
        let list = val.bav.behaviorValue
        this.isSelectedDay = false
        // 判断是否选择了【天数】
        this.handelIsSelectedDay(list)
      },
      deep: true,
      immediate: true
    },
    show(val) {
      console.log(val)
      this.show3 = val
    },
    options: {
      handler(val) {
        // eslint-disable-next-line no-debugger
        debugger
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
    openOrClose() {
      this.show3 = !this.show3
    },
    handelSelectChange(item, list, type) {
      item.field = list[0].field
      if (type === 'fixed') {
        this.childItem.bav.rang.value = []
      } else if (type === 'move') {
        this.childItem.bav.rang.value = ''
      }
    },

    // 判断是否有选择【天数】选项
    handelIsSelectedDay(list) {
        for(let i = 0; i < list.length; i++) {
          if (list[i].type === 'day') { // 判断是否选了【天数】
            this.isSelectedDay = true
            break;
          } else if (list[i].child) {
            this.handelIsSelectedDay(list[i].child)
          }
        }
    }
  },
  created() {
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
</style>