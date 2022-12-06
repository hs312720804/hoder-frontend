<template>
  <div class="label-zone tab-content">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="item in dataList"
          :key="item.id"
          :name="'_'+ item.id"
          :label="item.tagName"
        >
          <!-- <span slot="label">
            {{ item.tagName }}
          </span> -->

          <!-- 为了防止taglist多次执行，所以只显示当前tab下的列表-->
          <template v-if="activeTab === (`_${item.id}`)">
            <AttrListSelect
              :row="row"
              :data-list="tagList"
              :data-source-enum="dataSourceEnum"
              :type-enum="typeEnum"
              :loading="loading"
              :showSelection="true"
              :currentSelectTag="currentSelectTag"
              @table-selected="handleTableSelected"
              >
            </AttrListSelect>
          </template>
        </el-tab-pane>
      </el-tabs>

  </div>
</template>

<script>
import AttrListSelect from './AttrListSelect'
export default {
  name: 'LabelZone',
  components: {
    AttrListSelect
  },
  props: {
    // checkList: {
    //   type: Array
    // },
    // showSelection: {
    //   type: Boolean
    // },
    currentSelectTag: {
      type: Array
    }
  },
  watch: {
    // activeTab: {
    //   handler (val) {
    //     const obj = this.dataList.find(item => item.tagName === val)
    //     this.row = { id: obj.id }
    //   }
    // }
  },

  data () {
    return {
      treeData: [],
      activeTab: undefined,
      // filter: {
      //   pageNum: 1,
      //   pageSize: 300,
      //   groupId: undefined,
      //   tagName: undefined
      // },
      toggleShow: false,
      loading: true,
      // 111111111111111111111111111111
      dataList: [],
      filter: {
        // searchType: 1,
        // tagType: 1,
        pageNum: 1,
        pageSize: 1000,
        condition: ''
        // tagName: undefined
      },
      dataSourceEnum: {},
      typeEnum: {},
      multipleSelection: [],
      dialogVisible: false,
      form: {
        tagName: '',
        tagEnName: '',
        autoVersion: 0,
        remark: ''
      },
      dialogTitle: '',
      totalCount: 0,
      tagCategory: {},
      definedTagId: '',
      tagList: [],
      row: {}
    }
  },

  methods: {
    handleTableSelected (val, mode) {
      this.$emit('get-table-selected', val, mode)
    },
    fetchData () {
      const filter = this.filter
      this.$service.searchModelTag(filter).then(data => {
        const result = data
        this.dataList = result.list.map(item => {
          return {
            ...item,
            tagId: item.id
          }
        }) || []
        this.totalCount = result.total
        if (this.dataList.length > 0) {
          // 默认选择第一个 tab
          this.activeTab = `_${this.dataList[0].id}`
          this.fetchTagList()
        }
      })
    },

    // fetchData () {
    //   this.$service.getNewTreeList().then(data => {
    //     const result = []
    //     data.forEach(item => {
    //       item.children.forEach(secondChild => {
    //         const childList = secondChild.children.map(childItem => {
    //           if (childItem.groupName === '自定义标签') {
    //             this.definedTagId = childItem.groupId
    //           }
    //           return { groupId: childItem.groupId.toString(), groupName: childItem.groupName, newOrUpdateCount: childItem.newOrUpdateCount }
    //         })
    //         result.push({ parentName: secondChild.groupName, newOrUpdateCount: secondChild.newOrUpdateCount, parentId: secondChild.groupId, children: childList })
    //       })
    //     })
    //     this.treeData = result

    //     this.fetchTagList()
    //   })
    // },
    // 搜索可勾选的模型标签
    fetchTagList () {
      // console.log('this.activeTab===', this.activeTab)

      const obj = this.dataList.find(item => {
        const name = `_${item.id}`
        return name === this.activeTab
      })
      // console.log('obj===', obj)
      // const filter = this.filter
      if (obj) {
        this.$service.getModelTag({ modelTagIds: obj.id }).then((data) => {
          this.tagList = data.list || []
          this.dataSourceEnum = data.DataSourceMap
          this.typeEnum = data.tagKey
          this.loading = false
        })
      }
    },
    // fetchTagAllList () {
    //   const filter = JSON.parse(JSON.stringify(this.filter))
    //   filter.groupId = 0
    //   this.$service.getTagGroupTreeList(filter).then((data) => {
    //     this.dataList = data.pageInfo.list
    //     this.dataSourceEnum = data.lableDataSourceEnum
    //     this.typeEnum = data.tagsTypeEnum
    //     this.loading = false
    //   })
    // },
    // 点击模型标签文件夹
    handleTabClick () {
      // // 当前tab再次点击收缩表格
      // if (this.filter.groupId !== this.activeTab) {
      //   this.toggleShow = true
      //   this.filter.groupId = this.activeTab
      //   this.loading = true
      // } else {
      //   this.toggleShow = !this.toggleShow
      //   return
      // }
      // // 切换tab清空搜索框的值
      // this.filter.tagName = undefined
      // // this.dataList = []
      // this.$emit('clear-search')
      // this.$emit('fetch-checkList')
      this.fetchTagList()
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    }
    // handleAddTagCategory () {
    //   this.tagCategory = {
    //     groupId: this.definedTagId
    //   }
    //   this.$refs.tagCategoryUpsert.showCreateDialog = true
    // }

  },
  created () {
    this.$root.$on('big-data-list-refresh', this.fetchData)
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
    &:first-child
        margin-top 50px
.label-zone >>> .el-icon-cc-star-fill
    color #E6A13C
.label-zone >>> .el-button-group
    display flex
    align-items center
    .el-button
        margin 0 5px
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
</style>
