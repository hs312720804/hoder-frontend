<template>
    <div>
        <strategy-list v-show="isShowStrategyList" @openCrowdPage="openCrowdPage"></strategy-list> 
        <crowd-index v-if="!isShowStrategyList" :selectRow="selectRow" @goBack="goBack"></crowd-index>
    </div>
</template>
<script>
import strategyList from './strategyList'
import crowdIndex from './crowdIndex'
export default {
    data(){
        return{
          selectRow:null,//选中的一行策略数据
          isShowStrategyList:true
        }
    },
    methods: {
        openCrowdPage(row){
          this.selectRow=row;
          this.isShowStrategyList=false;
        },
        goBack(){
            this.isShowStrategyList=true;
        }
    },
    components: {
        strategyList,
        crowdIndex
    }
}
</script>

