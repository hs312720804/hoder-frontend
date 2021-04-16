<template>
  <div class="temp-label">
    <list
      v-show="showList"
      @show-add="handleShowAdd"
      @show-edit="addOrEditBySql"
      :refreshFlag="refreshFlag"
      :show-selection="showSelection"
      :currentSelectTag="currentSelectTag"
      @table-selected="handleTableSelected"
      :check-list-parent="checkList"
      @change-checkList="handleCheckListChange"
    >
    </list>

    <group-image-add
      v-if="showAdd2"
      title="新增本地人群"
      @close-add="handleCloseAddForm"
      @upsert-end="handleRefreshList"
      @save-form="handleSave"
    >
      <!-- 解构插槽 Prop -->
      <template #default="slotData">
        <!-- {{ slotData }} -->
        <el-form-item label="人群名称">
          <el-input v-model="slotData.slotData.name"></el-input>
        </el-form-item>
      </template>
    </group-image-add>
  </div>
</template>

<script>
import list from './LocalList'
// import tempLabelAdd from './TempLabelAdd'
import groupImageAdd from '../../GroupImageInsight/Add'
import deviceEcharts from '../../GroupImageInsight/deviceEcharts'
export default {
  name: 'TempLabel',
  components: {
    list,
    // tempLabelAdd,
    groupImageAdd,
    deviceEcharts
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
    }
  },
  data() {
    return {
      aaa: '12',
      showList: true,
      editLaunchCrowdId: undefined,
      editStatus: undefined,
      refreshFlag: false,
      showSelectTypeDialog: false,
      showAdd1: false,
      showAdd2: false 
    }
  },
  created() {},
  methods: {
    handleSave(formData, launchName) {
      const params = {
        file: formData,
        launchName: launchName
      }
      this.$service.addLocalCrowd(params, '保存成功').then(() => {
        this.handleRefreshList()
        this.handleCloseAddForm()
      })
    },
    handleShowAdd() {
      // this.showSelectTypeDialog = true
      this.showAdd2 = true
    },
    // 通过SQL创建
    addOrEditBySql(id, code) {
      this.showSelectTypeDialog = false
      this.showList = false
      // this.showAdd1 = true
      this.refreshFlag = false
      this.editLaunchCrowdId = id
      this.editStatus = code
    },
    // 通过导入本地文件创建
    addByLocalFile() {
      this.showSelectTypeDialog = false
      // this.showList = false
      this.showAdd2 = true
    },
    handleRefreshList() {
      this.showList = true
      this.refreshFlag = true
    },
    handleCloseAddForm () {
      this.showAdd2 = false
    },
    handleTableSelected(val, mode) {
      this.$emit('get-table-selected', val, mode)
    },
    handleCheckListChange(val) {
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
