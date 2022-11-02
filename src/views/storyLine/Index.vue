<template>
  <div :class="styleType ? 'dark' : 'light'">
    <div class='row-wrap' >
      <el-button type="text" @click="changeStyle" class="change-style-btn">{{ styleType ? '深色版' : '浅色版' }}</el-button>
      <div class="box">
        <div class="content">

            <div class="title">场景</div>

            <div class="search">
              <el-input placeholder="场景名/创建人" v-model="searchScene" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getSceneList"></el-button>
              </el-input>
            </div>

            <div class="sceneList-wrap">
              <!-- {{sceneList}} -->
              <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
                <div v-if="sceneList.length === 0" class="no-data-wrap">
                  暂时木有内容呀～～
                </div>
                <div class="lists-item" v-for="(item,index) in sceneList" :key="item.id" @click="selectScene(index)" :class="{active: activeIndex === index}">
                  <i class="icon el-icon-video-camera-solid"></i>
                  <span class="item-content">
                    {{ item.sceneName }}
                  </span>
                  <span class="item-index">{{ item.id }}</span>
                  <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" @command="handleSceneCommand">
                    <span class="el-dropdown-link">
                      . . .
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" :key="item.id" :command="['rename', item]">
                        <!-- <el-popover
                          placement="top"
                          width="160"
                          v-model="renameVisible"
                          trigger="manual"
                        > -->
                          <!-- <div slot="reference">重命名</div> -->
                          <!-- <template #reference>
                            <span @click="renameVisible = true">重命名</span>
                          </template>
                          <p>这是一段内容这是一段内容确定删除吗？</p> -->
                          <!-- <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="renameVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="renameVisible = false">确定</el-button>
                          </div> -->

                        <!-- </el-popover> -->
                        <el-popover placement="top" trigger="click" ref="pop" >
                          <div slot="reference">重命名</div>
                          <div style="display: flex">
                            <el-input
                              class="re-name-input"
                              type="text"
                              placeholder="请输入内容"
                              v-model="rename"
                              maxlength="20"
                              show-word-limit
                              clearable
                              style="width: 250px"
                            >
                            </el-input>

                            <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                            <el-button type="primary" size="mini" @click="handelRename(item)">确定</el-button>
                          </div>
                        </el-popover>

                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" :command="['putIn', item]">
                        投放
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" :command="['offSet', item]">
                        {{ item.putway === 1 ? '下架' : '上架' }}
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" :command="['deleteScene', item]">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-scrollbar>
            </div>
            <div class="box-fotter">
              <!-- <el-button>添加</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="addScene">添加</el-button>
            </div>
        </div>
      </div>

      <div class="box">
        <div class="content">
          <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
            <div class="title">
              接待员
              <el-button v-if="servicer.length > 0" type="text" style="position: absolute;right: 14px;top: 6px;" icon="el-icon-plus" size="mini" @click="addGroup">分组</el-button>
            </div>

            <div class="search">
              <el-input placeholder="接待员/创建人" v-model="searchServicer" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
              </el-input>
            </div>
            <div class="sceneList-wrap" >
              <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
                <div v-if="servicer.length === 0" class="no-data-wrap">
                  暂时木有内容呀～～
                </div>
                <div class="lists-item" v-for="(item, index) in servicer" :key="item.id" @click="selectServicer(index)" :class="{active: activeIndex2 === index}">
                  <i class="icon el-icon-user"></i>
                  <span class="item-content">
                    {{ item.receptionist }}
                  </span>
                  <span class="item-index">{{ item.id }}</span>
                  <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" @command="handleServiceCommand">
                    <span class="el-dropdown-link">
                      . . .
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" :command="['rename', item]">

                        <el-popover placement="top" trigger="click" ref="pop">
                          <div slot="reference">重命名</div>
                          <div style="display: flex">
                            <el-input

                              type="text"
                              placeholder="请输入内容"
                              v-model="rename2"
                              maxlength="20"
                              show-word-limit
                              clearable
                              style="width: 250px"
                            >
                            </el-input>

                            <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                            <el-button type="primary" size="mini" @click="handelRename2(item)">确定</el-button>
                          </div>
                        </el-popover>

                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" :command="['offSet', item]">
                        {{ item.putway === 1 ? '下架' : '上架' }}
                      </el-dropdown-item>
                      <el-dropdown-item class="clearfix" :command="['deleteService', item]">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                </div>
              </el-scrollbar>
            </div>
            <div class="box-fotter">
              <!-- <el-button>添加</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="addServicer">添加</el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <div class="box">
        <div class="content detail">
          <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
            <div class="title">接待员详情</div>

            <div style="padding: 0 10px 10px 10px" >

              <div class="detail-header">

                <div class="detail-header-column">
                  <span class="detail-name">
                    <span>{{ selectedServicer.receptionist }}</span>
                    <div class="detail-name-border"></div>
                  </span>
                  <div class="d-info" >
                    <template>
                      <div>创建人：</div>
                      <div>{{ selectedServicer.userName || '-'}}</div>
                      <div>创建时间：</div>
                      <div>{{ selectedServicer.createTime || '-'}}</div>
                      <div>擅长：</div>
                      <div v-if="selectedServicer.userName">
                        <el-select
                          ref="selectObj"
                          v-model="skillValue"
                          filterable
                          allow-create
                          default-first-option
                          placeholder="输入或选择技能"
                          clearable
                          @blur="addOption"
                          @change="selectSkill">
                          <el-option
                            v-for="item in skillOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                      <div v-else>-</div>
                    </template>
                  </div>
                  <div style="text-align: center;">业务范围</div>
                  <div class="detail-business-type">
                      方案：
                      {{selectedServicer.planId || '-' }} {{ selectedServicer.planName || '-' }}
                    <!-- <div class="box-fotter">
                      <el-button type="text" icon="el-icon-plus">添加/修改业务范围</el-button>
                    </div> -->
                  </div>
                </div>
                <div class="aaa"></div>
                <div class="detail-header-column">
                  <div class="target">我的任务</div>
                  <!-- <div>请输入接待员的目标<i class="el-icon-edit"></i></div> -->

                  <div class="flex-content">
                    <div class="target-img"></div>
                    <div v-if="!isEdit" @click="editTarget" class="target-text">
                      <span>{{ target }}</span>
                      <span class="text-over"></span>
                    </div>
                    <!-- <el-input v-else type="text" ref="inputPriority" size="small" @blur="editStatuChange" v-model="target"></el-input> -->
                    <el-input
                      v-else
                      ref="inputPriority"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      type="textarea"
                      placeholder="请输入内容"
                      @blur="editStatuChange"
                      v-model="target">
                    </el-input>
                  </div>

                  <div class="kpi-wrap">
                    <div>绩效目标</div>
                    <div class="detail-kpi">
                      <!-- <el-descriptions title="" column="2">
                        <el-descriptions-item label="当前服务满意率">99889</el-descriptions-item>
                        <el-descriptions-item label="接待用户数">5588</el-descriptions-item>
                        <el-descriptions-item label="目标">苏州市</el-descriptions-item>
                        <el-descriptions-item label="满意用户数">123 </el-descriptions-item>
                      </el-descriptions> -->
                      <div class="detail-kpi-table">
                        <div>
                          <span class="kpi-label">

                            <el-dropdown @command="handleCommandTargetKey">
                              <span class="el-dropdown-link">
                                {{ targetKey }}<i class="el-icon-arrow-down el-icon--right"></i>：
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item, index) in targetKeyList" :key="index.id" :command="item.id">{{ item.lable }}</el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </span>
                          <span class="kpi-value">100%</span>
                        </div>
                        <div>
                          <span class="kpi-label">接待用户数：</span>
                          <span class="kpi-value">10000</span>
                        </div>
                        <div>
                          <span class="kpi-label">目标：</span>
                          <span class="kpi-value">
                            <!-- {{ targetValue }} -->

                              <span v-if="!isEditValue" @click="editTargetValue" class="target-text">
                                <span>{{ targetValue }}</span>
                                <span class="text-over"></span>
                              </span>
                              <el-input
                                v-else
                                ref="inputValue"
                                placeholder="请输入"
                                @blur="editTargetValueChange"
                                v-model="targetValue"
                                style="width: 100px">
                              </el-input>

                          </span>
                        </div>
                        <div>
                          <span class="kpi-label">满意用户数：</span>
                          <span class="kpi-value">10000</span>
                        </div>
                      </div>

                      <div class="chart-empty"></div>
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <div class="title2">服务对象选择</div>
                <div class="set-start">
                  <div v-if="entryList.length === 0" class="no-data-wrap">
                    <div class="noData"></div>
                    <!-- 暂时木有内容呀～～ -->
                  </div>
                  <div v-for="entry in entryList" :key="entry.id" class="info-class">
                    <div class="border-line"  style="position: relative;">
                      <div class="outer-and">
                        <span class="and-or" :class="entry.link === 'OR' ? 'OR': ''">
                        {{ entry.link === 'OR' ? '或' : '且' }}
                        </span>
                      </div>
                      <!-- {{entry.rulesJson}} -->
                      <!-- ( 有效混合源爱奇艺影视会员 = true 且 芯片型号 = 6A848,RTD2982DQ 且 存储 = 4G,8G ) -->
                      <span class="border-title">普通标签</span>
                      <div class="rule-string" >
                        <div v-if="entry.rulesJson && JSON.parse(entry.rulesJson).rules.length > 0">
                          <div
                            v-for="(item, index) in JSON.parse(entry.rulesJson).rules"
                            :key="index"
                            class="rule-detail"
                          >
                            <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(entry.rulesJson).condition] }}</div>
                            <div class="label-ground">(
                              <div
                                v-for="(childItem,childItemIndex) in item.rules"
                                :key="childItem.tagId+childItemIndex"
                                class="label-item"
                              >
                              <!-- {{childItem}} -->
                                <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                                <span class="txt">{{ childItem.categoryName }}</span>
                                <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
                                <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                                <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                                <span class="in">
                                  <span >{{ childItem.value }}</span>
                                </span>
                                <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                              </div>)
                            </div>
                          </div>
                        </div>
                        <div v-else>暂无</div>
                      </div>

                      <span class="border-title">行为标签</span>
                      <!-- {{entry.behaviorRulesJson}} -->
                      <div class="rule-string bav-wrap" >
                        <template v-if="entry.behaviorRulesJson && JSON.parse(entry.behaviorRulesJson).rules.length > 0">
                          <MultipleActionTagSelect
                            ref="multipleActionTagSelect"
                            :isView="true"
                            :behaviorRulesJson="JSON.parse(entry.behaviorRulesJson)"
                          ></MultipleActionTagSelect>
                        </template>
                        <div v-else>暂无</div>
                      </div>

                      <span class="border-title">流转指标</span>
                      <div class="rule-string">
                        <div v-if="entry.flowCondition && JSON.parse(entry.flowCondition).rules.length > 0">
                          <!-- {{entry.flowCondition}} -->
                          <div
                            v-for="(item, index) in JSON.parse(entry.flowCondition).rules"
                            :key="index"
                            class="rule-detail"
                          >
                            <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(entry.flowCondition).condition] }}</div>
                            <!-- {{ item }} -->
                            <div class="label-ground">
                              (
                              <div
                                v-for="(childItem, childItemIndex) in item.rules"
                                :key="childItem.tagId+childItemIndex"
                                class="label-item"
                              >
                                <!-- {{ childItem }} -->
                                <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                                <span class="txt">{{ childItem.tagName }}</span>，

                                <!-- 模块活跃 -->
                                <template v-if="childItem.tagKey=== 'moduleActive'" >
                                  <span class="txt">{{ getName(actionOptions, childItem.action) }}</span>，
                                  <span class="txt">{{ getName(locationTypeOptions, childItem.locationType) || '' }}</span>，
                                  <span class="txt">{{ childItem.locationId || '' }}</span>，
                                  <span class="txt">{{ getName(countOptions, childItem.count) || '' }}</span>
                                </template>

                                <!-- 优惠券活跃 -->
                                <template v-if="childItem.tagKey=== 'couponsActive'">
                                  <span class="txt">{{ getName(couponOptions, childItem.coupon) }}</span>，
                                </template>

                                <span v-if="childItem.tagKey !== 'moduleActive'" class="txt">{{ getsourceSignName(childItem.sourceSign) }}</span>

                                <!-- 产品包下单 -->
                                <template v-if="childItem.tagKey=== 'productOrder'">
                                  ，<span class="txt">{{ getName(productCountOptions, childItem.count) }}</span>
                                </template>

                                <span class="sel">&nbsp;&nbsp;{{ childItem.operator || '' }}&nbsp;&nbsp;</span>
                                <span class="in">
                                  <span >{{ childItem.value }}</span>
                                </span>
                              </div>
                              )
                            </div>
                          </div>
                        </div>
                        <div v-else>暂无</div>
                      </div>
                      <!-- <div>{{item.behaviorRulesJson}}</div> -->
                    </div>

                    <div class="drop-class">
                      <el-dropdown @command="handleCommand" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" >
                        <span class="el-dropdown-link" >
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="clearfix" :command="['editEntry', entry]">
                            编辑
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['deleteEntry', entry]">
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>

                  </div>

                  <div class="box-fotter">
                    <!-- <el-button>添加</el-button> -->
                    <el-button type="text" icon="el-icon-plus" @click="createClient">新建服务对象筛选</el-button>
                  </div>
                </div>
              </div>
              <div>
                <div class="title2">服务终止条件</div>
                <div class="set-end">
                  <div v-if="exportList.length === 0" class="no-data-wrap">
                    <div class="noData"></div>
                    <!-- 暂时木有内容呀～～ -->
                  </div>
                  <div v-for="exportItem in exportList" :key="exportItem.id" class="info-class">
                    <!-- <div class="border-line">
                      <div>{{ item.rulesJson }}</div>
                      <br/>
                      <div>{{ item.behaviorRulesJson }}</div>
                    </div> -->
                    <div class="border-line"  style="position: relative;">
                      <div class="outer-and">
                        <span class="and-or" :class="exportItem.link === 'OR' ? 'OR': ''">
                        {{ exportItem.link === 'OR' ? '或' : '且' }}
                        </span>
                      </div>
                      <!-- {{exportItem.rulesJson}} -->
                      <!-- ( 有效混合源爱奇艺影视会员 = true 且 芯片型号 = 6A848,RTD2982DQ 且 存储 = 4G,8G ) -->
                      <span class="border-title">普通标签</span>
                      <div class="rule-string" >
                        <div v-if="exportItem.rulesJson && JSON.parse(exportItem.rulesJson).rules.length > 0">
                          <div
                            v-for="(item, index) in JSON.parse(exportItem.rulesJson).rules"
                            :key="index"
                            class="rule-detail"
                          >
                            <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(exportItem.rulesJson).condition] }}</div>
                            <div class="label-ground">(
                              <div
                                v-for="(childItem,childItemIndex) in item.rules"
                                :key="childItem.tagId+childItemIndex"
                                class="label-item"
                              >
                              <!-- {{childItem}} -->
                                <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                                <span class="txt">{{ childItem.categoryName }}</span>
                                <span class="sel">&nbsp;&nbsp;{{ childItem.operator }}&nbsp;&nbsp;</span>
                                <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
                                <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
                                <span class="in">
                                  <span >{{ childItem.value }}</span>
                                </span>
                                <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
                              </div>)
                            </div>
                          </div>
                        </div>
                        <div v-else>暂无</div>
                      </div>

                      <span class="border-title">行为标签</span>
                      <!-- {{exportItem.behaviorRulesJson}} -->
                      <div class="rule-string bav-wrap"  style="">
                        <template v-if="exportItem.behaviorRulesJson && JSON.parse(exportItem.behaviorRulesJson).rules.length > 0">
                          <MultipleActionTagSelect
                            ref="multipleActionTagSelect"
                            :isView="true"
                            :behaviorRulesJson="JSON.parse(exportItem.behaviorRulesJson)"
                          ></MultipleActionTagSelect>
                        </template>
                        <div v-else>暂无</div>
                      </div>

                      <span class="border-title">流转指标</span>
                      <div class="rule-string">
                        <div v-if="exportItem.flowCondition && JSON.parse(exportItem.flowCondition).rules.length > 0">
                          <!-- {{exportItem.flowCondition}} -->
                          <div
                            v-for="(item, index) in JSON.parse(exportItem.flowCondition).rules"
                            :key="index"
                            class="rule-detail"
                          >
                            <div v-if="index>0" class="label-or-space">{{ conditionEnum[JSON.parse(exportItem.flowCondition).condition] }}</div>
                            <!-- {{ item }} -->
                            <div class="label-ground">
                              (
                              <div
                                v-for="(childItem, childItemIndex) in item.rules"
                                :key="childItem.tagId+childItemIndex"
                                class="label-item"
                              >
                                <!-- {{ childItem }} -->
                                <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
                                <span class="txt">{{ childItem.tagName }}</span>，

                                <!-- 模块活跃 -->
                                <template v-if="childItem.tagKey=== 'moduleActive'" >
                                  <span class="txt">{{ getName(actionOptions, childItem.action) }}</span>，
                                  <span class="txt">{{ getName(locationTypeOptions, childItem.locationType) || '' }}</span>，
                                  <span class="txt">{{ childItem.locationId || '' }}</span>，
                                  <span class="txt">{{ getName(countOptions, childItem.count) || '' }}</span>
                                </template>

                                <!-- 优惠券活跃 -->
                                <template v-if="childItem.tagKey=== 'couponsActive'">
                                  <span class="txt">{{ getName(couponOptions, childItem.coupon) }}</span>，
                                </template>

                                <span v-if="childItem.tagKey !== 'moduleActive'" class="txt">{{ getsourceSignName(childItem.sourceSign) }}</span>

                                <!-- 产品包下单 -->
                                <template v-if="childItem.tagKey=== 'productOrder'">
                                  ，<span class="txt">{{ getName(productCountOptions, childItem.count) }}</span>
                                </template>

                                <span class="sel">&nbsp;&nbsp;{{ childItem.operator || '' }}&nbsp;&nbsp;</span>
                                <span class="in">
                                  <span >{{ childItem.value }}</span>
                                </span>
                              </div>
                              )
                            </div>
                          </div>
                        </div>
                        <div v-else>暂无</div>
                      </div>
                      <!-- <div>{{item.behaviorRulesJson}}</div> -->
                    </div>

                    <div class="drop-class">
                      <el-dropdown @command="handleCommandExport" trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" >
                        <span class="el-dropdown-link" >
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="clearfix" :command="['editExport', exportItem]">
                            编辑
                          </el-dropdown-item>
                          <el-dropdown-item class="clearfix" :command="['deleteExport', exportItem]">
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>

                  </div>
                  <div class="box-fotter">
                    <!-- <el-button>添加</el-button> -->
                    <el-button type="text" icon="el-icon-plus" @click="createExport">新建服务终止条件</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>

      </div>
      <el-dialog
        title="添加场景"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-form :model="formScene">
          <el-form-item label="场景名：" label-width="70px">
            <el-input v-model="formScene.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddScene">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加接待员"
        :visible.sync="dialogVisible2"
        width="30%"
        >
        <el-form :model="formServicer">
          <el-form-item label="接待员名：" label-width="90px">
            <el-input v-model="formServicer.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddServicer">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="(editClientRow ? '编辑' : '新建')+ '服务对象选择'"
        :visible.sync="clientDialogVisible"
        width="1200px"
        v-if="clientDialogVisible"
      >
        <createClientDialog ref="createClientDialog" :editRow="editClientRow"></createClientDialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clientDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditEntryRule">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="(editExportRow ? '编辑' : '新建')+ '服务终止条件'"
        :visible.sync="exportDialogVisible"
        width="1200px"
        v-if="exportDialogVisible"
      >
        <createClientDialog ref="exportClientDialog" :editRow="editExportRow" type="export"></createClientDialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditExportRule">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="showLaunchToBusiness" v-if="showLaunchToBusiness">
        <LaunchToBusiness
          :recordId="tempPolicyAndCrowd.policyId"
          :tempPolicyAndCrowd="tempPolicyAndCrowd"
          @closeDialog="handleCloseDialog"
        ></LaunchToBusiness>
      </el-dialog>
      <el-dialog :visible.sync="showDragVisible" v-if="showDragVisible" title="添加分组" width="550px" :close-on-click-modal="false">
        <!-- {{ groupData }} -->
        <drag
          :list="noGroupService"
          :groupData.sync="groupData"
          :launchPlatformData="launchPlatformData"
        ></drag>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDragVisible = false">取 消</el-button>
          <el-button type="primary" @click="addServicerGroup">确 定</el-button>
        </span>
      </el-dialog>

   </div>
  </div>
