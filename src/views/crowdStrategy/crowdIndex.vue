<template>
  <div>
    <crowd-list
      v-show="isShowCrowdList"
      ref="list"
      :selectRow="selectRow"
      @goBack="goBackFirstLayer"
      @addCrowd="addCrowd"
    ></crowd-list>
    <crowd-add
      v-if="!isShowCrowdList"
      :crowdId="crowdId"
      :policyId="selectRow.policyId"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </crowd-add>
  </div>
</template> 
<script>
import crowdAdd from "./crowdAdd";
import crowdList from "./crowdList";
export default {
  data() {
    return {
      isShowCrowdList: true, //是否显示人群列表
      crowdId: null //编辑的ID
    };
  },
  props: ["selectRow"],
  methods: {
    goBackFirstLayer() {
      //回到第一层页面，即策略列表页
      this.$emit("goBack");
    },
    addCrowd(crowdId) {
      //编辑添加
      this.isShowCrowdList = false;
      if (crowdId) {
        this.crowdId=crowdId
      }else{
        this.crowdId=null
      }
    },
    goBackCrowdListPage(isLoadData) {
      this.isShowCrowdList = true;
      if (isLoadData) this.$refs.list.loadData();
    }
  },
  components: {
    crowdAdd,
    crowdList
  }
};
</script>

