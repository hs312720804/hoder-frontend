<template>
  <div>
    <span
      v-for="item in aaa.child"
      :key="item.value"
      class="flex-row child"
    >
      <!-- 第二级 -->
      <el-select
        v-if="!!item.mapName"
        v-model="item.childCheckedVal[0]"
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
        <template v-for="item in getBehaviorAttrList(2, {listMapName: item.mapName})">
          <el-option
            :value="item.name"
            :label="item.name"
            :key="item.name"
          ></el-option>
        </template>
      </el-select>

      <!-- {{ item.mapName }}
      {{item.mapName !== ''}} -->
      <!-- item.mapName: {{ item }} -->
      <Bav0012 v-if="!!item.mapName" :aaa="item"></Bav0012>
    </span>

  </div>
</template>

<script>
export default {
  name: 'Bav0012',
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
    handelBehavirSelectChange () {
      return this.$parent.handelBehavirSelectChange(...arguments)
    },
    handelChildBehavirSelectChange () {
      return this.$parent.handelChildBehavirSelectChange(...arguments)
    },
    getBehaviorAttrList () {
      // 调用父级的方法
      return this.$parent.getBehaviorAttrList(...arguments)
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
