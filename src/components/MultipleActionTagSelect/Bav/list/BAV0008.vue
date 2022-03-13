<template>
  <div class="flex-row">
    <!-- 第一级 -->
    <el-form-item prop="bav.value">
      <el-select
        v-model="childItem.bav.value"
        placeholder="请选择业务分类"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange({
          defaultChild: childItem.bav.behaviorValue[0].child
        })"
      >

        <template v-for="item in getBehaviorAttrList(1)">
          <el-option
            :value="item.value"
            :label="item.name"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
    </el-form-item>

    <div
      v-for="item in childItem.bav.behaviorValue"
      :key="item.value"
      class="flex-row"
    >
      <!-- {{item.child[0]}} -->
      <!-- 第二级 -->
      <el-select
        v-model="item.childCheckedVal[0]"
        placeholder="请选择一级分类"
        style="width: 110px"
        name="asdq"
        class="input-inline"
        clearable
        @change="handelQiBoChildBehavirSelectChange({
          childItem: item,
          isValueClear: true,
          defaultChild: item.child[0].child
        })"
      >
        <template v-for="attrChildItem in getBehaviorAttrList(2)">
          <el-option
            :value="attrChildItem.value"
            :label="attrChildItem.name"
            :key="attrChildItem.value"
          >
          </el-option>
        </template>
      </el-select>
      —
      <span
        v-for="(item2, index) in item.child"
        :key="index"
        class="flex-row child"
      >
        <!-- 第三级 -->
        <el-select
          v-model="item2.childCheckedVal[0]"
          placeholder="请选择二级分类"
          style="width: 110px"
          name="asdq"
          class="input-inline"
          clearable
          @change="handelQiBoChildBehavirSelectChange({
            childItem: item2,
            level: 3,
            extra: {type: item.childCheckedVal[0]},
            isValueClear: true,
            defaultChild: item2.child[0].child
          })"
        >
          <template v-for="attrChildItem in getBehaviorAttrList(3, {type: item.childCheckedVal[0]})">
            <el-option
              :value="attrChildItem.value"
              :label="attrChildItem.name"
              :key="attrChildItem.value"
            >
            </el-option>
          </template>
        </el-select>
        <span
          v-for="(item3, index) in item2.child"
          :key="index"
          class="flex-row child"
        >
          <!-- @change="handelQiBoChildBehavirSelectChange(item3, false, childItem, 4, {}, 'value', true, item3.child[0].child)" -->
          <!-- 第四级 -->
          <el-select
            v-model="item3.childCheckedVal[0]"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            placeholder="内容源"
            clearable
            @change="handelQiBoChildBehavirSelectChange({
              childItem: item3,
              level: 4,
              isValueClear: true,
              defaultChild: item3.child[0].child
            })"
          >
            <template v-for="attrChildItem in getBehaviorAttrList(4)">

              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.name"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>
          <span
            v-for="(item4, index) in item3.child"
            :key="index"
            class="flex-row child"
          >
            —
            <!-- @change="handelQiBoChildBehavirSelectChange(item4, false, childItem, 5, {}, 'value', true)" -->
            <span class="flex-column">
              <div class="flex-row">
                <!-- 第五级 -->
                <el-select
                  v-model="item4.childCheckedVal[0]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="请输入片名或ID"
                  no-data-text='没有找到该片'
                  clearable
                  :remote-method="(query) => { qiBoRemoteMethod(query, item3.childCheckedVal[0]) }"
                  :loading="loading2"
                  v-loadmore="{'methord': handelQiboLoadmore}"
                  @change="handelQiBoChildBehavirSelectChange({
                    childItem: item4,
                    level: 5,
                    isValueClear: true,
                    reverseSelectAttr: true
                  })"
                >
                  <el-option
                    v-for="tv in qiBoOptions"
                    :key="tv.value + tv.name"
                    :label="tv.name +'('+ tv.value+')'"
                    :value="tv.value">
                  </el-option>
                  <!-- 编辑回显 选项-->

                  <el-option
                    v-if="qiBoOptions.length === 0 && item4.childCheckedVal[0]"
                    :label="item4.child[0].name"
                    :value="item4.childCheckedVal[0]">
                  </el-option>
                </el-select>
                <!-- <el-checkbox
                  class="reverse-check"
                  v-model="childItem.bav.reverseSelect"
                  @change="ReverseSelect($event, item4.child)"
                >
                  圈出未起1播
                </el-checkbox> -->
              </div>

              <span class="appoint-text" v-if="!!item4.childCheckedVal[0] && appointmentInfo.length > 0">
                <span style="">该片的统计时间为:</span>
                <span v-for="item in appointmentInfo" :key="item.start + item.end" style="color: red">{{item.start}} - {{item.end}}</span>
                <span> ，请选择合理的周期范围</span>
              </span>
            </span>
            <span
              v-for="(item5, index) in item4.child"
              :key="index"
              class="flex-row child"
            >
              <!-- 选择了视频源下的视频 需要选择集数-->
              <span class="flex-column" v-if="!!item5.value">
                <!-- // 是电影的 -->
                <span v-if="item5.videoType === '电影'" class="flex-row">
                  <el-select
                      v-model="item5.childCheckedVal[0]"
                      style="width: 150px;"
                      placeholder="请选择"
                      clearable
                      @change="handelQiBoChildBehavirSelectChange({
                        childItem: item5,
                        hasChild: true,
                        level: 7
                      })"
                    >
                      <el-option
                        v-for="attrChildItem in getBehaviorAttrList(7)"
                        :key="attrChildItem.value"
                        :label="attrChildItem.name"
                        :value="attrChildItem.value">
                      </el-option>
                    </el-select>
                    <!-- 天数次数等 -->
                    <span v-if="!childItem.bav.reverseSelect">
                      <span
                        v-for="(item6, index) in item5.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <!-- <Type ref="typeRef" :item3="item6.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type> -->
                        <el-select
                          v-model="item6.childCheckedVal[0]"
                          style="width: 150px;"
                          placeholder="请选择"
                          clearable
                          @change="handelQiBoChildBehavirSelectChange({
                            childItem: item6,
                            hasChild: false,
                            level: 8,
                            selectPropKeyValue: 'type',
                            isValueClear: true
                          })"
                        >
                          <el-option
                            v-for="attrChildItem in getBehaviorAttrList(8)"
                            :key="attrChildItem.type"
                            :label="attrChildItem.name"
                            :value="attrChildItem.type"
                            :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                          </el-option>
                        </el-select>
                        <span
                          v-for="(item7, index) in item6.child"
                          :key="index"
                          class="flex-row child"
                        >
                          <el-select
                            v-model="item7.operator"
                            style="max-width: 100px; min-width: 100px;"
                            name="oxve"
                            class="input-inline"
                          >
                            <el-option value="="></el-option>
                            <el-option value=">="></el-option>
                            <el-option value="<="></el-option>
                            <el-option value=">"></el-option>
                            <el-option value="<"></el-option>
                          </el-select>
                          <el-input
                            placeholder="请输入"
                            v-model="item7.value"
                            clearable
                            style="max-width: 100px; min-width: 100px;"
                          >
                          </el-input>
                        </span>
                      </span>
                    </span>
                </span>

                <!-- // 不是电影的 -->
                  <!-- @change="handelQiBoChildBehavi666rSelectChange(item5, false, childItem, 6, {}, 'value', false)" -->
                <span v-else>
                  <el-select
                    multiple
                    v-model="item5.childCheckedVal"
                    style="width: 100px;"
                    placeholder="请选择集数"
                    @change="handelQiBoChildBehavirSelectChange({
                      childItem: item5,
                      hasChild: false,
                      level: 6
                    })"
                  >
                    <el-option
                      v-for="(tv, index) in qiBoCollectionOptions"
                      :key="tv.value + index"
                      :label="tv.name"
                      :value="tv.value">
                    </el-option>
                  </el-select>
                  <div class="flex-column" v-if="!childItem.bav.reverseSelect">
                    <ConditionLine :isShow="item5.child.length > 1"></ConditionLine>
                    <!-- {{ item5.child }} -->
                    <span
                      v-for="(item6, index) in item5.child"
                      :key="index"
                      class="flex-row child"
                    >
                      <span class="w100">{{ item6.name }}</span>
                        <!-- @change="handelQiBoChildBehavi666rSelectChange(item6, true, childItem, 7, {}, 'value', false)" -->
                      <el-select
                        v-model="item6.childCheckedVal[0]"
                        style="width: 150px;"
                        placeholder="请选择"
                        clearable
                        @change="handelQiBoChildBehavirSelectChange({
                          childItem: item6,
                          hasChild: true,
                          level: 7,
                        })"
                      >
                        <el-option
                          v-for="attrChildItem in getBehaviorAttrList(7)"
                          :key="attrChildItem.value"
                          :label="attrChildItem.name"
                          :value="attrChildItem.value">
                        </el-option>
                      </el-select>
                      <!-- 天数次数等 -->
                      <span v-if="!childItem.bav.reverseSelect">
                        <span
                          v-for="(item7, index) in item6.child"
                          :key="index"
                          class="flex-row child"
                        >
                          <!-- 没有选择集 -->
                            <!-- @change="handelQiBoChildB666ehavirSelectChange(item7, false, childItem, 8, {}, 'type', true)" -->
                          <el-select
                            v-if="item6.name === ''"
                            v-model="item7.childCheckedVal[0]"
                            style="width: 150px;"
                            placeholder="请选择"
                            clearable
                            @change="handelQiBoChildBehavirSelectChange({
                              childItem: item7,
                              level: 8,
                              selectPropKeyValue: 'type',
                              isValueClear: true
                            })"
                          >
                            <el-option
                              v-for="attrChildItem in getBehaviorAttrList(8)"
                              :key="attrChildItem.type"
                              :label="attrChildItem.name"
                              :value="attrChildItem.type"
                              :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                            </el-option>
                          </el-select>
                          <!-- 选择了集数，下拉选项只有【单集观看时长】 -->
                            <!-- @change="handelQiBoChil666dBehavirSelectChange(item7, false, childItem, 9, {}, 'type', true)" -->
                          <el-select
                            v-else
                            v-model="item7.childCheckedVal[0]"
                            style="width: 150px;"
                            placeholder="请选择"
                            clearable
                            @change="handelQiBoChildBehavirSelectChange({
                              childItem: item7,
                              level: 9,
                              selectPropKeyValue: 'type',
                              isValueClear: true
                            })"
                          >
                            <el-option
                              v-for="attrChildItem in getBehaviorAttrList(9)"
                              :key="attrChildItem.type"
                              :value="attrChildItem.type"
                              :label="attrChildItem.name"
                              :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                            </el-option>
                          </el-select>
                          <span
                            v-for="(item8, index) in item7.child"
                            :key="index"
                            class="flex-row child"
                          >
                          {{item8}}
                            <el-select
                              v-model="item8.operator"
                              style="max-width: 100px; min-width: 100px;"
                              name="oxve"
                              class="input-inline"
                            >
                              <el-option value="="></el-option>
                              <el-option value=">="></el-option>
                              <el-option value="<="></el-option>
                              <el-option value=">"></el-option>
                              <el-option value="<"></el-option>
                            </el-select>
                            <el-input
                              placeholder="请输入"
                              v-model="item8.value"
                              clearable
                              style="max-width: 100px; min-width: 100px;"
                            >
                            </el-input>
                          </span>
                        </span>
                      </span>
                    </span>
                  </div>
                </span>
              </span>
              <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="item5.videoType === '电影' ? ReverseSelect($event, item4.child) : ReverseSelect($event, item5.child)"
              >
                圈出未起播
              </el-checkbox>

              <!-- 没有选择视频 -->
              <span v-if="!item5.value && !childItem.bav.reverseSelect" >
                <!-- {{ item5 }} -->
                <span class="flex-row"
                >
                    <!-- @change="handelQiBoCh666ildBehavirSelectChange(item5, false, childItem, 8, {}, 'type', true)" -->
                  <el-select
                    v-model="item5.childCheckedVal[0]"
                    style="width: 150px;"
                    placeholder="请选择"
                    clearable
                    @change="handelQiBoChildBehavirSelectChange({
                      childItem: item5,
                      level: 8,
                      selectPropKeyValue: 'type',
                      isValueClear: true
                    })"
                  >
                    <el-option
                      v-for="attrChildItem in getBehaviorAttrList(8)"
                      :key="attrChildItem.type"
                      :label="attrChildItem.name"
                      :value="attrChildItem.type"
                      :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                    </el-option>
                  </el-select>
                  <span
                    v-for="(item6, index) in item5.child"
                    :key="index"
                    class="flex-row child"
                  >
                    <el-select
                      v-if="index === 0"
                      v-model="item6.operator"
                      style="max-width: 100px; min-width: 100px;"
                      name="oxve"
                      class="input-inline"
                    >
                      <el-option value="="></el-option>
                      <el-option value=">="></el-option>
                      <el-option value="<="></el-option>
                      <el-option value=">"></el-option>
                      <el-option value="<"></el-option>
                    </el-select>
                    <el-input
                      v-if="index === 0"
                      placeholder="请输入"
                      v-model="item6.value"
                      clearable
                      style="max-width: 100px; min-width: 100px;"
                    >
                    </el-input>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>

      </span>
    </div>
  </div>
