<template>
    <el-dialog
            title="提交该历史数据"
            :visible="setShowCommitHistoryDialog"
            @close="handleDialogClose"
    >
        <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="是否开启提交:">
                <el-radio v-model="form.isSubmit" :label="1">是</el-radio>
                <el-radio v-model="form.isSubmit" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="计算有效期:" v-if="form.isSubmit === 1">
                <el-select v-model="form.expiryDate">
                    <el-option
                            v-for="(item,index) in expiryDateArray"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-button @click="handleDialogClose">取消</el-button>
                <el-button @click="handleSubmit" type="primary">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: 'CommitHistory',
  data () {
    return {
      form: {
        isSubmit: 1,
        expiryDate: 7,
        expiryDateArray: [],
        showCommitHistoryDialog: undefined
      }
    }
  },
  props: ['setShowCommitHistoryDialog', 'crowdId'],
  methods: {
    handleSetExpiryDateArray (maxDay) {
      const array = []
      for (let i = 0; i < maxDay; i++) {
        array.push({ label: (i + 1) + '天', value: i + 1 })
      }
      return array
    },
    handleDialogClose () {
      this.$emit('closeDialog')
    },
    handleSubmit () {
      const form = this.form
      const submitForm = {
        isSubmit: form.isSubmit,
        id: this.crowdId,
        dateNum: form.isSubmit === 1 ? form.expiryDate : undefined
      }
      this.$emit('submit', submitForm)
    }
  },
  created () {
    this.expiryDateArray = this.handleSetExpiryDateArray(30)
  }
}
</script>

<style scoped>

</style>
