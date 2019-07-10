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
            :type= "item.dataSource === 2 ? 'danger' : (item.dataSource === 1 ? 'success' : '')"
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
                    :key="childItem.tagId+childItemIndex"
                    class="label-item"
                  >
                    <div v-if="childItemIndex>0" class="label-or-space">且</div>
                    <span class="txt">{{ childItem.categoryName }}</span>
                    <span class="sel">{{ childItem.operator }}</span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
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
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
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
      <el-table-column prop="priority" label="优先级" width="60"></el-table-column>
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
      <el-table-column prop="creatorName" label="创建人" width="80"></el-table-column>
      <el-table-column prop="department" label="业务部门" width="80"></el-table-column>
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
            <el-dropdown @command="handleCommandStastic" v-permission="'hoder:statistics:index'">
              <el-button size="small" type="danger">
                统计
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        :command="['detail',scope.row]"
                >使用情况</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    <!-- 查看统计弹窗-->
    <el-dialog
            :visible.sync="showStatistics"
            width="90%"
    >
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{hitLinesTitle}}</div>
          <div class="main" ref="hitLine" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{hitPieTitle}}</div>
          <div class="main" ref="hitPie" v-if=" showStatistics === true"></div>
        </div>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time2"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{exposeLinesTitle}}</div>
          <div class="main" ref="exposeLine" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time3"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{exposePieTitle}}</div>
          <div class="main" ref="exposePie" v-if=" showStatistics === true"></div>
        </div>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time4"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{clickLinesTitle}}</div>
          <div class="main" ref="clickLine" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time5"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{clickPieTitle}}</div>
          <div class="main" ref="clickPie" v-if=" showStatistics === true"></div>
        </div>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time6"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{crowdLaunchTitle}}</div>
          <div class="funnel-tips">人群投放过程中的数据（单位：条）</div>
          <div class="main" ref="crowdLaunch" v-if=" showStatistics === true"></div>
        </div>
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    v-model="time7"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <div class="lines-title">{{exposeProvinceTitle}}</div>
          <div class="main" ref="exposeProvince" v-if=" showStatistics === true"></div>
        </div>
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
        total4: '',
        time: [],
        time1: [],
        time2: [],
        time3: [],
        time4: [],
        time5: [],
        time6: [],
        time7: [],
        showStatistics: false,
        hitLinesTitle: '',
        hitPieTitle: '',
        exposeLinesTitle: '',
        exposePieTitle: '',
        clickLinesTitle: '',
        clickPieTitle: '',
        crowdLaunchTitle: '',
        exposeProvinceTitle: '',
        startDate: '',
        endDate: '',
        currentCid: undefined
    };
  },
  props: ["selectRow"],
  created() {
    this.loadData();
      const start = new Date()
      const end = new Date()
      this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
      this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
      this.time = [this.startDate,this.endDate]
      this.time1 = [this.startDate,this.endDate]
      this.time2 = [this.startDate,this.endDate]
      this.time3 = [this.startDate,this.endDate]
      this.time4 = [this.startDate,this.endDate]
      this.time5 = [this.startDate,this.endDate]
      this.time6 = [this.startDate,this.endDate]
      this.time7 = [this.startDate,this.endDate]
  },
  watch: {
      time(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0 && val !== oldVal){
              if(this.setDataInMonth(val[0],val[1])){
                  this.drawCrowdLine(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time = oldVal
              }
          }
      },
      time1(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.drawCrowdPie(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time1 = oldVal
              }
          }
      },
      time2(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.drawExposeLine(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time2 = oldVal
              }
          }
      },
      time3(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.drawExposePie(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time3 = oldVal
              }
          }
      },
      time4(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.drawClickLine(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time4 = oldVal
              }
          }
      },
      time5(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.drawClickPie(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time5 = oldVal
              }
          }
      },
      time6(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.crowdLaunchDetail(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time6 = oldVal
              }
          }
      },
      time7(val,oldVal) {
          if(this.currentCid && oldVal.length !== 0){
              if(this.setDataInMonth(val[0],val[1])){
                  this.setProvinceData(this.currentCid,val[0],val[1])
              }else{
                  this.$message('日期间隔最多只能是30天！请重新选择日期')
                  this.time7 = oldVal
              }
          }
      }
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
      // 通用多线性参数设置
      setLinesEchart (element,title,xData,yData,legend) {
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title
              },
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data: legend
              },
              xAxis: {
                  type: 'category',
                  data: xData,
                  axisLabel: {
                      interval: 0,
                      rotate: -45
                  }
              },
              yAxis: {
                  type: 'value',
                  axisTick: {
                      inside: true
                  },
                  scale: true,
                  axisLabel: {
                      margin: 2,
                      formatter: function (value) {
                          if (value >= 10000 && value < 10000000) {
                              value = value / 10000 + "万";
                          }
                          else if (value >= 10000000) {
                              value = value / 10000000 + "千万";
                          } return value;
                      }
                  },
              },
              series: yData
          })
      },
      setCircleEcharts(element,title,legend,data){
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: legend
              },
              series: [
                  {
                      name:'',
                      type:'pie',
                      radius: ['50%', '70%'],
                      avoidLabelOverlap: false,
                      itemStyle: {
                          normal: {label:{
                                  show:true,
                                  formatter:'{b} : {c} ({d}%)'
                              },
                              labelLine:{show:true}},
                          emphasis: {
                              label: {
                                  show: true,
                                  formatter: "{b}\n{c} ({d}%)",
                                  position: 'center',
                                  textStyle: {
                                      fontSize: '20',
                                      fontWeight: 'bold'
                                  }
                              }
                          }
                      },
                      data: data
                  }
              ]
          });
      },
      setMapEcharts (element,title,data) {
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          // 中国地图
          myChart.setOption({
              title : {
                  text: title,
                  // subtext: '纯属虚构',
                  left: 'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: '{b}<br/>({c}%)'
              },
              series : [
                  {
                      name: '省份分布',
                      type: 'map',
                      mapType: 'china',
                      roam: false,
                      label: {
                          normal: {
                              show: false
                          },
                          emphasis: {
                              show: true
                          }
                      },
                      data:data
                  },
              ]
          });
      },
      setFunnelEcharts(element,title,legend,data){
          let echarts = require('echarts')
          let myChart = echarts.init(this.$refs[element])
          myChart.setOption({
              title: {
                  text: title
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  data: legend
              },
              calculable: true,
              series: [
                  {
                      name:'漏斗图',
                      type:'funnel',
                      left: '10%',
                      top: 60,
                      //x2: 80,
                      bottom: 60,
                      width: '80%',
                      // height: {totalHeight} - y - y2,
                      min: 0,
                      max: 100,
                      minSize: '0%',
                      maxSize: '100%',
                      sort: 'descending',
                      gap: 2,
                      label: {
                          show: true,
                          position: 'inside'
                      },
                      labelLine: {
                          length: 10,
                          lineStyle: {
                              width: 1,
                              type: 'solid'
                          }
                      },
                      itemStyle: {
                          borderColor: '#fff',
                          borderWidth: 1
                      },
                      emphasis: {
                          label: {
                              fontSize: 20
                          }
                      },
                      data: data
                  }
              ]
          });
      },
      // 策略使用以及各业务使用次数统计
      handleCommandStastic(scope) {
          const type = scope[0]
          this.currentCid = scope[1].crowdId
          this.showStatistics = true
          if(type === 'detail') {
              this.drawCrowdPie(this.currentCid,this.time1[0],this.time1[1])
              this.drawCrowdLine(this.currentCid,this.time[0],this.time[1])
              this.drawExposePie(this.currentCid,this.time3[0],this.time3[1])
              this.drawExposeLine(this.currentCid,this.time2[0],this.time2[1])
              this.drawClickPie(this.currentCid,this.time5[0],this.time5[1])
              this.drawClickLine(this.currentCid,this.time4[0],this.time4[1])
              this.crowdLaunchDetail(this.currentCid,this.time6[0],this.time6[1])
              this.setProvinceData(this.currentCid,this.time7[0],this.time7[1])
          }
      },
      drawCrowdPie(id,startTime,endTime){
        this.$service.hitAndBiToTalPie({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
            if(data.data.length === 0){this.hitPieTitle = '累计命中次数按业务分布暂无数据'}
            else{this.hitPieTitle = '累计命中次数按业务分布'}
            this.setCircleEcharts('hitPie','',data.name,data.data)
        })
      },
      drawCrowdLine(id,startTime,endTime){
          this.$service.hitAndBiToTalLine({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const legendData = data.series.map((key) => {
                  return key.name
              })
              const linesData = data.series.map((key) => {
                  return {name:key.name, data:key.data, type: 'line'}
              })
              this.hitLinesTitle = '该人群总命中量以及各业务的命中量'
              this.setLinesEchart('hitLine','',data.date,linesData,legendData)
          })
      },
      drawExposePie(id,startTime,endTime){
          this.$service.exposeCrowdTotalPie({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              if(data.data.length === 0){this.exposePieTitle = '累计曝光数按业务分布暂无数据'}
              else{this.exposePieTitle = '累计曝光数按业务分布'}
              this.setCircleEcharts('exposePie','',data.name,data.data)
          })
      },
      drawExposeLine(id,startTime,endTime){
          this.$service.exposeCrowdTotalLine({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const legendData = data.series.map((key) => {
                  return key.name
              })
              const linesData = data.series.map((key) => {
                  return {name:key.name, data:key.data, type: 'line'}
              })
              this.exposeLinesTitle = '该人群总曝光量以及各业务的曝光量'
              this.setLinesEchart('exposeLine','',data.date,linesData,legendData)
          })
      },
      drawClickPie(id,startTime,endTime){
          this.$service.clickCrowdTotalPie({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              if(data.data.length === 0){this.clickPieTitle = '累计点击次数按业务分布暂无数据'}
              else{this.clickPieTitle = '累计点击次数按业务分布'}
              this.setCircleEcharts('clickPie','',data.name,data.data)
          })
      },
      drawClickLine(id,startTime,endTime){
          this.$service.clickCrowdTotalLine({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const legendData = data.series.map((key) => {
                  return key.name
              })
              const linesData = data.series.map((key) => {
                  return {name:key.name, data:key.data, type: 'line'}
              })
              this.clickLinesTitle = '该人群总点击以及各业务的点击次数'
              this.setLinesEchart('clickLine','',data.date,linesData,legendData)
          })
      },
      crowdLaunchDetail(id,startTime,endTime){
          this.$service.crowdLanuchData({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              if(data.data.length === 0){this.crowdLaunchTitle = '该人群投放数据漏斗基本详情暂无数据'}
              else{this.crowdLaunchTitle = '该人群投放数据漏斗基本详情'}
              this.setFunnelEcharts('crowdLaunch','',data.names,data.data)
          })
      },
      setProvinceData(id,startTime,endTime){
          this.$service.exposeProvinceScale({cid:id,startTime:startTime,endTime:endTime}).then((data)=> {
              const newData = data.map((item)=> {
                  return {name: item.name,value: parseFloat(item.value)}
              })
              this.exposeProvinceTitle = '曝光人群省份分布'
              this.setMapEcharts('exposeProvince','',newData)
          })
      },
      formatDate (d) {
          const time = new Date(d)
          let y = time.getFullYear(); // 年份
          let m = (time.getMonth() + 1).toString().padStart(2,'0'); // 月份
          let r = time.getDate().toString().padStart(2,'0'); // 日子
          return `${y}-${m}-${r}`
      },
      setDataInMonth(startDate,endDate){
          const startTime = new Date(startDate).getTime()
          const endTime = new Date(endDate).getTime()
          const oneMonth = 3600*1000*24*30
          if(endTime - startTime > oneMonth) {return false}
          else{return true}
      }
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
.echarts-container
  position relative
  width 50%
  height auto
  float left
.crowd-statistic
  border-bottom 1px dashed #ccc
  &:before
  &:after
    display table
    content ""
  &:after
    clear: both
.main
  width 100%
  height 300px
  padding 30px
.click-date-picker
  text-align center
  margin 20px 0
.lines-title
  position absolute
  font-size 18px
  font-weight bold
  color #000
  margin-left 25px
.funnel-tips
  font-size 14px
  color #333
  margin 50px 0 0 25px
</style>
