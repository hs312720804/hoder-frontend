<template>
    <div>
        <strategy-list
                v-if="isShowStrategyList"
                @openCrowdPage="openCrowdPage"
                :listCurrentPage="listCurrentPage"
                :listPageSize="listPageSize"
        ></strategy-list>
        <crowd-index v-if="!isShowStrategyList" :selectRow="selectRow" @goBack="goBack"></crowd-index>
    </div>
</template>
<script>
import StrategyList from './strategyList'
import CrowdIndex from './crowdIndex'
export default {
    data(){
        return{
          selectRow:null,//选中的一行策略数据
          isShowStrategyList:true,
          listCurrentPage: undefined,
          listPageSize: undefined
        }
    },
    methods: {
        openCrowdPage(row,listCurrentPage,ListPageSize){
          this.selectRow=row
          this.isShowStrategyList=false
          this.listCurrentPage = listCurrentPage
          this.listPageSize = ListPageSize
        },
        goBack(){
            this.isShowStrategyList=true
        }
    },
    components: {
        StrategyList,
        CrowdIndex
    }
}
</script>

