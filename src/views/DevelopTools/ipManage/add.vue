<template>
    <div class="ipManageAdd">
        <div class="title">{{title}}</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="130px">
            <el-form-item label="业务分组" prop="groups" :required="true">
                <el-select v-model="form.groups" :disabled="disableValue" multiple>
                    <el-option v-for="(item,index) in groupList" :label="item.biName" :key="index" :value="item.biId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="sshUsername" :required="true">
                <el-input v-model.trim="form.sshUsername" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="sshPassword" :required="true">
                <el-input v-model.trim="form.sshPassword" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="接口项目地址" prop="projectDir" :required="true">
                <el-input v-model.trim="form.projectDir" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="刷新地址" prop="reloadApi" :required="true">
                <el-input v-model.trim="form.reloadApi" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="lua脚本地址" prop="luaPath" :required="true">
                <el-input v-model.trim="form.luaPath" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="ip地址" prop="host" :required="true">
                <el-input v-model.trim="form.host" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="sshPort" :required="true">
                <el-input v-model.trim="form.sshPort" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model.trim="form.remark" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="启动/禁用" v-model="form.status" :required="true">
                <el-radio-group v-model="form.status" :disabled="disableValue">
                    <el-radio  :label="1">启用</el-radio>
                    <el-radio  :label="2">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="save" v-if="this.mode!= 'read'">保存</el-button>
                <el-button @click="goBack">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'peoplePositionAdd',
  props: {
    editId: '',
    mode: ''
  },
  data () {
    var checkNoSpace = (rule, value, callback) => {
      if (!value) {
        callback(new Error('该字段不能为空'))
      } else if (!value.trim()) {
        callback(new Error('该字段不能全部为空格'))
      } else {
        callback()
      }
    }
    return {
      form: {
        groups: [],
        sshUsername: '',
        sshPassword: '',
        projectDir: '',
        reloadApi: '',
        luaPath: '',
        host: '',
        sshPort: '',
        remark: '',
        status: 1
      },
      groupList: [],
      title: '',
      disableValue: false,
      rules: {
        group: [
          { required: true, message: '请选择业务分组', trigger: 'blur' }
        ],
        sshUsername: [
          { validator: checkNoSpace, trigger: 'blur' }
        ],
        sshPassword: [
          { validator: checkNoSpace, trigger: 'blur' }
        ],
        projectDir: [
          { validator: checkNoSpace, trigger: 'blur' }
        ],
        reloadApi: [
          { validator: checkNoSpace, trigger: 'blur' }
        ],
        luaPath: [
          { validator: checkNoSpace, trigger: 'blur' }
        ],
        host: [
          { validator: checkNoSpace, trigger: 'blur' }
        ],
        sshPort: [
          { validator: checkNoSpace, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getGroupList () {
      this.$service.getBiList().then(
        (data) => {
          this.groupList = data
          // this.groupList = this._arrayingOption(data,'biName','biId')
          if (this.editId) { this.getDetail() }
        }
      )
    },
    getDetail () {
      this.$service.getIpManageDetail(this.editId).then(
        (data) => {
          this.form = data
        }
      )
    },
    // 数组化[{label, value}]
    _arrayingOption (arr, label, value) {
      return arr.reduce((result, item) => {
        return result.concat({ label: item[label], value: item[value] })
      }, [])
    },
    goBack () {
      this.$emit('open-list-page')
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.editId === undefined) {
            this.$service.addIpManage(this.form, '保存成功').then(() => {
              this.$emit('open-list-page')
            })
          } else {
            this.$service.updateIpManage({ data: this.form, id: this.editId }, '修改成功').then(() => {
              this.$emit('open-list-page')
            })
          }
        }
      })
    }
  },
  created () {
    this.getGroupList()
    if (this.editId === undefined) {
      this.title = '新增IP管理'
    } else {
      if (this.mode === 'edit') {
        this.title = '编辑IP管理'
      } else {
        this.title = '查看IP管理详情'
        this.disableValue = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .ipManageAdd
        width 80%
        margin-left 20px
    .title
        margin 20px
        font-size 30px
    .example
        font-size 12px
        color #ccc
    .example div
        overflow auto
    .ipManageAdd >>>.el-select
        width: 100%
</style>
