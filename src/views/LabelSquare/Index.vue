<template>
  <div id="label-square">
    <div class="search-all-input">
      <el-input v-model="searchAllVal" clearable placeholder="支持按标签名、Code、描述全局搜索" @keyup.enter.native="handleSearch" style="width: 350px">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      <el-button plain @click="handleReset" style="margin-left: 10px" >
        重置
      </el-button>
    </div>

    <!-- 全局搜索 -->
    <div class="other-form" v-if="!!filter.tagName" style="padding-top: 45px">
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

    <el-tabs v-else v-model="activeName" @tab-click="handleTabChange" class="label-square-tabs">
      <el-tab-pane label="统计" name="total">
        <Total></Total>
      </el-tab-pane>

      <el-tab-pane label="大数据标签" name="bigDataTag">
        <BigDataTag :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"></BigDataTag>
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

    </el-tabs>

  </div>
</template>

<script>
import Total from './Total.vue'
import BigDataTag from './bigDataTag/Index.vue'
import ThirdPartyTag from './thirdTag/Index.vue'
import CustomTag from './customTag/Index.vue'
import tagList from './coms/TagList'

export default {
  name: 'crowdCompute',
  components: {
    Total,
    BigDataTag,
    ThirdPartyTag,
    CustomTag,
    tagList
  },
  data () {
    return {
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

      activeName: 'total',
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
      tempCheckList: []
    }
  },
  methods: {
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
        this.dataList = data.pageInfo.list
        this.dataSourceEnum = data.lableDataSourceEnum
        this.typeEnum = data.tagsTypeEnum
        this.loading = false
        this.pagination.total = data.pageInfo.total
      })
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
    // handleTabChange () {
    //   switch (this.activeName) {
    //     case 'labelZone':
    //       // 刷新标签广场页
    //       this.fetchCheckListData()
    //       this.$root.$emit('label-zone-list-refresh')
    //       break
    //     case 'myCollect':
    //       // 刷新我的收藏
    //       this.fetchCheckListData()
    //       this.$root.$emit('my-collect-list-refresh')
    //       break
    //     case 'tempLabel':
    //       // 临时标签
    //       this.fetchTempCheckListData()
    //       this.$root.$emit('temp-label-list-refresh-2')
    //       break
    //     case 'specialTag':
    //       // 刷新组合标签
    //       this.fetchCheckListData()
    //       this.$root.$emit('special-tag-list-refresh')
    //       break
    //     case 'localLabel':
    //       // 本地标签
    //       this.fetchTempCheckListData()
    //       this.$root.$emit('local-label-list-refresh')
    //       break
    //     case 'behaviorLabel':
    //       // 行为标签
    //       this.fetchTempCheckListData()
    //       this.$root.$emit('temp-label-list-refresh-3')
    //       break
    //     case 'bankLabel':
    //       // 数据银行标签
    //       this.fetchTempCheckListData()
    //       this.$root.$emit('temp-label-list-refresh-4')
    //       break
    //     case 'customTag':
    //       // 自定义标签
    //       this.fetchTempCheckListData()
    //       this.$root.$emit('custom-tag-list-refresh')
    //       break
    //     case 'ThirdPartyTag':
    //       // 自定义标签
    //       this.fetchTempCheckListData()
    //       this.$root.$emit('third-tag-list-refresh')
    //       break
    //     case 'modelLabel':
    //       // 模型标签
    //       // this.fetchListData()
    //       this.$root.$emit('model-tag-list-refresh')
    //       break
    //     case 'crowdLabel':
    //       // 人群标签
    //       // this.fetchListData()
    //       this.$root.$emit('crowd-label-list-refresh')
    //       break
    //   }
    // },
    handleClearSearch () {
      this.searchVal = undefined
      this.labelZoneTagName = undefined
      this.myCollectTagName = undefined
    },
    handleCheckListChange (val) {
      this.$service.saveListDimension({ type: 4, behaviorShow: val.join(',') })
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
    }
  },
  created () {
    this.fetchCheckListData()
    this.fetchTempCheckListData()
  }

}
</script>

<style lang="stylus" scoped>
@import './common.styl'
.pagination
  float: right;
  padding: 10px 0;

</style>
