<template>
  <div class="label-item">
    <!-- {{childItem.tagKey}}<br/>
    childItem.sourceSign --- {{childItem.sourceSign}}<br/>
    childItem.count --- {{childItem.count}}<br/>
    {{childItem.coupon}}<br/>
    stopType---{{stopType}}<br/>
    recommendedValue---{{ recommendedValue }}<br/> -->
    <template v-if="childItem.tagKey === 'exposeDays' || childItem.tagKey === 'exposeTimes' || childItem.tagKey === 'payAmount'">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n" :recommendedValue="recommendedValue"></Value>
    </template>

    <!-- 模块活跃 -->
    <template v-if="childItem.tagKey === 'moduleActive'">
      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.action'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.action" clearable class="input-inline">
          <template>

            <el-option v-for="item in actionOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="show" label="曝光"></el-option>
            <el-option value="click" label="点击"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.locationType'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.locationType" clearable class="input-inline">
          <template>
            <el-option v-for="item in locationTypeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option :value="1" label="板块位"></el-option>
            <el-option :value="2" label="推荐位"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.locationId'"
        :rules="{
          required: true, message: '不能为空', trigger: 'blur'
        }"
        class="form-item-styl"
      >
        <el-input style="width: 100px" v-model="childItem.locationId" placeholder="请输入ID" >
        </el-input>
      </el-form-item>

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.count'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" clearable class="input-inline">
          <template>
            <el-option v-for="item in countOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="pv" label="次数"></el-option>
            <el-option value="days" label="天数"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>

    <!-- 优惠券活跃 -->
    <template v-if="childItem.tagKey === 'couponsActive'">

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.coupon'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.coupon" clearable class="input-inline">
          <template>
            <el-option v-for="item in couponOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="couponShowPv" label="曝光"></el-option>
            <el-option value="couponCreatePv" label="领用"></el-option>
            <el-option value="couponUsePv" label="使用"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <!-- 天数次数 -->
      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.count'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" clearable class="input-inline">
          <template>
            <el-option v-for="item in countOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="pv" label="次数"></el-option>
            <el-option value="days" label="天数"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n" :recommendedValue="recommendedValue"></Value>
    </template>

    <!-- 产品包下单 -->
    <template v-if="childItem.tagKey === 'productOrder'">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.count'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" clearable class="input-inline">
          <template>
            <el-option v-for="item in productCountOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="orderNum" label="下单次数"></el-option>
            <el-option value="orderDays " label="下单天数"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n" :recommendedValue="recommendedValue"></Value>
    </template>

    <!-- 试看二维码 -->
    <template v-if="childItem.tagKey === 'detailAdPos'">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.count'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" clearable class="input-inline">
          <template>
            <el-option v-for="item in detailAdPosOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="orderNum" label="下单次数"></el-option>
            <el-option value="orderDays " label="下单天数"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>

    <!-- 详情页曝光 -->
    <template v-if="childItem.tagKey === 'detailPageView'">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <el-form-item
        label=""
        :prop="'rules.' + index + '.rules.' + n + '.count'"
        :rules="{
          required: true, message: '不能为空', trigger: 'change'
        }"
        class="form-item-styl"
      >
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" clearable class="input-inline">
          <template>
            <el-option v-for="item in detailPageViewOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>

            <!-- <el-option value="orderNum" label="下单次数"></el-option>
            <el-option value="orderDays " label="下单天数"></el-option> -->
          </template>
        </el-select>
      </el-form-item>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n" :recommendedValue="recommendedValue"></Value>
    </template>

    <!-- 影视模型 -->
    <template v-if="childItem.tagKey === 'filmModelTag'">
      <!-- {{ childItem }} -->
      <!-- 公共属性，只需要展示“所选维度”四个字就行 -->
      <span v-if="childItem.isCommonAttr" class="red-tip">所选维度</span>
      <!-- 不是公共属性，正常下拉选择 -->
      <FilmModelTagValueSelect v-else :childItem="childItem" :index="index" :n="n" v-model="filmModelTagValue"></FilmModelTagValueSelect>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
      <!--
      <el-popover
        placement="top"
        trigger="hover"
        class="popover-button"
      > -->
        <div class="tip-text" style="line-height: 18px;">
          <i class="el-icon-warning-outline"></i>
          该影片标签的偏好权重排名共10个，排名1为偏好权重最高，排名10为偏好权重最低
        </div>
        <!-- <span class="priority-tip" slot="reference">!</span>
      </el-popover> -->

      <!-- <el-form-item
        label=""
        class="form-item-styl"
      >
        <FilmModelTagSelect :childItem="childItem" :treeDataVal.sync="treeDataVal"></FilmModelTagSelect>
      </el-form-item> -->

      <!-- {{ filmModelTagValue }} -->

    </template>
    <div class="tip-text" style="line-height: 18px;" v-if="childItem.value === recommendedValue">
      <i class="el-icon-warning-outline"></i>
      推荐值是分析师经过多次实验分析对比得出的转化最高的值，建议采纳
    </div>
  </div>
</template>

