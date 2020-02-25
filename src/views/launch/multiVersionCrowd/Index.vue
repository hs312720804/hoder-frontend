<template>
    <div>
        <list v-show="isShowList" :parentSource="parentSource" @changeStatus="changeStatus" ref="list"></list>
        <add v-if="!isShowList"
             @changeStatus="changeStatus"
             :model="addModel"
             @goBack="goBack"
             :isShowAddOrEdit="!isShowList"
             :editLaunchCrowdId="editLaunchCrowdId"
             :editStatus="editStatus"
             :parentSource="parentSource"
        ></add>
    </div>
</template>
<script>
    import List from "./List"
    import Add from "./Add"
    export default {
        data() {
            return {
                isShowList: true,
                editLaunchCrowdId:null, //编辑的ID
                addModel: 0,
                editStatus: null
            };
        },
        props: ["parentSource"],
        components: {
            List,
            Add
        },
        methods: {
            changeStatus(state,model,launchCrowdId,editStatus){
                this.isShowList=state
                this.addModel = model
                if(state)
                    this.$refs.list.loadData()
                if(launchCrowdId)
                    this.editLaunchCrowdId=launchCrowdId
                else
                    this.editLaunchCrowdId=null
                if(editStatus)
                    this.editStatus = editStatus
            },
            goBack(){
                this.isShowList=true
            }
        }
    };
</script>

