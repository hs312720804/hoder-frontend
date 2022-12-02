<template>
    <el-card shadow="never">
        <div slot="header">
            <span>标签列表</span>
            <!-- <el-form :inline="true" style="float: right">
                <el-form-item>
                    <el-input clearable @keyup.enter.native="fetchData" v-model="filter.name" placeholder="标签名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchData">查询</el-button>
                </el-form-item>
            </el-form> -->
        </div>
        <el-tree
            lazy
            :load="loadNode"
            :props="defaultProps"
            node-key="id"
            ref="tree"
            :expand-on-click-node="false"
        >
            <span class="custom-tree-node" slot-scope="{ node }">
                <span class="tree-label">{{ node.label }}</span>
                <!-- <span class="tree-label">{{ node.level }}</span> -->
                <span class="tree-edit" @click="edit(node)" v-if="node.level !== 1">编辑</span>
            </span>
        </el-tree>
    </el-card>
</template>

<script>
export default {
  props: {
    tagId: {
      type: Number
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: (data, node) => {
          return data.isLeaf
        }
      },
      filter: {
        name: undefined
      }
    }
  },
  methods: {
    edit (node) {
      let parentId = 0
      if (node.level === 2) parentId = node.parent.data.id
      // if (node.) {

      // }
      // this.$emit('edit', parentId, node.data.id, node.data.label)
      this.$emit('edit', node.data.id)
    },
    fetchRegionData () {
      const filter = {
        tagId: this.tagId
      }
      this.$service.specialTagDetailList(filter).then((data) => {
        // eslint-disable-next-line
                    
        // this.dataSourceEnum = data.dataSourceEnum
        // this.typeEnum = data.typeEnum
        // this.tagCategory = data.tagCategory
      })
    },
    loadNode (node, resolve) {
      const nodeData = node.data
      // console.log(node)
      if (node.level === 0) {
        // return this.getDeptPersonList(params).then(data => {
        //     let treeData = data.slice().map(item => {
        //         return {
        //             id: item.oId,
        //             label: item.oName,
        //             parentId: item.parentId,
        //             parentName: item.depName,
        //             oType: item.oType,
        //             children: []
        //         }
        //     })
        //     return resolve(treeData)
        // })
        const filter = {
          tagId: this.tagId,
          pageSize: 100
        }
        return this.$service.specialTagDetailList(filter).then((data) => {
          // eslint-disable-next-line
                        // debugger
          // this.dataSourceEnum = data.dataSourceEnum
          // this.typeEnum = data.typeEnum
          // this.tagCategory = data.tagCategory
          let treeData = data.list.slice().map(item => {
            return {
              id: item.specialTagId,
              label: item.specialTagName,
              children: []
            }
          })
          return resolve(treeData)
        })
      } else {
        const params = {
          id: nodeData.id
        }
        return this.$service.specialTagChild(params).then(data => {
          let treeData = data.slice().map(item => {
            return {
              id: item.specialTagId,
              label: item.specialTagName,
              isLeaf: true
            }
          })
          node.data.children = treeData
          return resolve(node.data.children)
        })
      }
    }
  },
  created () {
    // this.fetchRegionData()
  }
}

</script>
<style lang="stylus" scoped>
.tree-label
    color: #303133;
    font-size: 14px;
.tree-edit
    color: #409EFF;
    font-size: 13px;
    margin-left 8px
</style>
