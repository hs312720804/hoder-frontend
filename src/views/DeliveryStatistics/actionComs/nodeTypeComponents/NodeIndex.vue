<template>
<div class="node-styl">
  <!-- {{ options }} -->

  <!-- <el-select v-model="value11" placeholder="请选择">
    <el-option
      v-for="item in options11"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select> -->

  <!-- {{ transformOptions }} -->

  <!-- 周期范围 -->
  <template v-if="nodeType === 1">
    <Range
      ref="range"
      :childItem="nodeDetail"
      :type="getRangeType(nodeDetail.tagCode)"
      :options="apiData"
    >
    </Range>
  </template>

  <template v-if="nodeType === 2">
    <!-- {{ nodeDetail }} -->
    <!-- :class="{'none-pointer-events': transformOptions.length === 0}" -->
    <el-select
      placeholder="下拉框"
      class="select-styl input-inline"
      v-model="nodeDetail.valueObj.value"
      clearable
      @change="handleChange"
    >
      <el-option
        v-for="item in transformOptions"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
    <!-- {{ nodeDetail.valueObj.mapName }} -->
    <!-- {{ nodeDetail }} -->
    <!-- {{ showChildNode }} -->
    <template v-if="!!nodeDetail.valueObj.mapName">
      <!-- {{nodeDetail.valueObj.child}} -->
      <NodeIndex
        :nodeDetail="nodeDetail.valueObj.child"
        :nodeType="2"
        :apiData="apiData">
      </NodeIndex>
    </template>

  </template>

  <el-input
    v-if="nodeType === 3"
    placeholder="输入框"
    class="input-class input-inline"
    :class="{'none-pointer-events': transformOptions.length === 0}"
    v-model="nodeDetail.valueObj.value"
  >
  </el-input>
  <!-- {{ nodeDetail.valueObj }} -->
  <Type
    class="input-inline"
    v-if="nodeType === 6"
    :countValueObj="nodeDetail.valueObj"
    :options="transformOptions"
  >
  </Type>
</div>
</template>

<script>
import Type from './Type.vue'
import Range from './Range.vue'
export default {
  name: 'NodeIndex',
  components: {
    Type,
    Range
  },
  props: {
    nodeDetail: {
      type: Object,
      default: () => {}
    },
    nodeType: {
      type: Number,
      default: 0
    },
    // options: {
    //   type: Array,
    //   default: () => []
    // },
    // value: {
    //   type: Object,
    //   default: () => {}
    // },
    apiData: {
      type: Object,
      default: () => {}
    }
  },

  watch: {
    'nodeDetail.valueObj.mapName': {
      handler (val) {
        // this.$nextTick(() => {
        if (val) {
          // 当mapName 切换时，会重新卸载和刷新下级组件
          // this.showChildNode = false

          // eslint-disable-next-line vue/no-mutating-props
          this.nodeDetail.valueObj.child = {
            id: Math.random(),
            tagName: '页面活跃',
            tagCode: 'BAV0005',
            type: 2,
            keyName: val,
            isDiguiNode: true,
            // diGuiKeyName: 'mapName',
            // nextNodeList: [],
            valueObj: {
              name: '',
              value: '',
              field: '',
              operator: '',
              type: ''
            }
          }
          // this.$nextTick(() => {
          //   this.showChildNode = true
          // })
        } else {
          this.nodeDetail.valueObj.child = undefined
          // this.showChildNode = false
        }
        // })
      }
    },
    // 'nodeDetail.valueObj.keyName': {
    //   handler (val) {
    //     if (val) {
    //       this.getTransformOptions()
    //     }
    //   },
    //   immediate: true
    // },
    apiData: {
      handler (val) {
        if (val) {
          console.log('nodeDetail.valueObj-->', this.nodeDetail.valueObj)
          this.getTransformOptions()
        }
        // this.nodeType = this.nodeDetail.type
      },
      immediate: true,
      deep: true
    }
    // value: {
    //   handler (val) {
    //     this.nodeDetail.valueObj = {
    //       ...this.nodeDetail.valueObj,
    //       ...val
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    // nodeDetail.valueObj: {
    //   handler (val) {
    //     debugger
    //     this.$emit('input', val)
    //   },
    //   deep: true
    // },
    // options: {
    //   handler (val) {
    //     this.transformOptions = val.map(item => {
    //       return {
    //         name: item[this.nameKey],
    //         value: item[this.valueKey],
    //         field: item[this.fieldKey],
    //         type: item.filedType,
    //         selectKey: item.tableField + item.dictValue,
    //         mapName: item.mapName || ''
    //       }
    //     })
    //   },
    //   immediate: true
    // }
  },
  data () {
    return {
      // nodeType: '',
      options11: [],
      value11: '',
      valueKey: 'dictValue',
      nameKey: 'dictLabel',
      fieldKey: 'tableField',
      transformOptions: [],
      showChildNode: true
      // nodeValue: '',
      // nodeDetail.valueObj: {
      //   name: '',
      //   value: '',
      //   field: '',
      //   operator: '',
      //   type: ''
      // }
      // nodeDetail.valueObj: {
      //   name: '',
      //   value: '',
      //   field: '',
      //   operator: '',
      //   type: ''
      // }
    }
  },
  created () {

  },
  methods: {
    getTransformOptions () {
      // this.nodeType = this.nodeDetail.type
      // console.log('this.nodeDetail.keyName-->', this.nodeDetail.keyName)
      const options = this.getOptions(this.nodeDetail.keyName) || []
      // console.log('options-->', options)
      this.transformOptions = options.map(item => {
        return {
          name: item[this.nameKey],
          value: item[this.valueKey],
          field: item[this.fieldKey],
          type: item.filedType,
          selectKey: item.tableField + item.dictValue,
          mapName: item.mapName || ''
        }
      })
      // console.log('this.transformOptions==》', this.transformOptions)
    },
    getRangeType (tagCode) {
      let type = ['range', 'week', 'time']
      if (tagCode === 'BAV0003' || tagCode === 'BAV0013' || tagCode === 'BAV0014' || tagCode === 'BAV0015' || tagCode === 'BAV0016') {
        type = ['range']
      }
      return type
    },
    // updateValue () {
    //   console.log('this.nodeDetail.valueObj', this.nodeDetail.valueObj)
    //   this.$emit('input', this.nodeDetail.valueObj)
    // },
    handleChange (val) {
      const obj = this.transformOptions.find(item => item.value === val)
      // eslint-disable-next-line vue/no-mutating-props
      this.nodeDetail.valueObj = {
        ...this.nodeDetail.valueObj,
        ...obj
      }
      this.$forceUpdate() // 在下拉框上绑定change事件 更新视图 这样就不会有视图更新的问题

      // this.$emit('input', this.nodeDetail.valueObj)
      // this.$emit('addDiguiNode', this.nodeDetail.valueObj)
    },
    getOptions (keyName) {
      if (keyName) {
        // console.log('this.apiData--->', this.apiData)
        return this.apiData.dict[keyName]
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.node-styl {
  display: flex;
  // justify-content: center;
  column-gap: 10px
  // overflow auto
  // overflow-y: hidden;
  // height: 38px
}
.none-pointer-events {
  pointer-events: none;
}
.input-class {
  width: 150px;
}
.select-styl {
  width: 120px
}
</style>
