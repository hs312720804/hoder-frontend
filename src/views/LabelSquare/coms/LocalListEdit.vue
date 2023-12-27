<template>
  <!-- 因为新增和编辑放在不同的组件，所以将编辑新增组件提取出来 -->
 <div class='' id=''>
  <groupImageAdd
    :isUpload="false"
    :title="title"
    :localCrowdId="localCrowdId"
    :crowdName="crowdName"
    :uploadTipMessage="uploadTipMessage"
    @close-add="handleCloseAddForm"
    @save-form="handleSave"
    @currentFileType="handleChangeType"
  >
  <!-- @upsert-end="handleRefreshList" -->
      <!-- 解构插槽 Prop -->
      <template #default="{slotData}">
        <el-form-item label="标签名称">
          <el-input v-model="slotData.name" :maxlength="50"></el-input>
        </el-form-item>
      </template>
      <template v-slot:temlDownload>
        <a class="temlDownload" :download="templTagName" :href="`${publicPath}${templTagName}`">模板下载</a>
      </template>
    </groupImageAdd>
 </div>
</template>

<script>
import groupImageAdd from '@/views/GroupImageInsight/Add.vue'

export default {
  components: { groupImageAdd },
  props: {
    title: {
      type: String,
      default: ''
    },
    localCrowdId: {
      type: [String, Number],
      default: ''
    },
    editTagId: {
      type: [String, Number],
      default: undefined
    },
    crowdName: {
      type: String,
      default: ''
    },
    addOrEditStatus: {
      type: String,
      default: 'edit'
    }
  },
  data () {
    return {
      uploadTipMessage: '',
      publicPath: process.env.BASE_URL,
      templTagName: 'static/localtag.xlsx'
    }
  },
  created () {

  },
  methods: {
    handleSave (selectedFile, launchName) {
      // const params = {
      //   file: selectedFile,
      //   launchName: launchName
      // }
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('launchName', launchName)
      formData.append('tagId', this.editTagId)
      // debugger
      if (this.addOrEditStatus === 'add') {
        this.$service.addLocalCrowd(formData, '保存成功').then(() => {
          // this.$root.$emit('local-label-list-refresh')
          this.$root.$emit('custom-tag-list-refresh')
          this.handleCloseAddForm()
        }).catch(err => {
          // 不符合要求的Mac在上传框里提示
          this.uploadTipMessage = err.message
        })
      } else {
        this.$service.updateLocalCrowd({ formData, id: this.localCrowdId }, '编辑成功').then(() => {
          // this.$root.$emit('local-label-list-refresh')
          debugger
          this.$root.$emit('custom-tag-list-refresh')
          this.handleCloseAddForm()
          this.$emit('upsert-end')
        })
      }
    },

    // handleRefreshList () {
    //   this.$emit('upsert-end')
    // },
    handleCloseAddForm () {
      // this.showAdd2 = false
      this.$emit('close-add')
      this.uploadTipMessage = ''
      this.templTagName = 'static/localtag.xlsx'
    },
    /**
     * 切换不同文件类型，下载不同模板
     */
    handleChangeType (type) {
      this.templTagName = type === 1 ? 'static/localtag.txt' : 'static/localtag.xlsx'
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
