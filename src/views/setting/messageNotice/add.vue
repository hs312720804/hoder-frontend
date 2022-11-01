<template>
  <div>
    <template v-if="mode === 'read'">
      <div class="header-title">消息详情</div>
      <div class="read-content">
        <div class="notice-title">
          {{ readForm.noticeTitle }}
        </div>
        <div class="notice-time">时间：{{ readForm.pushTime }}</div>
        <textarea
          readonly
          class="notice-content"
          style="width: 100%; border: none; height: 300px; outline: none"
          v-model="readForm.content"
        ></textarea>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </template>
    <template v-else>
      <div class="header-title">{{ addFormTitle }}</div>
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="add-form"
      >
        <el-form-item label="标题" prop="noticeTitle">
          <el-input v-model="addForm.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item label="消息类型" prop="noticeType">
          <el-select v-model="addForm.noticeType">
            <el-option :value="1" label="升级消息"></el-option>
            <el-option :value="2" label="系统通知"></el-option>
            <el-option :value="3" label="标签更新"></el-option>
          </el-select>
          <!-- 编辑的时候不显示 是否发送单选框 -->
          <span style="margin: 0 20px">是否发送邮件：</span>
          <el-radio-group v-if="!editId" v-model="addForm.sendEmail">
            <el-radio :label="false">不发送</el-radio>
            <el-radio :label="true">发送</el-radio>
          </el-radio-group>
          <span v-if="addForm.sendEmail"
            >收件人：
            <el-select v-model="receive">
              <el-option value="all" label="全部DMP用户"></el-option>
            </el-select>
          </span>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :rows="6"
            v-model="addForm.content"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('ruleForm')"
            >确定</el-button
          >
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      readForm: {
        noticeTitle: '',
        pushTime: '',
        content: ''
      },
      markEnum: {
        edit: 1,
        read: 2
      },
      addFormTitle: '',
      addForm: {
        noticeTitle: '',
        noticeType: 1,
        content: '',
        noticeId: undefined,
        sendEmail: false
      },
      rules: {
        noticeTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '请选择消息类型', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ]
      },
      receive: 'all'
    }
  },
  props: {
    editId: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    }
  },
  watch: {
    editId () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      const noticeId = this.editId
      const mark = this.markEnum[this.mode]
      const mode = this.mode
      if (noticeId) {
        this.addFormTitle = '编辑'
        this.$service.noticeDetail({ noticeId, mark }).then((data) => {
          if (mode === 'read') {
            this.readForm = data
            this.$root.$emit('refresh-notifications')
          }
          if (mode === 'edit') {
            this.addForm = data
          }
        })
      } else {
        this.addFormTitle = '新增'
      }
    },
    goBack () {
      this.$emit('open-list-page')
    },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.editId) {
            // 新增保存
            this.$service.noticeAdd(this.addForm, '保存成功').then(() => {
              this.$emit('open-list-page')
              this.$root.$emit('refresh-notifications')
            })
          } else {
            // 编辑保存
            this.addForm.noticeId = this.editId
            this.$service.noticeEdit(this.addForm, '修改成功').then(() => {
              this.$emit('open-list-page')
              this.$root.$emit('refresh-notifications')
            })
          }
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
.header-title {
  background: #ccc;
  padding: 15px;
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}

.read-content {
  margin: 30px;
}

.notice-title {
  font-size: 18px;
  color: #333;
}

.notice-time {
  color: #999;
  font-size: 14px;
  margin: 10px 0 20px 0;
}

.notice-content {
  color: #000;
  text-indent: 20px;
  line-height: 1.5;
  margin-bottom: 40px;
}

.add-form {
  width: 80%;
}
</style>
