<template>
    <!-- 投放分析（旧） -->
    <div class="label-content">
        <el-tabs
          v-model="activeName"
          @tab-click="handleTabChange"
        >
            <el-tab-pane label="影视" name="影视"></el-tab-pane>
            <!-- <el-tab-pane label="教育" name="教育"></el-tab-pane>
            <el-tab-pane label="少儿" name="少儿"></el-tab-pane> -->
            <el-tab-pane label="亲子" name="亲子"></el-tab-pane>
        </el-tabs>
        <tab-page
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          :typeTabsList="typeTabsList"
          :businessType="activeName"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"
        >
        </tab-page>
    </div>
</template>

<script>
import TabPage from './TabPage'

export default {
  name: 'labelSquareAA',
  components: {
    TabPage
  },
  data () {
    return {
      activeName: '影视',
      searchVal: '',
      labelZoneTagName: undefined,
      myCollectTagName: undefined,
      checkList: [],
      tagList: [],
      // dataSourceColorEnum: {
      //   1: 'success',
      //   2: 'danger',
      //   3: '',
      //   5: 'warning'
      // },
      showSelection: false,
      tempCheckList: [],
      typeTabsList: [
        {
          groupName: '流量CTR',
          value: 'ctr'
        },
        {
          groupName: '产品包成交',
          value: 'package'
        },
        {
          groupName: '活跃成交',
          value: 'active'
        },
        {
          groupName: '起播数据',
          value: 'tv'
        },
        {
          groupName: '观影TOP20影片',
          value: 'top20'
        },
        {
          groupName: '观影分类',
          value: 'category'
        }
      ]
    }
  },
  methods: {
    handleSearch () {
      // 全局搜索
      // if (this.activeName === 'labelZone') {
      //   this.labelZoneTagName = this.searchVal
      // } else {
      //   this.myCollectTagName = this.searchVal
      // }
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

    handleTabChange () {
      switch (this.activeName) {
        case 'labelZone':
          // 刷新标签广场页
          this.fetchCheckListData()
          this.$root.$emit('label-zone-list-refresh')
          break
      }
    },
    handleGetTableSelectedData (val, mode) {
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
    removeTag (tag) {
      // const addForm = this.addForm
      // addForm.conditionTagIds = addForm.conditionTagIds.filter(tagId => tagId !== tag.tagId)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
    },
    // fetchTempCheckListData () {
    //   this.$service.getListDimension({ type: 5 }).then(data => {
    //     if (data) {
    //       if (data.behaviorShow) {
    //         this.tempCheckList = data.behaviorShow.split(',')
    //       } else {
    //         this.tempCheckList = ['defineRemark']
    //       }
    //     } else {
    //       this.tempCheckList = ['defineRemark']
    //     }
    //   })
    // },
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 4, behaviorShow: val.join(',') })
    },
    handleTempCheckListChange (val) {
      this.$service.saveListDimension({ type: 5, behaviorShow: val.join(',') })
    }
  },
  created () {
    // this.fetchCheckListData()
    // this.fetchTempCheckListData()
  }
}
</script>

<style lang="stylus" scoped>
.label-content
    position relative
.search-input
    position fixed
    top 118px
    right 35px
    width 350px
    z-index 999
    .icon-fixed
      position absolute
      top 8px
      right 10px
      transform rotate(-90deg)
.label-content >>> .el-tabs__header
    position fixed
    width 100%
    z-index 999
.label-content >>> .el-tabs__nav-wrap
    background #fff
    z-index 999
    margin-top: -20px;
    padding-top: 20px;
</style>
