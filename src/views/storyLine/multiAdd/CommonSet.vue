<template>
  <!-- 批量设置接待员 -->
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
      <div class="div-class">

        <el-form-item label="选择标签：" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="影视模型" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择维度：" prop="resource">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="搜索接待员"
            :titles="['待选维度', '已选维度']"
            v-model="ruleForm.resource"
            :data="data">
          </el-transfer>
        </el-form-item>
        <el-form-item label="接待员命名：" prop="prependName">
          <el-input v-model="ruleForm.prependName" style="width: 200px"></el-input>
          <span class="red-tip">所选维度</span>
          <el-input v-model="ruleForm.appendName" clearable style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="服务对象选择：" prop="entry">
          <div class="create-client-border" v-for="(item, index) in entryList" :key="index">
            <template v-if="index === 0">

              <createClientDialog
                ref="createClientDialogRef"
                :options="options"
                :defaultData="defaultData">
              </createClientDialog>
            </template>

            <template v-else>
              <createClientDialog
                ref="createClientDialogRef"
                :options="options">
              </createClientDialog>
              <i class="el-icon-delete" @click="deleteEntry(index)"></i>
            </template>
          </div>
          <div class="box-fotter addRule">
            <el-button type="primary" icon="el-icon-plus" @click="createClient">新建服务对象筛选</el-button>
          </div>

        </el-form-item>

        <el-form-item label="服务终止条件：" prop="export">

          <div class="create-client-border" v-for="(item, index) in exportList" :key="index">
            <createClientDialog
              ref="exportClientDialogRef"
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
      </div>

    </el-form>
    <el-button @click="aaa">获取数据</el-button>
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
    const generateData = _ => {
      const data = []
      const list = ['剧情', '都市', '武侠', '科幻', '言情', '悬疑', '警匪']
      list.forEach((city, index) => {
        data.push({
          label: city,
          key: index
        })
      })
      return data
    }
    return {
      entryList: [{ id: 1 }],
      exportList: [{ id: 1 }],
      servicerListFilterSelect: [],
      options: options,
      data: generateData(),
      filterMethod (query, item) {
        return item.label.indexOf(query) > -1
      },
      ruleForm: {
        type: ['影视模型'],
        resource: ['剧情', '都市'], // 维度
        prependName: '测试批量创建',
        appendName: ''
      },
      rules: {
        type: [
          { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        ],
        resource: [
          { type: 'array', required: true, message: '请选择维度', trigger: 'change' }
        ],
        prependName: [
          { required: true, message: '请输入接待员命名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        appendName: [
          { required: true, message: '请输入接待员命名', trigger: 'blur' }
        ]

      },
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
              tagCode: '',
              isCommonAttr: true
            }]
          }]
        }
      }

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
    }
  }
}
</script>
<style lang="stylus">
@import './index.styl'

</style>
