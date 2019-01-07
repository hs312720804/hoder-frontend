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
            v-permission="'hoder:policy:add'"
          >
            <a class="fa fa-plus" style="color: white;"></a>新增
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="freshService"
            v-permission="'hoder:policy:add'"
          >
            <a class="fa fa-plus" style="color: white;"></a>刷新策略服务
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
          <el-form-item label prop="policyName">
            <el-input v-model="searchForm.policyName" style="width: 200px" placeholder="请输入策略名称"></el-input>
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
      <el-table-column prop="policyId" label="ID" width="50"></el-table-column>
      <el-table-column prop="policyName" label="策略名称" width="150"></el-table-column>
      <el-table-column prop="dataSource" label="数据来源" width="90">
        <template scope="scope">
          <span style="margin-left: 10px">{{lableDataSourceEnum[scope.row.dataSource]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tagsList" label="策略纬度">
        <template scope="scope">
          <el-tag
            size="mini"
            v-for="item in scope.row.tagsList"
            :key="item.tagId"
            type="success"
          >{{item.tagName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="350">
        <template scope="scope">
          <el-button-group>
             <el-button size="small" type="success" @click="crowdList(scope.row)">
              人群列表
              </el-button>
             <el-button
              size="small"
              type="primary"
              v-permission="'hoder:policy:edit'"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
             <el-button
              size="small"
              type="info"
              v-permission="'hoder:policy:del'"
              @click="del(scope.row)"
            >删除</el-button>
            <el-button
              size="small"
              type="info"
              v-permission="'hoder:policy:add'"
              @click="freshCache(scope.row)"
            >刷新策略缓存</el-button>
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
      title="新增策略"
      :visible.sync="addFormVisible"
      v-if="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="策略名称" prop="policyName">
          <el-input size="small" v-model="addForm.policyName" placeholder></el-input>
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSource">
          <el-select
            v-model="addForm.dataSource"
            filterable
            placeholder="请选择类型"
            @change="getTags"
          >
            <el-option label="数据平台" value="2"></el-option>
            <el-option label="自定义" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略纬度" prop="conditionTagIds">
          <el-tabs tab-position="top" style="height: 200px;">
            <el-tab-pane
              v-for="item in conditionTagIdsData"
              :label="item.groupName"
              :key="item.groupId"
            >
              <el-checkbox-group v-model="addForm.conditionTagIds" class="checkList">
                <el-checkbox v-for="v in item.child" :label="v.tagId" :key="v.tagId">{{v.tagName}}</el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
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
import _ from "lodash";
export default {
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      lableDataSourceEnum: {
        1: "自定义",
        2: "数据平台"
      },
      //搜索条件
      criteria: {},
      // 列表页
      searchForm: {
        policyName: ""
      },
      // 编辑页
      // editFormVisible: false,// 编辑界面是否显示
      // 默认每页数据量:pageSize
      pageSize: 10,
      // 当前页码:pageNum
      currentPage: 1,
      totalCount: 1,
      // 查询的页码
      start: 1,
      addFormVisible: false,
      conditionTagIdsData: [], //策略纬度
      tagList: [],
      defaultProps: {
        children: "child",
        label: "groupName"
      },
      // 默认数据总数
      addForm: {
        policyId: "",
        policyName: "",
        dataSource: "2",
        conditionTagIds: []
        // 以上为表单提交的参数
      },
      addFormRules: {
        policyName: [
          { required: true, message: "请填写策略名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    freshService(){
      this.$service.freshService().then((data)=>{
        this.$message({
          type:"info",
          message:data
        })
      })
    },
    freshCache(row){
      this.$service.freshCache({policyId:row.policyId}).then((data)=>{
       this.$message({
          type:"info",
          message:data
        })
      })
    },
    getTags() {
      this.addForm.conditionTagIds= [];
      this.$service
        .policyTagSeach({ dataSource: this.addForm.dataSource, s: "" })
        .then(data => {
          this.conditionTagIdsData = data;
        });
    },
    handleAdd() {
      this.addFormVisible = true;
      this.addForm.policyName = "";
      this.addForm.policyId= "";
      this.getTags();
    },
    handleEdit(row) {
      this.addFormVisible = true;
      this.addForm.policyId= row.policyId;
      this.addForm.policyName = row.policyName;
      this.addForm.dataSource=row.dataSource.toString();
      this.getTags();
      this.addForm.conditionTagIds=row.conditionTagIds.split(",").map(function(v,i){return parseInt(v)});
      //row.conditionTagIds.split(",");
    },
    crowdList(row) {
      this.$emit("openCrowdPage", row);
    },
    del(row) {
      var id = row.policyId;
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service.policyDel({ policyId: id },"删除成功").then(data => {
            this.loadData()
          });
        })
        .catch(() => {
          
        });
    },
    // 从服务器读取数据
    loadData: function() {
      this.criteria["pageNum"] = this.currentPage;
      this.criteria["pageSize"] = this.pageSize;
      this.$service.policyList(this.criteria).then(data => {
        this.tableData = data.pageInfo.list;
        this.totalCount = data.pageInfo.total;
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
    // 查看详情
    handleDetail: function(index, row) {
      var id = row.id;
      // todo: 以后再做
    },
    // 新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let addForm = JSON.stringify(this.addForm);
          addForm = JSON.parse(addForm);
          addForm.conditionTagIds = addForm.conditionTagIds.join(",")
          if(this.addForm.policyId!=""){
          this.$service.policyUpate(addForm,"编辑成功").then(data => {
            this.loadData();
            this.addFormVisible=false;
          });
          }else{
          this.$service.policyAddSave(addForm,"添加成功").then(data => {
            this.loadData();
             this.addFormVisible=false;
          });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    cancelAdd: function() {
      this.addFormVisible = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.checkList
  >>> .el-checkbox+.el-checkbox
    margin-left: 0px
  >>> .el-checkbox
    min-width 130px
    margin-right 5px
.checkList
  height: 200px
  overflow: auto

</style>
