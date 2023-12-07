<template>
  <div class="row-wrap">
    <!-- 树状图 -->
    <div class="block" >
      <!-- <p>使用 scoped slot</p>
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              Append
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              Delete
            </el-button>
          </span>
        </span>
      </el-tree> -->
      <div>
        权益分类：
        <el-select
          style="float: right; margin-bottom: 10px;"
          v-model="selectValue"
          class="inline-input"
          @change="refinementPolicyTree"
        >
          <el-option
            v-for="item in tabList"
            :key="item.id"
            :label="item.productName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <!-- <el-dropdown>
        <span class="el-dropdown-link">
          权益分类：<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
          v-for="item in tabList"
          :key="item.id"
          :label="item.productName"
          :value="item.id"
          >{{item.productName}}</el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown> -->
      <TreeForm
        :treeData="treeData"
        class='tree_left'
        @treeEdit="handleTreeEdit"
        @treeAdd="handleTreeAdd"
        @nodeClick="handleNodeClick"
    >
      </TreeForm>
    </div>

    <div class="detail-table">
      <div class="tip-wrap">
        策略ID： 6616     有效期：2019.10.1 23:00  -  2019.10.2 23:00
      </div>
      <!-- 表格 -->
      <TableIndex
        :activeName="activeName"
        :treeData="treeData"
        :selectedTreeNode="selectedTreeNode"
      >
      </TableIndex>
    </div>

    <el-dialog
      :title="crowdForm.policyId ? '编辑策略组' : '添加策略组'"
      :visible.sync="updatePolicyDialog"
      width="550px"
    >
      <!-- {{ crowdForm }} -->
      <el-form :model="crowdForm" ref="crowdForm" label-width="130px" :rules="rules">
        <el-form-item label="策略组名：" prop="policyName">
            <el-input
              size="small"
              v-model="crowdForm.policyName"
              placeholder="策略组名"
              clearable
            ></el-input>
        </el-form-item>
        <el-form-item label="人群有效区间：" prop="period">
          <el-date-picker
            style="width: 100%;"
            v-model="crowdForm.period"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable>
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button @click="handleSubmit" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加子人群"
      :visible.sync="clientDialogVisible"
      width="1200px"
      v-if="clientDialogVisible"
    >
      <createClientDialog
        ref="createClientDialog"
        :editRow="editClientRow">
      </createClientDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clientDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditEntryRule">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableIndex from './TableIndex.vue'
import TreeForm from './coms/TreeForm.vue'
import createClientDialog from './coms/createClientDialog.vue'

export default {
  name: 'refinedPeople',
  components: {
    TableIndex,
    TreeForm,
    createClientDialog
  },
  props: {
    showSelection: {
      type: Boolean
    },
    currentSelectTag: {
      type: Array,
      default: () => []
    }
  },
  data () {
    // 测试数据
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1',
          children: [{
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }, {
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }, {
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }, {
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }]
        }, {
          id: 10,
          label: '三级 1-1-2',
          children: [{
            id: 13,
            label: '四级 1-1-1'
          }, {
            id: 14,
            label: '四级 1-1-2'
          }]
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      // 弹窗---------------
      updatePolicyDialog: false,
      crowdForm: {
        policyName: '',
        period: []
      },
      rules: {
        policyName: { required: true, message: '请输入', trigger: ['blur'] },
        period: { required: true, type: 'array', message: '请选择', trigger: ['change', 'blur'] }
      },
      // 弹窗---------------end
      selectValue: '',
      treeData: JSON.parse(JSON.stringify(data)),
      // 权益列表
      tabList: [{
        label: '爱奇艺',
        value: 'iqiyi'
      }, {
        label: '腾讯',
        value: 'tencent'
      }, {
        label: '优酷',
        value: 'youku'
      }, {
        label: '亲子',
        value: 'parent_child'
      }],
      activeName: 'iqiyi',
      checkList: [],
      tagList: [],
      tempCheckList: [],
      // 点击的树状节点
      selectedTreeNode: {},
      // 添加子人群--- start
      clientDialogVisible: false,
      editClientRow: {}
      // 添加子人群--- end
    }
  },
  methods: {
    // ---------- 编辑策略组 start ---------
    // 增加策略组、增加子人群
    handleTreeAdd (node, data) {
      console.log('data-->', data)
      if (data.type === 'root') {
        // 添加策略组
        this.updatePolicyDialog = true
        // 清空表单
        this.$nextTick(() => {
          this.$refs.crowdForm.resetFields()
        })
      } else {
        // 添加子人群
        this.clientDialogVisible = true
      }
    },
    // 编辑策略组 open
    handleTreeEdit (node, data) {
      console.log('node-->', node)
      console.log('data-->', data)
      // 编辑策略组
      if (data.isPolicy) {
        this.updatePolicyDialog = true

        this.$nextTick(() => {
          // 移除表单项的校验结果
          this.$refs.crowdForm.clearValidate()
        })

        this.crowdForm.policyName = data.sourceName
        this.crowdForm.policyId = data.policyId
      } else {
        // 编辑子人群
        this.clientDialogVisible = true
      }
    },
    // 编辑策略组 close
    handleDialogClose () {
      this.updatePolicyDialog = false
    },
    // 编辑策略组 submit
    handleSubmit () {

    },
    addOrEditEntryRule () {

    },
    // ----------编辑策略组 end---------

    // 点击树状节点
    handleNodeClick (node, data) {
      this.selectedTreeNode = data
    },

    handleTabChange () {
    },

    refinementPolicyTree () {
      const params = {
        productId: this.selectValue || 1
      }
      this.$service.refinementPolicyTree(params).then(res => {

      })
    },
    refinementPolicyProduct () {
      return this.$service.refinementPolicyProduct().then(res => {
        this.tabList = res || []
        this.selectValue = res[0].id
        return this.selectValue
      })
    },
    arrayToTree (arr) {
      return arr.filter(item => {
        item.children = arr.filter(item2 => {
          return item2.parentId === item.id
        })
        return item.parentId === 0
      })
    }
  },
  async created () {
    await this.refinementPolicyProduct()
    // 树形的数据
    this.refinementPolicyTree()

    const a = [{
      id: 6679,
      isPolicy: true,
      parentId: 0,
      policyId: 6679,
      sourceName: '精细化人群1'
    }, {
      id: 6689,
      isPolicy: false,
      parentId: 6679,
      policyId: 6689,
      sourceName: '子人群'
    }]

    const root = [{
      id: -1,
      isPolicy: false,
      parentId: 0,
      sourceName: '所有策略',
      children: this.arrayToTree(a),
      type: 'root'
    }]

    this.treeData = root
  }
}
</script>

<style lang="stylus" scoped>
.row-wrap {
  display flex
  column-gap: 20px;
}
.block {
  // width: 300px;
  flex: 0 0 300px;
  // box-shadow: inset -1px 0 0 #e7e7e7;
}
// .custom-tree-node {
//   display: flex;
//   align-items: center;
//   flex: 1;
//   justify-content: space-between;
//   font-size: 14px;
//   padding-right: 8px;
// }
.detail-table {
  flex: 1;
  width: 50%;
}
.tip-wrap {
  font-size: 12px;
  margin-bottom: 20px;
  font-weight: 700;
  color: rgb(144, 147, 153);
}
</style>
