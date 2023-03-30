<template>
<!-- 设置所有接待员的条件 -->
<div class="single-set-wrap div-class">
  <!-- 接待员列表 -->
  <div class="single-set-left">
    <div class="search">
      <el-input placeholder="接待员/创建人" v-model="searchServicer" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
      </el-input>
    </div>
    <!-- 接待员列表 -->
    <div >
      <div v-for="(item, index) in allRuleForm" :key="item.id" class="single-set-list" @click="selectServicer(item)" :class="{active: activeId === item.id}">
        <!-- <i class="icon el-icon-user"></i> -->
        <span class="item-content">
          {{ item.receptionist }}
        </span>
        <i class="el-icon-delete" @click="deleteServicer(index.id)"></i>
      </div>
    </div>
  </div>

  <div>
    <div v-for="(ruleForm, index) in allRuleForm" :key="ruleForm.id">
      <!-- {{ allRuleForm }} -->
      <!-- {{ activeItem }} -->

      <el-form v-show="activeId === ruleForm.id" :model="allRuleForm[index]" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm" >
        <!-- 当前所选：{{ allRuleForm[index] }} -->
        <el-form-item label="接待员命名：" prop="receptionist">
          <el-input v-model="ruleForm.receptionist" clearable style="width: 300px"></el-input>
        </el-form-item>

        <!-- {{ruleForm.entryConditions}} -->

        <el-form-item label="服务对象选择：" prop="entry">
          <div class="create-client-border" v-for="(item, index) in ruleForm.entryConditions" :key="item.id + item.entryIndex">
            <!-- {{item.id + index}} -->
            <createClientDialog
              ref="createClientDialogRef"
              :options="options"
              :editRow="item.id ? item : undefined"
              :circulationTagDataListProp="circulationTagDataList"
              :soureceSignListProp="soureceSignList"
              :conditionTagsFilteredProp="conditionTagsFiltered"
              :selectTagTagsListTotalProp="selectTagTagsListTotal"
            >
            </createClientDialog>
            <i class="el-icon-delete" @click="deleteEntry(ruleForm, index)"></i>
          </div>
          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createClient(ruleForm)">新建服务对象筛选</el-button>
          </div>

        </el-form-item>

        <el-form-item label="服务终止条件：" prop="export">
          <div class="create-client-border" v-for="(item, index) in ruleForm.exportConditions" :key="item.id + item.exportIndex">
            <createClientDialog
              ref="exportClientDialogRef"
              type="export"
              :servicerListFilterSelect="servicerListFilterSelect"
              :options="options"
              :editRow="item.id ? item : undefined"
              :circulationTagDataListProp="circulationTagDataList"
              :soureceSignListProp="soureceSignList"
              :conditionTagsFilteredProp="conditionTagsFiltered"
              :selectTagTagsListTotalProp="selectTagTagsListTotal"
            ></createClientDialog>
            <i class="el-icon-delete" @click="deleteExport(ruleForm, index)"></i>

          </div>

          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createExport(ruleForm)">新建服务对象筛选</el-button>
          </div>

        </el-form-item>

      </el-form>
    </div>
  </div>
</div>
  </template>
<script>
import { options } from '../utils'
import createClientDialog from '../createClientDialog.vue'

export default {
  components: {
    createClientDialog
  },
  props: {
    batchId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      // entryList: [{ id: 1 }],
      // exportList: [{ id: 1 }],
      searchServicer: '',
      // servicerList: ['接待员1', '接待员2', '接待员3', '接待员4', '南京', '西安', '成都'],
      activeId: '', // 当前所选接待员
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
      allRuleForm: [
      ],
      rules: {
        // type: [
        //   { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        // ],
        receptionist: [
          { required: true, message: '请输入接待员命名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]

      },
      entryIndex: 0,
      exportIndex: 0,
      circulationTagDataList: [],
      soureceSignList: [],
      selectTagTagsListTotal: 0,
      conditionTagsFiltered: []
    }
  },
  watch: {
    // servicerList: {
    //   handler () {
    //     this.allRuleForm = this.servicerList.map(item => {
    //       return {
    //         name: item,
    //         entryList: [{ id: 1 }],
    //         exportList: [{ id: 1 }]
    //       }
    //     })
    //   },
    //   immediate: true
    // }
  },
  computed: {
    // allRuleForm () {
    //   // const len = this.servicerList.length
    //   const list = this.servicerList.map(item => {
    //     return {
    //       name: item,
    //       type: [],
    //       resource: '',
    //       desc: ''
    //     }
    //   })
    //   return list
    // }
  },
  methods: {
    deleteServicer (index) {
      this.$confirm('此操作将永久删除该接待员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.servicerList.splice(index, 1)
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      })
    },
    // 新建服务对象筛选
    createClient (formItem) {
      formItem.entryConditions.push({
        // sceneId: 309,
        // policyId: 5327,
        id: '',
        receptionistId: formItem.id,
        tagIds: '',
        rulesJson: '',
        behaviorRulesJson: '',
        behaviorTempCrowdId: null,
        link: 'OR',
        delFlag: 3,
        entryIndex: this.entryIndex++
      })
    },
    deleteEntry (formItem, index) {
      formItem.entryConditions.splice(index, 1)
    },
    // 新建服务终止条件：
    createExport (formItem) {
      formItem.exportConditions.push({
        // sceneId: 309,
        // policyId: 5327,
        id: '',
        receptionistId: formItem.id,
        tagIds: '',
        rulesJson: '',
        behaviorRulesJson: '',
        behaviorTempCrowdId: null,
        link: 'OR',
        delFlag: 3,
        nextId: '',
        stopType: '',
        exportIndex: this.exportIndex++
      })
    },
    deleteExport (formItem, index) {
      formItem.exportConditions.splice(index, 1)
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
      this.activeId = item.id
    },
    // 获取流转标签
    async getCirculationTag () {
      await this.$service.getRuleIndicators().then(res => {
        this.circulationTagDataList = res
      })
      await this.$service.getSourceSign().then(res => {
        this.soureceSignList = res
      })
    },
    async getTags () {
      await this.$service.policyTagSeach({ pageNum: 1, pageSize: 500, s: '', isStoryline: 1 })
        .then(data => {
          this.conditionTagsFiltered = data.pageInfo.list.map(item => {
            return {
              ...item,
              dataSource: item.tDataSource
            }
          })
          this.selectTagTagsListTotal = data.pageInfo.total
        })
    }
  },
  created () {
    const parmas = {
      id: this.batchId
    }
    this.$service.getBatchList(parmas).then(res => {
      this.allRuleForm = res
      this.activeId = res[0].id
    })

    this.getTags() // 获取所有的标签列表

    this.getCirculationTag() // 获取流转标签
  }
}
</script>
<style lang="stylus" scoped>
@import './index.styl'
</style>
