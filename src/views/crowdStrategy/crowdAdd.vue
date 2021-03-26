<template>
  <div class="add">
    <el-row>
      <el-col :span="24">
        <div class="title" v-if="crowdId==null">新增人群</div>
        <div class="title" v-if="crowdId!=null">编辑人群</div>
      </el-col>
    </el-row>
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="form" :rules="formRules" ref="form" label-width="130px">
          <el-form-item label="人群名称" prop="name">
            <el-input size="small" v-model="form.name" placeholder="投放名称"></el-input>
          </el-form-item>
          <div style="position: relative">
          <el-form-item label="设置标签" class="multipleSelect" prop="tagIds">
            <div class="label-container">
              <div
                 v-show="rulesJson.rules.length > 1"
                 class="label-or-space"
              >
                  <el-button
                       type="success"
                       round
                       :key="'button2'+'_'"
                       @click="handleRulesConditionChange(rulesJson)"
                  >
                      {{rulesJson.condition === 'AND' ? '且' : '或'}}
                  </el-button>
              </div>
              <template v-for="(item, index) in rulesJson.rules">
                <div class="label-ground" :key="index">
                  <div class="tag-condition--parent">
                      <div class="tag-condition" v-show="item.rules.length > 1">
                          <el-button
                                  type="warning"
                                  @click="handleRulesConditionChange(item)"
                                  round
                                  size="small"
                                  :key="'button'+index+'_'"
                          >
                            {{item.condition === 'AND' ? '且' : '或'}}
                          </el-button>
                      </div>
                  <div
                    v-for="(childItem,n) in item.rules"
                    :key="index+'tagId'+n"
                    :class="{'label-item':true,'paddingTop':n>0}"
                  >
                    <span class="txt">{{ childItem.categoryName }}</span>
                    <span class="sel">
                      <el-select
                        style="width: 80px"
                        name="oxve"
                        v-model="childItem.operator"
                        class="input-inline"
                        @change="handleOperatorChange(childItem)"
                        v-show="!(childItem.tagType === 'time' && childItem.isDynamicTime === 3)"
                      >
                        <template
                          v-if="childItem.tagType === 'number'"
                        >
                          <el-option value="="></el-option>
                          <el-option value=">="></el-option>
                          <el-option value="<="></el-option>
                          <el-option value=">"></el-option>
                          <el-option value="<"></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'time' && childItem.isDynamicTime !== 3">
                          <el-option value="="></el-option>
                          <el-option value=">="></el-option>
                          <el-option value="<="></el-option>
                          <el-option value=">"></el-option>
                          <el-option value="<"></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'string'">
                          <el-option value="=" label="是"></el-option>
                          <el-option value="!=" label="不是"></el-option>
                          <el-option value="like" label="包含"></el-option>
                          <el-option value="null" label="为空"></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'boolean'">
                          <el-option value="=" label="="></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'collect'">
                          <el-option value="=" label="是"></el-option>
                          <el-option value="!=" label="不是"></el-option>
                        </template>
                      </el-select>
                      <el-select
                              v-show="childItem.tagType === 'time' && childItem.isDynamicTime === 3"
                              class="time-dot-select-new" :key="n+'timeKey'" v-model="childItem.dateAreaType">
                              <el-option :value='0' label="空"></el-option>
                              <el-option :value='1' label="已过期"></el-option>
                              <el-option :value='2' label="未过期"></el-option>
                      </el-select>
                    </span>
                    <span class="in">
                      <span v-if="childItem.tagType === 'time'">
                        <template v-if="childItem.isDynamicTime === 2">
                          <el-select class="time-dot-select" :key="n+'timeKey'" v-model="childItem.dynamicTimeType">
                              <el-option :value='1' label="在当日之前"></el-option>
                              <el-option :value='2' label="在当日之后"></el-option>
                          </el-select>
                          <span><el-input class="time-dot-input" v-model="childItem.value" @blur="checkNum(childItem.value)"></el-input>天</span>
                        </template>
                        <template v-if="childItem.isDynamicTime === 1">
                          <el-date-picker
                                  v-model="childItem.value"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  :key="index+'key'"
                          ></el-date-picker>
                        </template>
                        <template v-if="childItem.isDynamicTime === 3">
                          <span><el-input class="time-dot-input" style="width: 60px" v-model="childItem.startDay" @blur="checkNumMostFour(childItem.startDay)"></el-input>天~</span>
                          <span><el-input class="time-dot-input" style="width: 106px" v-model="childItem.endDay" @blur="bigNum(childItem)"></el-input>天</span>
                        </template>
                    </span>
                     <template v-else-if="(childItem.tagType==='string' || childItem.tagType === 'collect') && cache[childItem.tagId]">
                       <el-select
                               v-if="childItem.tagType==='string' && childItem.operator === 'null'"
                               v-model="childItem.value"
                               disabled
                       >
                         <el-option label="空" value="nil"></el-option>
                       </el-select>
                       <el-select
                                  v-else
                                  v-model="childItem.value"
                                  class="inline-input"
                                  filterable
                                  :key="index+'select'"
                                  default-first-option
                                  placeholder="请输入或选择"
                                  :disabled="cache[childItem.tagId].select"
                          >
                                <el-option
                                        v-for="item in cache[childItem.tagId].list"
                                        :key="index+item.attrValue+item.attrId"
                                        :label="item.attrName"
                                        :value="item.attrValue"
                                ></el-option>
                          </el-select>
                      </template>
                      <el-input-number
                              v-else-if="childItem.tagType==='number'"
                              :key="index+'input'"
                              v-model="childItem.value"
                              placeholder="请输入内容"
                      ></el-input-number>
                      <el-select v-else v-model="childItem.value">
                        <el-option value="true" label="是"></el-option>
                        <el-option value="false" label="否"></el-option>
                      </el-select>
                    </span>
                    <span v-if="childItem.tagType === 'time'">
                      <el-button :key="childItem.tagId + n" @click="changeTimeWays(childItem)" v-if="childItem.isDynamicTime !== 3">
                        <span v-if="childItem.isDynamicTime === 2">切换到具体时间点</span>
                        <span v-if="childItem.isDynamicTime === 1">切换至时间天数</span>
                      </el-button>
                      <el-button v-if="childItem.isDynamicTime !== 3" @click="childItem.isDynamicTime = 3 ;childItem.dateAreaType = 0;childItem.operator = 'between';childItem.value = childItem.startDay + '-' + childItem.endDay">切换至新方案</el-button>
                      <el-button v-if="childItem.isDynamicTime === 3" @click="childItem.isDynamicTime = 2 ;childItem.dynamicTimeType = 1;childItem.operator = '=';childItem.value = ''">切换至旧方案</el-button>
                    </span>
                    <template v-if="cache[childItem.tagId]">
                        <span v-if="cache[childItem.tagId].select && (childItem.tagType === 'string' || childItem.tagType === 'collect')">
                          <el-button :key="childItem.tagId+'_' + index +'_'+ n +'type1'" @click="handleSelectMore(childItem)">
                            点击选择更多
                          </el-button>
                        </span>
                    </template>
                    <span class="i" @click="handleRemoveRule(item, childItem)">
                      <i class="icon iconfont el-icon-cc-delete"></i>
                    </span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 3">
                      <el-tooltip class="item" effect="dark"
                                  placement="top-start"
                      >
                        <div slot="content">
                          状态：到期时间请选择“已过期”或“未过期”，其他请选“空”<br/>
                          时间设置：30天以内：输入0～30天；30天以外：请输入30天～9999天
                        </div>
                        <el-button type="text">提示</el-button>
                    </el-tooltip>
                    </span>
                  </div>
                  </div>
                  <div class="label-add">
                    <div class="optional-condition">
                      <el-tag
                              class="oc-item"
                              v-for="tagItem in tags"
                              :key="tagItem.tagId+ '_' +tagItem.tagName"
                              @click.native="handleAddChildRule(item, tagItem)"
                              :type= "dataSourceColorEnum[tagItem.dataSource]"
                      >{{ tagItem.tagName }}</el-tag>
                    </div>
                  </div>
                </div>
              </template>
              <div class="label-or">
                <div
                        class="optional-condition"
                        v-if="tags.length"
                        :style="{'padding-top': rulesJson.rules.length > 0 ? '10px' : 0}"
                >
                  <!--<span-->
                          <!--v-show="rulesJson.rules.length"-->
                          <!--class="label-and-txt"-->
                          <!--style="display: inline"-->
                  <!--&gt;或者&nbsp;</span>-->
                  <el-tag
                          class="oc-item"
                          v-for="(item) in tags"
                          :key="item.tagId+ '_' +item.tagName"
                          @click.native="handleAddRule(item)"
                          :type= "dataSourceColorEnum[item.dataSource]"
                  >{{ item.tagName }}</el-tag>
                </div>
              </div>
            </div>
          </el-form-item>
          <!--<el-form-item label="人群有效期" prop="crowdExp">-->
            <!--<el-date-picker-->
             <!--v-model="form.crowdExp"-->
             <!--type="datetimerange"-->
             <!--range-separator="至"-->
             <!--start-placeholder="开始日期"-->
             <!--end-placeholder="结束日期"-->
             <!--value-format="yyyy-MM-dd HH:mm"-->
             <!--format="yyyy-MM-dd HH:mm"-->
             <!--:picker-options="pickerOptions"-->
             <!--:default-time="['00:00:00', '23:59:59']"-->
            <!--&gt;-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <div class="outer-and" v-if="specialTags.length > 0">
             <el-button
                 type="danger"
                 v-if="(specialTags.length > 0 && tags.length > 0) && dynamicPolicyJson"
                 @click="handleConditionChange()"
                 round
                 :key="'condition'"
              >{{dynamicPolicyJson.link === 'OR' ? '或' : '且'}}
             </el-button>
          </div>
          <el-form-item label="动态因子" v-if="specialTags.length > 0">
            <div class="label-container">
              <div
                      v-show="dynamicPolicyJson.rules.length > 1"
                      class="label-or-space"
                      :key="'_or'"
              >
                <el-button
                        type="success"
                        round
                        :key="'button3'+'_'"
                        @click="handleRulesConditionChange(dynamicPolicyJson)"
                >
                  {{dynamicPolicyJson.condition === 'AND' ? '且' : '或'}}
                </el-button>
              </div>
              <template v-for="(item, index) in dynamicPolicyJson.rules">
                <div class="label-ground" :key="index">
                  <div class="tag-condition--parent">
                    <div class="tag-condition" v-show="item.rules.length > 1">
                      <el-button
                              type="warning"
                              @click="handleRulesConditionChange(item)"
                              round
                              size="small"
                              :key="'button'+index+'_'"
                      >
                        {{item.condition === 'AND' ? '且' : '或'}}
                      </el-button>
                    </div>
                  <div
                          v-for="(childItem,n) in item.rules"
                          :key="index+'tagId'+n"
                          :class="{'label-item':true,'paddingTop':n>0}"
                  >
                    <template v-if="childItem.tagType === 'number'">
                      <div class="flex-item">
                        <div>位置类型</div>
                        <div>
                          <el-select v-model="childItem.dynamic.type" style="width: 80px">
                            <el-option label="版面" :value="1"></el-option>
                            <el-option label="版块" :value="2"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="flex-item">
                        <div>位置ID </div>
                        <el-input v-model="childItem.dynamic.version" style="width: 150px"></el-input>
                      </div>
                    </template>
                    <span :class="childItem.tagType === 'number' ? '' : 'txt'">{{ childItem.categoryName }}</span>
                    <span :class="childItem.tagType === 'number' ? '' : 'sel'">
                      <el-select
                              style="width: 80px"
                              name="oxve"
                              v-model="childItem.operator"
                              class="input-inline"
                              @change="handleOperatorChange(childItem)"
                              v-show="!(childItem.tagType === 'time' && childItem.isDynamicTime === 3)"
                      >
                        <template
                                v-if="childItem.tagType === 'number'"
                        >
                          <el-option value="="></el-option>
                          <el-option value=">="></el-option>
                          <el-option value="<="></el-option>
                          <el-option value=">"></el-option>
                          <el-option value="<"></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'time' && childItem.isDynamicTime !== 3">
                          <el-option value="="></el-option>
                          <el-option value=">="></el-option>
                          <el-option value="<="></el-option>
                          <el-option value=">"></el-option>
                          <el-option value="<"></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'string'">
                          <el-option value="=" label="是"></el-option>
                          <el-option value="!=" label="不是"></el-option>
                          <el-option value="like" label="包含"></el-option>
                          <el-option value="null" label="为空"></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'boolean'">
                          <el-option value="=" label="="></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'collect'">
                          <el-option value="=" label="是"></el-option>
                          <el-option value="!=" label="不是"></el-option>
                        </template>
                      </el-select>
                      <el-select
                              v-show="childItem.tagType === 'time' && childItem.isDynamicTime === 3"
                              class="time-dot-select-new" :key="n+'timeKey'" v-model="childItem.dateAreaType">
                              <el-option :value='0' label="空"></el-option>
                              <el-option :value='1' label="已过期"></el-option>
                              <el-option :value='2' label="未过期"></el-option>
                      </el-select>
                    </span>
                    <span class="in">
                      <span v-if="childItem.tagType === 'time'">
                        <template v-if="childItem.isDynamicTime === 2">
                          <el-select class="time-dot-select" :key="n+'timeKey'" v-model="childItem.dynamicTimeType">
                              <el-option :value='1' label="在当日之前"></el-option>
                              <el-option :value='2' label="在当日之后"></el-option>
                          </el-select>
                          <span><el-input class="time-dot-input" v-model="childItem.value" @blur="checkNum(childItem.value)"></el-input>天</span>
                        </template>
                        <template v-if="childItem.isDynamicTime === 1">
                          <el-date-picker
                                  v-model="childItem.value"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  :key="index+'key'"
                          ></el-date-picker>
                        </template>
                        <template v-if="childItem.isDynamicTime === 3">
                          <span><el-input class="time-dot-input" style="width: 60px" v-model="childItem.startDay" @blur="checkNumMostFour(childItem.startDay)"></el-input>天~</span>
                          <span><el-input class="time-dot-input" style="width: 106px" v-model="childItem.endDay" @blur="bigNum(childItem)"></el-input>天</span>
                        </template>
                    </span>
                     <template v-else-if="(childItem.tagType==='string' || childItem.tagType === 'collect') && cache[childItem.tagId]">
                       <el-select
                               v-if="childItem.tagType==='string' && childItem.operator === 'null'"
                               v-model="childItem.value"
                               disabled
                       >
                         <el-option label="空" value="nil"></el-option>
                       </el-select>
                       <el-select
                               v-else
                               v-model="childItem.value"
                               class="inline-input"
                               filterable
                               :key="index+'select'"
                               default-first-option
                               placeholder="请输入或选择"
                               :disabled="cache[childItem.tagId].select"
                       >
                                <el-option
                                        v-for="item in cache[childItem.tagId].list"
                                        :key="index+item.attrValue+item.attrId"
                                        :label="item.attrName"
                                        :value="item.attrValue"
                                ></el-option>
                          </el-select>
                      </template>
                      <el-input-number
                              v-else-if="childItem.tagType==='number'"
                              :key="index+'input'"
                              v-model="childItem.value"
                              placeholder="请输入内容"
                      ></el-input-number>
                      <el-select v-else v-model="childItem.value">
                        <el-option value="true" label="是"></el-option>
                        <el-option value="false" label="否"></el-option>
                      </el-select>
                    </span>
                    <span v-if="childItem.tagType === 'time'">
                      <el-button :key="childItem.tagId + n" @click="changeTimeWays(childItem)" v-if="childItem.isDynamicTime !== 3">
                        <span v-if="childItem.isDynamicTime === 2">切换到具体时间点</span>
                        <span v-if="childItem.isDynamicTime === 1">切换至时间天数</span>
                      </el-button>
                      <el-button v-if="childItem.isDynamicTime !== 3" @click="childItem.isDynamicTime = 3 ;childItem.dateAreaType = 0;childItem.operator = 'between';childItem.value = childItem.startDay + '-' + childItem.endDay">切换至新方案</el-button>
                      <el-button v-if="childItem.isDynamicTime === 3" @click="childItem.isDynamicTime = 2 ;childItem.dynamicTimeType = 1;childItem.operator = '=';childItem.value = ''">切换至旧方案</el-button>
                    </span>
                    <template v-if="cache[childItem.tagId]">
                        <span v-if="cache[childItem.tagId].select && (childItem.tagType === 'string' || childItem.tagType === 'collect')">
                          <el-button :key="childItem.tagId+'_'+index+'_'+n+'type2'" @click="handleSelectMore(childItem)">
                            点击选择更多
                          </el-button>
                        </span>
                    </template>
                    <span class="i" @click="handleRemoveSpecialRule(item, childItem)">
                      <i class="icon iconfont el-icon-cc-delete"></i>
                    </span>
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 3">
                      <el-tooltip class="item" effect="dark"
                                  placement="top-start"
                      >
                        <div slot="content">
                          状态：到期时间请选择“已过期”或“未过期”，其他请选“空”<br/>
                          时间设置：30天以内：输入0～30天；30天以外：请输入30天～9999天
                        </div>
                        <el-button type="text">提示</el-button>
                    </el-tooltip>
                    </span>
                  </div>
                  <div class="label-add">
                    <div class="optional-condition">
                      <el-tag
                              class="oc-item"
                              v-for="tagItem in specialTags"
                              :key="tagItem.tagId+ '_' +tagItem.tagName"
                              @click.native="handleAddSpecialChildRule(item, tagItem)"
                              :type= "dataSourceColorEnum[tagItem.dataSource]"
                      >{{ tagItem.tagName }}</el-tag>
                    </div>
                  </div>
                  </div>
                </div>
              </template>
              <div class="label-or">
                <div
                        class="optional-condition"
                        v-if="specialTags.length"
                        :style="{'padding-top': dynamicPolicyJson.rules.length > 0 ? '10px' : 0}"
                >
                  <!--<span-->
                          <!--v-show="dynamicPolicyJson.rules.length"-->
                          <!--class="label-and-txt"-->
                          <!--style="display: inline"-->
                  <!--&gt;或者&nbsp;</span>-->
                  <el-tag
                          class="oc-item"
                          v-for="(item) in specialTags"
                          :key="item.tagId+ '_' +item.tagName"
                          @click.native="handleAddSpecialRule(item)"
                          :type= "dataSourceColorEnum[item.dataSource]"
                  >{{ item.tagName }}</el-tag>
                </div>
              </div>
            </div>
          </el-form-item>
          </div>
          <el-form-item label="是否限制投放数量" prop="limitLaunch">
            <el-radio-group v-model="form.limitLaunch" :disabled="limitLaunchDisabled">
              <el-radio  :label="false">否</el-radio>
              <el-radio  :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投放数量" prop="limitLaunchCount" v-if="form.limitLaunch">
            <el-input-number size="medium" placeholder="不能大于100万" :max="100000" :min="1" v-model="form.limitLaunchCount"></el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input size="small" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="priority" v-if="crowdId!=null">
            <el-input size="small" v-model="priority"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="footer">
      <el-button @click="cancelAdd">返回</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
    <el-dialog
            title="显示更多标签"
            :append-to-body='true'
            :visible.sync="showMoreTags"
            class="showMoreTags"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标签名称">
          <el-input v-model="formInline.attrName" placeholder="标签名称" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-radio-group v-model="checkboxValue">
          <el-radio v-for="(tag,index) in tagList" :label="tag.attrValue" :key="tag.attrId+index">{{tag.attrName}}</el-radio>
        </el-radio-group>
      </div>
      <el-pagination
              small
              class="pagination"
              layout="prev,pager,next"
              :total="tagsListTotal"
              :page-size="initPageSize"
              :current-page="initCurrentPage"
              @current-change="handleCurrentChange"
              @prev-click="handleCurrentChange"
              @next-click="handleCurrentChange"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
                        <el-button @click="showMoreTags = false">取 消</el-button>
                        <el-button type="primary" @click="handleCheckboxOk">确 定</el-button>
                      </span>
    </el-dialog>
  </div>
