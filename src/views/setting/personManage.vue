<template>
  <div>



        <!-- authority -->
    <div class="TopNav">
      <div class="left">
    <el-button-group>
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
        shiro:hasPermission="sysAdministrative:user:add"
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
        shiro:hasPermission="sysAdministrative:user:batchDel"
      >
        <a class="fa fa-trash" style="color: white;"></a> 批量删除
      </el-button>
    </el-button-group>
      </div>
      <div class="right">
          <el-form
      :inline="true"
      :model="searchForm"
      ref="searchForm"
      @submit.native.prevent="submitForm"
      shiro:hasPermission="sysAdministrative:user:search"
    >
      <el-form-item label="" prop="userMsg">
        <el-input
          v-model="searchForm.userMsg"
          style="width: 200px"
          size="small"
          placeholder="请输入账号/真实姓名/邮箱"
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
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column prop="officeName" label="归属机构" width="100"></el-table-column>
      <el-table-column prop="loginName" label="账号" width="200"></el-table-column>
      <el-table-column prop="name" label="真实姓名" width="80"></el-table-column>
      <el-table-column prop="roleNameStr" label="所拥有角色" width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="220">
        <template scope="scope">
          <el-icon name="message"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="200">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginFlag" label="状态" width="100">
        <template scope="scope">
          <el-tag type="success" close-transition="false" v-if="scope.row.loginFlag === 1">
            <a class="fa fa-unlock"></a> 正常
          </el-tag>
          <el-tag type="danger" close-transition="false" v-if="scope.row.loginFlag === 0">
            <a class="fa fa-lock"></a> 锁定
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template scope="scope">
          <el-button-group>
            <!--<el-button size="small" type="success" @click="handleDetail(scope.$index, scope.row)">
                            <a class="fa fa-search" style="color: white;"></a> 查看
            </el-button>-->
            <el-button
              size="small"
              type="warning"
              @click="handleChangetStatus(scope.$index, scope.row)"
              shiro:hasPermission="sysAdministrative:user:changeStatus"
            >
              <a class="fa fa-edit" style="color: white;"></a> 修改状态
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              shiro:hasPermission="sysAdministrative:user:edit"
            >
              <a class="fa fa-edit" style="color: white;"></a> 编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              shiro:hasPermission="sysAdministrative:user:del"
            >
              <a class="fa fa-trash" style="color: white;"></a> 删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <div align="right">
            <pagination v-bind:currentpage="currentPage"
                        v-bind:pagesize="pageSize"
                        v-bind:totalcount="totalCount"
                        @handle-size-change="handleSizeChange"
                        @handle-current-change="handleCurrentChange">
            </pagination>
    </div>
    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="userForm" :rules="userFormRules" ref="userForm" label-width="100px">
        <el-form-item label="真实姓名" prop="name">
          <el-input size="small" v-model="userForm.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName">
          <el-input size="small" v-model="userForm.loginName" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" size="small" v-model="userForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <div style="height:100px;overflow:auto;">
          <el-checkbox-group v-model="userForm.roleIds">
            <el-checkbox
              v-for="item in userForm.roleList"
              :label="item.id"
              name="roleIds"
              :key="item.id"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="所属机构" prop="officeId">
          <el-input style="display:none;" v-model="userForm.officeId" placeholder="请选择所属机构"></el-input>
          <el-input size="small" readonly v-model="userForm.officeName" placeholder="请选择所属机构"></el-input>
          <el-button size="small" type="primary" icon="search" @click="selectOffice">选择</el-button>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input size="small" type="textarea" v-model="userForm.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="userForm.loginFlag">
            <el-radio class="radio" :label="1">正常</el-radio>
            <el-radio class="radio" :label="0">锁定</el-radio>
          </el-radio-group>&nbsp;&nbsp;
          <el-checkbox label="发邮件通知请勾选" v-model="userForm.mailNotice"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>
     <!-- 机构选择 -->
     <el-dialog
        title="选择机构"
        :visible.sync="companyVisible"
        width="30%"
        class="organSelect"
        >
        <el-tree
            :data="companys"
            :props="companyProps"
            accordion
            @node-click="handleNodeClick">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="companySelectCancel">取 消</el-button>
            <el-button type="primary" @click="companySelectOk">确 定</el-button>
        </span>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      v-if="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="userForm" :rules="userFormRules" ref="userForm" label-width="100px">
        <el-form-item label="真实姓名" prop="name">
          <el-input size="small" v-model="userForm.name" placeholder="请输入真实姓名"></el-input>
          <el-input style="display:none;" v-model="userForm.id"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName">
          <el-input size="small" v-model="userForm.loginName" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" size="small" v-model="userForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <div style="height:100px;overflow:auto;">
          <el-checkbox-group v-model="userForm.roleIds">
            <el-checkbox
              v-for="item in userForm.roleList"
              :label="item.id"
              name="roleIds"
              :key="item.id"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="所属机构" prop="officeId">
          <el-input style="display:none;" v-model="userForm.officeId"></el-input>
          <el-input size="small" readonly v-model="userForm.officeName" placeholder="请选择所属机构"></el-input>
          <el-button size="small" type="primary" icon="search" @click="selectOffice">选择</el-button>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input size="small" type="textarea" v-model="userForm.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="userForm.loginFlag">
            <el-radio class="radio" :label="1">正常</el-radio>
            <el-radio class="radio" :label="0">锁定</el-radio>
          </el-radio-group>&nbsp;&nbsp;
          <el-checkbox label="发邮件通知请勾选" v-model="userForm.mailNotice"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="editSubmit">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      // 多选数组
      multipleSelection: [],
      //搜索条件
      criteria: {},
      // 列表页
      searchForm: {
        userMsg: ""
      },
      // 新增页
      addFormVisible: false, // 新增界面是否显示
      // 新增界面数据
      userForm: {
        id: "",
        name: "",
        loginName: "",
        email: "",
        password: "",
        officeId: "",
        remarks: "",
        loginFlag: 0,
        mailNotice: false,
        roleIds: [], // 该用户所拥有的角色id
        // 以上为表单提交的参数
        officeName: "", // 机构名称
        roleList: null // 角色列表
      },
      userFormRules: {
        name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
        loginName: [
          { required: true, message: "请输入登录账号", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        // password: [
        //     {required: true, message: '请输入密码', trigger: 'blur'}
        // ],
        roleIds: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个角色",
            trigger: "change"
          }
        ],
        officeName: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入备注信息", trigger: "blur" }
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
      totalCount: 1,
      companys:[],
      companyProps:{
       chilidren:"children",
       label:"name"
      },
      companyVisible:false,//机构页面是否显示
    };
  },
  methods: {
    callback(data, successMsg) {
        this.$message({
          message: data.msg,
          type: "success"
        });
        this.loadData();
    },
    // 从服务器读取数据
    loadData: function() {
      this.criteria["pageNum"] = this.currentPage;
      this.criteria["pageSize"] = this.pageSize;
      this.$service.get_users_json(this.criteria).then(data => {
        this.tableData = data.pageInfo.list;
        this.totalCount = data.pageInfo.total;
        this.userForm.roleList=data.roleList
      });
    },

    // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
    handleSizeChange: function(val) {
      this.pageSize = val;
      this.loadData();
    },

    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.loadData();
    },

    // 搜索,提交表单
    submitForm: function() {
      var _this = this;
      this.$refs.searchForm.validate(function(result) {
        if (result) {
          _this.criteria = _this.searchForm;
          _this.loadData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // // 刷新
    // handleRefresh: function () {
    //     window.location.href = localStorage.getItem("adminPath") + "/manage/user/index";
    // },

    // 重置
    handleReset: function() {
      this.$refs.searchForm.resetFields();
    },

    // 修改状态
    handleChangetStatus: function(index, row) {
      var id = row.id;
      var loginFlag = row.loginFlag == 1 ? 0 : 1;
      this.$confirm("确定修改该条记录的状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service
            .changeloginFlag({ id: id, loginFlag: loginFlag })
            .then(data => {
              this.callback(data, "状态修改成功");
            });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "已取消修改该条记录的状态"
          });
        });
    },

    // 查看详情
    handleDetail: function(index, row) {
      var id = row.id;
      // todo: 以后再做
    },
   selectOffice(){
     this.companyVisible=true;
     this.$service.get_office_tree_json().then((data)=>{
         this.companys=data.officeTree
     })
   },
   handleNodeClick(data){
    // this.userForm.company=data
     this.$appState.$set("company_data",JSON.stringify(data));
   },
   companySelectCancel(){
     this.$appState.$set("company_data",'');
     this.companyVisible=false;
   },
   companySelectOk(){
     this.companyVisible=false;
     const data=JSON.parse(this.$appState.$get("company_data"));
     this.userForm.officeId=data.id;
     this.userForm.officeName=data.name;
   },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.userForm.id = "";
      this.userForm.name = "";
      this.userForm.loginName = "";
      this.userForm.email = "";
      this.userForm.password = "";
      this.userForm.officeId = "";
      this.userForm.remarks = "";
      this.userForm.loginFlag = 0;
      this.userForm.officeName = "";
      this.userForm.roleIds = [];
    },

    // 新增
    addSubmit: function() {
      var _this = this;
      this.$refs.userForm.validate(valid => {
        if (valid) {
          let userForm = JSON.stringify(_this.userForm);
          userForm = JSON.parse(userForm);
          userForm.roleIds = userForm.roleIds.join(",");
          delete userForm.officeName
          delete userForm.roleList
          this.$service.addUser(userForm).then(data => {
            this.callback(data, "添加成功");
            this.addFormVisible=false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 显示编辑页面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      // console.log(row);
      this.userForm.id = row.id;
      this.userForm.name = row.name;
      this.userForm.loginName = row.loginName;
      this.userForm.email = row.email;
      this.userForm.password = "";
      this.userForm.officeId = row.officeId;
      this.userForm.remarks = row.remarks;
      this.userForm.loginFlag = row.loginFlag;
      this.userForm.officeName = row.officeName;
      this.userForm.roleIds = row.roleIds;
    },

    // editSubmit
    editSubmit: function() {
      var _this = this;
      this.$refs.userForm.validate(valid => {
        if (valid) {
          let userForm = JSON.stringify(_this.userForm);
          userForm = JSON.parse(userForm);
          userForm.roleIds = userForm.roleIds.join(",");
          delete userForm.officeName
          delete userForm.roleList
          this.$service.updateUser(userForm).then(data => {
            this.callback(data, "更新成功");
            this.editFormVisible=false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 取消
    cancelAdd: function() {
      this.addFormVisible = false;
      // this.$message({
      //     showClose: true,
      //     message: '已取消新增'
      // });
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
          this.$service.delUser({ id: id }).then(data => {
            this.callback(data, "删除成功");
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "已取消删除操作"
          });
        });
    },

    // 多选响应
    handleSelectionChange: function(val) {
      // 循环该数组,取出id放到(push)multipleSelection
      var ids = [];
      for (var i = 0; i < val.length; i++) {
        ids.push(val[i].id);
      }
      this.multipleSelection = ids;
      // console.log(this.multipleSelection);
    },

    // 批量删除
    handleBatchDel: function() {
      var ids = this.multipleSelection;
      if (ids.length > 0) {
        this.$confirm("确定要删除这批记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        })
          .then(() => {
            this.$service.batchDelUsers({ids:ids.join(",")}).then(data => {
              this.callback(data, "删除成功");
            });
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: "已取消删除操作"
            });
          });
      } else {
        this.$alert("请至少勾选一条记录", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    }
  },
  created() {
    this.loadData();
  }
  //  })
};
</script>
<style scoped lang="stylus">
    .el-checkbox-group label
       width 160px
    .el-checkbox+.el-checkbox
       margin-left: 0px;
    .organSelect >>>.is-current
        color:#3980e2;
</style>
