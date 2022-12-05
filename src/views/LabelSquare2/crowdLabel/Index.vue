<template>
<!--
  crowdType
  2：临时人群
  3：行为人群
  4：广告数据银行
-->
  <div class="temp-label">
    <List
      v-show="showList"
      @show-add="handleShowAdd"
      :refreshFlag="refreshFlag"
      :show-selection="showSelection"
      :currentSelectTag="currentSelectTag"
      @table-selected="handleTableSelected"
      :check-list-parent="checkList"
      @change-checkList="handleCheckListChange"
      :crowdType="crowdType"
    >
    </List>

  </div>
</template>

<script>
import List from './List'
// // import tempLabelAdd from './TempLabelAdd'
// import groupImageAdd from '../../GroupImageInsight/Add'
// import deviceEcharts from '../../GroupImageInsight/deviceEcharts'
export default {
  name: 'TempLabel',
  components: {
    List,
    // tempLabelAdd,
    // groupImageAdd,
    // deviceEcharts
  },
  props: {
    showSelection: {
      type: Boolean
    },
    currentSelectTag: {
      type: Array
    },
    checkList: {
      type: Array
    },
    crowdType: {
      type: Number
    }
  },
  data () {
    return {
      showList: true,
      editLaunchCrowdId: undefined,
      editStatus: undefined,
      refreshFlag: false,
      showSelectTypeDialog: false,
      showAdd2: false
    }
  },
  created () {},
  methods: {
    handleShowAdd (id, code) {
      this.showList = false
      this.refreshFlag = false
      this.editLaunchCrowdId = id
      this.editStatus = code
    },
    // 通过SQL创建
    addOrEditBySql (id, code) {
      this.showSelectTypeDialog = false
      this.showList = false
      // this.showAdd1 = true
      this.refreshFlag = false
      this.editLaunchCrowdId = id
      this.editStatus = code
    },
    // 通过导入本地文件创建
    addByLocalFile () {
      this.showSelectTypeDialog = false
      // this.showList = false
      this.showAdd2 = true
    },
    handleRefreshList () {
      this.showList = true
      this.refreshFlag = true
    },
    handleCloseAddForm () {
      this.showAdd2 = false
    },
    handleTableSelected (val, mode) {
      this.$emit('get-table-selected', val, mode)
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
/* .temp-label */
/* margin-top 50px */
.temp-label >>> .el-button-group {
  display: flex;
  align-items: center;

  .el-button {
    margin: 0 5px;
  }
}

.type-item >>> .el-button--small {
  width: 100%;
  height: 150px;
  font-size: 16px;
}
</style>
