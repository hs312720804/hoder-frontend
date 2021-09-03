<template>
    <el-aside width="230" style="background-color: rgb(238, 241, 246)" v-permission="'hoder:label:group:index'">
        <div class="tag-category-list">
            <el-button @click="handleRedirectLabelSquare">标签广场</el-button>
            <el-header class="tag-category-list__header">
                分组
                <el-button v-show="!showCheckBox" class="btn-add-category" v-permission="'hoder:label:group:modify'" type="text" @click="$refs.tagGroupCreate.showCreateDialog = true">新建</el-button>
                <el-button v-show="!showCheckBox" class="btn-add-category" v-permission="'hoder:label:group:modify'" type="text" @click="handleTagEdit">编辑</el-button>
                <el-button v-show="showCheckBox" class="btn-add-category" v-permission="'hoder:label:group:modify'" type="text" @click="showCheckBox = false">取消</el-button>
            </el-header>
            <div class="filter">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                >
                </el-input>
            </div>
            <div><el-button @click="handleReadAllTagGroup()" type="text" class="show-all-style">显示全部</el-button></div>
            <div>
                <el-tree
                  :class="!showCheckBox ? 'cat-tree__hide-checkbox' : ''"
                  :data="treeData"
                  node-key="groupId"
                  :filter-node-method="filterNode"
                  ref="tree"
                  :default-expanded-keys="defaultExpanded"
                  expand-on-click-node
                  :show-checkbox="true"
                  @node-click="handleNodeClick"
                  @node-expand="nodeExpand"
                  @node-collapse="nodeCollapse"
                >
                    <span slot-scope="{ node, data }" class="tree-child">
                        <span class="tree-data tree-data--big-size">{{ data.groupName }}</span>
                        <span class="edit-text-button" v-if="showCheckBox"><el-button type="text" @click="edit(node, data)">编辑</el-button></span>
                        <!--<span-->
                                <!--v-for="(dataItem,index) in data.children"-->
                                <!--class="tree-data"-->
                                <!--:key="index"-->
                                <!--@click.stop="()=>{}"-->
                        <!--&gt;{{dataItem.groupName}}-->
                        <!--</span>-->
                    </span>
                </el-tree>
            </div>
            <div v-show="showCheckBox" class="del-button">
                <el-button @click="copyTag" type="primary">复制</el-button>
                <el-button @click="remove" type="danger">删除</el-button>
            </div>
            <el-dialog
                :visible.sync="showEditDialog"
                :title="editTitle"
            >
                <div v-if="mode === 'edit'">
                      <span>组名：</span>
                      <span><el-input v-model="editGroupName" class="update-input"></el-input></span>
                </div>
                <div v-if="mode === 'del'">
                    <div>确定删除所勾选的标签吗？</div>
                </div>
                <!--<div v-if="mode === 'copy'">-->
                    <!--<choose-tag-group :parentId="parentId"></choose-tag-group>-->
                <!--</div>-->
                <div class="edit-dialog-buttons">
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                    <el-button @click="showEditDialog = false">取消</el-button>
                </div>
            </el-dialog>
            <choose-tag-group ref="chooseTagGroup" @saveCopyTag="handleSaveCopyForm"></choose-tag-group>
            <!--<div class="tag-category-list">-->
                <!--<ul>-->
                    <!--<li-->
                        <!--v-for="(tagGroup, index) in tagGroupListFiltered"-->
                        <!--:key="tagGroup.id"-->
                        <!--:class="activeId == tagGroup.id ? 'active' : ''"-->
                        <!--@click="handleReadTagGroup(tagGroup)"-->
                    <!--&gt;-->
                        <!--{{ tagGroup.name }}-->
                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->

            <TagGroupCreate ref="tagGroupCreate" @create-end="fetchData" />
        </div>
    </el-aside>
