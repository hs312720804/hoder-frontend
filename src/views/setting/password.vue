<template>
  <div class="modifyPassword">
    <el-form
      :label-position="labelPosition"
      label-width="200px"
      :model="passwordModify"
      ref="passwordModify"
      :rules="rulesPwd"
    >
      <el-form-item label="原密码" prop="pwd">
        <el-input v-model="passwordModify.pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="passwordModify.newPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="reNewPwd">
        <el-input v-model="passwordModify.reNewPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savePassword">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordModify.reNewPwd !== "") {
          this.$refs.passwordModify.validateField("reNewPwd");
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != this.passwordModify.newPwd) {
        callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "right",
      passwordModify: {
        pwd: "",
        newPwd: "",
        reNewPwd: ""
      },
      rulesPwd: {
        pwd: [{ validator: validateOldPass, trigger: "blur" }],
        newPwd: [{ validator: validatePass, trigger: "blur" }],
        reNewPwd: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    savePassword: function() {
      const pwd = this.passwordModify.pwd;
      const newPwd = this.passwordModify.newPwd;
      const reNewPwd = this.passwordModify.reNewPwd;
      this.$refs.passwordModify.validate(valid => {
        if (valid) {
          this.$service
            .modifyPwd({ pwd: pwd, newPwd: newPwd, reNewPwd: reNewPwd })
            .then(data => {
              console.log(data);
              this.$message("密码保存成功，请重新登录");
              this.$logout().then(() => {
                this.$router.push({ name: "login" });
              });
            });
        }
      });
    }
  }
};
</script>
<style scoped>
.modifyPassword {
  width: 500px;
}
</style>
