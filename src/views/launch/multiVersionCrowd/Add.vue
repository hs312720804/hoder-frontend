<template>
    <div class="add">
        <el-row>
            <el-col :span="24">
                <div class="title">{{title}}</div>
            </el-col>
        </el-row>
        <!--新增编辑界面-->
        <!--新增自定义人群-->
        <div v-if="model == 1">
            <el-row :gutter="40" >
                <el-col :span="24">
                    <el-form :model="crowdDefineForm" :rules="crowdDefineFormRules" ref="crowdDefineForm" label-width="140px">
                        <el-form-item label="人群名称" prop="launchName">
                            <el-input size="small"
                                      v-model="crowdDefineForm.launchName"
                                      :disabled="status!==undefined && status!==1"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="SQL语句" prop="crowdSql">
                            <el-input type="textarea"
                                      placeholder="请输入生成临时人群的sql语句"
                                      :disabled="status!==undefined && status!==1"
                                      v-model="crowdDefineForm.crowdSql">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="投放平台" class="multipleSelect" prop="biIds">
                            <el-select v-model="crowdDefineForm.biIds" multiple placeholder="请选择投放平台">
                                <el-option
                                        v-for="(item,index) in launchPlatform"
                                        :key="index"
                                        :label="item.biName"
                                        :value="item.biId+''"
                                >
                                    <!-- {{item.biName}} -->
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据有效期" prop="expiryDay">
                            <el-select
                                    v-model="crowdDefineForm.expiryDay"
                                    :disabled="status!==undefined && status!==1"
                            >
                                <el-option
                                        v-for="(item,index) in effectTimeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否生成临时标签" prop="proTempTag">
                            <el-radio-group v-model="crowdDefineForm.proTempTag">
                                <el-radio :label="false">否</el-radio>
                                <el-radio :label="true">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="每天是否更新" prop="autoVersion">
                            <el-select
                                    v-model="crowdDefineForm.autoVersion"
                                    :disabled="status!==undefined && status!==1"
                            >
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdDefineForm.autoVersion === 1">
                            <el-time-picker
                                    v-model="crowdDefineForm.autoLaunchTime"
                                    value-format="HH:mm:ss"
                                    :disabled="status!==undefined && status!==1"
                            ></el-time-picker>
                        </el-form-item>
                        <el-form-item label="选择标签" prop="tagId" v-if="crowdDefineForm.proTempTag === true">
                            <el-select
                                    v-model="crowdDefineForm.tagId"
                                    filterable
                                    class="select-tag"
                            >
                                <el-option
                                    v-for="item in tagsList"
                                    :key="item.tagId"
                                    :label="item.tagName"
                                    :value="item.tagId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据类型" prop="calType">
                            <el-checkbox-group v-model="crowdDefineForm.calType" :disabled="status!==undefined && status!==1">
                                <el-checkbox v-for="(item,index) in estimateItems" :value="index" :label="index" :key="index" :disabled="index==0">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <!--<el-form-item label="人群划分份数" v-if="editLaunchCrowdId!=null && editLaunchCrowdId != undefined">-->
                            <!--<el-input disabled v-model="crowdDefineForm.launchCrowdId"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="各人群占比" v-if="editLaunchCrowdId!=null && editLaunchCrowdId != undefined">-->
                            <!--<div class="block" v-for="(item,index) in copiesItem">-->
                                <!--<span>人群_{{alphaData[index]}}<span class="show-percent">{{percent[index]}}%</span></span>-->
                                <!--<el-slider v-model="percent[index]" :key="item"></el-slider>-->
                            <!--</div>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="比例总和：" v-if="editLaunchCrowdId!=null && editLaunchCrowdId != undefined">{{percentTotal}}</el-form-item>-->
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="footer">
                <el-button @click="cancelAdd">返回</el-button>
                <el-button type="primary" @click="addSubmit">保存</el-button>
            </div>
        </div>
        <!--新增投放-->
        <div v-else>
            <el-form :model="crowdForm" :rules="crowdFormRules" ref="crowdForm" label-width="100px">
                <el-form-item label="投放名称" prop="launchName">
                    <el-input size="small"
                              v-model="crowdForm.launchName"
                              placeholder="投放名称"
                              :disabled="status!==undefined && status!==1"
                    ></el-input>
                </el-form-item>
                <el-form-item label="投放平台" class="multipleSelect" prop="biIds">
                    <el-select v-model="crowdForm.biIds" multiple placeholder="请选择投放平台">
                        <el-option
                                v-for="item in launchPlatform"
                                :key="item.biId+''"
                                :label="item.biName"
                                :value="item.biId+''"
                        >
                            <!-- {{item.biName}} -->
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据来源" prop="dataSource">
                    <input type="hidden" value="2" v-model="crowdForm.dataSource">
                    <el-input size="small" readonly value="大数据"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input size="small" v-model="crowdForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="是否做abTest">
                    <el-radio-group v-model="crowdForm.abTest">
                        <el-radio :label="false">否</el-radio>
                        <el-radio :label="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择策略" prop="policyIds" class="multipleSelect">
                    <el-select
                            filterable
                            v-model="crowdForm.policyIds"
                            :key="crowdForm.abTest"
                            :multiple="!crowdForm.abTest"
                            placeholder="请选择策略"
                            @change="getCrowd"
                            @remove-tag="removeTag"
                            :disabled="status!==undefined && status!==1"
                    >
                        <el-option
                                v-for="item in strategyPlatform"
                                :key="item.policyId+''"
                                :label="item.policyName"
                                :value="item.policyId+''"
                        >{{item.policyName}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择人群" prop="policyCrowdIds">
                    <div v-if="!crowdForm.abTest">
                        <el-form-item v-for="(v,index) in crowdData" :label="v.policyName" :key="v.policyId+'_'+index">
                            <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && status!==1">
                                <el-checkbox
                                        v-for="item in v.childs"
                                        :label="v.policyId+'_'+item.crowdId"
                                        :key="item.crowdId+''"
                                        :disabled="item.canLaunch === false"
                                >{{item.crowdName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item :label="pid">
                            <el-checkbox-group v-model="crowdForm.policyCrowdIds" :disabled="status!==undefined && status!==1">
                                <el-checkbox
                                        v-for="item in crowdData"
                                        :label="item.policyId+'_'+item.crowdId"
                                        :key="item.crowdId+''"
                                        :disabled="item.canLaunch === false"
                                >{{item.crowdName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="数据有效期" prop="expiryDay">
                    <el-select
                            v-model="crowdForm.expiryDay"
                            :disabled="status!==undefined && status!==1"
                    >
                        <el-option
                                v-for="(item,index) in effectTimeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="每天是否更新" prop="autoVersion">
                    <el-select
                            v-model="crowdForm.autoVersion"
                            :disabled="status!==undefined && status!==1"
                    >
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="每天更新时间点" prop="autoLaunchTime" v-if="crowdForm.autoVersion === 1">
                    <el-time-picker
                            v-model="crowdForm.autoLaunchTime"
                            value-format="HH:mm:ss"
                            :disabled="status!==undefined && status!==1"
                    ></el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="footer">
                <el-button @click="cancelAdd">返回</el-button>
                <el-button type="primary" @click="addSubmit">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import _ from "lodash"
    export default {
        data() {
            return {
                // 表格当前页数据
                strategyPlatform: [],
                launchPlatform: [],
                getStrategyCrowds: [],
                title: "",
                // 新增界面数据
                crowdForm: {
                    abTest: false,
                    launchCrowdId: "", //投放ID
                    launchName: "", //投放名称
                    biIds: "", //投放平台ID
                    remark: "",
                    //      dataSource: 2,
                    policyIds: [],
                    policyCrowdIds: [],
                    expiryDay: 7,
                    autoVersion: 0,
                    autoLaunchTime: undefined
                },
                // 新增自定义人群
                crowdDefineForm: {
                    launchCrowdId: undefined,
                    launchName: "", //投放名称
                    biIds: "", //投放平台ID
                    crowdSql: '',
                    expiryDay: 7,
                    autoVersion: 0,
                    calType: ['0'],
                    proTempTag: false,
                    autoLaunchTime: undefined,
                    tagId: undefined
                },
                status: undefined,
                crowdFormRules: {
                    launchName: [
                        { required: true, message: "请输入投放名称", trigger: "blur" }
                    ],
                    biIds: [{ required: true, message: "请选择投放平台", trigger: "blur" }],
                    policyIds: [
                        { required: true, message: "请选择策略平台", trigger: "blur" }
                    ],
                    policyCrowdIds: [
                        { required: true, message: "请选择人群", trigger: "blur" }
                    ],
                    autoLaunchTime: [
                        { required: true, message: "请选择每天更新时间点", trigger: "blur" }
                    ],
                },
                crowdDefineFormRules: {
                    launchName: [
                        { required: true, message: "请输入人群名称", trigger: "blur" }
                    ],
                    biIds: [
                        { required: true, message: "请选择投放平台", trigger: "blur" }
                    ],
                    crowdSql: [
                        { required: true, message: "请输入SQL语句", trigger: "blur" }
                    ],
                    proTempTag: [
                        { required: true, message: "请选择是否生成临时标签", trigger: "blur" }
                    ],
                    autoVersion: [
                        { required: true, message: "请选择每天是否更新", trigger: "blur" }
                    ],
                    autoLaunchTime: [
                        { required: true, message: "请选择每天更新时间点", trigger: "blur" }
                    ],
                    tagId: [
                        { required: true, message: "请选择标签", trigger: "blur" }
                    ]
                },
                filterText: "",
                crowdData: null,
                effectTimeList: [],
                estimateItems: [],
                tagsList: [],
                formatTimeSet: undefined,
                pid: null
            }
        },
        props: ["editLaunchCrowdId", "model","editStatus"],
        watch: {
            'crowdForm.abTest': function (val, oldVal) {
                if (oldVal) {
                    this.crowdForm.policyIds = val ? '' : []
                    this.pid = null
                    this.crowdData = null
                }
            }
        },
        created() {
            this.getAddList(this.model)
            if (this.editLaunchCrowdId!=null&& this.editLaunchCrowdId != undefined) {
                this.title = "编辑"
                this.$service.editMultiVersionCrowd(this.editLaunchCrowdId).then(data => {
                    let row = data.launchCrowd
                    if (this.model == 1) {
                            // const biIds = this.distinct(data.launchCrowdBiIds,[])
                            const biIds = data.launchCrowdBiIds
                            this.crowdDefineForm = {
                                launchCrowdId: row.launchCrowdId,
                                launchName: row.launchName,
                                biIds: biIds,
                                crowdSql: row.crowdSql,
                                expiryDay: row.expiryDay,
                                autoVersion: row.autoVersion,
                                calType: row.calType.split(","),
                                proTempTag: row.proTempTag,
                                autoLaunchTime: row.autoLaunchTime,
                                tagId: row.tagId
                            }
                            this.status = this.editStatus
                    } else {
                        this.launchPlatform = data.biLists
                        this.strategyPlatform = data.policies
                        this.crowdForm.launchCrowdId = row.launchCrowdId
                        this.crowdForm.dmpCrowdId = row.dmpCrowdId
                        this.crowdForm.launchName = row.launchName
                        this.crowdForm.biIds = data.launchCrowdBiIds
                        this.crowdForm.remark = row.remark
                        this.crowdForm.dataSource = row.dataSource
                        this.crowdForm.expiryDay = row.expiryDay
                        this.crowdForm.autoVersion = row.autoVersion
                        this.crowdForm.autoLaunchTime = row.autoLaunchTime
                        this.crowdForm.abTest = row.abTest
                        // this.status = row.status
                        this.status = this.editStatus
                        this.crowdForm.policyIds = row.abTest ? row.policyIds : row.policyIds.split(",")
                        this.getCrowd()
                        data.respcl.forEach(element => {
                            element.childs.forEach(v => {
                                if (v.choosed)
                                    this.crowdForm.policyCrowdIds.push(element.policyId + "_" + v.crowdId)
                            })
                        })
                    }
                })
            } else {
                this.title = this.model == 1 ? '新增自定义人群' : '新增'
            }
        },
        methods: {
            callback () {
                this.$emit("changeStatus", true)
            },
            removeTag (policyId) {
                this.crowdForm.policyCrowdIds=this.crowdForm.policyCrowdIds.filter((v)=>{
                    if(v.split("_")[0]!=policyId)
                        return v
                })
            },
            getCrowd () {
                let policyId = null
                if (this.crowdForm.abTest) {
                    policyId = this.crowdForm.policyIds
                } else {
                    policyId = this.crowdForm.policyIds.join(",")
                }
                this.$service
                    .getStrategyCrowds({ policyIds: policyId, abTest: this.crowdForm.abTest })
                    .then(data => {
                        if(this.crowdForm.abTest) {
                            const pid = Object.keys(data[0].childs)[0]
                            this.crowdData = data[0].childs[pid]
                            this.pid = pid
                        }else {
                            this.crowdData = data
                        }
                    })
                    .catch(err => {})
            },
            // 新增
            addSubmit () {
                if (this.model == 1) {this.saveDefineCrowd()}
                else {this.saveNormalCrowd()}

            },
            saveNormalCrowd () {
                this.$refs.crowdForm.validate(valid => {
                    if (valid) {
                        let crowdForm = JSON.stringify(this.crowdForm)
                        crowdForm = JSON.parse(crowdForm)
                        crowdForm.biIds = crowdForm.biIds.join(",")
                        crowdForm.policyIds = crowdForm.abTest ? crowdForm.policyIds : crowdForm.policyIds.join(",")
                        crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v)=>{
                            return v.split("_")[1]
                        }).join(",")
                        if ( this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined ) {
                            this.$service.saveEditMultiVersionCrowd({model: this.model, data: crowdForm},"编辑成功").then(() => {
                                this.callback()
                            })
                        } else {
                            this.$service.saveAddMultiVersionCrowd({model: this.model,data: crowdForm},"新增成功").then(() => {
                                this.callback()
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            // 保存自定义人群
            saveDefineCrowd () {
                this.$refs.crowdDefineForm.validate(valid => {
                    if (valid) {
                        let crowdForm = JSON.stringify(this.crowdDefineForm)
                        crowdForm = JSON.parse(crowdForm)
                        crowdForm.biIds = crowdForm.biIds.join(",")
                        crowdForm.calType = crowdForm.calType.join(",")
                        crowdForm.crowdSql = crowdForm.crowdSql.trim()
                        if ( this.editLaunchCrowdId != null && this.editLaunchCrowdId != undefined ) {
                            this.$service.saveEditMultiVersionCrowd({model: this.model, data: crowdForm},"编辑成功").then(() => {
                                this.callback()
                            })
                        } else {
                            this.$service.saveAddMultiVersionCrowd({model: this.model, data: crowdForm},"新增成功").then(() => {
                                this.callback()
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            // 取消
            cancelAdd () {
                this.$emit("goBack")
            },
            getAddList (model) {
                if (model === 1) {
                    this.$service.addMultiVersionCrowd(this.model).then(data => {
                        this.launchPlatform = data.biLists
                        this.effectTimeList = data.efTime.map(item => {
                            return { label: item + '天',value: item }
                        })
                    })
                    this.$service.getEstimateType().then((data) => {
                        this.estimateItems = data
                    })
                    this.$service.searchTags().then(data=> {
                        this.tagsList = data
                    })
                }
                else {
                    this.$service.addMultiVersionCrowd(this.model).then(data => {
                        this.launchPlatform = data.biLists
                        this.strategyPlatform = data.policies
                        this.effectTimeList = data.efTime.map(item => {
                            return { label: item + '天',value: item }
                        })
                    })
                }
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
            }
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
    .select-tag
        width 30%
</style>




