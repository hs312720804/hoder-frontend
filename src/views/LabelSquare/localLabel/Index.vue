<template>
  <div class="temp-label">
    <list
      v-show="showList"
      @show-add="handleShowAdd"
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
      :title="title"
      @close-add="handleCloseAddForm"
      @upsert-end="handleRefreshList"
      @save-form="handleSave"
      @currentFileType="handleChangeType"
      :isUpload="false"
      :localCrowdId="localCrowdId"
      :crowdName="crowdName"
    >
      <!-- 解构插槽 Prop -->
      <template #default="slotData">
        <!-- {{ slotData }} -->
        <el-form-item label="人群名称">
          <el-input v-model="slotData.slotData.name" :maxlength="50"></el-input>
        </el-form-item>
      </template>
      <template v-slot:temlDownload>
        <a class="temlDownload" :download="templTagName" :href="`${publicPath}${templTagName}`">模板下载</a>
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
  data () {
    return {
      showList: true,
      editLaunchCrowdId: undefined,
      editStatus: undefined,
      refreshFlag: false,
      showSelectTypeDialog: false,
      showAdd2: false, // 弹窗
      title: '新建本地标签',
      localCrowdId: '',
      crowdName: '',
      addOrEditStatus: '',
      publicPath: process.env.BASE_URL,
      templTagName: 'static/localtag.xls'
    }
  },
  created () {},
  methods: {
    handleSave (selectedFile, launchName) {
      // const params = {
      //   file: selectedFile,
      //   launchName: launchName
      // }
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('launchName', launchName)
      // debugger
      if (this.addOrEditStatus === 'add') {
        this.$service.addLocalCrowd(formData, '保存成功').then(() => {
          this.$root.$emit('local-label-list-refresh')
          this.handleCloseAddForm()
        })
      } else {
        this.$service.updateLocalCrowd({ formData, id: this.localCrowdId }, '编辑成功').then(() => {
          this.$root.$emit('local-label-list-refresh')
          this.handleCloseAddForm()
        })
      }
    },
    handleShowAdd (localCrowdId, crowdName) {
      this.showAdd2 = true
      this.refreshFlag = false
      this.localCrowdId = localCrowdId
      this.crowdName = crowdName
      this.addOrEditStatus = this.localCrowdId != null && this.crowdName != undefined ? 'edit' : 'add'
      if (this.addOrEditStatus === 'edit') {
        this.title = '编辑本地人群'
      } else {
        this.title = '新增本地人群'
      }
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
    },
    /**
     * 切换不同文件类型，下载不同模板
     */
    handleChangeType (type) {
      this.templTagName = type === 1 ? 'static/localtag.txt' : 'static/localtag.xls'
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

.temlDownload
  float right
  color #409EFF
  cursor pointer
  text-decoration none
</style>
