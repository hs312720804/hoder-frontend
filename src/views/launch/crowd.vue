<template>
  <div>
    <list v-show="isShowList" @changeStatus="changeStatus" ref="list"></list>
    <add v-if="!isShowList" @changeStatus="changeStatus"  @goBack="goBack" :isShowAddOrEdit="!isShowList" :editLaunchCrowdId="editLaunchCrowdId"></add>
  </div>
</template>
<script>
import List from "./crowd/list";
import Add from "./crowd/add";
export default {
  name: 'crowdAA',
  data() {
    return {
      isShowList: true,
      editLaunchCrowdId:null //编辑的ID
    };
  },
  components: {
    List,
    Add
  },
  methods: {
    changeStatus(state,launchCrowdId){
      this.isShowList=state;
      if(state)
        this.$refs.list.loadData();
      if(launchCrowdId)
      this.editLaunchCrowdId=launchCrowdId
      else
      this.editLaunchCrowdId=null
    },
    goBack(){
      this.isShowList=true;
    }
  }
};
</script>

