<template>
    <div>
        <div>重定向新增</div>
        <div>{{$route.query}}</div>
        <div>
            <el-form :model="form" label-width="100px">
                <el-form-item label="人群名称" prop="crowdName">
                    <el-input v-model="form.crowdName"></el-input>
                </el-form-item>
                <el-form-item label="父人群" prop="pCrowdName">
                    <el-select v-model="form.pCrowdName">
                        <el-option
                                v-for="item in parentCrowd"
                                :key="item.value+'_'+item.label"
                                :label="item.label+'(id:'+item.value+')'"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置人群条件">
                    <div v-for="(item, index) in rulesJson.rules" :key="index+'rules'" class="label-content">
                        <div v-show="index > 0" class="label-or-space" :key="index+'or'">或者</div>
                        <div class="label-ground" :key="index+'business'">
                            <div class="header-name-operate">
                                <div>父人群中活跃用户在业务</div>
                                <div class="poniter">
                                    <span class="i" @click="handleAddRuleToBusiness(item,index)">
                                        <i class="icon iconfont el-icon-cc-plus"></i>添加
                                    </span>
                                </div>
                            </div>
                            <div
                                    v-for="(childItem,n) in item.rules.business"
                                    :key="index+'tagId'+n"
                                    :class="{'label-item':true,'paddingTop':n>0}"
                            >
                                <span class="txt">{{ childItem.categoryName }}</span>
                                <span class="sel">
                                  <el-select
                                          style="width: 90px"
                                          name="oxve"
                                          v-model="childItem.operator"
                                          class="input-inline"
                                  >
                                      <el-option value="=" label="等于"></el-option>
                                      <el-option value="!=" label="不等于"></el-option>
                                  </el-select>
                                </span>
                                <span class="sel">
                                  <el-select
                                          class="time-dot-select-new" :key="index+'_'+n+'business'" v-model="childItem.value">
                                          <el-option v-for="(parentBusinessItem,index) in business" :key="index+'business'" :value=parentBusinessItem.value :label=parentBusinessItem.label></el-option>
                                  </el-select>
                                </span>
                                <span class="i" @click="handleRemoveBusinessRule(item, childItem)">
                                    <i class="icon iconfont el-icon-cc-delete"></i>
                                </span>
                            </div>
                        </div>
                        <div class="label-ground" :key="index+'behavior'">
                            <div class="header-name-operate">
                                <div>父人群用户行为满足</div>
                                <div class="poniter">
                                    <span class="i" @click="handleAddRuleToBehavior(item,index)">
                                        <i class="icon iconfont el-icon-cc-plus"></i>添加
                                    </span>
                                </div>
                            </div>
                            <div
                                    v-for="(childItem,n) in item.rules.behavior"
                                    :key="index+'tagId'+n"
                                    :class="{'label-item':true,'paddingTop':n>0}"
                            >
                                <span class="txt">{{ childItem.categoryName }}</span>
                                <span class="sel">
                                  <el-select
                                          style="width: 90px"
                                          name="oxve"
                                          v-model="childItem.operator"
                                          class="input-inline"
                                  >
                                      <el-option value="=" label="做过"></el-option>
                                      <el-option value="!=" label="未做过"></el-option>
                                  </el-select>
                                </span>
                                <span class="sel">
                                  <el-select
                                          class="time-dot-select-new" :key="index+'_'+n+'behavior'" v-model="childItem.value">
                                          <el-option v-for="(parentBehaviorItem,index) in behavior" :key="index+'behaviorItem'" :value=parentBehaviorItem.value :label=parentBehaviorItem.label></el-option>
                                  </el-select>
                                </span>
                                <span class="i" @click="handleRemoveBehaviorRule(item, childItem)">
                                    <i class="icon iconfont el-icon-cc-delete"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="label-or">
                        <div
                                class="optional-condition"
                                v-if="tagsList.length"
                                :style="{'padding-top': rulesJson.rules.length > 0 ? '10px' : 0}"
                        >
                              <span
                                      v-show="rulesJson.rules.length"
                                      class="label-and-txt"
                                      style="display: inline"
                              >或者&nbsp;</span>
                                <el-tag
                                        class="oc-item el-tags-list"
                                        v-for="(item) in tagsList"
                                        :key="item.tagId+ '_' +item.tagName"
                                        @click.native="handleAddRule(item)"
                                        :type= "item.tagType === 2 ? 'danger' : (item.tagType === 1 ? 'success' : '')"
                                >{{ item.tagName }}</el-tag>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="人群有效期" prop="validPeriod">
                    <el-date-picker
                            v-model="form.validPeriod"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            :picker-options="pickerOptions"
                            :default-time="['00:00:00', '23:59:59']"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button>返回</el-button>
                    <el-button>创建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Add",
        data () {
            return {
                form: {
                    crowdName: '',
                    pCrowdName: '',
                    conditions: undefined,
                    validPeriod: undefined
                },
                business: [],
                behavior: [],
                parentCrowd: [],
                tagsList: [{tagName: '父人群中活跃用户在业务',tagId: 1,tagType: 1},{tagName: '父人群用户行为满足',tagId: 2,tagType: 2}],
                rulesJson: { condition: "OR", rules: []},
                pickerOptions: {
                    disabledDate(time) {
                        // 设置可选时间为今天之后的60天内
                        const curDate = (new Date()).getTime()
                        // 算出一个月的毫秒数，这里使用30的平均值，实际应根据具体的每个月有多少天计算
                        const day = 60 * 24 * 3600 * 1000
                        const dateRange = curDate + day
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 || time.getTime() > dateRange
                    }
                }
            }
        },
        watch : {
            '$route.query.policyId': function (val) {
                if(val != undefined) {
                    this.fetchData()
                }
            }
        },
        methods : {
            fetchData () {
                const routeData = this.$route.query
                this.$service.getRedirectCrowdAdd(
                    {policyId: routeData.policyId, params: {crowdId: routeData.crowdId ? routeData.crowdId : undefined}})
                        .then(data => {
                            const [businessList,behaviorList,parentCrowdList] = [[],[],[]]
                            data.tags.forEach(item => {
                                if (item.tagName === "父人群中活跃用户在业务") {businessList.push({value: item.attrValue, label: item.attrName})}
                                else if(item.tagName === "父人群用户行为满足"){behaviorList.push({value: item.attrValue, label: item.attrName})}
                            })
                            this.business = businessList
                            this.behavior = behaviorList
                            if(data.crowds.length > 0) {
                                data.crowds.forEach(item => {
                                    parentCrowdList.push({value: item.crowdId, label: item.crowdName})
                                })
                            }
                            this.parentCrowd = parentCrowdList
                            this.form.pCrowdName = parentCrowdList[0].value
                        })
            },
            handleAddRule(tag) {
                if (this.rulesJson.rules.length > 50) {
                    this.$message.warning("已达最大数量")
                    return
                }
                this.rulesJson.rules.push({
                    rules: {
                        business: [{
                            operator: '=',
                            tagCode: tag.tagKey,
                            tagName: tag.tagName,
                            value: "movie",
                            tagId: tag.tagId,
                            tagType: tag.tagType,
                            categoryName: '活跃用户所在业务'
                        }],
                        behavior: [{
                            operator: '=',
                            tagCode: tag.tagKey,
                            tagName: tag.tagName,
                            value: "activityOrExpose",
                            tagId: tag.tagId,
                            tagType: tag.tagType,
                            categoryName: '在父人群上线的有效期内'
                        }]
                    }
                })
            },
            handleRemoveBusinessRule (rule, childRule) {
                const rulesJson = this.rulesJson
                rule.rules.business.splice(rule.rules.business.indexOf(childRule), 1)
                if (rule.rules.business.length === 0 && rule.rules.behavior.length === 0) {
                    rulesJson.rules = rulesJson.rules.filter(function(item) {
                        return item !== rule
                    })
                }
            },
            handleRemoveBehaviorRule (rule, childRule) {
                const rulesJson = this.rulesJson
                rule.rules.behavior.splice(rule.rules.behavior.indexOf(childRule), 1)
                if (rule.rules.behavior.length === 0 && rule.rules.business.length === 0) {
                    rulesJson.rules = rulesJson.rules.filter(function(item) {
                        return item !== rule
                    })
                }
            },
            handleAddRuleToBusiness (tag,index) {
                if (this.rulesJson.rules[index].rules.business.length > 50) {
                    this.$message.warning("已达最大数量")
                    return
                }
                this.rulesJson.rules[index].rules.business.push({
                    operator: '=',
                    tagCode: tag.tagKey,
                    tagName: tag.tagName,
                    value: 'movie',
                    tagId: tag.tagId,
                    tagType: tag.tagType,
                    categoryName: '活跃用户所在业务'
                })
            },
            handleAddRuleToBehavior (tag,index) {
                if (this.rulesJson.rules[index].rules.behavior.length > 50) {
                    this.$message.warning("已达最大数量")
                    return
                }
                this.rulesJson.rules[index].rules.behavior.push({
                            operator: '=',
                            tagCode: tag.tagKey,
                            tagName: tag.tagName,
                            dataSource: tag.dataSource,
                            value: 'activityOrExpose',
                            tagId: tag.tagId,
                            tagType: tag.tagType,
                            categoryName: '在父人群上线的有效期内'
                })
            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.el-tags-list
    margin-right 10px
.label-content
    border 2px dashed #ccc
    padding 10px
    border-radius 10px
    width 80%
.label-ground
    border: 1px dashed #ccc
    padding: 10px
.label-ground + .label-ground,.label-content + .label-content
    margin-top: 10px
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
    width: 160px
.label-item .txt
    text-align: right
.label-item .in
    width: 250px
.label-item span, .oc-item
    margin-right: 10px
.label-add
    margin-top: 10px
.label-add >>> span,.label-or >>> span, i, .el-tags-list, .poniter >>> span
    cursor: pointer
.header-name-operate
    display flex
    justify-content space-between
</style>
