<template>
  <div class="my-collect">

      <!-- <div class="search-input">
          <el-input
              placeholder="支持按人群名、ID搜索"
              class="header-input"
              v-model="filter.tagName"
              @keyup.enter.native="fetchData"
          ></el-input>
          <i class="el-icon-cc-search icon-fixed" @click="fetchData"></i>
      </div> -->

      <el-tabs
        v-model="activeName"
        @tab-click="handleTabChange"
      >
        <el-tab-pane v-for="item in typeTabsList" :label="item.groupName" :name="item.groupName" :key="item.groupName" >
        </el-tab-pane>
      </el-tabs>

      <tag-list
        :tableData="tableData"
      >
        <div align="right">
          <pagination
              :currentpage="filter.pageNum"
              :pagesize="filter.pageSize"
              :totalcount="totalCount"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
          ></pagination>
        </div>
      </tag-list>

      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="500px">
          <el-form label-position="left" label-width="80px" :model="form">
            <el-form-item label="名称" required>
                <el-input v-model="form.tagName"></el-input>
            </el-form-item>
            <el-form-item label="英文名" required>
                <el-input v-model="form.tagKey"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddOrEdit">提 交</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import tagList from './List'
export default {
  name: 'MyCollect',
  components: {
    tagList
  },
  props: {
    checkList: {
      type: Array
    },
    currentSelectTag: {
      type: Array
    },
    showSelection: {
      type: Boolean
    }
  },

  data () {
    return {
      dataList: [],
      filter: {
        searchType: 1,
        tagType: 2,
        pageNum: 1,
        pageSize: 10,
        tagName: undefined
      },
      dataSourceEnum: {},
      typeEnum: {},
      multipleSelection: [],
      dialogVisible: false,
      form: {
        tagName: '',
        tagKey: '',
        remark: ''
      },
      dialogTitle: '',
      totalCount: 0,
      typeTabsList: [],
      activeName: '',
      showTypeTab: true,
      tableData: {
        props: {},
        header: [
          {
            label: '人群ID',
            prop: 'id',
            width: '70'
          },
          {
            label: '人群名称',
            prop: 'group'
          },
          {
            label: '日期',
            prop: 'sshUsername',
            render: (h, params) => {
              return h('el-button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.handleRead(params)
                  }
                }
              }, params.row.sshUsername)
            }
          },
          {
            label: '产品包页面曝光次数',
            prop: 'sshPassword'
          },
          {
            label: '产品包页面曝光人数',
            prop: 'projectDir'
          },
          {
            label: '权益名',
            prop: 'reloadApi'
          },
          {
            label: '产品包类型',
            prop: 'luaPath'
          },
          {
            label: '成单路径',
            prop: 'sshPort'
          },
          {
            label: '产品包ID',
            prop: 'host'
          },
          {
            label: '单价(元)',
            prop: 'remark'
          },
          {
            label: '成交单量',
            prop: 'status',
            render: (h, { row }) => {
              if (row.status === 1) {
                return '启用'
              } else {
                return '禁用'
              }
            }
          },
          {
            label: '成单人数',
            prop: 'createTime'
          },
          {
            label: '成交金额(元)',
            prop: 'updateTime'
          }

        ],
        data: [],
        selected: [],
        selectionType: 'multiple'
      }
    }
  },
  watch: {
    activeName: {
      handler (val) {
        switch (val) {
          case '流量CTR':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '圈定量',
                  prop: 'sshUsername',
                  render: (h, params) => {
                    return h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(params)
                        }
                      }
                    }, params.row.sshUsername)
                  }
                },
                {
                  label: '命中量',
                  prop: 'sshPassword'
                },
                {
                  label: '版面ID&名称',
                  prop: 'projectDir'
                },
                {
                  label: '板块（专辑）id&名称',
                  prop: 'reloadApi'
                },
                {
                  label: '推荐位id&名称',
                  prop: 'luaPath'
                },
                {
                  label: '曝光次数',
                  prop: 'sshPort'
                },
                {
                  label: '曝光人数',
                  prop: 'host'
                },
                {
                  label: '点击次数',
                  prop: 'remark'
                },
                {
                  label: '点击人数',
                  prop: 'status',
                  render: (h, { row }) => {
                    if (row.status === 1) {
                      return '启用'
                    } else {
                      return '禁用'
                    }
                  }
                },
                {
                  label: 'PV CTR',
                  prop: 'createTime'
                },
                {
                  label: 'UV CTR',
                  prop: 'updateTime'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case '产品包成交':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '人群ID',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群名称',
                  prop: 'group'
                },
                {
                  label: '日期',
                  prop: 'sshUsername',
                  render: (h, params) => {
                    return h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(params)
                        }
                      }
                    }, params.row.sshUsername)
                  }
                },
                {
                  label: '产品包页面曝光次数',
                  prop: 'sshPassword'
                },
                {
                  label: '产品包页面曝光人数',
                  prop: 'projectDir'
                },
                {
                  label: '权益名',
                  prop: 'reloadApi'
                },
                {
                  label: '产品包类型',
                  prop: 'luaPath'
                },
                {
                  label: '成单路径',
                  prop: 'sshPort'
                },
                {
                  label: '产品包ID',
                  prop: 'host'
                },
                {
                  label: '单价(元)',
                  prop: 'remark'
                },
                {
                  label: '成交单量',
                  prop: 'status',
                  render: (h, { row }) => {
                    if (row.status === 1) {
                      return '启用'
                    } else {
                      return '禁用'
                    }
                  }
                },
                {
                  label: '成单人数',
                  prop: 'createTime'
                },
                {
                  label: '成交金额(元)',
                  prop: 'updateTime'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case '活跃成交':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '人群ID',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群名称',
                  prop: 'group'
                },
                {
                  label: '日期',
                  prop: 'sshUsername',
                  render: (h, params) => {
                    return h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(params)
                        }
                      }
                    }, params.row.sshUsername)
                  }
                },
                {
                  label: '圈定量',
                  prop: 'sshPassword'
                },
                {
                  label: '主页活跃量',
                  prop: 'projectDir'
                },
                {
                  label: '起播活跃量',
                  prop: 'reloadApi'
                },
                {
                  label: '产品包页面曝光人数',
                  prop: 'luaPath'
                },
                {
                  label: '成交路径',
                  prop: 'sshPort'
                },
                {
                  label: '成单总设备量',
                  prop: 'host'
                },
                {
                  label: '成单人数',
                  prop: 'remark'
                },
                {
                  label: '成交单量',
                  prop: 'status',
                  render: (h, { row }) => {
                    if (row.status === 1) {
                      return '启用'
                    } else {
                      return '禁用'
                    }
                  }
                },
                {
                  label: '成单人数',
                  prop: 'createTime'
                },
                {
                  label: '成交金额(元)',
                  prop: 'updateTime'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'multiple'
            }
            break
          case '观影行为':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '播放次数',
                  prop: 'sshUsername',
                  render: (h, params) => {
                    return h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(params)
                        }
                      }
                    }, params.row.sshUsername)
                  }
                },
                {
                  label: '播放人数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放总时长',
                  prop: 'projectDir'
                },
                {
                  label: '平均每次时长',
                  prop: 'reloadApi'
                },
                {
                  label: '平均每人时长',
                  prop: 'luaPath'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
          case '观影TOP20影片':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '业务一级分类',
                  prop: 'sshUsername',
                  render: (h, params) => {
                    return h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(params)
                        }
                      }
                    }, params.row.sshUsername)
                  }
                },
                {
                  label: '影片ID&影片名',
                  prop: 'sshPassword'
                },
                {
                  label: '影片排名',
                  prop: 'projectDir'
                },
                {
                  label: '成单人数',
                  prop: 'sshPassword'
                },
                {
                  label: '成交单量',
                  prop: 'projectDir'
                },
                {
                  label: '成交金额',
                  prop: 'projectDir'
                },
                {
                  label: '播放次数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放人数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放总时长',
                  prop: 'projectDir'
                },
                {
                  label: '平均每次时长',
                  prop: 'reloadApi'
                },
                {
                  label: '平均每人时长',
                  prop: 'luaPath'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
          case '观影分类':
            this.tableData = {
              props: {},
              header: [
                {
                  label: '日期',
                  prop: 'id',
                  width: '70'
                },
                {
                  label: '人群ID&名称',
                  prop: 'group'
                },
                {
                  label: '分类（频道）',
                  prop: 'sshUsername',
                  render: (h, params) => {
                    return h('el-button', {
                      props: {
                        type: 'text'
                      },
                      on: {
                        click: () => {
                          this.handleRead(params)
                        }
                      }
                    }, params.row.sshUsername)
                  }
                },
                {
                  label: '播放次数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放人数',
                  prop: 'sshPassword'
                },
                {
                  label: '播放总时长',
                  prop: 'projectDir'
                },
                {
                  label: '平均每次时长',
                  prop: 'reloadApi'
                },
                {
                  label: '平均每人时长',
                  prop: 'luaPath'
                }

              ],
              data: [],
              selected: [],
              selectionType: 'none'
            }
            break
        }
      },
      immediate: true
    }
  },
  methods: {
    handleTabChange () {
      this.filter.tagName = this.activeName
      this.fetchData()
    },
    // 删除
    handleDelete (id) {
      this.$service.deleteSpecialTagType(id).then(() => {
        this.fetchData()
        this.$message('删除成功')
      })
    },
    handleEdit (row) {
      const { tagId, tagName, tagKey, remark } = row
      this.form.tagId = tagId
      this.form.tagName = tagName
      this.form.tagKey = tagKey
      this.form.remark = remark || ''
      this.dialogTitle = '编辑种类'
      this.dialogVisible = true
    },
    // 新增或编辑组合标签种类
    async handleAddOrEdit () {
      if (this.form.tagId) { // 编辑
        await this.$service.editSpecialTagType(this.form)
      } else { // 新增
        await this.$service.addSpecialTagType(this.form)
      }
      this.fetchData()
      this.dialogVisible = false
      this.$message.success('保存成功')
    },
    // 新增组合标签
    handleAdd () {
      // 数据置空，否则会残留编辑的数据
      this.form = {
        tagName: '',
        tagKey: '',
        remark: ''
      }
      this.dialogTitle = '新增种类'
      this.dialogVisible = true
    },
    async fetchData () {
      // 搜索时名称为空时，默认赋值为类型第一个
      if (!this.filter.tagName && this.typeTabsList.length > 0) {
        this.filter.tagName = this.typeTabsList[0].groupName
        this.activeName = this.typeTabsList[0].groupName
      }
      this.showTypeTab = !!this.typeTabsList.find(item => item.groupName === this.filter.tagName) // 搜索时隐藏类型tab

      const filter = this.filter
      this.$service.searchByGroup(filter).then(data => {
        const result = data
        this.dataList = result.pageInfo.list
        this.totalCount = result.pageInfo.total
        this.dataSourceEnum = result.DataSourceMap
        this.typeEnum = result.tagKey
      })
    },
    handleCheckListChange (val) {
      this.$emit('change-checkList', val)
    },
    handleTableSelected (val, mode) {
      this.$emit('get-table-selected', val, mode)
    },

    // 每页显示数据量变更, 如每页显示10条变成每页显示20时, val=20
    handleSizeChange (val) {
      this.filter.pageSize = val
      // 每次切换页码条，都把页面数重置为1
      this.filter.pageNum = 1
      this.fetchData()
    },
    // 页码变更, 如第1页变成第2页时,val=2
    handleCurrentChange (val) {
      this.filter.pageNum = val
      this.fetchData()
    },
    fetchTypeData () {
      // const typeFilter = {
      //   searchType: 2,
      //   tagType: 2,
      //   pageNum: 1,
      //   pageSize: 10
      // }

      this.typeTabsList = [
        {
          'groupName': '流量CTR'
        },
        {
          'groupName': '产品包成交'
        },
        {
          'groupName': '活跃成交'
        },
        {
          'groupName': '观影行为'
        },
        {
          'groupName': '观影TOP20影片'
        },
        {
          'groupName': '观影分类'
        }
      ]
      console.log('this.typeTabsList===', this.typeTabsList)
      this.filter.tagName = this.typeTabsList[0].groupName
      this.activeName = this.typeTabsList[0].groupName
    }
  },
  created () {
    this.$root.$on('third-tag-list-refresh', this.fetchData)
    this.fetchTypeData()
    this.fetchData()
  }
}
</script>

<style lang="stylus" scoped>
    .my-collect >>> .el-icon-cc-star-fill
      color #E6A13C
    .my-collect >>> .el-button-group
      display flex
      align-items center
      .el-button
        margin 0 5px
    .my-collect >>> .el-tabs__header
      position relative !important
      width 100% !important
      z-index 999 !important
    .my-collect >>> .el-tabs__nav-wrap
      overflow: hidden !important
      margin-bottom: -1px !important
      position: relative !important
      margin-top: 0 !important
      padding-top: 0 !important
    .my-collect
        margin-top 50px
        position relative
    .header
        display flex
        justify-content space-between
        // margin 10px 0
    .search-input
        display flex
        width 30%
        position: absolute;
        z-index: 9999;
        right: 0;
        top: 0;
    .icon-fixed
        position absolute
        top 8px
        right 10px
        transform rotate(-90deg)

</style>
