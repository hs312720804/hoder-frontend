<template>
  <div class="label-item">
    <template v-if="childItem.tagKey === 'exposeDays' || childItem.tagKey === 'exposeTimes' || childItem.tagKey === 'payAmount'">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
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

      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>

      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
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
      <Value :childItem="childItem" :index="index" :n="n"></Value>
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
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>

  </div>
</template>

<script>
import SourceSign from './elements/SourceSign.vue'
import Operator from './elements/Operator.vue'
import Value from './elements/Value.vue'
export default {
  components: { SourceSign, Operator, Value },
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
    }
  },
  data () {
    return {
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
        value: 'detailAdPosShowPv '
      }, {
        label: '曝光天数',
        value: 'detailAdPosShowDays '
      }],
      // 详情页曝光
      detailPageViewOptions: [{
        label: '次数',
        value: 'detailPageViewPv'
      }, {
        label: '天数',
        value: 'detailPageViewDays'
      }]

    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>
.label-item span {
  margin-right: 10px;
}
.form-item-styl {
  margin-top: 4px
}
</style>
