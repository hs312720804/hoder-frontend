<template>
<div class="single-set-wrap">
  <!-- 接待员列表 -->
  <div class="single-set-left">
    <div class="search">
      <el-input placeholder="接待员/创建人" v-model="searchServicer" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
      </el-input>
    </div>
    <div >
      <div v-for="item in cities" :key="item" class="single-set-list" @click="selectServicer(item)" :class="{active: activeItem === item}">
        <!-- <i class="icon el-icon-user"></i> -->
        <span class="item-content">
          {{ item }}
        </span>
        <i class="el-icon-delete"></i>
      </div>
    </div>
  </div>

  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm" >
    <el-form-item label="接待员命名：" prop="name">
      <el-input v-model="ruleForm.name" clearable style="width: 300px"></el-input>
    </el-form-item>

    <el-form-item label="服务对象选择：" prop="entry">
      <div class="create-client-border" v-for="(item, index) in entryList" :key="index">
        <createClientDialog
          ref="createClientDialog"
          :options="options">
        </createClientDialog>
        <i class="el-icon-delete" @click="deleteEntry(index)"></i>
      </div>
      <div class="box-fotter addRule">
        <el-button type="primary" icon="el-icon-plus" @click="createClient">新建服务对象筛选</el-button>
      </div>

    </el-form-item>

    <el-form-item label="服务终止条件：" prop="export">

      <div class="create-client-border" v-for="(item, index) in exportList" :key="index">
        <createClientDialog
          ref="exportClientDialog"
          type="export"
          :servicerListFilterSelect="servicerListFilterSelect"
          :options="options"
        ></createClientDialog>
        <i class="el-icon-delete" @click="deleteExport(index)"></i>

      </div>

      <div class="box-fotter addRule">
        <el-button type="primary" icon="el-icon-plus" @click="createExport">新建服务对象筛选</el-button>
      </div>

    </el-form-item>

  </el-form>
</div>
  </template>
<script>
import { options } from '../utils'
import createClientDialog from '../createClientDialog.vue'

export default {
  components: {
    createClientDialog
  },
  data () {
    return {
      entryList: [{ id: 1 }],
      exportList: [{ id: 1 }],
      searchServicer: '',
      cities: ['接待员1', '接待员2', '接待员3', '接待员4', '南京', '西安', '成都'],
      activeItem: '西安', // 当前所选接待员
      servicerListFilterSelect: [],
      options: options,
      value: [],
      filterMethod (query, item) {
        return item.pinyin.indexOf(query) > -1
      },
      ruleForm: {
        name: '',
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        type: [
          { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入接待员命名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    // 新建服务对象筛选
    createClient () {
      this.entryList.push({ id: 1 })
    },
    deleteEntry (index) {
      this.entryList.splice(index, 1)
    },
    // 新建服务终止条件：
    createExport () {
      this.exportList.push({ id: 1 })
    },
    deleteExport (index) {
      this.exportList.splice(index, 1)
    },
    getServiceList () {

    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 选择服务员
    selectServicer (item) {
      // 跳转
      this.activeItem = item
    }
  }
}
</script>
<style lang="stylus">
@import './index.styl'
</style>
