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
            v-permission="'hoder:launch:crowd:modify'"
          >
            <a class="fa fa-plus" style="color: white;"></a>新增投放
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
    <el-table ref="myTable" :data="tableData" style="width: 100%;" stripe border>
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
      <el-table-column label="操作" fixed="right">
        <template scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.status==1"
              v-permission="'hoder:launch:crowd:launch'"
              size="small"
              type="warning"
              @click="lanuch(scope.$index, scope.row)"
            >投放</el-button>
            <el-button
              v-if="scope.row.status==3"
              v-permission="'hoder:launch:crowd:cancel'"
              size="small"
              type="warning"
              @click="cancelLanuch(scope.row)"
            >取消投放</el-button>
            <el-button
              size="small"
              type="success"
              v-permission="'hoder:launch:crowd:detail'"
              @click="condition(scope.row) "
            >人群条件</el-button>
            <el-button
              v-if="scope.row.status==1"
              v-permission="'hoder:launch:crowd:modify'"
              size="small"
              type="primary"
              @click="handleEdit(scope.row.launchCrowdId)"
              shiro:hasPermission="sysAdministrative:role:edit"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status==1"
              v-permission="'hoder:launch:crowd:del'"
              size="small"
              type="info"
              @click="del(scope.row)"
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
    <el-dialog title="选择的策略" :visible.sync="isShowCondition" width="30%">
      <el-form>
        <el-form-item :label="item.policyName" v-for="item in selectStrategy" :key="item.policyName">
          <el-checkbox
            v-model="v.choosed"
            v-for="v in item.childs"
            :key="v.crowdId"
            disabled
          >{{v.crowdName}}
          </el-checkbox>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      launchStatusEnum: { "1": "待投放", "2": "计算中", "3": "投放中" },
      //搜索条件
      criteria: {},
      // 列表页
      searchForm: {
        launchName: ""
      },
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
      selectStrategy: null//人群条件的选择策略
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    callback() {
        this.loadData();
    },
    handleAdd() {
      this.$emit("changeStatus", false);
    },
    handleEdit(launchCrowdId) {
      this.$emit("changeStatus", false, launchCrowdId);
    },
    condition(row) {
      this.isShowCondition = true;
      this.$service
        .ruleDetail({ launchCrowdId: row.launchCrowdId })
        .then(({ respcl }) => {
         // if (respcl.length > 0) {
            this.selectStrategy = respcl
          //}
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
          this.$service.launchCrowdDel({ launchCrowdId: id },"删除成功").then(data => {
            this.callback();
          });
        })
        .catch(() => {
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
          this.$service.launchCrowd({ launchCrowdId: id },"投放成功").then(data => {
            this.callback();
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
          this.$service.cancelLaunchCrowd({ launchCrowdId: id },"取消投放成功").then(data => {
            this.callback();
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
    }
  }
};
</script>