<template>
<div class="right-block">

  <el-form ref="form" label-position="left" :model="nodeDetail" label-width="100px">
    <!-- {{ form }} -->
    <!-- {{ nodeDetail }} -->
    <el-form-item label="节点ID：">
      {{ nodeDetail.id }}
    </el-form-item>
    <el-form-item label="标签名称：">
      <el-tag type="warningCyan">{{ tagDetail.tagName }}</el-tag>
    </el-form-item>
    <el-form-item label="标签 Code：">
      {{ tagDetail.tagCode }}
    </el-form-item>
    <el-form-item label="节点类型：">
      <el-select v-model="nodeDetail.type" placeholder="请选择节点类型" style="width: 200px">
        <el-option
          v-for="item in Object.keys(nodeTypeText)"
          :key="item"
          :label="nodeTypeText[item]"
          :value="Number(item)">
        </el-option>
      </el-select>
      <!-- <el-tag type="success">{{ nodeTypeText[form.type] }}</el-tag> -->
    </el-form-item>
    <el-form-item label="数据字段：">
      <el-select v-model="nodeDetail.keyName" style="width: 200px" clearable>
        <el-option
          v-for="item in Object.keys(apiData.dict)"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <!-- <el-button type="text" @click="apiDataSet"><i class="el-icon-s-operation"></i>接口数据配置</el-button> -->
      <el-button type="text" @click="showPreview = !showPreview">
        <i class="el-icon-arrow-down"></i>预览效果
      </el-button>

      <div v-if="showPreview" class="aaa">
        <!-- <el-select v-model="preViewVal" style="width: 200px" clearable>
          <el-option
            v-for="item in getOptions(nodeDetail.keyName)"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
        </el-select> -->

        <NodeIndex :nodeType="nodeDetail.type" :options="getOptions(nodeDetail.keyName)"></NodeIndex>
      </div>

    </el-form-item>

    <template v-if="nodeDetail.type === 2">
      <el-form-item label="是否为虚拟递归字段：">
        <el-radio-group v-model="nodeDetail.isDiguiNode">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="nodeDetail.isDiguiNode" label="递归字段：">
        <el-input v-model="nodeDetail.diGuiKeyName" type="text" clearable>
        </el-input>
      </el-form-item>
    </template>

    <!-- <div class="add-button-wrap detail-button-wrap">
      <div>节点之间的关联</div>
    </div> -->

    <!-- 周期范围没有状态 -->
    <template v-if="nodeDetail.type !== 1">
      <el-divider>状态</el-divider>

      <SubAttr
        :nodeList="nodeList"
        :relations="nodeDetail.relations"
        @del="deleteOperate"
        @add="addOperate"
      ></SubAttr>
    </template>

      <!-- <el-button type="text" @click="addNode">+添加子属性</el-button> -->
    <!-- </el-form-item> -->
    <!-- <el-form-item label="是否为必选项：">
      <el-radio-group v-model="form.isRequired">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <!-- <el-form-item label="层级：">

    </el-form-item> -->

    <!-- <el-form-item label="特殊处理：">
      <el-radio-group v-model="form.resource">
      </el-radio-group>
    </el-form-item>
    <el-form-item label="节点是否为多选节点：">
      <el-radio-group v-model="form.resource">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item> -->
    <!-- <el-form-item> -->
    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
      <el-button style="flex: 1">取消</el-button>
      <el-button type="primary" @click="onSubmit" style="flex: 1">保存</el-button>
    </div>
    <!-- </el-form-item> -->
  </el-form>

</div>
</template>
<script>
import { nodeTypeText, getNodeTypeValueFormat } from './utils/enum.js'
import SubAttr from './SubAttr.vue'
import NodeIndex from './nodeTypeComponents/NodeIndex.vue'
export default {
  components: {
    SubAttr,
    NodeIndex
  },
  props: {
    nodeList: {
      type: Array,
      default: () => []
    },
    tagDetail: {
      type: Object,
      default: () => {}
    },
    nodeDetail: {
      type: Object,
      default: () => {}
    },
    apiData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'nodeDetail.type': {
      handler (val) {
        // 1: '周期范围',
        // 2: '下拉框',
        // 3: '输入框',
        // 4: '搜索框',
        // 5: '范围选择',
        // 6: '指标框'
        this.nodeDetail.valueObj = getNodeTypeValueFormat(val).valueObj
      }
    }
    // form: {
    //   handler (val) {
    //     this.$emit('update:nodeDetail', '新的name值')
    //   }
    // }
  },
  data () {
    return {
      showPreview: false,
      preViewVal: '',
      nodeTypeText: nodeTypeText
      // nodeDetail: {}
    }
  },
  methods: {
    getOptions (keyName) {
      return this.apiData.dict[keyName]
    },

    onSubmit () {
      // console.log('update:nodeDetail!')
      // this.$emit('updatenodeDetail', this.nodeDetail)
    },
    deleteOperate (index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.nodeDetail.relations.hide.list.splice(index, 1)
      // this.buttonDetail.nextNodeList.splice(levelIndex, 1)
    },
    addOperate () {
      // console.debug('addOperate')
      // console.debug('addOperate', this.detailForm.interActifyButtonsList)
      // const list = this.detailForm.interActifyButtonsList
      // const index = this.buttonActiveIndex
      // // this.buttonActiveIndex = obj ? obj.buttonId : ''
      // const buttonItem = list[index]
      // if (!buttonItem?.nextNodeList) {
      //   this.$set(buttonItem, 'nextNodeList', [{ }])
      // } else {
      //   buttonItem.nextNodeList.push({ })
      // }

      // eslint-disable-next-line vue/no-mutating-props
      if (Array.isArray(this.nodeDetail.relations.hide.list)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.nodeDetail.relations.hide.list.push({
          nodeId: '',
          attr: 'value',
          operator: '=',
          value: ''
        })
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        this.nodeDetail.relations.hide.list = [{
          nodeId: '',
          attr: 'value',
          operator: '=',
          value: ''
        }]
      }
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~@/assets/tag.styl'
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
  // background: aliceblue;
  border: 10px solid rgb(246, 246, 246);
  box-sizing: border-box;
  // box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 10px -5px, rgba(0, 0, 0, 0.14) 0px 16px 24px 2px, rgba(0, 0, 0, 0.12) 0px 6px 30px 5px;
  transition: width 0.5s ease 0s;
  height: 100%
  padding: 10px;
  overflow auto
}
.add-button-wrap {
  display: flex;
  justify-content: space-between;
  // background: #f6f6f6;
  align-items: center;
  height: 30px
  border-radius 5px 5px 0 0
  padding: 5px
  margin-top: 10px

  // display: flex;
  // justify-content: space-between;
  // background: #ffb98c12
  // align-items: center;
  // height: 22px
  // border-radius 5px 5px 0 0
  padding: 5px 5px 5px 15px
  // margin-top: 10px
  position: relative;
  // // border-bottom 1px solid #e1e1e1;
  &:before{
    content: ''
    height 65%
    width 5px
    background #ffb98c
    position: absolute;
    left: 0;
    border-radius: 3px 0 0 3px;
  }
}
.detail-button-wrap {
  &:before{
    background #85ce61
  }
}
.aaa {
  padding: 10px;
  margin: 10px 0;
  background: aliceblue;
}
</style>
