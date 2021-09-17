<template>
  <div class="label-content">
    <div class="table-list" :style="{ marginBottom: bottomHeight }">
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="临时人群/标签" name="tempLabel">
          <temp-label-index
            :currentSelectTag="tagList"
            :show-selection="showSelection"
            :checkList="tempCheckList"
            @get-table-selected="handleGetTableSelectedData"
            @change-checkList="handleTempCheckListChange"
            @fetch-checkList="fetchTempCheckListData"
          >
          </temp-label-index>
        </el-tab-pane>
        <el-tab-pane label="标签专区" name="labelZone">
          <label-zone
            :currentSelectTag="tagList"
            :tagName="labelZoneTagName"
            @clear-search="handleClearSearch"
            :checkList="checkList"
            @change-checkList="handleCheckListChange"
            @fetch-checkList="fetchCheckListData"
            @get-table-selected="handleGetTableSelectedData"
            :show-selection="showSelection"
          >
          </label-zone>
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="myCollect">
          <my-collect
            :currentSelectTag="tagList"
            :tagName="myCollectTagName"
            :checkList="checkList"
            @clear-search="handleClearSearch"
            @change-checkList="handleCheckListChange"
            @get-table-selected="handleGetTableSelectedData"
            :show-selection="showSelection"
          >
          </my-collect>
        </el-tab-pane>
        <el-tab-pane label="本地人群/标签" name="localLabel">
          <local-label-index
            :currentSelectTag="tagList"
            :show-selection="showSelection"
            :checkList="tempCheckList"
            @get-table-selected="handleGetTableSelectedData"
            @change-checkList="handleTempCheckListChange"
            @fetch-checkList="fetchTempCheckListData"
          >
          </local-label-index>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="search-input"
      v-if="activeName === 'labelZone' || activeName === 'myCollect'"
    >
      <el-input
        v-model="searchVal"
        placeholder="支持按标签名、Code、描述搜索"
        @keyup.enter.native="handleSearch"
      >
      </el-input>

      <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
    </div>
    <el-form
      :model="addForm"
      ref="addForm"
      label-width="100px"
      class="fix-bottom-form"
    >
      <el-form-item label="已选标签">
        <!-- {{initTagList}} -->
        <!-- 编辑状态不允许删除标签 -->
        <el-tag
          v-for="(item, index) in tagList"
          :key="item.tagId + '_' + index"
          :type="dataSourceColorEnum[item.dataSource]"
          :closable="mode !== 'edit'"
          @close="removeTag(item)"
        >
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
        <span class="checkbox--cyan">青色</span>为行为标签
      </div>
      <!-- <el-form-item label="策略名称" prop="policyName">
        <el-input size="small" v-model="addForm.policyName" style="width: 30%"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="warning" @click="back">返回</el-button>
        <el-button type="primary" @click="saveAndNext(1)">下一步</el-button>
      </el-form-item>
    </el-form>
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
import labelZone from '../LabelSquare/LabelZone'
import myCollect from '../LabelSquare/MyCollect'
import tempLabelIndex from '../LabelSquare/tempLabel/TempLabelIndex'
import LocalLabelIndex from '../LabelSquare/localLabel/Index'
export default {
  name: 'labelSquareAA',
  components: {
    labelZone,
    myCollect,
    tempLabelIndex,
    LocalLabelIndex
  },
  props: ['mode', 'initTagList', 'usedTagList'],
  data () {
    return {
      activeName: 'labelZone',
      searchVal: '',
      labelZoneTagName: undefined,
      myCollectTagName: undefined,
      checkList: [],
      tagList: [],
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      },
      showSelection: true,
      addForm: this.genDefaultForm(),
      tempCheckList: [],
      bottomHeight: 169 + 'px',
      // 0 - 组合一：大数据标签、行为标签           // 1 - 组合二：大数据标签、账号标签、临时标签/自定义标签、实时标签          // 2 - 无限制
      //              红 - 2    青 - 8                            红 - 2    蓝 - 3       绿 - 1          黄 - 5
      // 不包含 动态因子（ 紫色 - 6 ）
      uniteType: 2,
      Successdialog: false, // 控制弹出
      Sencond: 5, // 设置初始倒计时
      isDisabled: false,
      interval: ''
    }
  },

  inject: ['sTagIndex'],
  watch: {
    initTagList: {
      handler: function (val) {
        // debugger
        this.tagList = val
      },
      deep: true
    },
    tagList: {
      handler (val) {
        // || this.uniteType === 2) {
        // if (val.length === 0 ) { // 当清空时， uniteType 为 2
        //   this.uniteType = 2
        // }
        // if (this.uniteType === 2) {
        if (val.every(item => item.dataSource === 2)) {
          this.uniteType = 2
        } else if (val.every(item => [2, 8].indexOf(item.dataSource) > -1)) {
          this.uniteType = 0
        } else {
          this.uniteType = 1
        }
        // }
      },
      immediate: true
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
    back () {
      this.$router.push({
        path: 'labelSquare'
      })
    },
    genDefaultForm () {
      return {
        recordId: undefined,
        policyName: '',
        conditionTagIds: []
      }
    },
    handleSearch () {
      // 全局搜索
      if (this.activeName === 'labelZone') {
        this.labelZoneTagName = this.searchVal
      } else {
        this.myCollectTagName = this.searchVal
      }
    },
    handleClearSearch () {
      this.searchVal = undefined
      this.labelZoneTagName = undefined
      this.myCollectTagName = undefined
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
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 4, behaviorShow: val.join(',') })
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
    handleTempCheckListChange (val) {
      this.$service.saveListDimension({ type: 5, behaviorShow: val.join(',') })
    },
    handleTabChange () {
      switch (this.activeName) {
        case 'labelZone':
          //    刷新标签广场页
          this.fetchCheckListData()
          this.$root.$emit('label-zone-list-refresh')
          break
        case 'myCollect':
          //    刷新我的收藏
          this.fetchCheckListData()
          this.$root.$emit('my-collect-list-refresh')
          break
        case 'tempLabel':
          this.fetchTempCheckListData()
          this.$root.$emit('temp-label-list-refresh-2')
          break
        case 'localLabel':
          this.fetchTempCheckListData()
          this.$root.$emit('local-label-list-refresh')
          break
      }
    },
    handleGetTableSelectedData (val, mode) {
      // 只支持单数组，多数组要多次调用这个
      const tagList = this.tagList
      if (mode === 'add') {
        // 如果有匹配的，就直接return
        let firstIndex = -1
        for (var i = 0; i < tagList.length; i++) {
          if (tagList[i].tagId === val.tagId) {
            firstIndex = i
            return
          }
        }

        // 如果没有匹配的，就执行新增
        if (firstIndex === -1) {
          this.tagList.push(val)

          // 判断是否与其他标签类型冲突，若有冲突就删除该标签
          if (this.uniteType === 0 && [2, 8].indexOf(val.dataSource) === -1) {
            this.tagList.pop() // 删除前面 push 添加的
            this.Successdialog = true
            this.getSencond()
            return
          } else if (this.uniteType === 1 && [2, 3, 1, 5].indexOf(val.dataSource) === -1) {
            this.tagList.pop() // 删除前面 push 添加的
            this.Successdialog = true
            this.getSencond()
            return
          }

          this.addForm.conditionTagIds.push(val.tagId)
          this.setContentBottomMargin()
        }
      } else {
        // 取消选中的则删除这一项
        let index = -1
        for (var j = 0; j < tagList.length; j++) {
          if (tagList[j].tagId === val.tagId) {
            index = j
            this.tagList.splice(index, 1)
            this.addForm.conditionTagIds = this.addForm.conditionTagIds.filter(
              tagId => tagId !== val.tagId
            )
            this.setContentBottomMargin()
            return
          }
        }
      }
    },
    setContentBottomMargin () {
      this.$nextTick(() => {
        const bottomMargin = document.getElementsByClassName(
          'fix-bottom-form'
        )[0].offsetHeight
        this.bottomHeight = bottomMargin + 'px'
      })
    },
    removeTag (tag) {
      // 标签已经在使用中，无法删不掉
      if (this.usedTagList.includes(Number(tag.tagId))) {
        this.$message.error('标签已经在使用中')
        return
      }

      const addForm = this.addForm
      addForm.conditionTagIds = addForm.conditionTagIds.filter(
        tagId => tagId !== tag.tagId
      )
      this.tagList.splice(this.tagList.indexOf(tag), 1)
      this.setContentBottomMargin()
    },
    saveAndNext (mode) {
      // debugger
      const conditionTagIds =
        this.tagList.map(function (v) {
          return parseInt(v.tagId)
        }) || []
      this.addForm = {
        conditionTagIds
      }
      let addForm = JSON.parse(JSON.stringify(this.addForm))
      if (addForm.conditionTagIds.length === 0) {
        this.$message.error('请选择策略维度！')
        return
      }
      addForm.conditionTagIds = addForm.conditionTagIds.join(',')
      // this.$emit('policyNextStep', this.tagList)

      const tagIds = addForm.conditionTagIds
      this.$service.saveSpecialTag({ tagIds }).then((data) => {
        this.$emit('policyNextStep', data)
      })
    },
    getPolicyDetail () {
      // this.$service.oneDropGetPolicyDetail(this.recordId).then((data) => {
      //     const formData = data
      //     formData.conditionTagIds = formData.conditionTagIds.split(',').map(function (v) {
      //         return parseInt(v)
      //     })
      //     this.addForm = {
      //         recordId: this.recordId,
      //         policyName: formData.policyName,
      //         conditionTagIds: formData.conditionTagIds
      //     }
      // })

      this.$service
        .specialTagDetail({ specialTagId: this.$route.query.specialTagId })
        .then(data => {
          // debugger
          const formData = data
          formData.conditionTagIds = formData.conditionTagIds
            .split(',')
            .map(function (v) {
              return parseInt(v)
            })
          this.addForm = {
            policyName: formData.policyName,
            conditionTagIds: formData.conditionTagIds
          }
        })
    }
  },
  created () {
    this.fetchCheckListData()
    this.fetchTempCheckListData()
    this.tagList = this.initTagList
  }
}
</script>

