<template>
  <div>
    <!-- tableData==={{ tableData }}
    <hr/>
    tableHeader==={{ tableHeader }} -->
    <el-table :data="tableData">
      <template v-for="(item, index) in tableHeader">
        <table-column
          v-if="item.children && item.children.length"
          :key="`${item.id}_${index}`"
          :coloumn-header="item"
        ></table-column>
        <el-table-column
          v-else
          :key="`${index}_${item.id}`"
          :label="item.label"
          :prop="item.prop"
        >
       </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import TableColumn from './TableColumn.vue'
export default {
  props: {
    // 表格的数据
    tableData: {
      type: Array,
      required: true
    },
    // 多级表头的数据
    tableHeader: {
      type: Array,
      required: true
    }
  },
  components: {
    TableColumn
  }
}
</script>

<style scoped>
.el-button{
  border: none;
  padding: 0;
  color: #606266;
}
</style>
