<template>
  <div class="one-step-select-tag">

    <!-- <el-input
        v-model="searchForm.policyName"
        placeholder="支持按策略、人群、创建人、部门搜索"
        @keyup.enter.native="handleSearch"
        clearable
        style="width: 350px"
      >
      <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
    </el-input> -->
    <div class="search-all-input">
      <el-input v-model="searchAllVal" clearable placeholder="支持按标签名、Code、描述全局搜索" @keyup.enter.native="handleSearch" style="width: 350px">
        <el-button type="primary" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <el-button plain @click="handleReset" style="margin-left: 10px" >
        重置
      </el-button>
    </div>

    <!-- 全局搜索 -->
    <div class="other-form" v-if="!!filter.tagName">
      <tag-list
        :data-list="dataList"
        :data-source-enum="dataSourceEnum"
        :type-enum="typeEnum"
        :loading="loading"
        :check-list-parent="checkList"
        :show-selection="showSelection"
        @change-checkList="handleCheckListChange"
        @table-selected="handleGetTableSelectedData"
        :current-selected-tags="tagList">
      </tag-list>

      <el-pagination
        class="pagination"
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>

    <!-- 分类 -->
    <el-tabs v-else v-model="activeName" @tab-click="handleTabChange" style="padding-top: 15px;">
      <el-tab-pane label="我常用的" name="myTop">
        <MyTopMax30 :tagName="myCollectTagName" :checkList="checkList" :show-selection="showSelection"
          :currentSelectTag="tagList" @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </MyTopMax30>
      </el-tab-pane>

      <el-tab-pane label="大数据标签" name="bigDataTag">
        <BigDataTag :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </BigDataTag>
      </el-tab-pane>

      <el-tab-pane label="第三方标签" name="third">
        <third-party-tag :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </third-party-tag>
      </el-tab-pane>

      <el-tab-pane label="自定义标签" name="customTag">
        <custom-tag :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </custom-tag>
      </el-tab-pane>
      <el-tab-pane label="人群标签" name="crowdLabel">
        <CrowdLabel
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          :checkList="tempCheckList"
          :crowdType=2
          @get-table-selected="handleGetTableSelectedData"
          @change-checkList="handleCheckListChange"
        >
        </CrowdLabel>
      </el-tab-pane>
      <el-tab-pane label="算法标签" name="aiLabel">
        <AILabel
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          :checkList="tempCheckList"
          :crowdType=2
          @get-table-selected="handleGetTableSelectedData"
          @change-checkList="handleCheckListChange"
        >
        </AILabel>
      </el-tab-pane>

    </el-tabs>

    <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" class="fix-bottom-form">
      <el-form-item label="已选标签">
        <el-tag v-for="(item, index) in tagList" :key="item.tagId + '_' + index"
          :type="dataSourceColorEnum[item.dataSource]" closable @close="removeTag(item)">
          {{ item.tagName }}
        </el-tag>
      </el-form-item>
      <div class="tags-tips">
        注：<span class="checkbox--red">红色</span>为大数据标签,
        <span class="checkbox--green">绿色</span>为自定义/本地标签,
        <span class="checkbox--blue">蓝色</span>为账号标签,
        <span class="checkbox--yellow">黄色</span>为实时标签,
        <span class="checkbox--orange">紫色</span>为动态指标,
        <span class="checkbox--orange2">棕色</span>为组合标签,
        <span class="checkbox--cyan">青色</span>为行为标签,
        <span class="checkbox--gray">灰色</span>为人群标签,
        <span class="checkbox--pink">粉色</span>为实时标签[大数据],
        <span class="checkbox--gradient">渐变色</span>为营销研发标签
      </div>
      <el-form-item v-if="pageType === 'common'" label="策略名称" prop="policyName">
        <el-input size="small" v-model="addForm.policyName" style="width: 30%"></el-input>
        <slot name="isChoosePeople"></slot>
      </el-form-item>
      <el-form-item v-if="pageType === 'common'">
        <el-button type="warning" @click="handelBack">返回</el-button>
        <el-button type="warning" @click="saveAndNext(0)">跳过下一步保存</el-button>
        <el-button type="primary" @click="saveAndNext(1)">下一步</el-button>
      </el-form-item>
      <el-form-item v-if="pageType === 'specialTag'">
        <el-button type="warning" @click="specialHandelBack">返回</el-button>
        <el-button type="primary" @click="specialTagSaveAndNext">下一步</el-button>
      </el-form-item>
      <el-form-item v-if="pageType === 'refinePeopleTag'">
        <el-button type="warning" @click="refinePeopleTagHandelBack">返回</el-button>
        <el-button type="primary" @click="refinePeopleTagSaveAndNext">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 组合标签场景下 -->
    <el-dialog
      title="同一组合标签只能选择以下两种组合之一："
      :visible.sync="Successdialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <div style="margin: 10px 0">
        组合一：<span class="checkbox--red">大数据标签</span>、<span class="checkbox--cyan">行为标签</span>
      </div>
      <div>
        组合二：<span class="checkbox--red">大数据标签</span>、<span class="checkbox--blue">账号标签</span>、<span class="checkbox--green">临时标签/自定义标签</span>、<span class="checkbox--yellow">实时标签</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handelClose" type="primary" :disabled="isDisabled">知道了 {{Sencond}}s</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Total from './Total.vue'