<style lang="stylus" scoped>
.label-content {
  position: relative;
  padding: 0 130px;

  >>> .tab-content {
    margin-top: 0;

    .el-tabs__nav-wrap {
      z-index: 1;
    }
  }

  >>> .my-collect {
    margin-top: 0;
  }

  >>> .temp-label-list {
    margin-top: 0;
  }

  >>> .el-tag--warningOrange {
    color: #512DA8;
    background-color: rgba(119, 81, 200, 0.4);
    border-color: rgba(81, 45, 168, 0.45);

    .el-tag__close {
      color: #512DA8;
    }
  }

  >>> .el-tag--warningOrange2 {
    color: #795548;
    background-color: rgba(167, 130, 117, 0.5);
    border-color: #7955488c;

    .el-tag__close {
      color: #512DA8;
    }
  }
  >>> .el-tag--warningCyan {
    color: #00bcd4;
    background-color: rgba(0, 189, 214, .1);
    border-color: #00bcd42b
  }
}

.search-input {
  position: absolute;
  top: 0;
  right: 30px;
  width: 20%;
  z-index: 999;

  .icon-fixed {
    position: absolute;
    top: 8px;
    right: 10px;
    transform: rotate(-90deg);
  }
}

/* .label-content >>> .el-tabs__header */
/* position fixed */
/* width 100% */
/* z-index 999 */
.label-content >>> .el-tabs__nav-wrap {
  background: #fff;
  z-index: 999;
}

.tags-tips {
  color: #000;
  font-size: 12px;
  margin-left: 100px;
}

.checkbox--red {
  color: #f56c6c;
}

.checkbox--green {
  color: #67c23a;
}

.checkbox--blue {
  color: #409eff;
}

.checkbox--yellow {
  color: #e6a23c;
}

.checkbox--orange {
  color: #512DA8;
}

.checkbox--orange2 {
  color: #795548;
}
.checkbox--cyan {
  color #00bcd4;
}
.fix-bottom-form {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
}

.table-list {
  width: 100%;
  height: 100%;
}
</style>
