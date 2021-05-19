<template>
  <div class="bav-attr-warp">
    <el-tag class="oc-item" :type="dataSourceColorEnum[childItem.dataSource]">
      {{ childItem.tagName }} - {{ childItem.tagCode }}
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
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
          <el-option
            :value="item.value"
            :label="item.name"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.name }}</span>
        <span class="flex-row">
          <!-- 第二级 -->
          <!-- {{ item.childCheckedVal }} -->
          <el-select
            v-model="item.childCheckedVal"
            style="width: 150px"
            name="asdq"
            class="input-inline"
            @change="handelChildBehavirSelectChange(item, false, childItem, 2, {extra: item.childCheckedVal})"
          >
            <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2, {extra: item.childCheckedVal} )">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.name"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>

          <!-- <span class="flex-row"> -->
          <!-- <span class="w100">{{ item.label }}</span> -->
          <!-- 第三级 -->
          <!-- {{item.childCheckedVal}}
          {{item.child}} -->
          <span v-if="item.childCheckedVal === 'effective' || item.childCheckedVal === 'no_effective'">
            <span
              v-for="(item2, index2) in item.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >
              <el-select
                multiple
                v-model="item2.childCheckedVal"
                style="width: 200px"
                name="asdq"
                class="input-inline"
                @change="handelChildBehavirSelectChange(item2, false, childItem, 3, {extra: item.childCheckedVal})"
              >
                <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3, {extra: item.childCheckedVal})">
                  <el-option
                    :value="attrChildItem.value"
                    :label="attrChildItem.name"
                    :key="attrChildItem.value"
                  >
                  </el-option>
                </template>
              </el-select>
            </span>
          </span>
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
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
          <el-option
            :value="item.value"
            :label="item.name"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.name }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <!-- {{ item.childCheckedVal }} -->
          <el-select
            multiple
            v-model="item.childCheckedVal"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            @change="handelChildBehavirSelectChange(item, true, childItem, 2)"
          >
            <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2)">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.name"
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
            <span class="w100">{{ item2.name }}</span>
            <!-- 第三级 -->
            <span
              v-for="(item3, index2) in item2.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >
              <!-- 次数、天数 -->
              <Type :item3="item3" :options="bavAttrList.dict.attrType"></Type>
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
        @change="handelBehavirSelectChange(childItem, false, 1, [], 'field')"
      >
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
          <el-option
            :value="item.field"
            :label="item.name"
            :key="item.field"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.name }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <!-- {{ item }} -->
          <el-select
            multiple
            v-model="item.childCheckedVal"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            @change="handelChildBehavirSelectChange(item, true, childItem, 2)"
          >
            <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2)">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.name"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>
          <!-- {{ item.childCheckedVal }} -->
          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row"
          >
          <!-- {{item2}} -->
            <span class="flex-row">
              <span class="w100">{{ item2.name }}</span>
              <span v-if="item.field === 'purchase_recent_two_years'" class="flex-column" >
                <!-- 历史购买 -->
                <!-- 第三级 -->
                <el-select
                  multiple
                  v-model="item2.childCheckedVal"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange(item2, true, childItem, 3)"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3)">
                    <el-option
                      :value="attrChildItem.value"
                      :label="attrChildItem.name"
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
                    <span class="w100">{{ item3.name }}</span>
                    <span
                      v-for="(item4, index) in item3.child"
                      :key="index"
                      class="flex-row"
                    >
                      <!-- 次数、天数 -->
                      <!-- <Type :item3="item4"></Type> -->
                      <Type :item3="item4" :options="bavAttrList.dict.attrType"></Type>
                    </span>
                  </span>
                </span>
              </span>
              <span v-else class="flex-column" >
                <!-- 首次购买  -->
                <!-- 第三级 -->
                <el-select
                  v-model="item2.childCheckedVal"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange(item2, true, childItem, 3)"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3)">
                    <el-option
                      :value="attrChildItem.value"
                      :label="attrChildItem.name"
                      :key="attrChildItem.value"
                    >
                    </el-option>
                  </template>
                </el-select>
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
        style="width: 100px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem, false, 1, moDefaultChild, 'selectKey', true)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.selectKey"
            :label="item.name"
            :key="item.selectKey"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="(item, index) in childItem.bav.behaviorValue"
        :key="'mo' + index"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.name }}</span>
        <!-- {{item}} -->
        <span class="flex-row">
          <!-- 第二级 -->
            <!-- <el-input
              placeholder="请输入板块ID"
              v-model="item.value"
              clearable
              style="max-width: 180px; min-width: 180px;"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchModuleMatch(item.value)"></el-button>
            </el-input> -->
            <!-- {{item.value}} -->
            <!-- <el-autocomplete
              v-model="item.value"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入板块ID"
              value-key="albumName"
              label="albumId"
              clearable
              style="max-width: 180px; min-width: 180px;"
            ></el-autocomplete> -->
            <!-- {{item}} -->
            <el-select
              style="width: 150px"
              v-model="item.value"
              filterable
              remote
              placeholder="请输入板块ID"
              clearable
              :remote-method="(query) => { remoteMethod(query, item.field) }"
              :loading="loading">
              <el-option
                v-for="item in moOptions[item.field]"
                :key="item.forumId"
                :label="item.albumName"
                :value="item.forumId">
              </el-option>
            </el-select>
            <!-- 推荐位 -->
            <span v-if="item.selectKey === 'album_id1'">
              <span
                v-for="(item2, index) in item.child"
                :key="index"
                class="flex-row child"
              >
                <!-- 次数、天数 -->
                <!-- <Type :item3="item3"></Type> -->
                <el-select
                  v-model="item2.value"
                  style="width: 100px"
                  name="oxve"
                  class="input-inline"
                >
                  <template v-for="item in 15">
                    <el-option
                      :value="item"
                      :label="item"
                      :key="item"
                    ></el-option>
                  </template>
                </el-select>
                <span
                  v-for="(item3, index) in item2.child"
                  :key="index"
                  class="flex-row child"
                >
                  <Type :item3="item3" :options="bavAttrList.dict.attrType"></Type>
                </span>
              </span>
            </span>
            <span v-else>
              <span
                v-for="(item2, index) in item.child"
                :key="index"
                class="flex-row child"
              >
                <Type :item3="item2" :options="bavAttrList.dict.attrType"></Type>
              </span>
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
            :label="item.name"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row child-attr-wrap"
      >
        <span class="w100">{{ item.name }}</span>
        <span class="flex-column">
          <!-- 第二级 -->
          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row child"
          >
            <!-- 次数、天数 -->
            <!-- <Type :item3="item2"></Type> -->
            <Type :item3="item2" :options="bavAttrList.dict.attrType"></Type>
          </span>
        </span>
      </div>
    </span>

    <span class="flex-column" v-if="childItem.tagCode === 'BAV0007'">
      <!-- 次数、天数 -->
      <!-- <Type :item3="childItem.bav.behaviorValue[0]"></Type> -->
      <Type :item3="childItem.bav.behaviorValue[0]" :options="bavAttrList.dict.attrType"></Type>
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
    },
    bavAttrList: {
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
        field: '',
        operator: '=',
        type: 'string',
        child: [
          {
            name: '',
            value: '',
            filed: '',
            operator: '=',
            type: 'string'
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
      },
      moDefaultChild: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }],
      moOptions: {},
      loading: false
      // jiList: [{
      //   name: '',
      //   value: 1,
      //   filed: '',
      // }]
    }
  },
  created() {},
  methods: {
    remoteMethod(query, field) {
      if (query !== '') {
        this.loading = true;
        let params = {
          type: field === 'forum_id' ? 'forum' : 'album', // 'album_id', 'forum_id'
          keywords: query,
          page: 1,
          pageSize: 10
        }
        this.$service.moduleMatch(params).then(res => {
          console.log('res==>', res)
          this.loading = false;
          this.moOptions[field] = res.data || []
        })
      } else {
        this.moOptions[field] = [];
      }
    },
    querySearchAsync(queryString, cb) {
      console.log('queryString', queryString)
      console.log('cb', cb)
      let params = {
        type: 'album',
        keywords: queryString,
        page: 1,
        pageSize: 10
      }
      this.$service.moduleMatch(params).then(res => {
        console.log('res==>', res)
        cb(res.data)
      })
      // var restaurants = this.restaurants;
      // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      //   cb(results);
      // }, 3000 * Math.random());
    },
    searchModuleMatch(keyword) {
      let params = {
        type: 'album',
        keywords: keyword,
        page: 1,
        pageSize: 10
      }
      this.$service.moduleMatch(params).then(res => {
        console.log('res==>', res)
      })
    },
    getDefaultChildObj() {
      return JSON.parse(JSON.stringify(this.defaultChildObj))
    },

    // childItem -- 当前选项的obj
    // isLast -- 最后一级
    // level -- 层级 为获取下拉框list
    // defaultChild -- 下一级child对象的默认赋值，默认为[]
    // selectPropKeyValue -- 下拉框的 value和key 字段的 key值
    handelBehavirSelectChange(childItem, isLast = false, level=1, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false) {
      // eslint-disable-next-line no-debugger
      debugger
      console.log('childItem==>', childItem)
      const vals = childItem.bav.value
      const checkedList = childItem.bav.behaviorValue
      const behaviorAttrList = this.getBehaviorAttrList(childItem, level)
      
      childItem.bav.behaviorValue = this.getValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast,
        defaultChild,
        selectPropKeyValue,
        isValueClear
      )
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, checkedList -- 已经组装好的集合, attrList -- 下拉框列表
    getValListByVals(vals, checkedList, attrList, isLast = false, defaultChild=[], selectPropKeyValue = 'value', isValueClear = false) {
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      let list = []
      vals.forEach(val => {
        // eslint-disable-next-line no-debugger
        debugger
        const aa = [
          { name: '', value: '', filed: '', operator: '=', type: 'count' }
        ]
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj = []
          // checkedList.find(item => item[selectPropKeyValue] === val) ||
          // attrList.find(item => item[selectPropKeyValue] === val)
        const matchObj = checkedList.find(item => item[selectPropKeyValue] === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val)
        // eslint-disable-next-line no-debugger
        debugger
        if (matchObj) {
          obj = matchObj
        } else if (matchObj2) {
          obj = matchObj2
          // 清空对象中的x value （模块活跃特殊）
          if (isValueClear) obj.value = ''
        }
        obj.childCheckedVal = obj.childCheckedVal || (typeof(obj.childCheckedVal) === 'string' ? '' : [])
        console.log('obj.childCheckedVal==>', obj.childCheckedVal)
        // obj.child = obj.child || aa
        // eslint-disable-next-line no-debugger
        debugger
        // console.log('obj.child=>>', obj.child)
        // 模块活跃，默认 child 值特殊处理
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))
        if (selectPropKeyValue === 'selectKey' && obj[selectPropKeyValue] === 'album_id1') { // 推荐位
          defaultchild = [{ name: '', value: '', filed: '', operator: '=', type: 'string' , child: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }]}]
        }
        obj.child = obj.child || (isLast ? aa : defaultchild)
        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })
      // console.log('list===>', list)
      return list
    },
    
    // childItem -- 当前选项的obj
    // isLast -- 最后一级
    // item -- 所有选项的obj 主要为获取 tagCode, 为获取下拉框list
    // level -- 层级 为获取下拉框list
    // extra -- 附加信息，根据选项判断，为获取不同下拉框list
    // selectPropKeyValue -- 下拉框的 value和key 字段的 key值
    handelChildBehavirSelectChange(childItem, isLast = false, item, level=2, extra, selectPropKeyValue = 'value', isValueClear = false) {
      console.log(childItem)
      // eslint-disable-next-line no-debugger
      // debugger
      const vals = typeof(childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const checkedList = childItem.child || []
      // const behaviorAttrList = this.getChildBehaviorAttrList()
      const behaviorAttrList = this.getBehaviorAttrList(item, level, extra)
      childItem.child = this.getValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast,
        [],
        selectPropKeyValue,
        isValueClear
      )
    },
    getBehaviorAttrList(childItem, level=1, extra={}) {
      console.log(arguments)

      let attrlist = []
      // eslint-disable-next-line no-debugger
      debugger

      const dict = this.bavAttrList.dict
      if (childItem.tagCode === 'BAV0001') {
        // eslint-disable-next-line no-debugger
        if (level === 1) {
          attrlist = dict.vip_package
        } else if (level === 2) {
          attrlist = dict.use_status
        } else if (level === 3 && extra.extra === 'effective') {
          attrlist = dict.vip_expire_use
        } else if (level === 3 && extra.extra === 'no_effective') {
          attrlist = dict.vip_expire
        } 
      } else if (childItem.tagCode === 'BAV0002') {
        if (level === 1) {
          attrlist = dict.app_operation
        } else if (level === 2) {
          attrlist = dict.app_name
        } 
      } else if (childItem.tagCode === 'BAV0003') {
        if (level === 1) {
          attrlist = dict.buy_operation
        } else if (level === 2) {
          attrlist = dict.vip_package
        } else if (level === 3) {
          attrlist = dict.buy_type
        } 
      } else if (childItem.tagCode === 'BAV0004') {
        if (level === 1) {
          attrlist = dict.block_location
        }
      } else if (childItem.tagCode === 'BAV0005') {
        if (level === 1) {
          attrlist = dict.page_active
        }
      } else if (childItem.tagCode === 'BAV0006') {
        if (level === 1) {
          attrlist = dict.func_click
        }
      } else {
        attrlist = [
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
      console.log('attrlist==>', attrlist)
      attrlist = attrlist.map(item => {
        return {
          name: item.dictLabel,
          value: item.dictValue,
          field: item.tableField,
          selectKey: item.tableField + item.dictValue
        }
      })
      console.log('attrlist==>', attrlist)
      return attrlist
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
