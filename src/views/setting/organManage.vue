<template>
  <div>
    <!-- authority -->
    <el-button-group>
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
        v-permission="'sysAdministrative:office:add'"
      >
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
      <el-table-column prop="name" label="机构名称" width="150">
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
      <el-table-column prop="master" label="负责人" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="sort" label="排序" width="100">
        <template slot-scope="scope">
          <el-input :value="scope.row.sort"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="useable" label="可见" width="100">
        <template slot-scope="scope">
          <el-tag type="success" close-transition="false" v-if="scope.row.useable === 1">
            <a class="fa fa-unlock"></a> 可用
          </el-tag>
          <el-tag type="danger" close-transition="false" v-if="scope.row.useable === 0">
            <a class="fa fa-lock"></a> 不可用
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
              v-permission="'sysAdministrative:office:changeStatus'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 修改状态
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              v-permission="'sysAdministrative:office:edit'"
            >
              <a class="fa fa-edit" style="color: white;"></a> 编辑
            </el-button>
            <el-button
              size="small"
              type="info"
              @click="handleDelete(scope.$index, scope.row)"
              v-permission="'sysAdministrative:office:del'"
            >
              <a class="fa fa-trash" style="color: white;"></a> 删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="officeForm" :rules="officeFormRules" ref="officeForm" label-width="150px">
        <el-form-item label="父级机构" prop="parentId">
          <el-input style="display:none;" v-model="officeForm.parentId"></el-input>
          <el-input size="small" readonly v-model="officeForm.parentName" placeholder="请选择父级机构"></el-input>
          <el-button size="small" type="primary" icon="search" @click="selectOffice">选择</el-button>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input size="small" v-model="officeForm.name" placeholder="请填写机构名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input size="small" v-model="officeForm.sort" placeholder="请填写排序数"></el-input>
        </el-form-item>
        <el-form-item label="机构负责人" prop="master">
          <el-input size="small" v-model="officeForm.master" placeholder="请填写机构负责人"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="officeForm.email" placeholder="请填写联系邮箱"></el-input>
        </el-form-item>
        <el-form-item label="可用">
          <el-radio-group v-model="officeForm.useable">
            <el-radio class="radio" :label="1">可用</el-radio>
            <el-radio class="radio" :label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
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
    >
      <el-form :model="officeForm" :rules="officeFormRules" ref="officeForm" label-width="150px">
        <el-form-item label="父级机构" prop="parentId">
          <el-input style="display:none;" v-model="officeForm.parentId"></el-input>
          <el-input size="small" readonly v-model="officeForm.parentName" placeholder="请选择父级菜单"></el-input>
          <el-button size="small" type="primary" icon="search" @click="selectOffice">选择</el-button>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input size="small" v-model="officeForm.name" placeholder="请填写机构名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input size="small" v-model="officeForm.sort" placeholder="请填写排序数"></el-input>
        </el-form-item>
        <el-form-item label="机构负责人" prop="master">
          <el-input size="small" v-model="officeForm.master" placeholder="请填写机构负责人"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="officeForm.email" placeholder="请填写联系邮箱"></el-input>
        </el-form-item>
        <el-form-item label="可用">
          <el-radio-group v-model="officeForm.useable">
            <el-radio class="radio" :label="1">可用</el-radio>
            <el-radio class="radio" :label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="editSubmit">保存</el-button>
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
  name: 'organManageAA',
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      organs: [],
      organProps: {
        chilidren: "children",
        label: "name"
      },
      organVisible: false,
      // 新增页
      addFormVisible: false, // 新增界面是否显示
      // 新增界面数据
      officeForm: {
        id: "",
        parentId: 0,
        parentName: "",
        name: "",
        master: "",
        email: "",
        sort: "",
        useable: 0
      },
      officeFormRules: {
        name: [{ required: true, message: "请填写机构名称", trigger: "blur" }],
        master: [{ required: true, message: "请填写负责人", trigger: "blur" }],
        email: [{ required: true, message: "请填写邮箱", trigger: "blur" }]
        // sort: [
        //     {required: true, message: '请填写排序数', trigger: 'blur'}
        // ] todo: 为啥不生效
      },

      // 编辑页
      editFormVisible: false // 编辑界面是否显示
    };
  },
  methods: {
    callback() {
      this.loadData();
    },
    // 从服务器读取数据
    loadData: function() {
      this.$service.get_offices_json().then(data => {
        this.tableData = data.officeTreeTable;
      });
    },
    // // 刷新
    // handleRefresh: function () {
    //     window.location.href = localStorage.getItem("adminPath") + "/manage/office/index";
    // },

    // 修改状态
    handleChangetStatus: function(index, row) {
      var id = row.id;
      var useable = row.useable == 1 ? 0 : 1;
      this.$confirm("确定修改该条记录的状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service
            .changeOrganStatus({ id: id, useable: useable },"状态修改成功")
            .then(() => {
              this.callback();
            });
        })
        .catch(() => {
        });
    },

    // 查看详情
    // handleDetail: function(index, row) {
    // },
    selectOffice() {
      this.organVisible = true;
      this.$service.get_office_tree_json().then(data => {
        this.organs = data.officeTree;
      });
    },
    handleNodeClick(data) {
      this.$appState.$set("company_data", JSON.stringify(data));
    },
    companySelectCancel() {
      this.$appState.$set("company_data", "");
      this.organVisible = false;
    },
    companySelectOk() {
      this.organVisible = false;
      const data = JSON.parse(this.$appState.$get("company_data"));
      this.officeForm.parentId = data.id;
      this.officeForm.parentName = data.name;
    },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.officeForm.id = "";
      this.officeForm.parentId = "";
      this.officeForm.parentName = "";
      this.officeForm.name = "";
      this.officeForm.master = "";
      this.officeForm.email = "";
      this.officeForm.sort = "";
      this.officeForm.useable = 0;
    },
    // 新增
    addSubmit: function() {
      var _this = this;
      this.$refs.officeForm.validate(valid => {
        if (valid) {
          this.$service.addOrgan(_this.officeForm,"添加成功").then(() => {
            this.callback();
            this.addFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 显示编辑页面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.officeForm.id = row.id;
      this.officeForm.parentId = row.parentId;
      if (row.parentName == null) {
        this.officeForm.parentName = "顶级机构";
      } else {
        this.officeForm.parentName = row.parentName;
      }
      this.officeForm.name = row.name;
      this.officeForm.master = row.master;
      this.officeForm.email = row.email;
      this.officeForm.sort = row.sort;
      this.officeForm.useable = row.useable;
    },
    // editSubmit
    editSubmit: function() {
      var _this = this;
      this.$refs.officeForm.validate(valid => {
        if (valid) {
          this.$service.updateOrgan(_this.officeForm,"编辑成功").then(() => {
            this.callback();
            this.editFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    // 取消
    cancelAdd: function() {
      this.addFormVisible = false;
      this.$message({
        showClose: true,
        message: "已取消新增"
      });
    },
    cancelEdit: function() {
      this.editFormVisible = false;
      this.$message({
        showClose: true,
        message: "已取消编辑"
      });
    },
    // 单行删除
    handleDelete: function(index, row) {
      var id = row.id;
      this.$confirm("确定要删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          this.$service.delOrgan({ id: id },"删除成功").then(() => {
            this.callback();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "已取消删除操作"
          });
        });
    }
  },
  created() {
    this.loadData();
  }
  // });
};
</script>
<style scoped lang="stylus">
.el-checkbox-group label
  width: 160px
.el-checkbox+.el-checkbox
  margin-left: 0px
.organSelect >>>.is-current
  color: #3980e2
</style>
