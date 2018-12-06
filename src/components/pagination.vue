<template>
    <div>
        <el-pagination @size-change="handlesizechange" @current-change="handlecurrentchange" 
            :current-page="currentpage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" 
            layout="total, sizes, prev, pager, next, jumper" :total="totalcount">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    props: ['currentpage', 'pagesize', 'totalcount'],
    methods: {
        handlesizechange(val){
          this.$emit("handle-size-change",val)
        },
        handlecurrentchange(val){
          this.$emit("handle-current-change",val)
        }
    }
}
</script>

