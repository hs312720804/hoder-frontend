<template>
    <div class="label-zone">
        <div class="header" v-if="!showSelection">

          <div></div>
          <div class="search-input">
            <!-- <el-input
              placeholder="支持按标签名、ID搜索"
              class="header-input"
              v-model="filter.condition"
              @keyup.enter.native="fetchData"></el-input>
            <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i> -->
            <el-input
              v-model="searchVal"
              placeholder="支持按标签名、Code、描述搜索"
              @keyup.enter.native="handleSearch"
            >
            </el-input>
            <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
          </div>

        </div>
        <div v-if="filter.tagName === undefined || filter.tagName === ''">

            <div
                    v-for="item in treeData"
                    :key="item.parentId"
                    class="tab-content"
            >

                <div class="title">{{item.parentName}}<span v-if="item.newOrUpdateCount" class="small-red">·</span></div>
                <el-tabs
                        v-model="activeTab"
                        @tab-click="handleTabClick"
                >
                    <el-tab-pane
                            v-for="childItem in item.children"
                            :key="childItem.groupId"
                            :name="childItem.groupId"
                    >
                        <span slot="label">{{childItem.groupName}}<span v-if="childItem.newOrUpdateCount" class="small-red">·</span></span>
                        <div class="button-add" v-if="childItem.groupName === '自定义标签'">
                            <el-button type="primary" @click="handleAddTagCategory">新增</el-button>
                        </div>
                        <!-- 为了防止taglist多次执行，所以只显示当前tab下的列表-->
                        <template v-if="activeTab === childItem.groupId">
                            <tag-list
                                    v-if="toggleShow"
                                    :data-list="dataList"
                                    :data-source-enum="dataSourceEnum"
                                    :type-enum="typeEnum"
                                    :loading="loading"
                                    :check-list-parent="checkList"
                                    :show-selection="showSelection"
                                    @fetch-data="fetchTagList"
                                    @change-checkList="handleCheckListChange"
                                    @table-selected="handleTableSelected"
                                    :current-selected-tags="currentSelectTag"
                            >
                            </tag-list>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="other-form" v-else>
            <tag-list
                :data-list="dataList"
                :data-source-enum="dataSourceEnum"
                :type-enum="typeEnum"
                :loading="loading"
                :check-list-parent="checkList"
                :show-selection="showSelection"
                @fetch-data="fetchTagAllList"
                @change-checkList="handleCheckListChange"
                @table-selected="handleTableSelected"
                :current-selected-tags="currentSelectTag"
            >
            </tag-list>
        </div>
        <TagCategoryUpsert
            ref="tagCategoryUpsert"
            :current-tag-category="tagCategory"
            :type-enum="typeEnum"
            :data-source-enum="dataSourceEnum"
            @upsert-end="fetchTagList"
            :definedTagId="definedTagId"
        />
    </div>
</template>

