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
        <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
          <el-form-item label="人群名称" prop="crowdName">
            <el-input size="small" v-model="form.name" placeholder="投放名称"></el-input>
          </el-form-item>
          <el-form-item label="设置标签" class="multipleSelect" prop="tagIds">
            <div class="label-container">
              <template v-for="(item, index) in rulesJson.rules">
                <div v-show="index > 0" class="label-or-space" :key="index+'or'">或者</div>
                <div class="label-ground" :key="index">
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
                      >
                        <template
                          v-if="childItem.tagType === 'number' || childItem.tagType === 'time'"
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
                        </template>
                        <template v-if="childItem.tagType === 'boolean'">
                          <el-option value="=" label="="></el-option>
                        </template>
                        <template v-if="childItem.tagType === 'collect'">
                          <el-option value="=" label="是"></el-option>
                          <el-option value="!=" label="不是"></el-option>
                        </template>
                      </el-select>
                    </span>
                    <span class="in">
                      <span v-if="childItem.tagType === 'time'">
                        <template v-if="childItem.isDynamicTime === 2">
                          <el-select class="time-dot-select" :key="n+'timeKey'" v-model="childItem.dynamicTimeType">
                              <el-option value='1' label="在当日之前"></el-option>
                              <el-option value='2' label="在当日之后"></el-option>
                          </el-select>
                          <span><el-input aria-placeholder="请输入天数" class="time-dot-input" v-model="childItem.value"></el-input>天</span>
                        </template>
                        <template v-else>
                          <el-date-picker
                                  v-model="childItem.value"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  :key="index+'key'"
                          ></el-date-picker>
                        </template>
                    </span>
                      <el-select
                              v-else-if="childItem.tagType==='string' || childItem.tagType === 'collect'"
                              v-model="childItem.value"
                              class="inline-input"
                              filterable
                              :key="index+'select'"
                              default-first-option
                              placeholder="请输入或选择"
                              :disabled="childItem.select"
                      >
                        <el-option
                                v-for="item in childItem.list"
                                :key="index+item.attrValue"
                                :label="item.attrName"
                                :value="item.attrValue"
                        ></el-option>
                      </el-select>
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
                      <el-button :key="childItem.tagId + n" @click="changeTimeWays(childItem)">
                        <span v-if="childItem.isDynamicTime === 2">切换到具体时间点</span>
                        <span v-else>切换至时间天数</span>
                      </el-button>
                    </span>
                    <span v-if="childItem.select && (childItem.tagType === 'string' || childItem.tagType === 'collect')">
                      <el-button :key="childItem.tagId + n" @click="handleSelectMore(childItem)">
                        点击选择更多
                      </el-button>
                    </span>
                    <el-dialog title="显示更多标签" :visible.sync="showMoreTags" class="showMoreTags">
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
                    <span class="i" @click="handleRemoveRule(item, childItem)">
                      <i class="icon iconfont el-icon-cc-delete"></i>
                    </span>
                    <el-button type="success" v-if="n>0" round class="and">且</el-button>
                  </div>
                  <div class="label-add">
                    <div class="optional-condition">
                      <el-tag
                              class="oc-item"
                              v-for="tagItem in tags"
                              :key="tagItem.tagItem"
                              @click.native="handleAddChildRule(item, tagItem)"
                              :type= "tagItem.dataSource === 2 ? 'danger' : (tagItem.dataSource === 1 ? 'success' : '')"
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
                  <span
                          v-show="rulesJson.rules.length"
                          class="label-and-txt"
                          style="display: inline"
                  >或者&nbsp;</span>
                  <el-tag
                          class="oc-item"
                          v-for="(item) in tags"
                          :key="item.tagName"
                          @click.native="handleAddRule(item)"
                          :type= "item.dataSource === 2 ? 'danger' : (item.dataSource === 1 ? 'success' : '')"
                  >{{ item.tagName }}</el-tag>
                </div>
              </div>
            </div>
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
  </div>
