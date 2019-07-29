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
                          <span><el-input class="time-dot-input" style="width: 60px" v-model="childItem.startDay" @blur="checkNum(childItem.startDay)"></el-input>天~</span>
                          <span><el-input class="time-dot-input" style="width: 106px" v-model="childItem.endDay" @blur="bigNum(childItem)"></el-input>天</span>
                        </template>
                    </span>
                     <template v-else-if="(childItem.tagType==='string' || childItem.tagType === 'collect') && cache[childItem.tagId]">
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
                          <el-button :key="childItem.tagId + n" @click="handleSelectMore(childItem)">
                            点击选择更多
                          </el-button>
                        </span>
                    </template>
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
                    <span v-if="childItem.tagType === 'time' && childItem.isDynamicTime === 3">
                      <el-tooltip class="item" effect="dark"
                                  placement="top-start"
                      >
                        <div slot="content">
                          状态：到期时间请选择“已过期”或“未过期”，其他请选“空”<br/>
                          时间设置：30天以内：输入0～30天；30天以外：请输入30天～99999999天
                        </div>
                        <el-button type="text">提示</el-button>
                    </el-tooltip>
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
                cache: {},
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
                    layer.msg("已达最大数量")
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
                            endDay: tag.tagType==='time' ? (tag.endDay ? tag.endDay : ''): undefined
                        }
                    ]
                })
            },
            handleAddChildRule(rule, tag) {
                if (rule.rules.length > 50) {
                    layer.msg("已达最大数量")
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
                                  endDay: tag.tagType==='time' ? (tag.endDay ? tag.endDay : ''): undefined
                                })
                // if(tag.tagType==='string' || tag.tagType === 'collect'){
                //     this.$service.getTagAttr({ tagId: tag.tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                //         // this.tagSelectMoreShow = data.select
                //         // this.$set(tag,'select',data.select)
                //         // this.suggestionsNew = data.pageInfo.list
                //         rule.rules.push({
                //              operator: this.getDefaultOperator("="),
                //              tagCode: tag.tagKey,
                //              tagName: tag.tagName,
                //              dataSource: tag.dataSource,
                //              value: "",
                //              tagId: tag.tagId,
                //              tagType: tag.tagType,
                //              categoryName: tag.tagName,
                //              categoryCode: tag.tagKey,
                //              dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                //              isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                //              thirdPartyCode: tag.thirdPartyCode,
                //              thirdPartyField: tag.thirdPartyField,
                //              select: data.select
                //         })
                //         if(this.cache[tag.tagId] === undefined) {
                //             this.$set(this.cache, tag.tagId, {
                //                 list: data.pageInfo.list
                //             })
                //         }
                //     })
                // }else {
                //     rule.rules.push({
                //         operator: this.getDefaultOperator(tag),
                //         tagCode: tag.tagKey,
                //         tagName: tag.tagName,
                //         dataSource: tag.dataSource,
                //         value: "",
                //         tagId: tag.tagId,
                //         tagType: tag.tagType,
                //         categoryName: tag.tagName,
                //         categoryCode: tag.tagKey,
                //         dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : '1',
                //         isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 2,
                //         thirdPartyCode: tag.thirdPartyCode,
                //         thirdPartyField: tag.thirdPartyField
                //     });
                // }
            },
            fetchTagSuggestions(tagId) {
                this.$service.getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum:1}).then(data => {
                    this.$set(this.cache, tagId, {
                        select: data.select,
                        list: data.pageInfo.list
                    })
                })
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
            getDefaultOperator(tag) {
                return "=";
            },
            handleSave() {
                const form = this.form
                const tagIds = []
                const rules = this.rulesJson.rules
                const ruleLength = rules.length
                let i, j = 0
                // 判断是否有未填写的项
                for (i=0; i<ruleLength; i++){
                    for (j=0; j< rules[i].rules.length; j++) {
                        let rulesItem = rules[i].rules[j]
                        if(rulesItem.value === ''){
                            this.$message.error('请正确填写第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的值！')
                            return
                        }else if(rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3){
                            if(this.checkNum(rulesItem.startDay) && this.checkNum(rulesItem.endDay)) {
                                if(rulesItem.startDay < rulesItem.endDay) { rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay }
                                else {
                                    this.$message.error('第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的天数值后面的值必须大于前面的')
                                    return
                                }
                            }else {
                                this.$message.error('第'+(i+1)+'设置标签块里面的第'+(j+1)+'行的值是大于等于0的正整数')
                                return
                            }
                        }
                    }
                }
                rules.forEach(function(item) {
                    item.rules.forEach(function(childItem) {
                        if (tagIds.indexOf(childItem.tagId) === -1) {
                            tagIds.push(childItem.tagId)
                        }
                        delete childItem.startDay
                        delete childItem.endDay
                    })
                })
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
            bigNum(item) {
                const startDay = item.startDay
                const endDay = item.endDay
                this.checkNum(endDay)
                if(this.checkNum(endDay)) {
                    if(startDay >= endDay) {
                        this.$message.error('第二个值必须大于第一个值')
                    }else {
                        item.value = startDay + '-' + endDay
                    }
                }else{ item.value = '' }
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
                    let policyData = data.policyCrowds
                    this.form.name = policyData.crowdName
                    this.form.remark = policyData.remark
                    this.priority = policyData.priority
                    let ruleJsonData = JSON.parse(policyData.rulesJson)
                    var cacheIds = []
                    ruleJsonData.rules = ruleJsonData.rules.map(itemParent => {
                        itemParent.rules.forEach(item => {
                            if(item.tagType === 'string' || item.tagType === 'collect') {
                                cacheIds.push(item.tagId)
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
  .label-item .time-dot-select-new
    width 90px
</style>


