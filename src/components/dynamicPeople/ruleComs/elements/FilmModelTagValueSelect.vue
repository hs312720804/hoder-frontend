<template>
  <div style="display: flex;">
    <el-form-item
      label=""
      :prop="'rules.' + index + '.rules.' + n + '.value'"
      :rules="{
        required: true, message: '不能为空', trigger: 'change'
      }"
      class="form-item-styl"
    >
      <el-select
        v-model="filmModelTagValue"
        filterable
        remote
        reserve-keyword
        placeholder="搜索关键词"
        value-key="tagCode"
        :remote-method="remoteMethod"
        :loading="loading"
        v-loadmore="{'methord': handelQiboLoadmore}"
        @change="selectChange($event, childItem)"
        >
        <template v-if="(filmModelTagOptions.length > 0)">

          <el-option
            v-for="item in filmModelTagOptions"
            :key="item.tagCode"
            :label="item.tagCnName"
            :value="item">
          </el-option>
        </template>
        <template v-else-if="(childItem.value)">
          <el-option
            :key="filmModelTagValue.tagCode"
            :label="filmModelTagValue.tagCnName"
            :value="filmModelTagValue">
          </el-option>
        </template>
      </el-select>
    </el-form-item>

    <span v-if="(childItem.value)" style="white-space: nowrap;line-height: 34px;">【{{childItem.pathName}}】</span>
  </div>
</template>

<script>
export default {
  inject: ['_this'],
  props: {
    childItem: {
      type: Object,
      default: () => {}
    },

    index: {
      type: Number,
      default: 0
    },
    n: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      filmModelTagOptions: [],
      remoteMethodParams: {
        pageNum: 1,
        pageSize: 20,
        keywords: ''
      },
      totalPages: 0,
      filmModelTagValue: {}
      // soureceSignList: this._this.soureceSignList
    }
  },
  watch: {
    value: {
      handler (val) {
        this.filmModelTagValue = val
      },
      immediate: true
    },
    filmModelTagValue: {
      handler (val) {
        this.$emit('update:value', val)
      }
    }
  },
  created () {
    console.log('_this==', this._this)
  },
  methods: {
    selectChange (obj, childItem) {
      console.log('val--->', obj)
      childItem.value = obj.tagCode
      childItem.tagCnName = obj.tagCnName
      childItem.pathName = obj.pathName
    },
    handelQiboLoadmore () {
      if (this.remoteMethodParams.pageNum < this.totalPages) {
        this.remoteMethodParams.pageNum++ // 滚动加载翻页
        this.remoteMethod()
      }
    },
    remoteMethod (query) {
      console.log(this.remoteMethodParams)

      // 是否是加载更多
      const isLoadMore = query === undefined

      // 重置
      if (!isLoadMore) {
        this.remoteMethodParams.pageNum = 1
        this.filmModelTagOptions = []
        this.remoteMethodParams.keywords = query
      }

      this.loading = true

      const params = {
        ...this.remoteMethodParams
      }

      this.$service.getUptmTag(params).then(res => {
        // this.filmModelTagOptions = res.row
        this.totalPages = res.pages // 总页数
        this.filmModelTagOptions = !isLoadMore ? res.row : this.filmModelTagOptions.concat(res.row)

        this.loading = false
      }).catch(() => {
        this.filmModelTagOptions = []
        this.loading = false
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
// .form-item-styl {
//   margin-top: 4px
// }
</style>
