<template>
  <div class="launch-list">
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
      <el-table-column prop="dmpCrowdId" label="dmp人群投放ID" width="80"></el-table-column>
      <el-table-column prop="biName" label="投放平台" width="120"></el-table-column>
      <el-table-column prop="status" label="人群状态" width="70">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{launchStatusEnum[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="menuIds" label="权限" width="200"></el-table-column>-->
      <el-table-column prop="expiryTime" label="人群有效期" width="180">
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.expiryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dmpEstimate" label="设备数量" width="80"></el-table-column>
      <el-table-column prop="total1" label="手机号数量" width="90"></el-table-column>
      <el-table-column prop="total3" label="微信openId数量" width="110"></el-table-column>
      <el-table-column prop="total2" label="酷开openId数量" width="110"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="department" label="业务部门"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="200">
        <template slot-scope="scope">
          <el-button-group  class="button-group-position">
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
    <!-- 投放提示估算弹窗 -->
    <el-dialog :visible.sync="showEstimate">
      <div class="choose-tip">请选择下列需要估算的字段，勾选保存后将估算该字段的人群数量</div>
      <el-checkbox-group v-model="estimateValue" aria-required="true">
        <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" @change="estimateValueChange(index)">
          {{item}}
          <el-popover
            v-if="index === '0'"
            placement="top"
            trigger="hover"
            style="margin-left: 2px; "
          >
            当勾选了手机号、酷开openId、微信openId时，设备默认勾选
            <span slot="reference" class="priority-tip">?</span>
          </el-popover>
          <el-popover
            v-if="index === '5'"
            placement="top"
            trigger="hover"
            style="margin-left: 2px; "
          >
            pushId 与其他数据类型互斥
            <span slot="reference" class="priority-tip">?</span>
          </el-popover>
        </el-checkbox>

      </el-checkbox-group>
      <div v-show='showError' class="error-msg">请至少选择一个要投放的人群</div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showEstimate = false">取 消</el-button>
    <el-button type="primary" @click="handleEstimate">投放</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
// import _ from "lodash";
export default {
  data () {
    return {
      // 表格当前页数据
      tableData: [],
      launchStatusEnum: { 1: '待投放', 2: '计算中', 3: '投放中' },
      // 搜索条件
      criteria: {},
      // 列表页
      searchForm: {
        launchName: ''
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
      selectStrategy: null, // 人群条件的选择策略
      showEstimate: false,
      estimateValue: ['0'],
      estimateItems: [],
      currentLaunchId: '',
      showError: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 选项之间互斥
    estimateValueChange (val) {
      const arr1 = ['0', '1', '2', '3']
      const arr2 = ['5']

      // arr1 与 arr2 选中值互斥
      if (arr1.includes(val)) {
        const vals = this.estimateValue
        const index = vals.findIndex(item => item === '5')

        if (index > -1) {
          this.estimateValue.splice(index, 1)
        }
      } else {
        this.estimateValue = arr2
      }

      // 选择了 ['1', '2', '3'] ，必须勾选 '0'
      if (['1', '2', '3'].includes(val)) {
        this.estimateValue = [...new Set(['0', ...this.estimateValue])]
      }
    },
    callback () {
      this.loadData()
    },
    handleAdd () {
      this.$emit('changeStatus', false)
    },
    handleEdit (launchCrowdId) {
      this.$emit('changeStatus', false, launchCrowdId)
    },
    condition (row) {
      this.isShowCondition = true
      this.$service
        .ruleDetail({ launchCrowdId: row.launchCrowdId })
        .then(({ respcl }) => {
          // if (respcl.length > 0) {
          this.selectStrategy = respcl
          // }
        })
    },
    del (row) {
      const id = row.launchCrowdId
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.launchCrowdDel({ launchCrowdId: id }, '删除成功').then(() => {
            this.callback()
          })
        })
        .catch(() => {
        })
    },
    // 从服务器读取数据
    loadData: function () {
      this.criteria.pageNum = this.currentPage
      this.criteria.pageSize = this.pageSize
      this.$service.crowdList(this.criteria).then(data => {
        this.tableData = data.list
        this.totalCount = data.total
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
      // var _this = this;
      // this.$refs.searchForm.validate(function(result) {
      //   if (result) {
      //     _this.criteria = _this.searchForm;
      //     _this.loadData();
      //   } else {
      //     return false;
      //   }
      // });
      this.$refs.searchForm.validate((result) => {
        if (result) {
          this.criteria = this.searchForm
          this.loadData()
        } else {
          return false
        }
      })
    },
    // 重置
    handleReset: function () {
      this.searchForm.launchName = ''
      this.criteria = {}
      this.loadData()
    },
    // 修改状态
    lanuch: function (index, row) {
      this.currentLaunchId = row.launchCrowdId
      this.showEstimate = true
      this.$service.getEstimateType().then((data) => {
        this.estimateItems = data
      })
      // this.$confirm("确定要投放吗?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.$service.launchCrowd({ launchCrowdId: id },"投放成功").then(data => {
      //       this.callback();
      //     });
      //   })
      //   .catch(() => {
      //
      //   });
    },
    handleEstimate () {
      if (this.estimateValue.length === 0) {
        this.showError = true
        return
      } else { this.showError = false }
      const calIdType = this.estimateValue.map((item) => item).join(',')
      this.$service.launchCrowd({ launchCrowdId: this.currentLaunchId, calIdType: calIdType }, '投放成功').then(() => {
        this.showEstimate = false
        this.callback()
      })
    },
    cancelLanuch (row) {
      const id = row.launchCrowdId
      this.$confirm('确定要取消投放吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$service.cancelLaunchCrowd({ launchCrowdId: id }, '取消投放成功').then(() => {
            this.callback()
          })
        })
        .catch(() => {

        })
    }
    // 查看详情
    // handleDetail: function(index, row) {
    //   var id = row.id;
    //   // todo: 以后再做
    // }
  }
}
</script>
<style lang="stylus" scoped>
  .choose-tip
    margin 20px 0
    color red
  .launch-list >>> .button-group-position .el-button
    margin 3px
  .error-msg
    color red
    font-size 14px
    margin-top 10px
</style>
