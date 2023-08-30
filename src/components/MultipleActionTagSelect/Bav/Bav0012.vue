<template>
  <div>
    <span
      v-for="item in aaa.child"
      :key="item.value + 'bav0012'"
      class="flex-row child"
    >
      <!-- 第二级 -->
      <el-select
        v-if="!!item.mapName"
        v-model="item.childCheckedVal[0]"
        clearable
        style="width: 100px"
        name="oxve"
        class="input-inline"
        @change="handelChildBehavirSelectChange({
          childItem: item,
          level: 2,
          extra: {listMapName: item.mapName},
          selectPropKeyValue: 'name'
        })"
      >
        <template v-for="item2 in bav12GetBehaviorAttrList(2, {listMapName: item.mapName})">
          <el-option
            :value="item2.name"
            :label="item2.name"
            :key="item2.name"
          ></el-option>
        </template>
      </el-select>

      <Bav0012 v-if="!!item.mapName" :aaa="item"></Bav0012>
    </span>

  </div>
</template>

<script>
export default {
  name: 'Bav0012',
  inject: {
    parentThis: '_this'
  },
  data () {
    return {
      mapNameArr: []
    }
  },
  props: {
    aaa: {
      default: () => {},
      type: Object
    },
    childItem: {
      default: () => {},
      type: Object
    },
    bavAttrList: {
      default: () => {},
      type: Object
    }
  },

  watch: {
    // childItem: {
    //   handler (val) {
    //     let list = val.bav.behaviorValue
    //     this.isSelectedDay = false
    //     // 判断是否选择了【天数】
    //     this.handelIsSelectedDay(list)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    // handelBehavirSelectChange (param) {
    //   return this.$parent.$parent.handelBehavirSelectChange(param)
    // },
    handelChildBehavirSelectChange (param) {
      // 调用父级的方法
      return this.parentThis.handelChildBehavirSelectChange(param)
    },
    bav12GetBehaviorAttrList () {
      // 调用父级的方法
      return this.parentThis.getBehaviorAttrList(...arguments)
    }
  },
  created () {
    console.log('parent==>', this.$parent)
  }
}
</script>
<style scoped  lang="stylus">
.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
