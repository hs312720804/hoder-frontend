<template>
  <div v-if="tags && tags.length > 0" class="form-class">
      <!-- <div style="color: red">
        第4步
        isDynamicPeople: {{isDynamicPeople}} <br/>
        :policyId:: {{policyId}}<br/>
        :policyName:: {{ policyName }}<br/>
        :crowdId:: {{ crowdId }}<br/>
        {{rulesJson}}
      </div> -->
      <div class="div-class">

        <!-- <template v-for="(item, index) in rulesJson.rules"> -->
          <div class="label-ground">
            <div class="tag-condition--parent">
              <div class="tag-condition">
                <el-button
                  type="warning"
                  @click="handleRulesConditionChange(rulesJson)"
                  round
                  size="small"
                  :key="'button' + '_' + i"
                >
                  {{ rulesJson.condition === 'AND' ? '且' : '或' }}
                </el-button>
              </div>
              <div
                v-for="(childItem, n) in rulesJson.rules"
                :key="'tagId' + n"
                :class="{ 'label-item': true, paddingTop: n > 0 }"
              >

                <span class="txt">{{ childItem.tagName }}</span>

                <span class="sel">
                  <!-- 不是时间（time）类型的下拉框 -->
                  <el-select
                    style="width: 80px"
                    name="oxve"
                    v-model="childItem.operator"
                    class="input-inline"
                    @change="handleOperatorChange(childItem)"
                  >
                    <!-- number 类型 -->
                    <template>
                      <el-option value="="></el-option>
                      <el-option value=">="></el-option>
                      <el-option value="<="></el-option>
                      <el-option value=">"></el-option>
                      <el-option value="<"></el-option>
                    </template>

                  </el-select>

                </span>

                <span class="in">
                  <!-- time 类型 -->

                  <!-- number 类型 -->
                  <el-input-number
                    :key="n + 'input'"
                    v-model="childItem.value"
                    placeholder="请输入内容"
                  ></el-input-number>

                </span>

                <span class="i" @click="handleRemoveRule(n)">
                  <i class="icon iconfont el-icon-cc-delete"></i>
                </span>
              </div>
              <div class="label-add">
                <div class="optional-condition">
                  <el-tag
                    class="oc-item"
                    v-for="tagItem in tags"
                    :key="tagItem.tagItem"
                    @click.native="handleAddChildRule(tagItem)"
                    :type="dataSourceColorEnum[tagItem.dataSource]"
                    >{{ tagItem.tagName }}</el-tag
                  >
                </div>
              </div>
            </div>
          </div>
        <!-- </template> -->
      </div>

      <!-- <div class="label-or">
        <div
          class="optional-condition"
          v-if="tags.length"
          :style="{
            'padding-top': rulesJson.rules.length > 0 ? '10px' : 0,
          }"
        >
          <el-tag
            class="oc-item"
            v-for="item in tags"
            :key="item.tagName"
            @click.native="handleAddRule(item)"
            :type="dataSourceColorEnum[item.dataSource]"
            >{{ item.tagName }}
          </el-tag>
        </div>
      </div> -->
      <div v-if="mode === 'editCrowd'">
        <el-button type="info" @click="$emit('goBackCrowdListPage')">返回</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
      <div v-else>
        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <!-- <el-button type="warning" @click="handleSave(0)">跳过保存</el-button> -->
        <!-- <el-button type="primary" @click="handleSave(1)">下一步</el-button> -->
        <el-button type="primary" @click="handleToNextStep(3)">下一步</el-button>
      </div>
  </div>

</template>

<script>

