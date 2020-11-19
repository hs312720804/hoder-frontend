<template>
    <div class="hit-search-content">
        <div class="hit-search-header">
            <div style="width: 145px">
                ID类型
                <el-select :key="'hit_search_select_'+Math.random()" v-model="searchForm.type" class="small-input">
                    <el-option label="Mac地址" value="mac"></el-option>
                    <el-option label="openId" value="openId"></el-option>
                </el-select>
            </div>
            <div style="width: 118px">
                ID
                <el-input v-model="searchForm.value" class="small-input"></el-input>
            </div>
            <div>
                <el-button type="primary" size="mini" @click="handleSearch(id)">查询</el-button>
            </div>
        </div>
        <div v-if="showResult">
            <div>
                <span>相关标签</span><span>标签更新日期{{formatYesterdayDate()}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HitSearchItem",
        props: ['id'],
        data () {
            return {
                searchForm: {
                    type: undefined,
                    value: undefined
                },
                showResult: false
            }
        },
        methods: {
            handleSearch (id) {
                this.showResult = true
                console.log('id======',id)
            },
            formatYesterdayDate () {
                const yesterday = new Date().getTime() - 1*24*60*60*1000
                const time = new Date(yesterday)
                let y = time.getFullYear() // 年份
                let m = (time.getMonth() + 1).toString().padStart(2,'0') // 月份
                let r = time.getDate().toString().padStart(2,'0') // 日子
                return `${y}-${m}-${r}`
            }
        }
    }
</script>

<style lang="stylus" scoped>
.hit-search-content
    font-size 10px
.hit-search-header
    display flex
    width 350px
.small-input
    display inline-block
    width 100px
</style>