<script>
import SourceSign from './elements/SourceSign.vue'
import Operator from './elements/Operator.vue'
import Value from './elements/Value.vue'
import FilmModelTagValueSelect from './elements/FilmModelTagValueSelect.vue'
// import FilmModelTagSelect from './elements/FilmModelTagSelect.vue'
export default {
  components: { SourceSign, Operator, Value, FilmModelTagValueSelect },
  inject: ['_this'],
  props: {
    childItem: {
      type: Object,
      default: () => {}
    },

    index: {
      type: Number,
      default: 0
    },
    n: {
      type: Number,
      default: 0
    },
    stopType: { // 故事线 - 出口条件 - 则视为选择的值
      type: [Number, String],
      default: undefined
    }
  },
  data () {
    return {
      // 优惠券活跃： 天数次数选项，为了兼容旧版本，需要特殊处理
      couponsActiveCountType: 'pv',
      couponOptions: [
        {
          label: '曝光',
          value: 'couponShowPv'
        },
        {
          label: '领用',
          value: 'couponCreatePv'
        },
        {
          label: '使用',
          value: 'couponUsePv'
        }
      ],
      actionOptions: [{
        label: '曝光',
        value: 'show'
      },
      {
        label: '点击',
        value: 'click'
      }],
      locationTypeOptions: [{
        label: '板块位',
        value: 1
      }, {
        label: '推荐位',
        value: 2
      }],
      // 该字段多处使用，勿改
      countOptions: [{
        label: '次数',
        value: 'pv'
      }, {
        label: '天数',
        value: 'days'
      }],
      productCountOptions: [{
        label: '下单次数',
        value: 'orderNum'
      }, {
        label: '下单天数',
        value: 'orderDays'
      }],
      // 试看二维码
      detailAdPosOptions: [{
        label: '曝光次数',
        value: 'detailAdPosShowPv'
      }, {
        label: '曝光天数',
        value: 'detailAdPosShowDays'
      }],
      // 详情页曝光
      detailPageViewOptions: [{
        label: '次数',
        value: 'detailPageViewPv'
      }, {
        label: '天数',
        value: 'detailPageViewDays'
      }],
      // treeDataVal: { value: 2166, child: { value: 2167, child: { value: 2186, child: { value: 2213, child: { value: 4792 } } } } },
      filmModelTagValue: {}
    }
  },
  watch: {
    'childItem.tagKey': {
      handler (val) {
        if (val === 'filmModelTag') { // 影视模型
          this.filmModelTagValue = {
            tagCode: this.childItem.tagCode,
            tagCnName: this.childItem.tagCnName,
            pathName: this.childItem.pathName
          }
        }
      },
      immediate: true
    }

  },
  computed: {
    // 根据【选择标签】、【产品包】和【次数天数】获取当前推荐值
    // 故事线 - 出口 - 选择则视为（就是下一跳...）才有这个
    recommendedValue () {
      const { tagKey, sourceSign, count, coupon } = this.childItem
      const matchSourceSignList1 = ['yinhe', '6', 'youku', 'shaoervip'] // 爱奇艺、腾讯、酷喵、亲子
      const matchSourceSignList2 = ['yinhe', '6', 'youku'] // 爱奇艺、腾讯、酷喵
      const matchSourceSignList3 = ['shaoervip'] // 亲子

      const stopTypeEnum = {
        4: 'uninterest', // 不感兴趣
        1: 'interest', // 感兴趣，换方案继续种草
        2: 'converted' // 已转化
      }

      let recommendedValue

      // 只有【继续种草】、【不感兴趣】有推荐值
      if (stopTypeEnum[this.stopType] === 'uninterest' || stopTypeEnum[this.stopType] === 'interest') {
        switch (tagKey) {
          // 详情页曝光
          case 'detailPageView': {
            const isDay = count === 'detailPageViewDays' // 天数
            const isPv = count === 'detailPageViewPv' // 次数

            if (matchSourceSignList1.includes(sourceSign) && isDay) {
              recommendedValue = 2
            } else if (matchSourceSignList2.includes(sourceSign) && isPv) {
              recommendedValue = 10
            } else if (matchSourceSignList3.includes(sourceSign) && isPv) {
              recommendedValue = 15
            }
            break
          }
          // 优惠券活跃
          case 'couponsActive': {
            const isDay = coupon === 'couponShowPv' && count === 'days' // 曝光天数
            const isPv = coupon === 'couponShowPv' && count === 'pv' // 曝光次数

            if (matchSourceSignList2.includes(sourceSign) && isDay) {
              recommendedValue = 1
            } else if (matchSourceSignList2.includes(sourceSign) && isPv) {
              if (stopTypeEnum[this.stopType] === 'interest') {
                recommendedValue = 2
              } else if (stopTypeEnum[this.stopType] === 'uninterest') {
                recommendedValue = 1
              }
            }
            break
          }

          // 产品包曝光天数
          case 'exposeDays': {
            if (matchSourceSignList1.includes(sourceSign)) {
              recommendedValue = 1
            }
            break
          }

          // 产品包曝光天数
          case 'exposeTimes': {
            if (matchSourceSignList2.includes(sourceSign)) {
              recommendedValue = 2
            } else if (matchSourceSignList3.includes(sourceSign)) {
              recommendedValue = 3
            }
            break
          }

          // 产品包下单
          case 'productOrder': {
            const isPv = count === 'orderNum' // 次数
            if (matchSourceSignList1.includes(sourceSign) && isPv) {
              recommendedValue = 2
            }
            break
          }
        }
        this.childItem.value = recommendedValue || this.childItem.value
      }
      return recommendedValue
    }
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>
.label-item span {
  margin-right: 10px;
}
// .form-item-styl {
//   margin-top: 4px
// }
.red-tip {
  background-color: #F5F7FA;
  color: #909399;
  vertical-align: middle;
  position: relative;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  white-space: nowrap;
  width: 200px
  text-align center
  font-size 12px
}
</style>
