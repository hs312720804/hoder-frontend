<template>
    <div class="read-tag-category">
        <template v-if="tagCategory">
            <el-card shadow="never">
                <div slot="header">
                    <span>{{ tagCategory.tagName }}</span>
                    <el-button style="float:right; margin-top: -7px;" @click="$emit('read-cancel')" type="primary">返回</el-button>
                </div>

                <el-form label-position="left" label-width="80px">
                    <el-form-item label="ID">
                        {{ tagCategory.tagId }}
                    </el-form-item>
                    <el-form-item label="数据来源">
                        {{ dataSourceEnum[tagCategory.dataSource] }}
                    </el-form-item>
                    <el-form-item label="类型">
                        {{ typeEnum[tagCategory.tagType] }}
                    </el-form-item>
                    <el-form-item v-show="tagCategory.tagType === 'number'" label="单位">
                        {{ tagCategory.tagUnit }}
                    </el-form-item>
                    <el-form-item label="备注">
                        {{ tagCategory.remark }}
                    </el-form-item>
                </el-form>
            </el-card>
            <TagList :tag-category="tagCategory" />
        </template>
    </div>
</template>

<script>
import TagList from '../Tag/List.vue'
export default {
  components: {
    TagList
  },
  data () {
    return {
      tagCategory: null,
      dataSourceEnum: {},
      typeEnum: {}
    }
  },
  methods: {
    getFilter () {
      return {
        id: this.$route.params.id
      }
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.readTagCategory(filter).then((data) => {
        this.dataSourceEnum = data.dataSourceEnum
        this.typeEnum = data.typeEnum
        this.tagCategory = data.tagCategory
      })
    }
  },
  created () {
    this.fetchData()
  }
}

</script>
<style lang="stylus" scoped>
.read-tag-category
    width 100%
</style>
