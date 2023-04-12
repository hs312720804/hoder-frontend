<template>
  <div>
    <div class="formBox" v-for="(item, index) in ruleForm" :key="index" style="border:1px solid #ccc;margin-top: 20px;">
      <el-form :model="ruleForm[index]" :rules="rules" :ref="'ruleFormRef'+index" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="item.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="item.desc"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="submitForm('ruleFormRef')">立即创建</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleFormRef: {

      },
      ruleForm: [{
        name: '',
        region: '',
        desc: ''
      }, {
        name: '',
        region: '',
        desc: ''
      }, {
        name: '',
        region: '',
        desc: ''
      }],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      const falg = []
      console.log(formName)
      for (let index = 0; index < this.ruleForm.length; index++) {
        console.log(this.$refs[formName + index])
        this.$refs[formName + index][0].validate((valid) => {
          if (valid) {
            falg.push(1)
          }
        })
      }
      if (falg.length == this.ruleForm.length) {
        alert(1)
      } else {
        alert('校验失败')
      }
    }

  }
}
</script>
