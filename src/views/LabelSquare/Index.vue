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
        :defaultDataSourceEnum="dataSourceEnum"
        :launchStatusEnum="launchStatusEnum"
        :current-selected-tags="tagList"
        :type-enum="typeEnum"
        :loading="loading"
        :check-list-parent="checkList"
        :show-selection="showSelection"
        @change-checkList="handleCheckListChange"
        @table-selected="handleGetTableSelectedData"
        :showEditBtn="true"
        :showDeleteBtn="true"
        @delete="handleDelete"
        @edit="handleEdit"
        @get-list="handleSearch"
        @show-add="handleShowAdd"
      >
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
        <BigDataTag v-if="activeName === 'bigDataTag'" :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData"></BigDataTag>
      </el-tab-pane>

      <el-tab-pane label="第三方标签" name="third">
        <third-party-tag
          v-if="activeName === 'third'"
          :dataSourceEnum="dataSourceEnum"
          :typeEnum="typeEnum"
          :checkList="checkList"
          :show-selection="showSelection"
          :currentSelectTag="tagList"
          @clear-search="handleClearSearch"
          @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </third-party-tag>
      </el-tab-pane>

      <el-tab-pane label="自定义标签" name="customTag">
        <custom-tag v-if="activeName === 'customTag'" :checkList="checkList" :show-selection="showSelection" :currentSelectTag="tagList"
          @clear-search="handleClearSearch" @change-checkList="handleCheckListChange"
          @get-table-selected="handleGetTableSelectedData">
        </custom-tag>
      </el-tab-pane>

    </el-tabs>

    <!-- 其他标签 编辑 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form label-position="left" label-width="80px" :model="form">
        <el-form-item label="名称" required>
          <el-input v-model="form.tagName"></el-input>
        </el-form-item>
        <el-form-item label="英文名" required>
          <el-input v-model="form.tagKey"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddOrEdit">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 全局搜索 - 自定义标签 - 自定义标签 编辑 -->
    <TagCategoryUpsert
      v-if="definedTagId !== ''"
      ref="tagCategoryUpsert"
      :current-tag-category="tagCategory"
      :type-enum="typeEnum"
      :data-source-enum="dataSourceEnum"
      :definedTagId="definedTagId"
      @upsert-end="handleSearch"
    >
    </TagCategoryUpsert>

    <!-- 全局搜索 - 编辑本地标签 -->
    <LocalListEdit
      v-if="showAddLocal"
      title="编辑本地标签"
      :localCrowdId="localCrowdId"
      :crowdName="crowdName"
      :editTagId="editTagId"
      @close-add="handleCloseAddForm"
    >
    </LocalListEdit>

    <!-- 全局搜索 - 编辑临时标签 -->
    <!-- {{ showAddTemp }} -->
    <el-dialog :visible.sync="showAddTemp" :show-close="false" width="900px">
      <TempLabelAdd
        v-if="showAddTemp"
        :editLaunchCrowdId="editLaunchCrowdId"
        :editStatus="editStatus"
        :crowdType="2"
        style="margin-top: -30px;"
        @changeStatus="handleRefreshList"
        @cancel-add="showAddTemp = false"
      >
      </TempLabelAdd>
    </el-dialog>
    <!--
    <temp-label-add
      v-if="!showList"
      :editLaunchCrowdId="editLaunchCrowdId"
      :editStatus="editStatus"
      @cancel-add="showList = true"
      @changeStatus="handleRefreshList"
      :crowdType="crowdType"
    >
    </temp-label-add> -->
  </div>
</template>

