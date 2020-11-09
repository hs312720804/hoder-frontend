<template>
  <el-collapse class="el-collapse" accordion v-model="activeName">
    <el-form-item label="人群条件" class="el-collapse_item">
      <template v-for="(crowd, i) in inputValue">
        <div class="items" :key="i">
          <el-collapse-item :name="i" :key="i" class="crowd-content">
            <template slot="title">
              <div class="collapse-title">
                <div>{{crowd.crowdName}}</div>
                <div><el-button @click="handleEstimate(crowd)">估算</el-button></div>
              </div>
              <div class="collapse-title" style="justify-content: center" v-if="crowd.total0 != undefined">
                <div>圈定设备数量：{{crowd.total0}} <span class="count-tips">（当人群条件有变化，请重新点击估算）</span></div>
              </div>
            </template>
            <el-form-item label="人群名称" :prop="formProp(i +'.crowdName')" :rules="rules.crowdName">
              <el-input v-model="crowd.crowdName" placeholder="投放名称"></el-input>
            </el-form-item>
            <div style="position: relative">
            <el-form-item label="设置标签" class="multipleSelect" required>
              <div class="label-container">
                <div
                        v-show="crowd.rulesJson.rules.length > 1"
                        class="label-or-space"
                        :key="i+'or'"
                >
                  <el-button
                          type="success"
                          round
                          :key="'button2'+'_'+i"
                          @click="handleRulesConditionChange(crowd.rulesJson)"
                  >
                    {{crowd.rulesJson.condition === 'AND' ? '且' : '或'}}
                  </el-button>
                </div>
                <template v-for="(item, index) in crowd.rulesJson.rules">
                  <div class="label-ground" :key="index">
                    <div class="tag-condition--parent">
                      <div class="tag-condition" v-show="item.rules.length > 1">
                        <el-button
                                type="warning"
                                @click="handleRulesConditionChange(item)"
                                round
                                size="small"
                                :key="'button'+index+'_'+i"
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
                          <template v-if="childItem.tagType === 'number'">
                            <el-option value="="></el-option>
                            <el-option value=">="></el-option>
                            <el-option value="<="></el-option>
                            <el-option value=">"></el-option>
                            <el-option value="<"></el-option>
                          </template>
                          <template
                            v-if="childItem.tagType === 'time' && childItem.isDynamicTime !== 3"
                          >
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
                          class="time-dot-select-new"
                          :key="n+'timeKey'"
                          v-model="childItem.dateAreaType"
                        >
                          <el-option :value="0" label="空"></el-option>
                          <el-option :value="1" label="已过期"></el-option>
                          <el-option :value="2" label="未过期"></el-option>
                        </el-select>
                      </span>
                      <span class="in">
                        <span v-if="childItem.tagType === 'time'">
                          <template v-if="childItem.isDynamicTime === 2">
                            <el-select
                              class="time-dot-select"
                              :key="n+'timeKey'"
                              v-model="childItem.dynamicTimeType"
                            >
                              <el-option :value="1" label="在当日之前"></el-option>
                              <el-option :value="2" label="在当日之后"></el-option>
                            </el-select>
                            <span>
                              <el-input
                                class="time-dot-input"
                                v-model="childItem.value"
                                @blur="checkNum(childItem.value)"
                              ></el-input>天
                            </span>
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
                            <span>
                              <el-input
                                class="time-dot-input"
                                style="width: 60px"
                                v-model="childItem.startDay"
                                @blur="checkNumMostFour(childItem.startDay)"
                              ></el-input>天~
                            </span>
                            <span>
                              <el-input
                                class="time-dot-input"
                                style="width: 106px"
                                v-model="childItem.endDay"
                                @blur="bigNum(childItem)"
                              ></el-input>天
                            </span>
                          </template>
                        </span>
                        <template
                          v-else-if="(childItem.tagType==='string' || childItem.tagType === 'collect') && cache[childItem.tagId]">
                            <el-select
                                  v-if="childItem.tagType==='string' && childItem.operator === 'null'"
                                  v-model="childItem.value"
                                  :key="'null'"
                                  disabled
                            >
                            <el-option label="空" value="nil"></el-option>
                          </el-select>
                          <template v-else>
                          <el-select
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
                        </template>
                        <el-input-number
                          v-else-if="childItem.tagType==='number'"
                          :key="index+'input'"
                          v-model="childItem.value"
                          placeholder="请输入内容"
                        ></el-input-number>
                        <el-select
                                v-else
                                v-model="childItem.value"
                                :disabled="childItem.tagType==='string' && childItem.operator === 'null'"
                        >
                          <template v-if="childItem.tagType==='string' && childItem.operator === 'null'">
                            <el-option label="空" value="nil"></el-option>
                          </template>
                          <template v-else>
                              <el-option value="true" label="是"></el-option>
                              <el-option value="false" label="否"></el-option>
                          </template>
                        </el-select>
                      </span>
                      <span v-if="childItem.tagType === 'time'">
                        <el-button
                          :key="childItem.tagId + n"
                          @click="changeTimeWays(childItem)"
                          v-if="childItem.isDynamicTime !== 3"
                        >
                          <span v-if="childItem.isDynamicTime === 2">切换到具体时间点</span>
                          <span v-if="childItem.isDynamicTime === 1">切换至时间天数</span>
                        </el-button>
                        <el-button
                          v-if="childItem.isDynamicTime !== 3"
                          @click="childItem.isDynamicTime = 3 ;childItem.dateAreaType = 0;childItem.operator = 'between';childItem.value = childItem.startDay + '-' + childItem.endDay"
                        >切换至新方案</el-button>
                        <el-button
                          v-if="childItem.isDynamicTime === 3"
                          @click="childItem.isDynamicTime = 2 ;childItem.dynamicTimeType = 1;childItem.operator = '=';childItem.value = ''"
                        >切换至旧方案</el-button>
                      </span>
                      <template v-if="cache[childItem.tagId]">
                        <span
                          v-if="cache[childItem.tagId].select && (childItem.tagType === 'string' || childItem.tagType === 'collect')"
                        >
                          <el-button
                            :key="childItem.tagId + n"
                            @click="handleSelectMore(childItem)"
                          >点击选择更多</el-button>
                        </span>
                      </template>
                      <!--<el-dialog title="显示更多标签" :visible.sync="showMoreTags" class="showMoreTags">-->
                        <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
                          <!--<el-form-item label="标签名称">-->
                            <!--<el-input-->
                              <!--v-model="formInline.attrName"-->
                              <!--placeholder="标签名称"-->
                              <!--@keyup.enter.native="onSubmit"-->
                            <!--&gt;</el-input>-->
                          <!--</el-form-item>-->
                          <!--<el-form-item>-->
                            <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
                          <!--</el-form-item>-->
                        <!--</el-form>-->
                        <!--<div>-->
                          <!--<el-radio-group v-model="checkboxValue">-->
                            <!--<el-radio-->
                              <!--v-for="(tag,index) in tagList"-->
                              <!--:label="tag.attrValue"-->
                              <!--:key="tag.attrId+index"-->
                            <!--&gt;{{tag.attrName}}</el-radio>-->
                          <!--</el-radio-group>-->
                        <!--</div>-->
                        <!--<el-pagination-->
                          <!--small-->
                          <!--class="pagination"-->
                          <!--layout="prev,pager,next"-->
                          <!--:total="tagsListTotal"-->
                          <!--:page-size="initPageSize"-->
                          <!--:current-page="initCurrentPage"-->
                          <!--@current-change="handleCurrentChange"-->
                          <!--@prev-click="handleCurrentChange"-->
                          <!--@next-click="handleCurrentChange"-->
                        <!--&gt;</el-pagination>-->
                        <!--<span slot="footer" class="dialog-footer">-->
                          <!--<el-button @click="showMoreTags = false">取 消</el-button>-->
                          <!--<el-button type="primary" @click="handleCheckboxOk">确 定</el-button>-->
                        <!--</span>-->
                      <!--</el-dialog>-->
                      <span class="i" @click="handleRemoveRule(crowd, item, childItem)">
                        <i class="icon iconfont el-icon-cc-delete"></i>
                      </span>
                      <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 3">
                        <el-tooltip class="item" effect="dark" placement="top-start">
                          <div slot="content">
                            状态：到期时间请选择“已过期”或“未过期”，其他请选“空”
                            <br />时间设置：30天以内：输入0～30天；30天以外：请输入30天～9999天
                          </div>
                          <el-button type="text">提示</el-button>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="label-add">
                      <div class="optional-condition">
                        <el-tag
                          class="oc-item"
                          v-for="tagItem in tags"
                          :key="tagItem.tagItem"
                          @click.native="handleAddChildRule(crowd, item, tagItem)"
                          :type="dataSourceColorEnum[tagItem.dataSource]"
                        >{{ tagItem.tagName }}</el-tag>
                      </div>
                    </div>
                  </div>
                  </div>
                </template>
                <div class="label-or">
                  <div
                    class="optional-condition"
                    v-if="tags.length"
                    :style="{'padding-top': crowd.rulesJson.rules.length > 0 ? '10px' : 0}"
                  >
                    <el-tag
                      class="oc-item"
                      v-for="(item) in tags"
                      :key="item.tagName"
                      @click.native="handleAddRule(crowd, item)"
                      :type="dataSourceColorEnum[item.dataSource]"
                    >{{ item.tagName }}</el-tag>
                  </div>
                </div>
              </div>
            </el-form-item>
            <div class="outer-and" v-if="specialTags.length > 0">
              <el-button
                      type="danger"
                      v-if="(specialTags.length > 0 && tags.length > 0) && crowd.dynamicPolicyJson"
                      @click="handleConditionChange(crowd)"
                      round
                      :key="i+'condition'"
              >{{crowd.dynamicPolicyJson.link === 'OR' ? '或' : '且'}}</el-button>
            </div>
            <el-form-item label="动态因子" v-if="specialTags.length > 0">
              <div class="label-container">
                  <div
                          v-show="crowd.dynamicPolicyJson.rules.length > 1"
                          class="label-or-space"
                          :key="i+'_or'"
                  >
                    <el-button
                            type="success"
                            round
                            :key="'button3'+'_'+i"
                            @click="handleRulesConditionChange(crowd.dynamicPolicyJson)"
                    >
                      {{crowd.dynamicPolicyJson.condition === 'AND' ? '且' : '或'}}
                    </el-button>
                  </div>
                <template v-for="(item, index) in crowd.dynamicPolicyJson.rules">
                  <div class="label-ground" :key="index">
                    <div class="tag-condition--parent">
                      <div class="tag-condition" v-show="item.rules.length > 1">
                        <el-button
                                type="warning"
                                @click="handleRulesConditionChange(item)"
                                round
                                size="small"
                                :key="'button'+index+'_'+i"
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
                              v-if="childItem.tagType==='number'"
                              :key="index+'input'"
                              v-model="childItem.value"
                              placeholder="请输入内容"
                      ></el-input-number>
                      <el-select v-else v-model="childItem.value">
                        <el-option value="true" label="是"></el-option>
                        <el-option value="false" label="否"></el-option>
                      </el-select>
                    </span>
                      <span class="i" @click="handleRemoveSpecialRule(crowd, item, childItem)">
                      <i class="icon iconfont el-icon-cc-delete"></i>
                    </span>
                    </div>
                    <div class="label-add">
                      <div class="optional-condition">
                        <el-tag
                                class="oc-item"
                                v-for="tagItem in specialTags"
                                :key="tagItem.tagId+ '_' +tagItem.tagName"
                                @click.native="handleAddSpecialChildRule(crowd, item, tagItem)"
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
                          :style="{'padding-top': crowd.dynamicPolicyJson.rules.length > 0 ? '10px' : 0}"
                  >
                    <el-tag
                            class="oc-item"
                            v-for="(item) in specialTags"
                            :key="item.tagId+ '_' +item.tagName"
                            @click.native="handleAddSpecialRule(crowd, item)"
                            :type= "dataSourceColorEnum[item.dataSource]"
                    >{{ item.tagName }}</el-tag>
                  </div>
                </div>
              </div>
            </el-form-item>
            </div>
            <el-form-item label="是否限制投放数量" prop="limitLaunch">
              <el-radio-group v-model="crowd.limitLaunch">
                <el-radio  :label="false">否</el-radio>
                <el-radio  :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="投放数量" prop="limitLaunchCount" v-if="crowd.limitLaunch">
              <el-input-number size="medium" placeholder="不能大于10万" :max="100000" :min="1" v-model="crowd.limitLaunchCount"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" :prop="formProp('remark')">
              <el-input v-model="crowd.remark" placeholder="备注"></el-input>
            </el-form-item>
            <el-form-item label="优先级" :prop="formProp(i +'.crowdOrder')" :rules="rules.noEmpty">
              <el-input-number v-model="crowd.crowdOrder" @change="changeSeq(i)" :precision="0"></el-input-number>
            </el-form-item>
          </el-collapse-item>
          <a class="app-params__remove-param" @click="handleRemoveParam(i)">
            <i v-show="i > 0" class="icon iconfont el-icon-cc-delete"></i>
          </a>
        </div>
      </template>
      <br />
      <el-button type="primary" plain @click="handleAddParam">
        <i class="el-icon-plus"></i>&nbsp;添加
      </el-button>
    </el-form-item>
    <el-dialog
            title="显示更多标签"
            :visible.sync="showMoreTags"
            :append-to-body='true'
            :key="currentChildItem.tagId+ '_'+ Math.random()"
            class="showMoreTags"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标签名称">
          <el-input
                  v-model="formInline.attrName"
                  placeholder="标签名称"
                  @keyup.enter.native="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-radio-group v-model="checkboxValue">
          <el-radio
                  v-for="(tag,index) in tagList"
                  :label="tag.attrValue"
                  :key="tag.attrId+index"
          >{{tag.attrName}}</el-radio>
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
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
                          <el-button @click="showMoreTags = false">取 消</el-button>
                          <el-button type="primary" @click="handleCheckboxOk">确 定</el-button>
                        </span>
    </el-dialog>
  </el-collapse>
