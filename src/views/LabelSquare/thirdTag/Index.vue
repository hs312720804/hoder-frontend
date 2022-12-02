<template>
  <div class="my-collect">
      <div class="search-input">
          <el-input
              placeholder="支持按标签名、ID搜索"
              class="header-input"
              v-model="filter.tagName"
              @keyup.enter.native="fetchData"
          ></el-input>
          <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
      </div>

      <el-tabs
        v-if="showTypeTab"
        v-model="activeName"
        @tab-click="handleTabChange"
        class="label-content-wrap"
      >
        <el-tab-pane v-for="item in typeTabsList" :label="item.groupName" :name="item.groupName" :key="item.groupName" >
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
            @edit="handleEdit"
          >
            <div align="right">
              <pagination
                  :currentpage="filter.pageNum"
                  :pagesize="filter.pageSize"
                  :totalcount="totalCount"
                  @handle-size-change="handleSizeChange"
                  @handle-current-change="handleCurrentChange"
              ></pagination>
            </div>
          </tag-list>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="500px">
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
import tagList from '../coms/TagList.vue'
export default {
  name: 'MyCollect',
  components: {
    tagList
  },
  props: {
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
        searchType: 1,
        tagType: 2,
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
      typeTabsList: [],
      activeName: '',
      showTypeTab: true
    }
  },
  methods: {
    handleTabChange () {
      this.filter.tagName = this.activeName
      this.fetchData()
    },
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
    async fetchData () {
      debugger
      // 搜索时名称为空时，默认赋值为类型第一个
      if (!this.filter.tagName && this.typeTabsList.length > 0) {
        this.filter.tagName = this.typeTabsList[0].groupName
        this.activeName = this.typeTabsList[0].groupName
      }
      console.log('this.typeTabsList1111====>', this.typeTabsList)
      this.showTypeTab = !!this.typeTabsList.find(item => item.groupName === this.filter.tagName) // 搜索时隐藏类型tab

      const filter = this.filter
      this.$service.searchByGroup(filter).then(data => {
        const result = data
        this.dataList = result.pageInfo.list
        this.totalCount = result.pageInfo.total
        this.dataSourceEnum = result.DataSourceMap
        this.typeEnum = result.tagKey
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
    },
    async fetchTypeData () {
      const typeFilter = {
        searchType: 2,
        tagType: 2,
        pageNum: 1,
        pageSize: 10
      }

      this.typeTabsList = await this.$service.searchByGroup(typeFilter)
      console.log('this.typeTabsList====>', this.typeTabsList)
      this.filter.tagName = this.typeTabsList[0].groupName
      this.activeName = this.typeTabsList[0].groupName
    }
  },
  async created () {
    this.$root.$on('third-tag-list-refresh', this.fetchData)
    console.log(1)
    await this.fetchTypeData()
    console.log(2)
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
@import '../common.styl'

</style>
