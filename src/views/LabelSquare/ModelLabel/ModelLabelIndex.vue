<template>
  <div class="my-collect">
    <div class="header">
      <div v-if="!showSelection">
        <el-button @click="handleAdd" type="primary">
          新建
        </el-button>
      </div>
      <div class="search-input">
        <el-input
          placeholder="支持按人群名、ID搜索"
          class="header-input"
          v-model="filter.tagName"
          @keyup.enter.native="fetchData"></el-input>
        <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
      </div>
    </div>
    <!-- {{dataList}} -->
    <tag-list
      :data-list="dataList"
      :data-source-enum="dataSourceEnum"
      :type-enum="typeEnum"
      :check-list-parent="checkList"
      :current-selected-tags="currentSelectTag"
      :show-selection="showSelection"
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form label-position="left" label-width="120px" :model="form">
        <el-form-item label="名称" required>
          <el-input v-model="form.tagName"></el-input>
        </el-form-item>
        <el-form-item label="英文名" required>
          <el-input v-model="form.tagEnName"></el-input>
        </el-form-item>
        <el-form-item label="是否每日更新" prop="autoVersion" required>
          <el-radio-group v-model="form.autoVersion">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddOrEdit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tagList from './TagList.vue'
// import TagCategoryUpsert from '../TagCategory/Upsert.vue'
export default {
  name: 'MyCollect',
  components: {
    tagList
    // TagCategoryUpsert
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
  watch: {
    // 'tagName': function (val) {
    //     if (val !== undefined) {
    //         this.filter.tagName = val
    //         this.fetchData()
    //     }
    // }
  },
  data () {
    return {
      dataList: [],
      filter: {
        // searchType: 1,
        // tagType: 1,
        pageNum: 1,
        pageSize: 10,
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
      definedTagId: ''
    }
  },
  methods: {
    // 删除
    handleDelete (id) {
      this.$service.deleteModelTag(id, '删除成功').then(() => {
        this.fetchData()
      })
    },
    handleEdit (row) {
      const { id, tagName, tagEnName, autoVersion, remark } = row
      this.form.id = id
      this.form.tagName = tagName
      this.form.tagEnName = tagEnName
      this.form.autoVersion = autoVersion
      this.form.remark = remark || ''
      this.dialogTitle = '编辑模型标签'
      this.dialogVisible = true
    },
    // 新增或编辑组合标签种类
    async handleAddOrEdit () {
      if (this.form.id) { // 编辑
        await this.$service.editModelTag(this.form)
      } else { // 新增
        await this.$service.addModelTag(this.form)
      }
      this.fetchData()
      this.dialogVisible = false
      this.$message.success('保存成功')
    },
    // 新增组合标签
    handleAdd () {
      // 数据置空，否则会残留编辑的数据
      this.form = {
        tagName: '',
        tagEnName: '',
        autoVersion: 0,
        remark: ''
      }
      this.dialogTitle = '新增模型标签'
      this.dialogVisible = true
    },
    fetchData () {
      const filter = this.filter
      this.$service.searchModelTag(filter).then(data => {
      // this.$service.searchByGroup(filter).then(data => {
        // eslint-disable-next-line
        // debugger
        const result = data
        this.dataList = result.records
        this.totalCount = result.total
        // this.dataSourceEnum = result.DataSourceMap
        // this.typeEnum = result.tagKey
        // this.definedTagId = result.groupId
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
    this.$root.$on('model-tag-list-refresh', this.fetchData)
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
    .my-collect >>> .el-icon-cc-star-fill
        color #E6A13C
    .my-collect >>> .el-button-group
        display flex
        align-items center
        .el-button
            margin 0 5px
    .my-collect
        margin-top 50px
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
