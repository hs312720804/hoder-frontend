<template>
<div class="right-block">

  <el-form ref="form" :model="form" label-width="180px">
    <!-- {{ form }} -->
    <el-form-item label="节点ID：">
      {{ form.id }}
    </el-form-item>
    <el-form-item label="节点类型：">
      <el-select v-model="form.type" placeholder="请选择节点类型">
        <el-option
          v-for="item in Object.keys(nodeTypeText)"
          :key="item"
          :label="nodeTypeText[item]"
          :value="Number(item)">
        </el-option>
      </el-select>
      <!-- <el-tag type="success">{{ nodeTypeText[form.type] }}</el-tag> -->
    </el-form-item>
    <el-form-item label="是否为必选项：">
      <el-radio-group v-model="form.isRequired">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="层级：">

    </el-form-item>

    <el-form-item label="数据来源：">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="节点之间的关联：">
      <el-button type="primary" @click="addNode">添加关联节点</el-button>

      <div class="all-list-wrapper">
        <div class="list-item">
          <span class="head-text">
            条件 :
          </span>
        </div>
      </div>

    </el-form-item>
    <el-form-item label="特殊处理：">
      <el-radio-group v-model="form.resource">
        <!-- <el-radio label="线上品牌商赞助"></el-radio>
        <el-radio label="线下场地免费"></el-radio> -->
      </el-radio-group>
    </el-form-item>
    <el-form-item label="节点是否为多选节点：">
      <el-radio-group v-model="form.resource">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import { nodeTypeText } from './enum.js'
export default {
  props: {
    focusNode: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    focusNode: {
      handler (val) {
        this.form = {
          ...this.form,
          ...val
        }
      }
    }
    // form: {
    //   handler (val) {
    //     this.$emit('update:focusNode', '新的name值')
    //   }
    // }
  },
  data () {
    return {
      nodeTypeText: nodeTypeText,
      form: {
        id: 1,
        type: 2,
        isRequired: false,
        dataSource: '',
        relation: ''
      }

    }
  },
  methods: {
    onSubmit () {
      console.log('update:focusNode!')
      this.$emit('updateFocusNode', this.form)
    }
  }
}
</script>
<style>
.list-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
}

.right-block {
  max-width: 500px;
  flex: 0 0 500px;
  position: relative;
  /* // box-shadow: inset -1px 0 0 #e7e7e7; */
  background: aliceblue;
}
</style>
