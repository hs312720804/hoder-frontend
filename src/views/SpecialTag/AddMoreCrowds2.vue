<template>
  <div>
      <!-- v-model="form.rulesJson" -->
      <CrowdAdd
        pageType="specialTag"
        ref="CrowdAdd"
        :crowd="crowd"
        prop-prefix="rulesJson."
        :initTagList="initTagList"
        @back="handleBackPrevStep"
        @save="handleSave"
      />
      <!-- <el-form-item>
        <el-button type="info" @click="handleBackPrevStep">返回</el-button>
        <el-button type="primary" @click="handleSave()">保存</el-button>
      </el-form-item> -->
  </div>
</template>
<script>
// import CrowdAdd from './CrowdAdd2.vue'
import CrowdAdd from '@/views/crowdStrategy/crowdAdd.vue'
export default {
  components: {
    CrowdAdd
  },
  data: function () {
    return {
      crowd: {}
    }
  },
  // props: ['recordId'],
  props: ['initTagList'],
  inject: ['sTagIndex'],
  methods: {

    handleSave (data) {
      console.log('data-->', data)
      const crowd = this.crowd
      const tagIds = this.initTagList.map((e) => e.tagId) || []
      const form = {
        specialTagName: data.crowdName,
        rulesJson: data.rulesJson,
        behaviorRulesJson: data.behaviorRulesJson,
        dynamicPolicyJson: data.dynamicPolicyJson,
        tagIds: tagIds.join(',') // 所用 tag
        // belongTagId: crowd.belongTagId,
        // parentId: crowd.parentId,
        // specialTagId: crowd.specialTagId,
      }

      if (crowd.belongTagId) { // 编辑
        form.belongTagId = crowd.belongTagId
        form.parentId = crowd.parentId
        form.specialTagId = crowd.specialTagId
      } else { // 新增
        form.belongTagId = Number(this.$route.query.belongTagId)
        form.parentId = 0
      }

      if (this.$route.query.specialTagId) { // 编辑
        this.$service.editSpecialTag({ rulesJson: form }, '保存成功').then((data) => {
          // this.$emit('handleToNextStep',this.recordId,data)
          // alert('成功！')
          // 返回
          this.$router.push({
            path: '/labelSquare',
            query: {
              refresh: true
            }
          })
        })
      } else {
        this.$service.addSpecialTag({ rulesJson: form }, '新建成功').then((data) => {
          // this.$emit('handleToNextStep',this.recordId,data)
          // alert('成功！')
          // 返回
          this.$router.push({
            path: '/labelSquare',
            query: {
              refresh: true
            }
          })
        })
      }
    },

    handleBackPrevStep () {
      this.$emit('handleBackPrevStep', this.recordId)
    },
    checkNum (num) {
      const numInt = parseInt(num)
      if ((/(^\d+$)/).test(num) && numInt <= 9999) {
        return true
      } else {
        this.$message.error('该值为必填项，且必须是大于等于0的整数且不能超过4位数')
        return false
      }
    }
  },
  created () {
    // 编辑
    this.crowd = this.sTagIndex.specialTagDetail.specialTag || {}
  }
}
</script>
