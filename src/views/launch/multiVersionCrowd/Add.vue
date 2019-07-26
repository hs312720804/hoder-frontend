<template>
    <div class="add">
        <el-row>
            <el-col :span="24">
                <div class="title">{{title}}</div>
            </el-col>
        </el-row>
        <!--新增编辑界面-->
        <el-row :gutter="40">
            <el-col :span="24">
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
                    <el-form-item label="选择策略" prop="policyIds" class="multipleSelect">
                        <el-select
                                v-model="crowdForm.policyIds"
                                multiple
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
                        <el-form-item v-for="v in crowdData" :label="v.policyName" :key="v.policyId">
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
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div slot="footer" class="footer">
            <el-button @click="cancelAdd">返回</el-button>
            <el-button type="primary" @click="addSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
    import _ from "lodash";
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
                    launchCrowdId: "", //投放ID
                    launchName: "", //投放名称
                    biIds: "", //投放平台ID
                    remark: "",
                    //      dataSource: 2,
                    policyIds: "",
                    policyCrowdIds: []
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
                    ]
                },
                filterText: "",
                crowdData: null
            };
        },
        props: ["editLaunchCrowdId"],
        created() {
            if (this.editLaunchCrowdId!=null&& this.editLaunchCrowdId != undefined) {
                this.title = "编辑";
                this.$service.modifyCrowdLanuch({ launchCrowdId: this.editLaunchCrowdId }).then(data => {
                    this.launchPlatform = data.biLists;
                    this.strategyPlatform = data.policies;
                    if (data.launchCrowd) {
                        let row = data.launchCrowd;
                        this.crowdForm.launchCrowdId = row.launchCrowdId;
                        this.crowdForm.dmpCrowdId = row.dmpCrowdId;
                        this.crowdForm.launchName = row.launchName;
                        this.crowdForm.biIds = data.launchCrowdBiIds;
                        this.crowdForm.remark = row.remark;
                        this.crowdForm.dataSource = row.dataSource;
                        this.status = row.status
                        this.crowdForm.policyIds = row.policyIds.split(",");
                        this.getCrowd();
                        data.respcl.forEach(element => {
                            element.childs.forEach(v=>{
                                if(v.choosed)
                                    this.crowdForm.policyCrowdIds.push(element.policyId+"_"+v.crowdId)
                            })
                        });
                    }
                });
            } else {
                this.title = "新增";
                this.$service.addCrowdLanuch().then(data => {
                    this.launchPlatform = data.biLists;
                    this.strategyPlatform = data.policies;
                });
            }
        },
        methods: {
            callback(data, successMsg) {
                this.$emit("changeStatus", true);
            },
            removeTag(policyId){
                this.crowdForm.policyCrowdIds=this.crowdForm.policyCrowdIds.filter((v,index)=>{
                    if(v.split("_")[0]!=policyId)
                        return v
                })
            },
            getCrowd() {
                this.$service
                    .getStrategyCrowds({ policyIds: this.crowdForm.policyIds.join(",") })
                    .then(data => {
                        this.crowdData = data;
                    })
                    .catch(err => {});
            },
            // 新增
            addSubmit: function() {
                this.$refs.crowdForm.validate(valid => {
                    if (valid) {
                        let crowdForm = JSON.stringify(this.crowdForm);
                        crowdForm = JSON.parse(crowdForm);
                        crowdForm.biIds = crowdForm.biIds.join(",");
                        crowdForm.policyIds = crowdForm.policyIds.join(",");
                        crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.map((v,i)=>{
                            return v.split("_")[1]
                        }).join(",")
                        if (
                            this.editLaunchCrowdId != null &&
                            this.editLaunchCrowdId != undefined
                        ) {
                            this.$service.CrowdLanuchEditBtn(crowdForm,"编辑成功").then(data => {
                                this.callback(data);
                            });
                        } else {
                            this.$service.CrowdLanuchAddBtn(crowdForm,"新增成功").then(data => {
                                this.callback(data);
                            });
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            // 取消
            cancelAdd: function() {
                this.$emit("goBack");
            }
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
</style>




