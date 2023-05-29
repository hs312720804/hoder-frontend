<template>
  <!-- 批量设置接待员 -->
  <div>
    <!-- ruleForm:{{ ruleForm }} -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <div class="div-class">

        <el-form-item label="选择标签：" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="影视模型" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择维度：" prop="resource">
          <!-- filterable
          :filter-method="filterMethod"
          filter-placeholder="搜索接待员" -->
          <el-transfer
            :titles="['待选维度', '已选维度']"
            v-model="ruleForm.resource"
            :data="uptmList"
            :props="{
              key: 'id',
              label: 'tagCnName'
            }"
            filterable
            >
             <span slot-scope="{ option }">{{ option.tagCnName }}</span>
          </el-transfer>
        </el-form-item>
        <el-form-item label="接待员命名：" prop="prependName">
          <div class="compound-input">

            <el-input v-model="ruleForm.prependName" class="prepend-input" clearable>
            </el-input>
            <!-- <span class="red-tip">所选维度</span> -->
            <el-input v-model="ruleForm.appendName" clearable class="append-input" >
              <template slot="prepend">所选维度</template>
            </el-input>
          </div>

          <!-- <el-input placeholder="请输入内容" v-model="input1">
            <template slot="prepend">Http://</template>
          </el-input> -->
        </el-form-item>
        <!-- entryList: {{ entryList }} -->
        <el-form-item label="入口条件：" prop="entry">
          <div v-for="(item, index) in entryList" :key="index">
            <template v-if="item.delFlag !== 2">
              <div class="create-client-border">
                <template v-if="index === 0">
                  <createClientDialog
                    ref="createClientDialogRef"
                    :options="options"
                    :defaultData="defaultData"
                    :editRow="item"
                  >
                    <!-- :editRow="item.id ? item : undefined" -->
                  </createClientDialog>
                </template>

                <template v-else>
                  <createClientDialog
                    ref="createClientDialogRef"
                    :options="options"
                    :editRow="item"
                  >
                    <!-- :editRow="item.id ? item : undefined" -->
                  </createClientDialog>
                  <i class="el-icon-delete" @click="deleteEntry(index)"></i>
                </template>
              </div>
            </template>
          </div>
          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createClient">新建服务对象筛选</el-button>
          </div>

        </el-form-item>

        <el-form-item label="服务终止条件：" prop="export">

          <div v-for="(item, index) in exportList" :key="index">
            <template v-if="item.delFlag !== 2">
              <div class="create-client-border" >
                <createClientDialog
                  ref="exportClientDialogRef"
                  type="export"
                  :servicerListFilterSelect="servicerListFilterSelect"
                  :options="options"
                  :editRow="item"
                ></createClientDialog>
                <i class="el-icon-delete" @click="deleteExport(index)"></i>
              </div>
            </template>
            <!-- :editRow="item.id ? item : undefined" -->
          </div>

          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createExport">新建服务终止条件</el-button>
          </div>

        </el-form-item>
      </div>

    </el-form>
    <!-- <el-button @click="aaa">获取数据</el-button> -->
  </div>
  </template>
<script>
import { options } from '../utils'
import createClientDialog from '../createClientDialog.vue'

export default {
  inject: ['_this'],
  components: {
    createClientDialog
  },
  props: {
    // 一键投放的
    sceneId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      entryList: [],
      exportList: [],
      options: options,
      // data: generateData(),
      uptmList: [],
      filterMethod (query, item) {
        // return item.label.indexOf(query) > -1
      },
      ruleForm: {
        type: ['影视模型'],
        resource: [], // 维度
        prependName: '',
        appendName: ''
      },
      rules: {
        type: [
          { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        ],
        resource: [
          { type: 'array', required: true, message: '请选择维度', trigger: 'change' }
        ],
        // prependName: [
        //   { required: true, message: '请输入接待员命名', trigger: 'blur' }
        //   // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        appendName: [
          { required: true, message: '请输入接待员命名', trigger: 'blur' }
        ]

      },
      // 写死的传参数据，不要随意更改
      defaultData: {
        rulesJson: {
          condition: 'OR',
          rules: [{
            condition: 'AND',
            rules: [{
              tagId: 12,
              tagKey: 'filmModelTag',
              tagName: '影视模型',
              tagType: 'int',
              dataSource: 20,
              labelType: 0,
              createTime: '2022-12-13T00:00:04',
              operator: '>',
              sourceSign: '',
              value: 1,
              isCommonAttr: true,
              tagCode: '19491001',
              tagCnName: 'tagCnName_coocaa',
              pathName: 'pathName_coocaa'
            }]
          }]
        }
      },
      entryIndex: 0,
      exportIndex: 0

    }
  },
  computed: {
    // 当前场景下的接待员，不用过滤掉所选的，因为这是新建接待员场景
    servicerListFilterSelect () {
      let data = []
      // 批量创建接待员弹窗
      if (this._this.dialogVisible2) {
        data = this._this.servicer

        // 一键投放弹窗
      } else {
        data = []
      }
      return data
    }
  },
  methods: {
    aaa () {
      debugger
      console.log('this--->', this)
      const dialogRefArr = this.$refs.createClientDialogRef

      dialogRefArr.forEach(dialogRef => {
        const rulesJson = dialogRef.rulesJson
        const behaviorRulesJson = dialogRef.behaviorRulesJson
        const flowCondition = dialogRef.flowCondition

        console.log('rulesJson', rulesJson)
        console.log('behaviorRulesJson', behaviorRulesJson)
        console.log('flowCondition', flowCondition)
      })
      // saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit, flowCondition)
    },
    // 新建服务对象筛选
    createClient () {
      this.entryList.push({
        id: '',
        tagIds: '',
        rulesJson: '',
        behaviorRulesJson: '',
        behaviorTempCrowdId: null,
        link: 'OR',
        delFlag: 1,
        entryIndex: this.entryIndex++
      })
    },
    deleteEntry (index) {
      // this.entryList.splice(index, 1)
      this.entryList[index].delFlag = 2
    },
    // 新建服务终止条件：
    createExport () {
      this.exportList.push({
        id: '',
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
    deleteExport (index) {
      this.exportList[index].delFlag = 2
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
    getBatchUptm () {
      // this.$service.getBatchUptm().then(res => {
      //   console.log('维度--》', res)
      //   this.uptmList = res
      // })

      const params = {
        pageNum: 1,
        pageSize: 5000,
        keywords: ''
      }
      this.$service.getUptmTag(params).then(res => {
        this.uptmList = res.row
      })
    }
  },
  created () {
    // 维度列表
    this.getBatchUptm()

    // 一键投放的
    if (this.sceneId) {
      const parmas = {
        sceneId: this.sceneId
      }
      // 获取统一属性详情, 初始化
      this.$service.batchSetLast(parmas).then(res => {
        if (res) {
          const detail = res
          const resource = detail.tagId.split(',').map(item => Number(item))
          this.ruleForm = {
            type: ['影视模型'],
            resource, // 维度
            prependName: detail.namePre,
            appendName: detail.nameSuf
          }

          this.entryList = detail.entry
          this.exportList = detail.export
        } else {
          // 初始化，默认展示一条入口条件 和 一条出口条件
          this.createClient()
          this.createExport()
        }
      })
    } else {
      // 初始化，默认展示一条入口条件 和 一条出口条件
      this.createClient()
      this.createExport()
    }
  }
}
</script>
<style lang="stylus">
@import './index.styl'

</style>
