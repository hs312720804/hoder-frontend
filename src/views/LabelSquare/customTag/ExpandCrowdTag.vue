<template>

<!-- <div>
  <el-button @click="handleAdd" type="primary">新增</el-button>
</div> -->
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
    <div class="search-input">
      <el-input
        v-model="searchForm.search"
        placeholder="请输入"
        @keyup.enter.native="fetchData"
      >
        <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
      </el-input>
    </div>

  </div>
  <!-- <div class="header-wrap">

    <div class="search-input">
      <el-input
        v-model="searchForm.keywords"
        placeholder="请输入"
        @keyup.enter.native="fetchData"
      >
        <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
      </el-input>
    </div>

    <el-button
      type="primary"
      size="small"
      @click="handleAdd"
    >
      <a class="fa fa-plus" style="color: white;"></a>新增
    </el-button>

  </div> -->

  <!-- <c-table
    class="list-table"
    :props="table.props"
    :header="table.header"
    :data="table.data"
  >
  </c-table> -->
  <el-table
    ref="changeTable"
    :data="table.data"
    border
    @select="handleSelectOrCancel"
    @select-all="handleSelectAllOrCancel">
    <el-table-column type="selection" width="55" v-if="showSelection"></el-table-column>
    <el-table-column prop="launchCrowdId" label="ID"></el-table-column>
    <el-table-column prop="launchName" label="人群标签名" width="120"></el-table-column>
    <el-table-column prop="remark" label="描述" width="180"></el-table-column>
    <el-table-column prop="count" label="数量">
      <template slot-scope="scope">
        {{ cc_format_number(scope.row.history.totalMac)  }}
      </template>
    </el-table-column>
    <el-table-column prop="count" label="原始数量">
      <template slot-scope="scope">
        {{ cc_format_number(scope.row.history.totalMac)  }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="150">
      <template slot-scope="scope">
        <CrowdStatus
          :history="scope.row.history"
          :launchStatusEnum="launchStatusEnum"
        ></CrowdStatus>
      </template>
    </el-table-column>
    <el-table-column prop="creatorName" label="创建人" >
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" >
    </el-table-column>

    <el-table-column label="操作" width="120" v-if="!showSelection" fixed="right">
      <template slot-scope="scope">
        <el-button-group>
          <el-button type="text" @click="handleOffSet(scope)">
            {{ scope.row.onOffCrowd ? '下架' : '上架'}}
          </el-button>
          <el-button type="text" @click="handleDelete(scope)">
            删除
          </el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>

  <div align="right">
    <pagination
      :currentpage="pagination.page"
      :pagesize="pagination.pageSize"
      :totalcount="pagination.total"
      @handle-size-change="handleSizeChange"
      @handle-current-change="handleCurrentChange"
    ></pagination>
  </div>

  <el-dialog title="新建人群扩充" :visible.sync="dialogFormVisible" width="600px">
    <!-- {{ form }} -->
    <el-form :model="form" :label-width="formLabelWidth" :rules="rules" ref="ruleForm">
      <el-form-item label="选择原始人群/标签：" prop="historyCrowdId" >
        <!-- <el-input v-model="form.historyCrowdId" autocomplete="off" placeholder="请搜索选择"></el-input> -->

        <el-select
          style="width: 300px"
          v-model="form.historyCrowdId"
          filterable
          remote
          placeholder="请搜索选择行为人群、临时人群、本地人群  "
          clearable
          :remote-method="qiBoRemoteMethod"
          :loading="getCrowdListLoading"
          v-loadmore="{'methord': handelQiboLoadmore}"
        >
          <el-option
            v-for="item in crowdList"
            :value="item.value"
            :label="item.value + '-' + item.name"
            :key="item.value"
          ></el-option>
        </el-select>
        <span v-if="form.historyCrowdId" class="tip-text">数量：{{ cc_format_number(selectedCrowd.totalUser) }}</span>

      </el-form-item>
      <el-form-item label="扩充至：" prop="extendNum">
        <el-input-number
          v-model.number="form.extendNum"
          autocomplete="off"
          placeholder="请输入正整数"
          style="width: 150px"
          clearable
          :min="100"
          :max="3000"
          @mousewheel.native.prevent
          @keyup.native="prevent($event)"
          @change="handleExtendNumChange"
        >
        <!-- @input="validateInput" -->
        <!-- :max="3000" -->
        <!-- @mousewheel.native.prevent
          @keyup.native="prevent($event)" -->
        </el-input-number> 万
        <!-- <el-input-number
          v-model.number="form.extendNum"
          placeholder="请输入"
          :min="1"
          :max="10">
        </el-input-number> -->
      </el-form-item>
      <el-form-item label="扩充后人群命名：" prop="launchName">
        <el-input
          v-model="form.launchName"
          autocomplete="off"
          placeholder="xxxxx扩充至xx万"
          style="width: 300px"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="人群描述：" prop="remark" >
        <el-input
          type="text"
          v-model="form.remark"
          autocomplete="off"
          placeholder="请输入至少五个字符"
          style="width: 300px"
          clearable
          minlength="5">
        </el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import CrowdStatus from '@/views/crowdCompute/components/crowdStatus.vue'
export default {
  name: 'peoplePositionList',
  components: { CrowdStatus },
  data () {
    const checkCrowd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择'))
      }
      this.selectedCrowd = this.crowdList.find(item => {
        return item.value === value
      }) || {}
      this.form.launchName = `${this.selectedCrowd.name}扩充至${this.form.extendNum}万`

      if (this.selectedCrowd.totalUser < 100 || this.selectedCrowd.totalUser > 30000000) {
        callback(new Error('数量不可少于100，不可多于3千万'))
      }
      callback()
    }
    return {
      selectedCrowd: {
        totalUser: 0
      },
      rules: {
        historyCrowdId: [
          // { required: true, message: '请选择', trigger: 'change' },
          { validator: checkCrowd, trigger: 'change' }
        ],
        extendNum: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        launchName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      searchForm: {
        search: ''
      },
      form: {},
      formLabelWidth: '155px',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      table: {
        props: { 'row-class-name': this.tableRowClassName },
        header: [
          {
            label: 'id',
            prop: 'launchCrowdId'
          },
          {
            label: '人群标签名',
            prop: 'launchName'
          },
          {
            label: '描述',
            prop: 'remark'
          },
          {
            label: '数量',
            render: (h, { row }) => {
              return this.cc_format_number(row.history.totalMac)
            }
          },
          {
            label: '原始数量',
            render: (h, { row }) => {
              return this.cc_format_number(row.history.totalMac)
            }
          },
          {
            label: '状态',
            // prop: 'status',
            render: (h, { row }) => {
              return h(CrowdStatus, {
                props: {
                  history: row.history,
                  launchStatusEnum: this.launchStatusEnum
                }
              })
            }
          },
          {
            label: '创建人',
            prop: 'creatorName'
          },
          {
            label: '创建时间',
            prop: 'createTime'
          },
          {
            label: '操作',
            fixed: 'right',
            render: (h, params) => {
              const createBtn = (label, method, permission) => {
                return h('el-button', {
                  // directives: [
                  //   {
                  //     name: 'permission',
                  //     value: permission
                  //   }
                  // ],
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this[method](params)
                    }
                  }
                }, label)
              }
              return h('div', null, [
                createBtn(params.row.onOffCrowd ? '下架' : '上架', 'handleOffSet'),
                createBtn('删除', 'handleDelete')
              ])
            }

          }

        ],
        data: [],
        selected: [],
        selectionType: 'none'
      },
      // showViewEffect: false,
      currentRow: {},
      // --------
      getCrowdListLoading: false,
      crowdList: [],
      getCrowdListParams: {
        pageNum: 1,
        pageSize: 100,
        crowdType: 1, // 固定为1
        launchName: ''
      },
      getCrowdListQuery: '',
      launchStatusEnum: {}
    }
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    currentSelectTag: {
      type: Array
    }
  },
  watch: {
    currentSelectTag: 'updateTableSelected'
    // checkListParent: function (val) {
    //   this.checkList = val
    // }
  },
  methods: {
    // // 限制正整数输入
    // validateInput (value) {
    //   value = value.replace(/[^0-9]/g, '')
    //   if (value.indexOf(0) == 0) {
    //     value = ''
    //   }
    // },
    // selectOriginCrowd (id) {
    //   this.selectedCrowd = this.crowdList.find(item => {
    //     return item.value === id
    //   }) || {}
    // },
    handleExtendNumChange (value) {
      this.form.launchName = `${this.selectedCrowd.name}扩充至${this.form.extendNum}万`
    },
    prevent (e) {
      const keynum = window.event ? e.keyCode : e.which // 获取键盘码
      if (keynum === 189 || keynum === 190 || keynum === 109 || keynum === 110) {
        this.$message.warning('禁止输入小数以及负数')
        e.target.value = ''
      }
    },
    updateTableSelected () {
      const dataList = this.table.data
      const arr = []
      const currentSelectRows = this.currentSelectTag
      dataList.forEach((item, index) => {
        currentSelectRows.forEach((i) => {
          if (Number(item.tagId) === Number(i.tagId)) {
            arr.push(dataList[index])
          }
        })
      })
      if (arr.length > 0) {
        // 如果存在，则先清空选中，再赋值
        this.$nextTick(() => {
          this.$refs.changeTable.clearSelection()
          arr.forEach(row => {
            this.$refs.changeTable.toggleRowSelection(row, true)
          })
        })
      } else {
        this.$refs.changeTable.clearSelection()
      }
    },
    handleSelectOrCancel (select, row) {
      const selectedFlag = select.length && select.indexOf(row) !== -1
      // true就是选中，0或者false是取消选中
      if (selectedFlag) {
        this.$refs.changeTable.toggleRowSelection(row, true)
        this.$emit('get-table-selected', row, 'add')
      } else {
        this.$refs.changeTable.toggleRowSelection(row, false)
        this.$emit('get-table-selected', row, 'del')
      }
    },
    handleSelectAllOrCancel (select) {
      // 当select长度为0，则是取消全选，否则是全选
      const data = this.itemList
      if (select.length === 0) {
        for (let i = 0; i < data.length; i++) {
          this.$emit('get-table-selected', data[i], 'del')
        }
      } else {
        for (let j = 0; j < data.length; j++) {
          this.$emit('get-table-selected', data[j], 'add')
        }
      }
    },
    // 起播行为影片搜索更多
    handelQiboLoadmore () {
      this.getCrowdListParams.pageNum++ // 滚动加载翻页
      this.qiBoRemoteMethod(this.getCrowdListQuery)
    },

    qiBoRemoteMethod (query) {
      // 重新查询，不是滚动加载
      if (this.getCrowdListQuery !== query) {
        this.crowdList = []
        this.getCrowdListParams.pageNum = 1 // 页码归1
      }

      // if (query !== '') {
      this.getCrowdListLoading = true

      this.getCrowdListParams.launchName = query || ''

      this.$service.getTempLaunchList(this.getCrowdListParams).then(data => {
        this.getCrowdListLoading = false
        this.getCrowdListQuery = query // 记录查询关键字，滚动加载时要用到
        let list = data.pageInfo.list

        list = list.map(obj => {
          return {
            name: obj.launchName,
            value: obj.versionId,
            totalUser: obj.totalUser
          }
        })
        this.crowdList.push(...list)
      }).catch(() => {
        this.getCrowdListLoading = false
      })
      // }
      // else {
      //   this.crowdList = []
      // }
    },
    tableRowClassName ({ row }) {
      if (row.putway === 2) { return 'gray-row' }
    },
    initFormData () {
      return {
        historyCrowdId: '',
        extendNum: '',
        launchName: '',
        remark: ''
      }
    },

    // 保存草稿
    // handleSaveDraft () {
    //   if (this.form.taskCode === '' || this.form.taskName === '') {
    //     return this.$message.error('请输入 任务ID 和 任务名称 ')
    //   }
    //   const params = {
    //     ...this.form,
    //     putTime: Array.isArray(this.form.putTime) ? this.form.putTime.join(',') : this.form.putTime,
    //     priority: null, // 优先级字段不创
    //     putway: 3 // 草稿
    //   }

    //   this.$service.saveAssistantTask(params).then(res => {
    //     this.fetchData()
    //     this.dialogFormVisible = false
    //   })
    // },
    handleSave () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('this.form-->', this.form)

          const params = {
            ...this.form
          }

          this.$service.addExtendCrowd(params).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时, val=20
    handleSizeChange (val) {
      this.pagination.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.pagination.pageNum = 1
      this.fetchData()
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.fetchData()
    },

    handleAdd () {
      this.dialogFormVisible = true
      this.$nextTick(res => {
        // 初始化数据
        this.form = this.initFormData()
        this.$refs.ruleForm.resetFields()
      })
    },
    handleEdit ({ row }) {
      const params = {
        id: row.id
      }
      this.$service.getAssistantTaskDetail(params).then(res => {
        this.form = {
          ...res,
          putTime: res.putTime ? res.putTime.split(',') : []
        }

        this.dialogFormVisible = true

        this.$nextTick(() => {
          // 移除表单项的校验结果
          this.$refs.ruleForm.clearValidate()
        })
      })
    },
    // 下架任务
    handleOffSet ({ row }) {
      const params = {
        extendCrowdId: row.launchCrowdId,
        onOffCrowd: !row.onOffCrowd
      }
      this.$service.onOrOffExtendCrowd(params).then(res => {
        this.fetchData()
      })
    },
    handleDelete ({ row }) {
      this.$confirm('确定删除此扩充人群吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          launchCrowdId: row.launchCrowdId
        }
        this.$service.deleteExtendCrowd(params, '删除成功').then(() => {
          this.fetchData()
        })
      })
    },

    // parseFilter () {
    //   const { pagination } = this
    //   // if (pagination) {
    //   //   filter.pageNum = pagination.currentPage
    //   //   filter.pageSize = pagination.pageSize
    //   // }
    //   return pagination
    // },
    fetchData () {
      const params = {
        ...this.pagination,
        ...this.searchForm,
        page: this.pagination.pageNum
      }
      // console.log('this.searchForm-->', this.pagination)
      // console.log('params-->', params)
      this.$service.getExtendCrowd(params).then((data) => {
        this.launchStatusEnum = data.launchStatusEnum
        const pageInfo = data.pageInfo
        this.table.data = pageInfo.list || []
        this.table.data = this.table.data.map(item => {
          return {
            ...item,
            tagId: item.launchCrowdId,
            dataSource: 1
          }
        })
        this.pagination.total = pageInfo.total
        if (this.showSelection) {
          this.$nextTick(() => {
            this.updateTableSelected()
          })
        }
      })
    }
  },
  created () {
    this.fetchData()
    // 初始化数据
    this.form = this.initFormData()
    this.qiBoRemoteMethod() // 弹窗 - 下拉列表
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
// .header-wrap
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 20px;
// .search-input
//   display: flex;
.remark
  font-size 12px
  color: #999
>>>.table-cell-wrap{
  display grid
  grid-template-columns: 20px 25px auto;
  .arrow-wrap {
    height: 100%;
    background: #606266;
    width: 2px;
    margin-left: 7px;
    position: relative;
  }
  .arrow {
    width: 10px;
    height: 10px;
    border: 2px solid;
    border-color: transparent transparent #606266 #606266;
    position: absolute;
    bottom: 2px;
    left: -4px;
    transform: rotate(314deg);
  }

  // .arrow::after{
  //   content: '';
  //   position: absolute;
  //   right: -7px;
  //   top: -9px;
  //   border: 7px solid;
  //   border-color: #fff transparent transparent transparent;
  // }

}
// >>>.text-wrap
//   display flex
//   justify-content: space-between;
>>>.text-tip
  font-size 12px
  color: #E6A23C
  margin 0 10px

>>>.table-cell-wrap-icon{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list-table >>> .el-table tr.gray-row
  color #ccc
.inline-form-item {
  width: 299px;
  display: inline-block;
  margin-right: 14px;
}

.list-header {
  display: flex;
  color: #999;
  font-size: 12px;
  justify-content: space-between;
  border-bottom: 1px dashed #efefef;
  span:nth-child(1) {
    margin-left: 95px;
  }
  span:nth-child(2) {
    margin-left: 234px;
  }
  span:nth-child(3) {
    margin-left: 62px;
  }
}
</style>
