<template>
  <div>
    <crowd-list
      v-show="isShowCrowdList"
      ref="list"
      :selectRow="selectRow"
      @goBack="goBackFirstLayer"
      @addCrowd="addCrowd"
      @editABCrowd="editABCrowd"
    ></crowd-list>
    <crowd-add
      v-if="!isShowCrowdList && !isAbTest && mode === ''"
      :crowdId="crowdId"
      :policyId="selectRow.policyId"
      @goBackCrowdListPage="goBackCrowdListPage"
    >
    </crowd-add>
    <div v-if="!isShowCrowdList && isAbTest && mode === 'editABTest'">
      <el-tabs v-model="tabSet" type="card">
        <el-tab-pane label="编辑人群条件" name="first">
          <crowd-add
                  :crowdId="crowdId"
                  :policyId="selectRow.policyId"
                  @goBackCrowdListPage="goBackCrowdListPage"
          >
          </crowd-add>
        </el-tab-pane>
        <el-tab-pane label="编辑AB子人群" name="second">
          <crowd-a-b-add
                  :crowd="crowd"
                  :mode="isAbTest ? 'editABTest' : ''"
                  @goBackCrowdListPage="goBackCrowdListPage"
          ></crowd-a-b-add>
        </el-tab-pane>
      </el-tabs>
    </div>
    <crowd-a-b-add
            v-if="!isShowCrowdList && mode === 'addABTest'"
            @goBackCrowdListPage="goBackCrowdListPage"
            :crowd="crowd"
    ></crowd-a-b-add>
  </div>
</template>
<script>
import CrowdAdd from "./crowdAdd";
import CrowdList from "./crowdList";
import CrowdABAdd from './crowdAbTest'
export default {
  data() {
    return {
      isShowCrowdList: true, //是否显示人群列表
      crowdId: null, //编辑的ID
      isAbTest: false,
      tabSet: 'first',
        mode: '',
        crowd: undefined
    };
  },
  props: ["selectRow"],
  methods: {
    goBackFirstLayer() {
      //回到第一层页面，即策略列表页
      this.$emit("goBack")
    },
    addCrowd(crowdId) {
      //编辑添加
      this.mode = ''
      this.isAbTest = false
      this.isShowCrowdList = false
      if (crowdId) {
        this.crowdId=crowdId
      }else{
        this.crowdId=null
      }
    },
    goBackCrowdListPage(isLoadData) {
      this.isShowCrowdList = true;
      if (isLoadData) this.$refs.list.loadData()
    },
    // 编辑abtest人群
     editABCrowd(row,mode) {
         this.crowd = row
         this.isShowCrowdList = false
         this.isAbTest = row.abMainCrowd === 1
         this.crowdId= row.crowdId
         this.mode = mode
    }
  },
  components: {
    CrowdAdd,
    CrowdList,
    CrowdABAdd
  }
};
</script>

