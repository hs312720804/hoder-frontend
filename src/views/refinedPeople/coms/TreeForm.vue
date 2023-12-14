<!-- https://juejin.cn/post/7205873584338534460?from=search-suggest -->
<template>
<div >
  <div class='tree_form_left_input'>
    <el-input
      v-if="searchFlg"
      placeholder="请输入关键字进行过滤"
      v-model='filterText'
      suffix-icon="el-icon-search"
      clearable>
    </el-input>
    <!-- <el-input
      class="search-form"
      v-if="searchFlg"
      placeholder="请输入"
      v-model='filterText'
      clearable
    >
      <el-button slot="append" icon="el-icon-search" @click="getSceneList"></el-button>
    </el-input> -->
  </div>
  <div class="tree-wrap">
    <!-- el-scrollbar -->
    <div wrap-style="overflow-x: hidden;">
      <div style="padding-right: 20px;">
        <!-- {{ treeModelData }} -->
        <el-tree
          v-bind="$attrs"
          ref="tree"
          class='tree_form_left_tree'
          highlight-current
          default-expand-all
          :data='treeModelData'
          :show-checkbox="imultiple"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          node-key="id"
          @node-click="handleNodeClick"
          @check="handleCheck"
          >
          <div class='custom-tree-node_body' slot-scope="{ node, data }">
            <span class="custom-tree-node">
              <!-- 判断是否存在子级数据
              <i v-if="!data.children || data.children.length<=0" class="font_family icon-circular no_children"/>
              节点展开样式
              <i v-else-if="node.expanded" class="file_class font_family icon-file_open"/>
              节点收缩样式
              <i v-else class="file_class font_family icon-file_close"/> -->
              <template v-if="data.isPolicy">
                <i v-if="node.expanded" class="el-icon-folder-opened folder"></i>
                <i v-else class="el-icon-folder folder"></i>
              </template>
              <template v-else>
                <i class="el-icon-s-custom crowd"></i>
                <!-- <i class="el-icon-female crowd"></i> -->
              </template>
              <!-- 节点内容 -->
              <span class='label' :title='data.sourceName || "-"' :class="{'is-policy':  data.isPolicy}">
                {{ data.sourceName }}
                <!-- -- {{ data.level }} -->
                -- {{ data.id }}
                <!-- -- {{data.policyId}} -->
                <!-- -- {{ data.isPolicy }} -->
              </span>
            </span>
            <!-- 自定义按钮区 -->
            <!-- <span v-if='!data.children || data.children.length<=0' class='tree_form_left_tree_icon'> -->
            <span v-if="btnFlg" class='tree_form_left_tree_icon'>
              <!-- 根节点，只能添加策略组 -->
              <i v-if="data.type === 'root'" title="新增" class="el-icon-circle-plus-outline" @click='treeAdd(node,data)'></i>
              <!-- 策略组/子人群节点 -->
              <template v-else >
                <!-- 编辑 -->
                <i class="el-icon-edit" title="编辑" @click='treeEdit(node, data)'></i>
                <!-- 新增 -->
                <i v-if="node.level <= limitLevel" title="新增" class="el-icon-circle-plus-outline" @click='treeAdd(node,data)'></i>
                <!-- 删除 -->
                <el-popconfirm
                  title="确定要删除吗?"
                  @confirm="treeDelete(node,data)"
                >
                  <i slot="reference" class="el-icon-close" style="color: #ff8888" title="删除"></i>
                </el-popconfirm>
                <!-- <el-button v-if="data.isPolicy" type="text" @click='treePush(node,data)'>投放</el-button> -->

                <span v-if="data.useStatus === '投放中'" @click="launchDetail(data.policyId)" class="tip-text under_line">投放中</span>
                <!-- <span v-else-if="data.isPolicy"> -->
                <!-- 未投放 -->
                <i v-else-if="data.isPolicy" title="投放" class="el-icon-position" @click='treePush(node,data)'></i>
                <!-- </span> -->
                <!-- <el-button v-else type="text">数据分析</el-button> -->
              </template>
            </span>
          </div>
        </el-tree>
      </div>
    </div>
  </div>
  <!-- 投放中弹窗-->
  <el-dialog :visible.sync="showLaunch" title="该策略正在使用情况">
    <!--<div>该策略正在使用情况</div>-->
    <div>正在投放：<span v-for="(item,index) in launchItems" :key="index" class="launch-item">{{item}}</span></div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'TreeForm',
  data () {
    return {
      filterText: '', // 搜索框对应的value值
      treeModelData: '', // 树的展示数据
      // --- 投放中弹窗 ----
      showLaunch: false,
      launchItems: []
      // --- 投放中弹窗 --end--
    }
  },
  props: {
    treeData: { // 接收树数据
      type: Array,
      default: () => []
    },
    searchFlg: { // 是否显示搜索框
      type: Boolean,
      default: true
    },
    btnFlg: { // 是否显示按钮
      type: Boolean,
      default: true
    },
    imultiple: { // 是否显示多选框
      type: Boolean,
      default: false
    },

    limitLevel: {
      type: [Number],
      default: 10
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    treeData: { // 接收到的数据进行处理
      handler (val) {
        if (val) {
          this.treeModelData = JSON.parse(JSON.stringify(val))
        }
      },
      deep: true,
      immediate: true
    }

  },
  methods: {
    launchDetail (pid) {
      this.showLaunch = true
      this.$service.policyUseInBi({ policyId: pid }).then((data) => {
        this.launchItems = data
      })
    },
    // 点击节点
    handleNodeClick (data, node) {
      this.$emit('nodeClick', node, data)
    },
    // 当复选框被点击的时候触发
    handleCheck (data, node) {
      this.$emit('nodeCheck', node, data)
    },
    treeEdit (node, data) {
      this.$emit('treeEdit', node, data) // 将需要执行的数据传递出去
    },
    treeAdd (node, data) {
      this.$emit('treeAdd', node, data)
    },
    treePush (node, data) {
      this.$emit('treePush', node, data)
    },
    treeDelete (node, data) {
      this.$emit('treeDelete', node, data)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.sourceName.indexOf(value) !== -1
    }
  }
}
</script>

