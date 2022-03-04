<template>
  <div>

    <el-form ref="menu" :model="menu" label-position="left" label-width="130px" class="form-class">
      <div class="div-class">

        <el-form-item label="动态人群: " style="width: 500px">
          <div
            class="filed-row"
            v-for="(field, key) in menu.fields"
            :key="key"
          >
            <!-- v-dragging="{ list: menu.fields, item: field, group: 'fieldsTab' }" -->
            <!-- < > -->
              <el-input
                v-model="field.label"
                placeholder="优先级"
                clearable
                style="width: 100px;">
              </el-input>
              <span class="split-line">—</span>
              <el-input
                v-model="field.prop"
                placeholder="名称"
                clearable
                style="width: 300px;"
              >
              </el-input>

              <div style="display:flex">
                <!-- <el-button type="text" icon="el-icon-rank" :title="$t('dragSort')"></el-button> -->
                <!-- <el-button type="text" icon="el-icon-delete" @click="handleReduceFiled(key)"></el-button> -->
                <el-button type="text" icon="el-icon-remove-outline" class="delete-btn" @click="handleReduceFiled(key)" ></el-button>
              </div>
          </div>
          <!-- </div> -->
          <div class="filed-row " >
            <el-button @click="handleAddFiled" icon="el-icon-plus" class="add-btn">添加</el-button>
          </div>

        </el-form-item>

        <el-form-item label="是否做AB实验:" prop="abTest">
          <el-radio-group v-model="menu.abTest">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="对比人群: " v-if="menu.abTest">
          <el-input
            v-model="menu.abObj.name"
            placeholder="名称"
            clearable
            style="width: 300px;">
          </el-input>

          <span class="ratio">
            占比：
            <el-input v-model="menu.abObj.ratio" placeholder="占比" style="width: 50px;"></el-input>
            %
          </span>
        </el-form-item>
      </div>

      <el-form-item label-width="0">
        <el-button type="info" @click="handleBackPrevStep">上一步</el-button>
        <!-- <el-button type="warning" @click="handleSave(0)">跳过保存</el-button> -->
        <!-- <el-button type="primary" @click="handleSave(1)">下一步</el-button> -->
        <el-button type="primary" @click="handleToNextStep(2)">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  components: {},
  props: ['recordId', 'tempPolicyAndCrowd', 'routeSource'],
  data () {
    return {
      menu: {
        fields: [{
          field: '123',
          prop: '2143'
        }],
        abTest: true,
        abObj: {
          name: '',
          ratio: 50
        }
      }
    }
  },
  created () {

  },
  methods: {
    // 添加字段
    handleAddFiled () {
      this.menu.fields.push({
        label: '',
        prop: ''
      })
    },
    // 删除字段
    handleReduceFiled (key) {
      this.menu.fields.splice(key, 1)
    },
    handleBackPrevStep () {
      this.$emit('crowdPrevStep', 2, this.recordId)
    },
    handleToNextStep () {
      this.$emit('crowdNextStep', 2, this.recordId)
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
  display flex;
  margin-bottom 10px
}
.split-line{
  margin 0 10px
  color #999
}
.add-btn{
  margin 10px 28px 10px 0
  width 100%
}
.delete-btn{
  color #999
  font-size 16px
  margin-left 10px
}
.ratio {
  margin-left: 60px
}
</style>
