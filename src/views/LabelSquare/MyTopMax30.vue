<template>
  <div class="my-collect">

    <tag-list :data-list="dataList" :data-source-enum="dataSourceEnum" :type-enum="typeEnum"
      :check-list-parent="checkList" :current-selected-tags="currentSelectTag" :show-selection="showSelection"
      :show-delete-btn="true" :show-edit-btn="true" @fetch-data="fetchData" @change-checkList="handleCheckListChange"
      @table-selected="handleTableSelected" @delete="handleDelete" @edit="handleEdit">

    </tag-list>

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
  </div>
</template>

<script>
import tagList from './coms/TagList'
export default {
  name: 'MyCollect',
  components: {
    tagList
  },
  props: {
    tagName: {
      type: String
    },
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
    tagName: function (val) {
      if (val !== undefined) {
        this.filter.tagName = val
        this.fetchData()
      }
    }
  },
  data () {
    return {
      dataList: [],
      filter: {
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
      launchName: '',
      dialogTitle: '',
      totalCount: 0
    }
  },
  methods: {
    // 删除
    handleDelete (id) {
      this.$service.deleteSpecialTagType(id).then(() => {
        this.fetchData()
        this.$message('删除成功')
      })
    },
    handleEdit (row) {
      const { tagId, tagName, tagKey, remark } = row
      this.form.tagId = tagId
      this.form.tagName = tagName
      this.form.tagKey = tagKey
      this.form.remark = remark || ''
      this.dialogTitle = '编辑种类'
      this.dialogVisible = true
    },
    // 新增或编辑组合标签种类
    async handleAddOrEdit () {
      if (this.form.tagId) { // 编辑
        await this.$service.editSpecialTagType(this.form)
      } else { // 新增
        await this.$service.addSpecialTagType(this.form)
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
        tagKey: '',
        remark: ''
      }
      this.dialogTitle = '新增标签'
      this.dialogVisible = true
    },
    fetchData () {
      // const filter = {
      //   ...this.filter,
      //   launchName: this.launchName
      // }
      this.$service.getMytopMax30().then(data => {
        // eslint-disable-next-line
        // const result = data
        this.dataList = data || []
        // this.totalCount = result.pageInfo.total
        // this.dataSourceEnum = result.DataSourceMap
        // this.typeEnum = result.tagKey
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
    this.$root.$on('my-top-list-refresh', this.fetchData)
    this.fetchData()
  },
  beforeDestroy () {
    this.$root.$off('my-top-list-refresh')
  }
}
</script>

<style lang="stylus" scoped>
@import './common.styl'
.search-input
  position relative
  display flex
  width 350px
.header
  display flex
  justify-content space-between
  margin 10px 0
</style>
