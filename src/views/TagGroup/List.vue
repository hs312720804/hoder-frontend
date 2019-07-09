<template>
    <el-aside width="230" style="background-color: rgb(238, 241, 246)" v-permission="'hoder:label:group:index'">
        <div class="tag-category-list">
            <el-header class="tag-category-list__header">
                分组
                <el-button v-show="!showCheckBox" class="btn-add-category" v-permission="'hoder:label:group:modify'" type="text" @click="$refs.tagGroupCreate.showCreateDialog = true">新建</el-button>
                <el-button v-show="!showCheckBox" class="btn-add-category" v-permission="'hoder:label:group:modify'" type="text" @click="handleTagEdit">删除</el-button>
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
                  :props="treeProps"
                  node-key="id"
                  :filter-node-method="filterNode"
                  ref="tree"
                  expand-on-click-node
                  :show-checkbox="true"
                  @node-click="handleNodeClick"
                  :render-content="renderContent"
                >
                    <!--<span slot-scope="{ node, data }">-->
                        <!--<span class="tree-data tree-data&#45;&#45;big-size">{{ data.groupName }}</span>-->
                        <!--&lt;!&ndash;<span&ndash;&gt;-->
                                <!--&lt;!&ndash;v-for="(dataItem,index) in data.children"&ndash;&gt;-->
                                <!--&lt;!&ndash;class="tree-data"&ndash;&gt;-->
                                <!--&lt;!&ndash;:key="index"&ndash;&gt;-->
                                <!--&lt;!&ndash;@click.stop="()=>{}"&ndash;&gt;-->
                        <!--&lt;!&ndash;&gt;{{dataItem.groupName}}&ndash;&gt;-->
                        <!--&lt;!&ndash;</span>&ndash;&gt;-->
                    <!--</span>-->
                </el-tree>
            </div>
            <div v-show="showCheckBox" class="del-button">
                <el-button @click="remove">确定删除</el-button>
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
                <div class="edit-dialog-buttons">
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                    <el-button @click="showEditDialog = false">取消</el-button>
                </div>
            </el-dialog>

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
export default {
    components: {
        TagGroupCreate
    },
    data() {
        return {
            filterText: '',
            tagGroupList: [],
            treeData: [],
            showCheckBox: false,
            treeProps:{
                children: 'children',
                label: 'groupName'
            },
            editTitle: '',
            showEditDialog: false,
            mode : '',
            currentLabelData: undefined,
            delGroupIds: undefined,
            editGroupName: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
            // const filterText = this.filterText
            // if (!filterText) {
            //     return this.tagGroupList
            // } else {
            //     return this.tagGroupList.filter(({name}) => name.indexOf(filterText) > -1)
            // }
        },
        activeId() {
            return this.$route.params.id
        }
    },
    methods: {
        // fetchData() {
        //     return this.$service.getTagGroupList().then((data) => {
        //         this.tagGroupList = data
        //     })
        // },
        fetchData() {
            return this.$service.getParentIdList().then((data) => {
                this.treeData = data
            })
        },
        handleReadTagGroup(item) {
            this.$emit('read-tag-group', item)
        },
        handleReadAllTagGroup() {
            const item = {id:0,name: '全部'}
            this.$emit('read-tag-group', item)
        },
        handleNodeClick(data) {
            if(!this.showCheckbox){
                const item = { id:data.groupId,name: data.groupName }
                // let item = undefined
                // if( data.groupId === undefined ) {
                //     // item = { id:data.id,name: data.groupName }
                //     item = {}
                // }else{
                //     item = { id:data.groupId,name: data.groupName }
                // }
                this.$emit('read-tag-group', item)
            }else{console.log(data)}
        },
        filterNode(value,data) {
            if(!value) return true
            return data.groupName.indexOf(value) !== -1
        },
        edit(node, data) {
            console.log(data)
            console.log(node)
            this.showEditDialog = true
            this.editTitle = '修改标签组名'
            this.mode = 'edit'
            this.currentLabelData = data
            this.editGroupName = data.groupName
        },
        remove() {
            const select = this.$refs.tree.getCheckedNodes()
            console.log(select)
            this.showEditDialog = true
            this.editTitle = '删除标签组'
            this.mode = 'del'
            this.delGroupIds = select.map(item => item.groupId).join(',')
            console.log(this.delGroupIds)
        },
        handleConfirm() {
            if(this.mode === 'edit') {
                const currentData = this.currentLabelData
                this.$service.editLabelGroupName({groupId: currentData.groupId,groupName: this.editGroupName,Pid: currentData.pid},'修改成功')
                    .then(() => {
                        this.showEditDialog = false
                        this.fetchData()
                    })}
            else if(this.mode === 'del') {
                this.$service.delLabelGroup({groupId: this.delGroupIds},'删除成功')
                    .then(() => {
                        this.showEditDialog = false
                        this.fetchData()
                    })
            }
        },
        handleTagEdit(){
            this.showCheckBox = true
        },
        // renderContent(h, { node, data, store }) {
        //     return (
        //         <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
        //             <span>
        //             <span>{node.label}</span>
        //         </span>
        //         <span>
        //         <el-button style="font-size: 12px;" type="text" on-click={ () => this.edit(node, data) }>编辑</el-button>
        //         <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
        //         </span>
        //         </span>
        //     );
        // },
        renderContent(h, { node, data, store }) {
            return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                <span>{node.label}</span>
            </span>
            <span>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.edit(node, data) }>编辑</el-button>
            </span>
            </span>
        );
        }
    },
    created() {
        // const activeId = this.activeId
        // if (activeId) {
        //     this.fetchData()
        // } else {
        //     this.fetchData().then(() => {
        //         this.handleReadTagGroup(this.tagGroupList[0])
        //     })
        // }
        this.fetchData()
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
.update-input
    display inline-block
    width 50%
.edit-dialog-buttons
    margin 30px 0 20px 30px
.del-button
    text-align center
</style>