</template>
<script>
    export default {
        data() {
            var checkIntNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('限制投放数量不能为空'));
                }
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入大于0小于10万的整数'));
                } else {
                    callback()
                }
            };
            return {
                //attrs: [[${attrs}]] || {},
                cache: {},
                tags: [],
                specialTags: [],
                tagInitSize: 200,
                tagCurrentPage: 1,
                tagSelectMoreShow: false,
                showMoreTags: false,
                tagList: [],
                checkboxValue: '',
                currentChildItem: '',
                // 选择更多标签分页
                initPageSize: 200,
                initCurrentPage: 1,
                tagsListTotal: 0,
                // tag 查询模块
                formInline: {
                    attrName: ''
                },
                // usedTags: [[${usedTags}]] || {},
                rulesJson: { condition: "OR", rules: [] },
                dynamicPolicyJson: { link : 'AND', condition: "OR", rules: []  },
                suggestions: {},
                suggestionsNew: [],
                priority: "",
                form: {
                    name: "",
                    policyId: null,
                    remark: "",
                    // crowdExp: [],
                    limitLaunch: false,
                    limitLaunchCount: undefined
                },
                formRules: {
                    name: [{ required: true, message: '请填写人群名称', trigger: 'blur' }],
                    // crowdExp: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
                    limitLaunchCount: [{ validator: checkIntNumber, trigger: 'blur' }]
                },
                pickerOptions: {
                    disabledDate(time) {
                        // 设置可选时间为今天之后的60天内
                        // 为了解当前时间不是23.59.59,第60选不了当前时间点之后的时间点
                        // 比如当前是10.10.10,选不了第60天的10.10.10之后的点
                        const today = new Date().setHours(23, 59, 59)
                        const curDate = new Date(today).getTime()
                        // 算出一个月的毫秒数，这里使用30的平均值，实际应根据具体的每个月有多少天计算
                        const day = 60 * 24 * 3600 * 1000
                        const dateRange = curDate + day
                        return time.getTime() < Date.now() - 24*60*60*1000 || time.getTime() > dateRange
                    }
                },
                currentLaunchLimitCount: undefined,
                // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
                dataSourceColorEnum: {
                    1: 'success',
                    2: 'danger',
                    3: '',
                    5: 'warning',
                    6: 'warningOrange'
                }
            };
        },
        props: ["policyId", "crowdId","limitLaunchDisabled"],
        methods: {
            changeTimeWays (childItem) {
                childItem.value = ''
                if(childItem.isDynamicTime) {
                    childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2 }
                else {
                    this.$set(childItem,'isDynamicTime',2)
                }
            },
            handleRemoveRule (rule, childRule) {
                const rulesJson = this.rulesJson
                rule.rules.splice(rule.rules.indexOf(childRule), 1)
                if (rule.rules.length === 0) {
                    rulesJson.rules = rulesJson.rules.filter(function(item) {
                        return item !== rule
                    })
                }
            },
            handleRemoveSpecialRule (rule, childRule) {
                const rulesJson = this.dynamicPolicyJson
                rule.rules.splice(rule.rules.indexOf(childRule), 1)
                if (rule.rules.length === 0) {
                    rulesJson.rules = rulesJson.rules.filter(function(item) {
                        return item !== rule
                    })
                }
            },
            /*添加一级标签 */
            /**
             * tag 为标签
             */
            handleAddRule(tag) {
                if (this.rulesJson.rules.length > 50) {
                    this.$message.warning("已达最大数量")
                    return
                }
                if(tag.tagType==='string' || tag.tagType === 'collect'){
                    if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
                }
                this.rulesJson.rules.push({
                    condition: "AND",
                    rules: [
                        {
                            operator: tag.tagType==='time'? 'between' : this.getDefaultOperator("="),
                            tagCode: tag.tagKey,
                            tagName: tag.tagName,
                            dataSource: tag.dataSource,
                            value: "",
                            tagId: tag.tagId,
                            tagType: tag.tagType,
                            categoryName: tag.tagName,
                            categoryCode: tag.tagKey,
                            dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
                            isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
                            thirdPartyCode: tag.thirdPartyCode,
                            thirdPartyField: tag.thirdPartyField,
                            dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
                            startDay: tag.tagType==='time' ? (tag.startDay ? tag.startDay : ''): undefined,
                            endDay: tag.tagType==='time' ? (tag.endDay ? tag.endDay : ''): undefined,
                            initValue: tag.initValue
                        }
                    ]
                })
            },
            handleAddChildRule(rule, tag) {
                if (rule.rules.length > 50) {
                    this.$message.warning("已达最大数量")
                    return;
                }
                if(tag.tagType==='string' || tag.tagType === 'collect'){
                    if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
                }
                rule.rules.push({
                                  operator: tag.tagType==='time'? 'between' : this.getDefaultOperator("="),
                                  tagCode: tag.tagKey,
                                  tagName: tag.tagName,
                                  dataSource: tag.dataSource,
                                  value: "",
                                  tagId: tag.tagId,
                                  tagType: tag.tagType,
                                  categoryName: tag.tagName,
                                  categoryCode: tag.tagKey,
                                  dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
                                  isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
                                  thirdPartyCode: tag.thirdPartyCode,
                                  thirdPartyField: tag.thirdPartyField,
                                  dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
                                  startDay: tag.tagType==='time' ? (tag.startDay ? tag.startDay : ''): undefined,
                                  endDay: tag.tagType==='time' ? (tag.endDay ? tag.endDay : ''): undefined,
                                  initValue: tag.initValue
                                })
            },
            handleAddSpecialRule (tag) {
                if (this.dynamicPolicyJson.rules.length > 50) {
                    this.$message.warning("已达最大数量")
                    return
                }
                // if(tag.tagType==='string' || tag.tagType === 'collect'){
                //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
                // }
                this.dynamicPolicyJson.rules.push({
                    condition: "AND",
                    rules: [
                        {
                            operator: "=",
                            tagCode: tag.tagKey,
                            tagName: tag.tagName,
                            dataSource: tag.dataSource,
                            value: "",
                            tagId: tag.tagId,
                            tagType: tag.tagType,
                            categoryName: tag.tagName,
                            categoryCode: tag.tagKey,
                            dynamic: {
                                type: 1,
                                version: ''
                            },
                            initValue: tag.initValue
                        }
                    ]
                })
            },
            handleAddSpecialChildRule(rule, tag) {
                if (rule.rules.length > 50) {
                    this.$message.warning("已达最大数量")
                    return;
                }
                // if(tag.tagType==='string' || tag.tagType === 'collect'){
                //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
                // }
                rule.rules.push({
                    operator: "=",
                    tagCode: tag.tagKey,
                    tagName: tag.tagName,
                    dataSource: tag.dataSource,
                    value: "",
                    tagId: tag.tagId,
                    tagType: tag.tagType,
                    categoryName: tag.tagName,
                    categoryCode: tag.tagKey,
                    dynamic: {
                        type: 1,
                        version: ''
                    },
                    initValue: tag.initValue
                })
            },
            fetchTagSuggestions(tagId) {
                this.$service.getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                    this.$set(this.cache, tagId, {
                        select: data.select,
                        list: data.pageInfo.list
                    })
                })
            },
            handleCheckboxOk () {
                this.currentChildItem.value = this.checkboxValue
                this.showMoreTags = false
            },
            handleSelectMore (child) {
                this.checkboxValue = ''
                this.formInline.attrName = ''
                this.currentChildItem = child
                // this.showMoreTags = true
                this.$service.getTagAttr({ tagId: child.tagId, pageSize: this.initPageSize, pageNum:this.initCurrentPage}).then(data => {
                    this.showMoreTags = true
                    this.tagList = data.pageInfo.list
                    this.tagsListTotal = data.pageInfo.total
                });
            },
            handleCurrentChange(index){
                this.initCurrentPage = index
                this.$service.getTagAttr({ tagId: this.currentChildItem.tagId, pageSize: this.initPageSize, pageNum:index}).then(data => {
                    this.tagList = data.pageInfo.list
                });
            },
            onSubmit() {
                this.$service.getTagAttr({
                    tagId: this.currentChildItem.tagId,
                    pageSize: this.initPageSize,
                    pageNum:1,
                    attrName: this.formInline.attrName
                }).then(data => {
                    this.tagList = data.pageInfo.list
                    this.tagsListTotal = data.pageInfo.total
                });
            },
            getDefaultOperator() {
                return "=";
            },
            handleSave() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        const form = JSON.parse(JSON.stringify(this.form))
                        const tagIds = []
                        const ruleJson = JSON.parse(JSON.stringify(this.rulesJson))
                        const dynamicPolicyJson = JSON.parse(JSON.stringify(this.dynamicPolicyJson))
                        const rules = ruleJson.rules
                        const ruleLength = rules.length
                        const dynamicPolicyRules = dynamicPolicyJson.rules
                        const dynamicPolicyRulesLength = dynamicPolicyRules.length
                        let i, j = 0
                        // 如果设置标签和动态因子都没有选rules则报错
                        if (ruleLength === 0 && dynamicPolicyRulesLength === 0) {
                            this.$message.error('请至少填写一个标签块内容或者一个动态因子完整的内容！')
                            return
                        }
                        if (this.limitLaunchDisabled && this.currentLaunchLimitCount) {
                            if (this.currentLaunchLimitCount > form.limitLaunchCount) {
                                this.$message.error('投放数量不能小于上一次设置的限制数量')
                                return
                            }
                        }
                        // 判断设置标签里是否有未填写的项
                        let rulesFlag = true
                        for (i=0; i<ruleLength; i++){
                            for (j=0; j< rules[i].rules.length; j++) {
                                let rulesItem = rules[i].rules[j]
                                if(rulesItem.value === ''){
                                    this.$message.error('请正确填写第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的值！')
                                    rulesFlag = false
                                    break
                                }else if(rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3){
                                    if(this.checkNumMostFour(rulesItem.startDay) && this.checkNumMostFour(rulesItem.endDay)) {
                                        if(parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) {
                                            rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
                                        }
                                        else {
                                            this.$message.error('第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的天数值后面的值必须大于前面的')
                                            rulesFlag = false
                                            break
                                        }
                                    }else {
                                        this.$message.error('第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的值是大于等于0的整数且不能超过4位数')
                                        rulesFlag = false
                                        break
                                    }
                                } else if (rulesItem.tagType === 'string' && rulesItem.operator === 'null') {
                                    rulesItem.operator = '='
                                }
                                if (!rulesFlag) break
                            }
                            if (!rulesFlag) break
                        }
                        if (!rulesFlag) return
                        //判断动态因子里面是否有未填的
                        let dynamicPolicyFlag = true
                        for (i=0; i<dynamicPolicyRulesLength; i++){
                            for (j=0; j< dynamicPolicyRules[i].rules.length; j++) {
                                let rulesItem = dynamicPolicyRules[i].rules[j]
                                if(rulesItem.value === '' || rulesItem.dynamic.version === ''){
                                    this.$message.error('请正确填写第'+(i+1)+'动态因子里面的第'+(j+1)+'行的值！')
                                    dynamicPolicyFlag = false
                                    break
                                    }
                                    if (!dynamicPolicyFlag) break
                                }
                            if (!dynamicPolicyFlag) break
                        }
                        if (!dynamicPolicyFlag) return
                        // 如果外层条件是且，则设置标签和动态因子都是必填，如果是或则选填
                        // if (dynamicPolicyJson.condition === 'AND') {
                        //     if (ruleLength === 0 || dynamicPolicyRulesLength === 0) {
                        //         this.$message.error('因为动态因子上面的条件为且，所以请填写至少一个标签块内容和一个动态因子完整的内容！')
                        //         return
                        //     }
                        //     if (!validateJsonRules(true) || !validateDynamicPolicyRules(true)) {
                        //         return
                        //     }
                        // } else {
                        // //    或的时候校验一个是否已填
                        //     if (!validateJsonRules(false) && !validateDynamicPolicyRules(false)) {
                        //         this.$message.error('请至少填写一个标签块内容或者一个动态因子完整的内容！')
                        //         return
                        //     } else {
                        //         if (!validateJsonRules(false)) {
                        //             const dynamicFlag = validateDynamicPolicyRules(true)
                        //             if (!dynamicFlag) {return}
                        //         }
                        //         if (!validateDynamicPolicyRules(false)) {
                        //             const rulesFlag = validateJsonRules(true)
                        //             if (!rulesFlag) {return}
                        //         }
                        //     }
                        // }
                        rules.forEach(function(item) {
                            item.rules.forEach(function(childItem) {
                                if (tagIds.indexOf(childItem.tagId) === -1) {
                                    tagIds.push(childItem.tagId)
                                }
                                delete childItem.startDay
                                delete childItem.endDay
                            })
                        })
                        const data = {
                            crowdName: form.name,
                            tagIds: tagIds.join(","),
                            rulesJson: JSON.stringify(ruleJson),
                            dynamicPolicyJson: JSON.stringify(dynamicPolicyJson),
                            remark: form.remark,
                            policyId: form.policyId,
                            // crowdValidFrom: form.crowdExp[0],
                            // crowdValidTo: form.crowdExp[1],
                            limitLaunch: form.limitLaunch,
                            limitLaunchCount: form.limitLaunch ? form.limitLaunchCount : undefined
                        }
                        if (this.crowdId != null) {
                            data.crowdId = this.crowdId;
                            data.priority = this.priority;
                            this.$service.crowdUpdate(data, "操作成功，修改人群条件会影响该策略下所有人群的交叉，请点击“估算”重新估算其他人群的圈定数据").then(() => {
                                this.$emit("goBackCrowdListPage", true)
                            })
                        } else {
                            this.$service.crowdSave(data, "操作成功，新增一个人群会影响该策略下人群优先级和交叉，请点击“估算”重新估算其他人群的圈定数据").then(() => {
                                this.$emit("goBackCrowdListPage", true)
                            })
                        }
                    }else {
                        return false
                    }
                })
            },
            // 取消
            cancelAdd: function() {
                this.$emit("goBackCrowdListPage");
            },
            // 数组去重
            distinct(a, b) {
                let arr = a.concat(b)
                let result = []
                let obj = {}
                for (let i of arr) {
                    if (!obj[i]) {
                        result.push(i)
                        obj[i] = 1
                    }
                }
                return result
            },
            checkNum(num) {
                if((/(^\d+$)/).test(num)) {
                    return true
                }else {
                    this.$message.error('该值为必填项，且必须是大于等于0的整数')
                    return false
                }
            },
            checkNumMostFour(num) {
                const numInt = parseInt(num)
                if((/(^\d+$)/).test(num) && numInt <= 9999) {
                    return true
                }else {
                    this.$message.error('该值为必填项，且必须是大于等于0的整数且不能超过4位数')
                    return false
                }
            },
            bigNum(item) {
                const startDay = item.startDay
                const endDay = item.endDay
                if(this.checkNumMostFour(endDay)) {
                    if(parseInt(startDay) >= parseInt(endDay)) {
                        this.$message.error('第二个值必须大于第一个值')
                    }else {
                        item.value = startDay + '-' + endDay
                    }
                }else{ item.value = '' }
            },
            handleOperatorChange (item) {
                if(item.tagType === 'string' && item.operator === 'null') {
                    item.value = 'nil'
                } else {
                    item.value = ''
                }
            },
            handleRulesConditionChange (item) {
                  item.condition = item.condition === 'AND' ? 'OR' : 'AND'
            },
            handleConditionChange () {
                 this.dynamicPolicyJson.link = this.dynamicPolicyJson.link === 'AND' ? 'OR' : 'AND'
            }
        },
        created() {
            this.form.policyId = this.policyId;
            this.$service
                .getTagsByPoliceId({ policyId: this.form.policyId })
                .then(data => {
                    const normalTags = []
                    const specialTags = []
                    data.forEach(item => {
                        if (item.dataSource === 6) {
                            specialTags.push(item)
                        } else {
                            normalTags.push(item)
                        }
                    })
                    this.tags = normalTags
                    this.specialTags = specialTags
                });
            if (this.crowdId != null)
            //编辑
                this.$service.crowdEdit({ crowdId: this.crowdId }).then(data => {
                    let policyData = data.policyCrowds
                    this.form.name = policyData.crowdName
                    this.form.remark = policyData.remark
                    this.priority = policyData.priority
                    this.form.limitLaunch = policyData.limitLaunch
                    this.form.limitLaunchCount = policyData.limitLaunch ? policyData.limitLaunchCount : undefined
                    this.currentLaunchLimitCount = policyData.limitLaunch ? policyData.limitLaunchCount : undefined
                    let ruleJsonData = JSON.parse(policyData.rulesJson)
                    var cacheIds = []
                    ruleJsonData.rules = ruleJsonData.rules.map(itemParent => {
                        itemParent.rules.forEach(item => {
                            if(item.tagType === 'string' || item.tagType === 'collect') {
                                cacheIds.push(item.tagId)
                            }
                            if (item.tagType === 'string' && item.value === 'nil') {
                                item.operator = 'null'
                            }
                            if(item.tagType === 'time' && item.isDynamicTime === 3){
                                const value = item.value.split('-')
                                this.$set(item,'startDay',value[0])
                                this.$set(item,'endDay',value[1])
                            }else if (item.tagType === 'time' && item.isDynamicTime !== 3) {
                                this.$set(item,'dateAreaType','')
                                this.$set(item,'dynamicTimeType',parseInt(item.dynamicTimeType))
                            }
                        })
                        return itemParent
                    })
                    this.rulesJson = ruleJsonData
                    if (policyData.dynamicPolicyJson) {
                        this.dynamicPolicyJson = JSON.parse(policyData.dynamicPolicyJson)
                    }
                    cacheIds = this.distinct(cacheIds,[])
                    if(cacheIds.length !== 0){
                        cacheIds.forEach(this.fetchTagSuggestions)}
                })
        }
    }
