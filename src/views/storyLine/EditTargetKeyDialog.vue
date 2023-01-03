<template>
<div>
  <el-form :model="targetKeyForm" label-width="170px" ref="targetKeyFormRef" :rules="rules" :inline="true" v-if="targetKeyForm.indicatorsType" style="margin-bottom: 50px;">
    <!-- {{ targetKeyForm }} -->
    <!-- <el-form-item label="指标类型" prop="indicatorsType" required>
      <el-select v-model="targetKeyForm.indicatorsType" @change="indicatorsTypeChange" clearable >
        <el-option
          v-for="item in indicatorsOptions"
          :label="item.label +' '+ item.indicatorsType "
          :value="item.indicatorsType"
          :key="item.indicatorsType">
        </el-option>
      </el-select>

    </el-form-item> -->

    <!-- 会员的 -->
    <el-form-item  v-if="(targetKeyForm.indicatorsType < 6)" :label="selectIndicatorsName" prop="resource" required>
      <el-select
        v-model="targetKeyForm.resource"
        value-key="resourceId"
        clearable
        placeholder="请选择产品包"
        filterable>
        <el-option
          v-for="item in soureceSignListOptions"
          :label="item.resourceName  + '（'+ item.resourceId + '）'"
          :value="item"
          :key="item.resourceId">
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 内容的 -->
    <template v-else>

      <el-form-item  :label="selectIndicatorsName"  prop="videoSource" required >
        <!-- 内容源 -->
        <el-select v-model="targetKeyForm.videoSource" @change="videoSourceChange" clearable placeholder="请选择内容源">
          <el-option
            v-for="item in videoSourceOptions"
            :label="item.sourceName"
            :value="item.sourceId"
            :key="item.sourceId">
          </el-option>
        </el-select>
        </el-form-item>
      <el-form-item prop="resource" required >

        <el-select
          v-model="targetKeyForm.resource"
          value-key="resourceId"
          multiple
          filterable
          :filter-method="searchResourceList"
          :loading="searchLoading"
          loading-text="加载中"
          clearable
          placeholder="请选择影片">
          <el-option
            v-for="item in resourceListOptions"
            :label="item.resourceName + '（'+item.resourceId+'）'"
            :value="item"
            :key="item.resourceId">
          </el-option>
        </el-select>
      </el-form-item>
    </template>

  </el-form>
  <div >
    <el-tag
      v-for="item in indicatorsOptions"
      :key="item.indicatorsType"
      class="tag-style"
      @click="tagClick(item)"
    >
      {{(item.label +' '+ item.indicatorsType)}}
    </el-tag>
  </div>
</div>
</template>

<script>
export default {
  components: {},
  props: {
    targetKeyFormParent: {
      type: Object,
      default: () => {}
    },
    selectedServicer: {
      type: Object,
      default: () => {}
    },
    indicatorsOptions: {
      type: Array,
      default: () => []
    },
    soureceSignListOptions: {
      type: Array,
      default: () => []
    }

  },
  data () {
    return {
      rules: {
        indicatorsType: { required: true, message: '请选择', trigger: 'change' },
        videoSource: { required: true, message: '请选择', trigger: 'change' },
        resource: { required: true, message: '请选择', trigger: 'change' }
      },
      searchLoading: false,
      resourceListOptions: [],
      targetKeyForm: {
        // id: '', // 接待员ID
        // indicatorsType: '', // 1 会员付费率，2 会员成交单数 3 会员成交金额 4 会员客单价 5会员付费设备量 6 内容影片吸金订单量 7 订单转换率 8 订单均价 9 影片播放均价
        // resource: [],
        // videoSource: ''
      },
      videoSourceOptions: [],
      selectIndicatorsName: '选择权益'

    }
  },
  watch: {
    targetKeyFormParent: {
      handler (val) {
        this.targetKeyForm = this.targetKeyFormParent
      }
    },
    targetKeyForm: {
      handler (val) {
        this.$emit('update:targetKeyFormParent', val)
      }
    }
  },
  created () {
    console.log('created------')
    this.getTargetById()
  },
  methods: {
    tagClick (item) {
      // 清空
      this.targetKeyForm.videoSource = ''
      this.targetKeyForm.resource = []

      this.targetKeyForm.indicatorsType = item.indicatorsType
      this.selectIndicatorsName = item.label
    },
    // indicatorsTypeChange () {
    //   // 清空
    //   this.targetKeyForm.videoSource = ''
    //   this.targetKeyForm.resource = []
    // },
    videoSourceChange (val) {
      // 清空
      this.targetKeyForm.resource = ''
      this.resourceListOptions = []

      this.getReceptionistVideo({ sourceId: val })
    },

    searchResourceList (val) {
      this.getReceptionistVideo({ keywords: val })
    },

    // 根据接待员ID获取绩效目标
    getTargetById () {
      // 清空
      this.targetKeyForm = {}

      const parmas = {
        id: this.selectedServicer.id
      }
      if (!parmas.id) return

      this.$service.getTargetById(parmas).then(res => {
        const list = JSON.parse(res.resource)
        let resource = list

        // 会员
        if (res.indicatorsType < 6) {
          resource = list && list.length > 0 ? list[0] : []
        }

        this.targetKeyForm = {
          indicatorsType: res.indicatorsType,
          resource,
          videoSource: res.indicatorsType < 6 ? undefined : resource[0].videoSource
        }
        if (res.indicatorsType) {
          this.selectIndicatorsName = this.indicatorsOptions.find(item => item.indicatorsType === res.indicatorsType).label || ''
        }

        // if (res.indicatorsType > 5) {
        // 查视频源
        this.getReceptionistVideoSource()

        // 视频下拉列表 就是保存的数据
        if (this.targetKeyForm.videoSource) {
          this.resourceListOptions = this.targetKeyForm.resource
          // this.getReceptionistVideo({ sourceId: this.targetKeyForm.videoSource })
        }
        // }
      })
    },
    // 查询视频
    getReceptionistVideo ({ sourceId, keywords }) {
      const params = {
        sourceId: this.targetKeyForm.videoSource,
        keywords,
        page: 1,
        pageSize: 30
      }
      this.searchLoading = true
      // 影片
      this.$service.getReceptionistVideo(params).then(res => {
        this.resourceListOptions = res.rows.map(item => {
          return {
            resourceId: item.sourceId,
            resourceName: item.sourceName
          }
        }) || []

        this.searchLoading = false
      })
    },

    // 内容源
    getReceptionistVideoSource () {
      // 内容
      // if (this.targetKeyForm.indicatorsType > 5) {
      this.$service.getReceptionistVideoSource().then(res => {
        this.videoSourceOptions = res || []
      })
      // }
    }
  }
}
</script>

<style lang='stylus' scoped>
.tag-style {
  margin: 10px 10px 0 0;
  cursor pointer
}
</style>
