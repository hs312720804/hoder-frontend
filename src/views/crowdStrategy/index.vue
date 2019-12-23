<template>
    <div>
        <strategy-list
                v-if="isShowStrategyList"
                @openCrowdPage="openCrowdPage"
                :historyFilter="historyFilter"
                :checkListFilter="checkListFilter"
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
          historyFilter: null,
          checkListFilter: ['useStatus']
          // listCurrentPage: undefined,
          // listPageSize: undefined
        }
    },
    methods: {
        openCrowdPage(row,filter,checkList){
          this.selectRow=row
          this.isShowStrategyList=false
          this.historyFilter = filter
          this.checkListFilter = checkList
          // this.listCurrentPage = filter.page
          // this.listPageSize = filter.pageSize
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

