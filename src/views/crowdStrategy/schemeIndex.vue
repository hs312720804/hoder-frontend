<!--方案配置界面-->
<template>
    <div class="schemeIndex-wrap">
        <fieldset>
            <legend>{{selectRow.policyName}}</legend>
            <div class="crowd-top">
                <div class="crowd-top-back">
                    <el-button type="text" @click="goBack">
                        <i class="el-icon-cc-left"></i>返回
                    </el-button>
                </div>
                <div class="info">
                    策略ID：{{selectRow.policyId}}
                    策略维度:
                    <el-tag
                        size="mini"
                        v-for="item in selectRow.tagsList"
                        :key="item.tagId"
                        :type= "dataSourceColorEnum[item.dataSource]"
                    >{{item.tagName}}</el-tag>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="handleEditSave">保存</el-button>
                </div>
            </div>
        </fieldset>
        <!--:smartDetail="smartDetail"-->
        <scheme-config
            ref="schemeConfigEdit"
            @click="goBack">
        </scheme-config>
    </div>
</template>

<script>
import schemeConfig from '@/views/OneTouchDrop/createConfigScheme'
import { dataSourceColorEnum } from '@/utils/tags.js'
export default {
  name: 'schemeIndex',
  props: ['selectRow'],
  data () {
    return {
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      // dataSourceColorEnum: {
      //   1: 'success',
      //   2: 'danger',
      //   3: '',
      //   5: 'warning',
      //   6: 'warningOrange',
      //   7: 'warningOrange2',
      //   8: 'warningCyan'
      // }
    }
  },
  computed: {
    dataSourceColorEnum () {
      return dataSourceColorEnum
    }
  },
  components: {
    schemeConfig
  },
  mounted () {
    this.$store.commit('setEditSchemeConfig', true)
  },
  methods: {
    goBack () {
      this.$emit('goBack')
    },
    handleEditSave () {
      this.$refs.schemeConfigEdit.handleEditSave().then(() => {
        this.$emit('goBack')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
    .schemeIndex-wrap
        fieldset
            border: 1px solid #ebeef5
            font-size: 14px
            color: #909399
            margin-bottom: 20px
            padding: 10px
        fieldset>div
            display: flex
            justify-content: space-between
        .crowd-top
            display flex
            justify-content flex-start
            align-items center
        .crowd-top-back
            width: 80px
            margin-right 20px
            .el-button
                font-size 16px
        .info
            flex: 1
        .btn
            width: 80px
            text-align: right
        .crowd-top
          @import '~@/assets/tag.styl'
        .button-margin
            margin-top 10px
</style>
