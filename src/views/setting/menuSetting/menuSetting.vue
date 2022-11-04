<template>
  <div>
    <!-- authority -->
    <el-button-group>
      <el-button type="primary" size="small" @click="handleAdd" v-permission="'sysSetup:menu:add'">
        <!--TODO: permission -->
        <a class="fa fa-plus" style="color: white;"></a>新增
      </el-button>
      <!-- <el-button type="primary" size="small" @click="handleRefresh">
                <a class="fa fa-refresh" style="color: white;"></a> 刷新
      </el-button>-->
    </el-button-group>
    <br>
    <br>
    <!-- talbe -->
    <el-table :data="tableData" ref="myTable" style="width: 100%;" stripe border>
      <!--<el-table-column prop="id" label="ID" width="100"></el-table-column>-->
      <el-table-column prop="name" label="名称" width="250">
        <!--<template slot-scope="scope">
                     <el-button type="text" @click="changeExpandAndOff(scope.$index, scope.row)">
                         <i v-if="!expand" class="el-icon-caret-right"></i>
                         <i v-if="expand" class="el-icon-caret-bottom"></i>
                     </el-button>
                     {{ scope.row.name }}
        </template>-->
        <template slot-scope="scope">
          <a :class="scope.row.fullIcon" v-if="scope.row.depth === 1" style="margin-left: 0px"></a>
          <a :class="scope.row.fullIcon" v-if="scope.row.depth === 2" style="margin-left: 10px"></a>
          <a :class="scope.row.fullIcon" v-if="scope.row.depth === 3" style="margin-left: 20px"></a>
          <a :class="scope.row.fullIcon" v-if="scope.row.depth === 4" style="margin-left: 30px"></a>
          <a :class="scope.row.fullIcon" v-if="scope.row.depth === 5" style="margin-left: 40px"></a>
          <a :class="scope.row.fullIcon" v-if="scope.row.depth === 6" style="margin-left: 50px"></a>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="href" label="链接" width="300"></el-table-column>
      <el-table-column prop="sort" label="排序">
        <!--<template slot-scope="scope">-->
          <!--<el-input :value="scope.row.sort" @blur="updateSort(scope.$index, scope.row)"></el-input>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column prop="permission" label="权限标识" width="300"></el-table-column>
      <el-table-column prop="isShow" label="可见">
        <template slot-scope="scope">
          <el-tag type="success" close-transition="false" v-if="scope.row.isShow === 1">
            <a class="fa fa-unlock"></a> 显示
          </el-tag>
          <el-tag type="danger" close-transition="false" v-if="scope.row.isShow === 0">
            <a class="fa fa-lock"></a> 隐藏
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button-group>
            <!--<el-button size="small" type="success" @click="handleDetail(scope.$index, scope.row)">
                            <a class="fa fa-search" style="color: white;"></a> 查看
            </el-button>-->
            <el-button
              size="small"
              type="success"
              @click="handleChangetStatus(scope.$index, scope.row)"
              v-permission="'sysSetup:menu:changeStatus'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 修改状态
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              v-permission="'sysSetup:menu:edit'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 编辑
            </el-button>
            <el-button
              size="small"
              type="info"
              @click="handleDelete(scope.$index, scope.row)"
              v-permission="'sysSetup:menu:del'"
            >
              <a class="fa fa-trash" style="color: white;"></a> 删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!--<el-button @click="saveSort" type="primary"><i class="fa fa-save"></i>保存排序</el-button>-->
    <!--新增界面-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="menuForm" :rules="menuFormRules" ref="menuForm" label-width="150px">
        <el-form-item label="父级菜单" prop="parentId">
          <el-input style="display:none;" v-model="menuForm.parentId"></el-input>
          <el-input size="small" readonly v-model="menuForm.parentName" placeholder="请选择父级菜单"></el-input>
          <el-button size="small" type="primary" icon="search" @click="selectMenu">选择</el-button>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input size="small" v-model="menuForm.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接" prop="href">
          <el-input size="small" v-model="menuForm.href" placeholder="请输入菜单链接"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input size="small" v-model="menuForm.permission" placeholder="请输入权限"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input size="small" readonly v-model="menuForm.icon" placeholder="请填写图标样式,如:fa-book"></el-input>
          <el-button size="small" type="primary" icon="search" @click="selectIcon">选择图标</el-button>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input size="small" v-model.number="menuForm.sort" placeholder="请填写排序数"></el-input>
        </el-form-item>
        <el-form-item label="是否在菜单中显示">
          <el-radio-group v-model="menuForm.isShow">
            <el-radio class="radio" :label="1">显示</el-radio>
            <el-radio class="radio" :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 机构选择 -->
    <el-dialog title="选择机构" :visible.sync="organVisible" width="30%" class="organSelect">
      <el-tree :data="organs" :props="organProps" accordion @node-click="handleNodeClick"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="companySelectCancel">取 消</el-button>
        <el-button type="primary" @click="companySelectOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    const checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('排序不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      // 表格当前页数据
      tableData: [],
      dialogTitle: '',
      organs: [],
      organProps: {
        chilidren: 'children',
        label: 'name'
      },
      // 新增页
      addFormVisible: false, // 新增界面是否显示
      organVisible: false,
      // 新增界面数据
      menuForm: {
        id: '',
        parentId: 0,
        parentName: '顶级菜单',
        name: '',
        href: '',
        permission: '',
        icon: '',
        sort: '',
        isShow: 0
      },
      menuFormRules: {
        name: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }],
        permission: [
          { required: true, message: '请填写权限', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请填写菜单图标', trigger: 'blur' }],
        sort: [
          { required: true, validator: checkSort, trigger: 'blur' }
        ]
      },

      // 编辑页
      editFormVisible: false // 编辑界面是否显示
    }
  },
  props: ['iconName'],
  created () {
    this.loadData()
    this.menuForm.icon = this.iconName
  },
  watch: {
    iconName (val) {
      this.menuForm.icon = val
    }
  },
  methods: {
    // 从服务器读取数据
    loadData () {
      this.$service.get_menus_json().then(data => {
        this.tableData = data.menuTreeTable
      })
    },
    selectIcon () {
      this.$emit('show', false)
      document.querySelector('.v-modal').style.display = 'none'
    },
    // 修改状态
    handleChangetStatus (index, row) {
      var id = row.id
      var isShow = row.isShow == 1 ? 0 : 1
      this.$confirm('确定修改该条记录的状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service
            .changeMenuStatus({ id: id, isShow: isShow }, '修改成功')
            .then(() => {
              this.loadData()
            })
        })
        .catch(() => {

        })
    },

    // 查看详情
    // handleDetail (index, row) {
    // },
    selectMenu () {
      this.$service.get_menu_tree_json().then(data => {
        this.organs = data
        this.organVisible = true
      })
    },
    handleNodeClick (data) {
      this.$appState.$set('company_data', JSON.stringify(data))
    },
    companySelectCancel () {
      this.$appState.$set('company_data', '')
      this.organVisible = false
    },
    companySelectOk () {
      this.organVisible = false
      const data = JSON.parse(this.$appState.$get('company_data'))
      this.menuForm.parentId = data.id
      this.menuForm.parentName = data.name
    },

    // 显示新增界面
    handleAdd () {
      this.dialogTitle = '新增'
      this.addFormVisible = true
      this.menuForm.id = ''
      this.menuForm.parentId = ''
      this.menuForm.parentName = ''
      this.menuForm.name = ''
      this.menuForm.href = ''
      this.menuForm.permission = ''
      this.menuForm.icon = ''
      this.menuForm.sort = ''
      this.menuForm.isShow = 0
    },

    // 新增
    addSubmit () {
      const formData = JSON.parse(JSON.stringify(this.menuForm))
      if (formData.parentId === '') { formData.parentId = 0 }
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (formData.id != '') {
            this.$service.MenuUpdate(formData, '更新成功').then(() => {
              this.loadData()
              this.addFormVisible = false
            })
          } else {
            this.$service.MenuAdd(formData, '添加成功').then(() => {
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
    handleEdit (index, row) {
      this.dialogTitle = '编辑'
      this.addFormVisible = true
      this.menuForm.id = row.id
      this.menuForm.parentId = row.parentId
      if (row.parentName == null) {
        this.menuForm.parentName = ''
      } else {
        this.menuForm.parentName = row.parentName
      }
      this.menuForm.name = row.name
      this.menuForm.href = row.href
      this.menuForm.permission = row.permission
      this.menuForm.icon = row.icon
      this.menuForm.sort = row.sort
      this.menuForm.isShow = row.isShow
    },
    // 取消
    cancelAdd () {
      this.addFormVisible = false
    },
    // 单行删除
    handleDelete (index, row) {
      var id = row.id
      this.$confirm('确定要删除该条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$service.delMenu({ id: id }, '删除成功').then(() => {
            this.loadData()
          })
        })
        .catch(() => {

        })
    }
  }
}
</script>
<style lang="stylus" scoped>
.organSelect >>> .is-current .el-tree-node__label
  color: #3c88d0
</style>
