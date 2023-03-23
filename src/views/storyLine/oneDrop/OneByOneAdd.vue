<template>
  <div>
    <div style="color: red">
      <!-- 第1步
      :policyId:: {{policyId}}<br/>
      :policyName:: {{ policyName }}<br/>
      :crowdId:: {{ crowdId }}<br/>
      :menu:: {{ menu }}<br/> -->
    </div>
    <el-form ref="menu" :model="menu" label-position="left" label-width="130px" class="form-class">
      <div class="div-class">

        <el-form-item label="接待员: " style="width: 500px">
          <div
            class="filed-row"
            v-for="(field, key) in menu.child"
            :key="key"
          >
              <el-input
                v-model="field.crowdName"
                placeholder="接待员名称"
                clearable>
              </el-input>

              <el-button
                v-if="menu.child.length > 1"
                type="text"
                icon="el-icon-delete"
                class="delete-btn"
                @click="handleReduceFiled(field, key, 'child')" >
              </el-button>
          </div>
          <!-- </div> -->
          <div class="filed-row " >
            <el-button @click="handleAddFiled" icon="el-icon-plus" class="add-btn">添加</el-button>
          </div>

        </el-form-item>

      </div>

      <!-- <el-form-item label-width="0">
        <el-button type="info" @click="$emit('goBackCrowdListPage')">返回</el-button>
        <el-button type="primary" @click="handleSave()">下一步</el-button>
      </el-form-item> -->

    </el-form>
  </div>

</template>

<script>
export default {
  data () {
    return {
      menu: {
        policyId: this.policyId,
        crowdId: this.crowdId,
        child: []
      },
      focusIndex: -1
    }
  },
  created () {

  },
  methods: {
    getDynamic2CrowdList () {
      const params = {
        crowdId: this.crowdId // 大人群ID    不能为空
      }
      this.$service.getDynamic2CrowdList(params).then(res => {
        this.menu.child = res || []
      })
    },

    // 添加字段
    handleAddFiled () {
      if (this.menu.child.length < 32) { // 动态方案数量上限为32
        this.menu.child.push({
          crowdName: ''
        })
      }
    },

    // 删除字段
    handleReduceFiled (field, key, mode) {
      // 未保存的直接删除，不用走接口
      if (!field.crowdId) {
        return this.menu[mode].splice(key, 1)
      }

      const params = {
        policyId: field.policyId || '',
        crowdId: field.crowdId || ''
      }

      this.$service.delDynamic2Crowd(params, '删除成功').then(() => {
        this.menu[mode].splice(key, 1)
      }).catch(err => {
        console.log('err===', err)
        const current = this.menu[mode][key].crowdName
        this.$confirm(`${current} 在${err.message}, 请确认删除`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认删除
          this.$service.delDynamic2CrowdConfirm(params, '删除成功').then(() => {
            this.menu[mode].splice(key, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

        // this.$prompt(`${err.message}, 请确认删除`, '', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消'
        // }).then(({ value }) => {

        // })
      })
    },

    // 判断表单是否通过校验
    isValidate () {
      const reg = new RegExp('^[1-9]([0-9])*$')
      const flag1 = this.menu.child.every(item => {
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

    // 人群列表 - 编辑动态人群配置
    handleSave () {
      this.$service.addDynamic2Crowd(this.menu, '操作成功').then(res => {
        this.$emit('crowdNextStep', 1, this.recordId)
      })
    }

  }
}
</script>

<style lang='stylus' scoped>
@import './index.styl'

</style>