export default {
  components: {},
  // props: ['recordId', 'tempPolicyAndCrowd', 'routeSource'],
  props: ['isDynamicPeople', 'policyId', 'crowdId', 'mode'],
  data () {
    return {
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      },
      tags: [
      //   {
      //   tagId: 1,
      //   tagKey: 'day',
      //   tagName: '产品包曝光天数',
      //   tagType: 'int',
      // }, {
      //   tagId: 2
        // tagKey: "cout"
        // tagName: "曝光次数"
        // tagType: "int"
      // }
      ],
      rulesJson: {
        condition: 'OR',
        rules: []
      },
      i: 0
    }
  },
  created () {
    // 获取流转条件
    this.$service.getRuleIndicators().then(res => {
      this.tags = res
    })

    if (this.crowdId) {
      this.$service.getDynamicRule({ crowdId: this.crowdId }).then(res => {
        console.log('res===', res)
        if (res) {
          this.rulesJson = JSON.parse(res)
          // this.rulesJson = (res)
          console.log('res===', this.rulesJson)
        } else {
          // 获取流转条件
          this.$service.getRuleIndicators().then(res => {
            res.forEach(item => {
              this.handleAddChildRule(item)
            })
          })
        }
      })
    }
  },
  methods: {

    handleAddChildRule (tag) {
      // if (rule.rules.length > 50) {
      //   this.$message({
      //     type: 'error',
      //     message: '已达最大数量'
      //   })
      //   return
      // }
      // if (tag.tagType === 'string' || tag.tagType === 'collect') {
      //   if (this.cache[tag.tagId] === undefined) {
      //     this.fetchTagSuggestions(tag.tagId)
      //   }
      // } else if (tag.tagType === 'mix') {
      //   if (this.cache[tag.tagId] === undefined) {
      //     this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
      //   }
      // }
      // if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
      //   this.crowd.tagIds.push(tag.tagId)
      // }
      this.rulesJson.rules.push({
        ...tag,
        operator: '>',
        value: ''
      })
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    handleRemoveRule (index) {
      const rulesJson = this.rulesJson
      rulesJson.rules.splice(index, 1)
      // const tagIds = []
      // rulesJson.rules.forEach(e => {
      //   e.rules.forEach(n => {
      //     if (!tagIds.includes(n.tagId)) {
      //       tagIds.push(n.tagId)
      //     }
      //   })
      // })
      // if (this.crowd && this.crowd.rulesJson) this.crowd.tagIds = tagIds

      // if (rule.rules.length === 0) {
      //   rulesJson.rules = rulesJson.rules.filter(function (item) {
      //     return item !== rule
      //   })
      // }
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 3, this.recordId)
    },
    handleToNextStep () {
      const parmas = {
        policyId: this.policyId,
        crowdId: this.crowdId,
        dynamicJson: JSON.stringify(this.rulesJson)
      }
      this.$service.setDynamicRule(parmas).then(res => {
        this.$emit('crowdNextStep', 3, this.recordId)
      })
    },
    // 编辑人群时保存
    save () {
      const parmas = {
        policyId: this.policyId,
        crowdId: this.crowdId,
        dynamicJson: JSON.stringify(this.rulesJson)
      }
      this.$service.setDynamicRule(parmas).then(res => {
        this.$message.success('操作成功')
        this.$emit('goBackCrowdListPage', true)
      })
    },
    resetFormData () {
      this.$emit('resetFormData')
    },
    handleDirectStrategyListBrother () {
      this.$emit('handleDirectStrategyList')
    }
  }
}
</script>

<style scoped  lang="stylus">
.form-class{
  width: 80%;
  margin: 0 auto 20px;
}
.div-class{
  padding: 20px;
  background-color: rgba(249,249,249,0.85);
  margin-bottom 20px
}
.el-collapse_item >>> .el-collapse-item__header {
  padding-left: 10px;
  background-color: rgba(249, 249, 249, 0.85);
}

.el-collapse_item >>> .el-collapse-item {
  display: inline-block;
  width: 100%;
  margin-right: 10px;
}

.el-icon-remove-outline {
  width: 20px;
  height: 20px;
}

.el-collapse {
  border-top: none;
  border-bottom: none;
}

.multipleSelect {
  >>>.el-select {
    width: 100%;
  }
}

.mix-area-select {
  >>>.el-select {
    width: 50%;
  }
}

.label-ground {
  border: 1px dashed #ccc;
  padding: 10px;
  margin: 10px 0;
}

.label-item {
  display: flex;
  position: relative;
}

.paddingTop {
  padding-top: 50px;
}

.label-item .and {
  position: absolute;
  top: 5px;
  left: 260px;
  width: 40px;
  height: 40px;
}

.label-item .txt, .label-item .sel {
  width: 150px;
}

.label-item .txt {
  text-align: right;
}

.label-item .in {
  min-width: 250px;
}

.label-item span, .oc-item {
  margin-right: 10px;
}

.label-add {
  margin-top: 10px;
}

.label-add >>> span {
  cursor: pointer;
}

.label-or >>> span {
  cursor: pointer;
}

i {
  cursor: pointer;
}

.label-item .time-dot-select {
  width: 120px;
}

.label-item .time-dot-input {
  display: inline-block;
  width: 80px;
  margin: 0 7px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}

.pagination {
  float: right;
}

.showMoreTags >>> .el-radio {
  margin: 5px;
}

.label-item .time-dot-select-new {
  width: 90px;
}

.outer-and {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: 0;
  width: 3px;
  height: auto;
  margin: auto 10px;
  border: 1px dashed red;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-item {
  display: flex;
  margin-right: 10px;

  div+div {
    margin-left: 10px;
  }
}

.tag-condition--parent {
  position: relative;
  z-index: 1;
}

.tag-condition {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: -17px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #E6A23C;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-container {
  position: relative;
  z-index: 1;
}

.label-or-space {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 5px;
  left: -40px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #67C23A;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.behavior-label {
  white-space: nowrap;
  overflow-x: auto;
  display: flex
}
.w100 {
  min-width: 100px;
}
.flexColumn {
  display: flex;
  flex-direction: column;
}
.flexRow {
  display: flex;
  flex-direction: row;
}

</style>
