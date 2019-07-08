<template xmlns:v-popover="">
  <div class="strategy">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in launchPlatformData"
        :label="item.biName+'(业务id:'+item.biId+')'"
        :value="item.biId"
        :key="item.biId"
        :name="'name'+item.biId"
      ></el-tab-pane>
    </el-tabs>
    <el-transfer
      v-model="selectedValue"
      :data="strategyPlatformData"
      :render-content="renderTransferContent"
      @change="handleChange"
      :titles="['未选中策略', '已选中策略']"
    ></el-transfer>
  </div>
</template>
<script>
import PolicyItem from './PolicyItem'
export default {
  data() {
    return {
      activeName: null,
      biId: null,
      launchPlatformData: [], //投放策略平台
      strategyPlatformData: [],
      selectedValue: []
    };
  },
  methods: {
    renderTransferContent(h, option) {
      return <PolicyItem label={option.label} policyId={option.key} ></PolicyItem>
    },
    handleChange(all, direction, selectedValue) {
      all = all.length > 0 && isNaN(all[0]) ? all.slice(1) : all; //去掉NaN vuejs  el-transfer的BUG
      this.$service
        .modifyLaunchPolicy(
          { biId: this.biId, launchPolicyIds: all.join(",") },
          "修改成功"
        )
        .then(data => {});
    },
    handleClick(tab, event) {
      this.$service.launchPolicyIndex().then(data => {
        this.launchPlatformData = data.biLists;
        this.biId = parseInt(tab.name.replace("name", ""));
        let selectData = this.launchPlatformData.find((val, index) => {
          if (val.biId == this.biId) return val;
        });
        this.selectedValue = selectData.launchPolicyIds.split(",").map(val => {
          {
            return parseInt(val);
          }
        });
      });
    }
  },
  created() {
    this.$service.launchPolicyIndex().then(data => {
      this.launchPlatformData = data.biLists;
      if (this.launchPlatformData.length > 0) {
        this.biId = this.launchPlatformData[0].biId;
        this.activeName = "name" + this.biId;
        let selectData = this.launchPlatformData.find((val, index) => {
          if (val.biId == this.biId) return val;
        });
        this.selectedValue = selectData.launchPolicyIds.split(",").map(val => {
          {
            return parseInt(val);
          }
        });
      }
      this.strategyPlatformData = data.policies.map(function(v, i) {
        return {
          key: v.policyId,
          label: v.policyName
        };
      });
    });
  }
};
</script>
<style lang="stylus" scoped>
  .strategy >>> .el-transfer-panel
    width 300px
  .strategy >>> .el-transfer-panel__item.el-checkbox .el-checkbox__label
    overflow visible
</style>
