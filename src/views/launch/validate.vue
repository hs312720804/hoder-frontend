<template>
  <div>
    <el-form
      :inline="true"
      :model="formInline"
      :rules="rules"
      ref="searchForm"
      class="demo-form-inline"
    >
      <el-form-item label="设备 ID" prop="devId">
        <el-input v-model="formInline.devId" placeholder="设备ID"></el-input>
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="formInline.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item label="mac" prop="mac">
        <el-input v-model="formInline.mac" placeholder="mac"></el-input>
      </el-form-item>
      <el-form-item label="策略" prop="policyId">
        <el-select v-model="formInline.policyId" placeholder="策略">
          <el-option
            v-for="item in policyList"
            :label="item.policyName"
            :key="item.policyId"
            :value="item.policyId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-container>
      <el-aside width="70px">生效人群</el-aside>
      <el-main id="infoList">
        <div v-if="!searchUsedCrowdResult">暂未找到人群和标签</div>
        <div v-else>
          <el-tree :data="searchUsedCrowdList" :props="defaultProps"></el-tree>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        devId: "",
        userId: "",
        mac: "",
        policyId: ""
      },
      rules: {
        devId: [{ required: true, message: "请输入设备ID", trigger: "blur" }],
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        mac: [{ required: true, message: "请输入MAC", trigger: "blur" }],
        policyId: [{ required: true, message: "请选择策略", trigger: "blur" }]
      },
      policyList: [],
      searchUsedCrowdResult: false, //是否有生效人群
      tags: null, //生效人群返回的tags类型
      searchUsedCrowdList: [],
      defaultProps: {
        children: "tags",
        label: "crowdName"
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs.searchForm.validate(function(result) {
        if (result) {
          this.$service.searchUsedCrowd(this.formInline).then(data => {
            if (data.data.length > 0) {
              this.searchUsedCrowdResult = true;
              this.searchUsedCrowdList = data.data;
            } else {
              this.searchUsedCrowdResult = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
     this.$service.launchHelpIndex().then(data => {
        this.policyList = data.policyList
     })
  }
};
</script>
<style lang="stylus" scoped>
#infoList
  border: 1px solid #dcdfe6
  border-radius: 4px
</style>

