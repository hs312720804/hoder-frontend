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
    <LocalListEdit
      v-if="showAdd2"
      :title="title"
      :localCrowdId="localCrowdId"
      :crowdName="crowdName"
      :editTagId="editTagId"
      @close-add="handleCloseAddForm"
      @upsert-end="handleRefreshList"
      :addOrEditStatus="addOrEditStatus"
    >
    </LocalListEdit>
    <!-- <group-image-add
      v-if="showAdd2"
      :title="title"
      @close-add="handleCloseAddForm"
      @upsert-end="handleRefreshList"
      @save-form="handleSave"
      @currentFileType="handleChangeType"
      :isUpload="false"
      :localCrowdId="localCrowdId"
      :crowdName="crowdName"
      :uploadTipMessage="uploadTipMessage"
    >
      <template #default="slotData">
        <el-form-item label="标签名称">
          <el-input v-model="slotData.slotData.name" :maxlength="50"></el-input>
        </el-form-item>
      </template>
      <template v-slot:temlDownload>
        <a class="temlDownload" :download="templTagName" :href="`${publicPath}${templTagName}`">模板下载</a>
      </template>
    </group-image-add> -->
  </div>
</template>

<script>
import LocalListEdit from '../../coms/LocalListEdit.vue'
import list from './LocalList'
// import groupImageAdd from '@/views/GroupImageInsight/Add.vue'

export default {
  name: 'TempLabel',
  components: {
    list,
    // tempLabelAdd,
    // groupImageAdd, // deviceEcharts

    LocalListEdit
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
      editTagId: ''
      // publicPath: process.env.BASE_URL,
      // templTagName: 'static/localtag.xlsx'
      // uploadTipMessage: ''
    }
  },
  created () {},
  methods: {
    // handleSave (selectedFile, launchName) {
    //   // const params = {
    //   //   file: selectedFile,
    //   //   launchName: launchName
    //   // }
    //   const formData = new FormData()
    //   formData.append('file', selectedFile)
    //   formData.append('launchName', launchName)
    //   // debugger
    //   if (this.addOrEditStatus === 'add') {
    //     this.$service.addLocalCrowd(formData, '保存成功').then(() => {
    //       // this.$root.$emit('local-label-list-refresh')
    //       this.$root.$emit('custom-tag-list-refresh')
    //       this.handleCloseAddForm()
    //     }).catch(err => {
    //       // 不符合要求的Mac在上传框里提示
    //       this.uploadTipMessage = err.message
    //     })
    //   } else {
    //     this.$service.updateLocalCrowd({ formData, id: this.localCrowdId }, '编辑成功').then(() => {
    //       // this.$root.$emit('local-label-list-refresh')
    //       this.$root.$emit('custom-tag-list-refresh')
    //       this.handleCloseAddForm()
    //     })
    //   }
    // },

    handleRefreshList () {
      this.showList = true
      this.refreshFlag = true
      this.$root.$emit('custom-tag-list-refresh')
    },
    handleCloseAddForm () {
      this.showAdd2 = false
      // this.uploadTipMessage = ''
      // this.templTagName = 'static/localtag.xlsx'
    },
    // /**
    //  * 切换不同文件类型，下载不同模板
    //  */
    // handleChangeType (type) {
    //   this.templTagName = type === 1 ? 'static/localtag.txt' : 'static/localtag.xlsx'
    // },
    // --------------
    handleShowAdd (localCrowdId, crowdName, tagId) {
      this.showAdd2 = true
      this.refreshFlag = false
      this.localCrowdId = localCrowdId
      this.crowdName = crowdName
      this.addOrEditStatus = this.localCrowdId != null && this.crowdName != undefined ? 'edit' : 'add'
      if (this.addOrEditStatus === 'edit') {
        this.title = '编辑本地标签'
        this.editTagId = tagId
      } else {
        this.title = '新建本地标签'
      }
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
  color #409EFF
  cursor pointer
  text-decoration none
  margin-left 20px
</style>
