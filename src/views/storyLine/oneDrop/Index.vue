<template>
<div>
  <!-- <el-steps :active="activeStep" finish-status="success" simple >
      <el-step title="1.配置公共属性" icon="el-icon-edit"></el-step>
      <el-step title="第二步：圈出人群" icon="el-icon-edit"></el-step>
  </el-steps> -->
  <el-steps :active="activeStep" class="step-sty">
    <el-step title="添加场景"></el-step>
    <el-step title="选择创建方式"></el-step>
    <el-step :title="radio1 === 1 ? '批量创建接待员': '创建接待员'"></el-step>
    <el-step title="配置接待员"></el-step>
    <el-step title="投放"></el-step>
  </el-steps>

  <!-- 第一步 -->
  <el-form v-if="activeStep === 0" :model="formScene" :rules="formSceneRules" ref="formSceneRef" class="form-class" @submit.native.prevent>
    <div class="div-class">

      <el-form-item label="场景名：" label-width="90px" prop="name">
        <el-input v-model="formScene.name" autocomplete="off" clearable></el-input>
      </el-form-item>
    </div>
  </el-form>

  <!-- 第二步 -->
  <el-form v-if="activeStep === 1" class="form-class">
    <div class="div-class">

      <el-form-item label=" 创建方式：" label-width="90px">
        <el-radio v-model="radio1" :label="0" style="margin-right: 15px">逐个创建</el-radio>
        <el-radio v-model="radio1" :label="1">批量创建</el-radio>
      </el-form-item>
    </div>
  </el-form>

  <!-- 第三步 -->
  <OneByOneAdd v-if="activeStep === 2 && radio1 === 0"></OneByOneAdd>
  <CommonSet v-else-if="activeStep === 2 && radio1 === 1"></CommonSet>

  <!-- 第四步 -->
  <AllPerSet v-else-if="activeStep === 3"></AllPerSet>

  <!-- 第五步 -->
  <LaunchToBusiness
    v-else-if="activeStep === 4"
    :recordId="recordId"
    :tempPolicyAndCrowd="tempPolicyAndCrowd"
  ></LaunchToBusiness>

  <div style="float: right">
    <el-button @click="activeStep= activeStep - 1">上一步</el-button>
    <el-button @click="activeStep= activeStep + 1">下一步</el-button>
  </div>
</div>
</template>
<script>
import CommonSet from '../multiAdd/CommonSet.vue'
import AllPerSet from '../multiAdd/AllPerSet.vue'
import OneByOneAdd from './OneByOneAdd.vue'
import LaunchToBusiness from '@/views/launch/StrategyPutIn.vue'

export default {
  components: {
    CommonSet,
    AllPerSet,
    OneByOneAdd,
    LaunchToBusiness
  },
  data () {
    return {
      recordId: 5305,
      tempPolicyAndCrowd: { policyId: 5305, policyName: 'test detail', createTime: '2023-03-21 15:17:51', creator: 160, status: 1, department: '平台组', launchPolicyId: null, creatorName: '黄珊', departmentName: null, tagsList: null, useStatus: '未投放', conditionTagIds: null, delFlag: 1, updator: null, myCollect: true, launchedBi: null, bypass: null, smart: false, isBehavior: null, past7Active: 0, past7Req: 0, lastActiveTime: null, lastReqTime: null },
      activeStep: 0,
      radio1: 0,
      formSceneRules: {
        name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      formScene: {
        name: ''
      }
    }
  },
  methods: {

  }
}
</script>
<style lang='stylus' scoped>
@import './index.styl'
</style>
