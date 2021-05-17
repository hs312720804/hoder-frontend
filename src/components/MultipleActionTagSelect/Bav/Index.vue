<template>
  <div class="bav-attr-warp">
    <el-tag class="oc-item" :type="dataSourceColorEnum[childItem.dataSource]">
      {{ childItem.tagName }}
    </el-tag>

    <!-- {{childItem.categoryCode}} -->
    <!-- {{childItem}} -->
    <!-- 会员状态 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0001'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.label }}</span>
        <span class="flex-row">
          <!-- 第二级 -->
          <!-- {{ item.childCheckedVal }} -->
          <el-select
            v-model="item.childCheckedVal"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            @change="handelChildBehavirSelectChange(item)"
          >
            <template v-for="attrChildItem in getChildBehaviorAttrList()">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.label"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>

          <!-- <span class="flex-row"> -->
            <!-- <span class="w100">{{ item.label }}</span> -->
            <!-- 第三级 -->
            <span
              v-for="(item2, index2) in item.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >
              <el-select
                multiple
                v-model="item2.childCheckedVal"
                style="width: 110px"
                name="asdq"
                class="input-inline"
                @change="handelChildBehavirSelectChange(item2, true)"
              >
                <template v-for="attrChildItem in getChildBehaviorAttrList()">
                  <el-option
                    :value="attrChildItem.value"
                    :label="attrChildItem.label"
                    :key="attrChildItem.value"
                  >
                  </el-option>
                </template>
              </el-select>
            </span>
          <!-- </span> -->
        </span>
      </div>
    </span>

    <!-- 应用活跃 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0002'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.label }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <!-- {{ item.childCheckedVal }} -->
          <el-select
            multiple
            v-model="item.childCheckedVal"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            @change="handelChildBehavirSelectChange(item, true)"
          >
            <template v-for="attrChildItem in getChildBehaviorAttrList()">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.label"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>

          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row child"
          >
            <span class="w100">{{ item2.label }}</span>
            <!-- 第三级 -->
            <span
              v-for="(item3, index2) in item2.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >
              <!-- 次数、天数 -->
              <Type :item3="item3"></Type>
            </span>
          </span>
        </span>
      </div>
    </span>

    <!-- 购买行为 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0003'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.label }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <!-- {{ item.childCheckedVal }} -->
          <el-select
            multiple
            v-model="item.childCheckedVal"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            @change="handelChildBehavirSelectChange(item, true)"
          >
            <template v-for="attrChildItem in getChildBehaviorAttrList()">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.label"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>

          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row"
          >
          <!-- {{item2}} -->
            <span class="flex-row">
              <span class="w100">{{ item2.label }}2</span>
              <span class="flex-column">
                <!-- 第三级 -->
                <el-select
                  multiple
                  v-model="item2.childCheckedVal"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange(item2, true)"
                >
                  <template v-for="attrChildItem in getChildBehaviorAttrList()">
                    <el-option
                      :value="attrChildItem.value"
                      :label="attrChildItem.label"
                      :key="attrChildItem.value"
                    >
                    </el-option>
                  </template>
                </el-select>
                <span
                  v-for="(item3, index2) in item2.child"
                  :key="'typeInputValue' + index2"
                  class="flex-column"
                >
                  <!-- 第四级 -->
                  <span class="flex-row">
                    <span class="w100">{{ item3.label }}3</span>
                    <span
                      v-for="(item4, index) in item3.child"
                      :key="index"
                      class="flex-row"
                    >
                      <!-- 次数、天数 -->
                      <Type :item3="item4"></Type>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </div>
    </span>

    <!-- 板块活跃 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0004'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem, true)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.label }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row child"
          >
            <el-input
              placeholder="请输入板块ID"
              v-model="item2.value"
              clearable
              style="max-width: 100px; min-width: 100px;"
            >
            </el-input>

            <!-- 次数、天数 -->
            <Type :item3="item2"></Type>
          </span>
        </span>
      </div>
    </span>

    <!-- 页面活跃 && 功能使用 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0005' || childItem.tagCode === 'BAV0006'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem, true)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.label }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row child"
          >
           
            <!-- 次数、天数 -->
            <Type :item3="item2"></Type>
          </span>
        </span>
      </div>
    </span>

    <span class="flex-column" v-if="childItem.tagCode === 'BAV0007'">
      <!-- 次数、天数 -->
      <Type :item3="childItem.bav.behaviorValue[0]"></Type>
    </span>
  </div>
