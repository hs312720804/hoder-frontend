<template>
  <div class="label-content">
    <div class="table-list" :style="{marginBottom: bottomHeight}">
        <el-tabs
                v-model="activeName"
                @tab-click="handleTabChange"
        >
          <el-tab-pane label="临时标签" name="tempLabel">
            <temp-label-index
                    :show-selection="showSelection"
                    :currentSelectTag="tagList"
                    :checkList="tempCheckList"
                    @get-table-selected="handleGetTableSelectedData"
                    @change-checkList="handleTempCheckListChange"
                    @fetch-checkList="fetchTempCheckListData"
            >
            </temp-label-index>
          </el-tab-pane>
          <el-tab-pane label="标签专区" name="labelZone">
            <label-zone
                    :tagName="labelZoneTagName"
                    @clear-search="handleClearSearch"
                    :checkList="checkList"
                    @change-checkList="handleCheckListChange"
                    @fetch-checkList="fetchCheckListData"
                    @get-table-selected="handleGetTableSelectedData"
                    :show-selection="showSelection"
                    :currentSelectTag="tagList"
            >
            </label-zone>
          </el-tab-pane>
          <el-tab-pane label="我的收藏" name="myCollect">
            <my-collect
                    :tagName="myCollectTagName"
                    :checkList="checkList"
                    @clear-search="handleClearSearch"
                    @change-checkList="handleCheckListChange"
                    @get-table-selected="handleGetTableSelectedData"
                    :show-selection="showSelection"
                    :currentSelectTag="tagList"
            >
            </my-collect>
          </el-tab-pane>
        </el-tabs>
    </div>
    <div class="search-input" v-if="activeName === 'labelZone' || activeName === 'myCollect'">
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
            :rules="addFormRules"
            ref="addForm"
            label-width="100px"
            class="fix-bottom-form"
    >
      <el-form-item label="已选标签">
        <el-tag v-for="(item,index) in tagList"
                :key="item.tagId+'_'+index"
                :type="dataSourceColorEnum[item.dataSource]"
                closable
                @close="removeTag(item)"
        >
          {{item.tagName}}
        </el-tag>
      </el-form-item>
      <div class="tags-tips">
        注：<span class="checkbox--red">红色</span>为大数据标签,
        <span class="checkbox--green">绿色</span>为自定义标签,
        <span class="checkbox--blue">蓝色</span>为账号标签,
        <span class="checkbox--yellow">黄色</span>为实时标签
      </div>
      <el-form-item label="策略名称" prop="policyName">
        <el-input size="small" v-model="addForm.policyName" style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="saveAndNext(0)">跳过下一步保存</el-button>
        <el-button type="primary" @click="saveAndNext(1)">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import labelZone from './LabelZone'
    import myCollect from './MyCollect'
    import tempLabelIndex from './TempLabelIndex'
    export default {
        name: "labelSquareAA",
        components: {
            labelZone,
            myCollect,
            tempLabelIndex
        },
        props: ['recordId','initTagList'],
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
                    5: 'warning'
                },
                showSelection: true,
                addForm: this.genDefaultForm(),
                addFormRules: {
                    policyName: [
                        { required: true, message: "请填写策略名称", trigger: "blur" }
                    ]
                },
                tempCheckList: [],
                bottomHeight: 169+'px'
            }
        },
        methods: {
            genDefaultForm () {
                return {
                    recordId: undefined,
                    policyName: "",
                    conditionTagIds: []
                }
            },
            handleSearch () {
                // 全局搜索
                if(this.activeName === 'labelZone') {
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
                this.$service.getListDimension({type: 4}).then(data => {
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
                this.$service.saveListDimension({type: 4,behaviorShow: val.join(',')})
            },
            fetchTempCheckListData () {
                this.$service.getListDimension({type: 5}).then(data => {
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
                this.$service.saveListDimension({type: 5,behaviorShow: val.join(',')})
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
                        this.$root.$emit('temp-label-list-refresh')
                        break
                }
            },
            handleGetTableSelectedData (val,mode) {
                // 只支持单数组，多数组要多次调用这个
                const tagList = this.tagList
                if(mode === 'add') {
                    // 如果有匹配的，就直接return
                    let firstIndex = -1
                    for (var i=0; i < tagList.length;i++) {
                        if (tagList[i].tagId === val.tagId) {
                            firstIndex = i
                            return
                        }
                    }
                    // 如果没有匹配的，就执行新增
                    if (firstIndex === -1) {
                        this.tagList.push(val)
                        this.addForm.conditionTagIds.push(val.tagId)
                        this.setContentBottomMargin()
                    }
                } else {
                    // 取消选中的则删除这一项
                    let index = -1
                    for (var i=0; i < tagList.length;i++) {
                        if (tagList[i].tagId === val.tagId) {
                            index = i
                            this.tagList.splice(index,1)
                            this.addForm.conditionTagIds = this.addForm.conditionTagIds.filter(tagId => tagId !== val.tagId)
                            this.setContentBottomMargin()
                            return
                        }
                    }
                }
            },
            setContentBottomMargin () {
                this.$nextTick(() => {
                    const bottomMargin = document.getElementsByClassName('fix-bottom-form')[0].offsetHeight
                    this.bottomHeight = bottomMargin + 'px'
                })
            },
            removeTag(tag) {
                const addForm = this.addForm
                addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
                this.tagList.splice(this.tagList.indexOf(tag),1)
                this.setContentBottomMargin()
            },
            saveAndNext(mode) {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        let addForm = JSON.stringify(this.addForm)
                        addForm = JSON.parse(addForm)
                        if (addForm.conditionTagIds.length === 0) {
                            this.$message.error('请选择策略维度！')
                            return
                        }
                        addForm.conditionTagIds = addForm.conditionTagIds.join(",")
                        if (mode === 1) {
                            if (this.addForm.recordId) {
                                this.$service.oneDropPolicyAddSave(addForm).then((data) => {
                                    if (data.policyId) {
                                        this.$confirm('保存失败，该策略维度已存在！请在策略'+data.policyId+'中新建人群即可', '提示', {
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
                                        this.$emit('policyNextStep',this.addForm.recordId,this.tagList)
                                    }
                                })
                            } else {
                                this.$service.oneDropPolicyAddSave(addForm).then((data) => {
                                    if (data.policyId) {
                                        this.$confirm('保存失败，该策略维度已存在！请在策略'+data.policyId+'中新建人群即可', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {
                                            this.$message({
                                                type: 'success',
                                                message: '即将自动跳转至策略列表页'
                                            })
                                            this.$emit('handleDirectStrategyList')
                                        }).catch(() => {
                                        })
                                    } else {
                                        this.addForm.recordId = data.recordId
                                        this.$emit('policyNextStep',this.addForm.recordId,this.tagList)
                                    }
                                })
                            }
                        } else {
                            let oldFormData = {
                                policyName: addForm.policyName,
                                conditionTagIds: addForm.conditionTagIds
                            }
                            this.$service.policyAddSave(oldFormData).then((data) => {
                                if (data.policyId) {
                                    this.$confirm('保存失败，该策略维度已存在！请在策略'+data.policyId+'中新建人群即可', '提示', {
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
                                    // this.$root.$emit('stratege-list-refresh')
                                    // this.$router.push({path: 'launch/strategyList'})
                                    this.$emit('handleDirectStrategyList')
                                    this.resetForm()
                                    this.$emit('resetFormData')
                                }
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            getPolicyDetail () {
                this.$service.oneDropGetPolicyDetail(this.recordId).then((data) => {
                    const formData = data
                    formData.conditionTagIds = formData.conditionTagIds.split(',').map(function (v) {
                        return parseInt(v)
                    })
                    this.addForm = {
                        recordId: this.recordId,
                        policyName: formData.policyName,
                        conditionTagIds: formData.conditionTagIds
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
        }
    }
</script>

<style lang="stylus" scoped>
  .label-content
    position relative
    padding 0 20px
    >>> .tab-content
      margin-top 0
      .el-tabs__nav-wrap
        z-index 1
    >>> .my-collect
        margin-top 0
    >>> .temp-label-list
        margin-top 0
  .search-input
    position absolute
    top 0
    right 18px
    width 20%
    z-index 999
    .icon-fixed
      position absolute
      top 8px
      right 10px
      transform rotate(-90deg)
  /*.label-content >>> .el-tabs__header*/
    /*position fixed*/
    /*width 100%*/
    /*z-index 999*/
  .label-content >>> .el-tabs__nav-wrap
    background #fff
    z-index 999
  .tags-tips
    color #000
    font-size 12px
    margin-left 100px
  .checkbox--red
    color #f56c6c
  .checkbox--green
    color #67c23a
  .checkbox--blue
    color #409eff
  .checkbox--yellow
    color #e6a23c
  .fix-bottom-form
    position fixed
    bottom 0
    background-color #fff
    width 90%
    z-index 9999
  .table-list
    width 100%
    height 100%
</style>
