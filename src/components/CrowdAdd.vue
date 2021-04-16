<template>
  <el-collapse class="el-collapse" accordion v-model="activeName">
    <el-form-item label="人群条件" class="el-collapse_item">
      <template v-for="(crowd, i) in inputValue">
        <div class="items" :key="i">
          <el-collapse-item :name="i" :key="i" class="crowd-content">
            <template slot="title">
              <div class="collapse-title">
                <div>{{crowd.crowdName}}</div>
                <div><el-button @click="handleEstimate(crowd)">估算</el-button></div>
              </div>
              <div class="collapse-title" style="justify-content: center" v-if="crowd.total0 != undefined">
                <div>圈定设备数量：{{crowd.total0}} <span class="count-tips">（当人群条件有变化，请重新点击估算）</span></div>
              </div>
            </template>
            <el-form-item label="人群名称" :prop="formProp(i +'.crowdName')" :rules="rules.crowdName">
              <el-input v-model="crowd.crowdName" placeholder="投放名称"></el-input>
            </el-form-item>
            <div style="position: relative">
            <el-form-item label="设置标签" required>
              <MultipleSelect :tags="tags" :rulesJson="crowd.rulesJson" :crowd="crowd" :i="i"></MultipleSelect>
            </el-form-item>

            <div class="outer-and" v-if="specialTags.length > 0">
              <el-button
                      type="danger"
                      v-if="(specialTags.length > 0 && tags.length > 0) && crowd.dynamicPolicyJson"
                      @click="handleConditionChange(crowd)"
                      round
                      :key="i+'condition'"
              >{{crowd.dynamicPolicyJson.link === 'OR' ? '或' : '且'}}</el-button>
            </div>

            <el-form-item label="动态因子" v-if="specialTags.length > 0">
              <MultipleSelect :specialTags="specialTags" :dynamicPolicyJson="crowd.dynamicPolicyJson" :crowd="crowd" :i="i"></MultipleSelect>
            </el-form-item>

            <!-- <el-form-item label="用户行为满足" v-if="specialTags.length > 0">
              <MUserAction :specialTags="specialTags" :dynamicPolicyJson="crowd.dynamicPolicyJson" :crowd="crowd" :i="i"></MUserAction>
            </el-form-item> -->
            
            </div>
            <el-form-item label="是否限制投放数量" prop="limitLaunch">
              <el-radio-group v-model="crowd.limitLaunch">
                <el-radio  :label="false">否</el-radio>
                <el-radio  :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="投放数量" prop="limitLaunchCount" v-if="crowd.limitLaunch">
              <el-input-number size="medium" placeholder="不能大于100万" :max="1000000" :min="1" v-model="crowd.limitLaunchCount"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" :prop="formProp('remark')">
              <el-input v-model="crowd.remark" placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item label="优先级" :prop="formProp(i +'.crowdOrder')" :rules="rules.noEmpty">
              <el-input-number v-model="crowd.crowdOrder" @change="changeSeq(i)" :precision="0"></el-input-number>
            </el-form-item>
          </el-collapse-item>
          <a class="app-params__remove-param" @click="handleRemoveParam(i)">
            <i v-show="i > 0" class="icon iconfont el-icon-cc-delete"></i>
          </a>
        </div>
      </template>
      <br />
      <el-button type="primary" plain @click="handleAddParam">
        <i class="el-icon-plus"></i>&nbsp;添加
      </el-button>
    </el-form-item>
    
  </el-collapse>
</template>

