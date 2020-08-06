<template>
    <div class="label-content">
        <el-tabs v-model="activeName">
            <el-tab-pane label="标签专区" name="labelZone">
                <label-zone></label-zone>
            </el-tab-pane>
            <el-tab-pane label="我的收藏" name="myCollect">
                <my-collect></my-collect>
            </el-tab-pane>
        </el-tabs>
        <div class="search-input">
            <el-input
                    v-model="searchVal"
                    placeholder="支持按标签名、Code、描述搜索"
                    clearable
            >
            </el-input>
            <i class="el-icon-cc-search icon-fixed" @click="handleSearch"></i>
        </div>
    </div>
</template>

<script>
    import labelZone from './LabelZone'
    import myCollect from './MyCollect'
    export default {
        name: "Index",
        components: {
            labelZone,
            myCollect
        },
        data () {
            return {
                activeName: 'labelZone',
                searchVal: ''
            }
        },
        methods: {
            handleSearch () {
                console.log('我在搜索')
            }
        }
    }
</script>

<style lang="stylus" scoped>
.label-content
    position relative
.search-input
    position absolute
    top 0
    right 10px
    width 20%
    .icon-fixed
        position absolute
        top 8px
        right 10px
</style>