<script>
import Total from './Total.vue'
import BigDataTag from './bigDataTag/Index.vue'
import ThirdPartyTag from './thirdTag/Index.vue'
import CustomTag from './customTag/Index.vue'
import tagList from './coms/TagList'
import TagCategoryUpsert from '@/views/TagCategory/Upsert.vue'
import LocalListEdit from '@/views/LabelSquare/coms/LocalListEdit.vue'
import TempLabelAdd from '@/views/LabelSquare/customTag/tempLabel/TempLabelAdd.vue'
export default {
  name: 'crowdCompute',
  components: {
    Total,
    BigDataTag,
    ThirdPartyTag,
    CustomTag,
    tagList,
    TagCategoryUpsert,
    LocalListEdit,
    TempLabelAdd
  },
  data () {
    return {
      // ------全局搜索 - 编辑临时标签 -------
      showAddTemp: false,
      editLaunchCrowdId: '',
      editStatus: '',
      // ------全局搜索 - 编辑临时标签  end-----

      // // ------全局搜索 - 编辑本地标签 -------
      showAddLocal: false, // 弹窗
      localCrowdId: '',
      crowdName: '',
      editTagId: null,
      // // ------全局搜索 - 编辑本地标签  end-----

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
      tempCheckList: [],
      // ---------编辑弹窗----------
      dialogVisible: false,
      form: {
        tagName: '',
        tagKey: '',
        remark: ''
      },
      dialogTitle: '',
      // ---------自定义编辑弹窗----------

      tagCategory: {},
      definedTagId: '',
      launchStatusEnum: {}
      // ------------------------
    }
  },
  methods: {
    getDataSourceList () {
      this.$service.getDatasource().then((data) => {
        this.dataSourceEnum = data || {}
      })
    },
    getTagType () {
      this.$service.getTagType().then((data) => {
        this.typeEnum = data || {}
      })
    },
    handleRefreshList () {
      this.showAddTemp = false
      // this.refreshFlag = true
      // 重新刷新
      this.handleSearch()
    },
    handleCloseAddForm () {
      this.showAddLocal = false
      // 重新刷新
      this.handleSearch()
    },
    // <!-- 全局搜索 - 编辑临时标签、本地标签 -->
    handleShowAdd (localCrowdId, crowdName, type) {
      if (type === 'tempCrowd') {
        // 临时标签
        this.showAddTemp = true
        this.editLaunchCrowdId = localCrowdId
        this.editStatus = crowdName
      } else {
        // 本地标签
        // console.log('localCrowdId, crowdName-->', localCrowdId, crowdName)
        this.showAddLocal = true
        this.refreshFlag = false
        this.localCrowdId = localCrowdId
        this.crowdName = crowdName
        this.editTagId = this.dataList.find(item => item.launchCrowdId === localCrowdId).tagId || null
      }
    },
    // --------全局搜索标签，删除----------
    // 删除
    handleDelete (id) {
      this.$service.deleteSpecialTagType(id).then(() => {
        // this.fetchData()
        // 重新刷新
        this.handleSearch()
        this.$message('删除成功')
      })
    },
    handleEdit (row) {
      const { tagId, tagName, tagKey, remark, dataSource } = row

      // 自定义标签，编辑比较特殊
      if (dataSource === 1) {
        this.handleCustomTagEdit(row)
      } else {
        this.form.tagId = tagId
        this.form.tagName = tagName
        this.form.tagKey = tagKey
        this.form.remark = remark || ''
        this.dialogTitle = '编辑种类'
        this.dialogVisible = true
      }
    },
    // <!-- 自定义标签 - 自定义标签 编辑 -->
    handleCustomTagEdit (row) {
      const {
        tagId,
        groupId,
        oldGroup,
        tagName,
        tagKey,
        tagType,
        tagUnit,
        remark,
        dataSource,
        thirdPartyApiId,
        mapThirdPartyApiField
      } = row
      this.definedTagId = groupId
      const params = {
        id: tagId
      }
      this.$service.readTagCategory(params).then((data) => {
        // this.dataSourceEnum = data.dataSourceEnum
        // this.typeEnum = data.typeEnum
        this.tagCategory = data.tagCategory
        this.$refs.tagCategoryUpsert.showCreateDialog = true
      })
    },
    // 新增或编辑组合标签种类
    async handleAddOrEdit () {
      if (this.form.tagId) { // 编辑
        await this.$service.editSpecialTagType(this.form)
      } else { // 新增
        await this.$service.addSpecialTagType(this.form)
      }
      // 重新刷新
      this.handleSearch()
      this.dialogVisible = false
      this.$message.success('保存成功')
    },
    // --------全局搜索标签，标签的修改、删除方法 end ----------
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
        groupId: 0,
        total: undefined
      }

      this.$service.getTagGroupTreeList(filter).then((data) => {
        this.dataList = data.pageInfo.list
        // this.dataSourceEnum = data.lableDataSourceEnum
        // this.typeEnum = data.tagsTypeEnum
        this.launchStatusEnum = data.launchStatusEnum
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
    this.getDataSourceList() // 数据来源字典
    this.getTagType() // 数据类型字典：bool: "布尔型" boolean: "布尔型" collect: "数据集"crowd: "人群标签"mix: "特定标签"number: "数字型"string: "字符型"time: "时间型"
  }

}
</script>

<style lang="stylus" scoped>
@import './common.styl'
.pagination
  float: right;
  padding: 10px 0;

</style>