</template>

<script>
// import { getBehaviorAttrListFn, setRecoveryItemFn } from './common.js'
import common from './common1.vue'
import Type from '../../Type.vue'
import ConditionLine from '../../ConditionLine.vue'
export default {
  extends: common,
  components: {
    Type,
    ConditionLine
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
  data () {
    return {
      isDisableDaySelect: false,
      qiBoOptions: [],
      loading2: false,
      qiBoCollectionOptions: [],
      qiboQuery: '',
      qiboSource: '',
      qiboParams: {
        source: '',
        keywords: '',
        page: 1,
        pageSize: 200
      },
      appointmentInfo: [],
      defaultChildObj: {
        name: '',
        value: '',
        field: '',
        operator: '>=',
        type: 'string',
        child: [
          {
            name: '',
            value: '',
            field: '',
            operator: '<=',
            type: 'string'
          }
        ]
      }

    }
  },
  watch: {
    'childItem.bav': {
      handler (val) {
        const weekRang = val.weekRang.value
        const timeRange = val.timeRange.value
        // 当选择了星期范围或者时间区间时，禁用【天数】选项
        if (weekRang.length === 0 && timeRange.length === 0) {
          this.isDisableDaySelect = false
        } else {
          this.isDisableDaySelect = true
        }
      },
      deep: true,
      immediate: true
    },
    childItem: {
      handler (val) {
        // 编辑回显
        // 【起播行为】标签需要查询影片集数
        this.getQiboTvEpisodes(val.bav.behaviorValue)
      },
      // deep: true,
      immediate: true
    }
  },
  methods: {
    handelBehavirSelectChange () {
      this.$emit('handelBehavirSelectChange', ...arguments)
    },
    // getBehaviorAttrList () {
    //   const level = arguments[0]
    //   if (level === 5) {
    //     return this.qiBoOptions
    //   } else if (level === 6) {
    //     return this.qiBoCollectionOptions
    //   }

    //   return getBehaviorAttrListFn(this.childItem, this.bavAttrList, ...arguments)
    // },

    /**
     * 【起播行为】绑定事件
     * @param {Object} childItem 当前选项的obj
     * @param {Boolean} hasChild 最后一级
     * @param {Number} level 第几级（为获取下拉框list）
     * @param {Object} extra 附加信息（根据选项判断，为获取不同下拉框list）
     * @param {String} selectPropKeyValue 所下拉框的 value和key 字段的 key值
     * @param {Boolean} isValueClear 一二级联动时，一级下拉切换，将二级下拉框清空
     * @param {Object} defaultChild 所清空下一级 child 时的默认赋值
     */
    // handelQiBoChildBehavir666SelectChange(childItem, hasChild = false, item, level=2, extra, selectPropKeyValue = 'value', isValueClear = false, defaultChild = []) {
    handelQiBoChildBehavirSelectChange (params = {}) {
      debugger
      let { childItem, hasChild = false, level = 2, extra = {}, selectPropKeyValue = 'value', isValueClear = false, defaultChild = [], reverseSelectAttr } = params

      // 改变数据时将所有的checkbox归位false
      this.$set(this.childItem.bav, 'reverseSelect', false)
      this.childItem.bav.behaviorValue = this.setRecoveryItem(this.childItem.bav.behaviorValue)

      const vals = typeof (childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const behaviorValue = childItem.child || []

      const behaviorAttrList = this.getBehaviorAttrList(level, extra)
      // const behaviorAttrList = selectPropKeyValue === 'value' ? this.getBehaviorAttrList(item, level, extra) : this.qiBoOptions
      if (level === 4) { // 切换视频源时，清空下拉选项
        this.qiBoOptions = []
        this.qiboParams.page = 1 // 页码归1
      }
      debugger
      childItem.child = this.getQiBoValListByVals({
        vals,
        behaviorValue,
        attrList: behaviorAttrList,
        hasChild,
        defaultChild,
        selectPropKeyValue,
        isValueClear,
        level,
        reverseSelectAttr,
        parentId: childItem.id
      })
      debugger
    },
    // 通过 vals 获取完整的 valList
    // vals -- value 集合, behaviorValue -- 已经组装好的集合, attrList -- 下拉框列表
    /**
     * 组装数据格式
     * @param {Array} vals 选中值的集合
     * @param {Array} behaviorValue 已经组装好的集合
     * @param {Array} attrList 下拉框列表
     * @param {Boolean} hasChild = false 是否有 child (如果下一级是下拉框，则应选为false)
     * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
     * @param {String} selectPropKeyValue = 'value' 下拉框的 value和key 字段的 key值
     * @param {Boolean} isValueClear = false 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
     * @param {Number} level 第几级（为获取下拉框list）
     */
    getQiBoValListByVals (params = {}) {
      let { vals, behaviorValue, attrList, hasChild = false, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, level, reverseSelectAttr, parentId } = params
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      let list = []
      const reverseSelect = reverseSelectAttr ? this.childItem.bav.reverseSelect : false
      debugger
      if (vals.length === 0 && level === 6) { // 清空集数
        let obj = behaviorValue[0] // 不改变子级的数据
        obj.name = ''
        obj.value = ''
        obj.field = ''
        list.push(obj)
      }

      console.log(vals)
      if (level === 4) { // 当切换视频源时，后面的数据清空
        defaultChild = [{
          name: '',
          value: '',
          field: '',
          operator: '=',
          type: 'string',
          child: [{
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string',
            child: [],
            childCheckedVal: []
          }],
          videoType: '',
          source: '',
          childCheckedVal: ['']
        }]
      }
      vals.forEach(val => {
        debugger
        const lastNumberObj = [
          { name: '', value: '', field: 'mac', operator: '>', type: 'count' }
        ]
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj = []

        // behaviorValue.find(item => item[selectPropKeyValue] === val) ||
        // attrList.find(item => item[selectPropKeyValue] === val)
        const matchObj = behaviorValue.find(item => item[selectPropKeyValue] === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val)

        if (matchObj) {
          obj = matchObj
        } else if (matchObj2) {
          obj = matchObj2
        }
        // console.log('obj.child=>>', obj.child)
        if (reverseSelect) { // 反选
          obj.operator = '!='
        }

        // if (level === 6) {
        //   defaultChild = [{
        //     name: '',
        //     value: '',
        //     field: '',
        //     operator: '=',
        //     type: 'string',
        //     childCheckedVal: [],
        //     child: [
        //       {
        //         name: '',
        //         value: '',
        //         field: '',
        //         operator: '=',
        //         type: 'string',
        //         childCheckedVal: [''],
        //         child: [
        //           {
        //             name: '',
        //             value: '',
        //             field: '',
        //             operator: '=',
        //             type: 'string'
        //           }
        //         ]
        //       }
        //     ]
        //   }]
        // }
        if (level === 6 || level === 7) {
          debugger
          const child = behaviorValue.filter(item => {
            return item.value === val
          })
          defaultChild = child.child || defaultChild
          console.log('defaultChild=====', defaultChild)
        }

        // 模块活跃，默认 child 值特殊处理
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))

        obj.child = obj.child || (hasChild ? lastNumberObj : defaultchild)

        obj.childCheckedVal = obj.childCheckedVal || (typeof (obj.childCheckedVal) === 'string' ? '' : [])

        if (defaultchild.length > 0) {
          obj.childCheckedVal = typeof (obj.childCheckedVal) === 'string' ? defaultchild.map(item => item.value).join(',') : defaultchild.map(item => item.value)
        }
        if (isValueClear) { // 清空当前对象的child里面的值 (一二级联动时的交互)
          alert(123)
          obj.childCheckedVal = []
          if (obj.child.length > 0) {
            obj.child[0].value = ''
            obj.child[0].name = ''
            obj.child[0].field = ''
            if (level !== 2 && level !== 4 && obj.child[0].child && obj.child[0].child.length > 0) {
              obj.child[0].childCheckedVal = []
              obj.child[0].child[0].value = ''
              obj.child[0].child[0].name = ''
              obj.child[0].child[0].field = ''
              obj.child[0].child[0].childCheckedVal = []
              // 递归清空子级的值
              this.clearChildVal(obj.child[0].child[0])
            }
          }
        }
        if (level === 3) { // 选择二级分类时，operator: 'like',  value: '%抗日%'
          obj.operator = 'like'
          if (obj.value !== '') { obj.value = '%' + obj.value + '%' }
        }
        if (level === 4) { // 视频源, value 和 name 都是中文
          obj.value = obj.name
        }
        if (level === 5 || level === 6) { // 输入了影片名称之后，需要查询集数/期数 需要查询预约信息
          if (obj.videoType !== '电影' && obj.source && obj.value) {
            this.getTvEpisodes(obj.source, obj.value)
            this.getAppointmentInfo(obj.source, obj.value)
          }
          debugger
          // if (obj.child.length === 0 && obj.child[0].value === '') {
          //   obj.child = [{
          //     name: '',
          //     value: '',
          //     field: '',
          //     operator: '=',
          //     type: 'string',
          //     childCheckedVal: [],
          //     child: [
          //       {
          //         name: '',
          //         value: '',
          //         field: '',
          //         operator: '=',
          //         type: 'string',
          //         childCheckedVal: [''],
          //         child: [
          //           {
          //             name: '',
          //             value: '',
          //             field: '',
          //             operator: '=',
          //             type: 'string'
          //           }
          //         ]
          //       }
          //     ]
          //   }]
          // }
        }

        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })

      // 动态设置子集的id与parentId
      list = this.setChildId(list, parentId)
      console.log('起播list===>', list)
      console.log('nodes===>', this.childItem.bav.behaviorValue)
      return list
    },
    // 起播行为递归清空子集的值
    clearChildVal (obj) {
      debugger
      alert(123)
      if (!obj.child || !obj.child.length) {
        return
      }
      obj.childCheckedVal = []
      obj.child && obj.child.forEach(item => {
        item.value = ''
        item.name = ''
        item.field = ''
        item.childCheckedVal = []
        if (item.child && item.child.length > 0) {
          this.clearChildVal(item)
        }
      })
    },
    // setRecoveryItem (nodes) {
    //   return setRecoveryItemFn(nodes, this.childItem)
    // },
    ReverseSelect () {
      this.$emit('ReverseSelect', ...arguments)
    },
    // 起播行为影片搜索更多
    handelQiboLoadmore () {
      this.qiboParams.page++ // 滚动加载翻页
      this.qiBoRemoteMethod(this.qiboQuery, this.qiboSource)
    },
    qiBoRemoteMethod (query, source) {
      // 重新查询，不是滚动加载
      if (this.qiboQuery !== query) {
        this.qiBoOptions = []
        this.qiboParams.page = 1 // 页码归1 s
      }

      if (source === '') return this.$message.error('请先选择内容源')
      if (query !== '') {
        this.loading2 = true

        this.qiboParams.source = source
        this.qiboParams.keywords = query

        this.$service.tvContentMatch(this.qiboParams).then(res => {
          this.loading2 = false
          this.qiboQuery = query // 记录查询关键字，滚动加载时要用到
          this.qiboSource = source
          let list = res.rows

          list = list.map(obj => {
            return {
              name: obj.title,
              value: obj.coocaaVId,
              field: obj.tableField,
              type: 'string',
              videoType: obj.videoType,
              source: obj.source
            }
          })
          this.qiBoOptions.push(...list)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this.qiBoOptions = []
      }
    },
    // 获取影片集数
    getTvEpisodes (source, id) {
      const params = {
        source,
        id,
        page: 1,
        pageSize: 200
      }

      this.$service.getTvEpisodes(params).then(res => {
        this.qiBoCollectionOptions = res.rows || []
        this.qiBoCollectionOptions = this.qiBoCollectionOptions.map(obj => {
          return {
            name: '第' + obj.urlCollection + '集',
            value: obj.urlCollection,
            field: obj.tableField,
            type: 'string'
          }
        })
      })
    },
    // 影片预约时间
    getAppointmentInfo (source, id) {
      const params = {
        source,
        id
      }
      this.$service.getAppointmentInfo(params).then(res => {
        const data = res
        this.appointmentInfo = data.map(item => {
          return {
            start: item.appointmentStart,
            end: item.appointmentEnd
          }
        })
        console.log('this.appointmentInfo==>', this.appointmentInfo)
      })
    },
    // 起播行为编辑，获取影片集数、预约时间 回显
    getQiboTvEpisodes (bavVal) {
      bavVal.forEach(obj => {
        if (obj.videoType && obj.videoType !== '电影' && obj.source && obj.value) {
          this.getTvEpisodes(obj.source, obj.value) // 获取影片集数
          this.getAppointmentInfo(obj.source, obj.value) // 获取影片预约时间
        } else if (obj.child) {
          this.getQiboTvEpisodes(obj.child) // 递归
        }
      })
    },
    getDefaultChildObj () {
      return JSON.parse(JSON.stringify(this.defaultChildObj))
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import '../index.styl'
</style>
