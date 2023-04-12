<template>
  <div>
    <div style="color: red">
      <!-- 第1步 -->
      <!-- :policyId:: {{policyId}}<br/>
      :policyName:: {{ policyName }}<br/>
      :crowdId:: {{ crowdId }}<br/> -->
      <!-- :menu:: {{ menu }}<br/> -->
    </div>
    <el-form ref="menu" :model="menu" label-position="left" label-width="130px" class="form-class">
      <div class="div-class">

        <el-form-item label="接待员: " style="width: 500px">
          <div
            class="filed-row"
            v-for="(field, key) in menu"
            :key="key"
          >
              <el-input
                v-model.trim="field.receptionist"
                placeholder="接待员名称"
                clearable>
              </el-input>

              <el-button
                v-if="menu.length > 1"
                type="text"
                icon="el-icon-delete"
                class="delete-btn"
                @click="handleReduceFiled(field, key)" >
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
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      menu: []
    }
  },
  watch: {
    value (val) {
      this.menu = val
    },
    menu: {
      handler (val) {
        this.$emit('input', val)
      },
      immediate: true
    }

  },
  created () {

  },
  methods: {

    // 添加字段
    handleAddFiled () {
      if (this.menu.length < 32) { // 动态方案数量上限为32
        this.menu.push({
          receptionist: ''
        })
      }
    },

    // 删除字段
    handleReduceFiled (field, key) {
      // 未保存的直接删除，不用走接口
      if (!field.crowdId) {
        return this.menu.splice(key, 1)
      }

      const params = {
        policyId: field.policyId || '',
        crowdId: field.crowdId || ''
      }

      this.$service.delDynamic2Crowd(params, '删除成功').then(() => {
        this.menu.splice(key, 1)
      }).catch(err => {
        console.log('err===', err)
        const current = this.menu[key].receptionist
        this.$confirm(`${current} 在${err.message}, 请确认删除`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认删除
          this.$service.delDynamic2CrowdConfirm(params, '删除成功').then(() => {
            this.menu.splice(key, 1)
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
    }
  }
}
</script>

<style lang='stylus' scoped>
@import './index.styl'

</style>