</template>
<script>
import TagGroupCreate from './Create.vue'
import ChooseTagGroup from '@/components/ChooseTagGroup.vue'
export default {
  components: {
    TagGroupCreate,
    ChooseTagGroup
  },
  data () {
    return {
      filterText: '',
      tagGroupList: [],
      treeData: [],
      showCheckBox: false,
      editTitle: '',
      showEditDialog: false,
      mode: '',
      currentLabelData: undefined,
      delGroupIds: undefined,
      editGroupName: '',
      defaultExpanded: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
      // const filterText = this.filterText
      // if (!filterText) {
      //     return this.tagGroupList
      // } else {
      //     return this.tagGroupList.filter(({name}) => name.indexOf(filterText) > -1)
      // }
    },
    '$route.params.id': function (val) {
      //  解决id在其他页面命名冲突带来的跳转bug
      const routeFlag = this.$route.name === 'tag-group-read'
      if (val === undefined && routeFlag) {
        this.handleReadAllTagGroup()
      }
    }
  },
  methods: {
    // fetchData() {
    //     return this.$service.getTagGroupList().then((data) => {
    //         this.tagGroupList = data
    //     })
    // },
    fetchData () {
      this.$service.getParentIdList().then((data) => {
        this.treeData = data
      })
    },
    handleReadTagGroup (item) {
      this.$emit('read-tag-group', item)
    },
    handleReadAllTagGroup () {
      const item = { id: 0, name: '全部' }
      this.$emit('read-tag-group', item)
    },
    handleNodeClick (data) {
      if (!this.showCheckBox) {
        const item = { id: data.groupId, name: data.groupName }
        // let item = undefined
        // if( data.groupId === undefined ) {
        //     // item = { id:data.id,name: data.groupName }
        //     item = {}
        // }else{
        //     item = { id:data.groupId,name: data.groupName }
        // }
        this.$emit('read-tag-group', item)
      } else { }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.groupName.indexOf(value) !== -1
    },
    edit (node, data) {
      this.showEditDialog = true
      this.editTitle = '修改标签组名'
      this.mode = 'edit'
      this.currentLabelData = data
      this.editGroupName = data.groupName
    },
    checkboxChooseIdentify () {
      const select = this.$refs.tree.getCheckedNodes()
      if (select.length > 0) {
        this.delGroupIds = select.map(item => item.groupId).join(',')
        return true
      } else {
        this.$message.error('请勾选至少一个标签！')
        return false
      }
    },
    remove () {
      // const select = this.$refs.tree.getCheckedNodes()
      this.showEditDialog = true
      this.editTitle = '删除标签组'
      this.mode = 'del'
      // this.delGroupIds = select.map(item => item.groupId).join(',')
    },
    copyTag () {
      this.$refs.chooseTagGroup.showCreateDialog = true
    },
    handleConfirm () {
      if (this.mode === 'edit') {
        const currentData = this.currentLabelData
        this.$service.editLabelGroupName({ groupId: currentData.groupId, groupName: this.editGroupName, Pid: currentData.pid }, '修改成功')
          .then(() => {
            this.showEditDialog = false
            this.fetchData()
          })
      } else if (this.mode === 'del') {
        if (this.checkboxChooseIdentify()) {
          this.$service.delLabelGroup({ groupIds: this.delGroupIds }, '删除成功')
            .then(() => {
              this.showEditDialog = false
              this.fetchData()
            })
        }
      }
    },
    handleSaveCopyForm (pid) {
      if (this.checkboxChooseIdentify()) {
        this.$service.copyLabelGroup({ tagGroupId: pid, groupIds: this.delGroupIds }, '复制成功')
          .then(() => {
            this.$refs.chooseTagGroup.showCreateDialog = false
            this.fetchData()
          })
      }
    },
    handleTagEdit () {
      this.showCheckBox = true
    },
    nodeExpand (node) {
      this.defaultExpanded.push(node.groupId)
    },
    nodeCollapse (node) {
      this.defaultExpanded = this.defaultExpanded.filter(item => item !== node.groupId)
    },
    handleRedirectLabelSquare () {
      this.$router.push({ name: 'labelSquare' })
    }
  },
  created () {
    const activeId = this.$route.params.id
    this.fetchData()
    if (!activeId) {
      this.handleReadAllTagGroup()
    }
  }
}
</script>
<style lang="stylus" scoped>
.tag-category-list__header
    line-height 60px
.btn-add-category
    float right
    margin-top 15px
.filter
    padding 10px 15px
.tag-category-list >>> .el-tree
    background none
.tag-category-list >>> .el-tree-node__content
    height 35px
.tag-category-list >>> .el-tree-node__label
    list-style none
    line-height 35px
.tag-category-list >>> li span
    text-decoration none
    cursor pointer
    color #333
.show-all-style
    width 100%
    font-size 16px
    font-weight normal
    color #606266
    text-align left
    text-indent 24px
    &:focus
        background #fff
    &:hover
        background #fff
.tag-category-list
    ul
        padding 0
        list-style none
    li
        height 35px
        line-height 35px
        color #606266
        font-size 14px
        text-indent 20px
        cursor pointer
        &:hover
            background-color #f5f7fa
    li.active
        background #409eff
        color #fff
.cat-tree__hide-checkbox >>> .el-checkbox
    display none
.tree-child
    flex 1 1 0%
    display flex
    align-items center
    justify-content space-between
    font-size 14px
    padding-right 8px
.update-input
    display inline-block
    width 50%
.edit-dialog-buttons
    margin 30px 0 20px 30px
.del-button
    text-align center
.edit-text-button
    font-size 12px
</style>
