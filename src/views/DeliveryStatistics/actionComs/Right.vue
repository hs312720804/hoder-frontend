<template>
  <el-form ref="form" :model="form" label-width="180px">
    <el-form-item label="节点类型：">
      <el-select v-model="form.region" placeholder="请选择节点类型">
        <el-option label="周期范围" value="shanghai"></el-option>
        <el-option label="下拉框" value="beijing"></el-option>
        <el-option label="输入框" value="beijing"></el-option>
        <el-option label="搜索框" value="beijing"></el-option>
        <el-option label="反选框" value="beijing"></el-option>
        <el-option label="范围选择" value="beijing"></el-option>
        <el-option label="指标框" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否为必选项：">
      <el-radio-group v-model="form.resource">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="层级：">

    </el-form-item>

    <el-form-item label="数据来源：">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="节点之间的关联：">
      <el-checkbox-group v-model="form.type">
        <!-- <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
        <el-checkbox label="地推活动" name="type"></el-checkbox>
        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox> -->
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="特殊处理：">
      <el-radio-group v-model="form.resource">
        <!-- <el-radio label="线上品牌商赞助"></el-radio>
        <el-radio label="线下场地免费"></el-radio> -->
      </el-radio-group>
    </el-form-item>
    <el-form-item label="节点是否为多选节点：">
      <el-radio-group v-model="form.resource">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
  </template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>
