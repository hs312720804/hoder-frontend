<template>
  <div>
    <list v-show="isShowList" @changeStatus="changeStatus" ref="list"></list>
    <add v-show="!isShowList" @changeStatus="changeStatus" :isShowAddOrEdit="!isShowList" :editLaunchCrowdId="editLaunchCrowdId"></add>
  </div>
</template>
<script>
import list from "./crowd/list";
import add from "./crowd/add";
export default {
  data() {
    return {
      isShowList: true,
      editLaunchCrowdId:null //编辑的ID
    };
  },
  components: {
    list,
    add
  },
  methods: {
    changeStatus(state,launchCrowdId){
      this.isShowList=state;
      if(state)
        this.$refs.list.loadData();
      this.editLaunchCrowdId=launchCrowdId
    }
  }
};
</script>