</template>
<script>
    export default {
        data() {
            return {
                //attrs: [[${attrs}]] || {},
                tags: [],
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
                suggestions: {},
                suggestionsNew: [],
                priority: "",
                form: {
                    name: "",
                    policyId: null,
                    remark: ""
                },
                formRules: {
                    name: [{ required: true, message: "请填写人群名称", trigger: "blur" }]
                }
            };
        },
        props: ["policyId", "crowdId"],
        methods: {
            changeTimeWays(childItem) {
                childItem.value = ''
                if(childItem.isDynamicTime) {
                    childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2 }
                else {
                    this.$set(childItem,'isDynamicTime',2)
                }
            },
            handleRemoveRule(rule, childRule) {
                const rulesJson = this.rulesJson;
                rule.rules.splice(rule.rules.indexOf(childRule), 1);
                if (rule.rules.length === 0) {
                    rulesJson.rules = rulesJson.rules.filter(function(item) {
                        return item !== rule;
                    });
                }
            },
            /*添加一级标签 */
            /**
             * tag 为标签
             */
            handleAddRule(tag) {
                if (this.rulesJson.rules.length > 50) {
                    layer.msg("已达最大数量");
                    return;
                }
                if(tag.tagType==='string' || tag.tagType === 'collect'){
                    this.$service.getTagAttr({ tagId: tag.tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                        // this.tagSelectMoreShow = data.select
                        // this.$set(tag,'select',data.select)
                        // this.suggestionsNew = data.pageInfo.list
                        this.rulesJson.rules.push({
                            condition: "AND",
                            rules: [
                                {
                                    operator: this.getDefaultOperator("="),
                                    tagCode: tag.tagKey,
                                    tagName: tag.tagName,
                                    dataSource: tag.dataSource,
                                    value: "",
                                    tagId: tag.tagId,
                                    tagType: tag.tagType,
                                    categoryName: tag.tagName,
                                    categoryCode: tag.tagKey,
                                    dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                                    isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                                    thirdPartyCode: tag.thirdPartyCode,
                                    thirdPartyField: tag.thirdPartyField,
                                    select: data.select,
                                    list: data.pageInfo.list
                                }
                            ]
                        });
                    });
                }else {
                    this.rulesJson.rules.push({
                        condition: "AND",
                        rules: [
                            {
                                operator: this.getDefaultOperator("="),
                                tagCode: tag.tagKey,
                                tagName: tag.tagName,
                                dataSource: tag.dataSource,
                                value: "",
                                tagId: tag.tagId,
                                tagType: tag.tagType,
                                categoryName: tag.tagName,
                                categoryCode: tag.tagKey,
                                dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                                isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                                thirdPartyCode: tag.thirdPartyCode,
                                thirdPartyField: tag.thirdPartyField
                            }
                        ]
                    });
                }
            },
            handleAddChildRule(rule, tag) {
                if (rule.rules.length > 50) {
                    layer.msg("已达最大数量");
                    return;
                }
                if(tag.tagType==='string' || tag.tagType === 'collect'){
                    this.$service.getTagAttr({ tagId: tag.tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                        // this.tagSelectMoreShow = data.select
                        // this.$set(tag,'select',data.select)
                        // this.suggestionsNew = data.pageInfo.list
                        rule.rules.push({
                             operator: this.getDefaultOperator("="),
                             tagCode: tag.tagKey,
                             tagName: tag.tagName,
                             dataSource: tag.dataSource,
                             value: "",
                             tagId: tag.tagId,
                             tagType: tag.tagType,
                             categoryName: tag.tagName,
                             categoryCode: tag.tagKey,
                             dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                             isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                             thirdPartyCode: tag.thirdPartyCode,
                             thirdPartyField: tag.thirdPartyField,
                             select: data.select,
                             list: data.pageInfo.list
                        });
                    });
                }else {
                    rule.rules.push({
                        operator: this.getDefaultOperator(tag),
                        tagCode: tag.tagKey,
                        tagName: tag.tagName,
                        dataSource: tag.dataSource,
                        value: "",
                        tagId: tag.tagId,
                        tagType: tag.tagType,
                        categoryName: tag.tagName,
                        categoryCode: tag.tagKey,
                        dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                        isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                        thirdPartyCode: tag.thirdPartyCode,
                        thirdPartyField: tag.thirdPartyField
                    });
                }
                // rule.rules.push({
                //     operator: this.getDefaultOperator(tag),
                //     tagCode: tag.tagKey,
                //     tagName: tag.tagName,
                //     dataSource: tag.dataSource,
                //     value: "",
                //     tagId: tag.tagId,
                //     tagType: tag.tagType,
                //     categoryName: tag.tagName,
                //     categoryCode: tag.tagKey,
                //     dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                //     isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                //     thirdPartyCode: tag.thirdPartyCode,
                //     thirdPartyField: tag.thirdPartyField
                // });
            },
            fetchTagSuggestions(tag) {
                // const tagType = tag.tagType;
                const tagId = tag.tagId;
                this.$service.getTagAttr({ tagId: tag.tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                    this.tagSelectMoreShow = data.select
                    this.$set(tag,'select',data.select)
                    this.suggestionsNew = data.pageInfo.list
                });
                // if (!this.suggestions[tagId]&&tag.select != true) {
                //     const self = this
                //     self.$set(self.suggestions, tagId, []);
                //     console.log('111')
                //     console.log(self.suggestions)
                //     this.$service.getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                //         this.tagSelectMoreShow = data.select
                //         this.$set(tag,'select',data.select)
                //         this.tagList = data.pageInfo.list
                //         if(!data.select){
                //             self.$set(self.suggestions, tagId, data.pageInfo.list)
                //             console.log('222')
                //             console.log(self.suggestions)
                //         }
                //     });
                // }
            },
            handleCheckboxOk(){
                this.currentChildItem.value = this.checkboxValue
                this.showMoreTags = false
            },
            handleSelectMore (child) {
                this.checkboxValue = ''
                this.formInline.attrName = ''
                this.currentChildItem = child
                this.showMoreTags = true
                this.$service.getTagAttr({ tagId: child.tagId, pageSize: this.initPageSize, pageNum:this.initCurrentPage}).then(data => {
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
            // handleSelectTag(rule, tagCode) {
            //   const suggestions = this.suggestions[rule.tagId];
            //   const tag = suggestions.find(function(item) {
            //     return item.attrValue === tagCode;
            //   });
            //   rule.tagCode = tag.attrValue;
            //   rule.value = tag.attrValue; //谭文亮要求添加测试
            //   rule.tagName = tag.attrName;
            //   rule.dataSource = tag.dataSource;
            // },
            getDefaultOperator(tag) {
                return "=";
            },
            getDefaultValue(tag) {},
            handleInputValue(rule, value) {
                rule.tagCode = value;
            },
            handleSave() {
                const form = this.form;
                const tagIds = [];
                this.rulesJson.rules.forEach(function(item) {
                    item.rules.forEach(function(childItem) {
                        if (tagIds.indexOf(childItem.tagId) === -1) {
                            tagIds.push(childItem.tagId);
                        }
                    });
                });
                var data = {
                    crowdName: form.name,
                    tagIds: tagIds.join(","),
                    rulesJson: JSON.stringify(this.rulesJson),
                    remark: form.remark,
                    policyId: form.policyId
                };
                if (this.crowdId != null) {
                    data.crowdId = this.crowdId;
                    data.priority = this.priority;
                    this.$service.crowdUpdate(data, "编辑成功").then(() => {
                        this.$emit("goBackCrowdListPage", true);
                    });
                } else {
                    this.$service.crowdSave(data, "新增成功").then(() => {
                        this.$emit("goBackCrowdListPage", true);
                    });
                }
            },
            // 取消
            cancelAdd: function() {
                this.$emit("goBackCrowdListPage");
            }
        },
        created() {
            this.form.policyId = this.policyId;
            this.$service
                .getTagsByPoliceId({ policyId: this.form.policyId })
                .then(data => {
                    this.tags = data;
                });
            if (this.crowdId != null)
            //编辑
                this.$service.crowdEdit({ crowdId: this.crowdId }).then(data => {
                    this.form.name = data.policyCrowds.crowdName;
                    this.form.remark = data.policyCrowds.remark;
                    this.priority = data.policyCrowds.priority;
                    this.rulesJson = JSON.parse(data.policyCrowds.rulesJson);
                });
        }
    };
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
    border: 1px dashed #ccc
    padding: 10px
  .label-item
    display: flex
    position: relative
  .paddingTop
    padding-top: 50px
  .label-item .and
    position: absolute
    top: 5px
    left: 260px
    width: 40px
    height: 40px
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
</style>