<script>
import MultipleSelect from './MultipleSelect.vue'
// import MUserAction from './MUserAction.vue'
export default {
  components: {
    MultipleSelect
    // MUserAction
  },
  data () {
    // function validateKV (rule, value, cb) {
    //   if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
    //     cb(new Error('请勿输入特殊或空白字符'))
    //   } else {
    //     cb()
    //   }
    // }
    return {
      tags: [],
      specialTags: [],
      cache: {},
      tagSelectMoreShow: false,
      showMoreTags: false,
      tagsListTotal: 0,
      formInline: {
        attrName: ''
      },
      tagList: [],
      checkboxValue: '',
      currentChildItem: '',
      suggestions: {},
      suggestionsNew: [],
      priority: '',
      initPageSize: 200,
      initCurrentPage: 1,
      activeName: 0,
      inputValue: [],
      rules: {
        noEmpty: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        limitLaunchCount: [
          { required: true, message: '请输入大于0小于100万的限制数量', trigger: 'blur' }
        ]
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorEnum: {
          1: 'success',
          2: 'danger',
          3: '',
          5: 'warning',
          6: 'warningOrange',
          7: 'warningOrange2'
      },
      cityData: [],
      provinceValueList: []
    }
  },
  props: ['value', 'propPrefix', 'recordId'],
  watch: {
    value: 'setInputValue'
  },
  methods: {
    handleCurrentChange (index) {
      this.initCurrentPage = index
      this.$service.getTagAttr({ tagId: this.currentChildItem.tagId, pageSize: this.initPageSize, pageNum: index }).then(data => {
        this.tagList = data.pageInfo.list
      })
    },
    changeSeq () {
      this.inputValue.sort(function (x, y) {
        return x.crowdOrder - y.crowdOrder
      })
      this.setSeq()
    },
    formProp (key) {
      return (this.propPrefix || '') + key
    },
    setInputValue (val) {
      if (val !== this.inputValue) {
          if (val.length > 0) {
              this.inputValue = val
              this.setSeq()
          }else {
              if (this.inputValue.length > 0) {
                  return
              }
              this.inputValue.push(
                  {
                      'recordId': this.getRecordId(),
                      'tempCrowdId': undefined,
                      'crowdName': undefined,
                      'tagIds': [],
                      'purpose': undefined,
                      'remark': undefined,
                      'crowdOrder': length + 1,
                      'rulesJson': {
                          condition: 'OR',
                          rules: []
                      },
                      'dynamicPolicyJson': {
                          link: 'AND',
                          condition: 'AND',
                          rules: []
                      },
                      'limitLaunch': false,
                      'limitLaunchCount': undefined,
                      total0: undefined
                  }
              )
              this.setSeq()
          }
      }
    },
    emitInputValue () {
      this.$emit('input', this.inputValue)
    },
    handleAddParam () {
      const length = this.inputValue.length
      this.activeName = length
      if (length >= 5) {
        this.$message({
          type: 'error',
          message: '最多添加5个'
        })
        return
      }
      this.inputValue.push(
        {
          'recordId': this.getRecordId(),
          'tempCrowdId': undefined,
          'crowdName': undefined,
          'tagIds': [],
          'purpose': undefined,
          'remark': undefined,
          'crowdOrder': length + 1,
          'rulesJson': {
            condition: 'OR',
            rules: []
          },
          'dynamicPolicyJson': {
              link: 'AND',
              condition: 'OR',
              rules: []
          },
          'limitLaunch': false,
          'limitLaunchCount': undefined,
          total0: undefined
        }
      )
      this.setSeq()
    },
    getRecordId () {
      return this.recordId
    },
    setSeq () {
      let inputValue = JSON.parse(JSON.stringify(this.inputValue))
      this.inputValue = inputValue.map((e, index) => {
        e.crowdOrder = index + 1
        return e
      })
    },
    handleRemoveParam (index) {
      this.inputValue.splice(index, 1)
      this.setSeq()
    },
    handleEstimate(formData) {
        this.$service.estimateTemp(formData.rulesJson).then((data)=> {
            if (data || data === 0) {
                this.$set(formData,'total0',data)
            }
        })
    },
    handleConditionChange (crowd) {
        crowd.dynamicPolicyJson.link = crowd.dynamicPolicyJson.link === 'AND' ? 'OR' : 'AND'
    },
   
  },
  created () {
    if (this.value) {
        this.$service.tagInfoNew(this.recordId).then(data => {
            // this.tags = data
            // console.log(data)
            const normalTags = []
            const specialTags = []
            data.forEach(item => {
                if (item.dataSource === 6) {
                    specialTags.push(item)
                } else {
                    normalTags.push(item)
                }
            })
            this.tags = normalTags
            this.specialTags = specialTags
            this.setInputValue(this.value)
        })
    }
    this.$watch('inputValue', this.emitInputValue, {
      deep: true
    })
  }
}
</script>
<style scoped  lang="stylus">
.el-collapse_item >>> .el-collapse-item__header
  padding-left 10px
  background-color rgba(249, 249, 249, 0.85)
.el-collapse_item >>> .el-collapse-item
  display inline-block
  width 100%
  margin-right 10px
.el-icon-remove-outline
  width 20px
  height 20px
.app-params__remove-param
  display inline-block
  cursor pointer
  width 26px
  height 26px
  line-height 26px
  text-align center
  color #999
  margin-left 5px
.items
  display flex
  align-items center
  >>> .el-form-item
    margin-bottom 20px
  >>>.el-collapse-item__wrap
    background-color rgba(249, 249, 249, 0.85)
    padding 10px
    border none
.el-collapse
  border-top none
  border-bottom none
.title
  font-size 18px
  margin-bottom 30px
.footer
  display flex
  justify-content flex-end
i
  cursor pointer
.el-date-editor.el-input, .el-date-editor.el-input__inner
  width 100%
.pagination
  float right
.showMoreTags >>> .el-radio
  margin 5px
.items >>> .collapse-title
  width 50%
  display flex
  justify-content space-between
.items >>> .count-tips
  color red
  font-size 12px
.outer-and
  position absolute
  top 10px
  right 0
  bottom 3px
  left 0
  width 3px
  height auto
  margin auto 10px
  border 1px dashed red
  border-right 0
  z-index 999
  display flex
  align-items center
  justify-content center
.el-collapse
  >>> .el-tag--warningOrange
    color #512DA8
    background-color rgba(119, 81, 200, .4)
    border-color rgba(81, 45, 168, .45)
    .el-tag__close
      color #512DA8
  >>> .el-tag--warningOrange2
    color: #795548;
    background-color: rgba(167, 130, 117, .5);
    border-color: #7955488c;
    .el-tag__close
      color #512DA8

</style>
