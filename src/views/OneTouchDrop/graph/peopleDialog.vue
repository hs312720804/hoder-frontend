<template>
    <div class="peopleDialog-wrap">
        <el-dialog title="人群配置" :visible.sync="show.is" width="30%">
            <div class="content">
                <el-form label-position="right" ref="peopleFormRef" label-width="140px" :model="peopleForm" :rules="rules">
                    <el-form-item label="人群ID：" v-if="id">
                        <el-input disabled="" v-model="id"></el-input>
                    </el-form-item>
                    <el-form-item label="人群名称：" prop="name">
                        <el-input v-model="peopleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="人群影响时间：" prop="time">
                        <el-row :gutter="10">
                            <el-col :span="3">&gt;=</el-col>
                            <el-col :span="12">
                                <el-input v-model="peopleForm.time"></el-input>
                            </el-col>
                            <el-col :span="7">
                                <el-select v-model="peopleForm.type" placeholder="请选择">
                                    <el-option label="天" value="day"></el-option>
                                    <el-option label="小时" value="hour"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <!--<el-form-item label="人群曝光次数：" prop="frequency">-->
                        <!--<el-row :gutter="10">-->
                            <!--<el-col :span="3">&gt;=</el-col>-->
                            <!--<el-col :span="17">-->
                                <!--<el-input v-model="peopleForm.frequency"></el-input>-->
                            <!--</el-col>-->
                            <!--<el-col :span="2">次</el-col>-->
                        <!--</el-row>-->
                    <!--</el-form-item>-->
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show.is = false">取 消</el-button>
                <el-button type="primary" @click="savePeople">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'peopleDialog',
  props: {
    show: {
      type: Object,
      default () {
        return {
          is: false
        }
      }
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      peopleForm: {
        name: '',
        time: '',
        type: 'day',
        frequency: ''
      },
      rules: {
        name: [{ required: true, message: '请输入人群名称', trigger: 'blur' }],
        time: [{ required: true, message: '请输入人群影响时间', trigger: 'blur' }],
        frequency: [{ required: true, message: '请输入人群曝光次数', trigger: 'blur' }]
      },
      id: null
    }
  },
  methods: {
    savePeople () {
      this.$refs.peopleFormRef.validate(valid => {
        if (valid) {
          const { name, time, type, frequency } = this.peopleForm
          const data = {
            strategyNodeName: name,
            condition: {
              times: {
                operation: '>=',
                val: frequency
              },
              time: {
                operation: '>=',
                val: time,
                type
              }
            }
          }
          this.$emit('savePeople', data)
        } else {
          return false
        }
      })
    }
  },
  watch: {
    show: {
      handler (val) {
        if (val.is) {
          this.$nextTick(() => {
            // 编辑信息时
            if (this.info.strategyNodeId || this.info.strategyNodeName) {
              const { strategyNodeName, time: { val, type }, frequency, id } = this.info
              this.peopleForm = {
                name: strategyNodeName,
                time: val,
                type: type,
                frequency
              }
              this.id = id
            } else {
              this.peopleForm = {
                name: '',
                time: '',
                type: 'day',
                frequency: ''
              }
            }
            this.$refs.peopleFormRef.resetFields()
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
