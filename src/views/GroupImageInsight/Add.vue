<template>
    <el-dialog :visible.sync="showAddForm" :title="title" @close="$emit('close-add')">
        <el-form :model="form" ref="addForm" :rules="addFormRule" label-position="left" label-width="80px">
            <slot :slotData="slotData">
            </slot>
            <el-form-item label="文件类型" prop="type">
                <el-radio :label="0" v-model="form.type">上传excel文件</el-radio>
                <el-radio :label="1" v-model="form.type">上传txt文件</el-radio>
            </el-form-item>
            <el-form-item label="">
                <input style="display: none" @change="handleSelectFile" type="file" ref="upload"></input>
                <el-button @click="handleUploadFile">上传</el-button>
                <span>【请上传只包含mac地址的单列文件】</span>
                <div v-if="form.originFileName">{{form.originFileName}} 上传成功</div>
                <div class="error-tips">{{ message }}</div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      slotData: {
        name: ''
      },
      form: {
        type: undefined,
        fileName: undefined,
        originFileName: undefined
      },
      message: '',
      showAddForm: true,
      addFormRule: {
        type: [{ required: true, message: '请选择文件类型' }],
      }
    }
  },
  props: {
    title: {
      type: String,
      default: '请上传MAC包'
    }
  },
  watch: {
    'form.type': function() {
      this.message = ''
      this.resetFormFile()
      this.$refs.upload.value = ''
    }
  },
  methods: {
    handleSelectFile(event) {
      this.message = ''
      if (event.currentTarget.files[0] !== '') {
        const fileName = event.currentTarget.files[0].name
        const extension = fileName.split('.')[1] === 'xls'
        const extension2 = fileName.split('.')[1] === 'xlsx'
        const extension3 = fileName.split('.')[1] === 'txt'
        if (this.form.type === 0) {
          if (!extension && !extension2) {
            this.message = '上传模板只能是 xls、xlsx格式!'
            this.resetFormFile()
            return
          }
        } else if (this.form.type === 1) {
          if (!extension3) {
            this.message = '上传模板只能是txt格式!'
            this.resetFormFile()
            return
          }
        }
      } else {
        this.message = '文件不能为空'
        this.resetFormFile()
        return
      }
      const fileName = event.currentTarget.files[0]
      const formData = new FormData()
      formData.append('fileName', fileName)
      this.$service
        .devicePortraitFileUpload(formData, '文件上传成功')
        .then(data => {
          this.form.fileName = data.fileName
          this.form.originFileName = data.originalFilename
        })
        .catch(e => {
          this.$message.error(e)
          this.resetFormFile()
        })
    },
    resetFormFile() {
      this.form.fileName = undefined
      this.form.originFileName = undefined
    },
    handleUploadFile() {
      if (this.form.type === undefined) {
        this.message = '请先选择文件类型！'
        return
      }
      this.$refs.upload.click()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const form = this.form
          const formData = JSON.parse(JSON.stringify(form))
          if (form.fileName != undefined && form.originFileName != undefined) {
            this.$emit('save-form', formData)
            // this.$emit('upsert-end')
            // this.$emit('close-add')
          } else {
            this.message = '请检查文件格式是否不对或者为空'
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.error-tips {
  color: red;
}
</style>
