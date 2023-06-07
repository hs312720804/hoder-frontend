<template>
<!-- 设置所有接待员的条件 -->
<div class="single-set-wrap div-class">
  <!-- allRuleForm --- {{ allRuleForm }} -->
  <!-- 接待员列表 -->
  <div class="single-set-left">
    <div class="search">
      <el-input placeholder="接待员/创建人" v-model="searchServicer" clearable class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
      </el-input>
    </div>
    <!-- 接待员列表 -->
    <!-- allRuleForm--{{ allRuleForm }} -->
    <div >
      <div v-for="(item, index) in allRuleForm" :key="item.id" @click="selectServicer(item)" :class="{active: activeId === item.id}">
        <!-- <i class="icon el-icon-user"></i> -->

        <template v-if="item.delFlag !== 2 && !item.hidden">
          <div class="single-set-list" >
            <span class="item-content">
              {{ item.receptionist }}
            </span>
            <i class="el-icon-delete" @click="deleteServicer(index)"></i>
          </div>
        </template>
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

        <el-form-item label="入口条件：" prop="entry">
          <div v-for="(item, index) in ruleForm.entryConditions" :key="item.entryIndex ? (item.id + item.entryIndex) : item.id">
            <!-- {{item.id + index}} -->
            <template v-if="item.delFlag !== 2">
              <div class="create-client-border">
                <createClientDialog
                  ref="createClientDialogRef"
                  :options="options"
                  :editRow="item.id ? item : undefined"
                  :circulationTagDataListProp="circulationTagDataList"
                  :soureceSignListProp="soureceSignList"
                  :conditionTagsFilteredProp="conditionTagsFiltered"
                  :selectTagTagsListTotalProp="selectTagTagsListTotal"
                  :receptionistId="item.receptionistId"
                  :delFlag="item.delFlag"
                >
                </createClientDialog>
                <i class="el-icon-delete" @click="deleteEntry(ruleForm, index)"></i>
              </div>
            </template>
          </div>
          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createClient(ruleForm)">新建服务对象筛选</el-button>
          </div>

        </el-form-item>

        <el-form-item label="出口条件：" prop="export">
          <div v-for="(item, index) in ruleForm.exportConditions" :key="item.exportIndex ? (item.id + item.exportIndex) : item.id">
            <!-- {{ item.id}}--{{  item.exportIndex }} -->
            <template v-if="item.delFlag !== 2">
              <div class="create-client-border">
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
                  :receptionistId="item.receptionistId"
                  :delFlag="item.delFlag"
                ></createClientDialog>
                <i class="el-icon-delete" @click="deleteExport(ruleForm, index)"></i>
              </div>
            </template>

          </div>

          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createExport(ruleForm)">新建出口条件</el-button>
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
    },
    sceneId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      // filterAllRuleForm: [],
      // entryList: [{ id: 1 }],
      // exportList: [{ id: 1 }],
      searchServicer: '',
      // servicerList: ['接待员1', '接待员2', '接待员3', '接待员4', '南京', '西安', '成都'],
      activeId: '', // 当前所选接待员
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
      allRuleForm: [],
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
    // 下一跳接待员，只能选择除了本身之外的
    servicerListFilterSelect () {
      const data = this.allRuleForm.filter(item => item.id !== this.activeId) || []
      return data
    }
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
        this.allRuleForm[index].delFlag = 2
        const oneItem = this.allRuleForm.find(item => item.delFlag !== 2 && !item.hidden)
        this.activeId = oneItem.id || 0

        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 新建服务对象筛选
    createClient (formItem) {
      formItem.entryConditions.push({
        // sceneId: 309,
        // policyId: 5327,
        id: '',
        receptionistId: formItem.id, // 所属接待员ID，必填
        tagIds: '',
        rulesJson: '',
        behaviorRulesJson: '',
        behaviorTempCrowdId: null,
        link: 'OR',
        delFlag: 1,
        entryIndex: this.entryIndex++
      })
    },
    deleteEntry (formItem, index) {
      // formItem.entryConditions.splice(index, 1)
      formItem.entryConditions[index].delFlag = 2
    },
    // 新建出口条件：
    createExport (formItem) {
      formItem.exportConditions.push({
        // sceneId: 309,
        // policyId: 5327,
        id: '',
        receptionistId: formItem.id, // 所属接待员ID，必填
        tagIds: '',
        rulesJson: '',
        behaviorRulesJson: '',
        behaviorTempCrowdId: null,
        link: 'OR',
        delFlag: 1,
        nextId: '',
        stopType: '',
        exportIndex: this.exportIndex++
      })
    },
    deleteExport (formItem, index) {
      // formItem.exportConditions.splice(index, 1)
      formItem.exportConditions[index].delFlag = 2
    },
    getServiceList () {
      // this.filterAllRuleForm = this.allRuleForm.filter(item => item.receptionist.indexOf(this.searchServicer) > -1)
      this.allRuleForm = this.allRuleForm.map(item => {
        return {
          ...item,
          hidden: item.receptionist.indexOf(this.searchServicer) === -1
        }
      })
      const oneItem = this.allRuleForm.find(item => item.delFlag !== 2 && !item.hidden)
      this.activeId = oneItem.id || 0
      // this.$message({
      //   type: 'success',
      //   message: '删除成功!'
      // })
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
    // 一键投放的
    if (this.sceneId) {
      const parmas = {
        sceneId: this.sceneId
      }
      this.$service.getListbySceneId(parmas).then(res => {
        this.allRuleForm = res
        this.activeId = res[0].id
      })
      // 批量创建接待员的
    } else if (this.batchId) {
      const parmas = {
        id: this.batchId
      }
      this.$service.getBatchList(parmas).then(res => {
        this.allRuleForm = res
        this.activeId = res[0].id
      })
    }

    this.getTags() // 获取所有的标签列表

    this.getCirculationTag() // 获取流转标签
  }
}
</script>
<style lang="stylus" scoped>
@import './index.styl'
</style>
