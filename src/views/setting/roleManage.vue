<template>
  <div>
    <!-- authority -->
    <div class="TopNav">
      <div class="left">
        <!-- authority -->
        <el-button-group>
          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-permission="'sysAdministrative:role:add'"
          >
            <a class="fa fa-plus" style="color: white;"></a>新增
          </el-button>
          <!-- <el-button type="primary" size="small" @click="handleRefresh">
                <a class="fa fa-refresh" style="color: white;"></a> 刷新
          </el-button>-->
          <el-button
            type="primary"
            size="small"
            @click="handleBatchDel"
            v-permission="'sysAdministrative:role:batchDel'"
          >
            <a class="fa fa-trash" style="color: white;"></a> 批量删除
          </el-button>
        </el-button-group>
      </div>
      <div class="right">
        <!-- form search -->
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchForm"
          @submit.native.prevent="submitForm"
        >
          <el-form-item label prop="name">
            <el-input
              v-model="searchForm.name"
              style="width: 200px"
              size="small"
              placeholder="请输入角色"
            ></el-input>
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
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="enname" label="角色英文名称" width="120"></el-table-column>
      <!--<el-table-column prop="menuIds" label="权限" width="200"></el-table-column>-->
      <el-table-column prop="remarks" label="备注" width="200"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="200">
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="useable" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" close-transition="false" v-if="scope.row.useable === 1">
            <a class="fa fa-unlock"></a> 正常
          </el-tag>
          <el-tag type="danger" close-transition="false" v-if="scope.row.useable === 0">
            <a class="fa fa-lock"></a> 锁定
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
              v-permission="'sysAdministrative:role:changeStatus'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 修改状态
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              v-permission="'sysAdministrative:role:edit'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 编辑
            </el-button>
            <el-button
              size="small"
              type="info"
              @click="handleDelete(scope.$index, scope.row)"
              v-permission="'sysAdministrative:role:del'"
            >
              <a class="fa fa-trash" style="color: white;"></a> 删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
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
      title="新增"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      :close-on-click-modal="false"
      size="large"
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="100px">
            <el-form-item label="角色" prop="name">
              <el-input size="small" v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input size="small" type="textarea" v-model="roleForm.remarks" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="roleForm.useable">
                <el-radio class="radio" :label="1">正常</el-radio>
                <el-radio class="radio" :label="0">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form>
            <el-form-item label="选择权限" :inline="true">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
            </el-form-item>
          </el-form>
          <!-- <el-tag type="primary" style="font-size: large">权限</el-tag><br/><br/>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>-->
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            ref="tree"
            :filter-node-method="filterNode"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      v-if="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
      size="large"
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="100px">
            <el-form-item label="角色" prop="name">
              <el-input size="small" v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input size="small" type="textarea" v-model="roleForm.remarks" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="roleForm.useable">
                <el-radio class="radio" :label="1">正常</el-radio>
                <el-radio class="radio" :label="0">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form>
            <el-form-item label="选择权限">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
            </el-form-item>
          </el-form>
          <!-- <el-tag type="primary" style="font-size: large">权限</el-tag><br/><br/>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>-->
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            ref="editTree"
            :filter-node-method="filterNode"
            highlight-current
            :default-checked-keys="roleForm.menuIds"
            :props="defaultProps"
          ></el-tree>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="editSubmit">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'roleManageAA',
  data () {
    return {
      // 表格当前页数据
      tableData: [],
      // 多选数组
      multipleSelection: [],
      // 搜索条件
      criteria: {},
      initTree: {},
      // 列表页
      searchForm: {
        name: ''
      },
      // 新增页
      addFormVisible: false, // 新增界面是否显示
      // 新增界面数据
      roleForm: {
        id: '',
        name: '',
        remarks: '',
        useable: 0,
        menuIds: [],
        menuAllIds: []
      },
      roleFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      filterText: '',
      data2: null,
      defaultProps: {
        children: 'children',
        label: 'label'
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
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // callback(data, successMsg) {
    //   this.loadData();
    // },
    callback () {
      this.loadData()
    },
    // 从服务器读取数据
    loadData () {
      this.criteria.pageNum = this.currentPage
      this.criteria.pageSize = this.pageSize
      this.$service.get_roles_json(this.criteria).then(data => {
        this.tableData = data.pageInfo.list
        this.totalCount = data.pageInfo.total
        this.initTree = this.searchInit(data.menuTree)
        this.data2 = data.menuTree
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
    // 获取最终所有权限列表id
    // json :最初的权限列表
    // keys :用户点击获取Vue获取到的最底层权限id数组
    getKeys (json, keys) {
      let final = []
      for (let i = 0; i < keys.length; i++) {
        final = this.searchTree(json, keys[i]).concat(final)
      }
      if (json.length === 0 || keys.length === 0) {
        return []
      } else {
        const c = _.uniq(final.concat(keys).sort())
        return c
      }
    },
    // 搜索当前权限，获得所有父级权限id
    searchTree (json, id) {
      const newJson = json.concat([])
      const len = newJson.length // 长度
      let parentNode = []
      // 查找id
      for (let s = 0; s < len; s++) {
        if (newJson[s].id === id) {
          if (
            newJson[s].parentNode == null ||
            newJson[s].parentNode.length === 0
          ) {
            parentNode = []
          } else {
            parentNode = newJson[s].parentNode
          }
        } else {
          continue
        }
      }
      return parentNode
    },
    searchInit (json) {
      const newJson = json.concat([])
      let len = newJson.length // 长度
      // var parentNode = [];
      for (let i = 0; i < len; i++) {
        const item = newJson[i]
        if (item.children && item.children.length !== 0) {
          const child = item.children
          for (let j = 0; j < child.length; j++) {
            if (item.parentNode) {
              child[j].parentNode = item.parentNode.concat([item.id])
            } else {
              child[j].parentNode = [item.id]
            }
            newJson[len + j] = child[j]
          }
          len = newJson.length
        }
      }
      return newJson
    },
    // 搜索,提交表单
    submitForm () {
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
    // // 刷新
    // handleRefresh: function () {
    //     window.location.href = localStorage.getItem("adminPath") + "/manage/role/index";
    // },
    // 重置
    handleReset () {
      this.$refs.searchForm.resetFields()
    },
    // 修改状态
    handleChangetStatus (index, row) {
      const id = row.id
      const useable = row.useable === 1 ? 0 : 1
      this.$confirm('确定修改该条记录的状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service
            .changeRoleStatus({ id: id, useable: useable }, '状态修改成功')
            .then(() => {
              this.callback()
            })
        })
        .catch(() => {

        })
    },

    // 查看详情
    // handleDetail (index, row) {
    // },

    // 过滤权限值
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 显示新增界面
    handleAdd () {
      this.addFormVisible = true
      this.roleForm.id = ''
      this.roleForm.name = ''
      this.roleForm.remarks = ''
      this.roleForm.useable = 0
      this.roleForm.menuIds = []
      this.roleForm.menuAllIds = []
    },
    // 新增
    addSubmit () {
      this.roleForm.menuIds = this.$refs.tree.getCheckedKeys()
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          let roleForm = JSON.stringify(this.roleForm)
          roleForm = JSON.parse(roleForm)
          roleForm.menuAllIds = this.getKeys(this.initTree, roleForm.menuIds)
          roleForm.menuIds = roleForm.menuIds.join(',')
          roleForm.menuAllIds = roleForm.menuAllIds.join(',')
          this.$service.addRole(roleForm, '添加成功').then(() => {
            this.callback()
            this.addFormVisible = false
          })
        } else {
          return false
        }
      })
    },

    resetAdd () {
      this.$refs.roleForm.resetFields()
      this.$refs.tree.setCheckedKeys([])
    },

    // 显示编辑页面
    handleEdit (index, row) {
      this.editFormVisible = true
      this.roleForm.id = row.id
      this.roleForm.name = row.name
      this.roleForm.remarks = row.remarks
      this.roleForm.useable = row.useable
      this.roleForm.menuIds = row.menuIds
      const _this = this
      this.$nextTick(function () {
        _this.$refs.editTree.setCheckedKeys(_this.roleForm.menuIds)
      })
    },
    // editSubmit
    editSubmit () {
      this.roleForm.menuIds = this.$refs.editTree.getCheckedKeys()
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          let roleForm = JSON.stringify(this.roleForm)
          roleForm = JSON.parse(roleForm)
          roleForm.menuAllIds = this.getKeys(this.initTree, roleForm.menuIds)
          roleForm.menuIds = roleForm.menuIds.join(',')
          roleForm.menuAllIds = roleForm.menuAllIds.join(',')
          this.$service.updateRole(roleForm, '编辑成功').then(() => {
            this.callback()
            this.editFormVisible = false
          })
        } else {
          return false
        }
      })
    },

    // 取消
    cancelAdd () {
      this.addFormVisible = false
      this.$message({
        showClose: true,
        message: '已取消新增'
      })
      this.$refs.tree.setCheckedKeys([])
      this.$refs.roleForm.resetFields()
    },
    cancelEdit () {
      this.editFormVisible = false
      this.$message({
        showClose: true,
        message: '已取消编辑'
      })
    },

    // 单行删除
    handleDelete (index, row) {
      const id = row.id
      this.$confirm('确定要删除该条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$service.delRole({ id: id }, '删除成功').then(() => {
            this.callback()
          })
        })
        .catch(() => {

        })
    },
    // 多选响应
    handleSelectionChange (val) {
      // 循环该数组,取出id放到(push)multipleSelection
      const ids = []
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i].id)
      }
      this.multipleSelection = ids
    },
    // 批量删除
    handleBatchDel () {
      const ids = this.multipleSelection
      if (ids.length > 0) {
        this.$confirm('确定要删除这批记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
          .then(() => {
            this.$service.batchRoles({ ids: ids.join(',') }, '删除成功').then(() => {
              this.callback()
            })
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: '已取消删除操作'
            })
          })
      } else {
        this.$alert('请至少勾选一条记录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }
}
</script>
