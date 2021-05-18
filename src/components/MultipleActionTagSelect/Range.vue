<template>
  <div style="display: flex; flex-direction: column">
    <div class="aaa" v-if="type.indexOf('range') > -1">
      <span>周期范围</span>
      <span>
        <el-select
          v-model="childItem.bav.rangeType"
          style="width: 100px"
          name="oxve"
          class="input-inline sel"
          
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
      <!-- {{childItem.bav}} -->
      <span style="max-width: 300px; min-width: 300px; display: inline-block">
        <el-date-picker
          v-if="childItem.bav.rangeType === 'fixed'"
          v-model="childItem.bav.rang.value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions0"
        >
        </el-date-picker>
        <span v-else style="display: inline-block; width: 200px">
          最近
          <!-- <el-input v-model="childItem.bav.rang" placeholder="请输入天数"></el-input>   -->
          <el-input-number
            v-model="childItem.bav.rang.value"
            :min="1"
            :max="30"
            label="请输入天数"
          ></el-input-number>
          天
        </span>
      </span>
    </div>
    <div class="aaa" v-if="type.indexOf('week') > -1">
      <span>星期范围</span>
      <span>
        <el-select
          multiple
          v-model="childItem.bav.weekRang.value"
          style="width: 412px"
          name="oxve"
          class="input-inline sel"
          @change="handelWeekChange(childItem.bav.weekRang, weekRange)"
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
    <div class="aaa" v-if="type.indexOf('time') > -1">
      <span>时间区间</span>
      <span>
        <el-select
          multiple
          v-model="childItem.bav.timeRange.value"
          style="width: 412px"
          name="oxve"
          class="input-inline"
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
    }
  },
  watch: {
    options: {
      handler(val) {
        // eslint-disable-next-line no-debugger
        debugger
        const periodRange = val.dict.periodRange || []
        const timeRange = val.dict.timeRange || []
        const weekRange = val.dict.weekRange || []
        this.rangeTypeList = periodRange.map(item => {
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
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handelWeekChange(item, list) {
      item.field = list[0].field
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

.aaa {
  margin-bottom: 20px;
}
</style>