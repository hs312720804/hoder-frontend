<template>
  <div class="hoder-pages">
    <!-- authority -->
    <div class="TopNav">
      <div class="left">
        <el-button-group>
          <el-button type="primary" size="small" @click="handleAdd" v-permission="'sysSetup:email:add'">
            <a class="fa fa-plus" style="color: white;"></a>新增
          </el-button>
          <el-button type="primary" size="small" @click="handleBatchDel" v-permission="'sysSetup:email:batchDel'">
            <a class="fa fa-trash" style="color: white;"></a> 批量删除
          </el-button>
        </el-button-group>
      </div>
      <div class="right">
        <el-form :inline="true" :model="searchForm" ref="searchForm" >
          <!-- TODO: permission -->
          <el-form-item label prop="emailName">
            <el-input
              v-model="searchForm.emailName"
              style="width: 200px"
              size="small"
              placeholder="请填写邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label prop="type">
            <el-select v-model="searchForm.type" clearable filterable placeholder="请选择类型">
              <el-option
                v-for="item in emailTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="search" @click="submitForm">查询</el-button>
            <el-button type="primary" size="small" @click="handleReset">
              <a class="fa fa-refresh" style="color: white;"></a> 重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- talbe -->
    <el-table
      ref="myTable"
      :data="tableData"
      style="width: 100%;"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="emailName" label="邮箱" width="230">
        <template slot-scope="scope">
          <el-icon name="message"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.emailName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="类型" width="200"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="200">
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" close-transition="false" v-if="scope.row.status === 1">
            <a class="fa fa-unlock"></a> 启用
          </el-tag>
          <el-tag type="danger" close-transition="false" v-if="scope.row.status === 0">
            <a class="fa fa-lock"></a> 禁用
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button-group>
            <!--<el-button size="small" type="success" @click="handleDetail(scope.$index, scope.row)">
                            <a class="fa fa-search" style="color: white;"></a> 查看
            </el-button>-->
            <el-button
              size="small"
              type="success"
              @click="handleChangetStatus(scope.$index, scope.row)"
              v-permission="'sysSetup:email:changeStatus'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 修改状态
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              v-permission="'sysSetup:email:edit'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 编辑
            </el-button>
            <el-button
              size="small"
              type="info"
              @click="handleDelete(scope.$index, scope.row)"
              v-permission="'sysSetup:email:del'"
            >
              <a class="fa fa-trash" style="color: white;"></a> 删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <div align="right">
      <pagination
        v-bind:currentpage="currentPage"
        v-bind:pagesize="pageSize"
        v-bind:totalcount="totalCount"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      ></pagination>
    </div>
    <!--新增界面-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="emailForm" :rules="emailFormRules" ref="emailForm" label-width="100px">
        <el-form-item label="邮箱" prop="emailName">
          <el-input
            size="small"
            v-model="emailForm.emailName"
            placeholder="请填写邮箱, 如:xxx@coocaa.com/xxx@skyworth.com"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件类型" prop="typeFlags">
          <el-checkbox-group v-model="emailForm.typeFlags">
            <el-checkbox
              v-for="item in emailTypeList"
              :value="item.value"
              :label="item.value"
              name="typeNames"
              :key="item.value"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input size="small" type="textarea" v-model="emailForm.remarks" placeholder="请填写备注"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="emailForm.status">
            <el-radio class="radio" :label="1">正常</el-radio>
            <el-radio class="radio" :label="0">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'emailNoticeAA',
  data () {
    const validatePass = (rule, value, callback) => {
      const c = value.indexOf('@coocaa.com')
      const s = value.indexOf('@skyworth.com')
      if (c <= 0 && s <= 0) {
        callback(new Error('邮箱后缀必须是coocaa.com或者skyworth.com'))
      } else {
        callback()
      }
    }
    return {
      // 表格当前页数据
      tableData: [],
      dialogTitle: '新增',
      // 多选数组
      multipleSelection: [],
      // 搜索条件
      criteria: {},
      // 列表页
      searchForm: {
        emailName: '',
        type: ''
      },
      emailTypeList: null,
      //  typeList: null,
      // 新增页
      addFormVisible: false, // 新增界面是否显示
      // 新增界面数据
      emailForm: {
        id: '',
        emailName: '',
        // type: '',
        remarks: '',
        status: 0,
        typeFlags: []
        // 以上为表单提交的参数
      },
      emailFormRules: {
        emailName: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱' },
          { validator: validatePass, trigger: 'change' }
        ],
        // type: [
        //     {type: 'number', required: true, message: '请选择邮件类型', trigger: 'change'}
        // ],
        typeFlags: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个邮件类型',
            trigger: 'change'
          }
        ]
      },
      // 编辑页
      editFormVisible: false, // 编辑界面是否显示
      // 默认每页数据量:pageSize
      pageSize: 10,
      // 当前页码:pageNum
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1
    }
  },
  methods: {
    // 从服务器读取数据
    loadData: function () {
      this.criteria.pageNum = this.currentPage
      this.criteria.pageSize = this.pageSize
      this.$service.get_emails_json(this.criteria).then(data => {
        this.tableData = data.pageInfo.list
        this.totalCount = data.pageInfo.total
        this.emailTypeList = data.emailTypeList
      })
    },
    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange: function (val) {
      this.pageSize = val
      this.loadData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange: function (val) {
      this.currentPage = val
      this.loadData()
    },
    // 搜索,提交表单
    submitForm: function () {
      const _this = this
      this.$refs.searchForm.validate(function (result) {
        if (result) {
          _this.criteria = _this.searchForm
          _this.loadData()
        } else {
          return false
        }
      })
    },
    // 重置
    handleReset: function () {
      this.$refs.searchForm.resetFields()
    },
    // 修改状态
    handleChangetStatus: function (index, row) {
      const id = row.id
      const status = row.status == 1 ? 0 : 1
      this.$confirm('确定修改该条记录的状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service
            .changeEmailStatus({ id: id, status: status }, '修改成功')
            .then(() => {
              this.loadData()
            })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '已取消修改该条记录的状态'
          })
        })
    },

    // 查看详情
    // handleDetail: function(index, row) {
    //   var id = row.id;
    //   // todo: 以后再做
    // },
    // 显示新增界面
    handleAdd: function () {
      this.dialogTitle = '新增'
      this.addFormVisible = true
      this.emailForm.id = ''
      this.emailForm.emailName = ''
      // this.emailForm.type = '';
      this.emailForm.typeFlags = []
      this.emailForm.remarks = ''
      this.emailForm.status = 0
    },

    // 新增
    addSubmit: function () {
      const _this = this
      this.$refs.emailForm.validate(valid => {
        if (valid) {
          let emailForm = JSON.stringify(_this.emailForm)
          emailForm = JSON.parse(emailForm)
          emailForm.typeFlags = emailForm.typeFlags.join(',')
          if (this.emailForm.id != '') {
            this.$service.updateEmail(emailForm, '更新成功').then(() => {
              this.loadData()
              this.addFormVisible = false
            })
          } else {
            this.$service.addEmail(emailForm, '添加成功').then(() => {
              this.loadData()
              this.addFormVisible = false
            })
          }
        } else {
          return false
        }
      })
    },

    // 显示编辑页面
    handleEdit: function (index, row) {
      this.dialogTitle = '编辑'
      this.addFormVisible = true
      this.emailForm.id = row.id
      this.emailForm.emailName = row.emailName
      // this.emailForm.type = row.type;
      this.emailForm.typeFlags = row.typeIds
      this.emailForm.remarks = row.remarks
      this.emailForm.status = row.status
    },
    // 取消
    cancelAdd: function () {
      this.addFormVisible = false
      // this.$message({
      //     showClose: true,
      //     message: '已取消新增'
      // });
    },
    cancelEdit: function () {
      this.editFormVisible = false
      this.$message({
        showClose: true,
        message: '已取消编辑'
      })
    },

    // 单行删除
    handleDelete: function (index, row) {
      const id = row.id
      this.$confirm('确定要删除该条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$service.delEmail({ id: id }, '删除成功').then(() => {
            this.loadData()
          })
        })
        .catch(() => {
        })
    },

    // 多选响应
    handleSelectionChange: function (val) {
      // 循环该数组,取出id放到(push)multipleSelection
      const ids = []
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].id)
      }
      this.multipleSelection = ids
    },

    // 批量删除
    handleBatchDel: function () {
      const ids = this.multipleSelection
      if (ids.length > 0) {
        this.$confirm('确定要删除这批记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
          .then(() => {
            this.$service.batchDelEmail({ ids: ids.join(',') }, '删除成功').then(() => {
              this.loadData()
            })
          })
          .catch(() => {
          })
      } else {
        this.$alert('请至少勾选一条记录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  },
  created () {
    this.loadData()
  }
}
</script>
<style scoped>
.el-checkbox-group label {
  width: 160px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
</style>
