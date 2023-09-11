<template>
  <div class="my-collect">
    <!-- <div class="header">
      <div v-if="!showSelection">
        <el-button @click="handleAdd" type="primary">
          新建
        </el-button>
      </div>
      <div v-else></div>
      标签分类搜索
      <div class="search-input">
        <el-input placeholder="支持按标签名搜索" class="header-input" v-model="launchName"
          @keyup.enter.native="fetchData"></el-input>
        <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
      </div>
    </div> -->
    <tag-list
      :data-list="dataList"
      :check-list-parent="checkList"
      :current-selected-tags="currentSelectTag"
      :show-selection="showSelection"
      :show-delete-btn="true"
      :show-edit-btn="true"
      @fetch-data="fetchData"

      @delete="handleDelete"
      @edit="handleEdit">
      <div align="right">
        <pagination :currentpage="filter.pageNum" :pagesize="filter.pageSize" :totalcount="totalCount"
          @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange"></pagination>
      </div>
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
    activeName: {
      type: String
    }
  },
  watch: {
    activeName: function (val) {
      if (val !== undefined) {
        this.filter.source = val
        this.filter.pageNum = 1
        this.filter.pageSize = 10
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
        source: 'iqiyi'
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
    fetchData () {
      // const filter = this.filter
      const filter = {
        ...this.filter,
        source: this.activeName
      }
      this.$service.getAiCrowd(filter).then(data => {
        // eslint-disable-next-line
        // debugger
        const result = data
        this.dataList = result.pageInfo.list
        this.totalCount = result.pageInfo.total

        console.log('this.dataList--->', this.dataList)
      })
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
    this.fetchData()
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
