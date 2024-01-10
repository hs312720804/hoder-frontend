<template>
  <div>
  <div class="crowd-list">
    <fieldset>
      <legend>{{ selectRow.policyName }}</legend>
      <div class="crowd-top">
        <div class="crowd-top-back">
          <el-button type="text" @click="goBack">
            <i class="el-icon-cc-left"></i>返回
          </el-button>
        </div>
        <div>
          策略ID：{{ selectRow.policyId }}
          策略维度:
          <el-tag
            size="mini"
            v-for="item in selectRow.tagsList"
            :key="item.tagId"
            :type= "dataSourceColorEnum[item.dataSource]"
          >{{ item.tagName }}</el-tag>
        </div>
      </div>
    </fieldset>
    <!-- authority -->
    <div class="header">
      <div class="header-left">
        <el-button-group v-if="!smart">
          <el-tooltip placement="top-start">
            <div slot="content">点击将按人群优先级除去交叉部分，批量估算所有上架中的人群</div>
            <span class="uneffective">
              <el-button
                type="text"
                size="medium"
                @click="handleBatchEstimate"
                :disabled="canBatchEstimate"
              >
              批量估算
              </el-button>
              <!--<span>?</span>-->
            </span>
          </el-tooltip>
          <el-button
                  type="text"
                  size="medium"
                  @click="handleByPass"
          >
            请求分流
          </el-button>
        </el-button-group>
      </div>
      <div class="header-right">
        <!-- form search -->
        <div class="search-input">
          <!-- <el-input
                  v-model="searchForm.crowdName"
                  style="width: 350px"
                  placeholder="请输入人群名称"
                  :clearable='true'
                  @keyup.enter.native="handleSearch"
          ></el-input>
          <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i> -->

          <el-input
            v-model="searchForm.crowdName"
            style="width: 350px"
            placeholder="请输入人群名称"
            :clearable='true'
            @keyup.enter.native="handleSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
        <!-- 普通人群 - 新增 -->
        <div v-if="smart">
          <el-button
                  type="primary"
                  size="small"
                  :disabled="tableData.length > 0"
                  @click="handleAddDynamic"
                  v-permission="'hoder:crowd:add'"
          >
            <a class="fa fa-plus" style="color: white"></a>新增动态人群
          </el-button>
        </div>
        <!-- 动态人群 - 新增 -->
        <div v-else>
          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-permission="'hoder:crowd:add'"
          >
            <a class="fa fa-plus" style="color: white"></a>新增人群
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleLink"
            v-permission="'hoder:crowd:add'"
          >
            <a class="fa fa-plus" style="color: white"></a>引用人群
          </el-button>
        </div>
        <div>
          <el-popover
            placement="top"
            trigger="click"
            class="popover-button"
          >
            <div>
              <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                <el-checkbox label="createTime">创建时间</el-checkbox>
                <el-checkbox label="creatorName">创建人</el-checkbox>
                <!--<el-checkbox label="apiStatus">是否生效</el-checkbox>-->
                <el-checkbox label="department">业务部门</el-checkbox>
                <el-checkbox label="remark">备注</el-checkbox>
                <!--<el-checkbox label="crowdValidStatus">是否有效期内</el-checkbox>-->
              </el-checkbox-group>
            </div>
            <i
                    class="el-icon-cc-setting operate"
                    slot="reference"
            >
            </i>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- talbe -->
    <!-- 动态人群的table -->
    <div v-if="smart">
      <el-table
        ref="myTable"
        :data="tableData"
        style="width: 100%"
        stripe
        border
        :row-class-name="tableRowClassName"
        :span-method="smartObjectSpanMethod"
        row-key="crowdId"
        @sort-change="handleSortChange"
      >
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column prop="crowdId" label="人群ID" width="90" sortable="custom"></el-table-column>
        <el-table-column prop="crowdName" label="人群名称" width="200">
            <template slot-scope="scope">
                <span v-if="scope.row.abMainCrowd === 0">{{scope.row.crowdName}}</span>
                <el-button type="text" v-else @click="showDivideResult(scope.row.crowdId)">{{scope.row.crowdName}}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="110" sortable="custom">
            <template slot="header">
              优先级
              <el-popover
                placement="top"
                trigger="hover"
                class="popover-button"
              >
                <div>数字越大，优先级越高</div>
                <span class="priority-tip" slot="reference">!</span>
              </el-popover>
            </template>
            <template slot-scope="scope">
                <priorityEdit
                  @refresh="loadData"
                  :showEdit="(showByPassColumn && scope.row.id) || !showByPassColumn"
                  :byPassId="scope.row.id"
                  :data="scope.row.priority"
                  :policyId="scope.row.policyId"
                  :crowdId="scope.row.crowdId"
                  :isDynamicPeople="true">
                </priorityEdit>
            </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" sortable="custom">
          <template slot-scope="scope">
            {{ launchStatusEnum[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="流量占比" >
          <template slot-scope="scope">
            {{ scope.row.flowNum }}%
            <!-- <span v-if="scope.row.putway === 1">生效中</span>
            <span v-if="scope.row.putway === 0">已下架</span> -->
          </template>
        </el-table-column>

        <el-table-column v-if="(checkList.indexOf('createTime') > -1)" prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" prop="creatorName" label="创建人" width="80"></el-table-column>
        <el-table-column v-if="(checkList.indexOf('department') > -1)" prop="department" label="业务部门" width="80"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="el-button-group">

              <el-dropdown @command="handleCommandStastic">
                <el-button size="small" type="text">
                  分析
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                          :command="['estimatedDetail',scope.row]"
                          v-if="scope.row.forcastStatus == 3"
                  >估算画像</el-dropdown-item>
                  <el-dropdown-item
                          :command="['detail',scope.row]"
                  >命中曝光分析</el-dropdown-item>
                  <!-- <el-dropdown-item
                          :command="['homepageData',scope.row]"
                  >看主页数据</el-dropdown-item> -->
                  <el-dropdown-item
                          :command="['appointment',scope.row]"
                  >预约投后分析</el-dropdown-item>
                  <!--<el-dropdown-item-->
                  <!--:command="['redirectCrowd',scope.row]"-->
                  <!--&gt;重定向数据</el-dropdown-item>-->
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown @command="handleDynamicCommandOpreate">
                <el-button size="small" type="text">
                  更多
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                          :command="['edit',scope.row]"
                          v-permission="'hoder:crowd:edit'"
                          :disabled="scope.row.putway === 0"
                  >编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="['del',scope.row]"
                    v-permission="'hoder:crowd:del'"
                  >删除
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="['upDown',scope.row]"
                  >人群<span v-if="scope.row.putway === 1">下架</span><span v-else>上架</span>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                          :command="['copy',scope.row]"
                          :disabled="scope.row.putway === 0"
                  >人群复制
                  </el-dropdown-item> -->
<!--
                  <el-dropdown-item
                          :command="['commitHistory',scope.row]"
                  >提交历史数据
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
              <!--<el-button-->
                      <!--size="small"-->
                      <!--type="primary"-->
                      <!--@click="handleClickRedirectWithId(scope.row)"-->
                      <!--v-if="crowdValidEnum[scope.row.crowdValidStatus] == '已过期'"-->
              <!--&gt;新增重定向投放</el-button>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <!-- <el-button size="small" type="text">
            编辑
          </el-button> -->
          <template slot-scope="scope">
            <div class="el-button-group">
              <!-- 编辑大人群 -->
              <el-dropdown @command="handleBigDynamicCommandOpreate">
                <el-button size="small" type="text">
                  编辑
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="['step1',scope.row]" v-permission="'hoder:crowd:edit'">
                    编辑基础人群
                  </el-dropdown-item>
                  <el-dropdown-item :command="['step2',scope.row]" v-permission="'hoder:crowd:edit'">
                    编辑动态人群
                  </el-dropdown-item>
                  <el-dropdown-item :command="['step3',scope.row]" v-permission="'hoder:crowd:edit'">
                    编辑流转条件
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!--<el-button-->
                      <!--size="small"-->
                      <!--type="primary"-->
                      <!--@click="handleClickRedirectWithId(scope.row)"-->
                      <!--v-if="crowdValidEnum[scope.row.crowdValidStatus] == '已过期'"-->
              <!--&gt;新增重定向投放</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="color: #909399; margin: 30px 0 10px;">对比人群</div>
      <el-table
        ref="myTable"
        :data="contrastCrowdTableData"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        stripe
        border
        row-key="crowdId"
        @sort-change="handleSortChange"
      >
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column prop="crowdId" label="人群ID" width="90" sortable="custom" ></el-table-column>
        <el-table-column prop="crowdName" label="人群名称" width="200">
            <template slot-scope="scope">
                <span v-if="scope.row.abMainCrowd === 0">{{ scope.row.crowdName }}</span>
                <el-button type="text" v-else @click="showDivideResult(scope.row.crowdId)">{{scope.row.crowdName}}</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="110" sortable="custom" >
            <template slot="header">
              优先级
              <el-popover
                placement="top"
                trigger="hover"
                class="popover-button"
              >
                <div>数字越大，优先级越高</div>
              <span class="priority-tip" slot="reference">!</span>
              </el-popover>
            </template>
            <template slot-scope="scope">
                <priorityEdit
                  @refresh="loadData"
                  :showEdit="(showByPassColumn && scope.row.id) || !showByPassColumn"
                  :byPassId="scope.row.id"
                  :data="scope.row.priority"
                  :policyId="scope.row.policyId"
                  :crowdId="scope.row.crowdId"
                  :isDynamicPeople="true">
                </priorityEdit>
            </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" sortable="custom">
          <template slot-scope="scope">
            {{ launchStatusEnum[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="流量占比" >
          <template slot-scope="scope">
            {{ scope.row.flowNum }}%
          </template>
        </el-table-column>

        <el-table-column v-if="(checkList.indexOf('createTime') > -1)" prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" prop="creatorName" label="创建人" width="80"></el-table-column>
        <el-table-column v-if="(checkList.indexOf('department') > -1)" prop="department" label="业务部门" width="80"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="el-button-group">

              <el-dropdown @command="handleCommandStastic">
                <el-button size="small" type="text">
                  分析
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                          :command="['estimatedDetail',scope.row]"
                          v-if="scope.row.forcastStatus == 3"
                  >估算画像</el-dropdown-item>
                  <el-dropdown-item
                          :command="['detail',scope.row]"
                  >命中曝光分析</el-dropdown-item>
                  <!-- <el-dropdown-item
                          :command="['homepageData',scope.row]"
                  >看主页数据</el-dropdown-item> -->
                  <el-dropdown-item
                          :command="['appointment',scope.row]"
                  >预约投后分析</el-dropdown-item>
                  <!--<el-dropdown-item-->
                  <!--:command="['redirectCrowd',scope.row]"-->
                  <!--&gt;重定向数据</el-dropdown-item>-->
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown @command="handleDynamicCommandOpreate">
                <el-button size="small" type="text">
                  更多
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                          :command="['edit',scope.row]"
                          v-permission="'hoder:crowd:edit'"
                          :disabled="scope.row.putway === 0"
                  >编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                          :command="['del',scope.row]"
                          v-permission="'hoder:crowd:del'"
                  >删除
                  </el-dropdown-item>
                  <el-dropdown-item
                          :command="['upDown',scope.row]"
                  >人群<span v-if="scope.row.putway === 1">下架</span><span v-else>上架</span>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                          :command="['copy',scope.row]"
                          :disabled="scope.row.putway === 0"
                  >人群复制
                  </el-dropdown-item> -->

                  <!-- <el-dropdown-item
                          :command="['commitHistory',scope.row]"
                  >提交历史数据
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
              <!--<el-button-->
                      <!--size="small"-->
                      <!--type="primary"-->
                      <!--@click="handleClickRedirectWithId(scope.row)"-->
                      <!--v-if="crowdValidEnum[scope.row.crowdValidStatus] == '已过期'"-->
              <!--&gt;新增重定向投放</el-button>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="">
        </el-table-column>
      </el-table>
    </div>
    <el-table
      v-else
      ref="myTable"
      :data="tableData"
      style="width: 100%"
      stripe
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      row-key="crowdId"
      :expand-row-keys="initExpandCrowd"
      @expand-change="handleExpandChange"
      @sort-change="handleSortChange"
    >
      <!-- :default-sort="{prop: 'priority', order: 'descending'}" -->
      <el-table-column v-if="showByPassColumn" label="分流占比" width="120px">
        <template slot-scope="scope">
          <div>{{scope.row.bypassName}}</div>
          <div v-if="scope.row.bypassName !== '未分组'">
            <div>分流id：{{ scope.row.bypassId }}</div>
            <div>占比：{{ scope.row.ratio }}%</div>
            <div>
              <el-button type="text" @click="handleEditBypass">编辑</el-button>
              <el-button type="text" @click="handleDeleteBypass(scope.row)">删除</el-button>
              <el-button type="text" @click="handleSeeConfigBypass(scope.row.bypassId)">查看配置</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="人群名称:">
              <span>{{ props.row.crowdName }}</span>
            </el-form-item>
            <el-form-item label="人群规则:">
              <div
                v-for="(item, index) in JSON.parse(props.row.rulesJson).rules"
                :key="index"
                class="detail"
              >
                <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(props.row.rulesJson).condition] }}</div>

                <div class="label-ground">(
                  <div
                    v-for="(childItem,childItemIndex) in item.rules"
                    :key="childItem.tagId+childItemIndex"
                    class="label-item"
                  >
                    <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
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
            <el-form-item label="动态标签:" v-if="props.row.dynamicPolicyJson">
              <div
                      v-for="(item, index) in JSON.parse(props.row.dynamicPolicyJson).rules"
                      :key="index"
                      class="detail"
              >
                <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(props.row.dynamicPolicyJson).condition] }}</div>

                <div class="label-ground">(
                  <div
                          v-for="(childItem,childItemIndex) in item.rules"
                          :key="childItem.tagId+childItemIndex"
                          class="label-item"
                  >
                    <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
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
            <!--<el-form-item label="人群状态">-->
            <crowdStatusResource
                    ref="crowdStatusResourceRef"
                    :crowd-id="props.row.crowdId"
                    :key="props.row.crowdId"
                    :status="launchStatusEnum[props.row.status]"
            ></crowdStatusResource>
            <!--</el-form-item>-->
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="40" align="center"></el-table-column>
      <el-table-column prop="crowdId" label="人群ID" width="90" sortable="custom" ></el-table-column>
      <el-table-column prop="crowdName" label="人群名称" width="180">
          <template slot-scope="scope">
            {{ scope.row.crowdName }}

            <!-- 动态人群
            <el-button v-if="scope.row.dynamicFlag===1" type="text" @click="showDynamicList(scope.row.crowdId)">{{scope.row.crowdName}}</el-button>

            普通人群
            <span v-else-if="scope.row.abMainCrowd === 0">{{ scope.row.crowdName }}</span>

            AB实验人群 或者 再分割人群
            <el-button type="text" v-else @click="showDivideResult(scope.row.crowdId)">{{scope.row.crowdName}}</el-button> -->
          </template>
      </el-table-column>
      <!-- <el-table-column prop="launchTime" label="投放时间" width="200">
      </el-table-column> -->
      <el-table-column prop="crowdName" label="人群类型" width="100">
        <template slot-scope="scope">
          <!-- 12314 -->
          <!-- 是否被使用了 -- {{ scope.row.isUsedAsTag }} -->
          <!-- 动态人群 -->
          <span v-if="scope.row.dynamicFlag===1">动态人群</span>
          <!-- 引用人群 -->
          <span v-else-if="isReferCrowd(scope.row.referCrowdId)">引用人群</span>
          <!-- AB实验人群 -->
          <span v-else-if="scope.row.abMainCrowd===1">AB实验人群</span>
          <!-- 再分割人群 -->
          <span v-else-if="scope.row.abMainCrowd===3">再分割人群</span>
          <!-- 复合人群 -->
          <span v-else-if="scope.row.isCrowdTagCrowd === 1">复合人群</span>
          <!-- 普通人群 -->
          <span v-else-if="scope.row.abMainCrowd === 0">普通人群</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="110" sortable="custom" >
          <template slot="header">
            优先级
            <el-popover
              placement="top"
              trigger="hover"
              class="popover-button"
            >
              <div>数字越大，优先级越高</div>
            <span class="priority-tip" slot="reference">!</span>
            </el-popover>
          </template>
          <template slot-scope="scope">
              <priorityEdit
                @refresh="loadData"
                :showEdit="(showByPassColumn && scope.row.id) || !showByPassColumn"
                :byPassId="scope.row.id"
                :data="scope.row.priority"
                :policyId="scope.row.policyId"
                :crowdId="scope.row.crowdId">
              </priorityEdit>
          </template>
      </el-table-column>
      <el-table-column prop="remark" v-if="(checkList.indexOf('remark') > -1)" label="备注" width="90" key="remark" >
      </el-table-column>
      <!--<el-table-column v-if="(checkList.indexOf('apiStatus') > -1)" prop="apiStatus" label="是否生效" width="90">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.apiStatus === 1">已生效</span>-->
          <!--<span v-if="scope.row.apiStatus === 0">-->
              <!--<el-tooltip placement="right-start">-->
                <!--<div v-if="scope.row.putway === 0" slot="content">人群未生效，因为该人群条件已下架</div>-->
                <!--<div v-else slot="content">{{unActiveTips(scope.row.crowdValidStatus)}}</div>-->
                <!--&lt;!&ndash;<div v-else>&ndash;&gt;-->
                   <!--&lt;!&ndash;&lt;!&ndash;<div v-if="scope.row.crowdValidStatus === 1" slot="content">{{ scope.row.crowdValidStatus }}人群未生效，因为该人群条件未生效</div>&ndash;&gt;&ndash;&gt;-->
                   <!--&lt;!&ndash;<div v-if="scope.row.crowdValidStatus === 3" slot="content">{{ scope.row.crowdValidStatus }}人群未生效，因为该人群条件已过期</div>&ndash;&gt;-->
                   <!--&lt;!&ndash;<div v-else slot="content">{{ scope.row.crowdValidStatus }}人群未生效，因为未点击该策略的"同步按钮"</div>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--<span class="uneffective">未生效<span>?</span></span>-->
              <!--</el-tooltip>-->
          <!--</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="status" label="状态" width="70" sortable="custom">
        <template slot-scope="scope">
          <span >{{ launchStatusEnum[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AB测试" width="140px">
        <template slot-scope="scope">
          <!-- 引用人群 -->
          <span v-if="isReferCrowd(scope.row.referCrowdId)" class="boldCss">不支持</span>

          <span v-else>
            {{ abStatusEnum[scope.row.abstatus] }}
            <el-button v-if="scope.row.abstatus !== 0" :disabled="scope.row.putway === 0" @click="showDivideResult(scope.row.crowdId)" type="text">查看AB人群</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="动态实验" width="140px">
        <template slot-scope="scope">
          <!-- 引用人群 -->
          <span v-if="isReferCrowd(scope.row.referCrowdId)" class="boldCss">不支持</span>

          <span v-else>
            <!-- <el-button v-if="scope.row.dynamicFlag===1" @click="showDynamicList(scope.row.crowdId)" type="text">查看动态分组</el-button>
            <span v-else>
              否
            </span> -->
            {{ abStatusEnum[scope.row.dynamicStatus] }}
            <el-button v-if="scope.row.dynamicStatus !== 0" :disabled="scope.row.putway === 0" @click="showDynamicList(scope.row.crowdId)" type="text">查看动态分组</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="forcastStatus" label="估算状态" width="90">
          <template slot-scope="scope">
            <!-- 引用人群 -->
          <span v-if="isReferCrowd(scope.row.referCrowdId)" class="boldCss">不支持</span>

          <span v-else>
            <span v-if="scope.row.forcastStatus == 1">未估算</span>
            <span v-if="scope.row.forcastStatus == 2">估算中</span>
            <el-button type="text" v-if="scope.row.forcastStatus == 3" @click="showCountResult(scope.row.crowdId)">查看估算数量</el-button>
            <span v-if="scope.row.forcastStatus == 4">估算失败</span>
            <span v-if="scope.row.forcastStatus == 6">暂不支持该类标签</span>
          </span>
          </template>
      </el-table-column>
      <el-table-column prop="limitLaunch" label="是否限制投放数量" width="120">
        <template slot-scope="scope">
           <!-- 引用人群 -->
          <span v-if="isReferCrowd(scope.row.referCrowdId)" class="boldCss">不支持</span>
          <el-button type="text" v-else-if="scope.row.limitLaunch" @click="handleShowLimitLaunch(scope.row.limitLaunchCount)">是</el-button>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('createTime') > -1)" prop="createTime" label="创建时间" width="180">
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="(checkList.indexOf('creatorName') > -1)" prop="creatorName" label="创建人" width="80"></el-table-column>
      <el-table-column v-if="(checkList.indexOf('department') > -1)" prop="department" label="业务部门" width="80"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div class="el-button-group">
            <el-button
              v-if="!isReferCrowd(scope.row.referCrowdId)"
              size="small"
              type="text"
              @click="handleClickEstimate(scope.row)"
              :disabled="scope.row.putway === 0 || scope.row.forcastStatus == 6"
            >估算数量</el-button>
            <el-dropdown @command="handleCommandStastic">
              <el-button size="small" type="text">
                分析
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.forcastStatus == 3"
                  :command="['estimatedDetail',scope.row]"
                >估算画像</el-dropdown-item>
                <!-- AB 、 画像平台分析 、 动态人群 是互斥的 -->
                <el-dropdown-item v-if="isShow('Yunying', scope.row)"
                  :command="['operationalAnalysis',scope.row]"
                >画像平台分析</el-dropdown-item>
                <el-dropdown-item
                  :command="['detail',scope.row]"
                >命中曝光分析</el-dropdown-item>
                <!-- <el-dropdown-item
                  :command="['homepageData',scope.row]"
                >看主页数据</el-dropdown-item> -->
                <el-dropdown-item
                  :command="['appointment',scope.row]"
                >预约投后分析</el-dropdown-item>

                <!-- 动态人群才展示 -->
                <el-dropdown-item
                  v-if="scope.row.dynamicFlag === 1"
                  :command="['dynamicReport',scope.row]"
                >动态实验报告</el-dropdown-item>

                <!-- 动态人群才展示 --><!-- 流转异常监控 -->
                <el-dropdown-item
                  v-if="scope.row.dynamicFlag === 1"
                  :command="['nomalyMonitoring',scope.row]"
                >流转异常监控</el-dropdown-item>
                <el-dropdown-item
                  :command="['shenCeAnalysis',scope.row]"
                >神策分析
                </el-dropdown-item>
                <!--<el-dropdown-item-->
                <!--:command="['redirectCrowd',scope.row]"-->
                <!--&gt;重定向数据</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>

            <!-- AB 、 画像平台分析 、 动态人群 是互斥的 -->
            <el-button
              v-if="isShow('AB', scope.row) && !isReferCrowd(scope.row.referCrowdId)"
              size="small"
              type="text"
              @click="divideAB(scope.row,'addABTest')">
              AB实验
            </el-button>

            <!-- AB 、 画像平台分析 、 动态人群 是互斥的 -->
            <el-button
              v-if="isShow('Dynamic', scope.row) && !isReferCrowd(scope.row.referCrowdId)"
              size="small"
              type="text"
              @click="handleDynamicTest(scope.row, 'addDynamicTest')">
              动态实验
            </el-button>
            <!-- <el-button
              :disabled="isShowTest(scope.row)"
              size="small"
              type="text"
              @click="handleOpenTestDialog(scope.row)"
            >投前测试
            </el-button> -->

            <!-- 投放后的人群才可选择“命中监控”，否则为灰色 -->
            <el-button
              :disabled="!scope.row.launchTime"
              size="small"
              type="text"
              @click="hitMonitoring(scope.row)">
              命中监控
            </el-button>

            <el-dropdown @command="handleCommandOpreate">
              <el-button size="small" type="text">
                更多
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="!isReferCrowd(scope.row.referCrowdId)"
                  :command="['edit',scope.row]"
                  v-permission="'hoder:crowd:edit'"
                  :disabled="scope.row.putway === 0"
                >编辑
                </el-dropdown-item>
                <el-dropdown-item
                        :command="['del',scope.row]"
                        v-permission="'hoder:crowd:del'"
                >删除
                </el-dropdown-item>
                <el-dropdown-item
                        :command="['upDown',scope.row]"
                >人群<span v-if="scope.row.putway === 1">下架</span><span v-else>上架</span>
                </el-dropdown-item>
                  <!-- :disabled="scope.row.putway === 0" -->
                <el-dropdown-item
                  v-if="!isReferCrowd(scope.row.referCrowdId)"
                  :command="['copy',scope.row]"
                >人群复制
                </el-dropdown-item>
                <!--<el-dropdown-item-->
                <!--:command="['divide',scope.row]"-->
                <!--v-if="scope.row.abMainCrowd === 0"-->
                <!--&gt;A/B test划分-->
                <!--</el-dropdown-item>-->
                <el-dropdown-item
                  v-if="!isReferCrowd(scope.row.referCrowdId)"
                  :command="['commitHistory',scope.row]"
                >提交历史数据
                </el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-button-->
                    <!--size="small"-->
                    <!--type="primary"-->
                    <!--@click="handleClickRedirectWithId(scope.row)"-->
                    <!--v-if="crowdValidEnum[scope.row.crowdValidStatus] == '已过期'"-->
            <!--&gt;新增重定向投放</el-button>-->
          </div>
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
  <el-dialog :visible.sync="showEstimate" title="请选择要估算的类型标识">
    <!-- <div class="estimate-tips">说明：
      <div>1、会自动过滤自定义条件，只估算包含大数据标签的人群数量</div>
      <div>1、仅支持大数据标签、行为标签或二者混用的估算</div>
      <div>2、依据人群优先级去重估算，重合部分算入优先级高的人群</div>
      <div>3、该策略下上架中的人群将参与去重估算</div>
    </div> -->
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
       <div class="estimate-tips">只估算包含大数据标签的人群数量为：（已按人群优先级除去交叉人群，交叉部分算入优先级高的人群）</div>
       <div>设备：{{ totalUser }}<span v-if="totalUser == '暂无数据'" class="blue-tip">（你的人群条件查无数据，请重新设置人群条件）</span></div>
       <div>手机号：{{ total1 === undefined ? '暂无数据': total1 }}</div>
       <div>酷开openId：{{ total2 }}</div>
       <div>微信openId：{{ total3 }}</div>
   </el-dialog>
    <!-- 命中曝光分析 -->
    <el-dialog
      :visible.sync="showStatistics"
      width="90%"
      title="命中曝光分析"
    >
      <AfterPushDetail
        v-if="showStatistics"
        :currentCid="currentCid"
        :showStatistics="showStatistics"
      ></AfterPushDetail>
      <!-- <div class="export-button">
          <a :href="launchedExportUrl" download ref="launchedDownLoad"></a>
          <el-button type="success" @click="handleLaunchedExport">导出数据</el-button>
      </div>
      <div class="crowd-statistic">
        <div class="echarts-container">
          <div class="click-date-picker">
            <el-date-picker
                    :value="time0"
                    @input="handleInputTime(0, $event, 'drawCrowdLine')"
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
                    :value="time1"
                    @input="handleInputTime(1, $event, 'drawCrowdPie')"
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
                    :value="time2"
                    @input="handleInputTime(2, $event, 'drawExposeLine')"
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
                    :value="time3"
                    @input="handleInputTime(3, $event, 'drawExposePie')"
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
                    :value="time4"
                    @input="handleInputTime(4, $event, 'drawClickLine')"
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
                    :value="time5"
                    @input="handleInputTime(5, $event, 'drawClickPie')"
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
                    :value="time6"
                    @input="handleInputTime(6, $event, 'crowdLaunchDetail')"
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
                    :value="time7"
                    @input="handleInputTime(7, $event, 'setProvinceData')"
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
      </div> -->
    </el-dialog>
    <!--上下架确认弹窗-->
    <el-dialog title="提示" :visible.sync="showUpDownDialog">
      <div>{{ upDownTips }}</div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="showUpDownDialog = false">取 消</el-button>
      <el-button type="primary" @click="handleUpDown">确定</el-button>
    </span>
    </el-dialog>
    <!--复制选择策略-->
    <el-dialog title="将人群复制到以下策略" :visible.sync="showCopyDialog" @close="handleCancelCopy('policyCopyForm')">
      <el-form :model="policyCopyForm" :rules="copyRules" ref="policyCopyForm" class="copy-form">
        <el-form-item label="选择策略" prop="policyIds">
          <el-select
                  v-model="policyCopyForm.policyIds"
                  multiple
                  filterable
                  @change="policyCopySelChange"
          >
            <el-option
              v-for="(item,index) in allPolices"
              :key="index"
              :label="item.policyId+'-'+item.policyName"
              :value="item.policyId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!!copyErrorMsg" type="primary" @click="handleCopy('policyCopyForm')">确定</el-button>
          <el-button @click="handleCancelCopy('policyCopyForm')">取 消</el-button>
          <span style="margin-left: 20px; color: red">{{ copyErrorMsg }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 统计 估算画像 -->
    <el-dialog
            :visible.sync="showEstimateEcharts"
            width="90%"
            title="该人群估算出的用户画像"
    >
      <div class="export-button">
          <a :href="downloadUrl" download ref="download_Url"></a>
          <el-button type="success" @click="handleDownload">导出数据</el-button>
      </div>
      <div>
        <!--<div class="estimate-item">-->
          <!--<div class="estimate-title">基本信息</div>-->
          <!--<div class="estimate-statistic">-->
            <!--&lt;!&ndash;<div ref="circleSex" class="base-info-circle-echarts"></div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div ref="circleAge" class="base-info-circle-echarts"></div>&ndash;&gt;-->
            <!--<div ref="circleDevice" class="base-info-circle-echarts"></div>-->
          <!--</div>-->
        <!--</div>-->
        <div class="estimate-item">
          <div class="estimate-title">基本信息</div>
            <div class="estimate-statistic">
                <div class="province-city-active-content city-info-echarts">
                    <div ref="provinceMap" class="province-map"></div>
                    <div class="city-active-proportion" v-if="cityData">
                        <div class="city-active-proportion--title">城市活跃比</div>
                        <template v-if="cityData.length > 0">
                            <div  v-for="(item,index) in cityData" :key="index" class="city-active-proportion--name">
                                {{item.name}}:{{item.value}}
                            </div>
                        </template>
                        <div v-else>暂无数据</div>
                    </div>
                </div>
                <div class="city-info-echarts">
                    <div class="table-title">Top50城市活跃排名(近30天活跃)</div>
                    <Table
                            :props="table.props"
                            :header="table.header"
                            :data="table.data"
                            class="table-overflow"
                    >
                    </Table>
                </div>
                <div ref="circleDevice" class="base-info-circle-echarts" style="border: none;height: 300px"></div>
            </div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">用户类别</div>
          <div class="member-select">
              <div class="member-select--text">按会员权益</div>
              <el-select v-model="memberListType">
                  <template v-for="(item,index) in memberList">
                      <el-option
                              :key="index"
                              :label="item.label"
                              :value="item.value"
                      ></el-option>
                  </template>
              </el-select>
          </div>
          <div ref="member" class="member-total"></div>
          <div class="estimate-statistic">
              <div ref="memberActiveTime" class="member-total-item"></div>
              <div ref="memberMainPageActiveTime" class="member-total-item"></div>
              <div ref="memberExpirationTime" class="member-total-item"></div>
          </div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">付费分布</div>
          <div class="member-select">
              <div class="member-select--text">按会员权益</div>
              <el-select v-model="memberListByPay">
                  <template v-for="(item,index) in memberList">
                      <el-option
                              :key="index"
                              :label="item.label"
                              :value="item.value"
                      ></el-option>
                  </template>
              </el-select>
          </div>
          <div ref="payDetail" class="member-total"></div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">观影行为</div>
            <div>
                <div class="watch-tv-behavior">
                    <div class="member-select">
                        <div class="member-select--text">近7日/30日起播活跃率（有起播行为等活跃天数7日/或30日）</div>
                        <el-select v-model="expirationDay">
                            <template v-for="(item,index) in objectToArray(expirationDayList)">
                                <el-option
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </template>
                        </el-select>
                    </div>
                    <div class="userBehavior" ref="userBehavior"></div>
                </div>
                <div class="watch-tv-behavior userBehavior" ref="watchPrefer"></div>
            </div>
        </div>
        <div class="estimate-item">
          <div class="estimate-title">活跃行为</div>
          <div ref="activeBehavior" class="activeBehaviorEcharts"></div>
        </div>
      </div>
    </el-dialog>
    <!--已划分弹窗显示-->
    <el-dialog :visible.sync="showDivideDetail" title="划分详情">

      <div v-if="DivideTableData && DivideTableData.length > 0" style="margin: -15px 0 20px 0">
        <span class="detailTitle">AB子人群</span> 实验有效期：{{ DivideTableData[0].abStartTime  }} - {{ DivideTableData[0].abEndTime }}
        <el-table :data="DivideTableData" style="width: 100%;" stripe border>
            <el-table-column prop="crowdId" label="人群ID"></el-table-column>
            <el-table-column prop="crowdName" label="人群名称"></el-table-column>
            <el-table-column prop="ratio" label="占比">
                <template slot-scope="scope">
                    {{ scope.row.ratio }}%
                </template>
            </el-table-column>
            <el-table-column prop="count" label="数量">
              <template slot-scope="scope">
                {{cc_format_number(scope.row.count)}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <!-- AB子人群的 -->
                    <el-button type="text" @click="currentCid = scope.row.crowdId; showCrowdDetailDialog()">命中曝光分析</el-button>
                    <!-- <el-button type="text" @click="handleSeeHomepageData(scope.row.crowdId, scope.row.crowdName)">看主页数据</el-button> -->
                    <el-button type="text" @click="showAppointmentDialog(scope.row.crowdId)">预约投后分析</el-button>
                    <el-button type="text" @click="handleShenCeAnalysis(scope.row, 'AB')">神策分析</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>

      <div v-if="subdividePeopleList && subdividePeopleList.length > 0" style="margin: -15px 0 20px 0">
        <span class="detailTitle">再分割人群</span>
        <el-table :data="subdividePeopleList" style="width: 100%;" stripe border>
            <el-table-column prop="crowdId" label="人群ID"></el-table-column>
            <!-- <el-table-column prop="dmpCrowdId" label="投放子ID"></el-table-column> -->
            <el-table-column prop="crowdName" label="人群名称"></el-table-column>
            <el-table-column prop="ratio" label="优先级">
              <template slot="header">
                优先级
                <el-popover
                  placement="top"
                  trigger="hover"
                  class="popover-button"
                >
                  <div>数字越大，优先级越高</div>
                <span class="priority-tip" slot="reference">!</span>
                </el-popover>
              </template>
              <template slot-scope="scope">
                  <!-- {{ scope.row.priority }} -->
                  <priorityEdit
                    @refresh="loadData"
                    :showEdit="(showByPassColumn && scope.row.id) || !showByPassColumn"
                    :byPassId="scope.row.id"
                    :data="scope.row.priority"
                    :policyId="scope.row.policyId"
                    :crowdId="scope.row.crowdId"
                    :isDynamicPeople="true">
                  </priorityEdit>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量">
              <template slot-scope="scope">
                {{cc_format_number(scope.row.history.totalUser)}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <!-- 再分割人群de  -->
                <el-button type="text" @click="currentCid = scope.row.crowdId; showCrowdDetailDialog()">命中曝光分析</el-button>
                <el-button type="text" @click="showAppointmentDialog(scope.row.crowdId)">预约投后分析</el-button>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
              <template slot-scope="scope">
                  <div v-if="scope.row.history.status">
                      <template v-if="(independentLaunchStatusEnum[scope.row.history.status]).code === 3">
                          计算完成
                      </template>
                      <!-- 新增计算中时是否是人群派对中 -->
                      <template v-else-if="((independentLaunchStatusEnum[scope.row.history.status]).code === 2 && (independentLaunchStatusEnum[scope.row.history.status]).childrenCode === 23)">
                          {{ (independentLaunchStatusEnum[scope.row.history.status]).childrenName }}
                      </template>
                      <template v-else-if="(independentLaunchStatusEnum[scope.row.history.status]).code === 1 || (independentLaunchStatusEnum[scope.row.history.status]).code === 4 || (independentLaunchStatusEnum[scope.row.history.status]).code === 7"
                      >
                          <span v-if="crowdType === 4">计算</span>
                          <el-button type="text" v-else @click="calculate(scope.row)">计算</el-button>
                      </template>
                      <div v-else-if="(independentLaunchStatusEnum[scope.row.history.status]).code === 5" style="color: red">
                          计算失败
                          <!-- <el-button type="text" @click="calculate(scope.row)">重试</el-button> -->
                      </div>
                      <template v-else>
                          {{ (independentLaunchStatusEnum[scope.row.history.status]).name }}
                      </template>

                      <TipPopover :launchStatusEnum="launchStatusEnum" :status="scope.row.history.status"></TipPopover>

                  </div>
              </template>
          </el-table-column>
          <el-table-column label="数据监控" width="80" v-permission="'hoder:launch:crowd:ver:index'">
              <template slot-scope="scope">
                <el-button type="text" @click="currentCid = scope.row.crowdId; handleMonitor(scope.row)">查看</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div style="margin: 30px 0 0; overflow: auto">
            <pagination
              :currentpage="independentParams.pageNum"
              :pagesize="independentParams.pageSize"
              :totalcount="independentTotal"
              @handle-size-change="handleIndependentSizeChange"
              @handle-current-change="handleIndependentCurrentChange"
            ></pagination>
        </div>

      </div>

    </el-dialog>

    <!--动态人群实验组列表-->
    <el-dialog :visible.sync="showDynamicListDetail" title="划分详情" width="1100px">
      <span class="detailTitle">动态流转</span>
      <c-table
        :props="dynamic2GroupListTable.props"
        :header="dynamic2GroupListTable.header"
        :data="dynamic2GroupListTable.data"
      >
      </c-table>
    </el-dialog>

    <commit-history-dialog
            :setShowCommitHistoryDialog="setShowCommitHistoryDialog"
            :crowdId="currentCrowdId"
            @closeDialog="setShowCommitHistoryDialog = false"
            @submit="handleSubmitHistory"
    ></commit-history-dialog>
    <el-dialog :visible.sync="showLimitLaunchDialog">
      <div>限制投放数量为：{{this.showLimitLaunchCount}}</div>
    </el-dialog>
    <el-dialog
            :visible.sync="showBypassDialog"
            title="请求分流"
            @close="handleCancelBypass"
    >
      <div>
        <el-steps :active="showBypassStep">
          <el-step title="设置份数">
          </el-step>
          <el-step title="设置分组及比例">
          </el-step>
        </el-steps>
      </div>
      <div v-show="showBypassStep === 1">
        请求流量划分份数：
        <el-select
                v-model="byPassForm.apart"
                @change="handleBypassApartChange"
        >
          <el-option
                  v-for="(item,index) in ratioEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.value"

          >
          </el-option>
        </el-select>
        份
        <div class="button-margin">
          <el-button @click="handleCancelBypass">取消</el-button>
          <el-button type="primary" @click="handleNextBypass">下一步</el-button>
        </div>
      </div>
      <div v-if="showBypassStep === 2">
        <div
                v-for="(tableItem,index) in byPassForm.bypass"
                :key="index"
                class="bypass-item"
        >
          <div>
            <!--<div><el-input v-model="tableItem.name"></el-input></div>-->
            <div>
              <numOrTextEdit :key="tableItem.name+'_'+index" :obj="tableItem" :objKey="'name'" :data="tableItem.name" :validType="'text'"></numOrTextEdit>
            </div>
            <div>
              <div class="table-header">
                <div>人群ID</div>
                <div>人群名称</div>
                <div>优先级</div>
                <div>分流占比(%)</div>
              </div>
              <div class="table-body">
                <div class="table-left-part">
                  <div
                          v-for="(tableDetailItem,index) in tableItem.crowds"
                          :key="'tableDetailItem'+index"
                          class="table-detail-item"
                  >
                    <div>{{ tableDetailItem.crowdId }}</div>
                    <div class="crowd-name-item">{{tableDetailItem.crowdName}}</div>
                    <numOrTextEdit class="edit-priority" :key="tableDetailItem.priority+'_'+index" :obj="tableDetailItem" :objKey="'priority'" :validType="'number'"></numOrTextEdit>
                    <!--<priorityEdit :data="tableDetailItem.priority" :policyId="selectRow.policyId" :crowdId="tableDetailItem.crowdId"></priorityEdit>-->
                    <i class="el-icon-minus" @click="handleRemoveCrowds(tableItem,tableDetailItem.crowdId)"></i>
                  </div>
                </div>
                <div class="table-ratio" v-if="tableItem.crowds.length > 0">
                  <div>
                    <numOrTextEdit :key="tableItem.ratio+'_'+index" :obj="tableItem" :objKey="'ratio'" :data="tableItem.ratio" :validType="'number'" :range="[0,100]"></numOrTextEdit>
                  </div>
                </div>
              </div>
            </div>
            <div class="select-bottom-rows">
              <div class="select-rows">
                  <el-select
                          v-model="tableItem.crowdSelect"
                          size="small"
                          @change="handleCrowdSelectChange(tableItem)"
                          placeholder="请选择人群"
                  >
                      <el-option
                              v-for="(selectItem,index) in selectList"
                              :label="selectItem.crowdName+'('+selectItem.crowdId+')'"
                              :value="selectItem.crowdId"
                              :key="index"
                      ></el-option>
                  </el-select>
              </div>
              <div class="table-ratio"></div>
            </div>
          </div>
        </div>
        <div class="button-margin">
          <el-button @click="handleCancelBypass">取消</el-button>
          <el-button @click="showBypassStep = 1">上一步</el-button>
          <el-button type="primary" @click="handleSaveBypass">完成</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 查看配置弹窗-->
    <el-dialog title="查看配置" :visible.sync="showConfiguration">
        <el-input type="textarea" v-model="configTextarea" :rows="8" :readonly="true"></el-input>
    </el-dialog>
    <!-- 投前测试弹出框-->
    <el-dialog
      title="投前测试"
      :visible.sync="testDialogVisible"
      width="500px">
      <span>
        <c-form label-width="120px" :model="formTest" ref="formTest" :inline="true">
          <c-form-mac label="设备信息:" v-model="formTest.mac" @change="handleMacChange" prop="mac" :rules="rules.mac"/>
            <el-form-item>
            <el-button type="primary" @click="handleTest">测试</el-button>
          </el-form-item>
          <div>
            <el-form-item label="测试结果:" v-if="testResult !== ''">
              <div class="test-result">
                <span v-if="testResult === '不属于该人群'" class="icon iconfont el-icon-cc-frown-fill"></span>
                <span v-else class="icon iconfont el-icon-cc-smile-fill"></span>
                {{testResult}}
              </div>
            </el-form-item>
          </div>
        </c-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="testDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 预约投后分析-->
    <el-dialog title="预约投后分析" :visible.sync="showAppointment" width="500px">
      <el-form ref="appointmentForm" :model="appointmentForm" label-width="80px" size="mini">
        <el-form-item label="起止时间" prop="value" required>
          <el-date-picker
            v-model="appointmentForm.value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptionsDayinRange(30)"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="HandleAppointment">确定</el-button>
        <el-button @click="showAppointment = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="showEditDynamicCrowdName"
      width="500px"
      title="修改人群名称"
    >
      <div class="dynamic-crowd-name">
        人群名称：<el-input v-model="dynamicCrowd.crowdName" clearable style="width: 80%;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditDynamicCrowdName">确定</el-button>
        <el-button @click="showEditDynamicCrowdName = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="数据监控" :visible.sync="monitorDialog">
      <el-date-picker
        v-model="monitorRangeTime"
        type="daterange"
        align="right"
        @change="getDataMonitor"
        class="monitor-time"
        value-format="yyyy-MM-dd"
      ></el-date-picker>

      <c-table
        :props="monitorTable.props"
        :header="monitorTable.header"
        :data="monitorTable.data"
      >
      </c-table>
      <div style="margin: 30px 0 0; overflow: auto">
          <pagination
              :currentpage="monitorOutForm.pageNum"
              :pagesize="monitorOutForm.pageSize"
              :totalcount="monitorTotal"
              @handle-size-change="handleMonitorSizeChange"
              @handle-current-change="handleMonitorCurrentChange"
          ></pagination>
      </div>
    </el-dialog>
    <!-- 画像平台分析 - 大数据页面 -->
    <el-dialog :visible.sync="showOperationalAnalysis" width="1500px" >
    <!-- {{operationalAnalysisUrl}} -->
      <iframe :src="operationalAnalysisUrl" width="100%" height="800px" frameborder="0" id="myIframe" ref="myIframe"></iframe>
      <!-- <iframe
        src="http://172.20.155.102/violet/"
        width="100%"
        height="800px"
        frameborder="0"
      ></iframe> -->
      <!-- <div>
        <iframe src="https://www.iconfont.cn/" id="mobsf" scrolling="no" frameborder="0" style="position:absolute;top:64px;left: 240px;right:0px;bottom:100px;"></iframe>
      </div> -->

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="showOperationalAnalysis = false">取 消</el-button>
      </span> -->
    </el-dialog>

    <!-- 动态人群 - 查看效果 -->
    <el-dialog :visible.sync="showViewEffect" width="80%">
      <viewEffectDialog :crowdId="currentCid"></viewEffectDialog>
    </el-dialog>

    <!-- 神策分析-->
    <el-dialog title="选择命中数据的时间范围" :visible.sync="shenCeDialog" width="530px">
      <el-form ref="shenCeForm" :model="shenCeForm" label-width="80px" size="mini">

        <!-- <el-alert
          title="成功提示的文案"
          type="success">
        </el-alert> -->
        <!-- AB 子人群进行神策分析才显示 -->
        <!-- :title="'可选范围为实验有效期内：' + abStartTimeFormat + ' ~ ' + after30Days" -->
        <el-alert
          v-if="currentCrowd.abStartTime"
          style="margin-bottom: 10px"
          :title="'实验有效期：' + currentCrowd.abStartTime + ' 至 ' + currentCrowd.abEndTime"
          type="info">
        </el-alert>

        <el-alert
          v-if="currentCrowd.launchTime"
          style="margin-bottom: 10px"
          :title="'投放时间：' + currentCrowd.launchTime "
          type="info">
        </el-alert>

        <el-alert
          style="margin-bottom: 20px"
          title="结束时间可选择未来最多30天"
          type="info">
        </el-alert>

        <el-form-item
          label="起止时间"
          prop="dateRange"
          :rules="[
            { required: true, message: '起止时间不能为空' },
          ]"
        >
          <!-- 神策时间范围限制：  [人群的 launchTime, 未来30天内] -->
          <el-date-picker
            v-model="shenCeForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerShenCeOptionsDayinRange(30, currentCrowd.launchTime)"
            >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="autoVersion">
          <el-checkbox v-model="shenCeForm.autoVersion">每日更新后自动发送</el-checkbox>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ConfirmShenCeAnalysis">确定</el-button>
        <el-button @click="shenCeDialog = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 流转链路分析 -->
    <el-dialog title="流转链路分析" :visible.sync="showFlowLinkAnalysisDialog" :fullscreen="true">
      <LinkAnalysis v-if="showFlowLinkAnalysisDialog" :tableData="analysisTableData" :linkProps="linkProps" :linkPropsName="linkPropsName" :linkPropsNameTip="linkPropsNameTip"></LinkAnalysis>
    </el-dialog>

    <!--命中监控-->
    <el-dialog title="命中监控" :visible.sync="showHitDialog" width="955px">
      <div class="title">
        添加监控：
      </div>
      <el-form :model="hitForm" :rules="hitRules" ref="hitForm" :inline="true">
        <el-form-item label="监控时间：" prop="alertTime">
          <el-date-picker
            style="width: 135px"
            v-model="hitForm.alertTime"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>

          <!-- {{hitForm.alertTime}} - {{value}} -->

          <!-- <el-time-select
            v-model="alertTimeValue"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间"
            style="width: 115px"
          >
          </el-time-select> -->
          <a-time-picker
            style="width: 105px"
            v-model="alertTimeValue"
            format="HH:mm"
            valueFormat="HH:mm"
            placeholder="选择时间"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            :minute-step="15"
            @change="onChange">
          </a-time-picker>
        </el-form-item>

        <el-form-item label="如果命中设备量(去重)：" prop="compareType">

          <el-select v-model="hitForm.compareType" style="width: 75px">
            <el-option value="="></el-option>
            <el-option value=">="></el-option>
            <el-option value="<="></el-option>
            <el-option value=">"></el-option>
            <el-option value="<"></el-option>
          </el-select>
          <el-form-item label="" prop="hitSize">
            <el-input-number
              v-model="hitForm.hitSize"
              placeholder="请输入"
              clearable
              min="0"
              max="1000000"
              style="width: 142px; margin: 0 10px">
            </el-input-number>
            则告警到飞书
          </el-form-item>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlOpenHit">添加</el-button>
        </el-form-item>
      </el-form>

      <div class="title" style="margin-top: 45px;">
        已添加监控：
      </div>

      <c-table
        :props="queryCrowdHitAlertListTable.props"
        :header="queryCrowdHitAlertListTable.header"
        :data="queryCrowdHitAlertListTable.data"
        :default-sort = "{prop: 'date', order: 'descending'}"
      ></c-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showHitDialog=false">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import crowdListMinix from './crowdListMinix'
export default {
  mixins: [crowdListMinix] // todo.vue 中声明minix 进行混合
}
</script>
<style lang="stylus" scoped>
@import './crowdList.styl'
</style>
