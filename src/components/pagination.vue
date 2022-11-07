<template>
    <div class="my-pagination">
        <el-pagination @size-change="handlesizechange" @current-change="handlecurrentchange"
            :current-page="currentpage" :page-sizes="[5, 10, 20, 30, 40, 50]" :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="totalcount" background>
        </el-pagination>
    </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: ['currentpage', 'pagesize', 'totalcount'],
  methods: {
    handlesizechange (val) {
      this.$emit('handle-size-change', val)
    },
    handlecurrentchange (val) {
      this.$emit('handle-current-change', val)
    }
  }
}
</script>
<style lang="stylus" scoped>
.my-pagination
  margin-top 10px
</style>
