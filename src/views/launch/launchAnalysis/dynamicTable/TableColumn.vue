<template>
  <el-table-column :label="coloumnHeader.label" :prop="coloumnHeader.label" align="center">
    <template v-for="item in coloumnHeader.children">
      <tableColumn v-if="item.children && item.children.length" :key="item.id" :coloumn-header="item"></tableColumn>
      <el-table-column v-else :key="item.name" :label="item.label" :prop="item.prop">
        //悬浮展示详情
        <template slot-scope="scope">
          {{ scope.row[scope.column.property] }}

          <!-- <el-popover placement="top-start" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <el-button type="text" slot="reference">
            </el-button>
          </el-popover> -->
        </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'tableColumn',
  props: {
    coloumnHeader: {
      type: Object,
      required: true
    }
  }
}
</script>
