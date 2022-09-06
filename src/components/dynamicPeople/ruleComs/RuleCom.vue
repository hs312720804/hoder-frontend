<template>
  <div  class="label-item">
    <template v-if="childItem.tagId === 1 || childItem.tagId === 2 || childItem.tagId === 4">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>
      
      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>
  
      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>


    <!-- 模块活跃 -->
    <template v-if="childItem.tagId === 6">
      <span>
        <el-select style="width: 100px" name="oxve" v-model="childItem.action" class="input-inline">
          <template>
            <el-option value="show" label="曝光"></el-option>
            <el-option value="click" label="点击"></el-option>
          </template>
        </el-select>
      </span>

      <span>
        <el-select style="width: 100px" name="oxve" v-model="childItem.locationType" class="input-inline">
          <template>
            <el-option :value="1" label="板块位"></el-option>
            <el-option :value="2" label="推荐位"></el-option>
          </template>
        </el-select>
      </span>
      
      <span>
        <el-input style="width: 100px" v-model="childItem.locationId" placeholder="请输入ID" >
        </el-input>
      </span>
      
      <span>
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" class="input-inline">
          <template>
            <el-option value="pv" label="次数"></el-option>
            <el-option value="days" label="天数"></el-option>
          </template>
        </el-select>
      </span>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>
  
      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>
    
    <!-- 优惠券活跃 -->
    <template v-if="childItem.tagId === 7">

      <span>
        <el-select style="width: 100px" name="oxve" v-model="childItem.coupon" class="input-inline">
          <template>
            <el-option value="couponShowPv" label="曝光"></el-option>
            <el-option value="couponCreatePv " label="领用"></el-option>
            <el-option value="couponUsePv " label="使用"></el-option>
          </template>
        </el-select>
      </span>

      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>
      
      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>
  
      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>
    
    <!-- 产品包下单 -->
    <template v-if="childItem.tagId === 8">
      <!-- 选择产品包 -->
      <SourceSign :childItem="childItem" :index="index" :n="n"></SourceSign>
      
      <span>
        <el-select style="width: 100px" name="oxve" v-model="childItem.count" class="input-inline">
          <template>
            <el-option value="xiadanNum" label="下单次数"></el-option>
            <el-option value="xiadanDays " label="下单天数"></el-option>
          </template>
        </el-select>
      </span>

      <!-- 选择 operator -->
      <Operator :childItem="childItem" :index="index" :n="n"></Operator>
  
      <!-- 输入 value -->
      <Value :childItem="childItem" :index="index" :n="n"></Value>
    </template>
    
  </div>
</template>

<script>
import SourceSign from './elements/SourceSign.vue';
import Operator from './elements/Operator.vue';
import Value from './elements/Value.vue';
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
    },
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>
.label-item span {
  margin-right: 10px;
}
 
</style>
