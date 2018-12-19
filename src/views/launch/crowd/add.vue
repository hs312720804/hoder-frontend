<template>
  <div class="add">
    <el-row>
      <el-col :span="24">
        <div class="title">新增</div>
      </el-col>
    </el-row>
    <!--新增编辑界面-->
    <el-row :gutter="40">
      <el-col :span="24">
        <el-form :model="crowdForm" :rules="crowdFormRules" ref="crowdForm" label-width="100px">
          <el-form-item label="投放名称" prop="launchName">
            <el-input size="small" v-model="crowdForm.launchName" placeholder="投放名称"></el-input>
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
            <el-input size="small" v-model="crowdForm.remark" readonly></el-input>
          </el-form-item>
          <el-form-item label="选择策略" prop="policyIds" class="multipleSelect">
            <el-select
              v-model="crowdForm.policyIds"
              multiple
              placeholder="请选择策略"
              @change="getCrowd"
            >
              <el-option
                v-for="item in strategyPlatform"
                :key="item.policyId+''"
                :label="item.policyName"
                :value="item.policyId+''"
              >
               {{item.policyName}} 
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择人群" prop="policyCrowdIds">
            <el-form-item v-for="v in crowdData" :label="v.policyName" :key="v.policyId">
              <el-checkbox-group
                v-model="crowdForm.policyCrowdIds"
              >
                <el-checkbox
                  v-for="item in v.childs"
                  :label="item.crowdId+''"
                  :key="item.crowdId+''"
                >{{item.crowdName}}</el-checkbox>
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
  props: ["isShowAddOrEdit","editLaunchCrowdId"],
  watch: {
      isShowAddOrEdit: function(val,oldVal){
         if(val){
            this.$service.addCrowdLanuch({launchCrowdId:this.editLaunchCrowdId}).then(data => {
                this.launchPlatform = data.biLists;
                this.strategyPlatform = data.policies;
                if(data.launchCrowd){
                    let row=data.launchCrowd
                    this.crowdForm.launchCrowdId = row.launchCrowdId;
                    this.crowdForm.dmpCrowdId = row.dmpCrowdId;
                    this.crowdForm.launchName = row.launchName;
                    this.crowdForm.biIds =data.launchCrowdBiIds;
                    this.crowdForm.remark = row.remark;
                    this.crowdForm.dataSource = row.dataSource;
                    this.crowdForm.policyIds = row.policyIds;
                    this.getCrowd();
                   this.crowdForm.policyCrowdIds =row.policyCrowdIds;
                }

            });
         }
      }
  },
  methods: {
    callback(data, successMsg) {
      if (data.msg) {
        this.$message({
          message: data.msg,
          type: "error"
        });
      } else {
        this.$message({
          message: successMsg,
          type: "success"
        });
        this.loadData();
      }
    },
    getCrowd() {
      this.$service
        .getStrategyCrowds({ policyIds: this.crowdForm.policyIds.join(",") })
        .then(data => {
          this.crowdData = data;
        })
        .catch(err => {
        });
    },
    // 新增
    addSubmit: function() {
      this.$refs.crowdForm.validate(valid => {
        if (valid) {
          let crowdForm = JSON.stringify(this.crowdForm);
          crowdForm = JSON.parse(crowdForm);
          crowdForm.biIds = crowdForm.biIds.join(",");
          crowdForm.policyIds = crowdForm.policyIds.join(",");
          crowdForm.policyCrowdIds = crowdForm.policyCrowdIds.join(",");
          this.$service.modifyLaunchCrowd(crowdForm).then(data => {
            if(this.editLaunchCrowdId!=null&&this.editLaunchCrowdId!=undefined)
              this.callback(data, "编辑成功");
            else
              this.callback(data, "添加成功");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    cancelAdd: function() {
      this.$emit("changeStatus",true)
      
    }
  }
};
</script>
<style lang="stylus" scoped>
.multipleSelect
  >>>.el-select
    width: 100%
.add
   border 1px solid #ebeef5
   padding 20px
   border-radius: 4px;
.title
   font-size 18px
   margin-bottom 30px
.footer
   display flex
   justify-content flex-end
// .add >>> 
//         .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item 
//            margin-bottom 0px
          
</style>




