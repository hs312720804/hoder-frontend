<template>
  <div class="my-collect">
    <div class="header">
      <div v-if="!showSelection">
        <el-button @click="handleAdd" type="primary">
          新建
        </el-button>
      </div>
      <div v-else></div>
      <!-- 标签分类搜索 -->
      <!-- <div class="search-input">
        <el-input placeholder="支持按标签名、ID搜索" class="header-input" v-model="filter.tagName"
          @keyup.enter.native="fetchData"></el-input>
        <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
      </div> -->
    </div>
    <tag-list
      :data-list="dataList"
      :data-source-enum="dataSourceEnum"
      :type-enum="typeEnum"
      :check-list-parent="checkList"
      :current-selected-tags="currentSelectTag"
      :show-selection="showSelection"
      :show-delete-btn="true"
      :showEditBtn="true"
      @fetch-data="fetchData"
      @change-checkList="handleCheckListChange"
      @table-selected="handleTableSelected"
      @delete="handleDelete"
      @edit="handleEdit">
      <div align="right">
        <pagination :currentpage="filter.pageNum" :pagesize="filter.pageSize" :totalcount="totalCount"
          @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange"></pagination>
      </div>
    </tag-list>

    <TagCategoryUpsert
      v-if="definedTagId"
      ref="tagCategoryUpsert"
      :current-tag-category="tagCategory"
      :type-enum="typeEnum"
      :data-source-enum="dataSourceEnum"
      :definedTagId="definedTagId"
      @upsert-end="fetchData"
    >
    </TagCategoryUpsert>
  </div>
</template>

<script>
import tagList from '../coms/TagList.vue'
import TagCategoryUpsert from '@/views/TagCategory/Upsert.vue'
export default {
  name: 'MyCollect',
  components: {
    tagList,
    TagCategoryUpsert
  },
  props: {
    // tagName: {
    //     type: String
    // },
    checkList: {
      type: Array
    },
    currentSelectTag: {
      type: Array
    },
    showSelection: {
      type: Boolean
    }
  },

  data () {
    return {
      dataList: [],
      filter: {
        searchType: 1,
        tagType: 1,
        pageNum: 1,
        pageSize: 10,
        tagName: undefined
      },
      dataSourceEnum: {},
      typeEnum: {},
      multipleSelection: [],
      dialogVisible: false,
      form: {
        tagName: '',
        tagKey: '',
        remark: ''
      },
      dialogTitle: '',
      totalCount: 0,
      tagCategory: {},
      definedTagId: ''
    }
  },
  methods: {
    // 删除
    handleDelete (id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.deleteTagCategory({ tagId: id }, '删除成功').then(() => {
          this.fetchData()
        })
      })
    },
    handleEdit (row) {
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
      // this.form.tagId = tagId
      // this.form.tagName = tagName
      // this.form.tagKey = tagKey
      // this.form.remark = remark || ''
      // this.dialogTitle = '编辑种类'
      // this.dialogVisible = true
      this.tagCategory = {
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
      }

      this.$refs.tagCategoryUpsert.showCreateDialog = true
    },
    // 新增或编辑组合标签种类
    // async handleAddOrEdit () {
    //   if (this.form.tagId) { // 编辑
    //     await this.$service.editSpecialTagType(this.form)
    //   } else { // 新增
    //     await this.$service.addSpecialTagType(this.form)
    //   }
    //   this.fetchData()
    //   this.dialogVisible = false
    //   this.$message.success('保存成功')
    // },
    // 新增组合标签
    handleAdd () {
      // // 数据置空，否则会残留编辑的数据
      // this.form = {
      //   tagName: '',
      //   tagKey: '',
      //   remark: ''
      // }
      // this.dialogTitle = '新增种类'
      // this.dialogVisible = true
      this.tagCategory = {}
      this.$refs.tagCategoryUpsert.showCreateDialog = true
    },
    fetchData () {
      const filter = this.filter
      this.$service.searchByGroup(filter).then(data => {
        // eslint-disable-next-line
        // debugger
        const result = data
        this.dataList = result.pageInfo.list
        this.totalCount = result.pageInfo.total
        this.dataSourceEnum = result.DataSourceMap
        this.typeEnum = result.tagKey
        this.definedTagId = result.groupId
      })
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleTableSelected (val, mode) {
      this.$emit('get-table-selected', val, mode)
    },

    // 每页显示数据量变更, 如每页显示10条变成每页显示20时, val=20
    handleSizeChange (val) {
      this.filter.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.filter.pageNum = 1
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.filter.pageNum = val
      this.fetchData()
    }

  },
  created () {
    this.$root.$on('custom-tag-list-refresh', this.fetchData)
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
@import '../common.styl'
.search-input
  position relative
  display flex
  width 350px
.header
  display flex
  justify-content space-between
  margin 10px 0
</style>