<script>
import tagList from './TagList'
import TagCategoryUpsert from '../TagCategory/Upsert.vue'
export default {
  name: 'LabelZone',
  components: {
    tagList,
    TagCategoryUpsert
  },
  props: {
    tagName: {
      type: String
    },
    checkList: {
      type: Array
    },
    showSelection: {
      type: Boolean
    },
    currentSelectTag: {
      type: Array
    }
  },
  data () {
    return {
      treeData: [],
      activeTab: undefined,
      dataList: [],
      filter: {
        pageNum: 1,
        pageSize: 300,
        groupId: undefined,
        tagName: undefined
      },
      dataSourceEnum: {},
      typeEnum: {},
      toggleShow: false,
      loading: true,
      tagCategory: {},
      definedTagId: undefined,
      searchVal: ''
    }
  },
  watch: {
    // 'searchVal': function (val) {
    //   if (val !== undefined && val !== '') {
    //     this.filter.tagName = val
    //     this.fetchTagAllList()
    //   } else {
    //     this.filter.tagName = val
    //     this.fetchTagList()
    //   }
    // }
  },
  methods: {
    handleClearSearch () {
      this.searchVal = undefined
    },
    handleSearch () {
      const val = this.searchVal
      // debugger
      if (val !== undefined && val !== '') {
        this.filter.tagName = val
        this.fetchTagAllList()
      } else {
        this.filter.tagName = val
        this.fetchTagList()
      }
    },
    fetchData () {
      this.$service.getNewTreeList().then(data => {
        const result = []
        data.forEach(item => {
          item.children.forEach(secondChild => {
            const childList = secondChild.children.map(childItem => {
              if (childItem.groupName === '自定义标签') {
                this.definedTagId = childItem.groupId
              }
              return { groupId: childItem.groupId.toString(), groupName: childItem.groupName, newOrUpdateCount: childItem.newOrUpdateCount }
            })
            result.push({ parentName: secondChild.groupName, newOrUpdateCount: secondChild.newOrUpdateCount, parentId: secondChild.groupId, children: childList })
          })
        })
        this.treeData = result
        // this.activeTab = result[0].children[0].groupId
        // this.filter.groupId = this.activeTab
        this.fetchTagList()
      })
      // this.$service.getParentIdList().then((data) => {
      //     const result = []
      //     data.forEach(item => {
      //         item.children.forEach(secondChild => {
      //             const childList = secondChild.children.map(childItem => {
      //                 if (childItem.groupName === '自定义标签') {
      //                     this.definedTagId = childItem.groupId
      //                 }
      //                 return {groupId: childItem.groupId.toString(), groupName: childItem.groupName}
      //             })
      //             result.push({ parentName:secondChild.groupName,parentId: secondChild.groupId, children: childList })
      //         })
      //     })
      //     this.treeData = result
      //     // this.activeTab = result[0].children[0].groupId
      //     // this.filter.groupId = this.activeTab
      //     this.fetchTagList()
      // })
    },
    fetchTagList () {
      const filter = this.filter
      if (this.filter.groupId) {
        this.$service.getTagGroupTreeList(filter).then((data) => {
          this.dataList = data.pageInfo.list
          this.dataSourceEnum = data.lableDataSourceEnum
          this.typeEnum = data.tagsTypeEnum
          this.loading = false
        })
      }
    },
    fetchTagAllList () {
      const filter = JSON.parse(JSON.stringify(this.filter))
      filter.groupId = 0
      this.$service.getTagGroupTreeList(filter).then((data) => {
        this.dataList = data.pageInfo.list
        this.dataSourceEnum = data.lableDataSourceEnum
        this.typeEnum = data.tagsTypeEnum
        this.loading = false
      })
    },
    handleTabClick () {
      // 当前tab再次点击收缩表格
      if (this.filter.groupId !== this.activeTab) {
        this.toggleShow = true
        this.filter.groupId = this.activeTab
        this.loading = true
      } else {
        this.toggleShow = !this.toggleShow
        return
      }
      // 切换tab清空搜索框的值
      this.filter.tagName = undefined
      // this.dataList = []
      this.handleClearSearch()
      this.$emit('clear-search')
      this.$emit('fetch-checkList')
      this.fetchTagList()
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleAddTagCategory () {
      this.tagCategory = {
        groupId: this.definedTagId
      }
      this.$refs.tagCategoryUpsert.showCreateDialog = true
    },
    handleTableSelected (val, mode) {
      this.$emit('get-table-selected', val, mode)
    }
    // getNewTree () {
    //     this.$service.getNewTreeList().then(data => {
    //         console.log(data)
    //         const result = []
    //         data.forEach(item => {
    //             item.children.forEach(secondChild => {
    //                 const childList = secondChild.children.map(childItem => {
    //                     if (childItem.groupName === '自定义标签') {
    //                         this.definedTagId = childItem.groupId
    //                     }
    //                     return {groupId: childItem.groupId.toString(), groupName: childItem.groupName, newOrUpdateCount: childItem.newOrUpdateCount}
    //                 })
    //                 result.push({ parentName:secondChild.groupName,parentId: secondChild.groupId, children: childList })
    //             })
    //         })
    //         this.treeData = result
    //         // this.activeTab = result[0].children[0].groupId
    //         // this.filter.groupId = this.activeTab
    //         this.fetchTagList()
    //     })
    // }
  },
  created () {
    this.$root.$on('label-zone-list-refresh', this.fetchData)
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
.tab-content
    padding 12px
    border 1px dashed #ccc
    margin-bottom 5px
    position relative
    z-index 1
    // &:first-child
    //     margin-top 50px
.label-zone >>> .el-icon-cc-star-fill
    color #E6A13C
.label-zone >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
.label-zone
  margin-top 50px
.title
    font-weight bold
.popover-button
    float right
    margin-bottom 20px
.label-zone >>> .el-tabs__nav-wrap::after
    background none
.label-zone .tab-content >>> .el-tabs__header
   position relative
.label-zone >>> .el-tabs__nav
    white-space normal
.label-zone >>> .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
.label-zone >>> .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
.label-zone >>> .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
.label-zone >>> .el-tabs--top .el-tabs__item.is-top:nth-child(2)
    padding 0 20px
.other-form
    margin-top 50px
.label-zone >>> .el-tabs__active-bar
    display none
.label-zone .tab-content >>> .el-tabs__nav-wrap
    background none
    z-index -9999
.button-add
    display flex
    justify-content flex-end
    margin 0 10px 5px 0
.small-red
    color #ff0000
    font-size 28px
    position absolute
    top 0
.header
    display flex
    justify-content space-between
    margin 10px 0
.search-input
    position relative
    display flex
    width 350px
.icon-fixed
    position absolute
    top 8px
    right 10px
    transform rotate(-90deg)
</style>
