<template>
  <div >
    <div class="wrap">
      <!-- if (this.childItem.tagCode === 'BAV0017' || this.childItem.tagCode === 'BAV0016' || this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011') { -->
      <div class="left-block">
        <el-button type="text" @click="apiDataSet"><i class="el-icon-s-operation"></i>接口数据配置</el-button>

        <!-- 标签条件： -->
        <div class="row-wrap">

          <div v-for="(node, index) in nodeList" :key="node.id" :class="{ 'is-foucs': focusNode.id === node.id }"
            @click="nodeClick(node)">
            <!-- <el-select
               v-if="node.type === 2"
               placeholder="输入框"
               class="none-pointer-events"
               v-model="aaa"
              >
             </el-select> -->
            <div class="node-wrap">
              <NodeIndex :nodeType="node.type" :nodeDetail="node">
              </NodeIndex>
            </div>

            <!-- node=={{ node }} -->

            <div class="operator-wrap">
              <!-- <i class="el-icon-plus" title="添加关联属性"></i> -->
              <i class="el-icon-delete" @click="deleteNode(index)"></i>
            </div>
            <div class="tip-text">
              <span>
                {{ nodeTypeText[node.type] }}
                id: {{ node.id }}
              </span>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <i class="el-icon-circle-plus" @click="addNode"></i>
          <!-- <el-button type="primary" @click="addNode">添加</el-button> -->
        </div>

      </div>

      <Right v-if="focusNode.id" :nodeList="nodeList" :tagDetail="tagDetail" :nodeDetail="focusNode" :apiData="apiData"
        @updateFocusNode="handleUpdateFocusNode">
      </Right>
    </div>

    <!-- 预览面板 -->
    <PreviewPanel  :tagDetail="tagDetail" :nodeList="nodeList" :apiData="apiData">
    </PreviewPanel>

    <el-dialog title="接口数据配置" :visible.sync="showApiDataSetDialog">
      <el-form :model="apiDataSetForm" ref="apiDataSetForm" :inline="true">
        <el-form-item label="接口名称" prop="apiName">
          <el-input v-model="apiDataSetForm.apiName" placeholder="需要提前在项目中配置好" clearable></el-input>
        </el-form-item>
        <el-form-item label="参数字段" prop="paramsName">
          <el-input v-model="apiDataSetForm.paramsName" style="width: 80px" placeholder="参数字段" clearable></el-input>
        </el-form-item>
        <el-form-item label="参数 value" prop="paramsValue">
          <el-input v-model="apiDataSetForm.paramsValue" style="width: 80px" placeholder="参数 value" clearable></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchApiData">查询</el-button>
        <el-input type="textarea" rows="8" :readonly="true" :autosize="{ minRows: 10, maxRows: 20 }"
          v-model="apiDataJSON">
        </el-input>
        <el-form-item>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
import PreviewPanel from './actionComs/PreviewPanel.vue'
import NodeIndex from './actionComs/nodeTypeComponents/NodeIndex.vue'
import Right from './actionComs/Right.vue'
import { getNodeTypeValueFormat, nodeTypeText } from './actionComs/utils/enum.js'
export default {
  components: {
    NodeIndex,
    PreviewPanel,
    Right
  },

  data () {
    return {
      // nodeDetail: {
      //   valueObj: {
      //     name: '',
      //     value: '',
      //     field: '',
      //     operator: '',
      //     type: ''
      //   }
      // },
      nodeTypeText: nodeTypeText,
      // --- 接口数据配置dialog ---
      showApiDataSetDialog: false,
      apiDataSetForm: {
        apiName: 'getBavTagList',
        paramsName: 'id',
        paramsValue: 6
      },
      apiData: {
        dict: {}
      },
      apiDataJSON: '',
      // --- 接口数据配置dialog - end--
      focusNode: {},
      // 节点类型:
      // 1: 周期范围
      // 2: 下拉框
      // 3: 输入框
      // 4: 搜索框
      // 5: 范围选择
      // 6: 指标框
      // tagDetail: {
      //   tagName: '页面活跃',
      //   tagCode: 'BAV0005',
      //   nodeList: [
      //     {
      //       ...getNodeTypeValueFormat(1),
      //       id: 1,
      //       type: 1
      //     },
      //     {
      //       ...getNodeTypeValueFormat(2),
      //       id: 2,
      //       type: 2,
      //       keyName: 'page_active',
      //       isDiguiNode: true,
      //       diGuiKeyName: 'mapName',
      //       nextNodeList: []
      //     },
      //     {
      //       ...getNodeTypeValueFormat(6),
      //       id: 6,
      //       type: 6,
      //       keyName: 'attrType',
      //       isDiguiNode: true,
      //       diGuiKeyName: 'mapName',
      //       nextNodeList: []
      //     }
      //   ]
      // },
      tagDetail: {
        tagName: '功能点击',
        tagCode: 'BAV0006',
        nodeList: [
          {
            ...getNodeTypeValueFormat(1),
            id: 111,
            type: 1
          },
          {
            ...getNodeTypeValueFormat(2),
            id: 222,
            type: 2,
            keyName: 'business_type',
            isDiguiNode: true,
            diGuiKeyName: 'mapName',
            nextNodeList: []
          },
          {
            ...getNodeTypeValueFormat(2),
            id: 34535346,
            type: 2,
            keyName: 'package_vip',
            isDiguiNode: true,
            diGuiKeyName: 'mapName',
            nextNodeList: []
          },
          {
            ...getNodeTypeValueFormat(2),
            id: 35435345,
            type: 2,
            keyName: 'category_name',
            isDiguiNode: true,
            diGuiKeyName: 'mapName',
            nextNodeList: []
          },
          {
            ...getNodeTypeValueFormat(6),
            id: 666,
            type: 6,
            keyName: 'attrType',
            isDiguiNode: true,
            diGuiKeyName: 'mapName',
            nextNodeList: []
          }
        ]
      }
    }
  },
  watch: {

  },
  computed: {
    nodeList () {
      return this.tagDetail.nodeList
    }
  },
  created () {
    this.searchApiData()
  },
  methods: {
    deleteNode (index) {
      this.nodeList.splice(index, 1)
    },
    apiDataSet () {
      this.showApiDataSetDialog = true
    },
    searchApiData () {
      // apiDataSetForm: {
      //   apiName: '',
      //   params: ''
      // },
      console.log('apiDataSetForm-->', this.apiDataSetForm)
      const params = {
        [this.apiDataSetForm.paramsName]: this.apiDataSetForm.paramsValue
      }
      // 获取行为标签下拉选项
      this.$service[this.apiDataSetForm.apiName](params).then(res => {
        // eslint-disable-next-line no-debugger
        // this.$nextTick(() => {
        // this.bavAttrList[tagCode] = res || {}
        // this.$set(this.bavAttrList, tagCode, res)
        // this.bavAttrList = Object.assign({}, this.bavAttrList, this.bavAttrList)
        // })
        this.apiData = res
        this.apiDataJSON = JSON.stringify(res)
      })
    },
    handleUpdateFocusNode (node) {
      this.nodeList = this.nodeList.map(item => {
        if (node.id === item.id) {
          return { ...item, ...node }
        } else {
          return { ...item }
        }
      })
      // a = { ...a, ...node }
    },
    nodeClick (node) {
      this.focusNode = node
      this.$emit('node-click', node)
    },
    // getDefaultNodeformat () {
    //   return {
    //     id: 0,
    //     type: 2,
    //     keyName: '',
    //     isDiguiNode: true,
    //     diGuiKeyName: '',
    //     nextNodeList: []
    //   }
    // },
    addNode () {
      const node = getNodeTypeValueFormat(2)
      node.id = Math.random()
      this.nodeList.push(node)
    }
  }
}
</script>

<style lang='stylus' scoped>
 .row-wrap {
  >div {
    position relative
    margin: 25px 0
  }
  // display flex
  // align-items: center
}
.node-wrap {
  background #f0f4ff
  padding: 10px
  // display: inline-block
  border-radius: 4px;
  border: 2px solid #fff
  position relative
  height: 58px
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  &:focus {
    border 1px solid #409eff
  }
}
.is-foucs {
  border: 2px solid #409EFF
  .operator-wrap {
    cursor pointer
    visibility visible
    padding: 2px 12px;
  }
}

.wrap {
  display flex
  column-gap: 20px;
  height: 100%
  position: relative;
}

.left-block {
  flex: 1;
  width: 50%;
  // box-shadow: 20px 0px 23px -13px hsl(0deg 0% 93.06%)
}

.operator-wrap {
  position: absolute;
  top: 0;
  right: 0;
  background: #1890ff;
  color: #fff;
  border-radius: 2px
  visibility hidden
  .el-icon-plus {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
}
.btn-wrap {
  display: flex;
  justify-content: center;
  border-top: 2px dashed #cdc9c9;
  margin-top 10px
  .el-icon-circle-plus {
    font-size: 28px;
    color: #409eff;
    cursor: pointer;
    margin-top: -15px;
  }
}
.tip-text {
  position absolute
  top: -18px;
  left: -6px;
}

</style>