import BigDataTag from './bigDataTag/Index.vue'
import ThirdPartyTag from './thirdTag/Index.vue'
import CustomTag from './customTag/Index.vue'
import CrowdLabel from './crowdLabel/Index.vue'
import AILabel from './AILabel/Index.vue'
import { dataSourceColorEnum } from '@/utils/tags.js'
import MyTopMax30 from './MyTopMax30'
import tagList from './coms/TagList'

export default {
  name: 'crowdCompute',
  components: {
    // Total,
    BigDataTag,
    ThirdPartyTag,
    CustomTag,
    MyTopMax30,
    tagList,
    CrowdLabel,
    AILabel
  },
  props: {
    recordId: {
      type: [Number, String],
      default: ''
    },
    initTagList: {
      type: [Array, Object],
      default: () => []
    },
    policyId: {
      type: [Number, String],
      default: ''
    },
    pageType: {
      type: [Number, String],
      default: 'common'
    }
  },
  computed: {
    ...mapGetters(['policyName']),
    dataSourceColorEnum () {
      return dataSourceColorEnum
    }
  },
  data () {
    return {
      // 组合标签场景下
      // 0 - 组合一：大数据标签、行为标签
      // 1 - 组合二：大数据标签、账号标签、临时标签/自定义标签、实时标签
      // 2 - 无限制
      //  (红:2、青:8)  （红:2  蓝:3  绿:1  黄:5)
      // 不包含 动态因子（ 紫色:6 ）
      uniteType: 2,
      Successdialog: false, // 控制弹出
      Sencond: 5, // 设置初始倒计时
      isDisabled: false,
      interval: '',
      // ------------
      dataList: [],
      filter: {
        // pageNum: 1,
        // pageSize: 10,
        groupId: undefined,
        tagName: undefined
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dataSourceEnum: {},
      typeEnum: {},
      loading: true,
      searchAllVal: '', // 全局搜素

      searchVal: '',
      activeName: 'myTop',
      labelZoneTagName: undefined,
      myCollectTagName: undefined,
      checkList: [],
      tagList: [],
      // dataSourceColorEnum: {
      //   1: 'success',
      //   2: 'danger',
      //   3: '',
      //   5: 'warning',
      //   6: 'warningOrange',
      //   7: 'warningOrange2',
      //   8: 'warningCyan',
      //   11: 'success',
      //   12: 'gray'
      // },
      showSelection: true,
      addForm: this.genDefaultForm(),
      addFormRules: {
        policyName: [
          { required: true, message: '请填写策略名称', trigger: 'blur' }
        ]
      },
      tempCheckList: [],
      bottomHeight: 169 + 'px'
    }
  },
  watch: {
    initTagList: {
      handler (val) {
        // 编辑组合标签回显
        if (this.pageType === 'specialTag') {
          this.tagList = val
          // this.addForm.crowdTagCrowdIds = [] // 人群标签
          // this.addForm.conditionTagIds = [] // 其他

          // val.forEach(item => {
          //   if (item.dataSource === 12) {
          //   // 人群标签 id 集合
          //     this.addForm.crowdTagCrowdIds.push(item.tagId)
          //   } else {
          //   // 其他的标签 id 集合
          //     this.addForm.conditionTagIds.push(item.tagId)
          //   }
          // })
        }
      },
      immediate: true
    },
    tagList: {
      handler (val) {
        this.addForm.crowdTagCrowdIds = [] // 人群标签
        this.addForm.conditionTagIds = [] // 其他

        val.forEach(item => {
          if (item.dataSource === 12) {
            // 人群标签 id 集合
            this.addForm.crowdTagCrowdIds.push(item.tagId)
          } else {
            // 其他的标签 id 集合
            this.addForm.conditionTagIds.push(item.tagId)
          }
        })
      }
    }
  },
  methods: {
    getSencond () {
      this.Sencond = 5
      const that = this
      window.clearInterval(this.interval)
      this.interval = window.setInterval(function () {
        --that.Sencond
        if (that.Sencond === 0) {
          that.isDisabled = false
          that.handelClose()// 倒计时结束时运行的业务逻辑，这里的是关闭当前页面
        }
      }, 1000)
    },
    handelClose () {
      this.Successdialog = false
    },
    handleReset () {
      this.searchAllVal = ''
      this.handleSearch()
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.handleSearch()
    },
    handleSearch () {
      const val = this.searchAllVal
      this.filter.tagName = val

      const filter = {
        ...this.filter,
        ...this.pagination,
        groupId: 0
      }

      this.$service.getTagGroupTreeList(filter).then((data) => {
        const list = data.pageInfo.list
        this.dataList = []
        if (list.length > 0) {
          this.dataList = list.map(item => {
            return {
              ...item,
              dataSource: item.dataSource === 12 ? 12.2 : item.dataSource
            }
          })
        }
        this.dataSourceEnum = data.lableDataSourceEnum
        this.typeEnum = data.tagsTypeEnum
        this.loading = false
        this.pagination.total = data.pageInfo.total
      })
    },

    // 一键投放 下一步
    saveAndNext (mode) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          const addForm = JSON.parse(JSON.stringify(this.addForm))
          if (addForm.conditionTagIds.length === 0) { // 创建策略时，标签不是必选的，因此下面两行代码注释掉
            // this.$message.error('请选择策略维度！')
            // return
          }

          // 是否为动态人群
          const isDynamicPeople = this.$parent.isDynamicPeople
          // 其他的标签 id 集合
          addForm.conditionTagIds = addForm.conditionTagIds.join(',')

          // 人群标签 id 集合
          addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.join(',')

          // 动态人群
          if (isDynamicPeople) {
            const oldFormData = {
              policyName: addForm.policyName,
              conditionTagIds: addForm.conditionTagIds,
              crowdTagCrowdIds: addForm.crowdTagCrowdIds,
              smart: isDynamicPeople
            }
            if (this.policyId) {
              oldFormData.policyId = this.policyId
              this.$service.policyUpate(oldFormData).then((data) => {
                const policyId = this.policyId
                const policyName = oldFormData.policyName

                if (mode === 1) {
                  this.$emit('dynamicPolicyNextStep', this.tagList, policyId, policyName)
                } else {
                  this.$message({
                    type: 'success',
                    message: '即将自动跳转至策略列表页'
                  })
                  this.$emit('handleDirectStrategyList')
                }
                // }
              })
            } else {
              this.$service.policyAddSave(oldFormData).then((data) => {
                const policyId = data.policyId
                const policyName = data.policyName

                if (mode === 1) {
                  this.$emit('dynamicPolicyNextStep', this.tagList, policyId, policyName)
                } else {
                  this.$message({
                    type: 'success',
                    message: '即将自动跳转至策略列表页'
                  })
                  this.$emit('handleDirectStrategyList')
                }
                // }
              })
            }
          } else if (mode === 1) {
            if (this.addForm.recordId) {
              this.$service.oneDropPolicyAddSave(addForm).then((data) => {
                if (data.policyId) {
                  this.$confirm('保存失败，该策略维度已存在！请在策略' + data.policyId + '中新建人群即可', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '即将自动跳转至策略列表页'
                    })
                    this.$emit('handleDirectStrategyList')
                    // this.$router.push({ path: 'launch/strategyList' })
                  }).catch(() => {
                  })
                } else {
                  this.$emit('policyNextStep', this.addForm.recordId, this.tagList)
                }
              })
            } else {
              this.$service.oneDropPolicyAddSave(addForm).then((data) => {
                this.addForm.recordId = data.recordId
                this.$emit('policyNextStep', this.addForm.recordId, this.tagList)
              })
            }
          } else {
            const oldFormData = {
              policyName: addForm.policyName,
              conditionTagIds: addForm.conditionTagIds,
              crowdTagCrowdIds: addForm.crowdTagCrowdIds // 人群标签
            }
            this.$service.policyAddSave(oldFormData).then((data) => {
              this.$emit('handleDirectStrategyList')
              this.$emit('resetFormData')
            })
          }
        } else {
          return false
        }
      })
    },
    // 精细化人群 返回
    refinePeopleTagHandelBack () {
      this.$emit('back')
    },
    //  精细化人群 保存
    refinePeopleTagSaveAndNext () {
      const addForm = JSON.parse(JSON.stringify(this.addForm))

      if (addForm.conditionTagIds.length === 0) {
        this.$message.error('请选择策略维度！')
        return
      }

      // 其他的标签 id 集合
      addForm.conditionTagIds = addForm.conditionTagIds.join(',')

      // 人群标签 id 集合
      addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.join(',')

      const tagIds = addForm.conditionTagIds

      // this.$service.saveSpecialTag({ tagIds }).then((data) => {
      this.$emit('policyNextStep', addForm)
      // })
    },
    // 组合标签 返回
    specialHandelBack () {
      this.$router.push({
        path: 'labelSquare'
      })
    },
    // 组合标签 下一步
    specialTagSaveAndNext () {
      // debugger
      // const conditionTagIds =
      //   this.tagList.map(function (v) {
      //     return parseInt(v.tagId)
      //   }) || []
      // this.addForm = {
      //   conditionTagIds
      // }
      const addForm = JSON.parse(JSON.stringify(this.addForm))

      if (addForm.conditionTagIds.length === 0) {
        this.$message.error('请选择策略维度！')
        return
      }

      // 其他的标签 id 集合
      addForm.conditionTagIds = addForm.conditionTagIds.join(',')

      // 人群标签 id 集合
      addForm.crowdTagCrowdIds = addForm.crowdTagCrowdIds.join(',')

      const tagIds = addForm.conditionTagIds

      this.$service.saveSpecialTag({ tagIds }).then((data) => {
        this.$emit('policyNextStep', data)
      })
    },
    // 返回策略列表
    handelBack () {
      this.$router.push({ name: 'strategyList' })
    },
    genDefaultForm () {
      return {
        recordId: undefined,
        policyName: '',
        conditionTagIds: [],
        crowdTagCrowdIds: [] // 人群标签的 crowdId 集合
      }
    },
    fetchCheckListData () {
      this.$service.getListDimension({ type: 4 }).then(data => {
        if (data) {
          if (data.behaviorShow) {
            this.checkList = data.behaviorShow.split(',')
          } else {
            this.checkList = ['defineRemark']
          }
        } else {
          this.checkList = ['defineRemark']
        }
      })
    },
    fetchTempCheckListData () {
      this.$service.getListDimension({ type: 5 }).then(data => {
        if (data) {
          if (data.behaviorShow) {
            this.tempCheckList = data.behaviorShow.split(',')
          } else {
            this.tempCheckList = ['defineRemark']
          }
        } else {
          this.tempCheckList = ['defineRemark']
        }
      })
    },
    handleTabChange () {
      switch (this.activeName) {
        case 'myTop':
          // 我常用的
          // this.fetchCheckListData()
          this.$root.$emit('my-top-list-refresh')
          break
        case 'bigDataTag':
          // 刷新大数据
          // this.fetchCheckListData()
          this.$root.$emit('big-data-list-refresh')
          break
        case 'third':
          // 刷新第三方
          // this.fetchCheckListData()
          this.$root.$emit('third-list-refresh')
          break
        case 'customTag':
          // 自定义
          // this.fetchTempCheckListData()
          this.$root.$emit('custom-tag-list-refresh')
          break
      }
    },
    handleClearSearch () {
      this.searchVal = undefined
      this.labelZoneTagName = undefined
      this.myCollectTagName = undefined
    },
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 4, behaviorShow: val.join(',') })
    },

    removeTag (tag) {
      // const addForm = this.addForm
      // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
    },
    getUniteType () {
      const val = this.tagList
      if (val.every(item => item.dataSource === 2)) {
        this.uniteType = 2
      } else if (val.every(item => [2, 8].indexOf(item.dataSource) > -1)) {
        this.uniteType = 0
      } else {
        this.uniteType = 1
      }
    },
    handleGetTableSelectedData (val, mode) {
      // 更新 UniteType，因为新增或编辑组合标签有互斥的交互
      if (this.pageType === 'specialTag') {
        this.getUniteType()
      }
      // 只支持单数组，多数组要多次调用这个
      const tagList = this.tagList
      if (mode === 'add') {
        // 如果有匹配的，就直接return
        let firstIndex = -1
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i].tagId === val.tagId) {
            firstIndex = i
            return
          }
        }
        // 如果没有匹配的，就执行新增
        if (firstIndex === -1) {
          this.tagList.push(val)

          // 新增或编辑组合标签有互斥的交互
          if (this.pageType === 'specialTag') {
            // 判断是否与其他标签类型冲突，若有冲突就删除该标签
            if (this.uniteType === 0 && [2, 8].indexOf(val.dataSource) === -1) {
              this.tagList.pop() // 删除前面 push 添加的
              this.Successdialog = true
              this.getSencond()
            } else if (this.uniteType === 1 && [2, 3, 1, 5].indexOf(val.dataSource) === -1) {
              this.tagList.pop() // 删除前面 push 添加的
              this.Successdialog = true
              this.getSencond()
            }
          }
        }
      } else {
        // 取消选中的则删除这一项
        let index = -1
        for (let i = 0; i < tagList.length; i++) {
          if (tagList[i].tagId === val.tagId) {
            index = i
            this.tagList.splice(index, 1)
            return
          }
        }
      }
    },
    getPolicyDetail () {
      this.$service.oneDropGetPolicyDetail(this.recordId).then((data) => {
        const formData = data
        formData.conditionTagIds = formData.conditionTagIds === ''
          ? []
          : formData.conditionTagIds.split(',').map(function (v) {
            return parseInt(v)
          })

        // 人群标签ID
        formData.crowdTagCrowdIds = formData.crowdTagCrowdIds
          ? formData.crowdTagCrowdIds.split(',').map(function (v) {
            return parseInt(v)
          })
          : []

        this.addForm = {
          recordId: this.recordId,
          policyName: formData.policyName,
          conditionTagIds: formData.conditionTagIds,
          crowdTagCrowdIds: formData.crowdTagCrowdIds
        }
      })
    }
  },
  created () {
    this.fetchCheckListData()
    this.fetchTempCheckListData()
    if (this.recordId) {
      this.getPolicyDetail()
      this.tagList = this.initTagList
    }
    // this.pageType === 'specialTag'  编辑组合标签回显
    if (this.policyId || this.pageType === 'specialTag') {
      this.tagList = this.initTagList
      // console.log('this.addForm-->', this.addForm)
      // console.log('this.initTagList-->', this.initTagList)
      this.addForm.policyName = this.policyName
      this.addForm.conditionTagIds = []
      this.addForm.crowdTagCrowdIds = []
      this.initTagList.forEach((v) => {
        if (v.dataSource === 12) {
          this.addForm.crowdTagCrowdIds.push(parseInt(v.tagId)) // 人群标签
        } else {
          this.addForm.conditionTagIds.push(parseInt(v.tagId))
        }
      })

      this.addForm.policyId = this.policyName
    }
  }
}
</script>

<style lang="stylus" scoped>
.one-step-select-tag
  position relative
  padding 0 130px 180px
  @import '~@/assets/tag.styl'
.tags-tips
  color #000
  font-size 12px
  margin-left 100px

.fix-bottom-form
  position fixed
  bottom 0
  background-color #fff
  z-index 999
  width: calc(100% - 363px);
  height: 185px;
  overflow: auto;
.search-all-input
  position: absolute;
  right: 0;
  z-index: 9;
  padding: 10px 0;
.pagination
  padding: 10px 0;
  text-align: right;
.other-form
  padding-top: 55px;
</style>
