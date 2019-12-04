<template>
    <div class="one-drop-create-policy">
        <div class="left-tree">
            <div class="all-tag" @click="handleGetAllTags()">全部标签</div>
            <el-tree
                    :data="treeData"
                    node-key="groupId"
                    ref="tree"
                    expand-on-click-node
                    @node-click="handleNodeClick"
            >
                    <span slot-scope="{ node, data }" class="tree-child">
                         <span class="tree-data tree-data--big-size">{{ data.groupName }}</span>
                    </span>
            </el-tree>
        </div>
        <div class="right-content">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
            <el-form-item label="策略名称" prop="policyName">
                <el-input size="small" v-model="addForm.policyName" style="width: 80%"></el-input>
            </el-form-item>
            <div class="tags-tips">注：红色为大数据标签，绿色为自定义标签,蓝色为账号标签</div>
            <el-form-item label="策略纬度" prop="conditionTagIds">
                <el-tabs tab-position="top">
                    <div class="strategy-search">
                        <el-input aria-placeholder="请输入标签关键字进行搜索"
                                  v-model="searchValue"
                                  class="strategy-search--input"
                                  @keyup.enter.native="getTags()"
                        >
                        </el-input>
                        <el-button @click="getTags()">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </div>
                    <el-checkbox-group v-model="addForm.conditionTagIds" class="checkList" v-if="conditionTagsFiltered != '' ">
                        <el-checkbox v-for="item in conditionTagsFiltered"
                                     :class="item.dataSource === 2 ? 'checkbox--red' : (item.dataSource === 1 ? 'checkbox--green' : 'checkbox--blue')"
                                     :label="item.tagId"
                                     :key="item.tagId"
                                     @change="handleTagChange($event,item)"
                        >
                            {{item.tagName}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <div class="checkbox--red" v-else>该标签不存在，请重新输入标签名进行搜索</div>
                    <el-pagination
                            v-if="conditionTagsFiltered != '' "
                            small
                            class="pagination"
                            layout="prev,pager,next"
                            :total="tagsListTotal"
                            :page-size="initPageSize"
                            :current-page="initCurrentPage"
                            @current-change="handleTagCurrentChange"
                            @prev-click="handleTagCurrentChange"
                            @next-click="handleTagCurrentChange"
                    >
                    </el-pagination>
                </el-tabs>
            </el-form-item>
            <el-form-item label="已选标签">
                <el-tag v-for="item in tagList"
                        :key="item.tagId"
                        :type= "item.dataSource === 1 ? 'success' : item.dataSource === 2 ? 'danger' : ''"
                        closable
                        @close="removeTag(item)"
                >
                    {{item.tagName}}
                </el-tag>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="saveAndNext(0)">跳过下一步保存</el-button>
                <el-button type="primary" @click="saveAndNext(1)">下一步</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreatePolicy",
        props: ['recordId','initTagList'],
        data () {
            return {
                treeData: [],
                pagination: {},
                addForm: this.genDefaultForm(),
                addFormRules: {
                    policyName: [
                        { required: true, message: "请填写策略名称", trigger: "blur" }
                    ]
                },
                searchValue: '',
                conditionTagsFiltered: [],
                tagList: [],
                initPageSize: 50,
                tagsListTotal: 0,
                initCurrentPage: 1,
                currentTagParent: 0
            }
        },
        methods: {
            resetForm () {
                    this.addForm = this.genDefaultForm()
                    this.tagList = []
            },
            genDefaultForm () {
                return {
                    recordId: undefined,
                    policyName: "",
                    conditionTagIds: []
                }
            },
            fetchData() {
                return this.$service.getParentIdList().then((data) => {
                    this.treeData = data
                })
            },
            handleNodeClick(data) {
                if (data.groupId === this.currentTagParent) {return}
                this.currentTagParent = data.groupId
                this.initCurrentPage = 1
                this.getTags()
            },
            getTags() {
                this.$service.getTagGroupTreeList({groupId: this.currentTagParent,pageNum: this.initCurrentPage ,pageSize: this.initPageSize,tagName: this.searchValue}).then((data) => {
                    this.conditionTagsFiltered = data.pageInfo.list
                    this.tagsListTotal = data.pageInfo.total
                    // this.pagination.pageNum = data.pageInfo.pageNum
                    // this.pagination.pageSize = data.pageInfo.pageSize
                })
            },
            resetSearch () {
                this.searchValue = ''
                let currentTagsId = this.addForm.conditionTagIds
                this.getTags()
                this.addForm.conditionTagIds = currentTagsId
            },
            handleTagChange(flag,item) {
                var arr = []
                if(flag) {this.tagList.push(item)}
                else {
                    arr = this.tagList
                    for(var i=arr.length-1;i>=0;i--) {
                        if(arr[i].tagId == item.tagId) {arr.splice(i,1)}
                    }
                }
            },
            handleTagCurrentChange(pages) {
                this.initCurrentPage = pages
                this.getTags()
            },
            removeTag(tag) {
                const addForm = this.addForm
                addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
                this.tagList.splice(this.tagList.indexOf(tag),1)
            },
            saveAndNext(mode) {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        let addForm = JSON.stringify(this.addForm)
                        addForm = JSON.parse(addForm)
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
                                            this.$router.push({ path: 'launch/strategyList' })
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
                                            this.$router.push({ path: 'launch/strategyList' })
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
                                        this.$router.push({ path: 'launch/strategyList' })
                                    }).catch(() => {
                                    })
                                } else {
                                    this.$root.$emit('stratege-list-refresh')
                                    this.$router.push({path: 'launch/strategyList'})
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
                this.$service.oneDropGetPolicyDetail(this.recordId).then((data)=> {
                    const formData = data
                    formData.conditionTagIds = formData.conditionTagIds.split(',').map(function(v) {
                        return parseInt(v)
                    })
                    this.addForm = {
                        recordId: this.recordId,
                        policyName: formData.policyName,
                        conditionTagIds: formData.conditionTagIds
                    }
                })
            },
            handleGetAllTags () {
                if (this.currentTagParent === 0) {return}
                this.currentTagParent = 0
                this.initCurrentPage = 1
                this.getTags()
            }
        },
        created () {
            this.fetchData()
            this.getTags()
            if (this.recordId) {
                this.getPolicyDetail()
                this.tagList = this.initTagList
            }
        }
    }
</script>

<style lang="stylus" scoped>
.one-drop-create-policy
    display flex
.left-tree
    color #606266
    background rgb(238, 241, 246)
    padding 0 20px
    margin 30px
    overflow auto
    -webkit-box-sizing border-box
    box-sizing border-box
    -ms-flex-negative 0
    flex-shrink 0
    .el-tree
        background none
.all-tag
    margin 20px 0 10px 10px
    cursor pointer
.right-content
    width 80%
    height auto
    margin-top 30px
.strategy-search
    display flex
    margin-bottom 10px
.strategy-search--input
    width 70%
    margin-right 20px
.tags-tips
    color red
    font-size 12px
    margin-left 100px
.checkbox--red
    color red
.checkbox--green
    color green
.checkbox--blue
    color blue
</style>
