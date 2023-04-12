<template>
  <div class='' id='' style="display: flex">
    <el-select
      style="width: 150px"
      v-model="treeDataVal.value"
      clearable
      class="input-inline"
      @change="selectChange"
      >
      <template>
        <el-option
          v-for="item in options"
          :key="item.tagCode"
          :value="item.tagCode"
          :label="item.pathName">
        </el-option>
      </template>
    </el-select>
    <!-- childList--{{childList}} -->
    <!-- 下一级 -->
    <FilmModelTagSelect v-if="(childList.length > 0)" :options="childList" :allData="allData" :treeDataVal="treeDataVal.child"></FilmModelTagSelect>
  </div>
</template>

<script>
export default {
  name: 'FilmModelTagSelect',
  components: {},
  props: {
    options: {
      type: Array,
      default: () => []
    },
    allData: {
      type: Object,
      default: () => {}
    },
    childItem: {
      type: Object,
      default: () => {}
    },
    treeDataVal: {
      type: Object,
      default: () => { return { value: '' } }
    }
  },
  data () {
    return {
      detailPageViewOptions: '',
      childList: []

    }
  },
  watch: {
    // treeDataVal: {
    //   handler (val) {
    //     console.log('this----->', val)
    //     this.$emit('update:treeData', val)
    //   },
    //   immediate: true,
    //   deep: true
    // }
    // 'treeDataVal.value': {
    //   handler (val) {
    //     this.selectChange(val)
    //   }
    // }
  },
  async created () {
    debugger
    if (this.options.length === 0) {
      await this.fetchData()
    }
    if (this.treeDataVal.value) { // 回显
      const val = this.treeDataVal.value
      this.childList = this.allData ? this.allData[val] : []
    }
  },
  methods: {
    selectChange (val) {
      this.childList = this.allData && this.allData[val] ? this.allData[val] : []
      console.log('this.childList---->', this.childList)
      if (this.childList.length > 0) {
        this.treeDataVal.child = {
          value: '',
          child: {}
        }
      } else {
        // delete this.treeDataVal.child
        // Reflect.deleteProperty(this.treeDataVal, 'child')
        // this.treeDataVal = {
        //   value: val
        // }
      }
    },
    fetchData () {
      return this.$service.getUptmTree().then(res => {
        this.allData = res || []
        this.options = res[-1]
      })
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