</template>

<script>
import createClientDialog from './createClientDialog.vue'
import { handleSave as saveFunc } from './saveEntryFunc.js'
import MultipleActionTagSelect from '@/components/MultipleActionTagSelect/Index copy.vue'
import LaunchToBusiness from '../launch/StrategyPutIn'
import drag from './drag.vue'

export default {
  components: {
    createClientDialog,
    MultipleActionTagSelect,
    LaunchToBusiness,
    drag
  },
  data () {
    return {
      noGroupService: [],
      styleType: true,
      groupData: [{
        list: []
      }],
      showDragVisible: false,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      couponOptions: [{
        label: '曝光',
        value: 'couponShowPv'
      }, {
        label: '领用',
        value: 'couponCreatePv'
      }, {
        label: '使用',
        value: 'couponUsePv'
      }],
      actionOptions: [{
        label: '曝光',
        value: 'show'
      },
      {
        label: '点击',
        value: 'click'
      }],
      locationTypeOptions: [{
        label: '板块位',
        value: 1
      }, {
        label: '推荐位',
        value: 2
      }],
      countOptions: [{
        label: '次数',
        value: 'pv'
      }, {
        label: '天数',
        value: 'days'
      }],
      productCountOptions: [{
        label: '下单次数',
        value: 'orderNum'
      }, {
        label: '下单天数',
        value: 'orderDays'
      }],
      conditionEnum: {
        AND: '且',
        OR: '或'
      },
      editExportRow: {},
      exportDialogVisible: false,
      targetKeyList: [{
        // 1 付费率，2 成交单数 3 成交金额 4 客单价
        id: 1,
        lable: '付费率（%）'
      }, {
        id: 2,
        lable: '付费单数'
      }, {
        id: 3,
        lable: '付费金额（元）'
      }, {
        id: 4,
        lable: '客单价（元）'
      }],
      targetKey: '付费率（%）',
      editClientRow: {},
      skillOptions: [],
      skillValue: '',
      selectedScene: {}, // 选择的场景
      selectedServicer: {}, // 选择的服务员
      clientDialogVisible: false,
      searchScene: '',
      searchServicer: '',
      renameVisible: false,
      formScene: {
        name: ''
      },
      formServicer: {
        name: ''
      },
      dialogVisible: false,
      dialogVisible2: false,
      target: '请输入接待员的目标',
      targetValue: '',
      priority: '',
      isEdit: false,
      isEditValue: false,
      activeIndex: 0,
      activeIndex2: 0,
      sceneList: [],
      servicer: [],
      skillList: [],
      entryList: [],
      exportList: [],
      rename: '',
      rename2: '',
      soureceSignList: [],
      launchPlatformData: []
    }
  },
  watch: {
    selectedServicer: {
      handler (val) {
        console.log('val------>', val)
        this.skillValue = val.skillId // 技能
        this.target = val.myTask || '我的任务是...'// 任务
        this.targetValue = val.indicators || ''// 绩效指标

        const obj = this.targetKeyList.find(item => {
          return this.selectedServicer.indicatorsType === item.id
        })

        this.targetKey = obj ? obj.lable : '' // 目标指标
      }
    }
  },
  created () {
    this.getSceneList()
    this.$service.getSourceSign().then(res => {
      this.soureceSignList = res
    })
    this.getPolicyList()
  },
  methods: {
    getListGroupBySceneId () {
      const params = {
        sceneId: this.selectedScene.id
      }
      this.noGroupService = JSON.parse(JSON.stringify(this.servicer))
      this.$service.getListGroup(params).then(res => {
        console.log('res--------->', res)

        if (res && res.length > 0) {
          this.groupData = res.map(item => {
            const list = item.list.map(obj => {
              const receptionist = this.servicer.find(s => obj.receptionistId === s.id).receptionist

              const aIndex = this.noGroupService.findIndex(s => obj.receptionistId === s.id) // 过滤没有分组的接待员
              this.noGroupService.splice(aIndex, 1)

              return {
                ...obj,
                receptionist
              }
            })
            return {
              id: item.id,
              sceneId: item.sceneId,
              list
            }
          })
        } else {
          // 初始化
          this.groupData = [{
            list: []
          }]
        }
      })
      console.log('this.groupData--->', this.groupData)
      console.log('this.noGroupService--->', this.noGroupService)
    },

    changeStyle () {
      this.styleType = !this.styleType
    },
    getPolicyList () {
      this.$service.launchPolicyIndex().then(data => {
        this.launchPlatformData = data.biLists
      })
    },
    // 添加接待员分组
    addServicerGroup () {
      const parmas = this.groupData.map(item => {
        return {
          ...item,
          sceneId: this.selectedScene.id
        }
      })

      console.log('parmas---------', parmas)
      this.$service.addGroup(parmas).then(res => {
        // 刷新列表
        this.getServiceList()
        this.showDragVisible = false
      }, '成功')
    },
    // 添加分组
    addGroup () {
      // 初始化
      // this.groupData = [{
      //   list: []
      // }]
      const parmas = {
        sceneId: this.selectedScene.id
      }
      this.$service.getListGroup(parmas).then(() => {
        this.showDragVisible = true
      })
    },
    handleCloseDialog () {
      this.showLaunchToBusiness = false
    },
    getName (list, key) {
      const obj = list.find(item => {
        return key === item.value
      })
      return obj ? obj.label : ''
    },
    getsourceSignName (key) {
      const obj = this.soureceSignList.find(item => {
        return key === item.sourceSign
      })
      return obj ? obj.sourceName : ''
    },
    // getRulesJsonToString (rulesJson) {
    //   const rules = JSON.parse(rulesJson).rules
    //   rules.forEach((item, index) => {
    //     if (index > 0) {
    //       const a = `<div class="label-or-space">${this.conditionEnum[JSON.parse(rulesJson).condition]}</div>`
    //       // const b = `<div class="label-ground">(
    //       //         <div
    //       //           v-for="(childItem,childItemIndex) in item.rules"
    //       //           :key="childItem.tagId+childItemIndex"
    //       //           class="label-item"
    //       //         >
    //       //           <div v-if="childItemIndex>0" class="label-or-space">{{ conditionEnum[item.condition] }}</div>
    //       //           <span class="txt">{{ childItem.categoryName }}</span>
    //       //           <span class="sel">{{ childItem.operator }}</span>
    //       //           <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 1">在当日之前</span>
    //       //           <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2 && childItem.dynamicTimeType == 2">在当日之后</span>
    //       //           <span class="in">
    //       //             <span >{{ childItem.value }}</span>
    //       //           </span>
    //       //           <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 2">天</span>
    //       //         </div>)
    //       //       </div>`
    //       item.rules.forEach((valObj, index2) => {

    //       })
    //     }
    //   })
    // },
    handleCommandTargetKey (val) {
      const obj = this.targetKeyList.find(item => {
        return val === item.id
      })
      this.editReceptionist({
        id: this.selectedServicer.id,
        indicatorsType: obj.id
      }, 'no-refresh-list')

      this.targetKey = obj ? obj.lable : ''
      this.selectedServicer.indicatorsType = obj ? obj.id : ''
    },
    // 服务员选择技能
    selectSkill (e) {
      this.editReceptionist({
        id: this.selectedServicer.id,
        skillId: e
      }, 'no-refresh-list')
    },
    handelRename2 (item) {
      this.editReceptionist({
        id: item.id,
        // ...item,
        receptionist: this.rename2
      })
      this.handelClosePop()
    },
    deleteService (item) {
      this.editReceptionist({
        id: item.id,
        delFlag: 2
      })
    },
    offSetService (item) {
      // putway  1 上架 2 下架
      this.editReceptionist({
        id: item.id,
        putway: item.putway === 1 ? 2 : 1
      })
    },
    handleServiceCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'rename') {
        this.showRename2(row)
      } else if (type === 'offSet') {
        this.offSetService(row)
      } else if (type === 'deleteService') {
        this.deleteService(row)
      }
    },
    handleSceneCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'rename') {
        this.showRename(row)
      } else if (type === 'putIn') {
        this.putInScene(row)
      } else if (type === 'offSet') {
        this.offSetScene(row)
      } else if (type === 'deleteScene') {
        this.deleteScene(row)
      }
    },
    showRename (item) {
      this.rename = item.sceneName
    },
    showRename2 (item) {
      this.rename2 = item.receptionist
    },
    // 投放
    putInScene (item) {
      this.tempPolicyAndCrowd = {
        ...item,
        policyName: item.sceneName,
        smart: true
      }
      this.showLaunchToBusiness = true
      // this.editScene({
      //   ...item,
      //   putway: 1
      // })
    },
    // 下架
    offSetScene (item) {
      // putway  1 上架 2 下架
      this.editScene({
        ...item,
        putway: item.putway === 1 ? 2 : 1
      })
    },
    deleteScene (item) {
      this.editScene({
        ...item,
        delFlag: 2
      })
    },
    handleCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'editEntry') {
        this.editEntry(row)
      } else if (type === 'deleteEntry') {
        this.deleteEntry(row)
      }
    },
    editEntry (row) {
      console.log('editClientRow---->', row)
      this.editClientRow = row
      this.clientDialogVisible = true
    },
    deleteEntry (row) {
      this.$confirm('此操作将永久删除该服务对象, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addEntry({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.getEntryListByReceptionistId()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCommandExport (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'editExport') {
        this.editExport(row)
      } else if (type === 'deleteExport') {
        this.deleteExport(row)
      }
    },
    editExport (row) {
      console.log('editClientRow---->', row)
      this.editExportRow = row
      this.exportDialogVisible = true
    },
    deleteExport (row) {
      this.$confirm('此操作将永久删除该终止条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.addExport({ ...row, delFlag: 2 }, '删除成功').then(res => {
          // 刷新列表
          this.getExportListByReceptionistId()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据接待员ID获取入口列表
    getEntryListByReceptionistId () {
      const parmas = {
        receptionistId: this.selectedServicer.id
      }
      this.$service.getEntryList(parmas).then(res => {
        this.entryList = res || []
      })
    },
    // 根据接待员ID获取出口列表
    getExportListByReceptionistId () {
      const parmas = {
        receptionistId: this.selectedServicer.id
      }
      this.$service.getExportList(parmas).then(res => {
        this.exportList = res || []
      })
    },
    // 新增/编辑入口条件
    addOrEditEntryRule () {
      const dialogRef = this.$refs.createClientDialog
      const rulesJson = dialogRef.rulesJson
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      const flowCondition = dialogRef.flowCondition

      saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit, flowCondition)

      // this.$service.addEntry(params, '添加成功').then(res => {
      //   // 刷新列表
      //   this.getEntryListByReceptionistId()
      //   this.clientDialogVisible = false
      // })
    },
    fetchAddOrEdit () {
      const dialogRef = this.$refs.createClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const rulesJson = JSON.stringify(dialogRef.rulesJson)
      const behaviorRulesJson = JSON.stringify(dialogRef.behaviorRulesJson)
      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      let params = {}
      if (this.editClientRow) {
        params = {
          ...this.editClientRow,
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink
        }
      } else {
        params = {
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink
        }
      }
      this.$service.addEntry(params, '添加成功').then(res => {
        // 刷新列表
        this.getEntryListByReceptionistId()
        this.clientDialogVisible = false
      })
    },
    // 新增、编辑出口条件
    addOrEditExportRule () {
      const dialogRef = this.$refs.exportClientDialog
      const rulesJson = dialogRef.rulesJson
      const behaviorRulesJson = dialogRef.behaviorRulesJson
      const flowCondition = dialogRef.flowCondition

      saveFunc(dialogRef, rulesJson, behaviorRulesJson, this.fetchAddOrEdit2, flowCondition)
    },
    fetchAddOrEdit2 () {
      const dialogRef = this.$refs.exportClientDialog

      const tagIds = dialogRef.checkedList.join(',')
      const rulesJson = JSON.stringify(dialogRef.rulesJson)
      const behaviorRulesJson = JSON.stringify(dialogRef.behaviorRulesJson)
      const flowCondition = JSON.stringify(dialogRef.flowCondition)

      let params = {}
      if (this.editExportRow) {
        params = {
          ...this.editExportRow,
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink
        }
      } else {
        params = {
          sceneId: this.selectedScene.id,
          policyId: this.selectedScene.policyId,
          receptionistId: this.selectedServicer.id,
          tagIds,
          rulesJson,
          behaviorRulesJson,
          flowCondition, // 流转指标
          delFlag: 1,
          link: dialogRef.totalLink
        }
      }
      this.$service.addExport(params, '添加成功').then(res => {
        // 刷新列表
        this.getExportListByReceptionistId()
        this.exportDialogVisible = false
      })
    },
    addOption () {
      const { query } = this.$refs.selectObj
      if (!query) return

      // this.value = query
      // 选择原有的
      const existArr = this.skillOptions.filter(item => item.name === query)
      if (existArr.length > 0) {
        this.skillValue = existArr[0].id
        return
      }

      // 创建新技能，并选中
      const parmas = {
        sceneId: this.selectedScene.id,
        name: query
      }
      this.$service.addSceneSkill(parmas).then(async res => {
        const aaa = await this.getSkillListBySceneId()
        console.log('aaa--->', aaa)

        const existArr = this.skillOptions.filter(item => item.name === query)
        if (existArr.length > 0) {
          this.skillValue = existArr[0].id
        }
      })
    },

    // 根据场景ID获取技能列表
    getSkillListBySceneId () {
      const parmas = {
        sceneId: this.selectedScene.id
      }
      return this.$service.getSceneSkillList(parmas).then(res => {
        console.log('rs-->', res)
        this.skillOptions = res || []
        return res
      })
    },
    // 选择场景
    selectScene (index) {
      this.activeIndex = index
      this.selectedScene = this.sceneList[index] || {}
      this.getServiceList()
      this.getSkillListBySceneId()
    },
    // 选择服务员
    selectServicer (index) {
      this.activeIndex2 = index
      this.selectedServicer = this.servicer[index] || {}

      // 入口列表
      this.getEntryListByReceptionistId()
      // 出口列表
      this.getExportListByReceptionistId()

      // 接待员分组
      this.getListGroupBySceneId()
    },

    // 服务员列表
    getServiceList () {
      const parmas = {
        sceneId: this.selectedScene.id,
        keywords: this.searchServicer,
        pageNum: 1,
        pageSize: 100
      }
      this.servicer = []
      this.$service.getReceptionistList(parmas).then(res => {
        this.servicer = res.data || []
        this.selectedServicer = {}
        this.entryList = []
        this.exportList = []
        if (this.servicer.length > 0) {
          if (this.servicer.length <= this.activeIndex2) {
            this.activeIndex2 = 0
          }
          this.selectServicer(this.activeIndex2)
        }
        // this.activeIndex2 = 0
        // this.selectedServicer = this.servicer[0] || {}
      })
    },
    // 场景列表
    getSceneList (callBack) {
      const parmas = {
        keywords: this.searchScene,
        pageNum: 1,
        pageSize: 100
      }
      this.sceneList = []
      this.$service.getSceneList(parmas).then(res => {
        this.sceneList = res.data || []
        callBack && callBack()
        console.log('this.activeIndex---》', this.activeIndex)
        if (this.sceneList.length > 0) {
          // 获取从动态人群跳转过来的场景ID，并选中
          const id = this.$route.params.sceneId || ''
          const redirctIndex = this.sceneList.findIndex(item => Number(id) === Number(item.id))
          debugger
          if (redirctIndex > 0) {
            this.activeIndex = redirctIndex
          } else if (this.sceneList.length <= this.activeIndex) {
            this.activeIndex = 0
          }
          // this.activeIndex = redirctIndex > 0 ? redirctIndex : this.activeIndex
          this.selectScene(this.activeIndex)
        }
        // this.activeIndex = 0
        // this.selectedScene = this.sceneList[0] || {}
        // this.getServiceList()
        // this.getSkillListBySceneId()
      })
    },
    // 新建服务对象筛选
    createClient () {
      this.editClientRow = undefined
      this.clientDialogVisible = true
    },
    createExport  () {
      this.editExportRow = undefined
      this.exportDialogVisible = true
    },
    handelRename (item) {
      this.editScene({
        // id: item.id,
        ...item,
        sceneName: this.rename
      })
      this.handelClosePop()
    },
    editScene (parmas) {
      const list = this.sceneList

      this.$service.editScene(parmas).then(res => {
        // const index = list.findIndex(item => item.id === parmas.id)
        // list.splice(index, 1, parmas)
        this.getSceneList()
      })
    },
    // 编辑接待员
    editReceptionist (params, type) {
      const list = this.servicer
      this.$service.editReceptionist(params).then(res => {
        // const index = list.findIndex(item => item.id === params.id)
        // list.splice(index, 1, params)
        if (type === 'no-refresh-list') return
        this.getServiceList()
      })
    },
    handelClosePop () {
      const pops = this.$refs.pop
      pops.forEach(item => {
        console.log('item-----', item)
        item.doClose()
      })
    },
    addScene () {
      this.dialogVisible = true
    },
    addServicer () {
      this.dialogVisible2 = true
    },
    confirmAddScene () {
      // console.log('this.formScene.length--------', this.sceneList.length)
      const parmas = {
        sceneName: this.formScene.name
        // id: this.sceneList.length + 1
      }

      this.$service.addScene(parmas).then(res => {
        // this.sceneList.push(item)
        const _this = this
        this.getSceneList(function () {
          _this.activeIndex = Number(_this.sceneList.length - 1)
        })
        this.dialogVisible = false
      })
    },
    // 确定添加服务员
    confirmAddServicer () {
      const parmas = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionist: this.formServicer.name
        // id: this.sceneList.length + 1
      }

      this.$service.addReceptionist(parmas).then(res => {
        // this.sceneList.push(item)
        this.getServiceList()
        this.dialogVisible2 = false
      })
    },

    editTarget () {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.inputPriority.focus()
      })
    },
    editTargetValue () {
      this.isEditValue = true
      this.$nextTick(() => {
        this.$refs.inputValue.focus()
      })
    },
    editStatuChange () {
      this.editReceptionist({
        id: this.selectedServicer.id,
        myTask: this.target
      }, 'no-refresh-list')

      this.selectedServicer.myTask = this.target
      this.isEdit = false
    },
    editTargetValueChange () {
      this.editReceptionist({
        id: this.selectedServicer.id,
        indicators: this.targetValue
      }, 'no-refresh-list')

      this.selectedServicer.indicators = this.targetValue

      this.isEditValue = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './sty/common.styl'
@import './sty/dark.styl'
@import './sty/light.styl'

#octagon {
  width: 100px;
  height: 100px;
  background: red;
  position: relative;
}
#octagon:before {
  content: "";
  width: 100px;
  position: absolute;
  top: 0; left: 0;
  border-bottom: 29px solid red;
  border-left: 29px solid #fff;
  border-right: 29px solid #fff;
  box-sizing: border-box;
}
#octagon:after {
  content: "";
  width: 100px;
  position: absolute;
  bottom: 0; left: 0;
  border-top: 29px solid red;
  border-left: 29px solid #fff;
  border-right: 29px solid #fff;
  box-sizing: border-box;
}
</style>
