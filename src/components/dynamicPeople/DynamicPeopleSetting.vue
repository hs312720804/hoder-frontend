<template>
  <div>
    <!-- <div style="color: red">
      第3步
      isDynamicPeople: {{isDynamicPeople}} <br/>
      :policyId:: {{policyId}}<br/>
      :policyName:: {{ policyName }}<br/>
      :crowdId:: {{ crowdId }}<br/>
    </div> -->
    <el-form ref="menu" :model="menu" label-position="left" label-width="130px" class="form-class">
      <div class="div-class">

        <el-form-item label="动态人群: " style="width: 500px">
          <div class="filed-row">
            占比：
            <el-input
              v-model="menu.flowNum"
              placeholder=""
              class="flow-num"
              @blur="numberInt($event)">
            </el-input>
            %
          </div>
          <div
            class="filed-row"
            v-for="(field, key) in menu.dynamicCrowd"
            :key="key"
          >
            <!-- v-dragging="{ list: menu.list, item: field, group: 'fieldsTab' }" -->
            <!-- < > -->
              <el-input
                v-model="field.priority"
                placeholder="优先级"
                clearable
                style="width: 100px;"
                @blur="numberInt($event)">
              </el-input>
              <span class="split-line">—</span>
              <el-input
                v-model="field.crowdName"
                placeholder="人群名称"
                clearable
                style="width: 200px;"
              >
              </el-input>

              <el-button v-if="menu.dynamicCrowd.length > 2" type="text" icon="el-icon-remove-outline" class="delete-btn" @click="handleReduceFiled(field, key, 'dynamicCrowd')" ></el-button>
          </div>
          <!-- </div> -->
          <div class="filed-row " >
            <el-button @click="handleAddFiled" icon="el-icon-plus" class="add-btn">添加</el-button>
          </div>

        </el-form-item>

        <el-form-item label="是否做AB实验:" prop="ab">
          <el-radio-group v-model="menu.ab">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="对比人群: " v-if="menu.ab" style="width: 700px">
          <!-- <el-input
            v-model="menu.controlGroupName"
            placeholder="名称"
            clearable
            style="width: 300px;">
          </el-input> -->
          <div
            class="filed-row"
            v-for="(field, key) in menu.controlGroup"
            :key="key"
          >
            <!-- v-dragging="{ list: menu.list, item: field, group: 'fieldsTab' }" -->
            <!-- < > -->

              <el-input
                v-model="field.crowdName"
                placeholder="人群名称"
                clearable
                style="width: 200px;"
              >
              </el-input>
              <el-button type="text" icon="el-icon-remove-outline" class="delete-btn" @click="handleReduceFiled(field, key, 'controlGroup')" ></el-button>
              <!-- <span class="split-line">—</span> -->
              <span class="filed-row" style="margin-left: 40px;">
                占比：
                <el-input
                  v-model="field.flowNum"
                  placeholder=""
                  class="flow-num"
                  style="width: 50px;"
                  @blur="numberInt($event)">
                </el-input>
                %
              </span>

          </div>
          <!-- </div> -->
          <div class="filed-row " >
            <el-button @click="handleAddControl" icon="el-icon-plus" class="add-btn">添加</el-button>
          </div>
        </el-form-item>
      </div>
      <el-form-item v-if="dynamicMode === 'editSingle'" label-width="0">
        <el-button type="info" @click="$emit('goBackCrowdListPage')">返回</el-button>
        <el-button type="primary" @click="handleSave(0)">保存</el-button>
      </el-form-item>

      <el-form-item v-else label-width="0">
        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <!-- <el-button type="warning" @click="handleSave(0)">跳过保存</el-button> -->
        <el-button type="primary" @click="handleSave(1)">下一步</el-button>
        <!-- <el-button type="primary" @click="handleToNextStep(2)">下一步</el-button> -->
      </el-form-item>

    </el-form>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: ['isDynamicPeople', 'policyId', 'crowdId', 'dynamicMode'],
  computed: {
    ...mapGetters(['policyName'])
  },
  data () {
    return {
      menu: {
        dynamicCrowd: [{
          crowdName: '',
          priority: ''
        }],
        controlGroup: [],
        ab: 0,
        // controlGroupName: '',
        flowNum: 50
      }
    }
  },
  created () {
    if (this.crowdId) {
      this.$service.getDynamicCrowd({ crowdId: this.crowdId }).then(res => {
        this.menu = res && res.dynamicCrowd ? res : {
          dynamicCrowd: [{
            crowdName: '',
            priority: 1
          }, {
            crowdName: '',
            priority: 2
          }],
          controlGroup: [],
          ab: 0,
          flowNum: 50
        }
        this.menu.dynamicCrowd = this.menu.dynamicCrowd || []
        this.menu.controlGroup = this.menu.controlGroup || []
      })
    }
  },
  methods: {
    // number (e) {
    //   console.log('e===', e)

    //   this.famount = this.famount.replace([^\.\d/g, '')

    //   this.famount = this.famount.replace('.', '')
    // },
    numberInt (e) {
      console.log(e.target.value)
      let flag = new RegExp('^[1-9]([0-9])*$').test(e.target.value)
      console.log(flag)

      if (!flag) {
        this.$message({
          showClose: true,
          message: '请输入正整数',
          type: 'warning'
        })
        e.target.value = ''
      }
    },
    // 添加字段
    handleAddFiled () {
      const len = this.menu.dynamicCrowd.length + 1 || 1
      this.menu.dynamicCrowd.push({
        crowdName: '',
        priority: len
      })
    },
    handleAddControl () {
      this.menu.controlGroup.push({
        crowdName: '',
        flowNum: ''
      })
    },
    // 删除字段
    handleReduceFiled (field, key, mode) {
      if (!field.crowdId) {
        return this.menu[mode].splice(key, 1)
      }
      const params = {
        policyId: field.policyId || '',
        crowdId: field.crowdId || ''
      }

      this.$service.delDynamicCrowd(params).then(() => {
        this.menu[mode].splice(key, 1)
      })
    },
    handleBackPrevStep () {
      // 待定
      // this.$emit('handleDynamicCrowdNextStep', this.policyId, this.policyName, res.crowdId)
      this.$emit('crowdPrevStep', 2, this.recordId)
    },

    // 判断表单是否通过校验
    isValidate () {
      let reg = new RegExp('^[1-9]([0-9])*$')
      const flag1 = this.menu.dynamicCrowd.every(item => {
        // 优先级是否为正整数
        const flag1 = item.priority && reg.test(item.priority)
        // 校验人群名
        const flag2 = !!item.crowdName
        return flag1 && flag2
      })

      const flag2 = this.menu.controlGroup.every(item => {
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
    // 下一步 - 保存
    // handleToNextStep () {
    //   // 校验优先级是否为正整数
    //   if (!this.isValidate()) {
    //     return
    //   }
    //   this.menu.policyId = this.policyId
    //   this.menu.crowdId = this.crowdId
    //   this.menu.crowdName = `${this.policyName}(动态人群)`
    //   this.menu.dynamicCrowd = this.menu.dynamicCrowd.map(item => {
    //     return {
    //       ...item,
    //       crowdName: item.crowdName,
    //       priority: Number(item.priority)
    //     }
    //   })
    //   this.menu.controlGroup = this.menu.controlGroup.map((item, index) => {
    //     return {
    //       ...item,
    //       priority: item.priority ? Number(item.priority) : Number(index + 1)
    //     }
    //   })
    //   this.$service.addDynamicCrowd(this.menu).then(res => {
    //     this.$emit('crowdNextStep', 2, this.recordId)
    //   })
    // },

    // 人群列表 - 编辑动态人群配置
    handleSave (mode) {
      // 校验优先级是否为正整数
      if (!this.isValidate()) {
        return
      }
      this.menu.policyId = this.policyId
      this.menu.crowdId = this.crowdId
      this.menu.crowdName = `${this.policyName}(动态人群)`
      this.menu.dynamicCrowd = this.menu.dynamicCrowd.map(item => {
        return {
          ...item,
          crowdName: item.crowdName,
          priority: Number(item.priority)
        }
      })
      this.menu.controlGroup = this.menu.controlGroup.map((item, index) => {
        return {
          ...item,
          priority: item.priority ? Number(item.priority) : Number(index + 1)
        }
      })
      // 人群列表 - 编辑动态人群配置
      if (mode === 0) {
        this.$service.addDynamicCrowd(this.menu, '操作成功').then(res => {
          this.$emit('goBackCrowdListPage', true)
        })
      } else { // 下一步 - 保存
        this.$service.addDynamicCrowd(this.menu, '操作成功').then(res => {
          this.$emit('crowdNextStep', 2, this.recordId)
        })
      }
    },
    resetFormData () {
      this.$emit('resetFormData')
    },
    handleDirectStrategyListBrother () {
      this.$emit('handleDirectStrategyList')
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
.filed-row{
  margin-bottom 10px
}
.split-line{
  margin 0 10px
  color #999
}
.add-btn{
  margin 10px 28px 10px 0
  width 369px
}
.delete-btn{
  color #999
  font-size 16px
  margin-left 10px
}
.ratio {
  margin-left: 60px
}
.flow-num{
  width 50px
}
</style>