</template>

<script>
import Type from '../Type.vue'
export default {
  name: 'bavList',
  components: {
    Type
  },
  props: {
    childItem: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      value1: [],
      checkedVal: [],
      periodRangeVal: '',
      defaultChildObj: {
        name: '',
        value: '',
        filed: '',
        operator: '',
        type: '',
        child: [
          {
            name: '',
            value: '',
            filed: '',
            operator: '',
            type: ''
          }
        ]
      },
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      }
    }
  },
  created() {},
  methods: {
    getDefaultChildObj() {
      return JSON.parse(JSON.stringify(this.defaultChildObj))
    },
    handelBehavirSelectChange(childItem, isLast = false) {
      const vals = childItem.bav.value
      const checkedList = childItem.bav.behaviorValue
      const behaviorAttrList = this.getBehaviorAttrList(childItem)
      childItem.bav.behaviorValue = this.getValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast
      )
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, checkedList -- 已经组装好的集合, attrList -- 下拉框列表
    getValListByVals(vals, checkedList, attrList, isLast = false) {
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      let list = []
      vals.forEach(val => {
        // eslint-disable-next-line no-debugger
        debugger
        const aa = [
          { name: '', value: '', filed: '', operator: '=', type: 'cishu' }
        ]
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj =
          checkedList.find(item => item.value === val) ||
          attrList.find(item => item.value === val)
        obj.childCheckedVal = obj.childCheckedVal || []
        // obj.child = obj.child || aa
        // eslint-disable-next-line no-debugger
        debugger
        // console.log('obj.child=>>', obj.child)
        obj.child = obj.child || (isLast ? aa : [])
        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })
      // console.log('list===>', list)
      return list
    },

    handelChildBehavirSelectChange(childItem, isLast = false) {
      // console.log(childItem)
      // eslint-disable-next-line no-debugger
      // debugger
      const vals = typeof(childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const checkedList = childItem.child || []
      const behaviorAttrList = this.getChildBehaviorAttrList()
      childItem.child = this.getValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast
      )
    },
    getBehaviorAttrList(childItem) {
      let a = []
      if (childItem.tagCode === 'BAV0003') {
        a = [
        {
          value: 'first',
          label: '首次购买'
        },
        {
          value: 'lishi',
          label: '历史购买'
        }
      ]
      } else {
        a = [
          {
            value: 'xiazai',
            label: '下载应用'
          },
          {
            value: 'qidong',
            label: '启动应用'
          },
          {
            value: 'xiezai',
            label: '卸载应用'
          }
        ]
      }
      return a
    },
    getChildBehaviorAttrList() {
      return [
        {
          value: 'mg',
          label: '芒果TV'
        },
        {
          value: 'tx',
          label: '腾讯视频'
        },
        {
          value: 'bl',
          label: 'bilibili'
        }
      ]
    }
  }
}
</script>

<style lang='stylus' scoped>
.label-item span, .oc-item {
  margin-right: 10px;
}

.w100 {
  min-width: 100px;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.child-attr-wrap {
  border: 1px dashed #fff;
  padding: 20px 5px;
  margin: 10px 0;

  &:hover {
    // text-decoration: underline;
    border-color: rgb(0, 188, 212);
    border-radius: 7px;
  }
}

.bav-attr-warp {
  align-items: baseline;
  border: 1px dashed #fff;
  display: flex;
  margin-bottom: 10px;

  &:hover {
    // text-decoration: underline;
    border-color: rgb(0, 188, 212);
    border-radius: 7px;
  }
}
</style>