<style lang='stylus'>
// .tree_form_left_input{
//   .el-input{
//     .el-input__inner{
//       height:32px;
//       font-size:14px;
//     }
//   }
// }
.tree_form_left_tree {
  margin-top: 10px;
  font-size 13px
  .el-tree-node {
    position: relative;
    color: black;
    padding: 3px 0px;
    padding-left: 10px; // 缩进量
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -22px;
    border-width: 1px;
    border-left: 1px dashed #88909c;
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: "";
    width: 20px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 15px;
    border-width: 1px;
    border-top: 1px dashed #88909c;
  }
  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }
  // 选中的样式
  .el-tree-node.is-current>.el-tree-node__content{
    // background-color: unset !important;
    .custom-tree-node_body,.tree_form_left_tree_icon,.custom-tree-node .no_children{
      color:#006eff !important;
    }
    // .custom-tree-node{
    //   background #f0f7ff
    // }
    // 操作按钮 显示
    .tree_form_left_tree_icon {
      display block
    }
  }

  .el-tree-node__content{
    padding-left:0 !important;
    color:#444;
    z-index: 99;
    position: relative;
    &:hover {
    // 操作按钮 显示
    .tree_form_left_tree_icon {
      display block
    }
    }
    // 树缩进样式
    .el-icon-caret-right::before{
      content: "";
      width:14px;
      height:14px;
      background: url('~@/assets/icons/open.svg');
      background-size: 100% 100%;
      border-radius: 3px;
      display: inline-block;
    }
    .el-tree-node__expand-icon.expanded{
      transform: rotate(0);
    }
    // 树展开样式
    .el-tree-node__expand-icon.expanded::before{
      content: "";
      width:14px;
      height:14px;
      background: url('~@/assets/icons/close.svg');
      background-size: 100% 100%;
      border-radius: 3px;
      display: inline-block;
    }
    .el-tree-node__expand-icon.is-leaf::before{
      content: "";
    }
    .el-icon-caret-right.is-leaf::before{
      content: "";
      display: none;
    }
    .custom-tree-node {
      flex: 1
      width: 0
      overflow hidden
      text-overflow ellipsis
    }
    .custom-tree-node .file_class{
      color: #ffb400;
    }
    .custom-tree-node .label{
      margin-left: 2px;
      line-height: 23px;
    }
    .custom-tree-node .no_children{
      color: #aaa;
    }
  }
  // 自定义树形内容
  .custom-tree-node_body{
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center
    // margin-top:-3px;
  }
  .tree_form_left_tree_icon {
    padding:0 3px;
    font-size:14px;
    color: #666;
    display none
    display block
    i {
      padding:  4px;
      &:hover {
        background: #d7d7d7;
        border-radius: 5px;
      }
    }
    &:hover {
      cursor: pointer;
    }
  }
}

// .search-form {
//   width: 180px
//   transition width 5s
//   .el-input__inner:focus {
//     width 250px
//   }
// }
.folder {
  font-size: 16px;
  color: #f8b007;
}
.crowd {
  font-size: 14px;
  // color: gray;
}
.is-policy {
  // font-size: 13px;
  // color: #f8b007;
}
.tree-wrap {
  // position: absolute;
  // // width: 100%;
  // bottom: 0;
  // left: 0
  // right: 0
  // top: 83px;
  overflow: auto;
  height: 92%;
}
.under_line
  text-decoration underline
  color blue
  cursor pointer
</style>