</template>

<script>
export default {
  data () {
    // function validateKV (rule, value, cb) {
    //   if (/[！￥……（）——【】：；“”‘’、《》，。？\s+]/.test(value)) {
    //     cb(new Error('请勿输入特殊或空白字符'))
    //   } else {
    //     cb()
    //   }
    // }
    return {
      tags: [],
      specialTags: [],
      cache: {},
      tagSelectMoreShow: false,
      showMoreTags: false,
      tagsListTotal: 0,
      formInline: {
        attrName: ''
      },
      tagList: [],
      checkboxValue: '',
      currentChildItem: '',
      suggestions: {},
      suggestionsNew: [],
      priority: '',
      initPageSize: 200,
      initCurrentPage: 1,
      activeName: 0,
      inputValue: [],
      rules: {
        noEmpty: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        limitLaunchCount: [
          { required: true, message: '请输入大于0小于10万的限制数量', trigger: 'blur' }
        ]
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      dataSourceColorEnum: {
          1: 'success',
          2: 'danger',
          3: '',
          5: 'warning',
          6: 'warningOrange'
      }
    }
  },
  props: ['value', 'propPrefix', 'recordId'],
  watch: {
    value: 'setInputValue'
  },
  methods: {
    changeTimeWays (childItem) {
      childItem.value = ''
      if (childItem.isDynamicTime) {
        childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2      }
      else {
        this.$set(childItem, 'isDynamicTime', 2)
      }
    },
    getDefaultOperator () {
      return "=";
    },
    onSubmit () {
      this.$service.getTagAttr({
        tagId: this.currentChildItem.tagId,
        pageSize: this.initPageSize,
        pageNum: 1,
        attrName: this.formInline.attrName
      }).then(data => {
        this.tagList = data.pageInfo.list
        this.tagsListTotal = data.pageInfo.total
      });
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
      this.$service.getTagAttr({ tagId: child.tagId, pageSize: this.initPageSize, pageNum: this.initCurrentPage }).then(data => {
        this.showMoreTags = true
        this.tagList = data.pageInfo.list
        this.tagsListTotal = data.pageInfo.total
      });
    },
    fetchTagSuggestions (tagId) {
      this.$service.getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum: 1 }).then(data => {
        this.$set(this.cache, tagId, {
          select: data.select,
          list: data.pageInfo.list
        })
      })
    },
    handleCurrentChange (index) {
      this.initCurrentPage = index
      this.$service.getTagAttr({ tagId: this.currentChildItem.tagId, pageSize: this.initPageSize, pageNum: index }).then(data => {
        this.tagList = data.pageInfo.list
      });
    },
    handleRemoveRule (crowd, rule, childRule) {
      const rulesJson = crowd.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      const tagIds = []
      crowd.rulesJson.rules.forEach((e) => {
        e.rules.forEach((n) => {
          if (!tagIds.includes(n.tagId)) {
            tagIds.push(n.tagId)
          }
        })
      })
      crowd.tagIds = tagIds
      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },
      handleRemoveSpecialRule (crowd, rule, childRule) {
          const rulesJson = crowd.dynamicPolicyJson
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
    handleAddRule (crowd, tag) {
      if (crowd.rulesJson.rules.length > 50) {
        this.$message({
          type: 'error',
          message: '已达最大数量'
        })
        return
      }
      if (!crowd.tagIds.includes(tag.tagId)) {
        crowd.tagIds.push(tag.tagId)
      }
      if (tag.tagType === 'string' || tag.tagType === 'collect') {
        if (this.cache[tag.tagId] === undefined) { this.fetchTagSuggestions(tag.tagId) }
      }
      crowd.rulesJson.rules.push({
        condition: "AND",
        rules: [
          {
            operator: tag.tagType === 'time' ? 'between' : this.getDefaultOperator("="),
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
            startDay: tag.tagType === 'time' ? (tag.startDay ? tag.startDay : '') : undefined,
            endDay: tag.tagType === 'time' ? (tag.endDay ? tag.endDay : '') : undefined
          }
        ]
      })
    },
    handleAddChildRule (crowd, rule, tag) {
      if (rule.rules.length > 50) {
        this.$message({
          type: 'error',
          message: '已达最大数量'
        })
        return
      }
      if (tag.tagType === 'string' || tag.tagType === 'collect') {
        if (this.cache[tag.tagId] === undefined) { this.fetchTagSuggestions(tag.tagId) }
      }
      if (!crowd.tagIds.includes(tag.tagId)) {
        crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        operator: tag.tagType === 'time' ? 'between' : this.getDefaultOperator("="),
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
        startDay: tag.tagType === 'time' ? (tag.startDay ? tag.startDay : '') : undefined,
        endDay: tag.tagType === 'time' ? (tag.endDay ? tag.endDay : '') : undefined
      })
    },
      handleAddSpecialRule (crowd, tag) {
          if (crowd.dynamicPolicyJson.rules.length > 50) {
              this.$message.warning("已达最大数量")
              return
          }
          crowd.dynamicPolicyJson.rules.push({
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
                      }
                  }
              ]
          })
      },
      handleAddSpecialChildRule(crowd, rule, tag) {
          if (rule.rules.length > 50) {
              this.$message.warning("已达最大数量")
              return;
          }
          // if(tag.tagType==='string' || tag.tagType === 'collect'){
          //     if(this.cache[tag.tagId] === undefined) {this.fetchTagSuggestions(tag.tagId)}
          // }
          if (!crowd.tagIds.includes(tag.tagId)) {
              crowd.tagIds.push(tag.tagId)
          }
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
              }
          })
          console.log('crowd====', crowd)
      },
    changeSeq () {
      this.inputValue.sort(function (x, y) {
        return x.crowdOrder - y.crowdOrder
      })
      this.setSeq()
    },
    formProp (key) {
      return (this.propPrefix || '') + key
    },
    setInputValue (val) {
      if (val !== this.inputValue) {
          if (val.length > 0) {
              this.inputValue = val
              this.setSeq()
          }else {
              if (this.inputValue.length > 0) {
                  return
              }
              this.inputValue.push(
                  {
                      'recordId': this.getRecordId(),
                      'tempCrowdId': undefined,
                      'crowdName': undefined,
                      'tagIds': [],
                      'purpose': undefined,
                      'remark': undefined,
                      'crowdOrder': length + 1,
                      'rulesJson': {
                          condition: 'OR',
                          rules: []
                      },
                      'dynamicPolicyJson': {
                          link: 'AND',
                          condition: 'AND',
                          rules: []
                      },
                      'limitLaunch': false,
                      'limitLaunchCount': undefined,
                      total0: undefined
                  }
              )
              this.setSeq()
          }
      }
      console.log('this.inputValue', this.inputValue)
    },
    emitInputValue () {
      this.$emit('input', this.inputValue)
    },
    handleAddParam () {
      const length = this.inputValue.length
      this.activeName = length
      if (length >= 5) {
        this.$message({
          type: 'error',
          message: '最多添加5个'
        })
        return
      }
      this.inputValue.push(
        {
          'recordId': this.getRecordId(),
          'tempCrowdId': undefined,
          'crowdName': undefined,
          'tagIds': [],
          'purpose': undefined,
          'remark': undefined,
          'crowdOrder': length + 1,
          'rulesJson': {
            condition: 'OR',
            rules: []
          },
          'dynamicPolicyJson': {
              link: 'AND',
              condition: 'OR',
              rules: []
          },
          'limitLaunch': false,
          'limitLaunchCount': undefined,
          total0: undefined
        }
      )
      this.setSeq()
    },
    getRecordId () {
      return this.recordId
    },
    setSeq () {
      let inputValue = JSON.parse(JSON.stringify(this.inputValue))
      this.inputValue = inputValue.map((e, index) => {
        e.crowdOrder = index + 1
        // if (e.dynamicPolicyJson) {
        //     e.dynamicPolicyJson = {
        //         condition: 'OR',
        //         rules: []
        //     }
        // }
        return e
      })
    },
    handleRemoveParam (index) {
      this.inputValue.splice(index, 1)
      this.setSeq()
    },
    checkNum (num) {
        if((/(^\d+$)/).test(num)) {
            return true
        }else {
            this.$message.error('该值为必填项，且必须是大于等于0整数')
            return false
        }
    },
    checkNumMostFour (num) {
        const numInt = parseInt(num)
        if((/(^\d+$)/).test(num) && numInt <= 9999) {
            return true
        }else {
            this.$message.error('该值为必填项，且必须是大于等于0整数且不能超过4位数')
            return false
        }
    },
    bigNum (item) {
      const startDay = item.startDay
      const endDay = item.endDay
      if (this.checkNumMostFour(endDay)) {
        if (parseInt(startDay) >= parseInt(endDay)) {
          this.$message.error('第二个值必须大于第一个值')
        } else {
          item.value = startDay + '-' + endDay
        }
      } else { item.value = '' }
    },
    handleEstimate(formData) {
        this.$service.estimateTemp(formData.rulesJson).then((data)=> {
            if (data || data === 0) {
                this.$set(formData,'total0',data)
            }
        })
    },
    handleOperatorChange (item) {
        if(item.tagType === 'string' && item.operator === 'null') {
            item.value = 'nil'
        } else {
            item.value = ''
        }
    },
    handleConditionChange (crowd) {
        crowd.dynamicPolicyJson.link = crowd.dynamicPolicyJson.link === 'AND' ? 'OR' : 'AND'
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
      console.log(item.condition)
    }
  },
  created () {
    console.log('this.value', this.value)
    if (this.value) {
        this.$service.tagInfoNew(this.recordId).then(data => {
            // this.tags = data
            console.log(data)
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
            // if (specialTags.length > 0) {
            //     this.value.forEach((e) => {
            //         if (e.dynamicPolicyJson) {
            //             console.log('每一天爱啥啥看几点')
            //             e.dynamicPolicyJson = {
            //                 condition: 'OR',
            //                 rules: []
            //             }
            //             // this.$set(e,'dynamicPolicyJson.condition','OR')
            //             // this.$set(e,'dynamicPolicyJson.rules',[])
            //         }
            //     })
            // }
            // console.log('value2', this.value)
            this.setInputValue(this.value)
        })
    }
    this.$watch('inputValue', this.emitInputValue, {
      deep: true
    })
  }
}
</script>
<style scoped  lang="stylus">
.el-collapse_item >>> .el-collapse-item__header
  padding-left 10px
  background-color rgba(249, 249, 249, 0.85)