</script>
<style lang="stylus" scoped>
  .multipleSelect
    >>>.el-select
      width: 100%
  .add
    border: 1px solid #ebeef5
    padding: 20px
    border-radius: 4px
  .title
    font-size: 18px
    margin-bottom: 30px
  .footer
    display: flex
    justify-content: flex-end
  .label-ground
    border 1px dashed #ccc
    padding 10px
    margin 10px 0
  .label-item
    display: flex
    position: relative
  .paddingTop
    padding-top: 50px
  .label-item .and
    position: absolute
    top: 5px
    left: 260px
    /*width: 40px*/
    /*height: 40px*/
  .label-item .txt, .label-item .sel
    width: 150px
  .label-item .txt
    text-align: right
  .label-item .in
    width: 250px
  .label-item span, .oc-item
    margin-right: 10px
  .label-add
    margin-top: 10px
  .label-add >>> span
    cursor: pointer
  .label-or >>> span
    cursor: pointer
  i
    cursor: pointer
  .label-item .time-dot-select
    width 120px
  .label-item .time-dot-input
    display inline-block
    width 80px
    margin 0 7px
  .el-date-editor.el-input, .el-date-editor.el-input__inner
    width: 100%
  .pagination
    float right
  .showMoreTags >>> .el-radio
    margin 5px
  .label-item .time-dot-select-new
    width 90px
  .add
    >>> .el-tag--warningOrange
      color #512DA8
      background-color rgba(119, 81, 200, .4)
      border-color rgba(81, 45, 168, .45)
      .el-tag__close
        color #512DA8
  .flex-item
    display flex
    margin-right 10px
    div+div
      margin-left 10px
  .outer-and
    position relative
    margin-left 70px
  .tag-condition--parent
    position relative
    z-index 1
  .tag-condition
      position absolute
      top 10px
      right 0
      bottom 3px
      left -17px
      width 3px
      height auto
      margin auto 0
      border 1px dashed #E6A23C
      border-right 0
      z-index 999
      display flex
      align-items center
      justify-content center
  .label-container
      position relative
      z-index 1
  .label-or-space
      position absolute
      top 10px
      right 0
      bottom 5px
      left -40px
      width 3px
      height auto
      margin auto 0
      border 1px dashed #67C23A
      border-right 0
      z-index 999
      display flex
      align-items center
      justify-content center
  .outer-and
    position absolute
    top 10px
    right 0
    bottom 3px
    left 0
    width 3px
    height auto
    margin auto 10px
    border 1px dashed red
    border-right 0
    z-index 999
    display flex
    align-items center
    justify-content center
</style>


