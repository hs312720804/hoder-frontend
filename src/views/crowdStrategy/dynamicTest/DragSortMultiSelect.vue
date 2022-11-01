<!-- eslint-disable -->
<template>
  <div class="demo">
    <!-- {{selectValue}} -->
    <el-transfer
      v-model="selectValue"
      filterable
      :data="data"
      :filter-method="filterMethod"
      :target-order="'push'"
      :titles="['待选方案', '已选方案']"
      :props="{ key: 'id', label: 'label' }"
      :left-default-checked="hasCheckedWHLeftData"
      @left-check-change="handleWHLeftChange"
      :right-default-checked="hasCheckedWHRightData"
      @right-check-change="handleWHRightChange"
    >
      <span slot-scope="{ option }">
        <!-- {{ option.id }} - {{ option.label }} -->
        <el-tooltip class="item" effect="dark" :content="option.label" placement="top-start">
          <div>{{ option.id }} - {{ option.label }}</div>
        </el-tooltip>
        <!-- <el-tooltip placement="top">
          <div slot="content"><div>{{ option.id }} - {{ option.label }}</div></div>
          <div>{{ option.id }} - {{ option.label }}</div>
        </el-tooltip> -->
        <el-tooltip class="item" effect="dark" content="拖拽移动顺序" placement="top-start">
          <i v-if="returnIconShow(option.id)" class="el-icon-s-operation"></i>
        </el-tooltip>
      </span>
    </el-transfer>
    <div class="tip">提示：已选方案的顺序决定了顺序流转、循环流转的顺序</div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
// const generateData = () => {
//   const data = []
//   for (let i = 1; i <= 5; i++) {
//     data.push({
//       id: i,
//       label: `方案 ${i}`
//     })
//   }
//   return data
// }
export default {
  name: 'DragSortMultiSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value (val) {
      this.selectValue = val
    },
    selectValue (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      selectValue: [],
      filterMethod (query, item) {
        const regStr = query.replace('/*/g', '.*')
        const reg = new RegExp(regStr)
        return reg.test(item.label)
      },
      // data: generateData(),
      // value: [],
      shiftKey: false,
      firstWHLeftLocation: -1, // 数据左边起始值
      lastWHLeftLocation: -1, // 数据左边终止值
      hasCheckedWHLeftData: [], // 数据左边选中的数据
      firstWHRightLocation: -1, // 数据右边起始值
      lastWHRightLocation: -1, // 数据右边终止值
      hasCheckedWHRightData: [] // 数据右边选中的数据
    }
  },
  mounted () {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 16 && e.shiftKey) {
        this.shiftKey = true
      }
    })
    window.addEventListener('keyup', e => {
      this.shiftKey = false
    })
    const el = document
      .querySelector('.el-transfer')
      .querySelectorAll('.el-checkbox-group')[1]

    // eslint-disable-next-line no-new
    new Sortable(el, {
      forceFallback: false,
      onUpdate: event => {
        const box = this.$el
          .querySelector('.el-transfer')
          .querySelectorAll('.el-checkbox-group')[1]
        const nums = this.$el
          .querySelector('.el-transfer')
          .querySelectorAll('.el-checkbox-group')[1].childNodes.length
        console.log(nums, event.newIndex)
        if (event.newIndex >= nums) {
          return
        }
        const newIndex = event.newIndex
        const oldIndex = event.oldIndex
        const $label = box.children[newIndex]
        const $oldLabel = box.children[oldIndex]
        box.removeChild($label)
        if (newIndex < oldIndex) {
          box.insertBefore($label, $oldLabel)
        } else {
          box.insertBefore($label, $oldLabel.nextSibling)
        }
        const copyValue = JSON.parse(JSON.stringify(this.value))
        const item = copyValue.splice(oldIndex, 1)
        this.$emit('input', copyValue.splice(newIndex, 0, item[0]))
        // this.value.splice(newIndex, 0, item[0])
      }
    })
  },
  methods: {
    // 只有选中数据显示拖拽按钮
    returnIconShow (id) {
      return this.selectValue.includes(id)
    },
    // 数据左侧列表元素被用户选中 / 取消选中时触发
    handleWHLeftChange (key, key1) {
      const _this = this
      console.log(_this.hasCheckedWHLeftData)
      _this.hasCheckedWHLeftData = _this.commonChangeFuc(
        key,
        key1,
        _this.hasCheckedWHLeftData,
        _this.firstWHLeftLocation,
        _this.lastWHLeftLocation,
        _this.data,
        'id'
      )
      console.log(_this.hasCheckedWHLeftData)
    },
    // 数据右侧列表元素被用户选中 / 取消选中时触发
    handleWHRightChange (key, key1) {
      const _this = this
      console.log(_this.hasCheckedWHRightData)
      _this.hasCheckedWHRightData = _this.commonChangeFuc(
        key,
        key1,
        _this.hasCheckedWHRightData,
        _this.firstWHRightLocation,
        _this.lastWHRightLocation,
        _this.value,
        false
      )
      console.log(_this.hasCheckedWHRightData)
    },
    // 公共按住shift 多选
    commonChangeFuc (
      key,
      key1,
      hasCheckedData,
      firstLocation,
      lastLocation,
      arrList,
      value
    ) {
      const _this = this
      let cFlag = false // 取消勾选
      // debugger
      for (var i = 0; i < key.length; i++) {
        if (key[i] === key1[0]) {
          cFlag = true // 选中
        }
      }
      if (cFlag) {
        if (key.length === 1) {
          firstLocation = 0
          hasCheckedData.push(key[0])
        } else if (key.length > 1) {
          // const arr = []
          // 当前有选中数据 并且 按住shift
          if (_this.shiftKey) {
            // if (isRight) {
            for (let i = 0; i < arrList.length; i++) {
              const item = value ? arrList[i][value] : arrList[i]
              if (item === key[key.length - 2]) {
                firstLocation = i
              }
              if (item === key1[0]) {
                lastLocation = i
              }
            }
            if (firstLocation !== -1 && lastLocation !== -1) {
              if (firstLocation < lastLocation) {
                for (var k = 0; k < arrList.length; k++) {
                  const item = value ? arrList[k][value] : arrList[k]

                  if (k >= firstLocation && k <= lastLocation) {
                    hasCheckedData.push(item)
                  }
                }
              } else if (firstLocation > lastLocation) {
                for (var k = 0; k < arrList.length; k++) {
                  if (k >= lastLocation && k <= firstLocation) {
                    hasCheckedData.push(item)
                  }
                }
              }
            }
          } else {
            // 不再按shift
            hasCheckedData.push(key1[0])
          }
        }
      } else {
        // 取消选中的
        hasCheckedData = []
        for (var i = 0; i < key.length; i++) {
          if (key[i] !== key1[0]) {
            hasCheckedData.push(key[i])
          }
        }
      }
      // 去重
      hasCheckedData = new Set(hasCheckedData)
      hasCheckedData = Array.from(hasCheckedData)
      return hasCheckedData
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
/deep/ .el-transfer__buttons {
  /deep/ button {
    display: block;
    margin: 0;
    &:first-child {
      margin-bottom: 12px;
    }
  }
}

.demo {
  text-align: left;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
  width: 300px;
  height: 300px;
  background-color: #42b983;
  overflow: scroll;
}
li {
  display: block;
  margin: 20px 10px;
  border: 1px solid #444;
}
a {
  color: #42b983;
}
.el-icon-s-operation{
  position: absolute;
  top: 7px;
  left: 166px;
}
.tip {
  float: right;
}
</style>
