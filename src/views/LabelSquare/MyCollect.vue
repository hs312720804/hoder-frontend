<template>
  <div class="my-collect">
      <el-popover
              placement="top"
              trigger="click"
              class="popover-button"
      >
          <div>
              <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                  <el-checkbox label="tagKey">标签code</el-checkbox>
                  <el-checkbox label="tagValues">示例值</el-checkbox>
                  <el-checkbox label="defineRemark">标签定义</el-checkbox>
                  <el-checkbox label="tagType">类型</el-checkbox>
                  <el-checkbox label="remark">备注</el-checkbox>
              </el-checkbox-group>
          </div>
          <el-button slot="reference">选择列表展示维度</el-button>
      </el-popover>
      <el-table border :data="dataList" >
          <el-table-column prop="tagId" label="ID">
          </el-table-column>
          <el-table-column prop="tagName" label="名称">
          </el-table-column>
          <el-table-column prop="dataSource" label="数据来源" >
              <template slot-scope="scope">
                  {{ dataSourceEnum[scope.row.dataSource] }}
              </template>
          </el-table-column>
          <el-table-column
                  v-if="(checkList.indexOf('defineRemark') > -1)"
                  prop="defineRemark"
                  label="标签定义"
          >
          </el-table-column>
          <el-table-column
                  v-if="(checkList.indexOf('tagValues') > -1)"
                  prop="tagValues"
                  label="示例值"
          >
          </el-table-column>
          <el-table-column
                  v-if="(checkList.indexOf('tagKey') > -1)"
                  prop="tagKey"
                  label="标签code"
          >
          </el-table-column>
          <el-table-column
                  v-if="(checkList.indexOf('tagType') > -1)"
                  prop="tagType"
                  label="类型"
          >
              <template slot-scope="scope">
                  {{ typeEnum[scope.row.tagType] }}
              </template>
          </el-table-column>
          <el-table-column
                  v-if="(checkList.indexOf('remark') > -1)"
                  prop="remark"
                  label="备注"
          >
          </el-table-column>
          <el-table-column prop="operation" label="操作">
              <template slot-scope="scope">
                  <el-button-group>
                      <el-button
                              type="text"
                              @click="handleSeeTagCategoryDetail(scope.row)"
                      >
                          查看
                      </el-button>
                      <!--<el-button-->
                      <!--type="text"-->
                      <!--v-permission="'hoder:label:modify'"-->
                      <!--@click="handleEditTagCategory(scope.row)"-->
                      <!--&gt;-->
                      <!--编辑-->
                      <!--</el-button>-->
                      <!--<el-button-->
                      <!--type="text"-->
                      <!--v-permission="'hoder:label:del'"-->
                      <!--@click="handleDeleteTagCategory(scope.row)"-->
                      <!--&gt;-->
                      <!--删除-->
                      <!--</el-button>-->
                      <!--<el-button-->
                      <!--type="text"-->
                      <!--@click="handleCopyToTag(scope.row)"-->
                      <!--&gt;-->
                      <!--复制-->
                      <!--</el-button>-->
                      <div :class="scope.row.myCollect ? 'el-icon-cc-star-fill': 'el-icon-cc-star'" @click="handleCollect(scope.row)"></div>
                      <!--<div v-else class="el-icon-cc-star"></div>-->
                  </el-button-group>
              </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
    export default {
        name: "MyCollect",
        data () {
            return {
                dataList: [],
                filter: {
                    pageNum: 1,
                    pageSize: 1000,
                    groupId: undefined
                },
                statusList: {
                    '1': '启用',
                    '2': '禁用'
                },
                dataSourceEnum: {},
                typeEnum: {},
                checkList: ['defineRemark']
            }
        },
        methods: {
            fetchData () {
                this.$service.collectTagsList().then(data => {
                    console.log(data)
                    this.dataList = data.data.pageInfo.list
                    this.dataSourceEnum = data.data.lableDataSourceEnum
                    this.typeEnum = data.data.tagsTypeEnum
                })
            },
            handleCheckListChange (val) {
                this.$service.saveListDimension({type: 4,behaviorShow: val.join(',')})
            }
        },
        created () {
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
</style>
