<template>
  <div class="behavior-wrapper">
    <!-- {{ relations }} -->
    <div class="row-wrap">
      <span>隐藏条件</span>
      <span>
        <el-switch
          v-model="relations.hide.status"
        >
        </el-switch>
      </span>
    </div>
    <div v-if="relations.hide.status" class="status-relate-expres">
      <div class="list-item" v-for="(item, index) in relations.hide.list" :key="index">
        <el-select
          class="short-select-width"
          v-model="item.nodeId"
          placeholder="节点"
          style="margin-right: 5px;"
          @change="updatePicked">
          <el-option
            v-for="item in nodeListOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id ">
          </el-option>
          <!-- <el-option label="显示" :value="1"></el-option>
          <el-option label="隐藏" :value="2" ></el-option>
          <el-option label="关联字段" :value="3"></el-option> -->
        </el-select>
        <el-select
          class="short-select-width"
          v-model="item.attr"
          placeholder="属性值"
          style="margin-right: 5px;"
          @change="updatePicked">
          <el-option
            v-for="nodeItem in attrList"
            :key="nodeItem"
            :label="nodeItem"
            :value="nodeItem">
          </el-option>
        </el-select>
        <el-select
          class="short-select-width"
          v-model="item.operator"
          placeholder="运算符"
          style="margin-right: 5px;"
          @change="updatePicked">
          <el-option value="="></el-option>
          <el-option value="!="></el-option>
        </el-select>
        <el-input
          class="input-type"
          type="text"
          v-model="item.value"
          placeholder="值"></el-input>

        <el-button type="text" @click="del(index)" class="el-icon-close delete"></el-button>
      </div>

      <el-button type="text" @click="add">+添加条件</el-button>
    </div>
    <!-- <div class="all-list-wrapper" v-if="list.length > 0">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <el-select
          class="short-select-width"
          v-model="item.callType"
          placeholder="条件"
          style="margin-right: 5px;"
          @change="updatePicked">
          <el-option label="显示" :value="1"></el-option>
          <el-option label="隐藏" :value="2" ></el-option>
          <el-option label="关联字段" :value="3"></el-option>
        </el-select>
：
        <el-select
          class="short-select-width"
          v-model="item.nextAttrId"
          placeholder="节点类型"
          @change="updateNodePicked"
          filterable>
          <el-option
            v-for="nodeItem in attrList"
            :key="nodeItem.attrId"
            :label="nodeItem.attrName"
            :value="nodeItem.attrId">
          </el-option>
        </el-select>

        <el-input
          type="text"
          v-model="item.attrParam"
          placeholder="数据字段"
          clearable
          class="short-select-width">
        </el-input>

        <el-button type="text" @click="del(index)" class="el-icon-close delete"></el-button>
      </div>
    </div>
    <el-button type="text" @click="add">+添加子属性</el-button> -->
  </div>
</template>
<script>
import { getValueObjFormat, nodeTypeText } from './utils/enum.js'
export default {
  name: 'SubAttr',
  props: {

    // // skillList: { // 数据来源 - 技能列表
    // //   type: Array,
    // //   default: () => []
    // // },
    // // childNodeList: { // 数据来源 - 节点列表
    // //   type: Array,
    // //   default: () => []
    // // },
    // attrList: { // 数据来源 - 节点列表
    //   type: Array,
    //   default: () => []
    // },
    nodeList: {
      type: Array,
      default: () => []
    },
    relations: { // 数据来源 - 下一节点列表
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      attrList: [],
      nodeListOptions: [],
      nodeTypeText: nodeTypeText
    }
  },
  computed: {

  },
  watch: {
  },
  methods: {
    // getCurrentSkillItem (index) {
    //   const res = this.skillList.find(item => item.skillId.toString() === this.list[index].nextSkillId.toString()) || []
    //   return res
    // },
    updatePicked () {
      //
    },
    // updateSkillPicked () {
    //   // this.list[index].nextSkillId = listItem.nextSkillId
    // },
    updateNodePicked () {
      // console.debug('updateNodePicked', listItem)
    },
    // getNodeId (node) {
    //   const data = node.getData()
    //   if (data.nodeType === 3 || data.nodeType === 2 || data.nodeType === 1) {
    //     return data.nodeId
    //   } else if (data.type === 1 && data['button-type'] === 'dialogue-button') {
    //     return data.buttonId
    //   }
    //   return ''
    // },
    add () { // 添加操作
      this.$emit('add')
    },
    del (index) {
      this.$emit('del', index)
    }
  },
  created () {
    this.attrList = Object.keys(getValueObjFormat() || {})

    this.nodeListOptions = this.nodeList.map(item => {
      return {
        id: item.id,
        type: item.type,
        label: `${nodeTypeText[item.type]} (id:${item.id})`
      }
    })
    console.log('this.nodeListOptions->', this.nodeListOptions)
    // console.debug('mounted nodeList: ', this.skillList)
  }
}
</script>
<style lang="stylus" scoped>
.behavior-wrapper {
    // padding-left 10px
  .all-list-wrapper {
    .head-text {
      white-space nowrap
      // margin-right 39px
      color #666
      font-size 14px
    }
    .list-item {
      display flex
      align-items center
      flex-wrap wrap
      position relative
      .short-select-width {
          width 110px
          margin-bottom 5px
          margin-left 5px
      }
      .delete {
        color #666
        font-size 14px
        margin-left 10px
        right: 0px;
        position: absolute;
      }
    }
  }
}

.row-wrap {
  display flex
  justify-content: space-between
}
.status-relate-expres {
  padding: 12px 10px;
  box-sizing: border-box;
  background: #f7f7f9;
  border-radius: 2px;
  position: relative;

}
.list-item {
  display: flex;
  white-space: nowrap;
  justify-content: space-around;
}
.input-type {
  width 150px
}
</style>