.el-collapse_item >>> .el-collapse-item
  display inline-block
  width 100%
  margin-right 10px
.el-icon-remove-outline
  width 20px
  height 20px
.app-params__remove-param
  display inline-block
  cursor pointer
  // border 1px solid #999
  // border-radius 13px
  width 26px
  height 26px
  line-height 26px
  text-align center
  color #999
  margin-left 5px
.items
  display flex
  align-items center
  >>> .el-form-item
    margin-bottom 20px
  >>>.el-collapse-item__wrap
    background-color rgba(249, 249, 249, 0.85)
    padding 10px
    border none
.el-collapse
  border-top none
  border-bottom none
.multipleSelect
  >>>.el-select
    width 100%
.add
  border 1px solid #ebeef5
  padding 20px
  border-radius 4px
.title
  font-size 18px
  margin-bottom 30px
.footer
  display flex
  justify-content flex-end
.label-ground
  border 1px dashed #ccc
  padding 10px
  margin 10px 0
.label-item
  display flex
  position relative
.paddingTop
  padding-top 50px
.label-item .and
  position absolute
  top 5px
  left 260px
  width 40px
  height 40px
.label-item .txt, .label-item .sel
  width 150px
.label-item .txt
  text-align right
.label-item .in
  width 250px
.label-item span, .oc-item
  margin-right 10px
.label-add
  margin-top 10px
.label-add >>> span
  cursor pointer
.label-or >>> span
  cursor pointer
i
  cursor pointer
.label-item .time-dot-select
  width 120px
.label-item .time-dot-input
  display inline-block
  width 80px
  margin 0 7px
.el-date-editor.el-input, .el-date-editor.el-input__inner
  width 100%
.pagination
  float right
.showMoreTags >>> .el-radio
  margin 5px
.label-item .time-dot-select-new
  width 90px
.items >>> .collapse-title
  width 50%
  display flex
  justify-content space-between
.items >>> .count-tips
  color red
  font-size 12px
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
.el-collapse
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
.tag-condition--parent
  position relative
  z-index 1
.tag-condition
  position absolute
  top 10px
  right 0
  bottom 3px
  left 0
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
</style>
