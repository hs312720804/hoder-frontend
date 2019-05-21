<template>
  <div>
  <div>
    <fieldset>
      <legend>{{selectRow.policyName}}</legend>
      <div>
        <div class="left">
          策略ID：{{selectRow.policyId}}
          策略纬度:
          <el-tag
            size="mini"
            v-for="item in selectRow.tagsList"
            :key="item.tagId"
            :type= "item.dataSource === 2 ? 'danger' : 'success'"
          >{{item.tagName}}</el-tag>
        </div>
        <div class="right">
          <el-button size="small" type="success" @click="goBack">返回</el-button>
        </div>
      </div>
    </fieldset>
    <!-- authority -->
    <div class="TopNav">
      <div class="left">
        <el-button-group>
          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-permission="'hoder:crowd:add'"
          >
            <a class="fa fa-plus" style="color: white;"></a>新增人群
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
          <el-form-item label prop="crowdName">
            <el-input v-model="searchForm.crowdName" style="width: 200px" placeholder="请输入人群名称"></el-input>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="人群名称:">
              <span>{{ props.row.crowdName }}</span>
            </el-form-item>
            <el-form-item label="标签:">
              <div
                v-for="(item, index) in JSON.parse(props.row.rulesJson).rules"
                :key="index"
                class="detail"
              >
                <div v-if="index>0" class="label-or-space">或</div>

                <div class="label-ground">(
                  <div
                    v-for="(childItem,childItemIndex) in item.rules"
                    :key="childItem.tagId"
                    class="label-item"
                  >
                    <div v-if="childItemIndex>0" class="label-or-space">且</div>
                    <span class="txt">{{ childItem.categoryName }}</span>
                    <span class="sel">{{ childItem.operator }}</span>
                    <span v-if="childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                    <span v-if="childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                    <span class="in">
                      <!-- <el-date-picker
                        v-if="childItem.tagType === 'time'"
                        class="datetime-format"
                        v-model="childItem.tagCode"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker> -->
                      <span >{{ childItem.value }}</span>
                    </span>
                    <span v-if="childItem.isDynamicTime === 2">天</span>
                  </div>)
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="crowdId" label="ID" width="50"></el-table-column>
      <el-table-column prop="crowdName" label="人群名称" width="200"></el-table-column>
      <el-table-column prop="priority" label="优先级" width="90"></el-table-column>
      <el-table-column prop="remark" label="备注" width="90"></el-table-column>
      <el-table-column prop="forcastStatus" label="估算状态" width="80">
          <template scope="scope">
              <span type="text" v-if="scope.row.forcastStatus == 1">未估算</span>
              <span type="text" v-if="scope.row.forcastStatus == 2">估算中</span>
              <el-button type="text" v-if="scope.row.forcastStatus == 3" @click="showCountResult(scope.row.crowdId)">已估算</el-button>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template scope="scope">
          <el-button-group>
            <el-button
              size="small"
              type="primary"
              v-permission="'hoder:crowd:edit'"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="info"
              v-permission="'hoder:crowd:del'"
              @click="del(scope.row)"
            >删除</el-button>
            <el-button
              size="small"
              type="warning"
              @click="estimateType(scope.row)"
              :disabled="scope.row.forcastStatus != 1"
            >估算</el-button>
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
  </div>
  <!-- 估算弹窗 -->
  <el-dialog :visible.sync="showEstimate">
    <el-checkbox-group v-model="estimateValue">
      <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" :disabled="index==0">{{item}}</el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
    <el-button @click="showEstimate = false">取 消</el-button>
    <el-button type="primary" @click="handleEstimate">提交估算</el-button>
  </span>
  </el-dialog>
  <!-- 估算结果弹窗 -->
   <el-dialog :visible.sync="showResult" title="估算结果">
       <div>设备：{{totalUser}}</div>
       <div>手机号：{{total1}}</div>
       <div>酷开openId：{{total2}}</div>
       <div>微信openId：{{total3}}</div>
   </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      //搜索条件
      criteria: {
        //  policyId:selectRow.policyId
      },
      // 列表页
      searchForm: {
        crowdName: ""
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
      estimateItems: [],
      showEstimate: false,
      estimateValue: ['0'],
      estimateId: '',
        showResult: false,
        total1: '',
        total2: '',
        total3: '',
        totalUser: '',
        total4: ''
    };
  },
  props: ["selectRow"],
  created() {
    this.loadData();
  },
  methods: {
    goBack() {
      this.$emit("goBack");
    },
    // tagsList(row) {},
    callback() {
        this.loadData();
    },
    handleAdd() {
      this.$emit("addCrowd");
    },
    edit(row) {
      this.$emit("addCrowd", row.crowdId);
    },
    del(row) {
      var id = row.crowdId;
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$service.strategyCrowdDel({ crowdId: id},"删除成功").then(()=>{
            this.loadData();
          })
        }).catch(function(){

        })
    },
      // 点击估算按钮
    estimateType(row) {
        this.estimateId = row.crowdId
        this.showEstimate = true
        this.$service.getEstimateType().then((data) => {
            this.estimateItems = data
        })
    },
      // 提交估算
    handleEstimate () {
        let calIdType = this.estimateValue.map((item) => item).join(',')
        this.$service.estimatePeople({crowdId: this.estimateId,calIdType: calIdType},"提交估算成功").then(
            () => {
                this.showEstimate = false
                this. loadData()
            }
        )
    },
      // 显示估算结果
    showCountResult (id) {
        const crowdId = id
        this.showResult = true
        this.$service.estimateResult({crowdId: crowdId}).then((data) => {
            this.total1 = data[0].total1 === null ? '暂无数据': data[0].total1
            this.total2 = data[0].total2 === null ? '暂无数据': data[0].total2
            this.total3 = data[0].total3 === null ? '暂无数据': data[0].total3
            this.totalUser = data[0].totalUser === null ? '暂无数据': data[0].totalUser
        })
    },
    // 从服务器读取数据
    loadData: function() {
      this.criteria["pageNum"] = this.currentPage;
      this.criteria["pageSize"] = this.pageSize;
      this.criteria.policyId = this.selectRow.policyId;
      this.$service.viewCrowd(this.criteria).then(data => {
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
          return false;
        }
      });
    },
    // 重置
    handleReset: function() {
      this.$refs.searchForm.resetFields();
    },
    // 查看详情
    // handleDetail: function(index, row) {
    //   var id = row.id;
    //   // todo: 以后再做
    // }
  }
};
</script>
<style lang="stylus" scoped>
fieldset
  border: 1px solid #ebeef5
  font-size: 14px
  color: #909399
  margin-bottom: 20px
  padding: 10px
fieldset>div
  display: flex
  justify-content: space-between
.label-ground, .label-item, .detail
  display: flex
.demo-table-expand >>> .el-form-item__content
  display: flex
.label-or-space
  color: #1ac71c
  margin: 0 5px
</style>
