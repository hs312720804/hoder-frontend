<template>
    <div class="read-tag-category">
        <template v-if="row && !showEdit">
            <el-card shadow="never">
                <div slot="header">
                    <span>{{ row.tagName }}</span>
                    <el-button style="float:right; margin-top: -7px;" @click="$emit('read-cancel')" type="primary">返回</el-button>
                </div>

                <el-form label-position="left" label-width="120px">
                    <el-form-item label="ID">
                        {{ row.id }}
                    </el-form-item>
                    <el-form-item label="英文名">
                        {{ row.tagEnName }}
                    </el-form-item>
                    <el-form-item label="是否每日更新">
                        {{ row.autoVersion === 1 ? '是': '否' }}
                    </el-form-item>
                    <el-form-item label="备注">
                        {{ row.remark }}
                    </el-form-item>
                </el-form>
            </el-card>
            <AttrList :row="row" ></AttrList>
        </template>
        <!-- <AddOrEditSpecialTag v-if="showEdit" :paramsData="paramsData"></AddOrEditSpecialTag> -->
    </div>
</template>

<script>
import AttrList from './AttrList.vue'
// import DeviceTagList from '../Tag/DeviceTagList.vue'
// import TagRegionTree from './TagRegionTree.vue'
export default {
  components: {
    AttrList
    // TagRegionTree,
    // DeviceTagList
  },
  props: {
    tagId: {
      type: Number
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      tagCategory: null,
      dataSourceEnum: {},
      typeEnum: {},
      showEdit: false,
      paramsData: {}
    }
  },
  methods: {
    getFilter () {
      return {
        id: this.tagId
      }
    },
    fetchData () {
      const filter = this.getFilter()
      this.$service.readTagCategory(filter).then((data) => {
        this.dataSourceEnum = data.dataSourceEnum
        this.typeEnum = data.typeEnum
        this.tagCategory = data.tagCategory
      })
    },
    handleAdd () {
      this.$router.push({ name: 'specialTag', query: { belongTagId: this.tagId } })
    },
    handleEdit (specialTagId) {
      // console.log('parentId===', parentId)
      // this.paramsData = {
      //     parentId,
      //     belongTagId: this.tagId,
      //     specialTagId,
      //     specialTagName
      // }
      // this.$router.push({
      //     name: 'specialTag',
      //     params: this.paramsData
      // })
      if (specialTagId) {
        this.$router.push({ name: 'specialTag', query: { specialTagId } })
      }
      // this.$router.push({path: '/specialTag'})

      // this.showEdit = true
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
