<template>
  <div>
    <div style="color: red">
      <!-- 第1步
      :policyId:: {{policyId}}<br/>
      :policyName:: {{ policyName }}<br/>
      :crowdId:: {{ crowdId }}<br/>
      :form:: {{ form }}<br/> -->
    </div>

    <el-form ref="form" :model="form" label-position="left" label-width="130px" class="form-class">
      <div class="div-class">

        <el-form-item label="实验有效期：" style="width: 600px" prop="dynamicTime">
          <div
            class="filed-row"
            v-for="(field, key) in form.dynamicTime"
            :key="key"
          >
            <el-date-picker
              v-model="field.range"
              type='datetimerange'
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              align="right"
              :default-time="['', '23:59:59']">
            </el-date-picker>

            <el-button
              v-if="form.dynamicTime.length > 1"
              type="text"
              icon="el-icon-remove-outline"
              class="delete-btn"
              @click="handleReduceFiled(field, key, 'dynamicTime')" >
            </el-button>
          </div>

          <div class="filed-row" >
            <el-button @click="handleAddFiled" icon="el-icon-plus" class="add-btn">添加</el-button>
          </div>
        </el-form-item>

      </div>

      <!-- <el-form-item label-width="0">

        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <el-button type="primary" @click="handleSave">完成</el-button>
      </el-form-item> -->

    </el-form>

    <!-- <el-form :model="divideForm" :rules="divideFormRules" ref="divideForm" label-width="120px">
      <el-form-item label="实验有效期：" prop="validityTime">
          <el-date-picker
              v-model="divideForm.validityTime"
              type='datetimerange'
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              align="right">
          </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleBackPrevStep">上一步</el-button>
        <el-button type="primary" @click="finish('divideForm')">完成</el-button>
      </el-form-item>
    </el-form> -->
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: ['policyId', 'crowdId'],
  computed: {
    ...mapGetters(['policyName'])
  },
  data () {
    return {
      form: {
        // policyId: this.policyId,
        crowdId: this.crowdId,
        dynamicTime: [{ range: [] }]
      },
      focusIndex: -1,
      divideFormRules: {
        validityTime: [
          { type: 'array', required: true, message: '请选择实验有效期', trigger: 'blur' }
        ]
      }
      // divideForm: {
      //   crowdId: undefined,
      //   crowdName: undefined,
      //   pct: [],
      //   validityTime: ''
      // }
    }
  },
  created () {
    if (this.crowdId) {
      this.getDynamicTime() // 获取实验有效期
    }
  },
  methods: {
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 2)
    },

    getDynamicTime () {
      const params = {
        crowdId: this.crowdId // 大人群ID    不能为空
      }
      this.$service.getDynamicTime(params).then(res => {
        this.form.dynamicTime = res.map(item => {
          return {
            range: [item.start, item.end]
          }
        }) || []
      })
    },

    // 添加字段
    handleAddFiled () {
      if (this.form.dynamicTime.length < 10) { // 时间上限为10
        this.form.dynamicTime.push({
          range: []
        })
      } else {
        this.$message.warning('实验有效期上限为 10 组')
      }
    },

    // 删除字段
    handleReduceFiled (field, key, mode) {
      // 未保存的直接删除，不用走接口
      // if (!field.crowdId) {
      this.form[mode].splice(key, 1)
      // }

      // const params = {
      //   policyId: field.policyId || '',
      //   crowdId: field.crowdId || ''
      // }

      // this.$service.delDynamic2Crowd(params, '删除成功').then(() => {
      //   this.form[mode].splice(key, 1)
      // }).catch(err => {
      //   console.log('err===', err)
      //   const current = this.form[mode][key].crowdName
      //   this.$confirm(`${current} 在${err.message}, 请确认删除`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     // 确认删除
      //     this.$service.delDynamic2CrowdConfirm(params, '删除成功').then(() => {
      //       this.form[mode].splice(key, 1)
      //     })
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     })
      //   })
      // })
    },
    // 判断表单是否通过校验
    isValidate () {
      const reg = new RegExp('^[1-9]([0-9])*$')
      const flag1 = this.form.dynamicTime.every(item => {
        // 校验人群名
        const flag2 = !!item.crowdName
        return flag1 && flag2
      })

      const flag2 = this.form.controlGroup.every(item => {
        // // 优先级是否为正整数
        // const isPriorityNum = !item.priority || reg.test(item.priority)
        // 比例是否为正整数
        const isFlowNum = reg.test(item.flowNum)
        // 校验人群名
        const flag3 = !!item.crowdName
        return isFlowNum && flag3
      })

      const flag = flag1 && flag2

      if (!flag) {
        this.$message({
          showClose: true,
          message: '请将表单填写完整',
          type: 'error'
        })
      }

      return flag
    },

    // 人群列表 - 保存实验有效期
    handleSave () {
      const flag = this.form.dynamicTime.some(item => {
        return item.range.length === 0
      })
      if (flag) return this.$message.warning('请将表单填写完整')

      const dynamicTime = this.form.dynamicTime.map(item => {
        return {
          start: item.range[0],
          end: item.range[1]
        }
      })
      const parmas = {
        crowdId: this.form.crowdId,
        dynamicTime: dynamicTime
      }
      this.$service.setDynamicTime(parmas, '操作成功').then(res => {
        this.$emit('goBackCrowdListPage')
      })
    }

  }
}
</script>

<style lang='stylus' scoped>
.form-class{
  width: 80%;
  margin: 0 auto 20px;
}
.div-class{
  padding: 20px;
  background-color: rgba(249,249,249,0.85);
  margin-bottom 20px
}
.filed-row {
  margin-bottom 15px
  position relative
}
.split-line{
  margin 0 10px
  color #999
}
.add-btn{
  margin 10px 28px 10px 0
  width 400px
}
.delete-btn{
  color #999
  font-size 16px
  margin-left 10px
  position: absolute;
}
.ratio {
  margin-left: 60px
}
.flow-num{
  width 50px
}
.tip-box{
  position: absolute;
  z-index: 99;
  width: 999px;
  color: #999;
  font-size: 12px;
  top: 36px;
  height: 15px;
  line-height: 15px;
}
</style>
