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
            shiro:hasPermission="sysAdministrative:role:add"
          >
            <a class="fa fa-plus" style="color: white;"></a>新增
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
          shiro:hasPermission="sysAdministrative:role:search"
        >
          <el-form-item label prop="launchName">
            <el-input v-model="searchForm.launchName" style="width: 200px" placeholder="请输入投放名称"></el-input>
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
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="launchCrowdId" label="ID" width="50"></el-table-column>
      <el-table-column prop="launchName" label="投放名称" width="100"></el-table-column>
      <el-table-column prop="biName" label="投放平台" width="120"></el-table-column>
      <el-table-column prop="dmpEstimate" label="人群数量" width="100"></el-table-column>
      <el-table-column prop="launchName" label="投放名称" width="100"></el-table-column>
      <el-table-column prop="status" label="人群状态" width="70">
        <template scope="scope">
          <span style="margin-left: 10px">{{launchStatusEnum[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="menuIds" label="权限" width="200"></el-table-column>-->
      <el-table-column prop="expiryTime" label="人群有效期" width="180">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.expiryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.status==1"
              size="small"
              type="warning"
              @click="lanuch(scope.$index, scope.row)"
              shiro:hasPermission="sysAdministrative:role:changeStatus"
            >投放</el-button>
            <el-button
              v-if="scope.row.status==3"
              size="small"
              type="warning"
              @click="cancelLanuch(scope.row)"
            >取消投放</el-button>
             <el-button size="small" type="success" @click="condition(scope.row)">人群条件</el-button>
            <el-button
              v-if="scope.row.status==1"
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              shiro:hasPermission="sysAdministrative:role:edit"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status==1"
              size="small"
              type="info"
              @click="del(scope.row)"
              shiro:hasPermission="sysAdministrative:role:edit"
            >删除</el-button>
           
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
    <el-dialog title="查询条件" :visible.sync="isShowCondition" width="30%">
      <el-form>
        <el-form-item label="选择的策略">{{selectStrategy}}</el-form-item>
        <el-form-item label="选择的人群">
          <el-checkbox
            v-model="item.choosed"
            v-for="item in crowdArr"
            :key="item.crowdId"
            disabled
          >{{item.crowdName}}</el-checkbox>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--新增编辑界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form :model="crowdForm" :rules="crowdFormRules" ref="crowdForm" label-width="100px">
            <el-form-item label="投放名称" prop="launchName">
              <el-input size="small" v-model="crowdForm.launchName" placeholder="投放名称"></el-input>
            </el-form-item>
            <el-form-item label="投放平台" class="multipleSelect" prop="biIds">
              <el-select v-model="crowdForm.biIds" multiple placeholder="请选择投放平台">
                <el-option 
                  v-for="item in launchPlatform"
                  :key="item.biId"
                  :label="item.biName"
                  :value="item.biId"
                >
                  <!-- {{item.biName}} -->
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源" prop="dataSource">
              <input type="hidden" value="2" v-model="crowdForm.dataSource">
              <el-input size="small" readonly value="大数据"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input size="small" v-model="crowdForm.remark" readonly></el-input>
            </el-form-item>
            <el-form-item label="选择策略" prop="policyIds" class="multipleSelect" >
              <el-select v-model="crowdForm.policyIds" multiple placeholder="请选择策略" @change="getCrowd">
                <el-option
                  v-for="item in strategyPlatform"
                  :key="item.policyId"
                  :label="item.policyName"
                  :value="item.policyId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择人群" prop="policyCrowdIds">
               <el-form-item v-for="v in crowdData" :label="v.policyName" :key="v.policyId">
                <el-checkbox-group v-model="crowdForm.policyCrowdIds" v-loading="loading" @change="handleCheckedCitiesChange">
                  <el-checkbox
                    v-for="item in v.childs"
                    :label="item.crowdId"
                    :key="item.crowdId"
                  >{{item.crowdName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
             </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="addSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      // 表格当前页数据
      loading: false,
      tableData: [],
      launchStatusEnum: { "1": "待投放", "2": "计算中", "3": "投放中" },
      //搜索条件
      criteria: {},
      initTree: {},
      // 列表页
      searchForm: {
        launchName: ""
      },
      // 新增页
      addFormVisible: false, // 新增界面是否显示
      strategyPlatform: [],
      launchPlatform: [],
      getStrategyCrowds: [],
      // 新增界面数据
      crowdForm: {
        launchCrowdId: "", //投放ID
        dmpCrowdId: "",
        launchName: "", //投放名称
        biIds: "", //投放平台ID
        remark: "",
        dataSource: 2,
        policyIds: "",
        policyCrowdIds: []
      },
      crowdFormRules: {
        launchName: [
          { required: true, message: "请输入投放名称", trigger: "blur" }
        ],
        biIds: [{ required: true, message: "请选择投放平台", trigger: "blur" }],
        policyIds: [
          { required: true, message: "请选择策略平台", trigger: "blur" }
        ],
        policyCrowdIds: [
          { required: true, message: "请选择人群", trigger: "blur" }
        ]
      },
      filterText: "",
      crowdData: null,
      // 编辑页
      // editFormVisible: false,// 编辑界面是否显示
      // 默认每页数据量:pageSize
      pageSize: 10,
      // 当前页码:pageNum
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1,
      isShowCondition: false,
      selectStrategy: null, //人群条件的选择策略
      crowdArr: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    callback(data, successMsg) {
      if (data.msg) {
        this.$message({
          message: data.msg,
          type: "error"
        });
      } else {
        this.$message({
          message: successMsg,
          type: "success"
        });
        this.loadData();
      }
    },
    condition(row) {
      this.isShowCondition = true;
      this.$service
        .ruleDetail({ launchCrowdId: row.launchCrowdId })
        .then(({ respcl }) => {
          if (respcl.length > 0) {
            this.selectStrategy = respcl[0].policyName;
            this.crowdArr = respcl[0].childs;
          }
        });
    },
    del(row) {
      var id = row.launchCrowdId;
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service.launchCrowdDel({ launchCrowdId: id }).then(data => {
            this.callback(data, "删除成功");
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "出错了"
          });
        });
    },
    getCrowd() {
      this.loading = true;
      this.$service
        .getStrategyCrowds({ policyIds: this.crowdForm.policyIds.join(",") })
        .then(data => {
          this.crowdData = data
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 从服务器读取数据
    loadData: function() {
      this.criteria["pageNum"] = this.currentPage;
      this.criteria["pageSize"] = this.pageSize;
      console.log(JSON.stringify(this.criteria));
      this.$service.crowdList(this.criteria).then(data => {
        this.tableData = data.list;
        this.totalCount = data.total;
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
    // 重置
    handleReset: function() {
      this.$refs.searchForm.resetFields();
    },
    // 修改状态
    lanuch: function(index, row) {
      var id = row.launchCrowdId;
      this.$confirm("确定要投放吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service.launchCrowd({ launchCrowdId: id }).then(data => {
            this.callback(data, "投放成功");
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "出错了"
          });
        });
    },
    cancelLanuch(row) {
      var id = row.launchCrowdId;
      this.$confirm("确定要取消投放吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service.cancelLaunchCrowd({ launchCrowdId: id }).then(data => {
            this.callback(data, "取消投放成功");
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "出错了"
          });
        });
    },
    // 查看详情
    handleDetail: function(index, row) {
      var id = row.id;
      // todo: 以后再做
    },
    // 显示新增界面
    handleAdd: function() {
      this.crowdForm.launchCrowdId = "";
      this.crowdForm.dmpCrowdId = "";
      this.crowdForm.launchName = "";
      this.crowdForm.biIds = "";
      this.crowdForm.remark = "";
      this.crowdForm.dataSource = 2;
      this.crowdForm.policyIds = "";
      this.crowdForm.policyCrowdIds = [];
      this.$service.addCrowdLanuch().then((data)=>{
         this.launchPlatform=data.biLists
         this.strategyPlatform=data.policies;
         this.addFormVisible = true;
      })
    },
    // 新增
    addSubmit: function() {
      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          let crowdForm = JSON.stringify(this.crowdForm);
          crowdForm = JSON.parse(crowdForm);
          crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.join(",");
          this.$service.modifyLaunchCrowd(crowdForm).then(data => {
            this.callback(data, "添加成功");
            this.addFormVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 显示编辑页面
    handleEdit: function(index, row) {
      this.addFormVisible = true;
      this.crowdForm.launchCrowdId = row.launchCrowdId;
      this.crowdForm.dmpCrowdId = row.dmpCrowdId;
      this.crowdForm.launchName = row.launchName;
      this.crowdForm.biIds = 4;
      //row.biIds;
      this.crowdForm.remark = row.remark;
      this.crowdForm.dataSource = row.dataSource;
      this.crowdForm.policyIds =parseInt(row.policyIds);
      this.getCrowd();
      this.crowdForm.policyCrowdIds = row.policyCrowdIds;
    },
    // editSubmit
    editSubmit: function() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          let crowdForm = JSON.stringify(this.crowdForm);
          crowdForm = JSON.parse(crowdForm);
          crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.join(",");
          this.$service.modifyLaunchCrowd(crowdForm).then(data => {
            this.callback(data, "编辑成功");
            this.addFormVisible = false;
          });
        } else {
          alert("al");
          console.log("error submit!!");
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
      this.$refs["crowdForm"].resetFields();
    },
    cancelEdit: function() {
      this.editFormVisible = false;
      this.$message({
        showClose: true,
        message: "已取消编辑"
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
    }
  }
};
</script>

<style lang="stylus" scoped>
 .multipleSelect 
    >>>.el-select
          width 100%
</style>


