<template>
  <div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabChange"
    >
      <el-tab-pane label="统计" name="total">
        <Total
        ></Total>
      </el-tab-pane>

      <el-tab-pane label="大数据标签" name="bigDataTag">
        <BigDataTag
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"
        >
        </BigDataTag>
      </el-tab-pane>

      <el-tab-pane label="第三方标签" name="third">
        <third-party-tag
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"
        >
        </third-party-tag>
      </el-tab-pane>

      <el-tab-pane label="自定义标签" name="customTag">
        <custom-tag
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"
        >
        </custom-tag>
      </el-tab-pane>

    </el-tabs>

    <div v-if="showSelection">
      <div>已选标签：</div>
      <el-tag
        v-for="(item, index) in tagList"
        :key="item.tagId + '_' + index"
        :type="dataSourceColorEnum[item.dataSource]"
        closable @close="removeTag(item)">
        {{ item.tagName }}
      </el-tag>
    </div>

  </div>
  </template>

<script>
import Total from './Total.vue'
import BigDataTag from './bigDataTag/Index.vue'
import ThirdPartyTag from './thirdTag/Index.vue'
import CustomTag from './customTag/Index.vue'

export default {
  name: 'crowdCompute',
  components: {
    Total,
    BigDataTag,
    ThirdPartyTag,
    CustomTag
  },
  data () {
    return {
      activeName: 'total',
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
      tempCheckList: []
    }
  },
  methods: {
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

  </style>
